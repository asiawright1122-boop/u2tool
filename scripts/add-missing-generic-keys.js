/**
 * 添加缺失的通用翻译键
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 需要添加的通用翻译键
const translations = {
  // 基础操作
  loadSample: { en: 'Load Sample', zh: '加载示例', ja: 'サンプルを読み込む', ko: '샘플 로드', es: 'Cargar ejemplo', pt: 'Carregar exemplo', fr: 'Charger un exemple', de: 'Beispiel laden', ru: 'Загрузить пример', ar: 'تحميل مثال' },
  showCode: { en: 'Show Code', zh: '显示代码', ja: 'コードを表示', ko: '코드 표기', es: 'Mostrar código', pt: 'Mostrar código', fr: 'Afficher le code', de: 'Code anzeigen', ru: 'Показать код', ar: 'عرض الكود' },
  showPreview: { en: 'Show Preview', zh: '显示预览', ja: 'プレビューを表示', ko: '미리보기 표시', es: 'Mostrar vista previa', pt: 'Mostrar pré-visualização', fr: 'Afficher l\'aperçu', de: 'Vorschau anzeigen', ru: 'Показать предпросмотр', ar: 'عرض المعاينة' },
  downloadPng: { en: 'Download PNG', zh: '下载 PNG', ja: 'PNGをダウンロード', ko: 'PNG 다운로드', es: 'Descargar PNG', pt: 'Baixar PNG', fr: 'Télécharger PNG', de: 'PNG herunterladen', ru: 'Скачать PNG', ar: 'تحميل PNG' },
  downloadSvg: { en: 'Download SVG', zh: '下载 SVG', ja: 'SVGをダウンロード', ko: 'SVG 다운로드', es: 'Descargar SVG', pt: 'Baixar SVG', fr: 'Télécharger SVG', de: 'SVG herunterladen', ru: 'Скачать SVG', ar: 'تحميل SVG' },
  
  // 图表相关
  chartPreview: { en: 'Chart Preview', zh: '图表预览', ja: 'チャートプレビュー', ko: '차트 미리보기', es: 'Vista previa del gráfico', pt: 'Pré-visualização do gráfico', fr: 'Aperçu du graphique', de: 'Diagrammvorschau', ru: 'Предпросмотр диаграммы', ar: 'معاينة الرسم البياني' },
  chartSettings: { en: 'Chart Settings', zh: '图表设置', ja: 'チャート設定', ko: '차트 설정', es: 'Configuración del gráfico', pt: 'Configurações do gráfico', fr: 'Paramètres du graphique', de: 'Diagrammeinstellungen', ru: 'Настройки диаграммы', ar: 'إعدادات الرسم البياني' },
  chartTitle: { en: 'Chart Title', zh: '图表标题', ja: 'チャートタイトル', ko: '차트 제목', es: 'Título del gráfico', pt: 'Título do gráfico', fr: 'Titre du graphique', de: 'Diagrammtitel', ru: 'Заголовок диаграммы', ar: 'عنوان الرسم البياني' },
  chartTitlePlaceholder: { en: 'Enter chart title', zh: '输入图表标题', ja: 'チャートタイトルを入力', ko: '차트 제목 입력', es: 'Ingrese el título del gráfico', pt: 'Digite o título do gráfico', fr: 'Entrez le titre du graphique', de: 'Diagrammtitel eingeben', ru: 'Введите заголовок диаграммы', ar: 'أدخل عنوان الرسم البياني' },
  dataEditor: { en: 'Data Editor', zh: '数据编辑器', ja: 'データエディタ', ko: '데이터 편집기', es: 'Editor de datos', pt: 'Editor de dados', fr: 'Éditeur de données', de: 'Dateneditor', ru: 'Редактор данных', ar: 'محرر البيانات' },
  
  // 文本处理
  uppercase: { en: 'UPPERCASE', zh: '大写', ja: '大文字', ko: '대문자', es: 'MAYÚSCULAS', pt: 'MAIÚSCULAS', fr: 'MAJUSCULES', de: 'GROßBUCHSTABEN', ru: 'ВЕРХНИЙ РЕГИСТР', ar: 'أحرف كبيرة' },
  lowercase: { en: 'lowercase', zh: '小写', ja: '小文字', ko: '소문자', es: 'minúsculas', pt: 'minúsculas', fr: 'minuscules', de: 'kleinbuchstaben', ru: 'нижний регистр', ar: 'أحرف صغيرة' },
  titleCase: { en: 'Title Case', zh: '标题大小写', ja: 'タイトルケース', ko: '제목 대소문자', es: 'Caso De Título', pt: 'Caso De Título', fr: 'Casse De Titre', de: 'Titelschreibweise', ru: 'Заглавные Буквы', ar: 'حالة العنوان' },
  sentenceCase: { en: 'Sentence case', zh: '句子大小写', ja: 'センテンスケース', ko: '문장 대소문자', es: 'Caso de oración', pt: 'Caso de frase', fr: 'Casse de phrase', de: 'Satzschreibweise', ru: 'Регистр предложения', ar: 'حالة الجملة' },
  camelCase: { en: 'camelCase', zh: '驼峰命名', ja: 'キャメルケース', ko: '카멜케이스', es: 'camelCase', pt: 'camelCase', fr: 'camelCase', de: 'camelCase', ru: 'camelCase', ar: 'camelCase' },
  snakeCase: { en: 'snake_case', zh: '蛇形命名', ja: 'スネークケース', ko: '스네이크케이스', es: 'snake_case', pt: 'snake_case', fr: 'snake_case', de: 'snake_case', ru: 'snake_case', ar: 'snake_case' },

  // 排序和过滤
  ascending: { en: 'Ascending', zh: '升序', ja: '昇順', ko: '오름차순', es: 'Ascendente', pt: 'Ascendente', fr: 'Croissant', de: 'Aufsteigend', ru: 'По возрастанию', ar: 'تصاعدي' },
  descending: { en: 'Descending', zh: '降序', ja: '降順', ko: '내림차순', es: 'Descendente', pt: 'Descendente', fr: 'Décroissant', de: 'Absteigend', ru: 'По убыванию', ar: 'تنازلي' },
  sort: { en: 'Sort', zh: '排序', ja: 'ソート', ko: '정렬', es: 'Ordenar', pt: 'Ordenar', fr: 'Trier', de: 'Sortieren', ru: 'Сортировать', ar: 'ترتيب' },
  sortLines: { en: 'Sort Lines', zh: '排序行', ja: '行をソート', ko: '줄 정렬', es: 'Ordenar líneas', pt: 'Ordenar linhas', fr: 'Trier les lignes', de: 'Zeilen sortieren', ru: 'Сортировать строки', ar: 'ترتيب الأسطر' },
  removeDuplicates: { en: 'Remove Duplicates', zh: '移除重复', ja: '重複を削除', ko: '중복 제거', es: 'Eliminar duplicados', pt: 'Remover duplicados', fr: 'Supprimer les doublons', de: 'Duplikate entfernen', ru: 'Удалить дубликаты', ar: 'إزالة التكرارات' },
  removeEmpty: { en: 'Remove Empty', zh: '移除空行', ja: '空行を削除', ko: '빈 줄 제거', es: 'Eliminar vacíos', pt: 'Remover vazios', fr: 'Supprimer les vides', de: 'Leere entfernen', ru: 'Удалить пустые', ar: 'إزالة الفارغة' },
  trimLines: { en: 'Trim Lines', zh: '修剪行', ja: '行をトリム', ko: '줄 다듬기', es: 'Recortar líneas', pt: 'Aparar linhas', fr: 'Rogner les lignes', de: 'Zeilen trimmen', ru: 'Обрезать строки', ar: 'قص الأسطر' },
  
  // 统计
  totalLines: { en: 'Total Lines', zh: '总行数', ja: '総行数', ko: '총 줄 수', es: 'Total de líneas', pt: 'Total de linhas', fr: 'Total de lignes', de: 'Gesamtzeilen', ru: 'Всего строк', ar: 'إجمالي الأسطر' },
  emptyLines: { en: 'Empty Lines', zh: '空行', ja: '空行', ko: '빈 줄', es: 'Líneas vacías', pt: 'Linhas vazias', fr: 'Lignes vides', de: 'Leere Zeilen', ru: 'Пустые строки', ar: 'أسطر فارغة' },
  nonEmptyLines: { en: 'Non-empty Lines', zh: '非空行', ja: '非空行', ko: '비어 있지 않은 줄', es: 'Líneas no vacías', pt: 'Linhas não vazias', fr: 'Lignes non vides', de: 'Nicht-leere Zeilen', ru: 'Непустые строки', ar: 'أسطر غير فارغة' },
  uniqueLines: { en: 'Unique Lines', zh: '唯一行', ja: 'ユニーク行', ko: '고유 줄', es: 'Líneas únicas', pt: 'Linhas únicas', fr: 'Lignes uniques', de: 'Eindeutige Zeilen', ru: 'Уникальные строки', ar: 'أسطر فريدة' },
  unique: { en: 'Unique', zh: '唯一', ja: 'ユニーク', ko: '고유', es: 'Único', pt: 'Único', fr: 'Unique', de: 'Eindeutig', ru: 'Уникальный', ar: 'فريد' },
  removed: { en: 'Removed', zh: '已移除', ja: '削除済み', ko: '제거됨', es: 'Eliminado', pt: 'Removido', fr: 'Supprimé', de: 'Entfernt', ru: 'Удалено', ar: 'تمت الإزالة' },
  original: { en: 'Original', zh: '原始', ja: 'オリジナル', ko: '원본', es: 'Original', pt: 'Original', fr: 'Original', de: 'Original', ru: 'Оригинал', ar: 'الأصلي' },
  
  // 反转
  reverseChars: { en: 'Reverse Characters', zh: '反转字符', ja: '文字を反転', ko: '문자 반전', es: 'Invertir caracteres', pt: 'Inverter caracteres', fr: 'Inverser les caractères', de: 'Zeichen umkehren', ru: 'Обратить символы', ar: 'عكس الأحرف' },
  reverseWords: { en: 'Reverse Words', zh: '反转单词', ja: '単語を反転', ko: '단어 반전', es: 'Invertir palabras', pt: 'Inverter palavras', fr: 'Inverser les mots', de: 'Wörter umkehren', ru: 'Обратить слова', ar: 'عكس الكلمات' },
  reverseLines: { en: 'Reverse Lines', zh: '反转行', ja: '行を反転', ko: '줄 반전', es: 'Invertir líneas', pt: 'Inverter linhas', fr: 'Inverser les lignes', de: 'Zeilen umkehren', ru: 'Обратить строки', ar: 'عكس الأسطر' },
  
  // 编码
  escape: { en: 'Escape', zh: '转义', ja: 'エスケープ', ko: '이스케이프', es: 'Escapar', pt: 'Escapar', fr: 'Échapper', de: 'Escapen', ru: 'Экранировать', ar: 'تهريب' },
  unescape: { en: 'Unescape', zh: '反转义', ja: 'アンエスケープ', ko: '언이스케이프', es: 'Desescapar', pt: 'Desescapar', fr: 'Désechapper', de: 'Unescapen', ru: 'Снять экранирование', ar: 'إلغاء التهريب' },
  unicode: { en: 'Unicode', zh: 'Unicode', ja: 'Unicode', ko: 'Unicode', es: 'Unicode', pt: 'Unicode', fr: 'Unicode', de: 'Unicode', ru: 'Unicode', ar: 'Unicode' },

  // 颜色和样式
  bgColor: { en: 'Background Color', zh: '背景颜色', ja: '背景色', ko: '배경색', es: 'Color de fondo', pt: 'Cor de fundo', fr: 'Couleur de fond', de: 'Hintergrundfarbe', ru: 'Цвет фона', ar: 'لون الخلفية' },
  textColor: { en: 'Text Color', zh: '文字颜色', ja: 'テキスト色', ko: '텍스트 색상', es: 'Color de texto', pt: 'Cor do texto', fr: 'Couleur du texte', de: 'Textfarbe', ru: 'Цвет текста', ar: 'لون النص' },
  color1: { en: 'Color 1', zh: '颜色 1', ja: '色 1', ko: '색상 1', es: 'Color 1', pt: 'Cor 1', fr: 'Couleur 1', de: 'Farbe 1', ru: 'Цвет 1', ar: 'اللون 1' },
  color2: { en: 'Color 2', zh: '颜色 2', ja: '色 2', ko: '색상 2', es: 'Color 2', pt: 'Cor 2', fr: 'Couleur 2', de: 'Farbe 2', ru: 'Цвет 2', ar: 'اللون 2' },
  colorTheme: { en: 'Color Theme', zh: '颜色主题', ja: 'カラーテーマ', ko: '색상 테마', es: 'Tema de color', pt: 'Tema de cor', fr: 'Thème de couleur', de: 'Farbthema', ru: 'Цветовая тема', ar: 'سمة اللون' },
  themeDefault: { en: 'Default', zh: '默认', ja: 'デフォルト', ko: '기본', es: 'Predeterminado', pt: 'Padrão', fr: 'Par défaut', de: 'Standard', ru: 'По умолчанию', ar: 'افتراضي' },
  themeOcean: { en: 'Ocean', zh: '海洋', ja: 'オーシャン', ko: '오션', es: 'Océano', pt: 'Oceano', fr: 'Océan', de: 'Ozean', ru: 'Океан', ar: 'محيط' },
  themeRainbow: { en: 'Rainbow', zh: '彩虹', ja: 'レインボー', ko: '무지개', es: 'Arcoíris', pt: 'Arco-íris', fr: 'Arc-en-ciel', de: 'Regenbogen', ru: 'Радуга', ar: 'قوس قزح' },
  themeSunset: { en: 'Sunset', zh: '日落', ja: 'サンセット', ko: '일몰', es: 'Atardecer', pt: 'Pôr do sol', fr: 'Coucher de soleil', de: 'Sonnenuntergang', ru: 'Закат', ar: 'غروب' },
  
  // 词云相关
  shape: { en: 'Shape', zh: '形状', ja: '形状', ko: '모양', es: 'Forma', pt: 'Forma', fr: 'Forme', de: 'Form', ru: 'Форма', ar: 'الشكل' },
  shapeCircle: { en: 'Circle', zh: '圆形', ja: '円', ko: '원', es: 'Círculo', pt: 'Círculo', fr: 'Cercle', de: 'Kreis', ru: 'Круг', ar: 'دائرة' },
  shapeCardioid: { en: 'Cardioid', zh: '心形', ja: 'カージオイド', ko: '심장형', es: 'Cardioide', pt: 'Cardioide', fr: 'Cardioïde', de: 'Kardioide', ru: 'Кардиоида', ar: 'قلب' },
  shapeDiamond: { en: 'Diamond', zh: '菱形', ja: 'ダイヤモンド', ko: '다이아몬드', es: 'Diamante', pt: 'Diamante', fr: 'Diamant', de: 'Diamant', ru: 'Ромб', ar: 'ماسة' },
  shapeStar: { en: 'Star', zh: '星形', ja: '星', ko: '별', es: 'Estrella', pt: 'Estrela', fr: 'Étoile', de: 'Stern', ru: 'Звезда', ar: 'نجمة' },
  shapeTriangle: { en: 'Triangle', zh: '三角形', ja: '三角形', ko: '삼각형', es: 'Triángulo', pt: 'Triângulo', fr: 'Triangle', de: 'Dreieck', ru: 'Треугольник', ar: 'مثلث' },
  rotation: { en: 'Rotation', zh: '旋转', ja: '回転', ko: '회전', es: 'Rotación', pt: 'Rotação', fr: 'Rotation', de: 'Rotation', ru: 'Вращение', ar: 'دوران' },
  minFontSize: { en: 'Min Font Size', zh: '最小字号', ja: '最小フォントサイズ', ko: '최소 글꼴 크기', es: 'Tamaño mínimo de fuente', pt: 'Tamanho mínimo da fonte', fr: 'Taille de police minimale', de: 'Minimale Schriftgröße', ru: 'Мин. размер шрифта', ar: 'أصغر حجم خط' },
  maxFontSize: { en: 'Max Font Size', zh: '最大字号', ja: '最大フォントサイズ', ko: '최대 글꼴 크기', es: 'Tamaño máximo de fuente', pt: 'Tamanho máximo da fonte', fr: 'Taille de police maximale', de: 'Maximale Schriftgröße', ru: 'Макс. размер шрифта', ar: 'أكبر حجم خط' },
  weight: { en: 'Weight', zh: '权重', ja: '重み', ko: '가중치', es: 'Peso', pt: 'Peso', fr: 'Poids', de: 'Gewicht', ru: 'Вес', ar: 'الوزن' },
  word: { en: 'Word', zh: '单词', ja: '単語', ko: '단어', es: 'Palabra', pt: 'Palavra', fr: 'Mot', de: 'Wort', ru: 'Слово', ar: 'كلمة' },
  addWord: { en: 'Add Word', zh: '添加单词', ja: '単語を追加', ko: '단어 추가', es: 'Agregar palabra', pt: 'Adicionar palavra', fr: 'Ajouter un mot', de: 'Wort hinzufügen', ru: 'Добавить слово', ar: 'إضافة كلمة' },
  generateFromText: { en: 'Generate from Text', zh: '从文本生成', ja: 'テキストから生成', ko: '텍스트에서 생성', es: 'Generar desde texto', pt: 'Gerar a partir do texto', fr: 'Générer à partir du texte', de: 'Aus Text generieren', ru: 'Сгенерировать из текста', ar: 'إنشاء من النص' },

  // 尺寸
  width: { en: 'Width', zh: '宽度', ja: '幅', ko: '너비', es: 'Ancho', pt: 'Largura', fr: 'Largeur', de: 'Breite', ru: 'Ширина', ar: 'العرض' },
  height: { en: 'Height', zh: '高度', ja: '高さ', ko: '높이', es: 'Alto', pt: 'Altura', fr: 'Hauteur', de: 'Höhe', ru: 'Высота', ar: 'الارتفاع' },
  min: { en: 'Min', zh: '最小', ja: '最小', ko: '최소', es: 'Mín', pt: 'Mín', fr: 'Min', de: 'Min', ru: 'Мин', ar: 'الحد الأدنى' },
  max: { en: 'Max', zh: '最大', ja: '最大', ko: '최대', es: 'Máx', pt: 'Máx', fr: 'Max', de: 'Max', ru: 'Макс', ar: 'الحد الأقصى' },
  rows: { en: 'Rows', zh: '行', ja: '行', ko: '행', es: 'Filas', pt: 'Linhas', fr: 'Lignes', de: 'Zeilen', ru: 'Строки', ar: 'الصفوف' },
  page: { en: 'Page', zh: '页', ja: 'ページ', ko: '페이지', es: 'Página', pt: 'Página', fr: 'Page', de: 'Seite', ru: 'Страница', ar: 'صفحة' },
  pages: { en: 'Pages', zh: '页数', ja: 'ページ数', ko: '페이지 수', es: 'Páginas', pt: 'Páginas', fr: 'Pages', de: 'Seiten', ru: 'Страницы', ar: 'صفحات' },
  steps: { en: 'Steps', zh: '步骤', ja: 'ステップ', ko: '단계', es: 'Pasos', pt: 'Passos', fr: 'Étapes', de: 'Schritte', ru: 'Шаги', ar: 'خطوات' },
  
  // 输入相关
  textInput: { en: 'Text Input', zh: '文本输入', ja: 'テキスト入力', ko: '텍스트 입력', es: 'Entrada de texto', pt: 'Entrada de texto', fr: 'Saisie de texte', de: 'Texteingabe', ru: 'Ввод текста', ar: 'إدخال النص' },
  textInputPlaceholder: { en: 'Enter text here...', zh: '在此输入文本...', ja: 'ここにテキストを入力...', ko: '여기에 텍스트 입력...', es: 'Ingrese texto aquí...', pt: 'Digite o texto aqui...', fr: 'Entrez le texte ici...', de: 'Text hier eingeben...', ru: 'Введите текст здесь...', ar: 'أدخل النص هنا...' },
  jsonPlaceholder: { en: 'Enter JSON here...', zh: '在此输入 JSON...', ja: 'ここにJSONを入力...', ko: '여기에 JSON 입력...', es: 'Ingrese JSON aquí...', pt: 'Digite JSON aqui...', fr: 'Entrez JSON ici...', de: 'JSON hier eingeben...', ru: 'Введите JSON здесь...', ar: 'أدخل JSON هنا...' },
  yamlPlaceholder: { en: 'Enter YAML here...', zh: '在此输入 YAML...', ja: 'ここにYAMLを入力...', ko: '여기에 YAML 입력...', es: 'Ingrese YAML aquí...', pt: 'Digite YAML aqui...', fr: 'Entrez YAML ici...', de: 'YAML hier eingeben...', ru: 'Введите YAML здесь...', ar: 'أدخل YAML هنا...' },
  placeholder: { en: 'Placeholder', zh: '占位符', ja: 'プレースホルダー', ko: '플레이스홀더', es: 'Marcador de posición', pt: 'Espaço reservado', fr: 'Espace réservé', de: 'Platzhalter', ru: 'Заполнитель', ar: 'عنصر نائب' },
  customText: { en: 'Custom Text', zh: '自定义文本', ja: 'カスタムテキスト', ko: '사용자 정의 텍스트', es: 'Texto personalizado', pt: 'Texto personalizado', fr: 'Texte personnalisé', de: 'Benutzerdefinierter Text', ru: 'Пользовательский текст', ar: 'نص مخصص' },
  defaultTitle: { en: 'Default Title', zh: '默认标题', ja: 'デフォルトタイトル', ko: '기본 제목', es: 'Título predeterminado', pt: 'Título padrão', fr: 'Titre par défaut', de: 'Standardtitel', ru: 'Заголовок по умолчанию', ar: 'العنوان الافتراضي' },
  sampleTitle: { en: 'Sample Title', zh: '示例标题', ja: 'サンプルタイトル', ko: '샘플 제목', es: 'Título de ejemplo', pt: 'Título de exemplo', fr: 'Titre d\'exemple', de: 'Beispieltitel', ru: 'Пример заголовка', ar: 'عنوان نموذجي' },
  
  // 文件相关
  dropzone: { en: 'Drop files here or click to upload', zh: '拖放文件到此处或点击上传', ja: 'ファイルをここにドロップまたはクリックしてアップロード', ko: '파일을 여기에 놓거나 클릭하여 업로드', es: 'Suelte archivos aquí o haga clic para cargar', pt: 'Solte arquivos aqui ou clique para carregar', fr: 'Déposez les fichiers ici ou cliquez pour télécharger', de: 'Dateien hier ablegen oder klicken zum Hochladen', ru: 'Перетащите файлы сюда или нажмите для загрузки', ar: 'أسقط الملفات هنا أو انقر للتحميل' },
  ignoreEmpty: { en: 'Ignore Empty', zh: '忽略空值', ja: '空を無視', ko: '빈 값 무시', es: 'Ignorar vacíos', pt: 'Ignorar vazios', fr: 'Ignorer les vides', de: 'Leere ignorieren', ru: 'Игнорировать пустые', ar: 'تجاهل الفارغة' },
  caseSensitive: { en: 'Case Sensitive', zh: '区分大小写', ja: '大文字小文字を区別', ko: '대소문자 구분', es: 'Distinguir mayúsculas', pt: 'Diferenciar maiúsculas', fr: 'Sensible à la casse', de: 'Groß-/Kleinschreibung', ru: 'С учетом регистра', ar: 'حساس لحالة الأحرف' },
  confirmClear: { en: 'Are you sure you want to clear?', zh: '确定要清空吗？', ja: 'クリアしてもよろしいですか？', ko: '정말 지우시겠습니까?', es: '¿Está seguro de que desea borrar?', pt: 'Tem certeza de que deseja limpar?', fr: 'Êtes-vous sûr de vouloir effacer ?', de: 'Sind Sie sicher, dass Sie löschen möchten?', ru: 'Вы уверены, что хотите очистить?', ar: 'هل أنت متأكد أنك تريد المسح؟' },
  showingFirst: { en: 'Showing first', zh: '显示前', ja: '最初の表示', ko: '처음 표시', es: 'Mostrando primero', pt: 'Mostrando primeiro', fr: 'Affichage des premiers', de: 'Zeige erste', ru: 'Показаны первые', ar: 'عرض الأول' },

  // 错误和状态
  errorParsing: { en: 'Error parsing', zh: '解析错误', ja: '解析エラー', ko: '파싱 오류', es: 'Error de análisis', pt: 'Erro de análise', fr: 'Erreur d\'analyse', de: 'Analysefehler', ru: 'Ошибка разбора', ar: 'خطأ في التحليل' },
  errorExport: { en: 'Error exporting', zh: '导出错误', ja: 'エクスポートエラー', ko: '내보내기 오류', es: 'Error de exportación', pt: 'Erro de exportação', fr: 'Erreur d\'exportation', de: 'Exportfehler', ru: 'Ошибка экспорта', ar: 'خطأ في التصدير' },
  errorInvalidFile: { en: 'Invalid file', zh: '无效文件', ja: '無効なファイル', ko: '잘못된 파일', es: 'Archivo inválido', pt: 'Arquivo inválido', fr: 'Fichier invalide', de: 'Ungültige Datei', ru: 'Недопустимый файл', ar: 'ملف غير صالح' },
  invalidJson: { en: 'Invalid JSON', zh: '无效的 JSON', ja: '無効なJSON', ko: '잘못된 JSON', es: 'JSON inválido', pt: 'JSON inválido', fr: 'JSON invalide', de: 'Ungültiges JSON', ru: 'Недопустимый JSON', ar: 'JSON غير صالح' },
  invalidYaml: { en: 'Invalid YAML', zh: '无效的 YAML', ja: '無効なYAML', ko: '잘못된 YAML', es: 'YAML inválido', pt: 'YAML inválido', fr: 'YAML invalide', de: 'Ungültiges YAML', ru: 'Недопустимый YAML', ar: 'YAML غير صالح' },
  converting: { en: 'Converting...', zh: '转换中...', ja: '変換中...', ko: '변환 중...', es: 'Convirtiendo...', pt: 'Convertendo...', fr: 'Conversion...', de: 'Konvertieren...', ru: 'Конвертация...', ar: 'جاري التحويل...' },
  extracting: { en: 'Extracting...', zh: '提取中...', ja: '抽出中...', ko: '추출 중...', es: 'Extrayendo...', pt: 'Extraindo...', fr: 'Extraction...', de: 'Extrahieren...', ru: 'Извлечение...', ar: 'جاري الاستخراج...' },
  
  // Changelog 相关
  added: { en: 'Added', zh: '新增', ja: '追加', ko: '추가됨', es: 'Agregado', pt: 'Adicionado', fr: 'Ajouté', de: 'Hinzugefügt', ru: 'Добавлено', ar: 'مضاف' },
  changed: { en: 'Changed', zh: '变更', ja: '変更', ko: '변경됨', es: 'Cambiado', pt: 'Alterado', fr: 'Modifié', de: 'Geändert', ru: 'Изменено', ar: 'تم التغيير' },
  fixed: { en: 'Fixed', zh: '修复', ja: '修正', ko: '수정됨', es: 'Corregido', pt: 'Corrigido', fr: 'Corrigé', de: 'Behoben', ru: 'Исправлено', ar: 'تم الإصلاح' },
  deprecated: { en: 'Deprecated', zh: '弃用', ja: '非推奨', ko: '사용 중단', es: 'Obsoleto', pt: 'Obsoleto', fr: 'Obsolète', de: 'Veraltet', ru: 'Устарело', ar: 'مهمل' },
  security: { en: 'Security', zh: '安全', ja: 'セキュリティ', ko: '보안', es: 'Seguridad', pt: 'Segurança', fr: 'Sécurité', de: 'Sicherheit', ru: 'Безопасность', ar: 'الأمان' },
  
  // 样式相关
  styleProfessional: { en: 'Professional', zh: '专业', ja: 'プロフェッショナル', ko: '전문적', es: 'Profesional', pt: 'Profissional', fr: 'Professionnel', de: 'Professionell', ru: 'Профессиональный', ar: 'احترافي' },
  styleModern: { en: 'Modern', zh: '现代', ja: 'モダン', ko: '모던', es: 'Moderno', pt: 'Moderno', fr: 'Moderne', de: 'Modern', ru: 'Современный', ar: 'حديث' },
  styleMinimal: { en: 'Minimal', zh: '简约', ja: 'ミニマル', ko: '미니멀', es: 'Minimalista', pt: 'Minimalista', fr: 'Minimaliste', de: 'Minimalistisch', ru: 'Минималистичный', ar: 'بسيط' },
  light: { en: 'Light', zh: '浅色', ja: 'ライト', ko: '라이트', es: 'Claro', pt: 'Claro', fr: 'Clair', de: 'Hell', ru: 'Светлый', ar: 'فاتح' },
  dark: { en: 'Dark', zh: '深色', ja: 'ダーク', ko: '다크', es: 'Oscuro', pt: 'Escuro', fr: 'Sombre', de: 'Dunkel', ru: 'Темный', ar: 'داكن' },
  brand: { en: 'Brand', zh: '品牌', ja: 'ブランド', ko: '브랜드', es: 'Marca', pt: 'Marca', fr: 'Marque', de: 'Marke', ru: 'Бренд', ar: 'العلامة التجارية' },
  
  // TSConfig 相关
  strict: { en: 'Strict', zh: '严格模式', ja: '厳格モード', ko: '엄격 모드', es: 'Estricto', pt: 'Estrito', fr: 'Strict', de: 'Strikt', ru: 'Строгий', ar: 'صارم' },
  declaration: { en: 'Declaration', zh: '声明文件', ja: '宣言ファイル', ko: '선언 파일', es: 'Declaración', pt: 'Declaração', fr: 'Déclaration', de: 'Deklaration', ru: 'Декларация', ar: 'الإعلان' },
  declarationMap: { en: 'Declaration Map', zh: '声明映射', ja: '宣言マップ', ko: '선언 맵', es: 'Mapa de declaración', pt: 'Mapa de declaração', fr: 'Carte de déclaration', de: 'Deklarationskarte', ru: 'Карта деклараций', ar: 'خريطة الإعلان' },
  sourceMap: { en: 'Source Map', zh: '源映射', ja: 'ソースマップ', ko: '소스 맵', es: 'Mapa de origen', pt: 'Mapa de origem', fr: 'Carte source', de: 'Quellkarte', ru: 'Карта исходников', ar: 'خريطة المصدر' },
  paths: { en: 'Paths', zh: '路径', ja: 'パス', ko: '경로', es: 'Rutas', pt: 'Caminhos', fr: 'Chemins', de: 'Pfade', ru: 'Пути', ar: 'المسارات' },
};


// 添加翻译到所有语言文件
function addTranslations() {
  console.log('🔧 添加缺失的通用翻译键...\n');
  
  let totalAdded = 0;
  
  LOCALES.forEach(locale => {
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let addedCount = 0;
    
    Object.entries(translations).forEach(([key, trans]) => {
      if (!data.tools[key]) {
        data.tools[key] = trans[locale];
        addedCount++;
      }
    });
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ ${locale}.json - 添加了 ${addedCount} 个翻译键`);
    totalAdded += addedCount;
  });
  
  console.log(`\n✅ 总共添加了 ${totalAdded} 个翻译键`);
}

addTranslations();
