type PhaseTwentyLocale = 'de' | 'en' | 'es' | 'ja' | 'ko' | 'zh';
type PhaseTwentyCategory = 'text';

export const phaseTwentyPriorityClusters: Array<{ locale: PhaseTwentyLocale; category: PhaseTwentyCategory }> = [
  { locale: 'en', category: 'text' },
  { locale: 'zh', category: 'text' },
  { locale: 'de', category: 'text' },
  { locale: 'es', category: 'text' },
  { locale: 'ja', category: 'text' },
  { locale: 'ko', category: 'text' },
];

export const phaseTwentySupportContent = {
  de: {
    text: {
      eyebrow: 'Für Textarbeit mit klarer Absicht',
      title: 'Text-Tools für Wortzahlen, Bereinigung, Vergleiche und publikationsreife Inhalte',
      intro:
        'Die Text-Kategorie gewinnt Reichweite, wenn sie konkrete Schreib- und Bearbeitungsjobs bündelt: Wortzahl messen, Text bereinigen, Versionen vergleichen und Markdown oder Slugs für die Veröffentlichung vorbereiten.',
      highlightsTitle: 'Wofür diese Kategorie besonders geeignet ist',
      highlights: [
        'Wörter, Zeilen und Textstruktur prüfen, bevor Copy veröffentlicht, übergeben oder gekürzt wird.',
        'Groß- und Kleinschreibung, Duplikate und störende Zeichen bereinigen, damit Rohtext schneller weiterverarbeitet werden kann.',
        'Entwürfe, Markdown und URL-Slugs vergleichen oder vorbereiten, wenn Inhalte in CMS, Doku oder SEO-Workflows landen.',
      ],
      workflowsTitle: 'Empfohlene Text-Workflows',
      workflows: [
        {
          title: 'Wortzahl und Textmetriken',
          description: 'Nutze diese Route, wenn du Länge, Struktur und Lesbarkeit eines Textes schnell einordnen musst.',
          toolSlugs: ['word-counter', 'line-counter', 'text-statistics'],
        },
        {
          title: 'Bereinigen und vereinheitlichen',
          description: 'Öffne diese Tools, wenn Rohtext normalisiert, dedupliziert oder für den nächsten Schritt bereinigt werden soll.',
          toolSlugs: ['case-converter', 'text-cleaner', 'text-deduplicator'],
        },
        {
          title: 'Vergleichen und veröffentlichen',
          description: 'Diese Route passt für Textvergleiche, Markdown-Prüfung und sprechende Slugs vor dem Publizieren.',
          toolSlugs: ['diff-checker', 'markdown-preview', 'text-to-slug'],
        },
      ],
      noteTitle: 'Intent-Fokus',
      note:
        'Queries wie Wortzähler, Case Converter, Textvergleich, Markdown Preview und Slug Generator bleiben nur dann präzise, wenn die Kategorie nach echten Textjobs statt nach generischer Produktivität sortiert wird.',
    },
  },
  en: {
    text: {
      eyebrow: 'For text work with clear intent',
      title: 'Text tools for word counts, cleanup, comparisons, and publish-ready copy',
      intro:
        'The text category is strongest when it groups concrete writing and editing jobs: measure length, clean raw copy, compare revisions, and prepare markdown or slugs for publishing.',
      highlightsTitle: 'Best-fit text jobs in this category',
      highlights: [
        'Check word count, line count, and text structure before publishing, reviewing, or shortening content.',
        'Normalize casing, remove duplicates, and clean pasted text so drafts are easier to reuse.',
        'Compare revisions and prepare markdown or SEO-friendly slugs before content moves into docs or CMS workflows.',
      ],
      workflowsTitle: 'Recommended text workflows',
      workflows: [
        {
          title: 'Word count and text metrics',
          description: 'Use these tools when you need a quick read on length, structure, and overall text composition.',
          toolSlugs: ['word-counter', 'line-counter', 'text-statistics'],
        },
        {
          title: 'Cleanup and normalization',
          description: 'Open this route when pasted copy needs cleaner casing, deduplication, or general text cleanup.',
          toolSlugs: ['case-converter', 'text-cleaner', 'text-deduplicator'],
        },
        {
          title: 'Comparison and publishing prep',
          description: 'Choose this route for revision checks, markdown review, and slug prep before content goes live.',
          toolSlugs: ['diff-checker', 'markdown-preview', 'text-to-slug'],
        },
      ],
      noteTitle: 'Intent focus',
      note:
        'Queries like word counter, case converter, diff checker, markdown preview, and slug generator stay precise when the category is organized around real text workflows instead of generic productivity language.',
    },
  },
  es: {
    text: {
      eyebrow: 'Para trabajo textual con intencion clara',
      title: 'Herramientas de texto para contar palabras, limpiar contenido, comparar cambios y publicar mejor',
      intro:
        'La categoria de texto gana mas autoridad cuando organiza trabajos concretos: medir longitud, limpiar texto pegado, comparar versiones y preparar markdown o slugs antes de publicar.',
      highlightsTitle: 'Para que sirve mejor esta categoria',
      highlights: [
        'Revisar palabras, lineas y estructura de un texto antes de publicarlo, resumirlo o entregarlo.',
        'Normalizar mayusculas, quitar duplicados y limpiar contenido bruto para reutilizarlo mas rapido.',
        'Comparar revisiones y preparar markdown o slugs SEO antes de pasar el contenido a un CMS o documentacion.',
      ],
      workflowsTitle: 'Flujos de texto recomendados',
      workflows: [
        {
          title: 'Conteo y metricas de texto',
          description: 'Usa esta ruta cuando necesites medir longitud, estructura y composicion general del contenido.',
          toolSlugs: ['word-counter', 'line-counter', 'text-statistics'],
        },
        {
          title: 'Limpieza y normalizacion',
          description: 'Abre estas herramientas cuando un texto copiado necesita mejor formato, limpieza o deduplicacion.',
          toolSlugs: ['case-converter', 'text-cleaner', 'text-deduplicator'],
        },
        {
          title: 'Comparacion y preparacion para publicar',
          description: 'Esta ruta sirve para revisar cambios, previsualizar markdown y crear slugs antes de salir en vivo.',
          toolSlugs: ['diff-checker', 'markdown-preview', 'text-to-slug'],
        },
      ],
      noteTitle: 'Enfoque de intencion',
      note:
        'Busquedas como contador de palabras, conversor de mayusculas, diff checker, markdown preview y generador de slugs funcionan mejor cuando la categoria responde a trabajos de texto reales y no a una etiqueta generica.',
    },
  },
  ja: {
    text: {
      eyebrow: '意図を絞ったテキスト作業のために',
      title: '文字数確認、テキスト整理、差分比較、公開前チェックに向くテキストツール',
      intro:
        'テキストカテゴリは、文字数を測る、貼り付けた文章を整える、差分を比べる、Markdown やスラッグを公開前に確認するといった具体的な仕事で案内すると強くなります。',
      highlightsTitle: 'このカテゴリで解決しやすいこと',
      highlights: [
        '公開前やレビュー前に文字数、行数、文章の構成をすばやく確認する。',
        '大文字小文字、重複、不要な文字を整理して、下書きを再利用しやすくする。',
        '差分比較や Markdown の確認、SEO 向けスラッグ準備を同じ流れで進める。',
      ],
      workflowsTitle: 'おすすめのテキスト導線',
      workflows: [
        {
          title: '文字数とテキスト指標',
          description: '長さや構成をすぐ把握したいときは、このルートから確認します。',
          toolSlugs: ['word-counter', 'line-counter', 'text-statistics'],
        },
        {
          title: '整理と正規化',
          description: '貼り付けた文章の表記ゆれ、不要部分、重複を整えたいときに向いています。',
          toolSlugs: ['case-converter', 'text-cleaner', 'text-deduplicator'],
        },
        {
          title: '比較と公開準備',
          description: '差分確認、Markdown プレビュー、スラッグ作成を公開前にまとめて進められます。',
          toolSlugs: ['diff-checker', 'markdown-preview', 'text-to-slug'],
        },
      ],
      noteTitle: '意図を保つポイント',
      note:
        'word counter、case converter、diff checker、markdown preview、slug generator のような検索意図は、カテゴリが具体的なテキスト作業で整理されているときに最もぶれません。',
    },
  },
  ko: {
    text: {
      eyebrow: '의도가 분명한 텍스트 작업을 위해',
      title: '글자 수 확인, 텍스트 정리, 변경 비교, 발행 준비를 위한 텍스트 도구',
      intro:
        '텍스트 카테고리는 글자 수를 재고, 붙여 넣은 문장을 정리하고, 수정본을 비교하고, 마크다운이나 슬러그를 발행 전에 준비하는 실제 작업 흐름으로 묶을 때 더 강해집니다.',
      highlightsTitle: '이 카테고리에서 잘 해결되는 작업',
      highlights: [
        '게시 전이나 검토 전에 글자 수, 줄 수, 텍스트 구조를 빠르게 확인합니다.',
        '대소문자, 중복, 불필요한 문자를 정리해 초안을 더 쉽게 재사용합니다.',
        '변경 비교와 마크다운 확인, SEO용 슬러그 준비를 한 흐름으로 이어갑니다.',
      ],
      workflowsTitle: '추천 텍스트 워크플로',
      workflows: [
        {
          title: '글자 수와 텍스트 지표',
          description: '길이와 구조를 빠르게 파악해야 할 때 이 경로를 사용합니다.',
          toolSlugs: ['word-counter', 'line-counter', 'text-statistics'],
        },
        {
          title: '정리와 정규화',
          description: '붙여 넣은 텍스트의 형식, 중복, 불필요한 요소를 정리할 때 적합합니다.',
          toolSlugs: ['case-converter', 'text-cleaner', 'text-deduplicator'],
        },
        {
          title: '비교와 발행 준비',
          description: '수정본 비교, 마크다운 미리보기, 슬러그 준비를 게시 전에 함께 처리할 수 있습니다.',
          toolSlugs: ['diff-checker', 'markdown-preview', 'text-to-slug'],
        },
      ],
      noteTitle: '의도 초점',
      note:
        'word counter, case converter, diff checker, markdown preview, slug generator 같은 검색은 카테고리가 실제 텍스트 작업 기준으로 정리될 때 가장 정확하게 맞춰집니다.',
    },
  },
  zh: {
    text: {
      eyebrow: '面向意图明确的文本任务',
      title: '适合字数统计、文本清洗、版本对比和发布准备的文本工具',
      intro:
        '文本分类只有在围绕真实任务组织时才有更强的自然流量价值，例如统计字数、清洗粘贴文本、比较改动版本，以及在发布前处理 Markdown 或 URL slug。',
      highlightsTitle: '这一分类更适合解决的任务',
      highlights: [
        '在发布、交付或压缩内容之前，快速检查字数、行数和文本结构。',
        '统一大小写、去除重复和清洗杂质文本，让草稿更容易复用。',
        '在进入 CMS、文档或 SEO 流程之前，对比修订内容并准备 Markdown 与 slug。',
      ],
      workflowsTitle: '推荐的文本工作流',
      workflows: [
        {
          title: '字数统计与文本指标',
          description: '当你需要快速了解长度、结构和整体文本构成时，可以先走这一条路线。',
          toolSlugs: ['word-counter', 'line-counter', 'text-statistics'],
        },
        {
          title: '清洗与规范化',
          description: '适合处理复制文本中的大小写、重复内容和杂乱格式。',
          toolSlugs: ['case-converter', 'text-cleaner', 'text-deduplicator'],
        },
        {
          title: '对比与发布准备',
          description: '用于修订差异检查、Markdown 预览，以及上线前的 slug 准备。',
          toolSlugs: ['diff-checker', 'markdown-preview', 'text-to-slug'],
        },
      ],
      noteTitle: '意图聚焦',
      note:
        '像 word counter、case converter、diff checker、markdown preview、slug generator 这样的查询，只有在分类页按真实文本任务组织时，主题边界才足够清晰。',
    },
  },
};
