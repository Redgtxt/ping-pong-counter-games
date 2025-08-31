import React, { useEffect, useMemo, useState } from "react";
import { CONFIG } from "./config.js";
import { 
  createGame, 
  loadGame, 
  updateGame, 
  subscribeToGame, 
  generateGameId,
  getShareableUrl 
} from "./firebaseService.js";

// PingPong – Contador de Partidas
// • Nomes editáveis
// • Alteração rápida de score (input numérico)
// • Frase dinâmica sobre quem tem mais vitórias
// • Undo, Reset, Partilhar
// • LocalStorage persistente
// • PWA ready

export default function App() {
  const [leftName, setLeftName] = useState(CONFIG.DEFAULT_PLAYER_NAMES.left);
  const [rightName, setRightName] = useState(CONFIG.DEFAULT_PLAYER_NAMES.right);
  const [leftWins, setLeftWins] = useState(0);
  const [rightWins, setRightWins] = useState(0);
  const [history, setHistory] = useState([]);
  const [matchHistory, setMatchHistory] = useState([]);
  const [gameId, setGameId] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Verificar se há preferência salva ou usar preferência do sistema
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const STORAGE_KEY = CONFIG.TECHNICAL.storageKey;

  // Inicializar app - verificar URL para gameId ou carregar localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlGameId = urlParams.get('game');
    
    if (urlGameId && CONFIG.FIREBASE.enabled) {
      // Carregar jogo partilhado do Firebase
      loadGameFromFirebase(urlGameId);
    } else {
      // Carregar do localStorage
      loadFromLocalStorage();
      
      // Se Firebase habilitado, criar novo jogo
      if (CONFIG.FIREBASE.enabled) {
        createNewGame();
      }
    }
  }, []);

  // Aplicar dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Guardar no localStorage (backup)
  useEffect(() => {
    const payload = { leftName, rightName, leftWins, rightWins, history, matchHistory };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {}
  }, [leftName, rightName, leftWins, rightWins, history, matchHistory]);

  // Auto-salvar no Firebase
  useEffect(() => {
    if (gameId && CONFIG.FIREBASE.enabled && CONFIG.FIREBASE.autoSave) {
      saveToFirebase();
    }
  }, [leftName, rightName, leftWins, rightWins, history, matchHistory, gameId]);

  // Funções Firebase
  const loadFromLocalStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          setLeftName(parsed.leftName ?? CONFIG.DEFAULT_PLAYER_NAMES.left);
          setRightName(parsed.rightName ?? CONFIG.DEFAULT_PLAYER_NAMES.right);
          setLeftWins(parsed.leftWins ?? 0);
          setRightWins(parsed.rightWins ?? 0);
          setHistory(parsed.history ?? []);
          setMatchHistory(parsed.matchHistory ?? []);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar localStorage:', error);
    }
  };

  const createNewGame = async () => {
    try {
      const newGameId = await createGame({
        leftName,
        rightName,
        leftWins,
        rightWins,
        history,
        matchHistory
      });
      setGameId(newGameId);
      setIsOnline(true);
      
      // Atualizar URL
      const newUrl = `${window.location.pathname}?game=${newGameId}`;
      window.history.replaceState(null, '', newUrl);
    } catch (error) {
      console.error('Erro ao criar jogo:', error);
      setIsOnline(false);
    }
  };

  const loadGameFromFirebase = async (gameId) => {
    try {
      const gameData = await loadGame(gameId);
      if (gameData) {
        setLeftName(gameData.leftName ?? CONFIG.DEFAULT_PLAYER_NAMES.left);
        setRightName(gameData.rightName ?? CONFIG.DEFAULT_PLAYER_NAMES.right);
        setLeftWins(gameData.leftWins ?? 0);
        setRightWins(gameData.rightWins ?? 0);
        setHistory(gameData.history ?? []);
        setMatchHistory(gameData.matchHistory ?? []);
        setGameId(gameId);
        setIsOnline(true);
        
        // Subscrever a mudanças em tempo real
        if (CONFIG.FIREBASE.realtimeSync) {
          subscribeToGame(gameId, (data) => {
            if (data) {
              setLeftName(data.leftName ?? CONFIG.DEFAULT_PLAYER_NAMES.left);
              setRightName(data.rightName ?? CONFIG.DEFAULT_PLAYER_NAMES.right);
              setLeftWins(data.leftWins ?? 0);
              setRightWins(data.rightWins ?? 0);
              setHistory(data.history ?? []);
              setMatchHistory(data.matchHistory ?? []);
              setLastSaved(new Date());
            }
          });
        }
      } else {
        console.log('Jogo não encontrado, criando novo...');
        createNewGame();
      }
    } catch (error) {
      console.error('Erro ao carregar jogo:', error);
      setIsOnline(false);
      loadFromLocalStorage();
    }
  };

  const saveToFirebase = async () => {
    if (!gameId) return;
    
    try {
      await updateGame(gameId, {
        leftName,
        rightName,
        leftWins,
        rightWins,
        history,
        matchHistory
      });
      setLastSaved(new Date());
      setIsOnline(true);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      setIsOnline(false);
    }
  };

  const pushHistory = (l, r) =>
    setHistory((h) => [...h, { l, r }]);

  // Função para registrar uma partida completa
  const recordMatch = (winner, leftScore, rightScore) => {
    const match = {
      id: Date.now(),
      date: new Date().toISOString(),
      leftPlayer: leftName,
      rightPlayer: rightName,
      leftScore: leftScore,
      rightScore: rightScore,
      winner: winner,
      timestamp: Date.now()
    };
    
    setMatchHistory(prev => [match, ...prev]);
  };

  // Verificar se partida deve ser completada automaticamente
  const checkAutoComplete = (newLeftWins, newRightWins) => {
    const { autoCompleteScore, showAutoCompleteDialog } = CONFIG.TECHNICAL;
    
    if (autoCompleteScore <= 0) return false;
    
    const hasWinner = newLeftWins >= autoCompleteScore || newRightWins >= autoCompleteScore;
    const hasMinDifference = Math.abs(newLeftWins - newRightWins) >= 2;
    
    if (hasWinner && hasMinDifference) {
      const winner = newLeftWins > newRightWins ? leftName : rightName;
      const message = `🏆 ${winner} ganhou a partida!\n${leftName} ${newLeftWins} - ${newRightWins} ${rightName}\n\nCompletar partida e começar nova?`;
      
      if (!showAutoCompleteDialog || confirm(message)) {
        recordMatch(winner, newLeftWins, newRightWins);
        setLeftWins(0);
        setRightWins(0);
        return true;
      }
    }
    
    return false;
  };

  const handleUndo = () => {
    setHistory((h) => {
      if (h.length === 0) return h;
      const prev = h[h.length - 1];
      setLeftWins(prev.l);
      setRightWins(prev.r);
      return h.slice(0, -1);
    });
  };

  const handleReset = () => {
    if (!confirm("Tens a certeza que queres fazer reset às partidas?")) return;
    
    // Se há pontos, registrar como partida concluída
    if (leftWins > 0 || rightWins > 0) {
      const winner = leftWins > rightWins ? leftName : 
                    rightWins > leftWins ? rightName : 'Empate';
      recordMatch(winner, leftWins, rightWins);
    }
    
    pushHistory(leftWins, rightWins);
    setLeftWins(0);
    setRightWins(0);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const deleteMatchFromHistory = (matchId) => {
    setMatchHistory(prev => prev.filter(match => match.id !== matchId));
  };

  const summary = useMemo(
    () => `${leftName} ${leftWins} – ${rightName} ${rightWins}`,
    [leftName, rightName, leftWins, rightWins]
  );

  // Calcular estatísticas de partidas ganhas
  const matchStats = useMemo(() => {
    const leftMatches = matchHistory.filter(match => match.winner === leftName).length;
    const rightMatches = matchHistory.filter(match => match.winner === rightName).length;
    const ties = matchHistory.filter(match => match.winner === 'Empate').length;
    const totalMatches = matchHistory.length;
    
    return { leftMatches, rightMatches, ties, totalMatches };
  }, [matchHistory, leftName, rightName]);

  // Nova mensagem baseada nas partidas ganhas
  const matchSummary = useMemo(() => {
    const { leftMatches, rightMatches, totalMatches } = matchStats;
    
    if (totalMatches === 0) {
      return `Primeira partida entre ${leftName} e ${rightName}!`;
    }
    
    return `${leftName} ${leftMatches} vs ${rightName} ${rightMatches}`;
  }, [matchStats, leftName, rightName]);

  // Mensagem provocativa baseada no líder
  const provocativeMessage = useMemo(() => {
    const { leftMatches, rightMatches, totalMatches } = matchStats;
    
    if (totalMatches === 0) {
      return "Que comece a batalha! 🏓⚡";
    }
    
    if (leftMatches === rightMatches) {
      const tieMessages = [
        "Está empatado! Quem vai dar o próximo golpe? 🤜🤛",
        "Empate técnico! Quem vai quebrar o impasse? ⚖️🔥",
        "Equilibrio perfeito! Hora do desempate! 🎯"
      ];
      return tieMessages[totalMatches % tieMessages.length];
    }
    
    const leader = leftMatches > rightMatches ? leftName : rightName;
    const loser = leftMatches > rightMatches ? rightName : leftName;
    const difference = Math.abs(leftMatches - rightMatches);
    
    if (difference === 1) {
      const closeMessages = [
        `${leader} está na frente por pouco! ${loser}, é a tua vez! 🔥`,
        `${leader} lidera por um! ${loser}, não desistas! 💪`,
        `Diferença mínima! ${loser}, volta por cima! ⚡`
      ];
      return closeMessages[totalMatches % closeMessages.length];
    } else if (difference <= 3) {
      const dominatingMessages = [
        `${leader} está a dominar! ${loser}, precisas de te esforçar mais! 😤`,
        `${leader} no comando! ${loser}, acorda aí! ⏰`,
        `${leader} na frente! ${loser}, contra-ataque já! 🚀`
      ];
      return dominatingMessages[totalMatches % dominatingMessages.length];
    } else {
      const crushingMessages = [
        `${leader} está a massacrar! ${loser}, estás a dormir? 😴💤`,
        `${leader} imparável! ${loser}, que vergonha! 🙈`,
        `${leader} está brutal! ${loser}, desiste ou luta? 🥊`,
        `${leader} é o rei! ${loser}, ainda consegues? 👑`
      ];
      return crushingMessages[totalMatches % crushingMessages.length];
    }
  }, [matchStats, leftName, rightName]);

  const phrase = useMemo(() => {
    if (leftWins === rightWins) return CONFIG.RESULT_MESSAGES.tie;
    const winnerName = leftWins > rightWins ? leftName : rightName;
    return CONFIG.RESULT_MESSAGES.winnerTemplate(winnerName);
  }, [leftWins, rightWins, leftName, rightName]);

  const handleShare = async () => {
    let shareText = `Ping-Pong\n${summary}`;
    let shareUrl = window.location.href;
    
    // Se Firebase habilitado e temos gameId, criar URL partilhável
    if (gameId && CONFIG.FIREBASE.enabled) {
      shareUrl = getShareableUrl(gameId);
      shareText += `\n\nVê em tempo real: ${shareUrl}`;
    }
    
    try {
      if (navigator.share) {
        await navigator.share({ 
          title: CONFIG.UI_TEXTS.shareTitle, 
          text: shareText,
          url: shareUrl 
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        alert("Link copiado para a área de transferência! 🔗");
      } else {
        prompt("Copia o link:", shareUrl);
      }
    } catch (_) {}
  };

  return (
    <div className="container">
      <div className="main-content">
        <header className="header">
          <div>
            <h1 className="title">{CONFIG.UI_TEXTS.title}</h1>
            {gameId && (
              <div className="game-info">
                <span className={`status ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? '🟢 Online' : '🔴 Offline'} 
                </span>
                <span className="game-id">ID: {gameId}</span>
              </div>
            )}
          </div>
          <div className="header-buttons">
            <button
              onClick={toggleDarkMode}
              className="dark-mode-btn"
              title={darkMode ? "Modo claro" : "Modo escuro"}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="history-btn"
              title="Ver histórico de partidas"
            >
              📊 Histórico
            </button>
            <button
              onClick={handleShare}
              className="share-btn"
            >
              {CONFIG.UI_TEXTS.shareButton}
            </button>
          </div>
        </header>

        <main>
          {showHistory ? (
            <MatchHistory 
              matches={matchHistory} 
              onClose={() => setShowHistory(false)}
              onClearHistory={() => {
                if (confirm("Tens a certeza que queres limpar todo o histórico?")) {
                  setMatchHistory([]);
                }
              }}
              onDeleteMatch={deleteMatchFromHistory}
            />
          ) : (
            <>
              <div className="card">
                <div className="players-grid">
                  <PlayerCard
                    name={leftName}
                    setName={setLeftName}
                    score={leftWins}
                    setScore={setLeftWins}
                    otherScore={rightWins}
                    pushHistory={pushHistory}
                    align="left"
                    onScoreChange={checkAutoComplete}
                  />
                  <PlayerCard
                    name={rightName}
                    setName={setRightName}
                    score={rightWins}
                    setScore={setRightWins}
                    otherScore={leftWins}
                    pushHistory={pushHistory}
                    align="right"
                    onScoreChange={checkAutoComplete}
                  />
                </div>

                <div className="divider" />
                <div className="info-section">
                  <div className="match-summary">{matchSummary}</div>
                  <div className="provocative-message">{provocativeMessage}</div>
                  <div className="current-game">
                    <span className="current-label">Partida atual:</span>
                    <span className="current-score">{summary}</span>
                  </div>
                  <div className="buttons">
                    <button
                      onClick={handleUndo}
                      disabled={history.length === 0}
                      className="btn"
                    >
                      {CONFIG.UI_TEXTS.undoButton}
                    </button>
                    <button
                      onClick={handleReset}
                      className="btn"
                    >
                      {CONFIG.UI_TEXTS.resetButton}
                    </button>
                  </div>
                </div>
              </div>

              <Tips />
            </>
          )}
        </main>

        <footer className="footer">
          {CONFIG.INSTALL_INSTRUCTIONS.footer}
        </footer>
      </div>
    </div>
  );
}

function PlayerCard({ name, setName, score, setScore, otherScore, pushHistory, align, onScoreChange }) {
  const handleChangeScore = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      // Corrigir ordem do histórico baseado no alinhamento
      if (align === 'left') {
        pushHistory(score, otherScore);
      } else {
        pushHistory(otherScore, score);
      }
      setScore(val);
      
      // Verificar se deve completar a partida
      if (onScoreChange) {
        const newScores = align === 'left' ? [val, otherScore] : [otherScore, val];
        onScoreChange(...newScores);
      }
    }
  };

  const handleIncrement = () => {
    // Corrigir ordem do histórico baseado no alinhamento
    if (align === 'left') {
      pushHistory(score, otherScore);
    } else {
      pushHistory(otherScore, score);
    }
    const newScore = score + 1;
    setScore(newScore);
    
    // Verificar se deve completar a partida
    if (onScoreChange) {
      const newScores = align === 'left' ? [newScore, otherScore] : [otherScore, newScore];
      onScoreChange(...newScores);
    }
  };

  return (
    <div className="player-section">
      <input
        value={name}
        onChange={(e) => setName(e.target.value.slice(0, 18))}
        className={`player-name-input ${align === "right" ? "right" : ""}`}
        placeholder="Jogador"
      />
      <div className="score-container">
        <input
          type="number"
          value={score}
          onChange={handleChangeScore}
          className="score-input"
        />
        <button
          onClick={handleIncrement}
          className="increment-btn"
          title="Adicionar vitória"
        >
          +
        </button>
      </div>
    </div>
  );
}

function MatchHistory({ matches, onClose, onClearHistory, onDeleteMatch }) {
  // Agrupar partidas por data
  const groupedMatches = useMemo(() => {
    const groups = {};
    
    matches.forEach(match => {
      const date = new Date(match.date);
      const dateKey = date.toLocaleDateString('pt-PT', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(match);
    });
    
    return groups;
  }, [matches]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const totalMatches = matches.length;
    const playerWins = {};
    
    matches.forEach(match => {
      if (match.winner === 'Empate') return;
      
      if (!playerWins[match.winner]) {
        playerWins[match.winner] = 0;
      }
      playerWins[match.winner]++;
    });
    
    return { totalMatches, playerWins };
  }, [matches]);

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>📊 Histórico de Partidas</h2>
        <div className="history-actions">
          {matches.length > 0 && (
            <button onClick={onClearHistory} className="clear-btn" title="Limpar histórico">
              🗑️
            </button>
          )}
          <button onClick={onClose} className="close-btn">
            ✕
          </button>
        </div>
      </div>

      {matches.length === 0 ? (
        <div className="empty-history">
          <p>📝 Nenhuma partida registada ainda.</p>
          <p>Complete partidas clicando em "Reset" para as ver aqui!</p>
        </div>
      ) : (
        <>
          <div className="history-stats">
            <div className="stat-card">
              <span className="stat-number">{stats.totalMatches}</span>
              <span className="stat-label">Partidas</span>
            </div>
            
            {Object.entries(stats.playerWins).map(([player, wins]) => (
              <div key={player} className="stat-card">
                <span className="stat-number">{wins}</span>
                <span className="stat-label">{player}</span>
              </div>
            ))}
          </div>

          <div className="matches-list">
            {Object.entries(groupedMatches).map(([date, dayMatches]) => (
              <div key={date} className="day-group">
                <h3 className="day-header">{date}</h3>
                <div className="day-matches">
                  {dayMatches.map(match => (
                    <div key={match.id} className="match-card">
                      <div className="match-info">
                        <div className="match-score">
                          <span className={`player ${match.winner === match.leftPlayer ? 'winner' : ''}`}>
                            {match.leftPlayer} {match.leftScore}
                          </span>
                          <span className="vs">-</span>
                          <span className={`player ${match.winner === match.rightPlayer ? 'winner' : ''}`}>
                            {match.rightScore} {match.rightPlayer}
                          </span>
                        </div>
                        <div className="match-time">
                          {new Date(match.date).toLocaleTimeString('pt-PT', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div className="match-actions">
                        <div className="match-winner">
                          {match.winner === 'Empate' ? (
                            <span className="tie">🤝 Empate</span>
                          ) : (
                            <span className="winner">🏆 {match.winner}</span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Tens a certeza que queres apagar esta partida?`)) {
                              onDeleteMatch(match.id);
                            }
                          }}
                          className="delete-match-btn"
                          title="Apagar partida"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Tips() {
  const [ios, setIos] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIos(/iphone|ipad|ipod/.test(ua));
  }, []);
  return (
    <div className="card tips-card">
      <h2 className="tips-title">{CONFIG.INSTALL_INSTRUCTIONS.title}</h2>
      {ios ? (
        <p 
          className="tips-text"
          dangerouslySetInnerHTML={{__html: CONFIG.INSTALL_INSTRUCTIONS.ios}}
        />
      ) : (
        <p 
          className="tips-text"
          dangerouslySetInnerHTML={{__html: CONFIG.INSTALL_INSTRUCTIONS.android}}
        />
      )}
    </div>
  );
}
