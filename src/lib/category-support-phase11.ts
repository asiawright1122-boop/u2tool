type PhaseElevenLocale = 'de' | 'en' | 'es' | 'ja' | 'ko' | 'zh';
type PhaseElevenCategory = 'charts' | 'security';

export const phaseElevenPriorityClusters: Array<{ locale: PhaseElevenLocale; category: PhaseElevenCategory }> = [
  { locale: 'en', category: 'security' },
  { locale: 'zh', category: 'security' },
  { locale: 'de', category: 'security' },
  { locale: 'es', category: 'security' },
  { locale: 'ja', category: 'security' },
  { locale: 'ko', category: 'security' },
  { locale: 'en', category: 'charts' },
  { locale: 'zh', category: 'charts' },
  { locale: 'de', category: 'charts' },
  { locale: 'es', category: 'charts' },
  { locale: 'ja', category: 'charts' },
  { locale: 'ko', category: 'charts' },
];

export const phaseElevenSupportContent = {
  de: {
    charts: {
      eyebrow: 'Für die Chart-Wahl nach Datenform',
      title: 'Chart-Generatoren für Trends, Verteilungen, Heatmaps, Flüsse und Zeitpläne',
      intro:
        'Die Charts-Kategorie sollte Besucher nach Datenfrage routen statt nur dutzende Diagrammtypen aufzulisten. So landet jemand schneller bei Balken-, Linien-, Heatmap-, Sankey- oder Gantt-Ansichten.',
      highlightsTitle: 'Wofür diese Kategorie besonders geeignet ist',
      highlights: [
        'Zeitreihen und Kategorien mit Balken-, Linien- und Flächendiagrammen vergleichen.',
        'Anteile, Korrelationen und dichte Matrizen mit Pie-, Scatter- und Heatmap-Charts sichtbar machen.',
        'Flüsse, Hierarchien und Projektpläne mit Sankey-, Treemap- und Gantt-Ansichten abbilden.',
      ],
      workflowsTitle: 'Empfohlene Chart-Routen',
      workflows: [
        {
          title: 'Trends und Vergleiche',
          description: 'Nutze diese Tools, wenn du Entwicklungen über Zeit oder Unterschiede zwischen Kategorien zeigen musst.',
          toolSlugs: ['bar-chart-generator', 'line-chart-generator', 'area-chart-generator'],
        },
        {
          title: 'Verteilungen, Anteile und Korrelationen',
          description: 'Wähle diese Route für Anteile, Streuung und Muster in dichten Datensätzen.',
          toolSlugs: ['pie-chart-generator', 'scatter-chart-generator', 'heatmap-chart-generator'],
        },
        {
          title: 'Flüsse, Hierarchien und Zeitpläne',
          description: 'Öffne diese Tools, wenn Standarddiagramme nicht reichen und du Prozesse oder Projektverläufe zeigen musst.',
          toolSlugs: ['sankey-chart-generator', 'treemap-chart-generator', 'gantt-chart-generator'],
        },
      ],
      noteTitle: 'Intent-Fokus',
      note:
        'Suchanfragen wie Bar Chart Generator, Heatmap Chart Generator und Gantt Chart Maker bleiben nur dann präzise, wenn die Seite nach Datenform statt nach einem endlosen Toolraster sortiert.',
    },
    security: {
      eyebrow: 'Für Passwörter, JWT und Integritätsprüfungen',
      title: 'Sicherheits-Tools für Passwörter, JWT-Debugging, HMAC und Checksums',
      intro:
        'Diese Kategorie wird stark, wenn sie klare Sicherheitsjobs trennt: Passwörter erzeugen, JWT-Claims prüfen, HMAC-Signaturen erstellen oder Checksums verifizieren.',
      highlightsTitle: 'Typische Sicherheitsaufgaben',
      highlights: [
        'Starke Passwörter und Einmalcodes für Testkonten, Admin-Zugänge und interne Freigaben vorbereiten.',
        'JWT-Header und Payloads prüfen, wenn Login-, Session- oder Ablaufprobleme debuggt werden müssen.',
        'Hashes, HMACs und Checksums für Dateien, Releases und Integritätsprüfungen direkt im Browser erzeugen.',
      ],
      workflowsTitle: 'Empfohlene Sicherheitsrouten',
      workflows: [
        {
          title: 'Passwörter und Einmalcodes',
          description: 'Nutze diese Tools für stärkere Zugangsdaten und zeitbasierte Codes im Betrieb, Support oder Staging.',
          toolSlugs: ['password-generator', 'password-strength', 'totp-generator'],
        },
        {
          title: 'JWT-Erstellung und Token-Debugging',
          description: 'Erzeuge Test-Tokens, prüfe JWT-Payloads und analysiere Auth-Probleme ohne die Schritte zu vermischen.',
          toolSlugs: ['jwt-generator', 'jwt-debugger', 'jwt-payload-decoder'],
        },
        {
          title: 'Hash-, HMAC- und Checksum-Prüfung',
          description: 'Öffne diese Route für Integritätschecks, signierte Payloads und technische Freigaben.',
          toolSlugs: ['hash-generator', 'hmac-generator', 'checksum-verifier'],
        },
      ],
      noteTitle: 'Warum das wichtig ist',
      note:
        'Queries wie Passwort Generator, JWT Debugger, HMAC Generator und Checksum Verifier brauchen klar getrennte Routen statt einer vagen Sicherheitsliste.',
    },
  },
  en: {
    charts: {
      eyebrow: 'For chart selection by data shape',
      title: 'Chart generators for trends, distributions, heatmaps, flows, and timelines',
      intro:
        'The charts category should route users by the question their data needs to answer instead of dumping dozens of chart names onto one page. That keeps bar, heatmap, Sankey, and gantt intent precise.',
      highlightsTitle: 'Best-fit chart jobs in this category',
      highlights: [
        'Compare categories or time series with bar, line, and area charts for reports and dashboards.',
        'Show shares, clusters, and dense matrices with pie, scatter, and heatmap charts.',
        'Map flows, hierarchies, and project schedules with Sankey, treemap, and gantt views.',
      ],
      workflowsTitle: 'Recommended chart routes',
      workflows: [
        {
          title: 'Trends and comparisons',
          description: 'Start here when your audience needs to compare categories or see change over time.',
          toolSlugs: ['bar-chart-generator', 'line-chart-generator', 'area-chart-generator'],
        },
        {
          title: 'Distributions, shares, and correlations',
          description: 'Use these charts when you need proportions, patterns, and relationship-heavy datasets.',
          toolSlugs: ['pie-chart-generator', 'scatter-chart-generator', 'heatmap-chart-generator'],
        },
        {
          title: 'Flows, hierarchies, and timelines',
          description: 'Open these tools when a basic comparison chart is not enough for process or planning data.',
          toolSlugs: ['sankey-chart-generator', 'treemap-chart-generator', 'gantt-chart-generator'],
        },
      ],
      noteTitle: 'Why this matters',
      note:
        'Queries like bar chart generator, heatmap chart generator, and gantt chart maker stay relevant when the page routes by data shape instead of acting like a generic chart dump.',
    },
    security: {
      eyebrow: 'For passwords, JWT, and integrity checks',
      title: 'Security tools for passwords, JWT debugging, HMAC signatures, and checksums',
      intro:
        'This category performs best when it separates exact security jobs: generate stronger passwords, inspect JWT claims, create HMAC signatures, or verify checksums before release.',
      highlightsTitle: 'Common security jobs here',
      highlights: [
        'Generate stronger passwords and one-time codes for test accounts, admin access, and internal handoffs.',
        'Inspect JWT headers and payload claims when debugging login, session, and expiry issues.',
        'Create hashes, HMAC signatures, and checksum checks directly in the browser for release and integrity workflows.',
      ],
      workflowsTitle: 'Recommended security routes',
      workflows: [
        {
          title: 'Passwords and one-time codes',
          description: 'Use these tools when you need stronger login secrets or time-based access codes.',
          toolSlugs: ['password-generator', 'password-strength', 'totp-generator'],
        },
        {
          title: 'JWT creation and token debugging',
          description: 'Generate test tokens, inspect JWT payloads, and debug auth flows without mixing those jobs together.',
          toolSlugs: ['jwt-generator', 'jwt-debugger', 'jwt-payload-decoder'],
        },
        {
          title: 'Hash, HMAC, and checksum verification',
          description: 'Choose this route for integrity checks, keyed signatures, and release-asset verification.',
          toolSlugs: ['hash-generator', 'hmac-generator', 'checksum-verifier'],
        },
      ],
      noteTitle: 'Intent focus',
      note:
        'Searches like password generator, JWT debugger, HMAC generator, and checksum verifier need explicit routing instead of a vague security bucket.',
    },
  },
  es: {
    charts: {
      eyebrow: 'Para elegir graficos segun la forma de los datos',
      title: 'Generadores de graficos para tendencias, distribuciones, heatmaps, flujos y cronogramas',
      intro:
        'La categoria de graficos debe guiar por la pregunta que responden los datos, no por una lista plana de nombres. Asi la intencion de barras, heatmap, Sankey o gantt sigue siendo clara.',
      highlightsTitle: 'Trabajos de graficos que encajan aqui',
      highlights: [
        'Comparar categorias o series temporales con graficos de barras, lineas y areas.',
        'Mostrar proporciones, patrones y relaciones con graficos de pastel, dispersion y heatmap.',
        'Representar flujos, jerarquias y planes de proyecto con vistas Sankey, treemap y gantt.',
      ],
      workflowsTitle: 'Rutas recomendadas',
      workflows: [
        {
          title: 'Tendencias y comparaciones',
          description: 'Empieza aqui cuando necesites mostrar cambios en el tiempo o diferencias entre grupos.',
          toolSlugs: ['bar-chart-generator', 'line-chart-generator', 'area-chart-generator'],
        },
        {
          title: 'Distribuciones, proporciones y correlaciones',
          description: 'Usa esta ruta para porcentajes, dispersion y conjuntos de datos con relaciones visibles.',
          toolSlugs: ['pie-chart-generator', 'scatter-chart-generator', 'heatmap-chart-generator'],
        },
        {
          title: 'Flujos, jerarquias y cronogramas',
          description: 'Abre estas herramientas cuando un grafico basico no basta para procesos o planificacion.',
          toolSlugs: ['sankey-chart-generator', 'treemap-chart-generator', 'gantt-chart-generator'],
        },
      ],
      noteTitle: 'Enfoque de intencion',
      note:
        'Busquedas como bar chart generator, heatmap chart generator y gantt chart maker funcionan mejor si la pagina ordena por forma de datos y no por una lista generica.',
    },
    security: {
      eyebrow: 'Para contrasenas, JWT y comprobaciones de integridad',
      title: 'Herramientas de seguridad para contrasenas, JWT, HMAC y checksums',
      intro:
        'Esta categoria rinde mejor cuando separa trabajos concretos: generar contrasenas, revisar claims JWT, crear firmas HMAC o verificar checksums.',
      highlightsTitle: 'Trabajos de seguridad mas comunes',
      highlights: [
        'Preparar contrasenas fuertes y codigos de un solo uso para cuentas de prueba, soporte y accesos internos.',
        'Inspeccionar encabezados y payloads JWT cuando depuras sesiones, login o expiracion de tokens.',
        'Crear hashes, firmas HMAC y checksums desde el navegador para validaciones tecnicas y entregas.',
      ],
      workflowsTitle: 'Rutas de seguridad recomendadas',
      workflows: [
        {
          title: 'Contrasenas y codigos de un solo uso',
          description: 'Usa estas herramientas cuando necesites credenciales mas fuertes o codigos temporales.',
          toolSlugs: ['password-generator', 'password-strength', 'totp-generator'],
        },
        {
          title: 'Creacion de JWT y depuracion de tokens',
          description: 'Genera tokens de prueba, inspecciona payloads JWT y separa mejor los pasos del flujo de autenticacion.',
          toolSlugs: ['jwt-generator', 'jwt-debugger', 'jwt-payload-decoder'],
        },
        {
          title: 'Hash, HMAC y verificacion de checksum',
          description: 'Elige esta ruta para comprobaciones de integridad, firmas y revision tecnica de archivos o payloads.',
          toolSlugs: ['hash-generator', 'hmac-generator', 'checksum-verifier'],
        },
      ],
      noteTitle: 'Por que importa',
      note:
        'Consultas como password generator, JWT debugger, HMAC generator y checksum verifier necesitan rutas claras en lugar de una categoria de seguridad demasiado vaga.',
    },
  },
  ja: {
    charts: {
      eyebrow: 'データの形からチャートを選ぶために',
      title: 'トレンド、分布、ヒートマップ、フロー、ガントに向くチャート生成ツール',
      intro:
        'チャートカテゴリは名前の一覧ではなく、データが何を答えるべきかで案内する方が強くなります。そうすれば棒グラフ、ヒートマップ、Sankey、ガントの意図がぶれません。',
      highlightsTitle: 'このカテゴリで解決しやすい仕事',
      highlights: [
        '棒グラフ、折れ線、面グラフで時系列やカテゴリ比較を整理する。',
        '円グラフ、散布図、ヒートマップで割合、相関、密な分布を可視化する。',
        'Sankey、Treemap、ガントでフロー、階層、計画を表現する。',
      ],
      workflowsTitle: 'おすすめの選び方',
      workflows: [
        {
          title: '推移と比較',
          description: '時間変化やカテゴリ差を見せたいときはこのルートから選びます。',
          toolSlugs: ['bar-chart-generator', 'line-chart-generator', 'area-chart-generator'],
        },
        {
          title: '分布、構成比、相関',
          description: '割合、散らばり、関係性を見せたいデータに向いています。',
          toolSlugs: ['pie-chart-generator', 'scatter-chart-generator', 'heatmap-chart-generator'],
        },
        {
          title: 'フロー、階層、スケジュール',
          description: '通常の比較チャートでは足りない業務フローや計画管理に使います。',
          toolSlugs: ['sankey-chart-generator', 'treemap-chart-generator', 'gantt-chart-generator'],
        },
      ],
      noteTitle: '意図を保つポイント',
      note:
        'bar chart generator、heatmap chart generator、gantt chart maker のような検索は、ページがデータの形で案内するときに最も精度が上がります。',
    },
    security: {
      eyebrow: 'パスワード、JWT、整合性確認のために',
      title: 'パスワード生成、JWT デバッグ、HMAC、チェックサム向けセキュリティツール',
      intro:
        'このカテゴリは、パスワード作成、JWT クレーム確認、HMAC 署名、チェックサム検証のような具体的な作業で分けると強くなります。',
      highlightsTitle: 'このカテゴリの代表的な仕事',
      highlights: [
        'テストアカウントや管理者用に強いパスワードとワンタイムコードを準備する。',
        'ログイン、セッション、期限切れの問題を調べるために JWT ヘッダーとペイロードを確認する。',
        'ブラウザ上でハッシュ、HMAC、チェックサムを作成し、配布前の整合性確認に使う。',
      ],
      workflowsTitle: 'おすすめのセキュリティルート',
      workflows: [
        {
          title: 'パスワードとワンタイムコード',
          description: 'より強い認証情報や時間ベースのコードが必要なときに使います。',
          toolSlugs: ['password-generator', 'password-strength', 'totp-generator'],
        },
        {
          title: 'JWT 作成とトークンデバッグ',
          description: 'テスト用トークンの生成、JWT ペイロードの確認、認証フローの切り分けに向いています。',
          toolSlugs: ['jwt-generator', 'jwt-debugger', 'jwt-payload-decoder'],
        },
        {
          title: 'ハッシュ、HMAC、チェックサム検証',
          description: '整合性確認、署名、配布物の検証を進めるときにこのルートを使います。',
          toolSlugs: ['hash-generator', 'hmac-generator', 'checksum-verifier'],
        },
      ],
      noteTitle: '意図の境界',
      note:
        'password generator、JWT debugger、HMAC generator、checksum verifier のような検索は、曖昧な security 一覧より明確な導線の方が合います。',
    },
  },
  ko: {
    charts: {
      eyebrow: '데이터 형태에 맞춰 차트를 고를 때',
      title: '추세, 분포, 히트맵, 흐름, 간트용 차트 생성 도구',
      intro:
        '차트 카테고리는 차트 이름을 길게 나열하는 것보다 데이터가 어떤 질문에 답해야 하는지로 안내할 때 더 강해집니다. 그래야 bar, heatmap, Sankey, gantt 의도가 흐려지지 않습니다.',
      highlightsTitle: '이 카테고리가 잘 맞는 차트 작업',
      highlights: [
        '막대, 선, 영역 차트로 시간 흐름이나 카테고리 비교를 정리한다.',
        '원형, 산점도, 히트맵으로 비중, 상관관계, 밀집 패턴을 보여준다.',
        'Sankey, Treemap, gantt 로 흐름, 계층, 프로젝트 일정까지 표현한다.',
      ],
      workflowsTitle: '추천 차트 경로',
      workflows: [
        {
          title: '추세와 비교',
          description: '시간 변화나 그룹 간 차이를 보여줘야 할 때 이 경로에서 시작합니다.',
          toolSlugs: ['bar-chart-generator', 'line-chart-generator', 'area-chart-generator'],
        },
        {
          title: '분포, 비중, 상관관계',
          description: '비율, 흩어짐, 관계 중심 데이터에 어울리는 차트입니다.',
          toolSlugs: ['pie-chart-generator', 'scatter-chart-generator', 'heatmap-chart-generator'],
        },
        {
          title: '흐름, 계층, 일정',
          description: '일반 비교 차트로는 부족한 프로세스와 계획 데이터를 다룰 때 사용합니다.',
          toolSlugs: ['sankey-chart-generator', 'treemap-chart-generator', 'gantt-chart-generator'],
        },
      ],
      noteTitle: '의도 고정 포인트',
      note:
        'bar chart generator, heatmap chart generator, gantt chart maker 같은 검색은 페이지가 데이터 형태 기준으로 안내할 때 가장 정확해집니다.',
    },
    security: {
      eyebrow: '비밀번호, JWT, 무결성 검증 작업용',
      title: '비밀번호 생성, JWT 디버깅, HMAC, 체크섬용 보안 도구',
      intro:
        '이 카테고리는 비밀번호 생성, JWT 클레임 확인, HMAC 서명 생성, 체크섬 검증처럼 구체적인 보안 작업으로 나눌 때 가장 강해집니다.',
      highlightsTitle: '대표적인 보안 작업',
      highlights: [
        '테스트 계정과 운영 접근용으로 더 강한 비밀번호와 일회용 코드를 준비한다.',
        '로그인, 세션, 만료 이슈를 디버깅하기 위해 JWT 헤더와 페이로드를 확인한다.',
        '브라우저에서 해시, HMAC, 체크섬을 만들어 배포 전 무결성을 점검한다.',
      ],
      workflowsTitle: '추천 보안 경로',
      workflows: [
        {
          title: '비밀번호와 일회용 코드',
          description: '더 강한 인증 정보나 시간 기반 접근 코드가 필요할 때 사용합니다.',
          toolSlugs: ['password-generator', 'password-strength', 'totp-generator'],
        },
        {
          title: 'JWT 생성과 토큰 디버깅',
          description: '테스트 토큰을 만들고 JWT 페이로드를 확인하며 인증 흐름 문제를 분리할 수 있습니다.',
          toolSlugs: ['jwt-generator', 'jwt-debugger', 'jwt-payload-decoder'],
        },
        {
          title: '해시, HMAC, 체크섬 검증',
          description: '무결성 확인, 서명, 배포 자산 검증이 필요할 때 이 경로를 엽니다.',
          toolSlugs: ['hash-generator', 'hmac-generator', 'checksum-verifier'],
        },
      ],
      noteTitle: '의도 집중',
      note:
        'password generator, JWT debugger, HMAC generator, checksum verifier 같은 검색은 모호한 보안 목록보다 명확한 경로가 더 잘 맞습니다.',
    },
  },
  zh: {
    charts: {
      eyebrow: '按数据形态选择图表',
      title: '适合趋势、分布、热力图、流程和甘特场景的图表生成工具',
      intro:
        '图表分类不应该只是堆一长串图表名字，而要先回答数据想表达什么问题。这样柱状图、热力图、Sankey、甘特图等搜索意图才不会混在一起。',
      highlightsTitle: '这类页面最该解决的图表任务',
      highlights: [
        '用柱状图、折线图、面积图处理时间趋势和分类对比。',
        '用饼图、散点图、热力图展示占比、相关性和密集分布。',
        '用 Sankey、矩形树图、甘特图表达流程、层级和项目计划。',
      ],
      workflowsTitle: '推荐图表路径',
      workflows: [
        {
          title: '趋势与对比',
          description: '当你要展示时间变化或分类差异时，从这一组图表开始选。',
          toolSlugs: ['bar-chart-generator', 'line-chart-generator', 'area-chart-generator'],
        },
        {
          title: '分布、占比与相关性',
          description: '适合比例结构、散点关系和高密度矩阵数据。',
          toolSlugs: ['pie-chart-generator', 'scatter-chart-generator', 'heatmap-chart-generator'],
        },
        {
          title: '流程、层级与排期',
          description: '当普通对比图不够表达业务流程或项目安排时，直接走这条路径。',
          toolSlugs: ['sankey-chart-generator', 'treemap-chart-generator', 'gantt-chart-generator'],
        },
      ],
      noteTitle: '为什么要这样组织',
      note:
        '像 bar chart generator、heatmap chart generator、gantt chart maker 这类查询，只有按数据形态分流时，页面主题才不会跑偏。',
    },
    security: {
      eyebrow: '面向密码、JWT 和完整性校验任务',
      title: '用于密码生成、JWT 调试、HMAC 签名和校验和验证的安全工具',
      intro:
        '安全分类只有在按具体任务拆分时才有搜索价值，比如生成密码、检查 JWT claims、创建 HMAC 签名、验证校验和，而不是泛泛地写成安全工具大全。',
      highlightsTitle: '这类页面最常见的安全任务',
      highlights: [
        '为测试账号、管理员入口和内部交接生成更强的密码与一次性验证码。',
        '排查登录、会话和过期问题时检查 JWT 头部与 payload 内容。',
        '在浏览器里直接生成哈希、HMAC 和校验和，用于发布前的完整性校验。',
      ],
      workflowsTitle: '推荐安全路径',
      workflows: [
        {
          title: '密码与一次性验证码',
          description: '需要更强登录凭证或基于时间的一次性访问码时，优先走这组工具。',
          toolSlugs: ['password-generator', 'password-strength', 'totp-generator'],
        },
        {
          title: 'JWT 生成与 Token 调试',
          description: '适合生成测试 Token、检查 JWT payload、拆分认证流程中的具体问题。',
          toolSlugs: ['jwt-generator', 'jwt-debugger', 'jwt-payload-decoder'],
        },
        {
          title: '哈希、HMAC 与校验和验证',
          description: '当你要做完整性检查、签名验证或发布资产校验时，直接进入这条路径。',
          toolSlugs: ['hash-generator', 'hmac-generator', 'checksum-verifier'],
        },
      ],
      noteTitle: '意图边界',
      note:
        'password generator、JWT debugger、HMAC generator、checksum verifier 这类搜索词，需要清晰分流，而不是一个模糊的安全分类页。',
    },
  },
};
