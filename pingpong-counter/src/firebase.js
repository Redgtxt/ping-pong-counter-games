// 🔥 Firebase Configuration
// Para configurar a conexão com Firebase

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA3OvYSfU9ujNCgINJxKjxSerixNJ6m_hY",
  authDomain: "pingpong-counter-f07a5.firebaseapp.com",
  projectId: "pingpong-counter-f07a5",
  storageBucket: "pingpong-counter-f07a5.firebasestorage.app",
  messagingSenderId: "986170110957",
  appId: "1:986170110957:web:f3d93220f5f0cddcccede4"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

// Para desenvolvimento local (opcional)
// if (location.hostname === 'localhost') {
//   connectFirestoreEmulator(db, 'localhost', 8080);
// }

export default app;
