import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const ScoreDisplay = ({ 
  score, 
  multiplier = 1,
  className = '',
  showAnimation = true 
}) => {
  const [prevScore, setPrevScore] = useState(score);
  const [scoreDiff, setScoreDiff] = useState(0);
  
  useEffect(() => {
    if (score !== prevScore && showAnimation) {
      setScoreDiff(score - prevScore);
      setPrevScore(score);
      
      // Clear animation after it completes
      const timer = setTimeout(() => setScoreDiff(0), 1000);
      return () => clearTimeout(timer);
    }
  }, [score, prevScore, showAnimation]);
  
  return (
    <div className={`relative ${className}`}>
      <div className="space-y-1">
        <div className="text-center">
          <span className="text-surface-300 text-sm font-medium uppercase tracking-wide">
            Score
          </span>
        </div>
        
        <motion.div 
          className="text-center"
          animate={scoreDiff > 0 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
>
          <span className="gradient-text font-display text-3xl sm:text-4xl font-bold">
            {score.toLocaleString()}
          </span>
        </motion.div>
        
        {multiplier > 1 && (
          <motion.div 
            className="text-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span className="text-accent font-bold text-sm">
              {multiplier}x COMBO!
            </span>
          </motion.div>
        )}
      </div>
      
      {/* Floating score animation */}
      <AnimatePresence>
{scoreDiff > 0 && (
          <motion.div
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -30, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -top-2 left-1/2 transform -translate-x-1/2 pointer-events-none"
          >
            <span className="text-success font-bold text-lg">
              +{scoreDiff}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScoreDisplay;