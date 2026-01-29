/**
 * 修复未翻译的工具名称和描述
 */
const fs = require('fs');
const path = require('path');

// 需要翻译的工具
const toolTranslations = {
  'markdown-to-pdf': {
    zh: { name: 'Markdown 转 PDF', description: '将 Markdown 文档转换为 PDF 文件' },
    ja: { name: 'Markdown から PDF', description: 'Markdown ドキュメントを PDF ファイルに変換' },
    ko: { name: 'Markdown를 PDF로', description: 'Markdown 문서를 PDF 파일로 변환' },
    es: { name: 'Markdown a PDF', description: 'Convierte documentos Markdown a archivos PDF' },
    pt: { name: 'Markdown para PDF', description: 'Converta documentos Markdown para arquivos PDF' },
    fr: { name: 'Markdown vers PDF', description: 'Convertissez des documents Markdown en fichiers PDF' },
    de: { name: 'Markdown zu PDF', description: 'Konvertieren Sie Markdown-Dokumente in PDF-Dateien' },
    ru: { name: 'Markdown в PDF', description: 'Конвертируйте документы Markdown в файлы PDF' },
    ar: { name: 'Markdown إلى PDF', description: 'تحويل مستندات Markdown إلى ملفات PDF' }
  },
  'break-even-calculator': {
    zh: { name: '盈亏平衡计算器', description: '计算企业的盈亏平衡点' },
    ja: { name: '損益分岐点計算機', description: 'ビジネスの損益分岐点を計算' },
    ko: { name: '손익분기점 계산기', description: '비즈니스의 손익분기점 계산' },
    es: { name: 'Calculadora de Punto de Equilibrio', description: 'Calcula el punto de equilibrio de tu negocio' },
    pt: { name: 'Calculadora de Ponto de Equilíbrio', description: 'Calcule o ponto de equilíbrio do seu negócio' },
    fr: { name: 'Calculateur de Seuil de Rentabilité', description: 'Calculez le seuil de rentabilité de votre entreprise' },
    de: { name: 'Break-Even-Rechner', description: 'Berechnen Sie den Break-Even-Punkt Ihres Unternehmens' },
    ru: { name: 'Калькулятор точки безубыточности', description: 'Рассчитайте точку безубыточности вашего бизнеса' },
    ar: { name: 'حاسبة نقطة التعادل', description: 'احسب نقطة التعادل لعملك' }
  },
  'glassmorphism-generator': {
    zh: { name: 'Glassmorphism 生成器', description: '创建现代玻璃拟态 UI 效果，可自定义模糊度、透明度和边框' },
    ja: { name: 'Glassmorphism ジェネレーター', description: 'カスタマイズ可能なぼかし、透明度、ボーダーでモダンなガラス風UIエフェクトを作成' },
    ko: { name: 'Glassmorphism 생성기', description: '사용자 정의 가능한 블러, 투명도 및 테두리로 현대적인 유리 UI 효과 생성' },
    es: { name: 'Generador Glassmorphism', description: 'Crea efectos UI de vidrio modernos con desenfoque, transparencia y bordes personalizables' },
    pt: { name: 'Gerador Glassmorphism', description: 'Crie efeitos de UI de vidro modernos com desfoque, transparência e bordas personalizáveis' },
    fr: { name: 'Générateur Glassmorphism', description: 'Créez des effets UI en verre modernes avec flou, transparence et bordures personnalisables' },
    de: { name: 'Glassmorphism Generator', description: 'Erstellen Sie moderne Glas-UI-Effekte mit anpassbarer Unschärfe, Transparenz und Rahmen' },
    ru: { name: 'Генератор Glassmorphism', description: 'Создавайте современные стеклянные UI-эффекты с настраиваемым размытием, прозрачностью и границами' },
    ar: { name: 'مولد Glassmorphism', description: 'إنشاء تأثيرات واجهة مستخدم زجاجية حديثة مع ضبابية وشفافية وحدود قابلة للتخصيص' }
  },
  'neumorphism-generator': {
    zh: { name: 'Neumorphism 生成器', description: '生成柔和的新拟态 UI 效果，带有可自定义的阴影和颜色' },
    ja: { name: 'Neumorphism ジェネレーター', description: 'カスタマイズ可能なシャドウとカラーでソフトなニューモーフィズムUIエフェクトを生成' },
    ko: { name: 'Neumorphism 생성기', description: '사용자 정의 가능한 그림자와 색상으로 부드러운 뉴모피즘 UI 효과 생성' },
    es: { name: 'Generador Neumorphism', description: 'Genera efectos UI neumórficos suaves con sombras y colores personalizables' },
    pt: { name: 'Gerador Neumorphism', description: 'Gere efeitos de UI neumórficos suaves com sombras e cores personalizáveis' },
    fr: { name: 'Générateur Neumorphism', description: 'Générez des effets UI neumorphiques doux avec ombres et couleurs personnalisables' },
    de: { name: 'Neumorphism Generator', description: 'Erzeugen Sie weiche neumorphe UI-Effekte mit anpassbaren Schatten und Farben' },
    ru: { name: 'Генератор Neumorphism', description: 'Создавайте мягкие неоморфные UI-эффекты с настраиваемыми тенями и цветами' },
    ar: { name: 'مولد Neumorphism', description: 'إنشاء تأثيرات واجهة مستخدم ناعمة مع ظلال وألوان قابلة للتخصيص' }
  },
  'blob-generator': {
    zh: { name: 'Blob 形状生成器', description: '创建随机有机 Blob 形状作为背景和装饰的 SVG' },
    ja: { name: 'Blob シェイプジェネレーター', description: '背景や装飾用のランダムな有機的ブロブ形状をSVGで作成' },
    ko: { name: 'Blob 모양 생성기', description: '배경 및 장식용 랜덤 유기적 Blob 모양을 SVG로 생성' },
    es: { name: 'Generador de Formas Blob', description: 'Crea formas blob orgánicas aleatorias como SVG para fondos y decoraciones' },
    pt: { name: 'Gerador de Formas Blob', description: 'Crie formas blob orgânicas aleatórias como SVG para fundos e decorações' },
    fr: { name: 'Générateur de Formes Blob', description: 'Créez des formes blob organiques aléatoires en SVG pour arrière-plans et décorations' },
    de: { name: 'Blob-Form-Generator', description: 'Erstellen Sie zufällige organische Blob-Formen als SVG für Hintergründe und Dekorationen' },
    ru: { name: 'Генератор форм Blob', description: 'Создавайте случайные органические формы blob в SVG для фонов и украшений' },
    ar: { name: 'مولد أشكال Blob', description: 'إنشاء أشكال blob عضوية عشوائية كـ SVG للخلفيات والزخارف' }
  },
  'wave-generator': {
    zh: { name: 'Wave 波浪生成器', description: '生成 SVG 波浪图案用于网页分隔和背景' },
    ja: { name: 'Wave ウェーブジェネレーター', description: 'セクション区切りや背景用のSVGウェーブパターンを生成' },
    ko: { name: 'Wave 파도 생성기', description: '섹션 구분선 및 배경용 SVG 파도 패턴 생성' },
    es: { name: 'Generador de Ondas', description: 'Genera patrones de ondas SVG para separadores de sección y fondos' },
    pt: { name: 'Gerador de Ondas', description: 'Gere padrões de ondas SVG para divisores de seção e fundos' },
    fr: { name: 'Générateur de Vagues', description: 'Générez des motifs de vagues SVG pour séparateurs de section et arrière-plans' },
    de: { name: 'Wellen-Generator', description: 'Erzeugen Sie SVG-Wellenmuster für Abschnittsteiler und Hintergründe' },
    ru: { name: 'Генератор волн', description: 'Создавайте SVG-паттерны волн для разделителей секций и фонов' },
    ar: { name: 'مولد الموجات', description: 'إنشاء أنماط موجات SVG لفواصل الأقسام والخلفيات' }
  },
  'mesh-gradient-generator': {
    zh: { name: 'Mesh 渐变生成器', description: '创建具有多个颜色点的美丽网格渐变' },
    ja: { name: 'Mesh グラデーションジェネレーター', description: '複数のカラーポイントで美しいメッシュグラデーションを作成' },
    ko: { name: 'Mesh 그라디언트 생성기', description: '여러 색상 포인트로 아름다운 메시 그라디언트 생성' },
    es: { name: 'Generador de Gradiente Mesh', description: 'Crea hermosos gradientes de malla con múltiples puntos de color' },
    pt: { name: 'Gerador de Gradiente Mesh', description: 'Crie belos gradientes de malha com múltiplos pontos de cor' },
    fr: { name: 'Générateur de Dégradé Mesh', description: 'Créez de beaux dégradés en maille avec plusieurs points de couleur' },
    de: { name: 'Mesh-Gradient-Generator', description: 'Erstellen Sie schöne Mesh-Gradienten mit mehreren Farbpunkten' },
    ru: { name: 'Генератор Mesh-градиентов', description: 'Создавайте красивые сетчатые градиенты с несколькими цветовыми точками' },
    ar: { name: 'مولد تدرج Mesh', description: 'إنشاء تدرجات شبكية جميلة مع نقاط ألوان متعددة' }
  },
  'noise-texture-generator': {
    zh: { name: '噪点纹理生成器', description: '生成噪点纹理和颗粒效果用于背景' },
    ja: { name: 'ノイズテクスチャジェネレーター', description: '背景用のノイズテクスチャとグレインエフェクトを生成' },
    ko: { name: '노이즈 텍스처 생성기', description: '배경용 노이즈 텍스처 및 그레인 효과 생성' },
    es: { name: 'Generador de Texturas de Ruido', description: 'Genera texturas de ruido y efectos de grano para fondos' },
    pt: { name: 'Gerador de Texturas de Ruído', description: 'Gere texturas de ruído e efeitos de grão para fundos' },
    fr: { name: 'Générateur de Textures de Bruit', description: 'Générez des textures de bruit et des effets de grain pour arrière-plans' },
    de: { name: 'Rauschtextur-Generator', description: 'Erzeugen Sie Rauschtexturen und Körnungseffekte für Hintergründe' },
    ru: { name: 'Генератор шумовых текстур', description: 'Создавайте шумовые текстуры и эффекты зернистости для фонов' },
    ar: { name: 'مولد نسيج الضوضاء', description: 'إنشاء نسيج ضوضاء وتأثيرات حبيبية للخلفيات' }
  },
  'commit-message-generator': {
    zh: { name: 'Git 提交信息生成器', description: '生成符合规范的 Git 提交信息' },
    ja: { name: 'Git コミットメッセージジェネレーター', description: '規約に準拠したGitコミットメッセージを生成' },
    ko: { name: 'Git 커밋 메시지 생성기', description: '규칙에 맞는 Git 커밋 메시지 생성' },
    es: { name: 'Generador de Mensajes de Commit', description: 'Genera mensajes de commit Git siguiendo convenciones' },
    pt: { name: 'Gerador de Mensagens de Commit', description: 'Gere mensagens de commit Git seguindo convenções' },
    fr: { name: 'Générateur de Messages de Commit', description: 'Générez des messages de commit Git suivant les conventions' },
    de: { name: 'Commit-Nachricht-Generator', description: 'Generieren Sie Git-Commit-Nachrichten nach Konventionen' },
    ru: { name: 'Генератор сообщений коммитов', description: 'Создавайте сообщения коммитов Git по соглашениям' },
    ar: { name: 'مولد رسائل Commit', description: 'إنشاء رسائل commit Git وفقًا للاتفاقيات' }
  },
  'bandwidth-calculator': {
    zh: { name: '带宽计算器', description: '计算网络带宽需求和数据传输时间' },
    ja: { name: '帯域幅計算機', description: 'ネットワーク帯域幅の要件とデータ転送時間を計算' },
    ko: { name: '대역폭 계산기', description: '네트워크 대역폭 요구 사항 및 데이터 전송 시간 계산' },
    es: { name: 'Calculadora de Ancho de Banda', description: 'Calcula los requisitos de ancho de banda de red y tiempos de transferencia de datos' },
    pt: { name: 'Calculadora de Largura de Banda', description: 'Calcule os requisitos de largura de banda de rede e tempos de transferência de dados' },
    fr: { name: 'Calculateur de Bande Passante', description: 'Calculez les besoins en bande passante réseau et les temps de transfert de données' },
    de: { name: 'Bandbreiten-Rechner', description: 'Berechnen Sie Netzwerkbandbreitenanforderungen und Datenübertragungszeiten' },
    ru: { name: 'Калькулятор пропускной способности', description: 'Рассчитайте требования к пропускной способности сети и время передачи данных' },
    ar: { name: 'حاسبة عرض النطاق الترددي', description: 'حساب متطلبات عرض النطاق الترددي للشبكة وأوقات نقل البيانات' }
  },
  'data-transfer-calculator': {
    zh: { name: '数据传输计算器', description: '计算文件传输时间和所需带宽' },
    ja: { name: 'データ転送計算機', description: 'ファイル転送時間と必要な帯域幅を計算' },
    ko: { name: '데이터 전송 계산기', description: '파일 전송 시간 및 필요한 대역폭 계산' },
    es: { name: 'Calculadora de Transferencia de Datos', description: 'Calcula el tiempo de transferencia de archivos y el ancho de banda necesario' },
    pt: { name: 'Calculadora de Transferência de Dados', description: 'Calcule o tempo de transferência de arquivos e a largura de banda necessária' },
    fr: { name: 'Calculateur de Transfert de Données', description: 'Calculez le temps de transfert de fichiers et la bande passante nécessaire' },
    de: { name: 'Datenübertragungs-Rechner', description: 'Berechnen Sie Dateiübertragungszeiten und benötigte Bandbreite' },
    ru: { name: 'Калькулятор передачи данных', description: 'Рассчитайте время передачи файлов и необходимую пропускную способность' },
    ar: { name: 'حاسبة نقل البيانات', description: 'حساب وقت نقل الملفات وعرض النطاق الترددي المطلوب' }
  },
  'pixel-density-calculator': {
    zh: { name: '像素密度计算器', description: '计算屏幕的 PPI 和像素密度' },
    ja: { name: 'ピクセル密度計算機', description: '画面のPPIとピクセル密度を計算' },
    ko: { name: '픽셀 밀도 계산기', description: '화면의 PPI 및 픽셀 밀도 계산' },
    es: { name: 'Calculadora de Densidad de Píxeles', description: 'Calcula el PPI y la densidad de píxeles de la pantalla' },
    pt: { name: 'Calculadora de Densidade de Pixels', description: 'Calcule o PPI e a densidade de pixels da tela' },
    fr: { name: 'Calculateur de Densité de Pixels', description: 'Calculez le PPI et la densité de pixels de l\'écran' },
    de: { name: 'Pixeldichte-Rechner', description: 'Berechnen Sie PPI und Pixeldichte des Bildschirms' },
    ru: { name: 'Калькулятор плотности пикселей', description: 'Рассчитайте PPI и плотность пикселей экрана' },
    ar: { name: 'حاسبة كثافة البكسل', description: 'حساب PPI وكثافة البكسل للشاشة' }
  },
  'dpi-calculator': {
    zh: { name: 'DPI 计算器', description: '计算打印和显示的 DPI 值' },
    ja: { name: 'DPI 計算機', description: '印刷とディスプレイのDPI値を計算' },
    ko: { name: 'DPI 계산기', description: '인쇄 및 디스플레이용 DPI 값 계산' },
    es: { name: 'Calculadora de DPI', description: 'Calcula valores de DPI para impresión y pantalla' },
    pt: { name: 'Calculadora de DPI', description: 'Calcule valores de DPI para impressão e tela' },
    fr: { name: 'Calculateur de DPI', description: 'Calculez les valeurs DPI pour l\'impression et l\'affichage' },
    de: { name: 'DPI-Rechner', description: 'Berechnen Sie DPI-Werte für Druck und Anzeige' },
    ru: { name: 'Калькулятор DPI', description: 'Рассчитайте значения DPI для печати и отображения' },
    ar: { name: 'حاسبة DPI', description: 'حساب قيم DPI للطباعة والعرض' }
  }
};

const LOCALES = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 主函数
function main() {
  console.log('🔧 修复未翻译的工具...\n');
  
  for (const locale of LOCALES) {
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let fixed = 0;
    for (const [slug, translations] of Object.entries(toolTranslations)) {
      if (data.tools[slug] && translations[locale]) {
        data.tools[slug].name = translations[locale].name;
        data.tools[slug].description = translations[locale].description;
        fixed++;
      }
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`📂 ${locale}: 修复了 ${fixed} 个工具`);
  }
  
  console.log('\n✅ 完成！');
}

main();
