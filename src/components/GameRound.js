import React, { useState, useEffect } from 'react';

const GameRound = ({ 
  players, 
  currentRound, 
  totalRounds, 
  currentLetter, 
  categories, 
  duration, 
  onFinishRound 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [answers, setAnswers] = useState({});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);

  // Initialize answers for all players
  useEffect(() => {
    const initialAnswers = {};
    players.forEach(player => {
      initialAnswers[player.name] = {};
      categories.forEach(category => {
        initialAnswers[player.name][category] = '';
      });
    });
    setAnswers(initialAnswers);
  }, [players, categories]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && isGameActive) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleFinishRound();
    }
  }, [timeLeft, isGameActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateAnswer = (playerName, category, value) => {
    setAnswers(prev => ({
      ...prev,
      [playerName]: {
        ...prev[playerName],
        [category]: value
      }
    }));
  };

  const handleFinishRound = () => {
    setIsGameActive(false);
    onFinishRound(answers);
  };

  const nextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
    }
  };

  const prevPlayer = () => {
    if (currentPlayerIndex > 0) {
      setCurrentPlayerIndex(currentPlayerIndex - 1);
    }
  };

  const currentPlayer = players[currentPlayerIndex];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Manche {currentRound} / {totalRounds}
          </h2>
          <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-indigo-600'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-6xl font-bold text-indigo-600 mb-2">
            {currentLetter}
          </div>
          <p className="text-gray-600">
            Trouvez des mots commençant par cette lettre !
          </p>
        </div>
      </div>

      {/* Player Navigation */}
      {players.length > 1 && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={prevPlayer}
              disabled={currentPlayerIndex === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Précédent
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800">
                {currentPlayer.name}
              </h3>
              <p className="text-sm text-gray-600">
                Joueur {currentPlayerIndex + 1} / {players.length}
              </p>
            </div>
            
            <button
              onClick={nextPlayer}
              disabled={currentPlayerIndex === players.length - 1}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* Answer Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Réponses de {currentPlayer.name}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => (
            <div key={category}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {category}
              </label>
              <input
                type="text"
                value={answers[currentPlayer.name]?.[category] || ''}
                onChange={(e) => updateAnswer(currentPlayer.name, category, e.target.value)}
                placeholder={`${category} commençant par ${currentLetter}...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={!isGameActive}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress and Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {Object.values(answers[currentPlayer.name] || {}).filter(answer => answer.trim() !== '').length} / {categories.length} catégories remplies
          </div>
          
          <button
            onClick={handleFinishRound}
            disabled={!isGameActive}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Terminer la manche
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameRound; 