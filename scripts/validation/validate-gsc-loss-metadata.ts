import { readFile } from 'node:fs/promises';
import path from 'node:path';

interface LossMetadataCheck {
  locale: string;
  slug: string;
  minDescriptionLength?: number;
  maxDescriptionLength?: number;
  maxTitleLength?: number;
  requiredTerms: string[];
  forbiddenFragments?: string[];
}

interface LossMetadataIssue {
  label: string;
  message: string;
}

const CHECKS: LossMetadataCheck[] = [
  {
    locale: 'ru',
    slug: 'hex-editor',
    requiredTerms: ['hex', 'текст'],
    forbiddenFragments: [
      'Бесплатный онлайн-инструмент',
      'прямо в браузере прямо в вашем браузере',
      'без скачивания и регистрации',
    ],
  },
  {
    locale: 'en',
    slug: 'hex-editor',
    requiredTerms: ['hex', 'text'],
  },
  {
    locale: 'fr',
    slug: 'file-size-calculator',
    requiredTerms: ['Ko', 'Mo', 'Go'],
  },
  {
    locale: 'en',
    slug: 'morse-code-player',
    requiredTerms: ['Morse', 'audio'],
    forbiddenFragments: ['....'],
  },
  {
    locale: 'es',
    slug: 'word-counter',
    requiredTerms: ['palabras', 'caracteres'],
  },
  {
    locale: 'en',
    slug: 'gantt-chart-generator',
    requiredTerms: ['Gantt', 'chart', 'project timeline', 'PNG/SVG'],
  },
  {
    locale: 'en',
    slug: 'ical-parser',
    requiredTerms: ['iCal', 'ICS'],
  },
  {
    locale: 'en',
    slug: 'iban-validator',
    requiredTerms: ['IBAN'],
  },
  {
    locale: 'en',
    slug: 'sitemap-generator',
    requiredTerms: ['XML sitemap', 'lastmod', 'sitemap.xml'],
  },
  {
    locale: 'en',
    slug: 'compound-interest-calculator',
    requiredTerms: ['compound interest', 'regular contributions', 'total interest'],
  },
  {
    locale: 'en',
    slug: 'csv-to-vcard-converter',
    requiredTerms: ['CSV', 'vCard', 'address books', 'CRM'],
  },
  {
    locale: 'en',
    slug: 'vcard-to-csv-converter',
    requiredTerms: ['vCard', 'VCF', 'CSV', 'spreadsheets'],
  },
];

const DEFAULT_MIN_DESCRIPTION_LENGTH = 90;
const DEFAULT_MAX_DESCRIPTION_LENGTH = 180;
const DEFAULT_MAX_TITLE_LENGTH = 70;

type BaseMessages = {
  tools?: Record<string, {
    name?: unknown;
    description?: unknown;
    seo_title?: unknown;
    seo_description?: unknown;
  }>;
};

function labelFor(check: LossMetadataCheck): string {
  return `${check.locale}/tools/${check.slug}`;
}

async function loadBaseMessages(locale: string): Promise<BaseMessages> {
  const filePath = path.join(process.cwd(), 'src', 'messages', locale, 'base.json');
  return JSON.parse(await readFile(filePath, 'utf8')) as BaseMessages;
}

function normalize(value: string): string {
  return value.toLowerCase();
}

function pushIssue(
  issues: LossMetadataIssue[],
  check: LossMetadataCheck,
  message: string
): void {
  issues.push({ label: labelFor(check), message });
}

export async function validateGscLossMetadata(): Promise<LossMetadataIssue[]> {
  const issues: LossMetadataIssue[] = [];
  const baseMessagesByLocale = new Map<string, BaseMessages>();

  for (const check of CHECKS) {
    if (!baseMessagesByLocale.has(check.locale)) {
      baseMessagesByLocale.set(check.locale, await loadBaseMessages(check.locale));
    }

    const baseMessages = baseMessagesByLocale.get(check.locale);
    const entry = baseMessages?.tools?.[check.slug];
    if (!entry) {
      pushIssue(issues, check, 'missing tools metadata entry');
      continue;
    }

    const title = typeof entry.seo_title === 'string' ? entry.seo_title.trim() : '';
    const description = typeof entry.seo_description === 'string' ? entry.seo_description.trim() : '';
    const combined = normalize(`${title} ${description}`);

    if (!title) {
      pushIssue(issues, check, 'missing seo_title');
    }

    if (!description) {
      pushIssue(issues, check, 'missing seo_description');
    }

    const maxTitleLength = check.maxTitleLength ?? DEFAULT_MAX_TITLE_LENGTH;
    if (title.length > maxTitleLength) {
      pushIssue(issues, check, `seo_title length ${title.length} exceeds ${maxTitleLength}: ${title}`);
    }

    const minDescriptionLength = check.minDescriptionLength ?? DEFAULT_MIN_DESCRIPTION_LENGTH;
    const maxDescriptionLength = check.maxDescriptionLength ?? DEFAULT_MAX_DESCRIPTION_LENGTH;
    if (description.length < minDescriptionLength || description.length > maxDescriptionLength) {
      pushIssue(
        issues,
        check,
        `seo_description length ${description.length} outside ${minDescriptionLength}-${maxDescriptionLength}: ${description}`
      );
    }

    for (const requiredTerm of check.requiredTerms) {
      if (!combined.includes(normalize(requiredTerm))) {
        pushIssue(issues, check, `missing required intent term "${requiredTerm}"`);
      }
    }

    for (const forbidden of check.forbiddenFragments || []) {
      if (description.includes(forbidden) || title.includes(forbidden)) {
        pushIssue(issues, check, `contains forbidden snippet fragment "${forbidden}"`);
      }
    }

    if (/(.)\1{3,}/.test(description.replace(/\s+/g, ''))) {
      pushIssue(issues, check, `description contains suspicious repeated characters: ${description}`);
    }
  }

  return issues;
}

async function main(): Promise<void> {
  const issues = await validateGscLossMetadata();
  if (issues.length > 0) {
    console.error('GSC loss metadata validation failed.');
    for (const issue of issues) {
      console.error(`- ${issue.label}: ${issue.message}`);
    }
    process.exit(1);
  }

  console.log(`GSC loss metadata validation passed. checks=${CHECKS.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
