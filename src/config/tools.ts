export type ToolCategory = 'text' | 'encoding' | 'generators' | 'converters' | 'development' | 'security' | 'network' | 'image' | 'math';

export interface Tool {
  slug: string;
  category: ToolCategory;
  icon: string;
  component: string;
  popular?: boolean;
}

export const tools: Tool[] = [
  // Encoding & Decoding
  { slug: 'json-formatter', category: 'encoding', icon: '📋', component: 'JsonFormatter', popular: true },
  { slug: 'base64', category: 'encoding', icon: '🔐', component: 'Base64', popular: true },
  { slug: 'url-encoder', category: 'network', icon: '🔗', component: 'UrlEncoder', popular: true },
  { slug: 'html-encoder', category: 'encoding', icon: '📄', component: 'HtmlEncoder' },
  { slug: 'jwt-decoder', category: 'encoding', icon: '🎫', component: 'JwtDecoder', popular: true },
  { slug: 'xml-formatter', category: 'encoding', icon: '📰', component: 'XmlFormatter', popular: true },
  { slug: 'unicode-converter', category: 'encoding', icon: '🔣', component: 'UnicodeConverter' },
  
  // Generators
  { slug: 'uuid-generator', category: 'generators', icon: '🆔', component: 'UuidGenerator', popular: true },
  { slug: 'password-generator', category: 'security', icon: '🔑', component: 'PasswordGenerator', popular: true },
  { slug: 'hash-generator', category: 'security', icon: '#️⃣', component: 'HashGenerator', popular: true },
  { slug: 'qr-generator', category: 'image', icon: '📱', component: 'QrGenerator', popular: true },
  { slug: 'lorem-ipsum', category: 'generators', icon: '📝', component: 'LoremIpsum' },
  { slug: 'cron-generator', category: 'generators', icon: '⏱️', component: 'CronGenerator' },
  { slug: 'gradient-generator', category: 'generators', icon: '🌈', component: 'GradientGenerator', popular: true },
  
  // Text Tools
  { slug: 'word-counter', category: 'text', icon: '🔢', component: 'WordCounter', popular: true },
  { slug: 'case-converter', category: 'text', icon: 'Aa', component: 'CaseConverter' },
  { slug: 'markdown-preview', category: 'text', icon: '📑', component: 'MarkdownPreview' },
  { slug: 'diff-checker', category: 'text', icon: '📊', component: 'DiffChecker', popular: true },
  { slug: 'text-to-slug', category: 'text', icon: '🔤', component: 'TextToSlug' },
  { slug: 'chinese-converter', category: 'text', icon: '繁', component: 'ChineseConverter', popular: true },
  { slug: 'pinyin-converter', category: 'text', icon: '拼', component: 'PinyinConverter' },
  
  // Converters
  { slug: 'color-converter', category: 'converters', icon: '🎨', component: 'ColorConverter', popular: true },
  { slug: 'timestamp-converter', category: 'converters', icon: '⏰', component: 'TimestampConverter' },
  { slug: 'json-to-csv', category: 'converters', icon: '📊', component: 'JsonToCsv', popular: true },
  { slug: 'image-to-base64', category: 'image', icon: '🖼️', component: 'ImageToBase64' },
  { slug: 'number-base-converter', category: 'math', icon: '🔢', component: 'NumberBaseConverter' },
  { slug: 'unit-converter', category: 'converters', icon: '📏', component: 'UnitConverter', popular: true },
  
  // Development
  { slug: 'regex-tester', category: 'development', icon: '🔍', component: 'RegexTester' },
  { slug: 'json-path-tester', category: 'development', icon: '🛤️', component: 'JsonPathTester' },
  { slug: 'code-minifier', category: 'development', icon: '📦', component: 'CodeMinifier', popular: true },
  { slug: 'sql-formatter', category: 'development', icon: '🗃️', component: 'SqlFormatter' },
  { slug: 'color-picker', category: 'development', icon: '🎯', component: 'ColorPicker', popular: true },
  { slug: 'aspect-ratio', category: 'math', icon: '📐', component: 'AspectRatioCalculator' },
  { slug: 'css-beautifier', category: 'development', icon: '🎨', component: 'CssBeautifier' },
  { slug: 'js-beautifier', category: 'development', icon: '📜', component: 'JsBeautifier' },
  { slug: 'html-preview', category: 'development', icon: '👁️', component: 'HtmlPreview', popular: true },
  { slug: 'ip-lookup', category: 'network', icon: '🌐', component: 'IpLookup', popular: true },
  { slug: 'morse-code', category: 'encoding', icon: '📡', component: 'MorseCode' },
  
  // Batch 5 tools
  { slug: 'random-generator', category: 'generators', icon: '🎲', component: 'RandomGenerator' },
  { slug: 'text-reverser', category: 'text', icon: '🔄', component: 'TextReverser' },
  { slug: 'line-counter', category: 'text', icon: '📋', component: 'LineCounter' },
  { slug: 'string-escape', category: 'encoding', icon: '🔒', component: 'StringEscape' },
  { slug: 'yaml-json', category: 'converters', icon: '📄', component: 'YamlJson', popular: true },
  
  // Batch 6 tools
  { slug: 'date-calculator', category: 'converters', icon: '📅', component: 'DateCalculator', popular: true },
  { slug: 'text-deduplicator', category: 'text', icon: '🧹', component: 'TextDeduplicator' },
  { slug: 'color-blender', category: 'converters', icon: '🎨', component: 'ColorBlender' },
  { slug: 'json-sorter', category: 'encoding', icon: '🔀', component: 'JsonSorter' },
  { slug: 'placeholder-image', category: 'image', icon: '🖼️', component: 'PlaceholderImage' },
  
  // Batch 7 tools
  { slug: 'text-encryption', category: 'security', icon: '🔐', component: 'TextEncryption', popular: true },
  { slug: 'file-hash', category: 'security', icon: '📁', component: 'FileHash' },
  { slug: 'html-table-generator', category: 'generators', icon: '📊', component: 'HtmlTableGenerator' },
  { slug: 'json-schema-validator', category: 'development', icon: '✅', component: 'JsonSchemaValidator' },
  { slug: 'regex-patterns', category: 'development', icon: '📚', component: 'RegexPatterns' },
  
  // Batch 8 tools
  { slug: 'byte-counter', category: 'text', icon: '📏', component: 'ByteCounter' },
  { slug: 'json-to-typescript', category: 'converters', icon: '🔷', component: 'JsonToTypescript', popular: true },
  { slug: 'svg-optimizer', category: 'image', icon: '🎨', component: 'SvgOptimizer' },
  { slug: 'text-to-binary', category: 'encoding', icon: '01', component: 'TextToBinary' },
  { slug: 'markdown-to-html', category: 'converters', icon: '📝', component: 'MarkdownToHtml' },
  
  // Batch 9 tools
  { slug: 'html-minifier', category: 'development', icon: '📦', component: 'HtmlMinifier' },
  { slug: 'json-diff', category: 'development', icon: '🔍', component: 'JsonDiff', popular: true },
  { slug: 'base32', category: 'encoding', icon: '🔢', component: 'Base32' },
  { slug: 'epoch-converter', category: 'converters', icon: '⏱️', component: 'EpochConverter' },
  { slug: 'css-unit-converter', category: 'converters', icon: '📐', component: 'CssUnitConverter' },
  
  // Batch 10 tools
  { slug: 'text-statistics', category: 'text', icon: '📊', component: 'TextStatistics', popular: true },
  { slug: 'hex-editor', category: 'encoding', icon: '🔢', component: 'HexEditor' },
  { slug: 'color-palette', category: 'generators', icon: '🎨', component: 'ColorPalette', popular: true },
  { slug: 'http-status', category: 'network', icon: '🌐', component: 'HttpStatus' },
  { slug: 'json-to-yaml', category: 'converters', icon: '📄', component: 'JsonToYaml' },
  { slug: 'data-uri', category: 'encoding', icon: '🔗', component: 'DataUri' },
  { slug: 'text-compare', category: 'text', icon: '⚖️', component: 'TextCompare' },
  { slug: 'json-to-go', category: 'converters', icon: '🐹', component: 'JsonToGo' },
  { slug: 'html-to-jsx', category: 'converters', icon: '⚛️', component: 'HtmlToJsx', popular: true },
  { slug: 'chmod-calculator', category: 'math', icon: '🔐', component: 'ChmodCalculator' },
  
  // Batch 11 tools
  { slug: 'barcode-generator', category: 'image', icon: '📊', component: 'BarcodeGenerator', popular: true },
  { slug: 'text-to-speech', category: 'text', icon: '🔊', component: 'TextToSpeech' },
  { slug: 'url-parser', category: 'network', icon: '🔗', component: 'UrlParser' },
  { slug: 'json-to-xml', category: 'converters', icon: '📄', component: 'JsonToXml' },
  { slug: 'text-wrapper', category: 'text', icon: '📐', component: 'TextWrapper' },
  { slug: 'csv-to-json', category: 'converters', icon: '📊', component: 'CsvToJson' },
  { slug: 'html-entity', category: 'encoding', icon: '🔣', component: 'HtmlEntityConverter' },
  { slug: 'number-formatter', category: 'converters', icon: '🔢', component: 'NumberFormatter' },
  
  // Batch 12 - New Security Tools
  { slug: 'hmac-generator', category: 'security', icon: '🔏', component: 'HmacGenerator' },
  { slug: 'password-strength', category: 'security', icon: '💪', component: 'PasswordStrength' },
  { slug: 'totp-generator', category: 'security', icon: '🔐', component: 'TotpGenerator' },
  
  // Batch 13 - New Network Tools
  { slug: 'user-agent-parser', category: 'network', icon: '🔍', component: 'UserAgentParser' },
  { slug: 'cidr-calculator', category: 'network', icon: '🔢', component: 'CidrCalculator' },
  { slug: 'http-header-parser', category: 'network', icon: '📋', component: 'HttpHeaderParser' },
  
  // Batch 14 - New Math Tools
  { slug: 'percentage-calculator', category: 'math', icon: '%', component: 'PercentageCalculator' },
  { slug: 'statistics-calculator', category: 'math', icon: '📊', component: 'StatisticsCalculator' },
  { slug: 'scientific-calculator', category: 'math', icon: '🔬', component: 'ScientificCalculator' },
  
  // Batch 15 - New Text Tools
  { slug: 'text-sorter', category: 'text', icon: '🔤', component: 'TextSorter' },
  { slug: 'text-extractor', category: 'text', icon: '🔍', component: 'TextExtractor' },
  { slug: 'emoji-picker', category: 'text', icon: '😀', component: 'EmojiPicker' },
  
  // Batch 16 - New Converter Tools
  { slug: 'json-to-sql', category: 'converters', icon: '🗃️', component: 'JsonToSql' },
  { slug: 'toml-json', category: 'converters', icon: '📄', component: 'TomlJson' },
  { slug: 'json-to-java', category: 'converters', icon: '☕', component: 'JsonToJava' },
  { slug: 'json-to-python', category: 'converters', icon: '🐍', component: 'JsonToPython' },
  { slug: 'json-to-kotlin', category: 'converters', icon: '🟣', component: 'JsonToKotlin' },
  
  // Batch 17 - Image Tools
  { slug: 'image-compressor', category: 'image', icon: '📦', component: 'ImageCompressor' },
  { slug: 'image-converter', category: 'image', icon: '🔄', component: 'ImageConverter' },
  { slug: 'favicon-generator', category: 'image', icon: '🎨', component: 'FaviconGenerator' },
  { slug: 'image-cropper', category: 'image', icon: '✂️', component: 'ImageCropper' },
  
  // Batch 18 - Development Tools
  { slug: 'gitignore-generator', category: 'development', icon: '📁', component: 'GitignoreGenerator' },
  { slug: 'docker-compose-generator', category: 'development', icon: '🐳', component: 'DockerComposeGenerator' },
  { slug: 'package-json-generator', category: 'development', icon: '📦', component: 'PackageJsonGenerator' },
  
  // Batch 19 - New Popular Tools
  { slug: 'json-minifier', category: 'encoding', icon: '📦', component: 'JsonMinifier', popular: true },
  { slug: 'timezone-converter', category: 'converters', icon: '🌍', component: 'TimezoneConverter', popular: true },
  { slug: 'color-contrast-checker', category: 'development', icon: '🎨', component: 'ColorContrastChecker', popular: true },
  { slug: 'markdown-table-generator', category: 'generators', icon: '📊', component: 'MarkdownTableGenerator', popular: true },
  { slug: 'base58', category: 'encoding', icon: '₿', component: 'Base58' },
  
  // Batch 20 - SEO & Development Tools
  { slug: 'meta-tag-generator', category: 'generators', icon: '🏷️', component: 'MetaTagGenerator', popular: true },
  { slug: 'robots-txt-generator', category: 'generators', icon: '🤖', component: 'RobotsTxtGenerator' },
  { slug: 'opengraph-preview', category: 'development', icon: '📱', component: 'OpenGraphPreview', popular: true },
  { slug: 'css-grid-generator', category: 'generators', icon: '📐', component: 'CssGridGenerator', popular: true },
  { slug: 'css-flexbox-generator', category: 'generators', icon: '📏', component: 'CssFlexboxGenerator', popular: true },
  { slug: 'jwt-generator', category: 'security', icon: '🔐', component: 'JwtGenerator' },
  { slug: 'cron-explainer', category: 'development', icon: '⏰', component: 'CronExplainer' },
  { slug: 'json-to-graphql', category: 'converters', icon: '◈', component: 'JsonToGraphql' },
  { slug: 'sql-to-mongo', category: 'converters', icon: '🍃', component: 'SqlToMongo' },
  
  // Batch 21 - Code & CSS Tools
  { slug: 'json-to-csharp', category: 'converters', icon: '🔷', component: 'JsonToCsharp' },
  { slug: 'json-to-rust', category: 'converters', icon: '🦀', component: 'JsonToRust' },
  { slug: 'json-to-swift', category: 'converters', icon: '🍎', component: 'JsonToSwift' },
  { slug: 'css-minifier', category: 'development', icon: '📦', component: 'CssMinifier', popular: true },
  { slug: 'js-minifier', category: 'development', icon: '📦', component: 'JsMinifier', popular: true },
  { slug: 'box-shadow-generator', category: 'generators', icon: '🌑', component: 'BoxShadowGenerator', popular: true },
  { slug: 'border-radius-generator', category: 'generators', icon: '⬜', component: 'BorderRadiusGenerator' },
  { slug: 'text-to-ascii-art', category: 'text', icon: '🎨', component: 'TextToAsciiArt' },
  
  // Batch 22 - Utility Tools
  { slug: 'color-shades-generator', category: 'generators', icon: '🎨', component: 'ColorShadesGenerator', popular: true },
  { slug: 'json-flattener', category: 'encoding', icon: '📋', component: 'JsonFlattener' },
  { slug: 'base85', category: 'encoding', icon: '🔢', component: 'Base85' },
  { slug: 'html-to-markdown', category: 'converters', icon: '📝', component: 'HtmlToMarkdown', popular: true },
  { slug: 'regex-generator', category: 'development', icon: '🔍', component: 'RegexGenerator', popular: true },
  { slug: 'url-shortener-preview', category: 'network', icon: '🔗', component: 'UrlShortenerPreview' },
  
  // Batch 23 - More Utility Tools
  { slug: 'json-viewer', category: 'encoding', icon: '👁️', component: 'JsonViewer', popular: true },
  { slug: 'xml-to-json', category: 'converters', icon: '📄', component: 'XmlToJson', popular: true },
  { slug: 'ip-address-generator', category: 'network', icon: '🌐', component: 'IpAddressGenerator' },
  { slug: 'css-gradient-text', category: 'generators', icon: '✨', component: 'CssGradientText', popular: true },
  { slug: 'sitemap-generator', category: 'generators', icon: '🗺️', component: 'SitemapGenerator' },
  
  // Batch 24 - Advanced Tools
  { slug: 'json-to-php', category: 'converters', icon: '🐘', component: 'JsonToPhp' },
  { slug: 'css-filter-generator', category: 'generators', icon: '🎭', component: 'CssFilterGenerator', popular: true },
  { slug: 'text-diff-patch', category: 'text', icon: '📝', component: 'TextDiffPatch' },
  { slug: 'encoding-detector', category: 'encoding', icon: '🔍', component: 'EncodingDetector' },
  
  // Batch 25 - More Tools
  { slug: 'css-clip-path-generator', category: 'generators', icon: '✂️', component: 'CssClipPathGenerator', popular: true },
  { slug: 'uuid-validator', category: 'development', icon: '✅', component: 'UuidValidator' },
  { slug: 'text-hash-comparator', category: 'security', icon: '🔐', component: 'TextHashComparator' },
  { slug: 'json-path-finder', category: 'development', icon: '🔎', component: 'JsonPathFinder', popular: true },
  { slug: 'canvas-drawing', category: 'image', icon: '🎨', component: 'CanvasDrawing' },
  
  // Batch 26 - New Tools
  { slug: 'json-escape', category: 'encoding', icon: '🔒', component: 'JsonEscape' },
  { slug: 'css-animation-generator', category: 'generators', icon: '🎬', component: 'CssAnimationGenerator', popular: true },
  { slug: 'text-case-counter', category: 'text', icon: '🔠', component: 'TextCaseCounter' },
  { slug: 'dns-lookup', category: 'network', icon: '🌐', component: 'DnsLookup', popular: true },
  { slug: 'image-resizer', category: 'image', icon: '📐', component: 'ImageResizer', popular: true },
  
  // Batch 27 - Popular Overseas Tools
  { slug: 'ssl-checker', category: 'network', icon: '🔒', component: 'SslChecker', popular: true },
  { slug: 'whois-lookup', category: 'network', icon: '🔍', component: 'WhoisLookup', popular: true },
  { slug: 'port-reference', category: 'network', icon: '🚪', component: 'PortScanner' },
  { slug: 'privacy-policy-generator', category: 'generators', icon: '📜', component: 'PrivacyPolicyGenerator', popular: true },
  { slug: 'terms-generator', category: 'generators', icon: '📋', component: 'TermsGenerator', popular: true },
  { slug: 'cookie-policy-generator', category: 'generators', icon: '🍪', component: 'CookiePolicyGenerator' },
  { slug: 'json-to-tsv', category: 'converters', icon: '📊', component: 'JsonToTsv' },
  { slug: 'csv-viewer', category: 'converters', icon: '📑', component: 'CsvViewer', popular: true },
  { slug: 'htaccess-generator', category: 'development', icon: '⚙️', component: 'HtaccessGenerator', popular: true },
  { slug: 'nginx-config-generator', category: 'development', icon: '🔧', component: 'NginxConfigGenerator', popular: true },
  { slug: 'curl-converter', category: 'development', icon: '🔄', component: 'CurlConverter', popular: true },
  { slug: 'reading-time-calculator', category: 'text', icon: '📖', component: 'ReadingTimeCalculator', popular: true },

  // Batch 28 - New Popular Tools
  { slug: 'open-graph-generator', category: 'generators', icon: '🖼️', component: 'OpenGraphGenerator', popular: true },
  { slug: 'twitter-card-generator', category: 'generators', icon: '🐦', component: 'TwitterCardGenerator', popular: true },
  { slug: 'mime-type-lookup', category: 'development', icon: '📋', component: 'MimeTypeLookup' },
  { slug: 'http-status-codes', category: 'development', icon: '🌐', component: 'HttpStatusCodes', popular: true },
  { slug: 'string-obfuscator', category: 'security', icon: '🌫️', component: 'StringObfuscator' },
  { slug: 'text-cleaner', category: 'text', icon: '🧹', component: 'TextCleaner', popular: true },
  { slug: 'list-randomizer', category: 'text', icon: '🎲', component: 'ListRandomizer' },
  { slug: 'sql-generator', category: 'development', icon: '💾', component: 'SqlGenerator' },

  // Batch 29 - New Tools from toolfk.com
  { slug: 'htaccess-to-nginx', category: 'development', icon: '⚙️', component: 'HtaccessToNginx' },
  { slug: 'js-obfuscator', category: 'security', icon: '🔒', component: 'JsObfuscator', popular: true },
  { slug: 'image-watermark', category: 'image', icon: '💧', component: 'ImageWatermark', popular: true },
  { slug: 'svg-to-image', category: 'image', icon: '🖼️', component: 'SvgToImage' },
  { slug: 'hex-base64-converter', category: 'encoding', icon: '🔄', component: 'HexBase64Converter' },

  // Batch 30 - More Tools
  { slug: 'pdf-to-base64', category: 'encoding', icon: '📄', component: 'PdfToBase64' },
  { slug: 'audio-to-base64', category: 'encoding', icon: '🎵', component: 'AudioToBase64' },
  { slug: 'video-to-base64', category: 'encoding', icon: '🎬', component: 'VideoToBase64' },
  { slug: 'file-size-calculator', category: 'converters', icon: '📊', component: 'FileSizeCalculator' },
  { slug: 'ascii-table', category: 'encoding', icon: '📋', component: 'AsciiTable' },

  // Batch 31 - More Tools
  { slug: 'text-to-hex', category: 'encoding', icon: '🔢', component: 'TextToHex' },
  { slug: 'css-variables-generator', category: 'development', icon: '🎨', component: 'CssVariablesGenerator' },
  { slug: 'lorem-picsum', category: 'image', icon: '🖼️', component: 'LoremPicsum' },
  { slug: 'regex-escape', category: 'development', icon: '🔒', component: 'RegexEscape' },
  { slug: 'html-to-text', category: 'text', icon: '📝', component: 'HtmlToText' },
  { slug: 'binary-to-decimal', category: 'math', icon: '🔢', component: 'BinaryToDecimal' },
  { slug: 'octal-converter', category: 'math', icon: '🧮', component: 'OctalConverter' },
  { slug: 'text-to-nato', category: 'text', icon: '📻', component: 'TextToNato' },
  { slug: 'crc32-calculator', category: 'development', icon: '✅', component: 'Crc32Calculator' },
  { slug: 'mac-address-generator', category: 'network', icon: '🖧', component: 'MacAddressGenerator' },
  
  // Batch 32 - New Popular Tools (to reach 200)
  { slug: 'ip-validator', category: 'network', icon: '✅', component: 'IpValidator', popular: true },
  { slug: 'json-merger', category: 'encoding', icon: '🔗', component: 'JsonMerger', popular: true },
  { slug: 'text-template', category: 'text', icon: '📝', component: 'TextTemplate', popular: true },
  { slug: 'base-calculator', category: 'math', icon: '🧮', component: 'BaseCalculator', popular: true },
  { slug: 'color-name-finder', category: 'converters', icon: '🎨', component: 'ColorNameFinder', popular: true },
  { slug: 'char-frequency', category: 'text', icon: '📊', component: 'CharFrequency', popular: true },
  { slug: 'json-to-dart', category: 'converters', icon: '🎯', component: 'JsonToDart', popular: true },
  { slug: 'sql-to-json', category: 'converters', icon: '🗃️', component: 'SqlToJson', popular: true },
];

export const categories: { id: ToolCategory; icon: string }[] = [
  { id: 'text', icon: '📝' },
  { id: 'encoding', icon: '🔐' },
  { id: 'generators', icon: '⚡' },
  { id: 'converters', icon: '🔄' },
  { id: 'development', icon: '💻' },
  { id: 'security', icon: '🔒' },
  { id: 'network', icon: '🌐' },
  { id: 'image', icon: '🖼️' },
  { id: 'math', icon: '🔢' },
];

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return tools.filter(t => t.category === category);
}

export function getPopularTools(): Tool[] {
  return tools.filter(t => t.popular);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}
