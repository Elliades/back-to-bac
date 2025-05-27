import React, { useState } from 'react';

const GameWaitingRoom = ({ 
  game, 
  currentPlayer, 
  onStartGame, 
  onLeaveGame 
}) => {
  const [copying, setCopying] = useState(false);

  const copyGameId = async () => {
    try {
      await navigator.clipboard.writeText(game.id);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (err) {
      console.error('Failed to copy game ID:', err);
    }
  };

  const isHost = currentPlayer?.isHost;
  const canStart = game.players.length >= 2; // Minimum 2 players to start

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Info Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Salle d'attente
          </h2>
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Code de la partie :</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl font-mono font-bold text-indigo-600">
                {game.id}
              </span>
              <button
                onClick={copyGameId}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition-colors"
              >
                {copying ? '✓ Copié' : '📋 Copier'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Manches :</span> {game.gameSettings.totalRounds}
            </div>
            <div>
              <span className="font-medium">Durée :</span> {Math.floor(game.gameSettings.roundDuration / 60)} min
            </div>
          </div>
        </div>
      </div>

      {/* Players List */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Joueurs ({game.players.length})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {game.players.map((player, index) => (
            <div
              key={player.id}
              className={`p-4 rounded-lg border-2 ${
                player.id === currentPlayer?.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    player.isHost ? 'bg-yellow-500' : 'bg-indigo-500'
                  }`}>
                    {player.isHost ? '👑' : index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {player.name}
                      {player.id === currentPlayer?.id && ' (Vous)'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {player.isHost ? 'Hôte' : 'Joueur'}
                    </div>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  player.isReady 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {player.isReady ? 'Prêt' : 'En attente'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Rules */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Règles du jeu
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Catégories :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {game.gameSettings.categories.map((category, index) => (
                <li key={index}>• {category}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Scoring :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 1 point par mot trouvé</li>
              <li>• +1 point si le mot est unique</li>
              <li>• +3 points si toutes les catégories sont remplies</li>
              <li>• +5 points si tous les mots sont uniques</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={onLeaveGame}
            className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Quitter la partie
          </button>
          
          {isHost ? (
            <div className="text-right">
              {!canStart && (
                <p className="text-sm text-gray-600 mb-2">
                  Attendez qu'au moins 2 joueurs rejoignent la partie
                </p>
              )}
              <button
                onClick={onStartGame}
                disabled={!canStart}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {canStart ? 'Commencer la partie' : 'En attente de joueurs...'}
              </button>
            </div>
          ) : (
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-2">
                En attente que l'hôte démarre la partie...
              </p>
              <div className="px-8 py-3 bg-gray-300 text-gray-600 font-semibold rounded-lg">
                En attente...
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Partagez le code <span className="font-mono font-bold">{game.id}</span> avec vos amis pour qu'ils puissent rejoindre la partie !
        </p>
      </div>
    </div>
  );
};

export default GameWaitingRoom; 