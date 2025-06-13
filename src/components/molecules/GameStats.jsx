import { motion } from 'framer-motion';
import ScoreDisplay from '@/components/atoms/ScoreDisplay';
import Timer from '@/components/atoms/Timer';

const GameStats = ({ 
  score = 0,
  multiplier = 1,
  timeRemaining = 0,
  totalTime = 120,
  wordsFound = 0,
  onTimeUp,
  className = '' 
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-surface-800 rounded-lg p-4 border border-surface-700"
      >
        <ScoreDisplay 
          score={score} 
          multiplier={multiplier}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-surface-800 rounded-lg p-4 border border-surface-700"
      >
        <Timer
          timeRemaining={timeRemaining}
          totalTime={totalTime}
          onTimeUp={onTimeUp}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-surface-800 rounded-lg p-4 border border-surface-700"
      >
        <div className="text-center space-y-2">
          <div className="text-surface-300 text-sm font-medium uppercase tracking-wide">
            Words Found
          </div>
          <div className="gradient-text font-display text-3xl font-bold">
            {wordsFound}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GameStats;