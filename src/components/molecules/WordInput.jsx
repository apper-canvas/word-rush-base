import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const WordInput = ({ 
  currentWord = '',
  onSubmit,
  onClear,
  disabled = false,
  isValid = null,
  className = '' 
}) => {
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    if (isValid === false) {
      setAnimationKey(prev => prev + 1);
    }
  }, [isValid]);
  
  const handleSubmit = () => {
    if (currentWord.length >= 3 && onSubmit) {
      onSubmit(currentWord);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-white font-medium text-center">Your Word</h3>
      
      <motion.div 
        key={animationKey}
        className="relative"
        animate={isValid === false ? {
          x: [-5, 5, -5, 5, 0],
          transition: { duration: 0.5 }
        } : {}}
      >
        <div className={`
          bg-surface-800 border-2 rounded-lg p-4 min-h-[4rem]
          flex items-center justify-center
          transition-all duration-200
          ${isValid === true 
            ? 'border-success shadow-lg shadow-success/25' 
            : isValid === false 
              ? 'border-error shadow-lg shadow-error/25' 
              : 'border-surface-600 focus-within:border-primary'
          }
        `}>
          {currentWord ? (
            <div className="flex flex-wrap gap-1 justify-center">
              {currentWord.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-secondary text-white px-2 py-1 rounded font-display font-bold text-lg"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          ) : (
            <span className="text-surface-400 text-lg">
              Click letters to form a word
            </span>
          )}
        </div>
        
        {/* Validation icon */}
        {isValid !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute -top-2 -right-2 bg-surface-800 rounded-full p-1"
          >
            {isValid ? (
              <ApperIcon name="CheckCircle" className="text-success" size={24} />
            ) : (
              <ApperIcon name="XCircle" className="text-error" size={24} />
            )}
          </motion.div>
        )}
      </motion.div>
      
      <div className="flex gap-2 justify-center">
        <Button
          variant="secondary"
          onClick={onClear}
          disabled={disabled || !currentWord}
          icon="RotateCcw"
          size="sm"
        >
          Clear
        </Button>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={disabled || currentWord.length < 3}
          icon="Send"
          size="sm"
        >
          Submit ({currentWord.length >= 3 ? currentWord.length : 0} letters)
        </Button>
      </div>
      
      {currentWord.length > 0 && currentWord.length < 3 && (
        <p className="text-center text-surface-400 text-sm">
          Words must be at least 3 letters long
        </p>
      )}
    </div>
  );
};

export default WordInput;