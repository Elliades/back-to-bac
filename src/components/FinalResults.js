import React from 'react';

const FinalResults = ({ results, totalRounds, onRestartGame, onBackToMenu, isMultiplayer = false }) => {
  const winner = results[0];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Winner Announcement */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg shadow-lg p-8 mb-8 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-4xl font-bold text-white mb-2">
          Félicitations !
        </h2>
        <h3 className="text-2xl text-yellow-100 mb-4">
          {winner.name} remporte la partie !
        </h3>
        <div className="text-xl text-yellow-100">
          Score final : {winner.totalScore} points
        </div>
      </div>

      {/* Final Rankings */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Classement final
        </h3>
        
        <div className="space-y-4">
          {results.map((player, index) => (
            <div
              key={player.name}
              className={`p-4 rounded-lg border-2 ${
                index === 0 ? 'border-yellow-500 bg-yellow-50' :
                index === 1 ? 'border-gray-400 bg-gray-50' :
                index === 2 ? 'border-orange-600 bg-orange-50' :
                'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' :
                    'bg-gray-300'
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {player.name}
                    </h4>
                    <p className="text-gray-600">
                      {player.totalScore} points • Moyenne: {(player.totalScore / totalRounds).toFixed(1)} pts/manche
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    #{player.rank}
                  </div>
                </div>
              </div>
              
              {/* Round scores breakdown */}
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Scores par manche :</p>
                <div className="flex flex-wrap gap-2">
                  {player.roundScores?.map((score, roundIndex) => (
                    <span
                      key={roundIndex}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm font-medium"
                    >
                      M{roundIndex + 1}: {score}
                    </span>
                  )) || <span className="text-gray-500 text-sm">Aucun score disponible</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Statistics */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Statistiques de la partie
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {totalRounds}
            </div>
            <div className="text-sm text-gray-600">Manches jouées</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {results.length}
            </div>
            <div className="text-sm text-gray-600">Joueurs</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.max(...results.map(p => p.totalScore))}
            </div>
            <div className="text-sm text-gray-600">Score max</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">
              {Math.round(results.reduce((sum, p) => sum + p.totalScore, 0) / results.length)}
            </div>
            <div className="text-sm text-gray-600">Score moyen</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        {!isMultiplayer && (
          <button
            onClick={onRestartGame}
            className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors mr-4"
          >
            🔄 Nouvelle partie
          </button>
        )}
        
        {onBackToMenu && (
          <button
            onClick={onBackToMenu}
            className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Retour au menu
          </button>
        )}
      </div>

      {/* Thank you message */}
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Merci d'avoir joué au Jeu du BAC Français ! 🎉
        </p>
        {isMultiplayer && (
          <p className="text-sm text-gray-500 mt-2">
            Partie multijoueur terminée
          </p>
        )}
      </div>
    </div>
  );
};

export default FinalResults; 