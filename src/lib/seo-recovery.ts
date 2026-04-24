import { isValidLocale, type Locale } from './i18n';

export type PageBucket =
  | 'homepage'
  | 'tools-index'
  | 'category-page'
  | 'tool-detail'
  | 'compare-page'
  | 'ai-page'
  | 'other';

export type QueryBucket = 'brand' | 'tool-intent' | 'problem-intent' | 'other';

export interface SearchMetricRow {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchMetricSummary {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchMetricDelta extends SearchMetricSummary {
  clicksDelta: number;
  impressionsDelta: number;
  ctrDelta: number;
  positionDelta: number;
}

export interface RecoveryDiagnosis {
  primaryConstraint: 'impressions' | 'ctr' | 'click-path' | 'mixed';
  mostAffectedPageBucket: string;
  mostAffectedLocale: string;
  mostAffectedQueryBucket: string;
  summary: string;
  recommendedActions: string[];
}

function toPathname(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    return '/';
  }

  try {
    return new URL(trimmed).pathname || '/';
  } catch {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }
}

function getSegments(input: string): string[] {
  return toPathname(input)
    .replace(/^\/+|\/+$/g, '')
    .split('/')
    .filter(Boolean);
}

export function inferLocaleFromPage(input: string): Locale | 'unknown' {
  const firstSegment = getSegments(input)[0];
  return firstSegment && isValidLocale(firstSegment) ? firstSegment : 'unknown';
}

export function classifyPageBucket(input: string): PageBucket {
  const segments = getSegments(input);
  const localizedSegments =
    segments[0] && isValidLocale(segments[0]) ? segments.slice(1) : segments;

  if (localizedSegments.length === 0) {
    return 'homepage';
  }

  if (localizedSegments.length === 1 && localizedSegments[0] === 'tools') {
    return 'tools-index';
  }

  if (localizedSegments[0] === 'categories') {
    return 'category-page';
  }

  if (localizedSegments[0] === 'tools' && localizedSegments.length >= 2) {
    return 'tool-detail';
  }

  if (localizedSegments[0] === 'compare') {
    return 'compare-page';
  }

  if (localizedSegments[0] === 'ai') {
    return 'ai-page';
  }

  return 'other';
}

const BRAND_PATTERNS = [/\bu2tool\b/i, /\bu2 tool\b/i, /\bu2tools\b/i];
const PROBLEM_PATTERNS = [
  /\bhow\b/i,
  /\bwhat\b/i,
  /\bwhy\b/i,
  /\bwhen\b/i,
  /\bwhich\b/i,
  /\bbest\b/i,
  /\bcompare\b/i,
  /\bvs\b/i,
  /\bversus\b/i,
  /\bfix\b/i,
  /\bconvert\b/i,
];
const TOOL_INTENT_PATTERNS = [
  /\btool\b/i,
  /\bgenerator\b/i,
  /\bconverter\b/i,
  /\bformatter\b/i,
  /\bcalculator\b/i,
  /\bvalidator\b/i,
  /\bchecker\b/i,
  /\bpreview\b/i,
  /\bencoder\b/i,
  /\bdecoder\b/i,
  /\bparser\b/i,
  /\bviewer\b/i,
  /\beditor\b/i,
  /\bbuilder\b/i,
  /\bmaker\b/i,
];

export function classifyQueryBucket(query: string): QueryBucket {
  const normalized = query.trim();
  if (!normalized) {
    return 'other';
  }

  if (BRAND_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 'brand';
  }

  if (PROBLEM_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 'problem-intent';
  }

  if (TOOL_INTENT_PATTERNS.some((pattern) => pattern.test(normalized))) {
    return 'tool-intent';
  }

  return 'other';
}

function safeDivide(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

function weightedAveragePosition(rows: SearchMetricRow[]): number {
  const weightedSum = rows.reduce((sum, row) => sum + row.position * row.impressions, 0);
  const totalImpressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  return safeDivide(weightedSum, totalImpressions);
}

export function summarizeRows(rows: SearchMetricRow[]): SearchMetricSummary {
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);

  return {
    clicks,
    impressions,
    ctr: safeDivide(clicks, impressions),
    position: weightedAveragePosition(rows),
  };
}

export function buildDelta(
  current: SearchMetricSummary | undefined,
  previous: SearchMetricSummary | undefined
): SearchMetricDelta {
  const safeCurrent = current || { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const safePrevious = previous || { clicks: 0, impressions: 0, ctr: 0, position: 0 };

  return {
    ...safeCurrent,
    clicksDelta: safeCurrent.clicks - safePrevious.clicks,
    impressionsDelta: safeCurrent.impressions - safePrevious.impressions,
    ctrDelta: safeCurrent.ctr - safePrevious.ctr,
    positionDelta: safeCurrent.position - safePrevious.position,
  };
}

export function groupRows<T extends string>(
  rows: SearchMetricRow[],
  classifier: (row: SearchMetricRow) => T
): Record<T, SearchMetricSummary> {
  const grouped = new Map<T, SearchMetricRow[]>();

  for (const row of rows) {
    const key = classifier(row);
    const existing = grouped.get(key) || [];
    existing.push(row);
    grouped.set(key, existing);
  }

  return Object.fromEntries(
    Array.from(grouped.entries()).map(([key, value]) => [key, summarizeRows(value)])
  ) as Record<T, SearchMetricSummary>;
}

function pickLargestDrop(
  current: Record<string, SearchMetricSummary>,
  previous: Record<string, SearchMetricSummary>,
  metric: keyof SearchMetricDelta
): string {
  const keys = Array.from(new Set([...Object.keys(current), ...Object.keys(previous)]));
  if (keys.length === 0) {
    return 'n/a';
  }

  return keys
    .map((key) => ({
      key,
      delta: buildDelta(current[key], previous[key])[metric],
    }))
    .sort((left, right) => Number(left.delta) - Number(right.delta))[0]?.key || 'n/a';
}

export function diagnoseRecovery(
  pageOverall: SearchMetricDelta,
  pageBucketsCurrent: Record<string, SearchMetricSummary>,
  pageBucketsPrevious: Record<string, SearchMetricSummary>,
  localeCurrent: Record<string, SearchMetricSummary>,
  localePrevious: Record<string, SearchMetricSummary>,
  queryBucketsCurrent: Record<string, SearchMetricSummary>,
  queryBucketsPrevious: Record<string, SearchMetricSummary>
): RecoveryDiagnosis {
  const impressionsDown = pageOverall.impressionsDelta < 0;
  const ctrDown = pageOverall.ctrDelta < 0;
  const clicksDown = pageOverall.clicksDelta < 0;

  let primaryConstraint: RecoveryDiagnosis['primaryConstraint'] = 'mixed';
  if (impressionsDown && !ctrDown) {
    primaryConstraint = 'impressions';
  } else if (!impressionsDown && ctrDown) {
    primaryConstraint = 'ctr';
  } else if (clicksDown && !impressionsDown && !ctrDown) {
    primaryConstraint = 'click-path';
  }

  const mostAffectedPageBucket = pickLargestDrop(
    pageBucketsCurrent,
    pageBucketsPrevious,
    'clicksDelta'
  );
  const mostAffectedLocale = pickLargestDrop(localeCurrent, localePrevious, 'clicksDelta');
  const mostAffectedQueryBucket = pickLargestDrop(
    queryBucketsCurrent,
    queryBucketsPrevious,
    'clicksDelta'
  );

  const summaryMap: Record<RecoveryDiagnosis['primaryConstraint'], string> = {
    impressions:
      'Recovery is currently more constrained by exposure loss than by CTR loss. Prioritize crawl, indexing, ranking re-evaluation, and landing-page cohorts with falling impressions.',
    ctr:
      'Recovery is currently more constrained by click-through rate than by raw exposure. Prioritize SERP copy, title/meta competitiveness, and rich result presentation.',
    'click-path':
      'Recovery is currently more constrained by on-site click-path efficiency than by raw exposure or CTR. Prioritize browse-page value proposition and internal navigation.',
    mixed:
      'Recovery currently looks mixed across exposure, CTR, and click capture. Treat the worst page buckets and locales separately instead of assuming one global cause.',
  };

  const recommendedActionMap: Record<RecoveryDiagnosis['primaryConstraint'], string[]> = {
    impressions: [
      'Review the most affected landing bucket in GSC URL inspection and confirm recent crawl / indexing activity.',
      'Compare the losing page bucket against sitemap coverage, internal linking depth, and freshness signals.',
      'Prioritize re-submission and monitoring for the weakest locale and landing cohorts rather than whole-site averages.',
    ],
    ctr: [
      'Rewrite titles and meta descriptions for the most affected landing bucket with stronger task intent and clearer outcomes.',
      'Check whether SERP features or competitor snippets changed for the weakest query cohort before changing too much on-page content.',
      'Validate structured data visibility and make sure key browse pages still communicate a concrete click reason.',
    ],
    'click-path': [
      'Audit browse-page CTAs, search-result clickability, and internal navigation on the most affected landing bucket.',
      'Check whether the weakest locale has broken or weaker internal paths from homepage, tools index, or category pages.',
      'Measure whether impressions and CTR are stable while downstream tool-detail clicks lag, then treat this as a UX capture issue.',
    ],
    mixed: [
      'Split recovery work by landing bucket and locale before making site-wide assumptions.',
      'Stabilize the largest exposure loser first, then separately test CTR improvements on the worst query cohort.',
      'Use the weekly report to track whether changes move impressions, CTR, or clicks independently instead of expecting one fix to move all three.',
    ],
  };

  return {
    primaryConstraint,
    mostAffectedPageBucket,
    mostAffectedLocale,
    mostAffectedQueryBucket,
    summary: summaryMap[primaryConstraint],
    recommendedActions: recommendedActionMap[primaryConstraint],
  };
}
