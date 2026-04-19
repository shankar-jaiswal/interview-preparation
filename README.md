# Recruit AI Pro

## Project Description and Architecture Overview

- Recruit AI Pro is an AI-powered mock interview application.
- It helps users practice interviews by selecting a role, difficulty level, and number of rounds.
- The app generates interview questions, evaluates answers, and provides structured feedback.
- It stores session history and interview feedback in Firebase.
- It includes optional text-to-speech so users can listen to interview questions.

### Architecture

- **Frontend:** React + Vite
- **Backend:** FastAPI
- **Database/Auth:** Firebase Authentication + Firestore
- **LLM Provider:** Groq API

### How the system works

- The user interacts with the React frontend.
- The frontend sends interview requests to the FastAPI backend.
- The backend sends prompts to the Groq API.
- The Groq API returns interview questions or feedback.
- The frontend shows the results to the user.
- Firebase stores authentication data and interview session history.

```text
React Frontend → FastAPI Backend → Groq API
                     ↓
              Firebase Auth + Firestore
```

## Technical Choices, Setup, and Running Instructions

### Technical Choices

#### React + Vite
Used for building a fast and responsive frontend.  
Vite makes local development faster and simpler.

#### FastAPI
Used for the backend API.  
It is simple, fast, and works well for structured JSON request/response handling.

#### Firebase Authentication
Used for anonymous sign-in.  
It allows users to start using the app without creating an account.

#### Firestore
Used for storing interview history and evaluations.  
It makes the app state persistent across sessions.

#### Groq API
Used as the LLM provider.  
It generates interview questions and structured evaluation feedback.

#### Tailwind CSS
Used for styling the interface.  
It helps build the UI quickly with consistent design.

### Create environment files

Root `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```
GROQ_API_KEY=your_groq_api_key
CLIENT_ORIGIN=http://localhost:5173
GROQ_MODEL=llama-3.3-70b-versatile

### Set up Firebase

Firebase setup:

Create a Firebase project
Enable Anonymous Authentication
Create Firestore Database
Add the rules from firestore.rules
Configure Firebase in src/lib/firebase.js

### Install backend dependencies
cd backend
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt

### Run backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000

### Run frontend
in a new terminal, from recruit-ai-pro

npm run dev:client

## App URL
http://localhost:5173

 ## API Endpoints
GET /api/health
POST /api/interview

###  Known Limitations and AI Tools Used in Development
Known Limitations
The app currently depends on valid Firebase and Groq configuration.
If API keys are missing or invalid, the app will not work.
The project is configured for local development, not full production deployment.
Some values are still manually configured through .env files.
Anonymous authentication is enabled, so there is no full user account system.
The app depends on external API availability and rate limits.
The text-to-speech feature uses browser speech capabilities, so behavior may differ between browsers.

### AI Tools Used in Development
ChatGPT

Used to help design the project structure.
Helped with debugging frontend, backend, Firebase, and API integration issues.
Helped generate and improve README documentation.

AI assistance usage

Used for development support, explanation, and debugging.
Final testing, setup, and integration were still done manually in the project environment.
