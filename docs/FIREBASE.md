# 🔥 Configuração Firebase

## 📋 **Pré-requisitos:**
1. Conta Google
2. Projeto PingPong Counter funcionando

## 🚀 **Passos para Configuração:**

### 1. **Criar Projeto Firebase**
1. Vá para [Firebase Console](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"**
3. Nome: `pingpong-counter` (ou outro nome)
4. Desative Google Analytics (opcional)
5. Clique **"Criar projeto"**

### 2. **Configurar Firestore Database**
1. No painel lateral, clique em **"Firestore Database"**
2. Clique **"Criar base de dados"**
3. Escolha **"Começar em modo de teste"**
4. Escolha localização (Europe - west3 para Portugal)
5. Clique **"Concluído"**

### 3. **Obter Configurações do Projeto**
1. Clique no ícone ⚙️ (Configurações) → **"Definições do projeto"**
2. Na aba **"Geral"**, desça até **"As suas aplicações"**
3. Clique no ícone **"</>"** (Web)
4. Nome da app: `PingPong Counter`
5. **NÃO** marque Firebase Hosting
6. Clique **"Registar app"**
7. **COPIE** o objeto `firebaseConfig` que aparece

### 4. **Atualizar Código**
1. Abra o ficheiro `src/firebase.js`
2. Substitua o objeto `firebaseConfig` pelos seus dados reais
3. **EXEMPLO:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "pingpong-counter-12345.firebaseapp.com",
  projectId: "pingpong-counter-12345",
  storageBucket: "pingpong-counter-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

### 5. **Configurar Regras de Segurança (Obrigatório)**
Para permitir leitura/escrita pública (apenas para teste):
1. No Firestore, vá para **"Regras"**
2. Substitua por:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```
3. Clique **"Publicar"**

⚠️ **ATENÇÃO:** Estas regras são para teste. Para produção, configure segurança adequada!

## ✅ **Funcionalidades Disponíveis:**

- **🔗 Links Partilháveis:** Cada jogo tem um ID único
- **🔄 Sincronização em Tempo Real:** Mudanças aparecem instantaneamente
- **📱 Multi-dispositivo:** Mesmo jogo em vários dispositivos
- **☁️ Backup na Cloud:** Dados nunca se perdem
- **🌐 Acesso Global:** Funciona em qualquer lugar

## 🧪 **Como Testar:**

1. Abra a aplicação
2. Verifica se aparece **"🟢 Online"** e um **ID** no topo
3. Clica em **"Partilhar"** para obter o link
4. Abre o link noutra aba/dispositivo
5. Muda o score numa aba e vê a atualização na outra

## 🔧 **Configurações Avançadas:**

No `src/config.js`, podes ajustar:
```javascript
FIREBASE: {
  enabled: true,        // false = usar apenas localStorage
  autoSave: true,       // false = salvar manualmente
  realtimeSync: true    // false = não sincronizar em tempo real
}
```

## ❌ **Modo Offline:**

Se Firebase não funcionar:
- A app continua a funcionar com localStorage
- Aparece **"🔴 Offline"** no topo
- Dados ficam guardados localmente

## 🆘 **Problemas Comuns:**

1. **"Permission denied"**: Configura regras do Firestore (passo 5)
2. **"Network error"**: Verifica internet e configurações
3. **"NOT_FOUND"**: Verifica se o projeto existe e está configurado

---

🎉 **Pronto!** A aplicação agora tem superpoderes na cloud! 🔥
