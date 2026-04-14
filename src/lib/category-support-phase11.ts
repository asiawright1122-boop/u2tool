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
  "de": {
    "charts": {
      "eyebrow": "Wählen Sie das richtige Diagramm für Ihre Daten",
      "title": "Diagramm-Generatoren für Trends, Verteilungen, Flüsse und Zeitpläne",
      "intro": "Visualisieren Sie Ihre Daten mit höchster Präzision. Unsere umfangreiche Suite von Diagramm-Generatoren hilft Ihnen, nackte Zahlen in überzeugende visuelle Geschichten zu verwandeln – von einfachen Balkendiagrammen bis hin zu komplexen Sankey-Diagrammen.",
      "highlightsTitle": "Wichtige Funktionen",
      "highlights": [
        "Vergleichen Sie Kategorien oder Zeitreihen mit Balken-, Linien- und Flächendiagrammen.",
        "Zeigen Sie Anteile und Korrelationen mit Kreis-, Streuwert- und Heatmap-Diagrammen.",
        "Bilden Sie Flüsse, Hierarchien und Projektpläne mit Sankey-, Treemap- und Gantt-Ansichten ab."
      ],
      "workflowsTitle": "Diagrammtypen entdecken",
      "workflows": [
        {
          "title": "Trends und Vergleiche",
          "description": "Perfekt, um Veränderungen über die Zeit oder Unterschiede zwischen Gruppen aufzuzeigen.",
          "toolSlugs": [
            "bar-chart-generator",
            "line-chart-generator",
            "area-chart-generator"
          ]
        },
        {
          "title": "Verteilungen, Anteile und Muster",
          "description": "Ideal zur Darstellung von Proportionen, Streuungen und zum Erkennen von Mustern in dichten Datensätzen.",
          "toolSlugs": [
            "pie-chart-generator",
            "scatter-chart-generator",
            "heatmap-chart-generator"
          ]
        },
        {
          "title": "Flüsse, Hierarchien und Zeitpläne",
          "description": "Entwickelt zur Visualisierung komplexer Prozesse, Organisationsstrukturen und Projektplanungen.",
          "toolSlugs": [
            "sankey-chart-generator",
            "treemap-chart-generator",
            "gantt-chart-generator"
          ]
        }
      ],
      "noteTitle": "100% lokale Verarbeitung",
      "note": "Die gesamte Diagrammerstellung erfolgt direkt in Ihrem Browser. Ihre sensiblen Daten verlassen niemals Ihr Gerät und werden auf keinem Server gespeichert."
    },
    "security": {
      "eyebrow": "Professionelle Kryptographie- & Sicherheitssuite",
      "title": "Sicherheitstools für Passwörter, JWT-Debugging, HMAC und Checksums",
      "intro": "Sichern Sie Ihre Workflows mit unseren fortschrittlichen Sicherheitstools. Generieren Sie robuste Passwörter, debuggen Sie JWT-Token und überprüfen Sie die Dateiintegrität – alles effizient in Ihrem Browser.",
      "highlightsTitle": "Unverzichtbare Werkzeuge",
      "highlights": [
        "Generieren Sie starke Passwörter und Einmalcodes für sicheren Zugriff.",
        "Überprüfen Sie JWT-Header und -Payloads für nahtloses Authentifizierungs-Debugging.",
        "Berechnen Sie Hashes, HMAC-Signaturen und Prüfsummen (Checksums) zur Datenüberprüfung."
      ],
      "workflowsTitle": "Sicherheits-Tools erkunden",
      "workflows": [
        {
          "title": "Passwörter und Einmalcodes",
          "description": "Sichern Sie Ihre Konten mit kryptographisch starken Passwörtern und zeitbasierten PINs.",
          "toolSlugs": [
            "password-generator",
            "password-strength",
            "totp-generator"
          ]
        },
        {
          "title": "JWT-Erstellung und Token-Debugging",
          "description": "Dekodieren, überprüfen und inspizieren Sie JSON Web Tokens, ohne Ihre Geheimnisse zu gefährden.",
          "toolSlugs": [
            "jwt-generator",
            "jwt-debugger",
            "jwt-payload-decoder"
          ]
        },
        {
          "title": "Hash, HMAC und Checksum-Prüfung",
          "description": "Validieren Sie die Dateiintegrität und generieren Sie im Handumdrehen sichere kryptographische Hashes.",
          "toolSlugs": [
            "hash-generator",
            "hmac-generator",
            "checksum-verifier"
          ]
        }
      ],
      "noteTitle": "Zero-Knowledge-Architektur",
      "note": "Ihre Sicherheit und Privatsphäre sind garantiert. Alle kryptographischen Operationen laufen lokal auf Ihrem Gerät ab. Wir übertragen oder protokollieren niemals Ihre Passwörter, Token oder Dateien."
    }
  },
  "en": {
    "charts": {
      "eyebrow": "Choose the right chart for your data",
      "title": "Chart generators for trends, distributions, flows, and timelines",
      "intro": "Visualize your data with precision. Our comprehensive suite of chart generators helps you transform raw numbers into compelling visual stories, whether you need simple bar charts or complex Sankey diagrams.",
      "highlightsTitle": "Key capabilities",
      "highlights": [
        "Compare categories or time series with bar, line, and area charts.",
        "Show shares and correlations with pie, scatter, and heatmap charts.",
        "Map flows, hierarchies, and project schedules with Sankey, treemap, and gantt views."
      ],
      "workflowsTitle": "Explore chart types",
      "workflows": [
        {
          "title": "Trends and comparisons",
          "description": "Perfect for showing changes over time or comparing differences between groups.",
          "toolSlugs": [
            "bar-chart-generator",
            "line-chart-generator",
            "area-chart-generator"
          ]
        },
        {
          "title": "Distributions, shares, and correlations",
          "description": "Ideal for displaying proportions, data spread, and identifying patterns or correlations.",
          "toolSlugs": [
            "pie-chart-generator",
            "scatter-chart-generator",
            "heatmap-chart-generator"
          ]
        },
        {
          "title": "Flows, hierarchies, and timelines",
          "description": "Designed for visualizing complex processes, organizational structures, and project planning.",
          "toolSlugs": [
            "sankey-chart-generator",
            "treemap-chart-generator",
            "gantt-chart-generator"
          ]
        }
      ],
      "noteTitle": "100% Client-Side Processing",
      "note": "All chart generation happens directly in your browser. Your sensitive data never leaves your device and is never stored on any server."
    },
    "security": {
      "eyebrow": "Professional cryptography & security suite",
      "title": "Security tools for passwords, JWT debugging, HMAC, and checksums",
      "intro": "Secure your workflows with our advanced security tools. Generate robust passwords, debug JWT tokens, and verify file integrity—all efficiently processed within your browser.",
      "highlightsTitle": "Essential tools",
      "highlights": [
        "Generate strong passwords and one-time codes for secure access.",
        "Inspect JWT headers and payloads for seamless authentication debugging.",
        "Calculate hashes, HMAC signatures, and checksums for data integrity verification."
      ],
      "workflowsTitle": "Explore security tools",
      "workflows": [
        {
          "title": "Passwords and one-time codes",
          "description": "Secure your accounts with cryptographically strong passwords and time-based PINs.",
          "toolSlugs": [
            "password-generator",
            "password-strength",
            "totp-generator"
          ]
        },
        {
          "title": "JWT creation and token debugging",
          "description": "Decode, verify, and inspect JSON Web Tokens without compromising your secrets.",
          "toolSlugs": [
            "jwt-generator",
            "jwt-debugger",
            "jwt-payload-decoder"
          ]
        },
        {
          "title": "Hash, HMAC, and checksum verification",
          "description": "Validate file integrity and generate secure cryptographic hashes instantly.",
          "toolSlugs": [
            "hash-generator",
            "hmac-generator",
            "checksum-verifier"
          ]
        }
      ],
      "noteTitle": "Zero-Knowledge Architecture",
      "note": "Your security and privacy are guaranteed. All cryptographic operations run locally on your device. We never transmit or log your passwords, tokens, or files."
    }
  },
  "es": {
    "charts": {
      "eyebrow": "Elige el gráfico adecuado para tus datos",
      "title": "Generadores de gráficos para tendencias, distribuciones, flujos y cronogramas",
      "intro": "Visualiza tus datos con precisión. Nuestra completa suite de generadores de gráficos te ayuda a transformar números crudos en historias visuales atractivas, ya necesites gráficos de barras simples o complejos diagramas Sankey.",
      "highlightsTitle": "Capacidades clave",
      "highlights": [
        "Compara categorías o series temporales con gráficos de barras, líneas y áreas.",
        "Muestra proporciones y correlaciones con gráficos circulares, de dispersión y mapas de calor.",
        "Traza flujos, jerarquías y calendarios de proyectos con vistas Sankey, treemap y diagramas de Gantt."
      ],
      "workflowsTitle": "Explorar tipos de gráficos",
      "workflows": [
        {
          "title": "Tendencias y comparaciones",
          "description": "Perfecto para mostrar cambios a lo largo del tiempo o comparar diferencias entre grupos.",
          "toolSlugs": [
            "bar-chart-generator",
            "line-chart-generator",
            "area-chart-generator"
          ]
        },
        {
          "title": "Distribuciones, proporciones y correlaciones",
          "description": "Ideal para mostrar proporciones, dispersión de datos e identificar patrones o correlaciones.",
          "toolSlugs": [
            "pie-chart-generator",
            "scatter-chart-generator",
            "heatmap-chart-generator"
          ]
        },
        {
          "title": "Flujos, jerarquías y cronogramas",
          "description": "Diseñado para visualizar procesos complejos, estructuras organizativas y planificación de proyectos.",
          "toolSlugs": [
            "sankey-chart-generator",
            "treemap-chart-generator",
            "gantt-chart-generator"
          ]
        }
      ],
      "noteTitle": "Procesamiento 100% en el cliente",
      "note": "Toda la generación de gráficos ocurre directamente en tu navegador. Tus datos sensibles nunca salen de tu dispositivo y jamás se almacenan en ningún servidor."
    },
    "security": {
      "eyebrow": "Suite profesional de criptografía y seguridad",
      "title": "Herramientas de seguridad para contraseñas, depuración de JWT, HMAC y checksums",
      "intro": "Asegura tus flujos de trabajo con nuestras avanzadas herramientas de seguridad. Genera contraseñas robustas, depura tokens JWT y verifica la integridad de tus archivos, todo procesado eficientemente en tu navegador.",
      "highlightsTitle": "Herramientas esenciales",
      "highlights": [
        "Genera contraseñas fuertes y códigos de un solo uso para un acceso seguro.",
        "Inspecciona encabezados y payloads de JWT para una depuración de autenticación fluida.",
        "Calcula hashes, firmas HMAC y checksums para la verificación de integridad de datos."
      ],
      "workflowsTitle": "Explorar herramientas de seguridad",
      "workflows": [
        {
          "title": "Contraseñas y códigos de un solo uso",
          "description": "Asegura tus cuentas con contraseñas criptográficamente fuertes y PINs basados en el tiempo.",
          "toolSlugs": [
            "password-generator",
            "password-strength",
            "totp-generator"
          ]
        },
        {
          "title": "Creación de JWT y depuración de tokens",
          "description": "Decodifica, verifica e inspecciona JSON Web Tokens sin comprometer tus secretos.",
          "toolSlugs": [
            "jwt-generator",
            "jwt-debugger",
            "jwt-payload-decoder"
          ]
        },
        {
          "title": "Hash, HMAC y verificación de checksum",
          "description": "Valida la integridad de archivos y genera hashes criptográficos seguros al instante.",
          "toolSlugs": [
            "hash-generator",
            "hmac-generator",
            "checksum-verifier"
          ]
        }
      ],
      "noteTitle": "Arquitectura de Conocimiento Cero (Zero-Knowledge)",
      "note": "Tu seguridad y privacidad están garantizadas. Todas las operaciones criptográficas se ejecutan localmente en tu dispositivo. Nunca transmitimos ni registramos tus contraseñas, tokens o archivos."
    }
  },
  "ja": {
    "charts": {
      "eyebrow": "データに適したチャートを選択",
      "title": "トレンド、分布、フロー、スケジュールのためのチャートジェネレーター",
      "intro": "データを正確に視覚化します。当社の包括的なチャートジェネレーターのスイートは、シンプルな棒グラフから複雑なSankeyダイアグラムまで、生のデータを魅力的な視覚的ストーリーに変換するのに役立ちます。",
      "highlightsTitle": "主な機能",
      "highlights": [
        "棒グラフ、折れ線グラフ、面グラフでカテゴリや時系列を比較できます。",
        "円グラフ、散布図、ヒートマップで割合や相関関係を示します。",
        "Sankey、ツリーマップ、ガントビューでフロー、階層、プロジェクトスケジュールをマッピングします。"
      ],
      "workflowsTitle": "チャートの種類を探索する",
      "workflows": [
        {
          "title": "トレンドと比較",
          "description": "時間の経過に伴う変化を示したり、グループ間の違いを比較するのに最適です。",
          "toolSlugs": [
            "bar-chart-generator",
            "line-chart-generator",
            "area-chart-generator"
          ]
        },
        {
          "title": "分布、構成比、相関関係",
          "description": "比率、データの広がりを表示し、パターンや相関関係を特定するのに理想的です。",
          "toolSlugs": [
            "pie-chart-generator",
            "scatter-chart-generator",
            "heatmap-chart-generator"
          ]
        },
        {
          "title": "フロー、階層、スケジュール",
          "description": "複雑なプロセス、組織構造、プロジェクト計画の視覚化のために設計されています。",
          "toolSlugs": [
            "sankey-chart-generator",
            "treemap-chart-generator",
            "gantt-chart-generator"
          ]
        }
      ],
      "noteTitle": "100% クライアントサイド処理",
      "note": "チャートの生成はすべてブラウザ内で直接実行されます。機密データがデバイスから離れることはなく、サーバーに保存されることも絶対にありません。"
    },
    "security": {
      "eyebrow": "プロフェッショナルな暗号化＆セキュリティスイート",
      "title": "パスワード、JWTデバッグ、HMAC、チェックサム用のセキュリティツール",
      "intro": "高度なセキュリティツールでワークフローを保護します。強力なパスワードの生成、JWTトークンのデバッグ、ファイルの整合性の検証など、すべてブラウザ内で効率的に処理されます。",
      "highlightsTitle": "不可欠なツール",
      "highlights": [
        "安全なアクセスのための強力なパスワードとワンタイムコードを生成します。",
        "シームレスな認証デバッグのために、JWTヘッダーとペイロードを検査します。",
        "データの整合性検証のために、ハッシュ、HMAC署名、チェックサムを計算します。"
      ],
      "workflowsTitle": "セキュリティツールを探索する",
      "workflows": [
        {
          "title": "パスワードとワンタイムコード",
          "description": "暗号学的に強力なパスワードと時間ベースのPINでアカウントを保護します。",
          "toolSlugs": [
            "password-generator",
            "password-strength",
            "totp-generator"
          ]
        },
        {
          "title": "JWT の作成とトークンのデバッグ",
          "description": "シークレットを危険にさらすことなく、JSON Web Tokenをデコード、検証、検査します。",
          "toolSlugs": [
            "jwt-generator",
            "jwt-debugger",
            "jwt-payload-decoder"
          ]
        },
        {
          "title": "ハッシュ、HMAC、チェックサムの検証",
          "description": "ファイルの整合性を検証し、安全な暗号化ハッシュを瞬時に生成します。",
          "toolSlugs": [
            "hash-generator",
            "hmac-generator",
            "checksum-verifier"
          ]
        }
      ],
      "noteTitle": "ゼロ知識アーキテクチャ (Zero-Knowledge Architecture)",
      "note": "セキュリティとプライバシーは完全に保護されています。すべての暗号化処理はデバイス上でローカルに実行されます。当社がパスワード、トークン、またはファイルを送信したり保存したりすることは絶対にありません。"
    }
  },
  "ko": {
    "charts": {
      "eyebrow": "데이터에 알맞은 차트 선택하기",
      "title": "추세, 분포, 흐름 및 일정을 위한 차트 생성 도구",
      "intro": "데이터를 정밀하게 시각화하세요. U2Tool의 포괄적인 차트 생성 도구 모음을 사용하면, 간단한 막대 차트부터 복잡한 Sankey 다이어그램까지 원시 데이터를 매력적인 시각적 스토리로 변환할 수 있습니다.",
      "highlightsTitle": "주요 기능",
      "highlights": [
        "막대, 선, 영역 차트로 카테고리나 시계열 데이터를 비교합니다.",
        "원형, 산점도, 히트맵으로 비율과 상관관계를 보여줍니다.",
        "Sankey, 트리맵, 간트 차트로 흐름, 계층 구조 및 프로젝트 일정을 매핑합니다."
      ],
      "workflowsTitle": "차트 유형 둘러보기",
      "workflows": [
        {
          "title": "추세와 비교",
          "description": "시간에 따른 변화를 보여주거나 그룹 간의 차이를 비교하는 데 완벽합니다.",
          "toolSlugs": [
            "bar-chart-generator",
            "line-chart-generator",
            "area-chart-generator"
          ]
        },
        {
          "title": "분포, 비율 및 상관관계",
          "description": "비율, 데이터 분포를 표시하고 패턴이나 상관관계를 파악하는 데 이상적입니다.",
          "toolSlugs": [
            "pie-chart-generator",
            "scatter-chart-generator",
            "heatmap-chart-generator"
          ]
        },
        {
          "title": "흐름, 계층 구조 및 일정",
          "description": "복잡한 프로세스, 조직 구조 및 프로젝트 계획을 시각화하도록 설계되었습니다.",
          "toolSlugs": [
            "sankey-chart-generator",
            "treemap-chart-generator",
            "gantt-chart-generator"
          ]
        }
      ],
      "noteTitle": "100% 클라이언트 측 처리",
      "note": "모든 차트 생성은 브라우저 내에서 직접 이루어집니다. 민감한 데이터는 기기를 벗어나지 않으며 어떤 서버에도 절대 저장되지 않습니다."
    },
    "security": {
      "eyebrow": "전문적인 암호화 및 보안 도구 모음",
      "title": "비밀번호, JWT 디버깅, HMAC 및 체크섬용 보안 도구",
      "intro": "고급 보안 도구로 워크플로우를 보호하세요. 강력한 비밀번호를 생성하고, JWT 토큰을 디버깅하며, 파일 무결성을 검증하는 모든 과정이 브라우저 내에서 효율적으로 처리됩니다.",
      "highlightsTitle": "필수 보안 도구",
      "highlights": [
        "안전한 접근을 위해 강력한 비밀번호와 일회용 코드를 생성합니다.",
        "원활한 인증 디버깅을 위해 JWT 헤더 및 페이로드를 검사합니다.",
        "데이터 무결성 검증을 위해 해시, HMAC 서명 및 체크섬을 계산합니다."
      ],
      "workflowsTitle": "보안 도구 둘러보기",
      "workflows": [
        {
          "title": "비밀번호와 일회용 코드",
          "description": "암호학적으로 강력한 비밀번호와 시간 기반 PIN으로 계정을 보호하세요.",
          "toolSlugs": [
            "password-generator",
            "password-strength",
            "totp-generator"
          ]
        },
        {
          "title": "JWT 생성 및 토큰 디버깅",
          "description": "보안 키를 노출하지 않고 JSON Web Token을 디코딩, 검증 및 검사합니다.",
          "toolSlugs": [
            "jwt-generator",
            "jwt-debugger",
            "jwt-payload-decoder"
          ]
        },
        {
          "title": "해시, HMAC 및 체크섬 검증",
          "description": "파일 무결성을 쉽게 검증하고 안전한 암호화 해시를 즉시 생성합니다.",
          "toolSlugs": [
            "hash-generator",
            "hmac-generator",
            "checksum-verifier"
          ]
        }
      ],
      "noteTitle": "영지식 아키텍처 (Zero-Knowledge Architecture)",
      "note": "사용자의 보안과 프라이버시가 완벽하게 보장됩니다. 모든 암호화 작업은 기기에서 로컬로 실행됩니다. 당사는 귀하의 비밀번호, 토큰 또는 파일을 절대 전송하거나 로그로 남기지 않습니다."
    }
  },
  "zh": {
    "charts": {
      "eyebrow": "按数据形态选择图表",
      "title": "适用于趋势、分布、流程和甘特场景的图表生成工具",
      "intro": "精准地让数据可视化。无论是简单的柱状图还是复杂的桑基图，我们全面的图表生成器套件都能帮您将冷冰冰的数字转化为具有说服力的视觉故事。",
      "highlightsTitle": "核心能力",
      "highlights": [
        "使用柱状图、折线图和面积图对比类别或时间序列的发展趋势。",
        "使用饼图、散点图和热力图展示数据占比、密集分布或相关性。",
        "使用桑基图、矩形树图和甘特图梳理业务流程、层级结构和项目排期。"
      ],
      "workflowsTitle": "探索图表类型",
      "workflows": [
        {
          "title": "趋势与对比",
          "description": "非常适合用来展示数据随时间发生的变化，或对比不同分组之间的差异。",
          "toolSlugs": [
            "bar-chart-generator",
            "line-chart-generator",
            "area-chart-generator"
          ]
        },
        {
          "title": "分布、占比与相关性",
          "description": "适合用于展示数据比例结构、离散程度，以及识别高密度矩阵中的模式或相关性。",
          "toolSlugs": [
            "pie-chart-generator",
            "scatter-chart-generator",
            "heatmap-chart-generator"
          ]
        },
        {
          "title": "流程、层级与项目排期",
          "description": "专为可视化复杂的业务流程、组织结构和周密的计划安排而设计。",
          "toolSlugs": [
            "sankey-chart-generator",
            "treemap-chart-generator",
            "gantt-chart-generator"
          ]
        }
      ],
      "noteTitle": "100% 纯本地运行保障",
      "note": "所有的图表渲染和计算都在您的浏览器中进行。您的所有敏感数据绝不会离开当前设备，更不会被存储在任何服务器上。"
    },
    "security": {
      "eyebrow": "专业的密码与安全验证套件",
      "title": "密码、JWT调试、HMAC和校验和的安全工具聚集地",
      "intro": "使用我们的高级安全工具套件守护您的开发工作流。在浏览器内您就能高效生成可靠的高强度密码、调试 JWT 载荷参数，或进行文件完整性验证。",
      "highlightsTitle": "必备的安全利器",
      "highlights": [
        "为安全的认证环节快速生成高强度密码与一次性验证码(TOTP)。",
        "轻松解析 JWT 的 header 和 payload 内容，享受无缝无干扰的认证调试体验。",
        "利用本地运算能力毫秒级生成哈希值、HMAC 签名与各类校验和以确认数据完整无被篡改。"
      ],
      "workflowsTitle": "探索安全工具",
      "workflows": [
        {
          "title": "密码与验证码工具",
          "description": "使用符合密码学标准的高强度密码以及基于时间的一次性 PIN 码守护您的账户安全。",
          "toolSlugs": [
            "password-generator",
            "password-strength",
            "totp-generator"
          ]
        },
        {
          "title": "JWT 编解码与调试",
          "description": "为您提供最安全的 JSON Web Token 解析、校验与审查方案，确保开发密钥永不泄露。",
          "toolSlugs": [
            "jwt-generator",
            "jwt-debugger",
            "jwt-payload-decoder"
          ]
        },
        {
          "title": "哈希、HMAC 与校验和",
          "description": "帮助您快速生成主流哈希散列以及用于文件对比的校验和签名，即刻完成检验。",
          "toolSlugs": [
            "hash-generator",
            "hmac-generator",
            "checksum-verifier"
          ]
        }
      ],
      "noteTitle": "零知识安全架构体系",
      "note": "您的安全和隐私是我们的绝对底线。以上所有的密码学与加密操作都在您本地设备完成，我们绝不收集、传输或记录任何密码、令牌甚至文件内容。"
    }
  }
};
