import { tools, type ToolCategory } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';
import { filterIndexableTools } from './index-suppression';
import type { DiscoveryCandidate } from './ai-discovery/types';
import {
  phaseTwentyOneComparisonCopy,
  phaseTwentyOneComparisonDefinitions,
} from './comparison-surfaces-phase21';

export type ComparisonSurfaceSlug =
  | 'choose-text-tool'
  | 'choose-chart-type'
  | 'choose-image-tool'
  | 'choose-json-tool'
  | 'choose-jwt-tool'
  | 'meta-tags-vs-open-graph-vs-twitter-cards';

type ExistingComparisonSurfaceSlug =
  | 'choose-image-tool'
  | 'choose-json-tool'
  | 'meta-tags-vs-open-graph-vs-twitter-cards';
type PhaseElevenComparisonSurfaceSlug = 'choose-chart-type' | 'choose-jwt-tool';
type PhaseTwentyOneComparisonSurfaceSlug = 'choose-text-tool';

type WorkflowId =
  | 'compare-debug'
  | 'convert-export'
  | 'crawl-discovery'
  | 'format-inspect'
  | 'optimize'
  | 'preview-validate'
  | 'resize-crop'
  | 'search-metadata'
  | 'social-cards'
  | 'validate-query';

interface ComparisonSurfaceDefinition {
  primaryCategory: ToolCategory;
  relatedCategories: ToolCategory[];
  slug: ComparisonSurfaceSlug;
  workflows: Array<{
    id: WorkflowId;
    toolSlugs: string[];
  }>;
}

interface ComparisonSurfaceCopy {
  aliases: readonly string[];
  description: string;
  shortDescription: string;
  title: string;
  workflows: Record<WorkflowId, string>;
}

export interface ComparisonSurfaceTool {
  category: ToolCategory;
  categoryName: string;
  description: string;
  href: string;
  name: string;
  slug: string;
  workflowTitle: string;
}

export interface ComparisonSurfaceGuide {
  description: string;
  href: string;
  relatedCategories: Array<{
    href: string;
    name: string;
    slug: ToolCategory;
  }>;
  representativeTools: ComparisonSurfaceTool[];
  shortDescription: string;
  slug: ComparisonSurfaceSlug;
  title: string;
  workflows: Array<{
    slug: WorkflowId;
    title: string;
    tools: ComparisonSurfaceTool[];
  }>;
}

export interface ComparisonUiCopy {
  browseAllLabel: string;
  comparisonLabel: string;
  comparisonSectionDescription: string;
  comparisonSectionTitle: string;
  guideCtaLabel: string;
  includedToolsLabel: string;
  relatedCategoriesLabel: string;
  routeLabel: string;
  tableCategoryLabel: string;
  tableTitle: string;
  tableToolLabel: string;
  workflowTitle: string;
}

const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

const comparisonSurfaceDefinitions: ComparisonSurfaceDefinition[] = [
  {
    slug: 'choose-json-tool',
    primaryCategory: 'development',
    relatedCategories: ['development', 'encoding', 'converters'],
    workflows: [
      {
        id: 'format-inspect',
        toolSlugs: ['json-formatter', 'json-viewer', 'json-sorter', 'json-minifier'],
      },
      {
        id: 'validate-query',
        toolSlugs: ['json-schema-validator', 'json-path-tester', 'json-path-finder'],
      },
      {
        id: 'compare-debug',
        toolSlugs: ['json-diff', 'json-merger', 'json-flattener'],
      },
      {
        id: 'convert-export',
        toolSlugs: ['json-to-csv', 'json-to-yaml', 'json-to-xml', 'json-to-typescript'],
      },
    ],
  },
  {
    slug: 'choose-image-tool',
    primaryCategory: 'image',
    relatedCategories: ['image'],
    workflows: [
      {
        id: 'optimize',
        toolSlugs: ['image-compressor', 'svg-optimizer', 'image-to-webp'],
      },
      {
        id: 'convert-export',
        toolSlugs: ['image-converter', 'svg-to-image', 'image-to-base64'],
      },
      {
        id: 'resize-crop',
        toolSlugs: ['image-resizer', 'image-cropper', 'placeholder-image'],
      },
      {
        id: 'preview-validate',
        toolSlugs: ['favicon-generator', 'image-watermark', 'qr-generator'],
      },
    ],
  },
  {
    slug: 'meta-tags-vs-open-graph-vs-twitter-cards',
    primaryCategory: 'generators',
    relatedCategories: ['generators', 'development'],
    workflows: [
      {
        id: 'search-metadata',
        toolSlugs: ['meta-tag-generator', 'robots-txt-generator', 'sitemap-generator'],
      },
      {
        id: 'social-cards',
        toolSlugs: ['open-graph-generator', 'twitter-card-generator', 'meta-tag-generator'],
      },
      {
        id: 'preview-validate',
        toolSlugs: ['opengraph-preview', 'open-graph-generator', 'twitter-card-generator'],
      },
      {
        id: 'crawl-discovery',
        toolSlugs: ['sitemap-generator', 'robots-txt-generator', 'meta-tag-generator'],
      },
    ],
  },
  {
    slug: 'choose-jwt-tool',
    primaryCategory: 'security',
    relatedCategories: ['security', 'encoding'],
    workflows: [
      {
        id: 'format-inspect',
        toolSlugs: ['jwt-decoder', 'jwt-payload-decoder', 'jwt-debugger'],
      },
      {
        id: 'convert-export',
        toolSlugs: ['jwt-generator', 'hmac-generator', 'password-generator'],
      },
      {
        id: 'validate-query',
        toolSlugs: ['hash-generator', 'checksum-verifier', 'text-hash-comparator'],
      },
    ],
  },
  {
    slug: 'choose-chart-type',
    primaryCategory: 'charts',
    relatedCategories: ['charts'],
    workflows: [
      {
        id: 'compare-debug',
        toolSlugs: ['bar-chart-generator', 'line-chart-generator', 'area-chart-generator', 'waterfall-chart-generator'],
      },
      {
        id: 'format-inspect',
        toolSlugs: ['pie-chart-generator', 'doughnut-chart-generator', 'radar-chart-generator'],
      },
      {
        id: 'validate-query',
        toolSlugs: ['scatter-chart-generator', 'bubble-chart-generator', 'heatmap-chart-generator', 'boxplot-chart-generator'],
      },
      {
        id: 'convert-export',
        toolSlugs: ['sankey-chart-generator', 'treemap-chart-generator', 'gantt-chart-generator', 'timeline-chart-generator'],
      },
    ],
  },
  ...(phaseTwentyOneComparisonDefinitions as unknown as ComparisonSurfaceDefinition[]),
];

const COMPARISON_SURFACE_PRIORITY: ComparisonSurfaceSlug[] = [
  'choose-text-tool',
  'choose-jwt-tool',
  'choose-chart-type',
  'choose-json-tool',
  'choose-image-tool',
  'meta-tags-vs-open-graph-vs-twitter-cards',
];

const comparisonSurfacePriorityMap = new Map(
  COMPARISON_SURFACE_PRIORITY.map((slug, index) => [slug, index])
);

const orderedComparisonSurfaceDefinitions = [...comparisonSurfaceDefinitions].sort((left, right) => {
  const leftIndex = comparisonSurfacePriorityMap.get(left.slug) ?? Number.MAX_SAFE_INTEGER;
  const rightIndex = comparisonSurfacePriorityMap.get(right.slug) ?? Number.MAX_SAFE_INTEGER;
  return leftIndex - rightIndex;
});

const comparisonUiCopy: Record<Locale, ComparisonUiCopy> = {
  ar: {
    browseAllLabel: 'جميع أدلة المقارنة',
    comparisonLabel: 'دليل مقارنة',
    comparisonSectionDescription: 'اختر دليل المقارنة المناسب عندما تحتاج إلى فهم حدود الأدوات المتجاورة قبل فتح صفحة أداة واحدة.',
    comparisonSectionTitle: 'أدلة اختيار الأداة المناسبة',
    guideCtaLabel: 'افتح الدليل',
    includedToolsLabel: 'الأدوات المضمنة',
    relatedCategoriesLabel: 'الفئات المرتبطة',
    routeLabel: 'الانتقال',
    tableCategoryLabel: 'الفئة',
    tableTitle: 'جدول التوجيه السريع',
    tableToolLabel: 'الأداة',
    workflowTitle: 'مسارات القرار',
  },
  de: {
    browseAllLabel: 'Alle Vergleichsleitfaden',
    comparisonLabel: 'Vergleichsleitfaden',
    comparisonSectionDescription: 'Nutze diese Seiten, wenn du angrenzende Tools zuerst abgrenzen willst, statt direkt auf einer einzelnen Tool-Seite zu landen.',
    comparisonSectionTitle: 'Leitfaden zur Tool-Auswahl',
    guideCtaLabel: 'Leitfaden offnen',
    includedToolsLabel: 'Enthaltene Tools',
    relatedCategoriesLabel: 'Verwandte Kategorien',
    routeLabel: 'Zum Tool',
    tableCategoryLabel: 'Kategorie',
    tableTitle: 'Schnelle Zuordnung',
    tableToolLabel: 'Tool',
    workflowTitle: 'Entscheidungspfade',
  },
  en: {
    browseAllLabel: 'All comparison guides',
    comparisonLabel: 'Comparison guide',
    comparisonSectionDescription: 'Compare adjacent workflows before you open a tool: formatting vs validation, decoding vs generation, compression vs conversion, and more.',
    comparisonSectionTitle: 'Choose the right online tool',
    guideCtaLabel: 'Open guide',
    includedToolsLabel: 'Included tools',
    relatedCategoriesLabel: 'Related categories',
    routeLabel: 'Open tool',
    tableCategoryLabel: 'Category',
    tableTitle: 'Quick routing table',
    tableToolLabel: 'Tool',
    workflowTitle: 'Decision paths',
  },
  es: {
    browseAllLabel: 'Todas las guias comparativas',
    comparisonLabel: 'Guia comparativa',
    comparisonSectionDescription: 'Usa estas paginas cuando necesites diferenciar herramientas cercanas antes de abrir una pagina concreta.',
    comparisonSectionTitle: 'Elige la ruta correcta',
    guideCtaLabel: 'Abrir guia',
    includedToolsLabel: 'Herramientas incluidas',
    relatedCategoriesLabel: 'Categorias relacionadas',
    routeLabel: 'Abrir herramienta',
    tableCategoryLabel: 'Categoria',
    tableTitle: 'Tabla de decision rapida',
    tableToolLabel: 'Herramienta',
    workflowTitle: 'Rutas de decision',
  },
  fr: {
    browseAllLabel: 'Tous les guides comparatifs',
    comparisonLabel: 'Guide comparatif',
    comparisonSectionDescription: 'Utilisez ces pages pour distinguer des outils proches avant d ouvrir une page outil unique.',
    comparisonSectionTitle: 'Choisir le bon parcours outil',
    guideCtaLabel: 'Ouvrir le guide',
    includedToolsLabel: 'Outils inclus',
    relatedCategoriesLabel: 'Categories associees',
    routeLabel: 'Ouvrir l outil',
    tableCategoryLabel: 'Categorie',
    tableTitle: 'Table de routage rapide',
    tableToolLabel: 'Outil',
    workflowTitle: 'Parcours de decision',
  },
  ja: {
    browseAllLabel: 'すべての比較ガイド',
    comparisonLabel: '比較ガイド',
    comparisonSectionDescription: '単一のツールページを開く前に、近い役割のツールを整理したいときに使う比較ページです。',
    comparisonSectionTitle: '最適なツール導線を選ぶ',
    guideCtaLabel: 'ガイドを開く',
    includedToolsLabel: '掲載ツール',
    relatedCategoriesLabel: '関連カテゴリ',
    routeLabel: 'ツールへ',
    tableCategoryLabel: 'カテゴリ',
    tableTitle: 'クイック選択表',
    tableToolLabel: 'ツール',
    workflowTitle: '選択フロー',
  },
  ko: {
    browseAllLabel: '모든 비교 가이드',
    comparisonLabel: '비교 가이드',
    comparisonSectionDescription: '개별 도구 페이지로 바로 들어가기 전에, 서로 가까운 도구 흐름을 먼저 구분해야 할 때 사용하는 페이지입니다.',
    comparisonSectionTitle: '올바른 도구 경로 선택',
    guideCtaLabel: '가이드 열기',
    includedToolsLabel: '포함된 도구',
    relatedCategoriesLabel: '관련 카테고리',
    routeLabel: '도구 열기',
    tableCategoryLabel: '카테고리',
    tableTitle: '빠른 선택 표',
    tableToolLabel: '도구',
    workflowTitle: '선택 경로',
  },
  pt: {
    browseAllLabel: 'Todos os guias comparativos',
    comparisonLabel: 'Guia comparativo',
    comparisonSectionDescription: 'Use estas paginas quando precisar separar ferramentas proximas antes de abrir uma pagina especifica.',
    comparisonSectionTitle: 'Escolha o fluxo certo',
    guideCtaLabel: 'Abrir guia',
    includedToolsLabel: 'Ferramentas incluidas',
    relatedCategoriesLabel: 'Categorias relacionadas',
    routeLabel: 'Abrir ferramenta',
    tableCategoryLabel: 'Categoria',
    tableTitle: 'Tabela de roteamento rapido',
    tableToolLabel: 'Ferramenta',
    workflowTitle: 'Caminhos de decisao',
  },
  ru: {
    browseAllLabel: 'Все сравнительные руководства',
    comparisonLabel: 'Сравнительное руководство',
    comparisonSectionDescription: 'Используйте эти страницы, когда нужно сначала развести соседние сценарии инструментов, а уже потом открывать конкретный инструмент.',
    comparisonSectionTitle: 'Выберите правильный путь',
    guideCtaLabel: 'Открыть руководство',
    includedToolsLabel: 'Инструменты в руководстве',
    relatedCategoriesLabel: 'Связанные категории',
    routeLabel: 'Открыть инструмент',
    tableCategoryLabel: 'Категория',
    tableTitle: 'Быстрая таблица выбора',
    tableToolLabel: 'Инструмент',
    workflowTitle: 'Маршруты выбора',
  },
  zh: {
    browseAllLabel: '全部对比指南',
    comparisonLabel: '对比指南',
    comparisonSectionDescription: '当你需要先区分相邻工具的边界，再进入具体工具页时，优先使用这些比较页。',
    comparisonSectionTitle: '先选对工具路径',
    guideCtaLabel: '打开指南',
    includedToolsLabel: '包含工具',
    relatedCategoriesLabel: '相关分类',
    routeLabel: '打开工具',
    tableCategoryLabel: '分类',
    tableTitle: '快速选型表',
    tableToolLabel: '工具',
    workflowTitle: '决策路径',
  },
};

const comparisonSurfaceCopy: Record<Locale, Record<ExistingComparisonSurfaceSlug, ComparisonSurfaceCopy>> = {
  ar: {
    'choose-image-tool': {
      title: 'كيف تختار أداة الصور المناسبة',
      description: 'قارن بين أدوات ضغط الصور وتحويلها وتغيير حجمها ووضع العلامات المائية واختيار أفضل مسار قبل فتح أداة واحدة.',
      shortDescription: 'اختر بين الضغط والتحويل وتغيير الحجم ووضع العلامات المائية والرموز QR حسب مهمة الصورة.',
      aliases: ['أداة صور', 'ضغط الصور أم تحويلها'],
      workflows: {
        'compare-debug': 'مقارنة وتصحيح',
        'convert-export': 'تحويل وتصدير الصيغ',
        'crawl-discovery': 'إرشادات الاكتشاف',
        'format-inspect': 'تنسيق وفحص',
        optimize: 'ضغط وتحسين الملفات',
        'preview-validate': 'أصول العلامة والتسليم',
        'resize-crop': 'تغيير الحجم والقص',
        'search-metadata': 'وسوم البحث',
        'social-cards': 'بطاقات المشاركة',
        'validate-query': 'تحقق واستعلام',
      },
    },
    'choose-json-tool': {
      title: 'كيف تختار أداة JSON المناسبة',
      description: 'قارن بين أدوات JSON للتنسيق والفحص والتحقق و JSONPath والمقارنة والتحويل حتى تصل إلى الأداة الصحيحة بسرعة.',
      shortDescription: 'اختر بين تنسيق JSON والتحقق منه واستعلامه ومقارنته وتحويله.',
      aliases: ['أداة JSON', 'منسق JSON أم مدقق JSON'],
      workflows: {
        'compare-debug': 'مقارنة وتصحيح JSON',
        'convert-export': 'تحويل وتصدير JSON',
        'crawl-discovery': 'إرشادات الاكتشاف',
        'format-inspect': 'تنسيق وفحص JSON',
        optimize: 'ضغط وتحسين الملفات',
        'preview-validate': 'معاينة وتسليم',
        'resize-crop': 'تغيير الحجم والقص',
        'search-metadata': 'وسوم البحث',
        'social-cards': 'بطاقات المشاركة',
        'validate-query': 'تحقق واستعلام JSON',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Meta Tags أم Open Graph أم Twitter Cards',
      description: 'افهم متى تستخدم وسوم SEO الأساسية ومتى تولد Open Graph أو Twitter Cards وكيف تختبر المعاينات وملفات الاكتشاف.',
      shortDescription: 'اختر بين وسوم البحث وبطاقات المشاركة وأدوات المعاينة وملفات الزحف.',
      aliases: ['Open Graph أم Twitter Cards', 'Meta tags'],
      workflows: {
        'compare-debug': 'مقارنة وتصحيح',
        'convert-export': 'تحويل وتصدير',
        'crawl-discovery': 'ملفات الزحف والاكتشاف',
        'format-inspect': 'تنسيق وفحص',
        optimize: 'ضغط وتحسين',
        'preview-validate': 'معاينة والتحقق من الروابط',
        'resize-crop': 'تغيير الحجم والقص',
        'search-metadata': 'وسوم SEO الأساسية',
        'social-cards': 'بطاقات Open Graph و Twitter',
        'validate-query': 'تحقق واستعلام',
      },
    },
  },
  de: {
    'choose-image-tool': {
      title: 'Das richtige Bild-Tool auswahlen',
      description: 'Vergleiche Bildkomprimierung, Formatwechsel, Großenanpassung und Branding-Workflows, bevor du eine einzelne Bildseite offnest.',
      shortDescription: 'Wahle gezielt zwischen Komprimieren, Konvertieren, Großenanderung und Branding-Aufgaben.',
      aliases: ['Bild Tool auswahlen', 'Bild komprimieren oder konvertieren'],
      workflows: {
        'compare-debug': 'Vergleichen und debuggen',
        'convert-export': 'Formate konvertieren und exportieren',
        'crawl-discovery': 'Crawl- und Discovery-Dateien',
        'format-inspect': 'Formatieren und prufen',
        optimize: 'Dateien komprimieren und optimieren',
        'preview-validate': 'Branding und Auslieferung',
        'resize-crop': 'Große andern und zuschneiden',
        'search-metadata': 'SEO-Metadaten',
        'social-cards': 'Social Cards',
        'validate-query': 'Validieren und abfragen',
      },
    },
    'choose-json-tool': {
      title: 'Das richtige JSON-Tool auswahlen',
      description: 'Vergleiche JSON-Formatter, Viewer, Validator, JSONPath-, Diff- und Konvertierungs-Tools, um schneller zur richtigen Route zu kommen.',
      shortDescription: 'Wahle zwischen JSON formatieren, validieren, abfragen, vergleichen und exportieren.',
      aliases: ['JSON Tool auswahlen', 'JSON Formatter oder Validator'],
      workflows: {
        'compare-debug': 'JSON vergleichen und debuggen',
        'convert-export': 'JSON konvertieren und exportieren',
        'crawl-discovery': 'Crawl- und Discovery-Dateien',
        'format-inspect': 'JSON formatieren und prufen',
        optimize: 'Dateien optimieren',
        'preview-validate': 'Vorschau und Prufung',
        'resize-crop': 'Große andern und zuschneiden',
        'search-metadata': 'SEO-Metadaten',
        'social-cards': 'Social Cards',
        'validate-query': 'JSON validieren und abfragen',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Meta-Tags, Open Graph und Twitter Cards',
      description: 'Ordne Basis-Metadaten, Social-Preview-Tags, Vorschau-Tools und Crawl-Dateien richtig zu, bevor du einzelne SEO-Generatoren offnest.',
      shortDescription: 'Wahle zwischen SEO-Metadaten, Social Cards, Preview-Prufung und Discovery-Dateien.',
      aliases: ['Open Graph oder Twitter Cards', 'Meta Tags Vergleich'],
      workflows: {
        'compare-debug': 'Vergleichen und debuggen',
        'convert-export': 'Konvertieren und exportieren',
        'crawl-discovery': 'Crawl- und Discovery-Dateien',
        'format-inspect': 'Formatieren und prufen',
        optimize: 'Optimieren',
        'preview-validate': 'Link-Vorschau und Prufung',
        'resize-crop': 'Große andern und zuschneiden',
        'search-metadata': 'Zentrale SEO-Metadaten',
        'social-cards': 'Open Graph und Twitter Cards',
        'validate-query': 'Validieren und abfragen',
      },
    },
  },
  en: {
    'choose-image-tool': {
      title: 'Choose the Right Image Tool',
      description: 'Compare image compression, format conversion, resizing, cropping, watermarking, QR, and Base64 workflows before opening a single image tool page.',
      shortDescription: 'Decide between image compression, conversion, resizing, QR, Base64, and export workflows.',
      aliases: ['choose image tool', 'image converter vs compressor'],
      workflows: {
        'compare-debug': 'Compare and debug',
        'convert-export': 'Convert and export formats',
        'crawl-discovery': 'Crawl and discovery files',
        'format-inspect': 'Format and inspect',
        optimize: 'Compress and optimize files',
        'preview-validate': 'Branding and delivery assets',
        'resize-crop': 'Resize and crop assets',
        'search-metadata': 'Core SEO metadata',
        'social-cards': 'Social cards',
        'validate-query': 'Validate and query',
      },
    },
    'choose-json-tool': {
      title: 'Choose the Right JSON Tool',
      description: 'Compare JSON formatting, validation, JSONPath querying, diff, sorting, minifying, and CSV/YAML export workflows before choosing a tool.',
      shortDescription: 'Decide between JSON formatting, validation, querying, diff, cleanup, and export workflows.',
      aliases: ['choose json tool', 'json formatter vs validator'],
      workflows: {
        'compare-debug': 'Compare and debug JSON',
        'convert-export': 'Convert and export JSON',
        'crawl-discovery': 'Crawl and discovery files',
        'format-inspect': 'Format and inspect JSON',
        optimize: 'Compress and optimize files',
        'preview-validate': 'Preview and validate',
        'resize-crop': 'Resize and crop assets',
        'search-metadata': 'Core SEO metadata',
        'social-cards': 'Social cards',
        'validate-query': 'Validate and query JSON',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Meta Tags vs Open Graph vs Twitter Cards',
      description: 'Understand when to use core SEO meta tags, Open Graph tags, Twitter cards, preview tools, and crawl guidance files without mixing those jobs together.',
      shortDescription: 'Choose between search metadata, social sharing tags, preview tools, and discovery files.',
      aliases: ['meta tags vs open graph vs twitter cards', 'open graph vs twitter cards'],
      workflows: {
        'compare-debug': 'Compare and debug',
        'convert-export': 'Convert and export',
        'crawl-discovery': 'Crawl and discovery files',
        'format-inspect': 'Format and inspect',
        optimize: 'Optimize and compress',
        'preview-validate': 'Preview and validate links',
        'resize-crop': 'Resize and crop assets',
        'search-metadata': 'Core SEO metadata',
        'social-cards': 'Open Graph and Twitter cards',
        'validate-query': 'Validate and query',
      },
    },
  },
  es: {
    'choose-image-tool': {
      title: 'Como elegir la herramienta de imagen correcta',
      description: 'Compara compresion, conversion, redimensionado, recorte y marca de agua antes de entrar en una sola herramienta de imagen.',
      shortDescription: 'Elige entre optimizar, convertir, redimensionar y preparar activos visuales.',
      aliases: ['elegir herramienta de imagen', 'convertir o comprimir imagen'],
      workflows: {
        'compare-debug': 'Comparar y depurar',
        'convert-export': 'Convertir y exportar formatos',
        'crawl-discovery': 'Archivos de rastreo y descubrimiento',
        'format-inspect': 'Formatear e inspeccionar',
        optimize: 'Comprimir y optimizar archivos',
        'preview-validate': 'Branding y entrega',
        'resize-crop': 'Redimensionar y recortar',
        'search-metadata': 'Metadatos SEO',
        'social-cards': 'Tarjetas sociales',
        'validate-query': 'Validar y consultar',
      },
    },
    'choose-json-tool': {
      title: 'Como elegir la herramienta JSON correcta',
      description: 'Compara formateo, inspeccion, validacion, JSONPath, diferencias y exportacion para llegar antes a la ruta JSON adecuada.',
      shortDescription: 'Elige entre formatear, validar, consultar, comparar y exportar JSON.',
      aliases: ['elegir herramienta json', 'json formatter vs validator'],
      workflows: {
        'compare-debug': 'Comparar y depurar JSON',
        'convert-export': 'Convertir y exportar JSON',
        'crawl-discovery': 'Archivos de rastreo y descubrimiento',
        'format-inspect': 'Formatear e inspeccionar JSON',
        optimize: 'Optimizar archivos',
        'preview-validate': 'Vista previa y validacion',
        'resize-crop': 'Redimensionar y recortar',
        'search-metadata': 'Metadatos SEO',
        'social-cards': 'Tarjetas sociales',
        'validate-query': 'Validar y consultar JSON',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Metaetiquetas, Open Graph y Twitter Cards',
      description: 'Aclara cuando usar metadatos SEO basicos, etiquetas para redes sociales, herramientas de vista previa y archivos de descubrimiento sin mezclar tareas.',
      shortDescription: 'Elige entre metadatos de busqueda, tarjetas sociales, vistas previas y archivos de rastreo.',
      aliases: ['open graph vs twitter cards', 'meta tags seo'],
      workflows: {
        'compare-debug': 'Comparar y depurar',
        'convert-export': 'Convertir y exportar',
        'crawl-discovery': 'Archivos de rastreo y descubrimiento',
        'format-inspect': 'Formatear e inspeccionar',
        optimize: 'Optimizar',
        'preview-validate': 'Vista previa y validacion de enlaces',
        'resize-crop': 'Redimensionar y recortar',
        'search-metadata': 'Metadatos SEO principales',
        'social-cards': 'Open Graph y Twitter Cards',
        'validate-query': 'Validar y consultar',
      },
    },
  },
  fr: {
    'choose-image-tool': {
      title: 'Choisir le bon outil image',
      description: 'Comparez compression, conversion, redimensionnement, recadrage et marquage avant d ouvrir une page image unique.',
      shortDescription: 'Choisissez entre optimisation, conversion, redimensionnement et livraison d actifs image.',
      aliases: ['choisir outil image', 'compresser ou convertir image'],
      workflows: {
        'compare-debug': 'Comparer et deboguer',
        'convert-export': 'Convertir et exporter les formats',
        'crawl-discovery': 'Fichiers de crawl et de decouverte',
        'format-inspect': 'Formatter et inspecter',
        optimize: 'Compresser et optimiser les fichiers',
        'preview-validate': 'Branding et diffusion',
        'resize-crop': 'Redimensionner et recadrer',
        'search-metadata': 'Metadonnees SEO',
        'social-cards': 'Cartes sociales',
        'validate-query': 'Valider et interroger',
      },
    },
    'choose-json-tool': {
      title: 'Choisir le bon outil JSON',
      description: 'Comparez formatage, inspection, validation, JSONPath, diff et export pour atteindre plus vite la bonne page JSON.',
      shortDescription: 'Choisissez entre formatter, valider, interroger, comparer et exporter du JSON.',
      aliases: ['choisir outil json', 'json formatter vs validator'],
      workflows: {
        'compare-debug': 'Comparer et deboguer JSON',
        'convert-export': 'Convertir et exporter JSON',
        'crawl-discovery': 'Fichiers de crawl et de decouverte',
        'format-inspect': 'Formatter et inspecter JSON',
        optimize: 'Optimiser les fichiers',
        'preview-validate': 'Apercu et validation',
        'resize-crop': 'Redimensionner et recadrer',
        'search-metadata': 'Metadonnees SEO',
        'social-cards': 'Open Graph et Twitter Cards',
        'validate-query': 'Valider et interroger JSON',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Balises meta, Open Graph et Twitter Cards',
      description: 'Comprenez quand utiliser les metadonnees SEO, les balises sociales, les outils d apercu et les fichiers de decouverte sans melanger leurs roles.',
      shortDescription: 'Choisissez entre metadonnees de recherche, balises sociales, apercus et fichiers de decouverte.',
      aliases: ['open graph vs twitter cards', 'meta tags seo'],
      workflows: {
        'compare-debug': 'Comparer et deboguer',
        'convert-export': 'Convertir et exporter',
        'crawl-discovery': 'Fichiers de crawl et de decouverte',
        'format-inspect': 'Formatter et inspecter',
        optimize: 'Optimiser',
        'preview-validate': 'Apercu et validation des liens',
        'resize-crop': 'Redimensionner et recadrer',
        'search-metadata': 'Metadonnees SEO principales',
        'social-cards': 'Open Graph et Twitter Cards',
        'validate-query': 'Valider et interroger',
      },
    },
  },
  ja: {
    'choose-image-tool': {
      title: '画像ツールの選び方',
      description: '圧縮、変換、リサイズ、トリミング、透かし、書き出しの役割を比べてから適切な画像ツールへ進めます。',
      shortDescription: '画像最適化、変換、サイズ調整、公開用アセットの違いを整理します。',
      aliases: ['画像ツールの選び方', '画像圧縮と変換の違い'],
      workflows: {
        'compare-debug': '比較とデバッグ',
        'convert-export': '形式変換と書き出し',
        'crawl-discovery': 'クロールと発見用ファイル',
        'format-inspect': '整形と確認',
        optimize: '圧縮と最適化',
        'preview-validate': 'ブランド素材と配信用途',
        'resize-crop': 'リサイズとトリミング',
        'search-metadata': '検索向けメタデータ',
        'social-cards': 'ソーシャルカード',
        'validate-query': '検証とクエリ',
      },
    },
    'choose-json-tool': {
      title: 'JSONツールの選び方',
      description: '整形、確認、検証、JSONPath、差分比較、変換の役割をまとめて、最適な JSON ツールへ素早く案内します。',
      shortDescription: 'JSON の整形、検証、検索、比較、変換の違いを整理します。',
      aliases: ['JSONツールの選び方', 'JSON formatter vs validator'],
      workflows: {
        'compare-debug': 'JSON の比較とデバッグ',
        'convert-export': 'JSON の変換と書き出し',
        'crawl-discovery': 'クロールと発見用ファイル',
        'format-inspect': 'JSON の整形と確認',
        optimize: '最適化',
        'preview-validate': 'プレビューと検証',
        'resize-crop': 'リサイズとトリミング',
        'search-metadata': '検索向けメタデータ',
        'social-cards': 'Open Graph と Twitter Cards',
        'validate-query': 'JSON の検証とクエリ',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Meta Tags と Open Graph と Twitter Cards の違い',
      description: 'SEO メタデータ、SNS 用タグ、プレビュー確認、クロール向けファイルの役割を分けて理解できます。',
      shortDescription: '検索用メタデータ、共有カード、プレビュー、発見用ファイルを整理します。',
      aliases: ['Open Graph と Twitter Cards の違い', 'meta tags'],
      workflows: {
        'compare-debug': '比較とデバッグ',
        'convert-export': '変換と書き出し',
        'crawl-discovery': 'クロールと発見用ファイル',
        'format-inspect': '整形と確認',
        optimize: '最適化',
        'preview-validate': 'リンクプレビューの確認',
        'resize-crop': 'リサイズとトリミング',
        'search-metadata': '基本 SEO メタデータ',
        'social-cards': 'Open Graph と Twitter Cards',
        'validate-query': '検証とクエリ',
      },
    },
  },
  ko: {
    'choose-image-tool': {
      title: '올바른 이미지 도구 선택하기',
      description: '압축, 변환, 리사이즈, 자르기, 워터마크, 내보내기 흐름을 비교한 뒤 적절한 이미지 도구로 이동합니다.',
      shortDescription: '이미지 최적화, 변환, 크기 조정, 배포용 자산 작업을 구분합니다.',
      aliases: ['이미지 도구 선택', '이미지 압축과 변환 비교'],
      workflows: {
        'compare-debug': '비교 및 디버깅',
        'convert-export': '형식 변환과 내보내기',
        'crawl-discovery': '크롤링 및 발견 파일',
        'format-inspect': '정리 및 확인',
        optimize: '압축 및 최적화',
        'preview-validate': '브랜딩 및 배포 자산',
        'resize-crop': '리사이즈 및 자르기',
        'search-metadata': '검색 메타데이터',
        'social-cards': '소셜 카드',
        'validate-query': '검증 및 조회',
      },
    },
    'choose-json-tool': {
      title: '올바른 JSON 도구 선택하기',
      description: '포맷팅, 확인, 검증, JSONPath, 차이 비교, 변환 흐름을 나눠서 가장 맞는 JSON 도구로 빠르게 이동합니다.',
      shortDescription: 'JSON 포맷팅, 검증, 조회, 비교, 변환 작업을 구분합니다.',
      aliases: ['JSON 도구 선택', 'json formatter vs validator'],
      workflows: {
        'compare-debug': 'JSON 비교 및 디버깅',
        'convert-export': 'JSON 변환 및 내보내기',
        'crawl-discovery': '크롤링 및 발견 파일',
        'format-inspect': 'JSON 정리 및 확인',
        optimize: '최적화',
        'preview-validate': '미리보기 및 검증',
        'resize-crop': '리사이즈 및 자르기',
        'search-metadata': '검색 메타데이터',
        'social-cards': 'Open Graph 및 Twitter Cards',
        'validate-query': 'JSON 검증 및 조회',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Meta Tags vs Open Graph vs Twitter Cards',
      description: '기본 SEO 메타 태그, 소셜 공유 태그, 미리보기 도구, 크롤링 파일의 역할을 섞지 않고 구분합니다.',
      shortDescription: '검색 메타데이터, 소셜 카드, 미리보기, 발견 파일을 나눠 봅니다.',
      aliases: ['open graph vs twitter cards', 'meta tags'],
      workflows: {
        'compare-debug': '비교 및 디버깅',
        'convert-export': '변환 및 내보내기',
        'crawl-discovery': '크롤링 및 발견 파일',
        'format-inspect': '정리 및 확인',
        optimize: '최적화',
        'preview-validate': '링크 미리보기 확인',
        'resize-crop': '리사이즈 및 자르기',
        'search-metadata': '핵심 SEO 메타데이터',
        'social-cards': 'Open Graph 및 Twitter Cards',
        'validate-query': '검증 및 조회',
      },
    },
  },
  pt: {
    'choose-image-tool': {
      title: 'Como escolher a ferramenta de imagem certa',
      description: 'Compare compressao, conversao, redimensionamento, corte, marca d agua e exportacao antes de abrir uma unica ferramenta de imagem.',
      shortDescription: 'Escolha entre otimizar, converter, redimensionar e preparar ativos visuais.',
      aliases: ['escolher ferramenta de imagem', 'comprimir ou converter imagem'],
      workflows: {
        'compare-debug': 'Comparar e depurar',
        'convert-export': 'Converter e exportar formatos',
        'crawl-discovery': 'Arquivos de rastreamento e descoberta',
        'format-inspect': 'Formatar e inspecionar',
        optimize: 'Comprimir e otimizar arquivos',
        'preview-validate': 'Branding e entrega',
        'resize-crop': 'Redimensionar e cortar',
        'search-metadata': 'Metadados de SEO',
        'social-cards': 'Cartoes sociais',
        'validate-query': 'Validar e consultar',
      },
    },
    'choose-json-tool': {
      title: 'Como escolher a ferramenta JSON certa',
      description: 'Compare formatacao, inspecao, validacao, JSONPath, diff e exportacao para chegar mais rapido a rota JSON correta.',
      shortDescription: 'Escolha entre formatar, validar, consultar, comparar e exportar JSON.',
      aliases: ['escolher ferramenta json', 'json formatter vs validator'],
      workflows: {
        'compare-debug': 'Comparar e depurar JSON',
        'convert-export': 'Converter e exportar JSON',
        'crawl-discovery': 'Arquivos de rastreamento e descoberta',
        'format-inspect': 'Formatar e inspecionar JSON',
        optimize: 'Otimizar arquivos',
        'preview-validate': 'Previa e validacao',
        'resize-crop': 'Redimensionar e cortar',
        'search-metadata': 'Metadados de SEO',
        'social-cards': 'Open Graph e Twitter Cards',
        'validate-query': 'Validar e consultar JSON',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Meta tags, Open Graph e Twitter Cards',
      description: 'Entenda quando usar metadados basicos de SEO, tags sociais, ferramentas de previa e arquivos de descoberta sem misturar as funcoes.',
      shortDescription: 'Escolha entre metadados de busca, cartoes sociais, previas e arquivos de descoberta.',
      aliases: ['open graph vs twitter cards', 'meta tags'],
      workflows: {
        'compare-debug': 'Comparar e depurar',
        'convert-export': 'Converter e exportar',
        'crawl-discovery': 'Arquivos de rastreamento e descoberta',
        'format-inspect': 'Formatar e inspecionar',
        optimize: 'Otimizar',
        'preview-validate': 'Previa e validacao de links',
        'resize-crop': 'Redimensionar e cortar',
        'search-metadata': 'Metadados principais de SEO',
        'social-cards': 'Open Graph e Twitter Cards',
        'validate-query': 'Validar e consultar',
      },
    },
  },
  ru: {
    'choose-image-tool': {
      title: 'Как выбрать нужный инструмент для изображений',
      description: 'Сравните сжатие, конвертацию, изменение размера, кадрирование, водяные знаки и экспорт, прежде чем открывать отдельную страницу инструмента.',
      shortDescription: 'Разведите задачи оптимизации, конвертации, изменения размера и брендирования изображений.',
      aliases: ['выбрать инструмент для изображений', 'сжать или конвертировать изображение'],
      workflows: {
        'compare-debug': 'Сравнение и отладка',
        'convert-export': 'Конвертация и экспорт форматов',
        'crawl-discovery': 'Файлы для обхода и обнаружения',
        'format-inspect': 'Форматирование и проверка',
        optimize: 'Сжатие и оптимизация файлов',
        'preview-validate': 'Брендинг и выдача',
        'resize-crop': 'Изменение размера и кадрирование',
        'search-metadata': 'SEO-метаданные',
        'social-cards': 'Социальные карточки',
        'validate-query': 'Валидация и запрос',
      },
    },
    'choose-json-tool': {
      title: 'Как выбрать нужный JSON-инструмент',
      description: 'Сравните форматирование, просмотр, валидацию, JSONPath, diff и экспорт, чтобы быстрее попасть на правильную JSON-страницу.',
      shortDescription: 'Разведите задачи форматирования, валидации, запросов, сравнения и экспорта JSON.',
      aliases: ['выбрать json инструмент', 'json formatter vs validator'],
      workflows: {
        'compare-debug': 'Сравнение и отладка JSON',
        'convert-export': 'Конвертация и экспорт JSON',
        'crawl-discovery': 'Файлы для обхода и обнаружения',
        'format-inspect': 'Форматирование и просмотр JSON',
        optimize: 'Оптимизация',
        'preview-validate': 'Предпросмотр и проверка',
        'resize-crop': 'Изменение размера и кадрирование',
        'search-metadata': 'SEO-метаданные',
        'social-cards': 'Open Graph и Twitter Cards',
        'validate-query': 'Валидация и запрос JSON',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Meta Tags vs Open Graph vs Twitter Cards',
      description: 'Разделите базовые SEO-метатеги, социальные теги, инструменты предпросмотра и файлы обнаружения, не смешивая их роли.',
      shortDescription: 'Выберите между поисковыми метаданными, социальными карточками, предпросмотром и файлами обнаружения.',
      aliases: ['open graph vs twitter cards', 'meta tags'],
      workflows: {
        'compare-debug': 'Сравнение и отладка',
        'convert-export': 'Конвертация и экспорт',
        'crawl-discovery': 'Файлы для обхода и обнаружения',
        'format-inspect': 'Форматирование и проверка',
        optimize: 'Оптимизация',
        'preview-validate': 'Предпросмотр и проверка ссылок',
        'resize-crop': 'Изменение размера и кадрирование',
        'search-metadata': 'Базовые SEO-метаданные',
        'social-cards': 'Open Graph и Twitter Cards',
        'validate-query': 'Валидация и запрос',
      },
    },
  },
  zh: {
    'choose-image-tool': {
      title: '如何选择合适的图片工具',
      description: '先比较图片压缩、格式转换、尺寸调整、裁剪、水印和导出场景，再进入具体图片工具页。',
      shortDescription: '区分图片优化、格式转换、尺寸处理和交付素材场景。',
      aliases: ['图片工具怎么选', '图片压缩还是转换'],
      workflows: {
        'compare-debug': '比较与排查',
        'convert-export': '格式转换与导出',
        'crawl-discovery': '抓取与发现文件',
        'format-inspect': '格式整理与查看',
        optimize: '压缩与优化文件',
        'preview-validate': '品牌与交付素材',
        'resize-crop': '调整尺寸与裁剪',
        'search-metadata': '搜索元数据',
        'social-cards': '社交分享卡片',
        'validate-query': '校验与查询',
      },
    },
    'choose-json-tool': {
      title: '如何选择合适的 JSON 工具',
      description: '比较 JSON 格式化、查看、校验、JSONPath、差异对比和导出转换场景，帮助用户和 AI 更快找到正确页面。',
      shortDescription: '区分 JSON 格式化、校验、查询、对比和导出转换任务。',
      aliases: ['JSON 工具怎么选', 'JSON 格式化还是校验'],
      workflows: {
        'compare-debug': 'JSON 对比与排查',
        'convert-export': 'JSON 转换与导出',
        'crawl-discovery': '抓取与发现文件',
        'format-inspect': 'JSON 格式化与查看',
        optimize: '优化文件',
        'preview-validate': '预览与校验',
        'resize-crop': '调整尺寸与裁剪',
        'search-metadata': '搜索元数据',
        'social-cards': '社交分享卡片',
        'validate-query': 'JSON 校验与查询',
      },
    },
    'meta-tags-vs-open-graph-vs-twitter-cards': {
      title: 'Meta Tags、Open Graph 和 Twitter Cards 怎么区分',
      description: '梳理基础 SEO 元标签、社交分享标签、预览工具和抓取发现文件各自负责什么，避免把不同任务混在一起。',
      shortDescription: '区分搜索元数据、社交卡片、链接预览和发现文件。',
      aliases: ['Open Graph 和 Twitter Cards 区别', 'meta tags'],
      workflows: {
        'compare-debug': '比较与排查',
        'convert-export': '转换与导出',
        'crawl-discovery': '抓取与发现文件',
        'format-inspect': '整理与查看',
        optimize: '优化',
        'preview-validate': '链接预览与校验',
        'resize-crop': '调整尺寸与裁剪',
        'search-metadata': '核心 SEO 元数据',
        'social-cards': 'Open Graph 与 Twitter Cards',
        'validate-query': '校验与查询',
      },
    },
  },
};

const comparisonWorkflowDefaults: Record<Locale, Record<WorkflowId, string>> = {
  ar: comparisonSurfaceCopy.ar['choose-image-tool'].workflows,
  de: comparisonSurfaceCopy.de['choose-image-tool'].workflows,
  en: comparisonSurfaceCopy.en['choose-image-tool'].workflows,
  es: comparisonSurfaceCopy.es['choose-image-tool'].workflows,
  fr: comparisonSurfaceCopy.fr['choose-image-tool'].workflows,
  ja: comparisonSurfaceCopy.ja['choose-image-tool'].workflows,
  ko: comparisonSurfaceCopy.ko['choose-image-tool'].workflows,
  pt: comparisonSurfaceCopy.pt['choose-image-tool'].workflows,
  ru: comparisonSurfaceCopy.ru['choose-image-tool'].workflows,
  zh: comparisonSurfaceCopy.zh['choose-image-tool'].workflows,
};

const phaseElevenComparisonCopy: Record<Locale, Record<PhaseElevenComparisonSurfaceSlug, ComparisonSurfaceCopy>> = {
  ar: {
    'choose-chart-type': {
      title: 'كيف تختار نوع المخطط المناسب',
      description: 'قارن بين مولدات المخططات حسب شكل البيانات حتى تختار بين الاتجاهات والنسب والعلاقات والتدفقات والجداول الزمنية قبل فتح أداة واحدة.',
      shortDescription: 'اختر بين مخططات الاتجاهات والنسب والعلاقات والتدفق والجداول الزمنية.',
      aliases: ['اختيار نوع المخطط', 'مخطط أعمدة أم خطي أم دائري'],
      workflows: {
        ...comparisonWorkflowDefaults.ar,
        'compare-debug': 'مخططات الاتجاهات والمقارنة',
        'convert-export': 'مخططات التدفق والهيكل والجداول الزمنية',
        'format-inspect': 'مخططات النسب والحصص',
        'validate-query': 'مخططات التوزيع والعلاقات',
      },
    },
    'choose-jwt-tool': {
      title: 'كيف تختار أداة JWT المناسبة',
      description: 'افصل بين فك JWT وفحص الحمولة وتصحيح التوكنات وتوليدها والتحقق من التوقيع حتى تصل إلى أداة المصادقة المناسبة أسرع.',
      shortDescription: 'اختر بين فك JWT وفحص الحمولة وتوليد التوكنات والتحقق من التوقيع.',
      aliases: ['أداة JWT', 'JWT decoder أم debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.ar,
        'compare-debug': 'فحص الرؤوس والحمولات وأخطاء التوكن',
        'convert-export': 'توليد التوكنات ومدخلات التوقيع',
        'format-inspect': 'فك JWT وبنية التوكن',
        'validate-query': 'التحقق من التوقيعات ومقارنة المخرجات',
      },
    },
  },
  de: {
    'choose-chart-type': {
      title: 'Den richtigen Diagrammtyp auswahlen',
      description: 'Vergleiche Chart-Generatoren nach Datenform, damit Nutzer vor dem Offnen eines einzelnen Tools zwischen Trends, Anteilen, Korrelationen, Flussen und Zeitplanen unterscheiden konnen.',
      shortDescription: 'Wahle zwischen Trend-, Anteil-, Korrelations-, Fluss- und Zeitplan-Diagrammen.',
      aliases: ['Diagrammtyp auswahlen', 'Balken oder Linie oder Pie Chart'],
      workflows: {
        ...comparisonWorkflowDefaults.de,
        'compare-debug': 'Trend- und Vergleichsdiagramme',
        'convert-export': 'Fluss-, Hierarchie- und Zeitplan-Diagramme',
        'format-inspect': 'Anteil- und Strukturdiagramme',
        'validate-query': 'Verteilungs- und Korrelationsdiagramme',
      },
    },
    'choose-jwt-tool': {
      title: 'Das richtige JWT-Tool auswahlen',
      description: 'Trenne JWT-Decoding, Payload-Inspektion, Token-Debugging, Token-Erzeugung und Signaturprufung, damit Nutzer schneller auf der richtigen Auth-Seite landen.',
      shortDescription: 'Wahle zwischen JWT-Decoding, Payload-Inspektion, Token-Erzeugung und Signaturprufung.',
      aliases: ['JWT Tool auswahlen', 'JWT Decoder oder Debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.de,
        'compare-debug': 'Header, Payload und Token-Fehler prufen',
        'convert-export': 'Tokens und Signatur-Eingaben erzeugen',
        'format-inspect': 'JWT decodieren und Struktur ansehen',
        'validate-query': 'Signaturen validieren und Ausgaben vergleichen',
      },
    },
  },
  en: {
    'choose-chart-type': {
      title: 'Choose the Right Chart Type',
      description: 'Compare chart generators by data shape so users can pick the right view for trends, composition, correlations, flows, hierarchies, and project timelines before opening a single chart tool.',
      shortDescription: 'Choose between trend charts, composition charts, correlation plots, and planning views.',
      aliases: ['choose chart type', 'bar vs line vs pie chart'],
      workflows: {
        ...comparisonWorkflowDefaults.en,
        'compare-debug': 'Trend and comparison charts',
        'convert-export': 'Flow, hierarchy, and timeline charts',
        'format-inspect': 'Composition and share charts',
        'validate-query': 'Distribution and correlation charts',
      },
    },
    'choose-jwt-tool': {
      title: 'Choose the Right JWT Tool',
      description: 'Separate JWT decoding, payload inspection, token debugging, token generation, HMAC creation, and checksum comparison before choosing an auth tool.',
      shortDescription: 'Choose between JWT decoding, payload inspection, token generation, HMAC, and checksum workflows.',
      aliases: ['choose jwt tool', 'jwt decoder vs debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.en,
        'compare-debug': 'Inspect headers, payloads, and token errors',
        'convert-export': 'Generate tokens and signing inputs',
        'format-inspect': 'Decode and inspect JWT structure',
        'validate-query': 'Compare hashes and checksum outputs',
      },
    },
  },
  es: {
    'choose-chart-type': {
      title: 'Como elegir el tipo de grafico correcto',
      description: 'Compara generadores de graficos segun la forma de los datos para separar tendencias, proporciones, correlaciones, flujos y cronogramas antes de abrir una sola herramienta.',
      shortDescription: 'Elige entre graficos de tendencia, composicion, correlacion y planificacion.',
      aliases: ['elegir tipo de grafico', 'grafico de barras o lineas o pastel'],
      workflows: {
        ...comparisonWorkflowDefaults.es,
        'compare-debug': 'Graficos de tendencia y comparacion',
        'convert-export': 'Graficos de flujo, jerarquia y cronograma',
        'format-inspect': 'Graficos de composicion y reparto',
        'validate-query': 'Graficos de distribucion y correlacion',
      },
    },
    'choose-jwt-tool': {
      title: 'Como elegir la herramienta JWT correcta',
      description: 'Separa decodificacion JWT, inspeccion del payload, depuracion de tokens, generacion de tokens y verificacion de firmas para llegar antes a la herramienta de autenticacion adecuada.',
      shortDescription: 'Elige entre decodificar JWT, revisar payloads, generar tokens y validar firmas.',
      aliases: ['elegir herramienta jwt', 'jwt decoder vs debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.es,
        'compare-debug': 'Inspeccionar headers, payloads y errores del token',
        'convert-export': 'Generar tokens y entradas de firma',
        'format-inspect': 'Decodificar JWT y revisar su estructura',
        'validate-query': 'Verificar firmas y comparar salidas',
      },
    },
  },
  fr: {
    'choose-chart-type': {
      title: 'Choisir le bon type de graphique',
      description: 'Comparez les generateurs de graphiques par forme de donnees afin de separer tendances, parts, correlations, flux, hierarchies et plannings avant d ouvrir un outil unique.',
      shortDescription: 'Choisissez entre graphiques de tendance, de composition, de correlation et de planification.',
      aliases: ['choisir type de graphique', 'barres ou lignes ou camembert'],
      workflows: {
        ...comparisonWorkflowDefaults.fr,
        'compare-debug': 'Graphiques de tendance et de comparaison',
        'convert-export': 'Graphiques de flux, de hierarchie et de planning',
        'format-inspect': 'Graphiques de composition et de repartition',
        'validate-query': 'Graphiques de distribution et de correlation',
      },
    },
    'choose-jwt-tool': {
      title: 'Choisir le bon outil JWT',
      description: 'Separez decodage JWT, inspection du payload, debuggage du token, generation du token et verification de signature pour atteindre plus vite le bon outil d authentification.',
      shortDescription: 'Choisissez entre decodage JWT, inspection du payload, generation du token et verification de signature.',
      aliases: ['choisir outil jwt', 'jwt decoder vs debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.fr,
        'compare-debug': 'Inspecter headers, payloads et erreurs du token',
        'convert-export': 'Generer des tokens et des entrees de signature',
        'format-inspect': 'Decoder JWT et revoir la structure',
        'validate-query': 'Verifier les signatures et comparer les sorties',
      },
    },
  },
  ja: {
    'choose-chart-type': {
      title: '適切なチャートタイプの選び方',
      description: 'データの形でチャート生成ツールを比較し、単一のツールを開く前にトレンド、構成比、相関、フロー、階層、プロジェクト計画を切り分けます。',
      shortDescription: 'トレンド用、構成比用、相関用、計画用のチャートを選び分けます。',
      aliases: ['チャートタイプの選び方', '棒グラフか折れ線か円グラフか'],
      workflows: {
        ...comparisonWorkflowDefaults.ja,
        'compare-debug': '推移と比較のチャート',
        'convert-export': 'フロー、階層、タイムラインのチャート',
        'format-inspect': '構成比とシェアのチャート',
        'validate-query': '分布と相関のチャート',
      },
    },
    'choose-jwt-tool': {
      title: 'JWT ツールの選び方',
      description: 'JWT のデコード、ペイロード確認、トークンデバッグ、トークン生成、署名確認を分けて、適切な認証ツールへ素早く進めます。',
      shortDescription: 'JWT のデコード、ペイロード確認、トークン生成、署名確認を選び分けます。',
      aliases: ['JWT ツールの選び方', 'JWT decoder と debugger の違い'],
      workflows: {
        ...comparisonWorkflowDefaults.ja,
        'compare-debug': 'ヘッダー、ペイロード、トークンエラーを調べる',
        'convert-export': 'トークンと署名入力を生成する',
        'format-inspect': 'JWT をデコードして構造を見る',
        'validate-query': '署名を検証して出力を比較する',
      },
    },
  },
  ko: {
    'choose-chart-type': {
      title: '올바른 차트 유형 선택하기',
      description: '데이터 형태를 기준으로 차트 생성 도구를 비교해 하나의 차트 도구를 열기 전에 추세, 구성비, 상관관계, 흐름, 계층, 프로젝트 일정 의도를 나눕니다.',
      shortDescription: '추세, 구성비, 상관관계, 계획용 차트를 구분해 선택합니다.',
      aliases: ['차트 유형 선택', '막대 차트 vs 선 차트 vs 원형 차트'],
      workflows: {
        ...comparisonWorkflowDefaults.ko,
        'compare-debug': '추세와 비교 차트',
        'convert-export': '흐름, 계층, 타임라인 차트',
        'format-inspect': '구성비와 점유율 차트',
        'validate-query': '분포와 상관관계 차트',
      },
    },
    'choose-jwt-tool': {
      title: '올바른 JWT 도구 선택하기',
      description: 'JWT 디코딩, 페이로드 확인, 토큰 디버깅, 토큰 생성, 서명 검증을 분리해 올바른 인증 도구로 더 빨리 이동합니다.',
      shortDescription: 'JWT 디코딩, 페이로드 확인, 토큰 생성, 서명 검증 작업을 구분합니다.',
      aliases: ['JWT 도구 선택', 'JWT decoder vs debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.ko,
        'compare-debug': '헤더, 페이로드, 토큰 오류 점검',
        'convert-export': '토큰과 서명 입력 생성',
        'format-inspect': 'JWT 구조 디코딩과 확인',
        'validate-query': '서명 검증과 결과 비교',
      },
    },
  },
  pt: {
    'choose-chart-type': {
      title: 'Como escolher o tipo de grafico certo',
      description: 'Compare geradores de graficos pela forma dos dados para separar tendencias, composicao, correlacoes, fluxos, hierarquias e cronogramas antes de abrir uma unica ferramenta.',
      shortDescription: 'Escolha entre graficos de tendencia, composicao, correlacao e planejamento.',
      aliases: ['escolher tipo de grafico', 'barra ou linha ou pizza'],
      workflows: {
        ...comparisonWorkflowDefaults.pt,
        'compare-debug': 'Graficos de tendencia e comparacao',
        'convert-export': 'Graficos de fluxo, hierarquia e cronograma',
        'format-inspect': 'Graficos de composicao e participacao',
        'validate-query': 'Graficos de distribuicao e correlacao',
      },
    },
    'choose-jwt-tool': {
      title: 'Como escolher a ferramenta JWT certa',
      description: 'Separe decodificacao JWT, inspecao do payload, depuracao de tokens, geracao de tokens e verificacao de assinatura para chegar mais rapido a ferramenta de autenticacao correta.',
      shortDescription: 'Escolha entre decodificar JWT, inspecionar payloads, gerar tokens e validar assinaturas.',
      aliases: ['escolher ferramenta jwt', 'jwt decoder vs debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.pt,
        'compare-debug': 'Inspecionar headers, payloads e erros do token',
        'convert-export': 'Gerar tokens e entradas de assinatura',
        'format-inspect': 'Decodificar JWT e revisar a estrutura',
        'validate-query': 'Validar assinaturas e comparar saidas',
      },
    },
  },
  ru: {
    'choose-chart-type': {
      title: 'Как выбрать нужный тип графика',
      description: 'Сравните генераторы графиков по форме данных, чтобы разделить тренды, доли, корреляции, потоки, иерархии и проектные таймлайны до открытия одного инструмента.',
      shortDescription: 'Выберите между графиками для трендов, структуры, корреляции и планирования.',
      aliases: ['выбрать тип графика', 'столбчатая или линейная или круговая'],
      workflows: {
        ...comparisonWorkflowDefaults.ru,
        'compare-debug': 'Графики трендов и сравнений',
        'convert-export': 'Графики потоков, иерархий и таймлайнов',
        'format-inspect': 'Графики структуры и долей',
        'validate-query': 'Графики распределения и корреляции',
      },
    },
    'choose-jwt-tool': {
      title: 'Как выбрать нужный JWT-инструмент',
      description: 'Разделите декодирование JWT, просмотр payload, отладку токена, генерацию токена и проверку подписи, чтобы быстрее попасть на нужный инструмент аутентификации.',
      shortDescription: 'Выберите между декодированием JWT, просмотром payload, генерацией токенов и проверкой подписи.',
      aliases: ['выбрать jwt инструмент', 'jwt decoder vs debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.ru,
        'compare-debug': 'Проверка headers, payload и ошибок токена',
        'convert-export': 'Генерация токенов и входов для подписи',
        'format-inspect': 'Декодирование JWT и просмотр структуры',
        'validate-query': 'Проверка подписей и сравнение результатов',
      },
    },
  },
  zh: {
    'choose-chart-type': {
      title: '如何选择合适的图表类型',
      description: '按数据形态比较图表生成工具，在打开单个图表工具前先区分趋势、占比、相关性、流程、层级和项目排期场景。',
      shortDescription: '区分趋势图、占比图、相关图和规划图。',
      aliases: ['图表类型怎么选', '柱状图还是折线图还是饼图'],
      workflows: {
        ...comparisonWorkflowDefaults.zh,
        'compare-debug': '趋势与对比图表',
        'convert-export': '流程、层级与时间线图表',
        'format-inspect': '构成与占比图表',
        'validate-query': '分布与相关性图表',
      },
    },
    'choose-jwt-tool': {
      title: '如何选择合适的 JWT 工具',
      description: '把 JWT 解码、payload 查看、Token 调试、Token 生成和签名校验拆开，帮助用户更快进入正确的认证工具页面。',
      shortDescription: '区分 JWT 解码、payload 查看、Token 生成和签名校验任务。',
      aliases: ['JWT 工具怎么选', 'JWT decoder 还是 debugger'],
      workflows: {
        ...comparisonWorkflowDefaults.zh,
        'compare-debug': '检查头部、载荷与 Token 错误',
        'convert-export': '生成 Token 与签名输入',
        'format-inspect': '解码 JWT 并查看结构',
        'validate-query': '校验签名并比较输出',
      },
    },
  },
};

function getComparisonCopy(locale: Locale, slug: ComparisonSurfaceSlug): ComparisonSurfaceCopy {
  return (
    (phaseTwentyOneComparisonCopy as Record<
      Locale,
      Record<PhaseTwentyOneComparisonSurfaceSlug, ComparisonSurfaceCopy>
    >)[locale]?.[slug as PhaseTwentyOneComparisonSurfaceSlug] ??
    phaseElevenComparisonCopy[locale][slug as PhaseElevenComparisonSurfaceSlug] ??
    comparisonSurfaceCopy[locale][slug as ExistingComparisonSurfaceSlug]
  );
}

function uniqueToolSlugs(definition: ComparisonSurfaceDefinition): string[] {
  return Array.from(new Set(definition.workflows.flatMap((workflow) => workflow.toolSlugs)));
}

function getToolName(toolNames: Record<string, string>, slug: string): string {
  return toolNames[slug] || slug;
}

function getToolDescription(toolDescriptions: Record<string, string>, slug: string): string {
  return toolDescriptions[slug] || '';
}

function buildSurfaceTools(
  locale: Locale,
  definition: ComparisonSurfaceDefinition,
  copy: ComparisonSurfaceCopy,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ComparisonSurfaceGuide['workflows'] {
  return definition.workflows.map((workflow) => ({
    slug: workflow.id,
    title: copy.workflows[workflow.id],
    tools: filterIndexableTools(
      locale,
      workflow.toolSlugs
        .map((slug) => {
          const tool = toolBySlug.get(slug);
          if (!tool) {
            return null;
          }

          return {
            slug,
            name: getToolName(toolNames, slug),
            description: getToolDescription(toolDescriptions, slug),
            href: getLocalizedPath(locale, `/tools/${slug}`),
            category: tool.category,
            categoryName: categoryNames[tool.category] || tool.category,
            workflowTitle: copy.workflows[workflow.id],
          } satisfies ComparisonSurfaceTool;
        })
        .filter((tool): tool is ComparisonSurfaceTool => Boolean(tool)),
    ),
  }));
}

export function getComparisonUiCopy(locale: Locale): ComparisonUiCopy {
  return comparisonUiCopy[locale];
}

export function buildComparisonGuides(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ComparisonSurfaceGuide[] {
  return orderedComparisonSurfaceDefinitions.map((definition) => {
    const copy = getComparisonCopy(locale, definition.slug);
    const workflows = buildSurfaceTools(
      locale,
      definition,
      copy,
      categoryNames,
      toolNames,
      toolDescriptions
    );
    const representativeTools = uniqueToolSlugs(definition)
      .slice(0, 4)
      .map((slug) => workflows.flatMap((workflow) => workflow.tools).find((tool) => tool.slug === slug))
      .filter((tool): tool is ComparisonSurfaceTool => Boolean(tool));

    return {
      slug: definition.slug,
      href: getLocalizedPath(locale, `/compare/${definition.slug}`),
      title: copy.title,
      description: copy.description,
      shortDescription: copy.shortDescription,
      representativeTools,
      workflows,
      relatedCategories: definition.relatedCategories.map((category) => ({
        slug: category,
        name: categoryNames[category] || category,
        href: getLocalizedPath(locale, `/categories/${category}`),
      })),
    };
  });
}

export function getComparisonGuide(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ComparisonSurfaceGuide | null {
  const guide = buildComparisonGuides(locale, categoryNames, toolNames, toolDescriptions).find(
    (item) => item.slug === slug
  );

  return guide ?? null;
}

export function findComparisonGuideForTool(
  locale: Locale,
  toolSlug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ComparisonSurfaceGuide | null {
  return (
    buildComparisonGuides(locale, categoryNames, toolNames, toolDescriptions).find((guide) =>
      guide.workflows.some((workflow) =>
        workflow.tools.some((tool) => tool.slug === toolSlug)
      )
    ) ?? null
  );
}

export function buildComparisonGuidesItemList(
  baseUrl: string,
  guides: ComparisonSurfaceGuide[]
): Record<string, unknown> {
  return {
    name: 'U2Tool comparison guides',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}${guide.href}`,
      item: {
        '@type': 'CollectionPage',
        name: guide.title,
        description: guide.shortDescription,
        url: `${baseUrl}${guide.href}`,
      },
    })),
  };
}

export function buildComparisonDiscoveryIndex(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): DiscoveryCandidate[] {
  const uiCopy = getComparisonUiCopy(locale);

  return buildComparisonGuides(locale, categoryNames, toolNames, toolDescriptions).map((guide) => ({
    slug: guide.slug,
    href: guide.href,
    kind: 'comparison',
    name: guide.title,
    description: guide.description,
    seoTitle: guide.title,
    seoDescription: guide.shortDescription,
    category: 'comparison',
    categoryName: uiCopy.comparisonLabel,
    aliases: getComparisonCopy(locale, guide.slug).aliases,
  }));
}

export const comparisonSurfaceSlugs = comparisonSurfaceDefinitions.map(
  (definition) => definition.slug
).sort((left, right) => {
  const leftIndex = comparisonSurfacePriorityMap.get(left) ?? Number.MAX_SAFE_INTEGER;
  const rightIndex = comparisonSurfacePriorityMap.get(right) ?? Number.MAX_SAFE_INTEGER;
  return leftIndex - rightIndex;
});
