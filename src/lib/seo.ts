/**
 * SEO 配置模块
 * 集中管理 SEO 相关的配置常量和工具函数
 * 支持 Google、Bing、百度、360、搜狗等搜索引擎优化
 */

// 支持的语言列表（与 i18n/routing.ts 保持同步）
export const SEO_LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'] as const;
export type SeoLocale = (typeof SEO_LOCALES)[number];

// SEO 配置常量
export const SEO_CONFIG = {
  siteName: 'U2Tool',
  siteUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://www.u2tool.com',
  defaultLocale: 'en' as SeoLocale,
  locales: SEO_LOCALES,
  twitterHandle: '@toolbox',
  defaultOgImage: '/og-default.png',
  // 元数据长度限制
  titleMaxLength: 60,
  descriptionMinLength: 120,
  descriptionMaxLength: 160,
  // 主题颜色（用于浏览器地址栏、PWA 等）
  themeColor: '#3b82f6',
  // 站长验证码（部署时替换为实际值）
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || '',
    bing: process.env.BING_SITE_VERIFICATION || '',
    baidu: process.env.BAIDU_SITE_VERIFICATION || 'codeva-DaI2NqB1Qi',
    yandex: process.env.YANDEX_SITE_VERIFICATION || 'd3e0d052e17a742e',
    // 360站长平台验证码 - 硬编码以确保可靠性
    so360: process.env.SO360_SITE_VERIFICATION || 'a9a62516e3a7977830175b7fb2eb1f66',
  },
  // 全局关键词（按语言）- 用于首页和通用页面
  keywords: {
    en: [
      // 品牌词
      'online tools', 'developer tools', 'free tools', 'web tools', 'dev utilities',
      // 核心工具词
      'JSON formatter', 'Base64 encoder', 'UUID generator', 'code converter',
      'hash generator', 'QR code generator', 'password generator',
      // 长尾关键词
      'free online tools no signup', 'browser-based tools', 'instant tools',
      'developer toolkit', 'programming utilities', 'code tools online',
      // 功能词
      'encode decode', 'format beautify', 'convert transform', 'generate create',
    ],
    zh: [
      // 品牌词
      '在线工具', '开发者工具', '免费工具', '网页工具', '程序员工具箱',
      // 核心工具词
      'JSON格式化', 'Base64编码', 'UUID生成器', '代码转换', '哈希生成器',
      '二维码生成', '密码生成器', '时间戳转换',
      // 长尾关键词
      '免费在线工具', '无需注册', '浏览器工具', '即时工具',
      '开发工具集', '编程工具', '代码工具',
      // 功能词
      '编码解码', '格式化美化', '转换工具', '生成器',
    ],
    es: [
      // 品牌词
      'herramientas en línea', 'herramientas de desarrollo', 'herramientas gratuitas',
      'utilidades web', 'caja de herramientas del desarrollador',
      // 核心工具词
      'formateador JSON', 'codificador Base64', 'generador UUID',
      'convertidor de código', 'generador de hash', 'generador de QR',
      // 长尾关键词
      'herramientas online gratis', 'sin registro', 'herramientas del navegador',
      // 功能词
      'codificar decodificar', 'formatear embellecer', 'convertir transformar',
    ],
    pt: [
      // 品牌词
      'ferramentas online', 'ferramentas de desenvolvedor', 'ferramentas gratuitas',
      'utilitários web', 'caixa de ferramentas do desenvolvedor',
      // 核心工具词
      'formatador JSON', 'codificador Base64', 'gerador UUID',
      'conversor de código', 'gerador de hash', 'gerador de QR',
      // 长尾关键词
      'ferramentas online grátis', 'sem registro', 'ferramentas do navegador',
      // 功能词
      'codificar decodificar', 'formatar embelezar', 'converter transformar',
    ],
    ja: [
      // 品牌词
      'オンラインツール', '開発者ツール', '無料ツール', 'ウェブツール', '開発ツールキット',
      // 核心工具词
      'JSONフォーマッター', 'Base64エンコーダー', 'UUID生成', 'コード変換',
      'ハッシュ生成', 'QRコード生成', 'パスワード生成',
      // 长尾关键词
      '無料オンラインツール', '登録不要', 'ブラウザツール', '即時ツール',
      // 功能词
      'エンコードデコード', 'フォーマット整形', '変換ツール', 'ジェネレーター',
    ],
    ru: [
      // 品牌词
      'онлайн инструменты', 'инструменты разработчика', 'бесплатные инструменты',
      'веб утилиты', 'набор инструментов разработчика',
      // 核心工具词
      'форматирование JSON', 'кодировщик Base64', 'генератор UUID',
      'конвертер кода', 'генератор хэша', 'генератор QR кода',
      // 长尾关键词
      'бесплатные онлайн инструменты', 'без регистрации', 'браузерные инструменты',
      // 功能词
      'кодировать декодировать', 'форматировать', 'конвертировать', 'генерировать',
    ],
    fr: [
      // 品牌词
      'outils en ligne', 'outils de développeur', 'outils gratuits',
      'utilitaires web', 'boîte à outils développeur',
      // 核心工具词
      'formateur JSON', 'encodeur Base64', 'générateur UUID',
      'convertisseur de code', 'générateur de hash', 'générateur QR',
      // 长尾关键词
      'outils en ligne gratuits', 'sans inscription', 'outils navigateur',
      // 功能词
      'encoder décoder', 'formater embellir', 'convertir transformer', 'générer créer',
    ],
    ar: [
      // 品牌词
      'أدوات عبر الإنترنت', 'أدوات المطورين', 'أدوات مجانية',
      'أدوات الويب', 'مجموعة أدوات المطور',
      // 核心工具词
      'منسق JSON', 'مشفر Base64', 'مولد UUID',
      'محول الكود', 'مولد التجزئة', 'مولد رمز QR',
      // 长尾关键词
      'أدوات مجانية عبر الإنترنت', 'بدون تسجيل', 'أدوات المتصفح',
      // 功能词
      'تشفير فك التشفير', 'تنسيق تجميل', 'تحويل', 'توليد إنشاء',
    ],
    de: [
      // 品牌词
      'Online-Tools', 'Entwickler-Tools', 'kostenlose Tools',
      'Web-Utilities', 'Entwickler-Toolkit',
      // 核心工具词
      'JSON-Formatierer', 'Base64-Encoder', 'UUID-Generator',
      'Code-Konverter', 'Hash-Generator', 'QR-Code-Generator',
      // 长尾关键词
      'kostenlose Online-Tools', 'ohne Registrierung', 'Browser-Tools',
      // 功能词
      'kodieren dekodieren', 'formatieren verschönern', 'konvertieren transformieren', 'generieren erstellen',
    ],
    ko: [
      // 品牌词
      '온라인 도구', '개발자 도구', '무료 도구',
      '웹 유틸리티', '개발자 툴킷',
      // 核心工具词
      'JSON 포맷터', 'Base64 인코더', 'UUID 생성기',
      '코드 변환기', '해시 생성기', 'QR 코드 생성기',
      // 长尾关键词
      '무료 온라인 도구', '가입 불필요', '브라우저 도구',
      // 功能词
      '인코딩 디코딩', '포맷 정리', '변환 도구', '생성기',
    ],
  },
} as const;

// 从独立的关键词配置文件导入
// 包含全面的多语言关键词和长尾关键词配置
import { CATEGORY_KEYWORDS, TOOL_KEYWORDS } from './seo-keywords';
export { CATEGORY_KEYWORDS, TOOL_KEYWORDS };

/**
 * 生成规范 URL（不带尾部斜杠）
 * @param locale - 语言代码
 * @param path - 路径（以 / 开头）
 * @returns 完整的规范 URL
 */
export function getCanonicalUrl(locale: string, path: string = ''): string {
  const baseUrl = SEO_CONFIG.siteUrl;
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  // 移除尾部斜杠
  const cleanPath = normalizedPath === '/' ? '' : normalizedPath.replace(/\/$/, '');
  return `${baseUrl}/${locale}${cleanPath}`;
}

/**
 * 生成 hreflang 链接映射
 * @param path - 路径（不含 locale 前缀）
 * @returns locale 到 URL 的映射对象
 */
export function generateHreflangLinks(path: string = ''): Record<string, string> {
  const links: Record<string, string> = {};
  
  for (const locale of SEO_CONFIG.locales) {
    links[locale] = getCanonicalUrl(locale, path);
  }
  
  // 添加 x-default 指向默认语言
  links['x-default'] = getCanonicalUrl(SEO_CONFIG.defaultLocale, path);
  
  return links;
}

/**
 * 生成 alternates 对象（用于 Next.js Metadata API）
 * @param locale - 当前语言
 * @param path - 路径（不含 locale 前缀）
 * @returns alternates 对象
 */
export function generateAlternates(locale: string, path: string = '') {
  return {
    canonical: `/${locale}${path}`,
    languages: Object.fromEntries(
      SEO_CONFIG.locales.map(l => [l, `/${l}${path}`])
    ),
  };
}

// JSON-LD 结构化数据类型
export type JsonLdType = 'WebSite' | 'SoftwareApplication' | 'BreadcrumbList' | 'Organization';

interface JsonLdBase {
  '@context': 'https://schema.org';
  '@type': string;
}

interface WebSiteJsonLd extends JsonLdBase {
  '@type': 'WebSite';
  name: string;
  alternateName?: string;
  url: string;
  inLanguage?: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
}

interface SoftwareApplicationJsonLd extends JsonLdBase {
  '@type': 'SoftwareApplication';
  name: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  url: string;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
}

interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

interface BreadcrumbListJsonLd extends JsonLdBase {
  '@type': 'BreadcrumbList';
  itemListElement: BreadcrumbItem[];
}

// CollectionPage JSON-LD 接口（用于分类页面）
interface CollectionPageJsonLd extends JsonLdBase {
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  mainEntity: {
    '@type': 'ItemList';
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      name: string;
      url: string;
    }>;
  };
}

// HowTo JSON-LD 接口（用于工具使用说明）
interface HowToJsonLd extends JsonLdBase {
  '@type': 'HowTo';
  name: string;
  description: string;
  step: Array<{
    '@type': 'HowToStep';
    position: number;
    name: string;
    text: string;
  }>;
  totalTime?: string;
}

// Speakable JSON-LD 接口（用于语音搜索优化）
interface SpeakableJsonLd extends JsonLdBase {
  '@type': 'WebPage';
  name: string;
  description: string;
  url: string;
  speakable: {
    '@type': 'SpeakableSpecification';
    cssSelector: string[];
  };
}

export type JsonLdData = WebSiteJsonLd | SoftwareApplicationJsonLd | BreadcrumbListJsonLd | OrganizationJsonLd | FAQPageJsonLd | ItemListJsonLd | CollectionPageJsonLd | HowToJsonLd | SpeakableJsonLd;

// Organization JSON-LD 接口
interface OrganizationJsonLd extends JsonLdBase {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

// FAQ JSON-LD 接口
interface FAQPageJsonLd extends JsonLdBase {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// ItemList JSON-LD 接口（用于工具列表页）
interface ItemListJsonLd extends JsonLdBase {
  '@type': 'ItemList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    url: string;
  }>;
}

/**
 * 生成 WebSite JSON-LD 结构化数据（用于首页）
 * @param locale - 语言代码
 * @returns WebSite JSON-LD 对象
 */
export function generateWebSiteJsonLd(locale: string): WebSiteJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    alternateName: 'U2Tool - Free Online Developer Tools',
    url: getCanonicalUrl(locale, ''),
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.siteUrl}/${locale}/tools?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * 生成 SoftwareApplication JSON-LD 结构化数据（用于工具页面）
 * @param params - 工具信息参数
 * @returns SoftwareApplication JSON-LD 对象
 */
export function generateSoftwareApplicationJsonLd(params: {
  name: string;
  description: string;
  category: string;
  locale: string;
  slug: string;
}): SoftwareApplicationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: params.name,
    description: params.description,
    applicationCategory: params.category,
    operatingSystem: 'Web Browser',
    url: getCanonicalUrl(params.locale, `/tools/${params.slug}`),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

/**
 * 生成 BreadcrumbList JSON-LD 结构化数据
 * @param items - 面包屑项目数组
 * @param locale - 语言代码
 * @returns BreadcrumbList JSON-LD 对象
 */
export function generateBreadcrumbJsonLd(
  items: Array<{ name: string; path?: string }>,
  locale: string
): BreadcrumbListJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.name,
      // 最后一项不需要 item URL，path 可以是空字符串（首页）
      ...(item.path !== undefined && index < items.length - 1
        ? { item: getCanonicalUrl(locale, item.path) }
        : {}),
    })),
  };
}

/**
 * 将 JSON-LD 对象转换为 script 标签内容
 * @param data - JSON-LD 数据对象
 * @returns JSON 字符串
 */
export function jsonLdToString(data: JsonLdData | JsonLdData[]): string {
  return JSON.stringify(data);
}

/**
 * 生成动态 OG 图片 URL
 * @param params - 图片参数
 * @returns OG 图片 URL
 */
export function generateOgImageUrl(params: {
  title: string;
  locale: string;
  icon?: string;
}): string {
  const searchParams = new URLSearchParams({
    title: params.title,
    locale: params.locale,
    ...(params.icon && { icon: params.icon }),
  });
  return `${SEO_CONFIG.siteUrl}/api/og?${searchParams.toString()}`;
}

/**
 * 截断文本到指定长度
 * @param text - 原始文本
 * @param maxLength - 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * 验证 URL slug 格式（小写、连字符分隔）
 * @param slug - URL slug
 * @returns 是否有效
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/**
 * 编码 URL 特殊字符
 * @param url - 原始 URL
 * @returns 编码后的 URL
 */
export function encodeUrlPath(url: string): string {
  return encodeURI(url).replace(/#/g, '%23');
}

/**
 * 生成 Organization JSON-LD 结构化数据
 * @param locale - 语言代码
 * @returns Organization JSON-LD 对象
 */
export function generateOrganizationJsonLd(locale: string): OrganizationJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    url: getCanonicalUrl(locale, ''),
    logo: `${SEO_CONFIG.siteUrl}/icons/icon-512x512.png`,
    sameAs: [
      // 可以添加社交媒体链接
      // 'https://twitter.com/toolbox',
      // 'https://github.com/toolbox',
    ],
  };
}

/**
 * 生成 FAQ JSON-LD 结构化数据
 * @param faqs - FAQ 数组
 * @returns FAQPage JSON-LD 对象
 */
export function generateFAQJsonLd(
  faqs: Array<{ question: string; answer: string }>
): FAQPageJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * 生成 ItemList JSON-LD 结构化数据（用于工具列表页）
 * @param items - 工具列表
 * @param locale - 语言代码
 * @returns ItemList JSON-LD 对象
 */
export function generateItemListJsonLd(
  items: Array<{ name: string; slug: string }>,
  locale: string
): ItemListJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: getCanonicalUrl(locale, `/tools/${item.slug}`),
    })),
  };
}

/**
 * 获取当前语言的关键词
 * @param locale - 语言代码
 * @returns 关键词数组
 */
export function getKeywords(locale: string): readonly string[] {
  const localeKey = locale as keyof typeof SEO_CONFIG.keywords;
  return SEO_CONFIG.keywords[localeKey] || SEO_CONFIG.keywords.en;
}

/**
 * 获取分类关键词
 * @param category - 分类 ID
 * @param locale - 语言代码
 * @returns 分类关键词数组
 */
export function getCategoryKeywords(category: string, locale: string): string[] {
  const categoryData = CATEGORY_KEYWORDS[category];
  if (!categoryData) return [];
  return categoryData[locale] || categoryData['en'] || [];
}

/**
 * 获取工具关键词
 * @param slug - 工具 slug
 * @param locale - 语言代码
 * @returns 工具关键词数组
 */
export function getToolKeywords(slug: string, locale: string): string[] {
  const toolData = TOOL_KEYWORDS[slug];
  if (!toolData) return [];
  return toolData[locale] || toolData['en'] || [];
}

/**
 * 生成站长验证 meta 标签对象
 * 符合 Next.js Metadata API 的 verification 格式
 * @returns 验证标签对象
 */
export function getVerificationTags() {
  return {
    // Google Search Console
    google: SEO_CONFIG.verification.google || undefined,
    // Yandex Webmaster
    yandex: SEO_CONFIG.verification.yandex || undefined,
    // 其他验证（百度、Bing、360等）
    other: {
      // 百度站长平台
      ...(SEO_CONFIG.verification.baidu && {
        'baidu-site-verification': [SEO_CONFIG.verification.baidu],
      }),
      // Bing Webmaster
      ...(SEO_CONFIG.verification.bing && {
        'msvalidate.01': [SEO_CONFIG.verification.bing],
      }),
      // 360站长平台
      ...(SEO_CONFIG.verification.so360 && {
        '360-site-verification': [SEO_CONFIG.verification.so360],
      }),
    },
  };
}


/**
 * 生成 CollectionPage JSON-LD 结构化数据（用于分类页面）
 * @param params - 分类信息参数
 * @returns CollectionPage JSON-LD 对象
 */
export function generateCollectionPageJsonLd(params: {
  name: string;
  description: string;
  locale: string;
  categoryId: string;
  items: Array<{ name: string; slug: string }>;
}): JsonLdData {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: params.name,
    description: params.description,
    url: getCanonicalUrl(params.locale, `/tools/category/${params.categoryId}`),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: params.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: getCanonicalUrl(params.locale, `/tools/${item.slug}`),
      })),
    },
  };
}

/**
 * 生成 HowTo JSON-LD 结构化数据（用于工具使用说明）
 * @param params - HowTo 参数
 * @returns HowTo JSON-LD 对象
 */
export function generateHowToJsonLd(params: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string }>;
  totalTime?: string;
}): HowToJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: params.name,
    description: params.description,
    step: params.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    ...(params.totalTime && { totalTime: params.totalTime }),
  };
}

/**
 * 生成工具使用步骤（多语言）
 * @param toolName - 工具名称
 * @param locale - 语言代码
 * @returns 使用步骤数组
 */
export function getToolHowToSteps(
  toolName: string,
  locale: string
): Array<{ name: string; text: string }> {
  const steps: Record<string, Array<{ name: string; text: string }>> = {
    en: [
      { name: 'Open the tool', text: `Navigate to the ${toolName} tool page.` },
      { name: 'Enter your data', text: 'Input your data in the provided text area or upload a file.' },
      { name: 'Configure options', text: 'Adjust any settings or options as needed.' },
      { name: 'Process', text: 'Click the process button to transform your data.' },
      { name: 'Copy or download', text: 'Copy the result to clipboard or download as a file.' },
    ],
    zh: [
      { name: '打开工具', text: `导航到 ${toolName} 工具页面。` },
      { name: '输入数据', text: '在提供的文本区域输入数据或上传文件。' },
      { name: '配置选项', text: '根据需要调整设置或选项。' },
      { name: '处理', text: '点击处理按钮转换您的数据。' },
      { name: '复制或下载', text: '将结果复制到剪贴板或下载为文件。' },
    ],
    es: [
      { name: 'Abrir la herramienta', text: `Navega a la página de la herramienta ${toolName}.` },
      { name: 'Ingresa tus datos', text: 'Introduce tus datos en el área de texto o sube un archivo.' },
      { name: 'Configura opciones', text: 'Ajusta la configuración según sea necesario.' },
      { name: 'Procesar', text: 'Haz clic en el botón de procesar para transformar tus datos.' },
      { name: 'Copiar o descargar', text: 'Copia el resultado o descárgalo como archivo.' },
    ],
    pt: [
      { name: 'Abrir a ferramenta', text: `Navegue até a página da ferramenta ${toolName}.` },
      { name: 'Insira seus dados', text: 'Digite seus dados na área de texto ou faça upload de um arquivo.' },
      { name: 'Configure opções', text: 'Ajuste as configurações conforme necessário.' },
      { name: 'Processar', text: 'Clique no botão processar para transformar seus dados.' },
      { name: 'Copiar ou baixar', text: 'Copie o resultado ou baixe como arquivo.' },
    ],
    ja: [
      { name: 'ツールを開く', text: `${toolName}ツールページに移動します。` },
      { name: 'データを入力', text: 'テキストエリアにデータを入力するか、ファイルをアップロードします。' },
      { name: 'オプションを設定', text: '必要に応じて設定を調整します。' },
      { name: '処理', text: '処理ボタンをクリックしてデータを変換します。' },
      { name: 'コピーまたはダウンロード', text: '結果をクリップボードにコピーするか、ファイルとしてダウンロードします。' },
    ],
    ru: [
      { name: 'Откройте инструмент', text: `Перейдите на страницу инструмента ${toolName}.` },
      { name: 'Введите данные', text: 'Введите данные в текстовое поле или загрузите файл.' },
      { name: 'Настройте параметры', text: 'При необходимости настройте параметры.' },
      { name: 'Обработка', text: 'Нажмите кнопку обработки для преобразования данных.' },
      { name: 'Скопируйте или скачайте', text: 'Скопируйте результат в буфер обмена или скачайте как файл.' },
    ],
    fr: [
      { name: 'Ouvrir l\'outil', text: `Accédez à la page de l'outil ${toolName}.` },
      { name: 'Entrez vos données', text: 'Saisissez vos données dans la zone de texte ou téléchargez un fichier.' },
      { name: 'Configurez les options', text: 'Ajustez les paramètres selon vos besoins.' },
      { name: 'Traiter', text: 'Cliquez sur le bouton de traitement pour transformer vos données.' },
      { name: 'Copier ou télécharger', text: 'Copiez le résultat dans le presse-papiers ou téléchargez-le.' },
    ],
    ar: [
      { name: 'افتح الأداة', text: `انتقل إلى صفحة أداة ${toolName}.` },
      { name: 'أدخل بياناتك', text: 'أدخل بياناتك في منطقة النص أو قم بتحميل ملف.' },
      { name: 'تكوين الخيارات', text: 'اضبط الإعدادات حسب الحاجة.' },
      { name: 'معالجة', text: 'انقر على زر المعالجة لتحويل بياناتك.' },
      { name: 'نسخ أو تنزيل', text: 'انسخ النتيجة إلى الحافظة أو قم بتنزيلها كملف.' },
    ],
    de: [
      { name: 'Tool öffnen', text: `Navigieren Sie zur ${toolName}-Tool-Seite.` },
      { name: 'Daten eingeben', text: 'Geben Sie Ihre Daten in das Textfeld ein oder laden Sie eine Datei hoch.' },
      { name: 'Optionen konfigurieren', text: 'Passen Sie die Einstellungen nach Bedarf an.' },
      { name: 'Verarbeiten', text: 'Klicken Sie auf die Schaltfläche zum Verarbeiten Ihrer Daten.' },
      { name: 'Kopieren oder herunterladen', text: 'Kopieren Sie das Ergebnis in die Zwischenablage oder laden Sie es herunter.' },
    ],
    ko: [
      { name: '도구 열기', text: `${toolName} 도구 페이지로 이동합니다.` },
      { name: '데이터 입력', text: '텍스트 영역에 데이터를 입력하거나 파일을 업로드합니다.' },
      { name: '옵션 구성', text: '필요에 따라 설정을 조정합니다.' },
      { name: '처리', text: '처리 버튼을 클릭하여 데이터를 변환합니다.' },
      { name: '복사 또는 다운로드', text: '결과를 클립보드에 복사하거나 파일로 다운로드합니다.' },
    ],
  };
  
  return steps[locale] || steps.en;
}

/**
 * 生成首页 FAQ 数据（多语言）
 * @param locale - 语言代码
 * @returns FAQ 数组
 */
export function getHomepageFAQs(locale: string): Array<{ question: string; answer: string }> {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    en: [
      {
        question: 'Are these tools free to use?',
        answer: 'Yes, all tools on U2Tool are completely free to use. No registration or payment required.',
      },
      {
        question: 'Is my data safe when using these tools?',
        answer: 'Absolutely. All tools run entirely in your browser. Your data never leaves your device and is not sent to any server.',
      },
      {
        question: 'Do I need to create an account?',
        answer: 'No account is needed. You can use all tools immediately without any signup or login.',
      },
      {
        question: 'What types of tools are available?',
        answer: 'We offer 200+ tools including JSON formatters, encoders/decoders, generators, converters, and developer utilities.',
      },
    ],
    zh: [
      {
        question: '这些工具是免费的吗？',
        answer: '是的，U2Tool 上的所有工具都完全免费使用，无需注册或付费。',
      },
      {
        question: '使用这些工具时我的数据安全吗？',
        answer: '绝对安全。所有工具完全在您的浏览器中运行，您的数据不会离开您的设备，也不会发送到任何服务器。',
      },
      {
        question: '我需要创建账户吗？',
        answer: '不需要账户。您可以立即使用所有工具，无需任何注册或登录。',
      },
      {
        question: '有哪些类型的工具？',
        answer: '我们提供 200+ 种工具，包括 JSON 格式化器、编码器/解码器、生成器、转换器和开发者实用工具。',
      },
    ],
    es: [
      {
        question: '¿Son gratuitas estas herramientas?',
        answer: 'Sí, todas las herramientas en U2Tool son completamente gratuitas. No se requiere registro ni pago.',
      },
      {
        question: '¿Están seguros mis datos al usar estas herramientas?',
        answer: 'Absolutamente. Todas las herramientas se ejecutan completamente en su navegador. Sus datos nunca salen de su dispositivo.',
      },
    ],
    pt: [
      {
        question: 'Essas ferramentas são gratuitas?',
        answer: 'Sim, todas as ferramentas no U2Tool são completamente gratuitas. Não é necessário registro ou pagamento.',
      },
      {
        question: 'Meus dados estão seguros ao usar essas ferramentas?',
        answer: 'Absolutamente. Todas as ferramentas são executadas inteiramente no seu navegador. Seus dados nunca saem do seu dispositivo.',
      },
    ],
    ja: [
      {
        question: 'これらのツールは無料ですか？',
        answer: 'はい、U2Toolのすべてのツールは完全に無料です。登録や支払いは必要ありません。',
      },
      {
        question: 'これらのツールを使用する際、データは安全ですか？',
        answer: 'はい、完全に安全です。すべてのツールはブラウザ内で完全に実行され、データがデバイスから離れることはありません。',
      },
    ],
    ru: [
      {
        question: 'Эти инструменты бесплатны?',
        answer: 'Да, все инструменты на U2Tool полностью бесплатны. Регистрация или оплата не требуется.',
      },
      {
        question: 'Безопасны ли мои данные при использовании этих инструментов?',
        answer: 'Абсолютно. Все инструменты работают полностью в вашем браузере. Ваши данные никогда не покидают ваше устройство.',
      },
    ],
    fr: [
      {
        question: 'Ces outils sont-ils gratuits?',
        answer: 'Oui, tous les outils sur U2Tool sont entièrement gratuits. Aucune inscription ni paiement requis.',
      },
      {
        question: 'Mes données sont-elles sécurisées lors de l\'utilisation de ces outils?',
        answer: 'Absolument. Tous les outils fonctionnent entièrement dans votre navigateur. Vos données ne quittent jamais votre appareil.',
      },
    ],
    ar: [
      {
        question: 'هل هذه الأدوات مجانية؟',
        answer: 'نعم، جميع الأدوات على U2Tool مجانية تماماً. لا يلزم التسجيل أو الدفع.',
      },
      {
        question: 'هل بياناتي آمنة عند استخدام هذه الأدوات؟',
        answer: 'بالتأكيد. جميع الأدوات تعمل بالكامل في متصفحك. بياناتك لا تغادر جهازك أبداً.',
      },
    ],
    de: [
      {
        question: 'Sind diese Tools kostenlos?',
        answer: 'Ja, alle Tools auf U2Tool sind völlig kostenlos. Keine Registrierung oder Zahlung erforderlich.',
      },
      {
        question: 'Sind meine Daten bei der Verwendung dieser Tools sicher?',
        answer: 'Absolut. Alle Tools laufen vollständig in Ihrem Browser. Ihre Daten verlassen niemals Ihr Gerät.',
      },
    ],
    ko: [
      {
        question: '이 도구들은 무료인가요?',
        answer: '네, U2Tool의 모든 도구는 완전히 무료입니다. 등록이나 결제가 필요 없습니다.',
      },
      {
        question: '이 도구를 사용할 때 내 데이터는 안전한가요?',
        answer: '물론입니다. 모든 도구는 브라우저에서 완전히 실행됩니다. 데이터는 절대 기기를 떠나지 않습니다.',
      },
    ],
  };
  
  return faqs[locale] || faqs.en;
}

// 面包屑导航项目接口（用于 UI 组件）
export interface BreadcrumbNavItem {
  /** 显示名称 */
  name: string;
  /** 路径（不含 locale 前缀），最后一项可省略 */
  path?: string;
}

/**
 * 生成工具页面的面包屑项目
 * @param homeLabel - 首页标签
 * @param toolsLabel - 工具列表标签
 * @param toolName - 当前工具名称
 * @returns 面包屑项目数组
 */
export function generateToolBreadcrumbs(
  homeLabel: string,
  toolsLabel: string,
  toolName: string
): BreadcrumbNavItem[] {
  return [
    { name: homeLabel, path: '' },
    { name: toolsLabel, path: '/tools' },
    { name: toolName },
  ];
}

/**
 * 生成 Speakable JSON-LD 结构化数据（用于语音搜索优化）
 * 标记页面中适合语音朗读的内容区域
 * @param params - Speakable 参数
 * @returns Speakable JSON-LD 对象
 */
export function generateSpeakableJsonLd(params: {
  name: string;
  description: string;
  locale: string;
  path: string;
  cssSelectors?: string[];
}): SpeakableJsonLd {
  // 默认的 speakable 选择器（工具描述和 FAQ 答案）
  const defaultSelectors = [
    'h1',                    // 页面标题
    '.tool-description',     // 工具描述
    '.faq-answer',           // FAQ 答案
  ];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: params.name,
    description: params.description,
    url: getCanonicalUrl(params.locale, params.path),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: params.cssSelectors || defaultSelectors,
    },
  };
}

// AggregateRating JSON-LD 接口（预留，用于用户评分）
interface AggregateRatingJsonLd {
  '@type': 'AggregateRating';
  ratingValue: number;
  ratingCount: number;
  bestRating: number;
  worstRating: number;
}

/**
 * 生成 AggregateRating JSON-LD 结构化数据（预留）
 * 用于显示工具的用户评分
 * @param params - 评分参数
 * @returns AggregateRating JSON-LD 对象
 */
export function generateAggregateRatingJsonLd(params: {
  ratingValue: number;
  ratingCount: number;
  bestRating?: number;
  worstRating?: number;
}): AggregateRatingJsonLd {
  return {
    '@type': 'AggregateRating',
    ratingValue: params.ratingValue,
    ratingCount: params.ratingCount,
    bestRating: params.bestRating || 5,
    worstRating: params.worstRating || 1,
  };
}

// VideoObject JSON-LD 接口（预留，用于视频教程）
interface VideoObjectJsonLd extends JsonLdBase {
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}

/**
 * 生成 VideoObject JSON-LD 结构化数据（预留）
 * 用于工具的视频教程
 * @param params - 视频参数
 * @returns VideoObject JSON-LD 对象
 */
export function generateVideoObjectJsonLd(params: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}): VideoObjectJsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: params.name,
    description: params.description,
    thumbnailUrl: params.thumbnailUrl,
    uploadDate: params.uploadDate,
    ...(params.duration && { duration: params.duration }),
    ...(params.contentUrl && { contentUrl: params.contentUrl }),
    ...(params.embedUrl && { embedUrl: params.embedUrl }),
  };
}
