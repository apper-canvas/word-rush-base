import { motion } from 'framer-motion';

const LetterTile = ({ 
  letter, 
  isSelected = false, 
  isUsed = false,
  onClick,
  disabled = false,
  className = ''
}) => {
  const handleClick = () => {
    if (!disabled && !isUsed && onClick) {
      onClick(letter);
    }
  };

  return (
    <motion.div
      whileHover={!disabled && !isUsed ? { scale: 1.1 } : {}}
      whileTap={!disabled && !isUsed ? { scale: 0.95 } : {}}
      onClick={handleClick}
      className={`
        w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 
        rounded-lg cursor-pointer select-none
        flex items-center justify-center
        font-display font-bold text-xl sm:text-2xl md:text-3xl
        transition-all duration-150
        ${isUsed 
          ? 'bg-surface-700 text-surface-400 cursor-not-allowed opacity-50' 
          : isSelected 
            ? 'letter-tile text-white shadow-lg neon-glow' 
            : 'letter-tile text-white hover:shadow-lg hover:neon-glow'
        }
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${className}
      `}
    >
      {letter}
    </motion.div>
  );
};

export default LetterTile;