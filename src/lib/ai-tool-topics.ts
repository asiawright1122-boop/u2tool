import { tools, type Tool } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';
import { buildLocalizedPageUrl, getHreflang, resolveMetaDescription } from './seo';

export const aiToolTopicSlugs = [
  'prompt-tools',
  'rag-tools',
  'ai-crawler-tools',
] as const;

export type AiToolTopicSlug = typeof aiToolTopicSlugs[number];

interface AiToolTopicLocaleCopy {
  h1: string;
  intro: string;
  seoDescription: string;
  seoTitle: string;
}

interface AiToolTopicDefinition {
  icon: string;
  slug: AiToolTopicSlug;
  toolSlugs: string[];
  copy: Record<string, AiToolTopicLocaleCopy>;
}

export interface AiToolTopicUiCopy {
  directoryCta: string;
  eyebrow: string;
  modelCostCta: string;
  openToolLabel: string;
  relatedTopicsTitle: string;
  toolCountLabel: string;
  toolsTitle: string;
  workflowTitle: string;
}

export interface AiToolTopicTool {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  name: string;
  slug: string;
}

export interface AiToolTopic {
  h1: string;
  href: string;
  icon: string;
  intro: string;
  path: string;
  seoDescription: string;
  seoTitle: string;
  slug: AiToolTopicSlug;
  tools: AiToolTopicTool[];
}

const englishUiCopy: AiToolTopicUiCopy = {
  directoryCta: 'Browse AI tools',
  eyebrow: 'AI toolkit',
  modelCostCta: 'Compare AI model costs',
  openToolLabel: 'Open tool',
  relatedTopicsTitle: 'Related AI toolkits',
  toolCountLabel: 'tools',
  toolsTitle: 'Tools in this workflow',
  workflowTitle: 'How this toolkit fits together',
};

const chineseUiCopy: AiToolTopicUiCopy = {
  directoryCta: '浏览 AI 工具集',
  eyebrow: 'AI 工具集',
  modelCostCta: '对比 AI 模型费用',
  openToolLabel: '打开工具',
  relatedTopicsTitle: '相关 AI 工具集',
  toolCountLabel: '个工具',
  toolsTitle: '这个工作流里的工具',
  workflowTitle: '如何组合使用这些工具',
};

const uiCopyByLocale: Partial<Record<Locale, AiToolTopicUiCopy>> = {
  en: englishUiCopy,
  zh: chineseUiCopy,
  ja: {
    ...englishUiCopy,
    directoryCta: 'AI ツールを見る',
    eyebrow: 'AI ツールキット',
    modelCostCta: 'AI モデル費用を比較',
    openToolLabel: 'ツールを開く',
    relatedTopicsTitle: '関連 AI ツールキット',
    toolCountLabel: 'ツール',
    toolsTitle: 'このワークフローのツール',
    workflowTitle: 'このツールキットの使い方',
  },
  ko: {
    ...englishUiCopy,
    directoryCta: 'AI 도구 보기',
    eyebrow: 'AI 도구 모음',
    modelCostCta: 'AI 모델 비용 비교',
    openToolLabel: '도구 열기',
    relatedTopicsTitle: '관련 AI 도구 모음',
    toolCountLabel: '도구',
    toolsTitle: '이 워크플로의 도구',
    workflowTitle: '이 도구 모음을 함께 쓰는 방법',
  },
  es: {
    ...englishUiCopy,
    directoryCta: 'Ver herramientas de IA',
    eyebrow: 'Kit de IA',
    modelCostCta: 'Comparar costes de modelos IA',
    openToolLabel: 'Abrir herramienta',
    relatedTopicsTitle: 'Kits de IA relacionados',
    toolCountLabel: 'herramientas',
    toolsTitle: 'Herramientas de este flujo',
    workflowTitle: 'Como encaja este kit',
  },
  pt: {
    ...englishUiCopy,
    directoryCta: 'Ver ferramentas de IA',
    eyebrow: 'Kit de IA',
    modelCostCta: 'Comparar custos de modelos de IA',
    openToolLabel: 'Abrir ferramenta',
    relatedTopicsTitle: 'Kits de IA relacionados',
    toolCountLabel: 'ferramentas',
    toolsTitle: 'Ferramentas deste fluxo',
    workflowTitle: 'Como usar este kit',
  },
  fr: {
    ...englishUiCopy,
    directoryCta: 'Voir les outils IA',
    eyebrow: 'Boite a outils IA',
    modelCostCta: 'Comparer les couts des modeles IA',
    openToolLabel: 'Ouvrir l outil',
    relatedTopicsTitle: 'Kits IA associes',
    toolCountLabel: 'outils',
    toolsTitle: 'Outils de ce flux',
    workflowTitle: 'Comment utiliser ce kit',
  },
  de: {
    ...englishUiCopy,
    directoryCta: 'AI-Tools ansehen',
    eyebrow: 'AI-Toolkit',
    modelCostCta: 'AI-Modellkosten vergleichen',
    openToolLabel: 'Tool offnen',
    relatedTopicsTitle: 'Verwandte AI-Toolkits',
    toolCountLabel: 'Tools',
    toolsTitle: 'Tools in diesem Workflow',
    workflowTitle: 'So passt dieses Toolkit zusammen',
  },
  ru: {
    ...englishUiCopy,
    directoryCta: 'Открыть AI инструменты',
    eyebrow: 'AI набор',
    modelCostCta: 'Сравнить стоимость AI моделей',
    openToolLabel: 'Открыть инструмент',
    relatedTopicsTitle: 'Похожие AI наборы',
    toolCountLabel: 'инструментов',
    toolsTitle: 'Инструменты этого процесса',
    workflowTitle: 'Как использовать этот набор',
  },
  ar: {
    ...englishUiCopy,
    directoryCta: 'تصفح أدوات الذكاء الاصطناعي',
    eyebrow: 'مجموعة أدوات AI',
    modelCostCta: 'قارن تكلفة نماذج AI',
    openToolLabel: 'افتح الأداة',
    relatedTopicsTitle: 'مجموعات AI ذات صلة',
    toolCountLabel: 'أدوات',
    toolsTitle: 'أدوات هذا المسار',
    workflowTitle: 'كيف تعمل هذه الأدوات معا',
  },
};

const topicDefinitions: AiToolTopicDefinition[] = [
  {
    slug: 'prompt-tools',
    icon: 'sparkles',
    toolSlugs: [
      'ai-prompt-generator',
      'ai-prompt-optimizer',
      'ai-prompt-template-generator',
      'json-to-prompt',
      'midjourney-prompt-generator',
      'stable-diffusion-prompt-generator',
    ],
    copy: {
      en: {
        h1: 'AI Prompt Tools',
        seoTitle: 'AI Prompt Tools - Generate, Optimize and Template Prompts',
        seoDescription:
          'Use free AI prompt tools to generate prompts, improve instructions, create reusable prompt templates, turn JSON into prompts, and draft image prompts.',
        intro:
          'Start with a rough task, tighten the instruction, then save the structure as a reusable prompt template. This toolkit also covers JSON-grounded prompts and image prompt workflows.',
      },
      zh: {
        h1: 'AI Prompt 工具集',
        seoTitle: 'AI Prompt 工具集 - 生成、优化和模板化提示词',
        seoDescription:
          '使用免费的 AI Prompt 工具生成提示词、优化指令、创建可复用模板，把 JSON 转成提示词，并编写图像提示词。',
        intro:
          '从一个粗略任务开始，先生成提示词，再优化指令，最后沉淀为可复用模板。这个专题也包含 JSON 驱动提示词和图像提示词工作流。',
      },
      ja: {
        h1: 'AI プロンプトツール',
        seoTitle: 'AI プロンプトツール - 生成、改善、テンプレート化',
        seoDescription:
          '無料の AI プロンプトツールで、指示文の生成、改善、テンプレート作成、JSON からのプロンプト化、画像プロンプト作成を行えます。',
        intro:
          'ラフな依頼から始め、指示を整え、再利用できるテンプレートにします。JSON ベースの指示や画像生成向けプロンプトにも使えます。',
      },
      ko: {
        h1: 'AI 프롬프트 도구',
        seoTitle: 'AI 프롬프트 도구 - 생성, 최적화, 템플릿화',
        seoDescription:
          '무료 AI 프롬프트 도구로 프롬프트를 만들고, 지시문을 개선하고, 재사용 템플릿을 만들며, JSON과 이미지 프롬프트를 준비하세요.',
        intro:
          '거친 요청에서 시작해 지시문을 다듬고 재사용 가능한 템플릿으로 정리합니다. JSON 기반 프롬프트와 이미지 프롬프트 작업도 함께 다룹니다.',
      },
      es: {
        h1: 'Herramientas de prompts IA',
        seoTitle: 'Herramientas de prompts IA - Genera, optimiza y crea plantillas',
        seoDescription:
          'Usa herramientas gratis para generar prompts IA, mejorar instrucciones, crear plantillas reutilizables, convertir JSON en prompts y redactar prompts de imagen.',
        intro:
          'Parte de una tarea inicial, mejora la instruccion y guarda la estructura como plantilla reutilizable. Tambien cubre prompts desde JSON y flujos de imagen.',
      },
      pt: {
        h1: 'Ferramentas de prompts de IA',
        seoTitle: 'Ferramentas de prompts de IA - Gere, otimize e modele prompts',
        seoDescription:
          'Use ferramentas gratuitas para gerar prompts de IA, melhorar instrucoes, criar modelos reutilizaveis, transformar JSON em prompt e escrever prompts de imagem.',
        intro:
          'Comece com uma tarefa simples, refine a instrucao e salve a estrutura como modelo reutilizavel. O kit tambem cobre prompts baseados em JSON e imagem.',
      },
      fr: {
        h1: 'Outils de prompts IA',
        seoTitle: 'Outils de prompts IA - Generer, optimiser et modeliser',
        seoDescription:
          'Utilisez des outils gratuits pour generer des prompts IA, ameliorer les consignes, creer des modeles reutilisables, convertir du JSON en prompt et rediger des prompts image.',
        intro:
          'Partez d une demande simple, clarifiez la consigne, puis transformez-la en modele reutilisable. Le kit couvre aussi les prompts depuis JSON et les prompts image.',
      },
      de: {
        h1: 'AI-Prompt-Tools',
        seoTitle: 'AI-Prompt-Tools - Prompts erstellen, optimieren und vorlagenbasiert nutzen',
        seoDescription:
          'Nutze kostenlose AI-Prompt-Tools, um Prompts zu erstellen, Anweisungen zu verbessern, Vorlagen zu bauen, JSON in Prompts zu wandeln und Bildprompts zu schreiben.',
        intro:
          'Starte mit einer groben Aufgabe, scharfe die Anweisung und speichere sie als wiederverwendbare Vorlage. Auch JSON-basierte und Bild-Prompt-Workflows sind abgedeckt.',
      },
      ru: {
        h1: 'AI инструменты для промптов',
        seoTitle: 'AI инструменты для промптов - генерация, оптимизация и шаблоны',
        seoDescription:
          'Используйте бесплатные AI инструменты для генерации промптов, улучшения инструкций, шаблонов, преобразования JSON в промпт и подготовки промптов для изображений.',
        intro:
          'Начните с черновой задачи, уточните инструкцию и сохраните структуру как повторно используемый шаблон. Набор также покрывает JSON и промпты для изображений.',
      },
      ar: {
        h1: 'أدوات برومبت AI',
        seoTitle: 'أدوات برومبت AI - إنشاء وتحسين وقوالب',
        seoDescription:
          'استخدم أدوات مجانية لإنشاء برومبت AI وتحسين التعليمات وبناء قوالب قابلة لإعادة الاستخدام وتحويل JSON إلى برومبت وكتابة برومبت للصور.',
        intro:
          'ابدأ بمهمة بسيطة، ثم حسّن التعليمات، ثم احفظ البنية كقالب قابل لإعادة الاستخدام. يشمل هذا المسار JSON وبرومبت الصور أيضا.',
      },
    },
  },
  {
    slug: 'rag-tools',
    icon: 'database',
    toolSlugs: [
      'rag-chunk-size-calculator',
      'ai-token-calculator',
      'json-to-prompt',
      'ai-prompt-template-generator',
    ],
    copy: {
      en: {
        h1: 'RAG Tools',
        seoTitle: 'RAG Tools - Chunk Size, Token Cost and Prompt Planning',
        seoDescription:
          'Plan RAG workflows with tools for chunk size, overlap, token cost estimates, JSON-to-prompt conversion, and reusable retrieval prompts.',
        intro:
          'Use this toolkit before building a knowledge base: size chunks, estimate retrieved context, plan model cost, and prepare prompts that stay grounded in source data.',
      },
      zh: {
        h1: 'RAG 工具集',
        seoTitle: 'RAG 工具集 - 分块大小、Token 成本和提示词规划',
        seoDescription:
          '使用 RAG 工具规划知识库工作流：估算分块大小、重叠比例、Token 成本、JSON 转 Prompt 和可复用检索提示词。',
        intro:
          '在搭建知识库前先用这一组工具：规划分块，估算检索上下文和模型成本，并准备能基于来源数据回答的提示词。',
      },
      ja: {
        h1: 'RAG ツール',
        seoTitle: 'RAG ツール - チャンクサイズ、Token 費用、プロンプト設計',
        seoDescription:
          'チャンクサイズ、重複率、Token 費用、JSON からのプロンプト化、検索プロンプトを計画できる RAG 向けツール集です。',
        intro:
          'ナレッジベースを作る前に、チャンク、取得コンテキスト、モデル費用、根拠付き回答のためのプロンプトを整理できます。',
      },
      ko: {
        h1: 'RAG 도구',
        seoTitle: 'RAG 도구 - 청크 크기, 토큰 비용, 프롬프트 계획',
        seoDescription:
          '청크 크기, 오버랩, 토큰 비용, JSON-프롬프트 변환, 검색 프롬프트를 계획하는 RAG 작업용 도구 모음입니다.',
        intro:
          '지식 베이스를 만들기 전에 청크 크기, 검색 컨텍스트, 모델 비용, 출처 기반 답변 프롬프트를 함께 점검하세요.',
      },
      es: {
        h1: 'Herramientas RAG',
        seoTitle: 'Herramientas RAG - Tamano de chunks, coste de tokens y prompts',
        seoDescription:
          'Planifica flujos RAG con herramientas para tamano de chunks, solapamiento, coste de tokens, conversion JSON a prompt y prompts reutilizables.',
        intro:
          'Antes de crear una base de conocimiento, define chunks, estima contexto recuperado, calcula coste de modelo y prepara prompts basados en datos fuente.',
      },
      pt: {
        h1: 'Ferramentas RAG',
        seoTitle: 'Ferramentas RAG - Tamanho de chunks, custo de tokens e prompts',
        seoDescription:
          'Planeje fluxos RAG com ferramentas para tamanho de chunks, sobreposicao, custo de tokens, JSON para prompt e prompts reutilizaveis.',
        intro:
          'Antes de criar uma base de conhecimento, dimensione chunks, estime contexto recuperado, calcule custo do modelo e prepare prompts baseados nas fontes.',
      },
      fr: {
        h1: 'Outils RAG',
        seoTitle: 'Outils RAG - Taille de chunks, cout token et prompts',
        seoDescription:
          'Planifiez des flux RAG avec des outils pour taille de chunks, chevauchement, cout en tokens, conversion JSON vers prompt et prompts reutilisables.',
        intro:
          'Avant de creer une base de connaissance, calibrez les chunks, estimez le contexte recupere, le cout modele et les prompts ancres dans les sources.',
      },
      de: {
        h1: 'RAG-Tools',
        seoTitle: 'RAG-Tools - Chunk-Grosse, Token-Kosten und Prompt-Planung',
        seoDescription:
          'Plane RAG-Workflows mit Tools fur Chunk-Grosse, Overlap, Token-Kosten, JSON-zu-Prompt und wiederverwendbare Retrieval-Prompts.',
        intro:
          'Bevor du eine Wissensbasis baust: Chunks planen, abgerufenen Kontext schatzen, Modellkosten kalkulieren und quellennahe Prompts vorbereiten.',
      },
      ru: {
        h1: 'RAG инструменты',
        seoTitle: 'RAG инструменты - размер чанков, token стоимость и промпты',
        seoDescription:
          'Планируйте RAG процессы: размер чанков, overlap, token стоимость, JSON в промпт и повторно используемые retrieval промпты.',
        intro:
          'Перед созданием базы знаний оцените чанки, извлекаемый контекст, стоимость модели и подготовьте промпты, опирающиеся на исходные данные.',
      },
      ar: {
        h1: 'أدوات RAG',
        seoTitle: 'أدوات RAG - حجم المقاطع وتكلفة التوكن والتخطيط',
        seoDescription:
          'خطط لمسارات RAG عبر أدوات حجم المقاطع والتداخل وتكلفة التوكن وتحويل JSON إلى برومبت وقوالب الاسترجاع.',
        intro:
          'قبل بناء قاعدة معرفة، حدد حجم المقاطع، وقدر سياق الاسترجاع وتكلفة النموذج، وجهز برومبت يرتبط بمصادر البيانات.',
      },
    },
  },
  {
    slug: 'ai-crawler-tools',
    icon: 'globe-2',
    toolSlugs: [
      'ai-robots-txt-generator',
      'llms-txt-generator',
      'llms-txt-validator',
    ],
    copy: {
      en: {
        h1: 'AI Crawler and llms.txt Tools',
        seoTitle: 'AI Crawler Tools - Robots.txt Rules and llms.txt Generator',
        seoDescription:
          'Create AI crawler rules, generate llms.txt files, validate AI discovery files, and publish clearer guidance for AI systems that read your site.',
        intro:
          'Use this toolkit when you want AI systems to understand what they can crawl, which pages matter, and how to read your site guidance without guessing.',
      },
      zh: {
        h1: 'AI 爬虫与 llms.txt 工具集',
        seoTitle: 'AI 爬虫工具集 - Robots.txt 规则和 llms.txt 生成器',
        seoDescription:
          '创建 AI 爬虫访问规则，生成 llms.txt 文件，验证 AI 发现文件，并为读取站点的 AI 系统提供更清晰的说明。',
        intro:
          '当你希望 AI 系统更清楚地理解哪些内容可抓取、哪些页面重要、站点说明该如何读取时，可以从这一组工具开始。',
      },
      ja: {
        h1: 'AI クローラーと llms.txt ツール',
        seoTitle: 'AI クローラーツール - robots.txt と llms.txt 生成',
        seoDescription:
          'AI クローラー向けルール作成、llms.txt 生成、AI discovery ファイル検証、サイトガイド公開を支援します。',
        intro:
          'AI システムにクロール範囲、重要ページ、サイト説明を明確に伝えたいときに使うツールセットです。',
      },
      ko: {
        h1: 'AI 크롤러 및 llms.txt 도구',
        seoTitle: 'AI 크롤러 도구 - robots.txt 규칙과 llms.txt 생성',
        seoDescription:
          'AI 크롤러 규칙을 만들고, llms.txt 파일을 생성 및 검증하며, AI 시스템이 사이트 지침을 더 명확히 읽도록 돕습니다.',
        intro:
          'AI 시스템이 어떤 페이지를 읽을 수 있는지, 어떤 페이지가 중요한지, 사이트 안내를 어떻게 해석할지 알려줄 때 사용하세요.',
      },
      es: {
        h1: 'Herramientas para crawlers IA y llms.txt',
        seoTitle: 'Herramientas para crawlers IA - Reglas robots.txt y llms.txt',
        seoDescription:
          'Crea reglas para crawlers IA, genera archivos llms.txt, valida archivos de descubrimiento y publica guias claras para sistemas de IA.',
        intro:
          'Usa este kit para indicar a sistemas de IA que pueden rastrear, que paginas importan y como deben leer la guia de tu sitio.',
      },
      pt: {
        h1: 'Ferramentas de crawler de IA e llms.txt',
        seoTitle: 'Ferramentas de crawler de IA - Robots.txt e llms.txt',
        seoDescription:
          'Crie regras para crawlers de IA, gere arquivos llms.txt, valide arquivos de descoberta e publique orientacoes claras para sistemas de IA.',
        intro:
          'Use este kit para explicar a sistemas de IA o que podem rastrear, quais paginas importam e como ler as orientacoes do site.',
      },
      fr: {
        h1: 'Outils crawler IA et llms.txt',
        seoTitle: 'Outils crawler IA - Regles robots.txt et generateur llms.txt',
        seoDescription:
          'Creez des regles pour crawlers IA, generez des fichiers llms.txt, validez la decouverte IA et publiez des consignes claires pour les systemes IA.',
        intro:
          'Utilisez ce kit pour indiquer aux systemes IA ce qu ils peuvent crawler, quelles pages comptent et comment lire vos consignes de site.',
      },
      de: {
        h1: 'AI-Crawler- und llms.txt-Tools',
        seoTitle: 'AI-Crawler-Tools - robots.txt-Regeln und llms.txt Generator',
        seoDescription:
          'Erstelle AI-Crawler-Regeln, generiere llms.txt-Dateien, validiere Discovery-Dateien und veroffentliche klarere Hinweise fur AI-Systeme.',
        intro:
          'Nutze dieses Toolkit, wenn AI-Systeme klar erkennen sollen, was sie crawlen durfen, welche Seiten wichtig sind und wie sie deine Hinweise lesen sollen.',
      },
      ru: {
        h1: 'AI crawler и llms.txt инструменты',
        seoTitle: 'AI crawler инструменты - robots.txt правила и llms.txt генератор',
        seoDescription:
          'Создавайте правила для AI crawler, генерируйте llms.txt, проверяйте discovery файлы и публикуйте понятные инструкции для AI систем.',
        intro:
          'Используйте этот набор, чтобы AI системы понимали, что можно сканировать, какие страницы важны и как читать инструкции сайта.',
      },
      ar: {
        h1: 'أدوات زواحف AI و llms.txt',
        seoTitle: 'أدوات زواحف AI - قواعد robots.txt ومولد llms.txt',
        seoDescription:
          'أنشئ قواعد لزواحف AI وملفات llms.txt وتحقق من ملفات الاكتشاف وانشر إرشادات أوضح لأنظمة الذكاء الاصطناعي.',
        intro:
          'استخدم هذه الأدوات عندما تريد أن تفهم أنظمة AI ما الذي يمكنها زحفه، وأي الصفحات أهم، وكيف تقرأ إرشادات موقعك.',
      },
    },
  },
];

const topicSlugSet = new Set<string>(aiToolTopicSlugs);

export function isAiToolTopicSlug(slug: string): slug is AiToolTopicSlug {
  return topicSlugSet.has(slug);
}

export function getAiToolTopicPath(slug: AiToolTopicSlug): string {
  return `/ai/${slug}`;
}

export function getAiToolTopicUiCopy(locale: Locale): AiToolTopicUiCopy {
  return uiCopyByLocale[locale] ?? englishUiCopy;
}

function getTopicDefinition(slug: AiToolTopicSlug): AiToolTopicDefinition {
  return topicDefinitions.find((topic) => topic.slug === slug) ?? topicDefinitions[0];
}

function getTopicLocaleCopy(definition: AiToolTopicDefinition, locale: Locale): AiToolTopicLocaleCopy {
  return definition.copy[locale] ?? definition.copy.en;
}

function buildTopicTools(
  locale: Locale,
  definition: AiToolTopicDefinition,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  availableTools: Tool[] = tools
): AiToolTopicTool[] {
  const toolBySlug = new Map(availableTools.map((tool) => [tool.slug, tool]));

  return definition.toolSlugs
    .map((slug) => toolBySlug.get(slug))
    .filter((tool): tool is Tool => Boolean(tool))
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

export function buildAiToolTopic(
  locale: Locale,
  slug: AiToolTopicSlug,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  availableTools: Tool[] = tools
): AiToolTopic {
  const definition = getTopicDefinition(slug);
  const copy = getTopicLocaleCopy(definition, locale);

  return {
    ...copy,
    href: getLocalizedPath(locale, getAiToolTopicPath(definition.slug)),
    icon: definition.icon,
    path: getAiToolTopicPath(definition.slug),
    slug: definition.slug,
    tools: buildTopicTools(locale, definition, categoryNames, toolNames, toolDescriptions, availableTools),
  };
}

export function buildAiToolTopics(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  availableTools: Tool[] = tools
): AiToolTopic[] {
  return aiToolTopicSlugs.map((slug) =>
    buildAiToolTopic(locale, slug, categoryNames, toolNames, toolDescriptions, availableTools)
  );
}

export function buildAiToolTopicItemList(baseUrl: string, topic: AiToolTopic): Record<string, unknown> {
  return {
    name: topic.h1,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: topic.tools.length,
    itemListElement: topic.tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}${tool.href}`,
      item: {
        '@type': 'SoftwareApplication',
        applicationCategory: tool.categoryName,
        description: tool.description || undefined,
        name: tool.name,
        url: `${baseUrl}${tool.href}`,
      },
    })),
  };
}

export function buildAiToolTopicCollectionData(
  baseUrl: string,
  locale: Locale,
  topic: AiToolTopic
): Record<string, unknown> {
  return {
    '@type': 'CollectionPage',
    name: topic.h1,
    description: resolveMetaDescription({
      description: topic.seoDescription,
      locale,
      title: topic.seoTitle,
    }),
    url: buildLocalizedPageUrl(baseUrl, locale, topic.path),
    inLanguage: getHreflang(locale),
    numberOfItems: topic.tools.length,
    hasPart: topic.tools.map((tool) => ({
      '@type': 'SoftwareApplication',
      applicationCategory: tool.categoryName,
      description: tool.description || undefined,
      name: tool.name,
      url: `${baseUrl}${tool.href}`,
    })),
  };
}
