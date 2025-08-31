# 🏓 Contador de Partidas - PingPong

Uma aplicação web simples e bonita para contar partidas de Ping-Pong entre dois jogadores, com funcionalidades PWA (Progressive Web App).

## 🚀 Funcionalidades

- ✅ **Nomes editáveis**: Personalize os nomes dos jogadores
- ✅ **Botão de incremento (+)**: Adiciona vitórias rapidamente
- ✅ **Alteração rápida de score**: Clique no número para alterar diretamente
- ✅ **Frase dinâmica**: Mostra quem tem mais vitórias com uma mensagem personalizada
- ✅ **Undo/Desfazer**: Reverte a última alteração de score
- ✅ **Reset**: Zera o placar (com confirmação)
- ✅ **Partilhar**: Partilha o resultado via sistema nativo ou copia para área de transferência
- ✅ **LocalStorage**: Os dados ficam guardados localmente no navegador
- ✅ **PWA**: Pode ser instalado no telemóvel como aplicação nativa
- ✅ **Design responsivo**: Funciona bem em dispositivos móveis e desktop
- 🌙 **Dark Mode Toggle**: Botão para alternar entre modo claro e escuro (independente do sistema)
- 🔥 **Firebase Integration**: Sincronização em tempo real e links partilháveis
- 🔗 **Links Partilháveis**: Cada jogo tem um ID único para partilhar
- 🔄 **Sincronização em Tempo Real**: Mudanças aparecem instantaneamente em todos os dispositivos
- 📊 **Sistema de Histórico**: Registo completo de todas as partidas jogadas
- 🗑️ **Apagar Partidas**: Possibilidade de apagar jogos individuais do histórico
- 🏆 **Auto-complete**: Partidas completam automaticamente aos 11 pontos
- 📱 **Interface Histórico**: Visualização organizada por data com estatísticas
- 🎯 **Contador de Partidas**: Foco nas partidas ganhas em vez de pontos momentâneos
- 💬 **Mensagens Provocativas**: Frases dinâmicas para motivar e provocar jogadores

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **Vite 7** - Ferramenta de build e desenvolvimento
- **Firebase 10** - Base de dados em tempo real e sincronização
- **Firestore** - Base de dados NoSQL para guardar jogos e histórico
- **CSS3** - Estilos customizados com variáveis CSS e dark mode
- **Vite PWA Plugin** - Para funcionalidades PWA
- **LocalStorage API** - Para persistência local (backup)
- **Web Share API** - Para partilha nativa
- **JavaScript ES6+** - Funcionalidades modernas (useMemo, useEffect, etc.)

## 🔥 Firebase Setup

Para ativar a sincronização em tempo real e links partilháveis:
1. Siga as instruções em [`docs/FIREBASE.md`](docs/FIREBASE.md)
2. Configure seu projeto Firebase
3. Atualize as configurações em `src/firebase.js`

**Sem Firebase:** A app funciona normalmente com localStorage

## 📱 Instalação como PWA

### iPhone/iPad
1. Abra este link no **Safari**
2. Toque no botão **Partilhar** (ícone da caixa com seta)
3. Escolha **"Adicionar ao Ecrã Principal"**

### Android
1. Abra no **Chrome**
2. Toque no menu **⋮** (três pontos)
3. Escolha **"Instalar app"** ou **"Adicionar ao Ecrã principal"**

## 💻 Desenvolvimento

### Requisitos
- Node.js 22.12+
- npm

### Comandos

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 🎨 Personalização

### Variáveis configuráveis no `App.jsx`:

```javascript
// Nomes predefinidos
const [leftName, setLeftName] = useState("Huguinho");
const [rightName, setRightName] = useState("Rui");

// Mensagem de empate
if (leftWins === rightWins) return "Está empatado!";

// Mensagem de liderança
return `O mais gostoso é o ${leftWins > rightWins ? leftName : rightName} pois é a pessoa com mais vitórias.`;

// Chave do LocalStorage
const STORAGE_KEY = "pingpong-partidas-v2";
```

### Personalizar textos:
- **Título da app**: Alterar `name` e `short_name` no `vite.config.js`
- **Limite de caracteres do nome**: Alterar `.slice(0, 18)` no `PlayerCard`
- **Frase de vitória**: Alterar no `useMemo` do `phrase`

## 📁 Estrutura do Projeto

```
pingpong-counter/
├── public/
│   ├── icon-192.svg          # Ícone PWA 192x192
│   ├── icon-512.svg          # Ícone PWA 512x512
│   └── vite.svg
├── src/
│   ├── App.jsx               # Componente principal
│   ├── main.jsx              # Ponto de entrada
│   └── index.css             # Estilos globais + Tailwind
├── index.html                # Template HTML
├── vite.config.js           # Configuração Vite + PWA
├── tailwind.config.js       # Configuração Tailwind
└── package.json             # Dependências e scripts
```

## 🎯 Como Usar

1. **Editar nomes**: Clique nos nomes dos jogadores para editá-los
2. **Incrementar score**: Clique nos números grandes para alterar o score diretamente
3. **Desfazer**: Botão "Undo" para reverter a última alteração
4. **Zerar**: Botão "Reset" para voltar ao 0-0 (pede confirmação)
5. **Partilhar**: Botão "Partilhar" no topo para enviar o resultado
6. **Dark Mode**: Botão 🌙/☀️ no header para alternar entre modo claro e escuro
7. **Ver Histórico**: Botão "📊 Histórico" para ver todas as partidas jogadas
8. **Apagar Partidas**: Use o botão 🗑️ em cada partida do histórico para apagar individualmente
9. **Auto-complete**: Partidas completam automaticamente aos 11 pontos (configurável)

### 🏆 **Interface Principal**
- **Contador de Partidas**: Mostra quantas partidas cada jogador ganhou (ex: "Huguinho 5 partidas vs Rui 2")
- **Mensagens Provocativas**: Frases dinâmicas para provocar e motivar baseadas no líder
- **Partida Atual**: Score da partida em curso mostrado em seção dedicada

### 🌙 **Dark Mode**
- **Toggle Manual**: Use o botão 🌙/☀️ para alternar entre temas
- **Preferência Persistente**: A escolha fica guardada no navegador
- **Independente do Sistema**: Não muda automaticamente com o sistema operativo

### 📊 **Sistema de Histórico**
- **Ver partidas**: Clique em "📊 Histórico" para ver todas as partidas
- **Agrupadas por data**: Partidas organizadas por dia
- **Estatísticas**: Total de jogos e vitórias por jogador
- **Detalhes**: Hora, resultado e vencedor de cada partida
- **Apagar Individual**: Clique no ícone 🗑️ em cada partida para a apagar (pede confirmação)
- **Limpar Tudo**: Use o ícone 🗑️ do cabeçalho para limpar todo o histórico

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

---

## 📚 Documentação Completa

Para informação detalhada sobre todas as funcionalidades:

- **🚀 [Instalação e Setup](docs/SETUP.md)** - Guia completo de instalação
- **🔥 [Configuração Firebase](docs/FIREBASE.md)** - Setup da sincronização cloud
- **📱 [PWA e Instalação](docs/PWA.md)** - Progressive Web App
- **📊 [Sistema de Histórico](docs/HISTORY.md)** - Funcionalidades do histórico
- **🎯 [Nova Interface](docs/INTERFACE.md)** - Interface focada em partidas ganhas
- **🏓 [Todas as Funcionalidades](docs/FEATURES.md)** - Lista completa

📖 **[Índice Completo da Documentação](docs/README.md)**
