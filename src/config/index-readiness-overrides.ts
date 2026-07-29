export interface IndexReadinessOverride {
  locale: string;
  slug: string;
  protectedControl?: boolean;
  strongerSiblingSlug?: string;
  samePrimaryIntent?: boolean;
  reason: string;
  expiresOn?: string;
}

export const INDEX_READINESS_OVERRIDES: IndexReadinessOverride[] = [
  {
    locale: 'es',
    slug: 'timeline-chart-generator',
    protectedControl: true,
    reason:
      'Spanish chart recovery comparison cohort increased from 20 to 146 impressions; preserve through the active GSC gate.',
    expiresOn: '2026-08-24',
  },
  {
    locale: 'es',
    slug: 'graph-chart-generator',
    protectedControl: true,
    reason:
      'Spanish chart recovery comparison cohort increased from 11 to 81 impressions; preserve through the active GSC gate.',
    expiresOn: '2026-08-24',
  },
  {
    locale: 'es',
    slug: 'sankey-chart-generator',
    protectedControl: true,
    reason:
      'Spanish chart recovery comparison cohort increased from 0 to 14 impressions; preserve through the active GSC gate.',
    expiresOn: '2026-08-24',
  },
  {
    locale: 'es',
    slug: 'gantt-chart-generator',
    protectedControl: true,
    reason:
      'Spanish chart recovery comparison cohort increased from 14 to 26 impressions; preserve through the active GSC gate.',
    expiresOn: '2026-08-24',
  },
  {
    locale: 'es',
    slug: 'tree-chart-generator',
    protectedControl: true,
    reason:
      'Spanish chart recovery comparison cohort increased from 14 to 25 impressions; preserve through the active GSC gate.',
    expiresOn: '2026-08-24',
  },
];
