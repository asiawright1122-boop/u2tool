const fs = require('fs');
const path = require('path');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// Batch 54 UI translations - Part 4
const translations = {
  'base64-image-converter': {
    en: { imageToBase64: 'Image → Base64', base64ToImage: 'Base64 → Image', dropImageHere: 'Drop image here or click to select', supportsFormats: 'Supports PNG, JPG, GIF, WebP', preview: 'Preview', name: 'Name', size: 'Size', type: 'Type', decode: 'Decode', errorInvalidInput: 'Please enter a valid Base64 string', errorInvalidFormat: 'Invalid image format', selectImageFile: 'Please select an image file', failedToRead: 'Failed to read file' },
    zh: { imageToBase64: '图片 → Base64', base64ToImage: 'Base64 → 图片', dropImageHere: '拖放图片到此处或点击选择', supportsFormats: '支持 PNG、JPG、GIF、WebP', preview: '预览', name: '名称', size: '大小', type: '类型', decode: '解码', errorInvalidInput: '请输入有效的 Base64 字符串', errorInvalidFormat: '无效的图片格式', selectImageFile: '请选择图片文件', failedToRead: '读取文件失败' },
    ja: { imageToBase64: '画像 → Base64', base64ToImage: 'Base64 → 画像', dropImageHere: '画像をドロップまたはクリックして選択', supportsFormats: 'PNG、JPG、GIF、WebP対応', preview: 'プレビュー', name: '名前', size: 'サイズ', type: 'タイプ', decode: 'デコード', errorInvalidInput: '有効なBase64文字列を入力してください', errorInvalidFormat: '無効な画像形式', selectImageFile: '画像ファイルを選択してください', failedToRead: 'ファイルの読み込みに失敗しました' },
    ko: { imageToBase64: '이미지 → Base64', base64ToImage: 'Base64 → 이미지', dropImageHere: '이미지를 드롭하거나 클릭하여 선택', supportsFormats: 'PNG, JPG, GIF, WebP 지원', preview: '미리보기', name: '이름', size: '크기', type: '유형', decode: '디코드', errorInvalidInput: '유효한 Base64 문자열을 입력하세요', errorInvalidFormat: '잘못된 이미지 형식', selectImageFile: '이미지 파일을 선택하세요', failedToRead: '파일 읽기 실패' },
    es: { imageToBase64: 'Imagen → Base64', base64ToImage: 'Base64 → Imagen', dropImageHere: 'Arrastra la imagen aquí o haz clic para seleccionar', supportsFormats: 'Soporta PNG, JPG, GIF, WebP', preview: 'Vista previa', name: 'Nombre', size: 'Tamaño', type: 'Tipo', decode: 'Decodificar', errorInvalidInput: 'Por favor ingresa una cadena Base64 válida', errorInvalidFormat: 'Formato de imagen inválido', selectImageFile: 'Por favor selecciona un archivo de imagen', failedToRead: 'Error al leer el archivo' },
    pt: { imageToBase64: 'Imagem → Base64', base64ToImage: 'Base64 → Imagem', dropImageHere: 'Arraste a imagem aqui ou clique para selecionar', supportsFormats: 'Suporta PNG, JPG, GIF, WebP', preview: 'Pré-visualização', name: 'Nome', size: 'Tamanho', type: 'Tipo', decode: 'Decodificar', errorInvalidInput: 'Por favor insira uma string Base64 válida', errorInvalidFormat: 'Formato de imagem inválido', selectImageFile: 'Por favor selecione um arquivo de imagem', failedToRead: 'Falha ao ler o arquivo' },
    fr: { imageToBase64: 'Image → Base64', base64ToImage: 'Base64 → Image', dropImageHere: 'Déposez l\'image ici ou cliquez pour sélectionner', supportsFormats: 'Supporte PNG, JPG, GIF, WebP', preview: 'Aperçu', name: 'Nom', size: 'Taille', type: 'Type', decode: 'Décoder', errorInvalidInput: 'Veuillez entrer une chaîne Base64 valide', errorInvalidFormat: 'Format d\'image invalide', selectImageFile: 'Veuillez sélectionner un fichier image', failedToRead: 'Échec de la lecture du fichier' },
    de: { imageToBase64: 'Bild → Base64', base64ToImage: 'Base64 → Bild', dropImageHere: 'Bild hier ablegen oder klicken zum Auswählen', supportsFormats: 'Unterstützt PNG, JPG, GIF, WebP', preview: 'Vorschau', name: 'Name', size: 'Größe', type: 'Typ', decode: 'Dekodieren', errorInvalidInput: 'Bitte geben Sie einen gültigen Base64-String ein', errorInvalidFormat: 'Ungültiges Bildformat', selectImageFile: 'Bitte wählen Sie eine Bilddatei', failedToRead: 'Datei konnte nicht gelesen werden' },
    ru: { imageToBase64: 'Изображение → Base64', base64ToImage: 'Base64 → Изображение', dropImageHere: 'Перетащите изображение сюда или нажмите для выбора', supportsFormats: 'Поддерживает PNG, JPG, GIF, WebP', preview: 'Предпросмотр', name: 'Имя', size: 'Размер', type: 'Тип', decode: 'Декодировать', errorInvalidInput: 'Пожалуйста, введите корректную строку Base64', errorInvalidFormat: 'Неверный формат изображения', selectImageFile: 'Пожалуйста, выберите файл изображения', failedToRead: 'Не удалось прочитать файл' },
    ar: { imageToBase64: 'صورة → Base64', base64ToImage: 'Base64 → صورة', dropImageHere: 'اسحب الصورة هنا أو انقر للاختيار', supportsFormats: 'يدعم PNG، JPG، GIF، WebP', preview: 'معاينة', name: 'الاسم', size: 'الحجم', type: 'النوع', decode: 'فك التشفير', errorInvalidInput: 'يرجى إدخال سلسلة Base64 صالحة', errorInvalidFormat: 'تنسيق صورة غير صالح', selectImageFile: 'يرجى اختيار ملف صورة', failedToRead: 'فشل في قراءة الملف' }
  },
  'markdown-to-html-converter': {
    en: { markdownInput: 'Markdown Input', gfm: 'GFM (GitHub Flavored)', lineBreaks: 'Line Breaks', headerIds: 'Header IDs', preview: 'Preview', supportedSyntax: 'Supported Syntax', headers: 'Headers', bold: 'bold', italic: 'italic', links: 'links', images: 'images', lists: 'lists', ordered: 'ordered', quotes: 'quotes', code: 'code' },
    zh: { markdownInput: 'Markdown 输入', gfm: 'GFM (GitHub 风格)', lineBreaks: '换行符', headerIds: '标题 ID', preview: '预览', supportedSyntax: '支持的语法', headers: '标题', bold: '粗体', italic: '斜体', links: '链接', images: '图片', lists: '列表', ordered: '有序', quotes: '引用', code: '代码' },
    ja: { markdownInput: 'Markdown入力', gfm: 'GFM (GitHub風)', lineBreaks: '改行', headerIds: 'ヘッダーID', preview: 'プレビュー', supportedSyntax: 'サポートされる構文', headers: '見出し', bold: '太字', italic: '斜体', links: 'リンク', images: '画像', lists: 'リスト', ordered: '番号付き', quotes: '引用', code: 'コード' },
    ko: { markdownInput: 'Markdown 입력', gfm: 'GFM (GitHub 스타일)', lineBreaks: '줄 바꿈', headerIds: '헤더 ID', preview: '미리보기', supportedSyntax: '지원되는 구문', headers: '제목', bold: '굵게', italic: '기울임', links: '링크', images: '이미지', lists: '목록', ordered: '순서', quotes: '인용', code: '코드' },
    es: { markdownInput: 'Entrada Markdown', gfm: 'GFM (Estilo GitHub)', lineBreaks: 'Saltos de línea', headerIds: 'IDs de encabezado', preview: 'Vista previa', supportedSyntax: 'Sintaxis soportada', headers: 'Encabezados', bold: 'negrita', italic: 'cursiva', links: 'enlaces', images: 'imágenes', lists: 'listas', ordered: 'ordenado', quotes: 'citas', code: 'código' },
    pt: { markdownInput: 'Entrada Markdown', gfm: 'GFM (Estilo GitHub)', lineBreaks: 'Quebras de linha', headerIds: 'IDs de cabeçalho', preview: 'Pré-visualização', supportedSyntax: 'Sintaxe suportada', headers: 'Cabeçalhos', bold: 'negrito', italic: 'itálico', links: 'links', images: 'imagens', lists: 'listas', ordered: 'ordenado', quotes: 'citações', code: 'código' },
    fr: { markdownInput: 'Entrée Markdown', gfm: 'GFM (Style GitHub)', lineBreaks: 'Sauts de ligne', headerIds: 'IDs d\'en-tête', preview: 'Aperçu', supportedSyntax: 'Syntaxe supportée', headers: 'En-têtes', bold: 'gras', italic: 'italique', links: 'liens', images: 'images', lists: 'listes', ordered: 'ordonné', quotes: 'citations', code: 'code' },
    de: { markdownInput: 'Markdown-Eingabe', gfm: 'GFM (GitHub-Stil)', lineBreaks: 'Zeilenumbrüche', headerIds: 'Header-IDs', preview: 'Vorschau', supportedSyntax: 'Unterstützte Syntax', headers: 'Überschriften', bold: 'fett', italic: 'kursiv', links: 'Links', images: 'Bilder', lists: 'Listen', ordered: 'nummeriert', quotes: 'Zitate', code: 'Code' },
    ru: { markdownInput: 'Ввод Markdown', gfm: 'GFM (стиль GitHub)', lineBreaks: 'Переносы строк', headerIds: 'ID заголовков', preview: 'Предпросмотр', supportedSyntax: 'Поддерживаемый синтаксис', headers: 'Заголовки', bold: 'жирный', italic: 'курсив', links: 'ссылки', images: 'изображения', lists: 'списки', ordered: 'нумерованный', quotes: 'цитаты', code: 'код' },
    ar: { markdownInput: 'إدخال Markdown', gfm: 'GFM (نمط GitHub)', lineBreaks: 'فواصل الأسطر', headerIds: 'معرفات العناوين', preview: 'معاينة', supportedSyntax: 'الصيغة المدعومة', headers: 'العناوين', bold: 'عريض', italic: 'مائل', links: 'روابط', images: 'صور', lists: 'قوائم', ordered: 'مرتب', quotes: 'اقتباسات', code: 'كود' }
  },
  'json-to-protobuf-converter': {
    en: { jsonInput: 'JSON Input', loadExample: 'Load Example', packageName: 'Package Name', messageName: 'Message Name', syntax: 'Syntax', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: 'Type Mapping', invalidJson: 'Invalid JSON. Please check the syntax.', packageNamePlaceholder: 'e.g., example', messageNamePlaceholder: 'e.g., Root' },
    zh: { jsonInput: 'JSON 输入', loadExample: '加载示例', packageName: '包名', messageName: '消息名', syntax: '语法', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: '类型映射', invalidJson: '无效的 JSON。请检查语法。', packageNamePlaceholder: '例如：example', messageNamePlaceholder: '例如：Root' },
    ja: { jsonInput: 'JSON入力', loadExample: '例を読み込む', packageName: 'パッケージ名', messageName: 'メッセージ名', syntax: '構文', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: '型マッピング', invalidJson: '無効なJSONです。構文を確認してください。', packageNamePlaceholder: '例：example', messageNamePlaceholder: '例：Root' },
    ko: { jsonInput: 'JSON 입력', loadExample: '예제 로드', packageName: '패키지 이름', messageName: '메시지 이름', syntax: '구문', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: '타입 매핑', invalidJson: '잘못된 JSON입니다. 구문을 확인하세요.', packageNamePlaceholder: '예: example', messageNamePlaceholder: '예: Root' },
    es: { jsonInput: 'Entrada JSON', loadExample: 'Cargar ejemplo', packageName: 'Nombre del paquete', messageName: 'Nombre del mensaje', syntax: 'Sintaxis', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: 'Mapeo de tipos', invalidJson: 'JSON inválido. Por favor verifica la sintaxis.', packageNamePlaceholder: 'ej., example', messageNamePlaceholder: 'ej., Root' },
    pt: { jsonInput: 'Entrada JSON', loadExample: 'Carregar exemplo', packageName: 'Nome do pacote', messageName: 'Nome da mensagem', syntax: 'Sintaxe', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: 'Mapeamento de tipos', invalidJson: 'JSON inválido. Por favor verifique a sintaxe.', packageNamePlaceholder: 'ex., example', messageNamePlaceholder: 'ex., Root' },
    fr: { jsonInput: 'Entrée JSON', loadExample: 'Charger un exemple', packageName: 'Nom du package', messageName: 'Nom du message', syntax: 'Syntaxe', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: 'Mappage des types', invalidJson: 'JSON invalide. Veuillez vérifier la syntaxe.', packageNamePlaceholder: 'ex., example', messageNamePlaceholder: 'ex., Root' },
    de: { jsonInput: 'JSON-Eingabe', loadExample: 'Beispiel laden', packageName: 'Paketname', messageName: 'Nachrichtenname', syntax: 'Syntax', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: 'Typ-Zuordnung', invalidJson: 'Ungültiges JSON. Bitte überprüfen Sie die Syntax.', packageNamePlaceholder: 'z.B., example', messageNamePlaceholder: 'z.B., Root' },
    ru: { jsonInput: 'Ввод JSON', loadExample: 'Загрузить пример', packageName: 'Имя пакета', messageName: 'Имя сообщения', syntax: 'Синтаксис', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: 'Сопоставление типов', invalidJson: 'Неверный JSON. Пожалуйста, проверьте синтаксис.', packageNamePlaceholder: 'напр., example', messageNamePlaceholder: 'напр., Root' },
    ar: { jsonInput: 'إدخال JSON', loadExample: 'تحميل مثال', packageName: 'اسم الحزمة', messageName: 'اسم الرسالة', syntax: 'الصيغة', protocolBuffers: 'Protocol Buffers (.proto)', typeMapping: 'تعيين الأنواع', invalidJson: 'JSON غير صالح. يرجى التحقق من الصيغة.', packageNamePlaceholder: 'مثال: example', messageNamePlaceholder: 'مثال: Root' }
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

console.log('Done! Added translations for base64-image-converter, markdown-to-html-converter, json-to-protobuf-converter');
