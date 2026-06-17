import * as fs from 'node:fs';
import * as path from 'node:path';

const LOCALES = ['en', 'zh', 'es', 'pt', 'ja', 'ru', 'fr', 'ar', 'de', 'ko'];

const OPTIMIZED_TDK: Record<string, Record<string, {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
}>> = {
  "typing-speed-test": {
    "en": {
      "name": "Typing Speed Test",
      "description": "Measure WPM, accuracy, and typing mistakes as you type.",
      "seo_title": "Free Typing Speed Test Online - WPM Calculator",
      "seo_description": "Take a free typing speed test online. Measure WPM, accuracy, correct characters, mistakes, and duration with easy, medium, and hard prompts."
    },
    "zh": {
      "name": "打字速度测试",
      "description": "测试您的打字速度和准确率。",
      "seo_title": "免费在线打字速度测试工具 - 速度与准确率检测",
      "seo_description": "免费在线打字速度测试工具，可统计每分钟输入字数、准确率和错误数，适合键盘练习、录入训练和打字能力评估，数据100%本地处理，保障隐私。"
    },
    "es": {
      "name": "Prueba de Velocidad de Escritura",
      "description": "Probar su velocidad y precisión de escritura.",
      "seo_title": "Prueba de Velocidad de Tipeo Online - Calculadora de WPM",
      "seo_description": "Prueba tu velocidad y precisión de tipeo en el navegador de forma gratuita. Medición de palabras por minuto (WPM) en differentes niveles de dificultad sin instalación."
    },
    "pt": {
      "name": "Teste de Digitação",
      "description": "Testar velocidade de digitação.",
      "seo_title": "Teste de Velocidade de Digitação - Calcular WPM",
      "seo_description": "Faça um teste de digitação gratuito no navegador. Meça sua velocidade de digitação (WPM), precisão e erros em tempo real sem precisar instalar nenhum programa."
    },
    "ja": {
      "name": "タイピング速度テスト",
      "description": "タイピング速度と正確性をテスト。",
      "seo_title": "無料タイピング速度測定ツール - WPM計算",
      "seo_description": "無料のオンラインタイピング速度測定ツール。タイピングのスピード（WPM）と正確性をブラウザ上でリアルタイムに測定します。インストール不要で手軽に練習できます。"
    },
    "ru": {
      "name": "Тест скорости печати",
      "description": "Тестирование скорости печати.",
      "seo_title": "Тест скорости печати онлайн - Калькулятор WPM",
      "seo_description": "Бесплатный онлайн-тест для проверки скорости печати. Измеряйте WPM, точность и ошибки в режиме реального времени без регистрации и установки программ."
    },
    "fr": {
      "name": "Test de Frappe",
      "description": "Tester la vitesse de frappe.",
      "seo_title": "Test de vitesse de frappe - Calculateur WPM",
      "seo_description": "Testez votre vitesse de frappe et votre précision dans le navigateur gratuitement. Mesurez vos mots par minute (WPM) et améliorez vos compétences de saisie."
    },
    "ar": {
      "name": "اختبار سرعة الكتابة",
      "description": "اختبار سرعة الكتابة.",
      "seo_title": "اختبار سرعة الكتابة - حساب الكلمات في الدقيقة",
      "seo_description": "قم باجراء اختبار مجاني لقياس سرعة ودقة الكتابة على لوحة المفاتيح باللغة العربية والإنجليزية مباشرة عبر المتصفح وحساب عدد الكلمات بالدقيقة لتطوير مهاراتك."
    },
    "de": {
      "name": "Tippgeschwindigkeitstest",
      "description": "Tippgeschwindigkeit testen.",
      "seo_title": "Tippgeschwindigkeitstest - WPM Rechner",
      "seo_description": "Testen Sie Ihre Tippgeschwindigkeit und Genauigkeit kostenlos im Browser. Messen Sie Ihre WPM (Wörter pro Minute) und verbessern Sie Ihre Schreibfertigkeiten."
    },
    "ko": {
      "name": "타이핑 속도 테스트",
      "description": "타이핑 속도와 정확도를 테스트합니다.",
      "seo_title": "타이핑 속도 테스트 - WPM 계산기",
      "seo_description": "무료 온라인 타이핑 속도 및 정확도 테스트 도구입니다. WPM(분당 타자수), 정확도, 오타를 브라우저에서 실시간으로 확인하고 연습할 수 있으며，데이터는 로컬에서 안전하게 처리됩니다."
    }
  },
  "pixel-density-calculator": {
    "en": {
      "name": "Pixel Density Calculator",
      "description": "Calculate display PPI, pixel pitch, aspect ratio, and screen dimensions",
      "seo_title": "Pixel Density (PPI) Calculator Online",
      "seo_description": "Calculate display pixel density (PPI), pixel pitch, aspect ratio, physical size, and megapixels from resolution and diagonal size."
    },
    "zh": {
      "name": "像素密度计算器",
      "description": "计算屏幕的 PPI 和像素密度",
      "seo_title": "免费在线像素密度计算器 - 计算 PPI 与屏幕清晰度",
      "seo_description": "免费在线像素密度计算器，支持根据屏幕分辨率和屏幕尺寸一键计算 PPI、像素间距及长宽比，是选购屏幕、UI设计和移动端开发的得力助手，数据完全本地计算。"
    },
    "es": {
      "name": "Calculadora de Densidad de Píxeles",
      "description": "Calcula el PPI y la densidad de píxeles de la pantalla",
      "seo_title": "Calculadora de Densidad de Píxeles (PPI)",
      "seo_description": "Calcule la densidad de píxeles (PPI), el pitch de píxel y las dimensiones físicas de su pantalla a partir de la resolución y el tamaño diagonal."
    },
    "pt": {
      "name": "Calculadora de Densidade de Pixels",
      "description": "Calcule o PPI e a densidade de pixels da tela",
      "seo_title": "Calculadora de Densidade de Pixels (PPI)",
      "seo_description": "Calcule a densidade de pixels (PPI), pitch de pixel e dimensões da tela a partir da resolução e do tamanho diagonal de forma simples e rápida."
    },
    "ja": {
      "name": "ピクセル密度計算機",
      "description": "画面のPPIとピクセル密度を計算",
      "seo_title": "画素密度（PPI）計算機 - 画面解像度ツール",
      "seo_description": "解像度と画面サイズから、画素密度（PPI）、画素ピッチ、アスペクト比、画面の実寸法などを簡単に計算できるツールです。ディスプレイの選定やデザイン作業に最適です。"
    },
    "ru": {
      "name": "Калькулятор плотности пикселей",
      "description": "Рассчитайте PPI и плотность пикселей экрана",
      "seo_title": "Калькулятор плотности пикселей (PPI) онлайн",
      "seo_description": "Рассчитайте плотность пикселей (PPI), шаг пикселя и физические размеры экрана на основе разрешения и диагонали дисплея."
    },
    "fr": {
      "name": "Calculateur de Densité de Pixels",
      "description": "Calculez le PPI et la densité de pixels de l'écran",
      "seo_title": "Calculateur de Densité de Pixels (PPI)",
      "seo_description": "Calculez la densité de pixels (PPI), le pitch de pixel et les dimensions de l'écran à partir de la résolution et de la diagonale."
    },
    "ar": {
      "name": "حاسبة كثافة البكسل",
      "description": "حساب PPI وكثافة البكسل للشاشة",
      "seo_title": "حاسبة كثافة البكسل (PPI) لشاشات العرض",
      "seo_description": "احسب كثافة بكسلات الشاشة (PPI) ومسافة البكسل وأبعاد الشاشة الفعلية ونسبة العرض إلى الارتفاع بسهولة بناءً على الدقة والقطر المتوفرين عبر this المحسب المجاني."
    },
    "de": {
      "name": "Pixeldichte-Rechner",
      "description": "Berechnen Sie PPI und Pixeldichte des Bildschirms",
      "seo_title": "Pixeldichte Rechner - PPI bestimmen",
      "seo_description": "Berechnen Sie Pixeldichte (PPI), Pixelabstand und Bildschirmabmessungen ganz einfach anhand von Auflösung und Diagonale direkt im Browser für optimale Displayanalyse."
    },
    "ko": {
      "name": "픽셀 밀도 계산기",
      "description": "화면의 PPI 및 픽셀 밀도 계산",
      "seo_title": "픽셀 밀도(PPI) 계산기 - 화면 해상도",
      "seo_description": "디스플레이 해상도와 대각선 크기를 입력하여 픽셀 밀도(PPI), 픽셀 피치, 화면의 실제 가로세로 규격을 실시간으로 계산하는 도구입니다. 디스플레이 스펙 분석에 유용합니다."
    }
  },
  "document-word-counter": {
    "en": {
      "name": "Document Word Counter",
      "description": "Count words, characters, sentences, and paragraphs",
      "seo_title": "Free Document Word Counter Online",
      "seo_description": "Count words, characters, sentences, and paragraphs in your documents. Read reading time and frequency tables. Runs locally and safely."
    },
    "zh": {
      "name": "文档字数统计工具",
      "description": "统计单词、字符、句子和段落",
      "seo_title": "免费在线文档字数统计工具 - 统计字数与段落",
      "seo_description": "免费在线文档字数统计工具，可在浏览器中安全统计文档字数、字符数、句子数和段落数量，提供阅读时间估算和常用词频分析，100%本地处理，全方位保障您的隐私。"
    },
    "es": {
      "name": "Contador de Palabras de Documentos",
      "description": "Contador de palabras, caracteres, oraciones y párrafos",
      "seo_title": "Contador de Palabras de Documentos en Línea",
      "seo_description": "Cuente palabras, caracteres, oraciones y párrafos en sus documentos de texto. Incluye tiempo estimado de lectura y estadísticas locales."
    },
    "pt": {
      "name": "Contador de Palavras de Documentos",
      "description": "Conte palavras, caracteres, frases e parágrafos",
      "seo_title": "Contador de Palavras para Documentos Online",
      "seo_description": "Conte palavras, caracteres, frases e parágrafos nos seus documentos. Veja o tempo estimado de leitura e a contagem de caracteres de forma segura no seu navegador."
    },
    "ja": {
      "name": "ドキュメント単語数計算ツール",
      "description": "単語、文字、文、段落の数を計算",
      "seo_title": "文書文字数カウンター - 単語・段落カウント",
      "seo_description": "入力テキストやドキュメントの文字数、単語数、文章数、段落数を安全にカウントします。読了時間の目安や頻出単語も算出できる、プライバシーに配虑した無料ツール。"
    },
    "ru": {
      "name": "Счетчик слов в документах",
      "description": "Бесплатный онлайн инструмент для подсчета слов в документах",
      "seo_title": "Счетчик слов в документах онлайн",
      "seo_description": "Подсчитайте слова, символы, предложения и абзацы в ваших текстовых файлах и документах онлайн. Быстрый и безопасный локальный анализ."
    },
    "fr": {
      "name": "Compteur de Mots de Document",
      "description": "Compte les mots, les caractères, les phrases et les paragraphes",
      "seo_title": "Compteur de mots pour documents en ligne",
      "seo_description": "Comptez les mots, caractères, phrases et paragraphes dans vos documents. Estimez le temps de lecture facilement et en toute sécurité."
    },
    "ar": {
      "name": "عداد كلمات المستند",
      "description": "أداة حساب الكلمات للمستندات مجانية أونلاين",
      "seo_title": "عداد كلمات المستندات والمدونات مجاناً",
      "seo_description": "احسب عدد الكلمات، الحروف، الجمل والفقرات في مستنداتك مجانًا. تعرف على الوقت التقريبي للقراءة وإحصاءات النص بأمان تام."
    },
    "de": {
      "name": "Dokument-Wortzähler",
      "description": "Zähle Wörter, Zeichen, Sätze und Absätze",
      "seo_title": "Dokument Wortzähler - Textanalyse",
      "seo_description": "Zählen Sie Wörter, Zeichen, Sätze und Absätze in Ihren Dokumenten direkt im Browser. Analysieren Sie die Lesezeit und Worthäufigkeiten sicher und ohne Datenübertragung."
    },
    "ko": {
      "name": "문서 단어 계산기",
      "description": "단어, 문자, 문장, 구절을 세어보세요",
      "seo_title": "문서 글자수 세기 - 단어 및 문단 카운터",
      "seo_description": "문서나 텍스트의 글자수, 단어수, 문장수, 문단수를 실시간으로 세어줍니다. 예상 독서 시간 확인 및 단어 빈도 분석 기능 포함, 100% 로컬 작동으로 데이터가 안전합니다."
    }
  },
  "screen-recorder": {
    "en": {
      "name": "Screen Recorder",
      "description": "Record your screen directly in the browser",
      "seo_title": "Free Online Screen Recorder - No Installation Required",
      "seo_description": "Record your screen directly in the browser. Free online screen recorder with no installation required. Download recordings as WebM."
    },
    "zh": {
      "name": "屏幕录制",
      "description": "直接在浏览器中录制屏幕",
      "seo_title": "免费在线屏幕录制工具 - 免安装录屏",
      "seo_description": "免费在线屏幕录制工具，支持直接在浏览器中录制屏幕内容、应用窗口或浏览器标签页，适合操作演示与教学视频录制，完全在本地运行，保障您的数据与隐私安全。"
    },
    "es": {
      "name": "Grabador de pantalla",
      "description": "Grabador de pantalla en línea gratuito - Sin instalación",
      "seo_title": "Grabador de Pantalla en Línea Gratis - Sin Instalación",
      "seo_description": "Grabe su pantalla directamente en el navegador de forma gratuita y sin instalación. Descargue las grabaciones en formato WebM."
    },
    "pt": {
      "name": "Gravador de tela",
      "description": "Grave a sua tela de forma simples no navegador.",
      "seo_title": "Gravador de Tela Online Grátis - Sem Instalação",
      "seo_description": "Grave a sua tela diretamente no navegador sem instalar programas. Grave a tela inteira, janelas ou guias e baixe o vídeo gravado em formato WebM de forma segura."
    },
    "ja": {
      "name": "スクリーンレコーダー",
      "description": "ブラウザ上で直接画面を録画",
      "seo_title": "無料オンライン画面録画ツール - インストール不要",
      "seo_description": "ブラウザ上で直接画面を録画できる無料ツールです。インストール不要で、画面全体、アプリ窓、タブの録画に対応。録画データはWebM形式でダウンロード可能です。"
    },
    "ru": {
      "name": "Запись экрана",
      "description": "Бесплатная онлайн запись экрана - Без установки",
      "seo_title": "Бесплатная запись экрана онлайн - Без установки",
      "seo_description": "Записывайте экран прямо в браузере бесплатно и без установки программ. Сохраняйте готовые видеозаписи в формате WebM."
    },
    "fr": {
      "name": "Enregistreur d'écran",
      "description": "Enregistreur d'écran en ligne gratuit - Sans installation",
      "seo_title": "Enregistreur d'écran en ligne gratuit - Sans installation",
      "seo_description": "Enregistrez votre écran directement depuis le navigateur. Solution en ligne gratuite sans installation, export en WebM."
    },
    "ar": {
      "name": "مسجل الشاشة",
      "description": "مسجل شاشة مجاني عبر الإنترنت - بدون تثبيت",
      "seo_title": "مسجل الشاشة مجاناً عبر الإنترنت - بدون تثبيت",
      "seo_description": "قم بتسجيل شاشة الكمبيوتر مباشرة من متصفحك مجاناً وبدون أي تثبيت. قم بتنزيل مقاطع الفيديو المسجلة بصيغة WebM بسهولة."
    },
    "de": {
      "name": "Bildschirmrekorder",
      "description": "Kostenloser Online-Bildschirmrekorder - Keine Installation erforderlich",
      "seo_title": "Kostenloser Bildschirmrekorder Online - Ohne Installation",
      "seo_description": "Nehmen Sie Ihren Bildschirm direkt im Browser auf. Kostenloser Bildschirmrekorder ohne Installation. Nehmen Sie Fenster oder Tabs auf und laden Sie WebM-Dateien herunter."
    },
    "ko": {
      "name": "화면 녹화",
      "description": "무료在线 화면 녹화 도구 - 설치 불필요",
      "seo_title": "무료 온라인 화면 녹화 도구 - 설치 불필요",
      "seo_description": "설치 없이 브라우저에서 직접 화면을 녹화하세요. 전체 화면, 특정 창, 브라우저 탭 녹화를 지원하며, 녹화된 영상은 WebM 형식으로 즉시 다운로드 가능하고 안전합니다."
    }
  },
  "calorie-calculator": {
    "en": {
      "name": "Calorie Calculator",
      "description": "Calculate daily calories needed based on goals, age, gender, and activity. Includes BMR and weight loss suggestions.",
      "seo_title": "Free Daily Calorie Calculator Online",
      "seo_description": "Estimate daily calories needed based on goals, age, gender, and activity. Includes BMR and weight loss suggestions."
    },
    "zh": {
      "name": "卡路里计算器",
      "description": "根据目标、年龄、性别和运动计算每日所需卡路里",
      "seo_title": "免费在线卡路里计算器 - 计算每日热量需求",
      "seo_description": "免费卡路里计算器，根据年龄、性别、体重及日常运动量，科学估算每日卡路里需求与基础代谢率（BMR），提供定制化的体重与饮食管理建议。"
    },
    "es": {
      "name": "Calculadora de Calorías",
      "description": "Calculadora de Calorías Gratis Online - Necesidades Diarias",
      "seo_title": "Calculadora de Calorías Online Gratis - Consumo Diario",
      "seo_description": "Calcule sus necesidades calóricas diarias según su edad, peso, actividad física y objetivos de pérdida o mantenimiento de peso."
    },
    "pt": {
      "name": "Calculadora de Calorias",
      "description": "Calcule o consumo diário de calorias",
      "seo_title": "Calculadora de Calorias Online - Necessidades Diárias",
      "seo_description": "Calcule as suas necessidades calóricas diárias e taxa metabólica basal (BMR) com base na sua idade, atividade e objetivos de peso."
    },
    "ja": {
      "name": "カロリー計算機",
      "description": "カロリー計算機 - 1日の必要カロリー計算",
      "seo_title": "カロリー計算機 - 1日の必要カロリー計算",
      "seo_description": "年齢、性別、体重、活動量に基づいて、1日の必要カロリー量や基礎代謝量（BMR）を算出します。健康的なダイエットや体重管理のための摂取カロリー目安がわかります。"
    },
    "ru": {
      "name": "Калорийный Калькулятор",
      "description": "Рассчитайте необходимую суточную калорийность",
      "seo_title": "Онлайн калькулятор калорий - Суточная норма",
      "seo_description": "Рассчитайте суточную норму калорий и скорость обмена веществ (BMR) на основе вашего возраста, веса, активности и целей."
    },
    "fr": {
      "name": "Calculateur de Calories",
      "description": "Estimez les calories quotidiennes nécessaires",
      "seo_title": "Calculateur de calories en ligne - Besoins quotidiens",
      "seo_description": "Estimez vos besoins en calories journaliers et votre métabolisme de base (BMR) selon votre âge, poids et niveau d'activité."
    },
    "ar": {
      "name": "حاسبة السعرات الحرارية",
      "description": "حساب السعرات الحرارية اليومية التي يحتاجها الجسم",
      "seo_title": "حاسبة السعرات الحرارية - حساب الاحتياج اليومي",
      "seo_description": "احسب السعرات الحرارية اليومية التي يحتاجها جسمك ومعدل الأيض الأساسي بناءً على الوزن والنشاط وأهداف خسارة الوزن."
    },
    "de": {
      "name": "Kalorienrechner",
      "description": "Berechnen Sie Ihren täglichen Kalorienbedarf.",
      "seo_title": "Kalorienrechner Online - Täglichen Kalorienbedarf berechnen",
      "seo_description": "Berechnen Sie Ihren täglichen Kalorienbedarf und Grundumsatz (BMR) basierend auf Alter, Aktivität und Gewichtszielen direkt im Browser für Ihre Fitness und Gesundheit."
    },
    "ko": {
      "name": "칼로리 계산기",
      "description": "나이, 활동량, 가동 범위를 통해 칼로리를 분석해보세요",
      "seo_title": "무료 온라인 칼로리 계산기 - 일일 칼로리 권장량",
      "seo_description": "나이, 성별, 활동량 및 건강 목표에 따른 일일 권장 칼로리와 기초대사량(BMR)을 계산하여 건강한 식단 수립과 체중 관리를 할 수 있도록 체계적인 가이드를 제공합니다."
    }
  },
  "gantt-chart-generator": {
    "en": {
      "name": "Gantt Chart Maker",
      "description": "Create and manage Gantt charts online for project scheduling, project timeline visualization, and progress tracking.",
      "seo_title": "Free Gantt Chart Maker Online",
      "seo_description": "Create and manage Gantt charts online for project scheduling, project timeline visualization, and progress tracking. Export high-quality PNG/SVG charts easily in your browser."
    },
    "zh": {
      "name": "甘特图生成器",
      "description": "在线制作甘特图以进行项目排期、时间线可视化和进度跟踪。",
      "seo_title": "免费在线甘特图生成器 - 制作项目排期时间表",
      "seo_description": "免费在线甘特图生成器，帮助您轻松规划项目进度、分配任务时间与里程碑，支持自定义任务颜色，一键导出精美的时间轴图表以提升团队协作效率。"
    },
    "es": {
      "name": "Generador de diagramas de Gantt",
      "description": "Cree diagramas de Gantt para planificar proyectos.",
      "seo_title": "Generador de Diagramas de Gantt Gratis Online",
      "seo_description": "Cree y edite diagramas de Gantt en línea para la gestión de proyectos, cronogramas y planificación de tareas de forma sencilla."
    },
    "pt": {
      "name": "Gerador de Gráficos de Gantt",
      "description": "Gerador de Gráficos de Gantt Grátis Online - Cronogramas de Projetos",
      "seo_title": "Gerador de Gráficos de Gantt Online Grátis",
      "seo_description": "Crie gráficos de Gantt no navegador para planejamento de projetos, controle de cronogramas e prazos de tarefas. Personalize e exporte imagens do seu cronograma."
    },
    "ja": {
      "name": "ガントチャート作成",
      "description": "ガントチャートをブラウザ上で簡単に作成・編集できるツール",
      "seo_title": "無料オンラインガントチャート作成ツール",
      "seo_description": "プロジェクトのスケジュール管理やタスク計画に最適なガントチャートをブラウザ上で簡単に作成できます。タスク追加や期間調整、チャート画像の書き出しに対応。"
    },
    "ru": {
      "name": "Генератор диаграмм Ганта",
      "description": "Создавайте и редактируйте диаграммы Ганта онлайн для планирования проектов",
      "seo_title": "Онлайн генератор диаграмм Ганта - Создание графиков",
      "seo_description": "Создавайте и редактируйте диаграммы Ганта онлайн для планирования проектов, управления задачами и визуализации графиков."
    },
    "fr": {
      "name": "Générateur de diagrammes de Gantt",
      "description": "Générateur de diagrammes de Gantt gratuit en ligne",
      "seo_title": "Générateur de diagrammes de Gantt gratuit en ligne",
      "seo_description": "Créez facilement des diagrammes de Gantt en ligne pour planifier vos projets, suivre les tâches et visualiser vos calendriers."
    },
    "ar": {
      "name": "مصمم مخططات غانت",
      "description": "أنشئ وصمم مخططات غانت لإدارة المشاريع وجدولة المهام وتتبع المخططات الزمنية",
      "seo_title": "مخطط غانت أونلاين - مصمم مخططات المشاريع",
      "seo_description": "أنشئ وصمم مخططات غانت لإدارة المشاريع وجدولة المهام وتتبع المخططات الزمنية وتحديد المسار الحرج مباشرة عبر المتصفح وبشكل مجاني تماماً لتسهيل تنظيم أعمالك."
    },
    "de": {
      "name": "Gantt-Diagramm-Ersteller",
      "description": "Erstellen Sie Gantt-Diagramme für Projekte.",
      "seo_title": "Gantt-Diagramm Ersteller Online - Kostenlos",
      "seo_description": "Erstellen Sie Gantt-Diagramme für Projektplanung und Aufgabenverwaltung direkt im Webbrowser. Verfolgen Sie Meilensteine und exportieren Sie Zeitpläne ganz einfach."
    },
    "ko": {
      "name": "간트 차트 생성기",
      "description": "프로젝트의 일정 관리와 업무 진행 상황을 한눈에 시각화할 수 있는 간트 차트",
      "seo_title": "무료 온라인 간트 차트 생성기 - 프로젝트 일정",
      "seo_description": "프로젝트 일정 관리와 업무 진행 상황을 시각화할 수 있는 간트 차트를 브라우저에서 무료로 생성하세요. 작업 추가, 기간 조정 및 차트 이미지 다운로드를 지원합니다."
    }
  },
  "ascii-table": {
    "en": {
      "name": "ASCII Table",
      "description": "Complete ASCII table reference chart with decimal, hexadecimal, octal, binary, and HTML entity codes for all characters.",
      "seo_title": "ASCII Table - Complete Character Code Reference Chart",
      "seo_description": "Complete ASCII table reference chart with decimal, hexadecimal, octal, binary, and HTML entity codes for all characters."
    },
    "zh": {
      "name": "ASCII 表",
      "description": "完整的 ASCII 码表对照查询工具，包含十进制、十六进制、八进制、二进制及 HTML 实体字符编码。",
      "seo_title": "免费在线 ASCII 码表查询工具",
      "seo_description": "完整的 ASCII 码表对照查询工具，包含十进制、十六进制、八进制、二进制及 HTML 实体字符编码，支持快速搜索与字符类型筛选，是开发者必备的速查表。"
    },
    "es": {
      "name": "Tabla ASCII",
      "description": "Tabla ASCII completa con conversiones de caracteres",
      "seo_title": "Tabla ASCII - Referencia Completa de Códigos",
      "seo_description": "Tabla ASCII completa con conversiones a decimal, hexadecimal, octal, binario y entidades HTML de todos los caracteres."
    },
    "pt": {
      "name": "Tabela ASCII",
      "description": "Tabela ASCII completa contendo representações em diversos formatos",
      "seo_title": "Tabela ASCII Completa - Referência de Códigos",
      "seo_description": "Tabela ASCII completa contendo representações em decimal, hexadecimal, octal, binário e entidades HTML para desenvolvedores."
    },
    "ja": {
      "name": "ASCIIテーブル",
      "description": "すべての文字の各種文字コード情報を確認できるASCIIコード表",
      "seo_title": "ASCIIコード表 - 16進数・10進数・2進数一覧",
      "seo_description": "すべての文字の10進数、16進数、8進数、25進数、HTMLエンティティコードを検索・確認できる便利なASCIIコード表です。コントロール文字の解説も完備。"
    },
    "ru": {
      "name": "ASCII Таблица",
      "description": "Полная справочная таблица кодов ASCII",
      "seo_title": "Таблица ASCII - Коды символов онлайн",
      "seo_description": "Полная справочная таблица кодов ASCII, включая десятичные, шестнадцатеричные, двоичные значения и HTML-сущности."
    },
    "fr": {
      "name": "Table ASCII",
      "description": "Référence complète de la table ASCII avec ses conversions",
      "seo_title": "Table ASCII - Référence complète des codes caractères",
      "seo_description": "Référence complète de la table ASCII avec les équivalents décimal, hexadécimal, octal, binaire et entités HTML de chaque caractère."
    },
    "ar": {
      "name": "جدول ASCII",
      "description": "جدول ASCII المتكامل لعرض قيم الأحرف بمختلف الأنظمة",
      "seo_title": "جدول ASCII - مرجع رموز الأحرف المتكامل",
      "seo_description": "جدول ASCII المتكامل لعرض قيم الأحرف بالأنظمة العشري، الثنائي، الثماني، الستة عشري، ورموز HTML المقابلة لها بسهولة."
    },
    "de": {
      "name": "ASCII-Tabelle",
      "description": "Vollständige ASCII-Tabelle mit Dezimal-, Hexadezimal-, Oktal- und Binär-Codes",
      "seo_title": "ASCII-Tabelle - Code Referenz",
      "seo_description": "Vollständige ASCII-Tabelle mit Dezimal-, Hexadezimal-, Oktal-, Binär- und HTML-Entity-Codes für alle Sonderzeichen und Symbole direkt im Browser abrufbar."
    },
    "ko": {
      "name": "ASCII 테이블",
      "description": "모든 문자의 10진수, 16진수, 8진수, 2진수 값을 제공하는 ASCII 코드표",
      "seo_title": "ASCII 코드표 - 10진수, 16진수, 2진수 변환",
      "seo_description": "모든 문자의 10진수, 16진수, 8진수, 2진수 및 HTML 엔티티 코드를 한눈에 확인하고 검색할 수 있는 ASCII 코드표입니다."
    }
  },
  "dice-roller": {
    "en": {
      "name": "Dice Roller",
      "description": "Roll virtual dice online. Support D4, D6, D8, D10, D12, D20, D100, and custom dice for tabletop RPGs and board games.",
      "seo_title": "Free Dice Roller Online - Virtual D20 D6 D100 Dice",
      "seo_description": "Roll virtual dice online. Support D4, D6, D8, D10, D12, D20, D100, and custom dice for tabletop RPGs and board games."
    },
    "zh": {
      "name": "骰子掷骰器",
      "description": "在线进行虚拟掷骰，支持多面骰子和自定义骰子设定。",
      "seo_title": "免费在线骰子掷骰器 - 模拟多面骰随机结果",
      "seo_description": "免费在线骰子掷骰器，支持四面、六面、八面、十面、十二面、二十面、百面等各种多面骰，适合桌游和随机决策，一键获取纯随机结果，界面简洁操作方便。"
    },
    "es": {
      "name": "Generador de Dados",
      "description": "Lanza dados virtuales en línea de forma sencilla.",
      "seo_title": "Tirador de Dados Virtual en Línea Gratis",
      "seo_description": "Lance dados virtuales en línea. Soporta dados D4, D6, D8, D10, D12, D20, D100 y dados personalizados para juegos de rol."
    },
    "pt": {
      "name": "Rolo de Dados",
      "description": "Jogue dados virtuais para RPG e tabuleiro.",
      "seo_title": "Lançador de Dados Virtual Online - Rodar Dados",
      "seo_description": "Jogue dados virtuais no navegador. Suporte para dados D4, D6, D8, D10, D12, D20, D100 e customizados para RPG, jogos de tabuleiro e decisões aleatórias de forma rápida."
    },
    "ja": {
      "name": "ダイスローラー",
      "description": "ネット上でサイコロを振れるツール。TRPGやボードゲームに最適。",
      "seo_title": "無料オンラインサイコロ振りツール - 100面ダイス対応",
      "seo_description": "ネット上でサイコロを振れるツール。D4、D6、D10、D20、D100やカスタムダイスに対応し，ボードゲームやTRPGのダイスロールに最適です。"
    },
    "ru": {
      "name": "Кубик Роллер",
      "description": "Бросайте виртуальные кости онлайн для настольных игр и RPG.",
      "seo_title": "Виртуальный бросок кубика онлайн - Генератор",
      "seo_description": "Бросайте виртуальные кости онлайн. Поддержка D4, D6, D8, D10, D20, D100 и пользовательских кубиков для настольных игр и RPG."
    },
    "fr": {
      "name": "Roulette de Dés",
      "description": "Lancez des dés virtuels en ligne pour vos jeux de société.",
      "seo_title": "Lanceur de dés virtuel en ligne gratuit - Dés JDR",
      "seo_description": "Lancez des dés virtuels en ligne. Compatible D4, D6, D8, D10, D20, D100 et dés personnalisés pour vos jeux de société et JDR."
    },
    "ar": {
      "name": "رمي النرد",
      "description": "قم برمي النرد الافتراضي على الإنترنت لمختلف ألعاب الطاولة",
      "seo_title": "رمي النرد الافتراضي - محاكي النرد أونلاين",
      "seo_description": "قم برمي النرد الافتراضي على الإنترنت. يدعم نرد D6 و D20 و D100 وغيرها من الأنواع المخصصة لألعاب الطاولة والألعاب اللوحية."
    },
    "de": {
      "name": "Würfelwerfer",
      "description": "Werfen Sie virtuelle Würfel für Brettspiele.",
      "seo_title": "Würfelroller Online - Virtueller Würfelbecher",
      "seo_description": "Würfeln Sie im Browser mit virtuellen Würfeln (D4, D6, D8, D10, D12, D20, D100) für Rollenspiele, Brettspiele und Zufallsentscheidungen."
    },
    "ko": {
      "name": "주사위 굴리기",
      "description": "가상 주사위를 온라인에서 간편하게 굴려보세요.",
      "seo_title": "가상 주사위 굴리기 - D6 D20 D100",
      "seo_description": "가상 주사위를 온라인에서 간편하게 굴려보세요. D4, D6, D8, D10, D20, D100 및 사용자 지정 주사위를 지원하여 보드게임에 좋습니다."
    }
  },
  "credit-card-validator": {
    "en": {
      "name": "Credit Card Validator",
      "description": "Validate credit card numbers online. Perform Luhn algorithm check and identify issuer networks like Visa, Mastercard, and Amex.",
      "seo_title": "Free Credit Card Validator Online - Luhn Check",
      "seo_description": "Validate credit card numbers online. Perform Luhn algorithm check and identify issuer networks like Visa, Mastercard, and Amex."
    },
    "zh": {
      "name": "信用卡验证器",
      "description": "在线验证信用卡卡号，采用卢恩算法校验，快速检测卡号格式是否正确。",
      "seo_title": "免费在线信用卡验证器 - 检查卡号格式与校验位",
      "seo_description": "免费在线信用卡验证器。采用卢恩算法，快速检测卡号格式与校验位以拦截并标识无效卡号，支持主流发卡组织校验，所有计算均在本地安全完成。"
    },
    "es": {
      "name": "Validador de Tarjetas de Crédito",
      "description": "Valide números de tarjetas de crédito en línea de forma rápida.",
      "seo_title": "Validador de Tarjetas de Crédito Online - Algoritmo Luhn",
      "seo_description": "Valide números de tarjetas de crédito en línea. Compruebe mediante el algoritmo de Luhn e identifique emisores como Visa o Mastercard."
    },
    "pt": {
      "name": "Validador de Cartões de Crédito",
      "description": "Valide números de cartão de crédito no navegador.",
      "seo_title": "Validador de Cartão de Crédito Online - Teste Luhn",
      "seo_description": "Valide números de cartão de crédito no navegador. Verifique com o algoritmo de Luhn e identifique bandeiras como Visa e Mastercard de forma segura e 100% local."
    },
    "ja": {
      "name": "クレジットカード検証ツール",
      "description": "クレジットカード番号が正しいかLuhnアルゴリズムを用いて検証",
      "seo_title": "クレジットカード番号有効性チェック - Luhn",
      "seo_description": "クレジットカード番号が正しいかLuhnアルゴリズムを用いて検証し、VisaやMastercardなどのカード種別を自動判别します。"
    },
    "ru": {
      "name": "Проверщик кредитных карт",
      "description": "Проверьте правильность номера кредитной карты онлайн по алгоритму Луна",
      "seo_title": "Валидатор кредитных карт онлайн - Алгоритм Луна",
      "seo_description": "Проверьте правильность номера кредитной карты онлайн по алгоритму Луна и определите платежную систему (Visa, Mastercard, Amex)."
    },
    "fr": {
      "name": "Validateur de Carte de Crédit",
      "description": "Validez les numéros de cartes bancaires en ligne facilement.",
      "seo_title": "Validateur de carte de crédit en ligne - Formule de Luhn",
      "seo_description": "Validez les numéros de cartes bancaires en ligne. Vérification par l'algorithme de Luhn et détection des réseaux Visa, Mastercard, Amex."
    },
    "ar": {
      "name": "مدقق بطاقات الائتمان",
      "description": "تحقق من صحة أرقام بطاقات الائتمان والخصم مجاناً باستخدام صيغة لوهن",
      "seo_title": "مدقق بطاقات الائتمان - فحص صيغة لوهن أونلاين",
      "seo_description": "تحقق من صحة أرقام بطاقات الائتمان والخصم مجاناً باستخدام صيغة لوهن اللوغاريتمية والتعرف على نوع البطاقة مثل فيزا وماستركارد."
    },
    "de": {
      "name": "Kreditkarten-Validierer",
      "description": "Überprüfen Sie Kreditkartennummern per Luhn.",
      "seo_title": "Kreditkarten Validierer - Luhn Prüfung Online",
      "seo_description": "Überprüfen Sie Kreditkartennummern im Browser. Führen Sie die Luhn-Prüfung durch und identifizieren Sie Anbieter wie Visa und Mastercard absolut sicher und lokal."
    },
    "ko": {
      "name": "신용카드 유효성 검사기",
      "description": "신용카드 및 체크카드 번호를 룬(Luhn) 알고리즘으로 검증",
      "seo_title": "신용카드 번호 검증기 - 룬 알고리즘",
      "seo_description": "신용카드 및 체크카드 번호를 룬(Luhn) 알고리즘으로 검증하고, 비자, 마스터카드, 아멕스 등의 브랜드를 식별해 줍니다. 개인정보는 로컬에서만 처리되어 안전합니다."
    }
  },
  "timeline-chart-generator": {
    "en": {
      "name": "Timeline Chart Generator",
      "description": "Create customized timeline charts online. Visualize history, project milestones, and event schedules with beautiful styles.",
      "seo_title": "Free Online Timeline Chart Generator",
      "seo_description": "Create customized timeline charts online. Visualize history, project milestones, and event schedules with beautiful styles."
    },
    "zh": {
      "name": "时间线图表生成器",
      "description": "输入数据即可快速生成精美的项目里程碑、历史事件和流程时间轴并导出图表。",
      "seo_title": "免费在线时间线图表生成器 - 绘制项目与事件时间线",
      "seo_description": "免费在线时间线图表生成器，输入数据即可快速生成精美的项目里程碑、历史事件和流程时间轴并导出图表，支持多种样式与颜色自定义，本地处理高效安全。"
    },
    "es": {
      "name": "Generador de gráficos de línea de tiempo",
      "description": "Diseñe líneas de tiempo interactivas en línea para sus proyectos.",
      "seo_title": "Generador de Gráficos de Líneas de Tiempo Gratis",
      "seo_description": "Diseñe líneas de tiempo interactivas en línea. Visualice hitos de proyectos, eventos históricos y planes de trabajo fácilmente."
    },
    "pt": {
      "name": "Gerador de Linhas do Tempo",
      "description": "Crie linhas do tempo personalizadas.",
      "seo_title": "Gerador de Gráfico de Linha do Tempo Online Grátis",
      "seo_description": "Crie gráficos de linha do tempo personalizados no navegador. Visualize marcos de projetos, eventos históricos e planejamentos de tarefas com facilidade e rapidez."
    },
    "ja": {
      "name": "タイムライン作成",
      "description": "歴史年表やプロジェクトのマイルストーンなどの出来事を簡単にビジュアル化",
      "seo_title": "無料タイムラインチャート作成ツール - 年表作成",
      "seo_description": "歴史年表やプロジェクトのマイルストーン、出来事のタイムラインをブラウザ上で簡単に可視化できます。カスタムテーマや画像のダウンロードにも対応。"
    },
    "ru": {
      "name": "Генератор хронологических графиков",
      "description": "Создавайте интерактивные временные шкалы онлайн для визуализации хронологии",
      "seo_title": "Онлайн генератор временной шкалы - Создание хронологий",
      "seo_description": "Создавайте интерактивные временные шкалы онлайн для визуализации хронологии событий, этапов проекта и истории."
    },
    "fr": {
      "name": "Générateur de chronologies",
      "description": "Créez de magnifiques frises chronologiques en ligne facilement.",
      "seo_title": "Générateur de frise chronologique gratuit en ligne",
      "seo_description": "Créez de magnifiques frises chronologiques en ligne. Visualisez les étapes clés d'un projet, l'histoire et vos plannings."
    },
    "ar": {
      "name": "مجمع رسم الجداول الزمنية",
      "description": "صمم خطوطاً زمنية ومخططات تاريخية وجداول لمشاريعك بسهولة",
      "seo_title": "مخطط الخط الزمني أونلاين - مصمم الجداول الزمنية",
      "seo_description": "صمم خطوطاً زمنية ومخططات تاريخية وجداول لمشاريعك بسهولة. أداة تفاعلية ومجانية تماماً لتنظيم الأحداث وتصديرها بصور عالية الجودة بأمان."
    },
    "de": {
      "name": "Zeitstrahl-Planer",
      "description": "Individuelle Zeitachsen und Zeitleisten erstellen.",
      "seo_title": "Zeitstrahl Generator Online - Kostenlose Zeitleisten",
      "seo_description": "Erstellen Sie individuelle Zeitachsen und Zeitleisten im Browser. Visualisieren Sie Projektmeilensteine und historische Abläufe mit anpassbaren Farbthemen."
    },
    "ko": {
      "name": "타임라인 차트 생성기",
      "description": "프로젝트 마일스트론, 역사적 사건 연표 등을 위한 개인 맞춤형 타임라인 차트",
      "seo_title": "무료 온라인 타임라인 차트 생성기 - 연표 만들기",
      "seo_description": "프로젝트 마일스트론, 역사적 사건 연표, 일정 관리 등을 위한 개인 맞춤형 타임라인 차트를 실시간으로 작성하고 저장하세요. 다양한 색상 테마와 이미지 내보내기 지원."
    }
  },
  "mortgage-calculator": {
    "en": {
      "name": "Mortgage Calculator",
      "description": "Estimate monthly mortgage payments, including interest, principal, taxes, and amortization schedules.",
      "seo_title": "Mortgage Calculator - Home Loan Payment Calculator",
      "seo_description": "Estimate monthly mortgage payments, including interest, principal, taxes, and amortization schedules. Calculate home loan cost easily."
    },
    "zh": {
      "name": "房贷计算器",
      "description": "输入贷款总额、利率及年限，一键计算等额本息与等额本金还款的月供明细。",
      "seo_title": "免费在线房贷计算器 - 计算月供与还款计划",
      "seo_description": "免费房贷计算器，输入贷款总额、利率及年限，一键计算等额本息与等额本金还款的月供明细、利息总额及还款计划表，是您购房理财的得力工具。"
    },
    "es": {
      "name": "Calculadora de Préstamos Hipotecarios",
      "description": "Calcule la cuota mensual de su hipoteca y consulte el cuadro de amortización.",
      "seo_title": "Calculadora de Hipoteca Gratis - Cuota Mensual",
      "seo_description": "Calcule la cuota mensual de su hipoteca y consulte el cuadro de amortización completo con intereses y desglose del préstamo."
    },
    "pt": {
      "name": "Calculadora de Empréstimo Imobiliário",
      "description": "Calcule as parcelas mensais do seu financiamento imobiliário.",
      "seo_title": "Calculadora de Hipoteca Online - Simular Financiamento",
      "seo_description": "Calcule as parcelas mensais do seu financiamento imobiliário e consulte a tabela de amortização com juros e saldo devedor."
    },
    "ja": {
      "name": "住宅ローン計算ツール",
      "description": "毎月の返済額や金利負担分、元金返済推移などの返済シミュレーション",
      "seo_title": "住宅ローン計算ツール - 返済シミュレーション",
      "seo_description": "借入額、金利、返済期間から毎月の返済額や金利負担分、元金返済推移などの返済シミュレーションが簡単にできる計算ツールです。資金計画に役立ちます。"
    },
    "ru": {
      "name": "Калькулятор ипотеки",
      "description": "Рассчитайте ежемесячный платеж по ипотеке, переплату по процентам и график платежей",
      "seo_title": "Калькулятор ипотеки онлайн - Расчет платежей",
      "seo_description": "Рассчитайте ежемесячный платеж по ипотеке, переплату по процентам и график платежей на основе процентной ставки и срока."
    },
    "fr": {
      "name": "Calculatrice d'emprunt immobilier",
      "description": "Simulez votre crédit immobilier gratuitement et calculez les mensualités.",
      "seo_title": "Calculateur de prêt immobilier - Tableau d'amortissement",
      "seo_description": "Simulez votre crédit immobilier gratuitement. Calculez les mensualités, le coût des intérêts et visualisez le tableau d'amortissement."
    },
    "ar": {
      "name": "حاسبة الرهن العقاري",
      "description": "احسب الأقساط الشهرية للقروض العقارية والرهونات وقيمة الفوائد المستحقة",
      "seo_title": "حاسبة القروض العقارية والرهن - جدول الاستهلاك",
      "seo_description": "احسب الأقساط الشهرية للقروض العقارية والرهونات وقيمة الفوائد المستحقة وجدول سداد أصل القرض بطريقة سهلة وواضحة."
    },
    "de": {
      "name": "Kreditrechner",
      "description": "Berechnen Sie die monatliche Rate für Ihren Hauskredit.",
      "seo_title": "Hypothekenrechner Online - Tilgungsplan berechnen",
      "seo_description": "Berechnen Sie die monatliche Rate für Ihren Hauskredit. Ermitteln Sie Zinsen, Tilgung und den gesamten Tilgungsplan im Browser für eine sichere Baufinanzierung."
    },
    "ko": {
      "name": "저축성 상환 계산기",
      "description": "대출 원금, 금리, 기간을 설정하여 매달 갚아야 할 원금과 이자를 계산",
      "seo_title": "주택담보대출 계산기 - 월 상환액 계산",
      "seo_description": "대출 원금, 금리, 기간을 설정하여 매달 갚아야 할 원금과 이자, 상환 계획표 및 대출 관련 비용을 손쉽게 계산해 보세요. 스마트한 내 집 마련을 돕습니다."
    }
  },
  "bra-size-calculator": {
    "en": {
      "name": "Bra Size Calculator",
      "description": "Find your perfect bra size with our easy online calculator. Supports UK, US, EU, and international size conversion.",
      "seo_title": "Free Bra Size Calculator and Size Converter",
      "seo_description": "Find your perfect bra size with our easy online calculator. Supports UK, US, EU, and international size conversion."
    },
    "zh": {
      "name": "胸罩尺码计算器",
      "description": "只需输入上胸围和下胸围尺寸，即可智能推荐您的完美罩杯及不同国家尺码标准转换。",
      "seo_title": "免费在线胸罩尺码计算器 - 计算罩杯和下胸围",
      "seo_description": "免费胸罩尺码计算器，输入上胸围和下胸围，智能测算推荐完美罩杯，提供姐妹尺码与胸围尺码表查询，并支持英国、美国、欧洲等不同国家标准的一键转换。"
    },
    "es": {
      "name": "Calculadora de Talla de Sujetador",
      "description": "Encuentre su talla de sujetador ideal midiendo el busto y contorno.",
      "seo_title": "Calculadora de Talla de Sujetador - Conversor de Tallas",
      "seo_description": "Encuentre su talla de sujetador ideal midiendo el busto y contorno. Conversor de tallas internacionales (ES, FR, UK, US, EU)."
    },
    "pt": {
      "name": "Calculadora de Tamanho de Sutiã",
      "description": "Descubra o tamanho ideal de sutiã medindo o busto e tórax.",
      "seo_title": "Calculadora de Tamanho de Sutiã - Medir Busto",
      "seo_description": "Descubra o tamanho ideal de sutiã medindo o busto e tórax no navegador. Conversor de medidas internacional (BR, US, UK, EU) para encontrar a lingerie perfeita."
    },
    "ja": {
      "name": "ブラサイズ計算機",
      "description": "トップバストとアンダーバストのサイズから、カップ数とアンダーサイズを測定",
      "seo_title": "ブラサイズ計算機 - 下着サイズ測定と変換",
      "seo_description": "トップバストとアンダーバストのサイズから、カップ数とアンダーサイズを測定し、各国のブラサイズ規格（日本、アメリカ、イギリス、欧州）へ自動変換します。"
    },
    "ru": {
      "name": "Калькулятор размера бюстгальтера",
      "description": "Определите идеальный размер бюстгальтера по обхвату груди и под грудью",
      "seo_title": "Калькулятор размера бюстгальтера - Таблица размеров",
      "seo_description": "Определите идеальный размер бюстгальтера по обхвату груди и под грудью в браузере. Удобный конвертер международных размеров (RU, EU, US, UK) для покупки белья."
    },
    "fr": {
      "name": "Calculateur de Taille de Soutien-gorge",
      "description": "Calculez votre taille de soutien-gorge idéale à partir de vos mensurations.",
      "seo_title": "Calculateur de Taille de Soutien-Gorge",
      "seo_description": "Calculez votre taille de soutien-gorge idéale à partir de vos mensurations dans le navigateur. Guide des tailles internationales (FR, EU, US, UK) pour vos achats."
    },
    "ar": {
      "name": "حاسبة مقاس حمالة الصدر",
      "description": "اعرفي مقاس حمالة الصدر المناسب لكِ عن طريق إدخال مقاس الصدر وتحت الصدر",
      "seo_title": "حاسبة مقاس الصدر وحمالة الصدر - دليل المقاسات",
      "seo_description": "اعرفي مقاس حمالة الصدر المناسب لكِ عن طريق إدخال مقاس الصدر وتحت الصدر في المتصفح. محول مقاسات الصدر العالمية بكل سهولة."
    },
    "de": {
      "name": "BH-Größen-Rechner",
      "description": "Berechnen Sie Ihre genaue BH-Größe und Körbchengröße.",
      "seo_title": "BH Größen Rechner - BH Größe berechnen",
      "seo_description": "Berechnen Sie Ihre genaue BH-Größe und Körbchengröße anhand von Unterbrust- und Brustumfang im Browser. Inklusive praktischer internationaler Größentabellen."
    },
    "ko": {
      "name": "브라 사이즈 계산기",
      "description": "윗가슴둘레와 밑가슴둘레 치수를 바탕으로 알맞은 가슴 사이즈를 확인",
      "seo_title": "가슴 사이즈 측정기 - 브라 사이즈 계산기",
      "seo_description": "윗가슴둘레와 밑가슴둘레 치수를 바탕으로 알맞은 컵 사이즈를 추천하고 한국, 미국, 영국, 유럽 등 국가별 브라 사이즈 환산 정보를 편리하게 제공합니다."
    }
  },
  "random-color-generator": {
    "en": {
      "name": "Random Color Generator",
      "description": "Generate random colors and palettes online. Support HEX, RGB, HSL, HSV formats. Copy colors with a single click.",
      "seo_title": "Free Random Color Generator Online - HEX RGB HSL Palette",
      "seo_description": "Generate random colors and palettes online. Support HEX, RGB, HSL, HSV formats. Copy colors with a single click."
    },
    "zh": {
      "name": "随机颜色生成器",
      "description": "在线随机生成颜色和配色调色板，提供 HEX、RGB、HSL 等格式。",
      "seo_title": "免费在线随机颜色生成器 - 生成 HEX RGB 颜色值",
      "seo_description": "免费在线随机颜色生成器，支持一键生成单个颜色或配色调色板，提供 HEX、RGB 等格式一键复制，适合网页设计和UI开发."
    },
    "es": {
      "name": "Generador de Colores Aleatorios",
      "description": "Genere colores y paletas aleatorias en línea.",
      "seo_title": "Generador de Colores Aleatorios - Paletas de Color",
      "seo_description": "Genere colores y paletas aleatorias en línea. Obtenga códigos en formato HEX, RGB y HSL para diseño web con un solo clic."
    },
    "pt": {
      "name": "Gerador de Cores Aleatórias",
      "description": "Gere cores e paletas de cores aleatórias no navegador.",
      "seo_title": "Gerador de Cores Aleatórias - Criar Paletas",
      "seo_description": "Gere cores e paletas de cores aleatórias no navegador. Obtenha códigos nos formatos HEX, RGB e HSL para design e desenvolvimento e copie com apenas um clique."
    },
    "ja": {
      "name": "ランダムカラージェネレーター",
      "description": "クリックするだけでランダムにカラーやパレットを生成します",
      "seo_title": "ランダムカラー作成ツール - 配色生成",
      "seo_description": "クリックするだけでランダムにカラーやパレットを生成します。HEX、RGB、HSL、HSVなどのカラーコード表示とワンクリックでのコピーに対応したツール。"
    },
    "ru": {
      "name": "Генератор случайных цветов",
      "description": "Создавайте случайные цвета и палитры онлайн",
      "seo_title": "Генератор случайных цветов - Создание палитры",
      "seo_description": "Создавайте случайные цвета и палитры онлайн. Поддержка кодов HEX, RGB, HSL и копирование цвета одним кликом для дизайна."
    },
    "fr": {
      "name": "Générateur de Couleurs Aléatoires",
      "description": "Générez des couleurs et des palettes de couleurs aléatoires en ligne.",
      "seo_title": "Générateur de Couleurs Aléatoires - Palettes HEX RGB",
      "seo_description": "Générez des couleurs et des palettes de couleurs aléatoires en ligne. Copiez en un clic les formats HEX, RGB, HSL pour le web."
    },
    "ar": {
      "name": "مولد ألوان عشوائية",
      "description": "قم بإنشاء ألوان ولوحات ألوان عشوائية فوراً",
      "seo_title": "مولد ألوان عشوائية - لوحات الألوان HEX و RGB",
      "seo_description": "قم بإنشاء ألوان ولوحات ألوان عشوائية فوراً. احصل على رموز الألوان بصيغة HEX و RGB و HSL بنقرة واحدة للتصميم والويب."
    },
    "de": {
      "name": "Zufallsfarben-Generator",
      "description": "Generieren Sie zufällige Farben und Farbpaletten im Browser.",
      "seo_title": "Zufallsfarben Generator - Farbcodes kopieren",
      "seo_description": "Generieren Sie zufällige Farben und Farbpaletten im Browser. Unterstützt HEX, RGB, HSL und HVS. Kopieren Sie Farbcodes mit einem Klick für Webdesign und Entwicklung."
    },
    "ko": {
      "name": "랜덤 색상 생성기",
      "description": "클릭 한 번으로 무작위 색상과 배색 팔레트를 실시간으로 생성",
      "seo_title": "랜덤 색상 생성기 - HEX RGB 팔레트",
      "seo_description": "클릭 한 번으로 무작위 색상과 배색 팔레트를 실시간으로 만들어 줍니다. HEX, RGB, HSL, HSV 코드 제공 및 원클릭 복사를 지원하여 개발과 디자인에 유용합니다."
    }
  }
};

function updateFile(filePath: string, locale: string) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const messages = JSON.parse(rawContent);
  let updatedCount = 0;
  
  for (const [slug, opt] of Object.entries(OPTIMIZED_TDK)) {
    const localeOpt = opt[locale];
    if (!localeOpt) {
      continue;
    }
    
    let updated = false;
    
    // Check if tools exists and has the slug
    if (messages.tools && messages.tools[slug]) {
      messages.tools[slug].name = localeOpt.name;
      messages.tools[slug].description = localeOpt.description;
      messages.tools[slug].seo_title = localeOpt.seo_title;
      messages.tools[slug].seo_description = localeOpt.seo_description;
      updated = true;
    }
    
    // Check if tool exists and has the slug
    if (messages.tool && messages.tool[slug]) {
      messages.tool[slug].name = localeOpt.name;
      messages.tool[slug].description = localeOpt.description;
      messages.tool[slug].seo_title = localeOpt.seo_title;
      messages.tool[slug].seo_description = localeOpt.seo_description;
      updated = true;
    }
    
    // Fallback: If neither exists and it is base.json, create it under tools
    if (!updated && filePath.endsWith('base.json')) {
      if (!messages.tools) {
        messages.tools = {};
      }
      messages.tools[slug] = {
        ...messages.tools[slug],
        name: localeOpt.name,
        description: localeOpt.description,
        seo_title: localeOpt.seo_title,
        seo_description: localeOpt.seo_description
      };
      updated = true;
    }
    
    if (updated) {
      updatedCount++;
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(messages, null, 2) + '\n', 'utf-8');
  console.log(`Updated ${updatedCount} tools in ${filePath}`);
}

function main() {
  console.log('Applying optimized TDK metadata to base.json and root locale files...');
  
  for (const locale of LOCALES) {
    const baseFilePath = path.join(process.cwd(), 'src/messages', locale, 'base.json');
    updateFile(baseFilePath, locale);
    
    const rootFilePath = path.join(process.cwd(), 'src/messages', `${locale}.json`);
    updateFile(rootFilePath, locale);
  }
  
  console.log('All locale files updated successfully.');
}

main();
