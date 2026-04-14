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
  { slug: 'json-formatter', category: 'encoding', icon: 'braces', component: 'JsonFormatter', popular: true },
  { slug: 'base64', category: 'encoding', icon: 'lock', component: 'Base64', popular: true },
  { slug: 'url-encoder', category: 'network', icon: 'link', component: 'UrlEncoder', popular: true },
  { slug: 'html-encoder', category: 'encoding', icon: 'file-code', component: 'HtmlEncoder', popular: true },
  { slug: 'jwt-decoder', category: 'encoding', icon: 'key-round', component: 'JwtDecoder', popular: true },
  { slug: 'xml-formatter', category: 'encoding', icon: 'file-code-2', component: 'XmlFormatter', popular: true },
  { slug: 'unicode-converter', category: 'encoding', icon: 'languages', component: 'UnicodeConverter', popular: true },

  // Generators
  { slug: 'uuid-generator', category: 'generators', icon: 'fingerprint', component: 'UuidGenerator', popular: true },
  { slug: 'password-generator', category: 'security', icon: 'key', component: 'PasswordGenerator', popular: true },
  { slug: 'hash-generator', category: 'security', icon: 'hash', component: 'HashGenerator', popular: true },
  { slug: 'qr-generator', category: 'image', icon: 'qr-code', component: 'QrGenerator', popular: true },
  { slug: 'lorem-ipsum', category: 'generators', icon: 'text', component: 'LoremIpsum', popular: true },
  { slug: 'cron-generator', category: 'generators', icon: 'clock', component: 'CronGenerator' },
  { slug: 'gradient-generator', category: 'generators', icon: 'palette', component: 'GradientGenerator', popular: true },

  // Text Tools
  { slug: 'word-counter', category: 'text', icon: 'text-cursor-input', component: 'WordCounter', popular: true },
  { slug: 'case-converter', category: 'text', icon: 'a-large-small', component: 'CaseConverter', popular: true },
  { slug: 'markdown-preview', category: 'text', icon: 'book-open', component: 'MarkdownPreview', popular: true },
  { slug: 'diff-checker', category: 'text', icon: 'git-compare', component: 'DiffChecker', popular: true },
  { slug: 'text-to-slug', category: 'text', icon: 'minus', component: 'TextToSlug', popular: true },
  { slug: 'chinese-converter', category: 'text', icon: 'languages', component: 'ChineseConverter', popular: true },
  { slug: 'pinyin-converter', category: 'text', icon: 'languages', component: 'PinyinConverter' },

  // Converters
  { slug: 'color-converter', category: 'converters', icon: 'pipette', component: 'ColorConverter', popular: true },
  { slug: 'timestamp-converter', category: 'converters', icon: 'clock', component: 'TimestampConverter', popular: true },
  { slug: 'json-to-csv', category: 'converters', icon: 'table-2', component: 'JsonToCsv', popular: true },
  { slug: 'image-to-base64', category: 'image', icon: 'image', component: 'ImageToBase64', popular: true },
  { slug: 'number-base-converter', category: 'math', icon: 'calculator', component: 'NumberBaseConverter', popular: true },
  { slug: 'unit-converter', category: 'converters', icon: 'scale', component: 'UnitConverter', popular: true },

  // Development
  { slug: 'regex-tester', category: 'development', icon: 'search', component: 'RegexTester', popular: true },
  { slug: 'json-path-tester', category: 'development', icon: 'route', component: 'JsonPathTester' },
  { slug: 'code-minifier', category: 'development', icon: 'minimize-2', component: 'CodeMinifier', popular: true },
  { slug: 'sql-formatter', category: 'development', icon: 'database', component: 'SqlFormatter', popular: true },
  { slug: 'color-picker', category: 'development', icon: 'crosshair', component: 'ColorPicker', popular: true },
  { slug: 'aspect-ratio', category: 'math', icon: 'ratio', component: 'AspectRatioCalculator' },
  { slug: 'css-beautifier', category: 'development', icon: 'paintbrush', component: 'CssBeautifier' },
  { slug: 'js-beautifier', category: 'development', icon: 'file-code', component: 'JsBeautifier' },
  { slug: 'html-preview', category: 'development', icon: 'eye', component: 'HtmlPreview', popular: true },
  { slug: 'ip-lookup', category: 'network', icon: 'globe', component: 'IpLookup', popular: true },
  { slug: 'morse-code', category: 'encoding', icon: 'radio', component: 'MorseCode' },

  // Batch 5 tools
  { slug: 'random-generator', category: 'generators', icon: 'dice-5', component: 'RandomGenerator' },
  { slug: 'text-reverser', category: 'text', icon: 'refresh-cw', component: 'TextReverser' },
  { slug: 'line-counter', category: 'text', icon: 'list-ordered', component: 'LineCounter' },
  { slug: 'string-escape', category: 'encoding', icon: 'shield', component: 'StringEscape' },
  { slug: 'yaml-json', category: 'converters', icon: 'file-json', component: 'YamlJson' },

  // Batch 6 tools
  { slug: 'date-calculator', category: 'converters', icon: 'calendar', component: 'DateCalculator' },
  { slug: 'text-deduplicator', category: 'text', icon: 'filter', component: 'TextDeduplicator' },
  { slug: 'color-blender', category: 'converters', icon: 'blend', component: 'ColorBlender' },
  { slug: 'json-sorter', category: 'encoding', icon: 'arrow-up-down', component: 'JsonSorter' },
  { slug: 'placeholder-image', category: 'image', icon: 'image-plus', component: 'PlaceholderImage' },

  // Batch 7 tools
  { slug: 'text-encryption', category: 'security', icon: 'lock-keyhole', component: 'TextEncryption', popular: true },
  { slug: 'file-hash', category: 'security', icon: 'file-lock-2', component: 'FileHash' },
  { slug: 'html-table-generator', category: 'generators', icon: 'table', component: 'HtmlTableGenerator' },
  { slug: 'json-schema-validator', category: 'development', icon: 'check-circle', component: 'JsonSchemaValidator', popular: true },
  { slug: 'regex-patterns', category: 'development', icon: 'book-open', component: 'RegexPatterns' },

  // Batch 8 tools
  { slug: 'byte-counter', category: 'text', icon: 'ruler', component: 'ByteCounter' },
  { slug: 'json-to-typescript', category: 'converters', icon: 'file-type', component: 'JsonToTypescript', popular: true },
  { slug: 'svg-optimizer', category: 'image', icon: 'pen-tool', component: 'SvgOptimizer' },
  { slug: 'text-to-binary', category: 'encoding', icon: 'binary', component: 'TextToBinary' },
  { slug: 'markdown-to-html', category: 'converters', icon: 'code', component: 'MarkdownToHtml', popular: true },

  // Batch 9 tools
  { slug: 'html-minifier', category: 'development', icon: 'minimize-2', component: 'HtmlMinifier' },
  { slug: 'json-diff', category: 'development', icon: 'git-compare', component: 'JsonDiff', popular: true },
  { slug: 'base32', category: 'encoding', icon: 'hash', component: 'Base32' },
  { slug: 'epoch-converter', category: 'converters', icon: 'timer', component: 'EpochConverter' },
  { slug: 'css-unit-converter', category: 'converters', icon: 'ruler', component: 'CssUnitConverter' },

  // Batch 10 tools
  { slug: 'text-statistics', category: 'text', icon: 'bar-chart-2', component: 'TextStatistics', popular: true },
  { slug: 'hex-editor', category: 'encoding', icon: 'binary', component: 'HexEditor' },
  { slug: 'color-palette', category: 'generators', icon: 'paintbrush', component: 'ColorPalette', popular: true },
  { slug: 'http-status', category: 'network', icon: 'server', component: 'HttpStatus' },
  { slug: 'json-to-yaml', category: 'converters', icon: 'file-json-2', component: 'JsonToYaml', popular: true },
  { slug: 'data-uri', category: 'encoding', icon: 'binary', component: 'DataUri' },
  { slug: 'text-compare', category: 'text', icon: 'type', component: 'TextCompare' },
  { slug: 'json-to-go', category: 'converters', icon: 'arrow-left-right', component: 'JsonToGo' },
  { slug: 'html-to-jsx', category: 'converters', icon: 'arrow-left-right', component: 'HtmlToJsx' },
  { slug: 'chmod-calculator', category: 'math', icon: 'calculator', component: 'ChmodCalculator' },

  // Batch 11 tools
  { slug: 'barcode-generator', category: 'image', icon: 'image', component: 'BarcodeGenerator' },
  { slug: 'text-to-speech', category: 'text', icon: 'type', component: 'TextToSpeech' },
  { slug: 'url-parser', category: 'network', icon: 'globe', component: 'UrlParser' },
  { slug: 'json-to-xml', category: 'converters', icon: 'arrow-left-right', component: 'JsonToXml' },
  { slug: 'text-wrapper', category: 'text', icon: 'type', component: 'TextWrapper' },
  { slug: 'csv-to-json', category: 'converters', icon: 'arrow-left-right', component: 'CsvToJson' },
  { slug: 'html-entity', category: 'encoding', icon: 'binary', component: 'HtmlEntityConverter' },
  { slug: 'number-formatter', category: 'converters', icon: 'arrow-left-right', component: 'NumberFormatter' },

  // Batch 12 - New Security Tools
  { slug: 'hmac-generator', category: 'security', icon: 'shield-check', component: 'HmacGenerator' },
  { slug: 'password-strength', category: 'security', icon: 'shield-check', component: 'PasswordStrength' },
  { slug: 'totp-generator', category: 'security', icon: 'shield-check', component: 'TotpGenerator' },

  // Batch 13 - New Network Tools
  { slug: 'user-agent-parser', category: 'network', icon: 'globe', component: 'UserAgentParser' },
  { slug: 'cidr-calculator', category: 'network', icon: 'globe', component: 'CidrCalculator', popular: true },
  { slug: 'http-header-parser', category: 'network', icon: 'globe', component: 'HttpHeaderParser' },

  // Batch 14 - New Math Tools
  { slug: 'percentage-calculator', category: 'math', icon: 'calculator', component: 'PercentageCalculator', popular: true },
  { slug: 'statistics-calculator', category: 'math', icon: 'calculator', component: 'StatisticsCalculator' },
  { slug: 'scientific-calculator', category: 'math', icon: 'calculator', component: 'ScientificCalculator', popular: true },

  // Batch 15 - New Text Tools
  { slug: 'text-sorter', category: 'text', icon: 'type', component: 'TextSorter' },
  { slug: 'text-extractor', category: 'text', icon: 'type', component: 'TextExtractor' },
  { slug: 'emoji-picker', category: 'text', icon: 'type', component: 'EmojiPicker' },

  // Batch 16 - New Converter Tools
  { slug: 'json-to-sql', category: 'converters', icon: 'arrow-left-right', component: 'JsonToSql' },
  { slug: 'toml-json', category: 'converters', icon: 'arrow-left-right', component: 'TomlJson' },
  { slug: 'json-to-java', category: 'converters', icon: 'arrow-left-right', component: 'JsonToJava' },
  { slug: 'json-to-python', category: 'converters', icon: 'arrow-left-right', component: 'JsonToPython' },
  { slug: 'json-to-kotlin', category: 'converters', icon: 'arrow-left-right', component: 'JsonToKotlin' },

  // Batch 17 - Image Tools
  { slug: 'image-compressor', category: 'image', icon: 'image', component: 'ImageCompressor', popular: true },
  { slug: 'image-converter', category: 'image', icon: 'image', component: 'ImageConverter', popular: true },
  { slug: 'favicon-generator', category: 'image', icon: 'image', component: 'FaviconGenerator', popular: true },
  { slug: 'image-cropper', category: 'image', icon: 'image', component: 'ImageCropper' },

  // Batch 18 - Development Tools
  { slug: 'gitignore-generator', category: 'development', icon: 'file-x', component: 'GitignoreGenerator', popular: true },
  { slug: 'docker-compose-generator', category: 'development', icon: 'box', component: 'DockerComposeGenerator' },
  { slug: 'package-json-generator', category: 'development', icon: 'package', component: 'PackageJsonGenerator' },

  // Batch 19 - New Popular Tools
  { slug: 'json-minifier', category: 'encoding', icon: 'binary', component: 'JsonMinifier' },
  { slug: 'timezone-converter', category: 'converters', icon: 'arrow-left-right', component: 'TimezoneConverter', popular: true },
  { slug: 'color-contrast-checker', category: 'development', icon: 'contrast', component: 'ColorContrastChecker' },
  { slug: 'markdown-table-generator', category: 'generators', icon: 'zap', component: 'MarkdownTableGenerator' },
  { slug: 'base58', category: 'encoding', icon: 'hash', component: 'Base58' },

  // Batch 20 - SEO & Development Tools
  { slug: 'meta-tag-generator', category: 'generators', icon: 'zap', component: 'MetaTagGenerator' },
  { slug: 'robots-txt-generator', category: 'generators', icon: 'zap', component: 'RobotsTxtGenerator' },
  { slug: 'opengraph-preview', category: 'development', icon: 'share-2', component: 'OpenGraphPreview' },
  { slug: 'css-grid-generator', category: 'generators', icon: 'grid-3x3', component: 'CssGridGenerator' },
  { slug: 'css-flexbox-generator', category: 'generators', icon: 'layout-grid', component: 'CssFlexboxGenerator' },
  { slug: 'jwt-generator', category: 'security', icon: 'shield-check', component: 'JwtGenerator' },
  { slug: 'cron-explainer', category: 'development', icon: 'calendar-search', component: 'CronExplainer' },
  { slug: 'json-to-graphql', category: 'converters', icon: 'arrow-left-right', component: 'JsonToGraphql' },
  { slug: 'sql-to-mongo', category: 'converters', icon: 'arrow-left-right', component: 'SqlToMongo' },

  // Batch 21 - Code & CSS Tools
  { slug: 'json-to-csharp', category: 'converters', icon: 'arrow-left-right', component: 'JsonToCsharp' },
  { slug: 'json-to-rust', category: 'converters', icon: 'arrow-left-right', component: 'JsonToRust' },
  { slug: 'json-to-swift', category: 'converters', icon: 'arrow-left-right', component: 'JsonToSwift' },
  { slug: 'css-minifier', category: 'development', icon: 'file-digit', component: 'CssMinifier' },
  { slug: 'js-minifier', category: 'development', icon: 'zap', component: 'JsMinifier' },
  { slug: 'box-shadow-generator', category: 'generators', icon: 'copy', component: 'BoxShadowGenerator' },
  { slug: 'border-radius-generator', category: 'generators', icon: 'circle', component: 'BorderRadiusGenerator' },
  { slug: 'text-to-ascii-art', category: 'text', icon: 'type', component: 'TextToAsciiArt' },

  // Batch 22 - Utility Tools
  { slug: 'color-shades-generator', category: 'generators', icon: 'zap', component: 'ColorShadesGenerator' },
  { slug: 'json-flattener', category: 'encoding', icon: 'binary', component: 'JsonFlattener' },
  { slug: 'base85', category: 'encoding', icon: 'hash', component: 'Base85' },
  { slug: 'html-to-markdown', category: 'converters', icon: 'arrow-left-right', component: 'HtmlToMarkdown' },
  { slug: 'regex-generator', category: 'development', icon: 'wand-2', component: 'RegexGenerator' },
  { slug: 'url-shortener-preview', category: 'network', icon: 'globe', component: 'UrlShortenerPreview' },

  // Batch 23 - More Utility Tools
  { slug: 'json-viewer', category: 'encoding', icon: 'binary', component: 'JsonViewer' },
  { slug: 'xml-to-json', category: 'converters', icon: 'arrow-left-right', component: 'XmlToJson' },
  { slug: 'ip-address-generator', category: 'network', icon: 'globe', component: 'IpAddressGenerator' },
  { slug: 'css-gradient-text', category: 'generators', icon: 'type', component: 'CssGradientText' },
  { slug: 'sitemap-generator', category: 'generators', icon: 'zap', component: 'SitemapGenerator' },

  // Batch 24 - Advanced Tools
  { slug: 'json-to-php', category: 'converters', icon: 'arrow-left-right', component: 'JsonToPhp' },
  { slug: 'css-filter-generator', category: 'generators', icon: 'zap', component: 'CssFilterGenerator' },
  { slug: 'text-diff-patch', category: 'text', icon: 'type', component: 'TextDiffPatch' },
  { slug: 'encoding-detector', category: 'encoding', icon: 'binary', component: 'EncodingDetector' },

  // Batch 25 - More Tools
  { slug: 'css-clip-path-generator', category: 'generators', icon: 'zap', component: 'CssClipPathGenerator' },
  { slug: 'uuid-validator', category: 'development', icon: 'check-square', component: 'UuidValidator' },
  { slug: 'text-hash-comparator', category: 'security', icon: 'shield-check', component: 'TextHashComparator' },
  { slug: 'json-path-finder', category: 'development', icon: 'compass', component: 'JsonPathFinder' },
  { slug: 'canvas-drawing', category: 'image', icon: 'image', component: 'CanvasDrawing' },

  // Batch 26 - New Tools
  { slug: 'json-escape', category: 'encoding', icon: 'binary', component: 'JsonEscape' },
  { slug: 'css-animation-generator', category: 'generators', icon: 'zap', component: 'CssAnimationGenerator' },
  { slug: 'text-case-counter', category: 'text', icon: 'type', component: 'TextCaseCounter' },
  { slug: 'dns-lookup', category: 'network', icon: 'globe', component: 'DnsLookup' },
  { slug: 'image-resizer', category: 'image', icon: 'image', component: 'ImageResizer' },

  // Batch 27 - Popular Overseas Tools
  { slug: 'ssl-checker', category: 'network', icon: 'globe', component: 'SslChecker', popular: true },
  { slug: 'whois-lookup', category: 'network', icon: 'globe', component: 'WhoisLookup' },
  { slug: 'port-reference', category: 'network', icon: 'globe', component: 'PortScanner' },
  { slug: 'privacy-policy-generator', category: 'generators', icon: 'zap', component: 'PrivacyPolicyGenerator' },
  { slug: 'terms-generator', category: 'generators', icon: 'zap', component: 'TermsGenerator' },
  { slug: 'cookie-policy-generator', category: 'generators', icon: 'zap', component: 'CookiePolicyGenerator' },
  { slug: 'json-to-tsv', category: 'converters', icon: 'arrow-left-right', component: 'JsonToTsv' },
  { slug: 'csv-viewer', category: 'converters', icon: 'arrow-left-right', component: 'CsvViewer' },
  { slug: 'htaccess-generator', category: 'development', icon: 'settings-2', component: 'HtaccessGenerator' },
  { slug: 'nginx-config-generator', category: 'development', icon: 'server-cog', component: 'NginxConfigGenerator' },
  { slug: 'curl-converter', category: 'development', icon: 'terminal', component: 'CurlConverter' },
  { slug: 'reading-time-calculator', category: 'text', icon: 'type', component: 'ReadingTimeCalculator' },

  // Batch 28 - New Popular Tools
  { slug: 'open-graph-generator', category: 'generators', icon: 'zap', component: 'OpenGraphGenerator' },
  { slug: 'twitter-card-generator', category: 'generators', icon: 'zap', component: 'TwitterCardGenerator' },
  { slug: 'mime-type-lookup', category: 'development', icon: 'file-search-2', component: 'MimeTypeLookup' },
  { slug: 'http-status-codes', category: 'development', icon: 'server', component: 'HttpStatusCodes' },
  { slug: 'string-obfuscator', category: 'security', icon: 'shield-check', component: 'StringObfuscator' },
  { slug: 'text-cleaner', category: 'text', icon: 'type', component: 'TextCleaner' },
  { slug: 'list-randomizer', category: 'text', icon: 'type', component: 'ListRandomizer' },
  { slug: 'sql-generator', category: 'development', icon: 'database-plus', component: 'SqlGenerator' },

  // Batch 29 - New Tools from toolfk.com
  { slug: 'htaccess-to-nginx', category: 'development', icon: 'repeat', component: 'HtaccessToNginx' },
  { slug: 'js-obfuscator', category: 'security', icon: 'shield-check', component: 'JsObfuscator' },
  { slug: 'image-watermark', category: 'image', icon: 'image', component: 'ImageWatermark' },
  { slug: 'svg-to-image', category: 'image', icon: 'image', component: 'SvgToImage' },
  { slug: 'hex-base64-converter', category: 'encoding', icon: 'binary', component: 'HexBase64Converter' },

  // Batch 30 - More Tools
  { slug: 'pdf-to-base64', category: 'encoding', icon: 'binary', component: 'PdfToBase64' },
  { slug: 'audio-to-base64', category: 'encoding', icon: 'binary', component: 'AudioToBase64' },
  { slug: 'video-to-base64', category: 'encoding', icon: 'binary', component: 'VideoToBase64' },
  { slug: 'file-size-calculator', category: 'converters', icon: 'arrow-left-right', component: 'FileSizeCalculator' },
  { slug: 'ascii-table', category: 'encoding', icon: 'binary', component: 'AsciiTable' },

  // Batch 31 - More Tools
  { slug: 'text-to-hex', category: 'encoding', icon: 'binary', component: 'TextToHex' },
  { slug: 'css-variables-generator', category: 'development', icon: 'variable', component: 'CssVariablesGenerator' },
  { slug: 'lorem-picsum', category: 'image', icon: 'image', component: 'LoremPicsum' },
  { slug: 'regex-escape', category: 'development', icon: 'lock', component: 'RegexEscape' },
  { slug: 'html-to-text', category: 'text', icon: 'type', component: 'HtmlToText' },
  { slug: 'binary-to-decimal', category: 'math', icon: 'calculator', component: 'BinaryToDecimal' },
  { slug: 'octal-converter', category: 'math', icon: 'calculator', component: 'OctalConverter' },
  { slug: 'text-to-nato', category: 'text', icon: 'type', component: 'TextToNato' },
  { slug: 'crc32-calculator', category: 'development', icon: 'hash', component: 'Crc32Calculator' },
  { slug: 'mac-address-generator', category: 'network', icon: 'globe', component: 'MacAddressGenerator' },

  // Batch 32 - New Popular Tools (to reach 200)
  { slug: 'ip-validator', category: 'network', icon: 'globe', component: 'IpValidator' },
  { slug: 'json-merger', category: 'encoding', icon: 'binary', component: 'JsonMerger' },
  { slug: 'text-template', category: 'text', icon: 'type', component: 'TextTemplate' },
  { slug: 'base-calculator', category: 'math', icon: 'calculator', component: 'BaseCalculator' },
  { slug: 'color-name-finder', category: 'converters', icon: 'arrow-left-right', component: 'ColorNameFinder' },
  { slug: 'char-frequency', category: 'text', icon: 'type', component: 'CharFrequency' },
  { slug: 'json-to-dart', category: 'converters', icon: 'arrow-left-right', component: 'JsonToDart' },
  { slug: 'sql-to-json', category: 'converters', icon: 'arrow-left-right', component: 'SqlToJson' },

  // Batch 33 - Chart Tools (数据图表工具)
  { slug: 'bar-chart-generator', category: 'charts', icon: 'bar-chart-3', component: 'BarChartGenerator' },
  { slug: 'line-chart-generator', category: 'charts', icon: 'trending-up', component: 'LineChartGenerator' },
  { slug: 'pie-chart-generator', category: 'charts', icon: 'pie-chart', component: 'PieChartGenerator' },
  { slug: 'radar-chart-generator', category: 'charts', icon: 'radar', component: 'RadarChartGenerator' },
  { slug: 'scatter-chart-generator', category: 'charts', icon: 'scatter-chart', component: 'ScatterChartGenerator' },
  { slug: 'area-chart-generator', category: 'charts', icon: 'area-chart', component: 'AreaChartGenerator' },
  { slug: 'funnel-chart-generator', category: 'charts', icon: 'filter', component: 'FunnelChartGenerator' },
  { slug: 'gauge-chart-generator', category: 'charts', icon: 'gauge', component: 'GaugeChartGenerator' },
  { slug: 'heatmap-chart-generator', category: 'charts', icon: 'grid-3x3', component: 'HeatmapChartGenerator' },
  { slug: 'treemap-chart-generator', category: 'charts', icon: 'layout-grid', component: 'TreemapChartGenerator' },

  // Batch 34 - New Chart Tools (新增图表工具)
  { slug: 'doughnut-chart-generator', category: 'charts', icon: 'circle-dot', component: 'DoughnutChartGenerator' },
  { slug: 'sankey-chart-generator', category: 'charts', icon: 'git-branch', component: 'SankeyChartGenerator' },
  { slug: 'sunburst-chart-generator', category: 'charts', icon: 'sun', component: 'SunburstChartGenerator' },
  { slug: 'candlestick-chart-generator', category: 'charts', icon: 'candlestick-chart', component: 'CandlestickChartGenerator' },
  { slug: 'boxplot-chart-generator', category: 'charts', icon: 'box-select', component: 'BoxplotChartGenerator' },
  { slug: 'wordcloud-generator', category: 'charts', icon: 'bar-chart-3', component: 'WordCloudGenerator' },
  { slug: 'graph-chart-generator', category: 'charts', icon: 'network', component: 'GraphChartGenerator' },
  { slug: 'calendar-heatmap-generator', category: 'charts', icon: 'calendar-days', component: 'CalendarHeatmapGenerator' },
  { slug: 'polar-bar-chart-generator', category: 'charts', icon: 'circle', component: 'PolarBarChartGenerator' },
  { slug: 'parallel-chart-generator', category: 'charts', icon: 'align-horizontal-justify-center', component: 'ParallelChartGenerator' },
  { slug: 'bubble-chart-generator', category: 'charts', icon: 'circle-dot', component: 'BubbleChartGenerator' },
  { slug: 'tree-chart-generator', category: 'charts', icon: 'git-fork', component: 'TreeChartGenerator' },
  { slug: 'theme-river-generator', category: 'charts', icon: 'waves', component: 'ThemeRiverGenerator' },
  { slug: 'gantt-chart-generator', category: 'charts', icon: 'gantt-chart', component: 'GanttChartGenerator' },
  { slug: 'venn-diagram-generator', category: 'charts', icon: 'circle', component: 'VennDiagramGenerator' },
  { slug: 'timeline-chart-generator', category: 'charts', icon: 'clock', component: 'TimelineChartGenerator' },

  // Batch 35 - New Chart Tools from 67tool.com (新增图表工具)
  { slug: 'nightingale-rose-chart-generator', category: 'charts', icon: 'flower-2', component: 'NightingaleRoseChartGenerator' },
  { slug: 'grouped-bar-chart-generator', category: 'charts', icon: 'bar-chart-3', component: 'GroupedBarChartGenerator' },
  { slug: 'stacked-bar-chart-generator', category: 'charts', icon: 'bar-chart-4', component: 'StackedBarChartGenerator' },
  { slug: 'grouped-line-chart-generator', category: 'charts', icon: 'trending-up', component: 'GroupedLineChartGenerator' },
  { slug: 'step-line-chart-generator', category: 'charts', icon: 'trending-up', component: 'StepLineChartGenerator' },
  { slug: 'waterfall-chart-generator', category: 'charts', icon: 'bar-chart-2', component: 'WaterfallChartGenerator' },
  { slug: 'stacked-area-chart-generator', category: 'charts', icon: 'area-chart', component: 'StackedAreaChartGenerator' },
  { slug: 'positive-negative-bar-chart-generator', category: 'charts', icon: 'bar-chart-horizontal', component: 'PositiveNegativeBarChartGenerator' },

  // Batch 36 - New Chart Tools (新增图表工具)
  { slug: 'percentage-stacked-bar-chart-generator', category: 'charts', icon: 'percent', component: 'PercentageStackedBarChartGenerator' },
  { slug: 'mixed-chart-generator', category: 'charts', icon: 'combine', component: 'MixedChartGenerator' },
  { slug: 'ring-progress-chart-generator', category: 'charts', icon: 'loader', component: 'RingProgressChartGenerator' },
  { slug: 'liquid-fill-chart-generator', category: 'charts', icon: 'droplets', component: 'LiquidFillChartGenerator' },
  { slug: 'multi-ring-chart-generator', category: 'charts', icon: 'target', component: 'MultiRingChartGenerator' },
  { slug: 'half-doughnut-chart-generator', category: 'charts', icon: 'semicircle', component: 'HalfDoughnutChartGenerator' },
  { slug: 'nested-pie-chart-generator', category: 'charts', icon: 'pie-chart', component: 'NestedPieChartGenerator' },
  { slug: 'pictorial-bar-chart-generator', category: 'charts', icon: 'bar-chart-horizontal', component: 'PictorialBarChartGenerator' },

  // Batch 37 - New Popular Tools (热门低竞争工具)
  { slug: 'env-parser', category: 'development', icon: 'binary', component: 'EnvParser' },
  { slug: 'json-schema-generator', category: 'development', icon: 'braces', component: 'JsonSchemaGenerator' },
  { slug: 'time-calculator', category: 'converters', icon: 'arrow-left-right', component: 'TimeCalculator' },
  { slug: 'batch-timestamp-converter', category: 'converters', icon: 'arrow-left-right', component: 'BatchTimestampConverter' },
  { slug: 'regex-visualizer', category: 'development', icon: 'eye', component: 'RegexVisualizer' },
  { slug: 'crontab-calendar', category: 'development', icon: 'calendar-days', component: 'CrontabCalendar' },
  { slug: 'fake-data-generator', category: 'generators', icon: 'zap', component: 'FakeDataGenerator' },

  // Batch 38 - New Image Tools (新增图片工具)
  { slug: 'image-collage', category: 'image', icon: 'image', component: 'ImageCollage' },
  { slug: 'image-splitter', category: 'image', icon: 'image', component: 'ImageSplitter' },
  { slug: 'image-rounder', category: 'image', icon: 'image', component: 'ImageRounder' },
  { slug: 'image-border', category: 'image', icon: 'image', component: 'ImageBorder' },
  { slug: 'image-flip-rotate', category: 'image', icon: 'image', component: 'ImageFlipRotate' },
  { slug: 'image-adjustment', category: 'image', icon: 'image', component: 'ImageAdjustment' },
  { slug: 'image-frosted-glass', category: 'image', icon: 'image', component: 'ImageFrostedGlass' },
  { slug: 'image-to-ico', category: 'image', icon: 'image', component: 'ImageToIco' },
  { slug: 'gif-maker', category: 'image', icon: 'image', component: 'GifMaker' },
  { slug: 'gif-splitter', category: 'image', icon: 'image', component: 'GifSplitter' },
  { slug: 'gif-compressor', category: 'image', icon: 'image', component: 'GifCompressor' },
  { slug: 'image-to-webp', category: 'image', icon: 'image', component: 'ImageToWebp' },
  { slug: 'exif-viewer', category: 'image', icon: 'image', component: 'ExifViewer' },
  { slug: 'color-extractor', category: 'image', icon: 'image', component: 'ColorExtractor' },

  // Batch 39 - Office Tools (办公工具)
  { slug: 'invoice-generator', category: 'office', icon: 'file-text', component: 'InvoiceGenerator' },
  { slug: 'resume-builder', category: 'office', icon: 'file-text', component: 'ResumeBuilder' },
  { slug: 'signature-pad', category: 'office', icon: 'file-text', component: 'SignaturePad' },
  { slug: 'pomodoro-timer', category: 'office', icon: 'file-text', component: 'PomodoroTimer' },
  { slug: 'meeting-notes', category: 'office', icon: 'file-text', component: 'MeetingNotes' },
  { slug: 'business-days-calculator', category: 'office', icon: 'file-text', component: 'BusinessDaysCalculator' },
  { slug: 'salary-calculator', category: 'office', icon: 'file-text', component: 'SalaryCalculator' },

  // Batch 40 - Excel & PDF Tools (Excel 和 PDF 工具)
  { slug: 'excel-to-json', category: 'office', icon: 'file-text', component: 'ExcelToJson' },
  { slug: 'json-to-excel', category: 'office', icon: 'file-text', component: 'JsonToExcel' },
  { slug: 'excel-viewer', category: 'office', icon: 'file-text', component: 'ExcelViewer' },
  { slug: 'excel-merger', category: 'office', icon: 'file-text', component: 'ExcelMerger' },
  { slug: 'pdf-to-image', category: 'office', icon: 'file-text', component: 'PdfToImage' },
  { slug: 'image-to-pdf', category: 'office', icon: 'file-text', component: 'ImageToPdf' },
  { slug: 'pdf-merger', category: 'office', icon: 'file-text', component: 'PdfMerger' },
  { slug: 'pdf-splitter', category: 'office', icon: 'file-text', component: 'PdfSplitter' },
  { slug: 'pdf-compressor', category: 'office', icon: 'file-text', component: 'PdfCompressor' },
  { slug: 'pdf-rotator', category: 'office', icon: 'file-text', component: 'PdfRotator' },

  // Batch 41 - New Utility Tools (新实用工具)
  { slug: 'markdown-editor', category: 'text', icon: 'type', component: 'MarkdownEditor' },
  { slug: 'world-clock', category: 'office', icon: 'file-text', component: 'WorldClock' },
  { slug: 'stopwatch', category: 'office', icon: 'file-text', component: 'Stopwatch' },
  { slug: 'countdown-timer', category: 'office', icon: 'file-text', component: 'CountdownTimer' },
  { slug: 'note-pad', category: 'office', icon: 'file-text', component: 'NotePad' },

  // Batch 42 - Document Converter Tools (文档转换工具)
  { slug: 'pdf-to-text', category: 'office', icon: 'file-text', component: 'PdfToText' },
  { slug: 'word-to-txt', category: 'office', icon: 'file-text', component: 'WordToTxt' },
  { slug: 'word-to-html', category: 'office', icon: 'file-text', component: 'WordToHtml' },
  { slug: 'excel-to-csv', category: 'office', icon: 'file-text', component: 'ExcelToCsv' },
  { slug: 'csv-to-excel', category: 'office', icon: 'file-text', component: 'CsvToExcel' },

  // Batch 43 - Popular Calculator Tools (热门计算器工具)
  { slug: 'loan-calculator', category: 'math', icon: 'calculator', component: 'LoanCalculator', popular: true },
  { slug: 'bmi-calculator', category: 'math', icon: 'calculator', component: 'BmiCalculator', popular: true },
  { slug: 'age-calculator', category: 'math', icon: 'calculator', component: 'AgeCalculator' },
  { slug: 'tip-calculator', category: 'math', icon: 'calculator', component: 'TipCalculator' },
  { slug: 'discount-calculator', category: 'math', icon: 'calculator', component: 'DiscountCalculator' },
  { slug: 'compound-interest-calculator', category: 'math', icon: 'calculator', component: 'CompoundInterestCalculator' },
  { slug: 'binary-calculator', category: 'math', icon: 'calculator', component: 'BinaryCalculator' },
  { slug: 'hex-calculator', category: 'math', icon: 'calculator', component: 'HexCalculator' },
  { slug: 'ip-subnet-calculator', category: 'network', icon: 'globe', component: 'IpSubnetCalculator' },
  { slug: 'aspect-ratio-calculator-enhanced', category: 'math', icon: 'calculator', component: 'AspectRatioCalculatorEnhanced' },

  // Batch 44 - Text & Utility Tools (文本和实用工具)
  { slug: 'chinese-lorem-ipsum', category: 'generators', icon: 'zap', component: 'ChineseLoremIpsum' },
  { slug: 'text-to-image', category: 'image', icon: 'image', component: 'TextToImage' },
  { slug: 'text-to-handwriting', category: 'image', icon: 'image', component: 'TextToHandwriting' },
  { slug: 'screen-resolution-tester', category: 'development', icon: 'monitor', component: 'ScreenResolutionTester' },
  { slug: 'keyboard-tester', category: 'development', icon: 'keyboard', component: 'KeyboardTester' },
  { slug: 'typing-speed-test', category: 'text', icon: 'type', component: 'TypingSpeedTest' },
  { slug: 'morse-code-player', category: 'encoding', icon: 'binary', component: 'MorseCodePlayer' },

  // Batch 45 - Popular Tools Batch 3 (欧美流行工具第三批)
  // Finance Tools
  { slug: 'currency-converter', category: 'finance', icon: 'wallet', component: 'CurrencyConverter' },
  { slug: 'roi-calculator', category: 'finance', icon: 'wallet', component: 'RoiCalculator' },
  { slug: 'mortgage-calculator', category: 'finance', icon: 'wallet', component: 'MortgageCalculator' },
  { slug: 'tax-calculator', category: 'finance', icon: 'wallet', component: 'TaxCalculator' },
  // Health Tools
  { slug: 'calorie-calculator', category: 'lifestyle', icon: 'heart', component: 'CalorieCalculator' },
  { slug: 'water-intake-calculator', category: 'lifestyle', icon: 'heart', component: 'WaterIntakeCalculator' },
  { slug: 'sleep-calculator', category: 'lifestyle', icon: 'heart', component: 'SleepCalculator' },
  { slug: 'due-date-calculator', category: 'lifestyle', icon: 'heart', component: 'DueDateCalculator' },
  // Entertainment Tools
  { slug: 'love-calculator', category: 'fun', icon: 'gamepad-2', component: 'LoveCalculator' },
  { slug: 'decision-wheel', category: 'fun', icon: 'gamepad-2', component: 'DecisionWheel' },
  { slug: 'name-generator', category: 'fun', icon: 'gamepad-2', component: 'NameGenerator' },
  { slug: 'random-picker', category: 'fun', icon: 'gamepad-2', component: 'RandomPicker' },
  { slug: 'coin-flipper', category: 'fun', icon: 'gamepad-2', component: 'CoinFlipper' },
  { slug: 'dice-roller', category: 'fun', icon: 'gamepad-2', component: 'DiceRoller' },
  { slug: 'team-generator', category: 'fun', icon: 'gamepad-2', component: 'TeamGenerator' },
  // Daily Calculators
  { slug: 'countdown-days-calculator', category: 'lifestyle', icon: 'heart', component: 'CountdownDaysCalculator' },
  { slug: 'fuel-cost-calculator', category: 'lifestyle', icon: 'heart', component: 'FuelCostCalculator' },
  { slug: 'electricity-cost-calculator', category: 'lifestyle', icon: 'heart', component: 'ElectricityCostCalculator' },
  { slug: 'gpa-calculator', category: 'math', icon: 'calculator', component: 'GpaCalculator' },
  { slug: 'pace-calculator', category: 'lifestyle', icon: 'heart', component: 'PaceCalculator' },
  // Size Converters
  { slug: 'shoe-size-converter', category: 'converters', icon: 'arrow-left-right', component: 'ShoeSizeConverter' },
  { slug: 'ring-size-calculator', category: 'converters', icon: 'arrow-left-right', component: 'RingSizeCalculator' },
  { slug: 'bra-size-calculator', category: 'converters', icon: 'arrow-left-right', component: 'BraSizeCalculator' },
  // Home Improvement
  { slug: 'concrete-calculator', category: 'math', icon: 'calculator', component: 'ConcreteCalculator' },
  { slug: 'paint-calculator', category: 'math', icon: 'calculator', component: 'PaintCalculator' },
  { slug: 'tile-calculator', category: 'math', icon: 'calculator', component: 'TileCalculator' },
  // Social Media Tools
  { slug: 'instagram-font-generator', category: 'text', icon: 'type', component: 'InstagramFontGenerator' },
  { slug: 'social-media-size-guide', category: 'image', icon: 'image', component: 'SocialMediaSizeGuide' },
  // SEO/Content Tools
  { slug: 'keyword-density-checker', category: 'text', icon: 'type', component: 'KeywordDensityChecker' },
  { slug: 'text-summarizer', category: 'text', icon: 'type', component: 'TextSummarizer' },
  { slug: 'paraphrase-tool', category: 'text', icon: 'type', component: 'ParaphraseTool' },
  // Development Tools
  { slug: 'graphql-formatter', category: 'development', icon: 'code-2', component: 'GraphqlFormatter' },
  { slug: 'code-screenshot-generator', category: 'development', icon: 'code-2', component: 'CodeScreenshotGenerator' },
  { slug: 'number-system-converter', category: 'converters', icon: 'arrow-left-right', component: 'NumberSystemConverter' },
  { slug: 'subnet-calculator-enhanced', category: 'network', icon: 'globe', component: 'SubnetCalculatorEnhanced' },

  // Batch 46 - European Popular Tools (欧洲热门工具)
  { slug: 'iban-validator', category: 'finance', icon: 'wallet', component: 'IbanValidator' },
  { slug: 'vat-calculator', category: 'finance', icon: 'wallet', component: 'VatCalculator' },
  { slug: 'carbon-footprint-calculator', category: 'lifestyle', icon: 'heart', component: 'CarbonFootprintCalculator' },
  { slug: 'gdpr-consent-generator', category: 'generators', icon: 'zap', component: 'GdprConsentGenerator' },
  { slug: 'metric-imperial-converter', category: 'converters', icon: 'arrow-left-right', component: 'MetricImperialConverter' },
  { slug: 'bic-swift-lookup', category: 'finance', icon: 'wallet', component: 'BicSwiftLookup' },

  // Batch 47 - Global Popular Tools (全球热门工具)
  { slug: 'email-validator', category: 'network', icon: 'globe', component: 'EmailValidator' },
  { slug: 'phone-formatter', category: 'text', icon: 'type', component: 'PhoneFormatter' },
  { slug: 'credit-card-validator', category: 'finance', icon: 'wallet', component: 'CreditCardValidator' },
  { slug: 'color-blindness-simulator', category: 'development', icon: 'code-2', component: 'ColorBlindnessSimulator' },
  { slug: 'aspect-ratio-resizer', category: 'image', icon: 'image', component: 'AspectRatioResizer' },
  { slug: 'markdown-to-pdf', category: 'office', icon: 'file-text', component: 'MarkdownToPdf' },

  // Batch 48 - Popular Online Tools (热门在线工具)
  { slug: 'speech-timer', category: 'office', icon: 'file-text', component: 'SpeechTimer' },
  { slug: 'habit-tracker', category: 'lifestyle', icon: 'heart', component: 'HabitTracker' },
  { slug: 'flip-text', category: 'text', icon: 'type', component: 'FlipText' },
  { slug: 'strikethrough-text', category: 'text', icon: 'type', component: 'StrikethroughText' },
  { slug: 'small-text-generator', category: 'text', icon: 'type', component: 'SmallTextGenerator' },
  { slug: 'binary-to-text', category: 'encoding', icon: 'binary', component: 'BinaryToText' },
  { slug: 'roman-numeral-converter', category: 'converters', icon: 'arrow-left-right', component: 'RomanNumeralConverter' },
  { slug: 'fraction-calculator', category: 'math', icon: 'calculator', component: 'FractionCalculator' },
  { slug: 'percentage-change-calculator', category: 'math', icon: 'calculator', component: 'PercentageChangeCalculator' },
  { slug: 'random-color-generator', category: 'generators', icon: 'zap', component: 'RandomColorGenerator' },

  // Batch 49 - Popular Word & Text Tools (热门文字工具)
  { slug: 'anagram-solver', category: 'text', icon: 'type', component: 'AnagramSolver' },
  { slug: 'word-unscrambler', category: 'text', icon: 'type', component: 'WordUnscrambler' },
  { slug: 'text-to-pdf', category: 'converters', icon: 'arrow-left-right', component: 'TextToPdf' },
  { slug: 'unit-price-calculator', category: 'math', icon: 'calculator', component: 'UnitPriceCalculator' },
  { slug: 'bionic-reading-converter', category: 'text', icon: 'type', component: 'BionicReadingConverter' },
  { slug: 'palindrome-checker', category: 'text', icon: 'type', component: 'PalindromeChecker' },
  { slug: 'character-map', category: 'text', icon: 'type', component: 'CharacterMap' },
  { slug: 'text-repeater', category: 'text', icon: 'type', component: 'TextRepeater' },
  { slug: 'fake-name-generator', category: 'generators', icon: 'zap', component: 'FakeNameGenerator' },
  { slug: 'invisible-character-generator', category: 'generators', icon: 'zap', component: 'InvisibleCharacterGenerator' },

  // Batch 50 - Popular Overseas Developer Tools (海外热门开发工具)
  { slug: 'json-to-proto', category: 'converters', icon: 'arrow-left-right', component: 'JsonToProto' },
  { slug: 'svg-to-png', category: 'image', icon: 'image', component: 'SvgToPng' },
  { slug: 'webp-to-png', category: 'image', icon: 'image', component: 'WebpToPng' },
  { slug: 'png-to-svg', category: 'image', icon: 'image', component: 'PngToSvg' },
  { slug: 'html-to-pdf', category: 'converters', icon: 'arrow-left-right', component: 'HtmlToPdf' },
  { slug: 'json-to-table', category: 'converters', icon: 'arrow-left-right', component: 'JsonToTable' },
  { slug: 'yaml-validator', category: 'development', icon: 'code-2', component: 'YamlValidator' },
  { slug: 'xml-validator', category: 'development', icon: 'code-2', component: 'XmlValidator' },
  { slug: 'css-to-tailwind', category: 'converters', icon: 'arrow-left-right', component: 'CssToTailwind' },
  { slug: 'tailwind-to-css', category: 'converters', icon: 'arrow-left-right', component: 'TailwindToCss' },
  { slug: 'svg-editor', category: 'image', icon: 'image', component: 'SvgEditor' },
  { slug: 'json-to-form', category: 'generators', icon: 'zap', component: 'JsonToForm' },
  { slug: 'api-tester', category: 'development', icon: 'code-2', component: 'ApiTester' },
  { slug: 'jwt-debugger', category: 'security', icon: 'shield-check', component: 'JwtDebugger' },
  { slug: 'csp-generator', category: 'security', icon: 'shield-check', component: 'CspGenerator' },
  { slug: 'sri-hash-generator', category: 'security', icon: 'shield-check', component: 'SriHashGenerator' },
  { slug: 'cors-tester', category: 'network', icon: 'globe', component: 'CorsTester' },
  { slug: 'json-to-zod', category: 'converters', icon: 'arrow-left-right', component: 'JsonToZod' },
  { slug: 'typescript-to-json', category: 'converters', icon: 'arrow-left-right', component: 'TypescriptToJson' },
  { slug: 'markdown-to-slides', category: 'converters', icon: 'arrow-left-right', component: 'MarkdownToSlides' },

  // Batch 51 - Config Generators (配置生成器)
  { slug: 'dockerfile-generator', category: 'development', icon: 'code-2', component: 'DockerfileGenerator' },
  { slug: 'eslint-config-generator', category: 'development', icon: 'code-2', component: 'EslintConfigGenerator' },
  { slug: 'prettier-config-generator', category: 'development', icon: 'code-2', component: 'PrettierConfigGenerator' },
  { slug: 'tsconfig-generator', category: 'development', icon: 'code-2', component: 'TsconfigGenerator' },
  { slug: 'editorconfig-generator', category: 'development', icon: 'code-2', component: 'EditorconfigGenerator' },
  // Batch 51 - Doc Generators (文档生成器)
  { slug: 'github-readme-generator', category: 'generators', icon: 'zap', component: 'GithubReadmeGenerator' },
  { slug: 'changelog-generator', category: 'generators', icon: 'zap', component: 'ChangelogGenerator' },
  { slug: 'license-generator', category: 'generators', icon: 'zap', component: 'LicenseGenerator' },
  // Batch 51 - Cipher Tools (加密工具)
  { slug: 'rot13-encoder', category: 'encoding', icon: 'binary', component: 'Rot13Encoder' },
  { slug: 'caesar-cipher', category: 'encoding', icon: 'binary', component: 'CaesarCipher' },
  { slug: 'vigenere-cipher', category: 'encoding', icon: 'binary', component: 'VigenereCipher' },
  // Batch 51 - Checksum Tool (校验和工具)
  { slug: 'checksum-verifier', category: 'security', icon: 'shield-check', component: 'ChecksumVerifier' },
  // Batch 51 - Finance Calculators (财务计算器)
  { slug: 'inflation-calculator', category: 'finance', icon: 'wallet', component: 'InflationCalculator' },
  { slug: 'break-even-calculator', category: 'finance', icon: 'wallet', component: 'BreakEvenCalculator' },
  { slug: 'margin-calculator', category: 'finance', icon: 'wallet', component: 'MarginCalculator' },
  { slug: 'markup-calculator', category: 'finance', icon: 'wallet', component: 'MarkupCalculator' },
  // Batch 51 - Social Tools (社交工具)
  { slug: 'hashtag-generator', category: 'generators', icon: 'zap', component: 'HashtagGenerator' },
  { slug: 'email-signature-generator', category: 'generators', icon: 'zap', component: 'EmailSignatureGenerator' },
  // Batch 52 - CSS Design Generators (CSS 设计生成器)
  { slug: 'glassmorphism-generator', category: 'generators', icon: 'zap', component: 'GlassmorphismGenerator' },
  { slug: 'neumorphism-generator', category: 'generators', icon: 'zap', component: 'NeumorphismGenerator' },
  { slug: 'blob-generator', category: 'generators', icon: 'zap', component: 'BlobGenerator' },
  { slug: 'wave-generator', category: 'generators', icon: 'zap', component: 'WaveGenerator' },
  { slug: 'mesh-gradient-generator', category: 'generators', icon: 'zap', component: 'MeshGradientGenerator' },
  { slug: 'noise-texture-generator', category: 'generators', icon: 'zap', component: 'NoiseTextureGenerator' },
  // Batch 52 - Developer Tools (开发者工具)
  { slug: 'commit-message-generator', category: 'development', icon: 'code-2', component: 'CommitMessageGenerator' },
  // Batch 52 - Calculators (计算器)
  { slug: 'bandwidth-calculator', category: 'network', icon: 'globe', component: 'BandwidthCalculator' },
  { slug: 'data-transfer-calculator', category: 'network', icon: 'globe', component: 'DataTransferCalculator' },
  { slug: 'pixel-density-calculator', category: 'image', icon: 'image', component: 'PixelDensityCalculator' },
  { slug: 'dpi-calculator', category: 'image', icon: 'image', component: 'DpiCalculator' },

  // Batch 53 - AI/Text Processing Tools (AI/文本处理工具) - 最新添加
  { slug: 'ai-text-humanizer', category: 'text', icon: 'type', component: 'AiTextHumanizer' },
  { slug: 'text-spinner', category: 'text', icon: 'type', component: 'TextSpinner' },
  { slug: 'readability-checker', category: 'text', icon: 'type', component: 'ReadabilityChecker' },
  { slug: 'grammar-checker', category: 'text', icon: 'type', component: 'GrammarChecker' },
  // Batch 53 - Code Formatters (代码格式化工具)
  { slug: 'typescript-playground', category: 'development', icon: 'code-2', component: 'TypescriptPlayground' },
  { slug: 'python-formatter', category: 'development', icon: 'code-2', component: 'PythonFormatter' },
  { slug: 'go-formatter', category: 'development', icon: 'code-2', component: 'GoFormatter' },
  { slug: 'rust-formatter', category: 'development', icon: 'code-2', component: 'RustFormatter' },
  { slug: 'yaml-formatter', category: 'development', icon: 'code-2', component: 'YamlFormatter' },
  // Batch 53 - CSS Design Tools (CSS 设计工具)
  { slug: 'text-shadow-generator', category: 'generators', icon: 'zap', component: 'TextShadowGenerator' },
  { slug: 'svg-pattern-generator', category: 'generators', icon: 'zap', component: 'SvgPatternGenerator' },
  { slug: 'css-triangle-generator', category: 'generators', icon: 'zap', component: 'CssTriangleGenerator' },
  { slug: 'aspect-ratio-box-generator', category: 'generators', icon: 'zap', component: 'AspectRatioBoxGenerator' },
  // Batch 53 - Calculators (计算器工具)
  { slug: 'screen-time-calculator', category: 'math', icon: 'calculator', component: 'ScreenTimeCalculator' },
  { slug: 'typing-time-calculator', category: 'math', icon: 'calculator', component: 'TypingTimeCalculator' },
  { slug: 'download-time-calculator', category: 'math', icon: 'calculator', component: 'DownloadTimeCalculator' },
  // Batch 53 - Data Converters (数据转换工具)
  { slug: 'ical-parser', category: 'converters', icon: 'arrow-left-right', component: 'IcalParser' },
  { slug: 'vcard-parser', category: 'converters', icon: 'arrow-left-right', component: 'VcardParser' },

  // Batch 54 - Developer Tools - API and Network Tools (开发者工具 - API 和网络工具)
  { slug: 'curl-to-code-generator', category: 'development', icon: 'terminal', component: 'CurlToCodeGenerator' },
  { slug: 'http-status-code-reference', category: 'network', icon: 'globe', component: 'HttpStatusCodeReference' },
  { slug: 'jwt-payload-decoder', category: 'security', icon: 'shield-check', component: 'JwtPayloadDecoder' },
  { slug: 'base64-image-converter', category: 'image', icon: 'image', component: 'Base64ImageConverter' },
  { slug: 'url-query-string-parser', category: 'network', icon: 'globe', component: 'UrlQueryStringParser' },
  { slug: 'request-header-builder', category: 'development', icon: 'list-plus', component: 'RequestHeaderBuilder' },
  { slug: 'webhook-tester', category: 'development', icon: 'webhook', component: 'WebhookTester' },
  { slug: 'api-response-formatter', category: 'development', icon: 'braces', component: 'ApiResponseFormatter' },

  // Batch 54 - Developer Tools - Code Conversion and Generation (开发者工具 - 代码转换和生成)
  { slug: 'sql-to-mongodb-converter', category: 'development', icon: 'database-zap', component: 'SqlToMongodbConverter' },
  { slug: 'json-to-protobuf-converter', category: 'converters', icon: 'arrow-left-right', component: 'JsonToProtobufConverter' },
  { slug: 'regex-to-code-generator', category: 'development', icon: 'wand-2', component: 'RegexToCodeGenerator' },
  { slug: 'swagger-to-code-generator', category: 'development', icon: 'file-text', component: 'SwaggerToCodeGenerator' },
  { slug: 'database-migration-generator', category: 'development', icon: 'database-backup', component: 'DatabaseMigrationGenerator' },
  { slug: 'environment-variables-generator', category: 'development', icon: 'binary', component: 'EnvironmentVariablesGenerator' },
  { slug: 'docker-compose-generator-advanced', category: 'development', icon: 'code-2', component: 'DockerComposeGeneratorAdvanced' },
  { slug: 'kubernetes-manifest-generator', category: 'development', icon: 'ship', component: 'KubernetesManifestGenerator' },

  // Batch 54 - Developer Tools - Code Analysis and Optimization (开发者工具 - 代码分析和优化)
  { slug: 'code-complexity-analyzer', category: 'development', icon: 'gauge', component: 'CodeComplexityAnalyzer' },
  { slug: 'dependency-vulnerability-checker', category: 'security', icon: 'shield-check', component: 'DependencyVulnerabilityChecker' },
  { slug: 'performance-profiler', category: 'development', icon: 'timer', component: 'PerformanceProfiler' },
  { slug: 'memory-leak-detector', category: 'development', icon: 'activity', component: 'MemoryLeakDetector' },
  { slug: 'code-duplication-finder', category: 'development', icon: 'copy', component: 'CodeDuplicationFinder' },
  { slug: 'unused-imports-finder', category: 'development', icon: 'code-2', component: 'UnusedImportsFinder' },
  { slug: 'dead-code-analyzer', category: 'development', icon: 'code-2', component: 'DeadCodeAnalyzer' },

  // Batch 54 - Developer Tools - Database Tools (开发者工具 - 数据库工具)
  { slug: 'sql-query-optimizer', category: 'development', icon: 'database-zap', component: 'SqlQueryOptimizer' },
  { slug: 'database-schema-visualizer', category: 'development', icon: 'layout', component: 'DatabaseSchemaVisualizer' },
  { slug: 'sql-injection-tester', category: 'security', icon: 'shield-check', component: 'SqlInjectionTester' },
  { slug: 'database-connection-tester', category: 'network', icon: 'globe', component: 'DatabaseConnectionTester' },
  { slug: 'query-execution-planner', category: 'development', icon: 'code-2', component: 'QueryExecutionPlanner' },
  { slug: 'database-backup-scheduler', category: 'development', icon: 'code-2', component: 'DatabaseBackupScheduler' },

  // Batch 54 - Developer Tools - Version Control Tools (开发者工具 - 版本控制工具)
  { slug: 'git-commit-message-generator', category: 'development', icon: 'git-commit', component: 'GitCommitMessageGenerator' },
  { slug: 'git-branch-naming-validator', category: 'development', icon: 'code-2', component: 'GitBranchNamingValidator' },
  { slug: 'merge-conflict-resolver', category: 'development', icon: 'code-2', component: 'MergeConflictResolver' },
  { slug: 'git-history-visualizer', category: 'development', icon: 'history', component: 'GitHistoryVisualizer' },
  { slug: 'changelog-generator-advanced', category: 'generators', icon: 'zap', component: 'ChangelogGeneratorAdvanced' },
  { slug: 'git-tag-manager', category: 'development', icon: 'code-2', component: 'GitTagManager' },

  // Batch 54 - Office Tools - Document and Content Management (办公工具 - 文档和内容管理)
  { slug: 'markdown-to-html-converter', category: 'converters', icon: 'arrow-left-right', component: 'MarkdownToHtmlConverter' },
  { slug: 'document-outline-generator', category: 'generators', icon: 'zap', component: 'DocumentOutlineGenerator' },
  { slug: 'table-of-contents-generator', category: 'generators', icon: 'zap', component: 'TableOfContentsGenerator' },
  { slug: 'document-word-counter', category: 'text', icon: 'type', component: 'DocumentWordCounter' },
  { slug: 'document-formatter', category: 'office', icon: 'file-text', component: 'DocumentFormatter' },
  { slug: 'citation-formatter', category: 'office', icon: 'file-text', component: 'CitationFormatter' },

  // Batch 54 - Office Tools - Project Management Tools (办公工具 - 项目管理工具)
  { slug: 'project-estimation-calculator', category: 'office', icon: 'file-text', component: 'ProjectEstimationCalculator' },
  { slug: 'sprint-velocity-calculator', category: 'office', icon: 'file-text', component: 'SprintVelocityCalculator' },
  { slug: 'resource-allocation-planner', category: 'office', icon: 'file-text', component: 'ResourceAllocationPlanner' },
  { slug: 'project-risk-analyzer', category: 'office', icon: 'file-text', component: 'ProjectRiskAnalyzer' },
  { slug: 'milestone-tracker', category: 'office', icon: 'file-text', component: 'MilestoneTracker' },
  { slug: 'team-capacity-planner', category: 'office', icon: 'file-text', component: 'TeamCapacityPlanner' },

  // Batch 54 - Office Tools - Meeting and Schedule Tools (办公工具 - 会议和日程工具)
  { slug: 'meeting-minutes-generator', category: 'office', icon: 'file-text', component: 'MeetingMinutesGenerator' },
  { slug: 'timezone-meeting-scheduler', category: 'office', icon: 'file-text', component: 'TimezoneMeetingScheduler' },
  { slug: 'meeting-agenda-builder', category: 'office', icon: 'file-text', component: 'MeetingAgendaBuilder' },
  { slug: 'calendar-availability-finder', category: 'office', icon: 'file-text', component: 'CalendarAvailabilityFinder' },
  { slug: 'meeting-room-finder', category: 'office', icon: 'file-text', component: 'MeetingRoomFinder' },

  // Batch 54 - Office Tools - Finance and Budget Tools (办公工具 - 财务和预算工具)
  { slug: 'invoice-template-generator', category: 'finance', icon: 'wallet', component: 'InvoiceTemplateGenerator' },
  { slug: 'expense-report-generator', category: 'finance', icon: 'wallet', component: 'ExpenseReportGenerator' },
  { slug: 'budget-variance-analyzer', category: 'finance', icon: 'wallet', component: 'BudgetVarianceAnalyzer' },
  { slug: 'cost-benefit-analyzer', category: 'finance', icon: 'wallet', component: 'CostBenefitAnalyzer' },
  { slug: 'financial-forecast-calculator', category: 'finance', icon: 'wallet', component: 'FinancialForecastCalculator' },

  // Batch 55 - Popular Tools (热门工具)
  { slug: 'ip-geolocation', category: 'network', icon: 'globe', component: 'IpGeolocation', popular: true },
  { slug: 'screen-recorder', category: 'office', icon: 'file-text', component: 'ScreenRecorder', popular: true },
];

export const categories: { id: ToolCategory; icon: string }[] = [
  { id: 'text', icon: 'type' },
  { id: 'encoding', icon: 'binary' },
  { id: 'generators', icon: 'zap' },
  { id: 'converters', icon: 'arrow-left-right' },
  { id: 'development', icon: 'code-2' },
  { id: 'security', icon: 'shield-check' },
  { id: 'network', icon: 'globe' },
  { id: 'image', icon: 'image' },
  { id: 'math', icon: 'calculator' },
  { id: 'charts', icon: 'bar-chart-3' },
  { id: 'office', icon: 'file-text' },
  { id: 'lifestyle', icon: 'heart' },
  { id: 'finance', icon: 'wallet' },
  { id: 'fun', icon: 'gamepad-2' },
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
