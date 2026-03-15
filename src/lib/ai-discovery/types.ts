export interface DiscoveryCandidate {
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryName: string;
  aliases?: string[];
}

export interface DiscoveryMatch extends DiscoveryCandidate {
  score: number;
  matchedTerms: string[];
}

export interface IntentDictionary {
  keywordsBySlug?: Record<string, string[]>;
  keywordsByCategory?: Record<string, string[]>;
}

export type DiscoveryDecision = 'direct' | 'suggest' | 'fallback';
