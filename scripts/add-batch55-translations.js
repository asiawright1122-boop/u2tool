const fs = require('fs');

const translations = {
  en: {
    'ip-geolocation': {
      name: 'IP Geolocation',
      description: 'Look up geographic location information for any IP address',
      seo_title: 'Free IP Geolocation Lookup Tool Online',
      seo_description: 'Look up geographic location, ISP, timezone and more for any IP address. Free online IP geolocation tool with accurate results.',
      ipAddress: 'IP Address',
      placeholder: 'Enter IP address (e.g., 8.8.8.8) or leave empty for your IP',
      lookup: 'Lookup',
      loading: 'Looking up...',
      myIp: 'My IP Address',
      results: 'Geolocation Results',
      country: 'Country',
      region: 'Region',
      city: 'City',
      zipCode: 'ZIP Code',
      timezone: 'Timezone',
      coordinates: 'Coordinates',
      isp: 'ISP',
      organization: 'Organization',
      asn: 'ASN',
      viewOnMap: 'View on Map',
      invalidIp: 'Invalid IP address',
      lookupError: 'Failed to lookup IP address'
    },
    'screen-recorder': {
      name: 'Screen Recorder',
      description: 'Record your screen directly in the browser',
      seo_title: 'Free Online Screen Recorder - No Installation Required',
      seo_description: 'Record your screen directly in the browser. Free online screen recorder with no installation required. Download recordings as WebM.',
      start: 'Start Recording',
      stop: 'Stop',
      pause: 'Pause',
      resume: 'Resume',
      recording: 'Recording...',
      paused: 'Paused',
      preview: 'Recording Preview',
      download: 'Download Recording',
      newRecording: 'New Recording',
      notSupported: 'Screen recording is not supported in your browser. Please use Chrome, Edge, or Firefox.',
      permissionDenied: 'Screen sharing permission was denied',
      startError: 'Failed to start screen recording',
      instructions: 'How to use',
      instruction1: 'Click "Start Recording" to begin',
      instruction2: 'Select the screen, window, or tab you want to record',
      instruction3: 'Click "Stop" when finished, then download your recording'
    }
  }
};


// Chinese translations
translations.zh = {
  'ip-geolocation': {
    name: 'IP 地理位置查询',
    description: '查询任意 IP 地址的地理位置信息',
    seo_title: '免费在线 IP 地理位置查询工具',
    seo_description: '查询任意 IP 地址的地理位置、ISP、时区等信息。免费在线 IP 地理位置查询工具，结果准确。',
    ipAddress: 'IP 地址',
    placeholder: '输入 IP 地址（如 8.8.8.8）或留空查询您的 IP',
    lookup: '查询',
    loading: '查询中...',
    myIp: '查询我的 IP',
    results: '地理位置结果',
    country: '国家',
    region: '地区',
    city: '城市',
    zipCode: '邮编',
    timezone: '时区',
    coordinates: '坐标',
    isp: '运营商',
    organization: '组织',
    asn: 'ASN',
    viewOnMap: '在地图上查看',
    invalidIp: '无效的 IP 地址',
    lookupError: 'IP 地址查询失败'
  },
  'screen-recorder': {
    name: '屏幕录制',
    description: '直接在浏览器中录制屏幕',
    seo_title: '免费在线屏幕录制工具 - 无需安装',
    seo_description: '直接在浏览器中录制屏幕。免费在线屏幕录制工具，无需安装任何软件。录制文件可下载为 WebM 格式。',
    start: '开始录制',
    stop: '停止',
    pause: '暂停',
    resume: '继续',
    recording: '录制中...',
    paused: '已暂停',
    preview: '录制预览',
    download: '下载录制',
    newRecording: '新建录制',
    notSupported: '您的浏览器不支持屏幕录制。请使用 Chrome、Edge 或 Firefox。',
    permissionDenied: '屏幕共享权限被拒绝',
    startError: '启动屏幕录制失败',
    instructions: '使用说明',
    instruction1: '点击"开始录制"按钮',
    instruction2: '选择要录制的屏幕、窗口或标签页',
    instruction3: '完成后点击"停止"，然后下载录制文件'
  }
};


// Japanese translations
translations.ja = {
  'ip-geolocation': {
    name: 'IP ジオロケーション',
    description: '任意の IP アドレスの地理的位置情報を検索',
    seo_title: '無料オンライン IP ジオロケーション検索ツール',
    seo_description: '任意の IP アドレスの地理的位置、ISP、タイムゾーンなどを検索。無料のオンライン IP ジオロケーションツール。',
    ipAddress: 'IP アドレス',
    placeholder: 'IP アドレスを入力（例：8.8.8.8）または空欄で自分の IP を検索',
    lookup: '検索',
    loading: '検索中...',
    myIp: '自分の IP を検索',
    results: 'ジオロケーション結果',
    country: '国',
    region: '地域',
    city: '都市',
    zipCode: '郵便番号',
    timezone: 'タイムゾーン',
    coordinates: '座標',
    isp: 'ISP',
    organization: '組織',
    asn: 'ASN',
    viewOnMap: '地図で表示',
    invalidIp: '無効な IP アドレス',
    lookupError: 'IP アドレスの検索に失敗しました'
  },
  'screen-recorder': {
    name: 'スクリーンレコーダー',
    description: 'ブラウザで直接画面を録画',
    seo_title: '無料オンラインスクリーンレコーダー - インストール不要',
    seo_description: 'ブラウザで直接画面を録画。インストール不要の無料オンラインスクリーンレコーダー。WebM 形式でダウンロード可能。',
    start: '録画開始',
    stop: '停止',
    pause: '一時停止',
    resume: '再開',
    recording: '録画中...',
    paused: '一時停止中',
    preview: '録画プレビュー',
    download: '録画をダウンロード',
    newRecording: '新規録画',
    notSupported: 'お使いのブラウザは画面録画に対応していません。Chrome、Edge、Firefox をご利用ください。',
    permissionDenied: '画面共有の許可が拒否されました',
    startError: '画面録画の開始に失敗しました',
    instructions: '使い方',
    instruction1: '「録画開始」ボタンをクリック',
    instruction2: '録画する画面、ウィンドウ、またはタブを選択',
    instruction3: '完了したら「停止」をクリックし、録画をダウンロード'
  }
};


// Korean translations
translations.ko = {
  'ip-geolocation': {
    name: 'IP 지리적 위치',
    description: '모든 IP 주소의 지리적 위치 정보 조회',
    seo_title: '무료 온라인 IP 지리적 위치 조회 도구',
    seo_description: '모든 IP 주소의 지리적 위치, ISP, 시간대 등을 조회하세요. 정확한 결과를 제공하는 무료 온라인 IP 지리적 위치 도구.',
    ipAddress: 'IP 주소',
    placeholder: 'IP 주소 입력 (예: 8.8.8.8) 또는 비워두면 내 IP 조회',
    lookup: '조회',
    loading: '조회 중...',
    myIp: '내 IP 조회',
    results: '지리적 위치 결과',
    country: '국가',
    region: '지역',
    city: '도시',
    zipCode: '우편번호',
    timezone: '시간대',
    coordinates: '좌표',
    isp: 'ISP',
    organization: '조직',
    asn: 'ASN',
    viewOnMap: '지도에서 보기',
    invalidIp: '잘못된 IP 주소',
    lookupError: 'IP 주소 조회 실패'
  },
  'screen-recorder': {
    name: '화면 녹화',
    description: '브라우저에서 직접 화면 녹화',
    seo_title: '무료 온라인 화면 녹화 도구 - 설치 불필요',
    seo_description: '브라우저에서 직접 화면을 녹화하세요. 설치가 필요 없는 무료 온라인 화면 녹화 도구. WebM 형식으로 다운로드 가능.',
    start: '녹화 시작',
    stop: '중지',
    pause: '일시정지',
    resume: '재개',
    recording: '녹화 중...',
    paused: '일시정지됨',
    preview: '녹화 미리보기',
    download: '녹화 다운로드',
    newRecording: '새 녹화',
    notSupported: '브라우저가 화면 녹화를 지원하지 않습니다. Chrome, Edge 또는 Firefox를 사용하세요.',
    permissionDenied: '화면 공유 권한이 거부되었습니다',
    startError: '화면 녹화 시작 실패',
    instructions: '사용 방법',
    instruction1: '"녹화 시작" 버튼 클릭',
    instruction2: '녹화할 화면, 창 또는 탭 선택',
    instruction3: '완료되면 "중지"를 클릭하고 녹화 다운로드'
  }
};


// Spanish translations
translations.es = {
  'ip-geolocation': {
    name: 'Geolocalización IP',
    description: 'Buscar información de ubicación geográfica para cualquier dirección IP',
    seo_title: 'Herramienta gratuita de geolocalización IP en línea',
    seo_description: 'Busque ubicación geográfica, ISP, zona horaria y más para cualquier dirección IP. Herramienta gratuita de geolocalización IP con resultados precisos.',
    ipAddress: 'Dirección IP',
    placeholder: 'Ingrese dirección IP (ej: 8.8.8.8) o deje vacío para su IP',
    lookup: 'Buscar',
    loading: 'Buscando...',
    myIp: 'Mi dirección IP',
    results: 'Resultados de geolocalización',
    country: 'País',
    region: 'Región',
    city: 'Ciudad',
    zipCode: 'Código postal',
    timezone: 'Zona horaria',
    coordinates: 'Coordenadas',
    isp: 'ISP',
    organization: 'Organización',
    asn: 'ASN',
    viewOnMap: 'Ver en mapa',
    invalidIp: 'Dirección IP inválida',
    lookupError: 'Error al buscar dirección IP'
  },
  'screen-recorder': {
    name: 'Grabador de pantalla',
    description: 'Grabe su pantalla directamente en el navegador',
    seo_title: 'Grabador de pantalla en línea gratuito - Sin instalación',
    seo_description: 'Grabe su pantalla directamente en el navegador. Grabador de pantalla en línea gratuito sin instalación. Descargue grabaciones como WebM.',
    start: 'Iniciar grabación',
    stop: 'Detener',
    pause: 'Pausar',
    resume: 'Reanudar',
    recording: 'Grabando...',
    paused: 'Pausado',
    preview: 'Vista previa',
    download: 'Descargar grabación',
    newRecording: 'Nueva grabación',
    notSupported: 'La grabación de pantalla no es compatible con su navegador. Use Chrome, Edge o Firefox.',
    permissionDenied: 'Permiso de compartir pantalla denegado',
    startError: 'Error al iniciar grabación',
    instructions: 'Instrucciones',
    instruction1: 'Haga clic en "Iniciar grabación"',
    instruction2: 'Seleccione la pantalla, ventana o pestaña a grabar',
    instruction3: 'Haga clic en "Detener" al terminar y descargue'
  }
};


// Portuguese translations
translations.pt = {
  'ip-geolocation': {
    name: 'Geolocalização IP',
    description: 'Pesquisar informações de localização geográfica para qualquer endereço IP',
    seo_title: 'Ferramenta gratuita de geolocalização IP online',
    seo_description: 'Pesquise localização geográfica, ISP, fuso horário e mais para qualquer endereço IP. Ferramenta gratuita de geolocalização IP com resultados precisos.',
    ipAddress: 'Endereço IP',
    placeholder: 'Digite o endereço IP (ex: 8.8.8.8) ou deixe vazio para seu IP',
    lookup: 'Pesquisar',
    loading: 'Pesquisando...',
    myIp: 'Meu endereço IP',
    results: 'Resultados de geolocalização',
    country: 'País',
    region: 'Região',
    city: 'Cidade',
    zipCode: 'CEP',
    timezone: 'Fuso horário',
    coordinates: 'Coordenadas',
    isp: 'ISP',
    organization: 'Organização',
    asn: 'ASN',
    viewOnMap: 'Ver no mapa',
    invalidIp: 'Endereço IP inválido',
    lookupError: 'Falha ao pesquisar endereço IP'
  },
  'screen-recorder': {
    name: 'Gravador de tela',
    description: 'Grave sua tela diretamente no navegador',
    seo_title: 'Gravador de tela online gratuito - Sem instalação',
    seo_description: 'Grave sua tela diretamente no navegador. Gravador de tela online gratuito sem instalação. Baixe gravações como WebM.',
    start: 'Iniciar gravação',
    stop: 'Parar',
    pause: 'Pausar',
    resume: 'Retomar',
    recording: 'Gravando...',
    paused: 'Pausado',
    preview: 'Pré-visualização',
    download: 'Baixar gravação',
    newRecording: 'Nova gravação',
    notSupported: 'A gravação de tela não é suportada no seu navegador. Use Chrome, Edge ou Firefox.',
    permissionDenied: 'Permissão de compartilhamento de tela negada',
    startError: 'Falha ao iniciar gravação',
    instructions: 'Instruções',
    instruction1: 'Clique em "Iniciar gravação"',
    instruction2: 'Selecione a tela, janela ou aba para gravar',
    instruction3: 'Clique em "Parar" ao terminar e baixe'
  }
};


// French translations
translations.fr = {
  'ip-geolocation': {
    name: 'Géolocalisation IP',
    description: 'Rechercher les informations de localisation géographique pour toute adresse IP',
    seo_title: 'Outil gratuit de géolocalisation IP en ligne',
    seo_description: 'Recherchez la localisation géographique, le FAI, le fuseau horaire et plus pour toute adresse IP. Outil gratuit de géolocalisation IP avec des résultats précis.',
    ipAddress: 'Adresse IP',
    placeholder: 'Entrez l\'adresse IP (ex: 8.8.8.8) ou laissez vide pour votre IP',
    lookup: 'Rechercher',
    loading: 'Recherche...',
    myIp: 'Mon adresse IP',
    results: 'Résultats de géolocalisation',
    country: 'Pays',
    region: 'Région',
    city: 'Ville',
    zipCode: 'Code postal',
    timezone: 'Fuseau horaire',
    coordinates: 'Coordonnées',
    isp: 'FAI',
    organization: 'Organisation',
    asn: 'ASN',
    viewOnMap: 'Voir sur la carte',
    invalidIp: 'Adresse IP invalide',
    lookupError: 'Échec de la recherche d\'adresse IP'
  },
  'screen-recorder': {
    name: 'Enregistreur d\'écran',
    description: 'Enregistrez votre écran directement dans le navigateur',
    seo_title: 'Enregistreur d\'écran en ligne gratuit - Sans installation',
    seo_description: 'Enregistrez votre écran directement dans le navigateur. Enregistreur d\'écran en ligne gratuit sans installation. Téléchargez les enregistrements en WebM.',
    start: 'Démarrer l\'enregistrement',
    stop: 'Arrêter',
    pause: 'Pause',
    resume: 'Reprendre',
    recording: 'Enregistrement...',
    paused: 'En pause',
    preview: 'Aperçu',
    download: 'Télécharger l\'enregistrement',
    newRecording: 'Nouvel enregistrement',
    notSupported: 'L\'enregistrement d\'écran n\'est pas pris en charge par votre navigateur. Utilisez Chrome, Edge ou Firefox.',
    permissionDenied: 'Permission de partage d\'écran refusée',
    startError: 'Échec du démarrage de l\'enregistrement',
    instructions: 'Instructions',
    instruction1: 'Cliquez sur "Démarrer l\'enregistrement"',
    instruction2: 'Sélectionnez l\'écran, la fenêtre ou l\'onglet à enregistrer',
    instruction3: 'Cliquez sur "Arrêter" une fois terminé et téléchargez'
  }
};


// German translations
translations.de = {
  'ip-geolocation': {
    name: 'IP-Geolokalisierung',
    description: 'Geografische Standortinformationen für jede IP-Adresse nachschlagen',
    seo_title: 'Kostenloses Online IP-Geolokalisierungs-Tool',
    seo_description: 'Suchen Sie geografischen Standort, ISP, Zeitzone und mehr für jede IP-Adresse. Kostenloses Online IP-Geolokalisierungs-Tool mit genauen Ergebnissen.',
    ipAddress: 'IP-Adresse',
    placeholder: 'IP-Adresse eingeben (z.B. 8.8.8.8) oder leer lassen für Ihre IP',
    lookup: 'Suchen',
    loading: 'Suche...',
    myIp: 'Meine IP-Adresse',
    results: 'Geolokalisierungsergebnisse',
    country: 'Land',
    region: 'Region',
    city: 'Stadt',
    zipCode: 'PLZ',
    timezone: 'Zeitzone',
    coordinates: 'Koordinaten',
    isp: 'ISP',
    organization: 'Organisation',
    asn: 'ASN',
    viewOnMap: 'Auf Karte anzeigen',
    invalidIp: 'Ungültige IP-Adresse',
    lookupError: 'IP-Adresse konnte nicht gefunden werden'
  },
  'screen-recorder': {
    name: 'Bildschirmrekorder',
    description: 'Nehmen Sie Ihren Bildschirm direkt im Browser auf',
    seo_title: 'Kostenloser Online-Bildschirmrekorder - Keine Installation erforderlich',
    seo_description: 'Nehmen Sie Ihren Bildschirm direkt im Browser auf. Kostenloser Online-Bildschirmrekorder ohne Installation. Aufnahmen als WebM herunterladen.',
    start: 'Aufnahme starten',
    stop: 'Stoppen',
    pause: 'Pause',
    resume: 'Fortsetzen',
    recording: 'Aufnahme...',
    paused: 'Pausiert',
    preview: 'Vorschau',
    download: 'Aufnahme herunterladen',
    newRecording: 'Neue Aufnahme',
    notSupported: 'Bildschirmaufnahme wird von Ihrem Browser nicht unterstützt. Verwenden Sie Chrome, Edge oder Firefox.',
    permissionDenied: 'Bildschirmfreigabe-Berechtigung verweigert',
    startError: 'Aufnahme konnte nicht gestartet werden',
    instructions: 'Anleitung',
    instruction1: 'Klicken Sie auf "Aufnahme starten"',
    instruction2: 'Wählen Sie den Bildschirm, das Fenster oder den Tab aus',
    instruction3: 'Klicken Sie auf "Stoppen" und laden Sie die Aufnahme herunter'
  }
};


// Russian translations
translations.ru = {
  'ip-geolocation': {
    name: 'IP-геолокация',
    description: 'Поиск информации о географическом местоположении для любого IP-адреса',
    seo_title: 'Бесплатный онлайн инструмент IP-геолокации',
    seo_description: 'Найдите географическое местоположение, провайдера, часовой пояс и многое другое для любого IP-адреса. Бесплатный онлайн инструмент IP-геолокации с точными результатами.',
    ipAddress: 'IP-адрес',
    placeholder: 'Введите IP-адрес (например, 8.8.8.8) или оставьте пустым для вашего IP',
    lookup: 'Поиск',
    loading: 'Поиск...',
    myIp: 'Мой IP-адрес',
    results: 'Результаты геолокации',
    country: 'Страна',
    region: 'Регион',
    city: 'Город',
    zipCode: 'Почтовый индекс',
    timezone: 'Часовой пояс',
    coordinates: 'Координаты',
    isp: 'Провайдер',
    organization: 'Организация',
    asn: 'ASN',
    viewOnMap: 'Показать на карте',
    invalidIp: 'Недействительный IP-адрес',
    lookupError: 'Не удалось найти IP-адрес'
  },
  'screen-recorder': {
    name: 'Запись экрана',
    description: 'Записывайте экран прямо в браузере',
    seo_title: 'Бесплатная онлайн запись экрана - Без установки',
    seo_description: 'Записывайте экран прямо в браузере. Бесплатная онлайн запись экрана без установки. Скачивайте записи в формате WebM.',
    start: 'Начать запись',
    stop: 'Остановить',
    pause: 'Пауза',
    resume: 'Продолжить',
    recording: 'Запись...',
    paused: 'Приостановлено',
    preview: 'Предпросмотр',
    download: 'Скачать запись',
    newRecording: 'Новая запись',
    notSupported: 'Запись экрана не поддерживается вашим браузером. Используйте Chrome, Edge или Firefox.',
    permissionDenied: 'Разрешение на демонстрацию экрана отклонено',
    startError: 'Не удалось начать запись',
    instructions: 'Инструкция',
    instruction1: 'Нажмите "Начать запись"',
    instruction2: 'Выберите экран, окно или вкладку для записи',
    instruction3: 'Нажмите "Остановить" по завершении и скачайте'
  }
};


// Arabic translations
translations.ar = {
  'ip-geolocation': {
    name: 'تحديد الموقع الجغرافي لـ IP',
    description: 'البحث عن معلومات الموقع الجغرافي لأي عنوان IP',
    seo_title: 'أداة مجانية لتحديد الموقع الجغرافي لـ IP عبر الإنترنت',
    seo_description: 'ابحث عن الموقع الجغرافي ومزود الخدمة والمنطقة الزمنية والمزيد لأي عنوان IP. أداة مجانية لتحديد الموقع الجغرافي لـ IP بنتائج دقيقة.',
    ipAddress: 'عنوان IP',
    placeholder: 'أدخل عنوان IP (مثال: 8.8.8.8) أو اتركه فارغًا لعنوان IP الخاص بك',
    lookup: 'بحث',
    loading: 'جاري البحث...',
    myIp: 'عنوان IP الخاص بي',
    results: 'نتائج الموقع الجغرافي',
    country: 'الدولة',
    region: 'المنطقة',
    city: 'المدينة',
    zipCode: 'الرمز البريدي',
    timezone: 'المنطقة الزمنية',
    coordinates: 'الإحداثيات',
    isp: 'مزود الخدمة',
    organization: 'المنظمة',
    asn: 'ASN',
    viewOnMap: 'عرض على الخريطة',
    invalidIp: 'عنوان IP غير صالح',
    lookupError: 'فشل البحث عن عنوان IP'
  },
  'screen-recorder': {
    name: 'مسجل الشاشة',
    description: 'سجل شاشتك مباشرة في المتصفح',
    seo_title: 'مسجل شاشة مجاني عبر الإنترنت - بدون تثبيت',
    seo_description: 'سجل شاشتك مباشرة في المتصفح. مسجل شاشة مجاني عبر الإنترنت بدون تثبيت. قم بتنزيل التسجيلات بتنسيق WebM.',
    start: 'بدء التسجيل',
    stop: 'إيقاف',
    pause: 'إيقاف مؤقت',
    resume: 'استئناف',
    recording: 'جاري التسجيل...',
    paused: 'متوقف مؤقتًا',
    preview: 'معاينة',
    download: 'تنزيل التسجيل',
    newRecording: 'تسجيل جديد',
    notSupported: 'تسجيل الشاشة غير مدعوم في متصفحك. استخدم Chrome أو Edge أو Firefox.',
    permissionDenied: 'تم رفض إذن مشاركة الشاشة',
    startError: 'فشل بدء التسجيل',
    instructions: 'التعليمات',
    instruction1: 'انقر على "بدء التسجيل"',
    instruction2: 'حدد الشاشة أو النافذة أو علامة التبويب للتسجيل',
    instruction3: 'انقر على "إيقاف" عند الانتهاء ثم قم بالتنزيل'
  }
};

// Main script
const langs = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

langs.forEach(lang => {
  const filePath = `src/messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.tools) data.tools = {};
  
  // Add tool translations
  Object.keys(translations[lang]).forEach(toolSlug => {
    data.tools[toolSlug] = translations[lang][toolSlug];
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`✓ ${lang}`);
});

console.log('Done! Added 2 new tools to all 10 languages.');
