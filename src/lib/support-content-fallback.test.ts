import { describe, expect, it } from 'vitest';
import { assessSupportContentTrust } from './content-trust.js';
import { buildSafeFallbackSupportContent } from './support-content-fallback';

function buildTrustReport(
  slug: string,
  locale: string,
  name: string
) {
  const fallback = buildSafeFallbackSupportContent(slug, name, locale);
  return assessSupportContentTrust({
    slug,
    locale,
    name,
    description: '',
    detailedDescription: fallback.detailedDescription,
    usageSteps: fallback.usageSteps,
    usageExamples: fallback.usageExamples,
    faqs: fallback.faqs,
  });
}

describe('buildSafeFallbackSupportContent', () => {
  it('returns a safe English fallback for image tools', () => {
    const fallback = buildSafeFallbackSupportContent('image-converter', 'Image Converter', 'en');
    const report = buildTrustReport('image-converter', 'en', 'Image Converter');

    expect(fallback.detailedDescription).toContain('Image Converter');
    expect(fallback.usageSteps.length).toBeGreaterThan(0);
    expect(fallback.faqs.length).toBeGreaterThan(0);
    expect(report.blockSupportContent).toBe(false);
  });

  it('returns a safe localized chart fallback for Japanese chart pages', () => {
    const fallback = buildSafeFallbackSupportContent(
      'parallel-chart-generator',
      'Parallel Chart Generator',
      'ja'
    );
    const report = buildTrustReport('parallel-chart-generator', 'ja', 'Parallel Chart Generator');

    expect(fallback.detailedDescription).toContain('Parallel Chart Generator');
    expect(fallback.detailedDescription).toContain('ブラウザ');
    expect(fallback.faqs[0]?.question).toContain('Parallel Chart Generator');
    expect(report.blockSupportContent).toBe(false);
  });

  it('returns a safe localized generic fallback for Chinese non-chart pages', () => {
    const fallback = buildSafeFallbackSupportContent('favicon-generator', 'Favicon Generator', 'zh');
    const report = buildTrustReport('favicon-generator', 'zh', 'Favicon Generator');

    expect(fallback.detailedDescription).toContain('Favicon Generator');
    expect(fallback.detailedDescription).toContain('浏览器');
    expect(fallback.faqs[0]?.answer).toContain('浏览器');
    expect(report.blockSupportContent).toBe(false);
  });

  it('does not misclassify string tools as chart pages', () => {
    const fallback = buildSafeFallbackSupportContent('string-escape', 'String Escape', 'en');

    expect(fallback.detailedDescription).toContain('quick browser-based workflows');
    expect(fallback.faqs[0]?.question).toBe('When should I use String Escape?');
  });
});

describe('assessSupportContentTrust', () => {
  it('blocks high-confidence Word Counter implementation overclaims', () => {
    const report = assessSupportContentTrust({
      slug: 'word-counter',
      locale: 'en',
      name: 'Word Counter',
      description: '',
      detailedDescription:
        'The tool backend processes text streams using finite-state automata and a Web Workers implementation.',
      usageSteps: ['Review sentence boundaries identified via Punkt algorithm.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'word-counter-backend-automata',
        'web-workers-claim',
        'punkt-algorithm-claim',
      ])
    );
  });

  it('blocks Spanish Word Counter UI controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'word-counter',
      locale: 'es',
      name: 'Contador de Palabras',
      description: '',
      detailedDescription: 'Navega entre las pestañas de estadísticas avanzadas.',
      usageSteps: [
        "Activa la opción 'Ignorar mayúsculas'.",
        "Utiliza el botón 'Descargar Informe' para exportar los resultados.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('word-counter-unsupported-controls-es');
  });

  it('blocks Sitemap Generator crawler claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'sitemap-generator',
      locale: 'en',
      name: 'Sitemap Generator',
      description: '',
      detailedDescription:
        'The tool works by scanning your website root directory and recursively fetching all the URLs.',
      usageSteps: ['Click Scan Website to fetch all URLs.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('sitemap-generator-crawl-claim');
  });

  it('blocks Pixel Density device preset claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'pixel-density-calculator',
      locale: 'en',
      name: 'Pixel Density Calculator',
      description: '',
      detailedDescription: 'Includes presets for common resolutions and popular devices.',
      usageSteps: ['Select one of the device presets.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('pixel-density-device-preset-claim');
  });

  it('blocks iCal Parser full timezone handling claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'ical-parser',
      locale: 'en',
      name: 'iCal Parser',
      description: '',
      detailedDescription:
        'Supports both single events and recurring event series with full timezone handling.',
      usageSteps: [],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('ical-full-timezone-claim');
  });

  it('blocks Barcode Generator output controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'barcode-generator',
      locale: 'ru',
      name: 'Генератор штрих-кодов',
      description: '',
      detailedDescription:
        'Поддерживает PNG и EPS с настраиваемым разрешением от 72 до 600 DPI.',
      usageSteps: ['Настройте высоту штрихов, ширину модуля и цветовое оформление.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('barcode-unsupported-output-claim');
  });

  it('keeps accurate Barcode Generator preview-only support copy visible', () => {
    const report = assessSupportContentTrust({
      slug: 'barcode-generator',
      locale: 'en',
      name: 'Barcode Generator',
      description: '',
      detailedDescription:
        'The Barcode Generator creates a live SVG preview of a linear barcode directly in the browser. It is intended for browser preview only, without image-file export, print-resolution controls, styling controls, or print-grade label validation.',
      usageSteps: ['Choose Code 128, Code 39, EAN-13, or UPC-A and review the SVG preview.'],
      usageExamples: ['Preview an internal inventory code in Code 128 before placing it in a mock label.'],
      faqs: [
        {
          question: 'Which barcode types are supported?',
          answer: 'The current interface supports Code 128, Code 39, EAN-13, and UPC-A.',
        },
      ],
    });

    expect(report.blockSupportContent).toBe(false);
  });

  it('blocks French File Size Calculator controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'file-size-calculator',
      locale: 'fr',
      name: 'Calculateur de taille de fichier',
      description: '',
      detailedDescription: '',
      usageSteps: [
        "Activez les cases à cocher correspondant aux unités de destination souhaitées.",
        "Cliquez sur le bouton 'Convertir', puis utilisez 'Réinitialiser'.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('file-size-unsupported-fr-controls');
  });

  it('blocks Boxplot import and style controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'boxplot-chart-generator',
      locale: 'ru',
      name: 'Генератор диаграмм Boxplot',
      description: '',
      detailedDescription:
        'Инструмент принимает данные в формате CSV/JSON и парсит их с учетом пользовательских настроек разделителей.',
      usageSteps: [
        "Переключитесь на вкладку 'Настройки' и задайте минимальное/максимальное значение для отсечения выбросов.",
        "Настройте цветовую палитру через селектор HSL или HEX-код.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'boxplot-unsupported-import-style-claim'
    );
  });

  it('blocks Frosted Glass image controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'image-frosted-glass',
      locale: 'ru',
      name: 'Эффект туманного стекла',
      description: '',
      detailedDescription:
        'Используется WebGL-ускорение, прозрачный слой и изменение альфа-канала в RGBA-формате.',
      usageSteps: [
        "Активируйте опцию 'Invert Matte'.",
        "Выберите область применения эффекта через инструмент выделения 'Selection Area'.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'image-frosted-glass-unsupported-control-claim'
    );
  });

  it('blocks Morse Code Player reference chart claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'morse-code-player',
      locale: 'en',
      name: 'Morse Code Player',
      description: '',
      detailedDescription: 'Learn Morse code with the built-in reference chart.',
      usageSteps: [],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('morse-reference-chart-claim');
  });

  it('blocks Document Word Counter export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'document-word-counter',
      locale: 'es',
      name: 'Contador de Palabras de Documentos',
      description: '',
      detailedDescription: '',
      usageSteps: ['Exporta las estadísticas'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('document-word-counter-export-claim');
  });

  it('blocks multilingual Document Word Counter export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'document-word-counter',
      locale: 'zh',
      name: '文档字数统计',
      description: '',
      detailedDescription: '',
      usageSteps: ['导出统计结果', '統計をエクスポートする', '통계 내보내기'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('document-word-counter-export-claim');
  });

  it('allows Document Word Counter copy that matches the current live statistics UI', () => {
    const report = assessSupportContentTrust({
      slug: 'document-word-counter',
      locale: 'en',
      name: 'Document Word Counter',
      description: '',
      detailedDescription:
        'The tool analyzes pasted text in the browser and shows words, characters, sentences, paragraphs, lines, estimated pages, frequent words, reading time, and speaking time.',
      usageSteps: [
        'Paste or type document text into the text area.',
        'Review the live totals and detailed statistics.',
        'Edit the text and watch the counts update immediately.',
      ],
      usageExamples: ['Check whether an essay meets a required word limit.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(false);
    expect(report.issues).toEqual([]);
  });

  it('blocks Compound Interest Calculator visual chart claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'compound-interest-calculator',
      locale: 'en',
      name: 'Compound Interest Calculator',
      description: '',
      detailedDescription: 'Visual charts help you understand the impact of different investment strategies.',
      usageSteps: ['View final amount, total interest, and growth chart'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('compound-interest-visual-chart-claim');
  });

  it('blocks HTML Preview JavaScript execution claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'html-preview',
      locale: 'en',
      name: 'HTML Preview',
      description: 'Preview HTML code in real-time with CSS and JavaScript support.',
      detailedDescription:
        'The HTML preview supports full CSS styling and JavaScript execution, so you can test complete web pages including interactive elements.',
      usageSteps: ['Include JavaScript within <script> tags for interactivity.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('html-preview-javascript-claim');
  });

  it('blocks Spanish HTML Preview JavaScript execution claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'html-preview',
      locale: 'es',
      name: 'Vista Previa HTML',
      description: 'Previsualiza el código HTML en tiempo real con soporte para CSS y JavaScript.',
      detailedDescription: 'La herramienta ejecuta JavaScript para probar páginas interactivas completas.',
      usageSteps: [],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain('html-preview-javascript-claim');
  });

  it('blocks Half Doughnut Chart controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'half-doughnut-chart-generator',
      locale: 'ja',
      name: '半ドーナツチャートジェネレータ',
      description: '',
      detailedDescription:
        'JSON形式でデータを入力し、内半径・外半径の比率、回転オフセット角度、グラデーションカラーリングを設定できます。',
      usageSteps: ['コード生成タブからスクリプトをコピーします。'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'half-doughnut-unsupported-editor-claim'
    );
  });

  it('blocks Text to ASCII Art font and export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'text-to-ascii-art',
      locale: 'ru',
      name: 'Текст в ASCII-арт',
      description: '',
      detailedDescription: 'Инструмент поддерживает настройку шрифтов, стилей и размеров.',
      usageSteps: [
        "Выберите шрифт ASCII из списка 'Standard', 'Banner', и 'Slant'.",
        "Нажмите 'Download as Text' или 'Download as Image'.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'text-ascii-unsupported-export-font-claim'
    );
  });

  it('blocks Image Splitter advanced output controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'image-splitter',
      locale: 'ar',
      name: 'مقسم الصور',
      description: '',
      detailedDescription:
        'تحافظ الأداة على بيانات EXIF وتدعم PNG/JPEG/BMP مع إمكانية ضبط التداخل البكسل بين القطع.',
      usageSteps: [
        "ضع علامة اختيار على 'التفاف الحافة'.",
        'اختر تنسيق الإخراج المفضل PNG لجودة أعلى أو JPEG لملفات أصغر.',
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'image-splitter-unsupported-advanced-claim'
    );
  });

  it('blocks Credit Card Validator live verification claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'credit-card-validator',
      locale: 'ru',
      name: 'Проверщик кредитных карт',
      description: '',
      detailedDescription: 'Проверяет CVV и доступный баланс перед оплатой.',
      usageSteps: ['Run real-time authorization to authorize a card.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'credit-card-validator-live-verification-claim'
    );
  });

  it('blocks Scientific Calculator function claims that are not implemented in the button UI', () => {
    const report = assessSupportContentTrust({
      slug: 'scientific-calculator',
      locale: 'ru',
      name: 'Научный калькулятор',
      description: '',
      detailedDescription:
        'Поддерживает обратные тригонометрические функции, гиперболические функции sinh и cosh, а также решение дифференциальных уравнений.',
      usageSteps: [
        "Для ввода экспоненциального выражения используйте клавишу 'Exp'.",
        "Активируйте функцию '2nd' для доступа к sin⁻¹, cos⁻¹ и tan⁻¹.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'scientific-calculator-unsupported-function-claim'
    );
  });

  it('blocks multilingual Scientific Calculator mode and export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'scientific-calculator',
      locale: 'zh',
      name: '科学计算器',
      description: '',
      detailedDescription:
        '支持复数模式、逆波兰表示法、WebAssembly 执行、56种数学运算和矩阵模式。',
      usageSteps: [
        '点击历史记录查看计算过程。',
        'Export results as CSV or LaTeX for reports.',
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'scientific-calculator-unsupported-function-claim'
    );
  });

  it('allows Scientific Calculator copy that matches the current button UI', () => {
    const report = assessSupportContentTrust({
      slug: 'scientific-calculator',
      locale: 'en',
      name: 'Scientific Calculator',
      description: '',
      detailedDescription:
        'The calculator supports sin, cos and tan with RAD/DEG, ln and log, square root, x^y, pi, e, factorial, percent, sign change, memory keys MC, MR, M+ and MS, and result copying.',
      usageSteps: [
        'Choose RAD or DEG before using sin, cos, or tan.',
        'Use ln, log, square root, x^y, n!, %, and sign change for common scientific operations.',
      ],
      usageExamples: ['A student checks (3+4)*sin(30) in DEG mode.'],
      faqs: [
        {
          question: 'Can I store an intermediate value?',
          answer: 'Yes. Use MC, MR, M+, and MS for memory actions.',
        },
      ],
    });

    expect(report.blockSupportContent).toBe(false);
    expect(report.issues).toEqual([]);
  });

  it('blocks Random Color Generator palette controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'random-color-generator',
      locale: 'en',
      name: 'Random Color Generator',
      description: '',
      detailedDescription:
        'Create palettes with harmony modes, locked colors, seeded palettes, and a WCAG contrast checker.',
      usageSteps: ['Export CSS variables or PNG files from the palette history.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'random-color-generator-unsupported-palette-controls'
    );
  });

  it('blocks Dice Roller controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'dice-roller',
      locale: 'en',
      name: 'Dice Roller',
      description: '',
      detailedDescription:
        'Save custom dice sets for future use, configure weighted dice, and use seeded random rolls.',
      usageSteps: [
        'Select a die from the drop-down menu.',
        "Use the History tab and Settings icon to enable advanced statistical tracking.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'dice-roller-unsupported-control-claim'
    );
  });

  it('blocks Hex Editor UI overclaims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'hex-editor',
      locale: 'en',
      name: 'Hex Editor',
      description: '',
      detailedDescription:
        'The interface displays data in a hexadecimal grid with offset addresses and lets users directly modify byte values.',
      usageSteps: [
        'Select UTF-16LE/BE and adjust endianness.',
        'Export modified data using Download as Hex File.',
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'hex-editor-grid-claim',
        'hex-editor-byte-edit-claim',
        'hex-editor-unsupported-encoding-claim',
        'hex-editor-file-export-claim',
      ])
    );
  });

  it('blocks IP Validator bulk and export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'ip-validator',
      locale: 'ru',
      name: 'Проверка IP адреса',
      description: '',
      detailedDescription: 'Поддерживаются одиночные адреса или список через запятую.',
      usageSteps: [
        'Выберите режим проверки на вкладке «Options».',
        'Скачайте отчёт в формате JSON или CSV для CI/CD-пайплайны.',
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'ip-validator-unsupported-workflow-claim'
    );
  });

  it('blocks IP Lookup WHOIS, BGP, PTR, and export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'ip-lookup',
      locale: 'ru',
      name: 'Поиск IP адреса',
      description: '',
      detailedDescription:
        'Инструмент использует GeoIP2, WHOIS и BGP-маршрутизацию для анализа Round-Trip Time.',
      usageSteps: [
        'Отметьте «Показать BGP-маршрут».',
        'Экспортируйте результат через Download Data.',
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'ip-lookup-unsupported-network-intel-claim'
    );
  });

  it('blocks Due Date Calculator medical precision claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'due-date-calculator',
      locale: 'fr',
      name: "Calculateur de date d'accouchement",
      description: '',
      detailedDescription:
        "Utilise un Modèle probabiliste SFMP avec intervalle de confiance pour une estimation ultra-précise.",
      usageSteps: [
        "Réglez le curseur de longueur du cycle.",
        "Importez les données d'échographie avec CRL en mm.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'due-date-unsupported-medical-precision-claim'
    );
  });

  it('blocks Graph Chart editor and embed claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'graph-chart-generator',
      locale: 'fr',
      name: 'Générateur de graphes',
      description: '',
      detailedDescription:
        'Utilise des algorithmes de mise en page avancés et permet de personnaliser les couleurs, les formes.',
      usageSteps: [
        'Ajoutez les propriétés de lien.',
        'Copier le code HTML pour intégrer le graphe dans une application web.',
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'graph-chart-unsupported-editor-claim'
    );
  });

  it('blocks Gantt Chart project-management claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'gantt-chart-generator',
      locale: 'en',
      name: 'Gantt Chart Maker',
      description: '',
      detailedDescription:
        'The visual timeline helps identify task dependencies for project delivery planning.',
      usageSteps: ['Use the tool to manage dependencies before export.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'gantt-chart-unsupported-project-management-claim'
    );
  });

  it('blocks Spanish Gantt Chart project-management claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'gantt-chart-generator',
      locale: 'es',
      name: 'Generador de diagramas de Gantt',
      description: '',
      detailedDescription:
        'La línea de tiempo visual ayuda a identificar dependencias y posibles cuellos de botella.',
      usageSteps: ['Use el panel para gestionar las dependencias y revisar la ruta crítica.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'gantt-chart-unsupported-project-management-claim'
    );
  });

  it('blocks Timeline Chart style controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'timeline-chart-generator',
      locale: 'en',
      name: 'Timeline Chart Generator',
      description: '',
      detailedDescription: '',
      usageSteps: ['Adjust colors, marker styles, labels, and spacing to match the density of your timeline.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'timeline-chart-unsupported-style-controls'
    );
  });

  it('blocks French Mortgage Calculator loan-cost and analysis-tab claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'mortgage-calculator',
      locale: 'fr',
      name: "Calculatrice d'emprunt immobilier",
      description: '',
      detailedDescription:
        "Il intègre des paramètres comme les taxes foncières, assurance habitation, frais de dossier.",
      usageSteps: [
        "Cochez les options complémentaires.",
        "Consultez l'onglet « Analyse » pour comparer un prêt à taux variable.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'mortgage-calculator-fr-unsupported-loan-claim'
    );
  });

  it('keeps accurate French Mortgage Calculator support copy visible', () => {
    const report = assessSupportContentTrust({
      slug: 'mortgage-calculator',
      locale: 'fr',
      name: "Calculatrice d'emprunt immobilier",
      description: '',
      detailedDescription:
        "La calculatrice estime un versement mensuel avec le prix du logement, l'apport, le taux annuel, la durée du prêt et un versement mensuel supplémentaire.",
      usageSteps: [
        "Saisissez le prix du logement et l'apport.",
        "Affichez le tableau d'amortissement pour consulter les premières lignes mensuelles.",
      ],
      usageExamples: ['Un acheteur compare deux durées de prêt avec le même apport.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(false);
  });

  it('blocks GPA Calculator policy and weighting claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'gpa-calculator',
      locale: 'en',
      name: 'GPA Calculator',
      description: '',
      detailedDescription:
        'It supports honors/AP designations, pass/fail options, repeated courses, and hypothetical scenarios.',
      usageSteps: [
        'Select course type (Standard, Honors, AP).',
        "Toggle 'Excluded from GPA' checkbox or choose percentage-based input.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'gpa-calculator-en-unsupported-policy-claim'
    );
  });

  it('keeps accurate GPA Calculator course-row support copy visible', () => {
    const report = assessSupportContentTrust({
      slug: 'gpa-calculator',
      locale: 'en',
      name: 'GPA Calculator',
      description: '',
      detailedDescription:
        'The GPA Calculator computes a grade point average from editable course rows with a course name, credit value, and letter grade.',
      usageSteps: [
        'Choose the 4.0 or 5.0 GPA scale.',
        'Review the GPA result, total credits, total points, and percentage summary.',
      ],
      usageExamples: ['A student estimates a semester GPA from four letter-graded courses.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(false);
  });

  it('blocks Tile Calculator layout controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'tile-calculator',
      locale: 'en',
      name: 'Tile Calculator',
      description: '',
      detailedDescription:
        'Supports asymmetric layout adjustments, protrusions or recesses, hexagonal tile shape, and substrate irregularity.',
      usageSteps: ["Activate 'Obstruction Adjustment' to subtract fixed elements."],
      usageExamples: ['Plan dry vs. wet areas requiring waterproof membranes.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'tile-calculator-unsupported-layout-claim'
    );
  });

  it('blocks DPI Calculator image inspection claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'dpi-calculator',
      locale: 'en',
      name: 'DPI Calculator',
      description: '',
      detailedDescription: 'Upload an image and read image metadata from the EXIF and ICC profile.',
      usageSteps: ['Detect image dimensions and resize images for print.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'dpi-calculator-unsupported-image-inspection-claim'
    );
  });

  it('blocks Roman Numeral strict validation claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'roman-numeral-converter',
      locale: 'en',
      name: 'Roman Numeral Converter',
      description: '',
      detailedDescription: 'A strict validator that rejects invalid Roman numerals and historical variants.',
      usageSteps: [],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'roman-numeral-unsupported-validation-claim'
    );
  });

  it('blocks IP Subnet live network claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'ip-subnet-calculator',
      locale: 'en',
      name: 'IP Subnet Calculator',
      description: '',
      detailedDescription: 'Supports IPv6 and scans the network to detect devices.',
      usageSteps: ['Ping hosts and query routers to find live devices.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'ip-subnet-unsupported-live-network-claim'
    );
  });

  it('blocks GIF Maker editor controls that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'gif-maker',
      locale: 'en',
      name: 'GIF Maker',
      description: '',
      detailedDescription: 'Use a Frame Rate slider in fps, Dimensions fields, and text overlays.',
      usageSteps: ['Use Fit to Width, Fit to Height, Loop Count, and video files before export.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'gif-maker-unsupported-editor-claim'
    );
  });

  it('keeps accurate support copy for this recovery batch visible', () => {
    const examples = [
      {
        slug: 'tile-calculator',
        name: 'Tile Calculator',
        detailedDescription:
          'The Tile Calculator estimates tiles for a rectangular floor or wall area with metric or imperial units, grout width, waste percentage, pattern, and optional tiles per box.',
      },
      {
        slug: 'dpi-calculator',
        name: 'DPI Calculator',
        detailedDescription:
          'DPI Calculator connects pixel dimensions, print size, and print resolution from manual inputs.',
      },
      {
        slug: 'roman-numeral-converter',
        name: 'Roman Numeral Converter',
        detailedDescription:
          'Roman Numeral Converter switches between Arabic numbers from 1 to 3999 and Roman symbols such as I, V, X, L, C, D, and M.',
      },
      {
        slug: 'ip-subnet-calculator',
        name: 'IP Subnet Calculator',
        detailedDescription:
          'IP Subnet Calculator calculates IPv4 subnet details from an IP address and subnet mask in the browser.',
      },
      {
        slug: 'gif-maker',
        name: 'GIF Maker',
        detailedDescription:
          'GIF Maker turns two or more uploaded images into a browser-generated animated GIF with frame delay and quality settings.',
      },
    ];

    for (const example of examples) {
      const report = assessSupportContentTrust({
        ...example,
        locale: 'en',
        description: '',
        usageSteps: ['Use the visible controls, review the result, and copy or download where available.'],
        usageExamples: ['Use the tool for a quick browser-based planning task.'],
        faqs: [],
      });

      expect(report.blockSupportContent, example.slug).toBe(false);
    }
  });

  it('blocks unsupported claims for the next high-impression recovery batch', () => {
    const examples = [
      {
        slug: 'api-tester',
        name: 'API Tester',
        detailedDescription:
          'This client can send requests to any API endpoint, bypass CORS with a CORS proxy, store request history, and organize collections with environment variables.',
        usageSteps: ['Configure OAuth flows and secret storage.'],
        expectedCode: 'api-tester-unsupported-client-claim',
      },
      {
        slug: 'radar-chart-generator',
        name: 'Radar Chart Generator',
        detailedDescription:
          'Click the Add Data button, use advanced CSV formulas, trend lines, custom marker controls, and gradient fill styles.',
        usageSteps: ['Share the chart directly from the tool.'],
        expectedCode: 'radar-chart-unsupported-editor-claim',
      },
      {
        slug: 'meeting-agenda-builder',
        name: 'Meeting Agenda Builder',
        detailedDescription:
          'Export and share agendas, send calendar invitations, download PDF files, and manage a shared workspace meeting library.',
        usageSteps: ['Push the agenda to Google Calendar and Outlook.'],
        expectedCode: 'meeting-agenda-unsupported-export-share-claim',
      },
      {
        slug: 'carbon-footprint-calculator',
        name: 'Carbon Footprint Calculator',
        detailedDescription:
          'Provides a comprehensive breakdown for Scope 1, Scope 2, and Scope 3 with country-specific electricity and regional grid factors.',
        usageSteps: ['Plan carbon offset strategies for individuals or businesses.'],
        expectedCode: 'carbon-footprint-unsupported-audit-offset-claim',
      },
      {
        slug: 'png-to-svg',
        name: 'PNG to SVG Converter',
        detailedDescription:
          'The tool traces raster images and converts them to scalable vector graphics for resolution-independent logos with Bezier curves.',
        usageSteps: ['Fine-tune colors and paths, vectorize logos, and create vector art from photos.'],
        expectedCode: 'png-to-svg-unsupported-vectorization-claim',
      },
    ];

    for (const example of examples) {
      const report = assessSupportContentTrust({
        slug: example.slug,
        locale: 'en',
        name: example.name,
        description: '',
        detailedDescription: example.detailedDescription,
        usageSteps: example.usageSteps,
        usageExamples: [],
        faqs: [],
      });

      expect(report.blockSupportContent, example.slug).toBe(true);
      expect(report.issues.map((issue) => issue.code), example.slug).toContain(
        example.expectedCode
      );
    }
  });

  it('keeps accurate support copy for the next high-impression recovery batch visible', () => {
    const examples = [
      {
        slug: 'api-tester',
        name: 'API Tester',
        detailedDescription:
          'API Tester sends browser-based HTTP requests with a method selector, editable headers, optional body, response status, elapsed time, response headers, and response body.',
      },
      {
        slug: 'radar-chart-generator',
        name: 'Radar Chart Generator',
        detailedDescription:
          'Radar Chart Generator creates an editable ECharts radar chart with indicator rows, series rows, four color themes, shape, fill opacity, legend visibility, and PNG or SVG download.',
      },
      {
        slug: 'meeting-agenda-builder',
        name: 'Meeting Agenda Builder',
        detailedDescription:
          'Meeting Agenda Builder creates a structured agenda with meeting details, item durations, item ordering, and Markdown, plain text, or HTML copy output.',
      },
      {
        slug: 'carbon-footprint-calculator',
        name: 'Carbon Footprint Calculator',
        detailedDescription:
          'Carbon Footprint Calculator estimates annualized CO2 emissions from visible transportation, home energy, and diet inputs using fixed emission factors.',
      },
      {
        slug: 'png-to-svg',
        name: 'PNG to SVG Converter',
        detailedDescription:
          'PNG to SVG Converter creates an SVG file in Embed mode or Simple Trace mode with a brightness threshold and copy or download output.',
      },
    ];

    for (const example of examples) {
      const report = assessSupportContentTrust({
        ...example,
        locale: 'en',
        description: '',
        usageSteps: ['Use the visible controls, review the output, and copy or download where available.'],
        usageExamples: ['Use the tool for a quick browser-based workflow.'],
        faqs: [],
      });

      expect(report.blockSupportContent, example.slug).toBe(false);
    }
  });

  it('blocks Calorie Calculator medical and macro-planning claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'calorie-calculator',
      locale: 'ar',
      name: 'حاسبة السعرات الحرارية',
      description: '',
      detailedDescription:
        'تدمج الحاسبة مستويات الثيروكسين وكتلة العضلات ومؤشر كتلة الجسم (BMI) في الحسابات.',
      usageSteps: ['اعرض توزيع البروتينات والدهون والكربوهيدرات المقترح.'],
      usageExamples: ['خطة غذائية للتحكم في مرض السكري.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'calorie-calculator-unsupported-medical-macro-claim'
    );
  });

  it('blocks Database Schema Visualizer ER canvas and export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'database-schema-visualizer',
      locale: 'en',
      name: 'Database Schema Visualizer',
      description: '',
      detailedDescription: 'Database Schema Visualizer creates visual ER diagrams from SQL.',
      usageSteps: ['Click Visualize, Drag to arrange, then Export as PNG/SVG.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'database-schema-visualizer-unsupported-er-export-claim'
    );
  });

  it('blocks Binary to Decimal signed-mode and output-matrix claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'binary-to-decimal',
      locale: 'en',
      name: 'Binary to Decimal',
      description: '',
      detailedDescription:
        'View results in all three bases displayed in the output matrix with overflow detection.',
      usageSteps: ["Use the Swap button and toggle 'Signed Mode' to enable two's complement."],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'binary-to-decimal-unsupported-signed-matrix-claim'
    );
  });

  it('blocks German Image Flip Rotate metadata and format claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'image-flip-rotate',
      locale: 'de',
      name: 'Bild Drehen & Spiegeln',
      description: '',
      detailedDescription:
        'Ueberschreibt EXIF-Orientierungsinformationen und bewahrt die Metadatenstruktur.',
      usageSteps: [
        "Aktivieren Sie den Qualitaetsmodus und verwenden Sie den Vorschau'-Button.",
        "Klicken Sie auf 'Speichern unter' und waehlen Sie JPEG/PNG/BMP/WEBP.",
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'image-flip-rotate-unsupported-metadata-format-claim'
    );
  });

  it('blocks Email Signature Generator client sync claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'email-signature-generator',
      locale: 'es',
      name: 'Generador de Firmas de Correo Electronico',
      description: '',
      detailedDescription: 'La herramienta sincroniza con Gmail y Outlook automaticamente.',
      usageSteps: ['Instala automaticamente la firma y envia correos de prueba.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'email-signature-generator-unsupported-email-client-claim'
    );
  });

  it('blocks Text Spinner SEO, plagiarism, and export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'text-spinner',
      locale: 'es',
      name: 'Girador de Texto',
      description: '',
      detailedDescription: 'Diseñado para evitar el plagio y mejorar la SEO de tus textos.',
      usageSteps: ['Obtén versiones JSON, Base64 y SVG de tu contenido.'],
      usageExamples: ['Genera artículos únicos.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'text-spinner-unsupported-seo-export-claim'
    );
  });

  it('blocks TypeScript Playground compiler and runtime claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'typescript-playground',
      locale: 'en',
      name: 'TypeScript Playground',
      description: '',
      detailedDescription: 'Developers can write, compile, and test TypeScript code in the browser.',
      usageSteps: ['Configure options and debug code.'],
      usageExamples: ['Test type definitions and share code snippets.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'typescript-playground-unsupported-compiler-runtime-claim'
    );
  });

  it('blocks Financial Forecast cash-flow and investor claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'financial-forecast-calculator',
      locale: 'en',
      name: 'Financial Forecast Calculator',
      description: '',
      detailedDescription: 'Create investor projections with seasonal adjustment.',
      usageSteps: ['Project cash flow and run Monte Carlo analysis.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'financial-forecast-unsupported-cashflow-investor-claim'
    );
  });

  it('blocks Graph Chart advanced editor claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'graph-chart-generator',
      locale: 'en',
      name: 'Graph Chart Generator',
      description: '',
      detailedDescription:
        'It leverages advanced graph theory algorithms and supports directed and undirected graphs.',
      usageSteps: ['Switch to the Edges tab, specify the edge type, and choose a Tree layout.'],
      usageExamples: ['Find potential bottlenecks in a network map.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'graph-chart-unsupported-editor-claim'
    );
  });

  it('blocks Binary to Text file and encoding claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'binary-to-text',
      locale: 'en',
      name: 'Binary to Text',
      description: '',
      detailedDescription: 'Upload binary files and run full Unicode encoding analysis.',
      usageSteps: ['Use base64 conversion or decode encrypted data.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'binary-to-text-unsupported-file-encoding-claim'
    );
  });

  it('blocks Screen Recorder output, upload, overlay, and editing claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'screen-recorder',
      locale: 'en',
      name: 'Screen Recorder',
      description: '',
      detailedDescription:
        'Record webcam overlay videos, trim the result in a video editor, and export MP4 or GIF files.',
      usageSteps: ['Use cloud upload after scheduled recording.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'screen-recorder-unsupported-output-claim'
    );
  });

  it('keeps accurate Screen Recorder browser permission copy visible', () => {
    const report = assessSupportContentTrust({
      slug: 'screen-recorder',
      locale: 'en',
      name: 'Screen Recorder',
      description: '',
      detailedDescription:
        'Screen Recorder uses the browser screen-sharing permission to record the screen, window, or tab you select in the prompt.',
      usageSteps: [
        'Use Pause and Resume if you need to temporarily stop adding to the recording.',
        'Download the result as a WebM file or start a new recording.',
      ],
      usageExamples: ['Capture a quick product walkthrough from a browser tab.'],
      faqs: [
        {
          question: 'Which file type is downloaded?',
          answer: 'The current recording is downloaded as a WebM file.',
        },
      ],
    });

    expect(report.blockSupportContent).toBe(false);
  });

  it('blocks Calendar Availability external sync and date-range claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'calendar-availability-finder',
      locale: 'en',
      name: 'Calendar Availability Finder',
      description: '',
      detailedDescription:
        'Find real-time calendar availability across calendars for a selected date range.',
      usageSteps: ['Use Select meeting time after automatic calendar sync finishes.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'calendar-availability-external-calendar-claim'
    );
  });

  it('blocks Crontab Calendar export and timezone-database claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'crontab-calendar',
      locale: 'en',
      name: 'Crontab Calendar',
      description: '',
      detailedDescription:
        'Supports Vixie, AIX, and systemd variants with IANA Time Zone Database handling and conflict detection.',
      usageSteps: ['Use Download as iCal or Copy JSON for programmatic output formats.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'crontab-calendar-unsupported-export-timezone-claim'
    );
  });

  it('blocks Database Connection Tester live testing claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'database-connection-tester',
      locale: 'en',
      name: 'Database Connection Tester',
      description: '',
      detailedDescription: 'This tool tests live database connections and can validate live database credentials.',
      usageSteps: ['Click Parse, View parsed details, and Validate format.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'database-connection-tester-live-claim'
    );
  });

  it('blocks Russian Excel Merger advanced merge claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'excel-merger',
      locale: 'ru',
      name: 'Объединить Excel',
      description: '',
      detailedDescription:
        'Использует Apache POI для XLSX/CSV, поддерживает многоуровневые заголовки и условные форматы.',
      usageSteps: [
        'Активируйте Автоопределение ключевых полей для сопоставления на основе первичных ключей.',
        'Скачайте XLSX с сохраненными форматами и формулами.',
      ],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'excel-merger-unsupported-advanced-merge-claim'
    );
  });

  it('blocks multilingual Excel Merger advanced workflow claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'excel-merger',
      locale: 'zh',
      name: 'Excel合并器',
      description: '',
      detailedDescription:
        '使用 WorkbookConcatenator 和 XSSFCellStyler，通过字段映射和主键字段实现 SQL JOIN。',
      usageSteps: [
        '点击预览结果后调整字段映射。',
        'فعّل كشف التكرار وسجل تغييرات قبل التحميل.',
      ],
      usageExamples: ['Process VLOOKUP and INDEX-MATCH cells during merge.'],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'excel-merger-unsupported-advanced-merge-claim'
    );
  });

  it('blocks Russian Color Blender export and mode claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'color-blender',
      locale: 'ru',
      name: 'Смешать цвета',
      description: '',
      detailedDescription:
        'Смешивайте значения RGB, HSL или HEX, выбирайте режимы смешивания и настройку прозрачности.',
      usageSteps: ['Экспортируйте результат в CSS, SVG или PNG.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'color-blender-unsupported-export-mode-claim'
    );
  });

  it('blocks unsupported claims for the document and parser recovery batch', () => {
    const examples = [
      {
        slug: 'reading-time-calculator',
        name: 'Calculadora de Tiempo de Lectura',
        locale: 'es',
        detailedDescription:
          'Usa procesamiento de lenguaje natural, analisis lexico, perfil del lector y analisis contextual.',
        usageSteps: [
          'Pega texto con soporte para formato Markdown y elige el idioma en el menu desplegable.',
          "Haz clic en el boton 'Calcular' para ver el desglose detallado por secciones.",
        ],
        expectedCode: 'reading-time-unsupported-analysis-claim',
      },
      {
        slug: 'image-collage',
        name: 'Montagem de Imagens',
        locale: 'pt',
        detailedDescription:
          'Escolha layouts predefinidos, adicionar bordas, aplicar filtros e efeitos visuais.',
        usageSteps: ['Pre-visualize no visor ao vivo e baixe em PNG ou JPEG.'],
        expectedCode: 'image-collage-unsupported-editor-claim',
      },
      {
        slug: 'image-to-pdf',
        name: 'Bild zu PDF',
        locale: 'de',
        detailedDescription:
          'Geben Sie oder fuegen Sie Inhalt in ein Eingabefeld ein, nutzen Sie quality slider, OCR recognition und DPI controls.',
        usageSteps: ['Kopieren oder laden Sie die bearbeiteten Ergebnisse herunter.'],
        expectedCode: 'image-to-pdf-unsupported-workflow-claim',
      },
      {
        slug: 'text-to-pdf',
        name: 'Text to PDF',
        locale: 'en',
        detailedDescription:
          'Use PDF templates, custom margin controls, landscape orientation, page numbers, and watermark settings.',
        usageSteps: ['Insert images, add headers and footers, then export.'],
        expectedCode: 'text-to-pdf-unsupported-layout-claim',
      },
      {
        slug: 'xml-validator',
        name: 'XML Validator',
        locale: 'en',
        detailedDescription:
          'The validator uses SAX2 and libxml2 with XSD Validation, DTD validation, namespace-aware processing, and JSON format for CI/CD.',
        usageSteps: ['Upload a .xml file, use Quick Fix, then Download the validated XML.'],
        expectedCode: 'xml-validator-unsupported-schema-claim',
      },
    ];

    for (const example of examples) {
      const report = assessSupportContentTrust({
        slug: example.slug,
        locale: example.locale,
        name: example.name,
        description: '',
        detailedDescription: example.detailedDescription,
        usageSteps: example.usageSteps,
        usageExamples: [],
        faqs: [],
      });

      expect(report.blockSupportContent, example.slug).toBe(true);
      expect(report.issues.map((issue) => issue.code), example.slug).toContain(
        example.expectedCode
      );
    }
  });

  it('keeps accurate support copy for the document and parser recovery batch visible', () => {
    const examples = [
      {
        slug: 'reading-time-calculator',
        name: 'Calculadora de Tiempo de Lectura',
        locale: 'es',
        detailedDescription:
          'La Calculadora de Tiempo de Lectura estima cuanto tardara una persona en leer un texto a partir del recuento de palabras y una velocidad ajustable en palabras por minuto.',
      },
      {
        slug: 'image-collage',
        name: 'Montagem de Imagens',
        locale: 'pt',
        detailedDescription:
          'O Image Collage combina imagens carregadas em uma unica imagem PNG diretamente no navegador com direcao horizontal ou vertical, espacamento e cor de fundo.',
      },
      {
        slug: 'image-to-pdf',
        name: 'Bild zu PDF',
        locale: 'de',
        detailedDescription:
          'Bild zu PDF erstellt aus hochgeladenen PNG-, JPEG-, JPG- oder WebP-Bildern eine PDF-Datei direkt im Browser.',
      },
      {
        slug: 'text-to-pdf',
        name: 'Text to PDF',
        locale: 'en',
        detailedDescription:
          'Text to PDF Converter turns typed or pasted plain text into a downloadable PDF in the browser with an optional title, font family, font size, and A4 or Letter page size.',
      },
      {
        slug: 'xml-validator',
        name: 'XML Validator',
        locale: 'en',
        detailedDescription:
          "XML Validator checks whether pasted XML is well-formed by using the browser's XML parser and shows parser error text when available.",
      },
    ];

    for (const example of examples) {
      const report = assessSupportContentTrust({
        ...example,
        description: '',
        usageSteps: ['Use the visible controls, review the result, and adjust the input if needed.'],
        usageExamples: ['Use the tool for a quick browser-based workflow.'],
        faqs: [
          {
            question: `Where does ${example.name} run?`,
            answer: 'The current tool runs in the browser.',
          },
        ],
      });

      expect(report.blockSupportContent, example.slug).toBe(false);
      expect(report.issues, example.slug).toEqual([]);
    }
  });

  it('blocks unsupported claims for the next recovery content batch', () => {
    const examples = [
      {
        slug: 'text-summarizer',
        name: 'Resumidor de Texto',
        locale: 'es',
        detailedDescription:
          'Procesa documentos con BERT, transformer, TF-IDF y similitud coseno.',
        usageSteps: ['Arrastre un archivo .docx y descarga el resultado en .json con metadatos.'],
        expectedCode: 'text-summarizer-unsupported-ai-file-export-claim',
      },
      {
        slug: 'inflation-calculator',
        name: 'Inflation Calculator',
        locale: 'en',
        detailedDescription:
          'Use official CPI, historical prices, retirement savings, investments, taxes, and market risk.',
        usageSteps: [],
        expectedCode: 'inflation-calculator-unsupported-cpi-investment-claim',
      },
      {
        slug: 'ip-geolocation',
        name: 'IP Geolocation',
        locale: 'en',
        detailedDescription:
          'Shows accurate results with exact location, GPS, WHOIS, BGP, reverse DNS, and PTR.',
        usageSteps: [],
        expectedCode: 'ip-geolocation-unsupported-precision-network-claim',
      },
      {
        slug: 'aspect-ratio-resizer',
        name: 'Aspect Ratio Resizer',
        locale: 'en',
        detailedDescription:
          'Preserves EXIF metadata, supports JPEG export, quality slider, crop handles, and batch resize.',
        usageSteps: [],
        expectedCode: 'aspect-ratio-resizer-unsupported-editor-claim',
      },
      {
        slug: 'wordcloud-generator',
        name: 'Word Cloud Generator',
        locale: 'en',
        detailedDescription:
          'Upload Text files and use NLP sentiment analysis, custom font settings, custom color, and Freeform layout.',
        usageSteps: [],
        expectedCode: 'wordcloud-unsupported-nlp-upload-font-claim',
      },
    ];

    for (const example of examples) {
      const report = assessSupportContentTrust({
        slug: example.slug,
        locale: example.locale,
        name: example.name,
        description: '',
        detailedDescription: example.detailedDescription,
        usageSteps: example.usageSteps,
        usageExamples: [],
        faqs: [],
      });

      expect(report.blockSupportContent, example.slug).toBe(true);
      expect(report.issues.map((issue) => issue.code), example.slug).toContain(
        example.expectedCode
      );
    }
  });

  it('keeps accurate support copy for the next recovery content batch visible', () => {
    const examples = [
      {
        slug: 'text-summarizer',
        name: 'Resumidor de Texto',
        locale: 'es',
        detailedDescription:
          'El Resumidor de Texto crea un resumen extractivo directamente en el navegador.',
      },
      {
        slug: 'inflation-calculator',
        name: 'Inflation Calculator',
        locale: 'en',
        detailedDescription:
          'Inflation Calculator estimates how a fixed annual inflation rate changes an amount across a year range.',
      },
      {
        slug: 'ip-geolocation',
        name: 'IP Geolocation',
        locale: 'en',
        detailedDescription:
          'IP Geolocation looks up approximate network location details for an IPv4 or IPv6 address from public HTTPS geolocation APIs.',
      },
      {
        slug: 'aspect-ratio-resizer',
        name: 'Aspect Ratio Resizer',
        locale: 'en',
        detailedDescription:
          'Aspect Ratio Resizer resamples an uploaded image in the browser and downloads the result as a PNG file.',
      },
      {
        slug: 'wordcloud-generator',
        name: 'Word Cloud Generator',
        locale: 'en',
        detailedDescription:
          'Word Cloud Generator turns a short list of weighted terms, or text pasted into the Text Input box, into an ECharts word-cloud preview.',
      },
    ];

    for (const example of examples) {
      const report = assessSupportContentTrust({
        ...example,
        description: '',
        usageSteps: ['Use the visible controls, review the result, and adjust the input if needed.'],
        usageExamples: ['Use the tool for a quick browser-based workflow.'],
        faqs: [
          {
            question: `Where does ${example.name} run?`,
            answer: 'The current tool runs in the browser.',
          },
        ],
      });

      expect(report.blockSupportContent, example.slug).toBe(false);
      expect(report.issues, example.slug).toEqual([]);
    }
  });

  it('blocks Keyboard Tester event export claims that are not implemented', () => {
    const report = assessSupportContentTrust({
      slug: 'keyboard-tester',
      locale: 'en',
      name: 'Keyboard Tester',
      description: '',
      detailedDescription:
        'Use the Copy button beneath the matrix to export raw event data including isTrusted flag and event timestamp.',
      usageSteps: ['Compare output against keylogger detection mechanisms.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'keyboard-tester-unsupported-event-export-claim'
    );
  });

  it('keeps accurate Keyboard Tester browser-event support copy visible', () => {
    const report = assessSupportContentTrust({
      slug: 'keyboard-tester',
      locale: 'en',
      name: 'Keyboard Tester',
      description: '',
      detailedDescription:
        'The Keyboard Tester listens for keydown and keyup events, highlights matching keys on the visual keyboard, and shows the latest key, code, and keyCode values.',
      usageSteps: ['Press a key and review the browser-reported key, code, and keyCode values.'],
      usageExamples: ['Check whether a browser shortcut reaches the page before wiring it into an app.'],
      faqs: [
        {
          question: 'Can it certify keyboard ghosting?',
          answer: 'No. It only shows which browser key events reach the page.',
        },
      ],
    });

    expect(report.blockSupportContent).toBe(false);
  });

  it('blocks Database Migration Generator download and full-file claims', () => {
    const report = assessSupportContentTrust({
      slug: 'database-migration-generator',
      locale: 'en',
      name: 'Database Migration Generator',
      description: '',
      detailedDescription: 'Create full up and down migration files with downloadable migration output.',
      usageSteps: ['Copy or download the migration after generation.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      'database-migration-unsupported-download-claim'
    );
  });

  it('keeps scoped rules from blocking unrelated tools', () => {
    const report = assessSupportContentTrust({
      slug: 'timezone-converter',
      locale: 'en',
      name: 'Timezone Converter',
      description: '',
      detailedDescription:
        'The tool uses timezone data and exposes dual timezone selectors for quick planning.',
      usageSteps: ['Adjust the quality slider when exporting an image in a different workflow.'],
      usageExamples: [],
      faqs: [],
    });

    expect(report.blockSupportContent).toBe(false);
  });
});
