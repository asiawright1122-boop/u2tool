import { describe, expect, it } from 'vitest';

import {
  organicRecoveryPrioritySlugs,
  organicSearchProfiles,
  organicPortfolioScore,
  tierForOrganicPortfolioScore,
} from './organic-search-portfolio';

describe('organic search portfolio', () => {
  it('keeps locale and slug profiles unique', () => {
    const keys = organicSearchProfiles.map((profile) => `${profile.locale}/${profile.slug}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('keeps declared tiers aligned with the scoring thresholds', () => {
    for (const profile of organicSearchProfiles) {
      expect(tierForOrganicPortfolioScore(organicPortfolioScore(profile))).toBe(profile.tier);
    }
  });

  it('puts the five evidence-backed recovery slugs first', () => {
    expect(organicRecoveryPrioritySlugs).toEqual([
      'html-preview',
      'ip-validator',
      'ip-lookup',
      'iban-validator',
      'ical-parser',
    ]);
  });

  it('keeps capability-first and governance-hold profiles out of P0', () => {
    const blockedProfiles = organicSearchProfiles.filter((profile) =>
      ['capability-first', 'governance-hold'].includes(profile.status)
    );

    expect(blockedProfiles.length).toBeGreaterThan(0);
    expect(blockedProfiles.every((profile) => profile.tier !== 'P0')).toBe(true);
  });
});
