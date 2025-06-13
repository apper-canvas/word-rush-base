import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import LetterPool from '@/components/molecules/LetterPool';
import WordInput from '@/components/molecules/WordInput';
import GameStats from '@/components/molecules/GameStats';
import FoundWordsList from '@/components/molecules/FoundWordsList';
import { dictionaryService, wordService } from '@/services';

const GameBoard = ({ 
  gameState,
  onGameStateUpdate,
  onGameEnd,
  className = '' 
}) => {
  const [currentWord, setCurrentWord] = useState('');
  const [usedLetters, setUsedLetters] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [wordValidity, setWordValidity] = useState(null);
  const [foundWords, setFoundWords] = useState(gameState?.foundWords || []);
  
  useEffect(() => {
    if (gameState) {
      setFoundWords(gameState.foundWords || []);
    }
  }, [gameState]);

  const handleLetterClick = useCallback((letter, originalIndex) => {
    if (isValidating) return;
    
    setCurrentWord(prev => prev + letter);
    setUsedLetters(prev => [...prev, { letter, originalIndex }]);
    setWordValidity(null);
  }, [isValidating]);

  const handleClearWord = useCallback(() => {
    setCurrentWord('');
    setUsedLetters([]);
    setWordValidity(null);
  }, []);

  const handleSubmitWord = useCallback(async (word) => {
    if (word.length < 3 || isValidating) return;
    
    setIsValidating(true);
    
    try {
      // Check if word already found
      if (foundWords.some(w => w.text.toUpperCase() === word.toUpperCase())) {
        setWordValidity(false);
        toast.error('Word already found!');
        return;
      }
      
      // Validate word exists in dictionary
      const isValid = await dictionaryService.validateWord(word);
      if (!isValid) {
        setWordValidity(false);
        toast.error('Not a valid word!');
        return;
      }
      
      // Check if word can be formed from available letters
      const canForm = await dictionaryService.canFormWord(word, gameState.letters);
      if (!canForm) {
        setWordValidity(false);
        toast.error('Cannot form this word with available letters!');
        return;
      }
      
      // Calculate points
      const points = wordService.calculatePoints(word);
      
      // Create word object
      const newWord = {
        text: word.toUpperCase(),
        points,
        foundBy: 'player',
        timestamp: Date.now()
      };
      
      // Update found words
      const updatedFoundWords = [...foundWords, newWord];
      setFoundWords(updatedFoundWords);
      
      // Update game state
      const newScore = gameState.score + points;
      const newMultiplier = word.length >= 6 ? Math.min(gameState.multiplier + 1, 5) : 1;
      
      onGameStateUpdate({
        ...gameState,
        foundWords: updatedFoundWords,
        score: newScore,
        multiplier: newMultiplier
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
  }, [gameState, foundWords, onGameStateUpdate, handleClearWord, isValidating]);

  const handleTimeUp = useCallback(() => {
    onGameEnd?.(gameState);
  }, [gameState, onGameEnd]);

  if (!gameState) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-lg">Loading game...</div>
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
      {/* Game Stats */}
      <GameStats
        score={gameState.score}
        multiplier={gameState.multiplier}
        timeRemaining={gameState.timeRemaining}
        totalTime={120}
        wordsFound={foundWords.length}
        onTimeUp={handleTimeUp}
      />
      
      {/* Main Game Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Letter Pool and Word Input */}
        <div className="lg:col-span-2 space-y-6">
          <LetterPool
            letters={gameState.letters}
            usedLetters={usedLetters}
            onLetterClick={handleLetterClick}
            disabled={isValidating || gameState.timeRemaining <= 0}
          />
          
          <WordInput
            currentWord={currentWord}
            onSubmit={handleSubmitWord}
            onClear={handleClearWord}
            disabled={isValidating || gameState.timeRemaining <= 0}
            isValid={wordValidity}
          />
        </div>
        
        {/* Found Words */}
        <div className="lg:col-span-1">
          <FoundWordsList
            words={foundWords}
            maxHeight="400px"
          />
        </div>
      </div>
      
      {gameState.timeRemaining <= 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <h2 className="gradient-text font-display text-4xl font-bold mb-4">
            Time's Up!
          </h2>
          <p className="text-white text-lg">
            Final Score: {gameState.score.toLocaleString()} points
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameBoard;