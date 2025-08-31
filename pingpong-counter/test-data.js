// 🧪 Script para adicionar partidas de teste ao histórico
// Execute este comando no console do navegador para testar o sistema

// Função para adicionar partidas de exemplo
function addTestMatches() {
  const testMatches = [
    {
      id: 1698765432100,
      date: new Date('2025-08-30T10:30:00').toISOString(),
      leftPlayer: 'Huguinho',
      rightPlayer: 'Rui',
      leftScore: 11,
      rightScore: 7,
      winner: 'Huguinho',
      timestamp: 1698765432100
    },
    {
      id: 1698765432200,
      date: new Date('2025-08-30T11:15:00').toISOString(),
      leftPlayer: 'Huguinho',
      rightPlayer: 'Rui',
      leftScore: 8,
      rightScore: 11,
      winner: 'Rui',
      timestamp: 1698765432200
    },
    {
      id: 1698765432300,
      date: new Date('2025-08-30T14:45:00').toISOString(),
      leftPlayer: 'Huguinho',
      rightPlayer: 'Rui',
      leftScore: 11,
      rightScore: 9,
      winner: 'Huguinho',
      timestamp: 1698765432300
    },
    {
      id: 1698765432400,
      date: new Date('2025-08-31T09:20:00').toISOString(),
      leftPlayer: 'Huguinho',
      rightPlayer: 'Rui',
      leftScore: 11,
      rightScore: 6,
      winner: 'Huguinho',
      timestamp: 1698765432400
    },
    {
      id: 1698765432500,
      date: new Date('2025-08-31T09:45:00').toISOString(),
      leftPlayer: 'Huguinho',
      rightPlayer: 'Rui',
      leftScore: 9,
      rightScore: 11,
      winner: 'Rui',
      timestamp: 1698765432500
    }
  ];

  // Adicionar ao localStorage
  const currentData = JSON.parse(localStorage.getItem('pingpong-partidas-v2') || '{}');
  const updatedData = {
    ...currentData,
    matchHistory: testMatches
  };
  
  localStorage.setItem('pingpong-partidas-v2', JSON.stringify(updatedData));
  
  console.log('✅ Partidas de teste adicionadas!');
  console.log('🔄 Recarrega a página para ver o resultado');
  console.log('📊 Estatísticas:', {
    'Total de partidas': testMatches.length,
    'Huguinho': testMatches.filter(m => m.winner === 'Huguinho').length + ' vitórias',
    'Rui': testMatches.filter(m => m.winner === 'Rui').length + ' vitórias'
  });
  
  return testMatches;
}

// Função para limpar dados de teste
function clearTestData() {
  const currentData = JSON.parse(localStorage.getItem('pingpong-partidas-v2') || '{}');
  const clearedData = {
    ...currentData,
    matchHistory: []
  };
  
  localStorage.setItem('pingpong-partidas-v2', JSON.stringify(clearedData));
  console.log('🗑️ Dados de teste removidos!');
  console.log('🔄 Recarrega a página para ver o resultado');
}

console.log('🏓 Scripts de teste disponíveis:');
console.log('  addTestMatches() - Adiciona partidas de exemplo');
console.log('  clearTestData() - Remove todas as partidas');
