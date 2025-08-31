// 🏓 PingPong Counter - Configurações personalizáveis
// Para personalizar textos e comportamentos da aplicação

export const CONFIG = {
  // Nomes predefinidos dos jogadores
  DEFAULT_PLAYER_NAMES: {
    left: "Player 1",
    right: "Player 2"
  },

  // Textos da interface
  UI_TEXTS: {
    title: "Contador de Partidas",
    shareButton: "Partilhar",
    undoButton: "Undo",
    resetButton: "Reset",
    historyButton: "Histórico",
    resetConfirmation: "Reset às partidas?",
    shareTitle: "Resultados Ping-Pong",
    copySuccess: "Copiado para a área de transferência!",
    copyPrompt: "Copia manualmente:",
    playerPlaceholder: "Jogador"
  },

  // Mensagens dinâmicas baseadas no resultado
  RESULT_MESSAGES: {
    tie: "Está empatado!",
    winnerTemplate: (winnerName) => 
      `O mais gostoso é o ${winnerName} !!`
  },

  // Configurações técnicas
  TECHNICAL: {
    storageKey: "pingpong-partidas-v2",
    maxNameLength: 18,
    inputType: "number",
    autoCompleteScore: 11, // Score para completar partida automaticamente (0 = desativado)
    showAutoCompleteDialog: true // Mostrar diálogo de confirmação para completar partida
  },

  // Configurações Firebase
  FIREBASE: {
    enabled: true, // Set to false to use localStorage instead
    autoSave: true, // Auto-save changes to Firebase
    realtimeSync: true // Enable real-time synchronization
  },

  // Configurações PWA
  PWA: {
    name: "Contador de Partidas",
    shortName: "PingPong",
    backgroundColor: "#ffffff",
    themeColor: "#000000"
  },

  // Instruções de instalação
  INSTALL_INSTRUCTIONS: {
    ios: 'iPhone: abre este link no Safari → botão <strong>Partilhar</strong> → <strong>Adicionar ao Ecrã Principal</strong>.',
    android: 'Android: abre no Chrome → Menu ⋮ → <strong>Instalar app</strong> ou <strong>Adicionar ao Ecrã principal</strong>.',
    title: "Instalar no telemóvel",
    footer: "Feito para correr como PWA (Android & iPhone)"
  }
};
