/**
 * SEO Description 批量更新脚本
 * 将所有工具的 seo_description 更新为 120-160 字符的优化版本
 * 
 * 使用方法：npx ts-node scripts/update-seo-descriptions.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 优化后的 SEO Description（严格控制在 120-160 字符）
// 格式：工具名 + 核心功能 + 使用场景 + CTA
const OPTIMIZED_DESCRIPTIONS: Record<string, Record<string, string>> = {
  // Top 10 热门工具 - 英文严格控制在 120-160 字符
  'json-formatter': {
    en: 'Format, beautify, and validate JSON data online for free. Syntax highlighting, error detection, and easy copy. Perfect for developers.',
    zh: '免费在线格式化、美化和验证 JSON 数据。支持语法高亮、错误检测、自动格式化和一键复制。开发者和 API 测试的完美工具。',
    es: 'Formatea, embellece y valida datos JSON en línea gratis. Resaltado de sintaxis, detección de errores y copia fácil. Perfecto para desarrolladores.',
    pt: 'Formate, embeleze e valide dados JSON online grátis. Destaque de sintaxe, detecção de erros e cópia fácil. Perfeito para desenvolvedores.',
    ja: 'JSONデータを無料でオンラインでフォーマット、整形、検証。シンタックスハイライト、エラー検出、簡単コピー機能付き。開発者に最適。',
  },
  'base64': {
    en: 'Encode text to Base64 or decode Base64 strings instantly online for free. Secure browser-based tool with no data upload. Perfect for developers.',
    zh: '免费在线即时编码文本为 Base64 或解码 Base64 字符串。安全的浏览器工具，无需上传数据。适用于开发者和数据编码任务。',
    es: 'Codifica texto a Base64 o decodifica cadenas Base64 al instante en línea gratis. Herramienta segura sin carga de datos. Perfecto para desarrolladores.',
    pt: 'Codifique texto para Base64 ou decodifique strings Base64 instantaneamente online grátis. Ferramenta segura sem upload. Perfeito para desenvolvedores.',
    ja: 'テキストをBase64にエンコード、またはBase64文字列を無料でオンラインで即座にデコード。データアップロード不要の安全なブラウザツール。',
  },
  'uuid-generator': {
    en: 'Generate random UUID v4 strings online for free. Supports bulk generation of multiple UUIDs at once. Secure, fast, and works in your browser.',
    zh: '免费在线生成随机 UUID v4 字符串。支持批量生成多个 UUID。安全、快速，完全在浏览器中运行。适用于开发者和数据库 ID 生成。',
    es: 'Genera cadenas UUID v4 aleatorias en línea gratis. Soporta generación masiva de múltiples UUIDs. Seguro, rápido y funciona en tu navegador.',
    pt: 'Gere strings UUID v4 aleatórias online grátis. Suporta geração em massa de múltiplos UUIDs. Seguro, rápido e funciona no navegador.',
    ja: 'ランダムなUUID v4文字列を無料でオンライン生成。複数UUIDの一括生成に対応。安全で高速、ブラウザ内で完結。開発者に最適。',
  },
  'url-encoder': {
    en: 'Encode and decode URLs and query strings online for free. Handle special characters safely for web development. Fast and secure browser tool.',
    zh: '免费在线编码和解码 URL 及查询字符串。安全处理特殊字符，适用于 Web 开发。快速、安全的浏览器工具。API 和 Web 开发者必备。',
    es: 'Codifica y decodifica URLs y cadenas de consulta en línea gratis. Maneja caracteres especiales de forma segura. Herramienta rápida y segura.',
    pt: 'Codifique e decodifique URLs e strings de consulta online grátis. Lide com caracteres especiais com segurança. Ferramenta rápida e segura.',
    ja: 'URLとクエリ文字列を無料でオンラインでエンコード・デコード。Web開発のための特殊文字の安全な処理。高速で安全なブラウザツール。',
  },
  'password-generator': {
    en: 'Generate secure random passwords online for free. Customize length, include uppercase, lowercase, numbers, and symbols. No data stored or uploaded.',
    zh: '免费在线生成安全随机密码。自定义长度，包含大小写字母、数字和符号。为账户和安全创建强密码。不存储或上传任何数据。',
    es: 'Genera contraseñas aleatorias seguras en línea gratis. Personaliza longitud, incluye mayúsculas, minúsculas, números y símbolos. Sin almacenamiento.',
    pt: 'Gere senhas aleatórias seguras online grátis. Personalize comprimento, inclua maiúsculas, minúsculas, números e símbolos. Sem armazenamento.',
    ja: '安全なランダムパスワードを無料でオンライン生成。長さをカスタマイズし、大文字、小文字、数字、記号を含める。データの保存やアップロードなし。',
  },
  'hash-generator': {
    en: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes online for free. Secure browser-based hashing with no data upload. Perfect for file integrity checks.',
    zh: '免费在线生成 MD5、SHA-1、SHA-256、SHA-512 哈希值。安全的浏览器哈希工具，无需上传数据。适用于文件完整性验证和安全应用。',
    es: 'Genera hashes MD5, SHA-1, SHA-256, SHA-512 en línea gratis. Hashing seguro sin carga de datos. Perfecto para verificación de integridad de archivos.',
    pt: 'Gere hashes MD5, SHA-1, SHA-256, SHA-512 online grátis. Hashing seguro sem upload de dados. Perfeito para verificação de integridade de arquivos.',
    ja: 'MD5、SHA-1、SHA-256、SHA-512ハッシュを無料でオンライン生成。データアップロード不要の安全なブラウザツール。ファイル整合性検証に最適。',
  },
  'qr-generator': {
    en: 'Generate QR codes from text, URLs, or data online for free. Download as high-quality PNG image. Customize size and error correction level.',
    zh: '免费在线从文本、URL 或数据生成二维码。下载高质量 PNG 图片。自定义大小和纠错级别。适用于营销、分享链接和名片制作。',
    es: 'Genera códigos QR desde texto, URLs o datos en línea gratis. Descarga como imagen PNG de alta calidad. Personaliza tamaño y corrección de errores.',
    pt: 'Gere códigos QR a partir de texto, URLs ou dados online grátis. Baixe como imagem PNG de alta qualidade. Personalize tamanho e correção de erros.',
    ja: 'テキスト、URL、データから無料でオンラインでQRコードを生成。高品質PNG画像としてダウンロード。サイズとエラー訂正レベルをカスタマイズ。',
  },
  'color-converter': {
    en: 'Convert colors between HEX, RGB, HSL, and HSV formats online for free. Instant color format conversion with live preview. Essential for designers.',
    zh: '免费在线转换 HEX、RGB、HSL、HSV 颜色格式。即时颜色格式转换，实时预览。Web 设计师、开发者和数字艺术家的必备工具。',
    es: 'Convierte colores entre formatos HEX, RGB, HSL y HSV en línea gratis. Conversión instantánea con vista previa en vivo. Esencial para diseñadores.',
    pt: 'Converta cores entre formatos HEX, RGB, HSL e HSV online grátis. Conversão instantânea com visualização ao vivo. Essencial para designers.',
    ja: 'HEX、RGB、HSL、HSV形式間で無料でオンラインで色を変換。ライブプレビュー付きの即時カラーフォーマット変換。デザイナーに必須。',
  },
  'timestamp-converter': {
    en: 'Convert Unix timestamps to human-readable dates and dates to timestamps online for free. Support multiple date formats and timezones. For developers.',
    zh: '免费在线将 Unix 时间戳转换为可读日期，或将日期转换为时间戳。支持多种日期格式和时区。开发者处理 API 和数据库的必备工具。',
    es: 'Convierte timestamps Unix a fechas legibles y fechas a timestamps en línea gratis. Soporta múltiples formatos de fecha y zonas horarias.',
    pt: 'Converta timestamps Unix para datas legíveis e datas para timestamps online grátis. Suporta múltiplos formatos de data e fusos horários.',
    ja: 'Unixタイムスタンプを人間が読める日付に、日付をタイムスタンプに無料でオンライン変換。複数の日付形式とタイムゾーンに対応。',
  },
  'jwt-decoder': {
    en: 'Decode and inspect JWT (JSON Web Tokens) online for free. View header, payload, and signature without verification. Essential for debugging auth.',
    zh: '免费在线解码和检查 JWT（JSON Web Token）。查看头部、载荷和签名，无需验证。调试 Web 应用程序身份验证和 API 安全的必备工具。',
    es: 'Decodifica e inspecciona JWT (JSON Web Tokens) en línea gratis. Ve encabezado, payload y firma sin verificación. Esencial para depurar autenticación.',
    pt: 'Decodifique e inspecione JWT (JSON Web Tokens) online grátis. Veja cabeçalho, payload e assinatura sem verificação. Essencial para depurar auth.',
    ja: 'JWT（JSON Web Token）を無料でオンラインでデコード・検査。検証なしでヘッダー、ペイロード、署名を表示。認証デバッグに必須。',
  },
  // 第二批工具优化
  'word-counter': {
    en: 'Count words, characters, sentences, and paragraphs online for free. Get reading time estimates and detailed text statistics. Perfect for writers and editors.',
    zh: '免费在线统计字数、字符数、句子数和段落数。获取阅读时间估算和详细文本统计。作家和编辑的完美工具。',
    es: 'Cuenta palabras, caracteres, oraciones y párrafos en línea gratis. Obtén estimaciones de tiempo de lectura y estadísticas detalladas. Perfecto para escritores.',
    pt: 'Conte palavras, caracteres, frases e parágrafos online grátis. Obtenha estimativas de tempo de leitura e estatísticas detalhadas. Perfeito para escritores.',
    ja: '単語数、文字数、文数、段落数を無料でオンラインでカウント。読書時間の見積もりと詳細なテキスト統計を取得。ライターや編集者に最適。',
  },
  'case-converter': {
    en: 'Convert text case online for free. Transform to uppercase, lowercase, title case, sentence case, camelCase, and snake_case. For developers and writers.',
    zh: '免费在线转换文本大小写。转换为大写、小写、标题格式、句子格式、驼峰命名和下划线命名。开发者和作家的必备工具。',
    es: 'Convierte mayúsculas y minúsculas en línea gratis. Transforma a mayúsculas, minúsculas, título, oración, camelCase y snake_case. Esencial para desarrolladores.',
    pt: 'Converta maiúsculas e minúsculas online grátis. Transforme para maiúsculas, minúsculas, título, frase, camelCase e snake_case. Essencial para desenvolvedores.',
    ja: 'テキストの大文字小文字を無料でオンライン変換。大文字、小文字、タイトルケース、センテンスケース、キャメルケース、スネークケースに変換。',
  },
  'html-encoder': {
    en: 'Encode and decode HTML entities online for free. Handle special characters safely for web development. Prevent XSS attacks and display HTML correctly.',
    zh: '免费在线编码和解码 HTML 实体。安全处理特殊字符用于 Web 开发。防止 XSS 攻击并正确显示 HTML。',
    es: 'Codifica y decodifica entidades HTML en línea gratis. Maneja caracteres especiales de forma segura para desarrollo web. Previene ataques XSS.',
    pt: 'Codifique e decodifique entidades HTML online grátis. Lide com caracteres especiais com segurança para desenvolvimento web. Previna ataques XSS.',
    ja: 'HTMLエンティティを無料でオンラインでエンコード・デコード。Web開発のための特殊文字の安全な処理。XSS攻撃を防ぎ、HTMLを正しく表示。',
  },
  'markdown-preview': {
    en: 'Write and preview Markdown online for free. Live preview with syntax highlighting and HTML export. Perfect for documentation, README files, and blog posts.',
    zh: '免费在线编写和预览 Markdown。实时预览，支持语法高亮和 HTML 导出。适用于文档、README 文件和博客文章。',
    es: 'Escribe y previsualiza Markdown en línea gratis. Vista previa en vivo con resaltado de sintaxis y exportación HTML. Perfecto para documentación y blogs.',
    pt: 'Escreva e visualize Markdown online grátis. Visualização ao vivo com destaque de sintaxe e exportação HTML. Perfeito para documentação e blogs.',
    ja: 'Markdownを無料でオンラインで書いてプレビュー。シンタックスハイライト付きのライブプレビューとHTML出力。ドキュメントやブログに最適。',
  },
  'lorem-ipsum': {
    en: 'Generate Lorem Ipsum placeholder text online for free. Create paragraphs, sentences, or words for mockups and designs. Perfect for web designers and developers.',
    zh: '免费在线生成 Lorem Ipsum 占位文本。为模型和设计创建段落、句子或单词。Web 设计师和开发者的必备工具。',
    es: 'Genera texto Lorem Ipsum en línea gratis. Crea párrafos, oraciones o palabras para maquetas y diseños. Esencial para diseñadores web y desarrolladores.',
    pt: 'Gere texto Lorem Ipsum online grátis. Crie parágrafos, frases ou palavras para mockups e designs. Essencial para designers web e desenvolvedores.',
    ja: 'Lorem Ipsumプレースホルダーテキストを無料でオンライン生成。モックアップやデザイン用の段落、文、単語を作成。Webデザイナーに必須。',
  },
  'regex-tester': {
    en: 'Test and debug regular expressions online for free. Real-time matching with syntax highlighting and match groups. Perfect for developers and data processing.',
    zh: '免费在线测试和调试正则表达式。实时匹配，支持语法高亮和匹配组。开发者和数据处理的必备工具。',
    es: 'Prueba y depura expresiones regulares en línea gratis. Coincidencia en tiempo real con resaltado de sintaxis y grupos. Esencial para desarrolladores.',
    pt: 'Teste e depure expressões regulares online grátis. Correspondência em tempo real com destaque de sintaxe e grupos. Essencial para desenvolvedores.',
    ja: '正規表現を無料でオンラインでテスト・デバッグ。シンタックスハイライトとマッチグループ付きのリアルタイムマッチング。開発者に必須。',
  },
  'diff-checker': {
    en: 'Compare two texts online for free. Highlight added, removed, and changed content with side-by-side view. Essential for code review and document comparison.',
    zh: '免费在线比较两段文本。高亮显示添加、删除和更改的内容，支持并排视图。代码审查和文档比较的必备工具。',
    es: 'Compara dos textos en línea gratis. Resalta contenido añadido, eliminado y cambiado con vista lado a lado. Esencial para revisión de código.',
    pt: 'Compare dois textos online grátis. Destaque conteúdo adicionado, removido e alterado com visualização lado a lado. Essencial para revisão de código.',
    ja: '2つのテキストを無料でオンライン比較。追加、削除、変更されたコンテンツを並べて表示でハイライト。コードレビューに必須。',
  },
  'json-to-csv': {
    en: 'Convert JSON to CSV or CSV to JSON online for free. Handle nested objects and arrays with customizable delimiters. Perfect for data export and spreadsheet work.',
    zh: '免费在线将 JSON 转换为 CSV 或 CSV 转换为 JSON。处理嵌套对象和数组，支持自定义分隔符。适用于数据导出和电子表格工作。',
    es: 'Convierte JSON a CSV o CSV a JSON en línea gratis. Maneja objetos anidados y arrays con delimitadores personalizables. Perfecto para exportación de datos.',
    pt: 'Converta JSON para CSV ou CSV para JSON online grátis. Lide com objetos aninhados e arrays com delimitadores personalizáveis. Perfeito para exportação.',
    ja: 'JSONをCSVに、またはCSVをJSONに無料でオンライン変換。ネストされたオブジェクトと配列を処理。データエクスポートに最適。',
  },
  'image-to-base64': {
    en: 'Convert images to Base64 encoded strings online for free. Support PNG, JPG, GIF, and SVG formats. Perfect for embedding images in CSS, HTML, and JSON data.',
    zh: '免费在线将图片转换为 Base64 编码字符串。支持 PNG、JPG、GIF 和 SVG 格式。适用于在 CSS、HTML 和 JSON 中嵌入图片。',
    es: 'Convierte imágenes a cadenas Base64 en línea gratis. Soporta formatos PNG, JPG, GIF y SVG. Perfecto para incrustar imágenes en CSS, HTML y JSON.',
    pt: 'Converta imagens para strings Base64 online grátis. Suporta formatos PNG, JPG, GIF e SVG. Perfeito para incorporar imagens em CSS, HTML e JSON.',
    ja: '画像をBase64エンコード文字列に無料でオンライン変換。PNG、JPG、GIF、SVG形式に対応。CSS、HTML、JSONへの画像埋め込みに最適。',
  },
  'cron-generator': {
    en: 'Generate and parse cron expressions online for free. Visual editor with presets and human-readable descriptions. Perfect for scheduling tasks and automation.',
    zh: '免费在线生成和解析 cron 表达式。可视化编辑器，包含常用预设和人类可读描述。任务调度和自动化的必备工具。',
    es: 'Genera y analiza expresiones cron en línea gratis. Editor visual con presets comunes y descripciones legibles. Esencial para programación de tareas.',
    pt: 'Gere e analise expressões cron online grátis. Editor visual com presets comuns e descrições legíveis. Essencial para agendamento de tarefas.',
    ja: 'cron式を無料でオンラインで生成・解析。一般的なプリセットと人間が読める説明付きのビジュアルエディタ。タスクスケジューリングに必須。',
  },
  'text-to-slug': {
    en: 'Convert text to URL-friendly slug format online for free. Remove special characters, handle unicode, and create SEO-friendly URLs. Perfect for web development.',
    zh: '免费在线将文本转换为 URL 友好的 slug 格式。删除特殊字符，处理 unicode，创建 SEO 友好的 URL。Web 开发必备工具。',
    es: 'Convierte texto a formato slug amigable para URL en línea gratis. Elimina caracteres especiales, maneja unicode y crea URLs SEO-friendly.',
    pt: 'Converta texto para formato slug amigável para URL online grátis. Remova caracteres especiais, lide com unicode e crie URLs SEO-friendly.',
    ja: 'テキストをURL対応のslug形式に無料でオンライン変換。特殊文字を削除し、unicodeを処理し、SEOフレンドリーなURLを作成。',
  },
  'number-base-converter': {
    en: 'Convert between binary, octal, decimal, and hexadecimal online for free. Support large numbers and instant conversion. Essential for programmers and students.',
    zh: '免费在线转换二进制、八进制、十进制和十六进制。支持大数字和即时转换。程序员和学生的必备工具。',
    es: 'Convierte entre binario, octal, decimal y hexadecimal en línea gratis. Soporta números grandes y conversión instantánea. Esencial para programadores.',
    pt: 'Converta entre binário, octal, decimal e hexadecimal online grátis. Suporta números grandes e conversão instantânea. Essencial para programadores.',
    ja: '2進数、8進数、10進数、16進数を無料でオンライン変換。大きな数値と即時変換に対応。プログラマーや学生に必須。',
  },
  'json-path-tester': {
    en: 'Test and debug JSONPath expressions online for free. Query JSON data with real-time results and syntax highlighting. Essential for API development.',
    zh: '免费在线测试和调试 JSONPath 表达式。实时结果和语法高亮查询 JSON 数据。API 开发和数据提取的必备工具。',
    es: 'Prueba y depura expresiones JSONPath en línea gratis. Consulta datos JSON con resultados en tiempo real y resaltado de sintaxis. Esencial para APIs.',
    pt: 'Teste e depure expressões JSONPath online grátis. Consulte dados JSON com resultados em tempo real e destaque de sintaxe. Essencial para APIs.',
    ja: 'JSONPath式を無料でオンラインでテスト・デバッグ。リアルタイム結果とシンタックスハイライト付きでJSONデータをクエリ。API開発に必須。',
  },
  'xml-formatter': {
    en: 'Format, beautify and minify XML data online for free. Syntax highlighting, error detection, and tree view. Perfect for API development and configuration files.',
    zh: '免费在线格式化、美化和压缩 XML 数据。语法高亮、错误检测和树形视图。API 开发和配置文件的必备工具。',
    es: 'Formatea, embellece y minifica datos XML en línea gratis. Resaltado de sintaxis, detección de errores y vista de árbol. Esencial para desarrollo de APIs.',
    pt: 'Formate, embeleze e minifique dados XML online grátis. Destaque de sintaxe, detecção de erros e visualização em árvore. Essencial para APIs.',
    ja: 'XMLデータを無料でオンラインでフォーマット、整形、圧縮。シンタックスハイライト、エラー検出、ツリービュー。API開発に必須。',
  },
  'chinese-converter': {
    en: 'Convert between Simplified and Traditional Chinese online for free. Accurate character conversion with phrase support. Perfect for Chinese content localization.',
    zh: '免费在线转换简体中文和繁体中文。准确的字符转换，支持词组。中文内容本地化的必备工具。',
    es: 'Convierte entre chino simplificado y tradicional en línea gratis. Conversión precisa de caracteres con soporte de frases. Esencial para localización.',
    pt: 'Converta entre chinês simplificado e tradicional online grátis. Conversão precisa de caracteres com suporte a frases. Essencial para localização.',
    ja: '簡体字中国語と繁体字中国語を無料でオンライン変換。フレーズサポート付きの正確な文字変換。中国語コンテンツのローカライズに必須。',
  },
  'unit-converter': {
    en: 'Convert various units online for free: length, weight, temperature, area, volume, speed, and data. Quick reference tables and instant conversion.',
    zh: '免费在线转换各种单位：长度、重量、温度、面积、体积、速度和数据。快速参考表和所有测量的即时转换。',
    es: 'Convierte varias unidades en línea gratis: longitud, peso, temperatura, área, volumen, velocidad y datos. Tablas de referencia y conversión instantánea.',
    pt: 'Converta várias unidades online grátis: comprimento, peso, temperatura, área, volume, velocidade e dados. Tabelas de referência e conversão instantânea.',
    ja: '各種単位を無料でオンライン変換：長さ、重さ、温度、面積、体積、速度、データ。クイックリファレンス表と即時変換。',
  },
  'gradient-generator': {
    en: 'Create CSS gradients online for free. Generate linear and radial gradients with CSS and Tailwind code. Visual editor with color picker and preset templates.',
    zh: '免费在线创建 CSS 渐变。生成线性和径向渐变，输出 CSS 和 Tailwind 代码。可视化编辑器，支持颜色选择器和预设模板。',
    es: 'Crea gradientes CSS en línea gratis. Genera gradientes lineales y radiales con código CSS y Tailwind. Editor visual con selector de color y plantillas.',
    pt: 'Crie gradientes CSS online grátis. Gere gradientes lineares e radiais com código CSS e Tailwind. Editor visual com seletor de cores e templates.',
    ja: 'CSSグラデーションを無料でオンライン作成。CSSとTailwindコード付きの線形・放射状グラデーションを生成。カラーピッカー付きビジュアルエディタ。',
  },
  'unicode-converter': {
    en: 'Convert text and Unicode encoding online for free. Support HTML entities, CSS escape sequences, and various Unicode formats. Essential for internationalization.',
    zh: '免费在线转换文本和 Unicode 编码。支持 HTML 实体、CSS 转义序列和各种 Unicode 格式。国际化的必备工具。',
    es: 'Convierte texto y codificación Unicode en línea gratis. Soporta entidades HTML, secuencias de escape CSS y varios formatos Unicode. Esencial para i18n.',
    pt: 'Converta texto e codificação Unicode online grátis. Suporta entidades HTML, sequências de escape CSS e vários formatos Unicode. Essencial para i18n.',
    ja: 'テキストとUnicodeエンコーディングを無料でオンライン変換。HTMLエンティティ、CSSエスケープシーケンス、各種Unicode形式に対応。',
  },
  'code-minifier': {
    en: 'Minify HTML, CSS, and JavaScript code online for free. Reduce file size and improve page load speed. Essential for web performance optimization and deployment.',
    zh: '免费在线压缩 HTML、CSS 和 JavaScript 代码。减小文件大小，提高页面加载速度。Web 性能优化和部署的必备工具。',
    es: 'Minifica código HTML, CSS y JavaScript en línea gratis. Reduce el tamaño de archivos y mejora la velocidad de carga. Esencial para optimización web.',
    pt: 'Minifique código HTML, CSS e JavaScript online grátis. Reduza o tamanho dos arquivos e melhore a velocidade de carregamento. Essencial para otimização.',
    ja: 'HTML、CSS、JavaScriptコードを無料でオンライン圧縮。ファイルサイズを削減し、ページ読み込み速度を向上。Webパフォーマンス最適化に必須。',
  },
  'sql-formatter': {
    en: 'Format and beautify SQL queries online for free. Support multiple SQL dialects with syntax highlighting and indentation. Essential for database development.',
    zh: '免费在线格式化和美化 SQL 查询。支持多种 SQL 方言，语法高亮和缩进。数据库开发和调试的必备工具。',
    es: 'Formatea y embellece consultas SQL en línea gratis. Soporta múltiples dialectos SQL con resaltado de sintaxis e indentación. Esencial para bases de datos.',
    pt: 'Formate e embeleze consultas SQL online grátis. Suporta múltiplos dialetos SQL com destaque de sintaxe e indentação. Essencial para bancos de dados.',
    ja: 'SQLクエリを無料でオンラインでフォーマット・整形。シンタックスハイライトとインデント付きで複数のSQL方言に対応。データベース開発に必須。',
  },
  'pinyin-converter': {
    en: 'Convert Chinese characters to Pinyin online for free. Support tone marks and numbered tones. Essential for Chinese language learning and pronunciation guides.',
    zh: '免费在线将中文字符转换为拼音。支持声调标记和数字声调。中文学习和发音指南的必备工具。',
    es: 'Convierte caracteres chinos a Pinyin en línea gratis. Soporta marcas de tono y tonos numerados. Esencial para aprender chino y guías de pronunciación.',
    pt: 'Converta caracteres chineses para Pinyin online grátis. Suporta marcas de tom e tons numerados. Essencial para aprender chinês e guias de pronúncia.',
    ja: '中国語文字をピンインに無料でオンライン変換。声調記号と数字声調に対応。中国語学習と発音ガイドに必須。',
  },
  'toml-json': {
    en: 'Convert TOML to JSON or JSON to TOML online for free. Validate and format configuration files with syntax highlighting. Essential for Rust and Python projects.',
    zh: '免费在线将 TOML 转换为 JSON 或 JSON 转换为 TOML。验证和格式化配置文件，支持语法高亮。Rust 和 Python 项目必备。',
    es: 'Convierte TOML a JSON o JSON a TOML en línea gratis. Valida y formatea archivos de configuración con resaltado de sintaxis. Esencial para Rust y Python.',
    pt: 'Converta TOML para JSON ou JSON para TOML online grátis. Valide e formate arquivos de configuração com destaque de sintaxe. Essencial para Rust e Python.',
    ja: 'TOMLをJSONに、またはJSONをTOMLに無料でオンライン変換。シンタックスハイライト付きで設定ファイルを検証・フォーマット。',
  },
  'json-to-java': {
    en: 'Convert JSON to Java classes online for free. Support Lombok, getters/setters, and builder patterns. Perfect for API development and data modeling.',
    zh: '免费在线将 JSON 转换为 Java 类。支持 Lombok 注解、getter/setter 和 builder 模式。Java API 开发和数据建模必备。',
    es: 'Convierte JSON a clases Java en línea gratis. Soporta anotaciones Lombok, getters/setters y patrones builder. Esencial para desarrollo de APIs Java.',
    pt: 'Converta JSON para classes Java online grátis. Suporta anotações Lombok, getters/setters e padrões builder. Essencial para desenvolvimento de APIs Java.',
    ja: 'JSONをJavaクラスに無料でオンライン変換。Lombokアノテーション、getter/setter、builderパターンに対応。Java API開発に必須。',
  },
  'json-to-python': {
    en: 'Convert JSON to Python dataclass or Pydantic models online for free. Generate type-safe Python code with validation. Essential for Python API development.',
    zh: '免费在线将 JSON 转换为 Python dataclass 或 Pydantic 模型。生成带验证的类型安全 Python 代码。Python API 开发必备。',
    es: 'Convierte JSON a dataclass Python o modelos Pydantic en línea gratis. Genera código Python con tipos seguros y validación. Esencial para APIs Python.',
    pt: 'Converta JSON para dataclass Python ou modelos Pydantic online grátis. Gere código Python com tipos seguros e validação. Essencial para APIs Python.',
    ja: 'JSONをPython dataclassまたはPydanticモデルに無料でオンライン変換。バリデーション付きの型安全なPythonコードを生成。',
  },
  'json-to-kotlin': {
    en: 'Convert JSON to Kotlin data classes online for free. Support Moshi, Gson, and Kotlinx annotations. Perfect for Android and Kotlin backend development.',
    zh: '免费在线将 JSON 转换为 Kotlin 数据类。支持 Moshi、Gson 和 Kotlinx 序列化注解。Android 和 Kotlin 后端开发必备。',
    es: 'Convierte JSON a clases de datos Kotlin en línea gratis. Soporta anotaciones Moshi, Gson y Kotlinx. Esencial para desarrollo Android y backend Kotlin.',
    pt: 'Converta JSON para data classes Kotlin online grátis. Suporta anotações Moshi, Gson e Kotlinx. Essencial para desenvolvimento Android e backend Kotlin.',
    ja: 'JSONをKotlinデータクラスに無料でオンライン変換。Moshi、Gson、Kotlinxシリアライゼーションアノテーションに対応。Android開発に必須。',
  },
  // 第三批工具优化
  'color-picker': {
    en: 'Pick colors and get color values in HEX, RGB, HSL formats online for free. Visual color picker with preset palettes and recent colors. Perfect for designers.',
    zh: '免费在线选择颜色并获取 HEX、RGB、HSL 格式的颜色值。可视化颜色选择器，支持预设调色板和最近使用的颜色。设计师必备。',
    es: 'Selecciona colores y obtén valores en formatos HEX, RGB, HSL en línea gratis. Selector visual con paletas preestablecidas y colores recientes. Para diseñadores.',
    pt: 'Selecione cores e obtenha valores em formatos HEX, RGB, HSL online grátis. Seletor visual com paletas predefinidas e cores recentes. Para designers.',
    ja: 'HEX、RGB、HSL形式で色を選択し、色の値を無料でオンライン取得。プリセットパレットと最近の色を備えたビジュアルカラーピッカー。',
  },
  'aspect-ratio': {
    en: 'Calculate aspect ratio and resize images proportionally online for free. Support common ratios like 16:9, 4:3, 1:1. Perfect for video editing and design.',
    zh: '免费在线计算宽高比并按比例调整图片大小。支持 16:9、4:3、1:1 等常见比例。视频编辑和响应式设计必备。',
    es: 'Calcula la relación de aspecto y redimensiona imágenes proporcionalmente en línea gratis. Soporta ratios comunes como 16:9, 4:3, 1:1. Para edición de video.',
    pt: 'Calcule a proporção e redimensione imagens proporcionalmente online grátis. Suporta proporções comuns como 16:9, 4:3, 1:1. Para edição de vídeo.',
    ja: 'アスペクト比を計算し、画像を比例的にリサイズ。16:9、4:3、1:1などの一般的な比率に対応。動画編集やレスポンシブデザインに最適。',
  },
  'css-beautifier': {
    en: 'Format, beautify and minify CSS code online for free. Syntax highlighting with customizable indentation. Perfect for web developers and front-end optimization.',
    zh: '免费在线格式化、美化和压缩 CSS 代码。语法高亮，支持自定义缩进。Web 开发者和前端优化必备。',
    es: 'Formatea, embellece y minifica código CSS en línea gratis. Resaltado de sintaxis con indentación personalizable. Perfecto para desarrolladores web.',
    pt: 'Formate, embeleze e minifique código CSS online grátis. Destaque de sintaxe com indentação personalizável. Perfeito para desenvolvedores web.',
    ja: 'CSSコードを無料でオンラインでフォーマット、整形、圧縮。カスタマイズ可能なインデント付きシンタックスハイライト。Web開発者に最適。',
  },
  'js-beautifier': {
    en: 'Format, beautify and minify JavaScript code online for free. Syntax highlighting with customizable indentation. Perfect for web developers and optimization.',
    zh: '免费在线格式化、美化和压缩 JavaScript 代码。语法高亮，支持自定义缩进。Web 开发者和代码优化必备。',
    es: 'Formatea, embellece y minifica código JavaScript en línea gratis. Resaltado de sintaxis con indentación personalizable. Perfecto para desarrolladores.',
    pt: 'Formate, embeleze e minifique código JavaScript online grátis. Destaque de sintaxe com indentação personalizável. Perfeito para desenvolvedores.',
    ja: 'JavaScriptコードを無料でオンラインでフォーマット、整形、圧縮。カスタマイズ可能なインデント付きシンタックスハイライト。開発者に最適。',
  },
  'html-preview': {
    en: 'Preview HTML code in real-time online for free. Live rendering with instant updates as you type. Perfect for web development and quick prototyping.',
    zh: '免费在线实时预览 HTML 代码。输入时即时更新的实时渲染。Web 开发、学习 HTML 和快速原型设计必备。',
    es: 'Previsualiza código HTML en tiempo real en línea gratis. Renderizado en vivo con actualizaciones instantáneas. Perfecto para desarrollo web y aprendizaje.',
    pt: 'Visualize código HTML em tempo real online grátis. Renderização ao vivo com atualizações instantâneas. Perfeito para desenvolvimento web e aprendizado.',
    ja: 'HTMLコードを無料でオンラインでリアルタイムプレビュー。入力時に即座に更新されるライブレンダリング。Web開発やHTML学習に最適。',
  },
  'ip-lookup': {
    en: 'Look up IP address geolocation online for free. Get country, city, ISP, timezone, and coordinates. Perfect for network troubleshooting and security analysis.',
    zh: '免费在线查询 IP 地址地理位置。获取国家、城市、ISP、时区和坐标。网络故障排除和安全分析必备。',
    es: 'Busca la geolocalización de direcciones IP en línea gratis. Obtén país, ciudad, ISP, zona horaria y coordenadas. Para análisis de red y seguridad.',
    pt: 'Pesquise a geolocalização de endereços IP online grátis. Obtenha país, cidade, ISP, fuso horário e coordenadas. Para análise de rede e segurança.',
    ja: 'IPアドレスの地理位置情報を無料でオンライン検索。国、都市、ISP、タイムゾーン、座標を取得。ネットワークトラブルシューティングに最適。',
  },
  'morse-code': {
    en: 'Convert text to Morse code or Morse code to text online for free. Audio playback support with adjustable speed. Perfect for learning and enthusiasts.',
    zh: '免费在线将文本转换为摩尔斯电码或将摩尔斯电码转换为文本。支持音频播放，可调节速度。学习和通信爱好者必备。',
    es: 'Convierte texto a código Morse o código Morse a texto en línea gratis. Reproducción de audio con velocidad ajustable. Para aprendizaje y entusiastas.',
    pt: 'Converta texto para código Morse ou código Morse para texto online grátis. Reprodução de áudio com velocidade ajustável. Para aprendizado e entusiastas.',
    ja: 'テキストをモールス信号に、またはモールス信号をテキストに無料でオンライン変換。速度調整可能なオーディオ再生に対応。学習に最適。',
  },
  'random-generator': {
    en: 'Generate random numbers online for free. Support custom range, unique numbers, and multiple results. Perfect for games, lotteries, and random selection tasks.',
    zh: '免费在线生成随机数。支持自定义范围、唯一数字和多个结果。游戏、抽奖和随机选择任务必备。',
    es: 'Genera números aleatorios en línea gratis. Soporta rango personalizado, números únicos y múltiples resultados. Perfecto para juegos y sorteos.',
    pt: 'Gere números aleatórios online grátis. Suporta intervalo personalizado, números únicos e múltiplos resultados. Perfeito para jogos e sorteios.',
    ja: '乱数を無料でオンライン生成。カスタム範囲、ユニークな数字、複数の結果に対応。ゲーム、抽選、ランダム選択に最適。',
  },
  'text-reverser': {
    en: 'Reverse text characters, words, or lines online for free. Multiple reversal modes with instant preview. Perfect for puzzles, encoding, and text manipulation.',
    zh: '免费在线反转文本字符、单词或行。多种反转模式，即时预览。谜题、编码和文本处理任务必备。',
    es: 'Invierte caracteres, palabras o líneas de texto en línea gratis. Múltiples modos de inversión con vista previa instantánea. Para puzzles y codificación.',
    pt: 'Inverta caracteres, palavras ou linhas de texto online grátis. Múltiplos modos de inversão com visualização instantânea. Para puzzles e codificação.',
    ja: 'テキストの文字、単語、行を無料でオンラインで反転。複数の反転モードと即時プレビュー。パズル、エンコーディング、テキスト操作に最適。',
  },
  'line-counter': {
    en: 'Count lines, remove duplicates, and sort text online for free. Get statistics for total, empty, and unique lines. Perfect for data cleaning and text processing.',
    zh: '免费在线统计行数、删除重复行和排序文本。获取总行数、空行数和唯一行数统计。数据清理和文本处理必备。',
    es: 'Cuenta líneas, elimina duplicados y ordena texto en línea gratis. Obtén estadísticas de líneas totales, vacías y únicas. Para limpieza de datos.',
    pt: 'Conte linhas, remova duplicatas e ordene texto online grátis. Obtenha estatísticas de linhas totais, vazias e únicas. Para limpeza de dados.',
    ja: '行数をカウントし、重複を削除し、テキストを無料でオンラインでソート。合計、空、ユニーク行の統計を取得。データクリーニングに最適。',
  },
  'string-escape': {
    en: 'Escape and unescape strings for various programming languages online for free. Support JSON, HTML, URL, and regex escaping. Perfect for developers.',
    zh: '免费在线转义和反转义各种编程语言的字符串。支持 JSON、HTML、URL 和正则表达式转义。开发者和数据处理必备。',
    es: 'Escapa y desescapa cadenas para varios lenguajes de programación en línea gratis. Soporta JSON, HTML, URL y regex. Perfecto para desarrolladores.',
    pt: 'Escape e unescape strings para várias linguagens de programação online grátis. Suporta JSON, HTML, URL e regex. Perfeito para desenvolvedores.',
    ja: '各種プログラミング言語の文字列を無料でオンラインでエスケープ・アンエスケープ。JSON、HTML、URL、正規表現に対応。開発者に最適。',
  },
  'yaml-json': {
    en: 'Convert YAML to JSON or JSON to YAML online for free. Validate and format config files with syntax highlighting. Essential for DevOps and configuration.',
    zh: '免费在线将 YAML 转换为 JSON 或 JSON 转换为 YAML。验证和格式化配置文件，支持语法高亮。DevOps 和配置管理必备。',
    es: 'Convierte YAML a JSON o JSON a YAML en línea gratis. Valida y formatea archivos de configuración con resaltado de sintaxis. Para DevOps.',
    pt: 'Converta YAML para JSON ou JSON para YAML online grátis. Valide e formate arquivos de configuração com destaque de sintaxe. Para DevOps.',
    ja: 'YAMLをJSONに、またはJSONをYAMLに無料でオンライン変換。シンタックスハイライト付きで設定ファイルを検証・フォーマット。DevOpsに最適。',
  },
  'date-calculator': {
    en: 'Calculate date differences and add/subtract days online for free. Get days, weeks, months, and years between dates. Perfect for project planning and scheduling.',
    zh: '免费在线计算日期差异和加减天数。获取日期之间的天数、周数、月数和年数。项目规划和日程安排必备。',
    es: 'Calcula diferencias de fechas y añade/resta días en línea gratis. Obtén días, semanas, meses y años entre fechas. Para planificación de proyectos.',
    pt: 'Calcule diferenças de datas e adicione/subtraia dias online grátis. Obtenha dias, semanas, meses e anos entre datas. Para planejamento de projetos.',
    ja: '日付の差分を計算し、日数を加減算。日付間の日数、週数、月数、年数を取得。プロジェクト計画やスケジューリングに最適。',
  },
  'text-deduplicator': {
    en: 'Remove duplicate lines from text online for free. Support case-sensitive matching and line trimming. Perfect for data cleaning and list processing tasks.',
    zh: '免费在线删除文本中的重复行。支持区分大小写匹配和行修剪。数据清理和列表处理任务必备。',
    es: 'Elimina líneas duplicadas del texto en línea gratis. Soporta coincidencia sensible a mayúsculas y recorte de líneas. Para limpieza de datos.',
    pt: 'Remova linhas duplicadas do texto online grátis. Suporta correspondência sensível a maiúsculas e recorte de linhas. Para limpeza de dados.',
    ja: 'テキストから重複行を無料でオンラインで削除。大文字小文字を区別するマッチングと行トリミングに対応。データクリーニングに最適。',
  },
  'color-blender': {
    en: 'Blend two colors and generate gradient steps online for free. Create smooth color transitions with customizable steps. Perfect for designers and palettes.',
    zh: '免费在线混合两种颜色并生成渐变步骤。创建平滑的颜色过渡，支持自定义步数。设计师和调色板创建必备。',
    es: 'Mezcla dos colores y genera pasos de gradiente en línea gratis. Crea transiciones de color suaves con pasos personalizables. Para diseñadores.',
    pt: 'Misture duas cores e gere etapas de gradiente online grátis. Crie transições de cor suaves com etapas personalizáveis. Para designers.',
    ja: '2つの色をブレンドし、グラデーションステップを無料でオンライン生成。カスタマイズ可能なステップで滑らかな色の遷移を作成。デザイナーに最適。',
  },
  'json-sorter': {
    en: 'Sort JSON keys alphabetically online for free. Support ascending and descending order with nested object sorting. Essential for API development.',
    zh: '免费在线按字母顺序排序 JSON 键。支持升序和降序，嵌套对象排序。API 开发和数据组织必备。',
    es: 'Ordena claves JSON alfabéticamente en línea gratis. Soporta orden ascendente y descendente con ordenación de objetos anidados. Para desarrollo de APIs.',
    pt: 'Ordene chaves JSON alfabeticamente online grátis. Suporta ordem ascendente e descendente com ordenação de objetos aninhados. Para desenvolvimento de APIs.',
    ja: 'JSONキーを無料でオンラインでアルファベット順にソート。昇順・降順とネストされたオブジェクトのソートに対応。API開発に最適。',
  },
  // 第四批工具优化
  'placeholder-image': {
    en: 'Generate placeholder images with custom dimensions and colors online for free. Perfect for mockups, wireframes, and web design prototyping. Download as PNG.',
    zh: '免费在线生成自定义尺寸和颜色的占位图片。适用于模型、线框图和网页设计原型。下载为 PNG 格式。',
    es: 'Genera imágenes de marcador de posición con dimensiones y colores personalizados en línea gratis. Perfecto para maquetas y diseño web. Descarga como PNG.',
    pt: 'Gere imagens de placeholder com dimensões e cores personalizadas online grátis. Perfeito para mockups e design web. Baixe como PNG.',
    ja: 'カスタムサイズと色のプレースホルダー画像を無料でオンライン生成。モックアップ、ワイヤーフレーム、Webデザインに最適。PNGでダウンロード。',
  },
  'text-encryption': {
    en: 'Encrypt and decrypt text with AES-256 encryption online for free. Secure browser-based encryption with password protection. No data uploaded to servers.',
    zh: '免费在线使用 AES-256 加密和解密文本。安全的浏览器加密，支持密码保护。数据不会上传到服务器。',
    es: 'Cifra y descifra texto con encriptación AES-256 en línea gratis. Cifrado seguro en navegador con protección de contraseña. Sin carga de datos.',
    pt: 'Criptografe e descriptografe texto com criptografia AES-256 online grátis. Criptografia segura no navegador com proteção por senha. Sem upload.',
    ja: 'AES-256暗号化でテキストを無料でオンラインで暗号化・復号化。パスワード保護付きの安全なブラウザ暗号化。サーバーへのデータアップロードなし。',
  },
  'file-hash': {
    en: 'Calculate file hashes (MD5, SHA-1, SHA-256, SHA-512) online for free. Verify file integrity and detect changes. Secure browser-based processing.',
    zh: '免费在线计算文件哈希值（MD5、SHA-1、SHA-256、SHA-512）。验证文件完整性并检测更改。安全的浏览器处理。',
    es: 'Calcula hashes de archivos (MD5, SHA-1, SHA-256, SHA-512) en línea gratis. Verifica integridad de archivos y detecta cambios. Procesamiento seguro.',
    pt: 'Calcule hashes de arquivos (MD5, SHA-1, SHA-256, SHA-512) online grátis. Verifique integridade de arquivos e detecte alterações. Processamento seguro.',
    ja: 'ファイルハッシュ（MD5、SHA-1、SHA-256、SHA-512）を無料でオンライン計算。ファイルの整合性を検証し、変更を検出。安全なブラウザ処理。',
  },
  'html-table-generator': {
    en: 'Generate HTML tables with visual editor online for free. Customize rows, columns, headers, and styling. Export clean HTML code for your website.',
    zh: '免费在线使用可视化编辑器生成 HTML 表格。自定义行、列、标题和样式。导出干净的 HTML 代码用于网站。',
    es: 'Genera tablas HTML con editor visual en línea gratis. Personaliza filas, columnas, encabezados y estilos. Exporta código HTML limpio para tu sitio.',
    pt: 'Gere tabelas HTML com editor visual online grátis. Personalize linhas, colunas, cabeçalhos e estilos. Exporte código HTML limpo para seu site.',
    ja: 'ビジュアルエディタでHTMLテーブルを無料でオンライン生成。行、列、ヘッダー、スタイルをカスタマイズ。クリーンなHTMLコードをエクスポート。',
  },
  'json-schema-validator': {
    en: 'Validate JSON data against JSON Schema online for free. Support draft-04, draft-06, and draft-07 schemas. Get detailed error messages and validation reports.',
    zh: '免费在线根据 JSON Schema 验证 JSON 数据。支持 draft-04、draft-06 和 draft-07 模式。获取详细的错误消息和验证报告。',
    es: 'Valida datos JSON contra JSON Schema en línea gratis. Soporta esquemas draft-04, draft-06 y draft-07. Obtén mensajes de error detallados.',
    pt: 'Valide dados JSON contra JSON Schema online grátis. Suporta esquemas draft-04, draft-06 e draft-07. Obtenha mensagens de erro detalhadas.',
    ja: 'JSON SchemaでJSONデータを無料でオンライン検証。draft-04、draft-06、draft-07スキーマに対応。詳細なエラーメッセージを取得。',
  },
  'regex-patterns': {
    en: 'Browse common regex patterns for email, URL, phone, IP address, date, and more online for free. Copy and use in your code with one click. Developer reference.',
    zh: '免费在线浏览常用正则表达式模式：邮箱、URL、电话、IP 地址、日期等。一键复制并在代码中使用。开发者参考。',
    es: 'Explora patrones regex comunes para email, URL, teléfono, IP, fecha y más en línea gratis. Copia y usa en tu código con un clic. Referencia para devs.',
    pt: 'Navegue por padrões regex comuns para email, URL, telefone, IP, data e mais online grátis. Copie e use no seu código com um clique. Referência para devs.',
    ja: 'メール、URL、電話、IPアドレス、日付などの一般的な正規表現パターンを無料でオンライン閲覧。ワンクリックでコードにコピー。開発者リファレンス。',
  },
  'byte-counter': {
    en: 'Count text bytes in UTF-8, UTF-16, and other encodings online for free. Get character count, word count, and byte size. Essential for data size estimation.',
    zh: '免费在线统计 UTF-8、UTF-16 等编码的文本字节数。获取字符数、字数和字节大小。数据大小估算必备。',
    es: 'Cuenta bytes de texto en UTF-8, UTF-16 y otras codificaciones en línea gratis. Obtén conteo de caracteres, palabras y tamaño. Esencial para estimación.',
    pt: 'Conte bytes de texto em UTF-8, UTF-16 e outras codificações online grátis. Obtenha contagem de caracteres, palavras e tamanho. Essencial para estimativa.',
    ja: 'UTF-8、UTF-16などのエンコーディングでテキストバイト数を無料でオンラインカウント。文字数、単語数、バイトサイズを取得。データサイズ見積もりに必須。',
  },
  'json-to-typescript': {
    en: 'Convert JSON to TypeScript interfaces and types online for free. Generate type-safe code with optional properties and nested types. Essential for TS devs.',
    zh: '免费在线将 JSON 转换为 TypeScript 接口和类型。生成带可选属性和嵌套类型的类型安全代码。TypeScript 开发者必备。',
    es: 'Convierte JSON a interfaces y tipos TypeScript en línea gratis. Genera código con tipos seguros, propiedades opcionales y tipos anidados. Esencial para devs.',
    pt: 'Converta JSON para interfaces e tipos TypeScript online grátis. Gere código com tipos seguros, propriedades opcionais e tipos aninhados. Essencial para devs.',
    ja: 'JSONをTypeScriptインターフェースと型に無料でオンライン変換。オプショナルプロパティとネスト型を持つ型安全なコードを生成。TypeScript開発者に必須。',
  },
  'svg-optimizer': {
    en: 'Optimize and compress SVG files online for free. Remove unnecessary metadata, minify code, and reduce file size. Perfect for web performance optimization.',
    zh: '免费在线优化和压缩 SVG 文件。删除不必要的元数据，压缩代码，减小文件大小。Web 性能优化必备。',
    es: 'Optimiza y comprime archivos SVG en línea gratis. Elimina metadatos innecesarios, minifica código y reduce tamaño. Perfecto para optimización web.',
    pt: 'Otimize e comprima arquivos SVG online grátis. Remova metadados desnecessários, minifique código e reduza tamanho. Perfeito para otimização web.',
    ja: 'SVGファイルを無料でオンラインで最適化・圧縮。不要なメタデータを削除し、コードを圧縮し、ファイルサイズを削減。Webパフォーマンス最適化に最適。',
  },
  'text-to-binary': {
    en: 'Convert text to binary code or binary to text online for free. Support ASCII and Unicode encoding. Perfect for learning binary and data encoding concepts.',
    zh: '免费在线将文本转换为二进制代码或将二进制转换为文本。支持 ASCII 和 Unicode 编码。学习二进制和数据编码概念必备。',
    es: 'Convierte texto a código binario o binario a texto en línea gratis. Soporta codificación ASCII y Unicode. Perfecto para aprender conceptos de codificación.',
    pt: 'Converta texto para código binário ou binário para texto online grátis. Suporta codificação ASCII e Unicode. Perfeito para aprender conceitos de codificação.',
    ja: 'テキストをバイナリコードに、またはバイナリをテキストに無料でオンライン変換。ASCIIとUnicodeエンコーディングに対応。バイナリ学習に最適。',
  },
  'markdown-to-html': {
    en: 'Convert Markdown to HTML online for free. Support GitHub Flavored Markdown with tables, code blocks, and task lists. Preview and copy clean HTML output.',
    zh: '免费在线将 Markdown 转换为 HTML。支持 GitHub 风格 Markdown，包括表格、代码块和任务列表。预览并复制干净的 HTML 输出。',
    es: 'Convierte Markdown a HTML en línea gratis. Soporta GitHub Flavored Markdown con tablas, bloques de código y listas de tareas. Previsualiza y copia HTML.',
    pt: 'Converta Markdown para HTML online grátis. Suporta GitHub Flavored Markdown com tabelas, blocos de código e listas de tarefas. Visualize e copie HTML.',
    ja: 'MarkdownをHTMLに無料でオンライン変換。テーブル、コードブロック、タスクリスト付きのGitHub Flavored Markdownに対応。HTMLをプレビュー・コピー。',
  },
  'html-minifier': {
    en: 'Minify and compress HTML code online for free. Remove whitespace, comments, and optimize attributes. Reduce file size and improve page load speed.',
    zh: '免费在线压缩 HTML 代码。删除空白、注释并优化属性。减小文件大小，提高页面加载速度。',
    es: 'Minifica y comprime código HTML en línea gratis. Elimina espacios en blanco, comentarios y optimiza atributos. Reduce tamaño y mejora velocidad de carga.',
    pt: 'Minifique e comprima código HTML online grátis. Remova espaços em branco, comentários e otimize atributos. Reduza tamanho e melhore velocidade de carga.',
    ja: 'HTMLコードを無料でオンラインで圧縮。空白、コメントを削除し、属性を最適化。ファイルサイズを削減し、ページ読み込み速度を向上。',
  },
  'json-diff': {
    en: 'Compare two JSON objects and find differences online for free. Highlight added, removed, and changed values with side-by-side view. Essential for API debugging.',
    zh: '免费在线比较两个 JSON 对象并查找差异。高亮显示添加、删除和更改的值，支持并排视图。API 调试必备。',
    es: 'Compara dos objetos JSON y encuentra diferencias en línea gratis. Resalta valores añadidos, eliminados y cambiados con vista lado a lado. Esencial para APIs.',
    pt: 'Compare dois objetos JSON e encontre diferenças online grátis. Destaque valores adicionados, removidos e alterados com vista lado a lado. Essencial para APIs.',
    ja: '2つのJSONオブジェクトを比較し、差分を無料でオンラインで検出。追加、削除、変更された値を並べて表示でハイライト。APIデバッグに必須。',
  },
  'base32': {
    en: 'Encode text to Base32 or decode Base32 strings online for free. Support RFC 4648 standard encoding. Perfect for TOTP secrets and secure data encoding.',
    zh: '免费在线将文本编码为 Base32 或解码 Base32 字符串。支持 RFC 4648 标准编码。适用于 TOTP 密钥和安全数据编码。',
    es: 'Codifica texto a Base32 o decodifica cadenas Base32 en línea gratis. Soporta codificación estándar RFC 4648. Perfecto para secretos TOTP y codificación segura.',
    pt: 'Codifique texto para Base32 ou decodifique strings Base32 online grátis. Suporta codificação padrão RFC 4648. Perfeito para segredos TOTP e codificação segura.',
    ja: 'テキストをBase32にエンコード、またはBase32文字列を無料でオンラインでデコード。RFC 4648標準エンコーディングに対応。TOTPシークレットに最適。',
  },
  'epoch-converter': {
    en: 'Convert Unix epoch timestamps to human-readable dates and vice versa online for free. Support milliseconds and seconds. Essential for developers and logs.',
    zh: '免费在线将 Unix 时间戳转换为可读日期，反之亦然。支持毫秒和秒。开发者和日志分析必备。',
    es: 'Convierte timestamps Unix epoch a fechas legibles y viceversa en línea gratis. Soporta milisegundos y segundos. Esencial para desarrolladores y logs.',
    pt: 'Converta timestamps Unix epoch para datas legíveis e vice-versa online grátis. Suporta milissegundos e segundos. Essencial para desenvolvedores e logs.',
    ja: 'Unixエポックタイムスタンプを人間が読める日付に、またはその逆に無料でオンライン変換。ミリ秒と秒に対応。開発者とログ分析に必須。',
  },
  'css-unit-converter': {
    en: 'Convert CSS units (px, em, rem, %, vw, vh) online for free. Calculate responsive values with base font size. Essential for responsive web design.',
    zh: '免费在线转换 CSS 单位（px、em、rem、%、vw、vh）。使用基础字体大小计算响应式值。响应式网页设计和开发必备。',
    es: 'Convierte unidades CSS (px, em, rem, %, vw, vh) en línea gratis. Calcula valores responsivos con tamaño de fuente base. Esencial para diseño web responsivo.',
    pt: 'Converta unidades CSS (px, em, rem, %, vw, vh) online grátis. Calcule valores responsivos com tamanho de fonte base. Essencial para design web responsivo.',
    ja: 'CSS単位（px、em、rem、%、vw、vh）を無料でオンライン変換。ベースフォントサイズでレスポンシブ値を計算。レスポンシブWebデザインに必須。',
  },
  // 第五批工具优化
  'text-statistics': {
    en: 'Analyze text statistics online for free. Get word count, character count, sentence count, reading time, and readability scores. Perfect for writers and editors.',
    zh: '免费在线分析文本统计。获取字数、字符数、句子数、阅读时间和可读性评分。作家和编辑必备。',
    es: 'Analiza estadísticas de texto en línea gratis. Obtén conteo de palabras, caracteres, oraciones, tiempo de lectura y puntuaciones de legibilidad.',
    pt: 'Analise estatísticas de texto online grátis. Obtenha contagem de palavras, caracteres, frases, tempo de leitura e pontuações de legibilidade. Para escritores.',
    ja: 'テキスト統計を無料でオンライン分析。単語数、文字数、文数、読書時間、可読性スコアを取得。ライターや編集者に最適。',
  },
  'hex-editor': {
    en: 'Convert text to hexadecimal and hex to text online for free. View and edit hex data with ASCII preview. Essential for debugging and binary data analysis.',
    zh: '免费在线将文本转换为十六进制，或将十六进制转换为文本。查看和编辑十六进制数据，支持 ASCII 预览。调试和二进制数据分析必备。',
    es: 'Convierte texto a hexadecimal y hex a texto en línea gratis. Ve y edita datos hex con vista previa ASCII. Esencial para depuración y análisis de datos binarios.',
    pt: 'Converta texto para hexadecimal e hex para texto online grátis. Veja e edite dados hex com visualização ASCII. Essencial para depuração e análise de dados.',
    ja: 'テキストを16進数に、16進数をテキストに無料でオンライン変換。ASCIIプレビュー付きで16進データを表示・編集。デバッグとバイナリデータ分析に必須。',
  },
  'color-palette': {
    en: 'Generate color palettes and schemes online for free. Create complementary, analogous, triadic, and monochromatic palettes. Export to CSS, SCSS, or JSON format.',
    zh: '免费在线生成调色板和配色方案。创建互补色、类似色、三色和单色调色板。导出为 CSS、SCSS 或 JSON 格式。',
    es: 'Genera paletas de colores y esquemas en línea gratis. Crea paletas complementarias, análogas, triádicas y monocromáticas. Exporta a CSS, SCSS o JSON.',
    pt: 'Gere paletas de cores e esquemas online grátis. Crie paletas complementares, análogas, triádicas e monocromáticas. Exporte para CSS, SCSS ou JSON.',
    ja: 'カラーパレットと配色を無料でオンライン生成。補色、類似色、トライアド、モノクロマティックパレットを作成。CSS、SCSS、JSON形式でエクスポート。',
  },
  'http-status': {
    en: 'Browse HTTP status codes reference guide online for free. Learn about 1xx, 2xx, 3xx, 4xx, and 5xx status codes with descriptions and use cases.',
    zh: '免费在线浏览 HTTP 状态码参考指南。了解 1xx、2xx、3xx、4xx 和 5xx 状态码的描述和用例。开发者必备。',
    es: 'Explora la guía de referencia de códigos de estado HTTP en línea gratis. Aprende sobre códigos 1xx, 2xx, 3xx, 4xx y 5xx con descripciones y casos de uso.',
    pt: 'Navegue pelo guia de referência de códigos de status HTTP online grátis. Aprenda sobre códigos 1xx, 2xx, 3xx, 4xx e 5xx com descrições e casos de uso.',
    ja: 'HTTPステータスコードリファレンスガイドを無料でオンライン閲覧。1xx、2xx、3xx、4xx、5xxステータスコードの説明と使用例を学習。開発者必須。',
  },
  'json-to-yaml': {
    en: 'Convert JSON to YAML format online for free. Preserve data structure with proper indentation and formatting. Perfect for configuration files and DevOps.',
    zh: '免费在线将 JSON 转换为 YAML 格式。保留数据结构，正确缩进和格式化。配置文件和 DevOps 工作流必备。',
    es: 'Convierte JSON a formato YAML en línea gratis. Preserva la estructura de datos con indentación y formato adecuados. Perfecto para archivos de configuración.',
    pt: 'Converta JSON para formato YAML online grátis. Preserve a estrutura de dados com indentação e formatação adequadas. Perfeito para arquivos de configuração.',
    ja: 'JSONをYAML形式に無料でオンライン変換。適切なインデントとフォーマットでデータ構造を保持。設定ファイルとDevOpsワークフローに最適。',
  },
  'data-uri': {
    en: 'Generate Data URIs from files or text online for free. Convert images, fonts, and files to base64 data URLs. Perfect for embedding assets in CSS and HTML.',
    zh: '免费在线从文件或文本生成 Data URI。将图片、字体和文件转换为 base64 数据 URL。适用于在 CSS 和 HTML 中嵌入资源。',
    es: 'Genera Data URIs desde archivos o texto en línea gratis. Convierte imágenes, fuentes y archivos a URLs de datos base64. Perfecto para incrustar en CSS y HTML.',
    pt: 'Gere Data URIs a partir de arquivos ou texto online grátis. Converta imagens, fontes e arquivos para URLs de dados base64. Perfeito para CSS e HTML.',
    ja: 'ファイルやテキストからData URIを無料でオンライン生成。画像、フォント、ファイルをbase64データURLに変換。CSSやHTMLへのアセット埋め込みに最適。',
  },
  'text-compare': {
    en: 'Compare text similarity and find differences online for free. Calculate Levenshtein distance and similarity percentage. Essential for content review.',
    zh: '免费在线比较文本相似度并查找差异。计算编辑距离、相似度百分比并高亮显示更改。内容审核必备。',
    es: 'Compara similitud de texto y encuentra diferencias en línea gratis. Calcula distancia Levenshtein y porcentaje de similitud. Esencial para revisión.',
    pt: 'Compare similaridade de texto e encontre diferenças online grátis. Calcule distância Levenshtein e porcentagem de similaridade. Essencial para revisão.',
    ja: 'テキストの類似度を比較し、差分を無料でオンラインで検出。レーベンシュタイン距離、類似度パーセンテージを計算し、変更をハイライト。コンテンツレビューに必須。',
  },
  'json-to-go': {
    en: 'Convert JSON to Go structs online for free. Generate type-safe Go code with proper field tags and nested struct support. Essential for Go API development.',
    zh: '免费在线将 JSON 转换为 Go 结构体。生成带有正确字段标签和嵌套结构体支持的类型安全 Go 代码。Go API 开发必备。',
    es: 'Convierte JSON a structs Go en línea gratis. Genera código Go con tipos seguros, etiquetas de campo y soporte de structs anidados. Esencial para desarrollo Go.',
    pt: 'Converta JSON para structs Go online grátis. Gere código Go com tipos seguros, tags de campo e suporte a structs aninhados. Essencial para desenvolvimento Go.',
    ja: 'JSONをGo構造体に無料でオンライン変換。適切なフィールドタグとネスト構造体サポート付きの型安全なGoコードを生成。Go API開発に必須。',
  },
  'html-to-jsx': {
    en: 'Convert HTML code to React JSX format online for free. Transform class to className, style strings to objects. Essential for React developers.',
    zh: '免费在线将 HTML 代码转换为 React JSX 格式。将 class 转换为 className，style 字符串转换为对象，修复自闭合标签。React 开发者必备。',
    es: 'Convierte código HTML a formato React JSX en línea gratis. Transforma class a className, estilos a objetos. Esencial para desarrolladores React.',
    pt: 'Converta código HTML para formato React JSX online grátis. Transforme class para className, estilos para objetos. Essencial para desenvolvedores React.',
    ja: 'HTMLコードをReact JSX形式に無料でオンライン変換。classをclassNameに、styleを文字列からオブジェクトに変換し、自己終了タグを修正。React開発者に必須。',
  },
  'chmod-calculator': {
    en: 'Calculate Unix file permissions (chmod) online for free. Convert between numeric and symbolic notation. Visualize read, write, execute permissions.',
    zh: '免费在线计算 Unix 文件权限（chmod）。在数字和符号表示法之间转换。可视化所有者、组、其他用户的读、写、执行权限。',
    es: 'Calcula permisos de archivos Unix (chmod) en línea gratis. Convierte entre notación numérica y simbólica. Visualiza permisos de lectura, escritura, ejecución.',
    pt: 'Calcule permissões de arquivos Unix (chmod) online grátis. Converta entre notação numérica e simbólica. Visualize permissões de leitura, escrita, execução.',
    ja: 'Unixファイルパーミッション（chmod）を無料でオンライン計算。数値表記とシンボリック表記を変換。所有者、グループ、その他の読み取り、書き込み、実行権限を可視化。',
  },
  'barcode-generator': {
    en: 'Generate barcodes online for free. Support Code128, Code39, EAN-13, UPC-A, and more formats. Download as PNG or SVG. Perfect for inventory and product labeling.',
    zh: '免费在线生成条形码。支持 Code128、Code39、EAN-13、UPC-A 等格式。下载为 PNG 或 SVG。库存和产品标签必备。',
    es: 'Genera códigos de barras en línea gratis. Soporta Code128, Code39, EAN-13, UPC-A y más formatos. Descarga como PNG o SVG. Perfecto para inventario y etiquetado.',
    pt: 'Gere códigos de barras online grátis. Suporta Code128, Code39, EAN-13, UPC-A e mais formatos. Baixe como PNG ou SVG. Perfeito para inventário e etiquetagem.',
    ja: 'バーコードを無料でオンライン生成。Code128、Code39、EAN-13、UPC-Aなどの形式に対応。PNGまたはSVGでダウンロード。在庫管理と製品ラベリングに最適。',
  },
  'text-to-speech': {
    en: 'Convert text to speech online for free. Multiple voices and languages with adjustable speed and pitch. Download audio or listen in browser.',
    zh: '免费在线将文本转换为语音。多种声音和语言，可调节速度和音调。下载音频或在浏览器中收听。无障碍访问必备。',
    es: 'Convierte texto a voz en línea gratis. Múltiples voces e idiomas con velocidad y tono ajustables. Descarga audio o escucha en navegador.',
    pt: 'Converta texto para fala online grátis. Múltiplas vozes e idiomas com velocidade e tom ajustáveis. Baixe áudio ou ouça no navegador.',
    ja: 'テキストを音声に無料でオンライン変換。複数の声と言語、調整可能な速度とピッチ。音声をダウンロードまたはブラウザで再生。アクセシビリティに最適。',
  },
  'url-parser': {
    en: 'Parse and analyze URLs online for free. Extract protocol, host, port, path, query parameters, and hash. Encode and decode URL components.',
    zh: '免费在线解析和分析 URL。提取协议、主机、端口、路径、查询参数和哈希。编码和解码 URL 组件。Web 开发必备。',
    es: 'Analiza y parsea URLs en línea gratis. Extrae protocolo, host, puerto, ruta, parámetros de consulta y hash. Codifica y decodifica componentes URL.',
    pt: 'Analise e parse URLs online grátis. Extraia protocolo, host, porta, caminho, parâmetros de consulta e hash. Codifique e decodifique componentes URL.',
    ja: 'URLを無料でオンラインで解析・分析。プロトコル、ホスト、ポート、パス、クエリパラメータ、ハッシュを抽出。URLコンポーネントをエンコード・デコード。Web開発に必須。',
  },
  'json-to-xml': {
    en: 'Convert JSON to XML format online for free. Preserve data structure with proper element nesting and attributes. Perfect for API integration and data exchange.',
    zh: '免费在线将 JSON 转换为 XML 格式。保留数据结构，正确嵌套元素和属性。API 集成和数据转换必备。',
    es: 'Convierte JSON a formato XML en línea gratis. Preserva la estructura de datos con anidación de elementos y atributos. Perfecto para integración de APIs.',
    pt: 'Converta JSON para formato XML online grátis. Preserve a estrutura de dados com aninhamento de elementos e atributos. Perfeito para integração de APIs.',
    ja: 'JSONをXML形式に無料でオンライン変換。適切な要素のネストと属性でデータ構造を保持。API統合とデータ変換に最適。',
  },
  'text-wrapper': {
    en: 'Wrap text to specified width online for free. Add line breaks at word boundaries or fixed positions. Perfect for formatting code comments and documentation.',
    zh: '免费在线将文本换行到指定宽度。在单词边界或固定位置添加换行符。格式化代码注释、邮件和文档必备。',
    es: 'Ajusta texto a ancho especificado en línea gratis. Añade saltos de línea en límites de palabras o posiciones fijas. Perfecto para comentarios y documentación.',
    pt: 'Ajuste texto para largura especificada online grátis. Adicione quebras de linha em limites de palavras ou posições fixas. Perfeito para comentários e docs.',
    ja: 'テキストを指定幅に無料でオンラインで折り返し。単語境界または固定位置で改行を追加。コードコメント、メール、ドキュメントのフォーマットに最適。',
  },
  'csv-to-json': {
    en: 'Convert CSV to JSON format online for free. Parse CSV with custom delimiters and headers. Support nested objects and arrays. Perfect for data import.',
    zh: '免费在线将 CSV 转换为 JSON 格式。使用自定义分隔符和标题解析 CSV。支持嵌套对象和数组。数据导入和 API 集成必备。',
    es: 'Convierte CSV a formato JSON en línea gratis. Parsea CSV con delimitadores y encabezados personalizados. Soporta objetos y arrays anidados. Para importación.',
    pt: 'Converta CSV para formato JSON online grátis. Parse CSV com delimitadores e cabeçalhos personalizados. Suporta objetos e arrays aninhados. Para importação.',
    ja: 'CSVをJSON形式に無料でオンライン変換。カスタム区切り文字とヘッダーでCSVを解析。ネストされたオブジェクトと配列に対応。データインポートとAPI統合に最適。',
  },
  'html-entity': {
    en: 'Convert HTML entities online for free. Encode special characters to HTML entities and decode entities to characters. Prevent XSS attacks and display HTML.',
    zh: '免费在线转换 HTML 实体。将特殊字符编码为 HTML 实体，将实体解码为字符。防止 XSS 攻击并正确显示 HTML。',
    es: 'Convierte entidades HTML en línea gratis. Codifica caracteres especiales a entidades HTML y decodifica entidades a caracteres. Previene ataques XSS.',
    pt: 'Converta entidades HTML online grátis. Codifique caracteres especiais para entidades HTML e decodifique entidades para caracteres. Previna ataques XSS.',
    ja: 'HTMLエンティティを無料でオンライン変換。特殊文字をHTMLエンティティにエンコードし、エンティティを文字にデコード。XSS攻撃を防ぎ、HTMLを正しく表示。',
  },
  'number-formatter': {
    en: 'Format numbers in different locales online for free. Add thousand separators, decimal places, currency symbols, and percentage formatting. Essential for i18n.',
    zh: '免费在线以不同区域设置格式化数字。添加千位分隔符、小数位、货币符号和百分比格式。国际化必备。',
    es: 'Formatea números en diferentes locales en línea gratis. Añade separadores de miles, decimales, símbolos de moneda y formato de porcentaje. Esencial para i18n.',
    pt: 'Formate números em diferentes locales online grátis. Adicione separadores de milhares, casas decimais, símbolos de moeda e formatação de porcentagem. Para i18n.',
    ja: '異なるロケールで数値を無料でオンラインでフォーマット。千の位区切り、小数点以下、通貨記号、パーセント形式を追加。国際化に必須。',
  },
  // 第六批工具优化
  'hmac-generator': {
    en: 'Generate HMAC signatures online for free with MD5, SHA-1, SHA-256, SHA-512 algorithms. Secure message authentication for APIs and data integrity verification.',
    zh: '免费在线使用 MD5、SHA-1、SHA-256、SHA-512 算法生成 HMAC 签名。API 和数据完整性验证的安全消息认证。',
    es: 'Genera firmas HMAC en línea gratis con algoritmos MD5, SHA-1, SHA-256, SHA-512. Autenticación segura de mensajes para APIs y verificación de integridad.',
    pt: 'Gere assinaturas HMAC online grátis com algoritmos MD5, SHA-1, SHA-256, SHA-512. Autenticação segura de mensagens para APIs e verificação de integridade.',
    ja: 'MD5、SHA-1、SHA-256、SHA-512アルゴリズムでHMAC署名を無料でオンライン生成。APIとデータ整合性検証のための安全なメッセージ認証。',
  },
  'password-strength': {
    en: 'Check password strength online for free. Get detailed analysis with entropy score, crack time estimate, and improvement suggestions. Essential for security.',
    zh: '免费在线检查密码强度。获取详细分析，包括熵值评分、破解时间估算和改进建议。安全必备。',
    es: 'Verifica la fortaleza de contraseñas en línea gratis. Obtén análisis detallado con puntuación de entropía, tiempo de crackeo y sugerencias de mejora.',
    pt: 'Verifique a força de senhas online grátis. Obtenha análise detalhada com pontuação de entropia, tempo de quebra e sugestões de melhoria. Para segurança.',
    ja: 'パスワード強度を無料でオンラインチェック。エントロピースコア、クラック時間の見積もり、改善提案を含む詳細分析を取得。セキュリティに必須。',
  },
  'totp-generator': {
    en: 'Generate TOTP one-time passwords online for free. Support Google Authenticator compatible codes with custom secret keys and time intervals. For 2FA testing.',
    zh: '免费在线生成 TOTP 一次性密码。支持 Google Authenticator 兼容代码，自定义密钥和时间间隔。2FA 测试必备。',
    es: 'Genera contraseñas TOTP de un solo uso en línea gratis. Soporta códigos compatibles con Google Authenticator con claves secretas. Para pruebas 2FA.',
    pt: 'Gere senhas TOTP de uso único online grátis. Suporta códigos compatíveis com Google Authenticator com chaves secretas personalizadas. Para testes 2FA.',
    ja: 'TOTPワンタイムパスワードを無料でオンライン生成。カスタムシークレットキーと時間間隔でGoogle Authenticator互換コードに対応。2FAテスト用。',
  },
  'user-agent-parser': {
    en: 'Parse User Agent strings online for free. Extract browser, OS, device type, and version information. Essential for web analytics and device detection.',
    zh: '免费在线解析 User Agent 字符串。提取浏览器、操作系统、设备类型和版本信息。Web 分析和设备检测必备。',
    es: 'Parsea cadenas User Agent en línea gratis. Extrae navegador, SO, tipo de dispositivo e información de versión. Esencial para análisis web.',
    pt: 'Parse strings User Agent online grátis. Extraia navegador, SO, tipo de dispositivo e informações de versão. Essencial para análise web.',
    ja: 'User Agent文字列を無料でオンライン解析。ブラウザ、OS、デバイスタイプ、バージョン情報を抽出。Web分析とデバイス検出に必須。',
  },
  'cidr-calculator': {
    en: 'Calculate CIDR subnet information online for free. Get network address, broadcast address, host range, and subnet mask. Essential for network administrators.',
    zh: '免费在线计算 CIDR 子网信息。获取网络地址、广播地址、主机范围和子网掩码。网络管理员必备。',
    es: 'Calcula información de subred CIDR en línea gratis. Obtén dirección de red, broadcast, rango de hosts y máscara de subred. Esencial para administradores de red.',
    pt: 'Calcule informações de sub-rede CIDR online grátis. Obtenha endereço de rede, broadcast, faixa de hosts e máscara de sub-rede. Essencial para administradores.',
    ja: 'CIDRサブネット情報を無料でオンライン計算。ネットワークアドレス、ブロードキャストアドレス、ホスト範囲、サブネットマスクを取得。ネットワーク管理者に必須。',
  },
  'http-header-parser': {
    en: 'Parse HTTP headers online for free. Analyze request and response headers with detailed explanations. Essential for API debugging and web development.',
    zh: '免费在线解析 HTTP 头。分析请求和响应头，提供详细解释。API 调试和 Web 开发必备。',
    es: 'Parsea cabeceras HTTP en línea gratis. Analiza cabeceras de solicitud y respuesta con explicaciones detalladas. Esencial para depuración de APIs.',
    pt: 'Parse cabeçalhos HTTP online grátis. Analise cabeçalhos de requisição e resposta com explicações detalhadas. Essencial para depuração de APIs.',
    ja: 'HTTPヘッダーを無料でオンライン解析。リクエストとレスポンスヘッダーを詳細な説明付きで分析。APIデバッグとWeb開発に必須。',
  },
  'percentage-calculator': {
    en: 'Calculate percentages, percentage changes, and ratios online for free. Find what percent X is of Y, increase/decrease by percent. Essential for math.',
    zh: '免费在线计算百分比、百分比变化和比率。计算 X 是 Y 的百分之几，按百分比增加/减少。数学和金融必备。',
    es: 'Calcula porcentajes, cambios porcentuales y ratios en línea gratis. Encuentra qué porcentaje es X de Y, aumenta/disminuye por porcentaje. Para matemáticas.',
    pt: 'Calcule porcentagens, mudanças percentuais e proporções online grátis. Encontre qual porcentagem X é de Y, aumente/diminua por porcentagem. Para matemática.',
    ja: 'パーセンテージ、パーセント変化、比率を無料でオンライン計算。XがYの何パーセントか、パーセントで増減を計算。数学と金融に必須。',
  },
  'statistics-calculator': {
    en: 'Calculate statistical measures online for free. Get mean, median, mode, standard deviation, variance, and more. Essential for data analysis and research.',
    zh: '免费在线计算统计指标。获取平均值、中位数、众数、标准差、方差等。数据分析和研究必备。',
    es: 'Calcula medidas estadísticas en línea gratis. Obtén media, mediana, moda, desviación estándar, varianza y más. Esencial para análisis de datos e investigación.',
    pt: 'Calcule medidas estatísticas online grátis. Obtenha média, mediana, moda, desvio padrão, variância e mais. Essencial para análise de dados e pesquisa.',
    ja: '統計指標を無料でオンライン計算。平均、中央値、最頻値、標準偏差、分散などを取得。データ分析と研究に必須。',
  },
  'scientific-calculator': {
    en: 'Free online scientific calculator with sin, cos, tan, log, ln, sqrt, power, and more functions. Support parentheses and complex expressions. For students.',
    zh: '免费在线科学计算器，支持 sin、cos、tan、log、ln、sqrt、幂等函数。支持括号和复杂表达式。学生和工程师必备。',
    es: 'Calculadora científica en línea gratis con sin, cos, tan, log, ln, sqrt, potencia y más funciones. Soporta paréntesis y expresiones complejas. Para estudiantes.',
    pt: 'Calculadora científica online grátis com sin, cos, tan, log, ln, sqrt, potência e mais funções. Suporta parênteses e expressões complexas. Para estudantes.',
    ja: 'sin、cos、tan、log、ln、sqrt、累乗などの関数を備えた無料オンライン科学計算機。括弧と複雑な式に対応。学生とエンジニア向け。',
  },
  'text-sorter': {
    en: 'Sort text lines alphabetically, numerically, naturally, or by length online for free. Support ascending and descending order. Essential for data organization.',
    zh: '免费在线按字母、数字、自然顺序或长度排序文本行。支持升序和降序。数据组织必备。',
    es: 'Ordena líneas de texto alfabéticamente, numéricamente, naturalmente o por longitud en línea gratis. Soporta orden ascendente y descendente.',
    pt: 'Ordene linhas de texto alfabeticamente, numericamente, naturalmente ou por comprimento online grátis. Suporta ordem ascendente e descendente.',
    ja: 'テキスト行をアルファベット順、数値順、自然順、長さ順で無料でオンラインソート。昇順・降順に対応。データ整理に必須。',
  },
  'text-extractor': {
    en: 'Extract emails, URLs, phone numbers, IP addresses, hashtags, and mentions from text online for free. Bulk extraction with one click. Essential for data mining.',
    zh: '免费在线从文本中提取邮箱、URL、电话号码、IP 地址、标签和提及。一键批量提取。数据挖掘必备。',
    es: 'Extrae emails, URLs, teléfonos, direcciones IP, hashtags y menciones del texto en línea gratis. Extracción masiva con un clic. Esencial para minería de datos.',
    pt: 'Extraia emails, URLs, telefones, endereços IP, hashtags e menções do texto online grátis. Extração em massa com um clique. Essencial para mineração de dados.',
    ja: 'テキストからメール、URL、電話番号、IPアドレス、ハッシュタグ、メンションを無料でオンライン抽出。ワンクリックで一括抽出。データマイニングに必須。',
  },
  'emoji-picker': {
    en: 'Browse and copy emojis by category online for free. Search emojis by name with skin tone variants. One-click copy to clipboard. Perfect for social media.',
    zh: '免费在线按类别浏览和复制表情符号。按名称搜索表情符号，支持肤色变体。一键复制到剪贴板。社交媒体和消息必备。',
    es: 'Explora y copia emojis por categoría en línea gratis. Busca emojis por nombre con variantes de tono de piel. Copia con un clic. Perfecto para redes sociales.',
    pt: 'Navegue e copie emojis por categoria online grátis. Pesquise emojis por nome com variantes de tom de pele. Copie com um clique. Perfeito para redes sociais.',
    ja: 'カテゴリ別に絵文字を無料でオンライン閲覧・コピー。肌の色のバリエーション付きで名前で絵文字を検索。ワンクリックでクリップボードにコピー。SNSに最適。',
  },
  'json-to-sql': {
    en: 'Convert JSON data to SQL INSERT statements online for free. Support MySQL, PostgreSQL, SQLite syntax. Bulk insert generation for database import.',
    zh: '免费在线将 JSON 数据转换为 SQL INSERT 语句。支持 MySQL、PostgreSQL、SQLite 语法。批量插入生成用于数据库导入。',
    es: 'Convierte datos JSON a sentencias SQL INSERT en línea gratis. Soporta sintaxis MySQL, PostgreSQL, SQLite. Generación de inserciones masivas para importación.',
    pt: 'Converta dados JSON para instruções SQL INSERT online grátis. Suporta sintaxe MySQL, PostgreSQL, SQLite. Geração de inserções em massa para importação.',
    ja: 'JSONデータをSQL INSERT文に無料でオンライン変換。MySQL、PostgreSQL、SQLite構文に対応。データベースインポート用の一括挿入生成。',
  },
  'image-compressor': {
    en: 'Compress images online for free. Reduce PNG, JPEG, WebP file size with adjustable quality. Batch compression support. Perfect for web optimization.',
    zh: '免费在线压缩图片。调整质量减小 PNG、JPEG、WebP 文件大小。支持批量压缩。Web 优化必备。',
    es: 'Comprime imágenes en línea gratis. Reduce el tamaño de archivos PNG, JPEG, WebP con calidad ajustable. Soporta compresión por lotes. Para optimización web.',
    pt: 'Comprima imagens online grátis. Reduza o tamanho de arquivos PNG, JPEG, WebP com qualidade ajustável. Suporta compressão em lote. Para otimização web.',
    ja: '画像を無料でオンライン圧縮。調整可能な品質でPNG、JPEG、WebPファイルサイズを削減。バッチ圧縮に対応。Web最適化に最適。',
  },
  'image-converter': {
    en: 'Convert images between PNG, JPEG, WebP, and GIF formats online for free. Batch conversion with quality settings. Perfect for web optimization and compatibility.',
    zh: '免费在线转换 PNG、JPEG、WebP、GIF 格式图片。批量转换，支持质量设置。Web 优化和兼容性必备。',
    es: 'Convierte imágenes entre formatos PNG, JPEG, WebP y GIF en línea gratis. Conversión por lotes con ajustes de calidad. Para optimización web y compatibilidad.',
    pt: 'Converta imagens entre formatos PNG, JPEG, WebP e GIF online grátis. Conversão em lote com configurações de qualidade. Para otimização web e compatibilidade.',
    ja: 'PNG、JPEG、WebP、GIF形式間で画像を無料でオンライン変換。品質設定付きのバッチ変換。Web最適化と互換性に最適。',
  },
  'favicon-generator': {
    en: 'Generate favicons in multiple sizes (16x16, 32x32, 48x48, 64x64) online for free. Upload image and download favicon pack. Essential for website branding.',
    zh: '免费在线生成多种尺寸（16x16、32x32、48x48、64x64）的网站图标。上传图片并下载图标包。网站品牌必备。',
    es: 'Genera favicons en múltiples tamaños (16x16, 32x32, 48x48, 64x64) en línea gratis. Sube imagen y descarga paquete de favicon. Esencial para branding.',
    pt: 'Gere favicons em múltiplos tamanhos (16x16, 32x32, 48x48, 64x64) online grátis. Faça upload de imagem e baixe pacote de favicon. Essencial para branding.',
    ja: '複数サイズ（16x16、32x32、48x48、64x64）のファビコンを無料でオンライン生成。画像をアップロードしてファビコンパックをダウンロード。Webサイトブランディングに必須。',
  },
  'image-cropper': {
    en: 'Crop images online for free with custom or preset aspect ratios. Support 1:1, 4:3, 16:9, and freeform cropping. Download cropped image instantly.',
    zh: '免费在线裁剪图片，支持自定义或预设宽高比。支持 1:1、4:3、16:9 和自由裁剪。即时下载裁剪后的图片。',
    es: 'Recorta imágenes en línea gratis con proporciones personalizadas o preestablecidas. Soporta 1:1, 4:3, 16:9 y recorte libre. Descarga al instante.',
    pt: 'Recorte imagens online grátis com proporções personalizadas ou predefinidas. Suporta 1:1, 4:3, 16:9 e recorte livre. Baixe instantaneamente.',
    ja: 'カスタムまたはプリセットのアスペクト比で画像を無料でオンラインクロップ。1:1、4:3、16:9、フリーフォームクロップに対応。クロップした画像を即座にダウンロード。',
  },
  // 第七批工具优化 - 剩余 101 个工具
  'gitignore-generator': {
    en: 'Generate .gitignore files for Node.js, Python, Java, Go, Rust, and more online for free. Select from popular templates and customize rules. Essential for developers.',
    zh: '免费在线生成 Node.js、Python、Java、Go、Rust 等项目的 .gitignore 文件。从流行模板中选择并自定义规则。开发者必备。',
    es: 'Genera archivos .gitignore para Node.js, Python, Java, Go, Rust y más en línea gratis. Selecciona plantillas populares y personaliza reglas. Esencial para devs.',
    pt: 'Gere arquivos .gitignore para Node.js, Python, Java, Go, Rust e mais online grátis. Selecione templates populares e personalize regras. Essencial para devs.',
    ja: 'Node.js、Python、Java、Go、Rustなどの.gitignoreファイルを無料でオンライン生成。人気テンプレートから選択しルールをカスタマイズ。開発者に必須。',
  },
  'docker-compose-generator': {
    en: 'Generate docker-compose.yml files with MySQL, PostgreSQL, Redis, Nginx, and more services online for free. Visual editor with YAML preview. Essential for DevOps.',
    zh: '免费在线生成包含 MySQL、PostgreSQL、Redis、Nginx 等服务的 docker-compose.yml 文件。可视化编辑器，支持 YAML 预览。DevOps 必备。',
    es: 'Genera archivos docker-compose.yml con MySQL, PostgreSQL, Redis, Nginx y más servicios en línea gratis. Editor visual con vista previa YAML. Esencial para DevOps.',
    pt: 'Gere arquivos docker-compose.yml com MySQL, PostgreSQL, Redis, Nginx e mais serviços online grátis. Editor visual com preview YAML. Essencial para DevOps.',
    ja: 'MySQL、PostgreSQL、Redis、Nginxなどのサービスを含むdocker-compose.ymlファイルを無料でオンライン生成。YAMLプレビュー付きビジュアルエディタ。DevOpsに必須。',
  },
  'package-json-generator': {
    en: 'Generate package.json files with custom scripts, dependencies, and configuration online for free. Support npm and yarn. Essential for Node.js project setup.',
    zh: '免费在线生成包含自定义脚本、依赖项和配置的 package.json 文件。支持 npm 和 yarn。Node.js 项目初始化必备。',
    es: 'Genera archivos package.json con scripts personalizados, dependencias y configuración en línea gratis. Soporta npm y yarn. Esencial para proyectos Node.js.',
    pt: 'Gere arquivos package.json com scripts personalizados, dependências e configuração online grátis. Suporta npm e yarn. Essencial para projetos Node.js.',
    ja: 'カスタムスクリプト、依存関係、設定を含むpackage.jsonファイルを無料でオンライン生成。npmとyarnに対応。Node.jsプロジェクトセットアップに必須。',
  },
  'json-minifier': {
    en: 'Minify and compress JSON data online for free. Remove whitespace, comments, and reduce file size significantly. Perfect for API optimization and data transfer.',
    zh: '免费在线压缩 JSON 数据。删除空白、注释，显著减小文件大小。API 优化和数据传输必备。',
    es: 'Minifica y comprime datos JSON en línea gratis. Elimina espacios en blanco, comentarios y reduce el tamaño del archivo. Perfecto para optimización de APIs.',
    pt: 'Minifique e comprima dados JSON online grátis. Remova espaços em branco, comentários e reduza o tamanho do arquivo. Perfeito para otimização de APIs.',
    ja: 'JSONデータを無料でオンラインで圧縮。空白、コメントを削除し、ファイルサイズを大幅に削減。API最適化とデータ転送に最適。',
  },
  'timezone-converter': {
    en: 'Convert time between timezones online for free. World clock with major cities, DST support, and meeting planner. Essential for remote teams and global scheduling.',
    zh: '免费在线转换时区时间。世界时钟，支持主要城市、夏令时和会议规划。远程团队和全球日程安排必备。',
    es: 'Convierte tiempo entre zonas horarias en línea gratis. Reloj mundial con ciudades principales, soporte DST y planificador de reuniones. Esencial para equipos remotos.',
    pt: 'Converta tempo entre fusos horários online grátis. Relógio mundial com cidades principais, suporte DST e planejador de reuniões. Essencial para equipes remotas.',
    ja: 'タイムゾーン間で時間を無料でオンライン変換。主要都市の世界時計、DST対応、会議プランナー。リモートチームとグローバルスケジューリングに必須。',
  },
  'color-contrast-checker': {
    en: 'Check color contrast ratio for WCAG AA and AAA accessibility compliance online for free. Test foreground and background colors. Essential for accessible web design.',
    zh: '免费在线检查 WCAG AA 和 AAA 无障碍合规的颜色对比度。测试前景和背景颜色。无障碍网页设计必备。',
    es: 'Verifica la relación de contraste de colores para cumplimiento WCAG AA y AAA en línea gratis. Prueba colores de primer plano y fondo. Esencial para diseño accesible.',
    pt: 'Verifique a proporção de contraste de cores para conformidade WCAG AA e AAA online grátis. Teste cores de primeiro plano e fundo. Essencial para design acessível.',
    ja: 'WCAG AAおよびAAAアクセシビリティ準拠のカラーコントラスト比を無料でオンラインチェック。前景色と背景色をテスト。アクセシブルWebデザインに必須。',
  },
  'markdown-table-generator': {
    en: 'Generate Markdown tables with visual editor online for free. Live preview, alignment options, and easy copy. Perfect for GitHub README and documentation.',
    zh: '免费在线使用可视化编辑器生成 Markdown 表格。实时预览、对齐选项和轻松复制。GitHub README 和文档必备。',
    es: 'Genera tablas Markdown con editor visual en línea gratis. Vista previa en vivo, opciones de alineación y copia fácil. Perfecto para README de GitHub y documentación.',
    pt: 'Gere tabelas Markdown com editor visual online grátis. Preview ao vivo, opções de alinhamento e cópia fácil. Perfeito para README do GitHub e documentação.',
    ja: 'ビジュアルエディタでMarkdownテーブルを無料でオンライン生成。ライブプレビュー、配置オプション、簡単コピー。GitHub READMEとドキュメントに最適。',
  },
  'base58': {
    en: 'Encode and decode Base58 strings online for free. Used in Bitcoin addresses, IPFS hashes, and cryptocurrency applications. Secure browser-based encoding tool.',
    zh: '免费在线编码和解码 Base58 字符串。用于比特币地址、IPFS 哈希和加密货币应用。安全的浏览器编码工具。',
    es: 'Codifica y decodifica cadenas Base58 en línea gratis. Usado en direcciones Bitcoin, hashes IPFS y aplicaciones de criptomonedas. Herramienta segura en navegador.',
    pt: 'Codifique e decodifique strings Base58 online grátis. Usado em endereços Bitcoin, hashes IPFS e aplicações de criptomoedas. Ferramenta segura no navegador.',
    ja: 'Base58文字列を無料でオンラインでエンコード・デコード。Bitcoinアドレス、IPFSハッシュ、暗号通貨アプリケーションで使用。安全なブラウザベースツール。',
  },
  'meta-tag-generator': {
    en: 'Generate SEO meta tags, Open Graph, and Twitter Card tags online for free. Preview how your page appears in search results and social media shares.',
    zh: '免费在线生成 SEO meta 标签、Open Graph 和 Twitter Card 标签。预览页面在搜索结果和社交媒体分享中的显示效果。',
    es: 'Genera meta tags SEO, Open Graph y Twitter Card en línea gratis. Previsualiza cómo aparece tu página en resultados de búsqueda y redes sociales.',
    pt: 'Gere meta tags SEO, Open Graph e Twitter Card online grátis. Visualize como sua página aparece nos resultados de busca e compartilhamentos sociais.',
    ja: 'SEOメタタグ、Open Graph、Twitter Cardタグを無料でオンライン生成。検索結果とソーシャルメディア共有でのページ表示をプレビュー。',
  },
  'robots-txt-generator': {
    en: 'Generate robots.txt files for your website online for free. Control search engine crawling with allow/disallow rules and sitemap references. Essential for SEO.',
    zh: '免费在线为网站生成 robots.txt 文件。使用允许/禁止规则和站点地图引用控制搜索引擎爬取。SEO 必备。',
    es: 'Genera archivos robots.txt para tu sitio web en línea gratis. Controla el rastreo de motores de búsqueda con reglas allow/disallow y referencias de sitemap.',
    pt: 'Gere arquivos robots.txt para seu site online grátis. Controle o rastreamento de mecanismos de busca com regras allow/disallow e referências de sitemap.',
    ja: 'ウェブサイト用のrobots.txtファイルを無料でオンライン生成。allow/disallowルールとサイトマップ参照で検索エンジンクロールを制御。SEOに必須。',
  },
  'opengraph-preview': {
    en: 'Preview social media share cards for Facebook, Twitter, and LinkedIn online for free. Test Open Graph meta tags and optimize your content for social sharing.',
    zh: '免费在线预览 Facebook、Twitter 和 LinkedIn 的社交媒体分享卡片。测试 Open Graph meta 标签并优化社交分享内容。',
    es: 'Previsualiza tarjetas de compartir en redes sociales para Facebook, Twitter y LinkedIn en línea gratis. Prueba meta tags Open Graph y optimiza tu contenido.',
    pt: 'Visualize cartões de compartilhamento social para Facebook, Twitter e LinkedIn online grátis. Teste meta tags Open Graph e otimize seu conteúdo para compartilhamento.',
    ja: 'Facebook、Twitter、LinkedInのソーシャルメディア共有カードを無料でオンラインプレビュー。Open Graphメタタグをテストし、ソーシャル共有用にコンテンツを最適化。',
  },
  'css-grid-generator': {
    en: 'Generate CSS Grid layouts visually with live preview online for free. Customize rows, columns, gaps, and alignment. Export clean CSS code for your projects.',
    zh: '免费在线可视化生成 CSS Grid 布局，支持实时预览。自定义行、列、间距和对齐方式。导出干净的 CSS 代码。',
    es: 'Genera layouts CSS Grid visualmente con vista previa en vivo en línea gratis. Personaliza filas, columnas, espacios y alineación. Exporta código CSS limpio.',
    pt: 'Gere layouts CSS Grid visualmente com preview ao vivo online grátis. Personalize linhas, colunas, espaçamentos e alinhamento. Exporte código CSS limpo.',
    ja: 'CSS Gridレイアウトをライブプレビュー付きで無料でオンラインで視覚的に生成。行、列、ギャップ、配置をカスタマイズ。クリーンなCSSコードをエクスポート。',
  },
  'css-flexbox-generator': {
    en: 'Generate CSS Flexbox layouts visually with live preview online for free. Customize direction, wrap, justify, and align properties. Export clean CSS code.',
    zh: '免费在线可视化生成 CSS Flexbox 布局，支持实时预览。自定义方向、换行、对齐属性。导出干净的 CSS 代码。',
    es: 'Genera layouts CSS Flexbox visualmente con vista previa en vivo en línea gratis. Personaliza dirección, wrap, justify y align. Exporta código CSS limpio.',
    pt: 'Gere layouts CSS Flexbox visualmente com preview ao vivo online grátis. Personalize direção, wrap, justify e align. Exporte código CSS limpo.',
    ja: 'CSS Flexboxレイアウトをライブプレビュー付きで無料でオンラインで視覚的に生成。方向、wrap、justify、alignプロパティをカスタマイズ。クリーンなCSSコードをエクスポート。',
  },
  'jwt-generator': {
    en: 'Generate JWT tokens with custom claims and HMAC signing online for free. Support HS256, HS384, HS512 algorithms. Essential for API authentication testing.',
    zh: '免费在线生成带有自定义声明和 HMAC 签名的 JWT 令牌。支持 HS256、HS384、HS512 算法。API 认证测试必备。',
    es: 'Genera tokens JWT con claims personalizados y firma HMAC en línea gratis. Soporta algoritmos HS256, HS384, HS512. Esencial para pruebas de autenticación API.',
    pt: 'Gere tokens JWT com claims personalizados e assinatura HMAC online grátis. Suporta algoritmos HS256, HS384, HS512. Essencial para testes de autenticação API.',
    ja: 'カスタムクレームとHMAC署名付きのJWTトークンを無料でオンライン生成。HS256、HS384、HS512アルゴリズムに対応。API認証テストに必須。',
  },
  'cron-explainer': {
    en: 'Understand cron expressions with human-readable explanations online for free. Parse and validate cron syntax with next execution times. Essential for scheduling.',
    zh: '免费在线用人类可读的解释理解 cron 表达式。解析和验证 cron 语法，显示下次执行时间。任务调度必备。',
    es: 'Entiende expresiones cron con explicaciones legibles en línea gratis. Parsea y valida sintaxis cron con próximos tiempos de ejecución. Esencial para programación.',
    pt: 'Entenda expressões cron com explicações legíveis online grátis. Parse e valide sintaxe cron com próximos tempos de execução. Essencial para agendamento.',
    ja: 'cron式を人間が読める説明で無料でオンライン理解。cron構文を解析・検証し、次回実行時間を表示。タスクスケジューリングに必須。',
  },
  'json-to-graphql': {
    en: 'Convert JSON to GraphQL schema types online for free. Generate type definitions, queries, and mutations from JSON data. Essential for GraphQL API development.',
    zh: '免费在线将 JSON 转换为 GraphQL 模式类型。从 JSON 数据生成类型定义、查询和变更。GraphQL API 开发必备。',
    es: 'Convierte JSON a tipos de esquema GraphQL en línea gratis. Genera definiciones de tipos, queries y mutations desde datos JSON. Esencial para desarrollo GraphQL.',
    pt: 'Converta JSON para tipos de schema GraphQL online grátis. Gere definições de tipos, queries e mutations a partir de dados JSON. Essencial para desenvolvimento GraphQL.',
    ja: 'JSONをGraphQLスキーマ型に無料でオンライン変換。JSONデータから型定義、クエリ、ミューテーションを生成。GraphQL API開発に必須。',
  },
  'sql-to-mongo': {
    en: 'Convert SQL queries to MongoDB queries online for free. Transform SELECT, INSERT, UPDATE, DELETE to MongoDB syntax. Essential for database migration.',
    zh: '免费在线将 SQL 查询转换为 MongoDB 查询。将 SELECT、INSERT、UPDATE、DELETE 转换为 MongoDB 语法。数据库迁移必备。',
    es: 'Convierte consultas SQL a consultas MongoDB en línea gratis. Transforma SELECT, INSERT, UPDATE, DELETE a sintaxis MongoDB. Esencial para migración de bases de datos.',
    pt: 'Converta consultas SQL para consultas MongoDB online grátis. Transforme SELECT, INSERT, UPDATE, DELETE para sintaxe MongoDB. Essencial para migração de banco de dados.',
    ja: 'SQLクエリをMongoDBクエリに無料でオンライン変換。SELECT、INSERT、UPDATE、DELETEをMongoDB構文に変換。データベース移行に必須。',
  },
  'json-to-csharp': {
    en: 'Convert JSON to C# classes online for free. Generate POCO classes with properties, JsonProperty attributes, and nullable types. Essential for .NET development.',
    zh: '免费在线将 JSON 转换为 C# 类。生成带有属性、JsonProperty 特性和可空类型的 POCO 类。.NET 开发必备。',
    es: 'Convierte JSON a clases C# en línea gratis. Genera clases POCO con propiedades, atributos JsonProperty y tipos nullable. Esencial para desarrollo .NET.',
    pt: 'Converta JSON para classes C# online grátis. Gere classes POCO com propriedades, atributos JsonProperty e tipos nullable. Essencial para desenvolvimento .NET.',
    ja: 'JSONをC#クラスに無料でオンライン変換。プロパティ、JsonProperty属性、nullable型を持つPOCOクラスを生成。.NET開発に必須。',
  },
  'json-to-rust': {
    en: 'Convert JSON to Rust structs online for free. Generate type-safe Rust code with Serde derive macros and proper field types. Essential for Rust API development.',
    zh: '免费在线将 JSON 转换为 Rust 结构体。生成带有 Serde derive 宏和正确字段类型的类型安全 Rust 代码。Rust API 开发必备。',
    es: 'Convierte JSON a structs Rust en línea gratis. Genera código Rust con tipos seguros, macros Serde derive y tipos de campo correctos. Esencial para desarrollo Rust.',
    pt: 'Converta JSON para structs Rust online grátis. Gere código Rust com tipos seguros, macros Serde derive e tipos de campo corretos. Essencial para desenvolvimento Rust.',
    ja: 'JSONをRust構造体に無料でオンライン変換。Serde deriveマクロと適切なフィールド型を持つ型安全なRustコードを生成。Rust API開発に必須。',
  },
  'json-to-swift': {
    en: 'Convert JSON to Swift structs online for free. Generate Codable structs with proper types and CodingKeys. Essential for iOS and macOS app development.',
    zh: '免费在线将 JSON 转换为 Swift 结构体。生成带有正确类型和 CodingKeys 的 Codable 结构体。iOS 和 macOS 应用开发必备。',
    es: 'Convierte JSON a structs Swift en línea gratis. Genera structs Codable con tipos correctos y CodingKeys. Esencial para desarrollo de apps iOS y macOS.',
    pt: 'Converta JSON para structs Swift online grátis. Gere structs Codable com tipos corretos e CodingKeys. Essencial para desenvolvimento de apps iOS e macOS.',
    ja: 'JSONをSwift構造体に無料でオンライン変換。適切な型とCodingKeysを持つCodable構造体を生成。iOSおよびmacOSアプリ開発に必須。',
  },
};

// 读取并更新消息文件
function updateMessagesFile(locale: string): void {
  const messagesPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
  
  let updatedCount = 0;
  
  // 更新 tools 对象中的 seo_description（审计脚本读取的是这个对象）
  if (messages.tools) {
    for (const [slug, descriptions] of Object.entries(OPTIMIZED_DESCRIPTIONS)) {
      if (messages.tools[slug] && descriptions[locale]) {
        const oldDesc = messages.tools[slug].seo_description;
        const newDesc = descriptions[locale];
        
        if (oldDesc !== newDesc) {
          messages.tools[slug].seo_description = newDesc;
          updatedCount++;
          console.log(`  ✓ ${slug}: ${oldDesc.length} → ${newDesc.length} 字符`);
        }
      }
    }
  }
  
  // 同时更新 tool 对象（如果存在，保持一致性）
  if (messages.tool) {
    for (const [slug, descriptions] of Object.entries(OPTIMIZED_DESCRIPTIONS)) {
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
  console.log('SEO Description 批量更新');
  console.log('='.repeat(60));
  console.log(`\n目标：将 seo_description 优化为 120-160 字符\n`);
  
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
