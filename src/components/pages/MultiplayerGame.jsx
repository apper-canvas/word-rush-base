import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import MultiplayerBoard from '@/components/organisms/MultiplayerBoard';
import { multiplayerMatchService } from '@/services';
import ApperIcon from '@/components/ApperIcon';

const MultiplayerGame = () => {
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchingForMatch, setSearchingForMatch] = useState(false);
  const [currentPlayerId] = useState('1'); // Mock player ID

  const findMatch = async () => {
    setSearchingForMatch(true);
    setLoading(true);
    setError(null);
    
    try {
      const foundMatch = await multiplayerMatchService.findMatch(currentPlayerId);
      setMatch(foundMatch);
      
      if (foundMatch.status === 'waiting') {
        toast.info('Waiting for opponent to join...');
        // Simulate opponent joining after delay
        setTimeout(async () => {
          try {
            const updatedMatch = await multiplayerMatchService.update(foundMatch.id, {
              status: 'active',
              players: [
                ...foundMatch.players,
                { id: '2', username: 'Challenger', score: 0 }
              ]
            });
            setMatch(updatedMatch);
            toast.success('Opponent found! Game starting...');
          } catch (err) {
            console.error('Error updating match:', err);
          }
        }, 3000);
      } else {
        toast.success('Match found! Game starting...');
      }
    } catch (err) {
      setError(err.message || 'Failed to find match');
      toast.error('Failed to find match');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchUpdate = (updatedMatch) => {
    setMatch(updatedMatch);
  };

  const handleMatchEnd = (finalMatch) => {
    navigate('/results', { 
      state: { 
        gameData: finalMatch,
        gameType: 'multiplayer',
        currentPlayerId
      } 
    });
  };

  const cancelSearch = () => {
    setSearchingForMatch(false);
    setMatch(null);
  };

  if (loading && !match) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-primary"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Connection Error</h2>
          <p className="text-surface-300 mb-6">{error}</p>
          <div className="space-x-3">
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
            <Button variant="ghost" onClick={() => navigate('/menu')}>
              Back to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!match && !searchingForMatch) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full text-center"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="gradient-text font-display text-4xl sm:text-5xl font-bold mb-4">
              Multiplayer Mode
            </h1>
            <p className="text-surface-300 text-lg">
              Compete against other players in real-time!
            </p>
          </div>

          {/* Game Modes */}
          <div className="space-y-6 mb-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-primary to-secondary p-6 rounded-xl cursor-pointer"
              onClick={findMatch}
            >
              <div className="flex items-center justify-center space-x-4">
                <ApperIcon name="Zap" size={32} className="text-white" />
                <div className="text-left">
                  <h2 className="font-display text-2xl font-bold text-white">
                    Quick Match
                  </h2>
                  <p className="text-white/80">
                    Find an opponent and start playing instantly
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="bg-surface-800 p-6 rounded-xl border border-surface-700 opacity-50">
              <div className="flex items-center justify-center space-x-4">
                <ApperIcon name="Users" size={32} className="text-surface-400" />
                <div className="text-left">
                  <h2 className="font-display text-2xl font-bold text-surface-400">
                    Private Room
                  </h2>
                  <p className="text-surface-400">
                    Create or join a room with friends (Coming Soon)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Rules */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-surface-800 rounded-lg p-6 border border-surface-700 mb-6"
          >
            <h3 className="text-white font-semibold mb-3">Multiplayer Rules</h3>
            <ul className="text-surface-300 text-sm space-y-2 text-left">
              <li>• Both players get the same set of letters</li>
              <li>• Find as many words as possible before time runs out</li>
              <li>• Longer words score more points</li>
              <li>• Highest score wins the match</li>
              <li>• Matches last 2 minutes</li>
            </ul>
          </motion.div>

          <Button
            variant="ghost"
            onClick={() => navigate('/menu')}
            icon="ArrowLeft"
          >
            Back to Menu
          </Button>
        </motion.div>
      </div>
    );
  }

  if (searchingForMatch && (!match || match.status === 'waiting')) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="text-primary mb-6"
          >
            <ApperIcon name="Search" size={64} />
          </motion.div>
          
          <h2 className="gradient-text font-display text-3xl font-bold mb-4">
            Finding Opponent...
          </h2>
          
          <motion.p 
            className="text-surface-300 text-lg mb-8"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            This may take a few moments
          </motion.p>
          
          <div className="space-y-4">
            <div className="bg-surface-800 rounded-lg p-4 border border-surface-700">
              <div className="flex items-center justify-between">
                <span className="text-white">Players in queue:</span>
                <motion.span 
                  className="gradient-text font-bold"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  Searching...
                </motion.span>
              </div>
            </div>
            
            <Button
              variant="secondary"
              onClick={cancelSearch}
              icon="X"
            >
              Cancel Search
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <div>
            <h1 className="gradient-text font-display text-3xl font-bold">
              Multiplayer Match
            </h1>
            <p className="text-surface-300">
              Match ID: {match?.matchId || 'Loading...'}
            </p>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/menu')}
            icon="Home"
            size="sm"
          >
            Leave Match
          </Button>
        </motion.div>

        {/* Multiplayer Board */}
        <MultiplayerBoard
          match={match}
          currentPlayerId={currentPlayerId}
          onMatchUpdate={handleMatchUpdate}
          onMatchEnd={handleMatchEnd}
        />
      </div>
    </div>
  );
};

export default MultiplayerGame;