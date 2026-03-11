import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchTranscript } from 'youtube-transcript-plus';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';
import { parseOffice } from 'officeparser';

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
// Gemini models - Pro for high-quality note generation, Flash for quick tasks
// gemini-2.5-pro provides better depth, structure, and academic quality for study notes
const GEMINI_MODEL = process.env.GEMINI_MODEL_NAME?.trim() || 'gemini-2.5-pro';
const GEMINI_VISION_MODEL = process.env.GEMINI_VISION_MODEL_NAME?.trim() || 'gemini-2.5-pro';
const GEMINI_FAST_MODEL = process.env.GEMINI_FAST_MODEL_NAME?.trim() || 'gemini-2.5-flash';

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

IMPORTANT: Detect the language of the provided content and generate ALL questions and options in the SAME LANGUAGE. Do NOT translate to English.

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

// MIME types Gemini accepts as inline documents (e.g. PDF). Others must be extracted to text first.
const GEMINI_INLINE_DOCUMENT_TYPES = new Set(['application/pdf']);

// MIME types that officeparser supports (PPTX, XLSX, ODP, ODS, ODT, RTF). DOCX/DOC use mammoth.
const OFFICEPARSER_MIME_TYPES = new Set([
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/vnd.oasis.opendocument.presentation', // .odp
    'application/vnd.oasis.opendocument.spreadsheet', // .ods
    'application/vnd.oasis.opendocument.text', // .odt
    'application/rtf', 'text/rtf',
]);

// Synthesize Endpoint (uses Gemini if GEMINI_API_KEY set, else Anthropic)
app.post('/api/synthesize', async (req, res) => {
    try {
        let { fileContent, image, documentBase64, documentMimeType } = req.body;
        const hasDocument = !!(documentBase64 && documentMimeType);

        if (hasDocument && !GEMINI_INLINE_DOCUMENT_TYPES.has(documentMimeType)) {
            const buffer = Buffer.from(documentBase64, 'base64');
            try {
                let extracted = '';
                if (OFFICEPARSER_MIME_TYPES.has(documentMimeType)) {
                    const ast = await parseOffice(buffer);
                    extracted = (ast && typeof ast.toText === 'function' ? ast.toText() : '').trim();
                } else {
                    // DOCX/DOC: use mammoth
                    const result = await mammoth.extractRawText({ buffer });
                    extracted = (result && result.value) ? result.value.trim() : '';
                }
                fileContent = extracted ? `Document content:\n\n${extracted}` : (fileContent || 'No text extracted from document.');
                documentBase64 = null;
                documentMimeType = null;
            } catch (extractErr) {
                console.error('[Server] Document text extraction failed:', extractErr);
                fileContent = (fileContent || '') + '\n[Could not extract text from document.]';
                documentBase64 = null;
                documentMimeType = null;
            }
        }

        const sendDocumentInline = !!(documentBase64 && documentMimeType);
        console.log(`[Server] Synthesizing... Image provided: ${!!image}, Document inline: ${sendDocumentInline}`);

        const prompt = `You are creating premium, exam-ready study notes from the user's content. Follow these rules strictly:

## LANGUAGE RULES (CRITICAL)
- DETECT the language of the source content (document, image, or text)
- GENERATE all notes in the SAME LANGUAGE as the source content
- Do NOT translate to English unless the source is already in English
- Preserve all technical terms, proper nouns, and domain-specific vocabulary in the original language
- If the source contains multiple languages, use the predominant language for the notes

## CONTENT RULES
- Use ONLY the actual content from the attached document, image, or text
- Never infer from filename or title. No "Based on the document title" or similar
- Extract key concepts, definitions, formulas, and examples from the source material

## IMAGE HANDLING (if document contains images, diagrams, charts, or figures)
- DESCRIBE each relevant image/diagram/figure when it appears in the content
- Use this format for images: **[📊 Figure: Description]** or **[📷 Image: Description]**
- Include what the image shows and why it's important for understanding
- Place image descriptions in the appropriate section near related explanations
- For diagrams/charts: describe the key data, relationships, or processes shown
- For photos/illustrations: describe what is depicted and its relevance to the topic
- Example: **[📊 Figure: Diagram showing the electron transport chain with proteins I-IV and ATP synthase]**

## STRUCTURE (use these sections as appropriate to the content):
1. Start with a clear **# Main Title** (with relevant emoji, e.g. "# 📐 Stoichiometry Essentials")
2. **## Brief Overview** — 2-3 sentences summarizing what this covers and why it matters
3. **## Key Points** — bullet list of the most important takeaways
4. **## Definitions** — use blockquotes for key terms:
   > **Term**: Definition here
5. **## Detailed Explanation** — thorough breakdown of concepts with subsections (### ) as needed
   - Include **[📊 Figure: ...]** descriptions where images appear in the source
6. **## Worked Example** (if applicable) — step-by-step walkthrough with:
   - Problem statement
   - Numbered steps using "1. ", "2. ", etc.
   - Clear solution/answer
7. **## Summary** — brief recap of main points
8. **## Exam Tips** (if applicable) — quick tips for remembering or applying this material

## FORMATTING RULES
- Headings: # for title, ## for sections, ### for subsections. Always blank line after headings.
- Use **bold** for key terms (sparingly, only important words)
- Use blockquotes (>) for definitions and important callouts
- Use bullet points (- ) for lists, one item per line
- Use numbered lists (1. 2. 3.) for sequential steps
- For math/equations: write clearly on own line, e.g. "2C₄H₁₀ + 13O₂ → 8CO₂ + 10H₂O"
- Add blank lines between sections for readability
- Keep paragraphs short (2-4 sentences)
- Academic tone: clear, professional, not childish

## OUTPUT
- Output only the markdown notes IN THE SAME LANGUAGE AS THE SOURCE
- No intro like "Here are your notes"
- Make notes detailed enough for exam revision but scannable
- If content has formulas/equations, format them clearly
- Include image/figure descriptions where relevant

Text content (if any):
${fileContent ? fileContent.substring(0, 20000) : "No text provided."}
${sendDocumentInline ? "\nAn attached document is also provided. Your notes must be based solely on its actual content (including any images, diagrams, or figures). Describe relevant visuals where they appear." : ""}
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

// Voice recording: send audio directly to Gemini; Gemini transcribes and generates structured notes in one call
const GEMINI_AUDIO_MODEL = process.env.GEMINI_AUDIO_MODEL_NAME?.trim() || 'gemini-2.5-pro';

app.post('/api/notes/from-recording', async (req, res) => {
    try {
        const { audioBase64, mimeType } = req.body || {};
        if (!audioBase64 || typeof audioBase64 !== 'string') {
            return res.status(400).json({ error: 'audioBase64 required' });
        }
        if (!genAI) {
            return res.status(503).json({ error: 'Voice recording requires GEMINI_API_KEY. Add it to your .env.' });
        }

        const prompt = `Transcribe this audio and generate premium, exam-ready study notes. Follow these rules:

## LANGUAGE RULES (CRITICAL)
- DETECT the language being spoken in the audio
- TRANSCRIBE and GENERATE all notes in the SAME LANGUAGE as the audio
- Do NOT translate to English unless the speaker is already speaking English
- Preserve all technical terms, proper nouns, and domain-specific vocabulary in the original language
- If the speaker uses multiple languages, use the predominant language for the notes

## CONTENT RULES
- Use ONLY what is actually spoken in the audio. Do not invent or infer content.
- Extract key concepts, definitions, formulas, and examples mentioned.

## STRUCTURE (use sections as appropriate):
1. **# Main Title** — descriptive title with relevant emoji (e.g. "# 🎓 Lecture Notes: [Topic]")
2. **## Brief Overview** — 2-3 sentences summarizing the recording content
3. **## Key Points** — bullet list of main takeaways
4. **## Definitions** — use blockquotes for key terms:
   > **Term**: Definition here
5. **## Detailed Notes** — organized breakdown with subsections (###) as needed
6. **## Worked Example** (if any examples were discussed) — step-by-step format
7. **## Summary** — brief recap
8. **## Exam Tips** (if applicable)

## FORMATTING RULES
- Headings: # for title, ## for sections, ### for subsections. Blank line after headings.
- **Bold** for key terms only (sparingly)
- Blockquotes (>) for definitions and callouts
- Bullet points (- ) for lists
- Numbered lists (1. 2. 3.) for sequential steps
- Math/equations: write clearly, e.g. "E = mc²"
- Blank lines between sections
- Short paragraphs (2-4 sentences)
- Academic tone: clear, professional

## OUTPUT
- Output only markdown notes IN THE SAME LANGUAGE AS THE AUDIO
- No intro like "Here are your notes"
- Make notes detailed for revision but scannable`;

        const model = genAI.getGenerativeModel({ model: GEMINI_AUDIO_MODEL });
        const audioMime = mimeType && mimeType.startsWith('audio/') ? mimeType : 'audio/webm';
        const result = await model.generateContent([
            { text: prompt },
            {
                inlineData: {
                    mimeType: audioMime,
                    data: audioBase64,
                },
            },
        ]);
        const content = result.response?.text?.() ?? '';
        if (!content.trim()) {
            return res.status(400).json({ error: 'No content generated. The recording may be inaudible or unsupported.' });
        }
        res.json({ title: 'Voice recording', content });
    } catch (error) {
        console.error('[Server] from-recording Error:', error);
        res.status(500).json({ error: error?.message || 'Transcription or note generation failed' });
    }
});

// Notes: generate notes from a web link (non-YouTube)
app.post('/api/notes/from-link', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'url required' });
        }

        // Block YouTube links - use process-url for those
        if (/youtube\.com|youtu\.be/i.test(url)) {
            return res.status(400).json({ error: 'YouTube links are not supported with this feature.' });
        }

        if (!genAI && !anthropic) {
            return res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to your .env' });
        }

        // Fetch webpage content
        let pageContent = '';
        try {
            const fetchRes = await fetch(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SokrateAI/1.0)' },
                signal: AbortSignal.timeout(15000),
            });
            if (!fetchRes.ok) {
                return res.status(400).json({ error: `Could not fetch the webpage (status ${fetchRes.status}). Check the URL.` });
            }
            const html = await fetchRes.text();
            pageContent = html
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .replace(/<style[\s\S]*?<\/style>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 80000);
        } catch (fetchErr) {
            console.error('[Server] from-link fetch error:', fetchErr);
            return res.status(400).json({ error: 'Could not fetch the webpage. Check the URL or try again later.' });
        }

        if (!pageContent.trim()) {
            return res.status(400).json({ error: 'No readable content found on this page.' });
        }

        // Extract a title from the URL for the note
        let title = 'Web page note';
        try {
            const urlObj = new URL(url);
            title = urlObj.hostname.replace(/^www\./, '');
        } catch {}

        const prompt = `You are creating premium, exam-ready study notes from a webpage (Source: ${url}).

## LANGUAGE RULES (CRITICAL)
- DETECT the language of the webpage content
- GENERATE all notes in the SAME LANGUAGE as the webpage
- Do NOT translate to English unless the webpage is already in English
- Preserve all technical terms, proper nouns, and domain-specific vocabulary in the original language
- If the page contains multiple languages, use the predominant language for the notes

## CONTENT RULES
- Use ONLY the actual content from the page. Focus on the main article/information.
- Extract key concepts, definitions, facts, and examples.

## STRUCTURE (use sections as appropriate):
1. **# Main Title** — descriptive title with relevant emoji (e.g. "# 🔬 [Topic Name]")
2. **## Brief Overview** — 2-3 sentences on what this covers and why it matters
3. **## Key Points** — bullet list of main takeaways
4. **## Definitions** — use blockquotes for key terms:
   > **Term**: Definition here
5. **## Detailed Explanation** — thorough breakdown with subsections (###) as needed
6. **## Examples** (if applicable) — concrete examples from the content
7. **## Summary** — brief recap of main points
8. **## Exam Tips** (if applicable) — tips for remembering/applying this

## FORMATTING RULES
- Headings: # for title, ## for sections, ### for subsections. Blank line after headings.
- **Bold** for key terms only (sparingly)
- Blockquotes (>) for definitions and important callouts
- Bullet points (- ) for lists
- Numbered lists (1. 2. 3.) for sequential steps
- Math/equations: write clearly on own line
- Blank lines between sections
- Short paragraphs (2-4 sentences)
- Academic tone: clear, professional, not childish

## OUTPUT
- Output only markdown notes IN THE SAME LANGUAGE AS THE WEBPAGE
- No intro like "Here are your notes"
- Make notes detailed for exam revision but scannable
- Include source link at the end: "Source: [${url}](${url})"

Page content:
${pageContent}`;

        let content = '';
        if (genAI) {
            const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
            const result = await model.generateContent(prompt);
            content = result.response?.text?.() ?? '';
        } else {
            const msg = await anthropic.messages.create({
                model: MODEL_ID,
                max_tokens: 4096,
                messages: [{ role: 'user', content: prompt }],
            });
            content = msg.content[0].text;
        }

        if (!content.trim()) {
            return res.status(500).json({ error: 'No notes could be generated from this page.' });
        }

        res.json({ title, content: content.trim() });
    } catch (error) {
        console.error('[Server] from-link Error:', error);
        res.status(500).json({ error: error?.message || 'Note generation failed' });
    }
});

// Notes: chat with note context (Gemini or Anthropic). Supports optional attachments: text, image, PDF/DOC.
app.post('/api/notes/chat', async (req, res) => {
    if (!genAI && !anthropic) {
        return res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to .env' });
    }
    try {
        let { noteContent, messages, attachedFileContent, image, documentBase64, documentMimeType } = req.body;
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages required' });
        }
        attachedFileContent = attachedFileContent || '';
        if (documentBase64 && documentMimeType && !GEMINI_INLINE_DOCUMENT_TYPES.has(documentMimeType)) {
            try {
                const buffer = Buffer.from(documentBase64, 'base64');
                let extracted = '';
                if (OFFICEPARSER_MIME_TYPES.has(documentMimeType)) {
                    const ast = await parseOffice(buffer);
                    extracted = (ast && typeof ast.toText === 'function' ? ast.toText() : '').trim();
                } else {
                    const result = await mammoth.extractRawText({ buffer });
                    extracted = (result && result.value) ? result.value.trim() : '';
                }
                attachedFileContent = (attachedFileContent ? attachedFileContent + '\n\n' : '') + (extracted || '[Could not extract text from document.]');
                documentBase64 = null;
                documentMimeType = null;
            } catch (extractErr) {
                console.error('[Server] notes/chat document extraction failed:', extractErr);
                attachedFileContent = (attachedFileContent || '') + '\n[Could not extract text from document.]';
                documentBase64 = null;
                documentMimeType = null;
            }
        }
        const hasInlineDoc = !!(documentBase64 && documentMimeType);
        const context = (noteContent || '').slice(0, 12000);
        const attachmentBlock = attachedFileContent ? `\nAttached document/content (use this to answer if relevant):\n${attachedFileContent.slice(0, 15000)}\n` : '';
        const prompt = `You are a helpful tutor. Use the following notes as context to answer the user's questions. Be concise and accurate.

Notes:
${context}
${attachmentBlock}

User messages and your replies (last message is the new question):
${messages.map((m) => `${m.role}: ${m.content}`).join('\n')}

Reply as the assistant (only the new reply, no prefix).`;

        let reply = '';
        if (genAI) {
            const hasVisual = !!(image?.media_type && image?.data) || hasInlineDoc;
            const model = genAI.getGenerativeModel({ model: hasVisual ? GEMINI_VISION_MODEL : GEMINI_MODEL });
            const parts = [{ text: prompt }];
            if (image?.media_type && image?.data) {
                parts.push({ inlineData: { mimeType: image.media_type, data: image.data } });
            }
            if (hasInlineDoc) {
                parts.push({ inlineData: { mimeType: documentMimeType, data: documentBase64 } });
            }
            const result = await model.generateContent(parts);
            reply = result.response?.text?.() ?? '';
        } else {
            const content = [{ type: 'text', text: prompt }];
            if (image?.media_type && image?.data) {
                content.push({ type: 'image', source: { type: 'base64', media_type: image.media_type, data: image.data } });
            }
            const msg = await anthropic.messages.create({
                model: MODEL_ID,
                max_tokens: 2048,
                messages: [{ role: 'user', content }],
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
        const prompt = `Generate 5 multiple-choice questions based strictly on the following notes.

IMPORTANT: Detect the language of the notes and generate ALL questions and options in the SAME LANGUAGE. Do NOT translate to English.

Return a JSON array only, no markdown. Each item: { "id": 1, "question": "...", "options": ["A", "B", "C", "D"], "correct": 0 } (correct is index 0-3).

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

// Notes: generate flashcards from note content
app.post('/api/notes/flashcards', async (req, res) => {
    if (!genAI && !anthropic) {
        return res.status(503).json({ error: 'Add GEMINI_API_KEY or ANTHROPIC_API_KEY to .env' });
    }
    try {
        const { noteContent } = req.body;
        const content = (noteContent || '').slice(0, 20000);
        const prompt = `Generate 8–12 flashcards from the following notes.

IMPORTANT: Detect the language of the notes and generate ALL flashcards in the SAME LANGUAGE. Do NOT translate to English.

Return a JSON array only, no markdown. Each item: { "front": "term or question", "back": "definition or answer" }. Keep front and back concise (one short sentence each).

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
        const cards = JSON.parse(text);
        res.json({ cards: Array.isArray(cards) ? cards : [] });
    } catch (error) {
        console.error('[Server] notes/flashcards Error:', error);
        res.status(500).json({ error: error.message || 'Flashcards failed' });
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

// YouTube transcript with fallbacks: try default, then common languages (en, en-US, en-GB). Uses a real browser user-agent to reduce blocks.
const YT_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
async function fetchYoutubeTranscript(videoId) {
    const configs = [
        { userAgent: YT_USER_AGENT },
        { userAgent: YT_USER_AGENT, lang: 'en' },
        { userAgent: YT_USER_AGENT, lang: 'en-US' },
        { userAgent: YT_USER_AGENT, lang: 'en-GB' },
    ];
    for (const config of configs) {
        try {
            const chunks = await fetchTranscript(videoId, config);
            if (chunks?.length && chunks.some((c) => c.text?.trim())) {
                return chunks.map((c) => c.text).join(' ');
            }
        } catch (err) {
            console.error('[Server] YouTube transcript attempt:', config.lang || 'default', err.message);
        }
    }
    return null;
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
            sourceContent = await fetchYoutubeTranscript(videoId) ?? '';
            if (!sourceContent.trim()) noTranscript = true;
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
// Use STRIPE_PRICE_ID (from env) for the price — must be a price from the same Stripe account/mode as STRIPE_SECRET_KEY (e.g. live price for live keys).
app.post('/api/create-checkout-session', async (req, res) => {
    if (!stripe) {
        return res.status(503).json({ error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to .env' });
    }
    // Price from server env STRIPE_PRICE_ID or from client (VITE_STRIPE_PRICE_ID sent as lookup_key at build time)
    const priceId = (process.env.STRIPE_PRICE_ID || req.body?.lookup_key || '').trim();
    if (!priceId || !priceId.startsWith('price_')) {
        return res.status(503).json({
            error: 'Stripe price not configured. In Vercel, set VITE_STRIPE_PRICE_ID (or STRIPE_PRICE_ID) to your live Stripe Price ID (Dashboard → Live mode → create Price → copy the price_... ID). Redeploy after adding the env var.',
        });
    }
    try {
        const { user_id } = req.body || {};
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [{ price: priceId, quantity: 1 }],
            mode: 'subscription',
            client_reference_id: user_id || undefined,
            success_url: `${req.protocol}://${req.get('host')}/checkout-pro?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout-pro?canceled=true`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.error("Stripe Error:", error);
        const isNoSuchPrice = error?.code === 'resource_missing' && error?.param === 'line_items[0][price]';
        const message = isNoSuchPrice
            ? `No such price: '${priceId}'. Use a Price ID from the same Stripe account and mode (Live/Test) as your STRIPE_SECRET_KEY. In Dashboard, turn Test mode OFF for Live, then Products → your product → copy Price ID. Ensure STRIPE_PRICE_ID has no extra quotes or spaces.`
            : error.message;
        res.status(500).json({ error: message });
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
