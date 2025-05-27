import React from 'react';

const MainMenu = ({ onSinglePlayer, onMultiplayer }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Jeu du BAC Français
          </h2>
          <p className="text-gray-600">
            Trouvez des mots pour chaque catégorie !
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={onSinglePlayer}
            className="w-full px-6 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-3"
          >
            <span className="text-2xl">👤</span>
            <div className="text-left">
              <div className="font-semibold">Solo</div>
              <div className="text-sm opacity-90">Jouer seul</div>
            </div>
          </button>
          
          <button
            onClick={onMultiplayer}
            className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-3"
          >
            <span className="text-2xl">👥</span>
            <div className="text-left">
              <div className="font-semibold">Multijoueur</div>
              <div className="text-sm opacity-90">Jouer avec des amis</div>
            </div>
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <div className="text-sm text-gray-500">
            <p className="mb-2">Catégories : Prénom • Ville • Animal • Objet • Métier • Nourriture</p>
            <p>Trouvez des mots commençant par la lettre donnée !</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenu; 