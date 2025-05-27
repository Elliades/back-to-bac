import React from 'react';

const FinalResults = ({ results, totalRounds, onRestartGame }) => {
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
          Classement Final
        </h3>
        
        <div className="space-y-4">
          {results.map((player, index) => (
            <div key={player.name} className={`p-4 rounded-lg border-2 ${
              index === 0 ? 'border-yellow-400 bg-yellow-50' :
              index === 1 ? 'border-gray-400 bg-gray-50' :
              index === 2 ? 'border-orange-400 bg-orange-50' :
              'border-gray-300 bg-gray-50'
            }`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-600' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">
                      {player.name}
                    </h4>
                    <p className="text-gray-600">
                      Moyenne: {(player.totalScore / totalRounds).toFixed(1)} pts/manche
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-indigo-600">
                    {player.totalScore}
                  </div>
                  <div className="text-sm text-gray-600">
                    points
                  </div>
                </div>
              </div>
              
              {/* Round scores */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">
                  Scores par manche :
                </div>
                <div className="flex flex-wrap gap-2">
                  {player.roundScores.map((score, roundIndex) => (
                    <span key={roundIndex} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">
                      M{roundIndex + 1}: {score}
                    </span>
                  ))}
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {totalRounds}
            </div>
            <div className="text-sm text-gray-600">
              Manches jouées
            </div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.max(...results.map(p => p.totalScore))}
            </div>
            <div className="text-sm text-gray-600">
              Meilleur score
            </div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(results.reduce((sum, p) => sum + p.totalScore, 0) / results.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">
              Score moyen
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-y-4">
        <button
          onClick={onRestartGame}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Nouvelle partie
        </button>
        
        <div className="text-sm text-gray-600">
          Merci d'avoir joué au Jeu du BAC Français !
        </div>
      </div>
    </div>
  );
};

export default FinalResults; 