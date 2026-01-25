const fs = require('fs');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// Batch 53 工具需要添加的翻译键
const batch53Fixes = {
  'ai-text-humanizer': {
    en: { addFillers: 'Add natural filler words', humanize: 'Humanize', inputPlaceholder: 'Paste your AI-generated text here...' },
    zh: { addFillers: '添加自然填充词', humanize: '人性化', inputPlaceholder: '在此粘贴您的 AI 生成文本...' },
    ja: { addFillers: '自然なフィラーワードを追加', humanize: '人間化', inputPlaceholder: 'AI生成テキストをここに貼り付け...' },
    ko: { addFillers: '자연스러운 필러 단어 추가', humanize: '인간화', inputPlaceholder: 'AI 생성 텍스트를 여기에 붙여넣기...' },
    es: { addFillers: 'Añadir palabras de relleno', humanize: 'Humanizar', inputPlaceholder: 'Pegue su texto generado por IA aquí...' },
    pt: { addFillers: 'Adicionar palavras de preenchimento', humanize: 'Humanizar', inputPlaceholder: 'Cole seu texto gerado por IA aqui...' },
    fr: { addFillers: 'Ajouter des mots de remplissage', humanize: 'Humaniser', inputPlaceholder: 'Collez votre texte généré par IA ici...' },
    de: { addFillers: 'Füllwörter hinzufügen', humanize: 'Humanisieren', inputPlaceholder: 'KI-generierten Text hier einfügen...' },
    ru: { addFillers: 'Добавить слова-заполнители', humanize: 'Гуманизировать', inputPlaceholder: 'Вставьте текст ИИ сюда...' },
    ar: { addFillers: 'إضافة كلمات حشو', humanize: 'إنسانية', inputPlaceholder: 'الصق النص هنا...' }
  },
  'text-spinner': {
    en: { spin: 'Spin Text', inputPlaceholder: 'Enter text to spin...', uniqueness: 'Uniqueness', level: 'Level', conservative: 'Conservative', moderate: 'Moderate', aggressive: 'Aggressive' },
    zh: { spin: '旋转文本', inputPlaceholder: '输入要旋转的文本...', uniqueness: '独特性', level: '级别', conservative: '保守', moderate: '适中', aggressive: '激进' },
    ja: { spin: 'スピン', inputPlaceholder: 'テキストを入力...', uniqueness: '独自性', level: 'レベル', conservative: '保守的', moderate: '適度', aggressive: '積極的' },
    ko: { spin: '스핀', inputPlaceholder: '텍스트 입력...', uniqueness: '고유성', level: '수준', conservative: '보수적', moderate: '적당', aggressive: '적극적' },
    es: { spin: 'Girar', inputPlaceholder: 'Ingrese texto...', uniqueness: 'Unicidad', level: 'Nivel', conservative: 'Conservador', moderate: 'Moderado', aggressive: 'Agresivo' },
    pt: { spin: 'Girar', inputPlaceholder: 'Digite texto...', uniqueness: 'Unicidade', level: 'Nível', conservative: 'Conservador', moderate: 'Moderado', aggressive: 'Agressivo' },
    fr: { spin: 'Tourner', inputPlaceholder: 'Entrez le texte...', uniqueness: 'Unicité', level: 'Niveau', conservative: 'Conservateur', moderate: 'Modéré', aggressive: 'Agressif' },
    de: { spin: 'Drehen', inputPlaceholder: 'Text eingeben...', uniqueness: 'Einzigartigkeit', level: 'Stufe', conservative: 'Konservativ', moderate: 'Moderat', aggressive: 'Aggressiv' },
    ru: { spin: 'Вращать', inputPlaceholder: 'Введите текст...', uniqueness: 'Уникальность', level: 'Уровень', conservative: 'Консервативный', moderate: 'Умеренный', aggressive: 'Агрессивный' },
    ar: { spin: 'تدوير', inputPlaceholder: 'أدخل النص...', uniqueness: 'التفرد', level: 'المستوى', conservative: 'محافظ', moderate: 'معتدل', aggressive: 'عدواني' }
  }
};


// 添加更多工具的翻译
const moreTools = {
  'readability-checker': {
    en: { inputPlaceholder: 'Enter text to analyze readability...', statistics: 'Statistics', words: 'Words', sentences: 'Sentences', characters: 'Characters', fleschReading: 'Flesch Reading Ease', fleschKincaid: 'Flesch-Kincaid Grade', gunningFog: 'Gunning Fog Index', smog: 'SMOG Index', gradeLevel: 'Grade Level', easeScore: 'Ease Score', interpretation: 'Interpretation', excellent: 'Excellent', good: 'Good', average: 'Average', recommendations: 'Recommendations' },
    zh: { inputPlaceholder: '输入要分析可读性的文本...', statistics: '统计', words: '单词', sentences: '句子', characters: '字符', fleschReading: 'Flesch 阅读难度', fleschKincaid: 'Flesch-Kincaid 等级', gunningFog: 'Gunning Fog 指数', smog: 'SMOG 指数', gradeLevel: '年级水平', easeScore: '易读分数', interpretation: '解释', excellent: '优秀', good: '良好', average: '一般', recommendations: '建议' },
    ja: { inputPlaceholder: '可読性を分析するテキストを入力...', statistics: '統計', words: '単語', sentences: '文', characters: '文字', fleschReading: 'Flesch読みやすさ', fleschKincaid: 'Flesch-Kincaid等級', gunningFog: 'Gunning Fog指数', smog: 'SMOG指数', gradeLevel: '学年レベル', easeScore: '読みやすさスコア', interpretation: '解釈', excellent: '優秀', good: '良好', average: '平均', recommendations: '推奨事項' },
    ko: { inputPlaceholder: '가독성 분석할 텍스트 입력...', statistics: '통계', words: '단어', sentences: '문장', characters: '문자', fleschReading: 'Flesch 가독성', fleschKincaid: 'Flesch-Kincaid 등급', gunningFog: 'Gunning Fog 지수', smog: 'SMOG 지수', gradeLevel: '학년 수준', easeScore: '가독성 점수', interpretation: '해석', excellent: '우수', good: '양호', average: '보통', recommendations: '권장사항' },
    es: { inputPlaceholder: 'Ingrese texto para analizar...', statistics: 'Estadísticas', words: 'Palabras', sentences: 'Oraciones', characters: 'Caracteres', fleschReading: 'Flesch Lectura', fleschKincaid: 'Flesch-Kincaid', gunningFog: 'Gunning Fog', smog: 'SMOG', gradeLevel: 'Nivel de Grado', easeScore: 'Puntuación', interpretation: 'Interpretación', excellent: 'Excelente', good: 'Bueno', average: 'Promedio', recommendations: 'Recomendaciones' },
    pt: { inputPlaceholder: 'Digite texto para analisar...', statistics: 'Estatísticas', words: 'Palavras', sentences: 'Frases', characters: 'Caracteres', fleschReading: 'Flesch Leitura', fleschKincaid: 'Flesch-Kincaid', gunningFog: 'Gunning Fog', smog: 'SMOG', gradeLevel: 'Nível de Série', easeScore: 'Pontuação', interpretation: 'Interpretação', excellent: 'Excelente', good: 'Bom', average: 'Médio', recommendations: 'Recomendações' },
    fr: { inputPlaceholder: 'Entrez le texte à analyser...', statistics: 'Statistiques', words: 'Mots', sentences: 'Phrases', characters: 'Caractères', fleschReading: 'Flesch Lecture', fleschKincaid: 'Flesch-Kincaid', gunningFog: 'Gunning Fog', smog: 'SMOG', gradeLevel: 'Niveau Scolaire', easeScore: 'Score', interpretation: 'Interprétation', excellent: 'Excellent', good: 'Bon', average: 'Moyen', recommendations: 'Recommandations' },
    de: { inputPlaceholder: 'Text zur Analyse eingeben...', statistics: 'Statistiken', words: 'Wörter', sentences: 'Sätze', characters: 'Zeichen', fleschReading: 'Flesch Lesbarkeit', fleschKincaid: 'Flesch-Kincaid', gunningFog: 'Gunning Fog', smog: 'SMOG', gradeLevel: 'Klassenstufe', easeScore: 'Punktzahl', interpretation: 'Interpretation', excellent: 'Ausgezeichnet', good: 'Gut', average: 'Durchschnitt', recommendations: 'Empfehlungen' },
    ru: { inputPlaceholder: 'Введите текст для анализа...', statistics: 'Статистика', words: 'Слова', sentences: 'Предложения', characters: 'Символы', fleschReading: 'Flesch Чтение', fleschKincaid: 'Flesch-Kincaid', gunningFog: 'Gunning Fog', smog: 'SMOG', gradeLevel: 'Уровень Класса', easeScore: 'Оценка', interpretation: 'Интерпретация', excellent: 'Отлично', good: 'Хорошо', average: 'Средне', recommendations: 'Рекомендации' },
    ar: { inputPlaceholder: 'أدخل النص للتحليل...', statistics: 'الإحصائيات', words: 'الكلمات', sentences: 'الجمل', characters: 'الأحرف', fleschReading: 'Flesch القراءة', fleschKincaid: 'Flesch-Kincaid', gunningFog: 'Gunning Fog', smog: 'SMOG', gradeLevel: 'مستوى الصف', easeScore: 'النتيجة', interpretation: 'التفسير', excellent: 'ممتاز', good: 'جيد', average: 'متوسط', recommendations: 'التوصيات' }
  },
  'grammar-checker': {
    en: { inputPlaceholder: 'Enter text to check grammar...', foundErrors: 'Errors Found', noErrors: 'No errors found', fix: 'Fix', fixAll: 'Fix All', suggestion: 'Suggestion' },
    zh: { inputPlaceholder: '输入要检查语法的文本...', foundErrors: '发现错误', noErrors: '未发现错误', fix: '修复', fixAll: '全部修复', suggestion: '建议' },
    ja: { inputPlaceholder: '文法チェックするテキストを入力...', foundErrors: 'エラー発見', noErrors: 'エラーなし', fix: '修正', fixAll: 'すべて修正', suggestion: '提案' },
    ko: { inputPlaceholder: '문법 검사할 텍스트 입력...', foundErrors: '오류 발견', noErrors: '오류 없음', fix: '수정', fixAll: '모두 수정', suggestion: '제안' },
    es: { inputPlaceholder: 'Ingrese texto para verificar...', foundErrors: 'Errores Encontrados', noErrors: 'Sin errores', fix: 'Corregir', fixAll: 'Corregir Todo', suggestion: 'Sugerencia' },
    pt: { inputPlaceholder: 'Digite texto para verificar...', foundErrors: 'Erros Encontrados', noErrors: 'Sem erros', fix: 'Corrigir', fixAll: 'Corrigir Tudo', suggestion: 'Sugestão' },
    fr: { inputPlaceholder: 'Entrez le texte à vérifier...', foundErrors: 'Erreurs Trouvées', noErrors: 'Aucune erreur', fix: 'Corriger', fixAll: 'Tout Corriger', suggestion: 'Suggestion' },
    de: { inputPlaceholder: 'Text zur Prüfung eingeben...', foundErrors: 'Fehler Gefunden', noErrors: 'Keine Fehler', fix: 'Beheben', fixAll: 'Alle Beheben', suggestion: 'Vorschlag' },
    ru: { inputPlaceholder: 'Введите текст для проверки...', foundErrors: 'Найдено Ошибок', noErrors: 'Ошибок нет', fix: 'Исправить', fixAll: 'Исправить Все', suggestion: 'Предложение' },
    ar: { inputPlaceholder: 'أدخل النص للتحقق...', foundErrors: 'الأخطاء الموجودة', noErrors: 'لا توجد أخطاء', fix: 'إصلاح', fixAll: 'إصلاح الكل', suggestion: 'اقتراح' }
  }
};

// 合并所有修复
Object.assign(batch53Fixes, moreTools);


// 代码格式化工具
const formatters = {
  'typescript-playground': {
    en: { inputPlaceholder: 'Enter TypeScript code...', compile: 'Compile', target: 'Target' },
    zh: { inputPlaceholder: '输入 TypeScript 代码...', compile: '编译', target: '目标' },
    ja: { inputPlaceholder: 'TypeScriptコードを入力...', compile: 'コンパイル', target: 'ターゲット' },
    ko: { inputPlaceholder: 'TypeScript 코드 입력...', compile: '컴파일', target: '대상' },
    es: { inputPlaceholder: 'Ingrese código TypeScript...', compile: 'Compilar', target: 'Objetivo' },
    pt: { inputPlaceholder: 'Digite código TypeScript...', compile: 'Compilar', target: 'Alvo' },
    fr: { inputPlaceholder: 'Entrez le code TypeScript...', compile: 'Compiler', target: 'Cible' },
    de: { inputPlaceholder: 'TypeScript-Code eingeben...', compile: 'Kompilieren', target: 'Ziel' },
    ru: { inputPlaceholder: 'Введите код TypeScript...', compile: 'Компилировать', target: 'Цель' },
    ar: { inputPlaceholder: 'أدخل كود TypeScript...', compile: 'تجميع', target: 'الهدف' }
  },
  'python-formatter': {
    en: { inputPlaceholder: 'Enter Python code...', indentSize: 'Indent Size' },
    zh: { inputPlaceholder: '输入 Python 代码...', indentSize: '缩进大小' },
    ja: { inputPlaceholder: 'Pythonコードを入力...', indentSize: 'インデントサイズ' },
    ko: { inputPlaceholder: 'Python 코드 입력...', indentSize: '들여쓰기 크기' },
    es: { inputPlaceholder: 'Ingrese código Python...', indentSize: 'Tamaño de Sangría' },
    pt: { inputPlaceholder: 'Digite código Python...', indentSize: 'Tamanho do Recuo' },
    fr: { inputPlaceholder: 'Entrez le code Python...', indentSize: 'Taille d\'Indentation' },
    de: { inputPlaceholder: 'Python-Code eingeben...', indentSize: 'Einrückungsgröße' },
    ru: { inputPlaceholder: 'Введите код Python...', indentSize: 'Размер Отступа' },
    ar: { inputPlaceholder: 'أدخل كود Python...', indentSize: 'حجم المسافة البادئة' }
  },
  'go-formatter': {
    en: { inputPlaceholder: 'Enter Go code...' },
    zh: { inputPlaceholder: '输入 Go 代码...' },
    ja: { inputPlaceholder: 'Goコードを入力...' },
    ko: { inputPlaceholder: 'Go 코드 입력...' },
    es: { inputPlaceholder: 'Ingrese código Go...' },
    pt: { inputPlaceholder: 'Digite código Go...' },
    fr: { inputPlaceholder: 'Entrez le code Go...' },
    de: { inputPlaceholder: 'Go-Code eingeben...' },
    ru: { inputPlaceholder: 'Введите код Go...' },
    ar: { inputPlaceholder: 'أدخل كود Go...' }
  },
  'rust-formatter': {
    en: { inputPlaceholder: 'Enter Rust code...' },
    zh: { inputPlaceholder: '输入 Rust 代码...' },
    ja: { inputPlaceholder: 'Rustコードを入力...' },
    ko: { inputPlaceholder: 'Rust 코드 입력...' },
    es: { inputPlaceholder: 'Ingrese código Rust...' },
    pt: { inputPlaceholder: 'Digite código Rust...' },
    fr: { inputPlaceholder: 'Entrez le code Rust...' },
    de: { inputPlaceholder: 'Rust-Code eingeben...' },
    ru: { inputPlaceholder: 'Введите код Rust...' },
    ar: { inputPlaceholder: 'أدخل كود Rust...' }
  },
  'yaml-formatter': {
    en: { inputPlaceholder: 'Enter YAML content...', indentSize: 'Indent Size' },
    zh: { inputPlaceholder: '输入 YAML 内容...', indentSize: '缩进大小' },
    ja: { inputPlaceholder: 'YAML内容を入力...', indentSize: 'インデントサイズ' },
    ko: { inputPlaceholder: 'YAML 내용 입력...', indentSize: '들여쓰기 크기' },
    es: { inputPlaceholder: 'Ingrese contenido YAML...', indentSize: 'Tamaño de Sangría' },
    pt: { inputPlaceholder: 'Digite conteúdo YAML...', indentSize: 'Tamanho do Recuo' },
    fr: { inputPlaceholder: 'Entrez le contenu YAML...', indentSize: 'Taille d\'Indentation' },
    de: { inputPlaceholder: 'YAML-Inhalt eingeben...', indentSize: 'Einrückungsgröße' },
    ru: { inputPlaceholder: 'Введите содержимое YAML...', indentSize: 'Размер Отступа' },
    ar: { inputPlaceholder: 'أدخل محتوى YAML...', indentSize: 'حجم المسافة البادئة' }
  }
};

Object.assign(batch53Fixes, formatters);


// CSS 设计工具
const cssTools = {
  'text-shadow-generator': {
    en: { preview: 'Preview', previewText: 'Preview Text', shadows: 'Shadows', addShadow: 'Add Shadow', blur: 'Blur', color: 'Color', opacity: 'Opacity', glow: 'Glow', neon: 'Neon', emboss: 'Emboss', '3d': '3D' },
    zh: { preview: '预览', previewText: '预览文本', shadows: '阴影', addShadow: '添加阴影', blur: '模糊', color: '颜色', opacity: '不透明度', glow: '发光', neon: '霓虹', emboss: '浮雕', '3d': '3D' },
    ja: { preview: 'プレビュー', previewText: 'プレビューテキスト', shadows: 'シャドウ', addShadow: 'シャドウ追加', blur: 'ぼかし', color: '色', opacity: '不透明度', glow: 'グロー', neon: 'ネオン', emboss: 'エンボス', '3d': '3D' },
    ko: { preview: '미리보기', previewText: '미리보기 텍스트', shadows: '그림자', addShadow: '그림자 추가', blur: '흐림', color: '색상', opacity: '불투명도', glow: '글로우', neon: '네온', emboss: '엠보스', '3d': '3D' },
    es: { preview: 'Vista Previa', previewText: 'Texto de Vista Previa', shadows: 'Sombras', addShadow: 'Añadir Sombra', blur: 'Desenfoque', color: 'Color', opacity: 'Opacidad', glow: 'Brillo', neon: 'Neón', emboss: 'Relieve', '3d': '3D' },
    pt: { preview: 'Visualização', previewText: 'Texto de Visualização', shadows: 'Sombras', addShadow: 'Adicionar Sombra', blur: 'Desfoque', color: 'Cor', opacity: 'Opacidade', glow: 'Brilho', neon: 'Neon', emboss: 'Relevo', '3d': '3D' },
    fr: { preview: 'Aperçu', previewText: 'Texte d\'Aperçu', shadows: 'Ombres', addShadow: 'Ajouter Ombre', blur: 'Flou', color: 'Couleur', opacity: 'Opacité', glow: 'Lueur', neon: 'Néon', emboss: 'Relief', '3d': '3D' },
    de: { preview: 'Vorschau', previewText: 'Vorschautext', shadows: 'Schatten', addShadow: 'Schatten Hinzufügen', blur: 'Unschärfe', color: 'Farbe', opacity: 'Deckkraft', glow: 'Leuchten', neon: 'Neon', emboss: 'Prägung', '3d': '3D' },
    ru: { preview: 'Предпросмотр', previewText: 'Текст Предпросмотра', shadows: 'Тени', addShadow: 'Добавить Тень', blur: 'Размытие', color: 'Цвет', opacity: 'Непрозрачность', glow: 'Свечение', neon: 'Неон', emboss: 'Тиснение', '3d': '3D' },
    ar: { preview: 'معاينة', previewText: 'نص المعاينة', shadows: 'الظلال', addShadow: 'إضافة ظل', blur: 'ضبابية', color: 'اللون', opacity: 'العتامة', glow: 'توهج', neon: 'نيون', emboss: 'نقش', '3d': '3D' }
  },
  'svg-pattern-generator': {
    en: { pattern: 'Pattern', size: 'Size', color: 'Color', bgColor: 'Background Color', preview: 'Preview', dots: 'Dots', lines: 'Lines', grid: 'Grid', waves: 'Waves', triangles: 'Triangles', hexagons: 'Hexagons', zigzag: 'Zigzag' },
    zh: { pattern: '图案', size: '大小', color: '颜色', bgColor: '背景颜色', preview: '预览', dots: '点', lines: '线', grid: '网格', waves: '波浪', triangles: '三角形', hexagons: '六边形', zigzag: '锯齿' },
    ja: { pattern: 'パターン', size: 'サイズ', color: '色', bgColor: '背景色', preview: 'プレビュー', dots: 'ドット', lines: '線', grid: 'グリッド', waves: '波', triangles: '三角形', hexagons: '六角形', zigzag: 'ジグザグ' },
    ko: { pattern: '패턴', size: '크기', color: '색상', bgColor: '배경색', preview: '미리보기', dots: '점', lines: '선', grid: '그리드', waves: '파도', triangles: '삼각형', hexagons: '육각형', zigzag: '지그재그' },
    es: { pattern: 'Patrón', size: 'Tamaño', color: 'Color', bgColor: 'Color de Fondo', preview: 'Vista Previa', dots: 'Puntos', lines: 'Líneas', grid: 'Cuadrícula', waves: 'Ondas', triangles: 'Triángulos', hexagons: 'Hexágonos', zigzag: 'Zigzag' },
    pt: { pattern: 'Padrão', size: 'Tamanho', color: 'Cor', bgColor: 'Cor de Fundo', preview: 'Visualização', dots: 'Pontos', lines: 'Linhas', grid: 'Grade', waves: 'Ondas', triangles: 'Triângulos', hexagons: 'Hexágonos', zigzag: 'Ziguezague' },
    fr: { pattern: 'Motif', size: 'Taille', color: 'Couleur', bgColor: 'Couleur de Fond', preview: 'Aperçu', dots: 'Points', lines: 'Lignes', grid: 'Grille', waves: 'Vagues', triangles: 'Triangles', hexagons: 'Hexagones', zigzag: 'Zigzag' },
    de: { pattern: 'Muster', size: 'Größe', color: 'Farbe', bgColor: 'Hintergrundfarbe', preview: 'Vorschau', dots: 'Punkte', lines: 'Linien', grid: 'Raster', waves: 'Wellen', triangles: 'Dreiecke', hexagons: 'Sechsecke', zigzag: 'Zickzack' },
    ru: { pattern: 'Узор', size: 'Размер', color: 'Цвет', bgColor: 'Цвет Фона', preview: 'Предпросмотр', dots: 'Точки', lines: 'Линии', grid: 'Сетка', waves: 'Волны', triangles: 'Треугольники', hexagons: 'Шестиугольники', zigzag: 'Зигзаг' },
    ar: { pattern: 'نمط', size: 'الحجم', color: 'اللون', bgColor: 'لون الخلفية', preview: 'معاينة', dots: 'نقاط', lines: 'خطوط', grid: 'شبكة', waves: 'موجات', triangles: 'مثلثات', hexagons: 'سداسيات', zigzag: 'متعرج' }
  },
  'css-triangle-generator': {
    en: { preview: 'Preview', size: 'Size', color: 'Color', width: 'Width', height: 'Height' },
    zh: { preview: '预览', size: '大小', color: '颜色', width: '宽度', height: '高度' },
    ja: { preview: 'プレビュー', size: 'サイズ', color: '色', width: '幅', height: '高さ' },
    ko: { preview: '미리보기', size: '크기', color: '색상', width: '너비', height: '높이' },
    es: { preview: 'Vista Previa', size: 'Tamaño', color: 'Color', width: 'Ancho', height: 'Alto' },
    pt: { preview: 'Visualização', size: 'Tamanho', color: 'Cor', width: 'Largura', height: 'Altura' },
    fr: { preview: 'Aperçu', size: 'Taille', color: 'Couleur', width: 'Largeur', height: 'Hauteur' },
    de: { preview: 'Vorschau', size: 'Größe', color: 'Farbe', width: 'Breite', height: 'Höhe' },
    ru: { preview: 'Предпросмотр', size: 'Размер', color: 'Цвет', width: 'Ширина', height: 'Высота' },
    ar: { preview: 'معاينة', size: 'الحجم', color: 'اللون', width: 'العرض', height: 'الارتفاع' }
  },
  'aspect-ratio-box-generator': {
    en: { preview: 'Preview', width: 'Width', height: 'Height', aspectRatioProperty: 'Aspect Ratio Property', paddingMethod: 'Padding Method', paddingNote: 'Note: Padding method is for older browser support', method: 'Method' },
    zh: { preview: '预览', width: '宽度', height: '高度', aspectRatioProperty: '宽高比属性', paddingMethod: '内边距方法', paddingNote: '注意：内边距方法用于旧浏览器支持', method: '方法' },
    ja: { preview: 'プレビュー', width: '幅', height: '高さ', aspectRatioProperty: 'アスペクト比プロパティ', paddingMethod: 'パディング方式', paddingNote: '注：パディング方式は古いブラウザ対応用', method: '方式' },
    ko: { preview: '미리보기', width: '너비', height: '높이', aspectRatioProperty: '종횡비 속성', paddingMethod: '패딩 방식', paddingNote: '참고: 패딩 방식은 구형 브라우저 지원용', method: '방식' },
    es: { preview: 'Vista Previa', width: 'Ancho', height: 'Alto', aspectRatioProperty: 'Propiedad Aspect Ratio', paddingMethod: 'Método Padding', paddingNote: 'Nota: El método padding es para navegadores antiguos', method: 'Método' },
    pt: { preview: 'Visualização', width: 'Largura', height: 'Altura', aspectRatioProperty: 'Propriedade Aspect Ratio', paddingMethod: 'Método Padding', paddingNote: 'Nota: O método padding é para navegadores antigos', method: 'Método' },
    fr: { preview: 'Aperçu', width: 'Largeur', height: 'Hauteur', aspectRatioProperty: 'Propriété Aspect Ratio', paddingMethod: 'Méthode Padding', paddingNote: 'Note: La méthode padding est pour les anciens navigateurs', method: 'Méthode' },
    de: { preview: 'Vorschau', width: 'Breite', height: 'Höhe', aspectRatioProperty: 'Aspect Ratio Eigenschaft', paddingMethod: 'Padding Methode', paddingNote: 'Hinweis: Padding-Methode für ältere Browser', method: 'Methode' },
    ru: { preview: 'Предпросмотр', width: 'Ширина', height: 'Высота', aspectRatioProperty: 'Свойство Aspect Ratio', paddingMethod: 'Метод Padding', paddingNote: 'Примечание: Метод padding для старых браузеров', method: 'Метод' },
    ar: { preview: 'معاينة', width: 'العرض', height: 'الارتفاع', aspectRatioProperty: 'خاصية نسبة العرض', paddingMethod: 'طريقة الحشو', paddingNote: 'ملاحظة: طريقة الحشو للمتصفحات القديمة', method: 'الطريقة' }
  }
};

Object.assign(batch53Fixes, cssTools);


// 计算器工具
const calculators = {
  'screen-time-calculator': {
    en: { hoursPerDay: 'Hours Per Day', wakeHours: 'Wake Hours', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Yearly', percentOfWake: 'Percent of Wake Time', healthStatus: 'Health Status', excessive: 'Excessive', high: 'High', moderate: 'Moderate', good: 'Good', excellent: 'Excellent', recommendations: 'Recommendations', ergonomicTips: 'Ergonomic Tips' },
    zh: { hoursPerDay: '每天小时数', wakeHours: '清醒时间', daily: '每日', weekly: '每周', monthly: '每月', yearly: '每年', percentOfWake: '清醒时间百分比', healthStatus: '健康状态', excessive: '过度', high: '高', moderate: '适中', good: '良好', excellent: '优秀', recommendations: '建议', ergonomicTips: '人体工程学提示' },
    ja: { hoursPerDay: '1日あたりの時間', wakeHours: '起床時間', daily: '毎日', weekly: '毎週', monthly: '毎月', yearly: '毎年', percentOfWake: '起床時間の割合', healthStatus: '健康状態', excessive: '過度', high: '高い', moderate: '適度', good: '良好', excellent: '優秀', recommendations: '推奨事項', ergonomicTips: '人間工学のヒント' },
    ko: { hoursPerDay: '하루 시간', wakeHours: '깨어있는 시간', daily: '일일', weekly: '주간', monthly: '월간', yearly: '연간', percentOfWake: '깨어있는 시간 비율', healthStatus: '건강 상태', excessive: '과도', high: '높음', moderate: '적당', good: '양호', excellent: '우수', recommendations: '권장사항', ergonomicTips: '인체공학 팁' },
    es: { hoursPerDay: 'Horas Por Día', wakeHours: 'Horas Despierto', daily: 'Diario', weekly: 'Semanal', monthly: 'Mensual', yearly: 'Anual', percentOfWake: 'Porcentaje Despierto', healthStatus: 'Estado de Salud', excessive: 'Excesivo', high: 'Alto', moderate: 'Moderado', good: 'Bueno', excellent: 'Excelente', recommendations: 'Recomendaciones', ergonomicTips: 'Consejos Ergonómicos' },
    pt: { hoursPerDay: 'Horas Por Dia', wakeHours: 'Horas Acordado', daily: 'Diário', weekly: 'Semanal', monthly: 'Mensal', yearly: 'Anual', percentOfWake: 'Porcentagem Acordado', healthStatus: 'Estado de Saúde', excessive: 'Excessivo', high: 'Alto', moderate: 'Moderado', good: 'Bom', excellent: 'Excelente', recommendations: 'Recomendações', ergonomicTips: 'Dicas Ergonômicas' },
    fr: { hoursPerDay: 'Heures Par Jour', wakeHours: 'Heures Éveillé', daily: 'Quotidien', weekly: 'Hebdomadaire', monthly: 'Mensuel', yearly: 'Annuel', percentOfWake: 'Pourcentage Éveillé', healthStatus: 'État de Santé', excessive: 'Excessif', high: 'Élevé', moderate: 'Modéré', good: 'Bon', excellent: 'Excellent', recommendations: 'Recommandations', ergonomicTips: 'Conseils Ergonomiques' },
    de: { hoursPerDay: 'Stunden Pro Tag', wakeHours: 'Wachstunden', daily: 'Täglich', weekly: 'Wöchentlich', monthly: 'Monatlich', yearly: 'Jährlich', percentOfWake: 'Prozent Wachzeit', healthStatus: 'Gesundheitsstatus', excessive: 'Übermäßig', high: 'Hoch', moderate: 'Moderat', good: 'Gut', excellent: 'Ausgezeichnet', recommendations: 'Empfehlungen', ergonomicTips: 'Ergonomie-Tipps' },
    ru: { hoursPerDay: 'Часов в День', wakeHours: 'Часов Бодрствования', daily: 'Ежедневно', weekly: 'Еженедельно', monthly: 'Ежемесячно', yearly: 'Ежегодно', percentOfWake: 'Процент Бодрствования', healthStatus: 'Состояние Здоровья', excessive: 'Чрезмерно', high: 'Высокий', moderate: 'Умеренный', good: 'Хороший', excellent: 'Отлично', recommendations: 'Рекомендации', ergonomicTips: 'Эргономические Советы' },
    ar: { hoursPerDay: 'ساعات في اليوم', wakeHours: 'ساعات الاستيقاظ', daily: 'يومي', weekly: 'أسبوعي', monthly: 'شهري', yearly: 'سنوي', percentOfWake: 'نسبة الاستيقاظ', healthStatus: 'الحالة الصحية', excessive: 'مفرط', high: 'عالي', moderate: 'معتدل', good: 'جيد', excellent: 'ممتاز', recommendations: 'التوصيات', ergonomicTips: 'نصائح مريحة' }
  },
  'typing-time-calculator': {
    en: { wordCount: 'Word Count', typingSpeed: 'Typing Speed (WPM)', beginner: 'Beginner', average: 'Average', professional: 'Professional', expert: 'Expert', pureTypingTime: 'Pure Typing Time', totalWithBreaks: 'Total with Breaks', recommendedBreaks: 'Recommended Breaks', minutes: 'minutes', seconds: 'seconds' },
    zh: { wordCount: '字数', typingSpeed: '打字速度 (WPM)', beginner: '初学者', average: '平均', professional: '专业', expert: '专家', pureTypingTime: '纯打字时间', totalWithBreaks: '含休息总时间', recommendedBreaks: '建议休息次数', minutes: '分钟', seconds: '秒' },
    ja: { wordCount: '単語数', typingSpeed: 'タイピング速度 (WPM)', beginner: '初心者', average: '平均', professional: 'プロ', expert: 'エキスパート', pureTypingTime: '純粋なタイピング時間', totalWithBreaks: '休憩込み合計', recommendedBreaks: '推奨休憩回数', minutes: '分', seconds: '秒' },
    ko: { wordCount: '단어 수', typingSpeed: '타이핑 속도 (WPM)', beginner: '초보자', average: '평균', professional: '전문가', expert: '숙련자', pureTypingTime: '순수 타이핑 시간', totalWithBreaks: '휴식 포함 총 시간', recommendedBreaks: '권장 휴식 횟수', minutes: '분', seconds: '초' },
    es: { wordCount: 'Conteo de Palabras', typingSpeed: 'Velocidad de Escritura (PPM)', beginner: 'Principiante', average: 'Promedio', professional: 'Profesional', expert: 'Experto', pureTypingTime: 'Tiempo de Escritura Puro', totalWithBreaks: 'Total con Descansos', recommendedBreaks: 'Descansos Recomendados', minutes: 'minutos', seconds: 'segundos' },
    pt: { wordCount: 'Contagem de Palavras', typingSpeed: 'Velocidade de Digitação (PPM)', beginner: 'Iniciante', average: 'Médio', professional: 'Profissional', expert: 'Especialista', pureTypingTime: 'Tempo de Digitação Puro', totalWithBreaks: 'Total com Pausas', recommendedBreaks: 'Pausas Recomendadas', minutes: 'minutos', seconds: 'segundos' },
    fr: { wordCount: 'Nombre de Mots', typingSpeed: 'Vitesse de Frappe (MPM)', beginner: 'Débutant', average: 'Moyen', professional: 'Professionnel', expert: 'Expert', pureTypingTime: 'Temps de Frappe Pur', totalWithBreaks: 'Total avec Pauses', recommendedBreaks: 'Pauses Recommandées', minutes: 'minutes', seconds: 'secondes' },
    de: { wordCount: 'Wortanzahl', typingSpeed: 'Tippgeschwindigkeit (WPM)', beginner: 'Anfänger', average: 'Durchschnitt', professional: 'Professionell', expert: 'Experte', pureTypingTime: 'Reine Tippzeit', totalWithBreaks: 'Gesamt mit Pausen', recommendedBreaks: 'Empfohlene Pausen', minutes: 'Minuten', seconds: 'Sekunden' },
    ru: { wordCount: 'Количество Слов', typingSpeed: 'Скорость Печати (СВМ)', beginner: 'Начинающий', average: 'Средний', professional: 'Профессионал', expert: 'Эксперт', pureTypingTime: 'Чистое Время Печати', totalWithBreaks: 'Всего с Перерывами', recommendedBreaks: 'Рекомендуемые Перерывы', minutes: 'минут', seconds: 'секунд' },
    ar: { wordCount: 'عدد الكلمات', typingSpeed: 'سرعة الكتابة (كلمة/دقيقة)', beginner: 'مبتدئ', average: 'متوسط', professional: 'محترف', expert: 'خبير', pureTypingTime: 'وقت الكتابة الصافي', totalWithBreaks: 'الإجمالي مع الاستراحات', recommendedBreaks: 'الاستراحات الموصى بها', minutes: 'دقائق', seconds: 'ثواني' }
  },
  'download-time-calculator': {
    en: { fileSize: 'File Size', downloadSpeed: 'Download Speed', connection: 'Connection', estimatedTime: 'Estimated Time', days: 'days', minutes: 'minutes', seconds: 'seconds', comparisonTable: 'Comparison Table' },
    zh: { fileSize: '文件大小', downloadSpeed: '下载速度', connection: '连接', estimatedTime: '预计时间', days: '天', minutes: '分钟', seconds: '秒', comparisonTable: '对比表' },
    ja: { fileSize: 'ファイルサイズ', downloadSpeed: 'ダウンロード速度', connection: '接続', estimatedTime: '推定時間', days: '日', minutes: '分', seconds: '秒', comparisonTable: '比較表' },
    ko: { fileSize: '파일 크기', downloadSpeed: '다운로드 속도', connection: '연결', estimatedTime: '예상 시간', days: '일', minutes: '분', seconds: '초', comparisonTable: '비교표' },
    es: { fileSize: 'Tamaño de Archivo', downloadSpeed: 'Velocidad de Descarga', connection: 'Conexión', estimatedTime: 'Tiempo Estimado', days: 'días', minutes: 'minutos', seconds: 'segundos', comparisonTable: 'Tabla de Comparación' },
    pt: { fileSize: 'Tamanho do Arquivo', downloadSpeed: 'Velocidade de Download', connection: 'Conexão', estimatedTime: 'Tempo Estimado', days: 'dias', minutes: 'minutos', seconds: 'segundos', comparisonTable: 'Tabela de Comparação' },
    fr: { fileSize: 'Taille du Fichier', downloadSpeed: 'Vitesse de Téléchargement', connection: 'Connexion', estimatedTime: 'Temps Estimé', days: 'jours', minutes: 'minutes', seconds: 'secondes', comparisonTable: 'Tableau de Comparaison' },
    de: { fileSize: 'Dateigröße', downloadSpeed: 'Download-Geschwindigkeit', connection: 'Verbindung', estimatedTime: 'Geschätzte Zeit', days: 'Tage', minutes: 'Minuten', seconds: 'Sekunden', comparisonTable: 'Vergleichstabelle' },
    ru: { fileSize: 'Размер Файла', downloadSpeed: 'Скорость Загрузки', connection: 'Соединение', estimatedTime: 'Расчетное Время', days: 'дней', minutes: 'минут', seconds: 'секунд', comparisonTable: 'Сравнительная Таблица' },
    ar: { fileSize: 'حجم الملف', downloadSpeed: 'سرعة التحميل', connection: 'الاتصال', estimatedTime: 'الوقت المقدر', days: 'أيام', minutes: 'دقائق', seconds: 'ثواني', comparisonTable: 'جدول المقارنة' }
  }
};

Object.assign(batch53Fixes, calculators);


// 数据解析工具
const parsers = {
  'ical-parser': {
    en: { parse: 'Parse', uploadFile: 'Upload File', icsContent: 'iCal Content', foundEvents: 'Events Found', summary: 'Summary', start: 'Start', end: 'End', location: 'Location', unnamed: 'Unnamed Event', exportJSON: 'Export JSON' },
    zh: { parse: '解析', uploadFile: '上传文件', icsContent: 'iCal 内容', foundEvents: '发现事件', summary: '摘要', start: '开始', end: '结束', location: '位置', unnamed: '未命名事件', exportJSON: '导出 JSON' },
    ja: { parse: '解析', uploadFile: 'ファイルをアップロード', icsContent: 'iCal内容', foundEvents: 'イベント発見', summary: '概要', start: '開始', end: '終了', location: '場所', unnamed: '無名イベント', exportJSON: 'JSONエクスポート' },
    ko: { parse: '파싱', uploadFile: '파일 업로드', icsContent: 'iCal 내용', foundEvents: '이벤트 발견', summary: '요약', start: '시작', end: '종료', location: '위치', unnamed: '이름 없는 이벤트', exportJSON: 'JSON 내보내기' },
    es: { parse: 'Analizar', uploadFile: 'Subir Archivo', icsContent: 'Contenido iCal', foundEvents: 'Eventos Encontrados', summary: 'Resumen', start: 'Inicio', end: 'Fin', location: 'Ubicación', unnamed: 'Evento Sin Nombre', exportJSON: 'Exportar JSON' },
    pt: { parse: 'Analisar', uploadFile: 'Enviar Arquivo', icsContent: 'Conteúdo iCal', foundEvents: 'Eventos Encontrados', summary: 'Resumo', start: 'Início', end: 'Fim', location: 'Local', unnamed: 'Evento Sem Nome', exportJSON: 'Exportar JSON' },
    fr: { parse: 'Analyser', uploadFile: 'Télécharger Fichier', icsContent: 'Contenu iCal', foundEvents: 'Événements Trouvés', summary: 'Résumé', start: 'Début', end: 'Fin', location: 'Lieu', unnamed: 'Événement Sans Nom', exportJSON: 'Exporter JSON' },
    de: { parse: 'Analysieren', uploadFile: 'Datei Hochladen', icsContent: 'iCal Inhalt', foundEvents: 'Ereignisse Gefunden', summary: 'Zusammenfassung', start: 'Start', end: 'Ende', location: 'Ort', unnamed: 'Unbenanntes Ereignis', exportJSON: 'JSON Exportieren' },
    ru: { parse: 'Анализировать', uploadFile: 'Загрузить Файл', icsContent: 'Содержимое iCal', foundEvents: 'Найдено Событий', summary: 'Сводка', start: 'Начало', end: 'Конец', location: 'Место', unnamed: 'Безымянное Событие', exportJSON: 'Экспорт JSON' },
    ar: { parse: 'تحليل', uploadFile: 'رفع ملف', icsContent: 'محتوى iCal', foundEvents: 'الأحداث الموجودة', summary: 'ملخص', start: 'البداية', end: 'النهاية', location: 'الموقع', unnamed: 'حدث بدون اسم', exportJSON: 'تصدير JSON' }
  },
  'vcard-parser': {
    en: { parse: 'Parse', uploadFile: 'Upload File', vcardContent: 'vCard Content', foundContacts: 'Contacts Found', exportJSON: 'Export JSON' },
    zh: { parse: '解析', uploadFile: '上传文件', vcardContent: 'vCard 内容', foundContacts: '发现联系人', exportJSON: '导出 JSON' },
    ja: { parse: '解析', uploadFile: 'ファイルをアップロード', vcardContent: 'vCard内容', foundContacts: '連絡先発見', exportJSON: 'JSONエクスポート' },
    ko: { parse: '파싱', uploadFile: '파일 업로드', vcardContent: 'vCard 내용', foundContacts: '연락처 발견', exportJSON: 'JSON 내보내기' },
    es: { parse: 'Analizar', uploadFile: 'Subir Archivo', vcardContent: 'Contenido vCard', foundContacts: 'Contactos Encontrados', exportJSON: 'Exportar JSON' },
    pt: { parse: 'Analisar', uploadFile: 'Enviar Arquivo', vcardContent: 'Conteúdo vCard', foundContacts: 'Contatos Encontrados', exportJSON: 'Exportar JSON' },
    fr: { parse: 'Analyser', uploadFile: 'Télécharger Fichier', vcardContent: 'Contenu vCard', foundContacts: 'Contacts Trouvés', exportJSON: 'Exporter JSON' },
    de: { parse: 'Analysieren', uploadFile: 'Datei Hochladen', vcardContent: 'vCard Inhalt', foundContacts: 'Kontakte Gefunden', exportJSON: 'JSON Exportieren' },
    ru: { parse: 'Анализировать', uploadFile: 'Загрузить Файл', vcardContent: 'Содержимое vCard', foundContacts: 'Найдено Контактов', exportJSON: 'Экспорт JSON' },
    ar: { parse: 'تحليل', uploadFile: 'رفع ملف', vcardContent: 'محتوى vCard', foundContacts: 'جهات الاتصال الموجودة', exportJSON: 'تصدير JSON' }
  }
};

Object.assign(batch53Fixes, parsers);

// 执行修复
locales.forEach(locale => {
  const filePath = `src/messages/${locale}.json`;
  console.log(`Processing ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    let modified = false;
    
    Object.entries(batch53Fixes).forEach(([toolSlug, translations]) => {
      if (data.tools && data.tools[toolSlug]) {
        const toolTranslations = translations[locale];
        if (toolTranslations) {
          Object.entries(toolTranslations).forEach(([key, value]) => {
            if (!data.tools[toolSlug][key]) {
              data.tools[toolSlug][key] = value;
              modified = true;
              console.log(`  Added ${toolSlug}.${key}`);
            }
          });
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`  ✓ Updated ${filePath}`);
    } else {
      console.log(`  - No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('\nDone! Run "npx tsx scripts/split-translations.ts" to update split files.');
