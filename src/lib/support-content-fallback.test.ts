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
