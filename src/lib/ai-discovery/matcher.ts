import { normalizeQuery, tokenizeQuery } from './normalize';
import type { DiscoveryCandidate, DiscoveryMatch, IntentDictionary } from './types';

function includesAny(text: string, values: string[]): boolean {
  for (const value of values) {
    if (text.includes(value)) {
      return true;
    }
  }
  return false;
}

export function matchTools(
  query: string,
  toolCandidates: DiscoveryCandidate[],
  intentDictionary: IntentDictionary = {},
  maxResults = 8
): DiscoveryMatch[] {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) {
    return [];
  }

  const queryTokens = tokenizeQuery(normalizedQuery);
  const results: DiscoveryMatch[] = [];

  for (const candidate of toolCandidates) {
    const normalizedName = normalizeQuery(candidate.name);
    const normalizedDescription = normalizeQuery(candidate.description);
    const normalizedSeoTitle = normalizeQuery(candidate.seoTitle ?? '');
    const normalizedSeoDescription = normalizeQuery(candidate.seoDescription ?? '');
    const normalizedCategoryName = normalizeQuery(candidate.categoryName);
    const normalizedAliases = (candidate.aliases ?? []).map((alias) => normalizeQuery(alias));

    let score = 0;
    const matchedTerms = new Set<string>();

    if (normalizedName === normalizedQuery) {
      score += 250;
      matchedTerms.add('exact_name');
    } else if (normalizedName.startsWith(normalizedQuery)) {
      score += 120;
      matchedTerms.add('name_prefix');
    } else if (normalizedName.includes(normalizedQuery)) {
      score += 80;
      matchedTerms.add('name_contains');
    }

    if (normalizedDescription.includes(normalizedQuery)) {
      score += 30;
      matchedTerms.add('description_contains');
    }

    if (normalizedSeoTitle === normalizedQuery) {
      score += 180;
      matchedTerms.add('seo_title_exact');
    } else if (normalizedSeoTitle.includes(normalizedQuery)) {
      score += 70;
      matchedTerms.add('seo_title_contains');
    }

    if (normalizedSeoDescription.includes(normalizedQuery)) {
      score += 24;
      matchedTerms.add('seo_description_contains');
    }

    if (queryTokens.length > 0 && queryTokens.every((token) => normalizedName.includes(token))) {
      score += 90;
      matchedTerms.add('name_all_tokens');
    }

    if (queryTokens.length > 0 && queryTokens.every((token) => normalizedSeoTitle.includes(token))) {
      score += 70;
      matchedTerms.add('seo_title_all_tokens');
    }

    if (
      queryTokens.length > 0 &&
      queryTokens.every((token) => normalizedSeoDescription.includes(token))
    ) {
      score += 80;
      matchedTerms.add('seo_description_all_tokens');
    }

    if (normalizedCategoryName.includes(normalizedQuery)) {
      score += 25;
      matchedTerms.add('category_contains');
    }

    for (const token of queryTokens) {
      if (token.length < 2) {
        continue;
      }

      if (normalizedName.includes(token)) {
        score += 20;
        matchedTerms.add(`name:${token}`);
      }
      if (normalizedDescription.includes(token)) {
        score += 8;
        matchedTerms.add(`description:${token}`);
      }
      if (normalizedSeoTitle.includes(token)) {
        score += 12;
        matchedTerms.add(`seo_title:${token}`);
      }
      if (normalizedSeoDescription.includes(token)) {
        score += 6;
        matchedTerms.add(`seo_description:${token}`);
      }
      if (normalizedCategoryName.includes(token)) {
        score += 6;
        matchedTerms.add(`category:${token}`);
      }
      if (includesAny(token, normalizedAliases) || includesAny(normalizedQuery, normalizedAliases)) {
        score += 18;
        matchedTerms.add(`alias:${token}`);
      }
    }

    const slugIntentKeywords = (intentDictionary.keywordsBySlug?.[candidate.slug] ?? [])
      .map((keyword) => normalizeQuery(keyword))
      .filter(Boolean);

    for (const keyword of slugIntentKeywords) {
      if (normalizedQuery.includes(keyword)) {
        score += 70;
        matchedTerms.add(`slug_intent:${keyword}`);
      }
    }

    const categoryIntentKeywords = (intentDictionary.keywordsByCategory?.[candidate.category] ?? [])
      .map((keyword) => normalizeQuery(keyword))
      .filter(Boolean);

    for (const keyword of categoryIntentKeywords) {
      if (normalizedQuery.includes(keyword)) {
        score += 18;
        matchedTerms.add(`category_intent:${keyword}`);
      }
    }

    if (score > 0) {
      results.push({
        ...candidate,
        score,
        matchedTerms: Array.from(matchedTerms),
      });
    }
  }

  return results
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, maxResults);
}
