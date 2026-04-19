# Recruit AI Pro

A React + Vite + Express mock interview app with Firebase persistence and Gemini-powered interview logic.

## Project structure

```text
recruit-ai-pro/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
├── .env.example
├── firestore.rules
├── server/
│   ├── index.js
│   └── .env.example
└── src/
    ├── App.jsx
    ├── index.css
    ├── main.jsx
    ├── components/
    │   ├── InterviewScreen.jsx
    │   ├── SetupScreen.jsx
    │   └── SummaryScreen.jsx
    ├── lib/
    │   └── firebase.js
    └── utils/
        └── speech.js
```

## 1. Open in VS Code

Open the `recruit-ai-pro` folder in VS Code.

## 2. Install packages

Open the terminal in VS Code and run:

```bash
npm install
```

## 3. Add environment files

Create a file named `.env` in the project root and copy from `.env.example`.

Create a file named `server/.env` and copy from `server/.env.example`.

### Root `.env`

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
VITE_API_BASE_URL=http://localhost:3001
```

### `server/.env`

```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key
CLIENT_ORIGIN=http://localhost:5173
GEMINI_MODEL=gemini-1.5-flash
```

## 4. Firebase setup

In Firebase Console:

- Create a project
- Enable **Authentication > Anonymous**
- Create **Firestore Database**
- Add the rules from `firestore.rules`
- Copy your Firebase web config into the root `.env`

## 5. Run the app

```bash
npm run dev
```

This starts:

- React client on `http://localhost:5173`
- Express server on `http://localhost:3001`

## Important note

Your original code used `__firebase_config`, `__initial_auth_token`, and a direct Gemini call from the browser. That works only in some hosted sandbox environments. In a normal VS Code React project:

- Firebase config must come from `.env`
- Gemini API key should stay on the server
- The frontend should call your Express backend, not Gemini directly

