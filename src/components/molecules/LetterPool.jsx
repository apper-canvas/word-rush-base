import { motion } from 'framer-motion';
import LetterTile from '@/components/atoms/LetterTile';

const LetterPool = ({ 
  letters = [], 
  usedLetters = [],
  onLetterClick,
  disabled = false,
  className = '' 
}) => {
  const isLetterUsed = (letter, index) => {
    return usedLetters.some((used, usedIndex) => 
      used.letter === letter && used.originalIndex === index
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-white font-medium text-center">Available Letters</h3>
      
      <motion.div 
        className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {letters.map((letter, index) => (
          <motion.div
            key={`${letter}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <LetterTile
              letter={letter}
              isUsed={isLetterUsed(letter, index)}
              onClick={() => onLetterClick?.(letter, index)}
              disabled={disabled}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {letters.length === 0 && (
        <div className="text-center text-surface-400 py-8">
          <p>No letters available</p>
        </div>
      )}
    </div>
  );
};

export default LetterPool;