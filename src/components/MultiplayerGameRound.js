import React, { useState, useEffect, useCallback } from 'react';

const MultiplayerGameRound = ({ 
  game,
  currentPlayer,
  onSubmitAnswers,
  onFinishRound
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedPlayers, setSubmittedPlayers] = useState(new Set());

  // Initialize answers for current player
  useEffect(() => {
    if (currentPlayer && game.gameSettings.categories) {
      const initialAnswers = {};
      game.gameSettings.categories.forEach(category => {
        initialAnswers[category] = '';
      });
      setAnswers(initialAnswers);
    }
  }, [currentPlayer, game.gameSettings.categories]);

  // Calculate time left based on round start time
  useEffect(() => {
    if (game.roundStartTime && game.gameSettings.roundDuration) {
      const startTime = game.roundStartTime.toDate ? game.roundStartTime.toDate() : new Date(game.roundStartTime);
      const endTime = new Date(startTime.getTime() + game.gameSettings.roundDuration * 1000);
      
      const updateTimer = () => {
        const now = new Date();
        const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
        setTimeLeft(remaining);
        
        if (remaining === 0 && !isSubmitted) {
          handleSubmitAnswers();
        }
      };
      
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      
      return () => clearInterval(interval);
    }
  }, [game.roundStartTime, game.gameSettings.roundDuration, isSubmitted, handleSubmitAnswers]);

  // Track submitted players
  useEffect(() => {
    if (game.roundAnswers) {
      const submitted = new Set(Object.keys(game.roundAnswers));
      setSubmittedPlayers(submitted);
      
      // Check if all players have submitted
      if (submitted.size === game.players.length && submitted.size > 0) {
        // All players submitted, finish round
        setTimeout(() => {
          onFinishRound();
        }, 1000);
      }
    }
  }, [game.roundAnswers, game.players.length, onFinishRound]);

  const handleSubmitAnswers = useCallback(async () => {
    if (isSubmitted) return;
    
    setIsSubmitted(true);
    try {
      await onSubmitAnswers(currentPlayer.id, answers);
    } catch (error) {
      console.error('Error submitting answers:', error);
      setIsSubmitted(false);
    }
  }, [isSubmitted, currentPlayer.id, answers, onSubmitAnswers]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateAnswer = (category, value) => {
    if (isSubmitted) return;
    
    setAnswers(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const getPlayerStatus = (player) => {
    if (submittedPlayers.has(player.id)) {
      return { status: 'Terminé', color: 'bg-green-100 text-green-800' };
    }
    return { status: 'En cours', color: 'bg-yellow-100 text-yellow-800' };
  };

  if (!game || !currentPlayer) {
    return <div className="text-center text-red-600">Erreur: Données de jeu manquantes</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Manche {game.currentRound} / {game.gameSettings.totalRounds}
          </h2>
          <div className={`text-2xl font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-indigo-600'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-6xl font-bold text-indigo-600 mb-2">
            {game.currentLetter}
          </div>
          <p className="text-gray-600">
            Trouvez des mots commençant par cette lettre !
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Answer Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Vos réponses
            </h3>
            
            {isSubmitted ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                ✓ Réponses soumises ! En attente des autres joueurs...
              </div>
            ) : (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
                Remplissez vos réponses et cliquez sur "Terminer" ou attendez la fin du temps.
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {game.gameSettings.categories.map(category => (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {category}
                  </label>
                  <input
                    type="text"
                    value={answers[category] || ''}
                    onChange={(e) => updateAnswer(category, e.target.value)}
                    placeholder={`${category} commençant par ${game.currentLetter}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={isSubmitted}
                  />
                </div>
              ))}
            </div>

            {/* Progress and Submit */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {Object.values(answers).filter(answer => answer && answer.trim() !== '').length} / {game.gameSettings.categories.length} catégories remplies
              </div>
              
              <button
                onClick={handleSubmitAnswers}
                disabled={isSubmitted}
                className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitted ? 'Soumis ✓' : 'Terminer mes réponses'}
              </button>
            </div>
          </div>
        </div>

        {/* Players Status */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Statut des joueurs
            </h3>
            
            <div className="space-y-3">
              {game.players.map((player, index) => {
                const playerStatus = getPlayerStatus(player);
                return (
                  <div
                    key={player.id}
                    className={`p-3 rounded-lg border-2 ${
                      player.id === currentPlayer.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          player.isHost ? 'bg-yellow-500' : 'bg-indigo-500'
                        }`}>
                          {player.isHost ? '👑' : index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">
                            {player.name}
                            {player.id === currentPlayer.id && ' (Vous)'}
                          </div>
                          <div className="text-xs text-gray-600">
                            Score: {player.totalScore}
                          </div>
                        </div>
                      </div>
                      
                      <div className={`px-2 py-1 rounded text-xs font-medium ${playerStatus.color}`}>
                        {playerStatus.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 text-center">
                {submittedPlayers.size} / {game.players.length} joueurs ont terminé
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(submittedPlayers.size / game.players.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerGameRound; 