<script lang="ts">
  import { buildCspHeader } from '../../lib/csp-generator-helper';

  interface Props {
    locale?: string;
    translations?: Record<string, unknown>;
  }

  let { locale = 'en', translations = {} }: Props = $props();

  const I18N_BACKUP: Record<string, Record<string, string>> = {
    zh: {
      title: 'CSP 安全头部生成器',
      subtitle: '轻松配置内容安全策略 (Content Security Policy)，防范 XSS 与数据注入攻击',
      presetsLabel: '策略模板',
      presetStrict: '严格安全 (推荐)',
      presetRelaxed: '开发宽松 (允许内联)',
      presetNone: '极度限制 (完全阻止)',
      custom: '自定义',
      directiveDefault: '默认源 (default-src)',
      directiveScript: '脚本源 (script-src)',
      directiveStyle: '样式源 (style-src)',
      directiveImg: '图片源 (img-src)',
      directiveConnect: '请求源 (connect-src)',
      directiveFont: '字体源 (font-src)',
      directiveFrame: '框架源 (frame-src)',
      directiveObject: '对象源 (object-src)',
      directiveWorker: '工作器 (worker-src)',
      upgradeInsecure: '升级未安全请求 (upgrade-insecure-requests)',
      customDomains: '自定义域名 (回车添加)',
      placeholderAdd: '输入域名，如 api.example.com',
      outputHeader: 'HTTP 响应头 (Content-Security-Policy)',
      outputMeta: 'HTML Meta 标签',
      outputNginx: 'Nginx 配置',
      outputApache: 'Apache (.htaccess) 配置',
      copyBtn: '复制',
      copied: '✓ 已复制!',
      descDefault: '没有指定其他指令时的后备基础规则',
      descScript: '允许加载和执行的 JavaScript 脚本源',
      descStyle: '允许加载的 CSS 样式表源',
      descImg: '允许加载的图像源',
      descConnect: '允许通过 XHR/fetch/WebSocket 连接的接口源',
      descFont: '允许加载的 web 字体源',
      descFrame: '允许嵌入的 iframe 框架源',
      descObject: '允许加载的 Flash/Java 等插件源',
      descWorker: '允许加载的 Web Worker 脚本源'
    },
    en: {
      title: 'CSP Header Generator',
      subtitle: 'Easily configure Content Security Policy (CSP) to protect your website against XSS and injection attacks',
      presetsLabel: 'Security Presets',
      presetStrict: 'Strict (Recommended)',
      presetRelaxed: 'Relaxed (Allows Inline)',
      presetNone: 'Block All',
      custom: 'Custom',
      directiveDefault: 'Default Source (default-src)',
      directiveScript: 'Script Source (script-src)',
      directiveStyle: 'Style Source (style-src)',
      directiveImg: 'Image Source (img-src)',
      directiveConnect: 'Connection Source (connect-src)',
      directiveFont: 'Font Source (font-src)',
      directiveFrame: 'Frame Source (frame-src)',
      directiveObject: 'Object Source (object-src)',
      directiveWorker: 'Worker Source (worker-src)',
      upgradeInsecure: 'Upgrade Insecure Requests (upgrade-insecure-requests)',
      customDomains: 'Custom Domains (Press Enter)',
      placeholderAdd: 'Add domain, e.g. api.example.com',
      outputHeader: 'HTTP Response Header (Content-Security-Policy)',
      outputMeta: 'HTML Meta Tag',
      outputNginx: 'Nginx Configuration',
      outputApache: 'Apache (.htaccess) Configuration',
      copyBtn: 'Copy',
      copied: '✓ Copied!',
      descDefault: 'Fallback rules when other directives are not defined',
      descScript: 'Allowed sources for loading and executing JS scripts',
      descStyle: 'Allowed sources for CSS stylesheets',
      descImg: 'Allowed sources for images',
      descConnect: 'Allowed targets for XHR, fetch, WebSockets',
      descFont: 'Allowed sources for web fonts',
      descFrame: 'Allowed sources for nesting iframes',
      descObject: 'Allowed sources for plugins like Flash/Java',
      descWorker: 'Allowed sources for Web Workers'
    },
    es: {
      title: 'Generador de Cabeceras CSP',
      subtitle: 'Configure fácilmente las políticas de seguridad de contenido (CSP) para prevenir ataques XSS e inyecciones de datos',
      presetsLabel: 'Plantillas de Seguridad',
      presetStrict: 'Estricto (Recomendado)',
      presetRelaxed: 'Relajado (Permite Inline)',
      presetNone: 'Bloquear Todo',
      custom: 'Personalizado',
      directiveDefault: 'Origen por Defecto (default-src)',
      directiveScript: 'Origen de Script (script-src)',
      directiveStyle: 'Origen de Estilo (style-src)',
      directiveImg: 'Origen de Imagen (img-src)',
      directiveConnect: 'Origen de Conexión (connect-src)',
      directiveFont: 'Origen de Fuente (font-src)',
      directiveFrame: 'Origen de Marco (frame-src)',
      directiveObject: 'Origen de Objeto (object-src)',
      directiveWorker: 'Origen de Worker (worker-src)',
      upgradeInsecure: 'Actualizar Solicitudes Inseguras',
      customDomains: 'Dominios Personalizados',
      placeholderAdd: 'Agregar dominio, ej. api.example.com',
      outputHeader: 'Cabecera HTTP (Content-Security-Policy)',
      outputMeta: 'Etiqueta HTML Meta',
      outputNginx: 'Configuración Nginx',
      outputApache: 'Configuración Apache',
      copyBtn: 'Copiar',
      copied: '✓ ¡Copiado!',
      descDefault: 'Reglas de respaldo para el resto de directivas',
      descScript: 'Orígenes autorizados para scripts JavaScript',
      descStyle: 'Orígenes autorizados para estilos CSS',
      descImg: 'Orígenes autorizados para imágenes',
      descConnect: 'Orígenes autorizados para XHR/fetch/WebSockets',
      descFont: 'Orígenes autorizados para fuentes web',
      descFrame: 'Orígenes autorizados para iframes',
      descObject: 'Orígenes autorizados para complementos',
      descWorker: 'Orígenes autorizados para Web Workers'
    },
    pt: {
      title: 'Gerador de Cabeçalhos CSP',
      subtitle: 'Configure políticas de segurança de conteúdo (CSP) para proteger seu site de ataques XSS e injeções',
      presetsLabel: 'Modelos de Segurança',
      presetStrict: 'Estrito (Recomendado)',
      presetRelaxed: 'Relaxado (Permite Inline)',
      presetNone: 'Bloquear Tudo',
      custom: 'Personalizado',
      directiveDefault: 'Origem Padrão (default-src)',
      directiveScript: 'Origem de Script (script-src)',
      directiveStyle: 'Origem de Estilo (style-src)',
      directiveImg: 'Origem de Imagem (img-src)',
      directiveConnect: 'Origem de Conexão (connect-src)',
      directiveFont: 'Origem de Fonte (font-src)',
      directiveFrame: 'Origem de Frame (frame-src)',
      directiveObject: 'Origem de Objeto (object-src)',
      directiveWorker: 'Origem de Worker (worker-src)',
      upgradeInsecure: 'Atualizar Requisições Inseguras',
      customDomains: 'Domínios Personalizados',
      placeholderAdd: 'Adicionar domínio, ex. api.example.com',
      outputHeader: 'Cabeçalho HTTP (Content-Security-Policy)',
      outputMeta: 'Tag HTML Meta',
      outputNginx: 'Configuração Nginx',
      outputApache: 'Configuração Apache',
      copyBtn: 'Copiar',
      copied: '✓ Copiado!',
      descDefault: 'Regras de fallback para diretivas não definidas',
      descScript: 'Origens permitidas para scripts JS',
      descStyle: 'Origens permitidas para folhas de estilo CSS',
      descImg: 'Origens permitidas para imagens',
      descConnect: 'Origens permitidas para conexões XHR/fetch/WS',
      descFont: 'Origens permitidas para fontes web',
      descFrame: 'Origens permitidas para iframes',
      descObject: 'Origens permitidas para plug-ins',
      descWorker: 'Origens permitidas para Web Workers'
    },
    ja: {
      title: 'CSP ヘッダー生成器',
      subtitle: 'XSSやデータインジェクション攻撃を防ぐために、コンテンツセキュリティポリシー (CSP) を簡単に構成します',
      presetsLabel: 'セキュリティプリセット',
      presetStrict: '厳格 (推奨)',
      presetRelaxed: '緩和 (インラインを許可)',
      presetNone: 'すべて拒否',
      custom: 'カスタム',
      directiveDefault: 'デフォルトソース (default-src)',
      directiveScript: 'スクリプトソース (script-src)',
      directiveStyle: 'スタイルソース (style-src)',
      directiveImg: '画像ソース (img-src)',
      directiveConnect: '接続ソース (connect-src)',
      directiveFont: 'フォントソース (font-src)',
      directiveFrame: 'フレームソース (frame-src)',
      directiveObject: 'オブジェクトソース (object-src)',
      directiveWorker: 'ワーカーソース (worker-src)',
      upgradeInsecure: 'セキュアでないリクエストをアップグレード',
      customDomains: 'カスタムドメイン',
      placeholderAdd: 'ドメインを入力、例: api.example.com',
      outputHeader: 'HTTP レスポンスヘッダー (Content-Security-Policy)',
      outputMeta: 'HTML Meta タグ',
      outputNginx: 'Nginx 構成',
      outputApache: 'Apache 構成',
      copyBtn: 'コピー',
      copied: '✓ コピーしました!',
      descDefault: '他のディレクティブが指定されていない場合の代替ルール',
      descScript: 'JSスクリプトのロードと実行の許可元',
      descStyle: 'CSSスタイルシートの許可元',
      descImg: '画像の許可元',
      descConnect: 'XHR、fetch、WebSocketsの許可元',
      descFont: 'Webフォントの許可元',
      descFrame: 'iframeの許可元',
      descObject: 'FlashやJavaなどのプラグインの許可元',
      descWorker: 'Web Workerスクリプトの許可元'
    },
    fr: {
      title: 'Générateur de Cabeçalho CSP',
      subtitle: 'Configurez facilement la politique de sécurité du contenu (CSP) pour protéger votre site contre le XSS',
      presetsLabel: 'Préréglages de Sécurité',
      presetStrict: 'Strict (Recommandé)',
      presetRelaxed: 'Relaxé (Autorise Inline)',
      presetNone: 'Tout Bloquer',
      custom: 'Personnalisé',
      directiveDefault: 'Source par Défaut (default-src)',
      directiveScript: 'Source de Script (script-src)',
      directiveStyle: 'Source de Style (style-src)',
      directiveImg: 'Source d\'Image (img-src)',
      directiveConnect: 'Source de Connexion (connect-src)',
      directiveFont: 'Source de Police (font-src)',
      directiveFrame: 'Source de Cadre (frame-src)',
      directiveObject: 'Source d\'Objet (object-src)',
      directiveWorker: 'Source de Worker (worker-src)',
      upgradeInsecure: 'Mettre à Niveau les Requêtes Insegures',
      customDomains: 'Domaines Personnalisés',
      placeholderAdd: 'Ajouter un domaine, ex. api.example.com',
      outputHeader: 'En-tête HTTP (Content-Security-Policy)',
      outputMeta: 'Balise HTML Meta',
      outputNginx: 'Configuration Nginx',
      outputApache: 'Configuration Apache',
      copyBtn: 'Copier',
      copied: '✓ Copié !',
      descDefault: 'Règles de repli par défaut pour les directives non spécifiées',
      descScript: 'Sources autorisées pour le chargement de scripts JS',
      descStyle: 'Sources autorisées pour le CSS',
      descImg: 'Sources autorisées pour les images',
      descConnect: 'Destinations autorisées pour fetch/XHR/WebSockets',
      descFont: 'Sources autorisées pour les polices web',
      descFrame: 'Sources autorisées pour iframes',
      descObject: 'Sources autorisées pour les plug-ins',
      descWorker: 'Sources autorisées pour les Web Workers'
    },
    de: {
      title: 'CSP Header Generator',
      subtitle: 'Konfigurieren Sie ganz einfach Content Security Policies (CSP), um Cross-Site-Scripting (XSS) zu verhindern',
      presetsLabel: 'Sicherheits-Voreinstellungen',
      presetStrict: 'Strikt (Empfohlen)',
      presetRelaxed: 'Locker (Erlaubt Inline)',
      presetNone: 'Alles blockieren',
      custom: 'Benutzerdefiniert',
      directiveDefault: 'Standardquelle (default-src)',
      directiveScript: 'Skriptquelle (script-src)',
      directiveStyle: 'Stilquelle (style-src)',
      directiveImg: 'Bildquelle (img-src)',
      directiveConnect: 'Verbindungsquelle (connect-src)',
      directiveFont: 'Schriftquelle (font-src)',
      directiveFrame: 'Framequelle (frame-src)',
      directiveObject: 'Objektquelle (object-src)',
      directiveWorker: 'Workerquelle (worker-src)',
      upgradeInsecure: 'Unsichere Anfragen upgraden',
      customDomains: 'Benutzerdefinierte Domains',
      placeholderAdd: 'Domain hinzufügen, z. B. api.example.com',
      outputHeader: 'HTTP-Header (Content-Security-Policy)',
      outputMeta: 'HTML Meta-Tag',
      outputNginx: 'Nginx Konfiguration',
      outputApache: 'Apache Konfiguration',
      copyBtn: 'Kopieren',
      copied: '✓ Kopiert!',
      descDefault: 'Fallback-Regeln für nicht definierte Direktiven',
      descScript: 'Erlaubte Quellen für JavaScript-Dateien',
      descStyle: 'Erlaubte Quellen für CSS-Stylesheets',
      descImg: 'Erlaubte Quellen für Grafiken',
      descConnect: 'Erlaubte Ziele für fetch/XHR/WebSockets',
      descFont: 'Erlaubte Quellen für Webfonts',
      descFrame: 'Erlaubte Quellen für iframes',
      descObject: 'Erlaubte Quellen für Plugins',
      descWorker: 'Erlaubte Quellen für Web Worker'
    },
    ar: {
      title: 'مولد رأس CSP',
      subtitle: 'قم بتكوين سياسة أمان المحتوى (CSP) بسهولة لحماية موقعك من هجمات XSS',
      presetsLabel: 'قوالب الأمان',
      presetStrict: 'صارم (موصى به)',
      presetRelaxed: 'مرن (يسمح بالرموز المضمنة)',
      presetNone: 'منع الكل',
      custom: 'مخصص',
      directiveDefault: 'المصدر الافتراضي (default-src)',
      directiveScript: 'مصدر البرمجيات (script-src)',
      directiveStyle: 'مصدر الأنماط (style-src)',
      directiveImg: 'مصدر الصور (img-src)',
      directiveConnect: 'مصدر الاتصال (connect-src)',
      directiveFont: 'مصدر الخطوط (font-src)',
      directiveFrame: 'مصدر الإطارات (frame-src)',
      directiveObject: 'مصدر الكائنات (object-src)',
      directiveWorker: 'مصدر العمال (worker-src)',
      upgradeInsecure: 'ترقية الطلبات غير الآمنة',
      customDomains: 'نطاقات مخصصة',
      placeholderAdd: 'أضف نطاقًا، مثل api.example.com',
      outputHeader: 'رأس HTTP (Content-Security-Policy)',
      outputMeta: 'علامة HTML Meta',
      outputNginx: 'تكوين Nginx',
      outputApache: 'تكوين Apache',
      copyBtn: 'نسخ',
      copied: '✓ تم النسخ!',
      descDefault: 'قواعد احتياطية للتعليمات غير المعرفة',
      descScript: 'المصادر المسموح بها لتحميل نصوص JS',
      descStyle: 'المصادر المسموح بها لملفات أنماط CSS',
      descImg: 'المصادر المسموح بها للصور',
      descConnect: 'المصادر المسموح بها للاتصال بـ XHR/fetch',
      descFont: 'المصادر المسموح بها لخطوط ويب',
      descFrame: 'المصادر المسموح بها للإطارات الفرعية',
      descObject: 'المصادر المسموح بها للإضافات',
      descWorker: 'المصادر المسموح بها لنصوص Web Worker'
    },
    ko: {
      title: 'CSP 보안 헤더 생성기',
      subtitle: '콘텐츠 보안 정책 (Content Security Policy)을 손쉽게 설정하여 XSS 및 데이터 주입 공격을 방지하세요',
      presetsLabel: '보안 프리셋',
      presetStrict: '엄격 (권장)',
      presetRelaxed: '느슨함 (인라인 허용)',
      presetNone: '전체 제한',
      custom: '사용자 정의',
      directiveDefault: '기본 규칙 (default-src)',
      directiveScript: '스크립트 소스 (script-src)',
      directiveStyle: '스타일 소스 (style-src)',
      directiveImg: '이미지 소스 (img-src)',
      directiveConnect: '연결 소스 (connect-src)',
      directiveFont: '글꼴 소스 (font-src)',
      directiveFrame: '프레임 소스 (frame-src)',
      directiveObject: '오브젝트 소스 (object-src)',
      directiveWorker: '워커 소스 (worker-src)',
      upgradeInsecure: '암호화되지 않은 요청 업그레이드',
      customDomains: '사용자 정의 도메인',
      placeholderAdd: '도메인 추가, 예: api.example.com',
      outputHeader: 'HTTP 응답 헤더 (Content-Security-Policy)',
      outputMeta: 'HTML Meta 태그',
      outputNginx: 'Nginx 설정',
      outputApache: 'Apache 설정',
      copyBtn: '복사',
      copied: '✓ 복사됨!',
      descDefault: '다른 지시어가 정의되지 않았을 때의 대체 규칙',
      descScript: 'JS 스크립트를 로드하고 실행할 수 있는 소스',
      descStyle: 'CSS 스타일시트의 로드 소스',
      descImg: '이미지 리소스의 로드 소스',
      descConnect: 'fetch/XHR/WebSockets 등을 연결할 수 있는 소스',
      descFont: '웹 폰트의 로드 소스',
      descFrame: 'iframe 프레임 삽입 소스',
      descObject: '플러그인 리소스 로드 소스',
      descWorker: '웹 워커 스크립트의 로드 소스'
    },
    ru: {
      title: 'Генератор CSP-заголовков',
      subtitle: 'Легко настраивайте политику безопасности контента (Content Security Policy) для защиты от XSS и инъекций данных',
      presetsLabel: 'Шаблоны безопасности',
      presetStrict: 'Строгий (Рекомендуется)',
      presetRelaxed: 'Мягкий (Разрешает inline)',
      presetNone: 'Заблокировать все',
      custom: 'Пользовательский',
      directiveDefault: 'Основной источник (default-src)',
      directiveScript: 'Скрипты (script-src)',
      directiveStyle: 'Стили (style-src)',
      directiveImg: 'Изображения (img-src)',
      directiveConnect: 'Запросы/Соединения (connect-src)',
      directiveFont: 'Шрифты (font-src)',
      directiveFrame: 'Фреймы (frame-src)',
      directiveObject: 'Объекты/Плагины (object-src)',
      directiveWorker: 'Воркеры (worker-src)',
      upgradeInsecure: 'Переходить на безопасные запросы',
      customDomains: 'Собственные домены',
      placeholderAdd: 'Добавить домен, например api.example.com',
      outputHeader: 'HTTP-заголовок (Content-Security-Policy)',
      outputMeta: 'HTML-тег Meta',
      outputNginx: 'Конфигурация Nginx',
      outputApache: 'Конфигурация Apache',
      copyBtn: 'Копировать',
      copied: '✓ Скопировано!',
      descDefault: 'Правила по умолчанию, если другие директивы не заданы',
      descScript: 'Разрешенные источники для скриптов JS',
      descStyle: 'Разрешенные источники для стилей CSS',
      descImg: 'Разрешенные источники для изображений',
      descConnect: 'Куда можно делать fetch, WebSocket и XHR',
      descFont: 'Разрешенные веб-шрифты',
      descFrame: 'Разрешенные iframe-источники',
      descObject: 'Разрешенные плагины (Flash/Java)',
      descWorker: 'Разрешенные Web Worker скрипты'
    }
  };

  const t = (key: string): string => {
    return (translations[key] as string) || I18N_BACKUP[locale]?.[key] || I18N_BACKUP.en[key] || key;
  };

  // Structured directives model
  interface DirectiveState {
    name: string;
    descriptionKey: string;
    presets: {
      strict: string[];
      relaxed: string[];
      none: string[];
    };
    self: boolean;
    none: boolean;
    inline: boolean;
    eval: boolean;
    customInput: string;
    customDomains: string[];
  }

  let directives = $state<Record<string, DirectiveState>>({
    'default-src': {
      name: t('directiveDefault'),
      descriptionKey: 'descDefault',
      presets: { strict: ['self'], relaxed: ['self'], none: ['none'] },
      self: true, none: false, inline: false, eval: false, customInput: '', customDomains: []
    },
    'script-src': {
      name: t('directiveScript'),
      descriptionKey: 'descScript',
      presets: { strict: ['self'], relaxed: ['self', 'unsafe-inline', 'unsafe-eval'], none: ['none'] },
      self: true, none: false, inline: false, eval: false, customInput: '', customDomains: []
    },
    'style-src': {
      name: t('directiveStyle'),
      descriptionKey: 'descStyle',
      presets: { strict: ['self', 'unsafe-inline'], relaxed: ['self', 'unsafe-inline'], none: ['none'] },
      self: true, none: false, inline: true, eval: false, customInput: '', customDomains: []
    },
    'img-src': {
      name: t('directiveImg'),
      descriptionKey: 'descImg',
      presets: { strict: ['self', 'data:'], relaxed: ['self', 'data:', 'https:'], none: ['none'] },
      self: true, none: false, inline: false, eval: false, customInput: '', customDomains: ['data:']
    },
    'connect-src': {
      name: t('directiveConnect'),
      descriptionKey: 'descConnect',
      presets: { strict: ['self'], relaxed: ['self', 'https:'], none: ['none'] },
      self: true, none: false, inline: false, eval: false, customInput: '', customDomains: []
    },
    'font-src': {
      name: t('directiveFont'),
      descriptionKey: 'descFont',
      presets: { strict: ['self'], relaxed: ['self', 'https:', 'data:'], none: ['none'] },
      self: true, none: false, inline: false, eval: false, customInput: '', customDomains: []
    },
    'frame-src': {
      name: t('directiveFrame'),
      descriptionKey: 'descFrame',
      presets: { strict: ['self'], relaxed: ['self'], none: ['none'] },
      self: true, none: false, inline: false, eval: false, customInput: '', customDomains: []
    },
    'object-src': {
      name: t('directiveObject'),
      descriptionKey: 'descObject',
      presets: { strict: ['none'], relaxed: ['self'], none: ['none'] },
      self: false, none: true, inline: false, eval: false, customInput: '', customDomains: []
    },
    'worker-src': {
      name: t('directiveWorker'),
      descriptionKey: 'descWorker',
      presets: { strict: ['self'], relaxed: ['self'], none: ['none'] },
      self: true, none: false, inline: false, eval: false, customInput: '', customDomains: []
    }
  });

  let upgradeInsecureRequests = $state(true);
  let activePreset = $state<'strict' | 'relaxed' | 'none' | 'custom'>('strict');

  // Trigger preset loading
  function applyPreset(presetType: 'strict' | 'relaxed' | 'none') {
    activePreset = presetType;
    for (const key of Object.keys(directives)) {
      const dir = directives[key];
      const vals = dir.presets[presetType];
      dir.self = vals.includes('self') || vals.includes("'self'");
      dir.none = vals.includes('none') || vals.includes("'none'");
      dir.inline = vals.includes('unsafe-inline') || vals.includes("'unsafe-inline'");
      dir.eval = vals.includes('unsafe-eval') || vals.includes("'unsafe-eval'");
      dir.customDomains = vals.filter(v => !['self', "'self'", 'none', "'none'", 'unsafe-inline', "'unsafe-inline'", 'unsafe-eval', "'unsafe-eval'"].includes(v));
    }
    if (presetType === 'strict') upgradeInsecureRequests = true;
    if (presetType === 'none') upgradeInsecureRequests = false;
  }

  // Derived compiled header values
  let cspHeaderValue = $derived.by(() => {
    const config: Record<string, any> = {};
    for (const key of Object.keys(directives)) {
      const dir = directives[key];
      const list: string[] = [];
      if (dir.none) {
        list.push('none');
      } else {
        if (dir.self) list.push('self');
        if (dir.inline) list.push('unsafe-inline');
        if (dir.eval) list.push('unsafe-eval');
        if (dir.customDomains.length > 0) {
          list.push(...dir.customDomains);
        }
      }
      if (list.length > 0) {
        config[key] = list;
      }
    }
    if (upgradeInsecureRequests) {
      config['upgrade-insecure-requests'] = true;
    }
    return buildCspHeader(config);
  });

  // Copied alert states
  let copyStates = $state<Record<string, boolean>>({
    header: false,
    meta: false,
    nginx: false,
    apache: false
  });

  async function handleCopy(type: string, content: string) {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      copyStates[type] = true;
      setTimeout(() => {
        copyStates[type] = false;
      }, 2000);
    } catch (e) {
      console.error(e);
    }
  }

  // Tags Domain append handler
  function handleAddDomain(key: string, e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const dir = directives[key];
      const val = dir.customInput.trim();
      if (val && !dir.customDomains.includes(val)) {
        dir.customDomains.push(val);
        dir.customInput = '';
        activePreset = 'custom';
      }
    }
  }

  function removeDomain(key: string, idx: number) {
    directives[key].customDomains.splice(idx, 1);
    activePreset = 'custom';
  }

  // Derived output templates
  let metaTagOutput = $derived(cspHeaderValue ? `<meta http-equiv="Content-Security-Policy" content="${cspHeaderValue}">` : '');
  let nginxConfigOutput = $derived(cspHeaderValue ? `add_header Content-Security-Policy "${cspHeaderValue}" always;` : '');
  let apacheConfigOutput = $derived(cspHeaderValue ? `Header set Content-Security-Policy "${cspHeaderValue}"` : '');

  // Apply default strict preset at initialization
  $effect(() => {
    applyPreset('strict');
  });
</script>

<div class="tool-theme-workspace min-h-screen p-4 md:p-8 flex flex-col gap-6">
  <div class="max-w-6xl mx-auto w-full flex flex-col gap-6">
    
    <!-- Header -->
    <div class="border-b border-amber-500/20 pb-4">
      <h1 class="text-2xl md:text-3xl font-bold text-amber-700 dark:bg-gradient-to-r dark:from-amber-200 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent">
        {t('title')}
      </h1>
      <p class="text-stone-400 text-sm mt-1">{t('subtitle')}</p>
    </div>

    <!-- Presets -->
    <div class="bg-stone-900/60 border border-stone-800 p-5 rounded-xl flex flex-col gap-3">
      <span class="text-xs font-semibold text-amber-500 uppercase tracking-wider">{t('presetsLabel')}</span>
      <div class="flex flex-wrap gap-2">
        <button 
          onclick={() => applyPreset('strict')} 
          class="text-xs py-1.5 px-4 rounded-lg border transition font-semibold {activePreset === 'strict' ? 'bg-amber-500 border-amber-500 text-stone-950' : 'bg-stone-850 border-stone-700 text-stone-300 hover:text-amber-400'}"
        >
          {t('presetStrict')}
        </button>
        <button 
          onclick={() => applyPreset('relaxed')} 
          class="text-xs py-1.5 px-4 rounded-lg border transition font-semibold {activePreset === 'relaxed' ? 'bg-amber-500 border-amber-500 text-stone-950' : 'bg-stone-850 border-stone-700 text-stone-300 hover:text-amber-400'}"
        >
          {t('presetRelaxed')}
        </button>
        <button 
          onclick={() => applyPreset('none')} 
          class="text-xs py-1.5 px-4 rounded-lg border transition font-semibold {activePreset === 'none' ? 'bg-amber-500 border-amber-500 text-stone-950' : 'bg-stone-850 border-stone-700 text-stone-300 hover:text-amber-400'}"
        >
          {t('presetNone')}
        </button>
        {#if activePreset === 'custom'}
          <span class="text-xs font-semibold bg-stone-950 border border-amber-500/30 text-amber-400 py-1.5 px-4 rounded-lg select-none">
            {t('custom')}
          </span>
        {/if}
      </div>
    </div>

    <!-- Main Workspace -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Config Section -->
      <div class="lg:col-span-7 flex flex-col gap-4 max-h-[720px] overflow-y-auto pr-1">
        
        <!-- Upgrade Insecure requests checkbox -->
        <div class="bg-stone-900/30 border border-stone-800 p-4 rounded-xl flex items-center gap-3">
          <input 
            type="checkbox" 
            id="upgrade-insec"
            bind:checked={upgradeInsecureRequests}
            onclick={() => activePreset = 'custom'}
            class="w-4 h-4 rounded accent-amber-500"
          />
          <label for="upgrade-insec" class="text-xs font-semibold text-stone-200 cursor-pointer">{t('upgradeInsecure')}</label>
        </div>

        <!-- Directive List -->
        {#each Object.keys(directives) as key}
          {@const dir = directives[key]}
          <div class="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col gap-3">
            <div>
              <h3 class="text-xs font-bold text-amber-400 font-mono">{key}</h3>
              <p class="text-stone-400 text-[10px] mt-0.5">{t(dir.descriptionKey)}</p>
            </div>

            <!-- Quick options checkboxes -->
            <div class="flex flex-wrap gap-4 mt-1 border-t border-stone-850 pt-2">
              {#if key !== 'object-src'}
                <label class="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    bind:checked={dir.self} 
                    disabled={dir.none}
                    onclick={() => activePreset = 'custom'}
                    class="accent-amber-500"
                  />
                  <span>'self'</span>
                </label>
              {/if}

              <label class="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                <input 
                  type="checkbox" 
                  bind:checked={dir.none}
                  onclick={() => {
                    if (!dir.none) {
                      dir.self = false; dir.inline = false; dir.eval = false; dir.customDomains = [];
                    }
                    activePreset = 'custom';
                  }}
                  class="accent-amber-500"
                />
                <span>'none'</span>
              </label>

              {#if ['script-src', 'style-src'].includes(key)}
                <label class="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    bind:checked={dir.inline} 
                    disabled={dir.none}
                    onclick={() => activePreset = 'custom'}
                    class="accent-amber-500"
                  />
                  <span>'unsafe-inline'</span>
                </label>
              {/if}

              {#if ['script-src'].includes(key)}
                <label class="flex items-center gap-1.5 text-xs text-stone-300 cursor-pointer">
                  <input 
                    type="checkbox" 
                    bind:checked={dir.eval} 
                    disabled={dir.none}
                    onclick={() => activePreset = 'custom'}
                    class="accent-amber-500"
                  />
                  <span>'unsafe-eval'</span>
                </label>
              {/if}
            </div>

            <!-- Custom Domain Tags -->
            {#if !dir.none}
              <div class="flex flex-col gap-2 mt-2">
                <span class="text-[10px] text-stone-400 font-semibold">{t('customDomains')}</span>
                
                <div class="flex flex-wrap gap-1.5">
                  {#each dir.customDomains as domain, dIdx}
                    <span class="inline-flex items-center gap-1 bg-stone-900 border border-stone-850 py-0.5 px-2 rounded-lg text-[10px] text-stone-300">
                      <span>{domain}</span>
                      <button 
                        onclick={() => removeDomain(key, dIdx)} 
                        class="text-stone-500 hover:text-red-400 font-semibold cursor-pointer"
                      >&times;</button>
                    </span>
                  {/each}
                </div>

                <input 
                  type="text" 
                  bind:value={dir.customInput}
                  placeholder={t('placeholderAdd')}
                  onkeydown={(e) => handleAddDomain(key, e)}
                  class="w-full bg-stone-950 border border-stone-800 focus:border-amber-500/50 rounded-lg py-1.5 px-3 text-[11px] text-stone-300 focus:outline-none"
                />
              </div>
            {/if}

          </div>
        {/each}

      </div>

      <!-- Right Output Section -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        
        <!-- Raw Header -->
        <div class="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-amber-500 uppercase tracking-wider">{t('outputHeader')}</span>
            <button 
              onclick={() => handleCopy('header', cspHeaderValue)}
              class="text-[11px] bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 py-1 px-2.5 rounded transition"
            >
              {copyStates.header ? t('copied') : t('copyBtn')}
            </button>
          </div>
          <pre class="w-full h-[120px] bg-stone-950 border border-stone-800 rounded-lg p-3 text-[10px] font-mono text-stone-300 overflow-y-auto leading-relaxed border-l-2 border-l-amber-500">{cspHeaderValue || ''}</pre>
        </div>

        <!-- Meta Tag -->
        <div class="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-amber-500 uppercase tracking-wider">{t('outputMeta')}</span>
            <button 
              onclick={() => handleCopy('meta', metaTagOutput)}
              class="text-[11px] bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 py-1 px-2.5 rounded transition"
            >
              {copyStates.meta ? t('copied') : t('copyBtn')}
            </button>
          </div>
          <pre class="w-full h-[80px] bg-stone-950 border border-stone-800 rounded-lg p-3 text-[10px] font-mono text-stone-300 overflow-y-auto leading-relaxed border-l-2 border-l-amber-500">{metaTagOutput || ''}</pre>
        </div>

        <!-- Nginx -->
        <div class="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-amber-500 uppercase tracking-wider">{t('outputNginx')}</span>
            <button 
              onclick={() => handleCopy('nginx', nginxConfigOutput)}
              class="text-[11px] bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 py-1 px-2.5 rounded transition"
            >
              {copyStates.nginx ? t('copied') : t('copyBtn')}
            </button>
          </div>
          <pre class="w-full h-[80px] bg-stone-950 border border-stone-800 rounded-lg p-3 text-[10px] font-mono text-stone-300 overflow-y-auto leading-relaxed border-l-2 border-l-amber-500">{nginxConfigOutput || ''}</pre>
        </div>

        <!-- Apache -->
        <div class="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col gap-2 relative">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-amber-500 uppercase tracking-wider">{t('outputApache')}</span>
            <button 
              onclick={() => handleCopy('apache', apacheConfigOutput)}
              class="text-[11px] bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 py-1 px-2.5 rounded transition"
            >
              {copyStates.apache ? t('copied') : t('copyBtn')}
            </button>
          </div>
          <pre class="w-full h-[80px] bg-stone-950 border border-stone-800 rounded-lg p-3 text-[10px] font-mono text-stone-300 overflow-y-auto leading-relaxed border-l-2 border-l-amber-500">{apacheConfigOutput || ''}</pre>
        </div>

      </div>

    </div>

  </div>
</div>
