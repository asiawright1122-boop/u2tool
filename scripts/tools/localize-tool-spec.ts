#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import type { ToolCategory } from '../../src/config/tools/types';
import { locales, type Locale } from '../../src/lib/i18n';

type LocaleSeedCopy = {
  name?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  primary_keyword?: string;
};

type LocalizeSpec = {
  slug: string;
  category: ToolCategory;
  icon: string;
  component?: string;
  popular?: boolean;
  search_intent?: string;
  aliases?: string[];
  locales: Partial<Record<Locale, LocaleSeedCopy>>;
};

type CompleteLocaleCopy = {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
};

type CompleteSpec = Omit<LocalizeSpec, 'locales'> & {
  locales: Record<Locale, CompleteLocaleCopy>;
};

type Args = {
  inputPath: string;
  outputPath: string;
  briefPath: string;
  strict: boolean;
};

type SeoPattern = {
  title: (name: string) => string;
  descriptionSuffix: string;
};

const SEO_PATTERNS: Record<Locale, SeoPattern> = {
  en: {
    title: (name) => `Free ${name} Online`,
    descriptionSuffix: 'Use this free online tool in your browser with no signup required.',
  },
  zh: {
    title: (name) => `免费在线${name}`,
    descriptionSuffix: '直接在浏览器中免费使用，无需注册。',
  },
  ja: {
    title: (name) => `無料オンライン ${name}`,
    descriptionSuffix: 'ブラウザで無料で使え、登録は不要です。',
  },
  ko: {
    title: (name) => `무료 온라인 ${name}`,
    descriptionSuffix: '브라우저에서 무료로 사용할 수 있으며 가입이 필요 없습니다.',
  },
  es: {
    title: (name) => `${name} gratis`,
    descriptionSuffix: 'Usa esta herramienta online gratuita en el navegador, sin registro.',
  },
  pt: {
    title: (name) => `${name} grátis`,
    descriptionSuffix: 'Use esta ferramenta online gratuita no navegador, sem cadastro.',
  },
  fr: {
    title: (name) => `${name} gratuit`,
    descriptionSuffix: 'Utilisez cet outil en ligne gratuit dans le navigateur, sans inscription.',
  },
  de: {
    title: (name) => `Kostenloser ${name}`,
    descriptionSuffix: 'Nutze dieses kostenlose Online-Tool direkt im Browser, ohne Anmeldung.',
  },
  ru: {
    title: (name) => `Бесплатный ${name} онлайн`,
    descriptionSuffix: 'Используйте этот бесплатный онлайн-инструмент в браузере без регистрации.',
  },
  ar: {
    title: (name) => `${name} مجانًا`,
    descriptionSuffix: 'استخدم هذه الأداة المجانية عبر الإنترنت في المتصفح بدون تسجيل.',
  },
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    inputPath: '',
    outputPath: '',
    briefPath: '',
    strict: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--input') {
      args.inputPath = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (arg.startsWith('--input=')) {
      args.inputPath = arg.slice('--input='.length);
      continue;
    }
    if (arg === '--output') {
      args.outputPath = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (arg.startsWith('--output=')) {
      args.outputPath = arg.slice('--output='.length);
      continue;
    }
    if (arg === '--brief') {
      args.briefPath = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (arg.startsWith('--brief=')) {
      args.briefPath = arg.slice('--brief='.length);
      continue;
    }
    if (arg === '--strict') {
      args.strict = true;
      continue;
    }
    if (!arg.startsWith('-') && !args.inputPath) {
      args.inputPath = arg;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.inputPath) {
    throw new Error('Usage: npm run tools:localize-spec -- --input path/to/draft.json --output path/to/localized.json');
  }

  args.inputPath = path.resolve(process.cwd(), args.inputPath);
  args.outputPath = args.outputPath
    ? path.resolve(process.cwd(), args.outputPath)
    : args.inputPath.replace(/\.json$/i, '.localized.json');
  args.briefPath = args.briefPath
    ? path.resolve(process.cwd(), args.briefPath)
    : args.outputPath.replace(/\.json$/i, '.ai-brief.md');

  return args;
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function ensureSentenceEnd(value: string, locale: Locale) {
  const trimmed = normalizeWhitespace(value);
  if (!trimmed) {
    return trimmed;
  }

  if (/[.!?。؟]$/.test(trimmed)) {
    return trimmed;
  }

  return locale === 'zh' || locale === 'ja' ? `${trimmed}。` : `${trimmed}.`;
}

function buildSeoTitle(locale: Locale, copy: LocaleSeedCopy) {
  if (copy.seo_title) {
    return normalizeWhitespace(copy.seo_title);
  }

  const name = normalizeWhitespace(copy.name || '');
  const keyword = normalizeWhitespace(copy.primary_keyword || '');
  const titleSubject = keyword || name;
  return SEO_PATTERNS[locale].title(titleSubject);
}

function buildSeoDescription(locale: Locale, copy: LocaleSeedCopy) {
  if (copy.seo_description) {
    return ensureSentenceEnd(copy.seo_description, locale);
  }

  const description = ensureSentenceEnd(copy.description || '', locale);
  return normalizeWhitespace(`${description} ${SEO_PATTERNS[locale].descriptionSuffix}`);
}

function missingLocaleRequirements(spec: LocalizeSpec) {
  const missing: string[] = [];
  for (const locale of locales) {
    const copy = spec.locales?.[locale];
    if (!copy) {
      missing.push(`${locale}: missing locale object`);
      continue;
    }
    if (!copy.name) {
      missing.push(`${locale}: missing name`);
    }
    if (!copy.description) {
      missing.push(`${locale}: missing description`);
    }
  }
  return missing;
}

function normalizeSpec(spec: LocalizeSpec): CompleteSpec {
  const normalizedLocales = {} as Record<Locale, CompleteLocaleCopy>;

  for (const locale of locales) {
    const copy = spec.locales[locale];
    if (!copy?.name || !copy.description) {
      throw new Error(`Cannot normalize incomplete locale: ${locale}`);
    }

    normalizedLocales[locale] = {
      name: normalizeWhitespace(copy.name),
      description: ensureSentenceEnd(copy.description, locale),
      seo_title: buildSeoTitle(locale, copy),
      seo_description: buildSeoDescription(locale, copy),
    };
  }

  return {
    slug: spec.slug,
    category: spec.category,
    icon: spec.icon,
    ...(spec.component ? { component: spec.component } : {}),
    ...(spec.popular !== undefined ? { popular: spec.popular } : {}),
    ...(spec.search_intent ? { search_intent: spec.search_intent } : {}),
    ...(spec.aliases ? { aliases: spec.aliases } : {}),
    locales: normalizedLocales,
  };
}

function words(value: string) {
  return normalizeWhitespace(value)
    .toLocaleLowerCase()
    .split(/[\s,.;:!?()"'`/\\[\]{}<>|，。！？、；：（）【】]+/)
    .filter(Boolean);
}

function sharesTooMuchWithEnglish(value: string, englishValue: string) {
  const normalizedValue = normalizeWhitespace(value).toLocaleLowerCase();
  const normalizedEnglish = normalizeWhitespace(englishValue).toLocaleLowerCase();
  if (normalizedValue === normalizedEnglish) {
    return true;
  }

  const valueWords = new Set(words(value));
  const englishWords = words(englishValue).filter((word) => word.length >= 4);
  if (englishWords.length < 4) {
    return false;
  }

  const shared = englishWords.filter((word) => valueWords.has(word)).length;
  return shared / englishWords.length >= 0.75;
}

function validateSpecQuality(spec: CompleteSpec) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const english = spec.locales.en;

  for (const locale of locales) {
    const copy = spec.locales[locale];
    if (copy.seo_title.length < 12) {
      warnings.push(`${locale}: seo_title is short (${copy.seo_title.length} chars)`);
    }
    if (copy.seo_title.length > 85) {
      warnings.push(`${locale}: seo_title is long (${copy.seo_title.length} chars)`);
    }
    if (copy.seo_description.length < 70) {
      warnings.push(`${locale}: seo_description is short (${copy.seo_description.length} chars)`);
    }
    if (copy.seo_description.length > 190) {
      warnings.push(`${locale}: seo_description is long (${copy.seo_description.length} chars)`);
    }

    if (locale !== 'en') {
      if (sharesTooMuchWithEnglish(copy.name, english.name)) {
        errors.push(`${locale}: name appears to be English fallback`);
      }
      if (sharesTooMuchWithEnglish(copy.description, english.description)) {
        errors.push(`${locale}: description appears to be English fallback`);
      }
      if (sharesTooMuchWithEnglish(copy.seo_title, english.seo_title)) {
        errors.push(`${locale}: seo_title appears to be English fallback`);
      }
      if (sharesTooMuchWithEnglish(copy.seo_description, english.seo_description)) {
        errors.push(`${locale}: seo_description appears to be English fallback`);
      }
    }
  }

  return { errors, warnings };
}

function createAiBrief(spec: LocalizeSpec, missing: string[]) {
  const source = spec.locales.en || spec.locales.zh || {};
  const missingLocales = [...new Set(missing.map((item) => item.split(':')[0]))];

  return `# Multilingual SEO Tool Spec Brief

Generate localized SEO copy for the missing locale entries below.

## Tool

- slug: ${spec.slug}
- category: ${spec.category}
- search intent: ${spec.search_intent || 'not specified'}

## Source Copy

- name: ${source.name || ''}
- description: ${source.description || ''}
- seo_title: ${source.seo_title || ''}
- seo_description: ${source.seo_description || ''}

## Missing Locales

${missing.map((item) => `- ${item}`).join('\n')}

## Required Locales

${missingLocales.join(', ')}

## Output Requirements

Return JSON only. For each missing locale, provide:

- name: localized natural tool name
- description: one concise sentence for the tool card
- optional primary_keyword: localized search phrase if different from name

Do not copy English text into non-English locales. Localize for search intent, not literal translation. Keep descriptions specific to the tool action.

## JSON Shape

\`\`\`json
{
  "locales": {
    "es": {
      "name": "",
      "description": "",
      "primary_keyword": ""
    }
  }
}
\`\`\`
`;
}

export function runLocalizeToolSpec(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const spec = readJson<LocalizeSpec>(args.inputPath);

  if (!spec.slug || !spec.category || !spec.icon) {
    throw new Error('Spec must include slug, category, and icon');
  }

  const missing = missingLocaleRequirements(spec);
  if (missing.length > 0) {
    fs.mkdirSync(path.dirname(args.briefPath), { recursive: true });
    fs.writeFileSync(args.briefPath, createAiBrief(spec, missing));
    throw new Error(`Spec is missing locale copy. AI brief written to ${path.relative(process.cwd(), args.briefPath)}`);
  }

  const normalized = normalizeSpec(spec);
  const quality = validateSpecQuality(normalized);

  if (quality.errors.length > 0) {
    throw new Error(`Localized spec failed quality checks:\n${quality.errors.map((item) => `- ${item}`).join('\n')}`);
  }

  writeJson(args.outputPath, normalized);
  console.log(`Wrote ${path.relative(process.cwd(), args.outputPath)}`);

  if (quality.warnings.length > 0) {
    console.log('Warnings:');
    for (const warning of quality.warnings) {
      console.log(`- ${warning}`);
    }
    if (args.strict) {
      throw new Error('Strict mode failed because warnings were emitted.');
    }
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  try {
    runLocalizeToolSpec();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
