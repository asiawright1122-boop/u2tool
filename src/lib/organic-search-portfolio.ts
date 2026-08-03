import type { Locale } from './i18n';

export type OrganicPortfolioTier = 'P0' | 'P1' | 'P2' | 'P3';
export type OrganicPortfolioStatus =
  | 'active-recovery'
  | 'capability-first'
  | 'candidate'
  | 'governance-hold';

export interface OrganicSearchProfile {
  locale: Locale;
  slug: string;
  tier: OrganicPortfolioTier;
  status: OrganicPortfolioStatus;
  primaryIntent: string;
  demandEvidence: string;
  evidenceBlock: string;
  scores: {
    demand: number;
    functionalCompleteness: number;
    uniqueEvidence: number;
    achievableCompetition: number;
    trustAndRisk: number;
    localization: number;
  };
}

export const organicSearchProfiles: readonly OrganicSearchProfile[] = [
  {
    locale: 'ru',
    slug: 'ip-lookup',
    tier: 'P0',
    status: 'active-recovery',
    primaryIntent: 'Проверка IP-адреса, геолокации, провайдера и публичного IP',
    demandEvidence:
      'Fresh GSC query growth includes проверка айпи, проверка айпи адресов, проверка ip адресов, and вычислить по айпи.',
    evidenceBlock:
      'Live lookup result with IP, approximate country/region/city, ISP, timezone, coordinates, and explicit accuracy limits.',
    scores: {
      demand: 30,
      functionalCompleteness: 24,
      uniqueEvidence: 18,
      achievableCompetition: 8,
      trustAndRisk: 9,
      localization: 5,
    },
  },
  {
    locale: 'en',
    slug: 'iban-validator',
    tier: 'P0',
    status: 'active-recovery',
    primaryIntent: 'Validate IBAN format, country length, and MOD-97 checksum',
    demandEvidence:
      'The recovery audit records a previous 2,395 impressions and 3 clicks before the exposure collapse.',
    evidenceBlock:
      'Country specification, expected length, check digits, BBAN, formatted value, and a specific validation failure.',
    scores: {
      demand: 29,
      functionalCompleteness: 25,
      uniqueEvidence: 18,
      achievableCompetition: 7,
      trustAndRisk: 9,
      localization: 5,
    },
  },
  {
    locale: 'en',
    slug: 'ical-parser',
    tier: 'P0',
    status: 'active-recovery',
    primaryIntent: 'Open, inspect, and export iCal or ICS calendar data',
    demandEvidence:
      'A former winner with 30 merged 16-month clicks; documented queries include ical viewer and view ical online.',
    evidenceBlock:
      'Parsed VEVENT table and JSON export with dates, location, attendees, recurrence, status, and timezone boundary.',
    scores: {
      demand: 28,
      functionalCompleteness: 23,
      uniqueEvidence: 18,
      achievableCompetition: 8,
      trustAndRisk: 9,
      localization: 5,
    },
  },
  {
    locale: 'ru',
    slug: 'grammar-checker',
    tier: 'P0',
    status: 'active-recovery',
    primaryIntent: 'Проверка английского текста на частые ошибки через русский интерфейс',
    demandEvidence:
      'GSC surfaced Russian grammar-checker queries, but the page must narrow them to English input to match the released engine.',
    evidenceBlock:
      'Highlighted local-rule matches, individual/all fixes, corrected English text, and a unique English-input notice.',
    scores: {
      demand: 18,
      functionalCompleteness: 25,
      uniqueEvidence: 17,
      achievableCompetition: 6,
      trustAndRisk: 7,
      localization: 5,
    },
  },
  {
    locale: 'en',
    slug: 'gantt-chart-generator',
    tier: 'P1',
    status: 'capability-first',
    primaryIntent: 'Create and export a simple Gantt chart without signup',
    demandEvidence:
      'Largest documented page-level impression loss at 6,256 impressions.',
    evidenceBlock:
      'Current task/date/progress chart and PNG/SVG export; dependency, critical-path, and CSV claims remain blocked.',
    scores: {
      demand: 30,
      functionalCompleteness: 12,
      uniqueEvidence: 8,
      achievableCompetition: 4,
      trustAndRisk: 10,
      localization: 5,
    },
  },
  {
    locale: 'es',
    slug: 'word-counter',
    tier: 'P1',
    status: 'candidate',
    primaryIntent: 'Contar palabras y caracteres en español',
    demandEvidence:
      'The recovery audit records a 1,412-impression loss for the Spanish page.',
    evidenceBlock:
      'Live word, character, sentence, paragraph, and reading-time result using the actual input.',
    scores: {
      demand: 18,
      functionalCompleteness: 20,
      uniqueEvidence: 8,
      achievableCompetition: 7,
      trustAndRisk: 8,
      localization: 5,
    },
  },
  {
    locale: 'en',
    slug: 'hex-editor',
    tier: 'P1',
    status: 'governance-hold',
    primaryIntent: 'Inspect and convert hexadecimal text',
    demandEvidence:
      'Former English winner with documented click loss, but the current experiment explicitly holds Hex publication.',
    evidenceBlock:
      'Existing text/hex conversion behavior only; do not imply binary-file editing.',
    scores: {
      demand: 26,
      functionalCompleteness: 12,
      uniqueEvidence: 7,
      achievableCompetition: 4,
      trustAndRisk: 6,
      localization: 5,
    },
  },
] as const;

export function organicPortfolioScore(profile: OrganicSearchProfile): number {
  return Object.values(profile.scores).reduce((sum, score) => sum + score, 0);
}

export function tierForOrganicPortfolioScore(score: number): OrganicPortfolioTier {
  if (score >= 70) return 'P0';
  if (score >= 50) return 'P1';
  if (score >= 30) return 'P2';
  return 'P3';
}

export function getOrganicSearchProfile(
  locale: Locale,
  slug: string
): OrganicSearchProfile | undefined {
  return organicSearchProfiles.find(
    (profile) => profile.locale === locale && profile.slug === slug
  );
}

export const organicRecoveryPrioritySlugs: readonly string[] = [
  'ip-lookup',
  'iban-validator',
  'ical-parser',
  'grammar-checker',
] as const;
