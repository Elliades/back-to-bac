import React, { useState, useEffect } from 'react';
import MainMenu from './components/MainMenu';
import GameSetup from './components/GameSetup';
import GameRound from './components/GameRound';
import RoundResults from './components/RoundResults';
import FinalResults from './components/FinalResults';
import MultiplayerLobby from './components/MultiplayerLobby';
import GameWaitingRoom from './components/GameWaitingRoom';
import MultiplayerGameRound from './components/MultiplayerGameRound';
import { gameService } from './services/gameService';

const CATEGORIES = ['Prénom', 'Ville', 'Animal', 'Objet', 'Métier', 'Nourriture'];

function App() {
  // Game mode state
  const [gameMode, setGameMode] = useState('menu'); // menu, singlePlayer, multiplayer
  
  // Single player state
  const [gameState, setGameState] = useState('setup'); // setup, playing, roundResults, finalResults
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(10);
  const [roundDuration, setRoundDuration] = useState(180); // 3 minutes in seconds
  const [currentLetter, setCurrentLetter] = useState('');
  const [roundAnswers, setRoundAnswers] = useState({});
  const [gameResults, setGameResults] = useState([]);

  // Multiplayer state
  const [multiplayerState, setMultiplayerState] = useState('lobby'); // lobby, waiting, playing, roundResults, finished
  const [currentGame, setCurrentGame] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameSubscription, setGameSubscription] = useState(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameSubscription) {
        gameSubscription();
      }
    };
  }, [gameSubscription]);

  // Handle game updates for multiplayer
  const handleGameUpdate = (gameData) => {
    if (!gameData) {
      // Game was deleted
      setGameMode('menu');
      setMultiplayerState('lobby');
      setCurrentGame(null);
      setCurrentPlayer(null);
      return;
    }

    setCurrentGame(gameData);

    // Update multiplayer state based on game state
    switch (gameData.gameState) {
      case 'waiting':
        setMultiplayerState('waiting');
        break;
      case 'playing':
        setMultiplayerState('playing');
        break;
      case 'roundResults':
        setMultiplayerState('roundResults');
        break;
      case 'finished':
        setMultiplayerState('finished');
        break;
      default:
        break;
    }
  };

  // Single Player Functions
  const generateRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  };

  const startSinglePlayerGame = (playerNames, rounds, duration) => {
    try {
      const initialPlayers = playerNames.map(name => ({
        name,
        totalScore: 0,
        roundScores: []
      }));
      
      setPlayers(initialPlayers);
      setTotalRounds(rounds);
      setRoundDuration(duration);
      setCurrentRound(1);
      setGameResults([]);
      startNewSinglePlayerRound();
    } catch (error) {
      console.error('Error starting single player game:', error);
    }
  };

  const startNewSinglePlayerRound = () => {
    try {
      const letter = generateRandomLetter();
      setCurrentLetter(letter);
      setRoundAnswers({});
      setGameState('playing');
    } catch (error) {
      console.error('Error starting new round:', error);
    }
  };

  const finishSinglePlayerRound = (answers) => {
    try {
      setRoundAnswers(answers || {});
      setGameState('roundResults');
    } catch (error) {
      console.error('Error finishing round:', error);
    }
  };

  const calculateSinglePlayerScores = (answers) => {
    try {
      const allAnswers = [];
      Object.values(answers || {}).forEach(playerAnswers => {
        if (playerAnswers && typeof playerAnswers === 'object') {
          Object.values(playerAnswers).forEach(word => {
            if (word && typeof word === 'string' && word.trim()) {
              allAnswers.push(word.toLowerCase().trim());
            }
          });
        }
      });
      
      const wordCounts = {};
      allAnswers.forEach(word => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });

      const updatedPlayers = players.map(player => {
        const playerAnswers = answers[player.name] || {};
        let roundScore = 0;
        let wordsFound = 0;
        let uniqueWords = 0;
        let allCategoriesFilled = true;

        CATEGORIES.forEach(category => {
          const word = playerAnswers[category];
          if (word && typeof word === 'string' && word.trim()) {
            wordsFound++;
            roundScore += 1;
            
            const normalizedWord = word.toLowerCase().trim();
            if (wordCounts[normalizedWord] === 1) {
              uniqueWords++;
              roundScore += 1;
            }
          } else {
            allCategoriesFilled = false;
          }
        });

        if (allCategoriesFilled) {
          roundScore += 3;
        }
        
        if (uniqueWords === wordsFound && wordsFound === CATEGORIES.length) {
          roundScore += 5;
        }

        return {
          ...player,
          totalScore: player.totalScore + roundScore,
          roundScores: [...player.roundScores, roundScore]
        };
      });

      setPlayers(updatedPlayers);
      return updatedPlayers;
    } catch (error) {
      console.error('Error calculating scores:', error);
      return players;
    }
  };

  const nextSinglePlayerRound = () => {
    try {
      const updatedPlayers = calculateSinglePlayerScores(roundAnswers);
      
      if (currentRound >= totalRounds) {
        const finalResults = updatedPlayers
          .sort((a, b) => b.totalScore - a.totalScore)
          .map((player, index) => ({
            ...player,
            rank: index + 1
          }));
        
        setGameResults(finalResults);
        setGameState('finalResults');
      } else {
        setCurrentRound(currentRound + 1);
        startNewSinglePlayerRound();
      }
    } catch (error) {
      console.error('Error proceeding to next round:', error);
    }
  };

  const restartSinglePlayerGame = () => {
    try {
      setGameState('setup');
      setPlayers([]);
      setCurrentRound(1);
      setGameResults([]);
      setRoundAnswers({});
    } catch (error) {
      console.error('Error restarting game:', error);
    }
  };

  // Multiplayer Functions
  const createMultiplayerGame = async (hostName, gameSettings) => {
    try {
      const game = await gameService.createGame(hostName, {
        ...gameSettings,
        categories: CATEGORIES
      });
      
      const host = game.players[0];
      setCurrentGame(game);
      setCurrentPlayer(host);
      setMultiplayerState('waiting');
      
      // Subscribe to game updates
      const unsubscribe = gameService.subscribeToGame(game.id, handleGameUpdate);
      setGameSubscription(unsubscribe);
    } catch (error) {
      console.error('Error creating multiplayer game:', error);
      throw error;
    }
  };

  const joinMultiplayerGame = async (gameId, playerName) => {
    try {
      const game = await gameService.joinGame(gameId, playerName);
      const player = game.players.find(p => p.name === playerName);
      
      setCurrentGame(game);
      setCurrentPlayer(player);
      setMultiplayerState('waiting');
      
      // Subscribe to game updates
      const unsubscribe = gameService.subscribeToGame(gameId, handleGameUpdate);
      setGameSubscription(unsubscribe);
    } catch (error) {
      console.error('Error joining multiplayer game:', error);
      throw error;
    }
  };

  const startMultiplayerGame = async () => {
    try {
      if (currentGame && currentPlayer?.isHost) {
        await gameService.startGame(currentGame.id);
      }
    } catch (error) {
      console.error('Error starting multiplayer game:', error);
    }
  };

  const submitMultiplayerAnswers = async (playerId, answers) => {
    try {
      if (currentGame) {
        await gameService.submitAnswers(currentGame.id, playerId, answers);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      throw error;
    }
  };

  const finishMultiplayerRound = async () => {
    try {
      if (currentGame && currentPlayer?.isHost) {
        await gameService.finishRound(currentGame.id);
      }
    } catch (error) {
      console.error('Error finishing round:', error);
    }
  };

  const nextMultiplayerRound = async () => {
    try {
      if (currentGame && currentPlayer?.isHost) {
        await gameService.nextRound(currentGame.id);
      }
    } catch (error) {
      console.error('Error starting next round:', error);
    }
  };

  const leaveMultiplayerGame = async () => {
    try {
      if (currentGame && currentPlayer) {
        await gameService.leaveGame(currentGame.id, currentPlayer.id);
      }
      
      if (gameSubscription) {
        gameSubscription();
        setGameSubscription(null);
      }
      
      setGameMode('menu');
      setMultiplayerState('lobby');
      setCurrentGame(null);
      setCurrentPlayer(null);
    } catch (error) {
      console.error('Error leaving game:', error);
    }
  };

  const backToMenu = () => {
    if (gameSubscription) {
      gameSubscription();
      setGameSubscription(null);
    }
    
    setGameMode('menu');
    setGameState('setup');
    setMultiplayerState('lobby');
    setCurrentGame(null);
    setCurrentPlayer(null);
    setPlayers([]);
    setGameResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Jeu du BAC Français
          </h1>
          <p className="text-gray-600">
            Trouvez des mots pour chaque catégorie avec la lettre donnée !
          </p>
        </header>

        {/* Main Menu */}
        {gameMode === 'menu' && (
          <MainMenu
            onSinglePlayer={() => setGameMode('singlePlayer')}
            onMultiplayer={() => setGameMode('multiplayer')}
          />
        )}

        {/* Single Player Mode */}
        {gameMode === 'singlePlayer' && (
          <>
            {gameState === 'setup' && (
              <GameSetup onStartGame={startSinglePlayerGame} onBackToMenu={backToMenu} />
            )}

            {gameState === 'playing' && (
              <GameRound
                players={players}
                currentRound={currentRound}
                totalRounds={totalRounds}
                currentLetter={currentLetter}
                categories={CATEGORIES}
                duration={roundDuration}
                onFinishRound={finishSinglePlayerRound}
              />
            )}

            {gameState === 'roundResults' && (
              <RoundResults
                players={players}
                currentRound={currentRound}
                totalRounds={totalRounds}
                currentLetter={currentLetter}
                categories={CATEGORIES}
                answers={roundAnswers}
                onNextRound={nextSinglePlayerRound}
                calculateScores={calculateSinglePlayerScores}
              />
            )}

            {gameState === 'finalResults' && (
              <FinalResults
                results={gameResults}
                totalRounds={totalRounds}
                onRestartGame={restartSinglePlayerGame}
                onBackToMenu={backToMenu}
              />
            )}
          </>
        )}

        {/* Multiplayer Mode */}
        {gameMode === 'multiplayer' && (
          <>
            {multiplayerState === 'lobby' && (
              <MultiplayerLobby
                onCreateGame={createMultiplayerGame}
                onJoinGame={joinMultiplayerGame}
                onBackToMenu={backToMenu}
              />
            )}

            {multiplayerState === 'waiting' && currentGame && currentPlayer && (
              <GameWaitingRoom
                game={currentGame}
                currentPlayer={currentPlayer}
                onStartGame={startMultiplayerGame}
                onLeaveGame={leaveMultiplayerGame}
              />
            )}

            {multiplayerState === 'playing' && currentGame && currentPlayer && (
              <MultiplayerGameRound
                game={currentGame}
                currentPlayer={currentPlayer}
                onSubmitAnswers={submitMultiplayerAnswers}
                onFinishRound={finishMultiplayerRound}
              />
            )}

            {multiplayerState === 'roundResults' && currentGame && currentPlayer && (
              <RoundResults
                players={currentGame.players}
                currentRound={currentGame.currentRound}
                totalRounds={currentGame.gameSettings.totalRounds}
                currentLetter={currentGame.currentLetter}
                categories={currentGame.gameSettings.categories}
                answers={currentGame.roundAnswers}
                onNextRound={nextMultiplayerRound}
                calculateScores={() => currentGame.players}
                isMultiplayer={true}
                isHost={currentPlayer?.isHost}
              />
            )}

            {multiplayerState === 'finished' && currentGame && (
              <FinalResults
                results={currentGame.players.sort((a, b) => b.totalScore - a.totalScore).map((player, index) => ({
                  ...player,
                  rank: index + 1
                }))}
                totalRounds={currentGame.gameSettings.totalRounds}
                onRestartGame={backToMenu}
                onBackToMenu={backToMenu}
                isMultiplayer={true}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
