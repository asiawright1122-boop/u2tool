import { tools } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';
import { buildLocalizedPageUrl, getHreflang } from './seo';

export const imageToolClusterPath = '/tools/image-editing-converters';

export const imageToolClusterSlugs = [
  'image-compressor',
  'image-converter',
  'image-resizer',
  'image-to-webp',
  'webp-to-png',
  'png-to-svg',
  'svg-to-png',
  'svg-to-image',
  'image-to-base64',
  'base64-image-converter',
  'image-to-ico',
  'favicon-generator',
  'image-cropper',
  'image-flip-rotate',
  'image-adjustment',
  'image-border',
  'image-rounder',
  'image-watermark',
  'image-frosted-glass',
  'image-collage',
  'image-splitter',
  'canvas-drawing',
  'svg-optimizer',
  'svg-editor',
  'gif-maker',
  'gif-splitter',
  'gif-compressor',
  'placeholder-image',
  'lorem-picsum',
  'text-to-image',
  'text-to-handwriting',
  'youtube-thumbnail-generator',
  'exif-viewer',
  'color-extractor',
  'dpi-calculator',
  'pixel-density-calculator',
  'aspect-ratio-resizer',
  'social-media-size-guide',
  'passport-photo-maker',
  'qr-generator',
  'barcode-generator',
] as const;

export interface ImageToolClusterItem {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  name: string;
  slug: string;
}

export interface ImageToolClusterGroup {
  description: string;
  id: 'optimize-convert' | 'edit-compose' | 'svg-gif-assets' | 'inspect-measure-print';
  title: string;
  tools: ImageToolClusterItem[];
}

export interface ImageToolClusterCopy {
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
  id: ImageToolClusterGroup['id'];
  slugs: string[];
}> = [
  {
    id: 'optimize-convert',
    slugs: [
      'image-compressor',
      'image-converter',
      'image-resizer',
      'image-to-webp',
      'webp-to-png',
      'png-to-svg',
      'svg-to-png',
      'svg-to-image',
      'image-to-base64',
      'base64-image-converter',
      'image-to-ico',
      'favicon-generator',
    ],
  },
  {
    id: 'edit-compose',
    slugs: [
      'image-cropper',
      'image-flip-rotate',
      'image-adjustment',
      'image-border',
      'image-rounder',
      'image-watermark',
      'image-frosted-glass',
      'image-collage',
      'image-splitter',
      'canvas-drawing',
    ],
  },
  {
    id: 'svg-gif-assets',
    slugs: [
      'svg-optimizer',
      'svg-editor',
      'gif-maker',
      'gif-splitter',
      'gif-compressor',
      'placeholder-image',
      'lorem-picsum',
      'text-to-image',
      'text-to-handwriting',
      'youtube-thumbnail-generator',
    ],
  },
  {
    id: 'inspect-measure-print',
    slugs: [
      'exif-viewer',
      'color-extractor',
      'dpi-calculator',
      'pixel-density-calculator',
      'aspect-ratio-resizer',
      'social-media-size-guide',
      'passport-photo-maker',
      'qr-generator',
      'barcode-generator',
    ],
  },
];

const imageToolClusterSlugSet = new Set<string>(imageToolClusterSlugs);

export function isImageToolClusterSlug(slug: string): boolean {
  return imageToolClusterSlugSet.has(slug);
}

export function getImageToolClusterGroupIdForSlug(slug: string): ImageToolClusterGroup['id'] | null {
  return groupSlugs.find((group) => group.slugs.includes(slug))?.id ?? null;
}

const groupCopy: Record<Locale, Record<ImageToolClusterGroup['id'], { title: string; description: string }>> = {
  en: {
    'optimize-convert': {
      title: 'Optimize & Convert',
      description: 'Compress, resize, convert, and package images for web pages, icons, and embeds.',
    },
    'edit-compose': {
      title: 'Edit & Compose',
      description: 'Crop, rotate, adjust, watermark, split, combine, and style images in the browser.',
    },
    'svg-gif-assets': {
      title: 'SVG, GIF & Creative Assets',
      description: 'Prepare vector assets, GIFs, placeholders, generated images, and thumbnails.',
    },
    'inspect-measure-print': {
      title: 'Inspect, Measure & Print',
      description: 'Read metadata, extract colors, calculate density, fit social sizes, and create scannable codes.',
    },
  },
  zh: {
    'optimize-convert': { title: '优化与转换', description: '压缩、调整尺寸、转换格式，并生成网页、图标和嵌入所需图片。' },
    'edit-compose': { title: '编辑与合成', description: '在浏览器中裁剪、旋转、调色、加水印、分割、拼图和美化图片。' },
    'svg-gif-assets': { title: 'SVG、GIF 与创意素材', description: '处理矢量素材、GIF、占位图、生成图和 YouTube 缩略图。' },
    'inspect-measure-print': { title: '检查、测量与打印', description: '查看元数据、提取颜色、计算像素密度、适配社媒尺寸并生成可扫码图片。' },
  },
  ja: {
    'optimize-convert': { title: '最適化と変換', description: '画像の圧縮、リサイズ、形式変換、アイコンや埋め込み用の準備を行います。' },
    'edit-compose': { title: '編集と合成', description: 'ブラウザで切り抜き、回転、調整、透かし、分割、コラージュ、装飾ができます。' },
    'svg-gif-assets': { title: 'SVG、GIF、クリエイティブ素材', description: 'ベクター、GIF、プレースホルダー、生成画像、サムネイルを整えます。' },
    'inspect-measure-print': { title: '検査、計測、印刷', description: 'メタデータ、色、DPI、画面密度、SNS サイズ、コード画像を確認できます。' },
  },
  ko: {
    'optimize-convert': { title: '최적화 및 변환', description: '이미지를 압축, 크기 조정, 형식 변환하고 웹, 아이콘, 임베드에 맞게 준비합니다.' },
    'edit-compose': { title: '편집 및 합성', description: '브라우저에서 자르기, 회전, 보정, 워터마크, 분할, 콜라주, 스타일링을 처리합니다.' },
    'svg-gif-assets': { title: 'SVG, GIF 및 크리에이티브 자산', description: '벡터, GIF, 플레이스홀더, 생성 이미지, 썸네일을 준비합니다.' },
    'inspect-measure-print': { title: '검사, 측정 및 출력', description: '메타데이터, 색상, DPI, 픽셀 밀도, 소셜 크기, 코드 이미지를 확인합니다.' },
  },
  es: {
    'optimize-convert': { title: 'Optimizar y Convertir', description: 'Comprime, redimensiona y convierte imagenes para web, iconos e inserciones.' },
    'edit-compose': { title: 'Editar y Componer', description: 'Recorta, gira, ajusta, marca, divide, combina y estiliza imagenes en el navegador.' },
    'svg-gif-assets': { title: 'SVG, GIF y Recursos Creativos', description: 'Prepara vectores, GIFs, placeholders, imagenes generadas y miniaturas.' },
    'inspect-measure-print': { title: 'Inspeccionar, Medir e Imprimir', description: 'Lee metadatos, extrae colores, calcula densidad, adapta tamaños sociales y crea codigos.' },
  },
  pt: {
    'optimize-convert': { title: 'Otimizar e Converter', description: 'Comprima, redimensione e converta imagens para web, icones e incorporacoes.' },
    'edit-compose': { title: 'Editar e Compor', description: 'Corte, gire, ajuste, marque, divida, combine e estilize imagens no navegador.' },
    'svg-gif-assets': { title: 'SVG, GIF e Ativos Criativos', description: 'Prepare vetores, GIFs, placeholders, imagens geradas e miniaturas.' },
    'inspect-measure-print': { title: 'Inspecionar, Medir e Imprimir', description: 'Leia metadados, extraia cores, calcule densidade, adapte tamanhos sociais e crie codigos.' },
  },
  fr: {
    'optimize-convert': { title: 'Optimiser et Convertir', description: 'Compressez, redimensionnez et convertissez les images pour le web, les icones et les embeds.' },
    'edit-compose': { title: 'Editer et Composer', description: 'Rognez, pivotez, ajustez, filigranez, decoupez, combinez et stylisez les images.' },
    'svg-gif-assets': { title: 'SVG, GIF et Assets Creatifs', description: 'Preparez vecteurs, GIF, placeholders, images generees et miniatures.' },
    'inspect-measure-print': { title: 'Inspecter, Mesurer et Imprimer', description: 'Lisez les metadonnees, extrayez les couleurs, calculez la densite et adaptez les tailles sociales.' },
  },
  de: {
    'optimize-convert': { title: 'Optimieren und Konvertieren', description: 'Komprimieren, skalieren und konvertieren Sie Bilder fur Web, Icons und Embeds.' },
    'edit-compose': { title: 'Bearbeiten und Kombinieren', description: 'Zuschneiden, drehen, anpassen, wasserzeichen, teilen, kombinieren und gestalten.' },
    'svg-gif-assets': { title: 'SVG, GIF und Kreativ-Assets', description: 'Bereiten Sie Vektoren, GIFs, Platzhalter, generierte Bilder und Thumbnails vor.' },
    'inspect-measure-print': { title: 'Prufen, Messen und Drucken', description: 'Metadaten lesen, Farben extrahieren, Dichte berechnen, Social Sizes anpassen und Codes erstellen.' },
  },
  ru: {
    'optimize-convert': { title: 'Оптимизация и Конвертация', description: 'Сжимайте, изменяйте размер и конвертируйте изображения для веба, иконок и вставок.' },
    'edit-compose': { title: 'Редактирование и Компоновка', description: 'Обрезайте, вращайте, настраивайте, добавляйте водяные знаки, делите и объединяйте изображения.' },
    'svg-gif-assets': { title: 'SVG, GIF и Креативные Ресурсы', description: 'Готовьте векторы, GIF, плейсхолдеры, сгенерированные изображения и миниатюры.' },
    'inspect-measure-print': { title: 'Проверка, Измерение и Печать', description: 'Читайте метаданные, извлекайте цвета, считайте плотность, подгоняйте размеры соцсетей и создавайте коды.' },
  },
  ar: {
    'optimize-convert': { title: 'التحسين والتحويل', description: 'اضغط الصور وغيّر حجمها وحوّل صيغها للويب والأيقونات والتضمين.' },
    'edit-compose': { title: 'التحرير والتركيب', description: 'اقتص، دوّر، عدّل، أضف علامة مائية، قسّم، ادمج ونسّق الصور داخل المتصفح.' },
    'svg-gif-assets': { title: 'SVG و GIF والأصول الإبداعية', description: 'جهّز الرسومات المتجهة و GIF والصور المؤقتة والمولدة والصور المصغرة.' },
    'inspect-measure-print': { title: 'الفحص والقياس والطباعة', description: 'اقرأ البيانات الوصفية واستخرج الألوان واحسب الكثافة وجهّز مقاسات الشبكات والرموز.' },
  },
};

const copyByLocale: Record<Locale, ImageToolClusterCopy> = {
  en: {
    eyebrow: 'Image workflow hub',
    h1: 'Image Editing & Conversion Tools',
    title: 'Image Editing & Conversion Tools',
    description: 'A focused hub for compressing, converting, resizing, editing, inspecting, and preparing browser-safe image assets.',
    seoTitle: 'Image Editing & Conversion Tools',
    seoDescription: 'Free image editing and conversion tools for compression, resizing, WebP/PNG/SVG conversion, cropping, EXIF viewing, QR codes, favicons, GIFs, and social thumbnails.',
    intro: 'Move from upload to publish without installing desktop software: optimize file size, convert formats, crop visuals, inspect metadata, generate thumbnails, and prepare social or print-ready image assets.',
    summary: 'The cluster groups image tools by the jobs users search for most: optimize, convert, edit, inspect, and publish assets.',
    ctaLabel: 'Open image hub',
    relatedLinksTitle: 'Related image routes',
    toolCountLabel: 'tools',
    workflow: {
      title: 'Image workflow',
      items: [
        { label: 'Inspect', text: 'Check dimensions, metadata, colors, density, and target platform requirements before editing.', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: 'Optimize', text: 'Reduce file size, resize images, convert formats, and prepare icons or embedded image strings.', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: 'Edit', text: 'Crop, rotate, adjust, watermark, split, combine, or add presentation-ready styling.', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: 'Publish', text: 'Export social thumbnails, GIFs, SVG assets, QR codes, barcodes, and favicons for final use.', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  zh: {
    eyebrow: '图片工作流中心',
    h1: '图片编辑与转换工具',
    title: '图片编辑与转换工具',
    description: '集中处理图片压缩、格式转换、尺寸调整、编辑、检查和网页素材准备。',
    seoTitle: '图片编辑与转换工具',
    seoDescription: '免费的图片编辑与转换工具集合，支持压缩、缩放、WebP/PNG/SVG 转换、裁剪、EXIF 查看、二维码、favicon、GIF 和社媒缩略图。',
    intro: '无需安装桌面软件，就能从上传走到发布：优化体积、转换格式、裁剪视觉、检查元数据、生成缩略图，并准备社媒或打印图片素材。',
    summary: '这个专题按用户最常搜索的图片任务组织：优化、转换、编辑、检查和发布素材。',
    ctaLabel: '打开图片专题',
    relatedLinksTitle: '相关图片入口',
    toolCountLabel: '个工具',
    workflow: {
      title: '图片工作流',
      items: [
        { label: '检查', text: '编辑前先确认尺寸、元数据、颜色、像素密度和平台要求。', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: '优化', text: '压缩体积、调整尺寸、转换格式，并生成图标或可嵌入图片字符串。', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: '编辑', text: '裁剪、旋转、调色、加水印、分割、拼图或添加展示效果。', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: '发布', text: '导出缩略图、GIF、SVG、二维码、条码和 favicon。', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  ja: {
    eyebrow: '画像ワークフロー hub',
    h1: '画像編集・変換ツール',
    title: '画像編集・変換ツール',
    description: '圧縮、変換、リサイズ、編集、検査、ブラウザ向け画像素材の準備をまとめたハブです。',
    seoTitle: '画像編集・変換ツール',
    seoDescription: '画像圧縮、リサイズ、WebP/PNG/SVG 変換、切り抜き、EXIF 表示、QR コード、favicon、GIF、SNS サムネイル向けの無料画像ツール。',
    intro: 'デスクトップアプリなしで、アップロードから公開まで進めます。サイズ最適化、形式変換、切り抜き、メタデータ確認、サムネイル生成、SNS や印刷向け素材準備を行えます。',
    summary: 'このクラスターは、検索されやすい画像タスクを最適化、変換、編集、検査、公開に分けます。',
    ctaLabel: '画像ハブを開く',
    relatedLinksTitle: '関連画像ルート',
    toolCountLabel: 'ツール',
    workflow: {
      title: '画像ワークフロー',
      items: [
        { label: '検査', text: '編集前に寸法、メタデータ、色、密度、配信先の要件を確認します。', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: '最適化', text: 'ファイルサイズを減らし、リサイズし、形式変換や埋め込み用文字列を準備します。', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: '編集', text: '切り抜き、回転、調整、透かし、分割、合成、装飾を行います。', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: '公開', text: 'サムネイル、GIF、SVG、QR、バーコード、favicon を書き出します。', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  ko: {
    eyebrow: '이미지 워크플로 허브',
    h1: '이미지 편집 및 변환 도구',
    title: '이미지 편집 및 변환 도구',
    description: '압축, 변환, 크기 조정, 편집, 검사, 브라우저용 이미지 자산 준비를 한곳에 모았습니다.',
    seoTitle: '이미지 편집 및 변환 도구',
    seoDescription: '이미지 압축, 리사이즈, WebP/PNG/SVG 변환, 자르기, EXIF 보기, QR 코드, favicon, GIF, 소셜 썸네일을 위한 무료 이미지 도구.',
    intro: '데스크톱 소프트웨어 없이 업로드부터 게시까지 처리합니다. 파일 크기 최적화, 형식 변환, 시각 편집, 메타데이터 확인, 썸네일 생성, 소셜 및 출력용 자산 준비가 가능합니다.',
    summary: '이 클러스터는 이미지 작업을 최적화, 변환, 편집, 검사, 게시 흐름으로 정리합니다.',
    ctaLabel: '이미지 허브 열기',
    relatedLinksTitle: '관련 이미지 경로',
    toolCountLabel: '도구',
    workflow: {
      title: '이미지 워크플로',
      items: [
        { label: '검사', text: '편집 전에 크기, 메타데이터, 색상, 밀도, 플랫폼 요구 사항을 확인합니다.', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: '최적화', text: '파일 크기를 줄이고, 크기를 바꾸고, 형식을 변환하고, 임베드 문자열을 준비합니다.', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: '편집', text: '자르기, 회전, 보정, 워터마크, 분할, 합성, 스타일링을 처리합니다.', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: '게시', text: '썸네일, GIF, SVG, QR 코드, 바코드, favicon을 내보냅니다.', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  es: {
    eyebrow: 'Hub de imagenes',
    h1: 'Herramientas de Edicion y Conversion de Imagenes',
    title: 'Herramientas de Edicion y Conversion de Imagenes',
    description: 'Un hub para comprimir, convertir, redimensionar, editar, inspeccionar y preparar recursos de imagen.',
    seoTitle: 'Herramientas de Edicion y Conversion de Imagenes',
    seoDescription: 'Herramientas gratis para comprimir imagenes, redimensionar, convertir WebP/PNG/SVG, recortar, ver EXIF, crear QR, favicons, GIFs y miniaturas sociales.',
    intro: 'Pasa de la subida a la publicacion sin software de escritorio: optimiza peso, convierte formatos, recorta visuales, revisa metadatos y prepara recursos para redes o impresion.',
    summary: 'El cluster organiza herramientas de imagen por tareas de busqueda: optimizar, convertir, editar, inspeccionar y publicar.',
    ctaLabel: 'Abrir hub de imagenes',
    relatedLinksTitle: 'Rutas de imagen relacionadas',
    toolCountLabel: 'herramientas',
    workflow: {
      title: 'Flujo de imagen',
      items: [
        { label: 'Inspeccionar', text: 'Revisa dimensiones, metadatos, colores, densidad y requisitos de plataforma antes de editar.', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: 'Optimizar', text: 'Reduce peso, cambia tamano, convierte formatos y prepara iconos o cadenas embebidas.', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: 'Editar', text: 'Recorta, gira, ajusta, marca, divide, combina o agrega estilo de presentacion.', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: 'Publicar', text: 'Exporta miniaturas, GIFs, SVG, QR, codigos de barras y favicons.', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  pt: {
    eyebrow: 'Hub de imagens',
    h1: 'Ferramentas de Edicao e Conversao de Imagens',
    title: 'Ferramentas de Edicao e Conversao de Imagens',
    description: 'Um hub para comprimir, converter, redimensionar, editar, inspecionar e preparar ativos de imagem.',
    seoTitle: 'Ferramentas de Edicao e Conversao de Imagens',
    seoDescription: 'Ferramentas gratis para comprimir imagens, redimensionar, converter WebP/PNG/SVG, cortar, ver EXIF, criar QR, favicons, GIFs e miniaturas sociais.',
    intro: 'Va do upload a publicacao sem software desktop: otimize tamanho, converta formatos, corte visuais, revise metadados e prepare ativos para redes ou impressao.',
    summary: 'O cluster organiza ferramentas de imagem por tarefas comuns: otimizar, converter, editar, inspecionar e publicar.',
    ctaLabel: 'Abrir hub de imagens',
    relatedLinksTitle: 'Rotas de imagem relacionadas',
    toolCountLabel: 'ferramentas',
    workflow: {
      title: 'Fluxo de imagem',
      items: [
        { label: 'Inspecionar', text: 'Confira dimensoes, metadados, cores, densidade e requisitos da plataforma antes de editar.', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: 'Otimizar', text: 'Reduza peso, altere tamanho, converta formatos e prepare icones ou strings incorporadas.', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: 'Editar', text: 'Corte, gire, ajuste, marque, divida, combine ou adicione estilo.', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: 'Publicar', text: 'Exporte miniaturas, GIFs, SVG, QR, codigos de barras e favicons.', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  fr: {
    eyebrow: 'Hub image',
    h1: 'Outils de Retouche et Conversion Image',
    title: 'Outils de Retouche et Conversion Image',
    description: 'Un hub pour compresser, convertir, redimensionner, retoucher, inspecter et preparer les assets image.',
    seoTitle: 'Outils de Retouche et Conversion Image',
    seoDescription: 'Outils gratuits pour compresser, redimensionner, convertir WebP/PNG/SVG, rogner, lire EXIF, creer QR, favicons, GIF et miniatures sociales.',
    intro: 'Passez de l upload a la publication sans logiciel de bureau : optimisez le poids, convertissez les formats, rognez, inspectez les metadonnees et preparez les assets sociaux ou print.',
    summary: 'Ce cluster classe les outils image par intention : optimiser, convertir, editer, inspecter et publier.',
    ctaLabel: 'Ouvrir le hub image',
    relatedLinksTitle: 'Parcours image associes',
    toolCountLabel: 'outils',
    workflow: {
      title: 'Workflow image',
      items: [
        { label: 'Inspecter', text: 'Verifiez dimensions, metadonnees, couleurs, densite et contraintes de plateforme avant edition.', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: 'Optimiser', text: 'Reduisez le poids, redimensionnez, convertissez et preparez icones ou chaines integrees.', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: 'Editer', text: 'Rognez, pivotez, ajustez, filigranez, decoupez, combinez ou stylisez.', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: 'Publier', text: 'Exportez miniatures, GIF, SVG, QR, codes-barres et favicons.', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  de: {
    eyebrow: 'Bild-Workflow-Hub',
    h1: 'Bildbearbeitung und Konvertierung Tools',
    title: 'Bildbearbeitung und Konvertierung Tools',
    description: 'Ein Hub zum Komprimieren, Konvertieren, Skalieren, Bearbeiten, Prufen und Vorbereiten von Bild-Assets.',
    seoTitle: 'Bildbearbeitung und Konvertierung Tools',
    seoDescription: 'Kostenlose Bildtools fur Komprimierung, Skalierung, WebP/PNG/SVG-Konvertierung, Zuschneiden, EXIF, QR, Favicons, GIFs und Social Thumbnails.',
    intro: 'Vom Upload bis zur Veroffentlichung ohne Desktop-Software: Dateigroße optimieren, Formate konvertieren, Bilder zuschneiden, Metadaten prufen und Assets fur Social oder Print vorbereiten.',
    summary: 'Der Cluster ordnet Bildtools nach Suchaufgaben: optimieren, konvertieren, bearbeiten, prufen und veroffentlichen.',
    ctaLabel: 'Bild-Hub offnen',
    relatedLinksTitle: 'Verwandte Bild-Routen',
    toolCountLabel: 'Tools',
    workflow: {
      title: 'Bild-Workflow',
      items: [
        { label: 'Prufen', text: 'Prufen Sie Maße, Metadaten, Farben, Dichte und Plattformanforderungen vor der Bearbeitung.', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: 'Optimieren', text: 'Reduzieren Sie Dateigroße, skalieren Sie Bilder, konvertieren Sie Formate und bereiten Sie Icons oder Embeds vor.', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: 'Bearbeiten', text: 'Zuschneiden, drehen, anpassen, wasserzeichen, teilen, kombinieren oder gestalten.', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: 'Veroffentlichen', text: 'Exportieren Sie Thumbnails, GIFs, SVGs, QR-Codes, Barcodes und Favicons.', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  ru: {
    eyebrow: 'Центр работы с изображениями',
    h1: 'Инструменты редактирования и конвертации изображений',
    title: 'Инструменты редактирования и конвертации изображений',
    description: 'Хаб для сжатия, конвертации, изменения размера, редактирования, проверки и подготовки изображений.',
    seoTitle: 'Инструменты редактирования и конвертации изображений',
    seoDescription: 'Бесплатные инструменты для сжатия, изменения размера, WebP/PNG/SVG конвертации, обрезки, EXIF, QR, favicon, GIF и миниатюр для соцсетей.',
    intro: 'Переходите от загрузки к публикации без настольных программ: оптимизируйте размер, меняйте формат, обрезайте, проверяйте метаданные и готовьте изображения для соцсетей или печати.',
    summary: 'Кластер группирует инструменты изображений по задачам: оптимизация, конвертация, редактирование, проверка и публикация.',
    ctaLabel: 'Открыть хаб изображений',
    relatedLinksTitle: 'Связанные маршруты изображений',
    toolCountLabel: 'инструментов',
    workflow: {
      title: 'Рабочий процесс изображения',
      items: [
        { label: 'Проверка', text: 'Проверьте размеры, метаданные, цвета, плотность и требования платформы до редактирования.', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: 'Оптимизация', text: 'Уменьшайте размер файла, меняйте габариты, конвертируйте форматы и готовьте иконки или строки для встраивания.', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: 'Редактирование', text: 'Обрезайте, вращайте, настраивайте, добавляйте водяные знаки, делите, объединяйте или оформляйте.', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: 'Публикация', text: 'Экспортируйте миниатюры, GIF, SVG, QR, штрихкоды и favicon.', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
  ar: {
    eyebrow: 'مركز سير عمل الصور',
    h1: 'أدوات تحرير وتحويل الصور',
    title: 'أدوات تحرير وتحويل الصور',
    description: 'مركز لضغط الصور وتحويلها وتغيير حجمها وتحريرها وفحصها وتجهيز أصول الصور.',
    seoTitle: 'أدوات تحرير وتحويل الصور',
    seoDescription: 'أدوات مجانية لضغط الصور وتغيير الحجم وتحويل WebP/PNG/SVG والقص وعرض EXIF وإنشاء QR و favicon و GIF والصور المصغرة.',
    intro: 'انتقل من الرفع إلى النشر دون برنامج سطح مكتب: حسّن الحجم، حوّل الصيغ، قص الصور، افحص البيانات الوصفية وجهّز أصول الشبكات أو الطباعة.',
    summary: 'ينظم هذا المركز أدوات الصور حسب النية: تحسين، تحويل، تحرير، فحص ونشر.',
    ctaLabel: 'افتح مركز الصور',
    relatedLinksTitle: 'مسارات صور مرتبطة',
    toolCountLabel: 'أداة',
    workflow: {
      title: 'سير عمل الصور',
      items: [
        { label: 'فحص', text: 'تحقق من الأبعاد والبيانات الوصفية والألوان والكثافة ومتطلبات المنصة قبل التحرير.', slugs: ['exif-viewer', 'color-extractor', 'dpi-calculator', 'social-media-size-guide'] },
        { label: 'تحسين', text: 'قلل حجم الملف وغيّر الأبعاد وحوّل الصيغ وجهّز الأيقونات أو النصوص المضمنة.', slugs: ['image-compressor', 'image-resizer', 'image-converter', 'image-to-base64'] },
        { label: 'تحرير', text: 'قص، دوّر، عدّل، أضف علامة مائية، قسّم، ادمج أو أضف نمطا بصريا.', slugs: ['image-cropper', 'image-flip-rotate', 'image-adjustment', 'image-watermark'] },
        { label: 'نشر', text: 'صدّر الصور المصغرة و GIF و SVG و QR والباركود و favicon.', slugs: ['youtube-thumbnail-generator', 'gif-maker', 'svg-optimizer', 'favicon-generator'] },
      ],
    },
  },
};

export function getImageToolClusterCopy(locale: Locale): ImageToolClusterCopy {
  return copyByLocale[locale] ?? copyByLocale.en;
}

export function buildImageToolClusterItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[] = imageToolClusterSlugs
): ImageToolClusterItem[] {
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

export function buildImageToolClusterGroups(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ImageToolClusterGroup[] {
  const copy = groupCopy[locale] ?? groupCopy.en;

  return groupSlugs.map((group) => ({
    id: group.id,
    title: copy[group.id].title,
    description: copy[group.id].description,
    tools: buildImageToolClusterItems(locale, categoryNames, toolNames, toolDescriptions, group.slugs),
  }));
}

export function buildImageToolClusterGroupForTool(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ImageToolClusterGroup | null {
  const groupId = getImageToolClusterGroupIdForSlug(slug);
  if (!groupId) {
    return null;
  }

  return buildImageToolClusterGroups(locale, categoryNames, toolNames, toolDescriptions)
    .find((group) => group.id === groupId) ?? null;
}

export function buildImageToolClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: ImageToolClusterGroup[]
): Record<string, unknown> {
  const toolsForList = groups.flatMap((group) => group.tools);

  return {
    name: getImageToolClusterCopy(locale).title,
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

export function buildImageToolClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: ImageToolClusterGroup[]
): Record<string, unknown> {
  const copy = getImageToolClusterCopy(locale);

  return {
    name: copy.title,
    description: copy.seoDescription,
    url: buildLocalizedPageUrl(baseUrl, locale, imageToolClusterPath),
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
