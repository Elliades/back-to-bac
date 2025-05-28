import { 
  doc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export class GameService {
  constructor() {
    this.gameListeners = new Map();
  }

  // Create a new game room
  async createGame(hostName, gameSettings) {
    try {
      // Generate a short game code
      const gameCode = this.generateGameCode();
      
      const gameData = {
        hostName,
        gameSettings: {
          totalRounds: gameSettings.totalRounds || 10,
          roundDuration: gameSettings.roundDuration || 180,
          categories: gameSettings.categories || ['Prénom', 'Ville', 'Animal', 'Objet', 'Métier', 'Nourriture']
        },
        players: [
          {
            name: hostName,
            id: this.generatePlayerId(),
            isHost: true,
            totalScore: 0,
            roundScores: [],
            isReady: false
          }
        ],
        gameState: 'waiting', // waiting, playing, roundResults, finished
        currentRound: 0,
        currentLetter: '',
        roundAnswers: {},
        roundStartTime: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Use the game code as the document ID
      const gameRef = doc(db, 'games', gameCode);
      await setDoc(gameRef, gameData);
      
      return { id: gameCode, ...gameData };
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  // Join an existing game
  async joinGame(gameId, playerName) {
    try {
      const gameRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        throw new Error('Game not found');
      }

      const gameData = gameSnap.data();
      
      if (gameData.gameState !== 'waiting') {
        throw new Error('Game has already started');
      }

      // Check if player name already exists
      if (gameData.players.some(p => p.name === playerName)) {
        throw new Error('Player name already taken');
      }

      const newPlayer = {
        name: playerName,
        id: this.generatePlayerId(),
        isHost: false,
        totalScore: 0,
        roundScores: [],
        isReady: false
      };

      await updateDoc(gameRef, {
        players: [...gameData.players, newPlayer],
        updatedAt: serverTimestamp()
      });

      return { id: gameId, ...gameData, players: [...gameData.players, newPlayer] };
    } catch (error) {
      console.error('Error joining game:', error);
      throw error;
    }
  }

  // Start the game (host only)
  async startGame(gameId) {
    try {
      const gameRef = doc(db, 'games', gameId);
      const currentLetter = this.generateRandomLetter();
      
      await updateDoc(gameRef, {
        gameState: 'playing',
        currentRound: 1,
        currentLetter,
        roundStartTime: serverTimestamp(),
        roundAnswers: {},
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  }

  // Submit answers for current round
  async submitAnswers(gameId, playerId, answers) {
    try {
      const gameRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        throw new Error('Game not found');
      }

      const gameData = gameSnap.data();
      const updatedAnswers = {
        ...gameData.roundAnswers,
        [playerId]: answers
      };

      await updateDoc(gameRef, {
        roundAnswers: updatedAnswers,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error submitting answers:', error);
      throw error;
    }
  }

  // Finish current round and calculate scores
  async finishRound(gameId) {
    try {
      const gameRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        throw new Error('Game not found');
      }

      const gameData = gameSnap.data();
      const scores = this.calculateRoundScores(gameData.roundAnswers, gameData.players, gameData.gameSettings.categories);
      
      // Update player scores
      const updatedPlayers = gameData.players.map(player => {
        const playerScore = scores[player.id] || 0;
        return {
          ...player,
          totalScore: player.totalScore + playerScore,
          roundScores: [...player.roundScores, playerScore]
        };
      });

      await updateDoc(gameRef, {
        gameState: 'roundResults',
        players: updatedPlayers,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error finishing round:', error);
      throw error;
    }
  }

  // Start next round
  async nextRound(gameId) {
    try {
      const gameRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        throw new Error('Game not found');
      }

      const gameData = gameSnap.data();
      const nextRoundNumber = gameData.currentRound + 1;
      
      if (nextRoundNumber > gameData.gameSettings.totalRounds) {
        // Game finished
        await updateDoc(gameRef, {
          gameState: 'finished',
          updatedAt: serverTimestamp()
        });
      } else {
        // Next round
        const currentLetter = this.generateRandomLetter();
        await updateDoc(gameRef, {
          gameState: 'playing',
          currentRound: nextRoundNumber,
          currentLetter,
          roundStartTime: serverTimestamp(),
          roundAnswers: {},
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error starting next round:', error);
      throw error;
    }
  }

  // Listen to game updates
  subscribeToGame(gameId, callback) {
    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });

    this.gameListeners.set(gameId, unsubscribe);
    return unsubscribe;
  }

  // Stop listening to game updates
  unsubscribeFromGame(gameId) {
    const unsubscribe = this.gameListeners.get(gameId);
    if (unsubscribe) {
      unsubscribe();
      this.gameListeners.delete(gameId);
    }
  }

  // Leave game
  async leaveGame(gameId, playerId) {
    try {
      const gameRef = doc(db, 'games', gameId);
      const gameSnap = await getDoc(gameRef);
      
      if (!gameSnap.exists()) {
        return;
      }

      const gameData = gameSnap.data();
      const updatedPlayers = gameData.players.filter(p => p.id !== playerId);
      
      if (updatedPlayers.length === 0) {
        // Delete game if no players left
        await deleteDoc(gameRef);
      } else {
        // If host left, make first remaining player the host
        if (gameData.players.find(p => p.id === playerId)?.isHost) {
          updatedPlayers[0].isHost = true;
        }
        
        await updateDoc(gameRef, {
          players: updatedPlayers,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error leaving game:', error);
      throw error;
    }
  }

  // Helper methods
  generatePlayerId() {
    return Math.random().toString(36).substr(2, 9);
  }

  generateRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
  }

  generateGameCode() {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  calculateRoundScores(roundAnswers, players, categories) {
    const scores = {};
    
    // Calculate word frequencies
    const allAnswers = [];
    Object.values(roundAnswers).forEach(playerAnswers => {
      Object.values(playerAnswers).forEach(word => {
        if (word && word.trim()) {
          allAnswers.push(word.toLowerCase().trim());
        }
      });
    });
    
    const wordCounts = {};
    allAnswers.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Calculate scores for each player
    players.forEach(player => {
      const playerAnswers = roundAnswers[player.id] || {};
      let roundScore = 0;
      let wordsFound = 0;
      let uniqueWords = 0;
      let allCategoriesFilled = true;

      categories.forEach(category => {
        const word = playerAnswers[category];
        if (word && word.trim()) {
          wordsFound++;
          roundScore += 1; // 1 point per word
          
          const normalizedWord = word.toLowerCase().trim();
          if (wordCounts[normalizedWord] === 1) {
            uniqueWords++;
            roundScore += 1; // 1 bonus for unique word
          }
        } else {
          allCategoriesFilled = false;
        }
      });

      // Bonus points
      if (allCategoriesFilled) {
        roundScore += 3; // 3 points bonus if all categories filled
      }
      
      if (uniqueWords === wordsFound && wordsFound === categories.length) {
        roundScore += 5; // 5 points if all words are unique
      }

      scores[player.id] = roundScore;
    });

    return scores;
  }
}

export const gameService = new GameService(); 