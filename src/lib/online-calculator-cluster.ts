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

export const onlineCalculatorClusterPath = '/tools/online-calculators';

export const onlineCalculatorClusterSlugs = [
  'currency-converter',
  'roi-calculator',
  'stock-average-calculator',
  'stock-profit-calculator',
  'dividend-yield-calculator',
  'market-cap-calculator',
  'cagr-calculator',
  'position-size-calculator',
  'mortgage-calculator',
  'tax-calculator',
  'iban-validator',
  'vat-calculator',
  'inflation-calculator',
  'break-even-calculator',
  'margin-calculator',
  'markup-calculator',
  'financial-forecast-calculator',
  'debt-snowball-calculator',
  'paypal-fee-calculator',
  'etsy-fee-calculator',
  'freelance-rate-calculator',
  'savings-goal-calculator',
  'salary-calculator',
  'loan-calculator',
  'compound-interest-calculator',
  'tip-calculator',
  'discount-calculator',
  'percentage-calculator',
  'statistics-calculator',
  'scientific-calculator',
  'base-calculator',
  'binary-calculator',
  'hex-calculator',
  'fraction-calculator',
  'percentage-change-calculator',
  'unit-price-calculator',
  'chmod-calculator',
  'crc32-calculator',
  'concrete-calculator',
  'paint-calculator',
  'tile-calculator',
  'aspect-ratio-calculator-enhanced',
  'pixel-density-calculator',
  'dpi-calculator',
  'gpa-calculator',
  'download-time-calculator',
  'reading-time-calculator',
  'date-calculator',
  'file-size-calculator',
  'time-calculator',
  'cidr-calculator',
  'ip-subnet-calculator',
  'subnet-calculator-enhanced',
  'bandwidth-calculator',
  'data-transfer-calculator',
  'business-days-calculator',
  'project-estimation-calculator',
  'sprint-velocity-calculator',
  'typing-time-calculator',
  'screen-time-calculator',
  'bmi-calculator',
  'age-calculator',
  'calorie-calculator',
  'water-intake-calculator',
  'sleep-calculator',
  'due-date-calculator',
  'countdown-days-calculator',
  'fuel-cost-calculator',
  'electricity-cost-calculator',
  'pace-calculator',
  'carbon-footprint-calculator',
  'calorie-deficit-calculator',
  'macro-calculator',
  'one-rep-max-calculator',
  'ring-size-calculator',
  'bra-size-calculator',
  'love-calculator',
] as const;

export type OnlineCalculatorClusterItem = ToolClusterItem;

export type OnlineCalculatorClusterGroup = ToolClusterGroup<
  'finance-business' | 'math-engineering' | 'time-network-work' | 'health-home-life'
>;

export type OnlineCalculatorClusterCopy = ToolClusterCopy;

const groupSlugs: Array<{
  id: OnlineCalculatorClusterGroup['id'];
  slugs: string[];
}> = [
  {
    id: 'finance-business',
    slugs: [
      'currency-converter',
      'roi-calculator',
      'stock-average-calculator',
      'stock-profit-calculator',
      'dividend-yield-calculator',
      'market-cap-calculator',
      'cagr-calculator',
      'position-size-calculator',
      'mortgage-calculator',
      'tax-calculator',
      'iban-validator',
      'vat-calculator',
      'inflation-calculator',
      'break-even-calculator',
      'margin-calculator',
      'markup-calculator',
      'financial-forecast-calculator',
      'debt-snowball-calculator',
      'paypal-fee-calculator',
      'etsy-fee-calculator',
      'freelance-rate-calculator',
      'savings-goal-calculator',
      'salary-calculator',
      'loan-calculator',
      'compound-interest-calculator',
      'tip-calculator',
      'discount-calculator',
    ],
  },
  {
    id: 'math-engineering',
    slugs: [
      'percentage-calculator',
      'statistics-calculator',
      'scientific-calculator',
      'base-calculator',
      'binary-calculator',
      'hex-calculator',
      'fraction-calculator',
      'percentage-change-calculator',
      'unit-price-calculator',
      'chmod-calculator',
      'crc32-calculator',
      'concrete-calculator',
      'paint-calculator',
      'tile-calculator',
      'aspect-ratio-calculator-enhanced',
      'pixel-density-calculator',
      'dpi-calculator',
      'gpa-calculator',
      'download-time-calculator',
    ],
  },
  {
    id: 'time-network-work',
    slugs: [
      'reading-time-calculator',
      'date-calculator',
      'file-size-calculator',
      'time-calculator',
      'cidr-calculator',
      'ip-subnet-calculator',
      'subnet-calculator-enhanced',
      'bandwidth-calculator',
      'data-transfer-calculator',
      'business-days-calculator',
      'project-estimation-calculator',
      'sprint-velocity-calculator',
      'typing-time-calculator',
      'screen-time-calculator',
    ],
  },
  {
    id: 'health-home-life',
    slugs: [
      'bmi-calculator',
      'age-calculator',
      'calorie-calculator',
      'water-intake-calculator',
      'sleep-calculator',
      'due-date-calculator',
      'countdown-days-calculator',
      'fuel-cost-calculator',
      'electricity-cost-calculator',
      'pace-calculator',
      'carbon-footprint-calculator',
      'calorie-deficit-calculator',
      'macro-calculator',
      'one-rep-max-calculator',
      'ring-size-calculator',
      'bra-size-calculator',
      'love-calculator',
    ],
  },
];

const onlineCalculatorClusterSlugSet = createClusterSlugSet(onlineCalculatorClusterSlugs);

export function isOnlineCalculatorClusterSlug(slug: string): boolean {
  return onlineCalculatorClusterSlugSet.has(slug);
}

export function getOnlineCalculatorClusterGroupIdForSlug(
  slug: string
): OnlineCalculatorClusterGroup['id'] | null {
  return factoryGetGroupIdForSlug(groupSlugs, slug);
}

const groupCopy: Record<
  Locale,
  Record<OnlineCalculatorClusterGroup['id'], { title: string; description: string }>
> = {
  en: {
    'finance-business': { title: 'Finance & Business Calculators', description: 'Plan money, pricing, taxes, investments, fees, debt payoff, savings goals, and freelance rates.' },
    'math-engineering': { title: 'Math, Engineering & Units', description: 'Handle percentages, statistics, scientific math, bases, fractions, materials, pixels, DPI, GPA, and downloads.' },
    'time-network-work': { title: 'Time, Network & Work Planning', description: 'Estimate reading time, dates, file sizes, subnets, bandwidth, data transfer, business days, projects, and sprints.' },
    'health-home-life': { title: 'Health, Home & Lifestyle', description: 'Calculate calories, macros, sleep, due dates, fuel, electricity, pace, carbon footprint, sizes, and personal milestones.' },
  },
  zh: {
    'finance-business': { title: '财务与商业计算器', description: '计算资金、定价、税费、投资、手续费、债务还款、储蓄目标和自由职业费率。' },
    'math-engineering': { title: '数学、工程与单位', description: '处理百分比、统计、科学计算、进制、分数、材料、像素、DPI、GPA 和下载时间。' },
    'time-network-work': { title: '时间、网络与项目规划', description: '估算阅读时间、日期、文件大小、子网、带宽、数据传输、工作日、项目和冲刺。' },
    'health-home-life': { title: '健康、家居与生活', description: '计算热量、宏量营养、睡眠、预产期、燃油、电费、配速、碳足迹、尺码和个人里程碑。' },
  },
  ja: {
    'finance-business': { title: '金融・ビジネス計算', description: '資金、価格、税金、投資、手数料、返済、貯蓄目標、フリーランス単価を計算します。' },
    'math-engineering': { title: '数学・工学・単位', description: '割合、統計、科学計算、基数、分数、材料、ピクセル、DPI、GPA、ダウンロード時間を扱います。' },
    'time-network-work': { title: '時間・ネットワーク・仕事計画', description: '読了時間、日付、ファイルサイズ、サブネット、帯域、転送量、営業日、プロジェクト、スプリントを見積もります。' },
    'health-home-life': { title: '健康・家庭・生活', description: 'カロリー、マクロ、睡眠、予定日、燃料、電気代、ペース、炭素量、サイズ、記念日を計算します。' },
  },
  ko: {
    'finance-business': { title: '금융 및 비즈니스 계산기', description: '자금, 가격, 세금, 투자, 수수료, 부채 상환, 저축 목표, 프리랜서 요율을 계산합니다.' },
    'math-engineering': { title: '수학, 공학 및 단위', description: '백분율, 통계, 과학 계산, 진법, 분수, 자재, 픽셀, DPI, GPA, 다운로드 시간을 다룹니다.' },
    'time-network-work': { title: '시간, 네트워크 및 업무 계획', description: '읽기 시간, 날짜, 파일 크기, 서브넷, 대역폭, 데이터 전송, 영업일, 프로젝트, 스프린트를 추정합니다.' },
    'health-home-life': { title: '건강, 가정 및 생활', description: '칼로리, 매크로, 수면, 출산 예정일, 연료, 전기, 페이스, 탄소 발자국, 사이즈, 기념일을 계산합니다.' },
  },
  es: {
    'finance-business': { title: 'Calculadoras de Finanzas y Negocio', description: 'Planifica dinero, precios, impuestos, inversiones, comisiones, deuda, ahorro y tarifas freelance.' },
    'math-engineering': { title: 'Matematicas, Ingenieria y Unidades', description: 'Calcula porcentajes, estadistica, ciencia, bases, fracciones, materiales, pixeles, DPI, GPA y descargas.' },
    'time-network-work': { title: 'Tiempo, Red y Planificacion', description: 'Estima lectura, fechas, tamanos de archivo, subredes, ancho de banda, transferencia, dias habiles y sprints.' },
    'health-home-life': { title: 'Salud, Hogar y Vida', description: 'Calcula calorias, macros, sueno, embarazo, combustible, electricidad, ritmo, carbono, tallas e hitos.' },
  },
  pt: {
    'finance-business': { title: 'Calculadoras Financeiras e de Negocio', description: 'Planeje dinheiro, precos, impostos, investimentos, taxas, dividas, metas e valores freelance.' },
    'math-engineering': { title: 'Matematica, Engenharia e Unidades', description: 'Calcule porcentagens, estatistica, ciencia, bases, fracoes, materiais, pixels, DPI, GPA e downloads.' },
    'time-network-work': { title: 'Tempo, Rede e Planejamento', description: 'Estime leitura, datas, tamanho de arquivo, sub-redes, largura de banda, transferencia, dias uteis e sprints.' },
    'health-home-life': { title: 'Saude, Casa e Vida', description: 'Calcule calorias, macros, sono, gravidez, combustivel, eletricidade, ritmo, carbono, tamanhos e marcos.' },
  },
  fr: {
    'finance-business': { title: 'Calculateurs Finance et Business', description: 'Planifiez argent, prix, impots, placements, frais, dettes, objectifs d epargne et tarifs freelance.' },
    'math-engineering': { title: 'Mathematiques, Ingenierie et Unites', description: 'Calculez pourcentages, statistiques, science, bases, fractions, materiaux, pixels, DPI, GPA et telechargements.' },
    'time-network-work': { title: 'Temps, Reseau et Planification', description: 'Estimez lecture, dates, taille de fichier, sous-reseaux, bande passante, transfert, jours ouvrables et sprints.' },
    'health-home-life': { title: 'Sante, Maison et Vie', description: 'Calculez calories, macros, sommeil, grossesse, carburant, electricite, allure, carbone, tailles et jalons.' },
  },
  de: {
    'finance-business': { title: 'Finanz- und Business-Rechner', description: 'Planen Sie Geld, Preise, Steuern, Investments, Gebuhren, Schuldentilgung, Sparziele und Freelance-Raten.' },
    'math-engineering': { title: 'Mathe, Engineering und Einheiten', description: 'Berechnen Sie Prozente, Statistik, wissenschaftliche Werte, Basen, Bruchteile, Material, Pixel, DPI, GPA und Downloads.' },
    'time-network-work': { title: 'Zeit, Netzwerk und Arbeitsplanung', description: 'Schätzen Sie Lesezeit, Daten, Dateigrößen, Subnetze, Bandbreite, Transfer, Arbeitstage, Projekte und Sprints.' },
    'health-home-life': { title: 'Gesundheit, Zuhause und Alltag', description: 'Berechnen Sie Kalorien, Makros, Schlaf, Geburtstermin, Kraftstoff, Strom, Tempo, CO2, Größen und Meilensteine.' },
  },
  ru: {
    'finance-business': { title: 'Финансовые и бизнес-калькуляторы', description: 'Считайте деньги, цены, налоги, инвестиции, комиссии, долги, цели накоплений и ставки фриланса.' },
    'math-engineering': { title: 'Математика, инженерия и единицы', description: 'Работайте с процентами, статистикой, научными вычислениями, системами счисления, дробями, материалами, пикселями, DPI, GPA и загрузками.' },
    'time-network-work': { title: 'Время, сеть и планирование', description: 'Оценивайте время чтения, даты, размеры файлов, подсети, пропускную способность, передачу данных, рабочие дни и спринты.' },
    'health-home-life': { title: 'Здоровье, дом и жизнь', description: 'Считайте калории, макро, сон, дату родов, топливо, электричество, темп, углерод, размеры и личные даты.' },
  },
  ar: {
    'finance-business': { title: 'حاسبات المال والأعمال', description: 'احسب المال والتسعير والضرائب والاستثمار والرسوم وسداد الديون وأهداف الادخار وأسعار العمل الحر.' },
    'math-engineering': { title: 'الرياضيات والهندسة والوحدات', description: 'تعامل مع النسب والإحصاء والحساب العلمي والأنظمة والكسور والمواد والبكسل و DPI و GPA والتنزيلات.' },
    'time-network-work': { title: 'الوقت والشبكات وتخطيط العمل', description: 'قدّر وقت القراءة والتواريخ وحجم الملفات والشبكات الفرعية والنطاق والنقل وأيام العمل والمشاريع والسبرنت.' },
    'health-home-life': { title: 'الصحة والمنزل والحياة', description: 'احسب السعرات والماكرو والنوم وموعد الولادة والوقود والكهرباء والوتيرة والكربون والمقاسات والمناسبات.' },
  },
};

const copyByLocale: Record<Locale, OnlineCalculatorClusterCopy> = {
  en: {
    eyebrow: 'Calculator workflow hub',
    h1: 'Online Calculators for Finance, Math, Work & Daily Life',
    title: 'Online Calculators for Finance, Math, Work & Daily Life',
    description: 'A focused hub for choosing the right free online calculator for money, math, time, networking, projects, health, home, and everyday planning.',
    seoTitle: 'Online Calculators for Finance, Math, Work & Daily Life',
    seoDescription: 'Free online calculators for finance, mortgage, tax, ROI, percentage, statistics, scientific math, subnet, bandwidth, file size, dates, calories, BMI, fuel cost, electricity, and project planning.',
    intro: 'Start with the decision you need to make, then choose the calculator family that matches the inputs: money, math, time, network capacity, health, home, or project planning.',
    summary: 'The cluster organizes calculator tools by real-world decision so users can move from a question to an answer without hunting across multiple categories.',
    ctaLabel: 'Open calculator hub',
    relatedLinksTitle: 'Related calculator routes',
    toolCountLabel: 'tools',
    workflow: workflowFallback(),
  },
  zh: {
    eyebrow: '计算器工作流中心',
    h1: '财务、数学、工作与日常生活在线计算器',
    title: '财务、数学、工作与日常生活在线计算器',
    description: '集中选择免费的在线计算器，覆盖资金、数学、时间、网络、项目、健康、家居和日常规划。',
    seoTitle: '财务、数学、工作与日常生活在线计算器',
    seoDescription: '免费在线计算器集合，覆盖财务、房贷、税费、ROI、百分比、统计、科学计算、子网、带宽、文件大小、日期、热量、BMI、燃油、电费和项目规划。',
    intro: '先明确要做的决策，再选择对应的计算器类型：资金、数学、时间、网络容量、健康、家居或项目规划。',
    summary: '这个专题按真实问题组织计算器，让用户不用在多个分类间寻找，也能快速从问题走到答案。',
    ctaLabel: '打开计算器专题',
    relatedLinksTitle: '相关计算器入口',
    toolCountLabel: '个工具',
    workflow: {
      title: '计算器工作流',
      items: [
        { label: '资金', text: '计算投资、房贷、税费、手续费、利润率、储蓄目标和现金流。', slugs: ['mortgage-calculator', 'tax-calculator', 'roi-calculator', 'savings-goal-calculator'] },
        { label: '数学', text: '处理百分比、统计、科学计算、进制、分数、材料和像素参数。', slugs: ['percentage-calculator', 'statistics-calculator', 'scientific-calculator', 'fraction-calculator'] },
        { label: '时间', text: '估算日期、阅读时间、工作日、项目工期、冲刺速度和下载时间。', slugs: ['date-calculator', 'business-days-calculator', 'project-estimation-calculator', 'download-time-calculator'] },
        { label: '生活', text: '规划热量、BMI、睡眠、预产期、燃油、电费、配速和日常成本。', slugs: ['calorie-calculator', 'bmi-calculator', 'sleep-calculator', 'fuel-cost-calculator'] },
      ],
    },
  },
  ja: {
    eyebrow: '計算ワークフロー hub',
    h1: '金融・数学・仕事・生活のオンライン計算ツール',
    title: '金融・数学・仕事・生活のオンライン計算ツール',
    description: 'お金、数学、時間、ネットワーク、プロジェクト、健康、家庭、日常計画に合う無料計算ツールを選べます。',
    seoTitle: '金融・数学・仕事・生活のオンライン計算ツール',
    seoDescription: '金融、住宅ローン、税金、ROI、割合、統計、科学計算、サブネット、帯域、ファイルサイズ、日付、カロリー、BMI、燃料費、電気代、プロジェクト計画の無料計算ツール。',
    intro: '必要な判断から始め、入力に合う計算カテゴリを選びます: お金、数学、時間、ネットワーク、健康、家庭、プロジェクト。',
    summary: '実際の判断ごとに計算ツールを整理し、複数カテゴリを探し回らず答えに進めます。',
    ctaLabel: '計算 hub を開く',
    relatedLinksTitle: '関連計算ルート',
    toolCountLabel: 'ツール',
    workflow: workflowFallback(),
  },
  ko: {
    eyebrow: '계산기 워크플로 허브',
    h1: '금융, 수학, 업무 및 일상 온라인 계산기',
    title: '금융, 수학, 업무 및 일상 온라인 계산기',
    description: '돈, 수학, 시간, 네트워크, 프로젝트, 건강, 집, 일상 계획에 맞는 무료 온라인 계산기 허브입니다.',
    seoTitle: '금융, 수학, 업무 및 일상 온라인 계산기',
    seoDescription: '금융, 모기지, 세금, ROI, 백분율, 통계, 과학 계산, 서브넷, 대역폭, 파일 크기, 날짜, 칼로리, BMI, 연료비, 전기요금, 프로젝트 계획 무료 계산기.',
    intro: '해야 할 결정을 먼저 보고 돈, 수학, 시간, 네트워크 용량, 건강, 집, 프로젝트 계획 중 맞는 계산기를 고릅니다.',
    summary: '실제 의사결정 기준으로 계산기를 묶어 여러 카테고리를 오가지 않고 답을 찾게 합니다.',
    ctaLabel: '계산기 허브 열기',
    relatedLinksTitle: '관련 계산기 경로',
    toolCountLabel: '도구',
    workflow: workflowFallback(),
  },
  es: {
    eyebrow: 'Hub de calculadoras',
    h1: 'Calculadoras Online para Finanzas, Matematicas, Trabajo y Vida',
    title: 'Calculadoras Online para Finanzas, Matematicas, Trabajo y Vida',
    description: 'Un hub para elegir calculadoras gratis de dinero, matematicas, tiempo, red, proyectos, salud, hogar y planificacion diaria.',
    seoTitle: 'Calculadoras Online para Finanzas, Matematicas, Trabajo y Vida',
    seoDescription: 'Calculadoras gratis de finanzas, hipoteca, impuestos, ROI, porcentaje, estadistica, matematica cientifica, subnet, ancho de banda, archivos, fechas, calorias, BMI, combustible, electricidad y proyectos.',
    intro: 'Empieza por la decision y elige la familia de calculadora segun las entradas: dinero, matematicas, tiempo, red, salud, hogar o proyectos.',
    summary: 'El cluster organiza calculadoras por decision real para pasar de pregunta a respuesta sin saltar entre categorias.',
    ctaLabel: 'Abrir hub de calculadoras',
    relatedLinksTitle: 'Rutas de calculadoras relacionadas',
    toolCountLabel: 'herramientas',
    workflow: workflowFallback(),
  },
  pt: {
    eyebrow: 'Hub de calculadoras',
    h1: 'Calculadoras Online para Financas, Matematica, Trabalho e Vida',
    title: 'Calculadoras Online para Financas, Matematica, Trabalho e Vida',
    description: 'Um hub para escolher calculadoras gratis de dinheiro, matematica, tempo, rede, projetos, saude, casa e planejamento diario.',
    seoTitle: 'Calculadoras Online para Financas, Matematica, Trabalho e Vida',
    seoDescription: 'Calculadoras gratis de financas, hipoteca, impostos, ROI, porcentagem, estatistica, matematica cientifica, subnet, largura de banda, arquivos, datas, calorias, BMI, combustivel, eletricidade e projetos.',
    intro: 'Comece pela decisao e escolha a familia de calculadora conforme os dados: dinheiro, matematica, tempo, rede, saude, casa ou projetos.',
    summary: 'O cluster organiza calculadoras por decisao real para ir da pergunta a resposta sem trocar de categorias.',
    ctaLabel: 'Abrir hub de calculadoras',
    relatedLinksTitle: 'Rotas de calculadoras relacionadas',
    toolCountLabel: 'ferramentas',
    workflow: workflowFallback(),
  },
  fr: {
    eyebrow: 'Hub calculateurs',
    h1: 'Calculateurs en Ligne pour Finance, Maths, Travail et Vie',
    title: 'Calculateurs en Ligne pour Finance, Maths, Travail et Vie',
    description: 'Un hub pour choisir des calculateurs gratuits pour argent, maths, temps, reseau, projets, sante, maison et planning.',
    seoTitle: 'Calculateurs en Ligne pour Finance, Maths, Travail et Vie',
    seoDescription: 'Calculateurs gratuits finance, pret, impots, ROI, pourcentage, statistique, calcul scientifique, subnet, bande passante, fichiers, dates, calories, BMI, carburant, electricite et projets.',
    intro: 'Partez de la decision a prendre puis choisissez la famille selon les entrees: argent, maths, temps, reseau, sante, maison ou projet.',
    summary: 'Le cluster organise les calculateurs par decision reelle pour passer d une question a une reponse sans changer de categorie.',
    ctaLabel: 'Ouvrir le hub calculateurs',
    relatedLinksTitle: 'Parcours calculateurs associes',
    toolCountLabel: 'outils',
    workflow: workflowFallback(),
  },
  de: {
    eyebrow: 'Rechner-Workflow-Hub',
    h1: 'Online-Rechner fur Finanzen, Mathe, Arbeit und Alltag',
    title: 'Online-Rechner fur Finanzen, Mathe, Arbeit und Alltag',
    description: 'Ein Hub fur kostenlose Rechner zu Geld, Mathe, Zeit, Netzwerk, Projekten, Gesundheit, Zuhause und Alltagsplanung.',
    seoTitle: 'Online-Rechner fur Finanzen, Mathe, Arbeit und Alltag',
    seoDescription: 'Kostenlose Online-Rechner fur Finanzen, Hypothek, Steuern, ROI, Prozent, Statistik, wissenschaftliche Mathematik, Subnetze, Bandbreite, Dateien, Daten, Kalorien, BMI, Kraftstoff, Strom und Projekte.',
    intro: 'Starten Sie mit der Entscheidung und wahlen Sie die passende Rechnerfamilie: Geld, Mathe, Zeit, Netzwerk, Gesundheit, Zuhause oder Projekte.',
    summary: 'Der Cluster ordnet Rechner nach realen Entscheidungen, damit Nutzer von der Frage zur Antwort kommen.',
    ctaLabel: 'Rechner-Hub offnen',
    relatedLinksTitle: 'Verwandte Rechner-Routen',
    toolCountLabel: 'Tools',
    workflow: workflowFallback(),
  },
  ru: {
    eyebrow: 'Центр онлайн-калькуляторов',
    h1: 'Онлайн-калькуляторы для финансов, математики, работы и жизни',
    title: 'Онлайн-калькуляторы для финансов, математики, работы и жизни',
    description: 'Хаб бесплатных калькуляторов для денег, математики, времени, сетей, проектов, здоровья, дома и повседневного планирования.',
    seoTitle: 'Онлайн-калькуляторы для финансов, математики, работы и жизни',
    seoDescription: 'Бесплатные онлайн-калькуляторы для финансов, ипотеки, налогов, ROI, процентов, статистики, научных расчетов, subnet, bandwidth, файлов, дат, калорий, BMI, топлива, электричества и проектов.',
    intro: 'Начните с решения, которое нужно принять, затем выберите семью калькуляторов: деньги, математика, время, сеть, здоровье, дом или проект.',
    summary: 'Кластер группирует калькуляторы по реальным решениям, чтобы быстрее перейти от вопроса к ответу.',
    ctaLabel: 'Открыть хаб калькуляторов',
    relatedLinksTitle: 'Связанные маршруты калькуляторов',
    toolCountLabel: 'инструментов',
    workflow: workflowFallback(),
  },
  ar: {
    eyebrow: 'مركز الحاسبات',
    h1: 'حاسبات أونلاين للمال والرياضيات والعمل والحياة',
    title: 'حاسبات أونلاين للمال والرياضيات والعمل والحياة',
    description: 'مركز لاختيار حاسبات مجانية للمال والرياضيات والوقت والشبكات والمشاريع والصحة والمنزل والتخطيط اليومي.',
    seoTitle: 'حاسبات أونلاين للمال والرياضيات والعمل والحياة',
    seoDescription: 'حاسبات مجانية للمال والرهن والضرائب و ROI والنسب والإحصاء والحساب العلمي والشبكات والنطاق والملفات والتواريخ والسعرات و BMI والوقود والكهرباء والمشاريع.',
    intro: 'ابدأ بالقرار المطلوب ثم اختر عائلة الحاسبة حسب المدخلات: مال أو رياضيات أو وقت أو شبكة أو صحة أو منزل أو مشروع.',
    summary: 'ينظم هذا المركز الحاسبات حسب القرار الحقيقي حتى ينتقل المستخدم من السؤال إلى الإجابة بسرعة.',
    ctaLabel: 'افتح مركز الحاسبات',
    relatedLinksTitle: 'مسارات حاسبات مرتبطة',
    toolCountLabel: 'أداة',
    workflow: workflowFallback(),
  },
};

function workflowFallback(): OnlineCalculatorClusterCopy['workflow'] {
  return {
    title: 'Calculator workflow',
    items: [
      { label: 'Money', text: 'Estimate returns, mortgage payments, taxes, fees, margins, savings goals, and cash-flow decisions.', slugs: ['mortgage-calculator', 'tax-calculator', 'roi-calculator', 'savings-goal-calculator'] },
      { label: 'Math', text: 'Handle percentages, statistics, scientific notation, number bases, fractions, materials, and pixel dimensions.', slugs: ['percentage-calculator', 'statistics-calculator', 'scientific-calculator', 'fraction-calculator'] },
      { label: 'Time', text: 'Estimate dates, reading time, business days, project duration, sprint velocity, and download windows.', slugs: ['date-calculator', 'business-days-calculator', 'project-estimation-calculator', 'download-time-calculator'] },
      { label: 'Life', text: 'Plan calories, BMI, sleep, due dates, fuel cost, electricity use, pace, and daily household decisions.', slugs: ['calorie-calculator', 'bmi-calculator', 'sleep-calculator', 'fuel-cost-calculator'] },
    ],
  };
}

export function getOnlineCalculatorClusterCopy(locale: Locale): OnlineCalculatorClusterCopy {
  return resolveClusterCopy(copyByLocale, locale);
}

export function buildOnlineCalculatorClusterItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[] = onlineCalculatorClusterSlugs
): OnlineCalculatorClusterItem[] {
  return factoryBuildItems(locale, categoryNames, toolNames, toolDescriptions, slugs);
}

export function buildOnlineCalculatorClusterGroups(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): OnlineCalculatorClusterGroup[] {
  return factoryBuildGroups(locale, categoryNames, toolNames, toolDescriptions, groupSlugs, groupCopy);
}

export function buildOnlineCalculatorClusterGroupForTool(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): OnlineCalculatorClusterGroup | null {
  return factoryBuildGroupForTool(locale, slug, categoryNames, toolNames, toolDescriptions, groupSlugs, groupCopy);
}

export function buildOnlineCalculatorClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: OnlineCalculatorClusterGroup[]
): Record<string, unknown> {
  return factoryBuildItemList(baseUrl, locale, groups, getOnlineCalculatorClusterCopy(locale).title);
}

export function buildOnlineCalculatorClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: OnlineCalculatorClusterGroup[]
): Record<string, unknown> {
  return factoryBuildCollectionData(baseUrl, locale, groups, onlineCalculatorClusterPath, getOnlineCalculatorClusterCopy(locale));
}
