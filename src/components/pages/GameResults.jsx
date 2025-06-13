import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Button from '@/components/atoms/Button';
import { playerService, dictionaryService } from '@/services';
import ApperIcon from '@/components/ApperIcon';

const GameResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [possibleWords, setPossibleWords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const gameData = location.state?.gameData;
  const gameType = location.state?.gameType || 'solo';
  const difficulty = location.state?.difficulty || 1;
  const currentPlayerId = location.state?.currentPlayerId;

  useEffect(() => {
    if (!gameData) {
      navigate('/menu');
      return;
    }

    const loadPossibleWords = async () => {
      try {
        const letters = gameType === 'multiplayer' ? gameData.letterPool : gameData.letters;
        const words = await dictionaryService.findPossibleWords(letters);
        setPossibleWords(words);
      } catch (error) {
        console.error('Error loading possible words:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPossibleWords();
  }, [gameData, gameType, navigate]);

  if (!gameData) {
    return null;
  }

  const isSolo = gameType === 'solo';
  const isMultiplayer = gameType === 'multiplayer';
  
  // Solo game stats
  const soloStats = isSolo ? {
    score: gameData.score || 0,
    wordsFound: gameData.foundWords?.length || 0,
    difficulty,
    multiplier: gameData.multiplier || 1
  } : null;

  // Multiplayer stats
  const multiplayerStats = isMultiplayer ? {
    currentPlayer: gameData.players?.find(p => p.id === currentPlayerId),
    opponent: gameData.players?.find(p => p.id !== currentPlayerId),
    totalWordsFound: gameData.players?.reduce((sum, p) => sum + (p.wordsFound || 0), 0) || 0
  } : null;

  const isWinner = isMultiplayer && multiplayerStats?.currentPlayer && multiplayerStats?.opponent &&
    multiplayerStats.currentPlayer.score > multiplayerStats.opponent.score;
  
  const foundWords = isSolo ? gameData.foundWords : [];
  const missedWords = possibleWords.filter(word => 
    !foundWords.some(found => found.text?.toUpperCase() === word.toUpperCase())
  );

  const accuracyPercentage = possibleWords.length > 0 
    ? Math.round((foundWords.length / possibleWords.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-surface-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {isSolo && (
            <>
              <h1 className="gradient-text font-display text-4xl sm:text-5xl font-bold mb-4">
                Game Complete!
              </h1>
              <p className="text-surface-300 text-lg">
                Here's how you performed
              </p>
            </>
          )}
          
          {isMultiplayer && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-8xl mb-4"
              >
                {isWinner ? '🏆' : multiplayerStats?.currentPlayer?.score === multiplayerStats?.opponent?.score ? '🤝' : '😅'}
              </motion.div>
              
              <h1 className="gradient-text font-display text-4xl sm:text-5xl font-bold mb-4">
                {isWinner ? 'Victory!' : multiplayerStats?.currentPlayer?.score === multiplayerStats?.opponent?.score ? "It's a Tie!" : 'Good Try!'}
              </h1>
              
              <p className="text-surface-300 text-lg">
                Match results are in
              </p>
            </>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isSolo && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-center"
              >
                <ApperIcon name="Trophy" size={32} className="text-white mx-auto mb-2" />
                <div className="text-white text-3xl font-display font-bold">
                  {soloStats.score.toLocaleString()}
                </div>
                <div className="text-white/80 text-sm">Final Score</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-success to-info p-6 rounded-xl text-center"
              >
                <ApperIcon name="CheckCircle" size={32} className="text-white mx-auto mb-2" />
                <div className="text-white text-3xl font-display font-bold">
                  {soloStats.wordsFound}
                </div>
                <div className="text-white/80 text-sm">Words Found</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-accent to-warning p-6 rounded-xl text-center"
              >
                <ApperIcon name="Target" size={32} className="text-white mx-auto mb-2" />
                <div className="text-white text-3xl font-display font-bold">
                  {accuracyPercentage}%
                </div>
                <div className="text-white/80 text-sm">Accuracy</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-secondary to-purple-600 p-6 rounded-xl text-center"
              >
                <ApperIcon name="Zap" size={32} className="text-white mx-auto mb-2" />
                <div className="text-white text-3xl font-display font-bold">
                  {soloStats.multiplier}x
                </div>
                <div className="text-white/80 text-sm">Max Combo</div>
              </motion.div>
            </>
          )}

          {isMultiplayer && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-primary to-secondary p-6 rounded-xl text-center"
              >
                <ApperIcon name="User" size={32} className="text-white mx-auto mb-2" />
                <div className="text-white text-3xl font-display font-bold">
                  {multiplayerStats?.currentPlayer?.score || 0}
                </div>
                <div className="text-white/80 text-sm">Your Score</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-surface-700 to-surface-600 p-6 rounded-xl text-center"
              >
                <ApperIcon name="Users" size={32} className="text-white mx-auto mb-2" />
                <div className="text-white text-3xl font-display font-bold">
                  {multiplayerStats?.opponent?.score || 0}
                </div>
                <div className="text-white/80 text-sm">Opponent Score</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-success to-info p-6 rounded-xl text-center"
              >
                <ApperIcon name="Award" size={32} className="text-white mx-auto mb-2" />
                <div className="text-white text-3xl font-display font-bold">
                  {Math.abs((multiplayerStats?.currentPlayer?.score || 0) - (multiplayerStats?.opponent?.score || 0))}
                </div>
                <div className="text-white/80 text-sm">Point Difference</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-accent to-warning p-6 rounded-xl text-center"
              >
                <ApperIcon name="Clock" size={32} className="text-white mx-auto mb-2" />
                <div className="text-white text-3xl font-display font-bold">
                  2:00
                </div>
                <div className="text-white/80 text-sm">Match Duration</div>
              </motion.div>
            </>
          )}
        </div>

        {/* Words Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Found Words */}
          {foundWords.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-surface-800 rounded-xl p-6 border border-surface-700"
            >
              <h3 className="text-white font-display text-xl font-bold mb-4 flex items-center">
                <ApperIcon name="CheckCircle" className="text-success mr-2" size={24} />
                Words Found ({foundWords.length})
              </h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                {foundWords.map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.05 }}
                    className="flex justify-between items-center bg-surface-700 rounded-lg p-3"
                  >
                    <span className="text-white font-medium">{word.text}</span>
                    <span className="text-success font-bold">+{word.points}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Missed Words */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-surface-800 rounded-xl p-6 border border-surface-700"
            >
              <h3 className="text-white font-display text-xl font-bold mb-4 flex items-center">
                <ApperIcon name="AlertCircle" className="text-warning mr-2" size={24} />
                Missed Opportunities ({missedWords.length})
              </h3>
              
              {missedWords.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                  {missedWords.slice(0, 20).map((word, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.03 }}
                      className="flex justify-between items-center bg-surface-700 rounded-lg p-3"
                    >
                      <span className="text-surface-300">{word}</span>
                      <span className="text-warning text-sm">{word.length} letters</span>
                    </motion.div>
                  ))}
                  
                  {missedWords.length > 20 && (
                    <div className="text-center text-surface-400 text-sm py-2">
                      +{missedWords.length - 20} more words...
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-success py-8">
                  <ApperIcon name="Star" size={48} className="mx-auto mb-2" />
                  <p className="font-bold">Perfect Score!</p>
                  <p className="text-sm">You found all possible words!</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(isSolo ? '/solo' : '/multiplayer')}
            icon="RotateCcw"
          >
            Play Again
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate('/leaderboard')}
            icon="Trophy"
          >
            Leaderboard
          </Button>
          
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate('/menu')}
            icon="Home"
          >
            Main Menu
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default GameResults;