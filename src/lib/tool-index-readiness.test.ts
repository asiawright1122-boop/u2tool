import { describe, expect, it } from 'vitest';
import {
  evaluateToolIndexReadiness,
  type IndexReadinessEvidence,
} from './tool-index-readiness';

function createEvidence(
  overrides: Partial<IndexReadinessEvidence> = {},
): IndexReadinessEvidence {
  return {
    slug: 'grammar-checker',
    locale: 'en',
    priority: 'pilot',
    hasCapabilityProfile: true,
    capabilityEnforcement: 'release-blocking',
    localEngineSupportsLocale: true,
    capabilityClaimIssues: [],
    content: {
      hasIndependentSplitCopy: true,
      detailedDescriptionLength: 320,
      usageStepCount: 4,
      usageExampleCount: 3,
      faqCount: 4,
      duplicateContentKey: null,
      fallbackUsed: false,
    },
    technical: {
      routeExists: true,
      inSitemap: true,
      canonicalSelfReferences: true,
      hreflangPasses: true,
      renderedStatus: 200,
    },
    demand: {
      currentClicks: 8,
      currentImpressions: 120,
      historicalClicks: 5,
      historicalImpressions: 90,
      topQueryShare: 0.4,
    },
    overlap: {
      strongerSiblingSlug: null,
      samePrimaryIntent: false,
    },
    protectedControl: false,
    ...overrides,
  };
}

describe('evaluateToolIndexReadiness', () => {
  it('recommends improving a demanded page when technical evidence fails', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        technical: {
          routeExists: false,
          inSitemap: false,
          canonicalSelfReferences: false,
          hreflangPasses: false,
          renderedStatus: 500,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'improve',
      reasons: [
        'technical-route-missing',
        'technical-sitemap-missing',
        'technical-canonical-failed',
        'technical-hreflang-failed',
        'technical-rendered-status-failed',
        'current-demand-present',
        'historical-demand-present',
      ],
      missingEvidence: [],
      reviewRequired: false,
    });
  });

  it('recommends improving a demanded page with a capability claim issue', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        capabilityClaimIssues: ['grammar-checker-ai-claim'],
      }),
    );

    expect(decision).toEqual({
      recommendation: 'improve',
      reasons: [
        'capability-claim-issue',
        'current-demand-present',
        'historical-demand-present',
      ],
      missingEvidence: [],
      reviewRequired: false,
    });
  });

  it('improves an unsupported demanded locale before considering sibling overlap', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        localEngineSupportsLocale: false,
        overlap: {
          strongerSiblingSlug: 'spell-checker',
          samePrimaryIntent: true,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'improve',
      reasons: [
        'locale-engine-unsupported',
        'current-demand-present',
        'historical-demand-present',
      ],
      missingEvidence: [],
      reviewRequired: false,
    });
  });

  it('keeps a demanded page with supported locale, strong content, and healthy technical evidence', () => {
    const decision = evaluateToolIndexReadiness(createEvidence());

    expect(decision).toEqual({
      recommendation: 'keep',
      reasons: [
        'content-readiness-strong',
        'locale-engine-supported',
        'technical-evidence-healthy',
        'current-demand-present',
        'historical-demand-present',
      ],
      missingEvidence: [],
      reviewRequired: false,
    });
    expect(decision).not.toHaveProperty('score');
  });

  it('recommends merging a demanded page with a stronger same-intent sibling', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        overlap: {
          strongerSiblingSlug: 'spell-checker',
          samePrimaryIntent: true,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'merge',
      reasons: [
        'stronger-sibling-overlap',
        'current-demand-present',
        'historical-demand-present',
      ],
      missingEvidence: [],
      reviewRequired: true,
    });
  });

  it('flags an unsupported zero-demand fallback page as a noindex candidate', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        localEngineSupportsLocale: false,
        content: {
          hasIndependentSplitCopy: false,
          detailedDescriptionLength: 90,
          usageStepCount: 1,
          usageExampleCount: 0,
          faqCount: 0,
          duplicateContentKey: 'fallback:grammar-checker',
          fallbackUsed: true,
        },
        demand: {
          currentClicks: 0,
          currentImpressions: 0,
          historicalClicks: 0,
          historicalImpressions: 0,
          topQueryShare: null,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'noindex-candidate',
      reasons: [
        'zero-demand',
        'locale-engine-unsupported',
        'fallback-content-used',
        'independent-split-copy-missing',
      ],
      missingEvidence: [],
      reviewRequired: true,
    });
  });

  it('requires manual review when canonical, hreflang, or rendered evidence is missing', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        technical: {
          routeExists: true,
          inSitemap: true,
          canonicalSelfReferences: null,
          hreflangPasses: null,
          renderedStatus: null,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'manual-review',
      reasons: [
        'technical-canonical-missing',
        'technical-hreflang-missing',
        'technical-rendered-status-missing',
      ],
      missingEvidence: [
        'technical.canonicalSelfReferences',
        'technical.hreflangPasses',
        'technical.renderedStatus',
      ],
      reviewRequired: true,
    });
  });

  it('requires manual review when a demanded page lacks query-share evidence', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        demand: {
          currentClicks: 8,
          currentImpressions: 120,
          historicalClicks: 5,
          historicalImpressions: 90,
          topQueryShare: null,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'manual-review',
      reasons: ['demand-top-query-share-missing'],
      missingEvidence: ['demand.topQueryShare'],
      reviewRequired: true,
    });
  });

  it('requires manual review for a protected control before evaluating any other rule', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        protectedControl: true,
        technical: {
          routeExists: false,
          inSitemap: false,
          canonicalSelfReferences: null,
          hreflangPasses: null,
          renderedStatus: null,
        },
        overlap: {
          strongerSiblingSlug: 'spell-checker',
          samePrimaryIntent: true,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'manual-review',
      reasons: ['protected-control'],
      missingEvidence: [],
      reviewRequired: true,
    });
  });

  it('requires manual review for a pilot release candidate without a capability profile', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        hasCapabilityProfile: false,
        capabilityEnforcement: 'unprofiled',
        capabilityClaimIssues: ['grammar-checker-ai-claim'],
        overlap: {
          strongerSiblingSlug: 'spell-checker',
          samePrimaryIntent: true,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'manual-review',
      reasons: ['capability-profile-missing'],
      missingEvidence: ['capability.profile'],
      reviewRequired: true,
    });
  });

  it('requires manual review for an inventory-only P1 release candidate', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        priority: 'p1',
        capabilityEnforcement: 'inventory',
      }),
    );

    expect(decision).toEqual({
      recommendation: 'manual-review',
      reasons: ['capability-enforcement-not-release-blocking'],
      missingEvidence: [],
      reviewRequired: true,
    });
  });

  it('adds a reason and prevents automatic keep when one query exceeds 0.80 share', () => {
    const decision = evaluateToolIndexReadiness(
      createEvidence({
        demand: {
          currentClicks: 8,
          currentImpressions: 120,
          historicalClicks: 5,
          historicalImpressions: 90,
          topQueryShare: 0.81,
        },
      }),
    );

    expect(decision).toEqual({
      recommendation: 'improve',
      reasons: [
        'one-query-dominance',
        'current-demand-present',
        'historical-demand-present',
      ],
      missingEvidence: [],
      reviewRequired: false,
    });
    expect(decision.recommendation).not.toBe('keep');
  });
});
