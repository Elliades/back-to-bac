import React, { useState, useEffect } from 'react';

const RoundResults = ({ 
  players, 
  currentRound, 
  totalRounds, 
  currentLetter, 
  categories, 
  answers, 
  onNextRound,
  calculateScores 
}) => {
  const [scoredPlayers, setScoredPlayers] = useState([]);
  const [wordCounts, setWordCounts] = useState({});

  useEffect(() => {
    // Calculate word frequencies
    const allAnswers = [];
    Object.values(answers).forEach(playerAnswers => {
      Object.values(playerAnswers).forEach(word => {
        if (word && word.trim()) {
          allAnswers.push(word.toLowerCase().trim());
        }
      });
    });
    
    const counts = {};
    allAnswers.forEach(word => {
      counts[word] = (counts[word] || 0) + 1;
    });
    
    setWordCounts(counts);

    // Calculate scores for display
    const scored = players.map(player => {
      const playerAnswers = answers[player.name] || {};
      let roundScore = 0;
      let wordsFound = 0;
      let uniqueWords = 0;
      let allCategoriesFilled = true;
      const wordDetails = {};

      categories.forEach(category => {
        const word = playerAnswers[category];
        if (word && word.trim()) {
          wordsFound++;
          roundScore += 1; // 1 point per word
          
          const normalizedWord = word.toLowerCase().trim();
          const isUnique = counts[normalizedWord] === 1;
          
          if (isUnique) {
            uniqueWords++;
            roundScore += 1; // 1 bonus for unique word
          }
          
          wordDetails[category] = {
            word: word.trim(),
            isUnique,
            points: isUnique ? 2 : 1
          };
        } else {
          allCategoriesFilled = false;
          wordDetails[category] = {
            word: '',
            isUnique: false,
            points: 0
          };
        }
      });

      // Bonus points
      let bonusPoints = 0;
      if (allCategoriesFilled) {
        bonusPoints += 3; // 3 points bonus if all categories filled
        roundScore += 3;
      }
      
      if (uniqueWords === wordsFound && wordsFound === categories.length) {
        bonusPoints += 5; // 5 points if all words are unique
        roundScore += 5;
      }

      return {
        ...player,
        roundScore,
        wordDetails,
        wordsFound,
        uniqueWords,
        allCategoriesFilled,
        bonusPoints
      };
    });

    setScoredPlayers(scored.sort((a, b) => b.roundScore - a.roundScore));
  }, [players, answers, categories]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Résultats - Manche {currentRound}
          </h2>
          <div className="text-4xl font-bold text-indigo-600 mb-2">
            Lettre : {currentLetter}
          </div>
        </div>
      </div>

      {/* Results for each player */}
      <div className="space-y-6 mb-6">
        {scoredPlayers.map((player, index) => (
          <div key={player.name} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                }`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {player.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">
                  {player.roundScore} points
                </div>
                <div className="text-sm text-gray-600">
                  Total: {player.totalScore + player.roundScore}
                </div>
              </div>
            </div>

            {/* Words grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              {categories.map(category => {
                const detail = player.wordDetails[category];
                return (
                  <div key={category} className={`p-3 rounded-lg border-2 ${
                    detail.word ? 
                      detail.isUnique ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      {category}
                    </div>
                    <div className="font-semibold">
                      {detail.word || '-'}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {detail.points > 0 && (
                        <span className={detail.isUnique ? 'text-green-600' : 'text-blue-600'}>
                          {detail.points} pt{detail.isUnique ? ' (unique)' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Score breakdown */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 space-y-1">
                <div>Mots trouvés: {player.wordsFound} × 1pt = {player.wordsFound}pts</div>
                <div>Mots uniques: {player.uniqueWords} × 1pt = {player.uniqueWords}pts</div>
                {player.bonusPoints > 0 && (
                  <div className="text-green-600 font-medium">
                    Bonus: +{player.bonusPoints}pts
                    {player.allCategoriesFilled && ' (toutes catégories)'}
                    {player.uniqueWords === player.wordsFound && player.wordsFound === categories.length && ' (tous uniques)'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next round button */}
      <div className="text-center">
        <button
          onClick={onNextRound}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          {currentRound >= totalRounds ? 'Voir les résultats finaux' : 'Manche suivante'}
        </button>
      </div>
    </div>
  );
};

export default RoundResults; 