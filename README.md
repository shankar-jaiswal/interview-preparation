# Recruit AI Pro

Recruit AI Pro is an AI-powered mock interview application built with React, Vite, FastAPI, Firebase, and Groq.

It allows users to:
- choose a target role
- choose difficulty level
- run a multi-step interview simulation
- receive structured AI feedback
- store session history in Firebase
- optionally read questions aloud using text-to-speech

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- Database/Auth: Firebase Authentication + Firestore
- AI Model: Groq API
- Styling: Tailwind CSS

## Project Structure

```text
recruit-ai-pro/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── .env.example
├── .gitignore
├── firestore.rules
├── README.md
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   ├── components/
│   │   ├── InterviewScreen.jsx
│   │   ├── SetupScreen.jsx
│   │   └── SummaryScreen.jsx
│   ├── lib/
│   │   └── firebase.js
│   └── utils/
│       └── speech.js
└── backend/
    ├── main.py
    ├── requirements.txt
    └── .env
Features
Multi-step interview simulation
Role and difficulty selection
AI-generated interview questions
AI-generated evaluation and feedback
Firebase anonymous authentication
Firestore-based session persistence
Optional voice playback with play/stop toggle
Setup Instructions
1. Open the project

Open the recruit-ai-pro folder in VS Code.

2. Install frontend dependencies
npm install
3. Create environment files

Create a root .env file:

VITE_API_BASE_URL=http://127.0.0.1:8000

Create backend/.env:

GROQ_API_KEY=your_groq_api_key
CLIENT_ORIGIN=http://localhost:5173
GROQ_MODEL=llama-3.3-70b-versatile

Do not commit real API keys to GitHub.

4. Firebase setup

In Firebase Console:

create a Firebase project
enable Authentication > Anonymous
create Firestore Database
add the rules from firestore.rules
configure Firebase in src/lib/firebase.js
5. Create Python virtual environment for backend

From the backend folder:

python -m venv .venv
6. Install backend dependencies
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
7. Run the FastAPI backend

From the backend folder:

.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
8. Run the frontend

From the project root:

npm run dev:client
9. Open the app

Open:

http://localhost:5173
Backend API
Health check
GET /api/health
Interview endpoint
POST /api/interview

This endpoint:

receives interview state from the frontend
sends the prompt to Groq
returns structured JSON containing:
next question
score
strengths
improvements
analysis
completion state
Notes
Firebase config is used on the frontend.
Groq API key must stay in backend/.env.
Do not upload .env or backend/.env to GitHub.
Add .env, backend/.env, .venv, and node_modules to .gitignore.