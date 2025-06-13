// Common English words for validation
const DICTIONARY = [
  'THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HAD', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'ITS', 'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'WAY', 'WHO', 'OIL', 'SIT', 'SET',
  'CAT', 'DOG', 'RUN', 'SUN', 'FUN', 'BAT', 'HAT', 'RAT', 'SAT', 'MAT', 'FAT', 'PAT', 'VAT', 'BAG', 'TAG', 'RAG', 'SAG', 'WAG', 'LAG', 'JAG', 'NAG', 'HAG', 'GAG', 'FAG', 'DAG', 'CAB', 'TAB', 'LAB', 'FAB', 'JAB', 'NAB', 'GAB', 'DAB', 'RAB',
  'CATS', 'DOGS', 'RUNS', 'BATS', 'HATS', 'RATS', 'MATS', 'BAGS', 'TAGS', 'RAGS', 'WAGS', 'LAGS', 'JAGS', 'NAGS', 'HAGS', 'GAGS', 'FAGS', 'DAGS', 'CABS', 'TABS', 'LABS', 'FABS', 'JABS', 'NABS', 'GABS', 'DABS', 'RABS',
  'FAST', 'LAST', 'PAST', 'CAST', 'VAST', 'MAST', 'EAST', 'WEST', 'BEST', 'TEST', 'REST', 'NEST', 'PEST', 'JEST', 'FEST', 'ZEST', 'LEST', 'VEST', 'GUEST', 'QUEST', 'CHEST',
  'WORD', 'WORK', 'WORLD', 'WOULD', 'WRITE', 'WRONG', 'YEAR', 'YOUR', 'YOUNG', 'WATER', 'WATCH', 'WALK', 'WANT', 'WAIT', 'WAKE', 'WALL', 'WARM', 'WASH', 'WAVE', 'WEAR', 'WEEK', 'WELL', 'WENT', 'WERE', 'WHAT', 'WHEN', 'WHERE', 'WHILE', 'WHITE', 'WHOLE', 'WHOSE', 'WIDE', 'WIFE', 'WILD', 'WILL', 'WIND', 'WINDOW', 'WINE', 'WING', 'WINTER', 'WISE', 'WISH', 'WITH', 'WOMAN', 'WOMEN', 'WOOD', 'WORD', 'WORK', 'WORLD', 'WORRY', 'WORTH', 'WOULD', 'WRITE', 'WRITER', 'WRONG', 'WROTE',
  'GAME', 'GAMES', 'MAKE', 'MAKES', 'TAKE', 'TAKES', 'LAKE', 'LAKES', 'CAKE', 'CAKES', 'WAKE', 'WAKES', 'FAKE', 'FAKES', 'SAKE', 'SAKES', 'RAKE', 'RAKES', 'BAKE', 'BAKES', 'JAKE', 'JAKES',
  'TIME', 'TIMES', 'LIME', 'LIMES', 'MIME', 'MIMES', 'DIME', 'DIMES', 'CHIME', 'CHIMES', 'PRIME', 'PRIMES', 'CRIME', 'CRIMES', 'GRIME', 'GRIMES',
  'PLAY', 'PLAYS', 'CLAY', 'CLAYS', 'GRAY', 'GRAYS', 'PRAY', 'PRAYS', 'STAY', 'STAYS', 'SWAY', 'SWAYS', 'AWAY', 'AWAYS', 'DELAY', 'DELAYS', 'RELAY', 'RELAYS',
  'RUSH', 'PUSH', 'BUSH', 'CASH', 'DASH', 'HASH', 'LASH', 'MASH', 'BASH', 'GASH', 'RASH', 'WASH', 'FLASH', 'CLASH', 'CRASH', 'TRASH', 'SLASH', 'SMASH'
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DictionaryService {
  async validateWord(word) {
    await delay(100);
    return DICTIONARY.includes(word.toUpperCase());
  }

  async canFormWord(word, availableLetters) {
    await delay(50);
    
    const wordLetters = word.toUpperCase().split('');
    const letters = [...availableLetters];
    
    for (const letter of wordLetters) {
      const index = letters.indexOf(letter);
      if (index === -1) return false;
      letters.splice(index, 1);
    }
    
    return true;
  }

  async findPossibleWords(letters) {
    await delay(300);
    
    const possibleWords = [];
    const upperLetters = letters.map(l => l.toUpperCase());
    
    for (const word of DICTIONARY) {
      if (await this.canFormWord(word, upperLetters)) {
        possibleWords.push(word);
      }
    }
    
    return possibleWords.sort((a, b) => b.length - a.length);
  }

  getDictionary() {
    return [...DICTIONARY];
  }
}

export default new DictionaryService();