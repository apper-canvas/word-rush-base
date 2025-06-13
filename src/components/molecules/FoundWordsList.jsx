import { motion, AnimatePresence } from 'framer-motion';

const FoundWordsList = ({ 
  words = [],
  className = '',
  maxHeight = '200px' 
}) => {
  const sortedWords = [...words].sort((a, b) => b.points - a.points);
  
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-white font-medium text-center">Found Words</h3>
      
      <div 
        className="space-y-2 overflow-y-auto scrollbar-hide"
        style={{ maxHeight }}
      >
        <AnimatePresence>
          {sortedWords.map((word, index) => (
            <motion.div
              key={`${word.text}-${word.timestamp}`}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ 
                duration: 0.3,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="bg-surface-800 rounded-lg p-3 border border-surface-700"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <span className="font-display font-bold text-white text-lg">
                    {word.text}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    <span className="text-surface-300 text-sm">
                      {word.text.length} letters
                    </span>
                  </div>
                </div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                  className="bg-gradient-to-r from-success to-info text-white px-2 py-1 rounded-full text-sm font-bold"
                >
                  +{word.points}
                </motion.div>
              </div>
              
              {word.foundBy && (
                <div className="mt-1 text-surface-400 text-xs">
                  Found by {word.foundBy}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {words.length === 0 && (
          <div className="text-center text-surface-400 py-8">
            <p>No words found yet</p>
            <p className="text-sm mt-1">Start forming words to see them here!</p>
          </div>
        )}
      </div>
      
      {words.length > 0 && (
        <div className="text-center text-surface-400 text-sm">
          {words.length} word{words.length === 1 ? '' : 's'} found
        </div>
      )}
    </div>
  );
};

export default FoundWordsList;