import { tools } from '@/config/tools';
import { getLocalizedPath, type Locale } from './i18n';
import { buildLocalizedPageUrl, getHreflang } from './seo';

export const chartToolClusterPath = '/tools/chart-generators';

export const chartToolClusterSlugs = [
  'bar-chart-generator',
  'line-chart-generator',
  'pie-chart-generator',
  'area-chart-generator',
  'scatter-chart-generator',
  'radar-chart-generator',
  'doughnut-chart-generator',
  'grouped-bar-chart-generator',
  'grouped-line-chart-generator',
  'stacked-bar-chart-generator',
  'stacked-area-chart-generator',
  'percentage-stacked-bar-chart-generator',
  'positive-negative-bar-chart-generator',
  'mixed-chart-generator',
  'treemap-chart-generator',
  'sunburst-chart-generator',
  'sankey-chart-generator',
  'tree-chart-generator',
  'graph-chart-generator',
  'funnel-chart-generator',
  'waterfall-chart-generator',
  'venn-diagram-generator',
  'pictorial-bar-chart-generator',
  'theme-river-generator',
  'candlestick-chart-generator',
  'gantt-chart-generator',
  'timeline-chart-generator',
  'calendar-heatmap-generator',
  'heatmap-chart-generator',
  'gauge-chart-generator',
  'ring-progress-chart-generator',
  'liquid-fill-chart-generator',
  'boxplot-chart-generator',
  'bubble-chart-generator',
  'polar-bar-chart-generator',
  'parallel-chart-generator',
  'wordcloud-generator',
  'nightingale-rose-chart-generator',
  'multi-ring-chart-generator',
  'half-doughnut-chart-generator',
  'nested-pie-chart-generator',
  'step-line-chart-generator',
] as const;

export interface ChartToolClusterItem {
  category: string;
  categoryName: string;
  description: string;
  href: string;
  icon: string;
  name: string;
  slug: string;
}

export interface ChartToolClusterGroup {
  description: string;
  id: 'compare-trends' | 'hierarchy-flow' | 'time-project-status' | 'advanced-statistical';
  title: string;
  tools: ChartToolClusterItem[];
}

export interface ChartToolClusterCopy {
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
  id: ChartToolClusterGroup['id'];
  slugs: string[];
}> = [
  {
    id: 'compare-trends',
    slugs: [
      'bar-chart-generator',
      'line-chart-generator',
      'pie-chart-generator',
      'area-chart-generator',
      'scatter-chart-generator',
      'radar-chart-generator',
      'doughnut-chart-generator',
      'grouped-bar-chart-generator',
      'grouped-line-chart-generator',
      'stacked-bar-chart-generator',
      'stacked-area-chart-generator',
      'percentage-stacked-bar-chart-generator',
      'positive-negative-bar-chart-generator',
      'mixed-chart-generator',
    ],
  },
  {
    id: 'hierarchy-flow',
    slugs: [
      'treemap-chart-generator',
      'sunburst-chart-generator',
      'sankey-chart-generator',
      'tree-chart-generator',
      'graph-chart-generator',
      'funnel-chart-generator',
      'waterfall-chart-generator',
      'venn-diagram-generator',
      'pictorial-bar-chart-generator',
      'theme-river-generator',
    ],
  },
  {
    id: 'time-project-status',
    slugs: [
      'candlestick-chart-generator',
      'gantt-chart-generator',
      'timeline-chart-generator',
      'calendar-heatmap-generator',
      'heatmap-chart-generator',
      'gauge-chart-generator',
      'ring-progress-chart-generator',
      'liquid-fill-chart-generator',
    ],
  },
  {
    id: 'advanced-statistical',
    slugs: [
      'boxplot-chart-generator',
      'bubble-chart-generator',
      'polar-bar-chart-generator',
      'parallel-chart-generator',
      'wordcloud-generator',
      'nightingale-rose-chart-generator',
      'multi-ring-chart-generator',
      'half-doughnut-chart-generator',
      'nested-pie-chart-generator',
      'step-line-chart-generator',
    ],
  },
];

const chartToolClusterSlugSet = new Set<string>(chartToolClusterSlugs);

export function isChartToolClusterSlug(slug: string): boolean {
  return chartToolClusterSlugSet.has(slug);
}

export function getChartToolClusterGroupIdForSlug(slug: string): ChartToolClusterGroup['id'] | null {
  return groupSlugs.find((group) => group.slugs.includes(slug))?.id ?? null;
}

const groupCopy: Record<Locale, Record<ChartToolClusterGroup['id'], { title: string; description: string }>> = {
  en: {
    'compare-trends': { title: 'Compare Values & Trends', description: 'Create bar, line, area, pie, scatter, radar, stacked, and mixed charts for everyday reporting.' },
    'hierarchy-flow': { title: 'Hierarchy, Flow & Relationships', description: 'Map structure, flow, networks, funnels, waterfalls, trees, and overlapping sets.' },
    'time-project-status': { title: 'Time, Project & Status', description: 'Visualize Gantt schedules, project timelines, heatmaps, financial candles, gauges, and progress states.' },
    'advanced-statistical': { title: 'Advanced & Statistical Charts', description: 'Build boxplots, bubbles, polar views, parallel coordinates, word clouds, and radial chart variants.' },
  },
  zh: {
    'compare-trends': { title: '数值比较与趋势', description: '生成柱状图、折线图、面积图、饼图、散点图、雷达图、堆叠图和混合图。' },
    'hierarchy-flow': { title: '层级、流向与关系', description: '展示结构、流量、网络、漏斗、瀑布、树形关系和集合交集。' },
    'time-project-status': { title: '时间、项目与状态', description: '可视化排期、时间线、热力图、金融蜡烛图、仪表盘和进度状态。' },
    'advanced-statistical': { title: '高级与统计图表', description: '创建箱线图、气泡图、极坐标、平行坐标、词云和环形变体。' },
  },
  ja: {
    'compare-trends': { title: '値の比較とトレンド', description: '棒、折れ線、面、円、散布、レーダー、積み上げ、複合チャートを作成できます。' },
    'hierarchy-flow': { title: '階層、フロー、関係', description: '構造、流れ、ネットワーク、ファネル、ウォーターフォール、ツリー、集合を可視化します。' },
    'time-project-status': { title: '時間、プロジェクト、状態', description: 'スケジュール、タイムライン、ヒートマップ、ローソク足、ゲージ、進捗を表示します。' },
    'advanced-statistical': { title: '高度・統計チャート', description: '箱ひげ、バブル、極座標、平行座標、ワードクラウド、リング系チャートを作ります。' },
  },
  ko: {
    'compare-trends': { title: '값 비교 및 추세', description: '막대, 선, 영역, 파이, 산점도, 레이더, 누적, 혼합 차트를 만듭니다.' },
    'hierarchy-flow': { title: '계층, 흐름 및 관계', description: '구조, 흐름, 네트워크, 퍼널, 워터폴, 트리, 집합 관계를 시각화합니다.' },
    'time-project-status': { title: '시간, 프로젝트 및 상태', description: '일정, 타임라인, 히트맵, 캔들, 게이지, 진행 상태를 표시합니다.' },
    'advanced-statistical': { title: '고급 및 통계 차트', description: '박스플롯, 버블, 극좌표, 평행좌표, 워드클라우드, 링 차트를 만듭니다.' },
  },
  es: {
    'compare-trends': { title: 'Comparar Valores y Tendencias', description: 'Crea graficos de barras, lineas, areas, pastel, dispersion, radar, apilados y mixtos.' },
    'hierarchy-flow': { title: 'Jerarquia, Flujo y Relaciones', description: 'Mapea estructura, flujos, redes, embudos, cascadas, arboles y conjuntos.' },
    'time-project-status': { title: 'Tiempo, Proyecto y Estado', description: 'Visualiza calendarios, lineas de tiempo, mapas de calor, velas, medidores y progreso.' },
    'advanced-statistical': { title: 'Graficos Avanzados y Estadisticos', description: 'Genera boxplots, burbujas, vistas polares, coordenadas paralelas, nubes de palabras y anillos.' },
  },
  pt: {
    'compare-trends': { title: 'Comparar Valores e Tendencias', description: 'Crie graficos de barras, linhas, areas, pizza, dispersao, radar, empilhados e mistos.' },
    'hierarchy-flow': { title: 'Hierarquia, Fluxo e Relacoes', description: 'Mapeie estruturas, fluxos, redes, funis, cascatas, arvores e conjuntos.' },
    'time-project-status': { title: 'Tempo, Projeto e Status', description: 'Visualize cronogramas, linhas do tempo, heatmaps, candles, medidores e progresso.' },
    'advanced-statistical': { title: 'Graficos Avancados e Estatisticos', description: 'Monte boxplots, bolhas, polares, coordenadas paralelas, nuvens de palavras e aneis.' },
  },
  fr: {
    'compare-trends': { title: 'Comparer Valeurs et Tendances', description: 'Creez barres, lignes, aires, camemberts, nuages de points, radar, empiles et mixtes.' },
    'hierarchy-flow': { title: 'Hierarchie, Flux et Relations', description: 'Cartographiez structures, flux, reseaux, entonnoirs, cascades, arbres et ensembles.' },
    'time-project-status': { title: 'Temps, Projet et Statut', description: 'Visualisez plannings, timelines, heatmaps, chandeliers, jauges et progression.' },
    'advanced-statistical': { title: 'Graphiques Avances et Statistiques', description: 'Creez boxplots, bulles, vues polaires, coordonnees paralleles, nuages de mots et anneaux.' },
  },
  de: {
    'compare-trends': { title: 'Werte und Trends Vergleichen', description: 'Erstellen Sie Balken-, Linien-, Flachen-, Kreis-, Streu-, Radar-, Stapel- und Mixed-Charts.' },
    'hierarchy-flow': { title: 'Hierarchie, Fluss und Beziehungen', description: 'Visualisieren Sie Struktur, Flusse, Netzwerke, Funnel, Wasserfalle, Baume und Mengen.' },
    'time-project-status': { title: 'Zeit, Projekt und Status', description: 'Zeigen Sie Zeitplane, Timelines, Heatmaps, Candles, Gauges und Fortschritt an.' },
    'advanced-statistical': { title: 'Erweiterte und Statistische Charts', description: 'Bauen Sie Boxplots, Bubble-Charts, Polaransichten, Parallelkoordinaten, Wordclouds und Ringvarianten.' },
  },
  ru: {
    'compare-trends': { title: 'Сравнение значений и трендов', description: 'Создавайте столбчатые, линейные, площадные, круговые, точечные, радарные, составные и смешанные графики.' },
    'hierarchy-flow': { title: 'Иерархия, поток и связи', description: 'Показывайте структуру, потоки, сети, воронки, водопады, деревья и пересечения.' },
    'time-project-status': { title: 'Время, проект и статус', description: 'Визуализируйте планы, таймлайны, тепловые карты, свечи, индикаторы и прогресс.' },
    'advanced-statistical': { title: 'Продвинутые и статистические графики', description: 'Создавайте boxplot, пузырьковые, полярные, параллельные координаты, облака слов и кольцевые варианты.' },
  },
  ar: {
    'compare-trends': { title: 'مقارنة القيم والاتجاهات', description: 'أنشئ مخططات الأعمدة والخطوط والمساحات والدائرية والتشتت والرادار والمكدسة والمختلطة.' },
    'hierarchy-flow': { title: 'التسلسل والتدفق والعلاقات', description: 'اعرض البنية والتدفقات والشبكات والقمع والشلالات والأشجار وتداخل المجموعات.' },
    'time-project-status': { title: 'الوقت والمشروع والحالة', description: 'صوّر الجداول الزمنية والخرائط الحرارية والشموع والمقاييس وحالات التقدم.' },
    'advanced-statistical': { title: 'مخططات متقدمة وإحصائية', description: 'أنشئ boxplot وفقاعات وقطبية وإحداثيات متوازية وسحب كلمات وحلقات متعددة.' },
  },
};

const copyByLocale: Record<Locale, ChartToolClusterCopy> = {
  en: {
    eyebrow: 'Chart workflow hub',
    h1: 'Chart Generators & Data Visualization Tools',
    title: 'Chart Generators & Data Visualization Tools',
    description: 'A focused hub for choosing the right online chart generator for reports, dashboards, product analytics, presentations, and data storytelling.',
    seoTitle: 'Chart Generators & Data Visualization Tools',
    seoDescription: 'Free online chart generators for bar, line, pie, scatter, radar, heatmap, Gantt, waterfall, Sankey, treemap, candlestick, bubble, and advanced data visualization workflows.',
    intro: 'Start from the story you need to tell, then pick a chart family: compare values, show trends, explain hierarchy, map flows, track time, or reveal statistical distributions.',
    summary: 'The cluster organizes 42 chart generators by visual analysis job so users can move from raw data to a publishable chart faster.',
    ctaLabel: 'Open chart hub',
    relatedLinksTitle: 'Related chart routes',
    toolCountLabel: 'tools',
    workflow: {
      title: 'Chart workflow',
      items: [
        { label: 'Compare', text: 'Use bars, pies, radar, stacked, and mixed charts to compare categories or contribution.', slugs: ['bar-chart-generator', 'pie-chart-generator', 'radar-chart-generator', 'stacked-bar-chart-generator'] },
        { label: 'Trend', text: 'Use line, area, step, calendar heatmap, and timeline views for change over time.', slugs: ['line-chart-generator', 'area-chart-generator', 'step-line-chart-generator', 'timeline-chart-generator'] },
        { label: 'Plan', text: 'Use Gantt charts, timelines, progress rings, and heatmaps to show schedules, milestones, and project status.', slugs: ['gantt-chart-generator', 'timeline-chart-generator', 'ring-progress-chart-generator', 'calendar-heatmap-generator'] },
        { label: 'Explain', text: 'Use funnels, waterfalls, Sankey, treemaps, and graph charts to explain flow or structure.', slugs: ['funnel-chart-generator', 'waterfall-chart-generator', 'sankey-chart-generator', 'treemap-chart-generator'] },
        { label: 'Analyze', text: 'Use scatter, bubble, boxplot, parallel, and heatmap charts for deeper statistical patterns.', slugs: ['scatter-chart-generator', 'bubble-chart-generator', 'boxplot-chart-generator', 'parallel-chart-generator'] },
      ],
    },
  },
  zh: {
    eyebrow: '图表工作流中心',
    h1: '图表生成器与数据可视化工具',
    title: '图表生成器与数据可视化工具',
    description: '为报告、仪表盘、产品分析、演示和数据叙事选择合适的在线图表生成器。',
    seoTitle: '图表生成器与数据可视化工具',
    seoDescription: '免费的在线图表生成器集合，覆盖柱状图、折线图、饼图、散点图、热力图、甘特图、瀑布图、桑基图、树图、K 线和高级可视化。',
    intro: '先明确要讲的故事，再选择图表类型：比较数值、展示趋势、解释层级、映射流向、追踪时间或发现统计分布。',
    summary: '这个专题按可视分析任务组织 42 个图表生成器，让用户更快从数据走到可发布图表。',
    ctaLabel: '打开图表专题',
    relatedLinksTitle: '相关图表入口',
    toolCountLabel: '个工具',
    workflow: {
      title: '图表工作流',
      items: [
        { label: '比较', text: '用柱状图、饼图、雷达图、堆叠图和混合图比较分类或占比。', slugs: ['bar-chart-generator', 'pie-chart-generator', 'radar-chart-generator', 'stacked-bar-chart-generator'] },
        { label: '趋势', text: '用折线图、面积图、阶梯线、日历热力图和时间线展示变化。', slugs: ['line-chart-generator', 'area-chart-generator', 'step-line-chart-generator', 'timeline-chart-generator'] },
        { label: '解释', text: '用漏斗图、瀑布图、桑基图、矩形树图和关系图解释流向或结构。', slugs: ['funnel-chart-generator', 'waterfall-chart-generator', 'sankey-chart-generator', 'treemap-chart-generator'] },
        { label: '分析', text: '用散点图、气泡图、箱线图、平行坐标和热力图查看统计模式。', slugs: ['scatter-chart-generator', 'bubble-chart-generator', 'boxplot-chart-generator', 'parallel-chart-generator'] },
      ],
    },
  },
  ja: {
    eyebrow: 'チャートワークフロー hub',
    h1: 'チャート生成・データ可視化ツール',
    title: 'チャート生成・データ可視化ツール',
    description: 'レポート、ダッシュボード、分析、プレゼン、データストーリーに合うチャート生成ツールを選べます。',
    seoTitle: 'チャート生成・データ可視化ツール',
    seoDescription: '棒、折れ線、円、散布、ヒートマップ、ガント、ウォーターフォール、サンキー、ツリーマップ、ローソク足などの無料チャート生成ツール。',
    intro: '伝えたい内容から始め、比較、トレンド、階層、フロー、時間、統計分布に合うチャートを選びます。',
    summary: '42 個のチャート生成ツールを分析タスク別に整理し、データから公開用チャートまで素早く進めます。',
    ctaLabel: 'チャートハブを開く',
    relatedLinksTitle: '関連チャートルート',
    toolCountLabel: 'ツール',
    workflow: copyByWorkflowFallback('ja'),
  },
  ko: {
    eyebrow: '차트 워크플로 허브',
    h1: '차트 생성기 및 데이터 시각화 도구',
    title: '차트 생성기 및 데이터 시각화 도구',
    description: '보고서, 대시보드, 제품 분석, 발표, 데이터 스토리텔링에 맞는 온라인 차트 생성기를 고릅니다.',
    seoTitle: '차트 생성기 및 데이터 시각화 도구',
    seoDescription: '막대, 선, 파이, 산점도, 히트맵, 간트, 워터폴, Sankey, 트리맵, 캔들, 버블 등 무료 차트 생성 도구.',
    intro: '전달할 이야기를 먼저 정하고, 비교, 추세, 계층, 흐름, 시간, 통계 분포에 맞는 차트를 선택합니다.',
    summary: '42개의 차트 생성기를 시각 분석 작업별로 정리해 데이터에서 게시 가능한 차트까지 빠르게 이동합니다.',
    ctaLabel: '차트 허브 열기',
    relatedLinksTitle: '관련 차트 경로',
    toolCountLabel: '도구',
    workflow: copyByWorkflowFallback('ko'),
  },
  es: {
    eyebrow: 'Hub de graficos',
    h1: 'Generadores de Graficos y Herramientas de Visualizacion',
    title: 'Generadores de Graficos y Herramientas de Visualizacion',
    description: 'Un hub para elegir el generador de graficos correcto para informes, dashboards, analitica y presentaciones.',
    seoTitle: 'Generadores de Graficos y Herramientas de Visualizacion',
    seoDescription: 'Generadores gratis de barras, lineas, pastel, dispersion, heatmap, Gantt, waterfall, Sankey, treemap, velas, burbujas y visualizaciones avanzadas.',
    intro: 'Empieza por la historia que necesitas contar y elige una familia: comparar, mostrar tendencias, explicar jerarquias, mapear flujos o analizar distribuciones.',
    summary: 'El cluster organiza 42 generadores de graficos por trabajo visual para pasar de datos a graficos publicables.',
    ctaLabel: 'Abrir hub de graficos',
    relatedLinksTitle: 'Rutas de graficos relacionadas',
    toolCountLabel: 'herramientas',
    workflow: copyByWorkflowFallback('es'),
  },
  pt: {
    eyebrow: 'Hub de graficos',
    h1: 'Geradores de Graficos e Ferramentas de Visualizacao',
    title: 'Geradores de Graficos e Ferramentas de Visualizacao',
    description: 'Um hub para escolher o gerador de graficos ideal para relatorios, dashboards, analise e apresentacoes.',
    seoTitle: 'Geradores de Graficos e Ferramentas de Visualizacao',
    seoDescription: 'Geradores gratis de barras, linhas, pizza, dispersao, heatmap, Gantt, waterfall, Sankey, treemap, candles, bolhas e visualizacoes avancadas.',
    intro: 'Comece pela historia que precisa contar e escolha uma familia: comparar, mostrar tendencias, explicar hierarquias, mapear fluxos ou analisar distribuicoes.',
    summary: 'O cluster organiza 42 geradores por tarefa visual para ir dos dados ao grafico publicavel.',
    ctaLabel: 'Abrir hub de graficos',
    relatedLinksTitle: 'Rotas de graficos relacionadas',
    toolCountLabel: 'ferramentas',
    workflow: copyByWorkflowFallback('pt'),
  },
  fr: {
    eyebrow: 'Hub graphiques',
    h1: 'Generateurs de Graphiques et Outils de Visualisation',
    title: 'Generateurs de Graphiques et Outils de Visualisation',
    description: 'Un hub pour choisir le bon generateur de graphiques pour rapports, dashboards, analyse produit et presentations.',
    seoTitle: 'Generateurs de Graphiques et Outils de Visualisation',
    seoDescription: 'Generateurs gratuits pour barres, lignes, camemberts, nuages de points, heatmaps, Gantt, waterfall, Sankey, treemap, chandeliers et graphiques avances.',
    intro: 'Partez de l histoire a raconter, puis choisissez une famille : comparer, montrer une tendance, expliquer une hierarchie, cartographier un flux ou analyser une distribution.',
    summary: 'Le cluster organise 42 generateurs par travail visuel pour passer plus vite des donnees au graphique publiable.',
    ctaLabel: 'Ouvrir le hub graphiques',
    relatedLinksTitle: 'Parcours graphiques associes',
    toolCountLabel: 'outils',
    workflow: copyByWorkflowFallback('fr'),
  },
  de: {
    eyebrow: 'Chart-Workflow-Hub',
    h1: 'Chart Generatoren und Datenvisualisierung Tools',
    title: 'Chart Generatoren und Datenvisualisierung Tools',
    description: 'Ein Hub fur den passenden Online-Chart-Generator fur Reports, Dashboards, Produktanalysen und Prasentationen.',
    seoTitle: 'Chart Generatoren und Datenvisualisierung Tools',
    seoDescription: 'Kostenlose Chart-Generatoren fur Balken, Linien, Kreis, Scatter, Heatmap, Gantt, Waterfall, Sankey, Treemap, Candlestick, Bubble und erweiterte Visualisierungen.',
    intro: 'Beginnen Sie mit der Aussage, die Sie zeigen wollen, und wahlen Sie dann Vergleich, Trend, Hierarchie, Fluss, Zeit oder statistische Verteilung.',
    summary: 'Der Cluster ordnet 42 Chart-Generatoren nach visueller Analyseaufgabe, damit Daten schneller zu publizierbaren Charts werden.',
    ctaLabel: 'Chart-Hub offnen',
    relatedLinksTitle: 'Verwandte Chart-Routen',
    toolCountLabel: 'Tools',
    workflow: copyByWorkflowFallback('de'),
  },
  ru: {
    eyebrow: 'Центр графиков',
    h1: 'Генераторы графиков и инструменты визуализации данных',
    title: 'Генераторы графиков и инструменты визуализации данных',
    description: 'Хаб для выбора онлайн-генератора графиков для отчетов, панелей, аналитики, презентаций и рассказа о данных.',
    seoTitle: 'Генераторы графиков и инструменты визуализации данных',
    seoDescription: 'Бесплатные генераторы столбчатых, линейных, круговых, точечных, heatmap, Gantt, waterfall, Sankey, treemap, свечных, пузырьковых и продвинутых графиков.',
    intro: 'Начните с истории, которую нужно показать, затем выберите семейство графиков: сравнение, тренд, иерархия, поток, время или статистическое распределение.',
    summary: 'Кластер группирует 42 генератора графиков по задачам визуального анализа.',
    ctaLabel: 'Открыть хаб графиков',
    relatedLinksTitle: 'Связанные маршруты графиков',
    toolCountLabel: 'инструментов',
    workflow: copyByWorkflowFallback('ru'),
  },
  ar: {
    eyebrow: 'مركز سير عمل المخططات',
    h1: 'مولدات المخططات وأدوات تصور البيانات',
    title: 'مولدات المخططات وأدوات تصور البيانات',
    description: 'مركز لاختيار مولد المخططات المناسب للتقارير ولوحات المعلومات والتحليلات والعروض وسرد البيانات.',
    seoTitle: 'مولدات المخططات وأدوات تصور البيانات',
    seoDescription: 'مولدات مجانية للأعمدة والخطوط والدائرية والتشتت والخرائط الحرارية و Gantt و waterfall و Sankey و treemap والشموع والفقاعات والتصورات المتقدمة.',
    intro: 'ابدأ بالقصة التي تريد عرضها ثم اختر عائلة المخطط: مقارنة أو اتجاه أو تسلسل أو تدفق أو وقت أو توزيع إحصائي.',
    summary: 'ينظم هذا المركز 42 مولدا للمخططات حسب مهمة التحليل البصري.',
    ctaLabel: 'افتح مركز المخططات',
    relatedLinksTitle: 'مسارات مخططات مرتبطة',
    toolCountLabel: 'أداة',
    workflow: copyByWorkflowFallback('ar'),
  },
};

function copyByWorkflowFallback(_locale: Locale): ChartToolClusterCopy['workflow'] {
  return {
    title: 'Chart workflow',
    items: [
      { label: 'Compare', text: 'Use bar, pie, radar, stacked, and mixed charts to compare categories or contribution.', slugs: ['bar-chart-generator', 'pie-chart-generator', 'radar-chart-generator', 'stacked-bar-chart-generator'] },
      { label: 'Trend', text: 'Use line, area, step, calendar heatmap, and timeline views for change over time.', slugs: ['line-chart-generator', 'area-chart-generator', 'step-line-chart-generator', 'timeline-chart-generator'] },
      { label: 'Explain', text: 'Use funnels, waterfalls, Sankey, treemaps, and graph charts to explain flow or structure.', slugs: ['funnel-chart-generator', 'waterfall-chart-generator', 'sankey-chart-generator', 'treemap-chart-generator'] },
      { label: 'Analyze', text: 'Use scatter, bubble, boxplot, parallel, and heatmap charts for deeper statistical patterns.', slugs: ['scatter-chart-generator', 'bubble-chart-generator', 'boxplot-chart-generator', 'parallel-chart-generator'] },
    ],
  };
}

export function getChartToolClusterCopy(locale: Locale): ChartToolClusterCopy {
  return copyByLocale[locale] ?? copyByLocale.en;
}

export function buildChartToolClusterItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[] = chartToolClusterSlugs
): ChartToolClusterItem[] {
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

export function buildChartToolClusterGroups(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ChartToolClusterGroup[] {
  const copy = groupCopy[locale] ?? groupCopy.en;

  return groupSlugs.map((group) => ({
    id: group.id,
    title: copy[group.id].title,
    description: copy[group.id].description,
    tools: buildChartToolClusterItems(locale, categoryNames, toolNames, toolDescriptions, group.slugs),
  }));
}

export function buildChartToolClusterGroupForTool(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): ChartToolClusterGroup | null {
  const groupId = getChartToolClusterGroupIdForSlug(slug);
  if (!groupId) {
    return null;
  }

  return buildChartToolClusterGroups(locale, categoryNames, toolNames, toolDescriptions)
    .find((group) => group.id === groupId) ?? null;
}

export function buildChartToolClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: ChartToolClusterGroup[]
): Record<string, unknown> {
  const toolsForList = groups.flatMap((group) => group.tools);

  return {
    name: getChartToolClusterCopy(locale).title,
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

export function buildChartToolClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: ChartToolClusterGroup[]
): Record<string, unknown> {
  const copy = getChartToolClusterCopy(locale);

  return {
    name: copy.title,
    description: copy.seoDescription,
    url: buildLocalizedPageUrl(baseUrl, locale, chartToolClusterPath),
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
