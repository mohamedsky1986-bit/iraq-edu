import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyDBBYsgWeQX0L9oed8DsdqyCecX_8RkK30",
  authDomain: "proven-climate-n5wls.firebaseapp.com",
  projectId: "proven-climate-n5wls",
  storageBucket: "proven-climate-n5wls.firebasestorage.app",
  messagingSenderId: "504657197137",
  appId: "1:504657197137:web:6f4453ef915c9c7622a070"
};

export const app = initializeApp(firebaseConfig);

const DATABASE_ID = 'ai-studio-416f6094-7802-4543-8184-da24e09308d4';

let firestoreDb;
try {
  firestoreDb = getFirestore(app, DATABASE_ID);
} catch {
  firestoreDb = getFirestore(app);
}

export const db = firestoreDb;
