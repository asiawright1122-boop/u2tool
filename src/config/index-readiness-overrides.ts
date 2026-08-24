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
  {
    locale: 'ar',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'de',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'en',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'es',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'fr',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'ja',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'ko',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'pt',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'ru',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'zh',
    slug: 'jwt-debugger',
    protectedControl: true,
    reason:
      'Product flagship tool mislabeled as catalog tier in the 2026-07-13 checkpoint (priority annotation gap). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-01',
  },
  {
    locale: 'en',
    slug: 'python-formatter',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 866-char description, 5 FAQ). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'api-response-formatter',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 682-char description). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'json-to-zod',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 710-char description). Frequent search sibling of already-visible json-to-typescript. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'json-to-python',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 746-char description). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'json-schema-generator',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 687-char description). Complement of already-visible json-schema-validator. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'json-path-finder',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 975-char description). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'string-escape',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 1349-char description). Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'html-entity',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 1279-char description). Complement of already-visible html-encoder. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'json-minifier',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 672-char description). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'js-beautifier',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 662-char description). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'yaml-formatter',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 504-char description). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'csv-to-json',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 425-char description). Reverse of already-visible json-to-csv. Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'json-to-csharp',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 642-char description). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'json-to-java',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 546-char description). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'regex-escape',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 1035-char description). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'json-flattener',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 594-char description, 5 FAQ). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'text-to-hex',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 1004-char description). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
  {
    locale: 'en',
    slug: 'hex-base64-converter',
    protectedControl: true,
    reason:
      'Developer-data cluster tool demoted to catalog tier by the 2026-07-13 checkpoint despite content-rich health signals (independent locale copy, 1149-char description). Batch 2 of the priority-annotation-gap recovery. Null GSC demand is missing evidence, not zero demand; keep indexable pending next checkpoint review.',
    expiresOn: '2026-10-15',
  },
];
