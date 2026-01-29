const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// Additional translations for database-connection-tester
const translations = {
  'database-connection-tester': {
    en: { useSSL: 'Use SSL/TLS', codeSnippet: 'Code Snippet', note: 'Note', noteText: 'This tool generates connection strings and code snippets. Actual connection testing requires a backend service. Never expose credentials in client-side code.' },
    zh: { useSSL: '使用 SSL/TLS', codeSnippet: '代码片段', note: '注意', noteText: '此工具生成连接字符串和代码片段。实际连接测试需要后端服务。切勿在客户端代码中暴露凭据。' },
    ja: { useSSL: 'SSL/TLSを使用', codeSnippet: 'コードスニペット', note: '注意', noteText: 'このツールは接続文字列とコードスニペットを生成します。実際の接続テストにはバックエンドサービスが必要です。クライアントサイドのコードに認証情報を公開しないでください。' },
    ko: { useSSL: 'SSL/TLS 사용', codeSnippet: '코드 스니펫', note: '참고', noteText: '이 도구는 연결 문자열과 코드 스니펫을 생성합니다. 실제 연결 테스트에는 백엔드 서비스가 필요합니다. 클라이언트 측 코드에 자격 증명을 노출하지 마세요.' },
    es: { useSSL: 'Usar SSL/TLS', codeSnippet: 'Fragmento de código', note: 'Nota', noteText: 'Esta herramienta genera cadenas de conexión y fragmentos de código. Las pruebas de conexión reales requieren un servicio backend. Nunca exponga credenciales en código del lado del cliente.' },
    pt: { useSSL: 'Usar SSL/TLS', codeSnippet: 'Trecho de código', note: 'Nota', noteText: 'Esta ferramenta gera strings de conexão e trechos de código. Testes de conexão reais requerem um serviço backend. Nunca exponha credenciais em código do lado do cliente.' },
    fr: { useSSL: 'Utiliser SSL/TLS', codeSnippet: 'Extrait de code', note: 'Note', noteText: 'Cet outil génère des chaînes de connexion et des extraits de code. Les tests de connexion réels nécessitent un service backend. N\'exposez jamais les identifiants dans le code côté client.' },
    de: { useSSL: 'SSL/TLS verwenden', codeSnippet: 'Code-Snippet', note: 'Hinweis', noteText: 'Dieses Tool generiert Verbindungszeichenfolgen und Code-Snippets. Tatsächliche Verbindungstests erfordern einen Backend-Service. Geben Sie niemals Anmeldedaten im clientseitigen Code preis.' },
    ru: { useSSL: 'Использовать SSL/TLS', codeSnippet: 'Фрагмент кода', note: 'Примечание', noteText: 'Этот инструмент генерирует строки подключения и фрагменты кода. Фактическое тестирование соединения требует бэкенд-сервиса. Никогда не раскрывайте учётные данные в клиентском коде.' },
    ar: { useSSL: 'استخدام SSL/TLS', codeSnippet: 'مقتطف الكود', note: 'ملاحظة', noteText: 'تقوم هذه الأداة بإنشاء سلاسل الاتصال ومقتطفات الكود. يتطلب اختبار الاتصال الفعلي خدمة خلفية. لا تكشف أبدًا عن بيانات الاعتماد في كود جانب العميل.' }
  }
};

// Update all locale files
locales.forEach(locale => {
  const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  Object.entries(translations).forEach(([toolSlug, localeTranslations]) => {
    if (!data.tools[toolSlug]) {
      data.tools[toolSlug] = {};
    }
    Object.assign(data.tools[toolSlug], localeTranslations[locale]);
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${locale}.json`);
});

console.log('Done!');
