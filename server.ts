import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3000;

// Gemini client initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Endpoint for Decision Intelligence
app.post('/api/ai/analyze', async (req: Request, res: Response) => {
  const { mode, room } = req.body;

  if (!room) {
    return res.status(400).json({ error: 'Room data is required' });
  }

  if (ai) {
    try {
      let prompt = '';
      if (mode === 'recommendation') {
        prompt = `You are Commonroom's Decision Intelligence Copilot. Analyze this decision room and synthesize a structured recommendation based strictly on the logged data.
Title: "${room.title}"
Question: "${room.question}"
Context: "${room.context}"
Alternatives: ${JSON.stringify(room.alternatives || [])}
Evidence: ${JSON.stringify(room.evidence || [])}
Objections: ${JSON.stringify(room.objections || [])}

Provide your synthesis in valid JSON format matching:
{
  "title": "Synthesized Decision Recommendation",
  "recommendedAlt": "Name of best suited option",
  "reasons": ["Key reason 1 referencing logged evidence", "Key reason 2", "Key reason 3"],
  "risks": ["Residual risk 1 that must be tracked", "Residual risk 2"],
  "unresolvedCaveat": "Summary of any unresolved objections or required checks"
}
Output only raw JSON, no markdown backticks.`;
      } else if (mode === 'conflicts') {
        prompt = `Identify contradictory claims, opposing assumptions, or tensions between alternatives in this decision room:
Title: "${room.title}"
Context: "${room.context}"
Alternatives: ${JSON.stringify(room.alternatives || [])}
Evidence: ${JSON.stringify(room.evidence || [])}
Objections: ${JSON.stringify(room.objections || [])}
Arguments: ${JSON.stringify(room.arguments || [])}

Provide your response in valid JSON format:
{
  "title": "Contradictory Claims & Disagreements",
  "items": [
    {
      "claimA": "Perspective or assumption with stakeholder attribution",
      "claimB": "Counter argument or contradictory finding"
    }
  ]
}
Output only raw JSON, no markdown backticks.`;
      } else if (mode === 'missing') {
        prompt = `Analyze this decision room for unvalidated claims, missing data, or lack of evidence:
Title: "${room.title}"
Alternatives: ${JSON.stringify(room.alternatives || [])}
Evidence: ${JSON.stringify(room.evidence || [])}
Objections: ${JSON.stringify(room.objections || [])}

Provide your response in valid JSON format:
{
  "title": "Missing Evidence & Validation Gaps",
  "items": [
    "Specific gap or unproven assumption 1",
    "Specific gap or unproven assumption 2",
    "Specific gap or unproven assumption 3"
  ]
}
Output only raw JSON, no markdown backticks.`;
      } else {
        prompt = `Summarize the current state of this decision room debate concisely:
Title: "${room.title}"
Question: "${room.question}"
Alternatives: ${JSON.stringify(room.alternatives || [])}
Evidence: ${JSON.stringify(room.evidence || [])}
Objections: ${JSON.stringify(room.objections || [])}

Provide your response in valid JSON format:
{
  "title": "Executive Discussion Summary",
  "content": "2-3 paragraphs explaining the current stance, key trade-offs, and where the team stands."
}
Output only raw JSON, no markdown backticks.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.warn('Gemini API call failed, client will use deterministic engine:', err?.message || err);
      return res.status(500).json({ error: 'AI analysis unavailable', fallback: true });
    }
  }

  // If no API key configured, signal client to use its local deterministic engine
  return res.status(503).json({ error: 'No API key configured', fallback: true });
});

async function start() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Commonroom server running on http://0.0.0.0:${PORT}`);
  });
}

start();
