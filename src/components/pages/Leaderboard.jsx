import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import { playerService } from '@/services';
import ApperIcon from '@/components/ApperIcon';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('bestScore');

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const leaderboardData = await playerService.getLeaderboard(20);
        setPlayers(leaderboardData);
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard');
        toast.error('Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, []);

  const sortedPlayers = [...players].sort((a, b) => {
    switch (sortBy) {
      case 'bestScore':
        return b.bestScore - a.bestScore;
      case 'wins':
        return b.wins - a.wins;
      case 'averageScore':
        return (b.averageScore || 0) - (a.averageScore || 0);
      case 'gamesPlayed':
        return (b.gamesPlayed || 0) - (a.gamesPlayed || 0);
      default:
        return b.bestScore - a.bestScore;
    }
  });

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-warning';
      case 2: return 'text-surface-300';
      case 3: return 'text-accent';
      default: return 'text-surface-400';
    }
  };

  const sortOptions = [
    { value: 'bestScore', label: 'Best Score', icon: 'Trophy' },
    { value: 'wins', label: 'Total Wins', icon: 'Award' },
    { value: 'averageScore', label: 'Average Score', icon: 'TrendingUp' },
    { value: 'gamesPlayed', label: 'Games Played', icon: 'Play' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="text-primary mb-4"
          >
            <ApperIcon name="Trophy" size={48} />
          </motion.div>
          <p className="text-white text-lg">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">Failed to load</h2>
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

  if (players.length === 0) {
    return (
      <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="gradient-text font-display text-3xl font-bold mb-4">
            No Records Yet
          </h2>
          <p className="text-surface-300 mb-6">
            Be the first to set a high score!
          </p>
          <div className="space-x-3">
            <Button
              variant="primary"
              onClick={() => navigate('/solo')}
              icon="Play"
            >
              Start Playing
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate('/menu')}
              icon="Home"
            >
              Main Menu
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="gradient-text font-display text-4xl sm:text-5xl font-bold mb-4">
            Leaderboard
          </h1>
          <p className="text-surface-300 text-lg">
            Top Word Rush Champions
          </p>
        </motion.div>

        {/* Sort Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {sortOptions.map((option) => (
              <Button
                key={option.value}
                variant={sortBy === option.value ? 'primary' : 'secondary'}
                size="sm"
                icon={option.icon}
                onClick={() => setSortBy(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className={`
                  bg-surface-800 rounded-lg p-4 border
                  ${rank <= 3 
                    ? 'border-primary shadow-lg shadow-primary/20' 
                    : 'border-surface-700'
                  }
                  hover:border-surface-600 transition-all duration-200
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      font-display font-bold text-lg
                      ${rank <= 3 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white' 
                        : 'bg-surface-700 text-surface-300'
                      }
                    `}>
                      {rank <= 3 ? getRankIcon(rank) : rank}
                    </div>

                    {/* Player Info */}
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {player.username}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-surface-300">
                        <span>{player.gamesPlayed || 0} games</span>
                        <span>•</span>
                        <span>{player.wins} wins</span>
                        {player.averageScore && (
                          <>
                            <span>•</span>
                            <span>{Math.round(player.averageScore)} avg</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="gradient-text font-display text-2xl font-bold">
                      {sortBy === 'bestScore' && player.bestScore.toLocaleString()}
                      {sortBy === 'wins' && player.wins}
                      {sortBy === 'averageScore' && Math.round(player.averageScore || 0).toLocaleString()}
                      {sortBy === 'gamesPlayed' && (player.gamesPlayed || 0)}
                    </div>
                    <div className="text-surface-400 text-sm">
                      {sortOptions.find(opt => opt.value === sortBy)?.label}
                    </div>
                  </div>
                </div>

                {/* Additional Stats */}
                {rank <= 3 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="mt-4 pt-4 border-t border-surface-700"
                  >
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-primary font-bold">
                          {player.bestScore.toLocaleString()}
                        </div>
                        <div className="text-surface-400 text-xs">Best Score</div>
                      </div>
                      <div>
                        <div className="text-success font-bold">
                          {player.wins}
                        </div>
                        <div className="text-surface-400 text-xs">Wins</div>
                      </div>
                      <div>
                        <div className="text-accent font-bold">
                          {Math.round(player.averageScore || 0)}
                        </div>
                        <div className="text-surface-400 text-xs">Average</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-8 space-x-4"
        >
          <Button
            variant="primary"
            onClick={() => navigate('/solo')}
            icon="Target"
          >
            Beat the Records
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/menu')}
            icon="Home"
          >
            Main Menu
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;