import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  }
}

app.post('/api/interview', async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY in server/.env' });
    }

    const {
      role = 'Fullstack Engineer',
      difficulty = 'Intermediate',
      questionCount = 5,
      history = [],
      answer = '',
      isFirst = false,
      roundNumber = 1
    } = req.body;

    const transcript = history
      .map((item) => `${item.type === 'bot' ? 'Interviewer' : 'Candidate'}: ${item.text}`)
      .join('\n');

    const systemPrompt = `
You are a senior technical interviewer.
You are interviewing for the role: ${role}.
The level is: ${difficulty}.
The full interview should contain ${questionCount} rounds.
The current round is ${roundNumber}.

Rules:
- Ask one question at a time.
- Keep questions realistic and role-specific.
- When evaluating an answer, be clear, fair, and practical.
- Return ONLY valid JSON.

JSON format:
{
  "feedback": null OR {
    "score": number,
    "strengths": ["string", "string"],
    "improvements": ["string", "string"],
    "analysis": "short paragraph"
  },
  "nextQuestion": "string",
  "isFinished": boolean
}
`;

    const userPrompt = isFirst
      ? 'Start the interview now. Give a short professional greeting and then ask the first interview question.'
      : `Here is the transcript so far:\n${transcript}\n\nCandidate's latest answer:\n${answer}\n\nEvaluate the answer. If round ${roundNumber} is the last round, set isFinished to true. Otherwise set isFinished to false and give the next question.`;

    console.log('Using Gemini model:', GEMINI_MODEL);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            {
              parts: [{ text: userPrompt }]
            }
          ],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(500).json({ error: `Gemini request failed: ${errorText}` });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: 'Gemini returned an empty response.' });
    }

    const parsed = safeJsonParse(text);
    return res.json(parsed);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error while generating interview step.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});