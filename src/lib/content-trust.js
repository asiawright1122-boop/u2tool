/**
 * Shared heuristics for tool-page support content trust.
 *
 * The goal is conservative: catch high-confidence implementation claims that
 * don't line up with this repo's browser-first runtime, and flag medium-risk
 * marketing or backend claims for audit reports.
 */

/**
 * @typedef {{ question?: string, answer?: string }} FaqItem
 * @typedef {{
 *   slug: string,
 *   locale?: string,
 *   name?: string,
 *   description?: string,
 *   detailedDescription?: string,
 *   usageSteps?: string[],
 *   usageExamples?: string[],
 *   faqs?: FaqItem[],
 * }} SupportContentInput
 * @typedef {{
 *   severity: 'high' | 'medium',
 *   code: string,
 *   field: string,
 *   message: string,
 *   excerpt: string,
 * }} ContentTrustIssue
 * @typedef {{
 *   blockSupportContent: boolean,
 *   issues: ContentTrustIssue[],
 *   score: number,
 * }} ContentTrustReport
 * @typedef {{
 *   code: string,
 *   pattern: RegExp,
 *   message: string,
 *   slugs?: string[],
 * }} ContentTrustRule
 */

/** @type {ContentTrustRule[]} */
export const HIGH_CONFIDENCE_SUPPORT_CONTENT_RULES = [
  {
    code: 'imagemagick-runtime',
    pattern: /\bImageMagick\b/i,
    message: 'Mentions ImageMagick-backed processing that the repo does not ship.',
  },
  {
    code: 'gd-library-runtime',
    pattern: /\bGD Library\b/i,
    message: 'Mentions GD Library processing that is not part of the current runtime.',
  },
  {
    code: 'd3-runtime',
    pattern: /\bD3\.js\b/i,
    message: 'Mentions a D3.js chart runtime even though chart tools render through the shared ECharts stack.',
  },
  {
    code: 'svgjs-runtime',
    pattern: /\bSVG\.js\b/i,
    message: 'Mentions an SVG.js rendering stack that is not present in this repo.',
  },
  {
    code: 'webgl-export-claim',
    pattern: /\bWebGL-accelerated\b/i,
    message: 'Claims a WebGL-accelerated rendering path that is not evidenced in the repo.',
  },
  {
    code: 'codec-runtime-claim',
    pattern: /\blibpng\b|\blibjpeg\b|\blibwebp\b/i,
    message: 'Mentions native image codec pipelines that are not part of the browser-first implementation.',
  },
  {
    code: 'parallel-query-threading',
    pattern: /\bparallel query threading\b/i,
    message: 'Claims backend query-threading behavior that is not evidenced in the repo.',
  },
  {
    code: 'authoritative-geolocation',
    pattern: /\bauthoritative server IP geolocation metadata\b/i,
    message: 'Claims advanced DNS response enrichment that is not evidenced in the repo.',
  },
  {
    code: 'word-counter-backend-automata',
    pattern: /\bbackend processes text streams using finite-state automata\b/i,
    message: 'Claims a backend finite-state text engine, but the Word Counter component performs simple browser-side counts.',
    slugs: ['word-counter'],
  },
  {
    code: 'web-workers-claim',
    pattern: /\bWeb Workers implementation\b/i,
    message: 'Claims Web Worker execution that is not evidenced in the current tool implementation.',
    slugs: ['word-counter'],
  },
  {
    code: 'punkt-algorithm-claim',
    pattern: /\bPunkt algorithm\b/i,
    message: 'Claims Punkt sentence detection that is not present in the browser tool implementation.',
    slugs: ['word-counter'],
  },
  {
    code: 'unsupported-file-upload-claim',
    pattern: /\bdrag\/drop a \.txt\/\.docx file\b/i,
    message: 'Claims text/document drag-and-drop upload that is not present in the tool UI.',
    slugs: ['word-counter'],
  },
  {
    code: 'unsupported-export-dropdown',
    pattern: /\bExport Data['’]? dropdown\b/i,
    message: 'Claims an export dropdown that is not present in the current tool UI.',
    slugs: ['word-counter'],
  },
  {
    code: 'word-counter-unsupported-controls-es',
    pattern: /\bIgnorar may[uú]sculas\b|\bExcluir n[uú]meros\b|\bProcesar Texto\b|\bpestañas?\b|\bDescargar Informe\b/i,
    message: 'Claims Spanish Word Counter controls or export surfaces that are not present in the current UI.',
    slugs: ['word-counter'],
  },
  {
    code: 'sitemap-generator-crawl-claim',
    pattern: /\bscann?ing your website\b|\bscan website\b|\bfetch(?:ing)? all (?:the )?URLs\b|\brecursively fetching\b|\broot directory\b|\bbreaking the sitemap into multiple files\b/i,
    message: 'Claims crawler or multi-file sitemap behavior that is not present in the current manual XML generator UI.',
    slugs: ['sitemap-generator'],
  },
  {
    code: 'pixel-density-device-preset-claim',
    pattern: /\bpopular devices\b|\bdevice presets\b/i,
    message: 'Claims device presets, but the current Pixel Density Calculator only ships common resolution presets.',
    slugs: ['pixel-density-calculator'],
  },
  {
    code: 'ical-full-timezone-claim',
    pattern: /\bfull timezone handling\b|\bcomplete timezone support\b|\btimezone database\b/i,
    message: 'Claims full timezone handling, but the current iCal parser does not expand timezone identifiers through a timezone database.',
    slugs: ['ical-parser'],
  },
  {
    code: 'barcode-unsupported-output-claim',
    pattern: /\bEPS\b|\bPNG\b|\bDPI\b|растровых изображений|разрешени[ея]|цветовое оформление|высот[ау] штрихов|ширин[ау] модуля/i,
    message: 'Claims barcode export or styling controls that are not present in the current SVG preview UI.',
    slugs: ['barcode-generator'],
  },
  {
    code: 'file-size-unsupported-fr-controls',
    pattern: /cases? à cocher|unités de destination souhaitées|bouton ['’]Convertir['’]|['’]Réinitialiser['’]|Cochez la case/i,
    message: 'Claims French File Size Calculator controls that are not present in the current instant conversion UI.',
    slugs: ['file-size-calculator'],
  },
  {
    code: 'morse-reference-chart-claim',
    pattern: /\bbuilt-in reference chart\b|\breference chart\b/i,
    message: 'Claims a Morse reference chart, but the current player shows output visualization and a small legend only.',
    slugs: ['morse-code-player'],
  },
  {
    code: 'document-word-counter-export-claim',
    pattern: /\bExport stats\b|Exporta las estadísticas|Exportar estadísticas|Exporte as estatísticas|Exportar estatísticas|Exporter les statistiques|Statistiken exportieren|导出统计结果|統計をエクスポート|통계 내보내기|Скопируйте или скачайте результат|نسخ أو تنزيل الناتج/i,
    message: 'Claims Document Word Counter export behavior that is not present in the current live statistics UI.',
    slugs: ['document-word-counter'],
  },
  {
    code: 'compound-interest-visual-chart-claim',
    pattern: /Visual charts help you understand|View final amount, total interest, and growth chart/i,
    message: 'Claims a visual chart, but the current Compound Interest Calculator shows numeric result cards and yearly balance bars.',
    slugs: ['compound-interest-calculator'],
  },
  {
    code: 'html-preview-javascript-claim',
    pattern: /\bJavaScript support\b|\bJavaScript execution\b|<script>\s*tags for interactivity|\bscript tags for interactivity\b|\bcomplete web pages including interactive elements\b|\bfull CSS styling and JavaScript execution\b|soporte para CSS y JavaScript|soporte para JavaScript|ejecuta JavaScript/i,
    message: 'Claims JavaScript execution, but the current HTML Preview renders snippets in a sandboxed iframe without scripts enabled.',
    slugs: ['html-preview'],
  },
  {
    code: 'half-doughnut-unsupported-editor-claim',
    pattern: /270度|JSON形式|半円方向|左半分|右半分|内半径|外半径|回転オフセット|コード生成|スクリプトをコピー|50〜200px|12〜24px|グラデーションカラーリング|アニメーション効果/i,
    message: 'Claims half-doughnut JSON, angle, radius, code, or granular style controls that are not present in the current ECharts table editor UI.',
    slugs: ['half-doughnut-chart-generator'],
  },
  {
    code: 'text-ascii-unsupported-export-font-claim',
    pattern: /['’]Standard['’].*['’]Banner['’].*['’]Slant['’]|Font Selection|Convert to ASCII Art|Download as Text|Download as Image|Скачать как текст|Скачать как изображение|слайдер ['’]Size['’]|выберите шрифт ASCII|настройку шрифтов, стилей и размеров/i,
    message: 'Claims ASCII font, size, or file/image export controls that are not present in the current single-font copy-only UI.',
    slugs: ['text-to-ascii-art'],
  },
  {
    code: 'image-splitter-unsupported-advanced-claim',
    pattern: /\bBMP\b|التداخل البكسل|التفاف الحافة|تنسيق الإخراج المفضل|PNG لجودة أعلى|JPEG لملفات أصغر|20 ميجا|الحفاظ على بيانات EXIF|preserves? .*EXIF|maintaining .*EXIF|slice overlap percentage|Maintain Aspect Ratio|coordinate overlays|bi-linear interpolation|percentage-based/i,
    message: 'Claims image splitter overlap, output-format, EXIF, or advanced slicing controls that are not present in the current rows/columns PNG grid UI.',
    slugs: ['image-splitter'],
  },
  {
    code: 'credit-card-validator-live-verification-claim',
    pattern: /real-time authorization|balance check|CVV verification|authori[sz]e a card|available balance|авторизац[а-яё ]+реальн|провер(?:ка|яет)[а-яё ]+CVV|доступн[а-яё ]+баланс/i,
    message: 'Claims live card authorization, CVV, or balance checks that are not present in the current local Luhn validator.',
    slugs: ['credit-card-validator'],
  },
  {
    code: 'scientific-calculator-unsupported-function-claim',
    pattern: /гиперболическ|sinh|cosh|tanh|senh|sin⁻¹|cos⁻¹|tan⁻¹|обратн[а-яё]+ тригонометр|клавиш[ау]\s*['’]Exp['’]|функци[яю]\s*['’]2nd['’]|['’]2nd['’]|\bShift\b|\bAns\b|\bSTO\b|\bEquation\b|\bExp\b|обратн[а-яё]+ польск[а-яё]+ нотаци|дифференциальных уравнений|\bhyperbolic\b|hiperb[oó]lic|hiperb[oó]licas|\breverse polish notation\b|\bRPN\b|逆波兰|逆ポーランド|复数|複素|복소수|الأعداد المركبة|nombres complexes|números complejos|números complexos|matriz|matrices|矩阵|行列|매트릭스|WebAssembly|Wasm|56种|56\s+opera|log10|log₂|logₐ|graficaci[oó]n|graphiques?\s+2D|\bgraphing\b|\bHistory\b|Historial|Historique|Histórico|历史记录|履歴|\bCSV\b|\bLaTeX\b/i,
    message: 'Claims scientific-calculator controls or math modes that are not present in the current button UI.',
    slugs: ['scientific-calculator'],
  },
  {
    code: 'random-color-generator-unsupported-palette-controls',
    pattern: /\bharmony modes?\b|\blocked colors?\b|\block colors?\b|\bseeded palettes?\b|\bcontrast checker\b|\bWCAG\b|\bexport(?:s|ing)? (?:CSS variables|PNG|SVG|ASE)\b|\bpalette history\b/i,
    message: 'Claims random-color palette controls that are not present in the current swatch generator UI.',
    slugs: ['random-color-generator'],
  },
  {
    code: 'dice-roller-unsupported-control-claim',
    pattern: /\bdrop-?down menu\b|\bQuantity field\b|\bHistory tab\b|\bsav(?:e|ing) (?:specific )?configurations\b|\bsav(?:e|ing) custom dice sets\b|\bSettings icon\b|\bsetting a seed\b|\bseed(?:ed)? random\b|\badvanced statistical tracking\b|\bweighted dice\b|\bcustom dice sets\b/i,
    message: 'Claims Dice Roller controls that are not present in the current dice button, modifier, result, and history UI.',
    slugs: ['dice-roller'],
  },
  {
    code: 'jwt-signature-verification-claim',
    pattern: /\bvalidate(?:s| the)? token'?s signature\b|\bSignature Verification\b/i,
    message: 'Claims JWT signature verification, but the current decoder only decodes and displays token parts.',
    slugs: ['jwt-decoder'],
  },
  {
    code: 'pcre2-runtime-claim',
    pattern: /\bPCRE2\b/i,
    message: 'Claims PCRE2 regex support, while the current Regex Tester uses the browser JavaScript RegExp engine.',
    slugs: ['regex-tester'],
  },
  {
    code: 'regex-replacement-preview-claim',
    pattern: /\breplacement preview mode\b|\bsimulate substitution operations\b/i,
    message: 'Claims regex replacement preview functionality that is not present in the current UI.',
    slugs: ['regex-tester'],
  },
  {
    code: 'webassembly-conversion-engine',
    pattern: /\bWebAssembly-based conversion engine\b/i,
    message: 'Claims a WebAssembly conversion engine that is not evidenced in the current timestamp tool.',
    slugs: ['timestamp-converter'],
  },
  {
    code: 'iana-timezone-picker-claim',
    pattern: /\bTimezone Offset Picker\b|\bmanual timezone specification\b|\bsearch for specific location via IANA Time Zone Database\b/i,
    message: 'Claims manual IANA timezone selection that is not present in the current timestamp UI.',
    slugs: ['timestamp-converter'],
  },
  {
    code: 'image-base64-transcode-claim',
    pattern: /\bPreserve Transparency\b|\btarget encoding format\b/i,
    message: 'Claims image transcoding controls that are not present in the current Image to Base64 UI.',
    slugs: ['image-to-base64'],
  },
  {
    code: 'pdf-base64-unsupported-ru-controls',
    pattern: /Удалить метаданные|произвольного значения|настройк[а-яё]+ MIME|Web Worker|Download Result|автоматически копир/i,
    message: 'Claims PDF to Base64 metadata, MIME customization, worker, download, or auto-copy controls that are not present in the current browser FileReader UI.',
    slugs: ['pdf-to-base64'],
  },
  {
    code: 'image-frosted-glass-unsupported-control-claim',
    pattern: /WebGL-ускорени|альфа-канал|RGBA-формат|прозрачн[а-яё ]+сло[йя]|прозрачн[а-яё ]+област|Invert Matte|Selection Area|обратн[а-яё ]+маск|выделени[ея] области|\bWebGL acceleration\b|\bopacity layer\b|\binvert matte\b|\bselection area\b/i,
    message: 'Claims frosted-glass layer, mask, selection, or WebGL controls that are not present in the current whole-image canvas blur UI.',
    slugs: ['image-frosted-glass'],
  },
  {
    code: 'hex-editor-grid-claim',
    pattern: /\bhex(?:adecimal)? grid\b|\b16-byte columnar\b|\boffset addresses\b|hex-дамп/i,
    message: 'Claims a hex grid or dump view, but the current Hex Editor exposes two text areas and conversion buttons.',
    slugs: ['hex-editor'],
  },
  {
    code: 'hex-editor-byte-edit-claim',
    pattern: /\bdirectly modify byte values\b|\bDouble-click any hex value\b|Измените отдельные байты/i,
    message: 'Claims direct byte editing that is not present in the current Hex Editor UI.',
    slugs: ['hex-editor'],
  },
  {
    code: 'hex-editor-unsupported-encoding-claim',
    pattern: /\bUTF-16LE\/BE\b|\bUTF-16BE\b|\bendianness\b|порядок байтов/i,
    message: 'Claims encoding or byte-order controls that are not present in the current Hex Editor UI.',
    slugs: ['hex-editor'],
  },
  {
    code: 'hex-editor-file-export-claim',
    pattern: /\bDownload as Hex File\b|Сохранить как \.bin/i,
    message: 'Claims file export that is not present in the current Hex Editor UI.',
    slugs: ['hex-editor'],
  },
  {
    code: 'ip-validator-unsupported-workflow-claim',
    pattern: /список через запятую|вкладке «Options»|фильтр «Advanced»|Скачайте отч[её]т|JSON или CSV|CI\/CD-пайплайны/i,
    message: 'Claims IP Validator bulk, advanced, export, or pipeline workflows that are not present in the current single-address UI.',
    slugs: ['ip-validator'],
  },
  {
    code: 'ip-lookup-unsupported-network-intel-claim',
    pattern: /GeoIP2|BGP-маршрутизац|Показать BGP-маршрут|Download Data|обратных DNS-записей \(PTR\)|Round-Trip Time|парсинг[ае] WHOIS/i,
    message: 'Claims IP Lookup WHOIS, BGP, PTR, RTT, or export features that are not present in the current ipwho.is lookup UI.',
    slugs: ['ip-lookup'],
  },
  {
    code: 'due-date-unsupported-medical-precision-claim',
    pattern: /curseur de longueur du cycle|Importez les données d['’]échographie|CRL en mm|Modèle probabiliste|SFMP|intervalle de confiance|ultra-précise/i,
    message: 'Claims pregnancy calculator controls or clinical precision that are not present in the current date-estimation UI.',
    slugs: ['due-date-calculator'],
  },
  {
    code: 'graph-chart-unsupported-editor-claim',
    pattern: /propriétés de lien|algorithmes de mise en page avancés|personnaliser les couleurs, les formes|copier le code HTML|intégration des graphes dans|advanced graph theory algorithms|directed and undirected graphs|Edges tab|edge type|Tree layout|Style settings|customer journey maps|potential bottlenecks/i,
    message: 'Claims graph editor controls or embed export behavior that are not present in the current ECharts graph UI.',
    slugs: ['graph-chart-generator'],
  },
  {
    code: 'text-spinner-unsupported-seo-export-claim',
    pattern: /Obt[eé]n versiones JSON, Base64 y SVG|evitar el plagio y mejorar la SEO|Genera art[ií]culos [uú]nicos|plagiarism checker|SEO-ready content/i,
    message: 'Claims text-spinner export, plagiarism, or SEO-publishing behavior that is not present in the current synonym replacement tool.',
    slugs: ['text-spinner'],
  },
  {
    code: 'typescript-playground-unsupported-compiler-runtime-claim',
    pattern: /compile, and test TypeScript code|test TypeScript code|debug code|Test type definitions|Share code snippets|Configure options|see instant results without any setup/i,
    message: 'Claims TypeScript compiler, testing, debugging, sharing, or configurable compiler behavior that is not present in the current string-rewrite playground.',
    slugs: ['typescript-playground'],
  },
  {
    code: 'financial-forecast-unsupported-cashflow-investor-claim',
    pattern: /Project cash flow|Create investor projections|investor projections|seasonalAdjustment|seasonal adjustment|Monte Carlo|valuation model|accounting software/i,
    message: 'Claims cash-flow, investor, seasonal, valuation, or accounting behavior that is not present in the current revenue/expense/profit forecast calculator.',
    slugs: ['financial-forecast-calculator'],
  },
  {
    code: 'binary-to-text-unsupported-file-encoding-claim',
    pattern: /decode files?|encrypted data|base64 conversion|full Unicode encoding|UTF-8 inspector|upload binary/i,
    message: 'Claims file, encryption, base64, or full Unicode analysis behavior that is not present in the current typed binary/text converter.',
    slugs: ['binary-to-text'],
  },
  {
    code: 'text-summarizer-unsupported-ai-file-export-claim',
    pattern: /\bBERT\b|\btransformer\b|\bTF-IDF\b|similitud coseno|[aá]rboles de dependencia|arrastr[ae] un archivo|\.docx|\.json con metadatos|descarga el resultado|Resaltado de t[eé]rminos clave|modelo de comprensi[oó]n contextual|NLP/i,
    message: 'Claims AI model, file upload, highlighting, JSON export, or advanced NLP behavior that is not present in the current extractive text summarizer.',
    slugs: ['text-summarizer'],
  },
  {
    code: 'inflation-calculator-unsupported-cpi-investment-claim',
    pattern: /\bhistorical CPI\b|\bofficial CPI\b|\bcountry-specific inflation\b|\bretirement savings\b|\binvestment(?:s)?\b|\bhistorical prices\b|\bpast money is worth\b|\bfuture retirement\b|\btaxes\b|\bmarket risk\b/i,
    message: 'Claims CPI data, retirement, investment, tax, or market modeling that is not present in the current fixed-rate inflation calculator.',
    slugs: ['inflation-calculator'],
  },
  {
    code: 'ip-geolocation-unsupported-precision-network-claim',
    pattern: /\baccurate results\b|\bexact location\b|\bprecise physical address\b|\bGPS\b|\bWHOIS\b|\bBGP\b|\breverse DNS\b|\bPTR\b|\bsecurity investigation\b/i,
    message: 'Claims exact location, WHOIS/BGP/PTR, or investigation-grade behavior that is not present in the current approximate geolocation lookup.',
    slugs: ['ip-geolocation'],
  },
  {
    code: 'aspect-ratio-resizer-unsupported-editor-claim',
    pattern: /\bEXIF\b|\bmetadata\b|\bJPEG export\b|\bWebP export\b|\bquality slider\b|\bcrop handles?\b|\bmanual crop\b|\bbackground color picker\b|\bwatermark\b|\bbatch resize\b/i,
    message: 'Claims metadata preservation, alternate exports, batch editing, crop handles, or styling controls that are not present in the current PNG canvas resizer.',
    slugs: ['aspect-ratio-resizer'],
  },
  {
    code: 'wordcloud-unsupported-nlp-upload-font-claim',
    pattern: /\bUpload Text\b|\btext file\b|\bNLP\b|\bnatural language processing\b|\bsentiment analysis\b|\bcustom font\b|\bFont settings\b|\bminimum word count\b|\bCustom color\b|\bFreeform\b|\bRectangular\b/i,
    message: 'Claims word-cloud upload, NLP, custom font/color, or unsupported layout controls that are not present in the current ECharts word-cloud editor.',
    slugs: ['wordcloud-generator'],
  },
  {
    code: 'boxplot-unsupported-import-style-claim',
    pattern: /\bCSV\/JSON\b|с учетом пользовательских настроек разделителей|символ табуляции|минимальн[а-яё/]+максимальн[а-яё ]+значени[ея].*выброс|отсечени[ея] выброс|селектор HSL|HEX-код|вкладк[аеу]\s*['’«](?:Данные|Настройки|Стили)|\bcustom delimiter\b|\bmanual outlier threshold\b|\boutlier cutoff\b|\bHSL selector\b/i,
    message: 'Claims Boxplot import, delimiter, manual outlier, or style controls that are not present in the current comma-separated value editor.',
    slugs: ['boxplot-chart-generator'],
  },
  {
    code: 'gantt-chart-unsupported-project-management-claim',
    pattern: /\bmanage dependencies\b|\bidentify task dependencies\b|gestiona(?:r)? las dependencias|identificar dependencias|cuellos de botella|ruta cr[ií]tica|asignaci[oó]n de recursos|seguimiento en vivo/i,
    message: 'Claims project-management behavior that is not present in the current Gantt chart maker.',
    slugs: ['gantt-chart-generator'],
  },
  {
    code: 'timeline-chart-unsupported-style-controls',
    pattern: /marker styles, labels, and spacing|custom marker styles|manual spacing controls|spacing to match the density/i,
    message: 'Claims timeline marker or spacing controls that are not present in the current chart editor.',
    slugs: ['timeline-chart-generator'],
  },
  {
    code: 'mortgage-calculator-fr-unsupported-loan-claim',
    pattern: /Cochez les options complémentaires|taxes foncières, assurance habitation, frais de dossier|onglet ['’«]Analyse|conditions variables|modalités d['’]amortissement linéaire ou dégressif|prêt à taux variable/i,
    message: 'Claims French mortgage taxes, insurance, variable-rate comparison, or analysis-tab behavior that is not present in the current calculator.',
    slugs: ['mortgage-calculator'],
  },
  {
    code: 'gpa-calculator-en-unsupported-policy-claim',
    pattern: /honors\/AP designations|pass\/fail options|repeated courses|non-traditional grading scales|honors courses add 0\.5|hypothetical scenarios|course type \(Standard, Honors, AP\)|percentage-based input|Excluded from GPA/i,
    message: 'Claims GPA weighting, exclusion, replacement, percentage, or policy behavior that is not present in the current course-row calculator.',
    slugs: ['gpa-calculator'],
  },
  {
    code: 'tile-calculator-unsupported-layout-claim',
    pattern: /Obstruction Adjustment|asymmetric layout adjustments|protrusions or recesses|subtract fixed elements|tile shape|hexagonal|substrate irregularity|dry vs\. wet areas|waterproof membranes|floor heating pipes|pattern-specific waste calculation/i,
    message: 'Claims tile layout, obstruction, shape, substrate, or wet-area controls that are not present in the current rectangular tile calculator.',
    slugs: ['tile-calculator'],
  },
  {
    code: 'dpi-calculator-unsupported-image-inspection-claim',
    pattern: /\bread(?:s|ing)? image metadata\b|\bEXIF\b|\bupload(?:s| an)? image\b|\bdetect(?:s|ing)? image dimensions\b|\bICC profile\b|\bresampl(?:e|ing)\b|\bresize(?:s| images?)?\b/i,
    message: 'Claims DPI image upload, metadata inspection, or resizing behavior that is not present in the current manual-input calculator.',
    slugs: ['dpi-calculator'],
  },
  {
    code: 'roman-numeral-unsupported-validation-claim',
    pattern: /\bstrict validator\b|\bvalidates strict Roman\b|\bgrammar validator\b|\brejects invalid Roman numerals\b|\bhistorical variants?\b/i,
    message: 'Claims strict Roman numeral validation that is not present in the current symbol-value converter.',
    slugs: ['roman-numeral-converter'],
  },
  {
    code: 'ip-subnet-unsupported-live-network-claim',
    pattern: /\bIPv6\b|\bscan(?:s|ning)? (?:the )?network\b|\bping(?:s)? hosts\b|\bdetect(?:s)? devices\b|\bquery(?:ing|ies)? routers\b|\blive devices\b|\bassigned on your network\b/i,
    message: 'Claims IPv6 or live network probing behavior that is not present in the current IPv4 subnet math tool.',
    slugs: ['ip-subnet-calculator'],
  },
  {
    code: 'gif-maker-unsupported-editor-claim',
    pattern: /\bFrame Rate slider\b|\bframes per second\b|\bfps\b|\bDimensions fields\b|\bFit to Width\b|\bFit to Height\b|\bLoop Count\b|\bfinite loop\b|\bSort function\b|\btext overlays?\b|\bedit video clips?\b|\bvideo files?\b|\bcrop(?:s|ping)?\b|\bresize(?:s| images?)?\b|\bdithering\b/i,
    message: 'Claims GIF editor, sizing, video, or FPS controls that are not present in the current image-frame GIF maker.',
    slugs: ['gif-maker'],
  },
  {
    code: 'api-tester-unsupported-client-claim',
    pattern: /\bany API endpoint\b|\bbypass(?:es)? CORS\b|\bCORS proxy\b|\brequest history\b|\bcollections?\b|\benvironment variables?\b|\bOAuth flows?\b|\bsecret storage\b/i,
    message: 'Claims API client, CORS, history, collection, environment, or auth management behavior that is not present in the current browser-fetch tester.',
    slugs: ['api-tester'],
  },
  {
    code: 'radar-chart-unsupported-editor-claim',
    pattern: /\bAdd Data button\b|\bshare the chart directly\b|\badvanced CSV\b|\bformulas?\b|\btrend lines?\b|\bcustom marker\b|\bbackground image\b|\bgradient fill\b/i,
    message: 'Claims radar chart import, sharing, or advanced styling behavior that is not present in the current ECharts radar editor.',
    slugs: ['radar-chart-generator'],
  },
  {
    code: 'meeting-agenda-unsupported-export-share-claim',
    pattern: /\bExport and share\b|\bsend(?:s|ing)? calendar invitations?\b|\bGoogle Calendar\b|\bOutlook\b|\bdownload(?:able)? PDF\b|\bshared workspace\b|\bmeeting library\b/i,
    message: 'Claims meeting agenda export, calendar, sharing, or saved-library behavior that is not present in the current copy-only agenda builder.',
    slugs: ['meeting-agenda-builder'],
  },
  {
    code: 'carbon-footprint-unsupported-audit-offset-claim',
    pattern: /\bcomprehensive breakdown\b|\bcarbon offset strategies\b|\bfor individuals or businesses\b|\bcountry-specific electricity\b|\bregional grid factors?\b|\bScope 1\b|\bScope 2\b|\bScope 3\b/i,
    message: 'Claims carbon audit, offset strategy, business, regional grid, or GHG-scope behavior that is not present in the current fixed-factor personal estimator.',
    slugs: ['carbon-footprint-calculator'],
  },
  {
    code: 'png-to-svg-unsupported-vectorization-claim',
    pattern: /\bresolution-independent logos\b|\bFine-tune colors and paths\b|\bCreate vector art from photos\b|\btraces raster images and converts them to scalable vector graphics\b|\bvectorize logos\b|\bmulti-color tracing\b|\bBezier curves?\b/i,
    message: 'Claims polished vectorization, color/path editing, photo tracing, or curve extraction that is not present in the current embed/simple-threshold PNG to SVG tool.',
    slugs: ['png-to-svg'],
  },
  {
    code: 'calorie-calculator-unsupported-medical-macro-claim',
    pattern: /الثيروكسين|التغيرات الهرمونية|مرض السكري|مقاومة الإنسولين|توزيع البروتينات والدهون والكربوهيدرات|البروتينات والدهون والكربوهيدرات|كتلة العضلات|نسب كتلة العضلات|مؤشر كتلة الجسم\s*\(BMI\)|\bBMI\b|2\.4|الرياضيين المحترفين|غير ثنائي|Hamwi|micronutrient|macro(?:nutrient)?(?: distribution)?|body composition|diabetes/i,
    message: 'Claims medical, body-composition, or macro-planning behavior that is not present in the current calorie calculator.',
    slugs: ['calorie-calculator'],
  },
  {
    code: 'database-schema-visualizer-unsupported-er-export-claim',
    pattern: /\bvisual ER diagrams?\b|\bClick Visualize\b|\bDrag to arrange\b|\bExport as PNG\/SVG\b|\bExport as PNG\b|\bExport as SVG\b/i,
    message: 'Claims ER canvas, export, manual visualize button, or live database behavior that is not present in the current SQL table-card visualizer.',
    slugs: ['database-schema-visualizer'],
  },
  {
    code: 'binary-to-decimal-unsupported-signed-matrix-claim',
    pattern: /\bformat radio buttons?\b|\boutput matrix\b|\ball three bases\b|\bSwap button\b|\bSigned Mode\b|\benable two'?s complement\b|\bhandles edge cases like signed integers\b|\boverflow detection\b|\bIEEE 754\b|\bSupport large numbers\b/i,
    message: 'Claims signed-mode, output-matrix, swap, large-number, or overflow behavior that is not present in the current mode-by-mode base converter.',
    slugs: ['binary-to-decimal'],
  },
  {
    code: 'image-flip-rotate-unsupported-metadata-format-claim',
    pattern: /EXIF-Orientierungsinformationen|Metadatenstruktur|Qualitätsmodus|Bilinear-Interpolation|JPEG\/PNG\/BMP\/WEBP|Alphakanäle|perspektivische Verzerrungen|Printmedien|Vorschau'-Button|Speichern unter/i,
    message: 'Claims EXIF, metadata, quality, format picker, or separate preview controls that are not present in the current canvas flip/rotate tool.',
    slugs: ['image-flip-rotate'],
  },
  {
    code: 'email-signature-generator-unsupported-email-client-claim',
    pattern: /autom[aá]ticamente instala|instala autom[aá]ticamente|sincroniza con Gmail|sincroniza con Outlook|env[ií]a correos?|send(?:s|ing)? emails?|auto-install(?:s|ed)? signature/i,
    message: 'Claims automatic email-client installation, sync, or sending behavior that is not present in the current copy-only signature generator.',
    slugs: ['email-signature-generator'],
  },
  {
    code: 'css-clip-path-unsupported-editor-export-claim',
    pattern: /drag-and-drop|вендорн[а-яё]+ префикс|SVG-патч|ZIP-архив|Retina|интерактивн[а-яё ]+редактор[а-яё ]+координат|преобразованием SVG-путей|окне предварительного просмотра с возможностью масштабирования/i,
    message: 'Claims CSS clip-path point editing, vendor-prefix controls, SVG/ZIP export, or advanced preview behavior that is not present in the current preset-and-textarea UI.',
    slugs: ['css-clip-path-generator'],
  },
  {
    code: 'screen-recorder-unsupported-output-claim',
    pattern: /\bMP4\b|\bGIF\b|\bcloud upload\b|\buploads? recordings? to\b|\bwebcam overlay\b|\btrim(?:ming)?\b|\bvideo editor\b|\bscheduled recording\b|subir a la nube|recortar|superposici[oó]n de webcam/i,
    message: 'Claims screen recorder output, upload, overlay, editing, or scheduling features that are not present in the current browser recorder.',
    slugs: ['screen-recorder'],
  },
  {
    code: 'calendar-availability-external-calendar-claim',
    pattern: /\bdate range\b|\bSelect meeting time\b|\bacross calendars\b|\bsync across calendars\b|\bautomatic calendar sync\b|\breal-time calendar availability\b/i,
    message: 'Claims external calendar sync or date-range controls that are not present in the current manual availability calculator.',
    slugs: ['calendar-availability-finder'],
  },
  {
    code: 'crontab-calendar-unsupported-export-timezone-claim',
    pattern: /\bVixie, AIX, and systemd variants\b|\bIANA Time Zone Database\b|\b@hourly\b|\bconflict detection\b|\bDownload as iCal\b|\bCopy JSON\b|\bprogrammatic output formats\b/i,
    message: 'Claims cron dialect, timezone database, conflict detection, or export behavior that is not present in the current calendar preview UI.',
    slugs: ['crontab-calendar'],
  },
  {
    code: 'database-connection-tester-live-claim',
    pattern: /\btests? live database connections?\b|\bvalidate live database credentials\b|\bverify live database credentials\b|\bClick Parse\b|\bView parsed details\b|\bValidate format\b/i,
    message: 'Claims live database testing or parser controls that are not present in the current connection string builder UI.',
    slugs: ['database-connection-tester'],
  },
  {
    code: 'database-migration-unsupported-download-claim',
    pattern: /\bCopy or download\b|\bdownload(?:able)? migration\b|\bgenerate(?:s|d)? complete migration files?\b/i,
    message: 'Claims database migration download or complete migration-file generation that is not present in the current copy-only migration snippet UI.',
    slugs: ['database-migration-generator'],
  },
  {
    code: 'keyboard-tester-unsupported-event-export-claim',
    pattern: /\bCopy button beneath the matrix\b|\bisTrusted flag\b|\bevent timestamp\b|\bUI5 Events specification\b|\braw event data\b|\bkeylogger detection\b/i,
    message: 'Claims Keyboard Tester event export or browser-internal event diagnostics that are not present in the current key/code/keyCode viewer UI.',
    slugs: ['keyboard-tester'],
  },
  {
    code: 'excel-merger-unsupported-advanced-merge-claim',
    pattern: /Apache POI|OpenXML SDK|WorkbookConcatenator|XSSFCellStyler|XLSX\/CSV|CSV|многоуровневые заголовки|условные форматы|Автоопределение ключевых полей|первичных ключей|100 тыс\. строк|сохраненными форматами и формулами|重複検出|主キー列|最大2GB|VLOOKUP|HLOOKUP|INDEX-MATCH|열 매핑|고급 설정|coluna-chave|chave primária|主键字段|字段映射|预览结果|توحيد الصيغ|كشف التكرار|سجل تغييرات|تعيين الأعمدة|50 ميجابايت/i,
    message: 'Claims CSV, key-based matching, formatting preservation, or backend spreadsheet processing that is not present in the current Excel Merger UI.',
    slugs: ['excel-merger'],
  },
  {
    code: 'color-blender-unsupported-export-mode-claim',
    pattern: /RGB, HSL или HEX|режим(?:ы|ов)? смешивания|линейн(?:ый|ого).*экспоненциальн|настройк[а-яё]+ прозрачности|Экспортируйте результат|экспортировать результаты/i,
    message: 'Claims color formats, blend modes, transparency controls, or export workflows that are not present in the current HEX color blender UI.',
    slugs: ['color-blender'],
  },
  {
    code: 'reading-time-unsupported-analysis-claim',
    pattern: /\bNLP\b|\bnatural language processing\b|procesamiento de lenguaje natural|an[aá]lisis l[eé]xico|complejidad l[eé]xica|estructura sint[aá]ctica|modelos probabil[ií]sticos|perfil del lector|modo de lectura|an[aá]lisis contextual|soporte para formato Markdown|formato Markdown|men[uú] desplegable|bot[oó]n ['’]?Calcular|integra la API|API para mostrar|desglose detallado por secciones/i,
    message: 'Claims Reading Time Calculator NLP, Markdown, language, API, or section-analysis behavior that is not present in the current counter UI.',
    slugs: ['reading-time-calculator'],
  },
  {
    code: 'image-collage-unsupported-editor-claim',
    pattern: /layouts? predefinidos?|predefined layouts?|adicionar bordas|add borders?|bordes\b|filtros|effects? visual|efeitos visuais|visor ao vivo|live preview|PNG ou JPEG|download.*JPEG|crop(?:ping)?|resize(?:s| images?)?|redimensionar|at[eé]\s+20 imagens|up to 20 images|p[oô]ster promocional|exporte em JSON ou Base64/i,
    message: 'Claims collage layouts, effects, border, JPEG, live preview, or advanced image-editing controls that are not present in the current horizontal/vertical PNG collage UI.',
    slugs: ['image-collage'],
  },
  {
    code: 'image-to-pdf-unsupported-workflow-claim',
    pattern: /Geben Sie oder f[uü]gen Sie|Eingabefeld|Kopieren oder laden|copy the processed result|quality slider|compression quality|mit Bildkomprimierung|batch compression|resolution controls|\bDPI\b|perform(?:s)? OCR|OCR (?:extraction|recognition|processing)|Texterkennung (?:durchf[uü]hren|extrahieren)|erkennt Text in Bildern|\bGIF\b|server upload|uploaded to a server|auf .*Server hochgeladen/i,
    message: 'Claims image-to-PDF paste/copy, OCR, quality, GIF, server-upload, or advanced output controls that are not present in the current upload-to-PDF UI.',
    slugs: ['image-to-pdf'],
  },
  {
    code: 'text-to-pdf-unsupported-layout-claim',
    pattern: /choose (?:custom )?margins?|custom margin controls?|select (?:portrait|landscape)|landscape orientation|add headers? and footers?|PDF templates?|rich text editor|insert images?|page numbers?|watermark/i,
    message: 'Claims text-to-PDF layout, template, image, header/footer, or watermark controls that are not present in the current plain-text PDF UI.',
    slugs: ['text-to-pdf'],
  },
  {
    code: 'xml-validator-unsupported-schema-claim',
    pattern: /\bSAX2?\b|\blibxml2\b|XSD Validation|DTD validation|schema validation|namespace-aware processing|Namespace Checking|Quick Fix|upload a \.xml file|machine-readable validation results|JSON format for CI\/CD|real-time progress tracking|error codes|Output tab|Download the validated XML/i,
    message: 'Claims XML schema, upload, SAX/libxml2, quick-fix, download, JSON, or CI output behavior that is not present in the current DOMParser UI.',
    slugs: ['xml-validator'],
  },
];

/** @type {ContentTrustRule[]} */
export const MEDIUM_CONFIDENCE_SUPPORT_CONTENT_RULES = [
  {
    code: 'rest-api-claim',
    pattern: /\bRESTful API\b/i,
    message: 'Describes API/backend capabilities that may not exist on the page implementation.',
  },
  {
    code: 'server-side-reference',
    pattern: /\bserver-side\b/i,
    message: 'References server-side behavior on a browser-first tool page and should be verified.',
  },
  {
    code: 'redis-runtime',
    pattern: /\bRedis\b/i,
    message: 'Mentions Redis-specific behavior that should be verified against the actual tool UI.',
  },
  {
    code: 'print-ready-export',
    pattern: /\b300DPI\b/i,
    message: 'Claims print-grade export precision that should be backed by implementation evidence.',
  },
  {
    code: 'microservices-claim',
    pattern: /\bmicroservices?\b/i,
    message: 'References distributed backend architecture that may be unrelated to the page implementation.',
  },
  {
    code: 'openid-connect-claim',
    pattern: /\bOpenID Connect\b/i,
    message: 'References authentication-platform integrations that should be verified against the actual tool.',
  },
  {
    code: 'oauth2-claim',
    pattern: /\bOAuth2\b/i,
    message: 'References OAuth integrations that should be verified against the actual tool.',
  },
  {
    code: 'millions-claim',
    pattern: /\bmillions? of developers\b/i,
    message: 'Uses unsupported scale language that should be backed by evidence or removed.',
  },
];

function compactWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildExcerpt(text, matchIndex, matchLength) {
  const start = Math.max(0, matchIndex - 56);
  const end = Math.min(text.length, matchIndex + matchLength + 56);
  return compactWhitespace(text.slice(start, end));
}

function collectSupportContentEntries(input) {
  /** @type {{ field: string, text: string }[]} */
  const entries = [];

  if (typeof input.name === 'string' && input.name.trim()) {
    entries.push({ field: 'name', text: input.name.trim() });
  }
  if (typeof input.description === 'string' && input.description.trim()) {
    entries.push({ field: 'description', text: input.description.trim() });
  }
  if (typeof input.detailedDescription === 'string' && input.detailedDescription.trim()) {
    entries.push({ field: 'detailed_description', text: input.detailedDescription.trim() });
  }
  if (Array.isArray(input.usageSteps)) {
    input.usageSteps.forEach((step, index) => {
      if (typeof step === 'string' && step.trim()) {
        entries.push({ field: `usage_steps[${index}]`, text: step.trim() });
      }
    });
  }
  if (Array.isArray(input.usageExamples)) {
    input.usageExamples.forEach((example, index) => {
      if (typeof example === 'string' && example.trim()) {
        entries.push({ field: `usage_examples[${index}]`, text: example.trim() });
      }
    });
  }
  if (Array.isArray(input.faqs)) {
    input.faqs.forEach((faq, index) => {
      if (typeof faq?.question === 'string' && faq.question.trim()) {
        entries.push({ field: `faqs[${index}].question`, text: faq.question.trim() });
      }
      if (typeof faq?.answer === 'string' && faq.answer.trim()) {
        entries.push({ field: `faqs[${index}].answer`, text: faq.answer.trim() });
      }
    });
  }

  return entries;
}

/**
 * @param {SupportContentInput} input
 * @returns {ContentTrustReport}
 */
export function assessSupportContentTrust(input) {
  const entries = collectSupportContentEntries(input);
  /** @type {ContentTrustIssue[]} */
  const issues = [];
  const seen = new Set();

  const applyRules = (rules, severity) => {
    for (const entry of entries) {
      for (const rule of rules) {
        if (Array.isArray(rule.slugs) && !rule.slugs.includes(input.slug)) {
          continue;
        }

        const match = entry.text.match(rule.pattern);
        if (!match || typeof match.index !== 'number') {
          continue;
        }

        const dedupeKey = `${severity}:${rule.code}:${entry.field}`;
        if (seen.has(dedupeKey)) {
          continue;
        }
        seen.add(dedupeKey);

        issues.push({
          severity,
          code: rule.code,
          field: entry.field,
          message: rule.message,
          excerpt: buildExcerpt(entry.text, match.index, match[0].length),
        });
      }
    }
  };

  applyRules(HIGH_CONFIDENCE_SUPPORT_CONTENT_RULES, 'high');
  applyRules(MEDIUM_CONFIDENCE_SUPPORT_CONTENT_RULES, 'medium');

  const highIssueCount = issues.filter((issue) => issue.severity === 'high').length;
  const mediumIssueCount = issues.filter((issue) => issue.severity === 'medium').length;
  const score = highIssueCount * 3 + mediumIssueCount;

  return {
    blockSupportContent: highIssueCount > 0,
    issues,
    score,
  };
}
