/**
 * 批量添加缺失的 UI 翻译键
 */
const fs = require('fs');

const languages = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 定义所有需要添加的翻译
const translations = {
  // resume-builder
  'resume-builder': {
    en: { summary: 'Summary', experience: 'Experience', present: 'Present', education: 'Education', skills: 'Skills', languages: 'Languages', accentColor: 'Accent Color', personalInfo: 'Personal Info', summaryPlaceholder: 'Write a brief summary...', addExperience: 'Add Experience', company: 'Company', position: 'Position', addEducation: 'Add Education', school: 'School', degree: 'Degree', addSkill: 'Add Skill', noSkills: 'No skills added', addLanguage: 'Add Language', 'templates.professional': 'Professional', 'templates.minimal': 'Minimal', 'templates.creative': 'Creative', 'placeholders.name': 'Your Name', 'placeholders.title': 'Job Title', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+1 234 567 890', 'placeholders.location': 'City, Country', 'placeholders.website': 'website.com' },
    zh: { summary: '个人简介', experience: '工作经历', present: '至今', education: '教育背景', skills: '技能', languages: '语言', accentColor: '主题色', personalInfo: '个人信息', summaryPlaceholder: '写一段简短的自我介绍...', addExperience: '添加工作经历', company: '公司', position: '职位', addEducation: '添加教育经历', school: '学校', degree: '学位', addSkill: '添加技能', noSkills: '暂无技能', addLanguage: '添加语言', 'templates.professional': '专业', 'templates.minimal': '简约', 'templates.creative': '创意', 'placeholders.name': '您的姓名', 'placeholders.title': '职位头衔', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+86 123 4567 8900', 'placeholders.location': '城市, 国家', 'placeholders.website': 'website.com' },
    ja: { summary: '概要', experience: '職歴', present: '現在', education: '学歴', skills: 'スキル', languages: '言語', accentColor: 'アクセントカラー', personalInfo: '個人情報', summaryPlaceholder: '簡単な自己紹介を書いてください...', addExperience: '職歴を追加', company: '会社', position: '役職', addEducation: '学歴を追加', school: '学校', degree: '学位', addSkill: 'スキルを追加', noSkills: 'スキルなし', addLanguage: '言語を追加', 'templates.professional': 'プロフェッショナル', 'templates.minimal': 'ミニマル', 'templates.creative': 'クリエイティブ', 'placeholders.name': 'お名前', 'placeholders.title': '職種', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+81 90 1234 5678', 'placeholders.location': '都市, 国', 'placeholders.website': 'website.com' },
    ko: { summary: '요약', experience: '경력', present: '현재', education: '학력', skills: '기술', languages: '언어', accentColor: '강조 색상', personalInfo: '개인 정보', summaryPlaceholder: '간단한 자기소개를 작성하세요...', addExperience: '경력 추가', company: '회사', position: '직위', addEducation: '학력 추가', school: '학교', degree: '학위', addSkill: '기술 추가', noSkills: '기술 없음', addLanguage: '언어 추가', 'templates.professional': '전문가', 'templates.minimal': '미니멀', 'templates.creative': '크리에이티브', 'placeholders.name': '이름', 'placeholders.title': '직함', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+82 10 1234 5678', 'placeholders.location': '도시, 국가', 'placeholders.website': 'website.com' },
    es: { summary: 'Resumen', experience: 'Experiencia', present: 'Presente', education: 'Educación', skills: 'Habilidades', languages: 'Idiomas', accentColor: 'Color de acento', personalInfo: 'Información personal', summaryPlaceholder: 'Escribe un breve resumen...', addExperience: 'Agregar experiencia', company: 'Empresa', position: 'Puesto', addEducation: 'Agregar educación', school: 'Escuela', degree: 'Título', addSkill: 'Agregar habilidad', noSkills: 'Sin habilidades', addLanguage: 'Agregar idioma', 'templates.professional': 'Profesional', 'templates.minimal': 'Minimalista', 'templates.creative': 'Creativo', 'placeholders.name': 'Tu nombre', 'placeholders.title': 'Título del puesto', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+34 612 345 678', 'placeholders.location': 'Ciudad, País', 'placeholders.website': 'website.com' },
    pt: { summary: 'Resumo', experience: 'Experiência', present: 'Presente', education: 'Educação', skills: 'Habilidades', languages: 'Idiomas', accentColor: 'Cor de destaque', personalInfo: 'Informações pessoais', summaryPlaceholder: 'Escreva um breve resumo...', addExperience: 'Adicionar experiência', company: 'Empresa', position: 'Cargo', addEducation: 'Adicionar educação', school: 'Escola', degree: 'Grau', addSkill: 'Adicionar habilidade', noSkills: 'Sem habilidades', addLanguage: 'Adicionar idioma', 'templates.professional': 'Profissional', 'templates.minimal': 'Minimalista', 'templates.creative': 'Criativo', 'placeholders.name': 'Seu nome', 'placeholders.title': 'Cargo', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+55 11 91234 5678', 'placeholders.location': 'Cidade, País', 'placeholders.website': 'website.com' },
    fr: { summary: 'Résumé', experience: 'Expérience', present: 'Présent', education: 'Formation', skills: 'Compétences', languages: 'Langues', accentColor: 'Couleur d\'accent', personalInfo: 'Informations personnelles', summaryPlaceholder: 'Écrivez un bref résumé...', addExperience: 'Ajouter une expérience', company: 'Entreprise', position: 'Poste', addEducation: 'Ajouter une formation', school: 'École', degree: 'Diplôme', addSkill: 'Ajouter une compétence', noSkills: 'Aucune compétence', addLanguage: 'Ajouter une langue', 'templates.professional': 'Professionnel', 'templates.minimal': 'Minimaliste', 'templates.creative': 'Créatif', 'placeholders.name': 'Votre nom', 'placeholders.title': 'Titre du poste', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+33 6 12 34 56 78', 'placeholders.location': 'Ville, Pays', 'placeholders.website': 'website.com' },
    de: { summary: 'Zusammenfassung', experience: 'Erfahrung', present: 'Gegenwart', education: 'Bildung', skills: 'Fähigkeiten', languages: 'Sprachen', accentColor: 'Akzentfarbe', personalInfo: 'Persönliche Informationen', summaryPlaceholder: 'Schreiben Sie eine kurze Zusammenfassung...', addExperience: 'Erfahrung hinzufügen', company: 'Unternehmen', position: 'Position', addEducation: 'Bildung hinzufügen', school: 'Schule', degree: 'Abschluss', addSkill: 'Fähigkeit hinzufügen', noSkills: 'Keine Fähigkeiten', addLanguage: 'Sprache hinzufügen', 'templates.professional': 'Professionell', 'templates.minimal': 'Minimalistisch', 'templates.creative': 'Kreativ', 'placeholders.name': 'Ihr Name', 'placeholders.title': 'Berufsbezeichnung', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+49 170 1234567', 'placeholders.location': 'Stadt, Land', 'placeholders.website': 'website.com' },
    ru: { summary: 'Резюме', experience: 'Опыт работы', present: 'По настоящее время', education: 'Образование', skills: 'Навыки', languages: 'Языки', accentColor: 'Акцентный цвет', personalInfo: 'Личная информация', summaryPlaceholder: 'Напишите краткое резюме...', addExperience: 'Добавить опыт', company: 'Компания', position: 'Должность', addEducation: 'Добавить образование', school: 'Учебное заведение', degree: 'Степень', addSkill: 'Добавить навык', noSkills: 'Нет навыков', addLanguage: 'Добавить язык', 'templates.professional': 'Профессиональный', 'templates.minimal': 'Минималистичный', 'templates.creative': 'Креативный', 'placeholders.name': 'Ваше имя', 'placeholders.title': 'Должность', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+7 999 123 45 67', 'placeholders.location': 'Город, Страна', 'placeholders.website': 'website.com' },
    ar: { summary: 'ملخص', experience: 'الخبرة', present: 'حتى الآن', education: 'التعليم', skills: 'المهارات', languages: 'اللغات', accentColor: 'لون التمييز', personalInfo: 'المعلومات الشخصية', summaryPlaceholder: 'اكتب ملخصًا موجزًا...', addExperience: 'إضافة خبرة', company: 'الشركة', position: 'المنصب', addEducation: 'إضافة تعليم', school: 'المدرسة', degree: 'الدرجة', addSkill: 'إضافة مهارة', noSkills: 'لا توجد مهارات', addLanguage: 'إضافة لغة', 'templates.professional': 'احترافي', 'templates.minimal': 'بسيط', 'templates.creative': 'إبداعي', 'placeholders.name': 'اسمك', 'placeholders.title': 'المسمى الوظيفي', 'placeholders.email': 'email@example.com', 'placeholders.phone': '+966 50 123 4567', 'placeholders.location': 'المدينة، البلد', 'placeholders.website': 'website.com' }
  },

  // web-socket-tester
  'web-socket-tester': {
    en: { connected: 'Connected', errorConnection: 'Connection error', errorInvalidUrl: 'Invalid WebSocket URL', serverUrl: 'Server URL', connecting_btn: 'Connecting...', connect: 'Connect', disconnect: 'Disconnect', quickConnect: 'Quick Connect', statusConnected: 'Connected', statusConnecting: 'Connecting', statusDisconnected: 'Disconnected', messages: 'Messages', noMessages: 'No messages yet', messagePlaceholder: 'Enter message...', send: 'Send', note: 'Note', noteText: 'This tool connects to WebSocket servers for testing purposes.' },
    zh: { connected: '已连接', errorConnection: '连接错误', errorInvalidUrl: '无效的 WebSocket URL', serverUrl: '服务器 URL', connecting_btn: '连接中...', connect: '连接', disconnect: '断开', quickConnect: '快速连接', statusConnected: '已连接', statusConnecting: '连接中', statusDisconnected: '已断开', messages: '消息', noMessages: '暂无消息', messagePlaceholder: '输入消息...', send: '发送', note: '注意', noteText: '此工具用于连接 WebSocket 服务器进行测试。' },
    ja: { connected: '接続済み', errorConnection: '接続エラー', errorInvalidUrl: '無効な WebSocket URL', serverUrl: 'サーバー URL', connecting_btn: '接続中...', connect: '接続', disconnect: '切断', quickConnect: 'クイック接続', statusConnected: '接続済み', statusConnecting: '接続中', statusDisconnected: '切断', messages: 'メッセージ', noMessages: 'メッセージなし', messagePlaceholder: 'メッセージを入力...', send: '送信', note: '注意', noteText: 'このツールはWebSocketサーバーへのテスト接続用です。' },
    ko: { connected: '연결됨', errorConnection: '연결 오류', errorInvalidUrl: '잘못된 WebSocket URL', serverUrl: '서버 URL', connecting_btn: '연결 중...', connect: '연결', disconnect: '연결 해제', quickConnect: '빠른 연결', statusConnected: '연결됨', statusConnecting: '연결 중', statusDisconnected: '연결 해제됨', messages: '메시지', noMessages: '메시지 없음', messagePlaceholder: '메시지 입력...', send: '전송', note: '참고', noteText: '이 도구는 WebSocket 서버 테스트용입니다.' },
    es: { connected: 'Conectado', errorConnection: 'Error de conexión', errorInvalidUrl: 'URL de WebSocket inválida', serverUrl: 'URL del servidor', connecting_btn: 'Conectando...', connect: 'Conectar', disconnect: 'Desconectar', quickConnect: 'Conexión rápida', statusConnected: 'Conectado', statusConnecting: 'Conectando', statusDisconnected: 'Desconectado', messages: 'Mensajes', noMessages: 'Sin mensajes', messagePlaceholder: 'Ingrese mensaje...', send: 'Enviar', note: 'Nota', noteText: 'Esta herramienta conecta a servidores WebSocket para pruebas.' },
    pt: { connected: 'Conectado', errorConnection: 'Erro de conexão', errorInvalidUrl: 'URL WebSocket inválida', serverUrl: 'URL do servidor', connecting_btn: 'Conectando...', connect: 'Conectar', disconnect: 'Desconectar', quickConnect: 'Conexão rápida', statusConnected: 'Conectado', statusConnecting: 'Conectando', statusDisconnected: 'Desconectado', messages: 'Mensagens', noMessages: 'Sem mensagens', messagePlaceholder: 'Digite a mensagem...', send: 'Enviar', note: 'Nota', noteText: 'Esta ferramenta conecta a servidores WebSocket para testes.' },
    fr: { connected: 'Connecté', errorConnection: 'Erreur de connexion', errorInvalidUrl: 'URL WebSocket invalide', serverUrl: 'URL du serveur', connecting_btn: 'Connexion...', connect: 'Connecter', disconnect: 'Déconnecter', quickConnect: 'Connexion rapide', statusConnected: 'Connecté', statusConnecting: 'Connexion', statusDisconnected: 'Déconnecté', messages: 'Messages', noMessages: 'Aucun message', messagePlaceholder: 'Entrez le message...', send: 'Envoyer', note: 'Note', noteText: 'Cet outil se connecte aux serveurs WebSocket pour les tests.' },
    de: { connected: 'Verbunden', errorConnection: 'Verbindungsfehler', errorInvalidUrl: 'Ungültige WebSocket-URL', serverUrl: 'Server-URL', connecting_btn: 'Verbinden...', connect: 'Verbinden', disconnect: 'Trennen', quickConnect: 'Schnellverbindung', statusConnected: 'Verbunden', statusConnecting: 'Verbinden', statusDisconnected: 'Getrennt', messages: 'Nachrichten', noMessages: 'Keine Nachrichten', messagePlaceholder: 'Nachricht eingeben...', send: 'Senden', note: 'Hinweis', noteText: 'Dieses Tool verbindet sich mit WebSocket-Servern zum Testen.' },
    ru: { connected: 'Подключено', errorConnection: 'Ошибка подключения', errorInvalidUrl: 'Неверный URL WebSocket', serverUrl: 'URL сервера', connecting_btn: 'Подключение...', connect: 'Подключить', disconnect: 'Отключить', quickConnect: 'Быстрое подключение', statusConnected: 'Подключено', statusConnecting: 'Подключение', statusDisconnected: 'Отключено', messages: 'Сообщения', noMessages: 'Нет сообщений', messagePlaceholder: 'Введите сообщение...', send: 'Отправить', note: 'Примечание', noteText: 'Этот инструмент подключается к серверам WebSocket для тестирования.' },
    ar: { connected: 'متصل', errorConnection: 'خطأ في الاتصال', errorInvalidUrl: 'عنوان WebSocket غير صالح', serverUrl: 'عنوان الخادم', connecting_btn: 'جاري الاتصال...', connect: 'اتصال', disconnect: 'قطع الاتصال', quickConnect: 'اتصال سريع', statusConnected: 'متصل', statusConnecting: 'جاري الاتصال', statusDisconnected: 'غير متصل', messages: 'الرسائل', noMessages: 'لا توجد رسائل', messagePlaceholder: 'أدخل الرسالة...', send: 'إرسال', note: 'ملاحظة', noteText: 'هذه الأداة تتصل بخوادم WebSocket للاختبار.' }
  },

  // package-json-generator
  'package-json-generator': {
    en: { version: 'Version', main: 'Main', author: 'Author', license: 'License', type: 'Type', keywords: 'Keywords', keywordsPlaceholder: 'Enter keywords separated by comma', private: 'Private', scripts: 'Scripts', scriptName: 'Script Name', scriptCommand: 'Command', commonScripts: 'Common Scripts' },
    zh: { version: '版本', main: '入口文件', author: '作者', license: '许可证', type: '类型', keywords: '关键词', keywordsPlaceholder: '输入关键词，用逗号分隔', private: '私有', scripts: '脚本', scriptName: '脚本名称', scriptCommand: '命令', commonScripts: '常用脚本' },
    ja: { version: 'バージョン', main: 'メイン', author: '作者', license: 'ライセンス', type: 'タイプ', keywords: 'キーワード', keywordsPlaceholder: 'カンマ区切りでキーワードを入力', private: 'プライベート', scripts: 'スクリプト', scriptName: 'スクリプト名', scriptCommand: 'コマンド', commonScripts: '一般的なスクリプト' },
    ko: { version: '버전', main: '메인', author: '작성자', license: '라이선스', type: '유형', keywords: '키워드', keywordsPlaceholder: '쉼표로 구분하여 키워드 입력', private: '비공개', scripts: '스크립트', scriptName: '스크립트 이름', scriptCommand: '명령어', commonScripts: '일반 스크립트' },
    es: { version: 'Versión', main: 'Principal', author: 'Autor', license: 'Licencia', type: 'Tipo', keywords: 'Palabras clave', keywordsPlaceholder: 'Ingrese palabras clave separadas por coma', private: 'Privado', scripts: 'Scripts', scriptName: 'Nombre del script', scriptCommand: 'Comando', commonScripts: 'Scripts comunes' },
    pt: { version: 'Versão', main: 'Principal', author: 'Autor', license: 'Licença', type: 'Tipo', keywords: 'Palavras-chave', keywordsPlaceholder: 'Digite palavras-chave separadas por vírgula', private: 'Privado', scripts: 'Scripts', scriptName: 'Nome do script', scriptCommand: 'Comando', commonScripts: 'Scripts comuns' },
    fr: { version: 'Version', main: 'Principal', author: 'Auteur', license: 'Licence', type: 'Type', keywords: 'Mots-clés', keywordsPlaceholder: 'Entrez les mots-clés séparés par des virgules', private: 'Privé', scripts: 'Scripts', scriptName: 'Nom du script', scriptCommand: 'Commande', commonScripts: 'Scripts courants' },
    de: { version: 'Version', main: 'Haupt', author: 'Autor', license: 'Lizenz', type: 'Typ', keywords: 'Schlüsselwörter', keywordsPlaceholder: 'Schlüsselwörter durch Komma getrennt eingeben', private: 'Privat', scripts: 'Skripte', scriptName: 'Skriptname', scriptCommand: 'Befehl', commonScripts: 'Häufige Skripte' },
    ru: { version: 'Версия', main: 'Главный', author: 'Автор', license: 'Лицензия', type: 'Тип', keywords: 'Ключевые слова', keywordsPlaceholder: 'Введите ключевые слова через запятую', private: 'Приватный', scripts: 'Скрипты', scriptName: 'Имя скрипта', scriptCommand: 'Команда', commonScripts: 'Общие скрипты' },
    ar: { version: 'الإصدار', main: 'الرئيسي', author: 'المؤلف', license: 'الترخيص', type: 'النوع', keywords: 'الكلمات المفتاحية', keywordsPlaceholder: 'أدخل الكلمات المفتاحية مفصولة بفاصلة', private: 'خاص', scripts: 'البرامج النصية', scriptName: 'اسم البرنامج النصي', scriptCommand: 'الأمر', commonScripts: 'البرامج النصية الشائعة' }
  },

  // date-calculator
  'date-calculator': {
    en: { dateDiff: 'Date Difference', startDate: 'Start Date', endDate: 'End Date', days: 'Days', weeks: 'Weeks', months: 'Months', years: 'Years', addSubtract: 'Add/Subtract', baseDate: 'Base Date', operation: 'Operation', subtract: 'Subtract' },
    zh: { dateDiff: '日期差', startDate: '开始日期', endDate: '结束日期', days: '天', weeks: '周', months: '月', years: '年', addSubtract: '加减', baseDate: '基准日期', operation: '操作', subtract: '减去' },
    ja: { dateDiff: '日付の差', startDate: '開始日', endDate: '終了日', days: '日', weeks: '週', months: '月', years: '年', addSubtract: '加算/減算', baseDate: '基準日', operation: '操作', subtract: '減算' },
    ko: { dateDiff: '날짜 차이', startDate: '시작 날짜', endDate: '종료 날짜', days: '일', weeks: '주', months: '개월', years: '년', addSubtract: '더하기/빼기', baseDate: '기준 날짜', operation: '연산', subtract: '빼기' },
    es: { dateDiff: 'Diferencia de fechas', startDate: 'Fecha de inicio', endDate: 'Fecha de fin', days: 'Días', weeks: 'Semanas', months: 'Meses', years: 'Años', addSubtract: 'Sumar/Restar', baseDate: 'Fecha base', operation: 'Operación', subtract: 'Restar' },
    pt: { dateDiff: 'Diferença de datas', startDate: 'Data inicial', endDate: 'Data final', days: 'Dias', weeks: 'Semanas', months: 'Meses', years: 'Anos', addSubtract: 'Adicionar/Subtrair', baseDate: 'Data base', operation: 'Operação', subtract: 'Subtrair' },
    fr: { dateDiff: 'Différence de dates', startDate: 'Date de début', endDate: 'Date de fin', days: 'Jours', weeks: 'Semaines', months: 'Mois', years: 'Années', addSubtract: 'Ajouter/Soustraire', baseDate: 'Date de base', operation: 'Opération', subtract: 'Soustraire' },
    de: { dateDiff: 'Datumsunterschied', startDate: 'Startdatum', endDate: 'Enddatum', days: 'Tage', weeks: 'Wochen', months: 'Monate', years: 'Jahre', addSubtract: 'Addieren/Subtrahieren', baseDate: 'Basisdatum', operation: 'Operation', subtract: 'Subtrahieren' },
    ru: { dateDiff: 'Разница дат', startDate: 'Начальная дата', endDate: 'Конечная дата', days: 'Дни', weeks: 'Недели', months: 'Месяцы', years: 'Годы', addSubtract: 'Сложить/Вычесть', baseDate: 'Базовая дата', operation: 'Операция', subtract: 'Вычесть' },
    ar: { dateDiff: 'فرق التاريخ', startDate: 'تاريخ البدء', endDate: 'تاريخ الانتهاء', days: 'أيام', weeks: 'أسابيع', months: 'أشهر', years: 'سنوات', addSubtract: 'إضافة/طرح', baseDate: 'التاريخ الأساسي', operation: 'العملية', subtract: 'طرح' }
  },

  // image-converter
  'image-converter': {
    en: { targetFormat: 'Target Format', quality: 'Quality', converted: 'Converted', convertFirst: 'Convert an image first', processing: 'Processing...', formatInfo: 'Format Info', pngDesc: 'Lossless compression, supports transparency', jpegDesc: 'Lossy compression, smaller file size', webpDesc: 'Modern format, best compression' },
    zh: { targetFormat: '目标格式', quality: '质量', converted: '已转换', convertFirst: '请先转换图片', processing: '处理中...', formatInfo: '格式说明', pngDesc: '无损压缩，支持透明', jpegDesc: '有损压缩，文件更小', webpDesc: '现代格式，压缩最佳' },
    ja: { targetFormat: '出力形式', quality: '品質', converted: '変換済み', convertFirst: '先に画像を変換してください', processing: '処理中...', formatInfo: '形式情報', pngDesc: '可逆圧縮、透明度対応', jpegDesc: '非可逆圧縮、ファイルサイズ小', webpDesc: '最新形式、最高圧縮' },
    ko: { targetFormat: '대상 형식', quality: '품질', converted: '변환됨', convertFirst: '먼저 이미지를 변환하세요', processing: '처리 중...', formatInfo: '형식 정보', pngDesc: '무손실 압축, 투명도 지원', jpegDesc: '손실 압축, 작은 파일 크기', webpDesc: '최신 형식, 최고 압축' },
    es: { targetFormat: 'Formato de destino', quality: 'Calidad', converted: 'Convertido', convertFirst: 'Primero convierte una imagen', processing: 'Procesando...', formatInfo: 'Info del formato', pngDesc: 'Compresión sin pérdida, soporta transparencia', jpegDesc: 'Compresión con pérdida, tamaño menor', webpDesc: 'Formato moderno, mejor compresión' },
    pt: { targetFormat: 'Formato de destino', quality: 'Qualidade', converted: 'Convertido', convertFirst: 'Converta uma imagem primeiro', processing: 'Processando...', formatInfo: 'Info do formato', pngDesc: 'Compressão sem perdas, suporta transparência', jpegDesc: 'Compressão com perdas, tamanho menor', webpDesc: 'Formato moderno, melhor compressão' },
    fr: { targetFormat: 'Format cible', quality: 'Qualité', converted: 'Converti', convertFirst: 'Convertissez d\'abord une image', processing: 'Traitement...', formatInfo: 'Info format', pngDesc: 'Compression sans perte, supporte la transparence', jpegDesc: 'Compression avec perte, taille réduite', webpDesc: 'Format moderne, meilleure compression' },
    de: { targetFormat: 'Zielformat', quality: 'Qualität', converted: 'Konvertiert', convertFirst: 'Konvertieren Sie zuerst ein Bild', processing: 'Verarbeitung...', formatInfo: 'Formatinfo', pngDesc: 'Verlustfreie Kompression, unterstützt Transparenz', jpegDesc: 'Verlustbehaftete Kompression, kleinere Dateigröße', webpDesc: 'Modernes Format, beste Kompression' },
    ru: { targetFormat: 'Целевой формат', quality: 'Качество', converted: 'Конвертировано', convertFirst: 'Сначала конвертируйте изображение', processing: 'Обработка...', formatInfo: 'Информация о формате', pngDesc: 'Сжатие без потерь, поддержка прозрачности', jpegDesc: 'Сжатие с потерями, меньший размер файла', webpDesc: 'Современный формат, лучшее сжатие' },
    ar: { targetFormat: 'التنسيق المستهدف', quality: 'الجودة', converted: 'تم التحويل', convertFirst: 'قم بتحويل صورة أولاً', processing: 'جاري المعالجة...', formatInfo: 'معلومات التنسيق', pngDesc: 'ضغط بدون فقدان، يدعم الشفافية', jpegDesc: 'ضغط مع فقدان، حجم أصغر', webpDesc: 'تنسيق حديث، أفضل ضغط' }
  },

  // ip-lookup
  'ip-lookup': {
    en: { lookup: 'Lookup', myIp: 'My IP', loading: 'Loading...', ipAddress: 'IP Address', country: 'Country', region: 'Region', city: 'City', isp: 'ISP', timezone: 'Timezone', coordinates: 'Coordinates' },
    zh: { lookup: '查询', myIp: '我的 IP', loading: '加载中...', ipAddress: 'IP 地址', country: '国家', region: '地区', city: '城市', isp: '运营商', timezone: '时区', coordinates: '坐标' },
    ja: { lookup: '検索', myIp: '自分のIP', loading: '読み込み中...', ipAddress: 'IPアドレス', country: '国', region: '地域', city: '都市', isp: 'ISP', timezone: 'タイムゾーン', coordinates: '座標' },
    ko: { lookup: '조회', myIp: '내 IP', loading: '로딩 중...', ipAddress: 'IP 주소', country: '국가', region: '지역', city: '도시', isp: 'ISP', timezone: '시간대', coordinates: '좌표' },
    es: { lookup: 'Buscar', myIp: 'Mi IP', loading: 'Cargando...', ipAddress: 'Dirección IP', country: 'País', region: 'Región', city: 'Ciudad', isp: 'ISP', timezone: 'Zona horaria', coordinates: 'Coordenadas' },
    pt: { lookup: 'Pesquisar', myIp: 'Meu IP', loading: 'Carregando...', ipAddress: 'Endereço IP', country: 'País', region: 'Região', city: 'Cidade', isp: 'ISP', timezone: 'Fuso horário', coordinates: 'Coordenadas' },
    fr: { lookup: 'Rechercher', myIp: 'Mon IP', loading: 'Chargement...', ipAddress: 'Adresse IP', country: 'Pays', region: 'Région', city: 'Ville', isp: 'FAI', timezone: 'Fuseau horaire', coordinates: 'Coordonnées' },
    de: { lookup: 'Suchen', myIp: 'Meine IP', loading: 'Laden...', ipAddress: 'IP-Adresse', country: 'Land', region: 'Region', city: 'Stadt', isp: 'ISP', timezone: 'Zeitzone', coordinates: 'Koordinaten' },
    ru: { lookup: 'Поиск', myIp: 'Мой IP', loading: 'Загрузка...', ipAddress: 'IP-адрес', country: 'Страна', region: 'Регион', city: 'Город', isp: 'Провайдер', timezone: 'Часовой пояс', coordinates: 'Координаты' },
    ar: { lookup: 'بحث', myIp: 'عنوان IP الخاص بي', loading: 'جاري التحميل...', ipAddress: 'عنوان IP', country: 'البلد', region: 'المنطقة', city: 'المدينة', isp: 'مزود الخدمة', timezone: 'المنطقة الزمنية', coordinates: 'الإحداثيات' }
  },

  // image-compressor
  'image-compressor': {
    en: { quality: 'Quality', compressed: 'Compressed', saved: 'Saved', compressFirst: 'Compress an image first', processing: 'Processing...', compress: 'Compress', originalSize: 'Original Size', compressedSize: 'Compressed Size', reduction: 'Reduction' },
    zh: { quality: '质量', compressed: '已压缩', saved: '已保存', compressFirst: '请先压缩图片', processing: '处理中...', compress: '压缩', originalSize: '原始大小', compressedSize: '压缩后大小', reduction: '减少' },
    ja: { quality: '品質', compressed: '圧縮済み', saved: '保存済み', compressFirst: '先に画像を圧縮してください', processing: '処理中...', compress: '圧縮', originalSize: '元のサイズ', compressedSize: '圧縮後サイズ', reduction: '削減' },
    ko: { quality: '품질', compressed: '압축됨', saved: '저장됨', compressFirst: '먼저 이미지를 압축하세요', processing: '처리 중...', compress: '압축', originalSize: '원본 크기', compressedSize: '압축 크기', reduction: '감소' },
    es: { quality: 'Calidad', compressed: 'Comprimido', saved: 'Guardado', compressFirst: 'Primero comprime una imagen', processing: 'Procesando...', compress: 'Comprimir', originalSize: 'Tamaño original', compressedSize: 'Tamaño comprimido', reduction: 'Reducción' },
    pt: { quality: 'Qualidade', compressed: 'Comprimido', saved: 'Salvo', compressFirst: 'Comprima uma imagem primeiro', processing: 'Processando...', compress: 'Comprimir', originalSize: 'Tamanho original', compressedSize: 'Tamanho comprimido', reduction: 'Redução' },
    fr: { quality: 'Qualité', compressed: 'Compressé', saved: 'Enregistré', compressFirst: 'Compressez d\'abord une image', processing: 'Traitement...', compress: 'Compresser', originalSize: 'Taille originale', compressedSize: 'Taille compressée', reduction: 'Réduction' },
    de: { quality: 'Qualität', compressed: 'Komprimiert', saved: 'Gespeichert', compressFirst: 'Komprimieren Sie zuerst ein Bild', processing: 'Verarbeitung...', compress: 'Komprimieren', originalSize: 'Originalgröße', compressedSize: 'Komprimierte Größe', reduction: 'Reduzierung' },
    ru: { quality: 'Качество', compressed: 'Сжато', saved: 'Сохранено', compressFirst: 'Сначала сожмите изображение', processing: 'Обработка...', compress: 'Сжать', originalSize: 'Исходный размер', compressedSize: 'Сжатый размер', reduction: 'Уменьшение' },
    ar: { quality: 'الجودة', compressed: 'مضغوط', saved: 'تم الحفظ', compressFirst: 'قم بضغط صورة أولاً', processing: 'جاري المعالجة...', compress: 'ضغط', originalSize: 'الحجم الأصلي', compressedSize: 'الحجم المضغوط', reduction: 'التخفيض' }
  },

  // morse-code
  'morse-code': {
    en: { text: 'Text', toMorse: 'To Morse', textPlaceholder: 'Enter text...', morse: 'Morse', toText: 'To Text', play: 'Play', morsePlaceholder: 'Enter morse code...', reference: 'Reference' },
    zh: { text: '文本', toMorse: '转摩斯码', textPlaceholder: '输入文本...', morse: '摩斯码', toText: '转文本', play: '播放', morsePlaceholder: '输入摩斯码...', reference: '参考' },
    ja: { text: 'テキスト', toMorse: 'モールスへ', textPlaceholder: 'テキストを入力...', morse: 'モールス', toText: 'テキストへ', play: '再生', morsePlaceholder: 'モールス符号を入力...', reference: '参照' },
    ko: { text: '텍스트', toMorse: '모스 부호로', textPlaceholder: '텍스트 입력...', morse: '모스 부호', toText: '텍스트로', play: '재생', morsePlaceholder: '모스 부호 입력...', reference: '참조' },
    es: { text: 'Texto', toMorse: 'A Morse', textPlaceholder: 'Ingrese texto...', morse: 'Morse', toText: 'A texto', play: 'Reproducir', morsePlaceholder: 'Ingrese código morse...', reference: 'Referencia' },
    pt: { text: 'Texto', toMorse: 'Para Morse', textPlaceholder: 'Digite o texto...', morse: 'Morse', toText: 'Para texto', play: 'Reproduzir', morsePlaceholder: 'Digite o código morse...', reference: 'Referência' },
    fr: { text: 'Texte', toMorse: 'Vers Morse', textPlaceholder: 'Entrez le texte...', morse: 'Morse', toText: 'Vers texte', play: 'Jouer', morsePlaceholder: 'Entrez le code morse...', reference: 'Référence' },
    de: { text: 'Text', toMorse: 'Zu Morse', textPlaceholder: 'Text eingeben...', morse: 'Morse', toText: 'Zu Text', play: 'Abspielen', morsePlaceholder: 'Morsecode eingeben...', reference: 'Referenz' },
    ru: { text: 'Текст', toMorse: 'В Морзе', textPlaceholder: 'Введите текст...', morse: 'Морзе', toText: 'В текст', play: 'Воспроизвести', morsePlaceholder: 'Введите код Морзе...', reference: 'Справка' },
    ar: { text: 'النص', toMorse: 'إلى مورس', textPlaceholder: 'أدخل النص...', morse: 'مورس', toText: 'إلى نص', play: 'تشغيل', morsePlaceholder: 'أدخل شفرة مورس...', reference: 'مرجع' }
  },

  // favicon-generator
  'favicon-generator': {
    en: { sizes: 'Sizes', hint: 'Upload a square image for best results', processing: 'Processing...', generated: 'Generated', downloadAll: 'Download All', htmlCode: 'HTML Code' },
    zh: { sizes: '尺寸', hint: '上传正方形图片效果最佳', processing: '处理中...', generated: '已生成', downloadAll: '全部下载', htmlCode: 'HTML 代码' },
    ja: { sizes: 'サイズ', hint: '正方形の画像をアップロードすると最良の結果が得られます', processing: '処理中...', generated: '生成済み', downloadAll: 'すべてダウンロード', htmlCode: 'HTMLコード' },
    ko: { sizes: '크기', hint: '정사각형 이미지를 업로드하면 최상의 결과를 얻을 수 있습니다', processing: '처리 중...', generated: '생성됨', downloadAll: '모두 다운로드', htmlCode: 'HTML 코드' },
    es: { sizes: 'Tamaños', hint: 'Sube una imagen cuadrada para mejores resultados', processing: 'Procesando...', generated: 'Generado', downloadAll: 'Descargar todo', htmlCode: 'Código HTML' },
    pt: { sizes: 'Tamanhos', hint: 'Envie uma imagem quadrada para melhores resultados', processing: 'Processando...', generated: 'Gerado', downloadAll: 'Baixar tudo', htmlCode: 'Código HTML' },
    fr: { sizes: 'Tailles', hint: 'Téléchargez une image carrée pour de meilleurs résultats', processing: 'Traitement...', generated: 'Généré', downloadAll: 'Tout télécharger', htmlCode: 'Code HTML' },
    de: { sizes: 'Größen', hint: 'Laden Sie ein quadratisches Bild für beste Ergebnisse hoch', processing: 'Verarbeitung...', generated: 'Generiert', downloadAll: 'Alle herunterladen', htmlCode: 'HTML-Code' },
    ru: { sizes: 'Размеры', hint: 'Загрузите квадратное изображение для лучших результатов', processing: 'Обработка...', generated: 'Сгенерировано', downloadAll: 'Скачать все', htmlCode: 'HTML-код' },
    ar: { sizes: 'الأحجام', hint: 'قم بتحميل صورة مربعة للحصول على أفضل النتائج', processing: 'جاري المعالجة...', generated: 'تم الإنشاء', downloadAll: 'تحميل الكل', htmlCode: 'كود HTML' }
  },

  // image-cropper
  'image-cropper': {
    en: { aspectRatio: 'Aspect Ratio', selectArea: 'Select Area', changeImage: 'Change Image', preview: 'Preview', cropFirst: 'Crop an image first', crop: 'Crop' },
    zh: { aspectRatio: '宽高比', selectArea: '选择区域', changeImage: '更换图片', preview: '预览', cropFirst: '请先裁剪图片', crop: '裁剪' },
    ja: { aspectRatio: 'アスペクト比', selectArea: '領域を選択', changeImage: '画像を変更', preview: 'プレビュー', cropFirst: '先に画像を切り抜いてください', crop: '切り抜き' },
    ko: { aspectRatio: '종횡비', selectArea: '영역 선택', changeImage: '이미지 변경', preview: '미리보기', cropFirst: '먼저 이미지를 자르세요', crop: '자르기' },
    es: { aspectRatio: 'Relación de aspecto', selectArea: 'Seleccionar área', changeImage: 'Cambiar imagen', preview: 'Vista previa', cropFirst: 'Primero recorta una imagen', crop: 'Recortar' },
    pt: { aspectRatio: 'Proporção', selectArea: 'Selecionar área', changeImage: 'Alterar imagem', preview: 'Visualizar', cropFirst: 'Corte uma imagem primeiro', crop: 'Cortar' },
    fr: { aspectRatio: 'Rapport d\'aspect', selectArea: 'Sélectionner la zone', changeImage: 'Changer l\'image', preview: 'Aperçu', cropFirst: 'Recadrez d\'abord une image', crop: 'Recadrer' },
    de: { aspectRatio: 'Seitenverhältnis', selectArea: 'Bereich auswählen', changeImage: 'Bild ändern', preview: 'Vorschau', cropFirst: 'Schneiden Sie zuerst ein Bild zu', crop: 'Zuschneiden' },
    ru: { aspectRatio: 'Соотношение сторон', selectArea: 'Выбрать область', changeImage: 'Изменить изображение', preview: 'Предпросмотр', cropFirst: 'Сначала обрежьте изображение', crop: 'Обрезать' },
    ar: { aspectRatio: 'نسبة العرض إلى الارتفاع', selectArea: 'تحديد المنطقة', changeImage: 'تغيير الصورة', preview: 'معاينة', cropFirst: 'قم بقص صورة أولاً', crop: 'قص' }
  },

  // gitignore-generator
  'gitignore-generator': {
    en: { languages: 'Languages', frameworks: 'Frameworks', os: 'Operating Systems', custom: 'Custom Rules', customPlaceholder: 'Add custom rules...' },
    zh: { languages: '编程语言', frameworks: '框架', os: '操作系统', custom: '自定义规则', customPlaceholder: '添加自定义规则...' },
    ja: { languages: '言語', frameworks: 'フレームワーク', os: 'オペレーティングシステム', custom: 'カスタムルール', customPlaceholder: 'カスタムルールを追加...' },
    ko: { languages: '언어', frameworks: '프레임워크', os: '운영 체제', custom: '사용자 정의 규칙', customPlaceholder: '사용자 정의 규칙 추가...' },
    es: { languages: 'Lenguajes', frameworks: 'Frameworks', os: 'Sistemas operativos', custom: 'Reglas personalizadas', customPlaceholder: 'Agregar reglas personalizadas...' },
    pt: { languages: 'Linguagens', frameworks: 'Frameworks', os: 'Sistemas operacionais', custom: 'Regras personalizadas', customPlaceholder: 'Adicionar regras personalizadas...' },
    fr: { languages: 'Langages', frameworks: 'Frameworks', os: 'Systèmes d\'exploitation', custom: 'Règles personnalisées', customPlaceholder: 'Ajouter des règles personnalisées...' },
    de: { languages: 'Sprachen', frameworks: 'Frameworks', os: 'Betriebssysteme', custom: 'Benutzerdefinierte Regeln', customPlaceholder: 'Benutzerdefinierte Regeln hinzufügen...' },
    ru: { languages: 'Языки', frameworks: 'Фреймворки', os: 'Операционные системы', custom: 'Пользовательские правила', customPlaceholder: 'Добавить пользовательские правила...' },
    ar: { languages: 'اللغات', frameworks: 'الأطر', os: 'أنظمة التشغيل', custom: 'قواعد مخصصة', customPlaceholder: 'إضافة قواعد مخصصة...' }
  },

  // html-preview
  'html-preview': {
    en: { refresh: 'Refresh', htmlCode: 'HTML Code', preview: 'Preview' },
    zh: { refresh: '刷新', htmlCode: 'HTML 代码', preview: '预览' },
    ja: { refresh: '更新', htmlCode: 'HTMLコード', preview: 'プレビュー' },
    ko: { refresh: '새로고침', htmlCode: 'HTML 코드', preview: '미리보기' },
    es: { refresh: 'Actualizar', htmlCode: 'Código HTML', preview: 'Vista previa' },
    pt: { refresh: 'Atualizar', htmlCode: 'Código HTML', preview: 'Visualizar' },
    fr: { refresh: 'Actualiser', htmlCode: 'Code HTML', preview: 'Aperçu' },
    de: { refresh: 'Aktualisieren', htmlCode: 'HTML-Code', preview: 'Vorschau' },
    ru: { refresh: 'Обновить', htmlCode: 'HTML-код', preview: 'Предпросмотр' },
    ar: { refresh: 'تحديث', htmlCode: 'كود HTML', preview: 'معاينة' }
  },

  // checksum-verifier
  'checksum-verifier': {
    en: { fileTooLarge: 'File too large', calculating: 'Calculating...', md5Note: 'MD5 is not recommended for security purposes' },
    zh: { fileTooLarge: '文件过大', calculating: '计算中...', md5Note: 'MD5 不建议用于安全目的' },
    ja: { fileTooLarge: 'ファイルが大きすぎます', calculating: '計算中...', md5Note: 'MD5はセキュリティ目的には推奨されません' },
    ko: { fileTooLarge: '파일이 너무 큽니다', calculating: '계산 중...', md5Note: 'MD5는 보안 목적으로 권장되지 않습니다' },
    es: { fileTooLarge: 'Archivo demasiado grande', calculating: 'Calculando...', md5Note: 'MD5 no se recomienda para fines de seguridad' },
    pt: { fileTooLarge: 'Arquivo muito grande', calculating: 'Calculando...', md5Note: 'MD5 não é recomendado para fins de segurança' },
    fr: { fileTooLarge: 'Fichier trop volumineux', calculating: 'Calcul en cours...', md5Note: 'MD5 n\'est pas recommandé à des fins de sécurité' },
    de: { fileTooLarge: 'Datei zu groß', calculating: 'Berechnung...', md5Note: 'MD5 wird für Sicherheitszwecke nicht empfohlen' },
    ru: { fileTooLarge: 'Файл слишком большой', calculating: 'Вычисление...', md5Note: 'MD5 не рекомендуется для целей безопасности' },
    ar: { fileTooLarge: 'الملف كبير جداً', calculating: 'جاري الحساب...', md5Note: 'لا يُنصح باستخدام MD5 لأغراض الأمان' }
  },

  // robots-txt-generator
  'robots-txt-generator': {
    en: { 'allow-all': 'Allow All', 'block-all': 'Block All' },
    zh: { 'allow-all': '允许全部', 'block-all': '阻止全部' },
    ja: { 'allow-all': 'すべて許可', 'block-all': 'すべてブロック' },
    ko: { 'allow-all': '모두 허용', 'block-all': '모두 차단' },
    es: { 'allow-all': 'Permitir todo', 'block-all': 'Bloquear todo' },
    pt: { 'allow-all': 'Permitir tudo', 'block-all': 'Bloquear tudo' },
    fr: { 'allow-all': 'Tout autoriser', 'block-all': 'Tout bloquer' },
    de: { 'allow-all': 'Alle erlauben', 'block-all': 'Alle blockieren' },
    ru: { 'allow-all': 'Разрешить все', 'block-all': 'Заблокировать все' },
    ar: { 'allow-all': 'السماح للكل', 'block-all': 'حظر الكل' }
  },

  // hashtag-generator
  'hashtag-generator': {
    en: { allPlatforms: 'All Platforms', copyAll: 'Copy All' },
    zh: { allPlatforms: '所有平台', copyAll: '复制全部' },
    ja: { allPlatforms: 'すべてのプラットフォーム', copyAll: 'すべてコピー' },
    ko: { allPlatforms: '모든 플랫폼', copyAll: '모두 복사' },
    es: { allPlatforms: 'Todas las plataformas', copyAll: 'Copiar todo' },
    pt: { allPlatforms: 'Todas as plataformas', copyAll: 'Copiar tudo' },
    fr: { allPlatforms: 'Toutes les plateformes', copyAll: 'Tout copier' },
    de: { allPlatforms: 'Alle Plattformen', copyAll: 'Alle kopieren' },
    ru: { allPlatforms: 'Все платформы', copyAll: 'Копировать все' },
    ar: { allPlatforms: 'جميع المنصات', copyAll: 'نسخ الكل' }
  },

  // css-beautifier / js-beautifier
  'css-beautifier': {
    en: { indent: 'Indent' },
    zh: { indent: '缩进' },
    ja: { indent: 'インデント' },
    ko: { indent: '들여쓰기' },
    es: { indent: 'Sangría' },
    pt: { indent: 'Recuo' },
    fr: { indent: 'Indentation' },
    de: { indent: 'Einzug' },
    ru: { indent: 'Отступ' },
    ar: { indent: 'المسافة البادئة' }
  },

  'js-beautifier': {
    en: { indent: 'Indent' },
    zh: { indent: '缩进' },
    ja: { indent: 'インデント' },
    ko: { indent: '들여쓰기' },
    es: { indent: 'Sangría' },
    pt: { indent: 'Recuo' },
    fr: { indent: 'Indentation' },
    de: { indent: 'Einzug' },
    ru: { indent: 'Отступ' },
    ar: { indent: 'المسافة البادئة' }
  },

  // time-calculator
  'time-calculator': {
    en: { '24h': '24-hour', '12h': '12-hour' },
    zh: { '24h': '24小时制', '12h': '12小时制' },
    ja: { '24h': '24時間', '12h': '12時間' },
    ko: { '24h': '24시간', '12h': '12시간' },
    es: { '24h': '24 horas', '12h': '12 horas' },
    pt: { '24h': '24 horas', '12h': '12 horas' },
    fr: { '24h': '24 heures', '12h': '12 heures' },
    de: { '24h': '24-Stunden', '12h': '12-Stunden' },
    ru: { '24h': '24-часовой', '12h': '12-часовой' },
    ar: { '24h': '24 ساعة', '12h': '12 ساعة' }
  },

  // break-even-calculator
  'break-even-calculator': {
    en: { invalidInput: 'Invalid input', priceError: 'Price must be greater than variable cost' },
    zh: { invalidInput: '输入无效', priceError: '价格必须大于可变成本' },
    ja: { invalidInput: '無効な入力', priceError: '価格は変動費より大きくなければなりません' },
    ko: { invalidInput: '잘못된 입력', priceError: '가격은 변동비보다 커야 합니다' },
    es: { invalidInput: 'Entrada inválida', priceError: 'El precio debe ser mayor que el costo variable' },
    pt: { invalidInput: 'Entrada inválida', priceError: 'O preço deve ser maior que o custo variável' },
    fr: { invalidInput: 'Entrée invalide', priceError: 'Le prix doit être supérieur au coût variable' },
    de: { invalidInput: 'Ungültige Eingabe', priceError: 'Der Preis muss größer als die variablen Kosten sein' },
    ru: { invalidInput: 'Неверный ввод', priceError: 'Цена должна быть больше переменных затрат' },
    ar: { invalidInput: 'إدخال غير صالح', priceError: 'يجب أن يكون السعر أكبر من التكلفة المتغيرة' }
  },

  // carbon-footprint-calculator
  'carbon-footprint-calculator': {
    en: { 'levels.low': 'Low', 'levels.average': 'Average', 'levels.high': 'High', 'levels.veryHigh': 'Very High' },
    zh: { 'levels.low': '低', 'levels.average': '平均', 'levels.high': '高', 'levels.veryHigh': '非常高' },
    ja: { 'levels.low': '低', 'levels.average': '平均', 'levels.high': '高', 'levels.veryHigh': '非常に高い' },
    ko: { 'levels.low': '낮음', 'levels.average': '평균', 'levels.high': '높음', 'levels.veryHigh': '매우 높음' },
    es: { 'levels.low': 'Bajo', 'levels.average': 'Promedio', 'levels.high': 'Alto', 'levels.veryHigh': 'Muy alto' },
    pt: { 'levels.low': 'Baixo', 'levels.average': 'Médio', 'levels.high': 'Alto', 'levels.veryHigh': 'Muito alto' },
    fr: { 'levels.low': 'Faible', 'levels.average': 'Moyen', 'levels.high': 'Élevé', 'levels.veryHigh': 'Très élevé' },
    de: { 'levels.low': 'Niedrig', 'levels.average': 'Durchschnitt', 'levels.high': 'Hoch', 'levels.veryHigh': 'Sehr hoch' },
    ru: { 'levels.low': 'Низкий', 'levels.average': 'Средний', 'levels.high': 'Высокий', 'levels.veryHigh': 'Очень высокий' },
    ar: { 'levels.low': 'منخفض', 'levels.average': 'متوسط', 'levels.high': 'مرتفع', 'levels.veryHigh': 'مرتفع جداً' }
  },

  // dpi-calculator
  'dpi-calculator': {
    en: { 'quality.excellent': 'Excellent', 'quality.good': 'Good', 'quality.acceptable': 'Acceptable', 'quality.low': 'Low' },
    zh: { 'quality.excellent': '优秀', 'quality.good': '良好', 'quality.acceptable': '可接受', 'quality.low': '低' },
    ja: { 'quality.excellent': '優秀', 'quality.good': '良好', 'quality.acceptable': '許容範囲', 'quality.low': '低' },
    ko: { 'quality.excellent': '우수', 'quality.good': '좋음', 'quality.acceptable': '허용 가능', 'quality.low': '낮음' },
    es: { 'quality.excellent': 'Excelente', 'quality.good': 'Bueno', 'quality.acceptable': 'Aceptable', 'quality.low': 'Bajo' },
    pt: { 'quality.excellent': 'Excelente', 'quality.good': 'Bom', 'quality.acceptable': 'Aceitável', 'quality.low': 'Baixo' },
    fr: { 'quality.excellent': 'Excellent', 'quality.good': 'Bon', 'quality.acceptable': 'Acceptable', 'quality.low': 'Faible' },
    de: { 'quality.excellent': 'Ausgezeichnet', 'quality.good': 'Gut', 'quality.acceptable': 'Akzeptabel', 'quality.low': 'Niedrig' },
    ru: { 'quality.excellent': 'Отлично', 'quality.good': 'Хорошо', 'quality.acceptable': 'Приемлемо', 'quality.low': 'Низко' },
    ar: { 'quality.excellent': 'ممتاز', 'quality.good': 'جيد', 'quality.acceptable': 'مقبول', 'quality.low': 'منخفض' }
  },

  // pixel-density-calculator
  'pixel-density-calculator': {
    en: { 'quality.excellent': 'Excellent', 'quality.good': 'Good', 'quality.average': 'Average', 'quality.low': 'Low' },
    zh: { 'quality.excellent': '优秀', 'quality.good': '良好', 'quality.average': '一般', 'quality.low': '低' },
    ja: { 'quality.excellent': '優秀', 'quality.good': '良好', 'quality.average': '平均', 'quality.low': '低' },
    ko: { 'quality.excellent': '우수', 'quality.good': '좋음', 'quality.average': '평균', 'quality.low': '낮음' },
    es: { 'quality.excellent': 'Excelente', 'quality.good': 'Bueno', 'quality.average': 'Promedio', 'quality.low': 'Bajo' },
    pt: { 'quality.excellent': 'Excelente', 'quality.good': 'Bom', 'quality.average': 'Médio', 'quality.low': 'Baixo' },
    fr: { 'quality.excellent': 'Excellent', 'quality.good': 'Bon', 'quality.average': 'Moyen', 'quality.low': 'Faible' },
    de: { 'quality.excellent': 'Ausgezeichnet', 'quality.good': 'Gut', 'quality.average': 'Durchschnitt', 'quality.low': 'Niedrig' },
    ru: { 'quality.excellent': 'Отлично', 'quality.good': 'Хорошо', 'quality.average': 'Средне', 'quality.low': 'Низко' },
    ar: { 'quality.excellent': 'ممتاز', 'quality.good': 'جيد', 'quality.average': 'متوسط', 'quality.low': 'منخفض' }
  },

  // request-header-builder
  'request-header-builder': {
    en: { form: 'Form', cors: 'CORS', auth: 'Auth' },
    zh: { form: '表单', cors: 'CORS', auth: '认证' },
    ja: { form: 'フォーム', cors: 'CORS', auth: '認証' },
    ko: { form: '폼', cors: 'CORS', auth: '인증' },
    es: { form: 'Formulario', cors: 'CORS', auth: 'Autenticación' },
    pt: { form: 'Formulário', cors: 'CORS', auth: 'Autenticação' },
    fr: { form: 'Formulaire', cors: 'CORS', auth: 'Authentification' },
    de: { form: 'Formular', cors: 'CORS', auth: 'Authentifizierung' },
    ru: { form: 'Форма', cors: 'CORS', auth: 'Аутентификация' },
    ar: { form: 'نموذج', cors: 'CORS', auth: 'المصادقة' }
  },

  // bandwidth-calculator
  'bandwidth-calculator': {
    en: { fileSize: 'File Size', transferTime: 'Transfer Time', requiredBandwidth: 'Required Bandwidth', bitsPerSecond: 'bits/second', bytesPerSecond: 'bytes/second', commonBandwidths: 'Common Bandwidths' },
    zh: { fileSize: '文件大小', transferTime: '传输时间', requiredBandwidth: '所需带宽', bitsPerSecond: '比特/秒', bytesPerSecond: '字节/秒', commonBandwidths: '常见带宽' },
    ja: { fileSize: 'ファイルサイズ', transferTime: '転送時間', requiredBandwidth: '必要な帯域幅', bitsPerSecond: 'ビット/秒', bytesPerSecond: 'バイト/秒', commonBandwidths: '一般的な帯域幅' },
    ko: { fileSize: '파일 크기', transferTime: '전송 시간', requiredBandwidth: '필요 대역폭', bitsPerSecond: '비트/초', bytesPerSecond: '바이트/초', commonBandwidths: '일반 대역폭' },
    es: { fileSize: 'Tamaño del archivo', transferTime: 'Tiempo de transferencia', requiredBandwidth: 'Ancho de banda requerido', bitsPerSecond: 'bits/segundo', bytesPerSecond: 'bytes/segundo', commonBandwidths: 'Anchos de banda comunes' },
    pt: { fileSize: 'Tamanho do arquivo', transferTime: 'Tempo de transferência', requiredBandwidth: 'Largura de banda necessária', bitsPerSecond: 'bits/segundo', bytesPerSecond: 'bytes/segundo', commonBandwidths: 'Larguras de banda comuns' },
    fr: { fileSize: 'Taille du fichier', transferTime: 'Temps de transfert', requiredBandwidth: 'Bande passante requise', bitsPerSecond: 'bits/seconde', bytesPerSecond: 'octets/seconde', commonBandwidths: 'Bandes passantes courantes' },
    de: { fileSize: 'Dateigröße', transferTime: 'Übertragungszeit', requiredBandwidth: 'Erforderliche Bandbreite', bitsPerSecond: 'Bits/Sekunde', bytesPerSecond: 'Bytes/Sekunde', commonBandwidths: 'Gängige Bandbreiten' },
    ru: { fileSize: 'Размер файла', transferTime: 'Время передачи', requiredBandwidth: 'Требуемая пропускная способность', bitsPerSecond: 'бит/секунду', bytesPerSecond: 'байт/секунду', commonBandwidths: 'Распространенные скорости' },
    ar: { fileSize: 'حجم الملف', transferTime: 'وقت النقل', requiredBandwidth: 'عرض النطاق المطلوب', bitsPerSecond: 'بت/ثانية', bytesPerSecond: 'بايت/ثانية', commonBandwidths: 'عروض النطاق الشائعة' }
  }
};

// 添加图表通用翻译键 (png, svg)
const chartTools = [
  'area-chart-generator', 'bar-chart-generator', 'boxplot-chart-generator', 'bubble-chart-generator',
  'calendar-heatmap-generator', 'candlestick-chart-generator', 'doughnut-chart-generator', 'funnel-chart-generator',
  'gantt-chart-generator', 'gauge-chart-generator', 'graph-chart-generator', 'grouped-bar-chart-generator',
  'grouped-line-chart-generator', 'half-doughnut-chart-generator', 'heatmap-chart-generator', 'line-chart-generator',
  'liquid-fill-chart-generator', 'mixed-chart-generator', 'multi-ring-chart-generator', 'nested-pie-chart-generator',
  'nightingale-rose-chart-generator', 'parallel-chart-generator', 'percentage-stacked-bar-chart-generator',
  'pictorial-bar-chart-generator', 'pie-chart-generator', 'polar-bar-chart-generator', 'positive-negative-bar-chart-generator',
  'radar-chart-generator', 'ring-progress-chart-generator', 'sankey-chart-generator', 'scatter-chart-generator',
  'stacked-area-chart-generator', 'stacked-bar-chart-generator', 'step-line-chart-generator', 'sunburst-chart-generator',
  'theme-river-generator', 'timeline-chart-generator', 'tree-chart-generator', 'treemap-chart-generator',
  'waterfall-chart-generator', 'word-cloud-generator'
];

const chartTranslations = {
  en: { png: 'PNG', svg: 'SVG' },
  zh: { png: 'PNG', svg: 'SVG' },
  ja: { png: 'PNG', svg: 'SVG' },
  ko: { png: 'PNG', svg: 'SVG' },
  es: { png: 'PNG', svg: 'SVG' },
  pt: { png: 'PNG', svg: 'SVG' },
  fr: { png: 'PNG', svg: 'SVG' },
  de: { png: 'PNG', svg: 'SVG' },
  ru: { png: 'PNG', svg: 'SVG' },
  ar: { png: 'PNG', svg: 'SVG' }
};

chartTools.forEach(tool => {
  translations[tool] = chartTranslations;
});

// 应用翻译
for (const lang of languages) {
  const filePath = `src/messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let addedCount = 0;
  
  for (const [toolSlug, langTranslations] of Object.entries(translations)) {
    const toolTranslations = langTranslations[lang];
    if (!toolTranslations) continue;
    
    if (!data.tools[toolSlug]) {
      data.tools[toolSlug] = {};
    }
    
    for (const [key, value] of Object.entries(toolTranslations)) {
      // 处理嵌套键
      if (key.includes('.')) {
        const parts = key.split('.');
        let target = data.tools[toolSlug];
        for (let i = 0; i < parts.length - 1; i++) {
          if (!target[parts[i]]) target[parts[i]] = {};
          target = target[parts[i]];
        }
        if (!target[parts[parts.length - 1]]) {
          target[parts[parts.length - 1]] = value;
          addedCount++;
        }
      } else {
        if (!data.tools[toolSlug][key]) {
          data.tools[toolSlug][key] = value;
          addedCount++;
        }
      }
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ ${lang}.json - 添加了 ${addedCount} 个翻译键`);
}

console.log('\n完成！');
