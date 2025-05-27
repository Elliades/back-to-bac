import React, { useState } from 'react';

const GameSetup = ({ onStartGame }) => {
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
      alert('Veuillez ajouter au moins un joueur !');
      return;
    }
    onStartGame(validNames, totalRounds, roundDuration);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Configuration de la partie
      </h2>

      <div className="space-y-6">
        {/* Players Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Joueurs
          </label>
          <div className="space-y-2">
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updatePlayerName(index, e.target.value)}
                  placeholder={`Nom du joueur ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            + Ajouter un joueur
          </button>
        </div>

        {/* Game Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de manches
            </label>
            <input
              type="number"
              min="1"
              max="26"
              value={totalRounds}
              onChange={(e) => setTotalRounds(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée par manche (secondes)
            </label>
            <select
              value={roundDuration}
              onChange={(e) => setRoundDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
              <option value={180}>3 minutes</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Règles du jeu :</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 1 point par mot trouvé</li>
            <li>• +1 point bonus si le mot est unique</li>
            <li>• +3 points bonus si toutes les catégories sont remplies</li>
            <li>• +5 points si tous les mots sont uniques</li>
          </ul>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartGame}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Commencer la partie
        </button>
      </div>
    </div>
  );
};

export default GameSetup; 