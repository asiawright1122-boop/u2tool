import { tools } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';
import { buildLocalizedPageUrl, getHreflang } from './seo';

export const creatorSeoClusterPath = '/tools/creator-seo-generators';

export const creatorSeoClusterSlugs = [
  'youtube-tags-generator',
  'youtube-title-generator',
  'youtube-description-generator',
  'tiktok-hashtag-generator',
  'instagram-caption-generator',
  'instagram-bio-generator',
  'linkedin-post-generator',
  'linkedin-headline-generator',
  'linkedin-summary-generator',
  'tweet-generator',
  'seo-title-generator',
  'meta-description-generator',
  'blog-title-generator',
  'product-description-generator',
  'email-subject-line-generator',
  'email-preview-text-generator',
  'faq-generator',
  'hashtag-generator',
] as const;

export interface CreatorSeoToolItem {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  name: string;
  slug: string;
}

export interface CreatorSeoClusterGroup {
  description: string;
  id: 'video-social-discovery' | 'social-profiles-posts' | 'seo-marketing-copy';
  title: string;
  tools: CreatorSeoToolItem[];
}

export interface CreatorSeoClusterCopy {
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
  id: CreatorSeoClusterGroup['id'];
  slugs: string[];
}> = [
  {
    id: 'video-social-discovery',
    slugs: [
      'youtube-tags-generator',
      'youtube-title-generator',
      'youtube-description-generator',
      'tiktok-hashtag-generator',
    ],
  },
  {
    id: 'social-profiles-posts',
    slugs: [
      'instagram-caption-generator',
      'instagram-bio-generator',
      'linkedin-post-generator',
      'linkedin-headline-generator',
      'linkedin-summary-generator',
      'tweet-generator',
      'hashtag-generator',
    ],
  },
  {
    id: 'seo-marketing-copy',
    slugs: [
      'seo-title-generator',
      'meta-description-generator',
      'blog-title-generator',
      'product-description-generator',
      'email-subject-line-generator',
      'email-preview-text-generator',
      'faq-generator',
    ],
  },
];

const groupCopy: Record<Locale, Record<CreatorSeoClusterGroup['id'], { title: string; description: string }>> = {
  en: {
    'video-social-discovery': {
      title: 'Video & Social Discovery',
      description: 'Generate searchable titles, descriptions, tags, and hashtags for short-form and YouTube workflows.',
    },
    'social-profiles-posts': {
      title: 'Social Profiles & Posts',
      description: 'Draft profile copy, captions, LinkedIn updates, and quick posts for repeat publishing.',
    },
    'seo-marketing-copy': {
      title: 'SEO & Marketing Copy',
      description: 'Shape search snippets, blog ideas, product copy, email text, and FAQ blocks from one hub.',
    },
  },
  zh: {
    'video-social-discovery': {
      title: '视频与社媒发现',
      description: '集中生成 YouTube 标题、描述、标签，以及短视频常用话题词。',
    },
    'social-profiles-posts': {
      title: '社媒资料与帖子',
      description: '快速整理简介、说明文字、LinkedIn 更新和高频发布内容。',
    },
    'seo-marketing-copy': {
      title: 'SEO 与营销文案',
      description: '从一个入口处理搜索标题、描述、博客选题、商品文案、邮件和 FAQ。',
    },
  },
  ja: {
    'video-social-discovery': {
      title: '動画とソーシャル発見',
      description: 'YouTube のタイトル、説明、タグ、ショート動画向けハッシュタグをまとめて作れます。',
    },
    'social-profiles-posts': {
      title: 'プロフィールと投稿',
      description: 'プロフィール文、キャプション、LinkedIn 投稿、短い投稿文をすばやく整えます。',
    },
    'seo-marketing-copy': {
      title: 'SEO とマーケティング文',
      description: '検索タイトル、メタ説明、ブログ案、商品説明、メール文、FAQ を一箇所で扱えます。',
    },
  },
  ko: {
    'video-social-discovery': {
      title: '동영상 및 소셜 검색',
      description: 'YouTube 제목, 설명, 태그와 숏폼용 해시태그를 한곳에서 만들 수 있습니다.',
    },
    'social-profiles-posts': {
      title: '프로필 및 게시물',
      description: '프로필 문구, 캡션, LinkedIn 업데이트, 짧은 게시물을 빠르게 정리합니다.',
    },
    'seo-marketing-copy': {
      title: 'SEO 및 마케팅 문구',
      description: '검색 제목, 메타 설명, 블로그 아이디어, 상품 설명, 이메일, FAQ를 함께 다룹니다.',
    },
  },
  es: {
    'video-social-discovery': {
      title: 'Video y Descubrimiento Social',
      description: 'Crea titulos, descripciones, etiquetas y hashtags para YouTube y contenido corto.',
    },
    'social-profiles-posts': {
      title: 'Perfiles y Publicaciones',
      description: 'Prepara biografias, captions, publicaciones de LinkedIn y textos breves de forma repetible.',
    },
    'seo-marketing-copy': {
      title: 'SEO y Copy de Marketing',
      description: 'Organiza titulos SEO, metadescripciones, ideas de blog, textos de producto, emails y FAQ.',
    },
  },
  pt: {
    'video-social-discovery': {
      title: 'Video e Descoberta Social',
      description: 'Crie titulos, descricoes, tags e hashtags para YouTube e fluxos de videos curtos.',
    },
    'social-profiles-posts': {
      title: 'Perfis e Posts Sociais',
      description: 'Monte bios, legendas, posts do LinkedIn e textos curtos para publicacao frequente.',
    },
    'seo-marketing-copy': {
      title: 'SEO e Copy de Marketing',
      description: 'Reuna titulos SEO, meta descricoes, ideias de blog, descricoes de produto, emails e FAQ.',
    },
  },
  fr: {
    'video-social-discovery': {
      title: 'Video et Decouverte Sociale',
      description: 'Generez titres, descriptions, tags et hashtags pour YouTube et les formats courts.',
    },
    'social-profiles-posts': {
      title: 'Profils et Publications',
      description: 'Preparez bios, legendes, publications LinkedIn et textes courts pour publier plus vite.',
    },
    'seo-marketing-copy': {
      title: 'SEO et Textes Marketing',
      description: 'Regroupez titres SEO, meta descriptions, idees de blog, fiches produit, emails et FAQ.',
    },
  },
  de: {
    'video-social-discovery': {
      title: 'Video- und Social-Discovery',
      description: 'Erstelle Titel, Beschreibungen, Tags und Hashtags fur YouTube und Short-Form-Inhalte.',
    },
    'social-profiles-posts': {
      title: 'Profile und Social Posts',
      description: 'Formuliere Bios, Captions, LinkedIn-Beitrage und kurze Posts fur regelmassige Veroffentlichung.',
    },
    'seo-marketing-copy': {
      title: 'SEO- und Marketingtexte',
      description: 'Bundele SEO-Titel, Meta-Beschreibungen, Blogideen, Produkttexte, E-Mails und FAQ.',
    },
  },
  ru: {
    'video-social-discovery': {
      title: 'Видео и поиск в соцсетях',
      description: 'Создавайте заголовки, описания, теги и хэштеги для YouTube и коротких видео.',
    },
    'social-profiles-posts': {
      title: 'Профили и публикации',
      description: 'Готовьте био, подписи, посты LinkedIn и короткие тексты для регулярных публикаций.',
    },
    'seo-marketing-copy': {
      title: 'SEO и маркетинговые тексты',
      description: 'Соберите SEO-заголовки, метаописания, идеи блогов, описания товаров, письма и FAQ.',
    },
  },
  ar: {
    'video-social-discovery': {
      title: 'اكتشاف الفيديو والشبكات الاجتماعية',
      description: 'أنشئ عناوين وأوصافا ووسوما وهاشتاغات ليوتيوب والمحتوى القصير.',
    },
    'social-profiles-posts': {
      title: 'الملفات والمنشورات الاجتماعية',
      description: 'جهز النبذات والتعليقات ومنشورات LinkedIn والنصوص القصيرة للنشر المتكرر.',
    },
    'seo-marketing-copy': {
      title: 'SEO ونصوص التسويق',
      description: 'اجمع عناوين SEO والأوصاف التعريفية وأفكار المدونات ونصوص المنتجات والبريد وFAQ.',
    },
  },
};

const copyByLocale: Record<Locale, CreatorSeoClusterCopy> = {
  en: {
    ctaLabel: 'Open cluster',
    description: 'A compact hub for creator, social, SEO, email, and product copy generators.',
    eyebrow: 'Creator SEO',
    h1: 'Creator & SEO Generators',
    intro: 'Use this cluster when one campaign needs several pieces of copy: a searchable video title, matching tags, a social caption, a search snippet, an email subject line, and a product or FAQ block. The tools stay separate so each page can rank for its own long-tail query, while this hub ties the workflows together for visitors and crawlers.',
    relatedLinksTitle: 'Related entry points',
    seoDescription: 'Browse U2Tool creator and SEO generators for YouTube tags, TikTok hashtags, Instagram captions, LinkedIn posts, SEO titles, product descriptions, emails, FAQs, and more.',
    seoTitle: 'Creator & SEO Generators',
    summary: 'The cluster groups high-intent generators by workflow instead of launch date, giving search users a clear path from discovery copy to publishing copy.',
    title: 'Creator & SEO Generators',
    toolCountLabel: 'tools',
    workflow: {
      title: 'Campaign workflow',
      items: [
        { label: 'Discover', text: 'Shape search and social discovery terms before drafting the main post.', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: 'Draft', text: 'Create the first version for video, social, blog, or product channels.', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: 'Optimize', text: 'Turn the draft into search snippets and clear FAQ coverage.', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: 'Repurpose', text: 'Adapt the same angle for email, LinkedIn, and short social updates.', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  zh: {
    ctaLabel: '打开工具集',
    description: '面向创作者、社媒、SEO、邮件和商品文案的生成器集合。',
    eyebrow: '创作者 SEO',
    h1: '创作者与 SEO 生成器',
    intro: '当一个活动需要多段文案时，可以从这里串起来：视频标题、标签、社媒说明、搜索摘要、邮件主题、商品介绍和 FAQ。每个工具仍保留独立页面，便于覆盖具体长尾词；这个集群页负责把访问路径和搜索引擎理解连接起来。',
    relatedLinksTitle: '相关入口',
    seoDescription: '浏览 U2Tool 创作者与 SEO 生成器，包含 YouTube 标签、TikTok 话题、Instagram 文案、LinkedIn 帖子、SEO 标题、商品描述、邮件、FAQ 等工具。',
    seoTitle: '创作者与 SEO 生成器',
    summary: '这个集群按工作流组织高意图生成器，而不是只按上线时间展示，让用户和爬虫都能更快找到相关工具。',
    title: '创作者与 SEO 生成器',
    toolCountLabel: '个工具',
    workflow: {
      title: '内容活动流程',
      items: [
        { label: '发现', text: '先确定搜索与社媒发现词，再进入主体文案。', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: '起稿', text: '为视频、社媒、博客或商品页面生成第一版内容。', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: '优化', text: '把初稿整理成搜索标题、描述和 FAQ 覆盖。', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: '复用', text: '把同一角度改写到邮件、LinkedIn 和短社媒内容。', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  ja: {
    ctaLabel: 'クラスターを開く',
    description: 'クリエイター、SNS、SEO、メール、商品コピー向けジェネレーターのハブです。',
    eyebrow: 'Creator SEO',
    h1: 'クリエイターとSEOジェネレーター',
    intro: '一つのキャンペーンで複数の文章が必要なときに使える集約ページです。動画タイトル、タグ、SNSキャプション、検索スニペット、メール件名、商品説明、FAQをつなげて確認できます。各ツールは個別ページのままなので、長尾検索にも対応しながら内部リンクを強化できます。',
    relatedLinksTitle: '関連入口',
    seoDescription: 'YouTubeタグ、TikTokハッシュタグ、Instagramキャプション、LinkedIn投稿、SEOタイトル、商品説明、メール、FAQなどの生成ツールを探せます。',
    seoTitle: 'クリエイターとSEOジェネレーター',
    summary: '公開日ではなくワークフローごとに高意図の生成ツールを整理し、ユーザーと検索エンジンの移動経路をわかりやすくします。',
    title: 'クリエイターとSEOジェネレーター',
    toolCountLabel: 'ツール',
    workflow: {
      title: 'キャンペーンワークフロー',
      items: [
        { label: '発見', text: '本文を書く前に検索語とSNS向け語句を整えます。', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: '下書き', text: '動画、SNS、ブログ、商品ページ向けの初稿を作ります。', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: '最適化', text: '下書きを検索タイトル、説明、FAQへ展開します。', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: '再利用', text: '同じ切り口をメール、LinkedIn、短い投稿へ調整します。', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  ko: {
    ctaLabel: '클러스터 열기',
    description: '크리에이터, 소셜, SEO, 이메일, 제품 문구 생성기를 모은 허브입니다.',
    eyebrow: 'Creator SEO',
    h1: '크리에이터 및 SEO 생성기',
    intro: '하나의 캠페인에 여러 문구가 필요할 때 이 허브에서 흐름을 이어갈 수 있습니다. 동영상 제목, 태그, 소셜 캡션, 검색 스니펫, 이메일 제목, 제품 설명, FAQ를 함께 살펴봅니다. 각 도구는 별도 페이지로 유지되어 롱테일 검색을 확보하고, 이 페이지는 내부 링크와 탐색을 강화합니다.',
    relatedLinksTitle: '관련 진입점',
    seoDescription: 'YouTube 태그, TikTok 해시태그, Instagram 캡션, LinkedIn 게시물, SEO 제목, 제품 설명, 이메일, FAQ 생성기를 둘러보세요.',
    seoTitle: '크리에이터 및 SEO 생성기',
    summary: '출시 순서가 아니라 작업 흐름별로 고의도 생성기를 묶어 사용자와 검색 엔진이 관련 도구를 더 쉽게 찾게 합니다.',
    title: '크리에이터 및 SEO 생성기',
    toolCountLabel: '도구',
    workflow: {
      title: '캠페인 워크플로',
      items: [
        { label: '발견', text: '본문을 만들기 전에 검색 및 소셜 발견 문구를 정합니다.', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: '초안', text: '동영상, 소셜, 블로그, 제품 채널의 첫 문구를 만듭니다.', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: '최적화', text: '초안을 검색 스니펫과 FAQ 커버리지로 정리합니다.', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: '재활용', text: '같은 각도를 이메일, LinkedIn, 짧은 소셜 업데이트에 맞춥니다.', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  es: {
    ctaLabel: 'Abrir hub',
    description: 'Hub compacto para generadores de creator, social, SEO, email y copy de producto.',
    eyebrow: 'Creator SEO',
    h1: 'Generadores para Creators y SEO',
    intro: 'Usa este hub cuando una campana necesita varias piezas: un titulo de video, etiquetas, una caption social, un snippet de busqueda, asunto de email, descripcion de producto y FAQ. Cada herramienta conserva su pagina para captar busquedas long-tail, mientras este hub conecta el recorrido para personas y crawlers.',
    relatedLinksTitle: 'Entradas relacionadas',
    seoDescription: 'Explora generadores de U2Tool para YouTube tags, TikTok hashtags, Instagram captions, LinkedIn posts, titulos SEO, productos, emails, FAQ y mas.',
    seoTitle: 'Generadores para Creators y SEO',
    summary: 'El cluster agrupa generadores de alta intencion por flujo de trabajo y mejora el camino desde descubrimiento hasta publicacion.',
    title: 'Generadores para Creators y SEO',
    toolCountLabel: 'herramientas',
    workflow: {
      title: 'Flujo de campana',
      items: [
        { label: 'Descubrir', text: 'Define terminos de busqueda y social antes del texto principal.', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: 'Redactar', text: 'Crea la primera version para video, social, blog o producto.', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: 'Optimizar', text: 'Convierte el borrador en snippets de busqueda y FAQ.', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: 'Reutilizar', text: 'Adapta el mismo angulo a email, LinkedIn y posts breves.', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  pt: {
    ctaLabel: 'Abrir hub',
    description: 'Hub para geradores de creator, social, SEO, email e copy de produto.',
    eyebrow: 'Creator SEO',
    h1: 'Geradores para Criadores e SEO',
    intro: 'Use este hub quando uma campanha precisa de varias pecas: titulo de video, tags, legenda social, snippet de busca, assunto de email, descricao de produto e FAQ. Cada ferramenta continua com sua pagina para buscas long-tail, enquanto o hub conecta o caminho para visitantes e crawlers.',
    relatedLinksTitle: 'Entradas relacionadas',
    seoDescription: 'Explore geradores da U2Tool para tags do YouTube, hashtags do TikTok, captions do Instagram, posts do LinkedIn, titulos SEO, produtos, emails, FAQ e mais.',
    seoTitle: 'Geradores para Criadores e SEO',
    summary: 'O cluster organiza geradores de alta intencao por fluxo de trabalho e cria uma ponte entre descoberta e publicacao.',
    title: 'Geradores para Criadores e SEO',
    toolCountLabel: 'ferramentas',
    workflow: {
      title: 'Fluxo de campanha',
      items: [
        { label: 'Descobrir', text: 'Defina termos de busca e social antes do texto principal.', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: 'Rascunhar', text: 'Crie a primeira versao para video, social, blog ou produto.', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: 'Otimizar', text: 'Transforme o rascunho em snippets de busca e FAQ.', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: 'Reaproveitar', text: 'Adapte o mesmo angulo para email, LinkedIn e posts curtos.', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  fr: {
    ctaLabel: 'Ouvrir le hub',
    description: 'Hub pour generateurs creator, social, SEO, email et textes produit.',
    eyebrow: 'Creator SEO',
    h1: 'Generateurs pour Creators et SEO',
    intro: 'Utilisez ce hub quand une campagne demande plusieurs textes: titre video, tags, legende sociale, snippet de recherche, objet email, description produit et FAQ. Chaque outil garde sa page dediee pour les requetes long-tail, tandis que ce hub relie le parcours pour les visiteurs et les moteurs.',
    relatedLinksTitle: 'Entrees associees',
    seoDescription: 'Explorez les generateurs U2Tool pour tags YouTube, hashtags TikTok, captions Instagram, posts LinkedIn, titres SEO, produits, emails, FAQ et plus.',
    seoTitle: 'Generateurs pour Creators et SEO',
    summary: 'Le cluster regroupe les generateurs a forte intention par flux de travail et relie la decouverte a la publication.',
    title: 'Generateurs pour Creators et SEO',
    toolCountLabel: 'outils',
    workflow: {
      title: 'Flux de campagne',
      items: [
        { label: 'Decouvrir', text: 'Cadrez les termes de recherche et sociaux avant le texte principal.', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: 'Rediger', text: 'Creez une premiere version pour video, social, blog ou produit.', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: 'Optimiser', text: 'Transformez le brouillon en snippets de recherche et FAQ.', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: 'Recycler', text: 'Adaptez le meme angle a l email, LinkedIn et posts courts.', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  de: {
    ctaLabel: 'Hub offnen',
    description: 'Hub fur Creator-, Social-, SEO-, E-Mail- und Produkttext-Generatoren.',
    eyebrow: 'Creator SEO',
    h1: 'Creator- und SEO-Generatoren',
    intro: 'Nutze diesen Hub, wenn eine Kampagne mehrere Texte braucht: Videotitel, Tags, Social Caption, Such-Snippet, E-Mail-Betreff, Produktbeschreibung und FAQ. Jede Funktion bleibt eine eigene Tool-Seite fur Long-Tail-Suchen, wahrend dieser Hub die Wege fur Besucher und Crawler verbindet.',
    relatedLinksTitle: 'Verwandte Einstiege',
    seoDescription: 'Entdecke U2Tool Generatoren fur YouTube-Tags, TikTok-Hashtags, Instagram-Captions, LinkedIn-Posts, SEO-Titel, Produkttexte, E-Mails, FAQ und mehr.',
    seoTitle: 'Creator- und SEO-Generatoren',
    summary: 'Der Cluster sortiert Generatoren mit hoher Suchintention nach Workflow und verbindet Discovery-Copy mit Publishing-Copy.',
    title: 'Creator- und SEO-Generatoren',
    toolCountLabel: 'Tools',
    workflow: {
      title: 'Kampagnen-Workflow',
      items: [
        { label: 'Entdecken', text: 'Lege Such- und Social-Begriffe vor dem Haupttext fest.', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: 'Entwerfen', text: 'Erstelle die erste Version fur Video, Social, Blog oder Produkt.', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: 'Optimieren', text: 'Forme den Entwurf zu Such-Snippets und FAQ-Abdeckung.', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: 'Wiederverwenden', text: 'Passe denselben Ansatz fur E-Mail, LinkedIn und kurze Posts an.', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  ru: {
    ctaLabel: 'Открыть раздел',
    description: 'Хаб генераторов для авторов, соцсетей, SEO, писем и товарных текстов.',
    eyebrow: 'Creator SEO',
    h1: 'Генераторы для авторов и SEO',
    intro: 'Используйте этот хаб, когда одной кампании нужно несколько текстов: заголовок видео, теги, подпись для соцсетей, поисковый сниппет, тема письма, описание товара и FAQ. Каждый инструмент остается отдельной страницей для long-tail запросов, а этот раздел связывает маршруты для посетителей и поисковых систем.',
    relatedLinksTitle: 'Связанные входы',
    seoDescription: 'Смотрите генераторы U2Tool для тегов YouTube, хэштегов TikTok, подписей Instagram, постов LinkedIn, SEO-заголовков, описаний товаров, писем, FAQ и другого.',
    seoTitle: 'Генераторы для авторов и SEO',
    summary: 'Кластер группирует генераторы с высоким намерением по рабочему процессу и связывает путь от идеи до публикации.',
    title: 'Генераторы для авторов и SEO',
    toolCountLabel: 'инструментов',
    workflow: {
      title: 'Процесс кампании',
      items: [
        { label: 'Найти', text: 'Сначала задайте поисковые и социальные термины.', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: 'Написать', text: 'Создайте первый вариант для видео, соцсетей, блога или товара.', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: 'Оптимизировать', text: 'Превратите черновик в сниппеты и FAQ.', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: 'Адаптировать', text: 'Перенесите тот же угол в письмо, LinkedIn и короткие посты.', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
  ar: {
    ctaLabel: 'افتح المجموعة',
    description: 'مركز لمولدات صناع المحتوى والسوشيال وSEO والبريد ونصوص المنتجات.',
    eyebrow: 'Creator SEO',
    h1: 'مولدات صناع المحتوى وSEO',
    intro: 'استخدم هذا المركز عندما تحتاج حملة واحدة إلى عدة نصوص: عنوان فيديو، وسوم، تعليق اجتماعي، مقتطف بحث، عنوان بريد، وصف منتج وFAQ. تبقى كل أداة صفحة مستقلة لطلبات البحث الطويلة، بينما يربط هذا المركز المسار للزوار ومحركات البحث.',
    relatedLinksTitle: 'مداخل مرتبطة',
    seoDescription: 'تصفح مولدات U2Tool لوسوم YouTube وهاشتاغات TikTok وتعليقات Instagram ومنشورات LinkedIn وعناوين SEO ووصف المنتجات والبريد وFAQ والمزيد.',
    seoTitle: 'مولدات صناع المحتوى وSEO',
    summary: 'تجمع هذه الصفحة أدوات عالية النية حسب سير العمل وتربط الطريق من الاكتشاف إلى النشر.',
    title: 'مولدات صناع المحتوى وSEO',
    toolCountLabel: 'أداة',
    workflow: {
      title: 'سير الحملة',
      items: [
        { label: 'اكتشاف', text: 'حدد كلمات البحث والسوشيال قبل كتابة النص الأساسي.', slugs: ['youtube-tags-generator', 'tiktok-hashtag-generator', 'hashtag-generator'] },
        { label: 'صياغة', text: 'أنشئ نسخة أولى للفيديو أو السوشيال أو المدونة أو المنتج.', slugs: ['youtube-title-generator', 'instagram-caption-generator', 'blog-title-generator', 'product-description-generator'] },
        { label: 'تحسين', text: 'حوّل المسودة إلى مقتطفات بحث وتغطية FAQ.', slugs: ['seo-title-generator', 'meta-description-generator', 'faq-generator'] },
        { label: 'إعادة استخدام', text: 'كيّف نفس الزاوية للبريد وLinkedIn والمنشورات القصيرة.', slugs: ['email-subject-line-generator', 'email-preview-text-generator', 'linkedin-post-generator', 'tweet-generator'] },
      ],
    },
  },
};

export function getCreatorSeoClusterCopy(locale: Locale): CreatorSeoClusterCopy {
  return copyByLocale[locale] ?? copyByLocale.en;
}

export function buildCreatorSeoToolItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[] = creatorSeoClusterSlugs
): CreatorSeoToolItem[] {
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

export function buildCreatorSeoClusterGroups(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): CreatorSeoClusterGroup[] {
  const copy = groupCopy[locale] ?? groupCopy.en;

  return groupSlugs.map((group) => ({
    id: group.id,
    title: copy[group.id].title,
    description: copy[group.id].description,
    tools: buildCreatorSeoToolItems(locale, categoryNames, toolNames, toolDescriptions, group.slugs),
  }));
}

export function buildCreatorSeoClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: CreatorSeoClusterGroup[]
): Record<string, unknown> {
  const toolsForList = groups.flatMap((group) => group.tools);

  return {
    name: getCreatorSeoClusterCopy(locale).title,
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

export function buildCreatorSeoClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: CreatorSeoClusterGroup[]
): Record<string, unknown> {
  const copy = getCreatorSeoClusterCopy(locale);

  return {
    name: copy.title,
    description: copy.seoDescription,
    url: buildLocalizedPageUrl(baseUrl, locale, creatorSeoClusterPath),
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
