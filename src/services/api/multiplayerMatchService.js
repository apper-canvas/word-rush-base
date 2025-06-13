import matches from '../mockData/multiplayerMatches.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MultiplayerMatchService {
  constructor() {
    this.data = [...matches];
    this.currentId = Math.max(...this.data.map(item => parseInt(item.id))) + 1;
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(match => match.id === id);
    return item ? { ...item } : null;
  }

  async create(match) {
    await delay(300);
    const newMatch = {
      ...match,
      id: this.currentId.toString(),
      createdAt: new Date().toISOString()
    };
    this.data.push(newMatch);
    this.currentId++;
    return { ...newMatch };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(match => match.id === id);
    if (index === -1) throw new Error('Match not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(match => match.id === id);
    if (index === -1) throw new Error('Match not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  async findMatch(playerId) {
    await delay(500);
    
    // Look for existing waiting match
    const waitingMatch = this.data.find(match => 
      match.status === 'waiting' && 
      match.players.length < 2 &&
      !match.players.find(p => p.id === playerId)
    );
    
    if (waitingMatch) {
      // Join existing match
      const player = { id: playerId, username: `Player${playerId}`, score: 0 };
      waitingMatch.players.push(player);
      waitingMatch.status = 'active';
      return { ...waitingMatch };
    }
    
    // Create new match
    return await this.create({
      matchId: `match_${Date.now()}`,
      players: [{ id: playerId, username: `Player${playerId}`, score: 0 }],
      letterPool: this.generateLetters(),
      timeLimit: 120,
      status: 'waiting'
    });
  }

  generateLetters() {
    const vowels = ['A', 'E', 'I', 'O', 'U'];
    const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T'];
    
    const letters = [];
    
    // Add 3 vowels
    for (let i = 0; i < 3; i++) {
      letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
    }
    
    // Add 4 consonants
    for (let i = 0; i < 4; i++) {
      letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
    }
    
    return letters.sort(() => Math.random() - 0.5);
  }
}

export default new MultiplayerMatchService();