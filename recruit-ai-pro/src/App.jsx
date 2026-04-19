import React, { useEffect, useMemo, useState } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import SetupScreen from './components/SetupScreen';
import InterviewScreen from './components/InterviewScreen';
import SummaryScreen from './components/SummaryScreen';
import { auth, db } from './lib/firebase';
import { speakText, stopSpeech, getSpeechState } from './utils/speech';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('setup');
  const [answer, setAnswer] = useState('');
  const [session, setSession] = useState(null);
  const [history, setHistory] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [evaluations, setEvaluations] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [settings, setSettings] = useState({
    role: 'Fullstack Engineer',
    difficulty: 'Intermediate',
    qCount: 5
  });

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  signInAnonymously(auth).catch((error) => {
    console.error('Anonymous sign-in failed:', error);
    alert(error.message);
  });

  return () => unsubscribe();
}, []);

  useEffect(() => {
    if (!user || !session?.id) return undefined;

    const historyRef = collection(db, 'artifacts', 'recruit-ai-pro', 'users', user.uid, 'history');
    const unsubscribeHistory = onSnapshot(historyRef, (snapshot) => {
      const items = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((item) => item.sessionId === session.id)
        .sort((a, b) => a.timestamp - b.timestamp);

      setHistory(items);
    });

    const evaluationsRef = collection(db, 'artifacts', 'recruit-ai-pro', 'users', user.uid, 'evaluations');
    const unsubscribeEvaluations = onSnapshot(evaluationsRef, (snapshot) => {
      const items = snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((item) => item.sessionId === session.id)
        .sort((a, b) => a.roundNumber - b.roundNumber);

      setEvaluations(items);
    });

    return () => {
      unsubscribeHistory();
      unsubscribeEvaluations();
    };
  }, [user, session?.id]);

  const latestBotMessage = useMemo(() => {
    const botMessages = history.filter((item) => item.type === 'bot');
    return botMessages[botMessages.length - 1] || null;
  }, [history]);

  async function callInterviewApi(payload) {
    const response = await fetch(`${API_BASE_URL}/api/interview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Interview API failed');
    }

    return data;
  }

  async function handleStart() {
  if (!user) {
    alert('Please wait a moment. Firebase is still connecting.');
    return;
  }

    setLoading(true);
    setFeedback(null);
    setEvaluations([]);
    setHistory([]);

    try {
      const sessionId = crypto.randomUUID();
      const newSession = {
        id: sessionId,
        ...settings,
        createdAt: Date.now()
      };

      await setDoc(doc(db, 'artifacts', 'recruit-ai-pro', 'users', user.uid, 'sessions', sessionId), newSession);
      setSession(newSession);
      setStep('interview');

      const firstTurn = await callInterviewApi({
        role: settings.role,
        difficulty: settings.difficulty,
        questionCount: settings.qCount,
        history: [],
        isFirst: true,
        roundNumber: 1
      });

      await addDoc(collection(db, 'artifacts', 'recruit-ai-pro', 'users', user.uid, 'history'), {
        sessionId,
        type: 'bot',
        text: firstTurn.nextQuestion,
        timestamp: Date.now()
      });

      speakText(firstTurn.nextQuestion);
    } catch (error) {
      console.error(error);
      alert(error.message);
      setStep('setup');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!user || !session?.id || !answer.trim()) return;

    const currentAnswer = answer.trim();
    setLoading(true);

    try {
      const completedRounds = evaluations.length;
      const result = await callInterviewApi({
        role: settings.role,
        difficulty: settings.difficulty,
        questionCount: settings.qCount,
        history,
        answer: currentAnswer,
        isFirst: false,
        roundNumber: completedRounds + 1
      });

      const baseTimestamp = Date.now();

      await addDoc(collection(db, 'artifacts', 'recruit-ai-pro', 'users', user.uid, 'history'), {
        sessionId: session.id,
        type: 'user',
        text: currentAnswer,
        timestamp: baseTimestamp
      });

      if (result.feedback) {
        await addDoc(collection(db, 'artifacts', 'recruit-ai-pro', 'users', user.uid, 'evaluations'), {
          sessionId: session.id,
          roundNumber: completedRounds + 1,
          question: latestBotMessage?.text || '',
          ...result.feedback,
          timestamp: baseTimestamp + 1
        });
        setFeedback(result.feedback);
      }

      if (result.isFinished) {
        setStep('summary');
      } else {
        await addDoc(collection(db, 'artifacts', 'recruit-ai-pro', 'users', user.uid, 'history'), {
          sessionId: session.id,
          type: 'bot',
          text: result.nextQuestion,
          timestamp: baseTimestamp + 2
        });
        speakText(result.nextQuestion);
      }

      setAnswer('');
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

 function handleSpeakCurrentQuestion() {
  if (!latestBotMessage?.text) return;

  if (getSpeechState()) {
    stopSpeech();
    setIsSpeaking(false);
    return;
  }

  speakText(latestBotMessage.text, () => {
    setIsSpeaking(false);
  });

  setIsSpeaking(true);
}

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {step === 'setup' && (
        <SetupScreen
          settings={settings}
          setSettings={setSettings}
          loading={loading}
          onStart={handleStart}
          userId={user?.uid}
        />
      )}

      {step === 'interview' && (
        <InterviewScreen
          history={history}
          answer={answer}
          setAnswer={setAnswer}
          loading={loading}
          feedback={feedback}
          onSubmit={handleSubmit}
          onRepeatVoice={handleSpeakCurrentQuestion}
          isSpeaking={isSpeaking}
/>
      )}

      {step === 'summary' && (
        <SummaryScreen
          history={evaluations.map((item) => ({
            id: item.id,
            type: 'bot',
            text: item.question,
            score: item.score,
            analysis: item.analysis
          }))}
          settings={settings}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
