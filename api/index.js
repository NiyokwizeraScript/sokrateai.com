import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Anthropic Client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Stripe Client (only when key is set - avoids crash in dev without Stripe)
const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = stripeKey && stripeKey.startsWith('sk_')
    ? new Stripe(stripeKey)
    : null;

// Model ID - Haiku (Fallback)
const MODEL_ID = "claude-3-haiku-20240307";

// API Routes
app.post('/api/solve', async (req, res) => {
    try {
        const { problem, fileContent, image } = req.body;

        console.log(`[Server] Solving problem... Image provided: ${!!image}`);

        const prompt = `You are Sokrate AI, a helpful and precise tutor. Solve the following problem step-by-step. If a file content is provided, use it as context.

Problem:
${problem}

${fileContent ? `Context File Content:\n${fileContent.substring(0, 20000)}` : ''}

Provide the solution in markdown format.`;

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

        // @ts-ignore
        const text = msg.content[0].text;
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

// Quiz Generation Endpoint
app.post('/api/quiz/generate', async (req, res) => {
    try {
        const { fileContent, image, difficulty, count } = req.body;
        console.log(`[Server] Generating Quiz... Image provided: ${!!image}`);

        const prompt = `Generate ${count} multiple-choice questions (difficulty: ${difficulty}) based strictly on the provided text or image.
        
        Return a JSON array... (same format) ...

        Text Content:
        ${fileContent ? fileContent.substring(0, 20000) : "No text provided. Use image or general knowledge."}
        `;

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
        // Clean up potential markdown code blocks
        const jsonStr = text.replace(/```json\n?|```/g, '').trim();
        const questions = JSON.parse(jsonStr);

        res.json({ questions });

    } catch (error) {
        console.error('[Server] Quiz Error:', error);
        res.status(500).json({ error: error.message || 'Quiz generation failed' });
    }
});

// Synthesize Endpoint
app.post('/api/synthesize', async (req, res) => {
    try {
        const { fileContent, image } = req.body;
        console.log(`[Server] Synthesizing... Image provided: ${!!image}`);

        const prompt = `Analyze and synthesize the provided content (text or image).
        Provide a structured summary...
        
        Text Content:
        ${fileContent ? fileContent.substring(0, 20000) : "No text provided."}
        `;

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

        // @ts-ignore
        const text = msg.content[0].text;
        res.json({ synthesis: text });

    } catch (error) {
        console.error('[Server] Synthesis Error:', error);
        res.status(500).json({ error: error.message || 'Synthesis failed' });
    }
});

// Notes: chat with note context
app.post('/api/notes/chat', async (req, res) => {
    try {
        if (!process.env.ANTHROPIC_API_KEY?.trim()) {
            return res.status(503).json({ error: 'AI is not configured. Add ANTHROPIC_API_KEY to your server environment.' });
        }
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
        const msg = await anthropic.messages.create({
            model: MODEL_ID,
            max_tokens: 2048,
            messages: [{ role: 'user', content: prompt }],
        });
        const textBlock = Array.isArray(msg.content) ? msg.content.find((b) => b.type === 'text') : null;
        const reply = textBlock?.text ?? (msg.content?.[0]?.text ?? '');
        if (!reply) {
            console.warn('[Server] notes/chat: no text in response', msg.content);
            return res.status(502).json({ error: 'AI returned an empty reply.' });
        }
        res.json({ reply });
    } catch (error) {
        console.error('[Server] notes/chat Error:', error);
        const message = error?.message || 'Chat failed';
        res.status(500).json({ error: message });
    }
});

// Notes: generate quiz from note content
app.post('/api/notes/quiz', async (req, res) => {
    try {
        const { noteContent } = req.body;
        const content = (noteContent || '').slice(0, 20000);
        const prompt = `Generate 5 multiple-choice questions based strictly on the following notes. Return a JSON array only, no markdown. Each item: { "id": 1, "question": "...", "options": ["A", "B", "C", "D"], "correct": 0 } (correct is index 0-3).

Notes:
${content}`;
        const msg = await anthropic.messages.create({
            model: MODEL_ID,
            max_tokens: 2048,
            messages: [{ role: 'user', content: prompt }],
        });
        const text = msg.content[0].text.replace(/```json\n?|```/g, '').trim();
        const questions = JSON.parse(text);
        res.json({ questions: Array.isArray(questions) ? questions : [] });
    } catch (error) {
        console.error('[Server] notes/quiz Error:', error);
        res.status(500).json({ error: error.message || 'Quiz failed' });
    }
});

// Notes: process URL (YouTube or website) – returns title + content for client to save as note
app.post('/api/notes/process-url', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: 'url required' });
        }
        const isYoutube = /youtube\.com|youtu\.be/i.test(url);
        const title = isYoutube ? 'YouTube note' : 'Web page note';
        const prompt = isYoutube
            ? `The user provided this YouTube or video link: ${url}. Since we do not have transcript extraction yet, generate a short structured note template they can fill: "Source: [link]. Add key points, summary, or paste transcript below." Return only the note content in markdown.`
            : `The user provided this URL: ${url}. Generate a short note template: "Source: [link]. Summary or key points (add below)." Return only the note content in markdown.`;
        const msg = await anthropic.messages.create({
            model: MODEL_ID,
            max_tokens: 1024,
            messages: [{ role: 'user', content: prompt }],
        });
        const text = msg.content[0].text;
        res.json({ title, content: text || `# Note from link\n\nSource: ${url}\n\nAdd your content below.` });
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
        const { lookup_key } = req.body;
        // If coming from form, lookup_key is in body.

        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: lookup_key,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${req.protocol}://${req.get('host')}/checkout-pro?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout-pro?canceled=true`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.error("Stripe Error:", error);
        // Expose error for debugging
        res.status(500).json({ error: error.message, stack: error.stack });
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
