import { tools } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';
import { buildLocalizedPageUrl, getHreflang } from './seo';

export const pdfDocumentToolClusterPath = '/tools/pdf-document-converters';

export const pdfDocumentToolClusterSlugs = [
  'pdf-to-image',
  'image-to-pdf',
  'pdf-to-text',
  'text-to-pdf',
  'html-to-pdf',
  'markdown-to-pdf',
  'pdf-merger',
  'pdf-splitter',
  'pdf-compressor',
  'pdf-rotator',
  'excel-to-json',
  'json-to-excel',
  'excel-viewer',
  'excel-merger',
  'excel-to-csv',
  'csv-to-excel',
  'csv-viewer',
  'json-to-csv',
  'word-to-txt',
  'word-to-html',
  'document-formatter',
  'citation-formatter',
  'invoice-generator',
  'invoice-template-generator',
  'resume-builder',
  'cover-letter-generator',
  'signature-pad',
] as const;

export interface PdfDocumentToolClusterItem {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  name: string;
  slug: string;
}

export interface PdfDocumentToolClusterGroup {
  description: string;
  id: 'pdf-conversion' | 'pdf-editing' | 'spreadsheet-data' | 'office-documents';
  title: string;
  tools: PdfDocumentToolClusterItem[];
}

export interface PdfDocumentToolClusterCopy {
  ctaLabel: string;
  description: string;
  eyebrow: string;
  h1: string;
  intro: string;
  relatedLinksTitle: string;
  seoDescription: string;
  seoTitle: string;
  summary: string;
  title: string;
  toolCountLabel: string;
  workflow: {
    title: string;
    items: Array<{
      label: string;
      text: string;
      slugs: string[];
    }>;
  };
}

const groupSlugs: Array<{
  id: PdfDocumentToolClusterGroup['id'];
  slugs: string[];
}> = [
  {
    id: 'pdf-conversion',
    slugs: ['pdf-to-image', 'image-to-pdf', 'pdf-to-text', 'text-to-pdf', 'html-to-pdf', 'markdown-to-pdf'],
  },
  {
    id: 'pdf-editing',
    slugs: ['pdf-merger', 'pdf-splitter', 'pdf-compressor', 'pdf-rotator'],
  },
  {
    id: 'spreadsheet-data',
    slugs: ['excel-to-json', 'json-to-excel', 'excel-viewer', 'excel-merger', 'excel-to-csv', 'csv-to-excel', 'csv-viewer', 'json-to-csv'],
  },
  {
    id: 'office-documents',
    slugs: ['word-to-txt', 'word-to-html', 'document-formatter', 'citation-formatter', 'invoice-generator', 'invoice-template-generator', 'resume-builder', 'cover-letter-generator', 'signature-pad'],
  },
];

const pdfDocumentToolClusterSlugSet = new Set<string>(pdfDocumentToolClusterSlugs);

export function isPdfDocumentToolClusterSlug(slug: string): boolean {
  return pdfDocumentToolClusterSlugSet.has(slug);
}

export function getPdfDocumentToolClusterGroupIdForSlug(slug: string): PdfDocumentToolClusterGroup['id'] | null {
  return groupSlugs.find((group) => group.slugs.includes(slug))?.id ?? null;
}

const groupCopy: Partial<Record<Locale, Record<PdfDocumentToolClusterGroup['id'], { title: string; description: string }>>> = {
  en: {
    'pdf-conversion': { title: 'PDF Conversion', description: 'Convert PDF pages, images, text, HTML, and Markdown into the document format you need.' },
    'pdf-editing': { title: 'PDF Merge, Split & Compress', description: 'Combine, split, compress, rotate, and clean up PDF files before sharing or archiving.' },
    'spreadsheet-data': { title: 'Excel, CSV & JSON', description: 'Move spreadsheet data between Excel, CSV, JSON, and quick viewer workflows.' },
    'office-documents': { title: 'Office Documents & Templates', description: 'Format documents, prepare citations, create invoices, resumes, cover letters, and signatures.' },
  },
  zh: {
    'pdf-conversion': { title: 'PDF 转换', description: '在 PDF、图片、文本、HTML 和 Markdown 之间快速转换文档格式。' },
    'pdf-editing': { title: 'PDF 合并、拆分与压缩', description: '合并、拆分、压缩、旋转 PDF，便于发送、归档和交付。' },
    'spreadsheet-data': { title: 'Excel、CSV 与 JSON', description: '在 Excel、CSV、JSON 和快速预览之间整理表格数据。' },
    'office-documents': { title: '办公文档与模板', description: '格式化文档，准备引用、发票、简历、求职信和签名。' },
  },
  ja: {
    'pdf-conversion': { title: 'PDF 変換', description: 'PDF、画像、テキスト、HTML、Markdown を必要な文書形式へ変換します。' },
    'pdf-editing': { title: 'PDF 結合、分割、圧縮', description: '共有や保存前に PDF を結合、分割、圧縮、回転します。' },
    'spreadsheet-data': { title: 'Excel、CSV、JSON', description: 'Excel、CSV、JSON、ビューアの間で表データを扱います。' },
    'office-documents': { title: 'Office 文書とテンプレート', description: '文書整形、引用、請求書、履歴書、カバーレター、署名を準備します。' },
  },
  ko: {
    'pdf-conversion': { title: 'PDF 변환', description: 'PDF, 이미지, 텍스트, HTML, Markdown을 필요한 문서 형식으로 변환합니다.' },
    'pdf-editing': { title: 'PDF 병합, 분할 및 압축', description: '공유나 보관 전에 PDF를 병합, 분할, 압축, 회전합니다.' },
    'spreadsheet-data': { title: 'Excel, CSV 및 JSON', description: 'Excel, CSV, JSON과 빠른 뷰어 사이에서 표 데이터를 정리합니다.' },
    'office-documents': { title: '오피스 문서 및 템플릿', description: '문서 서식, 인용, 청구서, 이력서, 자기소개서, 서명을 준비합니다.' },
  },
  es: {
    'pdf-conversion': { title: 'Conversion PDF', description: 'Convierte PDF, imagenes, texto, HTML y Markdown al formato de documento correcto.' },
    'pdf-editing': { title: 'Unir, Dividir y Comprimir PDF', description: 'Une, divide, comprime, rota y prepara PDFs para enviar o archivar.' },
    'spreadsheet-data': { title: 'Excel, CSV y JSON', description: 'Mueve datos entre Excel, CSV, JSON y visores rapidos.' },
    'office-documents': { title: 'Documentos y Plantillas Office', description: 'Da formato a documentos, citas, facturas, CV, cartas y firmas.' },
  },
  pt: {
    'pdf-conversion': { title: 'Conversao PDF', description: 'Converta PDF, imagens, texto, HTML e Markdown para o formato certo.' },
    'pdf-editing': { title: 'Juntar, Dividir e Comprimir PDF', description: 'Junte, divida, comprima, gire e prepare PDFs para envio ou arquivo.' },
    'spreadsheet-data': { title: 'Excel, CSV e JSON', description: 'Mova dados entre Excel, CSV, JSON e visualizadores rapidos.' },
    'office-documents': { title: 'Documentos e Modelos Office', description: 'Formate documentos, citacoes, faturas, curriculos, cartas e assinaturas.' },
  },
  fr: {
    'pdf-conversion': { title: 'Conversion PDF', description: 'Convertissez PDF, images, texte, HTML et Markdown vers le bon format.' },
    'pdf-editing': { title: 'Fusionner, Diviser et Compresser PDF', description: 'Fusionnez, divisez, compressez, tournez et preparez des PDF.' },
    'spreadsheet-data': { title: 'Excel, CSV et JSON', description: 'Passez les donnees entre Excel, CSV, JSON et visionneuses rapides.' },
    'office-documents': { title: 'Documents et Modeles Office', description: 'Formatez documents, citations, factures, CV, lettres et signatures.' },
  },
  de: {
    'pdf-conversion': { title: 'PDF-Konvertierung', description: 'Konvertieren Sie PDF, Bilder, Text, HTML und Markdown in das passende Dokumentformat.' },
    'pdf-editing': { title: 'PDF Zusammenfuhren, Teilen und Komprimieren', description: 'PDFs zusammenführen, teilen, komprimieren, drehen und vorbereiten.' },
    'spreadsheet-data': { title: 'Excel, CSV und JSON', description: 'Tabellendaten zwischen Excel, CSV, JSON und schnellen Viewern bewegen.' },
    'office-documents': { title: 'Office-Dokumente und Vorlagen', description: 'Dokumente, Zitate, Rechnungen, Lebenslaufe, Anschreiben und Signaturen vorbereiten.' },
  },
  ru: {
    'pdf-conversion': { title: 'PDF конвертация', description: 'Конвертируйте PDF, изображения, текст, HTML и Markdown в нужный формат.' },
    'pdf-editing': { title: 'PDF merge, split и compress', description: 'Объединяйте, разделяйте, сжимайте и поворачивайте PDF перед отправкой.' },
    'spreadsheet-data': { title: 'Excel, CSV и JSON', description: 'Переносите табличные данные между Excel, CSV, JSON и быстрыми viewer-инструментами.' },
    'office-documents': { title: 'Office документы и шаблоны', description: 'Готовьте документы, цитаты, счета, резюме, cover letters и подписи.' },
  },
  ar: {
    'pdf-conversion': { title: 'تحويل PDF', description: 'حوّل PDF والصور والنصوص و HTML و Markdown إلى صيغة المستند المطلوبة.' },
    'pdf-editing': { title: 'دمج وتقسيم وضغط PDF', description: 'ادمج وقسم واضغط ودوّر ملفات PDF قبل المشاركة أو الأرشفة.' },
    'spreadsheet-data': { title: 'Excel و CSV و JSON', description: 'انقل بيانات الجداول بين Excel و CSV و JSON وأدوات العرض السريعة.' },
    'office-documents': { title: 'مستندات وقوالب مكتبية', description: 'نسق المستندات والاقتباسات والفواتير والسير الذاتية والخطابات والتواقيع.' },
  },
};

const copyByLocale: Record<Locale, PdfDocumentToolClusterCopy> = {
  en: {
    eyebrow: 'Document workflow hub',
    h1: 'PDF, Document & Spreadsheet Tools',
    title: 'PDF, Document & Spreadsheet Tools',
    description: 'A focused hub for PDF conversion, PDF editing, Word, Excel, CSV, invoices, resumes, and document formatting tools.',
    seoTitle: 'PDF, Document & Spreadsheet Tools',
    seoDescription: 'Free online PDF, document, and spreadsheet tools for merge PDF, split PDF, compress PDF, PDF to image, image to PDF, PDF to text, HTML to PDF, Excel to JSON, CSV to Excel, invoices, resumes, and document formatting.',
    intro: 'Start from the document task: convert a file, prepare a PDF, clean spreadsheet data, or create an office document without leaving the browser.',
    summary: 'The cluster groups document utilities by workflow so office, finance, student, and developer tasks can move from raw files to ready-to-share output faster.',
    ctaLabel: 'Open document hub',
    relatedLinksTitle: 'Related document routes',
    toolCountLabel: 'tools',
    workflow: workflowFallback(),
  },
  zh: {
    eyebrow: '文档工作流中心',
    h1: 'PDF、文档与表格工具',
    title: 'PDF、文档与表格工具',
    description: '覆盖 PDF 转换、PDF 编辑、Word、Excel、CSV、发票、简历和文档格式化的工具中心。',
    seoTitle: 'PDF、文档与表格工具',
    seoDescription: '免费的在线 PDF、文档和表格工具，覆盖 PDF 合并、PDF 拆分、PDF 压缩、PDF 转图片、图片转 PDF、PDF 转文本、HTML 转 PDF、Excel 转 JSON、CSV 转 Excel、发票、简历和文档格式化。',
    intro: '从文档任务开始：转换文件、整理 PDF、清理表格数据，或在浏览器内生成办公文档。',
    summary: '这个专题按文档工作流组织工具，让办公、财务、学生和开发者任务更快从原始文件走到可交付结果。',
    ctaLabel: '打开文档专题',
    relatedLinksTitle: '相关文档入口',
    toolCountLabel: '个工具',
    workflow: {
      title: '文档工作流',
      items: [
        { label: '转换', text: '在 PDF、图片、文本、HTML 和 Markdown 之间转换。', slugs: ['pdf-to-image', 'image-to-pdf', 'html-to-pdf', 'markdown-to-pdf'] },
        { label: '整理', text: '合并、拆分、压缩和旋转 PDF，方便交付或归档。', slugs: ['pdf-merger', 'pdf-splitter', 'pdf-compressor', 'pdf-rotator'] },
        { label: '表格', text: '在 Excel、CSV、JSON 和预览工具之间整理数据。', slugs: ['excel-to-json', 'json-to-excel', 'excel-to-csv', 'csv-to-excel'] },
        { label: '办公', text: '生成发票、简历、求职信、签名，并格式化文档。', slugs: ['invoice-generator', 'resume-builder', 'cover-letter-generator', 'signature-pad'] },
      ],
    },
  },
  ja: {
    eyebrow: '文書ワークフロー hub',
    h1: 'PDF、文書、スプレッドシートツール',
    title: 'PDF、文書、スプレッドシートツール',
    description: 'PDF 変換、編集、Word、Excel、CSV、請求書、履歴書、文書整形の hub です。',
    seoTitle: 'PDF、文書、スプレッドシートツール',
    seoDescription: '無料の PDF、文書、表計算ツール。merge PDF、split PDF、compress PDF、PDF to image、image to PDF、PDF to text、HTML to PDF、Excel to JSON、CSV to Excel、invoice、resume に対応。',
    intro: 'ファイル変換、PDF 整理、表データ整理、Office 文書作成をブラウザで始められます。',
    summary: '文書ユーティリティをワークフロー別に整理し、共有できる出力まで素早く進めます。',
    ctaLabel: '文書 hub を開く',
    relatedLinksTitle: '関連文書ルート',
    toolCountLabel: 'ツール',
    workflow: workflowFallback(),
  },
  ko: {
    eyebrow: '문서 워크플로 허브',
    h1: 'PDF, 문서 및 스프레드시트 도구',
    title: 'PDF, 문서 및 스프레드시트 도구',
    description: 'PDF 변환, PDF 편집, Word, Excel, CSV, 청구서, 이력서, 문서 서식 도구 허브입니다.',
    seoTitle: 'PDF, 문서 및 스프레드시트 도구',
    seoDescription: 'merge PDF, split PDF, compress PDF, PDF to image, image to PDF, PDF to text, HTML to PDF, Excel to JSON, CSV to Excel, invoice, resume 무료 도구.',
    intro: '파일 변환, PDF 정리, 표 데이터 정리, 오피스 문서 생성을 브라우저에서 시작합니다.',
    summary: '문서 유틸리티를 워크플로별로 묶어 공유 가능한 결과까지 빠르게 이동합니다.',
    ctaLabel: '문서 허브 열기',
    relatedLinksTitle: '관련 문서 경로',
    toolCountLabel: '도구',
    workflow: workflowFallback(),
  },
  es: {
    eyebrow: 'Hub de documentos',
    h1: 'Herramientas PDF, Documentos y Hojas de Calculo',
    title: 'Herramientas PDF, Documentos y Hojas de Calculo',
    description: 'Hub para conversion PDF, edicion PDF, Word, Excel, CSV, facturas, CV y formato de documentos.',
    seoTitle: 'Herramientas PDF, Documentos y Hojas de Calculo',
    seoDescription: 'Herramientas gratis para merge PDF, split PDF, compress PDF, PDF to image, image to PDF, PDF to text, HTML to PDF, Excel to JSON, CSV to Excel, invoices, resumes y document formatting.',
    intro: 'Convierte archivos, prepara PDFs, limpia datos de hojas de calculo o crea documentos desde el navegador.',
    summary: 'El cluster agrupa utilidades de documentos por flujo para llegar antes a un resultado listo para compartir.',
    ctaLabel: 'Abrir hub de documentos',
    relatedLinksTitle: 'Rutas de documentos relacionadas',
    toolCountLabel: 'herramientas',
    workflow: workflowFallback(),
  },
  pt: {
    eyebrow: 'Hub de documentos',
    h1: 'Ferramentas PDF, Documentos e Planilhas',
    title: 'Ferramentas PDF, Documentos e Planilhas',
    description: 'Hub para conversao PDF, edicao PDF, Word, Excel, CSV, faturas, curriculos e formatacao.',
    seoTitle: 'Ferramentas PDF, Documentos e Planilhas',
    seoDescription: 'Ferramentas gratis para merge PDF, split PDF, compress PDF, PDF to image, image to PDF, PDF to text, HTML to PDF, Excel to JSON, CSV to Excel, invoices, resumes e document formatting.',
    intro: 'Converta arquivos, prepare PDFs, limpe planilhas ou crie documentos no navegador.',
    summary: 'O cluster organiza utilitarios de documentos por fluxo para chegar mais rapido a um resultado compartilhavel.',
    ctaLabel: 'Abrir hub de documentos',
    relatedLinksTitle: 'Rotas de documentos relacionadas',
    toolCountLabel: 'ferramentas',
    workflow: workflowFallback(),
  },
  fr: {
    eyebrow: 'Hub documents',
    h1: 'Outils PDF, Documents et Tableurs',
    title: 'Outils PDF, Documents et Tableurs',
    description: 'Hub pour conversion PDF, edition PDF, Word, Excel, CSV, factures, CV et formatage de documents.',
    seoTitle: 'Outils PDF, Documents et Tableurs',
    seoDescription: 'Outils gratuits merge PDF, split PDF, compress PDF, PDF to image, image to PDF, PDF to text, HTML to PDF, Excel to JSON, CSV to Excel, invoices, resumes et document formatting.',
    intro: 'Convertissez des fichiers, preparez des PDF, nettoyez des donnees tableur ou creez des documents dans le navigateur.',
    summary: 'Le cluster organise les utilitaires documentaires par workflow pour produire plus vite un resultat partageable.',
    ctaLabel: 'Ouvrir le hub documents',
    relatedLinksTitle: 'Parcours documents associes',
    toolCountLabel: 'outils',
    workflow: workflowFallback(),
  },
  de: {
    eyebrow: 'Dokument-Workflow-Hub',
    h1: 'PDF, Dokument und Tabellen Tools',
    title: 'PDF, Dokument und Tabellen Tools',
    description: 'Hub fur PDF-Konvertierung, PDF-Bearbeitung, Word, Excel, CSV, Rechnungen, Lebenslauf und Dokumentformatierung.',
    seoTitle: 'PDF, Dokument und Tabellen Tools',
    seoDescription: 'Kostenlose Tools fur merge PDF, split PDF, compress PDF, PDF to image, image to PDF, PDF to text, HTML to PDF, Excel to JSON, CSV to Excel, invoices, resumes und document formatting.',
    intro: 'Konvertieren Sie Dateien, bereiten Sie PDFs vor, bereinigen Sie Tabellen oder erstellen Sie Office-Dokumente im Browser.',
    summary: 'Der Cluster ordnet Dokument-Utilities nach Workflow, damit teilbare Ergebnisse schneller entstehen.',
    ctaLabel: 'Dokument-Hub offnen',
    relatedLinksTitle: 'Verwandte Dokument-Routen',
    toolCountLabel: 'Tools',
    workflow: workflowFallback(),
  },
  ru: {
    eyebrow: 'Центр document workflow',
    h1: 'Инструменты PDF, документов и таблиц',
    title: 'Инструменты PDF, документов и таблиц',
    description: 'Хаб для PDF conversion, PDF editing, Word, Excel, CSV, счетов, резюме и formatting документов.',
    seoTitle: 'Инструменты PDF, документов и таблиц',
    seoDescription: 'Бесплатные инструменты merge PDF, split PDF, compress PDF, PDF to image, image to PDF, PDF to text, HTML to PDF, Excel to JSON, CSV to Excel, invoices, resumes и document formatting.',
    intro: 'Конвертируйте файлы, готовьте PDF, чистите таблицы или создавайте офисные документы в браузере.',
    summary: 'Кластер группирует document utilities по workflow, чтобы быстрее получить готовый к отправке результат.',
    ctaLabel: 'Открыть document hub',
    relatedLinksTitle: 'Связанные document маршруты',
    toolCountLabel: 'инструментов',
    workflow: workflowFallback(),
  },
  ar: {
    eyebrow: 'مركز سير عمل المستندات',
    h1: 'أدوات PDF والمستندات والجداول',
    title: 'أدوات PDF والمستندات والجداول',
    description: 'مركز لتحويل PDF وتحريره و Word و Excel و CSV والفواتير والسير الذاتية وتنسيق المستندات.',
    seoTitle: 'أدوات PDF والمستندات والجداول',
    seoDescription: 'أدوات مجانية تشمل merge PDF و split PDF و compress PDF و PDF to image و image to PDF و PDF to text و HTML to PDF و Excel to JSON و CSV to Excel و invoices و resumes.',
    intro: 'ابدأ بتحويل ملف أو تجهيز PDF أو تنظيف بيانات جدول أو إنشاء مستند مكتبي داخل المتصفح.',
    summary: 'ينظم هذا المركز أدوات المستندات حسب workflow للوصول بسرعة إلى نتيجة جاهزة للمشاركة.',
    ctaLabel: 'افتح مركز المستندات',
    relatedLinksTitle: 'مسارات مستندات مرتبطة',
    toolCountLabel: 'أداة',
    workflow: workflowFallback(),
  },
};

function workflowFallback(): PdfDocumentToolClusterCopy['workflow'] {
  return {
    title: 'Document workflow',
    items: [
      { label: 'Convert', text: 'Move between PDF, image, text, HTML, and Markdown formats for common handoffs.', slugs: ['pdf-to-image', 'image-to-pdf', 'html-to-pdf', 'markdown-to-pdf'] },
      { label: 'Prepare PDF', text: 'Merge, split, compress, and rotate PDFs before sending, printing, or archiving.', slugs: ['pdf-merger', 'pdf-splitter', 'pdf-compressor', 'pdf-rotator'] },
      { label: 'Clean tables', text: 'Convert Excel, CSV, and JSON data, then preview files before importing them elsewhere.', slugs: ['excel-to-json', 'json-to-excel', 'excel-to-csv', 'csv-to-excel'] },
      { label: 'Create docs', text: 'Generate invoices, resumes, cover letters, signatures, citations, and formatted documents.', slugs: ['invoice-generator', 'resume-builder', 'cover-letter-generator', 'signature-pad'] },
    ],
  };
}

export function getPdfDocumentToolClusterCopy(locale: Locale): PdfDocumentToolClusterCopy {
  return copyByLocale[locale] ?? copyByLocale.en;
}

export function buildPdfDocumentToolClusterItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[] = pdfDocumentToolClusterSlugs
): PdfDocumentToolClusterItem[] {
  const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

  return slugs
    .map((slug) => toolBySlug.get(slug))
    .filter((tool): tool is (typeof tools)[number] => Boolean(tool))
    .map((tool) => ({
      category: tool.category,
      categoryName: categoryNames[tool.category] || tool.category,
      description: toolDescriptions[tool.slug] || '',
      href: getLocalizedPath(locale, `/tools/${tool.slug}`),
      icon: tool.icon,
      name: toolNames[tool.slug] || tool.slug,
      slug: tool.slug,
    }));
}

export function buildPdfDocumentToolClusterGroups(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): PdfDocumentToolClusterGroup[] {
  const copy = groupCopy[locale] ?? groupCopy.en!;

  return groupSlugs.map((group) => ({
    id: group.id,
    title: copy[group.id].title,
    description: copy[group.id].description,
    tools: buildPdfDocumentToolClusterItems(locale, categoryNames, toolNames, toolDescriptions, group.slugs),
  }));
}

export function buildPdfDocumentToolClusterGroupForTool(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): PdfDocumentToolClusterGroup | null {
  const groupId = getPdfDocumentToolClusterGroupIdForSlug(slug);
  if (!groupId) {
    return null;
  }

  return buildPdfDocumentToolClusterGroups(locale, categoryNames, toolNames, toolDescriptions)
    .find((group) => group.id === groupId) ?? null;
}

export function buildPdfDocumentToolClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: PdfDocumentToolClusterGroup[]
): Record<string, unknown> {
  const toolsForList = groups.flatMap((group) => group.tools);

  return {
    name: getPdfDocumentToolClusterCopy(locale).title,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: toolsForList.length,
    itemListElement: toolsForList.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}${tool.href}`,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description || undefined,
        applicationCategory: tool.categoryName,
        url: `${baseUrl}${tool.href}`,
      },
    })),
  };
}

export function buildPdfDocumentToolClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: PdfDocumentToolClusterGroup[]
): Record<string, unknown> {
  const copy = getPdfDocumentToolClusterCopy(locale);

  return {
    name: copy.title,
    description: copy.seoDescription,
    url: buildLocalizedPageUrl(baseUrl, locale, pdfDocumentToolClusterPath),
    inLanguage: getHreflang(locale),
    numberOfItems: groups.reduce((count, group) => count + group.tools.length, 0),
    hasPart: groups.map((group) => ({
      '@type': 'CollectionPage',
      name: group.title,
      description: group.description,
      hasPart: group.tools.map((tool) => ({
        '@type': 'SoftwareApplication',
        name: tool.name,
        url: `${baseUrl}${tool.href}`,
      })),
    })),
  };
}
