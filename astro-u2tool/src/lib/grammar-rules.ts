// Grammar checking rules and utilities

export interface GrammarError {
  type: 'spelling' | 'grammar' | 'punctuation' | 'style';
  message: string;
  position: { start: number; end: number };
  suggestions: string[];
  severity: 'error' | 'warning' | 'info';
  original: string;
}

// Common spelling mistakes
const SPELLING_MISTAKES: Record<string, string> = {
  'teh': 'the',
  'recieve': 'receive',
  'occured': 'occurred',
  'seperate': 'separate',
  'definately': 'definitely',
  'accomodate': 'accommodate',
  'occurence': 'occurrence',
  'wierd': 'weird',
  'untill': 'until',
  'begining': 'beginning',
  'beleive': 'believe',
  'calender': 'calendar',
  'collegue': 'colleague',
  'commited': 'committed',
  'concious': 'conscious',
  'embarass': 'embarrass',
  'enviroment': 'environment',
  'existance': 'existence',
  'foriegn': 'foreign',
  'goverment': 'government',
  'grammer': 'grammar',
  'harrass': 'harass',
  'independant': 'independent',
  'knowlege': 'knowledge',
  'liason': 'liaison',
  'mispell': 'misspell',
  'neccessary': 'necessary',
  'noticable': 'noticeable',
  'occassion': 'occasion',
  'paralell': 'parallel',
  'persistant': 'persistent',
  'posession': 'possession',
  'prefered': 'preferred',
  'priviledge': 'privilege',
  'pronounciation': 'pronunciation',
  'publically': 'publicly',
  'recomend': 'recommend',
  'refered': 'referred',
  'relevent': 'relevant',
  'rythm': 'rhythm',
  'succesful': 'successful',
  'suprise': 'surprise',
  'tommorow': 'tomorrow',
  'truely': 'truly',
  'writting': 'writing',
  'acheive': 'achieve',
  'arguement': 'argument',
  'basicly': 'basically',
  'buisness': 'business',
  'catagory': 'category',
  'changable': 'changeable',
  'comming': 'coming',
  'completly': 'completely',
  'concensus': 'consensus',
  'dissapear': 'disappear',
  'dissapoint': 'disappoint',
  'equiptment': 'equipment',
  'explaination': 'explanation',
  'familar': 'familiar',
  'finaly': 'finally',
  'flourescent': 'fluorescent',
  'fourty': 'forty',
  'freind': 'friend',
  'gaurd': 'guard',
  'happend': 'happened',
  'hieght': 'height',
  'immediatly': 'immediately',
  'intresting': 'interesting',
  'judgement': 'judgment',
  'libary': 'library',
  'maintainance': 'maintenance',
  'millenium': 'millennium',
  'minature': 'miniature',
  'mischievious': 'mischievous',
  'naturaly': 'naturally',
  'neice': 'niece',
  'nineth': 'ninth',
  'ocasionally': 'occasionally',
  'offical': 'official',
  'oportunity': 'opportunity',
  'orignal': 'original',
  'particulary': 'particularly',
  'pasttime': 'pastime',
  'peice': 'piece',
  'percieve': 'perceive',
  'personel': 'personnel',
  'plagarism': 'plagiarism',
  'politican': 'politician',
  'posible': 'possible',
  'potatos': 'potatoes',
  'preceed': 'precede',
  'presance': 'presence',
  'probaly': 'probably',
  'profesional': 'professional',
  'questionaire': 'questionnaire',
  'realy': 'really',
  'reccomend': 'recommend',
  'refrence': 'reference',
  'religous': 'religious',
  'repitition': 'repetition',
  'resistence': 'resistance',
  'responsability': 'responsibility',
  'restraunt': 'restaurant',
  'saftey': 'safety',
  'scedule': 'schedule',
  'sieze': 'seize',
  'sence': 'sense',
  'sentance': 'sentence',
  'similer': 'similar',
  'sincerly': 'sincerely',
  'speach': 'speech',
  'strenght': 'strength',
  'studing': 'studying',
  'succede': 'succeed',
  'temperture': 'temperature',
  'thier': 'their',
  'thru': 'through',
  'tounge': 'tongue',
  'twelth': 'twelfth',
  'tyrany': 'tyranny',
  'unfortunatly': 'unfortunately',
  'usally': 'usually',
  'vaccum': 'vacuum',
  'vegatable': 'vegetable',
  'visable': 'visible',
  'wether': 'whether',
  'wich': 'which',
  'yeild': 'yield',
};

// Grammar rules with patterns
interface GrammarRule {
  pattern: RegExp;
  message: string;
  type: GrammarError['type'];
  severity: GrammarError['severity'];
  getSuggestion: (match: RegExpMatchArray) => string;
}

const GRAMMAR_RULES: GrammarRule[] = [
  // Double words
  {
    pattern: /\b(\w+)\s+\1\b/gi,
    message: 'Repeated word detected',
    type: 'grammar',
    severity: 'error',
    getSuggestion: (match) => match[1],
  },
  // a/an usage
  {
    pattern: /\ba\s+([aeiou]\w*)\b/gi,
    message: 'Use "an" before words starting with a vowel sound',
    type: 'grammar',
    severity: 'warning',
    getSuggestion: (match) => `an ${match[1]}`,
  },
  {
    pattern: /\ban\s+([bcdfghjklmnpqrstvwxyz]\w*)\b/gi,
    message: 'Use "a" before words starting with a consonant sound',
    type: 'grammar',
    severity: 'warning',
    getSuggestion: (match) => `a ${match[1]}`,
  },
  // Subject-verb agreement
  {
    pattern: /\b(he|she|it)\s+(are|were|have)\b/gi,
    message: 'Subject-verb agreement error',
    type: 'grammar',
    severity: 'error',
    getSuggestion: (match) => {
      const verb = match[2].toLowerCase();
      const corrections: Record<string, string> = { 'are': 'is', 'were': 'was', 'have': 'has' };
      return `${match[1]} ${corrections[verb] || verb}`;
    },
  },
  {
    pattern: /\b(they|we|you)\s+(is|was|has)\b/gi,
    message: 'Subject-verb agreement error',
    type: 'grammar',
    severity: 'error',
    getSuggestion: (match) => {
      const verb = match[2].toLowerCase();
      const corrections: Record<string, string> = { 'is': 'are', 'was': 'were', 'has': 'have' };
      return `${match[1]} ${corrections[verb] || verb}`;
    },
  },
  // Their/there/they're
  {
    pattern: /\btheir\s+(is|are|was|were)\b/gi,
    message: 'Did you mean "there"?',
    type: 'grammar',
    severity: 'warning',
    getSuggestion: (match) => `there ${match[1]}`,
  },
  // Its/it's
  {
    pattern: /\bits\s+(a|an|the|very|quite|really)\b/gi,
    message: 'Did you mean "it\'s" (it is)?',
    type: 'grammar',
    severity: 'warning',
    getSuggestion: (match) => `it's ${match[1]}`,
  },
  // Your/you're
  {
    pattern: /\byour\s+(welcome|right|wrong|correct|going|doing|being)\b/gi,
    message: 'Did you mean "you\'re" (you are)?',
    type: 'grammar',
    severity: 'warning',
    getSuggestion: (match) => `you're ${match[1]}`,
  },
  // Then/than
  {
    pattern: /\b(more|less|better|worse|bigger|smaller|faster|slower)\s+then\b/gi,
    message: 'Use "than" for comparisons',
    type: 'grammar',
    severity: 'error',
    getSuggestion: (match) => `${match[1]} than`,
  },
  // Affect/effect
  {
    pattern: /\bthe\s+affect\b/gi,
    message: 'Did you mean "effect" (noun)?',
    type: 'grammar',
    severity: 'warning',
    getSuggestion: () => 'the effect',
  },
  // Could of/should of/would of
  {
    pattern: /\b(could|should|would|must|might)\s+of\b/gi,
    message: 'Use "have" instead of "of"',
    type: 'grammar',
    severity: 'error',
    getSuggestion: (match) => `${match[1]} have`,
  },
  // Alot -> a lot
  {
    pattern: /\balot\b/gi,
    message: '"Alot" should be "a lot"',
    type: 'spelling',
    severity: 'error',
    getSuggestion: () => 'a lot',
  },
  // Everyday vs every day
  {
    pattern: /\beveryday\s+(I|we|they|he|she|it|you)\b/gi,
    message: 'Use "every day" (two words) as an adverb',
    type: 'grammar',
    severity: 'warning',
    getSuggestion: (match) => `every day ${match[1]}`,
  },
];

// Punctuation rules
const PUNCTUATION_RULES: GrammarRule[] = [
  // Multiple spaces
  {
    pattern: /\s{2,}/g,
    message: 'Multiple spaces detected',
    type: 'punctuation',
    severity: 'info',
    getSuggestion: () => ' ',
  },
  // Space before punctuation
  {
    pattern: /\s+([.,!?;:])/g,
    message: 'Remove space before punctuation',
    type: 'punctuation',
    severity: 'warning',
    getSuggestion: (match) => match[1],
  },
  // Missing space after punctuation
  {
    pattern: /([.,!?;:])([A-Za-z])/g,
    message: 'Add space after punctuation',
    type: 'punctuation',
    severity: 'warning',
    getSuggestion: (match) => `${match[1]} ${match[2]}`,
  },
  // Sentence should start with capital
  {
    pattern: /[.!?]\s+[a-z]/g,
    message: 'Sentence should start with a capital letter',
    type: 'punctuation',
    severity: 'warning',
    getSuggestion: (match) => match[0].slice(0, -1) + match[0].slice(-1).toUpperCase(),
  },
];

// Style suggestions
const STYLE_RULES: GrammarRule[] = [
  // Passive voice indicators
  {
    pattern: /\b(was|were|is|are|been|being)\s+(being\s+)?\w+ed\b/gi,
    message: 'Consider using active voice',
    type: 'style',
    severity: 'info',
    getSuggestion: (match) => match[0], // No automatic fix for passive voice
  },
  // Very + adjective
  {
    pattern: /\bvery\s+(good|bad|big|small|nice|happy|sad)\b/gi,
    message: 'Consider using a stronger word',
    type: 'style',
    severity: 'info',
    getSuggestion: (match) => {
      const alternatives: Record<string, string> = {
        'good': 'excellent',
        'bad': 'terrible',
        'big': 'enormous',
        'small': 'tiny',
        'nice': 'wonderful',
        'happy': 'delighted',
        'sad': 'devastated',
      };
      return alternatives[match[1].toLowerCase()] || match[0];
    },
  },
];

// Check for spelling errors
function checkSpelling(text: string): GrammarError[] {
  const errors: GrammarError[] = [];
  const words = text.split(/\b/);
  let position = 0;
  
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    if (SPELLING_MISTAKES[lowerWord]) {
      errors.push({
        type: 'spelling',
        message: `"${word}" is commonly misspelled`,
        position: { start: position, end: position + word.length },
        suggestions: [SPELLING_MISTAKES[lowerWord]],
        severity: 'error',
        original: word,
      });
    }
    position += word.length;
  }
  
  return errors;
}

// Check grammar rules
function checkRules(text: string, rules: GrammarRule[]): GrammarError[] {
  const errors: GrammarError[] = [];
  
  for (const rule of rules) {
    let match;
    const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
    
    while ((match = regex.exec(text)) !== null) {
      errors.push({
        type: rule.type,
        message: rule.message,
        position: { start: match.index, end: match.index + match[0].length },
        suggestions: [rule.getSuggestion(match)],
        severity: rule.severity,
        original: match[0],
      });
    }
  }
  
  return errors;
}

// Main grammar check function
export function checkGrammar(text: string): GrammarError[] {
  const errors: GrammarError[] = [];
  
  // Check spelling
  errors.push(...checkSpelling(text));
  
  // Check grammar rules
  errors.push(...checkRules(text, GRAMMAR_RULES));
  
  // Check punctuation
  errors.push(...checkRules(text, PUNCTUATION_RULES));
  
  // Check style
  errors.push(...checkRules(text, STYLE_RULES));
  
  // Sort by position
  errors.sort((a, b) => a.position.start - b.position.start);
  
  // Remove duplicates (same position)
  const uniqueErrors: GrammarError[] = [];
  let lastEnd = -1;
  for (const error of errors) {
    if (error.position.start >= lastEnd) {
      uniqueErrors.push(error);
      lastEnd = error.position.end;
    }
  }
  
  return uniqueErrors;
}

// Apply corrections to text
export function applyCorrections(text: string, errors: GrammarError[]): string {
  // Sort errors by position in reverse order to apply from end to start
  const sortedErrors = [...errors].sort((a, b) => b.position.start - a.position.start);
  
  let result = text;
  for (const error of sortedErrors) {
    if (error.suggestions.length > 0) {
      result = result.slice(0, error.position.start) + 
               error.suggestions[0] + 
               result.slice(error.position.end);
    }
  }
  
  return result;
}
