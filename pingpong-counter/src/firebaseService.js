// 🎮 Firebase Services para PingPong Counter
// Funções para interagir com Firestore

import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase.js';

// Gerar ID único para um jogo
export const generateGameId = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Criar um novo jogo
export const createGame = async (gameData) => {
  try {
    const gameId = generateGameId();
    const docRef = doc(db, 'games', gameId);
    
    await setDoc(docRef, {
      ...gameData,
      gameId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Jogo criado:', gameId);
    return gameId;
  } catch (error) {
    console.error('❌ Erro ao criar jogo:', error);
    throw error;
  }
};

// Carregar dados de um jogo
export const loadGame = async (gameId) => {
  try {
    const docRef = doc(db, 'games', gameId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log('✅ Jogo carregado:', gameId);
      return docSnap.data();
    } else {
      console.log('❌ Jogo não encontrado:', gameId);
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao carregar jogo:', error);
    throw error;
  }
};

// Atualizar dados de um jogo
export const updateGame = async (gameId, gameData) => {
  try {
    const docRef = doc(db, 'games', gameId);
    
    await updateDoc(docRef, {
      ...gameData,
      updatedAt: serverTimestamp()
    });
    
    console.log('✅ Jogo atualizado:', gameId);
  } catch (error) {
    console.error('❌ Erro ao atualizar jogo:', error);
    throw error;
  }
};

// Escutar mudanças em tempo real
export const subscribeToGame = (gameId, callback) => {
  try {
    const docRef = doc(db, 'games', gameId);
    
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        console.log('🔄 Atualização em tempo real:', gameId);
        callback(doc.data());
      } else {
        console.log('❌ Jogo não existe:', gameId);
        callback(null);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Erro ao escutar jogo:', error);
    throw error;
  }
};

// Obter URL para partilhar
export const getShareableUrl = (gameId) => {
  return `${window.location.origin}?game=${gameId}`;
};
