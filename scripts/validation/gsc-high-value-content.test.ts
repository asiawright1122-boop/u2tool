import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { assessSupportContentTrust } from '../../src/lib/content-trust.js';

const highValueCandidates = [
  { locale: 'de', slug: 'text-to-handwriting' },
  { locale: 'ru', slug: 'hex-editor' },
  { locale: 'ko', slug: 'html-preview' },
  { locale: 'en', slug: 'hex-editor' },
  { locale: 'ko', slug: 'unicode-converter' },
  { locale: 'ru', slug: 'html-preview' },
  { locale: 'fr', slug: 'file-size-calculator' },
  { locale: 'en', slug: 'ical-parser' },
  { locale: 'es', slug: 'html-preview' },
  { locale: 'en', slug: 'credit-card-validator' },
  { locale: 'ru', slug: 'credit-card-validator' },
  { locale: 'ar', slug: 'credit-card-validator' },
  { locale: 'es', slug: 'credit-card-validator' },
  { locale: 'zh', slug: 'credit-card-validator' },
  { locale: 'ja', slug: 'credit-card-validator' },
  { locale: 'de', slug: 'credit-card-validator' },
  { locale: 'fr', slug: 'credit-card-validator' },
  { locale: 'pt', slug: 'credit-card-validator' },
  { locale: 'ko', slug: 'credit-card-validator' },
  { locale: 'ru', slug: 'barcode-generator' },
  { locale: 'en', slug: 'morse-code-player' },
  { locale: 'en', slug: 'html-preview' },
  { locale: 'en', slug: 'image-splitter' },
  { locale: 'ru', slug: 'image-splitter' },
  { locale: 'ar', slug: 'image-splitter' },
  { locale: 'es', slug: 'image-splitter' },
  { locale: 'zh', slug: 'image-splitter' },
  { locale: 'ja', slug: 'image-splitter' },
  { locale: 'de', slug: 'image-splitter' },
  { locale: 'fr', slug: 'image-splitter' },
  { locale: 'pt', slug: 'image-splitter' },
  { locale: 'ko', slug: 'image-splitter' },
  { locale: 'en', slug: 'gantt-chart-generator' },
  { locale: 'en', slug: 'ascii-table' },
  { locale: 'en', slug: 'database-connection-tester' },
  { locale: 'fr', slug: 'image-resizer' },
  { locale: 'en', slug: 'merge-conflict-resolver' },
  { locale: 'en', slug: 'go-formatter' },
  { locale: 'es', slug: 'image-cropper' },
  { locale: 'es', slug: 'love-calculator' },
  { locale: 'es', slug: 'venn-diagram-generator' },
  { locale: 'es', slug: 'world-clock' },
  { locale: 'en', slug: 'iban-validator' },
  { locale: 'en', slug: 'sitemap-generator' },
  { locale: 'en', slug: 'compound-interest-calculator' },
  { locale: 'es', slug: 'word-counter' },
  { locale: 'fr', slug: 'venn-diagram-generator' },
  { locale: 'de', slug: 'hashtag-generator' },
  { locale: 'fr', slug: 'pdf-rotator' },
  { locale: 'en', slug: 'image-adjustment' },
  { locale: 'es', slug: 'sql-to-mongodb-converter' },
  { locale: 'ja', slug: 'curl-converter' },
  { locale: 'de', slug: 'gif-splitter' },
  { locale: 'es', slug: 'project-estimation-calculator' },
  { locale: 'en', slug: 'text-to-slug' },
  { locale: 'de', slug: 'world-cup-budget-calculator' },
] as const;

interface ToolMessages {
  name?: string;
  description?: string;
  detailed_description?: string;
  usage_examples?: string[];
  usage_steps?: string[];
  faqs?: Array<{ question?: string; answer?: string }>;
}

function readToolMessages(locale: string, slug: string): ToolMessages {
  const filePath = path.join(process.cwd(), 'src/messages', locale, 'tools', `${slug}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ToolMessages;
}

function supportSignalCount(messages: ToolMessages): number {
  const faqText = (messages.faqs ?? [])
    .flatMap((item) => [item.question, item.answer])
    .filter(Boolean)
    .join(' ');
  const text = [
    messages.description,
    messages.detailed_description,
    ...(messages.usage_steps ?? []),
    ...(messages.usage_examples ?? []),
    faqText,
  ]
    .filter(Boolean)
    .join(' ');

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const cjkSignal = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu)?.length ?? 0;
  return wordCount + Math.floor(cjkSignal / 2);
}

function supportText(messages: ToolMessages): string {
  return [
    messages.description,
    messages.detailed_description,
    ...(messages.usage_steps ?? []),
    ...(messages.usage_examples ?? []),
    ...(messages.faqs ?? []).flatMap((item) => [item.question, item.answer]),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

describe('GSC high-value recovery candidate content', () => {
  it.each(highValueCandidates)('$locale/$slug has enough truthful support content for index recovery', ({ locale, slug }) => {
    const messages = readToolMessages(locale, slug);
    const report = assessSupportContentTrust({
      slug,
      locale,
      name: messages.name ?? slug,
      description: messages.description,
      detailedDescription: messages.detailed_description,
      usageSteps: messages.usage_steps,
      usageExamples: messages.usage_examples,
      faqs: messages.faqs,
    });

    expect(report.blockSupportContent, report.issues.map((issue) => issue.code).join(', ')).toBe(false);
    expect(messages.detailed_description?.length ?? 0).toBeGreaterThanOrEqual(520);
    expect(messages.usage_steps?.length ?? 0).toBeGreaterThanOrEqual(5);
    expect(messages.usage_examples?.length ?? 0).toBeGreaterThanOrEqual(4);
    expect(messages.faqs?.length ?? 0).toBeGreaterThanOrEqual(5);
    expect(supportSignalCount(messages)).toBeGreaterThanOrEqual(170);
  });

  it.each([
    {
      locale: 'de',
      slug: 'text-to-handwriting',
      phrases: [
        'text in handschrift umwandeln online',
        'text in handschrift umwandeln',
        'text zu handschrift',
        'handschrift generator',
      ],
    },
    {
      locale: 'en',
      slug: 'hex-editor',
      phrases: ['online hex editor', 'text to hex', 'hex to text', 'utf-8 hex'],
    },
    {
      locale: 'ru',
      slug: 'hex-editor',
      phrases: ['hex-редактор онлайн', 'текст в hex', 'hex в текст', 'utf-8 hex'],
    },
    {
      locale: 'en',
      slug: 'ical-parser',
      phrases: ['ical viewer', 'view ical online', 'ics calendar viewer', 'view ics file online'],
    },
    {
      locale: 'ru',
      slug: 'barcode-generator',
      phrases: [
        'бесплатный генератор штрих-кодов',
        'генератор штрихкода',
        'штрих код онлайн',
        'баркод генератор',
        'баркод онлайн',
      ],
    },
    {
      locale: 'fr',
      slug: 'file-size-calculator',
      phrases: [
        'convertisseur de taille de fichier',
        'taille de fichier',
        'octets ko mo go',
        'convertir ko en mo',
        'convertir mo en go',
        'base 1000 ou 1024',
      ],
    },
    {
      locale: 'en',
      slug: 'morse-code-player',
      phrases: [
        'morse code player',
        'morse code player online',
        'morse code play',
        'morse player',
        'morse code live',
      ],
    },
    {
      locale: 'ko',
      slug: 'unicode-converter',
      phrases: [
        '유니코드 변환',
        '유니코드 변환기',
        '유니코드 변환기 온라인',
        '한글 유니코드 변환',
        '유니코드 이스케이프 변환',
        'html 엔터티 변환',
        'css 이스케이프 변환',
      ],
    },
    {
      locale: 'ru',
      slug: 'html-preview',
      phrases: [
        'просмотр html',
        'предпросмотр html',
        'html просмотр онлайн',
        'html и css',
        'статичный html',
        'sandboxed iframe',
      ],
    },
    {
      locale: 'es',
      slug: 'html-preview',
      phrases: [
        'visualizador html',
        'vista previa html',
        'ver html online',
        'html y css',
        'iframe sandboxed',
        'no habilita scripts',
      ],
    },
    {
      locale: 'en',
      slug: 'html-preview',
      phrases: [
        'html viewer online',
        'html online viewer',
        'html preview',
        'online html preview',
        'html previewer',
        'preview html online',
        'sandboxed iframe',
      ],
    },
    {
      locale: 'en',
      slug: 'gantt-chart-generator',
      phrases: [
        'gantt chart maker',
        'create gantt chart online',
        'create a gantt chart online',
        'create gantt chart online free',
        'easy gantt chart maker',
        'project timeline maker',
      ],
    },
    {
      locale: 'en',
      slug: 'iban-validator',
      phrases: [
        'iban checker',
        'iban checker online free',
        'iban validator online',
        'validate iban number',
        'validate iban online',
        'online iban validator',
        'online iban checker',
        'iban account checker',
      ],
    },
    {
      locale: 'en',
      slug: 'credit-card-validator',
      phrases: [
        'credit card checker',
        'credit card check',
        'check credit card',
        'luhn checksum',
        'test numbers only',
      ],
    },
    {
      locale: 'ru',
      slug: 'credit-card-validator',
      phrases: [
        'проверка кредитной карты онлайн',
        'валидатор кредитных карт',
        'алгоритму лухна',
        'тестовые номера',
      ],
    },
    {
      locale: 'ar',
      slug: 'credit-card-validator',
      phrases: [
        'مدقق بطاقات الائتمان',
        'فحص لوهن',
        'أرقام اختبار',
        'لا تتصل الأداة بأي بنك',
      ],
    },
    {
      locale: 'es',
      slug: 'credit-card-validator',
      phrases: [
        'validador de tarjetas de crédito',
        'validar tarjeta de crédito',
        'algoritmo de luhn',
        'números de prueba',
      ],
    },
    {
      locale: 'zh',
      slug: 'credit-card-validator',
      phrases: ['信用卡验证器', '信用卡校验', 'luhn 校验', '测试号码'],
    },
    {
      locale: 'ja',
      slug: 'credit-card-validator',
      phrases: ['クレジットカード番号チェッカー', 'luhn チェック', 'テスト番号'],
    },
    {
      locale: 'de',
      slug: 'credit-card-validator',
      phrases: ['kreditkartenprüfer', 'luhn-prüfung', 'testnummern'],
    },
    {
      locale: 'fr',
      slug: 'credit-card-validator',
      phrases: [
        'validateur de carte bancaire',
        'vérifier carte bancaire',
        'algorithme de luhn',
        'numéros de test',
      ],
    },
    {
      locale: 'pt',
      slug: 'credit-card-validator',
      phrases: [
        'validador de cartão de crédito',
        'verificar cartão de crédito',
        'algoritmo de luhn',
        'números de teste',
      ],
    },
    {
      locale: 'ko',
      slug: 'credit-card-validator',
      phrases: ['신용카드 번호 검증기', 'luhn 검사', '테스트 카드 번호'],
    },
    {
      locale: 'en',
      slug: 'image-splitter',
      phrases: ['image splitter online', 'rows and columns', 'png pieces', 'zip'],
    },
    {
      locale: 'ru',
      slug: 'image-splitter',
      phrases: ['разделить фото на части онлайн', 'строки и столбцы', 'png-фрагменты', 'zip'],
    },
    {
      locale: 'ar',
      slug: 'image-splitter',
      phrases: ['مقسم الصور أونلاين', 'صفوف وأعمدة', 'أجزاء png', 'zip'],
    },
    {
      locale: 'es',
      slug: 'image-splitter',
      phrases: ['dividir una imagen online', 'filas y columnas', 'piezas png', 'zip'],
    },
    {
      locale: 'zh',
      slug: 'image-splitter',
      phrases: ['图片分割器在线', '行列', 'png 分片', 'zip'],
    },
    {
      locale: 'ja',
      slug: 'image-splitter',
      phrases: ['画像分割ツールオンライン', '行と列', 'pngピース', 'zip'],
    },
    {
      locale: 'de',
      slug: 'image-splitter',
      phrases: ['bildteiler online', 'zeilen und spalten', 'png-teile', 'zip'],
    },
    {
      locale: 'fr',
      slug: 'image-splitter',
      phrases: ["diviseur d'images en ligne", 'lignes et colonnes', 'morceaux png', 'zip'],
    },
    {
      locale: 'pt',
      slug: 'image-splitter',
      phrases: ['image splitter online', 'linhas e colunas', 'partes png', 'zip'],
    },
    {
      locale: 'ko',
      slug: 'image-splitter',
      phrases: ['이미지 분할기 온라인', '행과 열', 'png 조각', 'zip'],
    },
  ])('$locale/$slug covers old GSC query intent without overclaiming', ({ locale, slug, phrases }) => {
    const messages = readToolMessages(locale, slug);
    const text = supportText(messages);

    for (const phrase of phrases) {
      expect(text).toContain(phrase);
    }
  });
});
