export interface ReadinessDemandEvidence {
  currentClicks: number | null;
  currentImpressions: number | null;
  historicalClicks: number | null;
  historicalImpressions: number | null;
}

export interface ReadinessContentEvidence {
  hasIndependentSplitCopy: boolean;
  detailedDescriptionLength: number;
  usageStepCount: number;
  usageExampleCount: number;
  faqCount: number;
  duplicateContentKey: string | null;
  fallbackUsed: boolean;
}

export interface SuppressionReadinessRow {
  url: string;
  demandCoverage: {
    currentPageRow: boolean;
    historicalPageRow: boolean;
  };
  decision: {
    recommendation: string;
    missingEvidence: string[];
  };
  evidence: {
    demand: ReadinessDemandEvidence;
    content: ReadinessContentEvidence;
  };
}

export interface SupplementalDemandRow {
  url: string;
  clicks: number;
  impressions: number;
}

export interface SupplementalDemandEvidence {
  clicks: number;
  impressions: number;
}

export interface SuppressionEntry {
  locale: string;
  slug: string;
}

export interface SuppressionPolicyResult {
  suppression: SuppressionEntry[];
  retention: SuppressionEntry[];
  recovered: SuppressionEntry[];
  newlySuppressed: SuppressionEntry[];
  heldSuppressed: SuppressionEntry[];
  heldRetained: SuppressionEntry[];
}

export interface SuppressionPolicyInput {
  rows: readonly SuppressionReadinessRow[];
  renderedKeys: ReadonlySet<string>;
  protectedKeys: ReadonlySet<string>;
  existingSuppressedKeys: ReadonlySet<string>;
  supplementalDemandByKey: ReadonlyMap<string, SupplementalDemandEvidence>;
}

const STRONG_CONTENT_MINIMUMS = {
  detailedDescriptionLength: 220,
  usageStepCount: 3,
  usageExampleCount: 2,
  faqCount: 3,
} as const;

export const RECOVERY_DEMAND_MINIMUMS = {
  clicks: 1,
  impressions: 100,
} as const;

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

function sortEntries(entries: SuppressionEntry[]): SuppressionEntry[] {
  return entries.sort(
    (left, right) =>
      left.locale.localeCompare(right.locale) || left.slug.localeCompare(right.slug),
  );
}

export function toolKeyFromUrl(input: string): string | null {
  try {
    const url = new URL(input);
    if (!['u2tool.com', 'www.u2tool.com'].includes(url.hostname.toLowerCase())) {
      return null;
    }
    const match = /^\/([a-z]{2})\/tools\/([^/]+)\/?$/u.exec(url.pathname);
    return match ? `${match[1]}/${match[2]}` : null;
  } catch {
    return null;
  }
}

export function parseExistingSuppressionKeys(source: string): Set<string> {
  return new Set(
    [...source.matchAll(/^\s*'([a-z]{2}\/[^']+)': true,$/gmu)].map(
      ([, key]) => key,
    ),
  );
}

export function indexSupplementalDemand(
  rows: readonly SupplementalDemandRow[],
): Map<string, SupplementalDemandEvidence> {
  const indexed = new Map<string, SupplementalDemandEvidence>();

  for (const row of rows) {
    if (!isNonNegativeNumber(row.clicks) || !isNonNegativeNumber(row.impressions)) {
      throw new Error(`Supplemental GSC demand is invalid for ${row.url}`);
    }
    const key = toolKeyFromUrl(row.url);
    if (!key) continue;
    const current = indexed.get(key) ?? { clicks: 0, impressions: 0 };
    indexed.set(key, {
      clicks: current.clicks + row.clicks,
      impressions: current.impressions + row.impressions,
    });
  }

  return indexed;
}

function hasCheckpointDemand(demand: ReadinessDemandEvidence): boolean {
  return [
    demand.currentClicks,
    demand.currentImpressions,
    demand.historicalClicks,
    demand.historicalImpressions,
  ].some((value) => typeof value === 'number' && value > 0);
}

function hasStrongContent(content: ReadinessContentEvidence): boolean {
  return (
    content.hasIndependentSplitCopy &&
    content.detailedDescriptionLength >=
      STRONG_CONTENT_MINIMUMS.detailedDescriptionLength &&
    content.usageStepCount >= STRONG_CONTENT_MINIMUMS.usageStepCount &&
    content.usageExampleCount >= STRONG_CONTENT_MINIMUMS.usageExampleCount &&
    content.faqCount >= STRONG_CONTENT_MINIMUMS.faqCount &&
    content.duplicateContentKey === null &&
    !content.fallbackUsed
  );
}

function hasRecoveryEvidence(
  row: SuppressionReadinessRow,
  supplementalDemand: SupplementalDemandEvidence | undefined,
): boolean {
  return (
    supplementalDemand !== undefined &&
    (supplementalDemand.clicks >= RECOVERY_DEMAND_MINIMUMS.clicks ||
      supplementalDemand.impressions >= RECOVERY_DEMAND_MINIMUMS.impressions) &&
    hasStrongContent(row.evidence.content)
  );
}

function assertObservedDemandWindow(
  row: SuppressionReadinessRow,
  window: 'current' | 'historical',
): void {
  const observed =
    window === 'current'
      ? row.demandCoverage.currentPageRow
      : row.demandCoverage.historicalPageRow;
  const clicks =
    window === 'current'
      ? row.evidence.demand.currentClicks
      : row.evidence.demand.historicalClicks;
  const impressions =
    window === 'current'
      ? row.evidence.demand.currentImpressions
      : row.evidence.demand.historicalImpressions;

  if (observed && (!isNonNegativeNumber(clicks) || !isNonNegativeNumber(impressions))) {
    throw new Error(`Observed ${window} GSC row lacks metrics for ${row.url}`);
  }
  if (!observed && (clicks !== null || impressions !== null)) {
    throw new Error(`Missing ${window} GSC row carries numeric placeholders for ${row.url}`);
  }
}

function isConfirmedNoindexCandidate(row: SuppressionReadinessRow): boolean {
  return (
    row.decision.recommendation === 'noindex-candidate' &&
    row.decision.missingEvidence.length === 0 &&
    row.demandCoverage.currentPageRow &&
    row.demandCoverage.historicalPageRow &&
    !hasCheckpointDemand(row.evidence.demand)
  );
}

export function deriveIndexSuppression(
  input: SuppressionPolicyInput,
): SuppressionPolicyResult {
  const suppression: SuppressionEntry[] = [];
  const retention: SuppressionEntry[] = [];
  const recovered: SuppressionEntry[] = [];
  const newlySuppressed: SuppressionEntry[] = [];
  const heldSuppressed: SuppressionEntry[] = [];
  const heldRetained: SuppressionEntry[] = [];
  const seenKeys = new Set<string>();

  for (const row of input.rows) {
    const key = toolKeyFromUrl(row.url);
    if (!key) {
      throw new Error(`Readiness row is not a canonical tool URL: ${row.url}`);
    }
    if (seenKeys.has(key)) {
      throw new Error(`Duplicate readiness row for ${key}`);
    }
    seenKeys.add(key);
    assertObservedDemandWindow(row, 'current');
    assertObservedDemandWindow(row, 'historical');

    const [locale, slug] = key.split('/');
    const entry = { locale, slug };
    const wasSuppressed = input.existingSuppressedKeys.has(key);
    const explicitRetention =
      hasCheckpointDemand(row.evidence.demand) ||
      input.renderedKeys.has(key) ||
      input.protectedKeys.has(key) ||
      hasRecoveryEvidence(row, input.supplementalDemandByKey.get(key));

    if (explicitRetention) {
      retention.push(entry);
      if (wasSuppressed) recovered.push(entry);
      continue;
    }

    if (isConfirmedNoindexCandidate(row)) {
      suppression.push(entry);
      if (!wasSuppressed) newlySuppressed.push(entry);
      continue;
    }

    if (wasSuppressed) {
      suppression.push(entry);
      heldSuppressed.push(entry);
    } else {
      retention.push(entry);
      heldRetained.push(entry);
    }
  }

  return {
    suppression: sortEntries(suppression),
    retention: sortEntries(retention),
    recovered: sortEntries(recovered),
    newlySuppressed: sortEntries(newlySuppressed),
    heldSuppressed: sortEntries(heldSuppressed),
    heldRetained: sortEntries(heldRetained),
  };
}