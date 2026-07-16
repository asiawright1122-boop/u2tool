import type { Locale } from '@/lib/i18n';

export type IndexRecommendation =
  | 'keep'
  | 'improve'
  | 'merge'
  | 'noindex-candidate'
  | 'manual-review';

export interface GscDemandEvidence {
  currentClicks: number;
  currentImpressions: number;
  historicalClicks: number;
  historicalImpressions: number;
  topQueryShare: number | null;
}

export interface ContentEvidence {
  hasIndependentSplitCopy: boolean;
  detailedDescriptionLength: number;
  usageStepCount: number;
  usageExampleCount: number;
  faqCount: number;
  duplicateContentKey: string | null;
  fallbackUsed: boolean;
}

export interface TechnicalEvidence {
  routeExists: boolean;
  inSitemap: boolean;
  canonicalSelfReferences: boolean | null;
  hreflangPasses: boolean | null;
  renderedStatus: number | null;
}

export interface OverlapEvidence {
  strongerSiblingSlug: string | null;
  samePrimaryIntent: boolean;
}

export interface IndexReadinessEvidence {
  slug: string;
  locale: Locale;
  priority: 'pilot' | 'p1' | 'catalog';
  hasCapabilityProfile: boolean;
  capabilityEnforcement: 'inventory' | 'release-blocking' | 'unprofiled';
  localEngineSupportsLocale: boolean;
  capabilityClaimIssues: string[];
  content: ContentEvidence;
  technical: TechnicalEvidence;
  demand: GscDemandEvidence;
  overlap: OverlapEvidence;
  protectedControl: boolean;
}

export interface IndexReadinessDecision {
  recommendation: IndexRecommendation;
  reasons: string[];
  missingEvidence: string[];
  reviewRequired: boolean;
}

const STRONG_CONTENT_MINIMUMS = {
  detailedDescriptionLength: 220,
  usageStepCount: 3,
  usageExampleCount: 2,
  faqCount: 3,
} as const;

function demandReasons(demand: GscDemandEvidence): string[] {
  const reasons: string[] = [];

  if (demand.currentClicks > 0 || demand.currentImpressions > 0) {
    reasons.push('current-demand-present');
  }

  if (demand.historicalClicks > 0 || demand.historicalImpressions > 0) {
    reasons.push('historical-demand-present');
  }

  return reasons;
}

function hasStrongContent(content: ContentEvidence): boolean {
  return (
    content.hasIndependentSplitCopy &&
    content.detailedDescriptionLength >= STRONG_CONTENT_MINIMUMS.detailedDescriptionLength &&
    content.usageStepCount >= STRONG_CONTENT_MINIMUMS.usageStepCount &&
    content.usageExampleCount >= STRONG_CONTENT_MINIMUMS.usageExampleCount &&
    content.faqCount >= STRONG_CONTENT_MINIMUMS.faqCount &&
    content.duplicateContentKey === null &&
    !content.fallbackUsed
  );
}

function hasHealthyTechnicalEvidence(technical: TechnicalEvidence): boolean {
  return (
    technical.routeExists &&
    technical.inSitemap &&
    technical.canonicalSelfReferences === true &&
    technical.hreflangPasses === true &&
    technical.renderedStatus === 200
  );
}

function missingCriticalEvidence(
  evidence: IndexReadinessEvidence,
  hasDemand: boolean,
): {
  reasons: string[];
  fields: string[];
} {
  const reasons: string[] = [];
  const fields: string[] = [];
  const { technical } = evidence;

  if (technical.canonicalSelfReferences === null) {
    reasons.push('technical-canonical-missing');
    fields.push('technical.canonicalSelfReferences');
  }

  if (technical.hreflangPasses === null) {
    reasons.push('technical-hreflang-missing');
    fields.push('technical.hreflangPasses');
  }

  if (technical.renderedStatus === null) {
    reasons.push('technical-rendered-status-missing');
    fields.push('technical.renderedStatus');
  }

  if (hasDemand && evidence.demand.topQueryShare === null) {
    reasons.push('demand-top-query-share-missing');
    fields.push('demand.topQueryShare');
  }

  return { reasons, fields };
}

function technicalFailureReasons(technical: TechnicalEvidence): string[] {
  const reasons: string[] = [];

  if (!technical.routeExists) {
    reasons.push('technical-route-missing');
  }

  if (!technical.inSitemap) {
    reasons.push('technical-sitemap-missing');
  }

  if (technical.canonicalSelfReferences === false) {
    reasons.push('technical-canonical-failed');
  }

  if (technical.hreflangPasses === false) {
    reasons.push('technical-hreflang-failed');
  }

  if (technical.renderedStatus !== null && technical.renderedStatus !== 200) {
    reasons.push('technical-rendered-status-failed');
  }

  return reasons;
}

function incompleteReadinessReasons(evidence: IndexReadinessEvidence): string[] {
  const reasons: string[] = [];

  if (!evidence.localEngineSupportsLocale) {
    reasons.push('locale-engine-unsupported');
  }

  if (!evidence.content.hasIndependentSplitCopy) {
    reasons.push('independent-split-copy-missing');
  }

  if (
    evidence.content.detailedDescriptionLength <
    STRONG_CONTENT_MINIMUMS.detailedDescriptionLength
  ) {
    reasons.push('content-detailed-description-thin');
  }

  if (evidence.content.usageStepCount < STRONG_CONTENT_MINIMUMS.usageStepCount) {
    reasons.push('content-usage-steps-thin');
  }

  if (
    evidence.content.usageExampleCount <
    STRONG_CONTENT_MINIMUMS.usageExampleCount
  ) {
    reasons.push('content-usage-examples-thin');
  }

  if (evidence.content.faqCount < STRONG_CONTENT_MINIMUMS.faqCount) {
    reasons.push('content-faqs-thin');
  }

  if (evidence.content.duplicateContentKey !== null) {
    reasons.push('duplicate-content-detected');
  }

  if (evidence.content.fallbackUsed) {
    reasons.push('fallback-content-used');
  }

  if (
    evidence.demand.topQueryShare !== null &&
    evidence.demand.topQueryShare > 0.8
  ) {
    reasons.push('one-query-dominance');
  }

  return reasons;
}

export function evaluateToolIndexReadiness(
  evidence: IndexReadinessEvidence,
): IndexReadinessDecision {
  if (evidence.protectedControl) {
    return {
      recommendation: 'manual-review',
      reasons: ['protected-control'],
      missingEvidence: [],
      reviewRequired: true,
    };
  }

  const demand = demandReasons(evidence.demand);
  const missing = missingCriticalEvidence(evidence, demand.length > 0);

  if (missing.fields.length > 0) {
    return {
      recommendation: 'manual-review',
      reasons: missing.reasons,
      missingEvidence: missing.fields,
      reviewRequired: true,
    };
  }

  const technicalFailures = technicalFailureReasons(evidence.technical);

  if (technicalFailures.length > 0) {
    return {
      recommendation: 'improve',
      reasons: [...technicalFailures, ...demand],
      missingEvidence: [],
      reviewRequired: false,
    };
  }

  if (
    evidence.priority !== 'catalog' &&
    !evidence.hasCapabilityProfile
  ) {
    return {
      recommendation: 'manual-review',
      reasons: ['capability-profile-missing'],
      missingEvidence: ['capability.profile'],
      reviewRequired: true,
    };
  }

  if (
    evidence.priority !== 'catalog' &&
    evidence.capabilityEnforcement !== 'release-blocking'
  ) {
    return {
      recommendation: 'manual-review',
      reasons: ['capability-enforcement-not-release-blocking'],
      missingEvidence: [],
      reviewRequired: true,
    };
  }

  if (
    demand.length > 0 &&
    (evidence.capabilityClaimIssues.length > 0 ||
      !evidence.localEngineSupportsLocale)
  ) {
    const reasons: string[] = [];

    if (evidence.capabilityClaimIssues.length > 0) {
      reasons.push('capability-claim-issue');
    }

    if (!evidence.localEngineSupportsLocale) {
      reasons.push('locale-engine-unsupported');
    }

    return {
      recommendation: 'improve',
      reasons: [...reasons, ...demand],
      missingEvidence: [],
      reviewRequired: false,
    };
  }

  if (
    evidence.overlap.strongerSiblingSlug !== null &&
    evidence.overlap.samePrimaryIntent
  ) {
    return {
      recommendation: 'merge',
      reasons: ['stronger-sibling-overlap', ...demand],
      missingEvidence: [],
      reviewRequired: true,
    };
  }

  if (
    demand.length === 0 &&
    !evidence.localEngineSupportsLocale &&
    evidence.content.fallbackUsed &&
    !evidence.content.hasIndependentSplitCopy
  ) {
    return {
      recommendation: 'noindex-candidate',
      reasons: [
        'zero-demand',
        'locale-engine-unsupported',
        'fallback-content-used',
        'independent-split-copy-missing',
      ],
      missingEvidence: [],
      reviewRequired: true,
    };
  }

  if (
    demand.length > 0 &&
    evidence.localEngineSupportsLocale &&
    hasStrongContent(evidence.content) &&
    hasHealthyTechnicalEvidence(evidence.technical) &&
    (evidence.demand.topQueryShare === null || evidence.demand.topQueryShare <= 0.8)
  ) {
    return {
      recommendation: 'keep',
      reasons: [
        'content-readiness-strong',
        'locale-engine-supported',
        'technical-evidence-healthy',
        ...demand,
      ],
      missingEvidence: [],
      reviewRequired: false,
    };
  }

  if (demand.length > 0) {
    return {
      recommendation: 'improve',
      reasons: [...incompleteReadinessReasons(evidence), ...demand],
      missingEvidence: [],
      reviewRequired: false,
    };
  }

  return {
    recommendation: 'manual-review',
    reasons: ['readiness-decision-ambiguous'],
    missingEvidence: [],
    reviewRequired: true,
  };
}
