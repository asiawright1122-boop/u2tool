/**
 * SEO Description 批量更新脚本 - 第三批
 * 修复剩余 20 个过短和 31 个过长的英文描述
 * 
 * 使用方法：npx ts-node scripts/seo-descriptions-batch3.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 修复过短的描述（需要扩展到 120-160 字符）
const SHORT_FIXES: Record<string, Record<string, string>> = {
  'gitignore-generator': {
    en: 'Generate .gitignore files for Node.js, Python, Java, Go, Ruby, and more frameworks online for free. Select templates and customize rules. Essential for clean repositories.',
    zh: '免费在线为 Node.js、Python、Java、Go、Ruby 等框架生成 .gitignore 文件。选择模板并自定义规则。保持仓库整洁必备。',
    es: 'Genera archivos .gitignore para Node.js, Python, Java, Go, Ruby y más frameworks en línea gratis. Selecciona plantillas y personaliza reglas.',
    pt: 'Gere arquivos .gitignore para Node.js, Python, Java, Go, Ruby e mais frameworks online grátis. Selecione templates e personalize regras.',
    ja: 'Node.js、Python、Java、Go、Rubyなどのフレームワーク用の.gitignoreファイルを無料でオンライン生成。テンプレートを選択してルールをカスタマイズ。',
  },
  'docker-compose-generator': {
    en: 'Generate docker-compose.yml files with MySQL, PostgreSQL, Redis, Nginx, and more services online for free. Visual editor with YAML preview and validation.',
    zh: '免费在线生成包含 MySQL、PostgreSQL、Redis、Nginx 等服务的 docker-compose.yml 文件。可视化编辑器，支持 YAML 预览和验证。',
    es: 'Genera archivos docker-compose.yml con MySQL, PostgreSQL, Redis, Nginx y más servicios en línea gratis. Editor visual con preview y validación YAML.',
    pt: 'Gere arquivos docker-compose.yml com MySQL, PostgreSQL, Redis, Nginx e mais serviços online grátis. Editor visual com preview e validação YAML.',
    ja: 'MySQL、PostgreSQL、Redis、Nginxなどのサービスを含むdocker-compose.ymlファイルを無料でオンライン生成。YAMLプレビューと検証付きビジュアルエディタ。',
  },
  'package-json-generator': {
    en: 'Generate package.json files with custom scripts, dependencies, devDependencies, and configuration online for free. Visual editor with npm registry search.',
    zh: '免费在线生成包含自定义脚本、依赖项、开发依赖项和配置的 package.json 文件。可视化编辑器，支持 npm 注册表搜索。',
    es: 'Genera archivos package.json con scripts personalizados, dependencias, devDependencies y configuración en línea gratis. Editor visual con búsqueda npm.',
    pt: 'Gere arquivos package.json com scripts personalizados, dependências, devDependencies e configuração online grátis. Editor visual com busca npm.',
    ja: 'カスタムスクリプト、依存関係、devDependencies、設定を含むpackage.jsonファイルを無料でオンライン生成。npm検索付きビジュアルエディタ。',
  },
  'json-minifier': {
    en: 'Minify and compress JSON data online for free. Remove whitespace, comments, and reduce file size by up to 60%. Essential for API optimization and bandwidth saving.',
    zh: '免费在线压缩 JSON 数据。删除空白、注释，文件大小最多可减少 60%。API 优化和节省带宽必备。',
    es: 'Minifica y comprime datos JSON en línea gratis. Elimina espacios, comentarios y reduce el tamaño hasta un 60%. Esencial para optimización de APIs.',
    pt: 'Minifique e comprima dados JSON online grátis. Remova espaços, comentários e reduza o tamanho em até 60%. Essencial para otimização de APIs.',
    ja: 'JSONデータを無料でオンライン圧縮。空白、コメントを削除し、ファイルサイズを最大60%削減。API最適化と帯域幅節約に必須。',
  },
  'timezone-converter': {
    en: 'Convert time between timezones online for free. World clock with major cities, DST support, and meeting planner. Essential for global team coordination.',
    zh: '免费在线转换时区时间。世界时钟，支持主要城市、夏令时和会议规划。全球团队协调必备。',
    es: 'Convierte tiempo entre zonas horarias en línea gratis. Reloj mundial con ciudades principales, soporte DST y planificador de reuniones.',
    pt: 'Converta tempo entre fusos horários online grátis. Relógio mundial com cidades principais, suporte DST e planejador de reuniões.',
    ja: 'タイムゾーン間の時間を無料でオンライン変換。主要都市、DST対応、会議プランナー付きの世界時計。グローバルチーム調整に必須。',
  },
  'color-contrast-checker': {
    en: 'Check color contrast ratio for WCAG AA and AAA accessibility compliance online for free. Test foreground and background colors with instant pass/fail results.',
    zh: '免费在线检查 WCAG AA 和 AAA 无障碍合规的颜色对比度。测试前景和背景颜色，即时显示通过/失败结果。',
    es: 'Verifica ratio de contraste de color para cumplimiento WCAG AA y AAA en línea gratis. Prueba colores de primer plano y fondo con resultados instantáneos.',
    pt: 'Verifique ratio de contraste de cor para conformidade WCAG AA e AAA online grátis. Teste cores de primeiro plano e fundo com resultados instantâneos.',
    ja: 'WCAG AAおよびAAA準拠のカラーコントラスト比を無料でオンラインチェック。前景色と背景色をテストし、即座に合格/不合格結果を表示。',
  },
  'markdown-table-generator': {
    en: 'Generate Markdown tables with visual editor online for free. Live preview, column alignment options, and CSV import. Perfect for GitHub READMEs and documentation.',
    zh: '免费在线使用可视化编辑器生成 Markdown 表格。实时预览、列对齐选项和 CSV 导入。GitHub README 和文档必备。',
    es: 'Genera tablas Markdown con editor visual en línea gratis. Preview en vivo, opciones de alineación de columnas e importación CSV. Perfecto para READMEs de GitHub.',
    pt: 'Gere tabelas Markdown com editor visual online grátis. Preview ao vivo, opções de alinhamento de colunas e importação CSV. Perfeito para READMEs do GitHub.',
    ja: 'ビジュアルエディタでMarkdownテーブルを無料でオンライン生成。ライブプレビュー、列配置オプション、CSVインポート。GitHub READMEとドキュメントに最適。',
  },
  'base58': {
    en: 'Encode and decode Base58 strings online for free. Used in Bitcoin addresses, IPFS hashes, and cryptocurrency wallets. Secure browser-based encoding tool.',
    zh: '免费在线编码和解码 Base58 字符串。用于比特币地址、IPFS 哈希和加密货币钱包。安全的浏览器编码工具。',
    es: 'Codifica y decodifica cadenas Base58 en línea gratis. Usado en direcciones Bitcoin, hashes IPFS y billeteras de criptomonedas. Herramienta segura en navegador.',
    pt: 'Codifique e decodifique strings Base58 online grátis. Usado em endereços Bitcoin, hashes IPFS e carteiras de criptomoedas. Ferramenta segura no navegador.',
    ja: 'Base58文字列を無料でオンラインでエンコード・デコード。ビットコインアドレス、IPFSハッシュ、暗号通貨ウォレットで使用。安全なブラウザベースツール。',
  },
  'meta-tag-generator': {
    en: 'Generate SEO meta tags, Open Graph, and Twitter Card tags online for free. Preview how your page appears in search results and social media shares.',
    zh: '免费在线生成 SEO meta 标签、Open Graph 和 Twitter Card 标签。预览页面在搜索结果和社交媒体分享中的显示效果。',
    es: 'Genera meta tags SEO, Open Graph y Twitter Card en línea gratis. Previsualiza cómo aparece tu página en resultados de búsqueda y redes sociales.',
    pt: 'Gere meta tags SEO, Open Graph e Twitter Card online grátis. Visualize como sua página aparece em resultados de busca e compartilhamentos sociais.',
    ja: 'SEOメタタグ、Open Graph、Twitter Cardタグを無料でオンライン生成。検索結果とソーシャルメディア共有でのページ表示をプレビュー。',
  },
  'robots-txt-generator': {
    en: 'Generate robots.txt files for your website online for free. Control search engine crawlers with allow/disallow rules, sitemap links, and crawl-delay settings.',
    zh: '免费在线为网站生成 robots.txt 文件。使用允许/禁止规则、站点地图链接和爬取延迟设置控制搜索引擎爬虫。',
    es: 'Genera archivos robots.txt para tu sitio web en línea gratis. Controla rastreadores con reglas allow/disallow, enlaces de sitemap y configuración de crawl-delay.',
    pt: 'Gere arquivos robots.txt para seu site online grátis. Controle rastreadores com regras allow/disallow, links de sitemap e configurações de crawl-delay.',
    ja: 'ウェブサイト用のrobots.txtファイルを無料でオンライン生成。allow/disallowルール、サイトマップリンク、クロール遅延設定で検索エンジンクローラーを制御。',
  },
  'opengraph-preview': {
    en: 'Preview social media share cards for Facebook, Twitter, LinkedIn, and more online for free. Test Open Graph and Twitter Card meta tags before publishing.',
    zh: '免费在线预览 Facebook、Twitter、LinkedIn 等社交媒体分享卡片。发布前测试 Open Graph 和 Twitter Card meta 标签。',
    es: 'Previsualiza tarjetas de compartir en redes sociales para Facebook, Twitter, LinkedIn y más en línea gratis. Prueba meta tags Open Graph y Twitter Card.',
    pt: 'Visualize cartões de compartilhamento social para Facebook, Twitter, LinkedIn e mais online grátis. Teste meta tags Open Graph e Twitter Card antes de publicar.',
    ja: 'Facebook、Twitter、LinkedInなどのソーシャルメディア共有カードを無料でオンラインプレビュー。公開前にOpen GraphとTwitter Cardメタタグをテスト。',
  },
  'css-grid-generator': {
    en: 'Generate CSS Grid layouts visually with live preview online for free. Customize rows, columns, gaps, and alignment. Copy CSS code for responsive web design.',
    zh: '免费在线使用实时预览可视化生成 CSS Grid 布局。自定义行、列、间距和对齐。复制 CSS 代码用于响应式网页设计。',
    es: 'Genera layouts CSS Grid visualmente con preview en vivo en línea gratis. Personaliza filas, columnas, gaps y alineación. Copia código CSS para diseño responsivo.',
    pt: 'Gere layouts CSS Grid visualmente com preview ao vivo online grátis. Personalize linhas, colunas, gaps e alinhamento. Copie código CSS para design responsivo.',
    ja: 'ライブプレビュー付きでCSS Gridレイアウトを無料でオンラインで視覚的に生成。行、列、ギャップ、配置をカスタマイズ。レスポンシブWebデザイン用にCSSコードをコピー。',
  },
  'css-flexbox-generator': {
    en: 'Generate CSS Flexbox layouts visually with live preview online for free. Customize direction, wrap, justify, and align properties. Copy CSS code instantly.',
    zh: '免费在线使用实时预览可视化生成 CSS Flexbox 布局。自定义方向、换行、对齐属性。即时复制 CSS 代码。',
    es: 'Genera layouts CSS Flexbox visualmente con preview en vivo en línea gratis. Personaliza dirección, wrap, justify y propiedades de alineación. Copia código CSS.',
    pt: 'Gere layouts CSS Flexbox visualmente com preview ao vivo online grátis. Personalize direção, wrap, justify e propriedades de alinhamento. Copie código CSS.',
    ja: 'ライブプレビュー付きでCSS Flexboxレイアウトを無料でオンラインで視覚的に生成。方向、ラップ、justify、alignプロパティをカスタマイズ。CSSコードを即座にコピー。',
  },
  'jwt-generator': {
    en: 'Generate JWT tokens with custom claims, expiration, and HMAC/RSA signing online for free. Create access tokens for API authentication and authorization testing.',
    zh: '免费在线生成带有自定义声明、过期时间和 HMAC/RSA 签名的 JWT 令牌。创建用于 API 认证和授权测试的访问令牌。',
    es: 'Genera tokens JWT con claims personalizados, expiración y firma HMAC/RSA en línea gratis. Crea tokens de acceso para pruebas de autenticación de APIs.',
    pt: 'Gere tokens JWT com claims personalizados, expiração e assinatura HMAC/RSA online grátis. Crie tokens de acesso para testes de autenticação de APIs.',
    ja: 'カスタムクレーム、有効期限、HMAC/RSA署名付きのJWTトークンを無料でオンライン生成。API認証と認可テスト用のアクセストークンを作成。',
  },
  'cron-explainer': {
    en: 'Understand cron expressions with human-readable explanations online for free. Parse and validate cron syntax with next execution times. Essential for scheduling.',
    zh: '免费在线使用人类可读的解释理解 cron 表达式。解析和验证 cron 语法，显示下次执行时间。任务调度必备。',
    es: 'Entiende expresiones cron con explicaciones legibles en línea gratis. Parsea y valida sintaxis cron con próximos tiempos de ejecución. Esencial para programación.',
    pt: 'Entenda expressões cron com explicações legíveis online grátis. Parse e valide sintaxe cron com próximos tempos de execução. Essencial para agendamento.',
    ja: '人間が読める説明でcron式を無料でオンラインで理解。次回実行時間付きでcron構文を解析・検証。スケジューリングに必須。',
  },
  'json-to-graphql': {
    en: 'Convert JSON to GraphQL schema types online for free. Generate type definitions, queries, and mutations from JSON data. Essential for GraphQL API development.',
    zh: '免费在线将 JSON 转换为 GraphQL 模式类型。从 JSON 数据生成类型定义、查询和变更。GraphQL API 开发必备。',
    es: 'Convierte JSON a tipos de esquema GraphQL en línea gratis. Genera definiciones de tipos, queries y mutations desde datos JSON. Esencial para desarrollo GraphQL.',
    pt: 'Converta JSON para tipos de schema GraphQL online grátis. Gere definições de tipos, queries e mutations a partir de dados JSON. Essencial para desenvolvimento GraphQL.',
    ja: 'JSONをGraphQLスキーマタイプに無料でオンライン変換。JSONデータから型定義、クエリ、ミューテーションを生成。GraphQL API開発に必須。',
  },
  'sql-to-mongo': {
    en: 'Convert SQL queries to MongoDB queries online for free. Transform SELECT, INSERT, UPDATE, DELETE to find, insertOne, updateOne, deleteOne. Database migration tool.',
    zh: '免费在线将 SQL 查询转换为 MongoDB 查询。将 SELECT、INSERT、UPDATE、DELETE 转换为 find、insertOne、updateOne、deleteOne。数据库迁移工具。',
    es: 'Convierte consultas SQL a consultas MongoDB en línea gratis. Transforma SELECT, INSERT, UPDATE, DELETE a find, insertOne, updateOne, deleteOne. Herramienta de migración.',
    pt: 'Converta consultas SQL para consultas MongoDB online grátis. Transforme SELECT, INSERT, UPDATE, DELETE para find, insertOne, updateOne, deleteOne. Ferramenta de migração.',
    ja: 'SQLクエリをMongoDBクエリに無料でオンライン変換。SELECT、INSERT、UPDATE、DELETEをfind、insertOne、updateOne、deleteOneに変換。データベース移行ツール。',
  },
  'json-to-csharp': {
    en: 'Convert JSON to C# classes with properties, constructors, and JSON serialization attributes online for free. Support nullable types and nested classes.',
    zh: '免费在线将 JSON 转换为带有属性、构造函数和 JSON 序列化特性的 C# 类。支持可空类型和嵌套类。',
    es: 'Convierte JSON a clases C# con propiedades, constructores y atributos de serialización JSON en línea gratis. Soporta tipos nullable y clases anidadas.',
    pt: 'Converta JSON para classes C# com propriedades, construtores e atributos de serialização JSON online grátis. Suporta tipos nullable e classes aninhadas.',
    ja: 'JSONをプロパティ、コンストラクタ、JSONシリアライゼーション属性付きのC#クラスに無料でオンライン変換。null許容型とネストされたクラスに対応。',
  },
  'json-to-rust': {
    en: 'Convert JSON to Rust structs with serde derive macros online for free. Generate type-safe code with Option types for nullable fields. Essential for Rust development.',
    zh: '免费在线将 JSON 转换为带有 serde derive 宏的 Rust 结构体。为可空字段生成带有 Option 类型的类型安全代码。Rust 开发必备。',
    es: 'Convierte JSON a structs Rust con macros serde derive en línea gratis. Genera código type-safe con tipos Option para campos nullable. Esencial para desarrollo Rust.',
    pt: 'Converta JSON para structs Rust com macros serde derive online grátis. Gere código type-safe com tipos Option para campos nullable. Essencial para desenvolvimento Rust.',
    ja: 'JSONをserde deriveマクロ付きのRust構造体に無料でオンライン変換。null許容フィールド用のOption型で型安全なコードを生成。Rust開発に必須。',
  },
  'json-to-swift': {
    en: 'Convert JSON to Swift structs with Codable protocol conformance online for free. Generate type-safe models with CodingKeys for API integration. iOS development tool.',
    zh: '免费在线将 JSON 转换为符合 Codable 协议的 Swift 结构体。生成带有 CodingKeys 的类型安全模型用于 API 集成。iOS 开发工具。',
    es: 'Convierte JSON a structs Swift con conformidad al protocolo Codable en línea gratis. Genera modelos type-safe con CodingKeys para integración de APIs.',
    pt: 'Converta JSON para structs Swift com conformidade ao protocolo Codable online grátis. Gere modelos type-safe com CodingKeys para integração de APIs.',
    ja: 'JSONをCodableプロトコル準拠のSwift構造体に無料でオンライン変換。API統合用のCodingKeys付き型安全モデルを生成。iOS開発ツール。',
  },
};

// 修复过长的描述（需要缩短到 120-160 字符）
const LONG_FIXES: Record<string, Record<string, string>> = {
  'canvas-drawing': {
    en: 'Simple drawing tool with brush and eraser online for free. Customize brush size, color, and opacity. Download artwork as PNG. Perfect for quick sketches.',
    zh: '免费在线简单绘图工具，支持画笔和橡皮擦。自定义画笔大小、颜色和不透明度。下载作品为 PNG 图片。',
    es: 'Herramienta de dibujo simple con pincel y borrador en línea gratis. Personaliza tamaño, color y opacidad. Descarga tu obra como PNG.',
    pt: 'Ferramenta de desenho simples com pincel e borracha online grátis. Personalize tamanho, cor e opacidade. Baixe sua arte como PNG.',
    ja: 'ブラシと消しゴム付きのシンプルな描画ツールを無料でオンライン使用。ブラシサイズ、色、不透明度をカスタマイズ。PNGでダウンロード。',
  },
  'ssl-checker': {
    en: 'Check SSL certificate validity and expiration date online for free. Verify certificate chain, issuer, and security details. Essential for website security.',
    zh: '免费在线检查 SSL 证书有效性和过期日期。验证证书链、颁发者和安全详情。网站安全必备。',
    es: 'Verifica validez y fecha de expiración de certificados SSL en línea gratis. Verifica cadena de certificados, emisor y detalles de seguridad.',
    pt: 'Verifique validade e data de expiração de certificados SSL online grátis. Verifique cadeia de certificados, emissor e detalhes de segurança.',
    ja: 'SSL証明書の有効性と有効期限を無料でオンラインチェック。証明書チェーン、発行者、セキュリティ詳細を検証。Webサイトセキュリティに必須。',
  },
  'whois-lookup': {
    en: 'Look up domain registration and ownership information online for free. Get registrar, creation date, expiration date, and nameservers. Domain research tool.',
    zh: '免费在线查询域名注册和所有权信息。获取注册商、创建日期、过期日期和域名服务器。域名研究工具。',
    es: 'Busca información de registro y propiedad de dominios en línea gratis. Obtén registrador, fecha de creación, expiración y nameservers.',
    pt: 'Pesquise informações de registro e propriedade de domínios online grátis. Obtenha registrador, data de criação, expiração e nameservers.',
    ja: 'ドメイン登録と所有権情報を無料でオンライン検索。レジストラ、作成日、有効期限、ネームサーバーを取得。ドメインリサーチツール。',
  },
  'port-scanner': {
    en: 'Look up common network ports and their services online for free. Search by port number or service name. Reference for network administrators and developers.',
    zh: '免费在线查询常见网络端口及其服务。按端口号或服务名称搜索。网络管理员和开发者参考。',
    es: 'Busca puertos de red comunes y sus servicios en línea gratis. Busca por número de puerto o nombre de servicio. Referencia para administradores.',
    pt: 'Pesquise portas de rede comuns e seus serviços online grátis. Pesquise por número de porta ou nome de serviço. Referência para administradores.',
    ja: '一般的なネットワークポートとそのサービスを無料でオンライン検索。ポート番号またはサービス名で検索。管理者と開発者のリファレンス。',
  },
  'privacy-policy-generator': {
    en: 'Generate a customized privacy policy for your website online for free. Cover data collection, cookies, and user rights. GDPR and CCPA compliant templates.',
    zh: '免费在线为网站生成自定义隐私政策。涵盖数据收集、Cookie 和用户权利。GDPR 和 CCPA 合规模板。',
    es: 'Genera una política de privacidad personalizada para tu sitio web en línea gratis. Cubre recopilación de datos, cookies y derechos de usuarios. Plantillas GDPR.',
    pt: 'Gere uma política de privacidade personalizada para seu site online grátis. Cubra coleta de dados, cookies e direitos dos usuários. Templates GDPR.',
    ja: 'ウェブサイト用のカスタマイズされたプライバシーポリシーを無料でオンライン生成。データ収集、Cookie、ユーザー権利をカバー。GDPR準拠テンプレート。',
  },
  'cookie-policy-generator': {
    en: 'Generate a customized cookie policy for your website online for free. Explain cookie types, purposes, and consent options. GDPR and CCPA compliant.',
    zh: '免费在线为网站生成自定义 Cookie 政策。解释 Cookie 类型、用途和同意选项。GDPR 和 CCPA 合规。',
    es: 'Genera una política de cookies personalizada para tu sitio web en línea gratis. Explica tipos de cookies, propósitos y opciones de consentimiento.',
    pt: 'Gere uma política de cookies personalizada para seu site online grátis. Explique tipos de cookies, propósitos e opções de consentimento.',
    ja: 'ウェブサイト用のカスタマイズされたCookieポリシーを無料でオンライン生成。Cookieの種類、目的、同意オプションを説明。GDPR準拠。',
  },
  'htaccess-generator': {
    en: 'Generate .htaccess configuration for Apache servers online for free. Create redirects, rewrites, security rules, and caching directives. Web hosting essential.',
    zh: '免费在线为 Apache 服务器生成 .htaccess 配置。创建重定向、重写、安全规则和缓存指令。Web 托管必备。',
    es: 'Genera configuración .htaccess para servidores Apache en línea gratis. Crea redirecciones, rewrites, reglas de seguridad y directivas de caché.',
    pt: 'Gere configuração .htaccess para servidores Apache online grátis. Crie redirecionamentos, rewrites, regras de segurança e diretivas de cache.',
    ja: 'Apacheサーバー用の.htaccess設定を無料でオンライン生成。リダイレクト、リライト、セキュリティルール、キャッシュディレクティブを作成。',
  },
  'reading-time-calculator': {
    en: 'Calculate reading time and word count for any text online for free. Get estimates for average, slow, and fast readers. Perfect for content creators.',
    zh: '免费在线计算任何文本的阅读时间和字数。获取平均、慢速和快速读者的估算。内容创作者必备。',
    es: 'Calcula tiempo de lectura y conteo de palabras para cualquier texto en línea gratis. Obtén estimaciones para lectores promedio, lentos y rápidos.',
    pt: 'Calcule tempo de leitura e contagem de palavras para qualquer texto online grátis. Obtenha estimativas para leitores médios, lentos e rápidos.',
    ja: '任意のテキストの読書時間と単語数を無料でオンライン計算。平均、遅い、速い読者の見積もりを取得。コンテンツクリエイターに最適。',
  },
  'twitter-card-generator': {
    en: 'Generate Twitter Card meta tags for rich tweet previews online for free. Support summary, large image, and player cards. Optimize for Twitter sharing.',
    zh: '免费在线生成 Twitter Card meta 标签以获得丰富的推文预览。支持摘要、大图和播放器卡片。优化 Twitter 分享。',
    es: 'Genera meta tags Twitter Card para previsualizaciones de tweets enriquecidas en línea gratis. Soporta tarjetas de resumen, imagen grande y reproductor.',
    pt: 'Gere meta tags Twitter Card para previews de tweets enriquecidos online grátis. Suporta cartões de resumo, imagem grande e player.',
    ja: 'リッチなツイートプレビュー用のTwitter Cardメタタグを無料でオンライン生成。サマリー、大きな画像、プレイヤーカードに対応。',
  },
  'http-status-codes': {
    en: 'Complete reference guide for all HTTP status codes and their meanings. Browse 1xx, 2xx, 3xx, 4xx, and 5xx codes with descriptions. Developer essential.',
    zh: '所有 HTTP 状态码及其含义的完整参考指南。浏览 1xx、2xx、3xx、4xx 和 5xx 代码的描述。开发者必备。',
    es: 'Guía de referencia completa para todos los códigos de estado HTTP y sus significados. Explora códigos 1xx, 2xx, 3xx, 4xx y 5xx con descripciones.',
    pt: 'Guia de referência completo para todos os códigos de status HTTP e seus significados. Navegue por códigos 1xx, 2xx, 3xx, 4xx e 5xx com descrições.',
    ja: 'すべてのHTTPステータスコードとその意味の完全リファレンスガイド。1xx、2xx、3xx、4xx、5xxコードの説明を閲覧。開発者必須。',
  },
  'string-obfuscator': {
    en: 'Obfuscate strings using Base64, Hex, HTML Entities, URL encoding, and ROT13 online for free. Multiple encoding layers for protection. For testing purposes.',
    zh: '免费在线使用 Base64、Hex、HTML 实体、URL 编码和 ROT13 混淆字符串。多层编码保护。用于测试目的。',
    es: 'Ofusca cadenas usando Base64, Hex, Entidades HTML, codificación URL y ROT13 en línea gratis. Múltiples capas de codificación para protección.',
    pt: 'Ofusque strings usando Base64, Hex, Entidades HTML, codificação URL e ROT13 online grátis. Múltiplas camadas de codificação para proteção.',
    ja: 'Base64、Hex、HTMLエンティティ、URLエンコーディング、ROT13を使用して文字列を無料でオンライン難読化。保護のための複数のエンコーディングレイヤー。',
  },
  'list-randomizer': {
    en: 'Shuffle and randomize lists of items or names online for free. Perfect for random selection, lottery draws, and fair ordering. Secure randomization.',
    zh: '免费在线打乱和随机化项目或名称列表。适用于随机选择、抽奖和公平排序。安全随机化。',
    es: 'Mezcla y aleatoriza listas de elementos o nombres en línea gratis. Perfecto para selección aleatoria, sorteos y ordenamiento justo. Aleatorización segura.',
    pt: 'Embaralhe e randomize listas de itens ou nomes online grátis. Perfeito para seleção aleatória, sorteios e ordenação justa. Randomização segura.',
    ja: 'アイテムや名前のリストを無料でオンラインでシャッフル・ランダム化。ランダム選択、抽選、公平な順序付けに最適。安全なランダム化。',
  },
  'sql-generator': {
    en: 'Generate SQL queries for SELECT, INSERT, UPDATE, DELETE, and CREATE TABLE online for free. Visual query builder with syntax highlighting. For all databases.',
    zh: '免费在线生成 SELECT、INSERT、UPDATE、DELETE 和 CREATE TABLE 的 SQL 查询。可视化查询构建器，支持语法高亮。',
    es: 'Genera consultas SQL para SELECT, INSERT, UPDATE, DELETE y CREATE TABLE en línea gratis. Constructor visual de consultas con resaltado de sintaxis.',
    pt: 'Gere consultas SQL para SELECT, INSERT, UPDATE, DELETE e CREATE TABLE online grátis. Construtor visual de consultas com destaque de sintaxe.',
    ja: 'SELECT、INSERT、UPDATE、DELETE、CREATE TABLEのSQLクエリを無料でオンライン生成。シンタックスハイライト付きビジュアルクエリビルダー。',
  },
  'js-obfuscator': {
    en: 'Obfuscate and protect JavaScript code online for free. Rename variables, encode strings, and add dead code. Protect intellectual property from reverse engineering.',
    zh: '免费在线混淆和保护 JavaScript 代码。重命名变量、编码字符串并添加死代码。保护知识产权免受逆向工程。',
    es: 'Ofusca y protege código JavaScript en línea gratis. Renombra variables, codifica cadenas y añade código muerto. Protege tu propiedad intelectual.',
    pt: 'Ofusque e proteja código JavaScript online grátis. Renomeie variáveis, codifique strings e adicione código morto. Proteja sua propriedade intelectual.',
    ja: 'JavaScriptコードを無料でオンラインで難読化・保護。変数名の変更、文字列のエンコード、デッドコードの追加。知的財産を保護。',
  },
  'audio-to-base64': {
    en: 'Convert audio files to Base64 encoding online for free. Support MP3, WAV, OGG formats. Embed audio in HTML, JSON, or data URIs. Browser-based processing.',
    zh: '免费在线将音频文件转换为 Base64 编码。支持 MP3、WAV、OGG 格式。在 HTML、JSON 或数据 URI 中嵌入音频。',
    es: 'Convierte archivos de audio a codificación Base64 en línea gratis. Soporta MP3, WAV, OGG. Incrusta audio en HTML, JSON o URIs de datos.',
    pt: 'Converta arquivos de áudio para codificação Base64 online grátis. Suporta MP3, WAV, OGG. Incorpore áudio em HTML, JSON ou URIs de dados.',
    ja: '音声ファイルをBase64エンコーディングに無料でオンライン変換。MP3、WAV、OGG形式に対応。HTML、JSON、データURIに音声を埋め込み。',
  },
  'ascii-table': {
    en: 'Complete ASCII table with decimal, hex, octal, and binary values. Browse all 128 ASCII characters with descriptions. Essential reference for programmers.',
    zh: '完整的 ASCII 表，包含十进制、十六进制、八进制和二进制值。浏览所有 128 个 ASCII 字符及其描述。程序员必备参考。',
    es: 'Tabla ASCII completa con valores decimales, hex, octales y binarios. Explora los 128 caracteres ASCII con descripciones. Referencia esencial.',
    pt: 'Tabela ASCII completa com valores decimais, hex, octais e binários. Navegue por todos os 128 caracteres ASCII com descrições. Referência essencial.',
    ja: '10進数、16進数、8進数、2進数値を含む完全なASCIIテーブル。説明付きの128個すべてのASCII文字を閲覧。プログラマー必須リファレンス。',
  },
  'css-variables-generator': {
    en: 'Generate CSS custom properties with visual color picker and export to CSS, SCSS, or JavaScript. Create design tokens for consistent theming across projects.',
    zh: '使用可视化颜色选择器生成 CSS 自定义属性，导出为 CSS、SCSS 或 JavaScript。创建设计令牌以实现项目间一致的主题。',
    es: 'Genera propiedades CSS personalizadas con selector de color visual y exporta a CSS, SCSS o JavaScript. Crea tokens de diseño para temas consistentes.',
    pt: 'Gere propriedades CSS personalizadas com seletor de cores visual e exporte para CSS, SCSS ou JavaScript. Crie tokens de design para temas consistentes.',
    ja: 'ビジュアルカラーピッカーでCSSカスタムプロパティを生成し、CSS、SCSS、JavaScriptにエクスポート。一貫したテーマのためのデザイントークンを作成。',
  },
  'lorem-picsum': {
    en: 'Generate random placeholder images with custom dimensions, grayscale, and blur effects. Perfect for mockups, wireframes, and web design prototyping.',
    zh: '生成自定义尺寸、灰度和模糊效果的随机占位图片。适用于模型、线框图和网页设计原型。',
    es: 'Genera imágenes de marcador de posición aleatorias con dimensiones personalizadas, escala de grises y efectos de desenfoque. Perfecto para maquetas.',
    pt: 'Gere imagens de placeholder aleatórias com dimensões personalizadas, escala de cinza e efeitos de desfoque. Perfeito para mockups e protótipos.',
    ja: 'カスタムサイズ、グレースケール、ブラー効果付きのランダムプレースホルダー画像を生成。モックアップとプロトタイピングに最適。',
  },
  'regex-escape': {
    en: 'Escape special characters for use in regular expressions online for free. Handle metacharacters like . * + ? ^ $ { } [ ] \\ | ( ). Essential for patterns.',
    zh: '免费在线转义正则表达式中使用的特殊字符。处理元字符如 . * + ? ^ $ { } [ ] \\ | ( )。模式构建必备。',
    es: 'Escapa caracteres especiales para uso en expresiones regulares en línea gratis. Maneja metacaracteres como . * + ? ^ $ { } [ ] \\ | ( ).',
    pt: 'Escape caracteres especiais para uso em expressões regulares online grátis. Lide com metacaracteres como . * + ? ^ $ { } [ ] \\ | ( ).',
    ja: '正規表現で使用する特殊文字を無料でオンラインでエスケープ。. * + ? ^ $ { } [ ] \\ | ( ) などのメタ文字を処理。',
  },
  'html-to-text': {
    en: 'Convert HTML to plain text, removing all tags and preserving content structure. Handle links, lists, and tables intelligently. For content extraction.',
    zh: '将 HTML 转换为纯文本，删除所有标签并保留内容结构。智能处理链接、列表和表格。内容提取必备。',
    es: 'Convierte HTML a texto plano, eliminando todas las etiquetas y preservando la estructura del contenido. Maneja enlaces, listas y tablas.',
    pt: 'Converta HTML para texto simples, removendo todas as tags e preservando a estrutura do conteúdo. Lide com links, listas e tabelas.',
    ja: 'HTMLをプレーンテキストに変換し、すべてのタグを削除してコンテンツ構造を保持。リンク、リスト、テーブルをインテリジェントに処理。',
  },
  'binary-to-decimal': {
    en: 'Convert binary to decimal, decimal to binary, binary to hex, and hex to binary online for free. Support large numbers and instant conversion. For programmers.',
    zh: '免费在线转换二进制到十进制、十进制到二进制、二进制到十六进制、十六进制到二进制。支持大数字和即时转换。',
    es: 'Convierte binario a decimal, decimal a binario, binario a hex y hex a binario en línea gratis. Soporta números grandes y conversión instantánea.',
    pt: 'Converta binário para decimal, decimal para binário, binário para hex e hex para binário online grátis. Suporta números grandes.',
    ja: '2進数から10進数、10進数から2進数、2進数から16進数、16進数から2進数を無料でオンライン変換。大きな数値と即時変換に対応。',
  },
  'octal-converter': {
    en: 'Convert octal to decimal, binary, and hex online for free. Also convert from decimal, binary, or hex to octal. Essential for Unix permissions and programming.',
    zh: '免费在线将八进制转换为十进制、二进制和十六进制。也可从十进制、二进制或十六进制转换为八进制。Unix 权限和编程必备。',
    es: 'Convierte octal a decimal, binario y hex en línea gratis. También convierte de decimal, binario o hex a octal. Esencial para permisos Unix.',
    pt: 'Converta octal para decimal, binário e hex online grátis. Também converta de decimal, binário ou hex para octal. Essencial para permissões Unix.',
    ja: '8進数から10進数、2進数、16進数に無料でオンライン変換。10進数、2進数、16進数から8進数への変換も可能。Unixパーミッションに必須。',
  },
  'text-to-nato': {
    en: 'Convert letters and numbers to NATO phonetic alphabet words online for free. Alpha, Bravo, Charlie format for clear communication. For radio and phone.',
    zh: '免费在线将字母和数字转换为 NATO 音标字母单词。Alpha、Bravo、Charlie 格式用于清晰通信。无线电和电话必备。',
    es: 'Convierte letras y números a palabras del alfabeto fonético NATO en línea gratis. Formato Alpha, Bravo, Charlie para comunicación clara.',
    pt: 'Converta letras e números para palavras do alfabeto fonético NATO online grátis. Formato Alpha, Bravo, Charlie para comunicação clara.',
    ja: '文字と数字をNATOフォネティックアルファベットの単語に無料でオンライン変換。明確なコミュニケーションのためのAlpha、Bravo、Charlie形式。',
  },
  'mac-address-generator': {
    en: 'Generate random MAC addresses with prefix, separator, and bit flag options. Support unicast/multicast and universal/local flags. For testing and development.',
    zh: '生成带有前缀、分隔符和位标志选项的随机 MAC 地址。支持单播/多播和通用/本地标志。测试和开发必备。',
    es: 'Genera direcciones MAC aleatorias con opciones de prefijo, separador y flags de bits. Soporta flags unicast/multicast y universal/local.',
    pt: 'Gere endereços MAC aleatórios com opções de prefixo, separador e flags de bits. Suporta flags unicast/multicast e universal/local.',
    ja: 'プレフィックス、セパレータ、ビットフラグオプション付きのランダムMACアドレスを生成。ユニキャスト/マルチキャストフラグに対応。',
  },
  'curl-to-code': {
    en: 'Convert cURL commands to JavaScript, Python, PHP, Go, Java, C#, Ruby and Rust code online for free. Parse requests with headers, body, and authentication.',
    zh: '免费在线将 cURL 命令转换为 JavaScript、Python、PHP、Go、Java、C#、Ruby 和 Rust 代码。解析带有头、正文和认证的请求。',
    es: 'Convierte comandos cURL a código JavaScript, Python, PHP, Go, Java, C#, Ruby y Rust en línea gratis. Parsea solicitudes con headers y body.',
    pt: 'Converta comandos cURL para código JavaScript, Python, PHP, Go, Java, C#, Ruby e Rust online grátis. Parse requisições com headers e body.',
    ja: 'cURLコマンドをJavaScript、Python、PHP、Go、Java、C#、Ruby、Rustコードに無料でオンライン変換。ヘッダー、ボディ、認証を解析。',
  },
  'ip-validator': {
    en: 'Validate IPv4 and IPv6 addresses online for free. Check if IP is private, loopback, multicast, or reserved. Get detailed information about any IP format.',
    zh: '免费在线验证 IPv4 和 IPv6 地址。检查 IP 是否为私有、回环、多播或保留地址。获取任何 IP 格式的详细信息。',
    es: 'Valida direcciones IPv4 e IPv6 en línea gratis. Verifica si la IP es privada, loopback, multicast o reservada. Obtén información detallada.',
    pt: 'Valide endereços IPv4 e IPv6 online grátis. Verifique se o IP é privado, loopback, multicast ou reservado. Obtenha informações detalhadas.',
    ja: 'IPv4およびIPv6アドレスを無料でオンライン検証。IPがプライベート、ループバック、マルチキャスト、予約済みかどうかをチェック。',
  },
  'text-template': {
    en: 'Simple text template engine. Replace {{ variables }} with values from your data. Support loops, conditionals, and nested objects. For generating dynamic content.',
    zh: '简单的文本模板引擎。用数据中的值替换 {{ 变量 }}。支持循环、条件和嵌套对象。生成动态内容必备。',
    es: 'Motor de plantillas de texto simple. Reemplaza {{ variables }} con valores de tus datos. Soporta bucles, condicionales y objetos anidados.',
    pt: 'Motor de templates de texto simples. Substitua {{ variáveis }} por valores dos seus dados. Suporta loops, condicionais e objetos aninhados.',
    ja: 'シンプルなテキストテンプレートエンジン。{{ 変数 }} をデータの値で置換。ループ、条件、ネストされたオブジェクトに対応。',
  },
  'base-calculator': {
    en: 'Calculate in binary, octal, decimal, and hexadecimal. Supports arithmetic and bitwise operations like AND, OR, XOR, NOT, shift. For low-level programming.',
    zh: '在二进制、八进制、十进制和十六进制中计算。支持算术和位运算如 AND、OR、XOR、NOT、移位。底层编程必备。',
    es: 'Calcula en binario, octal, decimal y hexadecimal. Soporta operaciones aritméticas y de bits como AND, OR, XOR, NOT, shift.',
    pt: 'Calcule em binário, octal, decimal e hexadecimal. Suporta operações aritméticas e de bits como AND, OR, XOR, NOT, shift.',
    ja: '2進数、8進数、10進数、16進数で計算。AND、OR、XOR、NOT、シフトなどの算術演算とビット演算に対応。',
  },
  'color-name-finder': {
    en: 'Find the closest named color for any hex color value. Browse CSS color names, X11 colors, and web-safe colors. For designers and accessibility compliance.',
    zh: '为任何十六进制颜色值查找最接近的命名颜色。浏览 CSS 颜色名称、X11 颜色和网页安全颜色。设计师和无障碍合规必备。',
    es: 'Encuentra el color con nombre más cercano para cualquier valor hex. Explora nombres de colores CSS, X11 y colores web-safe. Para diseñadores.',
    pt: 'Encontre a cor nomeada mais próxima para qualquer valor hex. Navegue por nomes de cores CSS, X11 e cores web-safe. Para designers.',
    ja: '任意の16進数カラー値に最も近い名前付きカラーを検索。CSSカラー名、X11カラー、Webセーフカラーを閲覧。デザイナー向け。',
  },
  'char-frequency': {
    en: 'Analyze character frequency and distribution in text. Get counts, percentages, and visual charts for each character. For cryptography and text analysis.',
    zh: '分析文本中的字符频率和分布。获取每个字符的计数、百分比和可视化图表。加密和文本分析必备。',
    es: 'Analiza frecuencia y distribución de caracteres en texto. Obtén conteos, porcentajes y gráficos visuales para cada carácter. Para criptografía.',
    pt: 'Analise frequência e distribuição de caracteres em texto. Obtenha contagens, porcentagens e gráficos visuais para cada caractere. Para criptografia.',
    ja: 'テキスト内の文字頻度と分布を分析。各文字のカウント、パーセンテージ、ビジュアルチャートを取得。暗号化とテキスト分析向け。',
  },
  'json-to-dart': {
    en: 'Convert JSON to Dart class code with factory constructors and serialization methods. Support null safety and nested classes. For Flutter app development.',
    zh: '将 JSON 转换为带有工厂构造函数和序列化方法的 Dart 类代码。支持空安全和嵌套类。Flutter 应用开发必备。',
    es: 'Convierte JSON a código de clase Dart con constructores factory y métodos de serialización. Soporta null safety y clases anidadas. Para Flutter.',
    pt: 'Converta JSON para código de classe Dart com construtores factory e métodos de serialização. Suporta null safety e classes aninhadas. Para Flutter.',
    ja: 'JSONをファクトリコンストラクタとシリアライゼーションメソッド付きのDartクラスコードに変換。null安全とネストされたクラスに対応。',
  },
};

// 合并所有修复
const ALL_FIXES = { ...SHORT_FIXES, ...LONG_FIXES };

// 读取并更新消息文件
function updateMessagesFile(locale: string): void {
  const messagesPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
  
  let updatedCount = 0;
  
  // 更新 tools 对象中的 seo_description
  if (messages.tools) {
    for (const [slug, descriptions] of Object.entries(ALL_FIXES)) {
      const desc = descriptions as Record<string, string>;
      if (messages.tools[slug] && desc[locale]) {
        const oldDesc = messages.tools[slug].seo_description;
        const newDesc = desc[locale];
        
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
    for (const [slug, descriptions] of Object.entries(ALL_FIXES)) {
      const desc = descriptions as Record<string, string>;
      if (messages.tool[slug] && desc[locale]) {
        messages.tool[slug].seo_description = desc[locale];
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
  console.log('SEO Description 批量更新 - 第三批（修复过短和过长）');
  console.log('='.repeat(60));
  console.log(`\n目标：将所有 seo_description 调整为 120-160 字符\n`);
  
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
