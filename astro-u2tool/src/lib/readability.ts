// Readability calculation utilities

export interface ReadabilityMetrics {
  fleschKincaidGrade: number;
  fleschReadingEase: number;
  gunningFogIndex: number;
  smogIndex: number;
  automatedReadabilityIndex: number;
  colemanLiauIndex: number;
  averageSentenceLength: number;
  averageWordLength: number;
  syllablesPerWord: number;
  wordCount: number;
  sentenceCount: number;
  characterCount: number;
}

export interface ReadabilityResult {
  metrics: ReadabilityMetrics;
  gradeLevel: string;
  readingTime: number; // minutes
  suggestions: string[];
}

// Count syllables in a word using a simple algorithm
export function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;
  
  // Remove non-alphabetic characters
  word = word.replace(/[^a-z]/g, '');
  if (!word) return 0;
  
  // Count vowel groups
  let count = 0;
  const vowels = 'aeiouy';
  let prevIsVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !prevIsVowel) {
      count++;
    }
    prevIsVowel = isVowel;
  }
  
  // Handle silent 'e' at the end
  if (word.endsWith('e') && count > 1) {
    count--;
  }
  
  // Handle special endings
  if (word.endsWith('le') && word.length > 2 && !vowels.includes(word[word.length - 3])) {
    count++;
  }
  
  // Ensure at least 1 syllable
  return Math.max(1, count);
}

// Count complex words (3+ syllables)
export function countComplexWords(words: string[]): number {
  return words.filter(word => countSyllables(word) >= 3).length;
}

// Split text into sentences
export function getSentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Split text into words
export function getWords(text: string): string[] {
  return text
    .split(/\s+/)
    .map(w => w.replace(/[^a-zA-Z0-9'-]/g, ''))
    .filter(w => w.length > 0);
}

// Calculate Flesch Reading Ease
// Score: 0-100 (higher = easier to read)
export function calculateFleschReadingEase(
  totalWords: number,
  totalSentences: number,
  totalSyllables: number
): number {
  if (totalWords === 0 || totalSentences === 0) return 0;
  
  const asl = totalWords / totalSentences; // Average Sentence Length
  const asw = totalSyllables / totalWords; // Average Syllables per Word
  
  const score = 206.835 - (1.015 * asl) - (84.6 * asw);
  return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
}

// Calculate Flesch-Kincaid Grade Level
export function calculateFleschKincaidGrade(
  totalWords: number,
  totalSentences: number,
  totalSyllables: number
): number {
  if (totalWords === 0 || totalSentences === 0) return 0;
  
  const asl = totalWords / totalSentences;
  const asw = totalSyllables / totalWords;
  
  const grade = (0.39 * asl) + (11.8 * asw) - 15.59;
  return Math.max(0, Math.min(20, Math.round(grade * 10) / 10));
}

// Calculate Gunning Fog Index
export function calculateGunningFog(
  totalWords: number,
  totalSentences: number,
  complexWords: number
): number {
  if (totalWords === 0 || totalSentences === 0) return 0;
  
  const asl = totalWords / totalSentences;
  const phw = (complexWords / totalWords) * 100;
  
  const fog = 0.4 * (asl + phw);
  return Math.max(0, Math.min(20, Math.round(fog * 10) / 10));
}

// Calculate SMOG Index
export function calculateSMOG(
  totalSentences: number,
  complexWords: number
): number {
  if (totalSentences === 0) return 0;
  
  const smog = 1.0430 * Math.sqrt(complexWords * (30 / totalSentences)) + 3.1291;
  return Math.max(0, Math.min(20, Math.round(smog * 10) / 10));
}

// Calculate Automated Readability Index
export function calculateARI(
  totalCharacters: number,
  totalWords: number,
  totalSentences: number
): number {
  if (totalWords === 0 || totalSentences === 0) return 0;
  
  const ari = 4.71 * (totalCharacters / totalWords) + 0.5 * (totalWords / totalSentences) - 21.43;
  return Math.max(0, Math.min(20, Math.round(ari * 10) / 10));
}

// Calculate Coleman-Liau Index
export function calculateColemanLiau(
  totalCharacters: number,
  totalWords: number,
  totalSentences: number
): number {
  if (totalWords === 0) return 0;
  
  const l = (totalCharacters / totalWords) * 100; // Average letters per 100 words
  const s = (totalSentences / totalWords) * 100; // Average sentences per 100 words
  
  const cli = 0.0588 * l - 0.296 * s - 15.8;
  return Math.max(0, Math.min(20, Math.round(cli * 10) / 10));
}

// Get grade level description
export function getGradeLevel(grade: number): string {
  if (grade <= 1) return '1st Grade';
  if (grade <= 2) return '2nd Grade';
  if (grade <= 3) return '3rd Grade';
  if (grade <= 4) return '4th Grade';
  if (grade <= 5) return '5th Grade';
  if (grade <= 6) return '6th Grade';
  if (grade <= 7) return '7th Grade';
  if (grade <= 8) return '8th Grade';
  if (grade <= 9) return '9th Grade';
  if (grade <= 10) return '10th Grade';
  if (grade <= 11) return '11th Grade';
  if (grade <= 12) return '12th Grade';
  if (grade <= 14) return 'College';
  return 'Graduate';
}

// Calculate reading time (average 200-250 words per minute)
export function calculateReadingTime(wordCount: number): number {
  return Math.ceil(wordCount / 225);
}

// Generate improvement suggestions
export function generateSuggestions(metrics: ReadabilityMetrics): string[] {
  const suggestions: string[] = [];
  
  if (metrics.averageSentenceLength > 20) {
    suggestions.push('Consider breaking long sentences into shorter ones for better readability.');
  }
  
  if (metrics.syllablesPerWord > 1.7) {
    suggestions.push('Try using simpler words with fewer syllables.');
  }
  
  if (metrics.fleschReadingEase < 60) {
    suggestions.push('The text may be difficult to read. Consider simplifying the language.');
  }
  
  if (metrics.gunningFogIndex > 12) {
    suggestions.push('Reduce the use of complex words (3+ syllables) to improve clarity.');
  }
  
  if (metrics.fleschKincaidGrade > 10) {
    suggestions.push('The text requires a high reading level. Consider your target audience.');
  }
  
  if (suggestions.length === 0) {
    suggestions.push('The text has good readability. Keep up the good work!');
  }
  
  return suggestions;
}

// Main function to calculate all readability metrics
export function calculateReadability(text: string): ReadabilityResult {
  const sentences = getSentences(text);
  const words = getWords(text);
  
  const totalSentences = sentences.length;
  const totalWords = words.length;
  const totalCharacters = words.join('').length;
  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
  const complexWords = countComplexWords(words);
  
  const metrics: ReadabilityMetrics = {
    fleschReadingEase: calculateFleschReadingEase(totalWords, totalSentences, totalSyllables),
    fleschKincaidGrade: calculateFleschKincaidGrade(totalWords, totalSentences, totalSyllables),
    gunningFogIndex: calculateGunningFog(totalWords, totalSentences, complexWords),
    smogIndex: calculateSMOG(totalSentences, complexWords),
    automatedReadabilityIndex: calculateARI(totalCharacters, totalWords, totalSentences),
    colemanLiauIndex: calculateColemanLiau(totalCharacters, totalWords, totalSentences),
    averageSentenceLength: totalSentences > 0 ? Math.round((totalWords / totalSentences) * 10) / 10 : 0,
    averageWordLength: totalWords > 0 ? Math.round((totalCharacters / totalWords) * 10) / 10 : 0,
    syllablesPerWord: totalWords > 0 ? Math.round((totalSyllables / totalWords) * 10) / 10 : 0,
    wordCount: totalWords,
    sentenceCount: totalSentences,
    characterCount: totalCharacters,
  };
  
  // Use average of grade-level metrics
  const avgGrade = (
    metrics.fleschKincaidGrade +
    metrics.gunningFogIndex +
    metrics.smogIndex +
    metrics.automatedReadabilityIndex +
    metrics.colemanLiauIndex
  ) / 5;
  
  return {
    metrics,
    gradeLevel: getGradeLevel(avgGrade),
    readingTime: calculateReadingTime(totalWords),
    suggestions: generateSuggestions(metrics),
  };
}
