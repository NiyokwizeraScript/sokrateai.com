import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { YoutubeTranscript } from 'youtube-transcript';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Stripe webhook needs raw body for signature verification — register before json parser
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
app.post('/api/stripe-webhook', express.raw({ type: 'application/json' }), (req, res) => {
    if (!stripe || !stripeWebhookSecret) {
        res.status(503).json({ error: 'Stripe or webhook not configured' });
        return;
    }
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
    } catch (err) {
        res.status(400).send(`Webhook signature verification failed: ${err.message}`);
        return;
    }
    res.sendStatus(200); // respond quickly so Stripe doesn't retry
    (async () => {
        try {
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const uid = session.client_reference_id;
                const customerId = session.customer;
                if (uid && customerId && adminDb) {
                    await adminDb.collection('users').doc(uid).set(
                        { plan: 'pro', stripeCustomerId: customerId, updatedAt: new Date().toISOString() },
                        { merge: true }
                    );
                }
            } else if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
                const subscription = event.data.object;
                const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
                const status = subscription.status;
                if (event.type === 'customer.subscription.deleted' || status === 'canceled' || status === 'unpaid' || status === 'past_due') {
                    if (customerId && adminDb) {
                        const snap = await adminDb.collection('users').where('stripeCustomerId', '==', customerId).limit(1).get();
                        snap.docs.forEach(async (d) => {
                            await d.ref.update({ plan: 'free', updatedAt: new Date().toISOString() });
                        });
                    }
                }
            }
        } catch (e) {
            console.error('[Server] Stripe webhook handler error:', e);
        }
    })();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Anthropic Client (optional)
const anthropicApiKey = process.env.ANTHROPIC_API_KEY?.trim();
const anthropic = anthropicApiKey ? new Anthropic({ apiKey: anthropicApiKey }) : null;

// Initialize Gemini Client (optional) – use GEMINI_API_KEY (e.g. from Google AI Studio, often starts with AIza...)
const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
// Use a current model (2.0-flash no longer available to new users). Override in .env with GEMINI_MODEL_NAME if needed.
const GEMINI_MODEL = process.env.GEMINI_MODEL_NAME?.trim() || 'gemini-2.5-flash';
const GEMINI_VISION_MODEL = process.env.GEMINI_VISION_MODEL_NAME?.trim() || GEMINI_MODEL;

// Initialize Stripe Client (only when key is set - avoids crash in dev without Stripe)
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = stripeKey && stripeKey.startsWith('sk_')
    ? new Stripe(stripeKey)
    : null;

// Firebase Admin (for webhook to update user plan in Firestore)
let adminDb = null;
try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (serviceAccountJson) {
        const { default: admin } = await import('firebase-admin');
        const cred = JSON.parse(serviceAccountJson);
        if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.cert(cred) });
        adminDb = admin.firestore();
    }
} catch (e) {
    console.warn('[Server] Firebase Admin not configured:', e.message);
}

// Model ID - Haiku (Fallback)
const MODEL_ID = "claude-3-haiku-20240307";

// API Routes – all AI uses Gemini when GEMINI_API_KEY set, else Anthropic
app.post('/api/solve', async (req, res) => {
    if (!genAI && !anthropic) {
        return res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to .env' });
    }
    try {
        const { problem, fileContent, image } = req.body;
        console.log(`[Server] Solving problem... Image provided: ${!!image}`);

        const prompt = `You are Sokrate AI, a helpful and precise tutor. Solve the following problem step-by-step. If a file content is provided, use it as context.

Problem:
${problem}

${fileContent ? `Context File Content:\n${fileContent.substring(0, 20000)}` : ''}

Provide the solution in markdown format.`;

        let text = '';
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: image ? GEMINI_VISION_MODEL : GEMINI_MODEL });
            const parts = [{ text: prompt }];
            if (image && image.media_type && image.data) {
                parts.push({ inlineData: { mimeType: image.media_type, data: image.data } });
            }
            const result = await model.generateContent(parts);
            text = result.response?.text?.() ?? '';
        } else {
            const content = [{ type: "text", text: prompt }];
            if (image) {
                content.push({
                    type: "image",
                    source: { type: "base64", media_type: image.media_type, data: image.data }
                });
            }
            const msg = await anthropic.messages.create({
                model: MODEL_ID,
                max_tokens: 4096,
                messages: [{ role: "user", content }],
            });
            text = msg.content[0].text;
        }
        res.json({ solution: text });
    } catch (error) {
        console.error('[Server] AI Error:', error);
        res.status(500).json({ error: error.message || 'AI processing failed' });
    }
});

app.get('/api/subscription/onboarding-status', (req, res) => {
    res.json({ isNewUser: false, hasCompletedOnboarding: true });
});

app.get('/api/courses', (req, res) => {
    res.json([]);
});

// Quiz Generation Endpoint (Gemini or Anthropic)
app.post('/api/quiz/generate', async (req, res) => {
    if (!genAI && !anthropic) {
        return res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to .env' });
    }
    try {
        const { fileContent, image, difficulty, count } = req.body;
        console.log(`[Server] Generating Quiz... Image provided: ${!!image}`);

        const prompt = `Generate ${count} multiple-choice questions (difficulty: ${difficulty}) based strictly on the provided text or image.
Return a JSON array only, no markdown. Each item: { "id": number, "question": "...", "options": ["A","B","C","D"], "correct": 0 } (correct is index 0-3).

Text Content:
${fileContent ? fileContent.substring(0, 20000) : "No text provided. Use image or general knowledge."}
`;

        let rawText = '';
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: image ? GEMINI_VISION_MODEL : GEMINI_MODEL });
            const parts = [{ text: prompt }];
            if (image && image.media_type && image.data) {
                parts.push({ inlineData: { mimeType: image.media_type, data: image.data } });
            }
            const result = await model.generateContent(parts);
            rawText = result.response?.text?.() ?? '';
        } else {
            const content = [{ type: "text", text: prompt }];
            if (image) {
                content.push({
                    type: "image",
                    source: { type: "base64", media_type: image.media_type, data: image.data }
                });
            }
            const msg = await anthropic.messages.create({
                model: MODEL_ID,
                max_tokens: 4096,
                messages: [{ role: "user", content }],
            });
            rawText = msg.content[0].text;
        }
        const jsonStr = rawText.replace(/```json\n?|```/g, '').trim();
        const questions = JSON.parse(jsonStr);
        res.json({ questions: Array.isArray(questions) ? questions : [] });
    } catch (error) {
        console.error('[Server] Quiz Error:', error);
        res.status(500).json({ error: error.message || 'Quiz generation failed' });
    }
});

// MIME types Gemini accepts as inline documents (e.g. PDF). DOCX/Word must be extracted to text first.
const GEMINI_INLINE_DOCUMENT_TYPES = new Set(['application/pdf']);

// Synthesize Endpoint (uses Gemini if GEMINI_API_KEY set, else Anthropic)
app.post('/api/synthesize', async (req, res) => {
    try {
        let { fileContent, image, documentBase64, documentMimeType } = req.body;
        const hasDocument = !!(documentBase64 && documentMimeType);

        // DOCX/Word: Gemini doesn't support them inline — extract text and use as fileContent
        if (hasDocument && !GEMINI_INLINE_DOCUMENT_TYPES.has(documentMimeType)) {
            try {
                const buffer = Buffer.from(documentBase64, 'base64');
                const result = await mammoth.extractRawText({ buffer });
                const extracted = (result && result.value) ? result.value.trim() : '';
                fileContent = extracted ? `Document content:\n\n${extracted}` : (fileContent || 'No text extracted from document.');
                documentBase64 = null;
                documentMimeType = null;
            } catch (extractErr) {
                console.error('[Server] DOCX/text extraction failed:', extractErr);
                fileContent = (fileContent || '') + '\n[Could not extract text from document.]';
                documentBase64 = null;
                documentMimeType = null;
            }
        }

        const sendDocumentInline = !!(documentBase64 && documentMimeType);
        console.log(`[Server] Synthesizing... Image provided: ${!!image}, Document inline: ${sendDocumentInline}`);

        const prompt = `You are creating study notes from the user's content. Follow these rules strictly:

1. CONTENT: Use only the actual content from the attached document, image, or text. Never infer from the filename or title. No "Based on the document title" or similar.

2. VISUAL STYLE — write so it looks clean and easy to read, like a well-formatted document:
   - No unnecessary symbols: no "---", no "###" or "##" as decoration, no asterisks or dashes used as separators inside paragraphs. The reader should see clear text, not markdown clutter.
   - Headings: use only # for the main title, ## for main sections, ### for subsections. Put a blank line after every heading.
   - Paragraphs: use short paragraphs (2–4 sentences). Leave a blank line between paragraphs.
   - Lists: use simple bullets (one "- " per line). One bullet per line; never put several points in one line separated by * or •.
   - Spacing: add a blank line between sections so the page breathes. No walls of text.
   - Bold: use **only** for the occasional key term, not for whole lines.
   Write so the result looks like a clean, structured document with clear line breaks and paragraphs—no symbol soup.

3. Output only the notes. No intro line like "Here are your notes".

Text content (if any):
${fileContent ? fileContent.substring(0, 20000) : "No text provided."}
${sendDocumentInline ? "\nAn attached document is also provided; your notes must be based solely on its actual content, not its filename or title." : ""}
`;

        if (genAI) {
            const hasVisual = !!(image || sendDocumentInline);
            const model = genAI.getGenerativeModel({ model: hasVisual ? GEMINI_VISION_MODEL : GEMINI_MODEL });
            const parts = [{ text: prompt }];
            if (image && image.media_type && image.data) {
                parts.push({
                    inlineData: {
                        mimeType: image.media_type,
                        data: image.data
                    }
                });
            }
            if (sendDocumentInline) {
                parts.push({
                    inlineData: {
                        mimeType: documentMimeType,
                        data: documentBase64
                    }
                });
            }
            const result = await model.generateContent(parts);
            const text = result.response?.text?.() ?? '';
            return res.json({ synthesis: text });
        }

        if (anthropic) {
            const content = [{ type: "text", text: prompt }];
            if (image) {
                content.push({
                    type: "image",
                    source: {
                        type: "base64",
                        media_type: image.media_type,
                        data: image.data
                    }
                });
            }
            const msg = await anthropic.messages.create({
                model: MODEL_ID,
                max_tokens: 4096,
                messages: [{ role: "user", content: content }],
            });
            const text = msg.content[0].text;
            return res.json({ synthesis: text });
        }

        res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to your .env' });
    } catch (error) {
        console.error('[Server] Synthesis Error:', error);
        res.status(500).json({ error: error.message || 'Synthesis failed' });
    }
});

// Notes: chat with note context (Gemini or Anthropic)
app.post('/api/notes/chat', async (req, res) => {
    if (!genAI && !anthropic) {
        return res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to .env' });
    }
    try {
        const { noteContent, messages } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages required' });
        }
        const context = (noteContent || '').slice(0, 12000);
        const prompt = `You are a helpful tutor. Use the following notes as context to answer the user's questions. Be concise and accurate.

Notes:
${context}

User messages and your replies (last message is the new question):
${messages.map((m) => `${m.role}: ${m.content}`).join('\n')}

Reply as the assistant (only the new reply, no prefix).`;

        let reply = '';
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
            const result = await model.generateContent(prompt);
            reply = result.response?.text?.() ?? '';
        } else {
            const msg = await anthropic.messages.create({
                model: MODEL_ID,
                max_tokens: 2048,
                messages: [{ role: 'user', content: prompt }],
            });
            const textBlock = Array.isArray(msg.content) ? msg.content.find((b) => b.type === 'text') : null;
            reply = textBlock?.text ?? (msg.content?.[0]?.text ?? '');
        }
        if (!reply) {
            return res.status(502).json({ error: 'AI returned an empty reply.' });
        }
        res.json({ reply });
    } catch (error) {
        console.error('[Server] notes/chat Error:', error);
        res.status(500).json({ error: error?.message || 'Chat failed' });
    }
});

// Notes: generate quiz from note content (Gemini or Anthropic)
app.post('/api/notes/quiz', async (req, res) => {
    if (!genAI && !anthropic) {
        return res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to .env' });
    }
    try {
        const { noteContent } = req.body;
        const content = (noteContent || '').slice(0, 20000);
        const prompt = `Generate 5 multiple-choice questions based strictly on the following notes. Return a JSON array only, no markdown. Each item: { "id": 1, "question": "...", "options": ["A", "B", "C", "D"], "correct": 0 } (correct is index 0-3).

Notes:
${content}`;

        let rawText = '';
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
            const result = await model.generateContent(prompt);
            rawText = result.response?.text?.() ?? '';
        } else {
            const msg = await anthropic.messages.create({
                model: MODEL_ID,
                max_tokens: 2048,
                messages: [{ role: 'user', content: prompt }],
            });
            rawText = msg.content[0].text;
        }
        const text = rawText.replace(/```json\n?|```/g, '').trim();
        const questions = JSON.parse(text);
        res.json({ questions: Array.isArray(questions) ? questions : [] });
    } catch (error) {
        console.error('[Server] notes/quiz Error:', error);
        res.status(500).json({ error: error.message || 'Quiz failed' });
    }
});

// Helpers: extract YouTube video ID; fetch webpage text
function youtubeVideoId(url) {
    const u = url.trim();
    const be = u.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (be) return be[1];
    const m = u.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : null;
}
async function fetchPageText(pageUrl, maxChars = 80000) {
    const res = await fetch(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SokrateAI/1.0)' },
        signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`Page returned ${res.status}`);
    const html = await res.text();
    const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return stripped.slice(0, maxChars);
}

// Notes: process URL – fetch real content (YouTube transcript or webpage), then AI writes notes
app.post('/api/notes/process-url', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'url required' });
        }
        const isYoutube = /youtube\.com|youtu\.be/i.test(url);
        let title = isYoutube ? 'YouTube note' : 'Web page note';
        let sourceContent = '';
        let prompt = '';

        let noTranscript = false;
        if (isYoutube) {
            const videoId = youtubeVideoId(url);
            if (!videoId) {
                return res.status(400).json({ error: 'Invalid YouTube URL' });
            }
            try {
                const chunks = await YoutubeTranscript.fetchTranscript(videoId);
                sourceContent = chunks.map((c) => c.text).join(' ');
                if (!sourceContent.trim()) noTranscript = true;
            } catch (ytErr) {
                console.error('[Server] YouTube transcript Error:', ytErr);
                noTranscript = true;
            }
            if (noTranscript) {
                prompt = `The user shared this YouTube video link but no transcript could be fetched (captions may be disabled or unavailable). AI cannot watch or access video content from a URL directly.

Generate a short, helpful note template in markdown they can use while watching or after. Include:
- Source: [paste the link: ${url}]
- **Summary** (fill in after watching)
- **Key points** (bullets)
- **Quotes / definitions** (optional)
- **My notes / transcript paste** (space for them to paste transcript or their own notes)

Output only the markdown template, no apology or explanation.`;
            } else {
                prompt = `You are a study assistant. Below is the transcript from a YouTube video (Source: ${url}).

Turn this transcript into clear, structured study notes in markdown. Include:
- A short summary at the top
- Main points and key ideas as headings/bullets
- Important definitions or quotes if relevant
- Keep it concise but useful for revision.

Transcript:
${sourceContent.slice(0, 120000)}
`;
            }
        } else {
            try {
                sourceContent = await fetchPageText(url);
                if (!sourceContent.trim()) {
                    sourceContent = '(Could not extract text from this page.)';
                }
            } catch (fetchErr) {
                console.error('[Server] Fetch page Error:', fetchErr);
                return res.status(400).json({
                    error: 'Could not fetch the webpage. Check the URL or try again later.',
                });
            }
            prompt = `You are a study assistant. Below is text extracted from a webpage (Source: ${url}).

Turn this into clear, structured study notes in markdown. Include:
- A short summary at the top
- Main points and key ideas as headings/bullets
- Important facts or quotes
- Keep it concise but useful for revision.

Page content:
${sourceContent.slice(0, 120000)}
`;
        }

        if (!genAI && !anthropic) {
            return res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to your .env' });
        }

        let text = '';
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
            const result = await model.generateContent(prompt);
            text = result.response?.text?.() ?? '';
        } else {
            const msg = await anthropic.messages.create({
                model: MODEL_ID,
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }],
            });
            text = msg.content[0].text;
        }

        const content = text.trim() || `# Note from link\n\nSource: ${url}\n\n(No content could be generated.)`;
        res.json({ title, content });
    } catch (error) {
        console.error('[Server] process-url Error:', error);
        res.status(500).json({ error: error.message || 'Processing failed' });
    }
});

// Stripe Checkout Session Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to .env' });
    }
    try {
        const { lookup_key, user_id } = req.body;
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [{ price: lookup_key, quantity: 1 }],
            mode: 'subscription',
            client_reference_id: user_id || undefined,
            success_url: `${req.protocol}://${req.get('host')}/checkout-pro?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout-pro?canceled=true`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Catch-all handler for SPA (Must be last)
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Export for Vercel Serverless
export default app;

// Only listen if run directly (not imported as module)
const isMain = process.argv[1] && path.resolve(process.argv[1]) === __filename;
if (!process.env.VERCEL && isMain) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
