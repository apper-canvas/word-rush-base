import words from '../mockData/words.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class WordService {
  constructor() {
    this.data = [...words];
    this.currentId = Math.max(...this.data.map(item => parseInt(item.id))) + 1;
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getById(id) {
    await delay(250);
    const item = this.data.find(word => word.id === id);
    return item ? { ...item } : null;
  }

  async create(word) {
    await delay(300);
    const newWord = {
      ...word,
      id: this.currentId.toString(),
      timestamp: Date.now()
    };
    this.data.push(newWord);
    this.currentId++;
    return { ...newWord };
  }

  async update(id, updates) {
    await delay(250);
    const index = this.data.findIndex(word => word.id === id);
    if (index === -1) throw new Error('Word not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.data.findIndex(word => word.id === id);
    if (index === -1) throw new Error('Word not found');
    
    const deleted = this.data.splice(index, 1)[0];
    return { ...deleted };
  }

  calculatePoints(word) {
    const basePoints = word.length;
    let multiplier = 1;
    
    if (word.length >= 6) multiplier = 2;
    if (word.length >= 8) multiplier = 3;
    
    return basePoints * multiplier;
  }
}

export default new WordService();