const FETCH_BASE_URL = (process.env.PROD_BASE_URL || 'https://www.u2tool.com').replace(/\/+$/, '');
const CANONICAL_BASE_URL = (
  process.env.CANONICAL_BASE_URL ||
  process.env.PUBLIC_SITE_URL ||
  'https://www.u2tool.com'
).replace(/\/+$/, '');
const INCLUDE_SOURCE_RENDERED_CHECKS =
  process.env.INCLUDE_SOURCE_RENDERED_CHECKS === '1' ||
  /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(FETCH_BASE_URL);

interface RenderedSeoCheck {
  name: string;
  path: string;
  canonicalPath?: string;
  titleIncludes: string;
  descriptionIncludes: string;
  h1Includes?: string;
  schemaTypes: string[];
  bodyMustInclude?: string[];
  bodyMustNotInclude?: string[];
  sourceRenderedOnly?: boolean;
}

const requiredSocialMeta = [
  ['property', 'og:title'],
  ['property', 'og:description'],
  ['property', 'og:image'],
  ['property', 'og:url'],
  ['property', 'og:site_name'],
  ['name', 'twitter:card'],
  ['name', 'twitter:title'],
  ['name', 'twitter:description'],
  ['name', 'twitter:image'],
] as const;

const checks: RenderedSeoCheck[] = [
  {
    name: 'English homepage',
    path: '/en/',
    titleIncludes: 'U2Tool',
    descriptionIncludes: 'online tools',
    h1Includes: 'Free Online Tools',
    schemaTypes: ['Organization', 'WebSite'],
    bodyMustInclude: ['JSON Formatter', 'Text Tools'],
  },
  {
    name: 'English tools index',
    path: '/en/tools/',
    titleIncludes: 'Tools',
    descriptionIncludes: 'tools',
    h1Includes: 'Free Online Tools',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage'],
    bodyMustInclude: ['JSON Formatter', 'Choose the Right'],
  },
  {
    name: 'English creator SEO generators cluster',
    path: '/en/tools/creator-seo-generators/',
    titleIncludes: 'Creator',
    descriptionIncludes: 'YouTube',
    h1Includes: 'Creator',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList', 'BreadcrumbList'],
    bodyMustInclude: [
      'Creator &amp; SEO Generators',
      '/en/tools/youtube-tags-generator/',
      '/en/tools/seo-title-generator/',
      '/en/categories/generators/',
    ],
  },
  {
    name: 'English image editing converters cluster',
    path: '/en/tools/image-editing-converters/',
    titleIncludes: 'Image',
    descriptionIncludes: 'compression',
    h1Includes: 'Image',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList', 'BreadcrumbList'],
    bodyMustInclude: [
      'Image Editing &amp; Conversion Tools',
      '/en/tools/image-compressor/',
      '/en/tools/image-converter/',
      '/en/categories/image/',
    ],
  },
  {
    name: 'English chart generators cluster',
    path: '/en/tools/chart-generators/',
    titleIncludes: 'Chart',
    descriptionIncludes: 'chart',
    h1Includes: 'Chart',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList', 'BreadcrumbList'],
    bodyMustInclude: [
      'Chart Generators &amp; Data Visualization Tools',
      '/en/tools/bar-chart-generator/',
      '/en/tools/line-chart-generator/',
      '/en/categories/charts/',
    ],
  },
  {
    name: 'English developer data formatters cluster',
    path: '/en/tools/developer-data-formatters/',
    titleIncludes: 'Developer Data',
    descriptionIncludes: 'JSON',
    h1Includes: 'Developer Data',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList', 'BreadcrumbList'],
    bodyMustInclude: [
      'Developer Data Formatters, Converters &amp; Validators',
      '/en/tools/json-formatter/',
      '/en/tools/json-to-typescript/',
      '/en/categories/development/',
    ],
  },
  {
    name: 'English online calculators cluster',
    path: '/en/tools/online-calculators/',
    titleIncludes: 'Online Calculators',
    descriptionIncludes: 'calculators',
    h1Includes: 'Online Calculators',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList', 'BreadcrumbList'],
    bodyMustInclude: [
      'Online Calculators for Finance, Math, Work &amp; Daily Life',
      '/en/tools/mortgage-calculator/',
      '/en/tools/percentage-calculator/',
      '/en/categories/finance/',
    ],
  },
  {
    name: 'English PDF document converters cluster',
    path: '/en/tools/pdf-document-converters/',
    titleIncludes: 'PDF',
    descriptionIncludes: 'PDF',
    h1Includes: 'PDF',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList', 'BreadcrumbList'],
    bodyMustInclude: [
      'PDF, Document &amp; Spreadsheet Tools',
      '/en/tools/pdf-merger/',
      '/en/tools/excel-to-json/',
      '/en/categories/office/',
    ],
  },
  {
    name: 'English security password hash tools cluster',
    path: '/en/tools/security-password-hash-tools/',
    titleIncludes: 'Security',
    descriptionIncludes: 'password',
    h1Includes: 'Security',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList', 'BreadcrumbList'],
    bodyMustInclude: [
      'Security, Password, Hash &amp; JWT Tools',
      '/en/tools/password-generator/',
      '/en/tools/hash-generator/',
      '/en/categories/security/',
    ],
  },
  {
    name: 'English text writing editing tools cluster',
    path: '/en/tools/text-writing-editing-tools/',
    titleIncludes: 'Text',
    descriptionIncludes: 'writing',
    h1Includes: 'Text',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList', 'BreadcrumbList'],
    bodyMustInclude: [
      'Text, Writing &amp; Editing Tools',
      '/en/tools/word-counter/',
      '/en/tools/grammar-checker/',
      '/en/categories/text/',
    ],
  },
  {
    name: 'English privacy page',
    path: '/en/privacy/',
    titleIncludes: 'Privacy Policy',
    descriptionIncludes: 'browser-based',
    h1Includes: 'Privacy Policy',
    schemaTypes: ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList'],
    bodyMustInclude: ['Browser-first processing', 'contact@u2tool.com'],
  },
  {
    name: 'English contact page',
    path: '/en/contact/',
    titleIncludes: 'Contact U2Tool',
    descriptionIncludes: 'feedback',
    h1Includes: 'Contact U2Tool',
    schemaTypes: ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList'],
    bodyMustInclude: ['contact@u2tool.com', 'Indexing and SEO requests'],
  },
  {
    name: 'English tools search results',
    path: '/en/tools/?q=json',
    canonicalPath: '/en/tools/',
    titleIncludes: 'Tools',
    descriptionIncludes: 'tools',
    h1Includes: 'Free Online Tools',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage'],
    bodyMustInclude: ['data-search-results', 'JSON Formatter', 'https://www.u2tool.com/en/tools/json-formatter/'],
  },
  {
    name: 'JSON Formatter tool page',
    path: '/en/tools/json-formatter/',
    titleIncludes: 'JSON Formatter',
    descriptionIncludes: 'JSON',
    h1Includes: 'JSON Formatter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['Choose the Right JSON Tool', '/en/compare/choose-json-tool/'],
  },
  {
    name: 'Creator SEO tool cluster backlink',
    path: '/en/tools/youtube-tags-generator/',
    titleIncludes: 'YouTube Tags',
    descriptionIncludes: 'YouTube',
    h1Includes: 'YouTube Tags',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: [
      'data-creator-seo-tool-cluster',
      '/en/tools/creator-seo-generators/',
      '/en/tools/youtube-title-generator/',
      '/en/tools/youtube-thumbnail-generator/',
    ],
  },
  {
    name: 'Image tool cluster backlink',
    path: '/en/tools/image-compressor/',
    titleIncludes: 'Image Compressor',
    descriptionIncludes: 'image',
    h1Includes: 'Image Compressor',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: [
      'data-image-tool-cluster',
      '/en/tools/image-editing-converters/',
      '/en/tools/image-converter/',
    ],
  },
  {
    name: 'Chart tool cluster backlink',
    path: '/en/tools/bar-chart-generator/',
    titleIncludes: 'Bar Chart',
    descriptionIncludes: 'chart',
    h1Includes: 'Bar Chart',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: [
      'data-chart-tool-cluster',
      '/en/tools/chart-generators/',
      '/en/tools/line-chart-generator/',
    ],
  },
  {
    name: 'Developer data tool cluster backlink',
    path: '/en/tools/json-formatter/',
    titleIncludes: 'JSON Formatter',
    descriptionIncludes: 'JSON',
    h1Includes: 'JSON Formatter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: [
      'data-developer-data-tool-cluster',
      '/en/tools/developer-data-formatters/',
      '/en/tools/json-viewer/',
    ],
  },
  {
    name: 'Online calculator cluster backlink',
    path: '/en/tools/mortgage-calculator/',
    titleIncludes: 'Mortgage',
    descriptionIncludes: 'mortgage',
    h1Includes: 'Mortgage',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: [
      'data-online-calculator-cluster',
      '/en/tools/online-calculators/',
      '/en/tools/roi-calculator/',
    ],
  },
  {
    name: 'PDF document tool cluster backlink',
    path: '/en/tools/pdf-merger/',
    titleIncludes: 'PDF Merger',
    descriptionIncludes: 'PDF',
    h1Includes: 'PDF Merger',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: [
      'data-pdf-document-tool-cluster',
      '/en/tools/pdf-document-converters/',
      '/en/tools/pdf-splitter/',
    ],
  },
  {
    name: 'Security tool cluster backlink',
    path: '/en/tools/password-generator/',
    titleIncludes: 'Password Generator',
    descriptionIncludes: 'password',
    h1Includes: 'Password Generator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: [
      'data-security-tool-cluster',
      '/en/tools/security-password-hash-tools/',
      '/en/tools/password-strength/',
    ],
  },
  {
    name: 'Text writing tool cluster backlink',
    path: '/en/tools/word-counter/',
    titleIncludes: 'Word Counter',
    descriptionIncludes: 'word',
    h1Includes: 'Word Counter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: [
      'data-text-writing-tool-cluster',
      '/en/tools/text-writing-editing-tools/',
      '/en/tools/document-word-counter/',
    ],
  },
  {
    name: 'JWT Decoder tool page',
    path: '/en/tools/jwt-decoder/',
    titleIncludes: 'JWT Decoder',
    descriptionIncludes: 'JWT',
    h1Includes: 'JWT Decoder',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The JWT Decoder helps developers inspect', '/en/compare/choose-jwt-tool/'],
    bodyMustNotInclude: [
      'The JWT Debugger is a specialized tool',
      'Signature Verification',
      'Verify Signature',
      'Valid Signature',
      "validate the token's signature",
      'verify JWT signatures',
    ],
  },
  {
    name: 'Word Counter refreshed support content',
    path: '/en/tools/word-counter/',
    titleIncludes: 'Word Counter',
    descriptionIncludes: 'word',
    h1Includes: 'Word Counter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Word Counter tool gives writers'],
    bodyMustNotInclude: [
      'finite-state automata',
      'Web Workers implementation',
      'Punkt algorithm',
      'Export Data',
    ],
  },
  {
    name: 'Spanish Word Counter tool page',
    path: '/es/tools/word-counter/',
    titleIncludes: 'Contador de palabras',
    descriptionIncludes: 'palabras',
    h1Includes: 'Contador de Palabras',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Spanish Word Counter refreshed support content',
    path: '/es/tools/word-counter/',
    titleIncludes: 'Contador de palabras',
    descriptionIncludes: 'caracteres con y sin espacios',
    h1Includes: 'Contador de Palabras',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['El Contador de Palabras ofrece una forma rápida de medir la longitud de un texto'],
    bodyMustNotInclude: [
      'Ignorar mayúsculas',
      'Excluir números',
      'Procesar Texto',
      'Descargar Informe',
    ],
  },
  {
    name: 'Regex Tester refreshed support content',
    path: '/en/tools/regex-tester/',
    titleIncludes: 'Regex Tester',
    descriptionIncludes: 'regex',
    h1Includes: 'Regex Tester',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Regex Tester lets developers try JavaScript regular expressions'],
    bodyMustNotInclude: ['PCRE2', 'replacement preview mode'],
  },
  {
    name: 'Timestamp Converter refreshed support content',
    path: '/en/tools/timestamp-converter/',
    titleIncludes: 'Timestamp Converter',
    descriptionIncludes: 'timestamp',
    h1Includes: 'Timestamp Converter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Timestamp Converter helps you move between Unix timestamp seconds'],
    bodyMustNotInclude: ['WebAssembly-based conversion engine', 'Timezone Offset Picker'],
  },
  {
    name: 'Image to Base64 refreshed support content',
    path: '/en/tools/image-to-base64/',
    titleIncludes: 'Image to Base64',
    descriptionIncludes: 'Base64',
    h1Includes: 'Image to Base64',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Image to Base64 tool converts a local image file'],
    bodyMustNotInclude: ['Preserve Transparency', 'target encoding format'],
  },
  {
    name: 'Password Generator refreshed support content',
    path: '/en/tools/password-generator/',
    titleIncludes: 'Password Generator',
    descriptionIncludes: 'password',
    h1Includes: 'Password Generator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Password Generator creates random passwords in the browser'],
    bodyMustNotInclude: ['WebAssembly-compiled cryptographic primitives', 'Entropy Visualizer', 'BIP-39 mnemonic phrases'],
  },
  {
    name: 'QR Generator refreshed support content',
    path: '/en/tools/qr-generator/',
    titleIncludes: 'QR',
    descriptionIncludes: 'QR',
    h1Includes: 'QR',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The QR Generator creates a PNG QR code from text or a URL'],
    bodyMustNotInclude: ['CMYK offset printing', 'alpha transparency support', 'JIS X 0510'],
  },
  {
    name: 'Image Compressor refreshed support content',
    path: '/en/tools/image-compressor/',
    titleIncludes: 'Image Compressor',
    descriptionIncludes: 'image',
    h1Includes: 'Image Compressor',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Image Compressor loads a local image in the browser'],
    bodyMustNotInclude: ['discrete cosine transform', 'lossless compression algorithms'],
  },
  {
    name: 'Hash Generator refreshed support content',
    path: '/en/tools/hash-generator/',
    titleIncludes: 'Hash Generator',
    descriptionIncludes: 'hash',
    h1Includes: 'Hash Generator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Hash Generator creates browser-based digest values'],
    bodyMustNotInclude: ['MD5, SHA-1, and SHA-256', 'fixed-length, seemingly random'],
  },
  {
    name: 'Markdown Preview refreshed support content',
    path: '/en/tools/markdown-preview/',
    titleIncludes: 'Markdown',
    descriptionIncludes: 'Markdown',
    h1Includes: 'Markdown Preview',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Markdown Preview tool lets you edit Markdown'],
    bodyMustNotInclude: ['lexical analy', 'CommonMark specification'],
  },
  {
    name: 'CIDR Calculator refreshed support content',
    path: '/en/tools/cidr-calculator/',
    titleIncludes: 'CIDR',
    descriptionIncludes: 'CIDR',
    h1Includes: 'CIDR',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The CIDR Calculator analyzes an IPv4 address'],
    bodyMustNotInclude: ['decomposes them into actionable'],
  },
  {
    name: 'Gitignore Generator refreshed support content',
    path: '/en/tools/gitignore-generator/',
    titleIncludes: 'gitignore',
    descriptionIncludes: 'gitignore',
    h1Includes: 'gitignore',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The .gitignore Generator helps build a .gitignore file'],
  },
  {
    name: 'IP Lookup refreshed support content',
    path: '/en/tools/ip-lookup/',
    titleIncludes: 'IP',
    descriptionIncludes: 'IP',
    h1Includes: 'IP',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The IP Lookup tool queries ip-api.com'],
    bodyMustNotInclude: ['multi-source API aggregation', 'BGP routing tables', 'DNSBL integration'],
  },
  {
    name: 'Favicon Generator refreshed support content',
    path: '/en/tools/favicon-generator/',
    titleIncludes: 'Favicon',
    descriptionIncludes: 'favicon',
    h1Includes: 'Favicon',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Favicon Generator creates PNG favicon images'],
    bodyMustNotInclude: ['multi-resolution favicon assets', 'standardized di'],
  },
  {
    name: 'Image Converter refreshed support content',
    path: '/en/tools/image-converter/',
    titleIncludes: 'Image Format Converter',
    descriptionIncludes: 'image',
    h1Includes: 'Image Format Converter',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Image Converter changes a local image into PNG, JPEG, or WebP'],
    bodyMustNotInclude: ['without leaving the browser. Upload a file'],
  },
  {
    name: 'Chinese Converter refreshed support content',
    path: '/en/tools/chinese-converter/',
    titleIncludes: 'Chinese',
    descriptionIncludes: 'Chinese',
    h1Includes: 'Chinese',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Chinese Converter changes text between Simplified and Traditional Chinese'],
    bodyMustNotInclude: ["Unicode Standard's Unihan database"],
  },
  {
    name: 'JSON to CSV refreshed support content',
    path: '/en/tools/json-to-csv/',
    titleIncludes: 'JSON',
    descriptionIncludes: 'CSV',
    h1Includes: 'JSON',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The JSON to CSV tool converts a JSON object or array of objects'],
    bodyMustNotInclude: ['seamless transformation'],
  },
  {
    name: 'Gantt Chart Generator recovery title',
    path: '/en/tools/gantt-chart-generator/',
    titleIncludes: 'Gantt Chart',
    descriptionIncludes: 'Gantt',
    h1Includes: 'Gantt Chart Maker',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Typing Speed Test tool page',
    path: '/en/tools/typing-speed-test/',
    titleIncludes: 'Typing Speed Test',
    descriptionIncludes: 'typing speed',
    h1Includes: 'Typing Speed Test',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Typing Speed Test refreshed support content',
    path: '/en/tools/typing-speed-test/',
    titleIncludes: 'Typing Speed Test',
    descriptionIncludes: 'WPM',
    h1Includes: 'Typing Speed Test',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['the page highlights each character as correct or incorrect'],
  },
  {
    name: 'Hex Editor refreshed support content',
    path: '/en/tools/hex-editor/',
    titleIncludes: 'Hex Editor',
    descriptionIncludes: 'UTF-8 hex bytes',
    h1Includes: 'Hex Editor',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Hex Editor is a browser-based text and hexadecimal converter'],
    bodyMustNotInclude: [
      'hexadecimal grid',
      '16-byte columnar',
      'Double-click any hex value',
      'Download as Hex File',
      'developer tools panel',
      'memory-mapped I/O',
      'ASCII preview',
    ],
  },
  {
    name: 'Hex Editor enhanced FAQ support',
    path: '/en/tools/hex-editor/',
    titleIncludes: 'Hex Editor',
    descriptionIncludes: 'UTF-8 hex',
    h1Includes: 'Hex Editor',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: [
      'Is this a full binary file editor?',
      'TextEncoder API',
      'logs, payloads, and test fixtures',
    ],
    bodyMustNotInclude: [
      'hexadecimal grid',
      'Double-click any hex value',
      'Download as Hex File',
    ],
  },
  {
    name: 'Russian Hex Editor enhanced support content',
    path: '/ru/tools/hex-editor/',
    titleIncludes: 'Hex',
    descriptionIncludes: 'UTF-8 hex',
    h1Includes: 'Hex-редактор',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: [
      'Hex-редактор — это браузерный конвертер',
      'Это полноценный редактор двоичных файлов?',
      'TextEncoder',
    ],
    bodyMustNotInclude: [
      'hex-дамп',
      'Сохранить как .bin',
      'UTF-16LE/BE',
    ],
  },
  {
    name: 'English Encoding category Hex internal links',
    path: '/en/categories/encoding/',
    titleIncludes: 'Encoding',
    descriptionIncludes: 'hex',
    h1Includes: 'Encoding',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'BreadcrumbList'],
    sourceRenderedOnly: true,
    bodyMustInclude: [
      'Inspect text as bytes',
      '/en/tools/hex-editor/',
      '/en/tools/text-to-hex/',
    ],
  },
  {
    name: 'Russian Encoding category Hex internal links',
    path: '/ru/categories/encoding/',
    titleIncludes: 'кодирования',
    descriptionIncludes: 'hex',
    h1Includes: 'Кодирование',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'BreadcrumbList'],
    sourceRenderedOnly: true,
    bodyMustInclude: [
      'Проверить текст как байты',
      '/ru/tools/hex-editor/',
      '/ru/tools/text-to-hex/',
    ],
  },
  {
    name: 'IBAN Validator tool page',
    path: '/en/tools/iban-validator/',
    titleIncludes: 'IBAN Validator',
    descriptionIncludes: 'checksum',
    h1Includes: 'IBAN Validator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'IBAN Validator restored runtime and support content',
    path: '/en/tools/iban-validator/',
    titleIncludes: 'IBAN Validator',
    descriptionIncludes: 'MOD-97 checksum',
    h1Includes: 'IBAN Validator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['IBAN Validator checks International Bank Account Numbers in the browser'],
    bodyMustNotInclude: [
      'Supports all European countries',
      'show bank code',
      'bank information',
    ],
  },
  {
    name: 'Pixel Density Calculator tool page',
    path: '/en/tools/pixel-density-calculator/',
    titleIncludes: 'Pixel Density',
    descriptionIncludes: 'pixel density',
    h1Includes: 'Pixel Density Calculator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Pixel Density Calculator restored presets and support content',
    path: '/en/tools/pixel-density-calculator/',
    titleIncludes: 'Pixel Density',
    descriptionIncludes: 'PPI',
    h1Includes: 'Pixel Density Calculator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['common HD, Full HD, QHD, ultrawide, 4K, 5K, and 8K presets'],
    bodyMustNotInclude: ['popular devices', 'device presets'],
  },
  {
    name: 'Sitemap Generator tool page',
    path: '/en/tools/sitemap-generator/',
    titleIncludes: 'Sitemap Generator',
    descriptionIncludes: 'sitemap',
    h1Includes: 'Sitemap Generator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Sitemap Generator refreshed support content',
    path: '/en/tools/sitemap-generator/',
    titleIncludes: 'Sitemap Generator',
    descriptionIncludes: 'sitemap.xml',
    h1Includes: 'Sitemap Generator',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['The Sitemap Generator creates a simple XML sitemap from the URLs you enter in the browser'],
    bodyMustNotInclude: [
      'Scan Website',
      'scanning your website',
      'recursively fetching',
      'breaking the sitemap into multiple files',
    ],
  },
  {
    name: 'German Text to Handwriting tool page',
    path: '/de/tools/text-to-handwriting/',
    titleIncludes: 'Text',
    descriptionIncludes: 'Text',
    h1Includes: 'Text',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'German Text to Handwriting refreshed support content',
    path: '/de/tools/text-to-handwriting/',
    titleIncludes: 'Text',
    descriptionIncludes: 'Text',
    h1Includes: 'Text',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['Mit dem Text-zu-Handschrift-Converter wandelst du eingegebenen Text direkt im Browser'],
    bodyMustNotInclude: ['Umconverter', 'verfassen Sie die Farbe', 'gepunktet oder gitter'],
  },
  {
    name: 'iCal Parser tool page',
    path: '/en/tools/ical-parser/',
    titleIncludes: 'iCal Parser',
    descriptionIncludes: 'ICS',
    h1Includes: 'iCal Parser',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'iCal Parser refreshed support content',
    path: '/en/tools/ical-parser/',
    titleIncludes: 'iCal Parser',
    descriptionIncludes: 'ICS',
    h1Includes: 'iCal Parser',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['Timezone identifiers are not expanded into full timezone databases'],
    bodyMustNotInclude: ['full timezone handling'],
  },
  {
    name: 'Russian Barcode Generator tool page',
    path: '/ru/tools/barcode-generator/',
    titleIncludes: 'Генератор',
    descriptionIncludes: 'штрих',
    h1Includes: 'Генератор',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Russian Barcode Generator refreshed support content',
    path: '/ru/tools/barcode-generator/',
    titleIncludes: 'Генератор',
    descriptionIncludes: 'штрих',
    h1Includes: 'Генератор',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['SVG-предпросмотр линейного штрихкода'],
    bodyMustNotInclude: [
      'EPS',
      '600 DPI',
      'растровых изображений',
      'цветовое оформление',
      'высоту штрихов',
      'ширину модуля',
    ],
  },
  {
    name: 'French File Size Calculator tool page',
    path: '/fr/tools/file-size-calculator/',
    titleIncludes: 'Calculateur',
    descriptionIncludes: 'taille',
    h1Includes: 'Calculateur',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'French File Size Calculator refreshed support content',
    path: '/fr/tools/file-size-calculator/',
    titleIncludes: 'Calculateur',
    descriptionIncludes: 'taille',
    h1Includes: 'Calculateur',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['convertit une valeur source en octets'],
    bodyMustNotInclude: [
      'cases à cocher',
      'unités de destination souhaitées',
      "bouton 'Convertir'",
      "Utilisez le bouton 'Réinitialiser'",
      "Cochez la case",
    ],
  },
  {
    name: 'Morse Code Player tool page',
    path: '/en/tools/morse-code-player/',
    titleIncludes: 'Morse Code Player',
    descriptionIncludes: 'Morse',
    h1Includes: 'Morse Code Player',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Morse Code Player refreshed support content',
    path: '/en/tools/morse-code-player/',
    titleIncludes: 'Morse Code Player',
    descriptionIncludes: 'Morse',
    h1Includes: 'Morse Code Player',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['Morse Code Player converts text to Morse code and Morse code back to text'],
    bodyMustNotInclude: ['built-in reference chart', 'reference chart'],
  },
  {
    name: 'Spanish Document Word Counter tool page',
    path: '/es/tools/document-word-counter/',
    titleIncludes: 'Contador',
    descriptionIncludes: 'palabras',
    h1Includes: 'Contador',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Spanish Document Word Counter refreshed support content',
    path: '/es/tools/document-word-counter/',
    titleIncludes: 'Contador',
    descriptionIncludes: 'palabras',
    h1Includes: 'Contador',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['analiza el texto pegado directamente en el navegador'],
    bodyMustNotInclude: ['Exporta las estadísticas', 'Exportar estadísticas'],
  },
  {
    name: 'Compound Interest Calculator tool page',
    path: '/en/tools/compound-interest-calculator/',
    titleIncludes: 'Compound Interest',
    descriptionIncludes: 'interest',
    h1Includes: 'Compound Interest',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Compound Interest Calculator refreshed support content',
    path: '/en/tools/compound-interest-calculator/',
    titleIncludes: 'Compound Interest',
    descriptionIncludes: 'interest',
    h1Includes: 'Compound Interest',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['estimates how an initial balance can grow over a chosen number of years'],
    bodyMustNotInclude: ['Visual charts help you understand', 'growth chart'],
  },
  {
    name: 'HTML Preview tool page',
    path: '/en/tools/html-preview/',
    titleIncludes: 'HTML Preview',
    descriptionIncludes: 'HTML',
    h1Includes: 'HTML Preview',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'HTML Preview refreshed support content',
    path: '/en/tools/html-preview/',
    titleIncludes: 'HTML Preview',
    descriptionIncludes: 'HTML',
    h1Includes: 'HTML Preview',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['sandboxed iframe-style preview area'],
    bodyMustNotInclude: [
      'JavaScript support',
      'JavaScript execution',
      '<script> tags for interactivity',
      '&lt;script&gt; tags for interactivity',
      'complete web pages including interactive elements',
    ],
  },
  {
    name: 'Russian Scientific Calculator tool page',
    path: '/ru/tools/scientific-calculator/',
    titleIncludes: 'Науч',
    descriptionIncludes: 'калькулятор',
    h1Includes: 'Науч',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Russian Scientific Calculator refreshed support content',
    path: '/ru/tools/scientific-calculator/',
    titleIncludes: 'Науч',
    descriptionIncludes: 'калькулятор',
    h1Includes: 'Науч',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['Кнопки памяти MC, MR, M+ и MS'],
    bodyMustNotInclude: [
      "клавишу 'Exp'",
      "функцию '2nd'",
      'sin⁻¹',
      'cos⁻¹',
      'tan⁻¹',
      'гиперболическими функциями',
      'sinh',
      'cosh',
      'обратную польскую нотацию',
      'дифференциальных уравнений',
    ],
  },
  {
    name: 'Random Color Generator tool page',
    path: '/en/tools/random-color-generator/',
    titleIncludes: 'Random Color',
    descriptionIncludes: 'HEX',
    h1Includes: 'Random Color',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Random Color Generator refreshed support content',
    path: '/en/tools/random-color-generator/',
    titleIncludes: 'Random Color',
    descriptionIncludes: 'HEX',
    h1Includes: 'Random Color',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['Set the number of swatches from 1 to 20'],
    bodyMustNotInclude: [
      'harmony modes',
      'locked colors',
      'seeded palettes',
      'WCAG contrast checker',
      'built-in contrast checker',
      'Export CSS variables',
      'PNG export',
      'palette history',
    ],
  },
  {
    name: 'Dice Roller tool page',
    path: '/en/tools/dice-roller/',
    titleIncludes: 'Dice Roller',
    descriptionIncludes: 'dice',
    h1Includes: 'Dice Roller',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
  },
  {
    name: 'Dice Roller refreshed support content',
    path: '/en/tools/dice-roller/',
    titleIncludes: 'Dice Roller',
    descriptionIncludes: 'dice',
    h1Includes: 'Dice Roller',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    sourceRenderedOnly: true,
    bodyMustInclude: ['Choose one of the visible dice buttons for D4, D6, D8, D10, D12, D20, or D100'],
    bodyMustNotInclude: [
      'drop-down menu',
      'Quantity field',
      'History tab',
      'save specific configurations',
      'saving custom dice sets',
      'Settings icon',
      'setting a seed',
      'advanced statistical tracking',
      'weighted dice',
    ],
  },
  {
    name: 'Lorem Ipsum refreshed support content',
    path: '/en/tools/lorem-ipsum/',
    titleIncludes: 'Lorem',
    descriptionIncludes: 'Lorem',
    h1Includes: 'Lorem',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The Lorem Ipsum Generator creates placeholder text for layouts'],
    bodyMustNotInclude: ['sophisticated tool designed'],
  },
  {
    name: 'SSL Checker refreshed support content',
    path: '/en/tools/ssl-checker/',
    titleIncludes: 'SSL',
    descriptionIncludes: 'SSL',
    h1Includes: 'SSL',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The SSL Checker page shows a browser-side certificate-style summary'],
    bodyMustNotInclude: ['retrieves the presented certificate chain'],
  },
  {
    name: 'UUID Generator refreshed support content',
    path: '/en/tools/uuid-generator/',
    titleIncludes: 'UUID',
    descriptionIncludes: 'UUID',
    h1Includes: 'UUID',
    schemaTypes: ['Organization', 'WebSite', 'SoftwareApplication', 'HowTo', 'BreadcrumbList', 'FAQPage'],
    bodyMustInclude: ['The UUID Generator creates version 4 UUID strings'],
    bodyMustNotInclude: ['cryptographically secure 128-bit identifiers'],
  },
  {
    name: 'Comparison guides index',
    path: '/en/compare/',
    titleIncludes: 'Choose the right',
    descriptionIncludes: 'tool',
    h1Includes: 'Choose the right',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'ItemList'],
    bodyMustInclude: ['JSON', 'JWT'],
  },
  {
    name: 'JWT comparison guide',
    path: '/en/compare/choose-jwt-tool/',
    titleIncludes: 'JWT',
    descriptionIncludes: 'JWT',
    h1Includes: 'Choose the Right JWT Tool',
    schemaTypes: ['Organization', 'WebSite', 'CollectionPage', 'BreadcrumbList'],
    bodyMustInclude: ['JWT Decoder', 'JWT Generator'],
  },
];

async function fetchHtmlWithRetry(
  url: string,
  init: RequestInit = {},
  attempts = 4
): Promise<{ html: string; response: Response }> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, init);
      const html = await response.text();
      return { response, html };
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }

  throw lastError;
}

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function getTagContent(html: string, selector: 'title' | 'description' | 'canonical' | 'robots'): string {
  if (selector === 'title') {
    return html.match(/<title>(.*?)<\/title>/is)?.[1]?.trim() || '';
  }

  if (selector === 'description') {
    const tag = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i)?.[0] || '';
    return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
  }

  if (selector === 'canonical') {
    const tag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0] || '';
    return tag.match(/\bhref=["']([^"']+)["']/i)?.[1]?.trim() || '';
  }

  const tag = html.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i)?.[0] || '';
  return tag.match(/\bcontent=(["'])(.*?)\1/i)?.[2]?.trim() || '';
}

function extractJsonLdTypes(html: string): string[] {
  const scripts = Array.from(
    html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  ).map((match) => match[1].trim());
  const types = new Set<string>();

  for (const script of scripts) {
    try {
      const parsed = JSON.parse(script) as unknown;
      const values = Array.isArray(parsed) ? parsed : [parsed];
      for (const value of values) {
        if (value && typeof value === 'object' && '@type' in value) {
          const type = (value as { '@type'?: unknown })['@type'];
          if (typeof type === 'string') {
            types.add(type);
          }
        }
      }
    } catch {
      throw new Error(`Invalid JSON-LD block: ${script.slice(0, 120)}`);
    }
  }

  return Array.from(types);
}

function hasMetaTag(html: string, attributeName: 'name' | 'property', attributeValue: string): boolean {
  const escapedValue = attributeValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<meta\\b(?=[^>]*\\b${attributeName}=["']${escapedValue}["'])(?=[^>]*\\bcontent=["'][^"']+["'])[^>]*>`,
    'i'
  );
  return pattern.test(html);
}

async function validateCheck(check: RenderedSeoCheck): Promise<void> {
  const url = `${FETCH_BASE_URL}${check.path}`;
  const { response, html } = await fetchHtmlWithRetry(url, { redirect: 'follow' });
  assert(response.status === 200, `${check.name}: expected HTTP 200, got ${response.status}`);
  assert((response.headers.get('content-type') || '').includes('text/html'), `${check.name}: response is not HTML`);

  const canonicalUrl = `${CANONICAL_BASE_URL}${check.canonicalPath ?? check.path}`;
  const title = getTagContent(html, 'title');
  const description = getTagContent(html, 'description');
  const canonical = getTagContent(html, 'canonical');
  const robots = getTagContent(html, 'robots');
  const h1Text = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  const schemaTypes = extractJsonLdTypes(html);

  assert(title.includes(check.titleIncludes), `${check.name}: title missing "${check.titleIncludes}"`);
  assert(!/\bU2Tool\s*\|\s*U2Tool\b/i.test(title), `${check.name}: title duplicates U2Tool brand`);
  assert(description.toLowerCase().includes(check.descriptionIncludes.toLowerCase()), `${check.name}: meta description missing "${check.descriptionIncludes}"`);
  if (check.h1Includes) {
    assert(h1Text.includes(check.h1Includes), `${check.name}: H1 "${h1Text}" missing "${check.h1Includes}"`);
  }
  assert(canonical === canonicalUrl, `${check.name}: canonical "${canonical}" does not match "${canonicalUrl}"`);
  assert(robots.includes('index') && robots.includes('follow') && !robots.includes('noindex'), `${check.name}: robots meta is not indexable`);
  assert((html.match(/rel=["']alternate["']\s+hreflang=/g) || []).length >= 10, `${check.name}: missing hreflang alternates`);

  for (const [attributeName, attributeValue] of requiredSocialMeta) {
    assert(
      hasMetaTag(html, attributeName, attributeValue),
      `${check.name}: missing social meta ${attributeName}="${attributeValue}"`
    );
  }

  for (const schemaType of check.schemaTypes) {
    assert(schemaTypes.includes(schemaType), `${check.name}: missing JSON-LD type ${schemaType}`);
  }

  for (const expected of check.bodyMustInclude || []) {
    assert(html.includes(expected), `${check.name}: body missing "${expected}"`);
  }

  for (const forbidden of check.bodyMustNotInclude || []) {
    assert(!html.includes(forbidden), `${check.name}: body contains forbidden text "${forbidden}"`);
  }
}

async function main(): Promise<void> {
  const failures: string[] = [];

  for (const check of checks) {
    if (check.sourceRenderedOnly && !INCLUDE_SOURCE_RENDERED_CHECKS) {
      console.log(`SKIP ${check.name} ${check.path} -> source-rendered check not enabled for FETCH_BASE_URL=${FETCH_BASE_URL}`);
      continue;
    }

    try {
      await validateCheck(check);
      console.log(`OK  ${check.name} ${check.path}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push(message);
      console.log(`FAIL ${check.name} ${check.path} -> ${message}`);
    }
  }

  if (failures.length > 0) {
    console.log(`\n${failures.length} rendered SEO checks failed. FETCH_BASE_URL=${FETCH_BASE_URL}; CANONICAL_BASE_URL=${CANONICAL_BASE_URL}`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll rendered SEO checks passed. FETCH_BASE_URL=${FETCH_BASE_URL}; CANONICAL_BASE_URL=${CANONICAL_BASE_URL}`);
}

main().catch((error) => {
  console.error('Unexpected rendered SEO validation error:', error);
  process.exitCode = 1;
});
