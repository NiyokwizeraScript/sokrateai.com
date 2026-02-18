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

// Initialize Stripe Client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

// Stripe Checkout Session Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
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
if (process.env.NODE_ENV !== 'production' || require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}
