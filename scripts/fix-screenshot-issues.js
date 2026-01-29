/**
 * 修复用户截图中显示的缺失翻译键
 */
const fs = require('fs');

const languages = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const translations = {
  // css-triangle-generator - 方向按钮
  'css-triangle-generator': {
    en: { up: 'Up', down: 'Down', left: 'Left', right: 'Right', 'up-left': 'Up Left', 'up-right': 'Up Right', 'down-left': 'Down Left', 'down-right': 'Down Right', width: 'Width', height: 'Height', color: 'Color' },
    zh: { up: '上', down: '下', left: '左', right: '右', 'up-left': '左上', 'up-right': '右上', 'down-left': '左下', 'down-right': '右下', width: '宽度', height: '高度', color: '颜色' },
    ja: { up: '上', down: '下', left: '左', right: '右', 'up-left': '左上', 'up-right': '右上', 'down-left': '左下', 'down-right': '右下', width: '幅', height: '高さ', color: '色' },
    ko: { up: '위', down: '아래', left: '왼쪽', right: '오른쪽', 'up-left': '왼쪽 위', 'up-right': '오른쪽 위', 'down-left': '왼쪽 아래', 'down-right': '오른쪽 아래', width: '너비', height: '높이', color: '색상' },
    es: { up: 'Arriba', down: 'Abajo', left: 'Izquierda', right: 'Derecha', 'up-left': 'Arriba izquierda', 'up-right': 'Arriba derecha', 'down-left': 'Abajo izquierda', 'down-right': 'Abajo derecha', width: 'Ancho', height: 'Alto', color: 'Color' },
    pt: { up: 'Cima', down: 'Baixo', left: 'Esquerda', right: 'Direita', 'up-left': 'Cima esquerda', 'up-right': 'Cima direita', 'down-left': 'Baixo esquerda', 'down-right': 'Baixo direita', width: 'Largura', height: 'Altura', color: 'Cor' },
    fr: { up: 'Haut', down: 'Bas', left: 'Gauche', right: 'Droite', 'up-left': 'Haut gauche', 'up-right': 'Haut droite', 'down-left': 'Bas gauche', 'down-right': 'Bas droite', width: 'Largeur', height: 'Hauteur', color: 'Couleur' },
    de: { up: 'Oben', down: 'Unten', left: 'Links', right: 'Rechts', 'up-left': 'Oben links', 'up-right': 'Oben rechts', 'down-left': 'Unten links', 'down-right': 'Unten rechts', width: 'Breite', height: 'Höhe', color: 'Farbe' },
    ru: { up: 'Вверх', down: 'Вниз', left: 'Влево', right: 'Вправо', 'up-left': 'Вверх влево', 'up-right': 'Вверх вправо', 'down-left': 'Вниз влево', 'down-right': 'Вниз вправо', width: 'Ширина', height: 'Высота', color: 'Цвет' },
    ar: { up: 'أعلى', down: 'أسفل', left: 'يسار', right: 'يمين', 'up-left': 'أعلى يسار', 'up-right': 'أعلى يمين', 'down-left': 'أسفل يسار', 'down-right': 'أسفل يمين', width: 'العرض', height: 'الارتفاع', color: 'اللون' }
  },

  // dockerfile-generator
  'dockerfile-generator': {
    en: { baseImage: 'Base Image', workdir: 'Working Directory', envVars: 'Environment Variables', envKey: 'Key', envValue: 'Value', addEnvVar: 'Add Variable', copyCommands: 'COPY Commands', addCopy: 'Add COPY', runCommands: 'RUN Commands', addRun: 'Add RUN', exposePort: 'Expose Port', entrypoint: 'Entrypoint', cmd: 'CMD', generate: 'Generate', download: 'Download' },
    zh: { baseImage: '基础镜像', workdir: '工作目录', envVars: '环境变量', envKey: '键', envValue: '值', addEnvVar: '添加变量', copyCommands: 'COPY 命令', addCopy: '添加 COPY', runCommands: 'RUN 命令', addRun: '添加 RUN', exposePort: '暴露端口', entrypoint: '入口点', cmd: '启动命令', generate: '生成', download: '下载' },
    ja: { baseImage: 'ベースイメージ', workdir: '作業ディレクトリ', envVars: '環境変数', envKey: 'キー', envValue: '値', addEnvVar: '変数を追加', copyCommands: 'COPYコマンド', addCopy: 'COPYを追加', runCommands: 'RUNコマンド', addRun: 'RUNを追加', exposePort: 'ポート公開', entrypoint: 'エントリポイント', cmd: 'CMD', generate: '生成', download: 'ダウンロード' },
    ko: { baseImage: '베이스 이미지', workdir: '작업 디렉토리', envVars: '환경 변수', envKey: '키', envValue: '값', addEnvVar: '변수 추가', copyCommands: 'COPY 명령', addCopy: 'COPY 추가', runCommands: 'RUN 명령', addRun: 'RUN 추가', exposePort: '포트 노출', entrypoint: '엔트리포인트', cmd: 'CMD', generate: '생성', download: '다운로드' },
    es: { baseImage: 'Imagen base', workdir: 'Directorio de trabajo', envVars: 'Variables de entorno', envKey: 'Clave', envValue: 'Valor', addEnvVar: 'Agregar variable', copyCommands: 'Comandos COPY', addCopy: 'Agregar COPY', runCommands: 'Comandos RUN', addRun: 'Agregar RUN', exposePort: 'Puerto expuesto', entrypoint: 'Punto de entrada', cmd: 'CMD', generate: 'Generar', download: 'Descargar' },
    pt: { baseImage: 'Imagem base', workdir: 'Diretório de trabalho', envVars: 'Variáveis de ambiente', envKey: 'Chave', envValue: 'Valor', addEnvVar: 'Adicionar variável', copyCommands: 'Comandos COPY', addCopy: 'Adicionar COPY', runCommands: 'Comandos RUN', addRun: 'Adicionar RUN', exposePort: 'Porta exposta', entrypoint: 'Ponto de entrada', cmd: 'CMD', generate: 'Gerar', download: 'Baixar' },
    fr: { baseImage: 'Image de base', workdir: 'Répertoire de travail', envVars: 'Variables d\'environnement', envKey: 'Clé', envValue: 'Valeur', addEnvVar: 'Ajouter une variable', copyCommands: 'Commandes COPY', addCopy: 'Ajouter COPY', runCommands: 'Commandes RUN', addRun: 'Ajouter RUN', exposePort: 'Port exposé', entrypoint: 'Point d\'entrée', cmd: 'CMD', generate: 'Générer', download: 'Télécharger' },
    de: { baseImage: 'Basis-Image', workdir: 'Arbeitsverzeichnis', envVars: 'Umgebungsvariablen', envKey: 'Schlüssel', envValue: 'Wert', addEnvVar: 'Variable hinzufügen', copyCommands: 'COPY-Befehle', addCopy: 'COPY hinzufügen', runCommands: 'RUN-Befehle', addRun: 'RUN hinzufügen', exposePort: 'Port freigeben', entrypoint: 'Einstiegspunkt', cmd: 'CMD', generate: 'Generieren', download: 'Herunterladen' },
    ru: { baseImage: 'Базовый образ', workdir: 'Рабочая директория', envVars: 'Переменные окружения', envKey: 'Ключ', envValue: 'Значение', addEnvVar: 'Добавить переменную', copyCommands: 'Команды COPY', addCopy: 'Добавить COPY', runCommands: 'Команды RUN', addRun: 'Добавить RUN', exposePort: 'Открыть порт', entrypoint: 'Точка входа', cmd: 'CMD', generate: 'Сгенерировать', download: 'Скачать' },
    ar: { baseImage: 'الصورة الأساسية', workdir: 'دليل العمل', envVars: 'متغيرات البيئة', envKey: 'المفتاح', envValue: 'القيمة', addEnvVar: 'إضافة متغير', copyCommands: 'أوامر COPY', addCopy: 'إضافة COPY', runCommands: 'أوامر RUN', addRun: 'إضافة RUN', exposePort: 'المنفذ المكشوف', entrypoint: 'نقطة الدخول', cmd: 'CMD', generate: 'إنشاء', download: 'تحميل' }
  },

  // checksum-verifier
  'checksum-verifier': {
    en: { selectFile: 'Select File', clickToUpload: 'Click to upload or drag and drop', maxSize: 'Max file size: 100MB', expectedChecksum: 'Expected Checksum', calculate: 'Calculate', match: 'Match', noMatch: 'No Match', algorithm: 'Algorithm' },
    zh: { selectFile: '选择文件', clickToUpload: '点击上传或拖放文件', maxSize: '最大文件大小：100MB', expectedChecksum: '预期校验和', calculate: '计算', match: '匹配', noMatch: '不匹配', algorithm: '算法' },
    ja: { selectFile: 'ファイルを選択', clickToUpload: 'クリックしてアップロードまたはドラッグ＆ドロップ', maxSize: '最大ファイルサイズ：100MB', expectedChecksum: '期待されるチェックサム', calculate: '計算', match: '一致', noMatch: '不一致', algorithm: 'アルゴリズム' },
    ko: { selectFile: '파일 선택', clickToUpload: '클릭하여 업로드하거나 드래그 앤 드롭', maxSize: '최대 파일 크기: 100MB', expectedChecksum: '예상 체크섬', calculate: '계산', match: '일치', noMatch: '불일치', algorithm: '알고리즘' },
    es: { selectFile: 'Seleccionar archivo', clickToUpload: 'Haga clic para cargar o arrastre y suelte', maxSize: 'Tamaño máximo: 100MB', expectedChecksum: 'Checksum esperado', calculate: 'Calcular', match: 'Coincide', noMatch: 'No coincide', algorithm: 'Algoritmo' },
    pt: { selectFile: 'Selecionar arquivo', clickToUpload: 'Clique para enviar ou arraste e solte', maxSize: 'Tamanho máximo: 100MB', expectedChecksum: 'Checksum esperado', calculate: 'Calcular', match: 'Corresponde', noMatch: 'Não corresponde', algorithm: 'Algoritmo' },
    fr: { selectFile: 'Sélectionner un fichier', clickToUpload: 'Cliquez pour télécharger ou glissez-déposez', maxSize: 'Taille max: 100MB', expectedChecksum: 'Checksum attendu', calculate: 'Calculer', match: 'Correspond', noMatch: 'Ne correspond pas', algorithm: 'Algorithme' },
    de: { selectFile: 'Datei auswählen', clickToUpload: 'Klicken zum Hochladen oder Drag & Drop', maxSize: 'Max. Dateigröße: 100MB', expectedChecksum: 'Erwartete Prüfsumme', calculate: 'Berechnen', match: 'Übereinstimmung', noMatch: 'Keine Übereinstimmung', algorithm: 'Algorithmus' },
    ru: { selectFile: 'Выбрать файл', clickToUpload: 'Нажмите для загрузки или перетащите', maxSize: 'Макс. размер: 100MB', expectedChecksum: 'Ожидаемая контрольная сумма', calculate: 'Вычислить', match: 'Совпадает', noMatch: 'Не совпадает', algorithm: 'Алгоритм' },
    ar: { selectFile: 'اختر ملف', clickToUpload: 'انقر للتحميل أو اسحب وأفلت', maxSize: 'الحجم الأقصى: 100MB', expectedChecksum: 'المجموع الاختباري المتوقع', calculate: 'حساب', match: 'متطابق', noMatch: 'غير متطابق', algorithm: 'الخوارزمية' }
  },

  // commit-message-generator - 工具名称和描述
  'commit-message-generator': {
    en: { name: 'Commit Message Generator', description: 'Generate conventional commit messages', type: 'Type', scope: 'Scope', subject: 'Subject', body: 'Body', breaking: 'Breaking Change', footer: 'Footer', preview: 'Preview', scopePlaceholder: 'e.g., auth, api, ui', subjectPlaceholder: 'Short description', bodyPlaceholder: 'Detailed description (optional)', footerPlaceholder: 'e.g., Closes #123' },
    zh: { name: '提交信息生成器', description: '生成规范的 Git 提交信息', type: '类型', scope: '范围', subject: '主题', body: '正文', breaking: '破坏性变更', footer: '页脚', preview: '预览', scopePlaceholder: '例如：auth, api, ui', subjectPlaceholder: '简短描述', bodyPlaceholder: '详细描述（可选）', footerPlaceholder: '例如：Closes #123' },
    ja: { name: 'コミットメッセージ生成器', description: '規約に沿ったコミットメッセージを生成', type: 'タイプ', scope: 'スコープ', subject: '件名', body: '本文', breaking: '破壊的変更', footer: 'フッター', preview: 'プレビュー', scopePlaceholder: '例：auth, api, ui', subjectPlaceholder: '短い説明', bodyPlaceholder: '詳細な説明（任意）', footerPlaceholder: '例：Closes #123' },
    ko: { name: '커밋 메시지 생성기', description: '규칙에 맞는 커밋 메시지 생성', type: '유형', scope: '범위', subject: '제목', body: '본문', breaking: '주요 변경사항', footer: '푸터', preview: '미리보기', scopePlaceholder: '예: auth, api, ui', subjectPlaceholder: '짧은 설명', bodyPlaceholder: '상세 설명 (선택)', footerPlaceholder: '예: Closes #123' },
    es: { name: 'Generador de mensajes de commit', description: 'Genera mensajes de commit convencionales', type: 'Tipo', scope: 'Alcance', subject: 'Asunto', body: 'Cuerpo', breaking: 'Cambio importante', footer: 'Pie de página', preview: 'Vista previa', scopePlaceholder: 'ej., auth, api, ui', subjectPlaceholder: 'Descripción corta', bodyPlaceholder: 'Descripción detallada (opcional)', footerPlaceholder: 'ej., Closes #123' },
    pt: { name: 'Gerador de mensagens de commit', description: 'Gera mensagens de commit convencionais', type: 'Tipo', scope: 'Escopo', subject: 'Assunto', body: 'Corpo', breaking: 'Mudança importante', footer: 'Rodapé', preview: 'Visualizar', scopePlaceholder: 'ex., auth, api, ui', subjectPlaceholder: 'Descrição curta', bodyPlaceholder: 'Descrição detalhada (opcional)', footerPlaceholder: 'ex., Closes #123' },
    fr: { name: 'Générateur de messages de commit', description: 'Génère des messages de commit conventionnels', type: 'Type', scope: 'Portée', subject: 'Sujet', body: 'Corps', breaking: 'Changement majeur', footer: 'Pied de page', preview: 'Aperçu', scopePlaceholder: 'ex., auth, api, ui', subjectPlaceholder: 'Description courte', bodyPlaceholder: 'Description détaillée (optionnel)', footerPlaceholder: 'ex., Closes #123' },
    de: { name: 'Commit-Nachricht Generator', description: 'Generiert konventionelle Commit-Nachrichten', type: 'Typ', scope: 'Bereich', subject: 'Betreff', body: 'Inhalt', breaking: 'Breaking Change', footer: 'Fußzeile', preview: 'Vorschau', scopePlaceholder: 'z.B., auth, api, ui', subjectPlaceholder: 'Kurze Beschreibung', bodyPlaceholder: 'Detaillierte Beschreibung (optional)', footerPlaceholder: 'z.B., Closes #123' },
    ru: { name: 'Генератор сообщений коммитов', description: 'Генерирует стандартные сообщения коммитов', type: 'Тип', scope: 'Область', subject: 'Тема', body: 'Тело', breaking: 'Критическое изменение', footer: 'Подвал', preview: 'Предпросмотр', scopePlaceholder: 'напр., auth, api, ui', subjectPlaceholder: 'Краткое описание', bodyPlaceholder: 'Подробное описание (необязательно)', footerPlaceholder: 'напр., Closes #123' },
    ar: { name: 'مولد رسائل الالتزام', description: 'إنشاء رسائل التزام تقليدية', type: 'النوع', scope: 'النطاق', subject: 'الموضوع', body: 'المحتوى', breaking: 'تغيير جذري', footer: 'التذييل', preview: 'معاينة', scopePlaceholder: 'مثال: auth, api, ui', subjectPlaceholder: 'وصف قصير', bodyPlaceholder: 'وصف تفصيلي (اختياري)', footerPlaceholder: 'مثال: Closes #123' }
  },

  // data-transfer-calculator
  'data-transfer-calculator': {
    en: { name: 'Data Transfer Calculator', description: 'Calculate data transfer time and speed', dataSize: 'Data Size', bandwidth: 'Bandwidth', transferTime: 'Transfer Time', speedUnit: 'Speed Unit', sizeUnit: 'Size Unit' },
    zh: { name: '数据传输计算器', description: '计算数据传输时间和速度', dataSize: '数据大小', bandwidth: '带宽', transferTime: '传输时间', speedUnit: '速度单位', sizeUnit: '大小单位' },
    ja: { name: 'データ転送計算機', description: 'データ転送時間と速度を計算', dataSize: 'データサイズ', bandwidth: '帯域幅', transferTime: '転送時間', speedUnit: '速度単位', sizeUnit: 'サイズ単位' },
    ko: { name: '데이터 전송 계산기', description: '데이터 전송 시간 및 속도 계산', dataSize: '데이터 크기', bandwidth: '대역폭', transferTime: '전송 시간', speedUnit: '속도 단위', sizeUnit: '크기 단위' },
    es: { name: 'Calculadora de transferencia de datos', description: 'Calcula el tiempo y velocidad de transferencia', dataSize: 'Tamaño de datos', bandwidth: 'Ancho de banda', transferTime: 'Tiempo de transferencia', speedUnit: 'Unidad de velocidad', sizeUnit: 'Unidad de tamaño' },
    pt: { name: 'Calculadora de transferência de dados', description: 'Calcula tempo e velocidade de transferência', dataSize: 'Tamanho dos dados', bandwidth: 'Largura de banda', transferTime: 'Tempo de transferência', speedUnit: 'Unidade de velocidade', sizeUnit: 'Unidade de tamanho' },
    fr: { name: 'Calculateur de transfert de données', description: 'Calcule le temps et la vitesse de transfert', dataSize: 'Taille des données', bandwidth: 'Bande passante', transferTime: 'Temps de transfert', speedUnit: 'Unité de vitesse', sizeUnit: 'Unité de taille' },
    de: { name: 'Datenübertragungsrechner', description: 'Berechnet Übertragungszeit und Geschwindigkeit', dataSize: 'Datengröße', bandwidth: 'Bandbreite', transferTime: 'Übertragungszeit', speedUnit: 'Geschwindigkeitseinheit', sizeUnit: 'Größeneinheit' },
    ru: { name: 'Калькулятор передачи данных', description: 'Рассчитывает время и скорость передачи данных', dataSize: 'Размер данных', bandwidth: 'Пропускная способность', transferTime: 'Время передачи', speedUnit: 'Единица скорости', sizeUnit: 'Единица размера' },
    ar: { name: 'حاسبة نقل البيانات', description: 'حساب وقت وسرعة نقل البيانات', dataSize: 'حجم البيانات', bandwidth: 'عرض النطاق', transferTime: 'وقت النقل', speedUnit: 'وحدة السرعة', sizeUnit: 'وحدة الحجم' }
  },

  // pixel-density-calculator
  'pixel-density-calculator': {
    en: { name: 'Pixel Density Calculator', description: 'Calculate PPI and pixel density', screenWidth: 'Screen Width (px)', screenHeight: 'Screen Height (px)', diagonalSize: 'Diagonal Size (inches)', ppi: 'Pixels Per Inch', totalPixels: 'Total Pixels', aspectRatio: 'Aspect Ratio' },
    zh: { name: '像素密度计算器', description: '计算 PPI 和像素密度', screenWidth: '屏幕宽度 (px)', screenHeight: '屏幕高度 (px)', diagonalSize: '对角线尺寸 (英寸)', ppi: '每英寸像素', totalPixels: '总像素', aspectRatio: '宽高比' },
    ja: { name: 'ピクセル密度計算機', description: 'PPIとピクセル密度を計算', screenWidth: '画面幅 (px)', screenHeight: '画面高さ (px)', diagonalSize: '対角線サイズ (インチ)', ppi: 'ピクセル/インチ', totalPixels: '総ピクセル数', aspectRatio: 'アスペクト比' },
    ko: { name: '픽셀 밀도 계산기', description: 'PPI 및 픽셀 밀도 계산', screenWidth: '화면 너비 (px)', screenHeight: '화면 높이 (px)', diagonalSize: '대각선 크기 (인치)', ppi: '인치당 픽셀', totalPixels: '총 픽셀', aspectRatio: '종횡비' },
    es: { name: 'Calculadora de densidad de píxeles', description: 'Calcula PPI y densidad de píxeles', screenWidth: 'Ancho de pantalla (px)', screenHeight: 'Alto de pantalla (px)', diagonalSize: 'Tamaño diagonal (pulgadas)', ppi: 'Píxeles por pulgada', totalPixels: 'Píxeles totales', aspectRatio: 'Relación de aspecto' },
    pt: { name: 'Calculadora de densidade de pixels', description: 'Calcula PPI e densidade de pixels', screenWidth: 'Largura da tela (px)', screenHeight: 'Altura da tela (px)', diagonalSize: 'Tamanho diagonal (polegadas)', ppi: 'Pixels por polegada', totalPixels: 'Total de pixels', aspectRatio: 'Proporção' },
    fr: { name: 'Calculateur de densité de pixels', description: 'Calcule le PPI et la densité de pixels', screenWidth: 'Largeur d\'écran (px)', screenHeight: 'Hauteur d\'écran (px)', diagonalSize: 'Taille diagonale (pouces)', ppi: 'Pixels par pouce', totalPixels: 'Pixels totaux', aspectRatio: 'Rapport d\'aspect' },
    de: { name: 'Pixeldichte-Rechner', description: 'Berechnet PPI und Pixeldichte', screenWidth: 'Bildschirmbreite (px)', screenHeight: 'Bildschirmhöhe (px)', diagonalSize: 'Diagonale (Zoll)', ppi: 'Pixel pro Zoll', totalPixels: 'Gesamtpixel', aspectRatio: 'Seitenverhältnis' },
    ru: { name: 'Калькулятор плотности пикселей', description: 'Рассчитывает PPI и плотность пикселей', screenWidth: 'Ширина экрана (px)', screenHeight: 'Высота экрана (px)', diagonalSize: 'Диагональ (дюймы)', ppi: 'Пикселей на дюйм', totalPixels: 'Всего пикселей', aspectRatio: 'Соотношение сторон' },
    ar: { name: 'حاسبة كثافة البكسل', description: 'حساب PPI وكثافة البكسل', screenWidth: 'عرض الشاشة (px)', screenHeight: 'ارتفاع الشاشة (px)', diagonalSize: 'الحجم القطري (بوصة)', ppi: 'بكسل لكل بوصة', totalPixels: 'إجمالي البكسل', aspectRatio: 'نسبة العرض إلى الارتفاع' }
  },

  // dpi-calculator
  'dpi-calculator': {
    en: { name: 'DPI Calculator', description: 'Calculate DPI for printing', imageWidth: 'Image Width (px)', imageHeight: 'Image Height (px)', printWidth: 'Print Width', printHeight: 'Print Height', dpi: 'DPI', printQuality: 'Print Quality' },
    zh: { name: 'DPI 计算器', description: '计算打印 DPI', imageWidth: '图像宽度 (px)', imageHeight: '图像高度 (px)', printWidth: '打印宽度', printHeight: '打印高度', dpi: 'DPI', printQuality: '打印质量' },
    ja: { name: 'DPI計算機', description: '印刷用DPIを計算', imageWidth: '画像幅 (px)', imageHeight: '画像高さ (px)', printWidth: '印刷幅', printHeight: '印刷高さ', dpi: 'DPI', printQuality: '印刷品質' },
    ko: { name: 'DPI 계산기', description: '인쇄용 DPI 계산', imageWidth: '이미지 너비 (px)', imageHeight: '이미지 높이 (px)', printWidth: '인쇄 너비', printHeight: '인쇄 높이', dpi: 'DPI', printQuality: '인쇄 품질' },
    es: { name: 'Calculadora de DPI', description: 'Calcula DPI para impresión', imageWidth: 'Ancho de imagen (px)', imageHeight: 'Alto de imagen (px)', printWidth: 'Ancho de impresión', printHeight: 'Alto de impresión', dpi: 'DPI', printQuality: 'Calidad de impresión' },
    pt: { name: 'Calculadora de DPI', description: 'Calcula DPI para impressão', imageWidth: 'Largura da imagem (px)', imageHeight: 'Altura da imagem (px)', printWidth: 'Largura de impressão', printHeight: 'Altura de impressão', dpi: 'DPI', printQuality: 'Qualidade de impressão' },
    fr: { name: 'Calculateur de DPI', description: 'Calcule le DPI pour l\'impression', imageWidth: 'Largeur d\'image (px)', imageHeight: 'Hauteur d\'image (px)', printWidth: 'Largeur d\'impression', printHeight: 'Hauteur d\'impression', dpi: 'DPI', printQuality: 'Qualité d\'impression' },
    de: { name: 'DPI-Rechner', description: 'Berechnet DPI für den Druck', imageWidth: 'Bildbreite (px)', imageHeight: 'Bildhöhe (px)', printWidth: 'Druckbreite', printHeight: 'Druckhöhe', dpi: 'DPI', printQuality: 'Druckqualität' },
    ru: { name: 'Калькулятор DPI', description: 'Рассчитывает DPI для печати', imageWidth: 'Ширина изображения (px)', imageHeight: 'Высота изображения (px)', printWidth: 'Ширина печати', printHeight: 'Высота печати', dpi: 'DPI', printQuality: 'Качество печати' },
    ar: { name: 'حاسبة DPI', description: 'حساب DPI للطباعة', imageWidth: 'عرض الصورة (px)', imageHeight: 'ارتفاع الصورة (px)', printWidth: 'عرض الطباعة', printHeight: 'ارتفاع الطباعة', dpi: 'DPI', printQuality: 'جودة الطباعة' }
  },

  // break-even-calculator
  'break-even-calculator': {
    en: { name: 'Break-Even Calculator', description: 'Calculate break-even point for business' },
    zh: { name: '盈亏平衡计算器', description: '计算企业盈亏平衡点' },
    ja: { name: '損益分岐点計算機', description: 'ビジネスの損益分岐点を計算' },
    ko: { name: '손익분기점 계산기', description: '비즈니스 손익분기점 계산' },
    es: { name: 'Calculadora de punto de equilibrio', description: 'Calcula el punto de equilibrio empresarial' },
    pt: { name: 'Calculadora de ponto de equilíbrio', description: 'Calcula o ponto de equilíbrio empresarial' },
    fr: { name: 'Calculateur de seuil de rentabilité', description: 'Calcule le seuil de rentabilité' },
    de: { name: 'Break-Even-Rechner', description: 'Berechnet den Break-Even-Punkt' },
    ru: { name: 'Калькулятор точки безубыточности', description: 'Рассчитывает точку безубыточности' },
    ar: { name: 'حاسبة نقطة التعادل', description: 'حساب نقطة التعادل للأعمال' }
  }
};

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
      if (!data.tools[toolSlug][key]) {
        data.tools[toolSlug][key] = value;
        addedCount++;
      }
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ ${lang}.json - 添加了 ${addedCount} 个翻译键`);
}

console.log('\n完成！');
