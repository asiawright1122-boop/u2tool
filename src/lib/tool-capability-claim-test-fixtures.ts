import type { Locale } from "./i18n";

type LocalizedTerms = Record<Locale, string>;

function terms(
  en: string,
  zh: string,
  ja: string,
  ko: string,
  es: string,
  pt: string,
  fr: string,
  de: string,
  ru: string,
  ar: string,
): LocalizedTerms {
  return { en, zh, ja, ko, es, pt, fr, de, ru, ar };
}

export const localizedClaimTerms: Record<string, LocalizedTerms> = {
  "grammar-checker-native-non-english-claim": terms(
    "Russian grammar", "中文语法", "日本語の文法", "한국어 문법",
    "gramática española", "gramática em português", "grammaire française",
    "deutsche Grammatik", "русскую грамматику", "قواعد اللغة العربية",
  ),
  "grammar-checker-ai-claim": terms(
    "AI grammar checking", "人工智能语法检查", "人工知能による文法チェック",
    "인공지능 문법 검사", "corrección con IA", "correção com IA",
    "correction avec IA", "Grammatikprüfung mit KI", "проверку грамматики с ИИ",
    "تدقيق القواعد بالذكاء الاصطناعي",
  ),
  "grammar-checker-server-processing-claim": terms(
    "cloud-based grammar processing", "云端语法处理", "クラウドでの文法処理",
    "클라우드 문법 처리", "procesamiento gramatical en la nube",
    "processamento gramatical na nuvem", "traitement cloud",
    "Grammatikverarbeitung in der Cloud", "облачную обработку грамматики",
    "معالجة القواعد في السحابة",
  ),
  "hex-editor-disassembly-claim": terms(
    "binary disassembly", "二进制反汇编", "バイナリ逆アセンブル", "바이너리 디스어셈블",
    "desensamblado binario", "desmontagem binária", "désassemblage binaire",
    "Binär-Disassembler", "дизассемблирование бинарных файлов", "فك تجميع الملفات الثنائية",
  ),
  "hex-editor-remote-file-claim": terms(
    "remote files from a URL", "从 URL 打开远程文件", "URL からリモートファイル", "URL 원격 파일",
    "archivos remotos desde una URL", "arquivos remotos de uma URL", "fichiers distants depuis une URL",
    "Remote-Dateien von einer URL", "удалённые файлы по URL", "ملفات بعيدة من رابط",
  ),
  "hex-editor-executable-analysis-claim": terms(
    "executable analysis", "可执行文件分析", "実行ファイル解析", "실행 파일 분석",
    "análisis de ejecutables", "análise de executáveis", "analyse des exécutables",
    "Analyse ausführbarer Dateien", "анализ исполняемых файлов", "تحليل الملفات التنفيذية",
  ),
  "hex-editor-professional-reverse-engineering-claim": terms(
    "a professional reverse-engineering suite", "专业逆向工程套件", "プロ向けリバースエンジニアリング", "전문 리버스 엔지니어링",
    "una suite profesional de ingeniería inversa", "uma suíte profissional de engenharia reversa", "une suite professionnelle de rétro-ingénierie",
    "eine professionelle Reverse-Engineering-Suite", "профессиональный комплекс реверс-инжиниринга", "حزمة احترافية للهندسة العكسية",
  ),
  "hex-editor-grid-claim": terms(
    "open local files and display an offset grid", "打开本地文件并显示偏移网格",
    "ローカルファイルを開いてオフセットグリッドを表示",
    "로컬 파일을 열고 오프셋 그리드를 표시", "abre archivos y muestra una cuadrícula de offsets",
    "abre arquivos e mostra uma grade de offsets", "ouvrir des fichiers et afficher une grille d’offsets",
    "öffnet lokale Dateien und zeigt ein Offset-Raster", "открывает файлы и показывает сетку смещений",
    "يفتح الملفات ويعرض شبكة الإزاحات",
  ),
  "hex-editor-byte-edit-claim": terms(
    "edit individual bytes directly", "直接编辑字节", "バイトを直接編集",
    "바이트를 직접 편집", "editar bytes directamente", "editar bytes diretamente",
    "éditer directement des octets", "Bytes direkt bearbeiten", "редактировать байты напрямую",
    "تحرير البايتات مباشرة",
  ),
  "hex-editor-unsupported-encoding-claim": terms(
    "UTF-16 encoding", "UTF-16 编码", "UTF-16 エンコーディング", "UTF-16 인코딩",
    "codificación UTF-16", "codificação UTF-16", "encodage UTF-16",
    "UTF-16-Kodierung", "кодировку UTF-16", "ترميز UTF-16",
  ),
  "hex-editor-file-export-claim": terms(
    "export binary files", "导出二进制文件", "バイナリファイルをエクスポート",
    "바이너리 파일 내보내기", "exportar archivos binarios", "exportar arquivos binários",
    "exporter des fichiers binaires", "exportiert Binärdateien", "экспортирует бинарные файлы",
    "تصدير الملفات الثنائية",
  ),
  "sql-optimizer-database-selector-claim": terms(
    "a database selector", "数据库选择器", "データベース選択", "데이터베이스 선택기",
    "un selector de base de datos", "um seletor de banco de dados",
    "un sélecteur de base de données", "eine Datenbankauswahl", "выбор базы данных",
    "اختيار قاعدة البيانات",
  ),
  "sql-optimizer-explain-claim": terms(
    "parse EXPLAIN execution plans", "解析 EXPLAIN 执行计划", "EXPLAIN 実行計画を解析",
    "EXPLAIN 실행 계획 분석", "analizar planes de ejecución EXPLAIN",
    "analisar planos de execução EXPLAIN", "analyser les plans d’exécution EXPLAIN",
    "EXPLAIN-Ausführungspläne analysieren", "анализировать планы выполнения EXPLAIN",
    "تحليل خطط التنفيذ EXPLAIN",
  ),
  "sql-optimizer-connection-claim": terms(
    "connect to a live database", "连接实时数据库", "ライブデータベースへ接続",
    "실시간 데이터베이스 연결", "conectar a una base de datos activa",
    "conectar a um banco de dados ativo", "se connecter à une base de données active",
    "eine Live-Datenbankverbindung", "подключаться к рабочей базе данных",
    "الاتصال بقاعدة بيانات مباشرة",
  ),
  "sql-optimizer-execution-claim": terms(
    "execute SQL queries", "执行 SQL 查询", "SQLクエリを実行", "SQL 쿼리 실행",
    "ejecutar consultas SQL", "executar consultas SQL", "exécuter des requêtes SQL",
    "führt SQL-Abfragen aus", "выполняет SQL-запросы", "ينفذ استعلامات SQL",
  ),
  "sql-optimizer-speed-guarantee-claim": terms(
    "guarantee faster query performance", "保证查询性能更快", "クエリ性能の高速化を保証",
    "더 빠른 쿼리 성능을 보장", "garantizar un rendimiento más rápido",
    "garante desempenho mais rápido", "garantit des performances plus rapides",
    "garantiert schnellere Abfrageleistung", "гарантирует более быструю производительность",
    "يضمن أداء أسرع للاستعلامات",
  ),
  "excel-viewer-macro-claim": terms(
    "Excel macros", "Excel 宏", "Excelマクロ", "Excel 매크로", "macros de Excel",
    "macros do Excel", "macros Excel", "Excel-Makros", "макросы Excel", "وحدات الماكرو في Excel",
  ),
  "excel-viewer-formula-recalculation-claim": terms(
    "recalculate Excel formulas", "重新计算公式", "数式を再計算", "수식을 다시 계산",
    "recalcular fórmulas", "recalcular fórmulas", "recalculer les formules",
    "berechnet Formeln neu", "пересчитывать формулы", "إعادة حساب الصيغ",
  ),
  "excel-viewer-chart-claim": terms(
    "display Excel charts", "显示 Excel 图表", "Excelグラフを表示", "Excel 차트 표시",
    "mostrar gráficos de Excel", "mostrar gráficos do Excel", "afficher les graphiques Excel",
    "Excel-Diagramme anzeigen", "показывать диаграммы Excel", "عرض مخططات Excel",
  ),
  "excel-viewer-formatting-fidelity-claim": terms(
    "preserve full formatting", "保留完整格式", "完全な書式を保持", "전체 서식 보존",
    "conservar el formato completo", "preservar a formatação completa",
    "conserver la mise en forme complète", "vollständige Formatierung bewahren",
    "полное форматирование", "الحفاظ على التنسيق الكامل",
  ),
  "excel-viewer-export-claim": terms(
    "export the Excel workbook", "导出 Excel 工作簿", "Excelワークブックをエクスポート",
    "Excel 통합 문서 내보내기", "exportar el libro de Excel", "exportar a pasta do Excel",
    "exporter le classeur Excel", "exportiert die Excel-Arbeitsmappe",
    "экспортирует книгу Excel", "تصدير مصنف Excel",
  ),
  "excel-viewer-advanced-filter-claim": terms(
    "advanced regex filters", "正则表达式高级筛选", "正規表現の高度なフィルター",
    "정규식 고급 필터", "filtros avanzados con expresiones regulares",
    "filtros avançados com expressões regulares", "filtres avancés avec expressions régulières",
    "erweiterte Regex-Filter", "расширенные фильтры с регулярными выражениями",
    "تصفية متقدمة بتعبيرات منتظمة",
  ),
  "excel-viewer-multi-sort-claim": terms(
    "hierarchical sorting", "分层排序", "階層ソート", "계층 정렬", "ordenación jerárquica",
    "ordenação hierárquica", "tri hiérarchique", "hierarchische Sortierung",
    "иерархическую сортировку", "فرز هرمي",
  ),
  "typing-speed-test-fixed-timer-claim": terms(
    "a fixed timer", "固定计时器", "固定タイマー", "고정 타이머", "un temporizador fijo",
    "um temporizador fixo", "un minuteur fixe", "einen festen Timer", "фиксированный таймер",
    "مؤقت ثابت",
  ),
  "typing-speed-test-cpm-claim": terms(
    "CPM characters per minute", "CPM 每分钟字符", "CPM 1分あたりの文字数",
    "CPM 분당 문자", "CPM caracteres por minuto", "CPM caracteres por minuto",
    "CPM caractères par minute", "CPM Zeichen pro Minute", "CPM символы в минуту",
    "CPM الأحرف في الدقيقة",
  ),
  "typing-speed-test-consistency-claim": terms(
    "a consistency score", "一致性分数", "一貫性スコア", "일관성 점수",
    "una puntuación de consistencia", "uma pontuação de consistência",
    "un score de régularité", "einen Konsistenzwert", "оценка стабильности", "درجة الاتساق",
  ),
  "typing-speed-test-history-claim": terms(
    "typing history", "打字历史", "入力履歴", "타이핑 기록", "historial de escritura",
    "histórico de digitação", "historique de frappe", "Tippverlauf", "историю набора", "سجل الكتابة",
  ),
  "typing-speed-test-account-claim": terms(
    "user accounts", "用户账户", "ユーザーアカウント", "사용자 계정", "cuentas de usuario",
    "contas de usuário", "comptes utilisateur", "Benutzerkonten", "учётные записи", "حسابات المستخدم",
  ),
  "typing-speed-test-ranking-claim": terms(
    "a global leaderboard", "全球排行榜", "世界ランキング", "글로벌 리더보드",
    "una clasificación global", "um ranking global", "un classement mondial",
    "eine Weltrangliste", "глобальный рейтинг", "التصنيف العالمي",
  ),
  "typing-speed-test-certificate-claim": terms(
    "a typing certificate", "打字证书", "タイピング証明書", "타이핑 인증서",
    "un certificado de mecanografía", "um certificado de digitação",
    "un certificat de frappe", "ein Tippzertifikat", "сертификат скорости печати", "شهادة كتابة",
  ),
  "gantt-generator-dependencies-claim": terms(
    "task dependencies", "任务依赖", "タスク依存関係", "작업 종속성",
    "dependencias entre tareas", "dependências entre tarefas", "dépendances entre tâches",
    "Aufgabenabhängigkeiten", "зависимости задач", "تبعيات المهام",
  ),
  "gantt-generator-milestones-claim": terms(
    "project milestones", "项目里程碑", "プロジェクトマイルストーン", "프로젝트 마일스톤",
    "hitos del proyecto", "marcos do projeto", "jalons du projet", "Projektmeilensteine",
    "вехи проекта", "معالم المشروع",
  ),
  "gantt-generator-critical-path-claim": terms(
    "the critical path", "关键路径", "クリティカルパス", "주요 경로", "la ruta crítica",
    "o caminho crítico", "le chemin critique", "kritischer Pfad", "критический путь", "المسار الحرج",
  ),
  "gantt-generator-persistence-claim": terms(
    "save project charts", "保存项目图表", "チャート保存", "프로젝트 차트 저장",
    "guarda diagramas del proyecto", "salva gráficos do projeto", "enregistre diagrammes",
    "speichert Diagramme", "сохраняет диаграммы проекта", "يحفظ المخططات",
  ),
  "gantt-generator-data-transfer-claim": terms(
    "import project data", "导入项目数据", "プロジェクトデータをインポート", "프로젝트 데이터 가져오기",
    "importa datos del proyecto", "importa dados do projeto", "importe les données du projet",
    "importiert Projektdaten", "импортирует данные проекта", "يستورد بيانات المشروع",
  ),
  "gantt-generator-collaboration-claim": terms(
    "real-time collaboration", "实时协作", "リアルタイム共同作業", "실시간 협업",
    "colaboración en tiempo real", "colaboração em tempo real", "collaboration en temps réel",
    "Echtzeit-Zusammenarbeit", "совместная работа в реальном времени", "تعاون في الوقت الفعلي",
  ),
};

const affirmativeFrames: Record<Locale, (term: string) => string> = {
  en: (term) => `Supports ${term}.`,
  zh: (term) => `支持${term}。`,
  ja: (term) => `${term}に対応します。`,
  ko: (term) => `${term}을 지원합니다.`,
  es: (term) => `Admite ${term}.`,
  pt: (term) => `Suporta ${term}.`,
  fr: (term) => `Prend en charge ${term}.`,
  de: (term) => `Unterstützt ${term}.`,
  ru: (term) => `Поддерживает ${term}.`,
  ar: (term) => `يدعم ${term}.`,
};

const limitationFrames: Record<Locale, (term: string) => string> = {
  en: (term) => `Does not support ${term}.`,
  zh: (term) => `不支持${term}。`,
  ja: (term) => `${term}には対応しません。`,
  ko: (term) => `${term}을 지원하지 않습니다.`,
  es: (term) => `No admite ${term}.`,
  pt: (term) => `Não suporta ${term}.`,
  fr: (term) => `Ne prend pas en charge ${term}.`,
  de: (term) => `Unterstützt keine Funktion für ${term}.`,
  ru: (term) => `Не поддерживает ${term}.`,
  ar: (term) => `لا يدعم ${term}.`,
};

export function affirmativeClaimFixture(
  code: string,
  locale: Locale,
): string {
  return affirmativeFrames[locale](localizedClaimTerms[code][locale]);
}

export function limitationClaimFixture(
  code: string,
  locale: Locale,
): string {
  return limitationFrames[locale](localizedClaimTerms[code][locale]);
}
