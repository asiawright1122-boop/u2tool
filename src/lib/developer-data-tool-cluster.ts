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
import type { ToolClusterCopy, ToolClusterGroup, ToolClusterItem } from './tool-cluster-types';

export const developerDataToolClusterPath = '/tools/developer-data-formatters';

export const developerDataToolClusterSlugs = [
  'json-formatter',
  'json-viewer',
  'json-sorter',
  'json-minifier',
  'xml-formatter',
  'yaml-formatter',
  'graphql-formatter',
  'sql-formatter',
  'css-beautifier',
  'js-beautifier',
  'python-formatter',
  'go-formatter',
  'rust-formatter',
  'api-response-formatter',
  'json-to-csv',
  'csv-to-json',
  'json-to-yaml',
  'yaml-json',
  'json-to-xml',
  'xml-to-json',
  'json-to-typescript',
  'json-to-go',
  'json-to-java',
  'json-to-python',
  'json-to-csharp',
  'json-to-zod',
  'typescript-to-json',
  'json-to-table',
  'json-to-protobuf-converter',
  'ical-parser',
  'ics-file-generator',
  'json-path-tester',
  'json-path-finder',
  'json-schema-validator',
  'json-schema-generator',
  'yaml-validator',
  'xml-validator',
  'regex-tester',
  'regex-generator',
  'regex-visualizer',
  'regex-escape',
  'json-diff',
  'json-merger',
  'json-flattener',
  'base64',
  'html-encoder',
  'html-entity',
  'string-escape',
  'json-escape',
  'unicode-converter',
  'text-to-binary',
  'binary-to-text',
  'text-to-hex',
  'hex-base64-converter',
  'data-uri',
  'jwt-decoder',
  'curl-converter',
  'curl-to-code-generator',
  'request-header-builder',
] as const;

export type DeveloperDataToolClusterItem = ToolClusterItem;

export type DeveloperDataToolClusterGroup = ToolClusterGroup<
  'format-minify' | 'convert-models' | 'validate-query' | 'encode-api'
>;

export type DeveloperDataToolClusterCopy = ToolClusterCopy;

const groupSlugs: Array<{
  id: DeveloperDataToolClusterGroup['id'];
  slugs: string[];
}> = [
  {
    id: 'format-minify',
    slugs: [
      'json-formatter',
      'json-viewer',
      'json-sorter',
      'json-minifier',
      'xml-formatter',
      'yaml-formatter',
      'graphql-formatter',
      'sql-formatter',
      'css-beautifier',
      'js-beautifier',
      'python-formatter',
      'go-formatter',
      'rust-formatter',
      'api-response-formatter',
    ],
  },
  {
    id: 'convert-models',
    slugs: [
      'json-to-csv',
      'csv-to-json',
      'json-to-yaml',
      'yaml-json',
      'json-to-xml',
      'xml-to-json',
      'json-to-typescript',
      'json-to-go',
      'json-to-java',
      'json-to-python',
      'json-to-csharp',
      'json-to-zod',
      'typescript-to-json',
      'json-to-table',
      'json-to-protobuf-converter',
      'ical-parser',
      'ics-file-generator',
    ],
  },
  {
    id: 'validate-query',
    slugs: [
      'json-path-tester',
      'json-path-finder',
      'json-schema-validator',
      'json-schema-generator',
      'yaml-validator',
      'xml-validator',
      'regex-tester',
      'regex-generator',
      'regex-visualizer',
      'regex-escape',
      'json-diff',
      'json-merger',
      'json-flattener',
    ],
  },
  {
    id: 'encode-api',
    slugs: [
      'base64',
      'html-encoder',
      'html-entity',
      'string-escape',
      'json-escape',
      'unicode-converter',
      'text-to-binary',
      'binary-to-text',
      'text-to-hex',
      'hex-base64-converter',
      'data-uri',
      'jwt-decoder',
      'curl-converter',
      'curl-to-code-generator',
      'request-header-builder',
    ],
  },
];

const developerDataToolClusterSlugSet = createClusterSlugSet(developerDataToolClusterSlugs);

export function isDeveloperDataToolClusterSlug(slug: string): boolean {
  return developerDataToolClusterSlugSet.has(slug);
}

export function getDeveloperDataToolClusterGroupIdForSlug(
  slug: string
): DeveloperDataToolClusterGroup['id'] | null {
  return factoryGetGroupIdForSlug(groupSlugs, slug);
}

const groupCopy: Record<
  Locale,
  Record<DeveloperDataToolClusterGroup['id'], { title: string; description: string }>
> = {
  en: {
    'format-minify': { title: 'Format, Beautify & Minify', description: 'Clean JSON, XML, YAML, GraphQL, SQL, CSS, JavaScript, Python, Go, Rust, and API responses.' },
    'convert-models': { title: 'Convert Data & Models', description: 'Move JSON, CSV, YAML, XML, TypeScript, language models, tables, calendar exports, and protobuf-ready data between formats.' },
    'validate-query': { title: 'Validate, Query & Compare', description: 'Test JSONPath, schemas, YAML, XML, regex patterns, diffs, merges, and flattened data structures.' },
    'encode-api': { title: 'Encode, Escape & API Transport', description: 'Prepare Base64, HTML entities, escaped strings, Unicode, binary, hex, Data URI, JWT, curl, and request headers.' },
  },
  zh: {
    'format-minify': { title: '格式化、美化与压缩', description: '整理 JSON、XML、YAML、GraphQL、SQL、CSS、JavaScript、Python、Go、Rust 和 API 响应。' },
    'convert-models': { title: '数据与模型转换', description: '在 JSON、CSV、YAML、XML、TypeScript、语言模型、表格、日历导出和 protobuf 数据之间转换。' },
    'validate-query': { title: '校验、查询与对比', description: '测试 JSONPath、Schema、YAML、XML、正则、差异、合并和平铺结构。' },
    'encode-api': { title: '编码、转义与 API 传输', description: '处理 Base64、HTML 实体、字符串转义、Unicode、二进制、十六进制、Data URI、JWT、curl 和请求头。' },
  },
  ja: {
    'format-minify': { title: '整形・整列・圧縮', description: 'JSON、XML、YAML、GraphQL、SQL、CSS、JavaScript、Python、Go、Rust、API レスポンスを整えます。' },
    'convert-models': { title: 'データとモデル変換', description: 'JSON、CSV、YAML、XML、TypeScript、各言語モデル、テーブル、カレンダーエクスポート、protobuf 向けデータを変換します。' },
    'validate-query': { title: '検証・クエリ・比較', description: 'JSONPath、スキーマ、YAML、XML、正規表現、差分、マージ、フラット化を確認します。' },
    'encode-api': { title: 'エンコード・エスケープ・API 転送', description: 'Base64、HTML エンティティ、文字列エスケープ、Unicode、binary、hex、Data URI、JWT、curl、ヘッダーを準備します。' },
  },
  ko: {
    'format-minify': { title: '포맷, 정리 및 압축', description: 'JSON, XML, YAML, GraphQL, SQL, CSS, JavaScript, Python, Go, Rust, API 응답을 정리합니다.' },
    'convert-models': { title: '데이터 및 모델 변환', description: 'JSON, CSV, YAML, XML, TypeScript, 언어 모델, 테이블, 캘린더 내보내기, protobuf용 데이터를 변환합니다.' },
    'validate-query': { title: '검증, 쿼리 및 비교', description: 'JSONPath, 스키마, YAML, XML, 정규식, diff, merge, flatten 구조를 테스트합니다.' },
    'encode-api': { title: '인코딩, 이스케이프 및 API 전송', description: 'Base64, HTML 엔티티, 문자열 이스케이프, Unicode, binary, hex, Data URI, JWT, curl, 헤더를 준비합니다.' },
  },
  es: {
    'format-minify': { title: 'Formatear, Embellecer y Minificar', description: 'Limpia JSON, XML, YAML, GraphQL, SQL, CSS, JavaScript, Python, Go, Rust y respuestas API.' },
    'convert-models': { title: 'Convertir Datos y Modelos', description: 'Convierte JSON, CSV, YAML, XML, TypeScript, modelos de lenguaje, tablas, exportaciones de calendario y datos para protobuf.' },
    'validate-query': { title: 'Validar, Consultar y Comparar', description: 'Prueba JSONPath, schemas, YAML, XML, regex, diffs, merges y estructuras aplanadas.' },
    'encode-api': { title: 'Codificar, Escapar y Transportar API', description: 'Prepara Base64, entidades HTML, escapes, Unicode, binario, hex, Data URI, JWT, curl y headers.' },
  },
  pt: {
    'format-minify': { title: 'Formatar, Embelezar e Minificar', description: 'Limpe JSON, XML, YAML, GraphQL, SQL, CSS, JavaScript, Python, Go, Rust e respostas API.' },
    'convert-models': { title: 'Converter Dados e Modelos', description: 'Converta JSON, CSV, YAML, XML, TypeScript, modelos de linguagem, tabelas, exportacoes de calendario e dados para protobuf.' },
    'validate-query': { title: 'Validar, Consultar e Comparar', description: 'Teste JSONPath, schemas, YAML, XML, regex, diffs, merges e estruturas achatadas.' },
    'encode-api': { title: 'Codificar, Escapar e Transportar API', description: 'Prepare Base64, entidades HTML, escapes, Unicode, binario, hex, Data URI, JWT, curl e headers.' },
  },
  fr: {
    'format-minify': { title: 'Formater, Embellir et Minifier', description: 'Nettoyez JSON, XML, YAML, GraphQL, SQL, CSS, JavaScript, Python, Go, Rust et reponses API.' },
    'convert-models': { title: 'Convertir Donnees et Modeles', description: 'Convertissez JSON, CSV, YAML, XML, TypeScript, modeles de langage, tableaux, exports de calendrier et donnees protobuf.' },
    'validate-query': { title: 'Valider, Interroger et Comparer', description: 'Testez JSONPath, schemas, YAML, XML, regex, diffs, merges et structures aplaties.' },
    'encode-api': { title: 'Encoder, Echaper et Transport API', description: 'Preparez Base64, entites HTML, echappements, Unicode, binaire, hex, Data URI, JWT, curl et headers.' },
  },
  de: {
    'format-minify': { title: 'Formatieren, Beautify und Minify', description: 'Bereinigen Sie JSON, XML, YAML, GraphQL, SQL, CSS, JavaScript, Python, Go, Rust und API-Antworten.' },
    'convert-models': { title: 'Daten und Modelle Konvertieren', description: 'Konvertieren Sie JSON, CSV, YAML, XML, TypeScript, Sprachmodelle, Tabellen, Kalender-Exporte und protobuf-Daten.' },
    'validate-query': { title: 'Validieren, Abfragen und Vergleichen', description: 'Testen Sie JSONPath, Schemas, YAML, XML, Regex, Diffs, Merges und flache Datenstrukturen.' },
    'encode-api': { title: 'Codieren, Escapen und API-Transport', description: 'Bereiten Sie Base64, HTML-Entities, Escapes, Unicode, Binary, Hex, Data URI, JWT, curl und Header vor.' },
  },
  ru: {
    'format-minify': { title: 'Форматирование, beautify и minify', description: 'Очищайте JSON, XML, YAML, GraphQL, SQL, CSS, JavaScript, Python, Go, Rust и ответы API.' },
    'convert-models': { title: 'Конвертация данных и моделей', description: 'Преобразуйте JSON, CSV, YAML, XML, TypeScript, модели языков, таблицы, экспорт календаря и данные для protobuf.' },
    'validate-query': { title: 'Проверка, запросы и сравнение', description: 'Тестируйте JSONPath, схемы, YAML, XML, regex, diff, merge и плоские структуры.' },
    'encode-api': { title: 'Кодирование, экранирование и API', description: 'Готовьте Base64, HTML entities, escapes, Unicode, binary, hex, Data URI, JWT, curl и заголовки.' },
  },
  ar: {
    'format-minify': { title: 'تنسيق وتجميل وتصغير', description: 'نظف JSON و XML و YAML و GraphQL و SQL و CSS و JavaScript و Python و Go و Rust واستجابات API.' },
    'convert-models': { title: 'تحويل البيانات والنماذج', description: 'حوّل JSON و CSV و YAML و XML و TypeScript والنماذج والجداول وتصدير التقويم وبيانات protobuf.' },
    'validate-query': { title: 'تحقق واستعلام ومقارنة', description: 'اختبر JSONPath و schemas و YAML و XML و regex والفروقات والدمج والبنى المسطحة.' },
    'encode-api': { title: 'ترميز وتهريب ونقل API', description: 'جهز Base64 و HTML entities والتهريب و Unicode والثنائي و hex و Data URI و JWT و curl والرؤوس.' },
  },
};

const copyByLocale: Record<Locale, DeveloperDataToolClusterCopy> = {
  en: {
    eyebrow: 'Developer data workflow hub',
    h1: 'Developer Data Formatters, Converters & Validators',
    title: 'Developer Data Formatters, Converters & Validators',
    description: 'A focused hub for JSON, XML, YAML, SQL, regex, API, encoding, and schema workflows that developers repeat every day.',
    seoTitle: 'Developer Data Formatters, Converters & Validators',
    seoDescription: 'Free developer data tools for JSON formatter, XML formatter, YAML formatter, SQL formatter, JSON to TypeScript, CSV to JSON, regex testing, schema validation, Base64, JWT, curl, and API request workflows.',
    intro: 'Start with the shape of the data, then choose whether you need to format it, convert it, validate it, query it, encode it, or prepare it for an API call.',
    summary: 'The cluster organizes developer utilities by the actual data job: clean the payload, convert the model, validate the structure, or prepare transport-safe API text.',
    ctaLabel: 'Open developer data hub',
    relatedLinksTitle: 'Related developer routes',
    toolCountLabel: 'tools',
    workflow: workflowFallback(),
  },
  zh: {
    eyebrow: '开发者数据工作流中心',
    h1: '开发者数据格式化、转换与校验工具',
    title: '开发者数据格式化、转换与校验工具',
    description: '面向 JSON、XML、YAML、SQL、正则、API、编码和 Schema 的高频开发者工具中心。',
    seoTitle: '开发者数据格式化、转换与校验工具',
    seoDescription: '免费的开发者数据工具集合，覆盖 JSON 格式化、XML 格式化、YAML 格式化、SQL 格式化、JSON 转 TypeScript、CSV 转 JSON、正则测试、Schema 校验、Base64、JWT、curl 和 API 请求工作流。',
    intro: '先判断数据形态，再选择格式化、转换、校验、查询、编码，或准备 API 请求所需的安全文本。',
    summary: '这个专题按真实开发任务组织工具：清理 payload、转换模型、校验结构，或准备适合传输的 API 文本。',
    ctaLabel: '打开开发者数据专题',
    relatedLinksTitle: '相关开发者入口',
    toolCountLabel: '个工具',
    workflow: {
      title: '开发者数据工作流',
      items: [
        { label: '清理', text: '格式化、排序、压缩 JSON/XML/YAML/SQL/API 响应，让数据先变得可读。', slugs: ['json-formatter', 'xml-formatter', 'yaml-formatter', 'sql-formatter'] },
        { label: '转换', text: '把 JSON、CSV、YAML、XML 和类型模型转换到当前代码库需要的格式。', slugs: ['json-to-typescript', 'json-to-csv', 'csv-to-json', 'json-to-zod'] },
        { label: '校验', text: '用 JSONPath、Schema、YAML/XML 校验和正则工具检查结构、路径和模式。', slugs: ['json-path-tester', 'json-schema-validator', 'yaml-validator', 'regex-tester'] },
        { label: '传输', text: '编码、转义、解码 JWT、转换 curl，并生成 API 请求头。', slugs: ['base64', 'html-encoder', 'jwt-decoder', 'curl-to-code-generator'] },
      ],
    },
  },
  ja: {
    eyebrow: '開発者データワークフロー hub',
    h1: '開発者向けデータ整形・変換・検証ツール',
    title: '開発者向けデータ整形・変換・検証ツール',
    description: 'JSON、XML、YAML、SQL、regex、API、encoding、schema の日常ワークフローをまとめた hub です。',
    seoTitle: '開発者向けデータ整形・変換・検証ツール',
    seoDescription: 'JSON formatter、XML formatter、YAML formatter、SQL formatter、JSON to TypeScript、CSV to JSON、regex、schema、Base64、JWT、curl、API request 向け無料ツール。',
    intro: 'データの形から始め、整形、変換、検証、クエリ、エンコード、API 送信用テキストの準備を選びます。',
    summary: 'payload の整理、モデル変換、構造検証、API 送信用テキスト準備をタスク別に整理しています。',
    ctaLabel: 'データ hub を開く',
    relatedLinksTitle: '関連開発者ルート',
    toolCountLabel: 'ツール',
    workflow: workflowFallback(),
  },
  ko: {
    eyebrow: '개발자 데이터 워크플로 허브',
    h1: '개발자 데이터 포맷터, 변환기 및 검증 도구',
    title: '개발자 데이터 포맷터, 변환기 및 검증 도구',
    description: 'JSON, XML, YAML, SQL, regex, API, encoding, schema 작업을 한곳에 모은 개발자 허브입니다.',
    seoTitle: '개발자 데이터 포맷터, 변환기 및 검증 도구',
    seoDescription: 'JSON formatter, XML formatter, YAML formatter, SQL formatter, JSON to TypeScript, CSV to JSON, regex, schema, Base64, JWT, curl, API request 무료 도구.',
    intro: '데이터 형태를 먼저 보고 포맷, 변환, 검증, 쿼리, 인코딩, API 전송 준비 중 필요한 작업을 고릅니다.',
    summary: 'payload 정리, 모델 변환, 구조 검증, API 전송 텍스트 준비를 실제 개발 작업 기준으로 묶었습니다.',
    ctaLabel: '데이터 허브 열기',
    relatedLinksTitle: '관련 개발자 경로',
    toolCountLabel: '도구',
    workflow: workflowFallback(),
  },
  es: {
    eyebrow: 'Hub de datos para desarrolladores',
    h1: 'Formatters, Convertidores y Validadores de Datos',
    title: 'Formatters, Convertidores y Validadores de Datos',
    description: 'Un hub para flujos diarios de JSON, XML, YAML, SQL, regex, API, encoding y schemas.',
    seoTitle: 'Formatters, Convertidores y Validadores de Datos',
    seoDescription: 'Herramientas gratis para JSON formatter, XML formatter, YAML formatter, SQL formatter, JSON to TypeScript, CSV to JSON, regex, schema, Base64, JWT, curl y API request.',
    intro: 'Empieza por la forma del dato y elige si debes formatear, convertir, validar, consultar, codificar o preparar texto para una API.',
    summary: 'El cluster organiza utilidades por trabajo real: limpiar payloads, convertir modelos, validar estructuras o preparar texto seguro para transporte.',
    ctaLabel: 'Abrir hub de datos',
    relatedLinksTitle: 'Rutas developer relacionadas',
    toolCountLabel: 'herramientas',
    workflow: workflowFallback(),
  },
  pt: {
    eyebrow: 'Hub de dados para devs',
    h1: 'Formatadores, Conversores e Validadores de Dados',
    title: 'Formatadores, Conversores e Validadores de Dados',
    description: 'Um hub para fluxos diarios de JSON, XML, YAML, SQL, regex, API, encoding e schemas.',
    seoTitle: 'Formatadores, Conversores e Validadores de Dados',
    seoDescription: 'Ferramentas gratis para JSON formatter, XML formatter, YAML formatter, SQL formatter, JSON to TypeScript, CSV to JSON, regex, schema, Base64, JWT, curl e API request.',
    intro: 'Comece pelo formato do dado e escolha formatar, converter, validar, consultar, codificar ou preparar texto para API.',
    summary: 'O cluster organiza utilitarios por trabalho real: limpar payloads, converter modelos, validar estrutura ou preparar texto seguro para transporte.',
    ctaLabel: 'Abrir hub de dados',
    relatedLinksTitle: 'Rotas dev relacionadas',
    toolCountLabel: 'ferramentas',
    workflow: workflowFallback(),
  },
  fr: {
    eyebrow: 'Hub donnees developpeur',
    h1: 'Formatters, Convertisseurs et Validateurs de Donnees',
    title: 'Formatters, Convertisseurs et Validateurs de Donnees',
    description: 'Un hub pour les workflows JSON, XML, YAML, SQL, regex, API, encodage et schemas.',
    seoTitle: 'Formatters, Convertisseurs et Validateurs de Donnees',
    seoDescription: 'Outils gratuits pour JSON formatter, XML formatter, YAML formatter, SQL formatter, JSON to TypeScript, CSV to JSON, regex, schema, Base64, JWT, curl et API request.',
    intro: 'Partez de la forme de la donnee, puis choisissez formatage, conversion, validation, requete, encodage ou preparation API.',
    summary: 'Le cluster organise les utilitaires par tache : nettoyer un payload, convertir un modele, valider une structure ou preparer du texte transportable.',
    ctaLabel: 'Ouvrir le hub donnees',
    relatedLinksTitle: 'Parcours developpeur associes',
    toolCountLabel: 'outils',
    workflow: workflowFallback(),
  },
  de: {
    eyebrow: 'Developer-Data-Workflow-Hub',
    h1: 'Developer Data Formatter, Converter und Validatoren',
    title: 'Developer Data Formatter, Converter und Validatoren',
    description: 'Ein Hub fur JSON, XML, YAML, SQL, Regex, API, Encoding und Schema-Workflows im Entwickleralltag.',
    seoTitle: 'Developer Data Formatter, Converter und Validatoren',
    seoDescription: 'Kostenlose Developer-Data-Tools fur JSON formatter, XML formatter, YAML formatter, SQL formatter, JSON to TypeScript, CSV to JSON, regex, schema, Base64, JWT, curl und API requests.',
    intro: 'Starten Sie mit der Datenform und wahlen Sie Formatieren, Konvertieren, Validieren, Abfragen, Codieren oder API-Transport.',
    summary: 'Der Cluster ordnet Entwickler-Utilities nach Aufgabe: Payload bereinigen, Modell konvertieren, Struktur validieren oder API-sicheren Text vorbereiten.',
    ctaLabel: 'Data-Hub offnen',
    relatedLinksTitle: 'Verwandte Developer-Routen',
    toolCountLabel: 'Tools',
    workflow: workflowFallback(),
  },
  ru: {
    eyebrow: 'Хаб данных для разработчиков',
    h1: 'Форматтеры, конвертеры и валидаторы данных',
    title: 'Форматтеры, конвертеры и валидаторы данных',
    description: 'Хаб для ежедневных задач JSON, XML, YAML, SQL, regex, API, encoding и schema.',
    seoTitle: 'Форматтеры, конвертеры и валидаторы данных',
    seoDescription: 'Бесплатные инструменты для JSON formatter, XML formatter, YAML formatter, SQL formatter, JSON to TypeScript, CSV to JSON, regex, schema, Base64, JWT, curl и API request.',
    intro: 'Начните с формы данных и выберите форматирование, конвертацию, проверку, запрос, кодирование или подготовку API-текста.',
    summary: 'Кластер группирует утилиты по задаче: очистить payload, преобразовать модель, проверить структуру или подготовить текст для передачи.',
    ctaLabel: 'Открыть хаб данных',
    relatedLinksTitle: 'Связанные developer маршруты',
    toolCountLabel: 'инструментов',
    workflow: workflowFallback(),
  },
  ar: {
    eyebrow: 'مركز بيانات المطورين',
    h1: 'أدوات تنسيق وتحويل والتحقق من بيانات المطورين',
    title: 'أدوات تنسيق وتحويل والتحقق من بيانات المطورين',
    description: 'مركز لمهام JSON و XML و YAML و SQL و regex و API و encoding و schema اليومية.',
    seoTitle: 'أدوات تنسيق وتحويل والتحقق من بيانات المطورين',
    seoDescription: 'أدوات مجانية للمطورين تشمل JSON formatter و XML formatter و YAML formatter و SQL formatter و JSON to TypeScript و CSV to JSON و regex و schema و Base64 و JWT و curl و API request.',
    intro: 'ابدأ بشكل البيانات ثم اختر التنسيق أو التحويل أو التحقق أو الاستعلام أو الترميز أو تجهيز نص آمن لطلب API.',
    summary: 'ينظم هذا المركز الأدوات حسب المهمة: تنظيف payload أو تحويل النموذج أو التحقق من البنية أو تجهيز نص قابل للنقل.',
    ctaLabel: 'افتح مركز البيانات',
    relatedLinksTitle: 'مسارات مطورين مرتبطة',
    toolCountLabel: 'أداة',
    workflow: workflowFallback(),
  },
};

function workflowFallback(): DeveloperDataToolClusterCopy['workflow'] {
  return {
    title: 'Developer data workflow',
    items: [
      { label: 'Clean', text: 'Format, sort, minify, and inspect JSON, XML, YAML, SQL, and API responses before you debug.', slugs: ['json-formatter', 'xml-formatter', 'yaml-formatter', 'sql-formatter'] },
      { label: 'Convert', text: 'Move JSON, CSV, YAML, XML, tables, and typed models into the format your codebase needs.', slugs: ['json-to-typescript', 'json-to-csv', 'csv-to-json', 'json-to-zod'] },
      { label: 'Validate', text: 'Use JSONPath, schema validators, YAML/XML checks, and regex utilities to catch broken structure.', slugs: ['json-path-tester', 'json-schema-validator', 'yaml-validator', 'regex-tester'] },
      { label: 'Transport', text: 'Encode, escape, decode JWTs, convert curl, and prepare API headers for requests.', slugs: ['base64', 'html-encoder', 'jwt-decoder', 'curl-to-code-generator'] },
    ],
  };
}

export function getDeveloperDataToolClusterCopy(locale: Locale): DeveloperDataToolClusterCopy {
  return resolveClusterCopy(copyByLocale, locale);
}

export function buildDeveloperDataToolClusterItems(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>,
  slugs: readonly string[] = developerDataToolClusterSlugs
): DeveloperDataToolClusterItem[] {
  return factoryBuildItems(locale, categoryNames, toolNames, toolDescriptions, slugs);
}

export function buildDeveloperDataToolClusterGroups(
  locale: Locale,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): DeveloperDataToolClusterGroup[] {
  return factoryBuildGroups(locale, categoryNames, toolNames, toolDescriptions, groupSlugs, groupCopy);
}

export function buildDeveloperDataToolClusterGroupForTool(
  locale: Locale,
  slug: string,
  categoryNames: Record<string, string>,
  toolNames: Record<string, string>,
  toolDescriptions: Record<string, string>
): DeveloperDataToolClusterGroup | null {
  return factoryBuildGroupForTool(locale, slug, categoryNames, toolNames, toolDescriptions, groupSlugs, groupCopy);
}

export function buildDeveloperDataToolClusterItemList(
  baseUrl: string,
  locale: Locale,
  groups: DeveloperDataToolClusterGroup[]
): Record<string, unknown> {
  return factoryBuildItemList(baseUrl, locale, groups, getDeveloperDataToolClusterCopy(locale).title);
}

export function buildDeveloperDataToolClusterCollectionData(
  baseUrl: string,
  locale: Locale,
  groups: DeveloperDataToolClusterGroup[]
): Record<string, unknown> {
  return factoryBuildCollectionData(baseUrl, locale, groups, developerDataToolClusterPath, getDeveloperDataToolClusterCopy(locale));
}
