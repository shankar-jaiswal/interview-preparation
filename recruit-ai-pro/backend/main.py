import json
import os
from typing import List, Literal, Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel, Field

BASE_DIR = os.path.dirname(__file__)
load_dotenv(os.path.join(BASE_DIR, ".env"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
CLIENT_ORIGIN = os.getenv("CLIENT_ORIGIN", "http://localhost:5173")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

app = FastAPI(title="Recruit AI Pro Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        CLIENT_ORIGIN,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=GROQ_API_KEY)


class HistoryItem(BaseModel):
    type: Literal["bot", "user"]
    text: str


class InterviewRequest(BaseModel):
    role: str = "Fullstack Engineer"
    difficulty: str = "Intermediate"
    questionCount: int = 5
    history: List[HistoryItem] = Field(default_factory=list)
    answer: str = ""
    isFirst: bool = False
    roundNumber: int = 1


class Feedback(BaseModel):
    score: int
    strengths: List[str]
    improvements: List[str]
    analysis: str


class InterviewResponse(BaseModel):
    feedback: Optional[Feedback] = None
    nextQuestion: str
    isFinished: bool


def safe_json_parse(text: str) -> dict:
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        cleaned = text.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)


@app.get("/api/health")
async def health():
    return {
        "ok": True,
        "model": GROQ_MODEL,
        "has_key": bool(GROQ_API_KEY),
    }


@app.post("/api/interview", response_model=InterviewResponse)
async def interview(payload: InterviewRequest):
    if not GROQ_API_KEY:
        raise HTTPException(status_code=500, detail="Missing GROQ_API_KEY in backend/.env")

    transcript = "\n".join(
        f'{"Interviewer" if item.type == "bot" else "Candidate"}: {item.text}'
        for item in payload.history
    )

    system_prompt = f"""
You are a senior technical interviewer.
You are interviewing for the role: {payload.role}.
The level is: {payload.difficulty}.
The full interview should contain {payload.questionCount} rounds.
The current round is {payload.roundNumber}.

Rules:
- Ask one question at a time.
- Keep questions realistic and role-specific.
- When evaluating an answer, be clear, fair, and practical.
- Return ONLY valid JSON.

JSON format:
{{
  "feedback": null OR {{
    "score": number,
    "strengths": ["string", "string"],
    "improvements": ["string", "string"],
    "analysis": "short paragraph"
  }},
  "nextQuestion": "string",
  "isFinished": boolean
}}
""".strip()

    if payload.isFirst:
        user_prompt = (
            "Start the interview now. Give a short professional greeting and then "
            "ask the first interview question."
        )
    else:
        user_prompt = (
            f"Here is the transcript so far:\n{transcript}\n\n"
            f"Candidate's latest answer:\n{payload.answer}\n\n"
            f"Evaluate the answer. If round {payload.roundNumber} is the last round, "
            f"set isFinished to true. Otherwise set isFinished to false and give the next question."
        )

    try:
        print("Using Groq model:", GROQ_MODEL)

        completion = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.7,
            response_format={"type": "json_object"},
        )

        text = completion.choices[0].message.content

        if not text:
            raise HTTPException(status_code=500, detail="Groq returned an empty response.")

        parsed = safe_json_parse(text)
        return parsed

    except HTTPException:
        raise
    except Exception as e:
        print("BACKEND ERROR:", repr(e))
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")