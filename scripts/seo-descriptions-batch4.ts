/**
 * SEO Description 批量更新脚本 - 第四批
 * 修复最后 9 个过长的英文描述
 * 
 * 使用方法：npx ts-node scripts/seo-descriptions-batch4.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 修复过长的描述（缩短到 120-160 字符）
const FINAL_FIXES: Record<string, Record<string, string>> = {
  'gitignore-generator': {
    en: 'Generate .gitignore files for Node.js, Python, Java, Go, Ruby, and more online for free. Select templates and customize rules. Keep repositories clean.',
    zh: '免费在线为 Node.js、Python、Java、Go、Ruby 等生成 .gitignore 文件。选择模板并自定义规则。保持仓库整洁。',
    es: 'Genera archivos .gitignore para Node.js, Python, Java, Go, Ruby y más en línea gratis. Selecciona plantillas y personaliza reglas.',
    pt: 'Gere arquivos .gitignore para Node.js, Python, Java, Go, Ruby e mais online grátis. Selecione templates e personalize regras.',
    ja: 'Node.js、Python、Java、Go、Rubyなど用の.gitignoreファイルを無料でオンライン生成。テンプレートを選択してルールをカスタマイズ。',
  },
  'json-minifier': {
    en: 'Minify and compress JSON data online for free. Remove whitespace and comments, reduce file size by up to 60%. Essential for API optimization.',
    zh: '免费在线压缩 JSON 数据。删除空白和注释，文件大小最多可减少 60%。API 优化必备。',
    es: 'Minifica y comprime datos JSON en línea gratis. Elimina espacios y comentarios, reduce el tamaño hasta un 60%. Esencial para APIs.',
    pt: 'Minifique e comprima dados JSON online grátis. Remova espaços e comentários, reduza o tamanho em até 60%. Essencial para APIs.',
    ja: 'JSONデータを無料でオンライン圧縮。空白とコメントを削除し、ファイルサイズを最大60%削減。API最適化に必須。',
  },
  'markdown-table-generator': {
    en: 'Generate Markdown tables with visual editor online for free. Live preview, column alignment, and CSV import. Perfect for GitHub READMEs and docs.',
    zh: '免费在线使用可视化编辑器生成 Markdown 表格。实时预览、列对齐和 CSV 导入。GitHub README 和文档必备。',
    es: 'Genera tablas Markdown con editor visual en línea gratis. Preview en vivo, alineación de columnas e importación CSV. Para READMEs de GitHub.',
    pt: 'Gere tabelas Markdown com editor visual online grátis. Preview ao vivo, alinhamento de colunas e importação CSV. Para READMEs do GitHub.',
    ja: 'ビジュアルエディタでMarkdownテーブルを無料でオンライン生成。ライブプレビュー、列配置、CSVインポート。GitHub READMEに最適。',
  },
  'cron-explainer': {
    en: 'Understand cron expressions with human-readable explanations online for free. Parse and validate cron syntax with next execution times. For scheduling.',
    zh: '免费在线使用人类可读的解释理解 cron 表达式。解析和验证 cron 语法，显示下次执行时间。任务调度必备。',
    es: 'Entiende expresiones cron con explicaciones legibles en línea gratis. Parsea y valida sintaxis cron con próximos tiempos de ejecución.',
    pt: 'Entenda expressões cron com explicações legíveis online grátis. Parse e valide sintaxe cron com próximos tempos de execução.',
    ja: '人間が読める説明でcron式を無料でオンラインで理解。次回実行時間付きでcron構文を解析・検証。スケジューリング向け。',
  },
  'sql-to-mongo': {
    en: 'Convert SQL queries to MongoDB queries online for free. Transform SELECT, INSERT, UPDATE, DELETE to find, insertOne, updateOne. Database migration tool.',
    zh: '免费在线将 SQL 查询转换为 MongoDB 查询。将 SELECT、INSERT、UPDATE、DELETE 转换为 find、insertOne、updateOne。数据库迁移工具。',
    es: 'Convierte consultas SQL a consultas MongoDB en línea gratis. Transforma SELECT, INSERT, UPDATE, DELETE a find, insertOne, updateOne.',
    pt: 'Converta consultas SQL para consultas MongoDB online grátis. Transforme SELECT, INSERT, UPDATE, DELETE para find, insertOne, updateOne.',
    ja: 'SQLクエリをMongoDBクエリに無料でオンライン変換。SELECT、INSERT、UPDATE、DELETEをfind、insertOne、updateOneに変換。',
  },
  'json-to-rust': {
    en: 'Convert JSON to Rust structs with serde derive macros online for free. Generate type-safe code with Option types for nullable fields. For Rust development.',
    zh: '免费在线将 JSON 转换为带有 serde derive 宏的 Rust 结构体。为可空字段生成带有 Option 类型的类型安全代码。',
    es: 'Convierte JSON a structs Rust con macros serde derive en línea gratis. Genera código type-safe con tipos Option para campos nullable.',
    pt: 'Converta JSON para structs Rust com macros serde derive online grátis. Gere código type-safe com tipos Option para campos nullable.',
    ja: 'JSONをserde deriveマクロ付きのRust構造体に無料でオンライン変換。null許容フィールド用のOption型で型安全なコードを生成。',
  },
  'json-to-swift': {
    en: 'Convert JSON to Swift structs with Codable protocol conformance online for free. Generate type-safe models with CodingKeys for API integration.',
    zh: '免费在线将 JSON 转换为符合 Codable 协议的 Swift 结构体。生成带有 CodingKeys 的类型安全模型用于 API 集成。',
    es: 'Convierte JSON a structs Swift con conformidad al protocolo Codable en línea gratis. Genera modelos type-safe con CodingKeys para APIs.',
    pt: 'Converta JSON para structs Swift com conformidade ao protocolo Codable online grátis. Gere modelos type-safe com CodingKeys para APIs.',
    ja: 'JSONをCodableプロトコル準拠のSwift構造体に無料でオンライン変換。API統合用のCodingKeys付き型安全モデルを生成。',
  },
  'js-obfuscator': {
    en: 'Obfuscate and protect JavaScript code online for free. Rename variables, encode strings, and add dead code. Protect your intellectual property.',
    zh: '免费在线混淆和保护 JavaScript 代码。重命名变量、编码字符串并添加死代码。保护您的知识产权。',
    es: 'Ofusca y protege código JavaScript en línea gratis. Renombra variables, codifica cadenas y añade código muerto. Protege tu propiedad intelectual.',
    pt: 'Ofusque e proteja código JavaScript online grátis. Renomeie variáveis, codifique strings e adicione código morto. Proteja sua propriedade intelectual.',
    ja: 'JavaScriptコードを無料でオンラインで難読化・保護。変数名の変更、文字列のエンコード、デッドコードの追加。知的財産を保護。',
  },
  'text-template': {
    en: 'Simple text template engine. Replace {{ variables }} with values from your data. Support loops, conditionals, and nested objects. Generate dynamic content.',
    zh: '简单的文本模板引擎。用数据中的值替换 {{ 变量 }}。支持循环、条件和嵌套对象。生成动态内容。',
    es: 'Motor de plantillas de texto simple. Reemplaza {{ variables }} con valores de tus datos. Soporta bucles, condicionales y objetos anidados.',
    pt: 'Motor de templates de texto simples. Substitua {{ variáveis }} por valores dos seus dados. Suporta loops, condicionais e objetos aninhados.',
    ja: 'シンプルなテキストテンプレートエンジン。{{ 変数 }} をデータの値で置換。ループ、条件、ネストされたオブジェクトに対応。',
  },
};

// 读取并更新消息文件
function updateMessagesFile(locale: string): void {
  const messagesPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));
  
  let updatedCount = 0;
  
  if (messages.tools) {
    for (const [slug, descriptions] of Object.entries(FINAL_FIXES)) {
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
  
  if (messages.tool) {
    for (const [slug, descriptions] of Object.entries(FINAL_FIXES)) {
      const desc = descriptions as Record<string, string>;
      if (messages.tool[slug] && desc[locale]) {
        messages.tool[slug].seo_description = desc[locale];
      }
    }
  }
  
  fs.writeFileSync(messagesPath, JSON.stringify(messages, null, 2) + '\n', 'utf-8');
  console.log(`  共更新 ${updatedCount} 个工具的 seo_description\n`);
}

function main(): void {
  console.log('='.repeat(60));
  console.log('SEO Description 批量更新 - 第四批（最终修复）');
  console.log('='.repeat(60));
  
  const locales = ['en', 'zh', 'es', 'pt', 'ja'];
  
  for (const locale of locales) {
    console.log(`📝 更新 ${locale}.json:`);
    updateMessagesFile(locale);
  }
  
  console.log('='.repeat(60));
  console.log('✅ 更新完成！');
  console.log('='.repeat(60));
}

main();
