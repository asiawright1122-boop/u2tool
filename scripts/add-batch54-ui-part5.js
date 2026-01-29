const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// Batch 54 UI translations - Part 5
const translations = {
  'webhook-tester': {
    en: { sending: 'Sending...', send: 'Send', headers: 'Headers', requestBody: 'Request Body', requestHistory: 'Request History', responseBody: 'Response Body', tips: 'Tips', error: 'Error', sendingRequest: 'Sending request...', clearHistory: 'Clear History', tip1: 'Use webhook.site or requestbin.com to get a test URL', tip2: 'CORS restrictions may prevent some requests from browsers', tip3: 'For production webhooks, test from a server environment' },
    zh: { sending: '发送中...', send: '发送', headers: '请求头', requestBody: '请求体', requestHistory: '请求历史', responseBody: '响应体', tips: '提示', error: '错误', sendingRequest: '正在发送请求...', clearHistory: '清除历史', tip1: '使用 webhook.site 或 requestbin.com 获取测试 URL', tip2: 'CORS 限制可能会阻止某些浏览器请求', tip3: '对于生产环境的 webhook，请从服务器环境测试' },
    ja: { sending: '送信中...', send: '送信', headers: 'ヘッダー', requestBody: 'リクエストボディ', requestHistory: 'リクエスト履歴', responseBody: 'レスポンスボディ', tips: 'ヒント', error: 'エラー', sendingRequest: 'リクエストを送信中...', clearHistory: '履歴をクリア', tip1: 'webhook.site または requestbin.com でテスト URL を取得', tip2: 'CORS 制限によりブラウザからの一部のリクエストが制限される場合があります', tip3: '本番環境の webhook はサーバー環境からテストしてください' },
    ko: { sending: '전송 중...', send: '전송', headers: '헤더', requestBody: '요청 본문', requestHistory: '요청 기록', responseBody: '응답 본문', tips: '팁', error: '오류', sendingRequest: '요청 전송 중...', clearHistory: '기록 지우기', tip1: 'webhook.site 또는 requestbin.com에서 테스트 URL을 받으세요', tip2: 'CORS 제한으로 인해 브라우저에서 일부 요청이 차단될 수 있습니다', tip3: '프로덕션 웹훅은 서버 환경에서 테스트하세요' },
    es: { sending: 'Enviando...', send: 'Enviar', headers: 'Encabezados', requestBody: 'Cuerpo de solicitud', requestHistory: 'Historial de solicitudes', responseBody: 'Cuerpo de respuesta', tips: 'Consejos', error: 'Error', sendingRequest: 'Enviando solicitud...', clearHistory: 'Limpiar historial', tip1: 'Usa webhook.site o requestbin.com para obtener una URL de prueba', tip2: 'Las restricciones CORS pueden impedir algunas solicitudes desde navegadores', tip3: 'Para webhooks de producción, prueba desde un entorno de servidor' },
    pt: { sending: 'Enviando...', send: 'Enviar', headers: 'Cabeçalhos', requestBody: 'Corpo da requisição', requestHistory: 'Histórico de requisições', responseBody: 'Corpo da resposta', tips: 'Dicas', error: 'Erro', sendingRequest: 'Enviando requisição...', clearHistory: 'Limpar histórico', tip1: 'Use webhook.site ou requestbin.com para obter uma URL de teste', tip2: 'Restrições CORS podem impedir algumas requisições de navegadores', tip3: 'Para webhooks de produção, teste em um ambiente de servidor' },
    fr: { sending: 'Envoi...', send: 'Envoyer', headers: 'En-têtes', requestBody: 'Corps de la requête', requestHistory: 'Historique des requêtes', responseBody: 'Corps de la réponse', tips: 'Conseils', error: 'Erreur', sendingRequest: 'Envoi de la requête...', clearHistory: 'Effacer l\'historique', tip1: 'Utilisez webhook.site ou requestbin.com pour obtenir une URL de test', tip2: 'Les restrictions CORS peuvent empêcher certaines requêtes depuis les navigateurs', tip3: 'Pour les webhooks de production, testez depuis un environnement serveur' },
    de: { sending: 'Senden...', send: 'Senden', headers: 'Header', requestBody: 'Anfragekörper', requestHistory: 'Anfrageverlauf', responseBody: 'Antwortkörper', tips: 'Tipps', error: 'Fehler', sendingRequest: 'Anfrage wird gesendet...', clearHistory: 'Verlauf löschen', tip1: 'Verwenden Sie webhook.site oder requestbin.com für eine Test-URL', tip2: 'CORS-Einschränkungen können einige Anfragen von Browsern verhindern', tip3: 'Für Produktions-Webhooks testen Sie von einer Serverumgebung aus' },
    ru: { sending: 'Отправка...', send: 'Отправить', headers: 'Заголовки', requestBody: 'Тело запроса', requestHistory: 'История запросов', responseBody: 'Тело ответа', tips: 'Советы', error: 'Ошибка', sendingRequest: 'Отправка запроса...', clearHistory: 'Очистить историю', tip1: 'Используйте webhook.site или requestbin.com для получения тестового URL', tip2: 'Ограничения CORS могут блокировать некоторые запросы из браузеров', tip3: 'Для продакшн вебхуков тестируйте из серверной среды' },
    ar: { sending: 'جاري الإرسال...', send: 'إرسال', headers: 'الرؤوس', requestBody: 'نص الطلب', requestHistory: 'سجل الطلبات', responseBody: 'نص الاستجابة', tips: 'نصائح', error: 'خطأ', sendingRequest: 'جاري إرسال الطلب...', clearHistory: 'مسح السجل', tip1: 'استخدم webhook.site أو requestbin.com للحصول على رابط اختبار', tip2: 'قد تمنع قيود CORS بعض الطلبات من المتصفحات', tip3: 'لاختبار webhooks الإنتاج، اختبر من بيئة الخادم' }
  },
  'sql-query-optimizer': {
    en: { sqlQuery: 'SQL Query', queryPerformanceScore: 'Query Performance Score', optimizationSuggestions: 'Optimization Suggestions', formattedQuery: 'Formatted Query', fix: 'Fix' },
    zh: { sqlQuery: 'SQL 查询', queryPerformanceScore: '查询性能评分', optimizationSuggestions: '优化建议', formattedQuery: '格式化查询', fix: '修复' },
    ja: { sqlQuery: 'SQLクエリ', queryPerformanceScore: 'クエリパフォーマンススコア', optimizationSuggestions: '最適化の提案', formattedQuery: 'フォーマット済みクエリ', fix: '修正' },
    ko: { sqlQuery: 'SQL 쿼리', queryPerformanceScore: '쿼리 성능 점수', optimizationSuggestions: '최적화 제안', formattedQuery: '포맷된 쿼리', fix: '수정' },
    es: { sqlQuery: 'Consulta SQL', queryPerformanceScore: 'Puntuación de rendimiento', optimizationSuggestions: 'Sugerencias de optimización', formattedQuery: 'Consulta formateada', fix: 'Solución' },
    pt: { sqlQuery: 'Consulta SQL', queryPerformanceScore: 'Pontuação de desempenho', optimizationSuggestions: 'Sugestões de otimização', formattedQuery: 'Consulta formatada', fix: 'Correção' },
    fr: { sqlQuery: 'Requête SQL', queryPerformanceScore: 'Score de performance', optimizationSuggestions: 'Suggestions d\'optimisation', formattedQuery: 'Requête formatée', fix: 'Correction' },
    de: { sqlQuery: 'SQL-Abfrage', queryPerformanceScore: 'Abfrage-Leistungsbewertung', optimizationSuggestions: 'Optimierungsvorschläge', formattedQuery: 'Formatierte Abfrage', fix: 'Lösung' },
    ru: { sqlQuery: 'SQL-запрос', queryPerformanceScore: 'Оценка производительности', optimizationSuggestions: 'Предложения по оптимизации', formattedQuery: 'Отформатированный запрос', fix: 'Исправление' },
    ar: { sqlQuery: 'استعلام SQL', queryPerformanceScore: 'درجة أداء الاستعلام', optimizationSuggestions: 'اقتراحات التحسين', formattedQuery: 'الاستعلام المنسق', fix: 'الإصلاح' }
  },
  'kubernetes-manifest-generator': {
    en: { appName: 'App Name', namespace: 'Namespace', image: 'Image', replicas: 'Replicas', servicePort: 'Service Port', containerPort: 'Container Port', serviceType: 'Service Type', resources: 'Resources', cpuRequest: 'CPU Request', cpuLimit: 'CPU Limit', memoryRequest: 'Memory Request', memoryLimit: 'Memory Limit', environmentVariables: 'Environment Variables', addEnvVar: '+ Add', includeIngress: 'Include Ingress', includeHPA: 'Include HPA', kubernetesManifests: 'Kubernetes Manifests' },
    zh: { appName: '应用名称', namespace: '命名空间', image: '镜像', replicas: '副本数', servicePort: '服务端口', containerPort: '容器端口', serviceType: '服务类型', resources: '资源', cpuRequest: 'CPU 请求', cpuLimit: 'CPU 限制', memoryRequest: '内存请求', memoryLimit: '内存限制', environmentVariables: '环境变量', addEnvVar: '+ 添加', includeIngress: '包含 Ingress', includeHPA: '包含 HPA', kubernetesManifests: 'Kubernetes 清单' },
    ja: { appName: 'アプリ名', namespace: '名前空間', image: 'イメージ', replicas: 'レプリカ数', servicePort: 'サービスポート', containerPort: 'コンテナポート', serviceType: 'サービスタイプ', resources: 'リソース', cpuRequest: 'CPU要求', cpuLimit: 'CPU制限', memoryRequest: 'メモリ要求', memoryLimit: 'メモリ制限', environmentVariables: '環境変数', addEnvVar: '+ 追加', includeIngress: 'Ingressを含む', includeHPA: 'HPAを含む', kubernetesManifests: 'Kubernetesマニフェスト' },
    ko: { appName: '앱 이름', namespace: '네임스페이스', image: '이미지', replicas: '레플리카', servicePort: '서비스 포트', containerPort: '컨테이너 포트', serviceType: '서비스 유형', resources: '리소스', cpuRequest: 'CPU 요청', cpuLimit: 'CPU 제한', memoryRequest: '메모리 요청', memoryLimit: '메모리 제한', environmentVariables: '환경 변수', addEnvVar: '+ 추가', includeIngress: 'Ingress 포함', includeHPA: 'HPA 포함', kubernetesManifests: 'Kubernetes 매니페스트' },
    es: { appName: 'Nombre de la app', namespace: 'Espacio de nombres', image: 'Imagen', replicas: 'Réplicas', servicePort: 'Puerto del servicio', containerPort: 'Puerto del contenedor', serviceType: 'Tipo de servicio', resources: 'Recursos', cpuRequest: 'Solicitud de CPU', cpuLimit: 'Límite de CPU', memoryRequest: 'Solicitud de memoria', memoryLimit: 'Límite de memoria', environmentVariables: 'Variables de entorno', addEnvVar: '+ Agregar', includeIngress: 'Incluir Ingress', includeHPA: 'Incluir HPA', kubernetesManifests: 'Manifiestos de Kubernetes' },
    pt: { appName: 'Nome do app', namespace: 'Namespace', image: 'Imagem', replicas: 'Réplicas', servicePort: 'Porta do serviço', containerPort: 'Porta do container', serviceType: 'Tipo de serviço', resources: 'Recursos', cpuRequest: 'Requisição de CPU', cpuLimit: 'Limite de CPU', memoryRequest: 'Requisição de memória', memoryLimit: 'Limite de memória', environmentVariables: 'Variáveis de ambiente', addEnvVar: '+ Adicionar', includeIngress: 'Incluir Ingress', includeHPA: 'Incluir HPA', kubernetesManifests: 'Manifestos Kubernetes' },
    fr: { appName: 'Nom de l\'app', namespace: 'Espace de noms', image: 'Image', replicas: 'Réplicas', servicePort: 'Port du service', containerPort: 'Port du conteneur', serviceType: 'Type de service', resources: 'Ressources', cpuRequest: 'Demande CPU', cpuLimit: 'Limite CPU', memoryRequest: 'Demande mémoire', memoryLimit: 'Limite mémoire', environmentVariables: 'Variables d\'environnement', addEnvVar: '+ Ajouter', includeIngress: 'Inclure Ingress', includeHPA: 'Inclure HPA', kubernetesManifests: 'Manifestes Kubernetes' },
    de: { appName: 'App-Name', namespace: 'Namespace', image: 'Image', replicas: 'Replikate', servicePort: 'Service-Port', containerPort: 'Container-Port', serviceType: 'Service-Typ', resources: 'Ressourcen', cpuRequest: 'CPU-Anforderung', cpuLimit: 'CPU-Limit', memoryRequest: 'Speicher-Anforderung', memoryLimit: 'Speicher-Limit', environmentVariables: 'Umgebungsvariablen', addEnvVar: '+ Hinzufügen', includeIngress: 'Ingress einschließen', includeHPA: 'HPA einschließen', kubernetesManifests: 'Kubernetes-Manifeste' },
    ru: { appName: 'Имя приложения', namespace: 'Пространство имён', image: 'Образ', replicas: 'Реплики', servicePort: 'Порт сервиса', containerPort: 'Порт контейнера', serviceType: 'Тип сервиса', resources: 'Ресурсы', cpuRequest: 'Запрос CPU', cpuLimit: 'Лимит CPU', memoryRequest: 'Запрос памяти', memoryLimit: 'Лимит памяти', environmentVariables: 'Переменные окружения', addEnvVar: '+ Добавить', includeIngress: 'Включить Ingress', includeHPA: 'Включить HPA', kubernetesManifests: 'Манифесты Kubernetes' },
    ar: { appName: 'اسم التطبيق', namespace: 'مساحة الاسم', image: 'الصورة', replicas: 'النسخ', servicePort: 'منفذ الخدمة', containerPort: 'منفذ الحاوية', serviceType: 'نوع الخدمة', resources: 'الموارد', cpuRequest: 'طلب CPU', cpuLimit: 'حد CPU', memoryRequest: 'طلب الذاكرة', memoryLimit: 'حد الذاكرة', environmentVariables: 'متغيرات البيئة', addEnvVar: '+ إضافة', includeIngress: 'تضمين Ingress', includeHPA: 'تضمين HPA', kubernetesManifests: 'ملفات Kubernetes' }
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

console.log('Done! Added translations for webhook-tester, sql-query-optimizer, kubernetes-manifest-generator');
