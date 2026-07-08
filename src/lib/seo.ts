import type { ToolCategory } from '@/config/tools';
import { ensurePagePath, getLocalizedPath, type Locale } from './i18n';

export interface SeoMetadata {
  title: string;
  description: string;
}

export interface MetaDescriptionInput {
  description?: string;
  locale?: Locale | string;
  title?: string;
}

export interface CanonicalUrlInput {
  baseUrl: string;
  locale: Locale;
  requestUrl: URL | string;
  canonicalPath?: string;
}

export const META_DESCRIPTION_MIN_LENGTH = 150;
export const META_DESCRIPTION_MAX_LENGTH = 180;

const META_DESCRIPTION_DEFAULT_TITLE = 'U2Tool online tools';

const META_DESCRIPTION_BOOSTERS: Record<string, string[]> = {
  zh: [
    '所有工具可免费使用，无需注册，直接在浏览器中完成。',
    '适合快速处理、调试、转换、生成与日常工作流。',
    '帮助开发者、创作者和团队更高效地完成任务。',
    '支持多语言界面和清晰结果输出，方便从页面直接复制、复用或继续下一步操作。',
    '页面保留核心任务关键词、输入场景和结果用途，便于搜索引擎与用户快速判断是否匹配需求。',
  ],
  ja: [
    '登録不要で無料利用でき、ブラウザ上で安全に処理できます。',
    '日常の作業、確認、変換、生成、共有前の見直しに使えます。',
    '開発者、クリエイター、チームの作業効率を高めます。',
    '多言語インターフェースと分かりやすい結果表示で、コピー、共有、次の作業へ進みやすくします。',
    '検索結果で用途、入力内容、出力の流れが伝わるように、主要な作業意図を明確にまとめます。',
  ],
  ko: [
    '가입 없이 무료로 사용할 수 있으며 브라우저에서 바로 처리됩니다.',
    '빠른 확인, 변환, 생성 및 일상 업무 흐름에 적합합니다.',
    '개발자, 크리에이터, 팀이 더 효율적으로 작업하도록 돕습니다.',
    '다국어 화면과 명확한 결과 출력으로 복사, 공유, 다음 작업 진행이 쉽습니다.',
    '검색 결과에서 핵심 작업, 입력 방식, 결과 활용 목적을 더 명확하게 판단할 수 있게 합니다.',
  ],
  ar: [
    'استخدمها مجانًا دون تسجيل، مع تنفيذ سريع داخل المتصفح.',
    'مناسبة للفحص والتحويل والإنشاء ومهام العمل اليومية.',
    'تساعد المطورين والمبدعين والفرق على إنجاز العمل بكفاءة أعلى.',
    'توضح الوصف مهمة الصفحة ومدخلاتها ومخرجاتها حتى يفهم المستخدم ومحرك البحث قيمة الأداة بسرعة.',
  ],
  de: [
    'Kostenlos ohne Registrierung direkt im Browser nutzbar.',
    'Ideal für schnelle Prüfungen, Konvertierungen, Generierung und tägliche Arbeitsabläufe.',
    'Hilft Entwicklern, Kreativen und Teams, Aufgaben effizienter zu erledigen.',
  ],
  es: [
    'Úsala gratis sin registro, directamente en el navegador.',
    'Sirve para revisar, convertir, generar y optimizar tareas diarias con rapidez.',
    'Ayuda a desarrolladores, creadores y equipos a trabajar con más eficiencia.',
  ],
  fr: [
    'Utilisez-la gratuitement sans inscription, directement dans le navigateur.',
    'Pratique pour vérifier, convertir, générer et accélérer les tâches quotidiennes.',
    'Aide les développeurs, créateurs et équipes à travailler plus efficacement.',
  ],
  pt: [
    'Use grátis sem cadastro, diretamente no navegador.',
    'Ideal para verificar, converter, gerar e acelerar tarefas do dia a dia.',
    'Ajuda desenvolvedores, criadores e equipes a trabalhar com mais eficiência.',
  ],
  ru: [
    'Используйте бесплатно без регистрации прямо в браузере.',
    'Подходит для быстрых проверок, преобразований, генерации и повседневных задач.',
    'Помогает разработчикам, авторам и командам работать эффективнее.',
  ],
  default: [
    'Use it free with no signup, directly in your browser.',
    'Built for fast checks, conversions, generation, and everyday productivity workflows.',
    'Helps developers, creators, and teams finish practical tasks more efficiently.',
  ],
};

export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs: string[];
}

export interface WebsiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description: string;
  inLanguage: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': 'required name=search_term_string';
  };
}

export const hreflangMap: Record<Locale, string> = {
  en: 'en',
  zh: 'zh-CN',
  ja: 'ja',
  ko: 'ko',
  es: 'es',
  pt: 'pt',
  fr: 'fr',
  de: 'de',
  ru: 'ru',
  ar: 'ar',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeCountClaim(value: string, toolCount: number): string {
  if (toolCount <= 0) {
    return value;
  }

  return value.replace(/\b\d[\d,]*\+/g, `${toolCount}+`);
}

function normalizeMetaDescriptionWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function appendSentence(base: string, sentence: string): string {
  const normalizedBase = normalizeMetaDescriptionWhitespace(base);
  const normalizedSentence = normalizeMetaDescriptionWhitespace(sentence);

  if (!normalizedBase) {
    return normalizedSentence;
  }

  return `${normalizedBase}${/[.!?。！？]$/.test(normalizedBase) ? '' : '.'} ${normalizedSentence}`;
}

function truncateMetaDescription(value: string, maxLength = META_DESCRIPTION_MAX_LENGTH): string {
  const normalized = normalizeMetaDescriptionWhitespace(value);
  if ([...normalized].length <= maxLength) {
    return normalized;
  }

  const chars = [...normalized].slice(0, Math.max(0, maxLength - 1));
  const candidate = chars.join('').replace(/[\s,;:，、；：。.!?！？-]+$/u, '');
  return `${candidate}…`;
}

function getMetaDescriptionBoosters(locale: string | undefined): string[] {
  return META_DESCRIPTION_BOOSTERS[locale ?? ''] ?? META_DESCRIPTION_BOOSTERS.default;
}

function expandMetaDescription(baseDescription: string, locale: string | undefined): string {
  return getMetaDescriptionBoosters(locale).reduce(
    (current, booster) => [...current].length >= META_DESCRIPTION_MIN_LENGTH
      ? current
      : appendSentence(current, booster),
    baseDescription
  );
}

export function resolveMetaDescription(input: MetaDescriptionInput): string {
  const normalizedDescription = normalizeMetaDescriptionWhitespace(input.description ?? '');
  const fallbackDescription = normalizeMetaDescriptionWhitespace(input.title ?? '') || META_DESCRIPTION_DEFAULT_TITLE;
  const baseDescription = normalizedDescription || fallbackDescription;
  const expandedDescription = [...baseDescription].length >= META_DESCRIPTION_MIN_LENGTH
    ? baseDescription
    : expandMetaDescription(baseDescription, input.locale);

  return truncateMetaDescription(expandedDescription);
}

function readSeoNamespace(
  parent: Record<string, unknown>,
  key: string
): Partial<SeoMetadata> {
  const candidate = parent[key];
  if (!isRecord(candidate)) {
    return {};
  }

  return {
    title: isNonEmptyString(candidate.seo_title) ? candidate.seo_title.trim() : undefined,
    description: isNonEmptyString(candidate.seo_description)
      ? candidate.seo_description.trim()
      : undefined,
  };
}

function includeHexIntent(value: string, appendedTerm = 'Hex'): string {
  if (/\bhex\b/i.test(value)) {
    return value;
  }

  const withHex = value
    .replace(/\bBase64,\s*HTML\b/i, 'Base64, Hex, HTML')
    .replace(/\bBase64,\s+(HTML)\b/i, 'Base64, Hex, $1');

  return withHex === value ? `${value} ${appendedTerm}` : withHex;
}

function normalizeEncodingCategorySeo(metadata: SeoMetadata): SeoMetadata {
  const russianEncodingTerm = '\u043a\u043e\u0434\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f';
  const title = includeHexIntent(metadata.title)
    .replace(/\u041a\u043e\u0434\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044f/g, russianEncodingTerm);
  const description = includeHexIntent(metadata.description, 'hex');

  return { title, description };
}

export function getHreflang(locale: Locale): string {
  return hreflangMap[locale];
}

export function withBrand(title: string, brand = 'U2Tool'): string {
  return title.includes(brand) ? title : `${title} | ${brand}`;
}

export function buildWebsiteSearchUrlTemplate(baseUrl: string, locale: Locale = 'en'): string {
  return `${buildLocalizedPageUrl(baseUrl, locale, '/tools')}?q={search_term_string}`;
}

export function withPageUrlTrailingSlash(urlOrPath: string): string {
  if (!urlOrPath) {
    return urlOrPath;
  }

  try {
    const url = new URL(urlOrPath);
    url.pathname = ensurePagePath(url.pathname);
    return url.toString();
  } catch {
    return ensurePagePath(urlOrPath);
  }
}

export function buildLocalizedPagePath(locale: Locale, path = '/'): string {
  return getLocalizedPath(locale, path);
}

export function buildLocalizedPageUrl(baseUrl: string, locale: Locale, path = '/'): string {
  return withPageUrlTrailingSlash(`${baseUrl}${buildLocalizedPagePath(locale, path)}`);
}

export function buildCanonicalUrl({
  baseUrl,
  locale,
  requestUrl,
  canonicalPath,
}: CanonicalUrlInput): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '');
  const url = typeof requestUrl === 'string'
    ? new URL(requestUrl, normalizedBaseUrl)
    : requestUrl;
  const normalizedCanonicalPath = canonicalPath
    ? new URL(canonicalPath, normalizedBaseUrl).pathname
    : undefined;
  const requestPathWithoutLocale = url.pathname.replace(new RegExp(`^/${locale}(?=/|$)`), '') || '/';
  const pathWithoutLocale = normalizedCanonicalPath ?? requestPathWithoutLocale;

  return buildLocalizedPageUrl(normalizedBaseUrl, locale, pathWithoutLocale);
}

export function buildSiteDescription(toolCount: number): string {
  return `${toolCount}+ free online tools for developers, designers, and teams. Format, convert, generate, and validate data directly in your browser.`;
}

function getLargestNumericClaim(text: string): number {
  const matches = [...text.matchAll(/\b(\d[\d,]*)\+?\b/g)];
  const values = matches
    .map((match) => Number.parseInt(match[1].replace(/,/g, ''), 10))
    .filter((value) => Number.isFinite(value));

  return values.length > 0 ? Math.max(...values) : 0;
}

export function resolveSiteDescription(siteDescription: string | undefined, toolCount: number): string {
  const candidate = siteDescription?.trim();
  if (!candidate) {
    return buildSiteDescription(toolCount);
  }

  const largestClaim = getLargestNumericClaim(candidate);
  if (largestClaim > toolCount || /\bmillions? of developers\b/i.test(candidate)) {
    return buildSiteDescription(toolCount);
  }

  return candidate;
}

export function getSiteDescription(
  baseMessages: Record<string, unknown>,
  toolCount: number
): string {
  const site = isRecord(baseMessages.site) ? baseMessages.site : {};
  return isNonEmptyString(site.description) ? site.description.trim() : buildSiteDescription(toolCount);
}

export function buildOrganizationSchema(
  baseUrl: string,
  description: string,
  sameAs: string[] = ['https://github.com/u2tool']
): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'U2Tool',
    url: baseUrl,
    logo: `${baseUrl}/favicon.svg`,
    description,
    sameAs,
  };
}

export function buildWebsiteSchema(
  baseUrl: string,
  locale: Locale,
  description: string,
  isHomePage = false
): WebsiteSchema {
  const schema: WebsiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'U2Tool',
    url: baseUrl,
    description,
    inLanguage: getHreflang(locale),
  };

  if (isHomePage) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: buildWebsiteSearchUrlTemplate(baseUrl, locale),
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return schema;
}

export function getToolsPageSeo(
  baseMessages: Record<string, unknown>,
  toolCount: number,
  locale?: Locale | string
): SeoMetadata {
  const pages = isRecord(baseMessages.pages) ? baseMessages.pages : {};
  const toolsPage = readSeoNamespace(pages, 'tools');
  const title = toolsPage.title
    ? normalizeCountClaim(toolsPage.title, toolCount)
    : `Browse ${toolCount}+ Free Online Tools`;
  const description = toolsPage.description
    ? normalizeCountClaim(toolsPage.description, toolCount)
    : `Browse ${toolCount}+ free online tools for developers, designers, and creators.`;

  return {
    title,
    description: resolveMetaDescription({ description, locale, title }),
  };
}

export function getHomePageSeo(
  baseMessages: Record<string, unknown>,
  toolCount: number,
  locale?: Locale | string
): SeoMetadata {
  const pages = isRecord(baseMessages.pages) ? baseMessages.pages : {};
  const homePage = readSeoNamespace(pages, 'home');
  const home = isRecord(baseMessages.home) ? baseMessages.home : {};
  const hero = isRecord(home.hero) ? home.hero : {};

  const fallbackTitle = `U2Tool: ${toolCount}+ Free Online Tools, Converters & Generators`;
  const fallbackDescription =
    `Explore U2Tool's ${toolCount}+ free online tools for JSON, PDF, images, text, charts, SEO, and developer workflows. Fast, browser-based, and no signup required.`;
  const heroTitle = isNonEmptyString(hero.title) ? hero.title.trim() : '';
  const heroDescription = isNonEmptyString(hero.subtitle) ? hero.subtitle.trim() : '';
  const genericHomeTitle = heroTitle === 'Free Online Tools';
  const genericHomeDescription = heroDescription === 'Boost your productivity with our collection of free developer tools. No signup required, works entirely in your browser.'
    || heroDescription === 'Boost your productivity with our collection of free developer tools.';

  const title = homePage.title
    ? normalizeCountClaim(homePage.title, toolCount)
    : heroTitle && !genericHomeTitle
      ? normalizeCountClaim(heroTitle, toolCount)
      : fallbackTitle;
  const description = homePage.description
    ? normalizeCountClaim(homePage.description, toolCount)
    : heroDescription && !genericHomeDescription
      ? normalizeCountClaim(heroDescription, toolCount)
      : fallbackDescription;

  return {
    title,
    description: resolveMetaDescription({ description, locale, title }),
  };
}

export function getCategoryPageSeo(
  baseMessages: Record<string, unknown>,
  category: ToolCategory,
  fallbackCategoryName: string,
  toolCount: number,
  locale?: Locale | string
): SeoMetadata {
  const categoriesSeo = isRecord(baseMessages.categories_seo) ? baseMessages.categories_seo : {};
  const categorySeo = readSeoNamespace(categoriesSeo, category);
  const metadata = {
    title: categorySeo.title ?? `${fallbackCategoryName} Tools`,
    description:
      categorySeo.description ??
      `${toolCount}+ free ${fallbackCategoryName} tools online.`,
  };
  const normalizedMetadata = category === 'encoding' ? normalizeEncodingCategorySeo(metadata) : metadata;

  return {
    ...normalizedMetadata,
    description: resolveMetaDescription({
      description: normalizedMetadata.description,
      locale,
      title: normalizedMetadata.title,
    }),
  };
}
