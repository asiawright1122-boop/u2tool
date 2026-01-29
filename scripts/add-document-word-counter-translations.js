const fs = require('fs');
const path = require('path');

// document-word-counter UI translations
const translations = {
  en: {
    documentText: 'Document Text',
    words: 'Words',
    characters: 'Characters',
    sentences: 'Sentences',
    paragraphs: 'Paragraphs',
    detailedStatistics: 'Detailed Statistics',
    charactersNoSpaces: 'Characters (no spaces)',
    lines: 'Lines',
    pages: 'Pages (~250 words)',
    uniqueWords: 'Unique Words',
    avgWordLength: 'Avg Word Length',
    avgSentenceLength: 'Avg Sentence Length',
    longestWord: 'Longest Word',
    timeEstimates: 'Time Estimates',
    readingTime: 'Reading Time',
    speakingTime: 'Speaking Time',
    topWords: 'Top Words',
    chars: 'chars',
    min: 'min'
  },
  zh: {
    documentText: '文档文本',
    words: '单词',
    characters: '字符',
    sentences: '句子',
    paragraphs: '段落',
    detailedStatistics: '详细统计',
    charactersNoSpaces: '字符（不含空格）',
    lines: '行数',
    pages: '页数（约250词/页）',
    uniqueWords: '独特单词',
    avgWordLength: '平均词长',
    avgSentenceLength: '平均句长',
    longestWord: '最长单词',
    timeEstimates: '时间估算',
    readingTime: '阅读时间',
    speakingTime: '朗读时间',
    topWords: '高频词',
    chars: '字符',
    min: '分钟'
  },
  ja: {
    documentText: 'ドキュメントテキスト',
    words: '単語',
    characters: '文字',
    sentences: '文',
    paragraphs: '段落',
    detailedStatistics: '詳細統計',
    charactersNoSpaces: '文字（スペースなし）',
    lines: '行',
    pages: 'ページ（約250語）',
    uniqueWords: 'ユニーク単語',
    avgWordLength: '平均単語長',
    avgSentenceLength: '平均文長',
    longestWord: '最長単語',
    timeEstimates: '時間見積もり',
    readingTime: '読書時間',
    speakingTime: '話す時間',
    topWords: '頻出単語',
    chars: '文字',
    min: '分'
  },
  ko: {
    documentText: '문서 텍스트',
    words: '단어',
    characters: '문자',
    sentences: '문장',
    paragraphs: '단락',
    detailedStatistics: '상세 통계',
    charactersNoSpaces: '문자 (공백 제외)',
    lines: '줄',
    pages: '페이지 (~250단어)',
    uniqueWords: '고유 단어',
    avgWordLength: '평균 단어 길이',
    avgSentenceLength: '평균 문장 길이',
    longestWord: '가장 긴 단어',
    timeEstimates: '시간 추정',
    readingTime: '읽기 시간',
    speakingTime: '말하기 시간',
    topWords: '상위 단어',
    chars: '자',
    min: '분'
  },
  es: {
    documentText: 'Texto del Documento',
    words: 'Palabras',
    characters: 'Caracteres',
    sentences: 'Oraciones',
    paragraphs: 'Párrafos',
    detailedStatistics: 'Estadísticas Detalladas',
    charactersNoSpaces: 'Caracteres (sin espacios)',
    lines: 'Líneas',
    pages: 'Páginas (~250 palabras)',
    uniqueWords: 'Palabras Únicas',
    avgWordLength: 'Longitud Promedio de Palabra',
    avgSentenceLength: 'Longitud Promedio de Oración',
    longestWord: 'Palabra Más Larga',
    timeEstimates: 'Estimaciones de Tiempo',
    readingTime: 'Tiempo de Lectura',
    speakingTime: 'Tiempo de Habla',
    topWords: 'Palabras Principales',
    chars: 'caracteres',
    min: 'min'
  },
  pt: {
    documentText: 'Texto do Documento',
    words: 'Palavras',
    characters: 'Caracteres',
    sentences: 'Frases',
    paragraphs: 'Parágrafos',
    detailedStatistics: 'Estatísticas Detalhadas',
    charactersNoSpaces: 'Caracteres (sem espaços)',
    lines: 'Linhas',
    pages: 'Páginas (~250 palavras)',
    uniqueWords: 'Palavras Únicas',
    avgWordLength: 'Comprimento Médio da Palavra',
    avgSentenceLength: 'Comprimento Médio da Frase',
    longestWord: 'Palavra Mais Longa',
    timeEstimates: 'Estimativas de Tempo',
    readingTime: 'Tempo de Leitura',
    speakingTime: 'Tempo de Fala',
    topWords: 'Principais Palavras',
    chars: 'caracteres',
    min: 'min'
  },
  fr: {
    documentText: 'Texte du Document',
    words: 'Mots',
    characters: 'Caractères',
    sentences: 'Phrases',
    paragraphs: 'Paragraphes',
    detailedStatistics: 'Statistiques Détaillées',
    charactersNoSpaces: 'Caractères (sans espaces)',
    lines: 'Lignes',
    pages: 'Pages (~250 mots)',
    uniqueWords: 'Mots Uniques',
    avgWordLength: 'Longueur Moyenne des Mots',
    avgSentenceLength: 'Longueur Moyenne des Phrases',
    longestWord: 'Mot le Plus Long',
    timeEstimates: 'Estimations de Temps',
    readingTime: 'Temps de Lecture',
    speakingTime: 'Temps de Parole',
    topWords: 'Mots Principaux',
    chars: 'caractères',
    min: 'min'
  },
  de: {
    documentText: 'Dokumenttext',
    words: 'Wörter',
    characters: 'Zeichen',
    sentences: 'Sätze',
    paragraphs: 'Absätze',
    detailedStatistics: 'Detaillierte Statistiken',
    charactersNoSpaces: 'Zeichen (ohne Leerzeichen)',
    lines: 'Zeilen',
    pages: 'Seiten (~250 Wörter)',
    uniqueWords: 'Einzigartige Wörter',
    avgWordLength: 'Durchschnittliche Wortlänge',
    avgSentenceLength: 'Durchschnittliche Satzlänge',
    longestWord: 'Längstes Wort',
    timeEstimates: 'Zeitschätzungen',
    readingTime: 'Lesezeit',
    speakingTime: 'Sprechzeit',
    topWords: 'Top-Wörter',
    chars: 'Zeichen',
    min: 'Min'
  },
  ru: {
    documentText: 'Текст документа',
    words: 'Слова',
    characters: 'Символы',
    sentences: 'Предложения',
    paragraphs: 'Абзацы',
    detailedStatistics: 'Подробная статистика',
    charactersNoSpaces: 'Символы (без пробелов)',
    lines: 'Строки',
    pages: 'Страницы (~250 слов)',
    uniqueWords: 'Уникальные слова',
    avgWordLength: 'Средняя длина слова',
    avgSentenceLength: 'Средняя длина предложения',
    longestWord: 'Самое длинное слово',
    timeEstimates: 'Оценка времени',
    readingTime: 'Время чтения',
    speakingTime: 'Время речи',
    topWords: 'Топ слов',
    chars: 'символов',
    min: 'мин'
  },
  ar: {
    documentText: 'نص المستند',
    words: 'الكلمات',
    characters: 'الأحرف',
    sentences: 'الجمل',
    paragraphs: 'الفقرات',
    detailedStatistics: 'إحصائيات مفصلة',
    charactersNoSpaces: 'الأحرف (بدون مسافات)',
    lines: 'الأسطر',
    pages: 'الصفحات (~250 كلمة)',
    uniqueWords: 'الكلمات الفريدة',
    avgWordLength: 'متوسط طول الكلمة',
    avgSentenceLength: 'متوسط طول الجملة',
    longestWord: 'أطول كلمة',
    timeEstimates: 'تقديرات الوقت',
    readingTime: 'وقت القراءة',
    speakingTime: 'وقت التحدث',
    topWords: 'أهم الكلمات',
    chars: 'حرف',
    min: 'دقيقة'
  }
};

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

locales.forEach(locale => {
  const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add document-word-counter translations
  if (!data.tools['document-word-counter']) {
    data.tools['document-word-counter'] = {};
  }
  
  // Merge translations
  Object.assign(data.tools['document-word-counter'], translations[locale]);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Updated ${locale}.json with document-word-counter translations`);
});

console.log('\nDone! Run: npx tsx scripts/split-translations.ts');
