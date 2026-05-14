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
    pattern: /\bJavaScript support\b|\bJavaScript execution\b|<script>\s*tags for interactivity|\bscript tags for interactivity\b|\bcomplete web pages including interactive elements\b|\bfull CSS styling and JavaScript execution\b/i,
    message: 'Claims JavaScript execution, but the current HTML Preview renders snippets in a sandboxed iframe without scripts enabled.',
    slugs: ['html-preview'],
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
    pattern: /propriétés de lien|algorithmes de mise en page avancés|personnaliser les couleurs, les formes|copier le code HTML|intégration des graphes dans/i,
    message: 'Claims graph editor controls or embed export behavior that are not present in the current ECharts graph UI.',
    slugs: ['graph-chart-generator'],
  },
  {
    code: 'gantt-chart-unsupported-project-management-claim',
    pattern: /\bmanage dependencies\b|\bidentify task dependencies\b/i,
    message: 'Claims project-management behavior that is not present in the current Gantt chart maker.',
    slugs: ['gantt-chart-generator'],
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
