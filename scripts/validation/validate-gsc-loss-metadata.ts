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

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const fileSizeTerms: Record<string, string[]> = {
  en: ['size', 'calculator'],
  zh: ['大小', '计算器'],
  ja: ['サイズ', '計算'],
  ko: ['크기', '계산'],
  es: ['tamaño', 'calculadora'],
  pt: ['tamanho', 'calculadora'],
  fr: ['taille', 'calculateur', 'Ko', 'Mo', 'Go'],
  de: ['größe', 'rechner'],
  ru: ['размер', 'калькулятор'],
  ar: ['حجم', 'حاسبة'],
};

const hexEditorTerms: Record<string, string[]> = {
  en: ['hex', 'editor'],
  zh: ['十六进制', '编辑器'],
  ja: ['16進', 'エディタ'],
  ko: ['16진수', '에디터'],
  es: ['hexadecimal', 'editor'],
  pt: ['hexadecimal', 'editor'],
  fr: ['hexadécimal', 'éditeur'],
  de: ['hex', 'editor'],
  ru: ['hex', 'редактор', 'текст'],
  ar: ['سداسي', 'محرر'],
};

const wordCounterTerms: Record<string, string[]> = {
  en: ['word', 'counter'],
  zh: ['字数', '统计'],
  ja: ['文字', 'カウント'],
  ko: ['글자', '수'],
  es: ['palabras', 'contador', 'caracteres'],
  pt: ['palavras', 'contador'],
  fr: ['mots', 'compteur'],
  de: ['wörter', 'zähler'],
  ru: ['слов', 'счетчик'],
  ar: ['كلمات', 'عداد'],
};

const creditCardValidatorTerms: Record<string, string[]> = {
  en: ['credit card', 'Luhn', 'check'],
  zh: ['信用卡', 'Luhn', '校验'],
  ja: ['クレジットカード', 'Luhn'],
  ko: ['신용카드', 'Luhn'],
  es: ['tarjeta', 'Luhn'],
  pt: ['cartão', 'Luhn'],
  fr: ['carte', 'Luhn'],
  de: ['Kreditkarte', 'Luhn'],
  ru: ['карты', 'Лухна'],
  ar: ['بطاقات', 'لوهن'],
};

const creditCardValidatorForbiddenTerms: Record<string, string[]> = {
  en: ['real-time authorization', 'balance check', 'CVV verification', 'bank verification'],
  zh: ['实时授权', '余额查询', 'CVV 验证', '银行验证'],
  ja: ['リアルタイム承認', '残高確認', 'CVV確認', '銀行確認'],
  ko: ['실시간 승인', '잔액 확인', 'CVV 확인', '은행 확인'],
  es: ['autorización en tiempo real', 'verificación CVV', 'saldo disponible', 'verificación bancaria'],
  pt: ['autorização em tempo real', 'verificação CVV', 'saldo disponível', 'verificação bancária'],
  fr: ['autorisation en temps réel', 'vérification CVV', 'solde disponible', 'vérification bancaire'],
  de: ['Echtzeitautorisierung', 'CVV-Prüfung', 'verfügbares Guthaben', 'Bankprüfung'],
  ru: ['авторизация в реальном времени', 'проверка CVV', 'доступный баланс'],
  ar: ['تفويض فوري', 'تحقق CVV', 'الرصيد المتاح', 'تحقق بنكي'],
};

const imageSplitterTerms: Record<string, string[]> = {
  en: ['image', 'splitter', 'PNG'],
  zh: ['图片', '分割', 'PNG'],
  ja: ['画像', '分割', 'PNG'],
  ko: ['이미지', '분할', 'PNG'],
  es: ['imagen', 'PNG'],
  pt: ['imagem', 'PNG'],
  fr: ['image', 'PNG'],
  de: ['Bild', 'PNG'],
  ru: ['фото', 'PNG'],
  ar: ['الصور', 'PNG'],
};

const imageSplitterForbiddenTerms: Record<string, string[]> = {
  en: ['overlap', 'EXIF', 'output format', 'sprite'],
  zh: ['重叠', 'EXIF', '输出格式', '精灵图'],
  ja: ['重なり', 'EXIF', '出力形式', 'スプライト'],
  ko: ['겹침', 'EXIF', '출력 형식', '스프라이트'],
  es: ['solapamiento', 'EXIF', 'formato de salida', 'sprite'],
  pt: ['sobreposicao', 'EXIF', 'formato de saida', 'sprite'],
  fr: ['chevauchement', 'EXIF', 'format de sortie', 'sprite'],
  de: ['Überlappung', 'EXIF', 'Formatwahl', 'Sprite'],
  ru: ['нахлест', 'EXIF', 'формат вывода', 'спрайт'],
  ar: ['تداخلا', 'EXIF', 'صيغا أخرى', 'سبرایت'],
};

const CHECKS: LossMetadataCheck[] = [
  // 1. file-size-calculator (10 locales)
  ...locales.map(locale => ({
    locale,
    slug: 'file-size-calculator',
    requiredTerms: fileSizeTerms[locale] || [],
  })),

  // 2. hex-editor (10 locales)
  ...locales.map(locale => ({
    locale,
    slug: 'hex-editor',
    requiredTerms: hexEditorTerms[locale] || [],
    ...(locale === 'ru' ? {
      forbiddenFragments: [
        'Бесплатный онлайн-инструмент',
        'прямо в браузере прямо в вашем браузере',
        'без скачивания и регистрации',
      ]
    } : {}),
  })),

  // 3. word-counter (10 locales)
  ...locales.map(locale => ({
    locale,
    slug: 'word-counter',
    requiredTerms: wordCounterTerms[locale] || [],
  })),

  // 4. credit-card-validator (10 locales)
  ...locales.map(locale => ({
    locale,
    slug: 'credit-card-validator',
    requiredTerms: creditCardValidatorTerms[locale] || [],
    forbiddenFragments: creditCardValidatorForbiddenTerms[locale] || [],
  })),

  // 5. image-splitter (10 locales)
  ...locales.map(locale => ({
    locale,
    slug: 'image-splitter',
    requiredTerms: imageSplitterTerms[locale] || [],
    forbiddenFragments: imageSplitterForbiddenTerms[locale] || [],
  })),

  // 6. other individual checks
  {
    locale: 'en',
    slug: 'morse-code-player',
    requiredTerms: ['Morse', 'audio'],
    forbiddenFragments: ['....'],
  },
  {
    locale: 'en',
    slug: 'gantt-chart-generator',
    requiredTerms: ['Gantt', 'chart', 'project timeline', 'PNG', 'SVG'],
    forbiddenFragments: ['manage Gantt charts', 'progress tracking'],
  },
  {
    locale: 'en',
    slug: 'ical-parser',
    requiredTerms: ['iCal', 'ICS'],
  },
  {
    locale: 'en',
    slug: 'iban-validator',
    requiredTerms: ['IBAN', 'checker', 'MOD-97', 'checksum'],
    forbiddenFragments: ['Supports all European countries', 'show bank code', 'bank information'],
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
  {
    locale: 'de',
    slug: 'text-to-handwriting',
    requiredTerms: ['Handschrift', 'Text'],
  },
  {
    locale: 'ko',
    slug: 'html-preview',
    requiredTerms: ['HTML', '미리보기'],
  },
  {
    locale: 'ko',
    slug: 'unicode-converter',
    requiredTerms: ['유니코드', '변환'],
    forbiddenFragments: [
      '무료 온라인 유니코드 변환기을 통해',
      '을(를) 진행할 수 있습니다',
      '100% 로컬에서 실행되어 개인정보를 완벽히 보호',
    ],
  },
  {
    locale: 'ru',
    slug: 'html-preview',
    requiredTerms: ['HTML', 'просмотр', 'предпросмотр'],
    forbiddenFragments: [
      'с поддержкой CSS и JavaScript',
      'Бесплатный онлайн-инструмент',
      'прямо в браузере прямо в вашем браузере',
      'Live HTML Viewer',
    ],
  },
  {
    locale: 'es',
    slug: 'html-preview',
    requiredTerms: ['HTML', 'visualizador', 'vista previa'],
    forbiddenFragments: [
      'soporte para CSS y JavaScript',
      'compatibilidad con CSS y JavaScript',
      'Renderizado en tiempo real',
      'Renderizado en vivo',
      'Visualizador y editor en tiempo real',
    ],
  },
  {
    locale: 'en',
    slug: 'html-preview',
    requiredTerms: ['HTML', 'Viewer', 'Preview', 'sandboxed iframe'],
    forbiddenFragments: [
      'Live HTML Viewer',
      'live sandboxed iframe',
      'JavaScript support',
      'JavaScript execution',
      'complete web pages including interactive elements',
    ],
  },
  {
    locale: 'ru',
    slug: 'barcode-generator',
    requiredTerms: ['штрихкод', 'генератор'],
  },
  {
    locale: 'en',
    slug: 'json-flattener',
    requiredTerms: ['JSON', 'Flatten', 'delimiter', 'copy'],
    forbiddenFragments: [
      'syntax-highlighted',
      'advanced settings',
      'schema validation',
      'download',
    ],
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
