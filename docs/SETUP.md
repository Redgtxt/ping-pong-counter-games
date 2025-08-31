# ⚙️ Instalação e Configuração

## 📋 **Requisitos**

- **Node.js**: 22.12+ (ou 20.19+)
- **npm**: Incluído com Node.js
- **Navegador**: Chrome, Safari, Edge ou Firefox
- **HTTPS**: Obrigatório para PWA (em produção)

## 🚀 **Instalação**

### **1. Clonar/Baixar Projeto**
```bash
# Se usando Git
git clone <repository-url>
cd pingpong-counter

# Ou baixar ZIP e extrair
```

### **2. Instalar Dependências**
```bash
npm install
```

### **3. Iniciar Desenvolvimento**
```bash
npm run dev
```
✅ Aplicação disponível em: http://localhost:5173/

### **4. Build para Produção**
```bash
npm run build     # Gera pasta dist/
npm run preview   # Testa build localmente
```

## 🔧 **Configuração**

### **🔥 Firebase (Opcional)**
1. Siga o guia [`FIREBASE.md`](./FIREBASE.md)
2. Configure suas credenciais em `src/firebase.js`
3. ✅ **Sem Firebase**: App funciona só com localStorage

### **⚙️ Personalização**
Edite `src/config.js`:
```javascript
export const CONFIG = {
  // Nomes padrão dos jogadores
  DEFAULT_PLAYER_NAMES: {
    left: "Huguinho",
    right: "Rui"
  },
  
  // Configurações técnicas
  TECHNICAL: {
    autoCompleteScore: 11,        // Auto-complete aos X pontos
    showAutoCompleteDialog: true, // Confirmação de completar partida
    maxNameLength: 18            // Limite de caracteres do nome
  },
  
  // Firebase (se usando)
  FIREBASE: {
    enabled: true,       // false = só localStorage
    autoSave: true,      // false = salvar manualmente
    realtimeSync: true   // false = não sincronizar
  }
}
```

## 🏗️ **Estrutura do Projeto**

```
pingpong-counter/
├── 📁 public/              # Arquivos estáticos
│   ├── icon-192.svg        # Ícone PWA pequeno
│   └── icon-512.svg        # Ícone PWA grande
├── 📁 src/                 # Código fonte
│   ├── App.jsx             # Componente principal
│   ├── config.js           # Configurações
│   ├── firebase.js         # Setup Firebase
│   ├── firebaseService.js  # Funções Firebase
│   ├── index.css           # Estilos globais
│   └── main.jsx            # Entrada da app
├── 📁 docs/                # Documentação
├── 📁 dist/                # Build de produção (gerada)
├── index.html              # Template HTML
├── package.json            # Dependências e scripts
└── vite.config.js          # Configuração Vite + PWA
```

## 📱 **Instalação como PWA**

### **🍎 iOS (iPhone/iPad)**
1. Abrir no **Safari** (obrigatório)
2. Tocar botão **Partilhar** (□↗️)
3. **"Adicionar ao Ecrã Principal"**
4. ✅ App instalado como nativo

### **🤖 Android**
1. Abrir no **Chrome**
2. Menu **⋮** → **"Instalar app"**
3. ✅ App na gaveta de aplicações

### **💻 Desktop**
1. Chrome/Edge: ícone **+** na barra
2. **"Instalar Contador de Partidas"**
3. ✅ App desktop independente

## 🌐 **Deploy Produção**

### **📁 Arquivos Necessários**
```bash
npm run build    # Gera pasta dist/
```
Upload da pasta `dist/` para:
- Netlify, Vercel, GitHub Pages
- Apache, Nginx
- Qualquer servidor web com HTTPS

### **⚙️ Servidor Web**
```nginx
# Nginx example
location / {
  try_files $uri $uri/ /index.html;
}

# Headers PWA
add_header Service-Worker-Allowed /;
```

### **🔐 HTTPS Obrigatório**
PWA requer HTTPS em produção:
- Let's Encrypt (gratuito)
- Cloudflare
- Servidor com SSL

## ✅ **Verificação**

### **🧪 Testes Locais**
1. `npm run dev` - Desenvolvimento
2. `npm run build && npm run preview` - Produção local
3. Teste em diferentes navegadores

### **📊 PWA Audit**
1. Chrome DevTools → Lighthouse
2. Run PWA audit
3. ✅ Score 100/100 esperado

### **🔧 Debug**
- Console do navegador para erros
- Network tab para requests Firebase
- Application tab para PWA status

## 🆘 **Problemas Comuns**

### **❌ Firebase não conecta**
- Verificar credenciais em `src/firebase.js`
- Configurar regras Firestore
- Ver [`FIREBASE.md`](./FIREBASE.md)

### **❌ PWA não instala**
- Verificar HTTPS (obrigatório)
- Check manifest.webmanifest
- Icons corretos (192x192, 512x512)

### **❌ Build falha**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🎉 **Pronto!**

Aplicação configurada e funcionando como PWA profissional! 🏓📱
