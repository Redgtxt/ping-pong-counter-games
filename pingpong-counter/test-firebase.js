// 🧪 Teste de conectividade Firebase
// Execute este arquivo para testar se o Firebase está funcionando

import { db } from './src/firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

async function testFirebase() {
  console.log('🔍 Testando conectividade Firebase...');
  
  try {
    // Testar escrita
    const testId = 'test-' + Date.now();
    const testData = {
      message: 'Firebase funcionando!',
      timestamp: new Date().toISOString()
    };
    
    console.log('✏️ Tentando escrever no Firestore...');
    await setDoc(doc(db, 'tests', testId), testData);
    console.log('✅ Escrita bem-sucedida!');
    
    // Testar leitura
    console.log('📖 Tentando ler do Firestore...');
    const docSnap = await getDoc(doc(db, 'tests', testId));
    
    if (docSnap.exists()) {
      console.log('✅ Leitura bem-sucedida!');
      console.log('📄 Dados:', docSnap.data());
      console.log('🎉 Firebase está funcionando perfeitamente!');
    } else {
      console.log('❌ Documento não encontrado');
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar Firebase:', error);
    
    if (error.code === 'permission-denied') {
      console.log('🔐 Possível problema de permissões no Firestore');
    } else if (error.code === 'unavailable') {
      console.log('🌐 Problema de conectividade');
    }
  }
}

testFirebase();
