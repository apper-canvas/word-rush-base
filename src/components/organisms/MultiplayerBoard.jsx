import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LetterPool from '@/components/molecules/LetterPool';
import WordInput from '@/components/molecules/WordInput';
import FoundWordsList from '@/components/molecules/FoundWordsList';
import { dictionaryService, wordService } from '@/services';
import ApperIcon from '@/components/ApperIcon';

const MultiplayerBoard = ({ 
  match,
  currentPlayerId = '1',
  onMatchUpdate,
  onMatchEnd,
  className = '' 
}) => {
  const [currentWord, setCurrentWord] = useState('');
  const [usedLetters, setUsedLetters] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [wordValidity, setWordValidity] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(match?.timeRemaining || 120);
  
  const currentPlayer = match?.players?.find(p => p.id === currentPlayerId);
  const opponent = match?.players?.find(p => p.id !== currentPlayerId);
  
  useEffect(() => {
    if (match?.timeRemaining !== undefined) {
      setTimeRemaining(match.timeRemaining);
    }
  }, [match?.timeRemaining]);
  
  useEffect(() => {
    if (timeRemaining <= 0) {
      onMatchEnd?.(match);
      return;
    }
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) onMatchEnd?.(match);
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeRemaining, match, onMatchEnd]);

  const handleLetterClick = useCallback((letter, originalIndex) => {
    if (isValidating || timeRemaining <= 0) return;
    
    setCurrentWord(prev => prev + letter);
    setUsedLetters(prev => [...prev, { letter, originalIndex }]);
    setWordValidity(null);
  }, [isValidating, timeRemaining]);

  const handleClearWord = useCallback(() => {
    setCurrentWord('');
    setUsedLetters([]);
    setWordValidity(null);
  }, []);

  const handleSubmitWord = useCallback(async (word) => {
    if (word.length < 3 || isValidating || timeRemaining <= 0) return;
    
    setIsValidating(true);
    
    try {
      // Validate word exists in dictionary
      const isValid = await dictionaryService.validateWord(word);
      if (!isValid) {
        setWordValidity(false);
        toast.error('Not a valid word!');
        return;
      }
      
      // Check if word can be formed from available letters
      const canForm = await dictionaryService.canFormWord(word, match.letterPool);
      if (!canForm) {
        setWordValidity(false);
        toast.error('Cannot form this word with available letters!');
        return;
      }
      
      // Calculate points
      const points = wordService.calculatePoints(word);
      
      // Update current player's score
      const updatedPlayers = match.players.map(player => 
        player.id === currentPlayerId 
          ? { ...player, score: player.score + points }
          : player
      );
      
      // Update match
      onMatchUpdate({
        ...match,
        players: updatedPlayers,
        timeRemaining
      });
      
      setWordValidity(true);
      toast.success(`Great! +${points} points for "${word.toUpperCase()}"`);
      
      // Clear word after successful submission
      setTimeout(() => {
        handleClearWord();
      }, 1000);
      
    } catch (error) {
      console.error('Error validating word:', error);
      setWordValidity(false);
      toast.error('Error validating word');
    } finally {
      setIsValidating(false);
    }
  }, [match, currentPlayerId, timeRemaining, onMatchUpdate, handleClearWord, isValidating]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeRemaining / match?.timeLimit) * 100;
  const isWarning = percentage < 25;
  const isCritical = percentage < 10;

  if (!match) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-lg">Loading match...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`space-y-6 max-w-full overflow-hidden ${className}`}
    >
      {/* Match Status and Timer */}
      <div className="bg-surface-800 rounded-lg p-4 border border-surface-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="gradient-text font-display text-2xl font-bold">
            Multiplayer Match
          </h2>
          <div className="flex items-center space-x-2">
            <ApperIcon name="Clock" className="text-surface-300" size={20} />
            <motion.span 
              className={`font-display text-xl font-bold ${
                isCritical ? 'text-error' : isWarning ? 'text-warning' : 'text-white'
              }`}
              animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: isCritical ? Infinity : 0, duration: 1 }}
            >
              {formatTime(timeRemaining)}
            </motion.span>
          </div>
        </div>
        
        <div className="w-full bg-surface-700 rounded-full h-3 overflow-hidden mb-4">
          <motion.div
            className={`h-full rounded-full ${
              isCritical ? 'timer-warning' : 'timer-normal'
            }`}
            initial={{ width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
      
      {/* Player Scores */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          className={`bg-surface-800 rounded-lg p-4 border-2 ${
            currentPlayer?.id === currentPlayerId ? 'border-primary' : 'border-surface-700'
          }`}
          animate={currentPlayer?.id === currentPlayerId ? { scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ApperIcon name="User" className="text-primary" size={20} />
              <span className="text-white font-medium">You</span>
            </div>
            <div className="gradient-text font-display text-3xl font-bold">
              {currentPlayer?.score || 0}
            </div>
          </div>
        </motion.div>
        
        <div className="bg-surface-800 rounded-lg p-4 border border-surface-700">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <ApperIcon name="Users" className="text-secondary" size={20} />
              <span className="text-white font-medium">
                {opponent?.username || 'Opponent'}
              </span>
            </div>
            <div className="gradient-text font-display text-3xl font-bold">
              {opponent?.score || 0}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Letter Pool and Word Input */}
        <div className="space-y-6">
          <LetterPool
            letters={match.letterPool}
            usedLetters={usedLetters}
            onLetterClick={handleLetterClick}
            disabled={isValidating || timeRemaining <= 0}
          />
          
          <WordInput
            currentWord={currentWord}
            onSubmit={handleSubmitWord}
            onClear={handleClearWord}
            disabled={isValidating || timeRemaining <= 0}
            isValid={wordValidity}
          />
        </div>
        
        {/* Game Info */}
        <div className="space-y-4">
          <div className="bg-surface-800 rounded-lg p-4 border border-surface-700">
            <h3 className="text-white font-medium mb-3">Match Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-300">Status:</span>
                <span className="text-white capitalize">{match.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-300">Players:</span>
                <span className="text-white">{match.players.length}/2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-300">Letters:</span>
                <span className="text-white">{match.letterPool.length}</span>
              </div>
            </div>
          </div>
          
          {match.status === 'waiting' && (
            <div className="bg-warning/10 border border-warning rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Clock" className="text-warning" size={20} />
                <span className="text-warning font-medium">
                  Waiting for opponent...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {timeRemaining <= 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <h2 className="gradient-text font-display text-4xl font-bold mb-4">
            Match Complete!
          </h2>
          <div className="space-y-2">
            <p className="text-white text-lg">
              Your Score: {currentPlayer?.score || 0} points
            </p>
            <p className="text-white text-lg">
              {opponent?.username || 'Opponent'}: {opponent?.score || 0} points
            </p>
            {(currentPlayer?.score || 0) > (opponent?.score || 0) ? (
              <p className="text-success text-xl font-bold">You Win! 🎉</p>
            ) : (currentPlayer?.score || 0) < (opponent?.score || 0) ? (
              <p className="text-error text-xl font-bold">You Lose 😞</p>
            ) : (
              <p className="text-warning text-xl font-bold">It's a Tie! 🤝</p>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MultiplayerBoard;