# Recruit AI Pro

Recruit AI Pro is an AI-powered mock interview application built with React, Vite, FastAPI, Firebase, and Groq.

## Features

- Role selection
- Difficulty selection
- Multi-step interview simulation
- AI-generated interview questions
- AI-generated feedback with score, strengths, and improvements
- Firebase authentication and Firestore storage
- Optional text-to-speech with play/stop toggle

## Tech Stack

- Frontend: React + Vite
- Backend: FastAPI
- Database/Auth: Firebase Authentication + Firestore
- AI Model: Groq API
- Styling: Tailwind CSS

## Project Structure

```text
Interview_prepration/
├── README.md
└── recruit-ai-pro/
    ├── backend/
    │   ├── main.py
    │   ├── requirements.txt
    │   └── .env
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── components/
    │   │   ├── SetupScreen.jsx
    │   │   ├── InterviewScreen.jsx
    │   │   └── SummaryScreen.jsx
    │   ├── lib/
    │   │   └── firebase.js
    │   └── utils/
    │       └── speech.js
    ├── .env.example
    ├── .gitignore
    ├── firestore.rules
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js

Frontend
Built with React and Vite
Handles user interface
Handles user input
Manages interview flow and screen transitions
Displays AI-generated questions and feedback
Controls optional text-to-speech playback
Main Frontend Files
src/App.jsx
src/components/SetupScreen.jsx
src/components/InterviewScreen.jsx
src/components/SummaryScreen.jsx
src/utils/speech.js
Backend
Built with FastAPI
Receives interview requests from the frontend
Sends prompts to the Groq API
Returns structured JSON responses
Generates interview questions and feedback
Handles API routes
Main Backend Files
backend/main.py
backend/requirements.txt
Firebase
Used for Anonymous Authentication
Used for Firestore Database storage
Stores session history and interview feedback
Firebase Setup
Create a Firebase project
Enable Anonymous Authentication
Create Firestore Database
Add Firestore security rules
Configure Firebase in src/lib/firebase.js
Firestore Rules
recruit-ai-pro/firestore.rules
Environment Files
Root .env
VITE_API_BASE_URL=http://127.0.0.1:8000
backend/.env
GROQ_API_KEY=your_groq_api_key
CLIENT_ORIGIN=http://localhost:5173
GROQ_MODEL=llama-3.3-70b-versatile
Frontend Installation
npm install
Frontend Run Command
npm run dev:client
Backend Installation
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Backend Run Command
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
App URL
http://localhost:5173
API Endpoints
Health Check
GET /api/health
Interview API
POST /api/interview
Interview Flow
User selects role, difficulty, and rounds
Frontend sends request to backend
Backend generates question using Groq
Frontend displays question
User submits answer
Backend evaluates the answer
Frontend displays structured feedback
Data is stored in Firebase
Final summary is shown after completion
Notes
Do not upload .env or backend/.env to GitHub
Keep API keys private
Add .env, backend/.env, .venv, and node_modules to .gitignore
Firebase config is used on the frontend
Groq API key must stay in the backend only
