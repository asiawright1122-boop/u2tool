/**
 * SEO Description 批量更新脚本 - 第二批
 * 为剩余 81 个工具添加优化后的 SEO Description
 * 
 * 使用方法：npx ts-node scripts/seo-descriptions-batch2.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 第七批工具优化 - 剩余工具
const BATCH2_DESCRIPTIONS: Record<string, Record<string, string>> = {
  'css-minifier': {
    en: 'Minify and compress CSS code online for free. Remove whitespace, comments, and optimize selectors. Reduce file size and improve page load speed.',
    zh: '免费在线压缩 CSS 代码。删除空白、注释并优化选择器。减小文件大小，提高页面加载速度。',
    es: 'Minifica y comprime código CSS en línea gratis. Elimina espacios, comentarios y optimiza selectores. Reduce tamaño y mejora velocidad de carga.',
    pt: 'Minifique e comprima código CSS online grátis. Remova espaços, comentários e otimize seletores. Reduza tamanho e melhore velocidade de carga.',
    ja: 'CSSコードを無料でオンライン圧縮。空白、コメントを削除し、セレクタを最適化。ファイルサイズを削減し、ページ読み込み速度を向上。',
  },
  'js-minifier': {
    en: 'Minify and compress JavaScript code online for free. Remove whitespace, comments, and shorten variable names. Reduce file size for faster loading.',
    zh: '免费在线压缩 JavaScript 代码。删除空白、注释并缩短变量名。减小文件大小，加快加载速度。',
    es: 'Minifica y comprime código JavaScript en línea gratis. Elimina espacios, comentarios y acorta nombres de variables. Reduce tamaño para carga rápida.',
    pt: 'Minifique e comprima código JavaScript online grátis. Remova espaços, comentários e encurte nomes de variáveis. Reduza tamanho para carga rápida.',
    ja: 'JavaScriptコードを無料でオンライン圧縮。空白、コメントを削除し、変数名を短縮。ファイルサイズを削減し、読み込みを高速化。',
  },
  'box-shadow-generator': {
    en: 'Generate CSS box-shadow with visual editor online for free. Customize offset, blur, spread, and color. Copy CSS code with one click for your projects.',
    zh: '免费在线使用可视化编辑器生成 CSS box-shadow。自定义偏移、模糊、扩展和颜色。一键复制 CSS 代码。',
    es: 'Genera CSS box-shadow con editor visual en línea gratis. Personaliza offset, blur, spread y color. Copia código CSS con un clic para tus proyectos.',
    pt: 'Gere CSS box-shadow com editor visual online grátis. Personalize offset, blur, spread e cor. Copie código CSS com um clique para seus projetos.',
    ja: 'ビジュアルエディタでCSS box-shadowを無料でオンライン生成。オフセット、ブラー、スプレッド、色をカスタマイズ。ワンクリックでCSSコードをコピー。',
  },
  'border-radius-generator': {
    en: 'Generate CSS border-radius with visual editor online for free. Create rounded corners with custom values for each corner. Copy CSS code instantly.',
    zh: '免费在线使用可视化编辑器生成 CSS border-radius。为每个角创建自定义圆角值。即时复制 CSS 代码。',
    es: 'Genera CSS border-radius con editor visual en línea gratis. Crea esquinas redondeadas con valores personalizados. Copia código CSS al instante.',
    pt: 'Gere CSS border-radius com editor visual online grátis. Crie cantos arredondados com valores personalizados. Copie código CSS instantaneamente.',
    ja: 'ビジュアルエディタでCSS border-radiusを無料でオンライン生成。各コーナーにカスタム値で角丸を作成。CSSコードを即座にコピー。',
  },
  'text-to-ascii-art': {
    en: 'Convert text to ASCII art online for free. Multiple font styles and character sets available. Perfect for terminal banners, comments, and creative projects.',
    zh: '免费在线将文本转换为 ASCII 艺术。多种字体样式和字符集可用。适用于终端横幅、注释和创意项目。',
    es: 'Convierte texto a arte ASCII en línea gratis. Múltiples estilos de fuente y conjuntos de caracteres disponibles. Perfecto para banners y proyectos creativos.',
    pt: 'Converta texto para arte ASCII online grátis. Múltiplos estilos de fonte e conjuntos de caracteres disponíveis. Perfeito para banners e projetos criativos.',
    ja: 'テキストをASCIIアートに無料でオンライン変換。複数のフォントスタイルと文字セットが利用可能。ターミナルバナーやクリエイティブプロジェクトに最適。',
  },
  'color-shades-generator': {
    en: 'Generate color shades and tints from any color online for free. Create lighter and darker variations with customizable steps. Export to CSS or design tools.',
    zh: '免费在线从任何颜色生成色调和色度。创建更浅和更深的变体，支持自定义步数。导出到 CSS 或设计工具。',
    es: 'Genera tonos y matices de cualquier color en línea gratis. Crea variaciones más claras y oscuras con pasos personalizables. Exporta a CSS o herramientas de diseño.',
    pt: 'Gere tons e matizes de qualquer cor online grátis. Crie variações mais claras e escuras com etapas personalizáveis. Exporte para CSS ou ferramentas de design.',
    ja: '任意の色から色調とティントを無料でオンライン生成。カスタマイズ可能なステップで明るい・暗いバリエーションを作成。CSSやデザインツールにエクスポート。',
  },
  'json-flattener': {
    en: 'Flatten or unflatten nested JSON objects online for free. Convert deep structures to dot notation and vice versa. Essential for data transformation and APIs.',
    zh: '免费在线展平或还原嵌套 JSON 对象。将深层结构转换为点表示法，反之亦然。数据转换和 API 必备。',
    es: 'Aplana o desaplana objetos JSON anidados en línea gratis. Convierte estructuras profundas a notación de puntos y viceversa. Esencial para transformación de datos.',
    pt: 'Achate ou desachate objetos JSON aninhados online grátis. Converta estruturas profundas para notação de pontos e vice-versa. Essencial para transformação de dados.',
    ja: 'ネストされたJSONオブジェクトを無料でオンラインでフラット化または展開。深い構造をドット表記に変換、またはその逆。データ変換とAPIに必須。',
  },
  'base85': {
    en: 'Encode and decode Base85 (Ascii85) data online for free. Used in PDF files, PostScript, and data compression. Secure browser-based encoding tool.',
    zh: '免费在线编码和解码 Base85 (Ascii85) 数据。用于 PDF 文件、PostScript 和数据压缩。安全的浏览器编码工具。',
    es: 'Codifica y decodifica datos Base85 (Ascii85) en línea gratis. Usado en archivos PDF, PostScript y compresión de datos. Herramienta segura en navegador.',
    pt: 'Codifique e decodifique dados Base85 (Ascii85) online grátis. Usado em arquivos PDF, PostScript e compressão de dados. Ferramenta segura no navegador.',
    ja: 'Base85 (Ascii85) データを無料でオンラインでエンコード・デコード。PDFファイル、PostScript、データ圧縮で使用。安全なブラウザベースツール。',
  },
  'html-to-markdown': {
    en: 'Convert HTML to Markdown format online for free. Preserve formatting, links, images, and code blocks. Perfect for migrating content to Markdown-based systems.',
    zh: '免费在线将 HTML 转换为 Markdown 格式。保留格式、链接、图片和代码块。适用于将内容迁移到基于 Markdown 的系统。',
    es: 'Convierte HTML a formato Markdown en línea gratis. Preserva formato, enlaces, imágenes y bloques de código. Perfecto para migrar contenido a sistemas Markdown.',
    pt: 'Converta HTML para formato Markdown online grátis. Preserve formatação, links, imagens e blocos de código. Perfeito para migrar conteúdo para sistemas Markdown.',
    ja: 'HTMLをMarkdown形式に無料でオンライン変換。フォーマット、リンク、画像、コードブロックを保持。Markdownベースシステムへのコンテンツ移行に最適。',
  },
  'regex-generator': {
    en: 'Generate and test regular expressions online for free. Build patterns with visual helpers and test against sample text. Essential for pattern matching tasks.',
    zh: '免费在线生成和测试正则表达式。使用可视化助手构建模式并针对示例文本测试。模式匹配任务必备。',
    es: 'Genera y prueba expresiones regulares en línea gratis. Construye patrones con ayudas visuales y prueba contra texto de muestra. Esencial para coincidencia de patrones.',
    pt: 'Gere e teste expressões regulares online grátis. Construa padrões com ajudas visuais e teste contra texto de amostra. Essencial para correspondência de padrões.',
    ja: '正規表現を無料でオンラインで生成・テスト。ビジュアルヘルパーでパターンを構築し、サンプルテキストに対してテスト。パターンマッチングタスクに必須。',
  },
  'url-shortener-preview': {
    en: 'Preview and analyze shortened URLs online for free. Expand bit.ly, tinyurl, and other short links to see the destination. Check for safety before clicking.',
    zh: '免费在线预览和分析短链接。展开 bit.ly、tinyurl 等短链接查看目标地址。点击前检查安全性。',
    es: 'Previsualiza y analiza URLs acortadas en línea gratis. Expande bit.ly, tinyurl y otros enlaces cortos para ver el destino. Verifica seguridad antes de hacer clic.',
    pt: 'Visualize e analise URLs encurtadas online grátis. Expanda bit.ly, tinyurl e outros links curtos para ver o destino. Verifique segurança antes de clicar.',
    ja: '短縮URLを無料でオンラインでプレビュー・分析。bit.ly、tinyurlなどの短縮リンクを展開して宛先を確認。クリック前に安全性をチェック。',
  },
  'json-viewer': {
    en: 'View and explore JSON data in a tree structure online for free. Expand and collapse nodes, search values, and copy paths. Essential for API debugging.',
    zh: '免费在线以树形结构查看和探索 JSON 数据。展开和折叠节点、搜索值并复制路径。API 调试必备。',
    es: 'Ve y explora datos JSON en estructura de árbol en línea gratis. Expande y colapsa nodos, busca valores y copia rutas. Esencial para depuración de APIs.',
    pt: 'Veja e explore dados JSON em estrutura de árvore online grátis. Expanda e recolha nós, pesquise valores e copie caminhos. Essencial para depuração de APIs.',
    ja: 'JSONデータをツリー構造で無料でオンライン表示・探索。ノードの展開・折りたたみ、値の検索、パスのコピー。APIデバッグに必須。',
  },
  'xml-to-json': {
    en: 'Convert XML to JSON format online for free. Preserve attributes, namespaces, and nested elements. Perfect for API integration and data transformation.',
    zh: '免费在线将 XML 转换为 JSON 格式。保留属性、命名空间和嵌套元素。API 集成和数据转换必备。',
    es: 'Convierte XML a formato JSON en línea gratis. Preserva atributos, namespaces y elementos anidados. Perfecto para integración de APIs y transformación de datos.',
    pt: 'Converta XML para formato JSON online grátis. Preserve atributos, namespaces e elementos aninhados. Perfeito para integração de APIs e transformação de dados.',
    ja: 'XMLをJSON形式に無料でオンライン変換。属性、名前空間、ネストされた要素を保持。API統合とデータ変換に最適。',
  },
  'ip-address-generator': {
    en: 'Generate random IP addresses online for free. Support IPv4 and IPv6 formats with custom ranges. Perfect for testing, development, and network simulation.',
    zh: '免费在线生成随机 IP 地址。支持 IPv4 和 IPv6 格式，可自定义范围。测试、开发和网络模拟必备。',
    es: 'Genera direcciones IP aleatorias en línea gratis. Soporta formatos IPv4 e IPv6 con rangos personalizados. Perfecto para pruebas y simulación de redes.',
    pt: 'Gere endereços IP aleatórios online grátis. Suporta formatos IPv4 e IPv6 com intervalos personalizados. Perfeito para testes e simulação de redes.',
    ja: 'ランダムなIPアドレスを無料でオンライン生成。カスタム範囲でIPv4とIPv6形式に対応。テスト、開発、ネットワークシミュレーションに最適。',
  },
  'css-gradient-text': {
    en: 'Create gradient text effects with CSS online for free. Apply linear and radial gradients to text with live preview. Copy CSS code for your web projects.',
    zh: '免费在线使用 CSS 创建渐变文本效果。将线性和径向渐变应用于文本，支持实时预览。复制 CSS 代码用于 Web 项目。',
    es: 'Crea efectos de texto con gradiente CSS en línea gratis. Aplica gradientes lineales y radiales al texto con vista previa en vivo. Copia código CSS.',
    pt: 'Crie efeitos de texto com gradiente CSS online grátis. Aplique gradientes lineares e radiais ao texto com preview ao vivo. Copie código CSS.',
    ja: 'CSSでグラデーションテキスト効果を無料でオンライン作成。ライブプレビュー付きでテキストに線形・放射状グラデーションを適用。CSSコードをコピー。',
  },
  'sitemap-generator': {
    en: 'Generate XML sitemaps for your website online for free. Add URLs with priority, change frequency, and last modified date. Essential for SEO and search indexing.',
    zh: '免费在线为网站生成 XML 站点地图。添加 URL 及优先级、更改频率和最后修改日期。SEO 和搜索索引必备。',
    es: 'Genera sitemaps XML para tu sitio web en línea gratis. Añade URLs con prioridad, frecuencia de cambio y fecha de modificación. Esencial para SEO.',
    pt: 'Gere sitemaps XML para seu site online grátis. Adicione URLs com prioridade, frequência de alteração e data de modificação. Essencial para SEO.',
    ja: 'ウェブサイト用のXMLサイトマップを無料でオンライン生成。優先度、更新頻度、最終更新日付きでURLを追加。SEOと検索インデックスに必須。',
  },
  'json-to-php': {
    en: 'Convert JSON to PHP array syntax online for free. Generate associative arrays with proper escaping and formatting. Essential for PHP backend development.',
    zh: '免费在线将 JSON 转换为 PHP 数组语法。生成带有正确转义和格式的关联数组。PHP 后端开发必备。',
    es: 'Convierte JSON a sintaxis de array PHP en línea gratis. Genera arrays asociativos con escape y formato correctos. Esencial para desarrollo backend PHP.',
    pt: 'Converta JSON para sintaxe de array PHP online grátis. Gere arrays associativos com escape e formatação corretos. Essencial para desenvolvimento backend PHP.',
    ja: 'JSONをPHP配列構文に無料でオンライン変換。適切なエスケープとフォーマットで連想配列を生成。PHPバックエンド開発に必須。',
  },
  'css-filter-generator': {
    en: 'Generate CSS filter effects with visual editor online for free. Apply blur, brightness, contrast, grayscale, and more. Copy CSS code for your projects.',
    zh: '免费在线使用可视化编辑器生成 CSS 滤镜效果。应用模糊、亮度、对比度、灰度等效果。复制 CSS 代码用于项目。',
    es: 'Genera efectos de filtro CSS con editor visual en línea gratis. Aplica blur, brillo, contraste, escala de grises y más. Copia código CSS para tus proyectos.',
    pt: 'Gere efeitos de filtro CSS com editor visual online grátis. Aplique blur, brilho, contraste, escala de cinza e mais. Copie código CSS para seus projetos.',
    ja: 'ビジュアルエディタでCSSフィルター効果を無料でオンライン生成。ブラー、明るさ、コントラスト、グレースケールなどを適用。CSSコードをコピー。',
  },
  'text-diff-patch': {
    en: 'Create and apply text patches online for free. Generate unified diff format patches and apply them to text. Essential for version control and code review.',
    zh: '免费在线创建和应用文本补丁。生成统一 diff 格式补丁并应用到文本。版本控制和代码审查必备。',
    es: 'Crea y aplica parches de texto en línea gratis. Genera parches en formato diff unificado y aplícalos al texto. Esencial para control de versiones.',
    pt: 'Crie e aplique patches de texto online grátis. Gere patches em formato diff unificado e aplique-os ao texto. Essencial para controle de versão.',
    ja: 'テキストパッチを無料でオンラインで作成・適用。統一diff形式のパッチを生成し、テキストに適用。バージョン管理とコードレビューに必須。',
  },
  'encoding-detector': {
    en: 'Detect text and file encoding online for free. Identify UTF-8, UTF-16, ISO-8859, and other character encodings. Essential for handling international text.',
    zh: '免费在线检测文本和文件编码。识别 UTF-8、UTF-16、ISO-8859 等字符编码。处理国际文本必备。',
    es: 'Detecta codificación de texto y archivos en línea gratis. Identifica UTF-8, UTF-16, ISO-8859 y otras codificaciones. Esencial para texto internacional.',
    pt: 'Detecte codificação de texto e arquivos online grátis. Identifique UTF-8, UTF-16, ISO-8859 e outras codificações. Essencial para texto internacional.',
    ja: 'テキストとファイルのエンコーディングを無料でオンライン検出。UTF-8、UTF-16、ISO-8859などの文字エンコーディングを識別。国際テキスト処理に必須。',
  },
  'css-clip-path-generator': {
    en: 'Create CSS clip-path shapes with visual editor online for free. Design polygons, circles, ellipses, and custom paths. Copy CSS code for creative layouts.',
    zh: '免费在线使用可视化编辑器创建 CSS clip-path 形状。设计多边形、圆形、椭圆和自定义路径。复制 CSS 代码用于创意布局。',
    es: 'Crea formas CSS clip-path con editor visual en línea gratis. Diseña polígonos, círculos, elipses y rutas personalizadas. Copia código CSS para layouts creativos.',
    pt: 'Crie formas CSS clip-path com editor visual online grátis. Projete polígonos, círculos, elipses e caminhos personalizados. Copie código CSS para layouts criativos.',
    ja: 'ビジュアルエディタでCSS clip-path形状を無料でオンライン作成。ポリゴン、円、楕円、カスタムパスをデザイン。クリエイティブレイアウト用にCSSコードをコピー。',
  },
  'uuid-validator': {
    en: 'Validate and analyze UUID strings online for free. Check format, version, and variant of UUIDs. Extract timestamp from UUID v1 and v7. Essential for debugging.',
    zh: '免费在线验证和分析 UUID 字符串。检查 UUID 的格式、版本和变体。从 UUID v1 和 v7 提取时间戳。调试必备。',
    es: 'Valida y analiza cadenas UUID en línea gratis. Verifica formato, versión y variante de UUIDs. Extrae timestamp de UUID v1 y v7. Esencial para depuración.',
    pt: 'Valide e analise strings UUID online grátis. Verifique formato, versão e variante de UUIDs. Extraia timestamp de UUID v1 e v7. Essencial para depuração.',
    ja: 'UUID文字列を無料でオンラインで検証・分析。UUIDのフォーマット、バージョン、バリアントをチェック。UUID v1とv7からタイムスタンプを抽出。デバッグに必須。',
  },
  'text-hash-comparator': {
    en: 'Compare text by their hash values online for free. Generate and compare MD5, SHA-1, SHA-256 hashes side by side. Essential for file integrity verification.',
    zh: '免费在线通过哈希值比较文本。并排生成和比较 MD5、SHA-1、SHA-256 哈希值。文件完整性验证必备。',
    es: 'Compara texto por sus valores hash en línea gratis. Genera y compara hashes MD5, SHA-1, SHA-256 lado a lado. Esencial para verificación de integridad.',
    pt: 'Compare texto por seus valores hash online grátis. Gere e compare hashes MD5, SHA-1, SHA-256 lado a lado. Essencial para verificação de integridade.',
    ja: 'ハッシュ値でテキストを無料でオンライン比較。MD5、SHA-1、SHA-256ハッシュを並べて生成・比較。ファイル整合性検証に必須。',
  },
  'json-path-finder': {
    en: 'Find and copy JSON paths from your data online for free. Click on any value to get its JSONPath expression. Essential for API development and data extraction.',
    zh: '免费在线从数据中查找和复制 JSON 路径。点击任何值获取其 JSONPath 表达式。API 开发和数据提取必备。',
    es: 'Encuentra y copia rutas JSON de tus datos en línea gratis. Haz clic en cualquier valor para obtener su expresión JSONPath. Esencial para desarrollo de APIs.',
    pt: 'Encontre e copie caminhos JSON dos seus dados online grátis. Clique em qualquer valor para obter sua expressão JSONPath. Essencial para desenvolvimento de APIs.',
    ja: 'データからJSONパスを無料でオンラインで検索・コピー。任意の値をクリックしてJSONPath式を取得。API開発とデータ抽出に必須。',
  },
  'canvas-drawing': {
    en: 'Simple drawing tool with brush and eraser online for free. Customize brush size, color, and opacity. Download your artwork as PNG image. Perfect for quick sketches.',
    zh: '免费在线简单绘图工具，支持画笔和橡皮擦。自定义画笔大小、颜色和不透明度。下载作品为 PNG 图片。快速草图必备。',
    es: 'Herramienta de dibujo simple con pincel y borrador en línea gratis. Personaliza tamaño, color y opacidad del pincel. Descarga tu obra como PNG.',
    pt: 'Ferramenta de desenho simples com pincel e borracha online grátis. Personalize tamanho, cor e opacidade do pincel. Baixe sua arte como PNG.',
    ja: 'ブラシと消しゴム付きのシンプルな描画ツールを無料でオンライン使用。ブラシサイズ、色、不透明度をカスタマイズ。PNG画像としてダウンロード。',
  },
  'json-escape': {
    en: 'Escape and unescape JSON strings online for free. Handle special characters, quotes, and control characters. Essential for embedding JSON in strings.',
    zh: '免费在线转义和反转义 JSON 字符串。处理特殊字符、引号和控制字符。在字符串中嵌入 JSON 必备。',
    es: 'Escapa y desescapa cadenas JSON en línea gratis. Maneja caracteres especiales, comillas y caracteres de control. Esencial para incrustar JSON en cadenas.',
    pt: 'Escape e unescape strings JSON online grátis. Lide com caracteres especiais, aspas e caracteres de controle. Essencial para incorporar JSON em strings.',
    ja: 'JSON文字列を無料でオンラインでエスケープ・アンエスケープ。特殊文字、引用符、制御文字を処理。文字列へのJSON埋め込みに必須。',
  },
  'css-animation-generator': {
    en: 'Create CSS animations with visual editor online for free. Design keyframes, timing functions, and animation properties. Copy CSS code for your web projects.',
    zh: '免费在线使用可视化编辑器创建 CSS 动画。设计关键帧、时间函数和动画属性。复制 CSS 代码用于 Web 项目。',
    es: 'Crea animaciones CSS con editor visual en línea gratis. Diseña keyframes, funciones de tiempo y propiedades de animación. Copia código CSS para tus proyectos.',
    pt: 'Crie animações CSS com editor visual online grátis. Projete keyframes, funções de tempo e propriedades de animação. Copie código CSS para seus projetos.',
    ja: 'ビジュアルエディタでCSSアニメーションを無料でオンライン作成。キーフレーム、タイミング関数、アニメーションプロパティをデザイン。CSSコードをコピー。',
  },
  'text-case-counter': {
    en: 'Count uppercase, lowercase, digits, spaces, and special characters online for free. Get detailed character type statistics. Essential for text analysis.',
    zh: '免费在线统计大写、小写、数字、空格和特殊字符。获取详细的字符类型统计。文本分析必备。',
    es: 'Cuenta mayúsculas, minúsculas, dígitos, espacios y caracteres especiales en línea gratis. Obtén estadísticas detalladas de tipos de caracteres.',
    pt: 'Conte maiúsculas, minúsculas, dígitos, espaços e caracteres especiais online grátis. Obtenha estatísticas detalhadas de tipos de caracteres.',
    ja: '大文字、小文字、数字、スペース、特殊文字を無料でオンラインカウント。詳細な文字タイプ統計を取得。テキスト分析に必須。',
  },
  'dns-lookup': {
    en: 'Look up DNS records for any domain online for free. Query A, AAAA, MX, TXT, NS, CNAME, and SOA records. Essential for domain troubleshooting and verification.',
    zh: '免费在线查询任何域名的 DNS 记录。查询 A、AAAA、MX、TXT、NS、CNAME 和 SOA 记录。域名故障排除和验证必备。',
    es: 'Busca registros DNS de cualquier dominio en línea gratis. Consulta registros A, AAAA, MX, TXT, NS, CNAME y SOA. Esencial para solución de problemas de dominios.',
    pt: 'Pesquise registros DNS de qualquer domínio online grátis. Consulte registros A, AAAA, MX, TXT, NS, CNAME e SOA. Essencial para solução de problemas de domínios.',
    ja: '任意のドメインのDNSレコードを無料でオンライン検索。A、AAAA、MX、TXT、NS、CNAME、SOAレコードをクエリ。ドメイントラブルシューティングに必須。',
  },
  'image-resizer': {
    en: 'Resize images to custom dimensions online for free. Maintain aspect ratio or set exact width and height. Support PNG, JPEG, WebP formats. Download instantly.',
    zh: '免费在线将图片调整为自定义尺寸。保持宽高比或设置精确的宽度和高度。支持 PNG、JPEG、WebP 格式。即时下载。',
    es: 'Redimensiona imágenes a dimensiones personalizadas en línea gratis. Mantén la relación de aspecto o establece ancho y alto exactos. Soporta PNG, JPEG, WebP.',
    pt: 'Redimensione imagens para dimensões personalizadas online grátis. Mantenha a proporção ou defina largura e altura exatas. Suporta PNG, JPEG, WebP.',
    ja: '画像をカスタムサイズに無料でオンラインリサイズ。アスペクト比を維持または正確な幅と高さを設定。PNG、JPEG、WebP形式に対応。即座にダウンロード。',
  },
  'ssl-checker': {
    en: 'Check SSL certificate validity and expiration date online for free. Verify certificate chain, issuer, and security details. Essential for website security monitoring.',
    zh: '免费在线检查 SSL 证书有效性和过期日期。验证证书链、颁发者和安全详情。网站安全监控必备。',
    es: 'Verifica validez y fecha de expiración de certificados SSL en línea gratis. Verifica cadena de certificados, emisor y detalles de seguridad. Esencial para seguridad.',
    pt: 'Verifique validade e data de expiração de certificados SSL online grátis. Verifique cadeia de certificados, emissor e detalhes de segurança. Essencial para segurança.',
    ja: 'SSL証明書の有効性と有効期限を無料でオンラインチェック。証明書チェーン、発行者、セキュリティ詳細を検証。Webサイトセキュリティ監視に必須。',
  },
  'whois-lookup': {
    en: 'Look up domain registration and ownership information online for free. Get registrar, creation date, expiration date, and nameservers. Essential for domain research.',
    zh: '免费在线查询域名注册和所有权信息。获取注册商、创建日期、过期日期和域名服务器。域名研究必备。',
    es: 'Busca información de registro y propiedad de dominios en línea gratis. Obtén registrador, fecha de creación, expiración y nameservers. Esencial para investigación.',
    pt: 'Pesquise informações de registro e propriedade de domínios online grátis. Obtenha registrador, data de criação, expiração e nameservers. Essencial para pesquisa.',
    ja: 'ドメイン登録と所有権情報を無料でオンライン検索。レジストラ、作成日、有効期限、ネームサーバーを取得。ドメインリサーチに必須。',
  },
  'websocket-tester': {
    en: 'Test WebSocket connections, send and receive messages online for free. Support custom headers and protocols. Essential for real-time application development.',
    zh: '免费在线测试 WebSocket 连接、发送和接收消息。支持自定义头和协议。实时应用开发必备。',
    es: 'Prueba conexiones WebSocket, envía y recibe mensajes en línea gratis. Soporta headers y protocolos personalizados. Esencial para desarrollo de apps en tiempo real.',
    pt: 'Teste conexões WebSocket, envie e receba mensagens online grátis. Suporta headers e protocolos personalizados. Essencial para desenvolvimento de apps em tempo real.',
    ja: 'WebSocket接続をテストし、メッセージを無料でオンラインで送受信。カスタムヘッダーとプロトコルに対応。リアルタイムアプリ開発に必須。',
  },
  'port-scanner': {
    en: 'Look up common network ports and their services online for free. Search by port number or service name. Essential reference for network administrators and developers.',
    zh: '免费在线查询常见网络端口及其服务。按端口号或服务名称搜索。网络管理员和开发者的必备参考。',
    es: 'Busca puertos de red comunes y sus servicios en línea gratis. Busca por número de puerto o nombre de servicio. Referencia esencial para administradores de red.',
    pt: 'Pesquise portas de rede comuns e seus serviços online grátis. Pesquise por número de porta ou nome de serviço. Referência essencial para administradores de rede.',
    ja: '一般的なネットワークポートとそのサービスを無料でオンライン検索。ポート番号またはサービス名で検索。ネットワーク管理者と開発者の必須リファレンス。',
  },
  'port-reference': {
    en: 'Complete reference guide for common network ports and services. Browse well-known ports (0-1023), registered ports, and dynamic ports. Essential for networking.',
    zh: '常见网络端口和服务的完整参考指南。浏览知名端口 (0-1023)、注册端口和动态端口。网络必备。',
    es: 'Guía de referencia completa para puertos de red comunes y servicios. Explora puertos conocidos (0-1023), registrados y dinámicos. Esencial para redes.',
    pt: 'Guia de referência completo para portas de rede comuns e serviços. Navegue por portas conhecidas (0-1023), registradas e dinâmicas. Essencial para redes.',
    ja: '一般的なネットワークポートとサービスの完全リファレンスガイド。ウェルノウンポート(0-1023)、登録ポート、動的ポートを閲覧。ネットワーキングに必須。',
  },
  'privacy-policy-generator': {
    en: 'Generate a customized privacy policy for your website online for free. Cover data collection, cookies, third-party services, and user rights. GDPR compliant templates.',
    zh: '免费在线为网站生成自定义隐私政策。涵盖数据收集、Cookie、第三方服务和用户权利。GDPR 合规模板。',
    es: 'Genera una política de privacidad personalizada para tu sitio web en línea gratis. Cubre recopilación de datos, cookies, servicios de terceros y derechos de usuarios.',
    pt: 'Gere uma política de privacidade personalizada para seu site online grátis. Cubra coleta de dados, cookies, serviços de terceiros e direitos dos usuários.',
    ja: 'ウェブサイト用のカスタマイズされたプライバシーポリシーを無料でオンライン生成。データ収集、Cookie、サードパーティサービス、ユーザー権利をカバー。GDPR準拠テンプレート。',
  },
  'terms-generator': {
    en: 'Generate customized terms of service for your website online for free. Cover user agreements, liability, intellectual property, and dispute resolution.',
    zh: '免费在线为网站生成自定义服务条款。涵盖用户协议、责任、知识产权和争议解决。',
    es: 'Genera términos de servicio personalizados para tu sitio web en línea gratis. Cubre acuerdos de usuario, responsabilidad, propiedad intelectual y resolución de disputas.',
    pt: 'Gere termos de serviço personalizados para seu site online grátis. Cubra acordos de usuário, responsabilidade, propriedade intelectual e resolução de disputas.',
    ja: 'ウェブサイト用のカスタマイズされた利用規約を無料でオンライン生成。ユーザー契約、責任、知的財産、紛争解決をカバー。',
  },
  'cookie-policy-generator': {
    en: 'Generate a customized cookie policy for your website online for free. Explain cookie types, purposes, and user consent options. GDPR and CCPA compliant templates.',
    zh: '免费在线为网站生成自定义 Cookie 政策。解释 Cookie 类型、用途和用户同意选项。GDPR 和 CCPA 合规模板。',
    es: 'Genera una política de cookies personalizada para tu sitio web en línea gratis. Explica tipos de cookies, propósitos y opciones de consentimiento. Plantillas GDPR y CCPA.',
    pt: 'Gere uma política de cookies personalizada para seu site online grátis. Explique tipos de cookies, propósitos e opções de consentimento. Templates GDPR e CCPA.',
    ja: 'ウェブサイト用のカスタマイズされたCookieポリシーを無料でオンライン生成。Cookieの種類、目的、ユーザー同意オプションを説明。GDPRおよびCCPA準拠テンプレート。',
  },
  'json-to-tsv': {
    en: 'Convert JSON arrays to TSV (Tab-Separated Values) format online for free. Handle nested objects and arrays. Perfect for spreadsheet import and data analysis.',
    zh: '免费在线将 JSON 数组转换为 TSV（制表符分隔值）格式。处理嵌套对象和数组。电子表格导入和数据分析必备。',
    es: 'Convierte arrays JSON a formato TSV (valores separados por tabulaciones) en línea gratis. Maneja objetos y arrays anidados. Perfecto para importación a hojas de cálculo.',
    pt: 'Converta arrays JSON para formato TSV (valores separados por tabulação) online grátis. Lide com objetos e arrays aninhados. Perfeito para importação em planilhas.',
    ja: 'JSON配列をTSV（タブ区切り値）形式に無料でオンライン変換。ネストされたオブジェクトと配列を処理。スプレッドシートインポートとデータ分析に最適。',
  },
  'csv-viewer': {
    en: 'View and parse CSV data in a table format online for free. Support custom delimiters, headers, and large files. Sort, filter, and search your data easily.',
    zh: '免费在线以表格格式查看和解析 CSV 数据。支持自定义分隔符、标题和大文件。轻松排序、过滤和搜索数据。',
    es: 'Ve y parsea datos CSV en formato de tabla en línea gratis. Soporta delimitadores personalizados, encabezados y archivos grandes. Ordena, filtra y busca fácilmente.',
    pt: 'Veja e parse dados CSV em formato de tabela online grátis. Suporta delimitadores personalizados, cabeçalhos e arquivos grandes. Ordene, filtre e pesquise facilmente.',
    ja: 'CSVデータをテーブル形式で無料でオンライン表示・解析。カスタム区切り文字、ヘッダー、大きなファイルに対応。データを簡単にソート、フィルター、検索。',
  },
  'htaccess-generator': {
    en: 'Generate .htaccess configuration for Apache servers online for free. Create redirects, rewrites, security rules, and caching directives. Essential for web hosting.',
    zh: '免费在线为 Apache 服务器生成 .htaccess 配置。创建重定向、重写、安全规则和缓存指令。Web 托管必备。',
    es: 'Genera configuración .htaccess para servidores Apache en línea gratis. Crea redirecciones, rewrites, reglas de seguridad y directivas de caché. Esencial para hosting.',
    pt: 'Gere configuração .htaccess para servidores Apache online grátis. Crie redirecionamentos, rewrites, regras de segurança e diretivas de cache. Essencial para hosting.',
    ja: 'Apacheサーバー用の.htaccess設定を無料でオンライン生成。リダイレクト、リライト、セキュリティルール、キャッシュディレクティブを作成。Webホスティングに必須。',
  },
  'nginx-config-generator': {
    en: 'Generate Nginx server configuration files online for free. Create server blocks, SSL settings, proxy rules, and caching. Essential for modern web deployment.',
    zh: '免费在线生成 Nginx 服务器配置文件。创建服务器块、SSL 设置、代理规则和缓存。现代 Web 部署必备。',
    es: 'Genera archivos de configuración de servidor Nginx en línea gratis. Crea bloques de servidor, configuración SSL, reglas de proxy y caché. Esencial para despliegue web.',
    pt: 'Gere arquivos de configuração de servidor Nginx online grátis. Crie blocos de servidor, configurações SSL, regras de proxy e cache. Essencial para deploy web.',
    ja: 'Nginxサーバー設定ファイルを無料でオンライン生成。サーバーブロック、SSL設定、プロキシルール、キャッシュを作成。モダンWebデプロイメントに必須。',
  },
  'curl-converter': {
    en: 'Convert cURL commands to JavaScript, Python, PHP, Go, and Java code online for free. Parse headers, body, and authentication. Essential for API integration.',
    zh: '免费在线将 cURL 命令转换为 JavaScript、Python、PHP、Go 和 Java 代码。解析头、正文和认证。API 集成必备。',
    es: 'Convierte comandos cURL a código JavaScript, Python, PHP, Go y Java en línea gratis. Parsea headers, body y autenticación. Esencial para integración de APIs.',
    pt: 'Converta comandos cURL para código JavaScript, Python, PHP, Go e Java online grátis. Parse headers, body e autenticação. Essencial para integração de APIs.',
    ja: 'cURLコマンドをJavaScript、Python、PHP、Go、Javaコードに無料でオンライン変換。ヘッダー、ボディ、認証を解析。API統合に必須。',
  },
  'reading-time-calculator': {
    en: 'Calculate reading time and word count for any text online for free. Get estimates for average, slow, and fast readers. Perfect for content creators and bloggers.',
    zh: '免费在线计算任何文本的阅读时间和字数。获取平均、慢速和快速读者的估算。内容创作者和博主必备。',
    es: 'Calcula tiempo de lectura y conteo de palabras para cualquier texto en línea gratis. Obtén estimaciones para lectores promedio, lentos y rápidos. Para creadores de contenido.',
    pt: 'Calcule tempo de leitura e contagem de palavras para qualquer texto online grátis. Obtenha estimativas para leitores médios, lentos e rápidos. Para criadores de conteúdo.',
    ja: '任意のテキストの読書時間と単語数を無料でオンライン計算。平均、遅い、速い読者の見積もりを取得。コンテンツクリエイターとブロガーに最適。',
  },
  'open-graph-generator': {
    en: 'Generate Open Graph meta tags for Facebook, LinkedIn and other social platforms online for free. Preview how your content appears when shared on social media.',
    zh: '免费在线为 Facebook、LinkedIn 等社交平台生成 Open Graph meta 标签。预览内容在社交媒体分享时的显示效果。',
    es: 'Genera meta tags Open Graph para Facebook, LinkedIn y otras plataformas sociales en línea gratis. Previsualiza cómo aparece tu contenido al compartir.',
    pt: 'Gere meta tags Open Graph para Facebook, LinkedIn e outras plataformas sociais online grátis. Visualize como seu conteúdo aparece ao compartilhar.',
    ja: 'Facebook、LinkedInなどのソーシャルプラットフォーム用のOpen Graphメタタグを無料でオンライン生成。ソーシャルメディアで共有時のコンテンツ表示をプレビュー。',
  },
  'twitter-card-generator': {
    en: 'Generate Twitter Card meta tags for rich tweet previews online for free. Support summary, large image, and player cards. Optimize your content for Twitter sharing.',
    zh: '免费在线生成 Twitter Card meta 标签以获得丰富的推文预览。支持摘要、大图和播放器卡片。优化 Twitter 分享内容。',
    es: 'Genera meta tags Twitter Card para previsualizaciones de tweets enriquecidas en línea gratis. Soporta tarjetas de resumen, imagen grande y reproductor.',
    pt: 'Gere meta tags Twitter Card para previews de tweets enriquecidos online grátis. Suporta cartões de resumo, imagem grande e player. Otimize para compartilhamento.',
    ja: 'リッチなツイートプレビュー用のTwitter Cardメタタグを無料でオンライン生成。サマリー、大きな画像、プレイヤーカードに対応。Twitter共有用にコンテンツを最適化。',
  },
  'mime-type-lookup': {
    en: 'Search for MIME types by file extension or description online for free. Complete database of content types for web development. Essential for HTTP headers.',
    zh: '免费在线按文件扩展名或描述搜索 MIME 类型。Web 开发的完整内容类型数据库。HTTP 头必备。',
    es: 'Busca tipos MIME por extensión de archivo o descripción en línea gratis. Base de datos completa de tipos de contenido para desarrollo web. Esencial para headers HTTP.',
    pt: 'Pesquise tipos MIME por extensão de arquivo ou descrição online grátis. Banco de dados completo de tipos de conteúdo para desenvolvimento web. Essencial para headers HTTP.',
    ja: 'ファイル拡張子または説明でMIMEタイプを無料でオンライン検索。Web開発用のコンテンツタイプの完全なデータベース。HTTPヘッダーに必須。',
  },
  'http-status-codes': {
    en: 'Complete reference guide for all HTTP status codes and their meanings. Browse 1xx, 2xx, 3xx, 4xx, and 5xx codes with descriptions and use cases. Developer essential.',
    zh: '所有 HTTP 状态码及其含义的完整参考指南。浏览 1xx、2xx、3xx、4xx 和 5xx 代码的描述和用例。开发者必备。',
    es: 'Guía de referencia completa para todos los códigos de estado HTTP y sus significados. Explora códigos 1xx, 2xx, 3xx, 4xx y 5xx con descripciones y casos de uso.',
    pt: 'Guia de referência completo para todos os códigos de status HTTP e seus significados. Navegue por códigos 1xx, 2xx, 3xx, 4xx e 5xx com descrições e casos de uso.',
    ja: 'すべてのHTTPステータスコードとその意味の完全リファレンスガイド。1xx、2xx、3xx、4xx、5xxコードの説明と使用例を閲覧。開発者必須。',
  },
  'string-obfuscator': {
    en: 'Obfuscate strings using Base64, Hex, HTML Entities, URL encoding, and ROT13 online for free. Multiple encoding layers for enhanced protection. For testing purposes.',
    zh: '免费在线使用 Base64、Hex、HTML 实体、URL 编码和 ROT13 混淆字符串。多层编码增强保护。用于测试目的。',
    es: 'Ofusca cadenas usando Base64, Hex, Entidades HTML, codificación URL y ROT13 en línea gratis. Múltiples capas de codificación para protección mejorada.',
    pt: 'Ofusque strings usando Base64, Hex, Entidades HTML, codificação URL e ROT13 online grátis. Múltiplas camadas de codificação para proteção aprimorada.',
    ja: 'Base64、Hex、HTMLエンティティ、URLエンコーディング、ROT13を使用して文字列を無料でオンライン難読化。保護強化のための複数のエンコーディングレイヤー。',
  },
  'text-cleaner': {
    en: 'Clean and format text by removing extra spaces, empty lines, HTML tags, and more online for free. Normalize whitespace and fix common formatting issues.',
    zh: '免费在线清理和格式化文本，删除多余空格、空行、HTML 标签等。规范化空白并修复常见格式问题。',
    es: 'Limpia y formatea texto eliminando espacios extra, líneas vacías, etiquetas HTML y más en línea gratis. Normaliza espacios en blanco y corrige problemas de formato.',
    pt: 'Limpe e formate texto removendo espaços extras, linhas vazias, tags HTML e mais online grátis. Normalize espaços em branco e corrija problemas de formatação.',
    ja: '余分なスペース、空行、HTMLタグなどを削除してテキストを無料でオンラインでクリーン・フォーマット。空白を正規化し、一般的なフォーマット問題を修正。',
  },
  'list-randomizer': {
    en: 'Shuffle and randomize lists of items or names online for free. Perfect for random selection, lottery draws, and fair ordering. Cryptographically secure randomization.',
    zh: '免费在线打乱和随机化项目或名称列表。适用于随机选择、抽奖和公平排序。加密安全的随机化。',
    es: 'Mezcla y aleatoriza listas de elementos o nombres en línea gratis. Perfecto para selección aleatoria, sorteos y ordenamiento justo. Aleatorización criptográficamente segura.',
    pt: 'Embaralhe e randomize listas de itens ou nomes online grátis. Perfeito para seleção aleatória, sorteios e ordenação justa. Randomização criptograficamente segura.',
    ja: 'アイテムや名前のリストを無料でオンラインでシャッフル・ランダム化。ランダム選択、抽選、公平な順序付けに最適。暗号学的に安全なランダム化。',
  },
  'sql-generator': {
    en: 'Generate SQL queries for SELECT, INSERT, UPDATE, DELETE, and CREATE TABLE operations online for free. Visual query builder with syntax highlighting. For all SQL databases.',
    zh: '免费在线生成 SELECT、INSERT、UPDATE、DELETE 和 CREATE TABLE 操作的 SQL 查询。可视化查询构建器，支持语法高亮。适用于所有 SQL 数据库。',
    es: 'Genera consultas SQL para operaciones SELECT, INSERT, UPDATE, DELETE y CREATE TABLE en línea gratis. Constructor visual de consultas con resaltado de sintaxis.',
    pt: 'Gere consultas SQL para operações SELECT, INSERT, UPDATE, DELETE e CREATE TABLE online grátis. Construtor visual de consultas com destaque de sintaxe.',
    ja: 'SELECT、INSERT、UPDATE、DELETE、CREATE TABLE操作のSQLクエリを無料でオンライン生成。シンタックスハイライト付きのビジュアルクエリビルダー。すべてのSQLデータベース用。',
  },
  'htaccess-to-nginx': {
    en: 'Convert Apache htaccess rules to Nginx config online for free. Transform redirects, rewrites, and security rules. Essential for server migration and deployment.',
    zh: '免费在线将 Apache htaccess 规则转换为 Nginx 配置。转换重定向、重写和安全规则。服务器迁移和部署必备。',
    es: 'Convierte reglas htaccess de Apache a configuración Nginx en línea gratis. Transforma redirecciones, rewrites y reglas de seguridad. Esencial para migración de servidores.',
    pt: 'Converta regras htaccess do Apache para configuração Nginx online grátis. Transforme redirecionamentos, rewrites e regras de segurança. Essencial para migração de servidores.',
    ja: 'Apache htaccessルールをNginx設定に無料でオンライン変換。リダイレクト、リライト、セキュリティルールを変換。サーバー移行とデプロイメントに必須。',
  },
  'js-obfuscator': {
    en: 'Obfuscate and protect JavaScript code online for free. Rename variables, encode strings, and add dead code. Protect your intellectual property from reverse engineering.',
    zh: '免费在线混淆和保护 JavaScript 代码。重命名变量、编码字符串并添加死代码。保护知识产权免受逆向工程。',
    es: 'Ofusca y protege código JavaScript en línea gratis. Renombra variables, codifica cadenas y añade código muerto. Protege tu propiedad intelectual.',
    pt: 'Ofusque e proteja código JavaScript online grátis. Renomeie variáveis, codifique strings e adicione código morto. Proteja sua propriedade intelectual.',
    ja: 'JavaScriptコードを無料でオンラインで難読化・保護。変数名の変更、文字列のエンコード、デッドコードの追加。知的財産をリバースエンジニアリングから保護。',
  },
  'image-watermark': {
    en: 'Add text watermarks to images online for free. Customize font, size, color, opacity, and position. Protect your photos and artwork from unauthorized use.',
    zh: '免费在线为图片添加文字水印。自定义字体、大小、颜色、不透明度和位置。保护照片和艺术作品免受未经授权的使用。',
    es: 'Añade marcas de agua de texto a imágenes en línea gratis. Personaliza fuente, tamaño, color, opacidad y posición. Protege tus fotos y obras de arte.',
    pt: 'Adicione marcas d\'água de texto a imagens online grátis. Personalize fonte, tamanho, cor, opacidade e posição. Proteja suas fotos e obras de arte.',
    ja: '画像にテキスト透かしを無料でオンラインで追加。フォント、サイズ、色、不透明度、位置をカスタマイズ。写真やアートワークを不正使用から保護。',
  },
  'svg-to-image': {
    en: 'Convert SVG to PNG, JPEG, WebP online for free. Set custom dimensions and background color. Perfect for exporting vector graphics for web and print use.',
    zh: '免费在线将 SVG 转换为 PNG、JPEG、WebP。设置自定义尺寸和背景颜色。适用于导出矢量图形用于 Web 和打印。',
    es: 'Convierte SVG a PNG, JPEG, WebP en línea gratis. Establece dimensiones personalizadas y color de fondo. Perfecto para exportar gráficos vectoriales.',
    pt: 'Converta SVG para PNG, JPEG, WebP online grátis. Defina dimensões personalizadas e cor de fundo. Perfeito para exportar gráficos vetoriais.',
    ja: 'SVGをPNG、JPEG、WebPに無料でオンライン変換。カスタムサイズと背景色を設定。Webおよび印刷用のベクターグラフィックスのエクスポートに最適。',
  },
  'hex-base64-converter': {
    en: 'Convert between Hex and Base64 online for free. Encode hexadecimal to Base64 or decode Base64 to hex. Essential for cryptography and data encoding tasks.',
    zh: '免费在线转换 Hex 和 Base64。将十六进制编码为 Base64 或将 Base64 解码为十六进制。加密和数据编码任务必备。',
    es: 'Convierte entre Hex y Base64 en línea gratis. Codifica hexadecimal a Base64 o decodifica Base64 a hex. Esencial para criptografía y codificación de datos.',
    pt: 'Converta entre Hex e Base64 online grátis. Codifique hexadecimal para Base64 ou decodifique Base64 para hex. Essencial para criptografia e codificação de dados.',
    ja: 'HexとBase64を無料でオンライン変換。16進数をBase64にエンコード、またはBase64を16進数にデコード。暗号化とデータエンコーディングタスクに必須。',
  },
  'pdf-to-base64': {
    en: 'Convert PDF files to Base64 encoding online for free. Embed PDFs in HTML, JSON, or data URIs. Secure browser-based conversion with no file upload to servers.',
    zh: '免费在线将 PDF 文件转换为 Base64 编码。在 HTML、JSON 或数据 URI 中嵌入 PDF。安全的浏览器转换，无需上传文件到服务器。',
    es: 'Convierte archivos PDF a codificación Base64 en línea gratis. Incrusta PDFs en HTML, JSON o URIs de datos. Conversión segura en navegador sin subir archivos.',
    pt: 'Converta arquivos PDF para codificação Base64 online grátis. Incorpore PDFs em HTML, JSON ou URIs de dados. Conversão segura no navegador sem upload.',
    ja: 'PDFファイルをBase64エンコーディングに無料でオンライン変換。HTML、JSON、データURIにPDFを埋め込み。サーバーへのファイルアップロードなしの安全なブラウザ変換。',
  },
  'audio-to-base64': {
    en: 'Convert audio files to Base64 encoding online for free. Support MP3, WAV, OGG, and more formats. Embed audio in HTML, JSON, or data URIs. Browser-based processing.',
    zh: '免费在线将音频文件转换为 Base64 编码。支持 MP3、WAV、OGG 等格式。在 HTML、JSON 或数据 URI 中嵌入音频。浏览器处理。',
    es: 'Convierte archivos de audio a codificación Base64 en línea gratis. Soporta MP3, WAV, OGG y más formatos. Incrusta audio en HTML, JSON o URIs de datos.',
    pt: 'Converta arquivos de áudio para codificação Base64 online grátis. Suporta MP3, WAV, OGG e mais formatos. Incorpore áudio em HTML, JSON ou URIs de dados.',
    ja: '音声ファイルをBase64エンコーディングに無料でオンライン変換。MP3、WAV、OGGなどの形式に対応。HTML、JSON、データURIに音声を埋め込み。ブラウザベース処理。',
  },
  'video-to-base64': {
    en: 'Convert video files to Base64 encoding online for free. Support MP4, WebM, and more formats. Embed videos in HTML, JSON, or data URIs. Browser-based processing.',
    zh: '免费在线将视频文件转换为 Base64 编码。支持 MP4、WebM 等格式。在 HTML、JSON 或数据 URI 中嵌入视频。浏览器处理。',
    es: 'Convierte archivos de video a codificación Base64 en línea gratis. Soporta MP4, WebM y más formatos. Incrusta videos en HTML, JSON o URIs de datos.',
    pt: 'Converta arquivos de vídeo para codificação Base64 online grátis. Suporta MP4, WebM e mais formatos. Incorpore vídeos em HTML, JSON ou URIs de dados.',
    ja: '動画ファイルをBase64エンコーディングに無料でオンライン変換。MP4、WebMなどの形式に対応。HTML、JSON、データURIに動画を埋め込み。ブラウザベース処理。',
  },
  'file-size-calculator': {
    en: 'Convert between bytes, KB, MB, GB, TB and more online for free. Calculate file sizes with binary (1024) or decimal (1000) units. Essential for storage planning.',
    zh: '免费在线转换字节、KB、MB、GB、TB 等单位。使用二进制 (1024) 或十进制 (1000) 单位计算文件大小。存储规划必备。',
    es: 'Convierte entre bytes, KB, MB, GB, TB y más en línea gratis. Calcula tamaños de archivo con unidades binarias (1024) o decimales (1000). Esencial para planificación.',
    pt: 'Converta entre bytes, KB, MB, GB, TB e mais online grátis. Calcule tamanhos de arquivo com unidades binárias (1024) ou decimais (1000). Essencial para planejamento.',
    ja: 'バイト、KB、MB、GB、TBなどを無料でオンライン変換。バイナリ(1024)または10進数(1000)単位でファイルサイズを計算。ストレージ計画に必須。',
  },
  'ascii-table': {
    en: 'Complete ASCII table with decimal, hex, octal, and binary values. Browse all 128 ASCII characters with descriptions. Essential reference for programmers and developers.',
    zh: '完整的 ASCII 表，包含十进制、十六进制、八进制和二进制值。浏览所有 128 个 ASCII 字符及其描述。程序员和开发者的必备参考。',
    es: 'Tabla ASCII completa con valores decimales, hex, octales y binarios. Explora los 128 caracteres ASCII con descripciones. Referencia esencial para programadores.',
    pt: 'Tabela ASCII completa com valores decimais, hex, octais e binários. Navegue por todos os 128 caracteres ASCII com descrições. Referência essencial para programadores.',
    ja: '10進数、16進数、8進数、2進数値を含む完全なASCIIテーブル。説明付きの128個すべてのASCII文字を閲覧。プログラマーと開発者の必須リファレンス。',
  },
  'text-to-hex': {
    en: 'Convert text to hexadecimal encoding and decode hex to text online for free. Support UTF-8 and ASCII encoding. Essential for debugging and data analysis.',
    zh: '免费在线将文本转换为十六进制编码，或将十六进制解码为文本。支持 UTF-8 和 ASCII 编码。调试和数据分析必备。',
    es: 'Convierte texto a codificación hexadecimal y decodifica hex a texto en línea gratis. Soporta codificación UTF-8 y ASCII. Esencial para depuración y análisis de datos.',
    pt: 'Converta texto para codificação hexadecimal e decodifique hex para texto online grátis. Suporta codificação UTF-8 e ASCII. Essencial para depuração e análise de dados.',
    ja: 'テキストを16進数エンコーディングに変換、または16進数をテキストに無料でオンラインデコード。UTF-8とASCIIエンコーディングに対応。デバッグとデータ分析に必須。',
  },
  'css-variables-generator': {
    en: 'Generate CSS custom properties with visual color picker and export to CSS, SCSS, or JavaScript. Create design tokens for consistent theming across your projects.',
    zh: '使用可视化颜色选择器生成 CSS 自定义属性，导出为 CSS、SCSS 或 JavaScript。创建设计令牌以实现项目间一致的主题。',
    es: 'Genera propiedades CSS personalizadas con selector de color visual y exporta a CSS, SCSS o JavaScript. Crea tokens de diseño para temas consistentes.',
    pt: 'Gere propriedades CSS personalizadas com seletor de cores visual e exporte para CSS, SCSS ou JavaScript. Crie tokens de design para temas consistentes.',
    ja: 'ビジュアルカラーピッカーでCSSカスタムプロパティを生成し、CSS、SCSS、JavaScriptにエクスポート。プロジェクト間で一貫したテーマのためのデザイントークンを作成。',
  },
  'lorem-picsum': {
    en: 'Generate random placeholder images with custom dimensions, grayscale, and blur effects. Perfect for mockups, wireframes, and web design prototyping. Free and easy to use.',
    zh: '生成自定义尺寸、灰度和模糊效果的随机占位图片。适用于模型、线框图和网页设计原型。免费且易于使用。',
    es: 'Genera imágenes de marcador de posición aleatorias con dimensiones personalizadas, escala de grises y efectos de desenfoque. Perfecto para maquetas y prototipos.',
    pt: 'Gere imagens de placeholder aleatórias com dimensões personalizadas, escala de cinza e efeitos de desfoque. Perfeito para mockups e protótipos.',
    ja: 'カスタムサイズ、グレースケール、ブラー効果付きのランダムプレースホルダー画像を生成。モックアップ、ワイヤーフレーム、Webデザインプロトタイピングに最適。',
  },
  'regex-escape': {
    en: 'Escape special characters for use in regular expressions online for free. Handle metacharacters like . * + ? ^ $ { } [ ] \\ | ( ). Essential for pattern building.',
    zh: '免费在线转义正则表达式中使用的特殊字符。处理元字符如 . * + ? ^ $ { } [ ] \\ | ( )。模式构建必备。',
    es: 'Escapa caracteres especiales para uso en expresiones regulares en línea gratis. Maneja metacaracteres como . * + ? ^ $ { } [ ] \\ | ( ). Esencial para construcción de patrones.',
    pt: 'Escape caracteres especiais para uso em expressões regulares online grátis. Lide com metacaracteres como . * + ? ^ $ { } [ ] \\ | ( ). Essencial para construção de padrões.',
    ja: '正規表現で使用する特殊文字を無料でオンラインでエスケープ。. * + ? ^ $ { } [ ] \\ | ( ) などのメタ文字を処理。パターン構築に必須。',
  },
  'html-to-text': {
    en: 'Convert HTML to plain text, removing all tags and preserving content structure. Handle links, lists, and tables intelligently. Perfect for content extraction and email.',
    zh: '将 HTML 转换为纯文本，删除所有标签并保留内容结构。智能处理链接、列表和表格。内容提取和邮件必备。',
    es: 'Convierte HTML a texto plano, eliminando todas las etiquetas y preservando la estructura del contenido. Maneja enlaces, listas y tablas inteligentemente.',
    pt: 'Converta HTML para texto simples, removendo todas as tags e preservando a estrutura do conteúdo. Lide com links, listas e tabelas de forma inteligente.',
    ja: 'HTMLをプレーンテキストに変換し、すべてのタグを削除してコンテンツ構造を保持。リンク、リスト、テーブルをインテリジェントに処理。コンテンツ抽出とメールに最適。',
  },
  'binary-to-decimal': {
    en: 'Convert binary to decimal, decimal to binary, binary to hex, and hex to binary online for free. Support large numbers and instant conversion. Essential for programmers.',
    zh: '免费在线转换二进制到十进制、十进制到二进制、二进制到十六进制、十六进制到二进制。支持大数字和即时转换。程序员必备。',
    es: 'Convierte binario a decimal, decimal a binario, binario a hex y hex a binario en línea gratis. Soporta números grandes y conversión instantánea. Esencial para programadores.',
    pt: 'Converta binário para decimal, decimal para binário, binário para hex e hex para binário online grátis. Suporta números grandes e conversão instantânea. Essencial para programadores.',
    ja: '2進数から10進数、10進数から2進数、2進数から16進数、16進数から2進数を無料でオンライン変換。大きな数値と即時変換に対応。プログラマーに必須。',
  },
  'octal-converter': {
    en: 'Convert octal to decimal, binary, and hex, and convert from decimal/binary/hex to octal online for free. Support large numbers. Essential for Unix permissions and programming.',
    zh: '免费在线将八进制转换为十进制、二进制和十六进制，以及从十进制/二进制/十六进制转换为八进制。支持大数字。Unix 权限和编程必备。',
    es: 'Convierte octal a decimal, binario y hex, y convierte de decimal/binario/hex a octal en línea gratis. Soporta números grandes. Esencial para permisos Unix y programación.',
    pt: 'Converta octal para decimal, binário e hex, e converta de decimal/binário/hex para octal online grátis. Suporta números grandes. Essencial para permissões Unix e programação.',
    ja: '8進数から10進数、2進数、16進数に変換、および10進数/2進数/16進数から8進数に無料でオンライン変換。大きな数値に対応。Unixパーミッションとプログラミングに必須。',
  },
  'text-to-nato': {
    en: 'Convert letters and numbers to their NATO phonetic alphabet words online for free. Alpha, Bravo, Charlie format for clear communication. Essential for radio and phone.',
    zh: '免费在线将字母和数字转换为 NATO 音标字母单词。Alpha、Bravo、Charlie 格式用于清晰通信。无线电和电话必备。',
    es: 'Convierte letras y números a palabras del alfabeto fonético NATO en línea gratis. Formato Alpha, Bravo, Charlie para comunicación clara. Esencial para radio y teléfono.',
    pt: 'Converta letras e números para palavras do alfabeto fonético NATO online grátis. Formato Alpha, Bravo, Charlie para comunicação clara. Essencial para rádio e telefone.',
    ja: '文字と数字をNATOフォネティックアルファベットの単語に無料でオンライン変換。明確なコミュニケーションのためのAlpha、Bravo、Charlie形式。無線と電話に必須。',
  },
  'crc32-calculator': {
    en: 'Calculate CRC32 checksum for text or uploaded files in your browser. Verify data integrity and detect transmission errors. Secure browser-based processing.',
    zh: '在浏览器中计算文本或上传文件的 CRC32 校验和。验证数据完整性并检测传输错误。安全的浏览器处理。',
    es: 'Calcula checksum CRC32 para texto o archivos subidos en tu navegador. Verifica integridad de datos y detecta errores de transmisión. Procesamiento seguro en navegador.',
    pt: 'Calcule checksum CRC32 para texto ou arquivos enviados no seu navegador. Verifique integridade de dados e detecte erros de transmissão. Processamento seguro no navegador.',
    ja: 'ブラウザでテキストまたはアップロードファイルのCRC32チェックサムを計算。データ整合性を検証し、伝送エラーを検出。安全なブラウザベース処理。',
  },
  'mac-address-generator': {
    en: 'Generate random MAC addresses with prefix, separator, and bit flag options. Support unicast/multicast and universal/local flags. Perfect for testing and development.',
    zh: '生成带有前缀、分隔符和位标志选项的随机 MAC 地址。支持单播/多播和通用/本地标志。测试和开发必备。',
    es: 'Genera direcciones MAC aleatorias con opciones de prefijo, separador y flags de bits. Soporta flags unicast/multicast y universal/local. Perfecto para pruebas.',
    pt: 'Gere endereços MAC aleatórios com opções de prefixo, separador e flags de bits. Suporta flags unicast/multicast e universal/local. Perfeito para testes.',
    ja: 'プレフィックス、セパレータ、ビットフラグオプション付きのランダムMACアドレスを生成。ユニキャスト/マルチキャストとユニバーサル/ローカルフラグに対応。テストと開発に最適。',
  },
  'curl-to-code': {
    en: 'Free online tool to convert cURL commands to JavaScript, Python, PHP, Go, Java, C#, Ruby and Rust code. Parse complex requests with headers, body, and authentication.',
    zh: '免费在线工具，将 cURL 命令转换为 JavaScript、Python、PHP、Go、Java、C#、Ruby 和 Rust 代码。解析带有头、正文和认证的复杂请求。',
    es: 'Herramienta en línea gratis para convertir comandos cURL a código JavaScript, Python, PHP, Go, Java, C#, Ruby y Rust. Parsea solicitudes complejas con headers y body.',
    pt: 'Ferramenta online grátis para converter comandos cURL para código JavaScript, Python, PHP, Go, Java, C#, Ruby e Rust. Parse requisições complexas com headers e body.',
    ja: 'cURLコマンドをJavaScript、Python、PHP、Go、Java、C#、Ruby、Rustコードに変換する無料オンラインツール。ヘッダー、ボディ、認証を含む複雑なリクエストを解析。',
  },
  'ip-validator': {
    en: 'Validate IPv4 and IPv6 addresses online for free. Check if IP is private, loopback, multicast, or reserved. Get detailed information about any IP address format.',
    zh: '免费在线验证 IPv4 和 IPv6 地址。检查 IP 是否为私有、回环、多播或保留地址。获取任何 IP 地址格式的详细信息。',
    es: 'Valida direcciones IPv4 e IPv6 en línea gratis. Verifica si la IP es privada, loopback, multicast o reservada. Obtén información detallada sobre cualquier formato de IP.',
    pt: 'Valide endereços IPv4 e IPv6 online grátis. Verifique se o IP é privado, loopback, multicast ou reservado. Obtenha informações detalhadas sobre qualquer formato de IP.',
    ja: 'IPv4およびIPv6アドレスを無料でオンライン検証。IPがプライベート、ループバック、マルチキャスト、予約済みかどうかをチェック。任意のIPアドレス形式の詳細情報を取得。',
  },
  'json-merger': {
    en: 'Merge JSON objects online with shallow, deep, or concat strategies. Combine multiple JSON files into one. Handle arrays and nested objects intelligently.',
    zh: '使用浅合并、深合并或连接策略在线合并 JSON 对象。将多个 JSON 文件合并为一个。智能处理数组和嵌套对象。',
    es: 'Fusiona objetos JSON en línea con estrategias shallow, deep o concat. Combina múltiples archivos JSON en uno. Maneja arrays y objetos anidados inteligentemente.',
    pt: 'Mescle objetos JSON online com estratégias shallow, deep ou concat. Combine múltiplos arquivos JSON em um. Lide com arrays e objetos aninhados de forma inteligente.',
    ja: 'シャロー、ディープ、またはconcat戦略でJSONオブジェクトをオンラインでマージ。複数のJSONファイルを1つに結合。配列とネストされたオブジェクトをインテリジェントに処理。',
  },
  'text-template': {
    en: 'Simple text template engine. Replace {{ variables }} with values from your data. Support loops, conditionals, and nested objects. Perfect for generating dynamic content.',
    zh: '简单的文本模板引擎。用数据中的值替换 {{ 变量 }}。支持循环、条件和嵌套对象。生成动态内容必备。',
    es: 'Motor de plantillas de texto simple. Reemplaza {{ variables }} con valores de tus datos. Soporta bucles, condicionales y objetos anidados. Perfecto para contenido dinámico.',
    pt: 'Motor de templates de texto simples. Substitua {{ variáveis }} por valores dos seus dados. Suporta loops, condicionais e objetos aninhados. Perfeito para conteúdo dinâmico.',
    ja: 'シンプルなテキストテンプレートエンジン。{{ 変数 }} をデータの値で置換。ループ、条件、ネストされたオブジェクトに対応。動的コンテンツ生成に最適。',
  },
  'base-calculator': {
    en: 'Calculate in binary, octal, decimal, and hexadecimal. Supports arithmetic and bitwise operations like AND, OR, XOR, NOT, shift. Essential for low-level programming.',
    zh: '在二进制、八进制、十进制和十六进制中计算。支持算术和位运算如 AND、OR、XOR、NOT、移位。底层编程必备。',
    es: 'Calcula en binario, octal, decimal y hexadecimal. Soporta operaciones aritméticas y de bits como AND, OR, XOR, NOT, shift. Esencial para programación de bajo nivel.',
    pt: 'Calcule em binário, octal, decimal e hexadecimal. Suporta operações aritméticas e de bits como AND, OR, XOR, NOT, shift. Essencial para programação de baixo nível.',
    ja: '2進数、8進数、10進数、16進数で計算。AND、OR、XOR、NOT、シフトなどの算術演算とビット演算に対応。低レベルプログラミングに必須。',
  },
  'color-name-finder': {
    en: 'Find the closest named color for any hex color value. Browse CSS color names, X11 colors, and web-safe colors. Perfect for designers and accessibility compliance.',
    zh: '为任何十六进制颜色值查找最接近的命名颜色。浏览 CSS 颜色名称、X11 颜色和网页安全颜色。设计师和无障碍合规必备。',
    es: 'Encuentra el color con nombre más cercano para cualquier valor hex. Explora nombres de colores CSS, X11 y colores web-safe. Perfecto para diseñadores y accesibilidad.',
    pt: 'Encontre a cor nomeada mais próxima para qualquer valor hex. Navegue por nomes de cores CSS, X11 e cores web-safe. Perfeito para designers e acessibilidade.',
    ja: '任意の16進数カラー値に最も近い名前付きカラーを検索。CSSカラー名、X11カラー、Webセーフカラーを閲覧。デザイナーとアクセシビリティ準拠に最適。',
  },
  'char-frequency': {
    en: 'Analyze character frequency and distribution in text. Get counts, percentages, and visual charts for each character. Essential for cryptography and text analysis.',
    zh: '分析文本中的字符频率和分布。获取每个字符的计数、百分比和可视化图表。加密和文本分析必备。',
    es: 'Analiza frecuencia y distribución de caracteres en texto. Obtén conteos, porcentajes y gráficos visuales para cada carácter. Esencial para criptografía y análisis de texto.',
    pt: 'Analise frequência e distribuição de caracteres em texto. Obtenha contagens, porcentagens e gráficos visuais para cada caractere. Essencial para criptografia e análise de texto.',
    ja: 'テキスト内の文字頻度と分布を分析。各文字のカウント、パーセンテージ、ビジュアルチャートを取得。暗号化とテキスト分析に必須。',
  },
  'json-to-dart': {
    en: 'Convert JSON to Dart class code with factory constructors and serialization methods. Support null safety and nested classes. Essential for Flutter app development.',
    zh: '将 JSON 转换为带有工厂构造函数和序列化方法的 Dart 类代码。支持空安全和嵌套类。Flutter 应用开发必备。',
    es: 'Convierte JSON a código de clase Dart con constructores factory y métodos de serialización. Soporta null safety y clases anidadas. Esencial para desarrollo Flutter.',
    pt: 'Converta JSON para código de classe Dart com construtores factory e métodos de serialização. Suporta null safety e classes aninhadas. Essencial para desenvolvimento Flutter.',
    ja: 'JSONをファクトリコンストラクタとシリアライゼーションメソッド付きのDartクラスコードに変換。null安全とネストされたクラスに対応。Flutterアプリ開発に必須。',
  },
  'sql-to-json': {
    en: 'Convert SQL INSERT statements to JSON array format. Parse multiple INSERT statements and extract data. Perfect for database migration and data export tasks.',
    zh: '将 SQL INSERT 语句转换为 JSON 数组格式。解析多个 INSERT 语句并提取数据。数据库迁移和数据导出任务必备。',
    es: 'Convierte sentencias SQL INSERT a formato de array JSON. Parsea múltiples sentencias INSERT y extrae datos. Perfecto para migración de bases de datos y exportación.',
    pt: 'Converta instruções SQL INSERT para formato de array JSON. Parse múltiplas instruções INSERT e extraia dados. Perfeito para migração de banco de dados e exportação.',
    ja: 'SQL INSERT文をJSON配列形式に変換。複数のINSERT文を解析してデータを抽出。データベース移行とデータエクスポートタスクに最適。',
  },
};

// 读取并更新消息文件
function updateMessagesFile(locale: string): void {
  const messagesPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
  
  let updatedCount = 0;
  
  // 更新 tools 对象中的 seo_description
  if (messages.tools) {
    for (const [slug, descriptions] of Object.entries(BATCH2_DESCRIPTIONS)) {
      if (messages.tools[slug] && descriptions[locale]) {
        const oldDesc = messages.tools[slug].seo_description;
        const newDesc = descriptions[locale];
        
        if (oldDesc !== newDesc) {
          messages.tools[slug].seo_description = newDesc;
          updatedCount++;
          console.log(`  ✓ ${slug}: ${oldDesc?.length || 0} → ${newDesc.length} 字符`);
        }
      }
    }
  }
  
  // 同时更新 tool 对象（如果存在）
  if (messages.tool) {
    for (const [slug, descriptions] of Object.entries(BATCH2_DESCRIPTIONS)) {
      if (messages.tool[slug] && descriptions[locale]) {
        messages.tool[slug].seo_description = descriptions[locale];
      }
    }
  }
  
  // 保存更新后的文件
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2) + '\n', 'utf-8');
  console.log(`  共更新 ${updatedCount} 个工具的 seo_description\n`);
}

// 主函数
function main(): void {
  console.log('='.repeat(60));
  console.log('SEO Description 批量更新 - 第二批');
  console.log('='.repeat(60));
  console.log(`\n目标：将剩余工具的 seo_description 优化为 120-160 字符\n`);
  
  const locales = ['en', 'zh', 'es', 'pt', 'ja'];
  
  for (const locale of locales) {
    console.log(`📝 更新 ${locale}.json:`);
    updateMessagesFile(locale);
  }
  
  console.log('='.repeat(60));
  console.log('✅ 更新完成！请运行 audit-seo-metadata.ts 验证结果');
  console.log('='.repeat(60));
}

main();
