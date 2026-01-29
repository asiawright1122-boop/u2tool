const fs = require('fs');
const path = require('path');

// database-connection-tester UI translations
const translations = {
  en: {
    databaseType: 'Database Type',
    host: 'Host',
    port: 'Port',
    database: 'Database',
    username: 'Username',
    password: 'Password',
    useSSL: 'Use SSL/TLS',
    connectionString: 'Connection String',
    codeSnippet: 'Code Snippet',
    note: 'Note',
    noteText: 'This tool generates connection strings locally. No data is sent to any server. Always use environment variables for sensitive credentials in production.'
  },
  zh: {
    databaseType: '数据库类型',
    host: '主机',
    port: '端口',
    database: '数据库',
    username: '用户名',
    password: '密码',
    useSSL: '使用 SSL/TLS',
    connectionString: '连接字符串',
    codeSnippet: '代码片段',
    note: '注意',
    noteText: '此工具在本地生成连接字符串，不会向任何服务器发送数据。在生产环境中，请始终使用环境变量存储敏感凭据。'
  },
  ja: {
    databaseType: 'データベースタイプ',
    host: 'ホスト',
    port: 'ポート',
    database: 'データベース',
    username: 'ユーザー名',
    password: 'パスワード',
    useSSL: 'SSL/TLSを使用',
    connectionString: '接続文字列',
    codeSnippet: 'コードスニペット',
    note: '注意',
    noteText: 'このツールはローカルで接続文字列を生成します。データはサーバーに送信されません。本番環境では、機密情報には環境変数を使用してください。'
  },
  ko: {
    databaseType: '데이터베이스 유형',
    host: '호스트',
    port: '포트',
    database: '데이터베이스',
    username: '사용자 이름',
    password: '비밀번호',
    useSSL: 'SSL/TLS 사용',
    connectionString: '연결 문자열',
    codeSnippet: '코드 스니펫',
    note: '참고',
    noteText: '이 도구는 로컬에서 연결 문자열을 생성합니다. 데이터는 서버로 전송되지 않습니다. 프로덕션 환경에서는 민감한 자격 증명에 환경 변수를 사용하세요.'
  },
  es: {
    databaseType: 'Tipo de Base de Datos',
    host: 'Host',
    port: 'Puerto',
    database: 'Base de Datos',
    username: 'Usuario',
    password: 'Contraseña',
    useSSL: 'Usar SSL/TLS',
    connectionString: 'Cadena de Conexión',
    codeSnippet: 'Fragmento de Código',
    note: 'Nota',
    noteText: 'Esta herramienta genera cadenas de conexión localmente. No se envían datos a ningún servidor. Siempre use variables de entorno para credenciales sensibles en producción.'
  },
  pt: {
    databaseType: 'Tipo de Banco de Dados',
    host: 'Host',
    port: 'Porta',
    database: 'Banco de Dados',
    username: 'Usuário',
    password: 'Senha',
    useSSL: 'Usar SSL/TLS',
    connectionString: 'String de Conexão',
    codeSnippet: 'Trecho de Código',
    note: 'Nota',
    noteText: 'Esta ferramenta gera strings de conexão localmente. Nenhum dado é enviado para qualquer servidor. Sempre use variáveis de ambiente para credenciais sensíveis em produção.'
  },
  fr: {
    databaseType: 'Type de Base de Données',
    host: 'Hôte',
    port: 'Port',
    database: 'Base de Données',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    useSSL: 'Utiliser SSL/TLS',
    connectionString: 'Chaîne de Connexion',
    codeSnippet: 'Extrait de Code',
    note: 'Note',
    noteText: 'Cet outil génère des chaînes de connexion localement. Aucune donnée n\'est envoyée à un serveur. Utilisez toujours des variables d\'environnement pour les identifiants sensibles en production.'
  },
  de: {
    databaseType: 'Datenbanktyp',
    host: 'Host',
    port: 'Port',
    database: 'Datenbank',
    username: 'Benutzername',
    password: 'Passwort',
    useSSL: 'SSL/TLS verwenden',
    connectionString: 'Verbindungszeichenfolge',
    codeSnippet: 'Code-Snippet',
    note: 'Hinweis',
    noteText: 'Dieses Tool generiert Verbindungszeichenfolgen lokal. Es werden keine Daten an einen Server gesendet. Verwenden Sie in der Produktion immer Umgebungsvariablen für sensible Anmeldedaten.'
  },
  ru: {
    databaseType: 'Тип базы данных',
    host: 'Хост',
    port: 'Порт',
    database: 'База данных',
    username: 'Имя пользователя',
    password: 'Пароль',
    useSSL: 'Использовать SSL/TLS',
    connectionString: 'Строка подключения',
    codeSnippet: 'Фрагмент кода',
    note: 'Примечание',
    noteText: 'Этот инструмент генерирует строки подключения локально. Данные не отправляются на сервер. Всегда используйте переменные окружения для конфиденциальных учетных данных в продакшене.'
  },
  ar: {
    databaseType: 'نوع قاعدة البيانات',
    host: 'المضيف',
    port: 'المنفذ',
    database: 'قاعدة البيانات',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    useSSL: 'استخدام SSL/TLS',
    connectionString: 'سلسلة الاتصال',
    codeSnippet: 'مقتطف الكود',
    note: 'ملاحظة',
    noteText: 'تقوم هذه الأداة بإنشاء سلاسل الاتصال محليًا. لا يتم إرسال أي بيانات إلى أي خادم. استخدم دائمًا متغيرات البيئة للبيانات الحساسة في الإنتاج.'
  }
};

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

locales.forEach(locale => {
  const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add database-connection-tester translations
  if (!data.tools['database-connection-tester']) {
    data.tools['database-connection-tester'] = {};
  }
  
  // Merge translations
  Object.assign(data.tools['database-connection-tester'], translations[locale]);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Updated ${locale}.json with database-connection-tester translations`);
});

console.log('\nDone! Run: npx tsx scripts/split-translations.ts');
