import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBwIdoHJikH9eD2PQLjmJhXBdZgGE5-Ruo',
  authDomain: 'web-app-eb748.firebaseapp.com',
  projectId: 'web-app-eb748',
  storageBucket: 'web-app-eb748.firebasestorage.app',
  messagingSenderId: '520374816849',
  appId: '1:520374816849:web:85fccc0f8f7a9573ce6870'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;