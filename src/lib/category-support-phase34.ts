type PhaseThirtyFourLocale = 'en' | 'ru';
type PhaseThirtyFourCategory = 'encoding';

export const phaseThirtyFourPriorityClusters: Array<{
  locale: PhaseThirtyFourLocale;
  category: PhaseThirtyFourCategory;
}> = [
  { locale: 'en', category: 'encoding' },
  { locale: 'ru', category: 'encoding' },
];

export const phaseThirtyFourSupportContent = {
  en: {
    encoding: {
      eyebrow: 'For bytes, payloads, and encoded text',
      title: 'Encoding tools for JSON, Base64, UTF-8 hex, and escaped strings',
      intro:
        'The Encoding category is strongest when it helps developers move between readable text, byte-oriented formats, and safe transport strings without leaving the browser.',
      highlightsTitle: 'High-value encoding tasks',
      highlights: [
        'Convert text into UTF-8 hex bytes or decode pasted hex back into readable text.',
        'Format JSON and escape strings before copying payloads into docs, logs, or test fixtures.',
        'Move between Base64, Base32, Base58, Base85, HTML entities, and URL-safe representations.',
      ],
      workflowsTitle: 'Recommended encoding workflows',
      workflows: [
        {
          title: 'Inspect text as bytes',
          description:
            'Use these tools when a log, payload, or test fixture needs byte-level inspection without a full binary editor.',
          toolSlugs: ['hex-editor', 'text-to-hex', 'hex-base64-converter'],
        },
        {
          title: 'Prepare safe web strings',
          description:
            'Encode markup, entities, or escaped text before pasting values into HTML, JSON, or documentation.',
          toolSlugs: ['html-encoder', 'html-entity', 'string-escape'],
        },
        {
          title: 'Move between common encodings',
          description:
            'Convert short values across browser-local encodings used in tokens, URLs, and configuration examples.',
          toolSlugs: ['base64', 'base32', 'base58'],
        },
      ],
      noteTitle: 'Browser-local handling',
      note:
        'These tools are designed for quick encoding and inspection tasks. They do not replace forensic binary editors, but they keep everyday payload checks private and fast.',
    },
  },
  ru: {
    encoding: {
      eyebrow: 'Для байтов, payload и кодированных строк',
      title: 'Инструменты кодирования для JSON, Base64, UTF-8 hex и экранированного текста',
      intro:
        'Категория кодирования полезна, когда нужно быстро перейти от читаемого текста к байтовому представлению, безопасной строке для передачи или формату для тестов прямо в браузере.',
      highlightsTitle: 'Частые задачи кодирования',
      highlights: [
        'Преобразовать текст в UTF-8 hex-байты или декодировать вставленную hex-последовательность обратно в текст.',
        'Форматировать JSON и экранировать строки перед вставкой в документацию, логи или тестовые данные.',
        'Переключаться между Base64, Base32, Base58, Base85, HTML-сущностями и URL-безопасными строками.',
      ],
      workflowsTitle: 'Рекомендуемые сценарии',
      workflows: [
        {
          title: 'Проверить текст как байты',
          description:
            'Используйте этот маршрут, когда значение из лога, payload или тестового примера нужно быстро посмотреть в hex без полноценного бинарного редактора.',
          toolSlugs: ['hex-editor', 'text-to-hex', 'hex-base64-converter'],
        },
        {
          title: 'Подготовить безопасные web-строки',
          description:
            'Кодируйте HTML, сущности и экранированный текст перед вставкой в JSON, разметку или документацию.',
          toolSlugs: ['html-encoder', 'html-entity', 'string-escape'],
        },
        {
          title: 'Переключаться между популярными кодировками',
          description:
            'Конвертируйте короткие значения между браузерными форматами, которые часто встречаются в токенах, URL и конфигурациях.',
          toolSlugs: ['base64', 'base32', 'base58'],
        },
      ],
      noteTitle: 'Локальная обработка',
      note:
        'Эти инструменты предназначены для быстрых задач кодирования и проверки. Они не заменяют forensic binary editor, но помогают безопасно проверить payload и тестовые строки в браузере.',
    },
  },
};
