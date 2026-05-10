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
