import {
  convertShoeSize,
  getAvailableSizes,
  type Gender,
  type SizeSystem,
} from './data/shoe-sizes';

export type NumberBase = 2 | 8 | 10 | 16;

export interface KeywordResult {
  word: string;
  count: number;
  density: number;
}

export interface KeywordAnalysisResult {
  totalWords: number;
  results: KeywordResult[];
  topPhrases2: Array<[string, number]>;
  topPhrases3: Array<[string, number]>;
}

export interface Team {
  name: string;
  members: string[];
}

const COMMON_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'shall', 'can', 'need', 'dare', 'ought', 'used', 'it', 'its', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who',
  'whom', 'whose', 'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both',
  'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there',
]);

export function analyzeKeywordDensity(
  text: string,
  minLength: number,
  excludeCommon: boolean
): KeywordAnalysisResult | null {
  if (!text.trim()) {
    return null;
  }

  const words = text.toLowerCase().match(/\b[a-zA-Z]+\b/g) || [];
  const totalWords = words.length;
  const normalizedMinLength = Math.max(1, Math.floor(minLength) || 1);

  const wordCount: Record<string, number> = {};
  for (const word of words) {
    if (word.length >= normalizedMinLength && (!excludeCommon || !COMMON_WORDS.has(word))) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  }

  const results: KeywordResult[] = Object.entries(wordCount)
    .map(([word, count]) => ({
      word,
      count,
      density: totalWords > 0 ? (count / totalWords) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);

  const phrases2: Record<string, number> = {};
  const phrases3: Record<string, number> = {};

  for (let index = 0; index < words.length - 1; index += 1) {
    const phrase2 = `${words[index]} ${words[index + 1]}`;
    phrases2[phrase2] = (phrases2[phrase2] || 0) + 1;

    if (index < words.length - 2) {
      const phrase3 = `${words[index]} ${words[index + 1]} ${words[index + 2]}`;
      phrases3[phrase3] = (phrases3[phrase3] || 0) + 1;
    }
  }

  return {
    totalWords,
    results,
    topPhrases2: Object.entries(phrases2)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    topPhrases3: Object.entries(phrases3)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
  };
}

export function validateNumberInput(value: string, base: NumberBase): boolean {
  if (!value.trim()) return true;

  const patterns: Record<NumberBase, RegExp> = {
    2: /^[01]+$/i,
    8: /^[0-7]+$/i,
    10: /^[0-9]+$/i,
    16: /^[0-9a-f]+$/i,
  };

  return patterns[base].test(value.trim());
}

export function convertNumberBase(
  value: string,
  fromBase: NumberBase,
  toBase: NumberBase
): string {
  const trimmed = value.trim();
  if (!trimmed || !validateNumberInput(trimmed, fromBase)) {
    return '';
  }

  const decimal = Number.parseInt(trimmed, fromBase);
  if (Number.isNaN(decimal)) {
    return '';
  }

  return decimal.toString(toBase).toUpperCase();
}

export function generateTeams(
  members: string[],
  requestedTeamCount: number,
  providedNames: string[],
  fallbackLabel: string,
  random: () => number = Math.random
): Team[] {
  const cleanedMembers = members.map((member) => member.trim()).filter(Boolean);
  if (cleanedMembers.length === 0) {
    return [];
  }

  const teamCount = Math.max(1, Math.min(Math.floor(requestedTeamCount) || 1, cleanedMembers.length));
  const shuffledMembers = [...cleanedMembers];

  for (let index = shuffledMembers.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffledMembers[index], shuffledMembers[swapIndex]] = [
      shuffledMembers[swapIndex],
      shuffledMembers[index],
    ];
  }

  const teams: Team[] = Array.from({ length: teamCount }, (_, index) => ({
    name: providedNames[index]?.trim() || `${fallbackLabel} ${index + 1}`,
    members: [],
  }));

  shuffledMembers.forEach((member, index) => {
    teams[index % teamCount].members.push(member);
  });

  return teams;
}

export function areShoeSystemsConsistent(gender: Gender, from: SizeSystem, to: SizeSystem): boolean {
  const sizes = getAvailableSizes(from, gender);
  return sizes.every((size) => convertShoeSize(size, from, to, gender) !== null);
}
