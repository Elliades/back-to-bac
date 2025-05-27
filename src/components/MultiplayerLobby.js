import React, { useState } from 'react';

const MultiplayerLobby = ({ onCreateGame, onJoinGame, onBackToMenu }) => {
  const [mode, setMode] = useState('menu'); // menu, create, join
  const [playerName, setPlayerName] = useState('');
  const [gameId, setGameId] = useState('');
  const [gameSettings, setGameSettings] = useState({
    totalRounds: 10,
    roundDuration: 180
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      setError('Veuillez entrer votre nom');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onCreateGame(playerName.trim(), gameSettings);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de la partie');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      setError('Veuillez entrer votre nom');
      return;
    }

    if (!gameId.trim()) {
      setError('Veuillez entrer le code de la partie');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await onJoinGame(gameId.trim(), playerName.trim());
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion à la partie');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'menu') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Mode Multijoueur
          </h2>
          
          <div className="space-y-4">
            <button
              onClick={() => setMode('create')}
              className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              🎮 Créer une partie
            </button>
            
            <button
              onClick={() => setMode('join')}
              className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
            >
              🔗 Rejoindre une partie
            </button>
            
            <button
              onClick={onBackToMenu}
              className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Retour au menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Créer une partie
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre nom
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Entrez votre nom..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de manches
              </label>
              <select
                value={gameSettings.totalRounds}
                onChange={(e) => setGameSettings({...gameSettings, totalRounds: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              >
                <option value={5}>5 manches</option>
                <option value={10}>10 manches</option>
                <option value={15}>15 manches</option>
                <option value={20}>20 manches</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée par manche
              </label>
              <select
                value={gameSettings.roundDuration}
                onChange={(e) => setGameSettings({...gameSettings, roundDuration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              >
                <option value={60}>1 minute</option>
                <option value={120}>2 minutes</option>
                <option value={180}>3 minutes</option>
                <option value={240}>4 minutes</option>
                <option value={300}>5 minutes</option>
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCreateGame}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Création...' : 'Créer la partie'}
              </button>
              
              <button
                onClick={() => setMode('menu')}
                disabled={loading}
                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Rejoindre une partie
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre nom
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Entrez votre nom..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code de la partie
              </label>
              <input
                type="text"
                value={gameId}
                onChange={(e) => setGameId(e.target.value.toUpperCase())}
                placeholder="Entrez le code de la partie..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-center text-lg"
                disabled={loading}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleJoinGame}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Connexion...' : 'Rejoindre'}
              </button>
              
              <button
                onClick={() => setMode('menu')}
                disabled={loading}
                className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default MultiplayerLobby; 