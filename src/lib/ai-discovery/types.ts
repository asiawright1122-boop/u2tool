export interface DiscoveryCandidate {
  slug: string;
  href?: string;
  kind?: 'comparison' | 'tool';
  name: string;
  description: string;
  seoTitle?: string;
  seoDescription?: string;
  category: string;
  categoryName: string;
  aliases?: readonly string[];
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
