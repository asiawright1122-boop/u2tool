export type ToolCategory = 'text' | 'encoding' | 'generators' | 'converters' | 'development' | 'security' | 'network' | 'image' | 'math' | 'charts' | 'office' | 'lifestyle' | 'finance' | 'fun';

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
  { slug: 'html-encoder', category: 'encoding', icon: '📄', component: 'HtmlEncoder', popular: true },
  { slug: 'jwt-decoder', category: 'encoding', icon: '🎫', component: 'JwtDecoder', popular: true },
  { slug: 'xml-formatter', category: 'encoding', icon: '📰', component: 'XmlFormatter', popular: true },
  { slug: 'unicode-converter', category: 'encoding', icon: '🔣', component: 'UnicodeConverter', popular: true },

  // Generators
  { slug: 'uuid-generator', category: 'generators', icon: '🆔', component: 'UuidGenerator', popular: true },
  { slug: 'password-generator', category: 'security', icon: '🔑', component: 'PasswordGenerator', popular: true },
  { slug: 'hash-generator', category: 'security', icon: '#️⃣', component: 'HashGenerator', popular: true },
  { slug: 'qr-generator', category: 'image', icon: '📱', component: 'QrGenerator', popular: true },
  { slug: 'lorem-ipsum', category: 'generators', icon: '📝', component: 'LoremIpsum', popular: true },
  { slug: 'cron-generator', category: 'generators', icon: '⏱️', component: 'CronGenerator' },
  { slug: 'gradient-generator', category: 'generators', icon: '🌈', component: 'GradientGenerator', popular: true },

  // Text Tools
  { slug: 'word-counter', category: 'text', icon: '🔢', component: 'WordCounter', popular: true },
  { slug: 'case-converter', category: 'text', icon: 'Aa', component: 'CaseConverter', popular: true },
  { slug: 'markdown-preview', category: 'text', icon: '📑', component: 'MarkdownPreview', popular: true },
  { slug: 'diff-checker', category: 'text', icon: '📊', component: 'DiffChecker', popular: true },
  { slug: 'text-to-slug', category: 'text', icon: '🔤', component: 'TextToSlug', popular: true },
  { slug: 'chinese-converter', category: 'text', icon: '繁', component: 'ChineseConverter', popular: true },
  { slug: 'pinyin-converter', category: 'text', icon: '拼', component: 'PinyinConverter' },

  // Converters
  { slug: 'color-converter', category: 'converters', icon: '🎨', component: 'ColorConverter', popular: true },
  { slug: 'timestamp-converter', category: 'converters', icon: '⏰', component: 'TimestampConverter', popular: true },
  { slug: 'json-to-csv', category: 'converters', icon: '📊', component: 'JsonToCsv', popular: true },
  { slug: 'image-to-base64', category: 'image', icon: '🖼️', component: 'ImageToBase64', popular: true },
  { slug: 'number-base-converter', category: 'math', icon: '🔢', component: 'NumberBaseConverter', popular: true },
  { slug: 'unit-converter', category: 'converters', icon: '📏', component: 'UnitConverter', popular: true },

  // Development
  { slug: 'regex-tester', category: 'development', icon: '🔍', component: 'RegexTester', popular: true },
  { slug: 'json-path-tester', category: 'development', icon: '🛤️', component: 'JsonPathTester' },
  { slug: 'code-minifier', category: 'development', icon: '📦', component: 'CodeMinifier', popular: true },
  { slug: 'sql-formatter', category: 'development', icon: '🗃️', component: 'SqlFormatter', popular: true },
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
  { slug: 'yaml-json', category: 'converters', icon: '📄', component: 'YamlJson' },

  // Batch 6 tools
  { slug: 'date-calculator', category: 'converters', icon: '📅', component: 'DateCalculator' },
  { slug: 'text-deduplicator', category: 'text', icon: '🧹', component: 'TextDeduplicator' },
  { slug: 'color-blender', category: 'converters', icon: '🎨', component: 'ColorBlender' },
  { slug: 'json-sorter', category: 'encoding', icon: '🔀', component: 'JsonSorter' },
  { slug: 'placeholder-image', category: 'image', icon: '🖼️', component: 'PlaceholderImage' },

  // Batch 7 tools
  { slug: 'text-encryption', category: 'security', icon: '🔐', component: 'TextEncryption', popular: true },
  { slug: 'file-hash', category: 'security', icon: '📁', component: 'FileHash' },
  { slug: 'html-table-generator', category: 'generators', icon: '📊', component: 'HtmlTableGenerator' },
  { slug: 'json-schema-validator', category: 'development', icon: '✅', component: 'JsonSchemaValidator', popular: true },
  { slug: 'regex-patterns', category: 'development', icon: '📚', component: 'RegexPatterns' },

  // Batch 8 tools
  { slug: 'byte-counter', category: 'text', icon: '📏', component: 'ByteCounter' },
  { slug: 'json-to-typescript', category: 'converters', icon: '🔷', component: 'JsonToTypescript', popular: true },
  { slug: 'svg-optimizer', category: 'image', icon: '🎨', component: 'SvgOptimizer' },
  { slug: 'text-to-binary', category: 'encoding', icon: '01', component: 'TextToBinary' },
  { slug: 'markdown-to-html', category: 'converters', icon: '📝', component: 'MarkdownToHtml', popular: true },

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
  { slug: 'json-to-yaml', category: 'converters', icon: '📄', component: 'JsonToYaml', popular: true },
  { slug: 'data-uri', category: 'encoding', icon: '🔗', component: 'DataUri' },
  { slug: 'text-compare', category: 'text', icon: '⚖️', component: 'TextCompare' },
  { slug: 'json-to-go', category: 'converters', icon: '🐹', component: 'JsonToGo' },
  { slug: 'html-to-jsx', category: 'converters', icon: '⚛️', component: 'HtmlToJsx' },
  { slug: 'chmod-calculator', category: 'math', icon: '🔐', component: 'ChmodCalculator' },

  // Batch 11 tools
  { slug: 'barcode-generator', category: 'image', icon: '📊', component: 'BarcodeGenerator' },
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
  { slug: 'cidr-calculator', category: 'network', icon: '🔢', component: 'CidrCalculator', popular: true },
  { slug: 'http-header-parser', category: 'network', icon: '📋', component: 'HttpHeaderParser' },

  // Batch 14 - New Math Tools
  { slug: 'percentage-calculator', category: 'math', icon: '%', component: 'PercentageCalculator', popular: true },
  { slug: 'statistics-calculator', category: 'math', icon: '📊', component: 'StatisticsCalculator' },
  { slug: 'scientific-calculator', category: 'math', icon: '🔬', component: 'ScientificCalculator', popular: true },

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
  { slug: 'image-compressor', category: 'image', icon: '📦', component: 'ImageCompressor', popular: true },
  { slug: 'image-converter', category: 'image', icon: '🔄', component: 'ImageConverter', popular: true },
  { slug: 'favicon-generator', category: 'image', icon: '🎨', component: 'FaviconGenerator', popular: true },
  { slug: 'image-cropper', category: 'image', icon: '✂️', component: 'ImageCropper' },

  // Batch 18 - Development Tools
  { slug: 'gitignore-generator', category: 'development', icon: '📁', component: 'GitignoreGenerator', popular: true },
  { slug: 'docker-compose-generator', category: 'development', icon: '🐳', component: 'DockerComposeGenerator' },
  { slug: 'package-json-generator', category: 'development', icon: '📦', component: 'PackageJsonGenerator' },

  // Batch 19 - New Popular Tools
  { slug: 'json-minifier', category: 'encoding', icon: '📦', component: 'JsonMinifier' },
  { slug: 'timezone-converter', category: 'converters', icon: '🌍', component: 'TimezoneConverter', popular: true },
  { slug: 'color-contrast-checker', category: 'development', icon: '🎨', component: 'ColorContrastChecker' },
  { slug: 'markdown-table-generator', category: 'generators', icon: '📊', component: 'MarkdownTableGenerator' },
  { slug: 'base58', category: 'encoding', icon: '₿', component: 'Base58' },

  // Batch 20 - SEO & Development Tools
  { slug: 'meta-tag-generator', category: 'generators', icon: '🏷️', component: 'MetaTagGenerator' },
  { slug: 'robots-txt-generator', category: 'generators', icon: '🤖', component: 'RobotsTxtGenerator' },
  { slug: 'opengraph-preview', category: 'development', icon: '📱', component: 'OpenGraphPreview' },
  { slug: 'css-grid-generator', category: 'generators', icon: '📐', component: 'CssGridGenerator' },
  { slug: 'css-flexbox-generator', category: 'generators', icon: '📏', component: 'CssFlexboxGenerator' },
  { slug: 'jwt-generator', category: 'security', icon: '🔐', component: 'JwtGenerator' },
  { slug: 'cron-explainer', category: 'development', icon: '⏰', component: 'CronExplainer' },
  { slug: 'json-to-graphql', category: 'converters', icon: '◈', component: 'JsonToGraphql' },
  { slug: 'sql-to-mongo', category: 'converters', icon: '🍃', component: 'SqlToMongo' },

  // Batch 21 - Code & CSS Tools
  { slug: 'json-to-csharp', category: 'converters', icon: '🔷', component: 'JsonToCsharp' },
  { slug: 'json-to-rust', category: 'converters', icon: '🦀', component: 'JsonToRust' },
  { slug: 'json-to-swift', category: 'converters', icon: '🍎', component: 'JsonToSwift' },
  { slug: 'css-minifier', category: 'development', icon: '📦', component: 'CssMinifier' },
  { slug: 'js-minifier', category: 'development', icon: '📦', component: 'JsMinifier' },
  { slug: 'box-shadow-generator', category: 'generators', icon: '🌑', component: 'BoxShadowGenerator' },
  { slug: 'border-radius-generator', category: 'generators', icon: '⬜', component: 'BorderRadiusGenerator' },
  { slug: 'text-to-ascii-art', category: 'text', icon: '🎨', component: 'TextToAsciiArt' },

  // Batch 22 - Utility Tools
  { slug: 'color-shades-generator', category: 'generators', icon: '🎨', component: 'ColorShadesGenerator' },
  { slug: 'json-flattener', category: 'encoding', icon: '📋', component: 'JsonFlattener' },
  { slug: 'base85', category: 'encoding', icon: '🔢', component: 'Base85' },
  { slug: 'html-to-markdown', category: 'converters', icon: '📝', component: 'HtmlToMarkdown' },
  { slug: 'regex-generator', category: 'development', icon: '🔍', component: 'RegexGenerator' },
  { slug: 'url-shortener-preview', category: 'network', icon: '🔗', component: 'UrlShortenerPreview' },

  // Batch 23 - More Utility Tools
  { slug: 'json-viewer', category: 'encoding', icon: '👁️', component: 'JsonViewer' },
  { slug: 'xml-to-json', category: 'converters', icon: '📄', component: 'XmlToJson' },
  { slug: 'ip-address-generator', category: 'network', icon: '🌐', component: 'IpAddressGenerator' },
  { slug: 'css-gradient-text', category: 'generators', icon: '✨', component: 'CssGradientText' },
  { slug: 'sitemap-generator', category: 'generators', icon: '🗺️', component: 'SitemapGenerator' },

  // Batch 24 - Advanced Tools
  { slug: 'json-to-php', category: 'converters', icon: '🐘', component: 'JsonToPhp' },
  { slug: 'css-filter-generator', category: 'generators', icon: '🎭', component: 'CssFilterGenerator' },
  { slug: 'text-diff-patch', category: 'text', icon: '📝', component: 'TextDiffPatch' },
  { slug: 'encoding-detector', category: 'encoding', icon: '🔍', component: 'EncodingDetector' },

  // Batch 25 - More Tools
  { slug: 'css-clip-path-generator', category: 'generators', icon: '✂️', component: 'CssClipPathGenerator' },
  { slug: 'uuid-validator', category: 'development', icon: '✅', component: 'UuidValidator' },
  { slug: 'text-hash-comparator', category: 'security', icon: '🔐', component: 'TextHashComparator' },
  { slug: 'json-path-finder', category: 'development', icon: '🔎', component: 'JsonPathFinder' },
  { slug: 'canvas-drawing', category: 'image', icon: '🎨', component: 'CanvasDrawing' },

  // Batch 26 - New Tools
  { slug: 'json-escape', category: 'encoding', icon: '🔒', component: 'JsonEscape' },
  { slug: 'css-animation-generator', category: 'generators', icon: '🎬', component: 'CssAnimationGenerator' },
  { slug: 'text-case-counter', category: 'text', icon: '🔠', component: 'TextCaseCounter' },
  { slug: 'dns-lookup', category: 'network', icon: '🌐', component: 'DnsLookup' },
  { slug: 'image-resizer', category: 'image', icon: '📐', component: 'ImageResizer' },

  // Batch 27 - Popular Overseas Tools
  { slug: 'ssl-checker', category: 'network', icon: '🔒', component: 'SslChecker', popular: true },
  { slug: 'whois-lookup', category: 'network', icon: '🔍', component: 'WhoisLookup' },
  { slug: 'port-reference', category: 'network', icon: '🚪', component: 'PortScanner' },
  { slug: 'privacy-policy-generator', category: 'generators', icon: '📜', component: 'PrivacyPolicyGenerator' },
  { slug: 'terms-generator', category: 'generators', icon: '📋', component: 'TermsGenerator' },
  { slug: 'cookie-policy-generator', category: 'generators', icon: '🍪', component: 'CookiePolicyGenerator' },
  { slug: 'json-to-tsv', category: 'converters', icon: '📊', component: 'JsonToTsv' },
  { slug: 'csv-viewer', category: 'converters', icon: '📑', component: 'CsvViewer' },
  { slug: 'htaccess-generator', category: 'development', icon: '⚙️', component: 'HtaccessGenerator' },
  { slug: 'nginx-config-generator', category: 'development', icon: '🔧', component: 'NginxConfigGenerator' },
  { slug: 'curl-converter', category: 'development', icon: '🔄', component: 'CurlConverter' },
  { slug: 'reading-time-calculator', category: 'text', icon: '📖', component: 'ReadingTimeCalculator' },

  // Batch 28 - New Popular Tools
  { slug: 'open-graph-generator', category: 'generators', icon: '🖼️', component: 'OpenGraphGenerator' },
  { slug: 'twitter-card-generator', category: 'generators', icon: '🐦', component: 'TwitterCardGenerator' },
  { slug: 'mime-type-lookup', category: 'development', icon: '📋', component: 'MimeTypeLookup' },
  { slug: 'http-status-codes', category: 'development', icon: '🌐', component: 'HttpStatusCodes' },
  { slug: 'string-obfuscator', category: 'security', icon: '🌫️', component: 'StringObfuscator' },
  { slug: 'text-cleaner', category: 'text', icon: '🧹', component: 'TextCleaner' },
  { slug: 'list-randomizer', category: 'text', icon: '🎲', component: 'ListRandomizer' },
  { slug: 'sql-generator', category: 'development', icon: '💾', component: 'SqlGenerator' },

  // Batch 29 - New Tools from toolfk.com
  { slug: 'htaccess-to-nginx', category: 'development', icon: '⚙️', component: 'HtaccessToNginx' },
  { slug: 'js-obfuscator', category: 'security', icon: '🔒', component: 'JsObfuscator' },
  { slug: 'image-watermark', category: 'image', icon: '💧', component: 'ImageWatermark' },
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
  { slug: 'ip-validator', category: 'network', icon: '✅', component: 'IpValidator' },
  { slug: 'json-merger', category: 'encoding', icon: '🔗', component: 'JsonMerger' },
  { slug: 'text-template', category: 'text', icon: '📝', component: 'TextTemplate' },
  { slug: 'base-calculator', category: 'math', icon: '🧮', component: 'BaseCalculator' },
  { slug: 'color-name-finder', category: 'converters', icon: '🎨', component: 'ColorNameFinder' },
  { slug: 'char-frequency', category: 'text', icon: '📊', component: 'CharFrequency' },
  { slug: 'json-to-dart', category: 'converters', icon: '🎯', component: 'JsonToDart' },
  { slug: 'sql-to-json', category: 'converters', icon: '🗃️', component: 'SqlToJson' },

  // Batch 33 - Chart Tools (数据图表工具)
  { slug: 'bar-chart-generator', category: 'charts', icon: '📊', component: 'BarChartGenerator' },
  { slug: 'line-chart-generator', category: 'charts', icon: '📈', component: 'LineChartGenerator' },
  { slug: 'pie-chart-generator', category: 'charts', icon: '🥧', component: 'PieChartGenerator' },
  { slug: 'radar-chart-generator', category: 'charts', icon: '🎯', component: 'RadarChartGenerator' },
  { slug: 'scatter-chart-generator', category: 'charts', icon: '⚬', component: 'ScatterChartGenerator' },
  { slug: 'area-chart-generator', category: 'charts', icon: '📉', component: 'AreaChartGenerator' },
  { slug: 'funnel-chart-generator', category: 'charts', icon: '🔻', component: 'FunnelChartGenerator' },
  { slug: 'gauge-chart-generator', category: 'charts', icon: '🎛️', component: 'GaugeChartGenerator' },
  { slug: 'heatmap-chart-generator', category: 'charts', icon: '🔥', component: 'HeatmapChartGenerator' },
  { slug: 'treemap-chart-generator', category: 'charts', icon: '🌳', component: 'TreemapChartGenerator' },

  // Batch 34 - New Chart Tools (新增图表工具)
  { slug: 'doughnut-chart-generator', category: 'charts', icon: '🍩', component: 'DoughnutChartGenerator' },
  { slug: 'sankey-chart-generator', category: 'charts', icon: '🔀', component: 'SankeyChartGenerator' },
  { slug: 'sunburst-chart-generator', category: 'charts', icon: '☀️', component: 'SunburstChartGenerator' },
  { slug: 'candlestick-chart-generator', category: 'charts', icon: '📈', component: 'CandlestickChartGenerator' },
  { slug: 'boxplot-chart-generator', category: 'charts', icon: '📦', component: 'BoxplotChartGenerator' },
  { slug: 'wordcloud-generator', category: 'charts', icon: '☁️', component: 'WordCloudGenerator' },
  { slug: 'graph-chart-generator', category: 'charts', icon: '🕸️', component: 'GraphChartGenerator' },
  { slug: 'calendar-heatmap-generator', category: 'charts', icon: '📅', component: 'CalendarHeatmapGenerator' },
  { slug: 'polar-bar-chart-generator', category: 'charts', icon: '🎯', component: 'PolarBarChartGenerator' },
  { slug: 'parallel-chart-generator', category: 'charts', icon: '📊', component: 'ParallelChartGenerator' },
  { slug: 'bubble-chart-generator', category: 'charts', icon: '🫧', component: 'BubbleChartGenerator' },
  { slug: 'tree-chart-generator', category: 'charts', icon: '🌳', component: 'TreeChartGenerator' },
  { slug: 'theme-river-generator', category: 'charts', icon: '🌊', component: 'ThemeRiverGenerator' },
  { slug: 'gantt-chart-generator', category: 'charts', icon: '📅', component: 'GanttChartGenerator' },
  { slug: 'venn-diagram-generator', category: 'charts', icon: '🔵', component: 'VennDiagramGenerator' },
  { slug: 'timeline-chart-generator', category: 'charts', icon: '⏳', component: 'TimelineChartGenerator' },

  // Batch 35 - New Chart Tools from 67tool.com (新增图表工具)
  { slug: 'nightingale-rose-chart-generator', category: 'charts', icon: '🌹', component: 'NightingaleRoseChartGenerator' },
  { slug: 'grouped-bar-chart-generator', category: 'charts', icon: '📊', component: 'GroupedBarChartGenerator' },
  { slug: 'stacked-bar-chart-generator', category: 'charts', icon: '📊', component: 'StackedBarChartGenerator' },
  { slug: 'grouped-line-chart-generator', category: 'charts', icon: '📈', component: 'GroupedLineChartGenerator' },
  { slug: 'step-line-chart-generator', category: 'charts', icon: '📶', component: 'StepLineChartGenerator' },
  { slug: 'waterfall-chart-generator', category: 'charts', icon: '💧', component: 'WaterfallChartGenerator' },
  { slug: 'stacked-area-chart-generator', category: 'charts', icon: '📉', component: 'StackedAreaChartGenerator' },
  { slug: 'positive-negative-bar-chart-generator', category: 'charts', icon: '📊', component: 'PositiveNegativeBarChartGenerator' },

  // Batch 36 - New Chart Tools (新增图表工具)
  { slug: 'percentage-stacked-bar-chart-generator', category: 'charts', icon: '📊', component: 'PercentageStackedBarChartGenerator' },
  { slug: 'mixed-chart-generator', category: 'charts', icon: '📈', component: 'MixedChartGenerator' },
  { slug: 'ring-progress-chart-generator', category: 'charts', icon: '⭕', component: 'RingProgressChartGenerator' },
  { slug: 'liquid-fill-chart-generator', category: 'charts', icon: '💧', component: 'LiquidFillChartGenerator' },
  { slug: 'multi-ring-chart-generator', category: 'charts', icon: '🎯', component: 'MultiRingChartGenerator' },
  { slug: 'half-doughnut-chart-generator', category: 'charts', icon: '🌙', component: 'HalfDoughnutChartGenerator' },
  { slug: 'nested-pie-chart-generator', category: 'charts', icon: '🥧', component: 'NestedPieChartGenerator' },
  { slug: 'pictorial-bar-chart-generator', category: 'charts', icon: '📊', component: 'PictorialBarChartGenerator' },

  // Batch 37 - New Popular Tools (热门低竞争工具)
  { slug: 'env-parser', category: 'development', icon: '📄', component: 'EnvParser' },
  { slug: 'json-schema-generator', category: 'development', icon: '📋', component: 'JsonSchemaGenerator' },
  { slug: 'time-calculator', category: 'converters', icon: '⏱️', component: 'TimeCalculator' },
  { slug: 'batch-timestamp-converter', category: 'converters', icon: '📅', component: 'BatchTimestampConverter' },
  { slug: 'regex-visualizer', category: 'development', icon: '🔍', component: 'RegexVisualizer' },
  { slug: 'crontab-calendar', category: 'development', icon: '📆', component: 'CrontabCalendar' },
  { slug: 'fake-data-generator', category: 'generators', icon: '🎭', component: 'FakeDataGenerator' },

  // Batch 38 - New Image Tools (新增图片工具)
  { slug: 'image-collage', category: 'image', icon: '🖼️', component: 'ImageCollage' },
  { slug: 'image-splitter', category: 'image', icon: '✂️', component: 'ImageSplitter' },
  { slug: 'image-rounder', category: 'image', icon: '⭕', component: 'ImageRounder' },
  { slug: 'image-border', category: 'image', icon: '🖼️', component: 'ImageBorder' },
  { slug: 'image-flip-rotate', category: 'image', icon: '🔄', component: 'ImageFlipRotate' },
  { slug: 'image-adjustment', category: 'image', icon: '🎨', component: 'ImageAdjustment' },
  { slug: 'image-frosted-glass', category: 'image', icon: '🌫️', component: 'ImageFrostedGlass' },
  { slug: 'image-to-ico', category: 'image', icon: '🎯', component: 'ImageToIco' },
  { slug: 'gif-maker', category: 'image', icon: '🎬', component: 'GifMaker' },
  { slug: 'gif-splitter', category: 'image', icon: '📽️', component: 'GifSplitter' },
  { slug: 'gif-compressor', category: 'image', icon: '📦', component: 'GifCompressor' },
  { slug: 'image-to-webp', category: 'image', icon: '🌐', component: 'ImageToWebp' },
  { slug: 'exif-viewer', category: 'image', icon: '📷', component: 'ExifViewer' },
  { slug: 'color-extractor', category: 'image', icon: '🎨', component: 'ColorExtractor' },

  // Batch 39 - Office Tools (办公工具)
  { slug: 'invoice-generator', category: 'office', icon: '🧾', component: 'InvoiceGenerator' },
  { slug: 'resume-builder', category: 'office', icon: '📋', component: 'ResumeBuilder' },
  { slug: 'signature-pad', category: 'office', icon: '✍️', component: 'SignaturePad' },
  { slug: 'pomodoro-timer', category: 'office', icon: '🍅', component: 'PomodoroTimer' },
  { slug: 'meeting-notes', category: 'office', icon: '📝', component: 'MeetingNotes' },
  { slug: 'business-days-calculator', category: 'office', icon: '📅', component: 'BusinessDaysCalculator' },
  { slug: 'salary-calculator', category: 'office', icon: '💰', component: 'SalaryCalculator' },

  // Batch 40 - Excel & PDF Tools (Excel 和 PDF 工具)
  { slug: 'excel-to-json', category: 'office', icon: '📊', component: 'ExcelToJson' },
  { slug: 'json-to-excel', category: 'office', icon: '📑', component: 'JsonToExcel' },
  { slug: 'excel-viewer', category: 'office', icon: '👁️', component: 'ExcelViewer' },
  { slug: 'excel-merger', category: 'office', icon: '🔗', component: 'ExcelMerger' },
  { slug: 'pdf-to-image', category: 'office', icon: '🖼️', component: 'PdfToImage' },
  { slug: 'image-to-pdf', category: 'office', icon: '📄', component: 'ImageToPdf' },
  { slug: 'pdf-merger', category: 'office', icon: '📎', component: 'PdfMerger' },
  { slug: 'pdf-splitter', category: 'office', icon: '✂️', component: 'PdfSplitter' },
  { slug: 'pdf-compressor', category: 'office', icon: '📦', component: 'PdfCompressor' },
  { slug: 'pdf-rotator', category: 'office', icon: '🔄', component: 'PdfRotator' },

  // Batch 41 - New Utility Tools (新实用工具)
  { slug: 'markdown-editor', category: 'text', icon: '📝', component: 'MarkdownEditor' },
  { slug: 'world-clock', category: 'office', icon: '🌍', component: 'WorldClock' },
  { slug: 'stopwatch', category: 'office', icon: '⏱️', component: 'Stopwatch' },
  { slug: 'countdown-timer', category: 'office', icon: '⏳', component: 'CountdownTimer' },
  { slug: 'note-pad', category: 'office', icon: '📒', component: 'NotePad' },

  // Batch 42 - Document Converter Tools (文档转换工具)
  { slug: 'pdf-to-text', category: 'office', icon: '📄', component: 'PdfToText' },
  { slug: 'word-to-txt', category: 'office', icon: '📝', component: 'WordToTxt' },
  { slug: 'word-to-html', category: 'office', icon: '🌐', component: 'WordToHtml' },
  { slug: 'excel-to-csv', category: 'office', icon: '📊', component: 'ExcelToCsv' },
  { slug: 'csv-to-excel', category: 'office', icon: '📑', component: 'CsvToExcel' },

  // Batch 43 - Popular Calculator Tools (热门计算器工具)
  { slug: 'loan-calculator', category: 'math', icon: '💰', component: 'LoanCalculator', popular: true },
  { slug: 'bmi-calculator', category: 'math', icon: '⚖️', component: 'BmiCalculator', popular: true },
  { slug: 'age-calculator', category: 'math', icon: '🎂', component: 'AgeCalculator' },
  { slug: 'tip-calculator', category: 'math', icon: '💵', component: 'TipCalculator' },
  { slug: 'discount-calculator', category: 'math', icon: '🏷️', component: 'DiscountCalculator' },
  { slug: 'compound-interest-calculator', category: 'math', icon: '📈', component: 'CompoundInterestCalculator' },
  { slug: 'binary-calculator', category: 'math', icon: '01', component: 'BinaryCalculator' },
  { slug: 'hex-calculator', category: 'math', icon: '0x', component: 'HexCalculator' },
  { slug: 'ip-subnet-calculator', category: 'network', icon: '🌐', component: 'IpSubnetCalculator' },
  { slug: 'aspect-ratio-calculator-enhanced', category: 'math', icon: '📐', component: 'AspectRatioCalculatorEnhanced' },

  // Batch 44 - Text & Utility Tools (文本和实用工具)
  { slug: 'chinese-lorem-ipsum', category: 'generators', icon: '中', component: 'ChineseLoremIpsum' },
  { slug: 'text-to-image', category: 'image', icon: '🖼️', component: 'TextToImage' },
  { slug: 'text-to-handwriting', category: 'image', icon: '✍️', component: 'TextToHandwriting' },
  { slug: 'screen-resolution-tester', category: 'development', icon: '🖥️', component: 'ScreenResolutionTester' },
  { slug: 'keyboard-tester', category: 'development', icon: '⌨️', component: 'KeyboardTester' },
  { slug: 'typing-speed-test', category: 'text', icon: '⌨️', component: 'TypingSpeedTest' },
  { slug: 'morse-code-player', category: 'encoding', icon: '📻', component: 'MorseCodePlayer' },

  // Batch 45 - Popular Tools Batch 3 (欧美流行工具第三批)
  // Finance Tools
  { slug: 'currency-converter', category: 'finance', icon: '💱', component: 'CurrencyConverter' },
  { slug: 'roi-calculator', category: 'finance', icon: '📈', component: 'RoiCalculator' },
  { slug: 'mortgage-calculator', category: 'finance', icon: '🏠', component: 'MortgageCalculator' },
  { slug: 'tax-calculator', category: 'finance', icon: '🧾', component: 'TaxCalculator' },
  // Health Tools
  { slug: 'calorie-calculator', category: 'lifestyle', icon: '🔥', component: 'CalorieCalculator' },
  { slug: 'water-intake-calculator', category: 'lifestyle', icon: '💧', component: 'WaterIntakeCalculator' },
  { slug: 'sleep-calculator', category: 'lifestyle', icon: '😴', component: 'SleepCalculator' },
  { slug: 'due-date-calculator', category: 'lifestyle', icon: '👶', component: 'DueDateCalculator' },
  // Entertainment Tools
  { slug: 'love-calculator', category: 'fun', icon: '❤️', component: 'LoveCalculator' },
  { slug: 'decision-wheel', category: 'fun', icon: '🎡', component: 'DecisionWheel' },
  { slug: 'name-generator', category: 'fun', icon: '📛', component: 'NameGenerator' },
  { slug: 'random-picker', category: 'fun', icon: '🎯', component: 'RandomPicker' },
  { slug: 'coin-flipper', category: 'fun', icon: '🪙', component: 'CoinFlipper' },
  { slug: 'dice-roller', category: 'fun', icon: '🎲', component: 'DiceRoller' },
  { slug: 'team-generator', category: 'fun', icon: '👥', component: 'TeamGenerator' },
  // Daily Calculators
  { slug: 'countdown-days-calculator', category: 'lifestyle', icon: '📅', component: 'CountdownDaysCalculator' },
  { slug: 'fuel-cost-calculator', category: 'lifestyle', icon: '⛽', component: 'FuelCostCalculator' },
  { slug: 'electricity-cost-calculator', category: 'lifestyle', icon: '⚡', component: 'ElectricityCostCalculator' },
  { slug: 'gpa-calculator', category: 'math', icon: '🎓', component: 'GpaCalculator' },
  { slug: 'pace-calculator', category: 'lifestyle', icon: '🏃', component: 'PaceCalculator' },
  // Size Converters
  { slug: 'shoe-size-converter', category: 'converters', icon: '👟', component: 'ShoeSizeConverter' },
  { slug: 'ring-size-calculator', category: 'converters', icon: '💍', component: 'RingSizeCalculator' },
  { slug: 'bra-size-calculator', category: 'converters', icon: '👙', component: 'BraSizeCalculator' },
  // Home Improvement
  { slug: 'concrete-calculator', category: 'math', icon: '🧱', component: 'ConcreteCalculator' },
  { slug: 'paint-calculator', category: 'math', icon: '🎨', component: 'PaintCalculator' },
  { slug: 'tile-calculator', category: 'math', icon: '🔲', component: 'TileCalculator' },
  // Social Media Tools
  { slug: 'instagram-font-generator', category: 'text', icon: '📸', component: 'InstagramFontGenerator' },
  { slug: 'social-media-size-guide', category: 'image', icon: '📱', component: 'SocialMediaSizeGuide' },
  // SEO/Content Tools
  { slug: 'keyword-density-checker', category: 'text', icon: '🔑', component: 'KeywordDensityChecker' },
  { slug: 'text-summarizer', category: 'text', icon: '📝', component: 'TextSummarizer' },
  { slug: 'paraphrase-tool', category: 'text', icon: '🔄', component: 'ParaphraseTool' },
  // Development Tools
  { slug: 'graphql-formatter', category: 'development', icon: '◈', component: 'GraphqlFormatter' },
  { slug: 'code-screenshot-generator', category: 'development', icon: '📷', component: 'CodeScreenshotGenerator' },
  { slug: 'number-system-converter', category: 'converters', icon: '🔢', component: 'NumberSystemConverter' },
  { slug: 'subnet-calculator-enhanced', category: 'network', icon: '🌐', component: 'SubnetCalculatorEnhanced' },

  // Batch 46 - European Popular Tools (欧洲热门工具)
  { slug: 'iban-validator', category: 'finance', icon: '🏦', component: 'IbanValidator' },
  { slug: 'vat-calculator', category: 'finance', icon: '💶', component: 'VatCalculator' },
  { slug: 'carbon-footprint-calculator', category: 'lifestyle', icon: '🌱', component: 'CarbonFootprintCalculator' },
  { slug: 'gdpr-consent-generator', category: 'generators', icon: '🔒', component: 'GdprConsentGenerator' },
  { slug: 'metric-imperial-converter', category: 'converters', icon: '📏', component: 'MetricImperialConverter' },
  { slug: 'bic-swift-lookup', category: 'finance', icon: '🏧', component: 'BicSwiftLookup' },

  // Batch 47 - Global Popular Tools (全球热门工具)
  { slug: 'email-validator', category: 'network', icon: '📧', component: 'EmailValidator' },
  { slug: 'phone-formatter', category: 'text', icon: '📱', component: 'PhoneFormatter' },
  { slug: 'credit-card-validator', category: 'finance', icon: '💳', component: 'CreditCardValidator' },
  { slug: 'color-blindness-simulator', category: 'development', icon: '👁️', component: 'ColorBlindnessSimulator' },
  { slug: 'aspect-ratio-resizer', category: 'image', icon: '📐', component: 'AspectRatioResizer' },
  { slug: 'markdown-to-pdf', category: 'office', icon: '📄', component: 'MarkdownToPdf' },

  // Batch 48 - Popular Online Tools (热门在线工具)
  { slug: 'speech-timer', category: 'office', icon: '🎤', component: 'SpeechTimer' },
  { slug: 'habit-tracker', category: 'lifestyle', icon: '✅', component: 'HabitTracker' },
  { slug: 'flip-text', category: 'text', icon: '🔄', component: 'FlipText' },
  { slug: 'strikethrough-text', category: 'text', icon: '✂️', component: 'StrikethroughText' },
  { slug: 'small-text-generator', category: 'text', icon: '🔤', component: 'SmallTextGenerator' },
  { slug: 'binary-to-text', category: 'encoding', icon: '01', component: 'BinaryToText' },
  { slug: 'roman-numeral-converter', category: 'converters', icon: 'Ⅳ', component: 'RomanNumeralConverter' },
  { slug: 'fraction-calculator', category: 'math', icon: '½', component: 'FractionCalculator' },
  { slug: 'percentage-change-calculator', category: 'math', icon: '📊', component: 'PercentageChangeCalculator' },
  { slug: 'random-color-generator', category: 'generators', icon: '🎨', component: 'RandomColorGenerator' },

  // Batch 49 - Popular Word & Text Tools (热门文字工具)
  { slug: 'anagram-solver', category: 'text', icon: '🔀', component: 'AnagramSolver' },
  { slug: 'word-unscrambler', category: 'text', icon: '🧩', component: 'WordUnscrambler' },
  { slug: 'text-to-pdf', category: 'converters', icon: '📄', component: 'TextToPdf' },
  { slug: 'unit-price-calculator', category: 'math', icon: '💲', component: 'UnitPriceCalculator' },
  { slug: 'bionic-reading-converter', category: 'text', icon: '👁️', component: 'BionicReadingConverter' },
  { slug: 'palindrome-checker', category: 'text', icon: '🔁', component: 'PalindromeChecker' },
  { slug: 'character-map', category: 'text', icon: '🔣', component: 'CharacterMap' },
  { slug: 'text-repeater', category: 'text', icon: '🔂', component: 'TextRepeater' },
  { slug: 'fake-name-generator', category: 'generators', icon: '👤', component: 'FakeNameGenerator' },
  { slug: 'invisible-character-generator', category: 'generators', icon: '👻', component: 'InvisibleCharacterGenerator' },

  // Batch 50 - Popular Overseas Developer Tools (海外热门开发工具)
  { slug: 'json-to-proto', category: 'converters', icon: '📦', component: 'JsonToProto' },
  { slug: 'svg-to-png', category: 'image', icon: '🖼️', component: 'SvgToPng' },
  { slug: 'webp-to-png', category: 'image', icon: '🔄', component: 'WebpToPng' },
  { slug: 'png-to-svg', category: 'image', icon: '✨', component: 'PngToSvg' },
  { slug: 'html-to-pdf', category: 'converters', icon: '📄', component: 'HtmlToPdf' },
  { slug: 'json-to-table', category: 'converters', icon: '📊', component: 'JsonToTable' },
  { slug: 'yaml-validator', category: 'development', icon: '✅', component: 'YamlValidator' },
  { slug: 'xml-validator', category: 'development', icon: '✅', component: 'XmlValidator' },
  { slug: 'css-to-tailwind', category: 'converters', icon: '🎨', component: 'CssToTailwind' },
  { slug: 'tailwind-to-css', category: 'converters', icon: '🎨', component: 'TailwindToCss' },
  { slug: 'svg-editor', category: 'image', icon: '✏️', component: 'SvgEditor' },
  { slug: 'json-to-form', category: 'generators', icon: '📝', component: 'JsonToForm' },
  { slug: 'api-tester', category: 'development', icon: '🔌', component: 'ApiTester' },
  { slug: 'jwt-debugger', category: 'security', icon: '🔐', component: 'JwtDebugger' },
  { slug: 'csp-generator', category: 'security', icon: '🛡️', component: 'CspGenerator' },
  { slug: 'sri-hash-generator', category: 'security', icon: '🔒', component: 'SriHashGenerator' },
  { slug: 'cors-tester', category: 'network', icon: '🌐', component: 'CorsTester' },
  { slug: 'json-to-zod', category: 'converters', icon: '⚡', component: 'JsonToZod' },
  { slug: 'typescript-to-json', category: 'converters', icon: '🔷', component: 'TypescriptToJson' },
  { slug: 'markdown-to-slides', category: 'converters', icon: '📽️', component: 'MarkdownToSlides' },

  // Batch 51 - Config Generators (配置生成器)
  { slug: 'dockerfile-generator', category: 'development', icon: '🐳', component: 'DockerfileGenerator' },
  { slug: 'eslint-config-generator', category: 'development', icon: '📏', component: 'EslintConfigGenerator' },
  { slug: 'prettier-config-generator', category: 'development', icon: '✨', component: 'PrettierConfigGenerator' },
  { slug: 'tsconfig-generator', category: 'development', icon: '🔷', component: 'TsconfigGenerator' },
  { slug: 'editorconfig-generator', category: 'development', icon: '📝', component: 'EditorconfigGenerator' },
  // Batch 51 - Doc Generators (文档生成器)
  { slug: 'github-readme-generator', category: 'generators', icon: '📖', component: 'GithubReadmeGenerator' },
  { slug: 'changelog-generator', category: 'generators', icon: '📋', component: 'ChangelogGenerator' },
  { slug: 'license-generator', category: 'generators', icon: '📜', component: 'LicenseGenerator' },
  // Batch 51 - Cipher Tools (加密工具)
  { slug: 'rot13-encoder', category: 'encoding', icon: '🔄', component: 'Rot13Encoder' },
  { slug: 'caesar-cipher', category: 'encoding', icon: '🏛️', component: 'CaesarCipher' },
  { slug: 'vigenere-cipher', category: 'encoding', icon: '🔐', component: 'VigenereCipher' },
  // Batch 51 - Checksum Tool (校验和工具)
  { slug: 'checksum-verifier', category: 'security', icon: '✅', component: 'ChecksumVerifier' },
  // Batch 51 - Finance Calculators (财务计算器)
  { slug: 'inflation-calculator', category: 'finance', icon: '📈', component: 'InflationCalculator' },
  { slug: 'break-even-calculator', category: 'finance', icon: '⚖️', component: 'BreakEvenCalculator' },
  { slug: 'margin-calculator', category: 'finance', icon: '💹', component: 'MarginCalculator' },
  { slug: 'markup-calculator', category: 'finance', icon: '🏷️', component: 'MarkupCalculator' },
  // Batch 51 - Social Tools (社交工具)
  { slug: 'hashtag-generator', category: 'generators', icon: '#️⃣', component: 'HashtagGenerator' },
  { slug: 'email-signature-generator', category: 'generators', icon: '✉️', component: 'EmailSignatureGenerator' },
  // Batch 52 - CSS Design Generators (CSS 设计生成器)
  { slug: 'glassmorphism-generator', category: 'generators', icon: '🪟', component: 'GlassmorphismGenerator' },
  { slug: 'neumorphism-generator', category: 'generators', icon: '🔘', component: 'NeumorphismGenerator' },
  { slug: 'blob-generator', category: 'generators', icon: '💧', component: 'BlobGenerator' },
  { slug: 'wave-generator', category: 'generators', icon: '🌊', component: 'WaveGenerator' },
  { slug: 'mesh-gradient-generator', category: 'generators', icon: '🎨', component: 'MeshGradientGenerator' },
  { slug: 'noise-texture-generator', category: 'generators', icon: '📺', component: 'NoiseTextureGenerator' },
  // Batch 52 - Developer Tools (开发者工具)
  { slug: 'commit-message-generator', category: 'development', icon: '💬', component: 'CommitMessageGenerator' },
  // Batch 52 - Calculators (计算器)
  { slug: 'bandwidth-calculator', category: 'network', icon: '📶', component: 'BandwidthCalculator' },
  { slug: 'data-transfer-calculator', category: 'network', icon: '⏱️', component: 'DataTransferCalculator' },
  { slug: 'pixel-density-calculator', category: 'image', icon: '🔍', component: 'PixelDensityCalculator' },
  { slug: 'dpi-calculator', category: 'image', icon: '🖨️', component: 'DpiCalculator' },

  // Batch 53 - AI/Text Processing Tools (AI/文本处理工具) - 最新添加
  { slug: 'ai-text-humanizer', category: 'text', icon: '🤖', component: 'AiTextHumanizer' },
  { slug: 'text-spinner', category: 'text', icon: '🔄', component: 'TextSpinner' },
  { slug: 'readability-checker', category: 'text', icon: '📖', component: 'ReadabilityChecker' },
  { slug: 'grammar-checker', category: 'text', icon: '✓', component: 'GrammarChecker' },
  // Batch 53 - Code Formatters (代码格式化工具)
  { slug: 'typescript-playground', category: 'development', icon: '🔷', component: 'TypescriptPlayground' },
  { slug: 'python-formatter', category: 'development', icon: '🐍', component: 'PythonFormatter' },
  { slug: 'go-formatter', category: 'development', icon: '🐹', component: 'GoFormatter' },
  { slug: 'rust-formatter', category: 'development', icon: '🦀', component: 'RustFormatter' },
  { slug: 'yaml-formatter', category: 'development', icon: '📄', component: 'YamlFormatter' },
  // Batch 53 - CSS Design Tools (CSS 设计工具)
  { slug: 'text-shadow-generator', category: 'generators', icon: '🌑', component: 'TextShadowGenerator' },
  { slug: 'svg-pattern-generator', category: 'generators', icon: '🔲', component: 'SvgPatternGenerator' },
  { slug: 'css-triangle-generator', category: 'generators', icon: '▲', component: 'CssTriangleGenerator' },
  { slug: 'aspect-ratio-box-generator', category: 'generators', icon: '📐', component: 'AspectRatioBoxGenerator' },
  // Batch 53 - Calculators (计算器工具)
  { slug: 'screen-time-calculator', category: 'math', icon: '📱', component: 'ScreenTimeCalculator' },
  { slug: 'typing-time-calculator', category: 'math', icon: '⌨️', component: 'TypingTimeCalculator' },
  { slug: 'download-time-calculator', category: 'math', icon: '⬇️', component: 'DownloadTimeCalculator' },
  // Batch 53 - Data Converters (数据转换工具)
  { slug: 'ical-parser', category: 'converters', icon: '📅', component: 'IcalParser' },
  { slug: 'vcard-parser', category: 'converters', icon: '👤', component: 'VcardParser' },
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
  { id: 'charts', icon: '📈' },
  { id: 'office', icon: '📄' },
  { id: 'lifestyle', icon: '🏃' },
  { id: 'finance', icon: '💰' },
  { id: 'fun', icon: '🎮' },
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
