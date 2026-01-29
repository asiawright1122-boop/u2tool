const fs = require('fs');
const path = require('path');

// editorconfig-generator UI translations
const translations = {
  en: {
    root: 'Root (stop searching parent directories)',
    defaultSettings: 'Default Settings',
    indentStyle: 'Indent Style',
    indentSize: 'Indent Size',
    endOfLine: 'End of Line',
    charset: 'Charset',
    trimTrailingWhitespace: 'Trim Trailing Whitespace',
    insertFinalNewline: 'Insert Final Newline',
    addFileType: 'Add File Type Override',
    fileTypeSettings: 'File Type Specific Settings',
    remove: 'Remove',
    generate: 'Generate',
    download: 'Download'
  },
  zh: {
    root: '根配置（停止搜索父目录）',
    defaultSettings: '默认设置',
    indentStyle: '缩进风格',
    indentSize: '缩进大小',
    endOfLine: '行尾符',
    charset: '字符集',
    trimTrailingWhitespace: '删除行尾空格',
    insertFinalNewline: '文件末尾插入空行',
    addFileType: '添加文件类型覆盖',
    fileTypeSettings: '文件类型特定设置',
    remove: '移除',
    generate: '生成',
    download: '下载'
  },
  ja: {
    root: 'ルート（親ディレクトリの検索を停止）',
    defaultSettings: 'デフォルト設定',
    indentStyle: 'インデントスタイル',
    indentSize: 'インデントサイズ',
    endOfLine: '改行コード',
    charset: '文字セット',
    trimTrailingWhitespace: '末尾の空白を削除',
    insertFinalNewline: '最終行に改行を挿入',
    addFileType: 'ファイルタイプの上書きを追加',
    fileTypeSettings: 'ファイルタイプ固有の設定',
    remove: '削除',
    generate: '生成',
    download: 'ダウンロード'
  },
  ko: {
    root: '루트 (상위 디렉토리 검색 중지)',
    defaultSettings: '기본 설정',
    indentStyle: '들여쓰기 스타일',
    indentSize: '들여쓰기 크기',
    endOfLine: '줄 끝',
    charset: '문자셋',
    trimTrailingWhitespace: '후행 공백 제거',
    insertFinalNewline: '마지막 줄 바꿈 삽입',
    addFileType: '파일 유형 재정의 추가',
    fileTypeSettings: '파일 유형별 설정',
    remove: '제거',
    generate: '생성',
    download: '다운로드'
  },
  es: {
    root: 'Raíz (dejar de buscar en directorios padre)',
    defaultSettings: 'Configuración Predeterminada',
    indentStyle: 'Estilo de Sangría',
    indentSize: 'Tamaño de Sangría',
    endOfLine: 'Fin de Línea',
    charset: 'Juego de Caracteres',
    trimTrailingWhitespace: 'Eliminar Espacios al Final',
    insertFinalNewline: 'Insertar Nueva Línea Final',
    addFileType: 'Agregar Anulación de Tipo de Archivo',
    fileTypeSettings: 'Configuración Específica por Tipo de Archivo',
    remove: 'Eliminar',
    generate: 'Generar',
    download: 'Descargar'
  },
  pt: {
    root: 'Raiz (parar de buscar em diretórios pai)',
    defaultSettings: 'Configurações Padrão',
    indentStyle: 'Estilo de Indentação',
    indentSize: 'Tamanho da Indentação',
    endOfLine: 'Fim de Linha',
    charset: 'Conjunto de Caracteres',
    trimTrailingWhitespace: 'Remover Espaços em Branco no Final',
    insertFinalNewline: 'Inserir Nova Linha Final',
    addFileType: 'Adicionar Substituição de Tipo de Arquivo',
    fileTypeSettings: 'Configurações Específicas por Tipo de Arquivo',
    remove: 'Remover',
    generate: 'Gerar',
    download: 'Baixar'
  },
  fr: {
    root: 'Racine (arrêter la recherche dans les répertoires parents)',
    defaultSettings: 'Paramètres par Défaut',
    indentStyle: 'Style d\'Indentation',
    indentSize: 'Taille d\'Indentation',
    endOfLine: 'Fin de Ligne',
    charset: 'Jeu de Caractères',
    trimTrailingWhitespace: 'Supprimer les Espaces de Fin',
    insertFinalNewline: 'Insérer une Nouvelle Ligne Finale',
    addFileType: 'Ajouter un Remplacement de Type de Fichier',
    fileTypeSettings: 'Paramètres Spécifiques au Type de Fichier',
    remove: 'Supprimer',
    generate: 'Générer',
    download: 'Télécharger'
  },
  de: {
    root: 'Root (Suche in übergeordneten Verzeichnissen stoppen)',
    defaultSettings: 'Standardeinstellungen',
    indentStyle: 'Einrückungsstil',
    indentSize: 'Einrückungsgröße',
    endOfLine: 'Zeilenende',
    charset: 'Zeichensatz',
    trimTrailingWhitespace: 'Nachfolgende Leerzeichen entfernen',
    insertFinalNewline: 'Abschließende Leerzeile einfügen',
    addFileType: 'Dateityp-Überschreibung hinzufügen',
    fileTypeSettings: 'Dateityp-spezifische Einstellungen',
    remove: 'Entfernen',
    generate: 'Generieren',
    download: 'Herunterladen'
  },
  ru: {
    root: 'Корень (прекратить поиск в родительских каталогах)',
    defaultSettings: 'Настройки по умолчанию',
    indentStyle: 'Стиль отступа',
    indentSize: 'Размер отступа',
    endOfLine: 'Конец строки',
    charset: 'Кодировка',
    trimTrailingWhitespace: 'Удалять пробелы в конце строк',
    insertFinalNewline: 'Вставлять пустую строку в конце файла',
    addFileType: 'Добавить переопределение типа файла',
    fileTypeSettings: 'Настройки для конкретных типов файлов',
    remove: 'Удалить',
    generate: 'Сгенерировать',
    download: 'Скачать'
  },
  ar: {
    root: 'الجذر (إيقاف البحث في الدلائل الأصلية)',
    defaultSettings: 'الإعدادات الافتراضية',
    indentStyle: 'نمط المسافة البادئة',
    indentSize: 'حجم المسافة البادئة',
    endOfLine: 'نهاية السطر',
    charset: 'مجموعة الأحرف',
    trimTrailingWhitespace: 'إزالة المسافات البيضاء الزائدة',
    insertFinalNewline: 'إدراج سطر جديد في النهاية',
    addFileType: 'إضافة تجاوز نوع الملف',
    fileTypeSettings: 'إعدادات خاصة بنوع الملف',
    remove: 'إزالة',
    generate: 'توليد',
    download: 'تحميل'
  }
};

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

locales.forEach(locale => {
  const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Add editorconfig-generator translations
  if (!data.tools['editorconfig-generator']) {
    data.tools['editorconfig-generator'] = {};
  }
  
  // Merge translations
  Object.assign(data.tools['editorconfig-generator'], translations[locale]);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✓ Updated ${locale}.json with editorconfig-generator translations`);
});

console.log('\nDone! Run: npx tsx scripts/split-translations.ts');
