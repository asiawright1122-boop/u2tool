import { type Locale } from './i18n';
import {
  buildClusterCollectionData as factoryBuildCollectionData,
  buildClusterGroupForTool as factoryBuildGroupForTool,
  buildClusterGroups as factoryBuildGroups,
  buildClusterItemList as factoryBuildItemList,
  buildClusterItems as factoryBuildItems,
  createClusterSlugSet,
  getClusterGroupIdForSlug as factoryGetGroupIdForSlug,
  resolveClusterCopy,
} from './tool-cluster-factory';
import type {
  ToolClusterCopy,
  ToolClusterGroup,
  ToolClusterItem,
} from './tool-cluster-types';

export const textWritingToolClusterPath = '/tools/text-writing-editing-tools';

export const textWritingToolClusterSlugs = [
  'word-counter',
  'document-word-counter',
  'text-statistics',
  'line-counter',
  'byte-counter',
  'reading-time-calculator',
  'keyword-density-checker',
  'readability-checker',
  'char-frequency',
  'text-case-counter',
  'case-converter',
  'title-capitalization-tool',
  'text-cleaner',
  'text-sorter',
  'text-deduplicator',
  'text-wrapper',
  'text-reverser',
  'text-to-slug',
  'text-repeater',
  'grammar-checker',
  'text-summarizer',
  'paraphrase-tool',
  'ai-text-humanizer',
  'text-spinner',
  'ai-prompt-generator',
  'text-template',
  'markdown-preview',
  'markdown-editor',
  'diff-checker',
  'text-compare',
  'text-diff-patch',
  'html-to-text',
  'chinese-converter',
  'pinyin-converter',
  'text-to-speech',
  'emoji-picker',
] as const;

export type TextWritingToolClusterItem = ToolClusterItem;

export type TextWritingToolClusterGroup = ToolClusterGroup<
  'count-analysis' | 'clean-format' | 'writing-ai' | 'markdown-compare-language'
>;

export type TextWritingToolClusterCopy = ToolClusterCopy;

const groupSlugs: Array<{
  id: TextWritingToolClusterGroup['id'];
  slugs: string[];
}> = [
  {
    id: 'count-analysis',
    slugs: [
      'word-counter',
      'document-word-counter',
      'text-statistics',
      'line-counter',
      'byte-counter',
      'reading-time-calculator',
      'keyword-density-checker',
      'readability-checker',
      'char-frequency',
      'text-case-counter',
    ],
  },
  {
    id: 'clean-format',
    slugs: [
      'case-converter',
      'title-capitalization-tool',
      'text-cleaner',
      'text-sorter',
      'text-deduplicator',
      'text-wrapper',
      'text-reverser',
      'text-to-slug',
      'text-repeater',
    ],
  },
  {
    id: 'writing-ai',
    slugs: [
      'grammar-checker',
      'text-summarizer',
      'paraphrase-tool',
      'ai-text-humanizer',
      'text-spinner',
      'ai-prompt-generator',
      'text-template',
    ],
  },
  {
    id: 'markdown-compare-language',
    slugs: [
      'markdown-preview',
      'markdown-editor',
      'diff-checker',
      'text-compare',
      'text-diff-patch',
      'html-to-text',
      'chinese-converter',
      'pinyin-converter',
      'text-to-speech',
      'emoji-picker',
    ],
  },
];

const textWritingToolClusterSlugSet = createClusterSlugSet(textWritingToolClusterSlugs);

export function isTextWritingToolClusterSlug(slug: string): boolean {
  return textWritingToolClusterSlugSet.has(slug);
}

export function getTextWritingToolClusterGroupIdForSlug(slug: string): TextWritingToolClusterGroup['id'] | null {
  return factoryGetGroupIdForSlug(groupSlugs, slug);
}

const groupCopy: Partial<Record<Locale, Record<TextWritingToolClusterGroup['id'], { title: string; description: string }>>> = {
  en: {
    'count-analysis': { title: 'Count, Readability & Analysis', description: 'Measure words, lines, bytes, reading time, keyword density, readability, and character frequency.' },
    'clean-format': { title: 'Clean, Sort & Format Text', description: 'Convert case, title-case headings, clean pasted text, sort lines, deduplicate lists, and create slugs.' },
    'writing-ai': { title: 'Writing, Grammar & AI Drafting', description: 'Check grammar, summarize text, paraphrase drafts, humanize AI text, and create reusable prompts.' },
    'markdown-compare-language': { title: 'Markdown, Compare & Language', description: 'Preview Markdown, compare text, inspect diffs, extract HTML text, convert Chinese, pinyin, speech, and emoji.' },
  },
  zh: {
    'count-analysis': { title: '计数、可读性与分析', description: '统计词数、行数、字节、阅读时间、关键词密度、可读性和字符频率。' },
    'clean-format': { title: '清理、排序与格式化文本', description: '转换大小写、标题格式、清理粘贴文本、排序行、去重列表并生成 slug。' },
    'writing-ai': { title: '写作、语法与 AI 草稿', description: '检查语法、总结文本、改写草稿、优化 AI 文本，并生成可复用提示词。' },
    'markdown-compare-language': { title: 'Markdown、对比与语言', description: '预览 Markdown、比较文本、查看差异、提取 HTML 文本，并处理中文、拼音、语音和 emoji。' },
  },
};

const copyByLocale: Partial<Record<Locale, TextWritingToolClusterCopy>> = {
  en: {
    eyebrow: 'Text workflow hub',
    h1: 'Text, Writing & Editing Tools',
    title: 'Text, Writing & Editing Tools',
    description: 'A focused hub for word counters, text cleaners, case converters, diff checkers, Markdown tools, grammar checks, summarizers, paraphrasing, and AI writing utilities.',
    seoTitle: 'Text, Writing & Editing Tools',
    seoDescription: 'Free online text and writing tools for word count, character analysis, reading time, keyword density, case conversion, text cleaner, diff checker, Markdown preview, grammar checker, summarizer, paraphrase tool, AI text humanizer, and text to speech.',
    intro: 'Start from the text task: count and analyze content, clean copied text, prepare Markdown, compare edits, or improve a draft before publishing.',
    summary: 'The cluster organizes text utilities by workflow so writers, students, developers, editors, and SEO teams can move from rough copy to cleaner output faster.',
    ctaLabel: 'Open text hub',
    relatedLinksTitle: 'Related text routes',
    toolCountLabel: 'tools',
    workflow: workflowFallback(),
  },
  zh: {
    eyebrow: '文本工作流中心',
    h1: '文本、写作与编辑工具',
    title: '文本、写作与编辑工具',
    description: '覆盖词数统计、文本清理、大小写转换、差异对比、Markdown、语法检查、总结、改写和 AI 写作的工具中心。',
    seoTitle: '文本、写作与编辑工具',
    seoDescription: '免费的在线文本和写作工具，覆盖词数统计、字符分析、阅读时间、关键词密度、大小写转换、文本清理、差异对比、Markdown 预览、语法检查、文本总结、改写、AI 文本优化和文本转语音。',
    intro: '从文本任务开始：统计和分析内容、清理复制文本、准备 Markdown、比较修改，或在发布前改进草稿。',
    summary: '这个专题按文本工作流组织工具，让写作者、学生、开发者、编辑和 SEO 团队更快从粗稿走到干净输出。',
    ctaLabel: '打开文本专题',
    relatedLinksTitle: '相关文本入口',
    toolCountLabel: '个工具',
    workflow: {
      title: '文本工作流',
      items: [
        { label: '分析', text: '统计词数、字符、行数、阅读时间、关键词密度和可读性。', slugs: ['word-counter', 'text-statistics', 'reading-time-calculator', 'keyword-density-checker'] },
        { label: '清理', text: '清理粘贴文本、转换大小写、排序行、去重列表并生成 slug。', slugs: ['text-cleaner', 'case-converter', 'text-sorter', 'text-deduplicator'] },
        { label: '改写', text: '检查语法、总结、改写、优化 AI 文本并生成提示词。', slugs: ['grammar-checker', 'text-summarizer', 'paraphrase-tool', 'ai-text-humanizer'] },
        { label: '发布', text: '预览 Markdown、比较差异、提取 HTML 文本，并处理多语言文本。', slugs: ['markdown-preview', 'diff-checker', 'html-to-text', 'chinese-converter'] },
      ],
    },
  },
  ja: {
    eyebrow: 'テキストワークフロー hub',
    h1: 'テキスト、ライティング、編集ツール',
    title: 'テキスト、ライティング、編集ツール',
    description: 'Word count、text cleaner、case converter、diff、Markdown、grammar、summary、paraphrase、AI writing の hub です。',
    seoTitle: 'テキスト、ライティング、編集ツール',
    seoDescription: 'Word count、character analysis、reading time、keyword density、case conversion、text cleaner、diff checker、Markdown preview、grammar checker、summarizer、paraphrase、AI text humanizer、text to speech の無料ツール。',
    intro: '文章の分析、整形、Markdown、差分確認、公開前の改善をブラウザで進めます。',
    summary: '文章作業をワークフロー別に整理し、下書きから整った出力まで早く進めます。',
    ctaLabel: 'テキスト hub を開く',
    relatedLinksTitle: '関連テキストルート',
    toolCountLabel: 'ツール',
    workflow: workflowFallback(),
  },
  ko: {
    eyebrow: '텍스트 워크플로 허브',
    h1: '텍스트, 글쓰기 및 편집 도구',
    title: '텍스트, 글쓰기 및 편집 도구',
    description: '단어 수, 텍스트 정리, 대소문자 변환, diff, Markdown, grammar, summary, paraphrase, AI writing 도구 허브입니다.',
    seoTitle: '텍스트, 글쓰기 및 편집 도구',
    seoDescription: 'word count, character analysis, reading time, keyword density, case conversion, text cleaner, diff checker, Markdown preview, grammar checker, summarizer, paraphrase, AI text humanizer, text to speech 무료 도구.',
    intro: '콘텐츠 분석, 텍스트 정리, Markdown 준비, 변경 비교, 게시 전 문장 개선을 브라우저에서 처리합니다.',
    summary: '텍스트 유틸리티를 워크플로별로 묶어 초안에서 깔끔한 결과까지 빠르게 이동합니다.',
    ctaLabel: '텍스트 허브 열기',
    relatedLinksTitle: '관련 텍스트 경로',
    toolCountLabel: '도구',
    workflow: workflowFallback(),
  },
  es: {
    eyebrow: 'Hub de texto',
    h1: 'Herramientas de Texto, Escritura y Edicion',
    title: 'Herramientas de Texto, Escritura y Edicion',
    description: 'Hub para word counter, text cleaner, case converter, diff checker, Markdown, grammar, summarizer, paraphrase y AI writing.',
    seoTitle: 'Herramientas de Texto, Escritura y Edicion',
    seoDescription: 'Herramientas gratis para word count, character analysis, reading time, keyword density, case conversion, text cleaner, diff checker, Markdown preview, grammar checker, summarizer, paraphrase, AI text humanizer y text to speech.',
    intro: 'Analiza contenido, limpia texto copiado, prepara Markdown, compara cambios o mejora un borrador antes de publicar.',
    summary: 'El cluster organiza utilidades de texto por flujo para pasar antes de borrador a salida limpia.',
    ctaLabel: 'Abrir hub de texto',
    relatedLinksTitle: 'Rutas de texto relacionadas',
    toolCountLabel: 'herramientas',
    workflow: workflowFallback(),
  },
  pt: {
    eyebrow: 'Hub de texto',
    h1: 'Ferramentas de Texto, Escrita e Edicao',
    title: 'Ferramentas de Texto, Escrita e Edicao',
    description: 'Hub para word counter, text cleaner, case converter, diff checker, Markdown, grammar, summarizer, paraphrase e AI writing.',
    seoTitle: 'Ferramentas de Texto, Escrita e Edicao',
    seoDescription: 'Ferramentas gratis para word count, character analysis, reading time, keyword density, case conversion, text cleaner, diff checker, Markdown preview, grammar checker, summarizer, paraphrase, AI text humanizer e text to speech.',
    intro: 'Analise conteudo, limpe texto copiado, prepare Markdown, compare mudancas ou melhore um rascunho antes de publicar.',
    summary: 'O cluster organiza utilitarios de texto por fluxo para sair do rascunho para um resultado limpo mais rapido.',
    ctaLabel: 'Abrir hub de texto',
    relatedLinksTitle: 'Rotas de texto relacionadas',
    toolCountLabel: 'ferramentas',
    workflow: workflowFallback(),
  },
  fr: {
    eyebrow: 'Hub texte',
    h1: 'Outils Texte, Redaction et Edition',
    title: 'Outils Texte, Redaction et Edition',
    description: 'Hub pour word counter, text cleaner, case converter, diff checker, Markdown, grammar, summarizer, paraphrase et AI writing.',
    seoTitle: 'Outils Texte, Redaction et Edition',
    seoDescription: 'Outils gratuits word count, character analysis, reading time, keyword density, case conversion, text cleaner, diff checker, Markdown preview, grammar checker, summarizer, paraphrase, AI text humanizer et text to speech.',
    intro: 'Analysez, nettoyez, preparez Markdown, comparez des edits ou ameliorez un brouillon avant publication.',
    summary: 'Le cluster organise les utilitaires texte par workflow pour produire plus vite une copie propre.',
    ctaLabel: 'Ouvrir le hub texte',
    relatedLinksTitle: 'Parcours texte associes',
    toolCountLabel: 'outils',
    workflow: workflowFallback(),
  },
  de: {
    eyebrow: 'Text-Workflow-Hub',
    h1: 'Text, Schreiben und Editing Tools',
    title: 'Text, Schreiben und Editing Tools',
    description: 'Hub fur Word Counter, Text Cleaner, Case Converter, Diff Checker, Markdown, Grammar, Summarizer, Paraphrase und AI Writing.',
    seoTitle: 'Text, Schreiben und Editing Tools',
    seoDescription: 'Kostenlose Tools fur word count, character analysis, reading time, keyword density, case conversion, text cleaner, diff checker, Markdown preview, grammar checker, summarizer, paraphrase, AI text humanizer und text to speech.',
    intro: 'Analysieren, bereinigen, Markdown vorbereiten, Anderungen vergleichen oder Entwurfe vor dem Publizieren verbessern.',
    summary: 'Der Cluster ordnet Text-Utilities nach Workflow, damit aus Rohtext schneller saubere Ausgabe wird.',
    ctaLabel: 'Text-Hub offnen',
    relatedLinksTitle: 'Verwandte Text-Routen',
    toolCountLabel: 'Tools',
    workflow: workflowFallback(),
  },
  ru: {
    eyebrow: 'Центр text workflow',
    h1: 'Инструменты текста, письма и редактирования',
    title: 'Инструменты текста, письма и редактирования',
    description: 'Хаб для word counter, text cleaner, case converter, diff checker, Markdown, grammar, summarizer, paraphrase и AI writing.',
    seoTitle: 'Инструменты текста, письма и редактирования',
    seoDescription: 'Бесплатные инструменты word count, character analysis, reading time, keyword density, case conversion, text cleaner, diff checker, Markdown preview, grammar checker, summarizer, paraphrase, AI text humanizer и text to speech.',
    intro: 'Анализируйте текст, чистите вставки, готовьте Markdown, сравнивайте правки и улучшайте черновики перед публикацией.',
    summary: 'Кластер группирует text utilities по workflow, чтобы быстрее перейти от черновика к чистому результату.',
    ctaLabel: 'Открыть text hub',
    relatedLinksTitle: 'Связанные text маршруты',
    toolCountLabel: 'инструментов',
    workflow: workflowFallback(),
  },
  ar: {
    eyebrow: 'مركز سير عمل النصوص',
    h1: 'أدوات النص والكتابة والتحرير',
    title: 'أدوات النص والكتابة والتحرير',
    description: 'مركز لعداد الكلمات وتنظيف النص وتغيير الحالة والمقارنة و Markdown والتدقيق والتلخيص وإعادة الصياغة وأدوات AI writing.',
    seoTitle: 'أدوات النص والكتابة والتحرير',
    seoDescription: 'أدوات مجانية تشمل word count و character analysis و reading time و keyword density و case conversion و text cleaner و diff checker و Markdown preview و grammar checker و summarizer و paraphrase و AI text humanizer و text to speech.',
    intro: 'حلل المحتوى ونظف النص وجهز Markdown وقارن التعديلات أو حسّن المسودة قبل النشر.',
    summary: 'ينظم هذا المركز أدوات النص حسب workflow للوصول بسرعة من المسودة إلى نص أنظف.',
    ctaLabel: 'افتح مركز النصوص',
    relatedLinksTitle: 'مسارات نصية مرتبطة',
    toolCountLabel: 'أداة',
    workflow: workflowFallback(),
  },
};

function workflowFallback(): TextWritingToolClusterCopy['workflow'] {
  return {
    title: 'Text workflow',
    items: [
      { label: 'Analyze', text: 'Count words, lines, bytes, reading time, keyword density, readability, and character patterns.', slugs: ['word-counter', 'text-statistics', 'reading-time-calculator', 'keyword-density-checker'] },
      { label: 'Clean', text: 'Clean pasted text, convert case, sort lines, deduplicate lists, wrap text, and create slugs.', slugs: ['text-cleaner', 'case-converter', 'text-sorter', 'text-deduplicator'] },
      { label: 'Rewrite', text: 'Check grammar, summarize, paraphrase, humanize AI text, and build reusable prompts.', slugs: ['grammar-checker', 'text-summarizer', 'paraphrase-tool', 'ai-text-humanizer'] },
      { label: 'Publish', text: 'Preview Markdown, compare edits, extract HTML text, and handle language or speech transformations.', slugs: ['markdown-preview', 'diff-checker', 'html-to-text', 'chinese-converter'] },
    ],
  };
}

export function getTextWritingToolClusterCopy(locale: Locale): TextWritingToolClusterCopy {
  return resolveClusterCopy(copyByLocale, locale);
}

export function buildTextWritingToolClusterItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[] = textWritingToolClusterSlugs
): TextWritingToolClusterItem[] {
  return factoryBuildItems(locale, categoryNames, toolNames, toolDescriptions, slugs);
}

export function buildTextWritingToolClusterGroups(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): TextWritingToolClusterGroup[] {
  return factoryBuildGroups(locale, categoryNames, toolNames, toolDescriptions, groupSlugs, groupCopy);
}

export function buildTextWritingToolClusterGroupForTool(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): TextWritingToolClusterGroup | null {
  return factoryBuildGroupForTool(locale, slug, categoryNames, toolNames, toolDescriptions, groupSlugs, groupCopy);
}

export function buildTextWritingToolClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: TextWritingToolClusterGroup[]
): Record<string, unknown> {
  return factoryBuildItemList(baseUrl, locale, groups, getTextWritingToolClusterCopy(locale).title);
}

export function buildTextWritingToolClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: TextWritingToolClusterGroup[]
): Record<string, unknown> {
  return factoryBuildCollectionData(baseUrl, locale, groups, textWritingToolClusterPath, getTextWritingToolClusterCopy(locale));
}
