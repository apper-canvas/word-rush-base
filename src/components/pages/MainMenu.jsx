import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const MainMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: 'Solo Play',
      description: 'Challenge yourself with progressive difficulty',
      icon: 'User',
      action: () => navigate('/solo'),
      gradient: 'from-primary to-secondary'
    },
    {
      title: 'Multiplayer',
      description: 'Compete against other players in real-time',
      icon: 'Users',
      action: () => navigate('/multiplayer'),
      gradient: 'from-secondary to-accent'
    },
    {
      title: 'Leaderboard',
      description: 'See the top word masters',
      icon: 'Trophy',
      action: () => navigate('/leaderboard'),
      gradient: 'from-accent to-warning'
    }
  ];

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="gradient-text font-display text-6xl sm:text-7xl md:text-8xl font-bold mb-4"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(99, 102, 241, 0.5)",
                "0 0 30px rgba(139, 92, 246, 0.5)",
                "0 0 20px rgba(99, 102, 241, 0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Word Rush
          </motion.h1>
          
          <motion.p 
            className="text-surface-300 text-lg sm:text-xl md:text-2xl font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Fast-paced word puzzle game
          </motion.p>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.5 + (index * 0.2),
                ease: "easeOut"
              }}
              whileHover={{ y: -10, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group"
            >
              <div 
                className={`
                  bg-gradient-to-br ${item.gradient} p-6 rounded-xl
                  cursor-pointer transition-all duration-300
                  hover:shadow-2xl hover:shadow-primary/25
                  border border-surface-700 hover:border-transparent
                `}
                onClick={item.action}
              >
                <div className="text-center space-y-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full"
                  >
                    <ApperIcon 
                      name={item.icon} 
                      size={32} 
                      className="text-white"
                    />
                  </motion.div>
                  
                  <div>
                    <h2 className="font-display text-2xl font-bold text-white mb-2">
                      {item.title}
                    </h2>
                    <p className="text-white/80 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats or Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-center"
        >
          <div className="bg-surface-800 rounded-lg p-6 border border-surface-700 inline-block">
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="gradient-text font-display text-2xl font-bold">
                  1000+
                </div>
                <div className="text-surface-400 text-sm">
                  Words Available
                </div>
              </div>
              
              <div className="w-px h-12 bg-surface-700"></div>
              
              <div className="text-center">
                <div className="gradient-text font-display text-2xl font-bold">
                  ∞
                </div>
                <div className="text-surface-400 text-sm">
                  Possible Combinations
                </div>
              </div>
              
              <div className="w-px h-12 bg-surface-700"></div>
              
              <div className="text-center">
                <div className="gradient-text font-display text-2xl font-bold">
                  Real-time
                </div>
                <div className="text-surface-400 text-sm">
                  Multiplayer
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Letters Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {['W', 'O', 'R', 'D', 'R', 'U', 'S', 'H'].map((letter, index) => (
            <motion.div
              key={`${letter}-${index}`}
              className="absolute text-4xl font-display font-bold text-primary/10"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                rotate: Math.random() * 360
              }}
              animate={{ 
                y: -100,
                rotate: Math.random() * 360 + 360
              }}
              transition={{ 
                duration: Math.random() * 10 + 15,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            >
              {letter}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainMenu;