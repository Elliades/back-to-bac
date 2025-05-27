import React, { useState } from 'react';

const GameSetup = ({ onStartGame, onBackToMenu }) => {
  const [playerNames, setPlayerNames] = useState(['']);
  const [totalRounds, setTotalRounds] = useState(10);
  const [roundDuration, setRoundDuration] = useState(180); // 3 minutes

  const addPlayer = () => {
    setPlayerNames([...playerNames, '']);
  };

  const removePlayer = (index) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index, name) => {
    const updated = [...playerNames];
    updated[index] = name;
    setPlayerNames(updated);
  };

  const handleStartGame = () => {
    const validNames = playerNames.filter(name => name.trim() !== '');
    if (validNames.length === 0) {
      alert('Veuillez ajouter au moins un joueur');
      return;
    }
    onStartGame(validNames, totalRounds, roundDuration);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Configuration de la partie
        </h2>
        
        {/* Players Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Joueurs</h3>
          <div className="space-y-3">
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  placeholder={`Nom du joueur ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {playerNames.length > 1 && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <button
            onClick={addPlayer}
            className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            + Ajouter un joueur
          </button>
        </div>

        {/* Game Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de manches
            </label>
            <select
              value={totalRounds}
              onChange={(e) => setTotalRounds(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              value={roundDuration}
              onChange={(e) => setRoundDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
              <option value={240}>4 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>
        </div>

        {/* Categories Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Catégories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Prénom', 'Ville', 'Animal', 'Objet', 'Métier', 'Nourriture'].map((category, index) => (
              <div key={index} className="bg-indigo-100 text-indigo-800 px-3 py-2 rounded-md text-center text-sm font-medium">
                {category}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Retour au menu
            </button>
          )}
          
          <button
            onClick={handleStartGame}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Commencer la partie
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameSetup; 