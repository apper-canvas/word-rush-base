import players from '../mockData/players.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PlayerService {
  constructor() {
    this.data = [...players];
    this.currentId = Math.max(...this.data.map(item => parseInt(item.id))) + 1;
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(player => player.id === id);
    return item ? { ...item } : null;
  }

  async create(player) {
    await delay(300);
    const newPlayer = {
      ...player,
      id: this.currentId.toString(),
      createdAt: new Date().toISOString()
    };
    this.data.push(newPlayer);
    this.currentId++;
    return { ...newPlayer };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(player => player.id === id);
    if (index === -1) throw new Error('Player not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(player => player.id === id);
    if (index === -1) throw new Error('Player not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async getLeaderboard(limit = 10) {
    await delay(300);
    const sorted = [...this.data]
      .sort((a, b) => b.bestScore - a.bestScore)
      .slice(0, limit);
    return sorted.map(player => ({ ...player }));
  }

  async updateScore(id, score) {
    const player = await this.getById(id);
    if (!player) throw new Error('Player not found');
    
    const updates = { score };
    if (score > player.bestScore) {
      updates.bestScore = score;
    }
    
    return await this.update(id, updates);
  }
}

export default new PlayerService();