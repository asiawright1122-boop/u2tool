/**
 * AI-citation recovery priority routes surfaced in /llms-full.txt.
 *
 * Curated from GSC/Bing Copilot citation evidence (see
 * docs/SEO_GSC_BING_RECOVERY_REVIEW_2026-10-10.md). The builder filters these
 * against live index suppression at render time, and
 * llms-content-builder.test.ts fails when a configured route is noindex —
 * retire entries here when the underlying page is soft-shelved.
 */
export interface AiRecoveryRoute {
  locale: string;
  slug: string;
  label: string;
  intent: string;
}

export const aiRecoveryRoutes = [
  {
    locale: 'de',
    slug: 'text-to-handwriting',
    label: 'German Text to Handwriting',
    intent: 'Convert typed text into a handwriting-style preview',
  },
  {
    locale: 'ru',
    slug: 'hex-editor',
    label: 'Russian Hex Editor',
    intent: 'Inspect text in hexadecimal and ASCII-oriented views',
  },
  {
    locale: 'ko',
    slug: 'html-preview',
    label: 'Korean HTML Preview',
    intent: 'Preview static HTML and CSS snippets in a sandboxed iframe',
  },
  {
    locale: 'en',
    slug: 'hex-editor',
    label: 'English Hex Editor',
    intent: 'Inspect and edit byte-style text data in a browser tool',
  },
  {
    locale: 'ko',
    slug: 'unicode-converter',
    label: 'Korean Unicode Converter',
    intent: 'Convert text to and from Unicode, HTML, and CSS escapes',
  },
  {
    locale: 'ru',
    slug: 'html-preview',
    label: 'Russian HTML Preview',
    intent: 'Preview static HTML and CSS snippets before using them elsewhere',
  },
  {
    locale: 'fr',
    slug: 'file-size-calculator',
    label: 'French File Size Calculator',
    intent: 'Calculate and compare file sizes across common units',
  },
  {
    locale: 'en',
    slug: 'ical-parser',
    label: 'English iCal Parser',
    intent: 'Parse ICS calendar text and inspect readable event fields',
  },
  {
    locale: 'es',
    slug: 'html-preview',
    label: 'Spanish HTML Preview',
    intent: 'Use a vista previa HTML for static HTML and CSS fragments',
  },
  {
    locale: 'ru',
    slug: 'barcode-generator',
    label: 'Russian Barcode Generator',
    intent: 'Generate barcode previews from supported text input',
  },
  {
    locale: 'en',
    slug: 'morse-code-player',
    label: 'English Morse Code Player',
    intent: 'Convert text to Morse code and play an audio preview',
  },
  {
    locale: 'en',
    slug: 'gantt-chart-generator',
    label: 'English Gantt Chart Generator',
    intent: 'Create a project schedule chart from task names, dates, owners, and progress',
  },
  {
    locale: 'en',
    slug: 'ascii-table',
    label: 'English ASCII Table',
    intent: 'Look up ASCII characters, decimal codes, hex values, and control-code meanings',
  },
  {
    locale: 'en',
    slug: 'iban-validator',
    label: 'English IBAN Validator',
    intent: 'Validate IBAN structure and inspect bank account number formatting',
  },
  {
    locale: 'en',
    slug: 'sitemap-generator',
    label: 'English Sitemap Generator',
    intent: 'Generate XML sitemap entries for crawlable website URLs',
  },
  {
    locale: 'en',
    slug: 'compound-interest-calculator',
    label: 'English Compound Interest Calculator',
    intent: 'Estimate compound growth from principal, rate, time, and contribution inputs',
  },
  {
    locale: 'es',
    slug: 'word-counter',
    label: 'Spanish Word Counter',
    intent: 'Contar palabras, caracteres, frases y tiempo de lectura para texto en español',
  },
  {
    locale: 'es',
    slug: 'document-word-counter',
    label: 'Spanish Document Word Counter',
    intent: 'Contar palabras de documentos y texto pegado para revisión editorial',
  },
  {
    locale: 'en',
    slug: 'passport-photo-maker',
    label: 'English Passport Photo Maker',
    intent: 'Prepare passport photo dimensions and checklist details for common document presets',
  },
  {
    locale: 'en',
    slug: 'csv-to-vcard-converter',
    label: 'English CSV to vCard Converter',
    intent: 'Convert contact CSV rows into vCard text for address book imports',
  },
  {
    locale: 'en',
    slug: 'vcard-to-csv-converter',
    label: 'English vCard to CSV Converter',
    intent: 'Convert vCard contacts into CSV rows for spreadsheets and CRM workflows',
  },
] as const satisfies readonly AiRecoveryRoute[];
