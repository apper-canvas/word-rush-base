import gameStates from '../mockData/gameStates.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GameStateService {
  constructor() {
    this.data = [...gameStates];
    this.currentId = Math.max(...this.data.map(item => parseInt(item.id))) + 1;
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(state => state.id === id);
    return item ? { ...item } : null;
  }

  async create(gameState) {
    await delay(300);
    const newGameState = {
      ...gameState,
      id: this.currentId.toString(),
      createdAt: new Date().toISOString()
    };
    this.data.push(newGameState);
    this.currentId++;
    return { ...newGameState };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(state => state.id === id);
    if (index === -1) throw new Error('Game state not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(state => state.id === id);
    if (index === -1) throw new Error('Game state not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  // Game-specific methods
  async createNewGame(difficulty = 1) {
    const letters = this.generateLetters(difficulty);
    return await this.create({
      letters,
      foundWords: [],
      score: 0,
      timeRemaining: this.getTimeLimit(difficulty),
      difficulty,
      multiplier: 1,
      status: 'active'
    });
  }

  generateLetters(difficulty) {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
    
    const letterCount = Math.min(4 + difficulty, 8);
    const vowelCount = Math.ceil(letterCount * 0.4);
    const consonantCount = letterCount - vowelCount;
    
    const selectedLetters = [];
    
    // Add vowels
    for (let i = 0; i < vowelCount; i++) {
      selectedLetters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }
    
    // Add consonants
    for (let i = 0; i < consonantCount; i++) {
      selectedLetters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }
    
    // Shuffle array
    return selectedLetters.sort(() => Math.random() - 0.5);
  }

  getTimeLimit(difficulty) {
    return Math.max(120 - (difficulty * 15), 60); // 120s to 60s
  }
}

export default new GameStateService();