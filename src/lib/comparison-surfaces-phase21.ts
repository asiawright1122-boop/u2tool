export const phaseTwentyOneComparisonDefinitions = [
  {
    slug: 'choose-text-tool',
    primaryCategory: 'text',
    relatedCategories: ['text'],
    workflows: [
      {
        id: 'format-inspect',
        toolSlugs: ['word-counter', 'line-counter', 'text-statistics', 'document-word-counter'],
      },
      {
        id: 'optimize',
        toolSlugs: ['case-converter', 'text-cleaner', 'text-deduplicator', 'text-sorter'],
      },
      {
        id: 'compare-debug',
        toolSlugs: ['diff-checker', 'text-compare', 'text-diff-patch'],
      },
      {
        id: 'convert-export',
        toolSlugs: ['markdown-preview', 'text-to-slug', 'reading-time-calculator'],
      },
    ],
  },
] as const;

export const phaseTwentyOneComparisonCopy = {
  ar: {
    'choose-text-tool': {
      title: 'كيف تختار أداة النص المناسبة',
      description:
        'افصل بين عد الكلمات وتنظيف النص ومقارنة النسخ وتجهيز Markdown و slug حتى تصل إلى أداة النص المناسبة قبل فتح صفحة واحدة.',
      shortDescription: 'اختر بين قياس النص وتنظيفه ومقارنة التعديلات وتجهيز النشر.',
      aliases: ['اختيار أداة النص', 'word counter ام text cleaner'],
      workflows: {
        'compare-debug': 'مقارنة المراجعات وفروق النص',
        'convert-export': 'تجهيز Markdown و slug ومخرجات النشر',
        'crawl-discovery': 'ملفات الزحف والاكتشاف',
        'format-inspect': 'قياس عدد الكلمات والأسطر وبنية النص',
        optimize: 'تنظيف النص وتوحيده وإزالة التكرار',
        'preview-validate': 'معاينة والتحقق من الروابط',
        'resize-crop': 'تغيير الحجم والقص',
        'search-metadata': 'وسوم البحث',
        'social-cards': 'بطاقات المشاركة',
        'validate-query': 'تحقق واستعلام',
      },
    },
  },
  de: {
    'choose-text-tool': {
      title: 'Das richtige Text-Tool auswahlen',
      description:
        'Trenne Wortzahlung, Textbereinigung, Versionsvergleich sowie Markdown- und Slug-Vorbereitung, damit Nutzer schneller auf der richtigen Textseite landen.',
      shortDescription: 'Wahle zwischen Textmetriken, Bereinigung, Vergleich und Publishing-Vorbereitung.',
      aliases: ['Text Tool auswahlen', 'Wortzahler oder Text Cleaner'],
      workflows: {
        'compare-debug': 'Revisionen und Textunterschiede vergleichen',
        'convert-export': 'Markdown, Slugs und Publishing-Ausgabe vorbereiten',
        'crawl-discovery': 'Crawl- und Discovery-Dateien',
        'format-inspect': 'Wortzahl, Zeilen und Textstruktur messen',
        optimize: 'Text bereinigen, vereinheitlichen und deduplizieren',
        'preview-validate': 'Vorschau und Prufung',
        'resize-crop': 'Große andern und zuschneiden',
        'search-metadata': 'SEO-Metadaten',
        'social-cards': 'Social Cards',
        'validate-query': 'Validieren und abfragen',
      },
    },
  },
  en: {
    'choose-text-tool': {
      title: 'Choose the Right Text Tool',
      description:
        'Compare word counters, text cleaners, diff tools, markdown preview, and slug prep workflows so users can land on the right text route before opening a single tool.',
      shortDescription: 'Choose between text metrics, cleanup, comparison, and publishing-prep workflows.',
      aliases: ['choose text tool', 'word counter vs text cleaner', 'text tool comparison'],
      workflows: {
        'compare-debug': 'Compare revisions and text differences',
        'convert-export': 'Prepare markdown, slugs, and publishing output',
        'crawl-discovery': 'Crawl and discovery files',
        'format-inspect': 'Measure word count, line count, and text structure',
        optimize: 'Clean, normalize, and deduplicate text',
        'preview-validate': 'Preview and validate',
        'resize-crop': 'Resize and crop assets',
        'search-metadata': 'Core SEO metadata',
        'social-cards': 'Social cards',
        'validate-query': 'Validate and query',
      },
    },
  },
  es: {
    'choose-text-tool': {
      title: 'Como elegir la herramienta de texto correcta',
      description:
        'Separa conteo de palabras, limpieza de texto, comparacion de versiones y preparacion de markdown o slug para llegar antes a la herramienta textual adecuada.',
      shortDescription: 'Elige entre metricas de texto, limpieza, comparacion y preparacion para publicar.',
      aliases: ['elegir herramienta de texto', 'contador de palabras o text cleaner'],
      workflows: {
        'compare-debug': 'Comparar revisiones y diferencias de texto',
        'convert-export': 'Preparar markdown, slugs y salida de publicacion',
        'crawl-discovery': 'Archivos de rastreo y descubrimiento',
        'format-inspect': 'Medir palabras, lineas y estructura del texto',
        optimize: 'Limpiar, normalizar y quitar duplicados',
        'preview-validate': 'Vista previa y validacion',
        'resize-crop': 'Redimensionar y recortar',
        'search-metadata': 'Metadatos SEO',
        'social-cards': 'Tarjetas sociales',
        'validate-query': 'Validar y consultar',
      },
    },
  },
  fr: {
    'choose-text-tool': {
      title: 'Choisir le bon outil texte',
      description:
        'Separez comptage de mots, nettoyage de texte, comparaison de versions et preparation Markdown ou slug afin d atteindre plus vite le bon outil texte.',
      shortDescription: 'Choisissez entre metriques texte, nettoyage, comparaison et preparation a la publication.',
      aliases: ['choisir outil texte', 'compteur de mots ou text cleaner'],
      workflows: {
        'compare-debug': 'Comparer revisions et differences de texte',
        'convert-export': 'Preparer Markdown, slug et sortie de publication',
        'crawl-discovery': 'Fichiers de crawl et de decouverte',
        'format-inspect': 'Mesurer mots, lignes et structure du texte',
        optimize: 'Nettoyer, normaliser et dedoublonner le texte',
        'preview-validate': 'Apercu et validation',
        'resize-crop': 'Redimensionner et recadrer',
        'search-metadata': 'Metadonnees SEO',
        'social-cards': 'Cartes sociales',
        'validate-query': 'Valider et interroger',
      },
    },
  },
  ja: {
    'choose-text-tool': {
      title: 'テキストツールの選び方',
      description:
        '文字数確認、テキスト整理、差分比較、Markdown や slug の公開準備を切り分けて、適切なテキストツールへ素早く進めます。',
      shortDescription: '文字数指標、整理、比較、公開準備の違いを整理します。',
      aliases: ['テキストツールの選び方', 'word counter と text cleaner の違い'],
      workflows: {
        'compare-debug': '修正差分とテキストの違いを比べる',
        'convert-export': 'Markdown、slug、公開出力を準備する',
        'crawl-discovery': 'クロールと発見用ファイル',
        'format-inspect': '文字数、行数、テキスト構造を確認する',
        optimize: 'テキストを整理し、表記をそろえ、重複を除く',
        'preview-validate': 'プレビューと確認',
        'resize-crop': 'リサイズとトリミング',
        'search-metadata': '検索向けメタデータ',
        'social-cards': 'ソーシャルカード',
        'validate-query': '検証とクエリ',
      },
    },
  },
  ko: {
    'choose-text-tool': {
      title: '올바른 텍스트 도구 선택하기',
      description:
        '글자 수 확인, 텍스트 정리, 버전 비교, 마크다운과 슬러그 준비를 나눠서 적절한 텍스트 도구로 더 빨리 이동할 수 있게 합니다.',
      shortDescription: '텍스트 지표, 정리, 비교, 발행 준비 작업을 구분해 선택합니다.',
      aliases: ['텍스트 도구 선택', 'word counter vs text cleaner'],
      workflows: {
        'compare-debug': '수정본과 텍스트 차이 비교',
        'convert-export': '마크다운, 슬러그, 발행 출력 준비',
        'crawl-discovery': '크롤링 및 발견 파일',
        'format-inspect': '글자 수, 줄 수, 텍스트 구조 확인',
        optimize: '텍스트 정리, 정규화, 중복 제거',
        'preview-validate': '미리보기와 검증',
        'resize-crop': '크기 조정과 자르기',
        'search-metadata': '검색 메타데이터',
        'social-cards': '소셜 카드',
        'validate-query': '검증과 조회',
      },
    },
  },
  pt: {
    'choose-text-tool': {
      title: 'Como escolher a ferramenta de texto certa',
      description:
        'Separe contagem de palavras, limpeza de texto, comparacao de revisoes e preparo de markdown ou slug para chegar mais rapido a ferramenta textual correta.',
      shortDescription: 'Escolha entre metricas de texto, limpeza, comparacao e preparo para publicar.',
      aliases: ['escolher ferramenta de texto', 'contador de palavras ou text cleaner'],
      workflows: {
        'compare-debug': 'Comparar revisoes e diferencas de texto',
        'convert-export': 'Preparar markdown, slugs e saida de publicacao',
        'crawl-discovery': 'Arquivos de rastreamento e descoberta',
        'format-inspect': 'Medir palavras, linhas e estrutura do texto',
        optimize: 'Limpar, normalizar e remover duplicatas',
        'preview-validate': 'Previa e validacao',
        'resize-crop': 'Redimensionar e recortar',
        'search-metadata': 'Metadados SEO',
        'social-cards': 'Cartoes sociais',
        'validate-query': 'Validar e consultar',
      },
    },
  },
  ru: {
    'choose-text-tool': {
      title: 'Как выбрать нужный текстовый инструмент',
      description:
        'Разделите подсчет слов, очистку текста, сравнение версий и подготовку Markdown или slug, чтобы быстрее попасть на нужный текстовый инструмент.',
      shortDescription: 'Выберите между метриками текста, очисткой, сравнением и подготовкой к публикации.',
      aliases: ['выбрать текстовый инструмент', 'word counter vs text cleaner'],
      workflows: {
        'compare-debug': 'Сравнение ревизий и текстовых различий',
        'convert-export': 'Подготовка Markdown, slug и публикации',
        'crawl-discovery': 'Файлы для обхода и обнаружения',
        'format-inspect': 'Подсчет слов, строк и структуры текста',
        optimize: 'Очистка, нормализация и удаление дублей',
        'preview-validate': 'Предпросмотр и проверка',
        'resize-crop': 'Изменение размера и кадрирование',
        'search-metadata': 'SEO-метаданные',
        'social-cards': 'Социальные карточки',
        'validate-query': 'Валидация и запрос',
      },
    },
  },
  zh: {
    'choose-text-tool': {
      title: '如何选择合适的文本工具',
      description:
        '把字数统计、文本清洗、版本对比以及 Markdown 和 slug 发布准备拆开，帮助用户更快进入正确的文本工具页面。',
      shortDescription: '区分文本指标、清洗、对比和发布准备任务。',
      aliases: ['文本工具怎么选', 'word counter 还是 text cleaner'],
      workflows: {
        'compare-debug': '比较修订版本与文本差异',
        'convert-export': '准备 Markdown、slug 和发布输出',
        'crawl-discovery': '抓取与发现文件',
        'format-inspect': '统计字数、行数并查看文本结构',
        optimize: '清洗、规范化并去重文本',
        'preview-validate': '预览与校验',
        'resize-crop': '调整尺寸与裁剪',
        'search-metadata': '搜索元数据',
        'social-cards': '社交分享卡片',
        'validate-query': '校验与查询',
      },
    },
  },
} as const;
