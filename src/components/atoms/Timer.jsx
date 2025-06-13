import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Timer = ({ 
  timeRemaining, 
  totalTime, 
  onTimeUp,
  className = '' 
}) => {
  const [currentTime, setCurrentTime] = useState(timeRemaining);
  
  useEffect(() => {
    setCurrentTime(timeRemaining);
  }, [timeRemaining]);
  
  useEffect(() => {
    if (currentTime <= 0) {
      onTimeUp?.();
      return;
    }
    
    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const newTime = Math.max(0, prev - 1);
        if (newTime === 0) onTimeUp?.();
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentTime, onTimeUp]);
  
  const percentage = (currentTime / totalTime) * 100;
  const isWarning = percentage < 25;
  const isCritical = percentage < 10;
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-white font-medium">Time</span>
        <motion.span 
          className={`font-display text-xl font-bold ${
            isCritical ? 'text-error' : isWarning ? 'text-warning' : 'text-white'
          }`}
          animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: isCritical ? Infinity : 0, duration: 1 }}
        >
          {formatTime(currentTime)}
        </motion.span>
      </div>
      
      <div className="w-full bg-surface-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isCritical ? 'timer-warning' : 'timer-normal'
          }`}
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {isCritical && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-center text-error text-sm font-medium"
        >
          Hurry up!
        </motion.div>
      )}
    </div>
  );
};

export default Timer;