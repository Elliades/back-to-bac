import React, { useState, useEffect } from 'react';
import GameSetup from './components/GameSetup';
import GameRound from './components/GameRound';
import RoundResults from './components/RoundResults';
import FinalResults from './components/FinalResults';

const CATEGORIES = ['Prénom', 'Ville', 'Animal', 'Objet', 'Métier', 'Nourriture'];

function App() {
  const [gameState, setGameState] = useState('setup'); // setup, playing, roundResults, finalResults
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(10);
  const [roundDuration, setRoundDuration] = useState(180); // 3 minutes in seconds
  const [currentLetter, setCurrentLetter] = useState('');
  const [roundAnswers, setRoundAnswers] = useState({});
  const [gameResults, setGameResults] = useState([]);

  const generateRandomLetter = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  };

  const startGame = (playerNames, rounds, duration) => {
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
    startNewRound();
  };

  const startNewRound = () => {
    const letter = generateRandomLetter();
    setCurrentLetter(letter);
    setRoundAnswers({});
    setGameState('playing');
  };

  const finishRound = (answers) => {
    setRoundAnswers(answers);
    setGameState('roundResults');
  };

  const calculateScores = (answers) => {
    const allAnswers = Object.values(answers).flat();
    const wordCounts = {};
    
    // Count occurrences of each word
    allAnswers.forEach(word => {
      if (word && word.trim()) {
        const normalizedWord = word.toLowerCase().trim();
        wordCounts[normalizedWord] = (wordCounts[normalizedWord] || 0) + 1;
      }
    });

    const updatedPlayers = players.map(player => {
      const playerAnswers = answers[player.name] || {};
      let roundScore = 0;
      let wordsFound = 0;
      let uniqueWords = 0;
      let allCategoriesFilled = true;

      CATEGORIES.forEach(category => {
        const word = playerAnswers[category];
        if (word && word.trim()) {
          wordsFound++;
          roundScore += 1; // 1 point per word
          
          const normalizedWord = word.toLowerCase().trim();
          if (wordCounts[normalizedWord] === 1) {
            uniqueWords++;
            roundScore += 1; // 1 bonus for unique word
          }
        } else {
          allCategoriesFilled = false;
        }
      });

      // Bonus points
      if (allCategoriesFilled) {
        roundScore += 3; // 3 points bonus if all categories filled
      }
      
      if (uniqueWords === wordsFound && wordsFound === CATEGORIES.length) {
        roundScore += 5; // 5 points if all words are unique
      }

      return {
        ...player,
        totalScore: player.totalScore + roundScore,
        roundScores: [...player.roundScores, roundScore]
      };
    });

    setPlayers(updatedPlayers);
    return updatedPlayers;
  };

  const nextRound = () => {
    const updatedPlayers = calculateScores(roundAnswers);
    
    if (currentRound >= totalRounds) {
      // Game finished
      const finalResults = updatedPlayers
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((player, index) => ({
          ...player,
          rank: index + 1
        }));
      
      setGameResults(finalResults);
      setGameState('finalResults');
    } else {
      // Next round
      setCurrentRound(currentRound + 1);
      startNewRound();
    }
  };

  const restartGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentRound(1);
    setGameResults([]);
    setRoundAnswers({});
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

        {gameState === 'setup' && (
          <GameSetup onStartGame={startGame} />
        )}

        {gameState === 'playing' && (
          <GameRound
            players={players}
            currentRound={currentRound}
            totalRounds={totalRounds}
            currentLetter={currentLetter}
            categories={CATEGORIES}
            duration={roundDuration}
            onFinishRound={finishRound}
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
            onNextRound={nextRound}
            calculateScores={calculateScores}
          />
        )}

        {gameState === 'finalResults' && (
          <FinalResults
            results={gameResults}
            totalRounds={totalRounds}
            onRestartGame={restartGame}
          />
        )}
      </div>
    </div>
  );
}

export default App;
