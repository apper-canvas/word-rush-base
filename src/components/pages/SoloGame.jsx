import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import GameBoard from '@/components/organisms/GameBoard';
import { gameStateService } from '@/services';

const SoloGame = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);

  const startNewGame = async (selectedDifficulty = difficulty) => {
    setLoading(true);
    setError(null);
    
    try {
      const newGame = await gameStateService.createNewGame(selectedDifficulty);
      setGameState(newGame);
      setGameStarted(true);
      toast.success('New game started!');
    } catch (err) {
      setError(err.message || 'Failed to start game');
      toast.error('Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  const handleGameStateUpdate = (updatedState) => {
    setGameState(updatedState);
  };

  const handleGameEnd = (finalState) => {
    // Navigate to results with game data
    navigate('/results', { 
      state: { 
        gameData: finalState,
        gameType: 'solo',
        difficulty
      } 
    });
  };

  const difficultyLevels = [
    { level: 1, name: 'Easy', description: '4-5 letters, 120 seconds', color: 'text-success' },
    { level: 2, name: 'Medium', description: '5-6 letters, 105 seconds', color: 'text-warning' },
    { level: 3, name: 'Hard', description: '6-7 letters, 90 seconds', color: 'text-error' },
    { level: 4, name: 'Expert', description: '7-8 letters, 75 seconds', color: 'text-purple-400' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Something went wrong</h2>
          <p className="text-surface-300 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="gradient-text font-display text-4xl sm:text-5xl font-bold mb-4">
              Solo Challenge
            </h1>
            <p className="text-surface-300 text-lg">
              Choose your difficulty and start forming words!
            </p>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-4 mb-8">
            <h2 className="text-white text-xl font-semibold text-center">
              Select Difficulty
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {difficultyLevels.map((level) => (
                <motion.div
                  key={level.level}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${difficulty === level.level 
                      ? 'border-primary bg-primary/10 shadow-lg shadow-primary/25' 
                      : 'border-surface-700 bg-surface-800 hover:border-surface-600'
                    }
                  `}
                  onClick={() => setDifficulty(level.level)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-display text-lg font-bold ${level.color}`}>
                        {level.name}
                      </h3>
                      <p className="text-surface-300 text-sm">
                        {level.description}
                      </p>
                    </div>
                    
                    {difficulty === level.level && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-primary"
                      >
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center space-y-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => startNewGame(difficulty)}
              icon="Play"
              className="px-12"
            >
              Start Game
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/menu')}
              icon="ArrowLeft"
            >
              Back to Menu
            </Button>
          </div>

          {/* Game Rules */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-surface-800 rounded-lg p-6 border border-surface-700"
          >
            <h3 className="text-white font-semibold mb-3">How to Play</h3>
            <ul className="text-surface-300 text-sm space-y-2">
              <li>• Click letters to form words (minimum 3 letters)</li>
              <li>• Longer words give more points</li> 
              <li>• Build combos with 6+ letter words for multipliers</li>
              <li>• Beat the timer to maximize your score</li>
              <li>• Each difficulty adds more letters but less time</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="gradient-text font-display text-3xl font-bold">
              Solo Game
            </h1>
            <p className="text-surface-300">
              Difficulty: {difficultyLevels.find(d => d.level === difficulty)?.name}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => startNewGame(difficulty)}
              icon="RefreshCw"
              size="sm"
            >
              New Game
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/menu')}
              icon="Home"
              size="sm"
            >
              Menu
            </Button>
          </div>
        </motion.div>

        {/* Game Board */}
        <GameBoard
          gameState={gameState}
          onGameStateUpdate={handleGameStateUpdate}
          onGameEnd={handleGameEnd}
        />
      </div>
    </div>
  );
};

export default SoloGame;