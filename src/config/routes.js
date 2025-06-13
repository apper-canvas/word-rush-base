import MainMenu from '@/components/pages/MainMenu';
import SoloGame from '@/components/pages/SoloGame';
import MultiplayerGame from '@/components/pages/MultiplayerGame';
import GameResults from '@/components/pages/GameResults';
import Leaderboard from '@/components/pages/Leaderboard';

export const routes = {
  menu: {
    id: 'menu',
    label: 'Main Menu',
    path: '/menu',
    icon: 'Home',
    component: MainMenu
  },
  solo: {
    id: 'solo',
    label: 'Solo Game',
    path: '/solo',
    icon: 'User',
    component: SoloGame
  },
  multiplayer: {
    id: 'multiplayer',
    label: 'Multiplayer',
    path: '/multiplayer',
    icon: 'Users',
    component: MultiplayerGame
  },
  results: {
    id: 'results',
    label: 'Results',
    path: '/results',
    icon: 'Trophy',
    component: GameResults
  },
  leaderboard: {
    id: 'leaderboard',
    label: 'Leaderboard',
    path: '/leaderboard',
    icon: 'Crown',
    component: Leaderboard
  }
};

export const routeArray = Object.values(routes);