/**
 * 翻译文件拆分脚本
 * 
 * 将单一大型翻译文件拆分为：
 * - base.json: 基础翻译（site, categories, nav, home, common UI strings）
 * - tools/{slug}.json: 每个工具的独立翻译文件
 * 
 * 用法: npx tsx scripts/split-translations.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// 支持的语言列表
const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 基础翻译的键（这些会保留在 base.json 中）
const BASE_KEYS = [
  'site',
  'categories', 
  'nav',
  'home',
  'footer',
  'common',
  'about',
  'blog',
  'error',
  'errors', // 404 页面等错误信息
  'metadata',
  'theme', // 主题切换
  'tool', // 保留 tool 命名空间（如果存在）
];

// tools 对象中需要保留在 base.json 的通用 UI 键
const TOOLS_BASE_KEYS = [
  'input',
  'output',
  'copy',
  'clear',
  'add',
  'expandAll',
  'collapseAll',
  'generate',
  'convert',
  'format',
  'copied',
  'paste',
  'minify',
  'beautify',
  'encode',
  'decode',
  'download',
  'result',
  'matches',
  'match',
  'length',
  'count',
  'all',
  'new',
  'error',
  'errorEncoding',
  'errorDecoding',
  'errorInvalidInput',
  'errorInvalidJson',
  'errorInvalidBase64',
  'errorInvalidFormat',
  'errorProcessing',
  'invalidCronExpression',
  'inputPlaceholder',
  'outputPlaceholder',
  'searchPlaceholder',
  'toolIntroduction',
  'usageInstructions',
  'usageSteps',
  'usageExamples',
  // UI 命名空间
  'stopwatchUI',
  // 通用子对象
  'regex',
  'password',
  'json',
  'hash',
  'qr',
  'color',
  'timestamp',
  'wordCounter',
  'case',
  'html',
  'markdown',
  'lorem',
  'diff',
  'cron',
  'gradient',
  'unit',
  'chinese',
  'pinyin',
  'sql',
  'minifier',
  'ip',
  'morse',
  'random',
  'yaml',
  'date',
  'encryption',
  'fileHash',
  'table',
  'schema',
  'byte',
  'svg',
  'binary',
  'epoch',
  'cssUnit',
  'statistics',
  'hex',
  'palette',
  'http',
  'dataUri',
  'compare',
  'chmod',
  'barcode',
  'speech',
  'url',
  'xml',
  'wrapper',
  'csv',
  'entity',
  'number',
  'hmac',
  'passwordStrength',
  'totp',
  'userAgent',
  'cidr',
  'httpHeader',
  'percentage',
  'statisticsCalc',
  'scientific',
  'sorter',
  'extractor',
  'emoji',
  'toml',
  'image',
  'imageCompressor',
  'imageConverter',
  'favicon',
  'cropper',
  'gitignore',
  'docker',
  'packageJson',
  'timezone',
  'contrast',
  'markdownTable',
  'meta',
  'robots',
  'opengraph',
  'grid',
  'flexbox',
  'jwt',
  'cronExplainer',
  'graphql',
  'mongo',
  'shadow',
  'radius',
  'ascii',
  'shades',
  'flattener',
  'htmlToMarkdown',
  'regexGen',
  'shortener',
  'viewer',
  'xmlToJson',
  'ipGen',
  'gradientText',
  'sitemap',
  'php',
  'filter',
  'diffPatch',
  'encodingDetector',
  'clipPath',
  'uuidValidator',
  'hashComparator',
  'pathFinder',
  'canvas',
  'escape',
  'animation',
  'caseCounter',
  'dns',
  'imageResizer',
];

interface TranslationObject {
  [key: string]: unknown;
}

/**
 * 判断一个键是否是工具的 slug（包含 name, description 等字段）
 */
function isToolTranslation(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as TranslationObject;
  // 工具翻译通常包含 name 和 description
  return 'name' in obj && 'description' in obj;
}

/**
 * 提取工具的基础信息（除了 detailed_description, usage_steps, usage_examples 之外的所有内容）
 * 这些信息需要保留在 base.json 中供组件使用
 */
function extractToolBasicInfo(toolData: TranslationObject): TranslationObject {
  // 只有这些键会被拆分到单独文件
  const detailedKeys = ['detailed_description', 'usage_steps', 'usage_examples'];
  const basic: TranslationObject = {};
  
  for (const key of Object.keys(toolData)) {
    if (!detailedKeys.includes(key)) {
      basic[key] = toolData[key];
    }
  }
  
  return basic;
}

/**
 * 提取工具的详细信息（detailed_description, usage_steps, usage_examples）
 * 这些信息会拆分到单独的工具文件中，只在工具详情页加载
 */
function extractToolDetailedInfo(toolData: TranslationObject): TranslationObject {
  const detailedKeys = ['detailed_description', 'usage_steps', 'usage_examples'];
  const detailed: TranslationObject = {};
  
  for (const key of detailedKeys) {
    if (key in toolData) {
      detailed[key] = toolData[key];
    }
  }
  
  return detailed;
}

/**
 * 从 tools 对象中提取基础 UI 翻译和工具基础信息
 */
function extractToolsBase(tools: TranslationObject): TranslationObject {
  const base: TranslationObject = {};
  
  for (const key of Object.keys(tools)) {
    const value = tools[key];
    // 如果是基础 UI 键，保留完整内容
    if (TOOLS_BASE_KEYS.includes(key)) {
      base[key] = value;
    } else if (isToolTranslation(value)) {
      // 如果是工具翻译，只保留基础信息（name, description, seo_*）
      base[key] = extractToolBasicInfo(value as TranslationObject);
    } else {
      // 其他内容完整保留
      base[key] = value;
    }
  }
  
  return base;
}

/**
 * 从 tools 对象中提取工具详细翻译（不包含基础信息）
 */
function extractToolTranslations(tools: TranslationObject): Map<string, TranslationObject> {
  const toolTranslations = new Map<string, TranslationObject>();
  
  for (const key of Object.keys(tools)) {
    const value = tools[key];
    // 如果是工具翻译（有 name 和 description），提取详细信息
    if (isToolTranslation(value) && !TOOLS_BASE_KEYS.includes(key)) {
      const detailed = extractToolDetailedInfo(value as TranslationObject);
      // 只有当有详细信息时才创建文件
      if (Object.keys(detailed).length > 0) {
        toolTranslations.set(key, detailed);
      }
    }
  }
  
  return toolTranslations;
}

/**
 * 处理单个语言的翻译文件
 */
function processLocale(locale: string): void {
  const inputPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const outputDir = path.join(process.cwd(), 'src', 'messages', locale);
  const toolsDir = path.join(outputDir, 'tools');
  
  // 检查输入文件是否存在
  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${locale}: ${inputPath} not found`);
    return;
  }
  
  console.log(`📂 Processing ${locale}...`);
  
  // 读取原始翻译文件
  const content = fs.readFileSync(inputPath, 'utf-8');
  const translations: TranslationObject = JSON.parse(content);
  
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(toolsDir)) {
    fs.mkdirSync(toolsDir, { recursive: true });
  }
  
  // 构建 base.json
  const base: TranslationObject = {};
  
  // 复制基础键
  for (const key of BASE_KEYS) {
    if (key in translations) {
      base[key] = translations[key];
    }
  }
  
  // 处理 tools 对象
  if ('tools' in translations && typeof translations.tools === 'object') {
    const toolsObj = translations.tools as TranslationObject;
    
    // 提取基础 UI 翻译
    base.tools = extractToolsBase(toolsObj);
    
    // 提取工具翻译
    const toolTranslations = extractToolTranslations(toolsObj);
    
    // 写入每个工具的翻译文件
    let toolCount = 0;
    for (const [slug, toolData] of toolTranslations) {
      const toolPath = path.join(toolsDir, `${slug}.json`);
      fs.writeFileSync(toolPath, JSON.stringify(toolData, null, 2), 'utf-8');
      toolCount++;
    }
    
    console.log(`   ✅ Extracted ${toolCount} tool translations`);
  }
  
  // 写入 base.json
  const basePath = path.join(outputDir, 'base.json');
  fs.writeFileSync(basePath, JSON.stringify(base, null, 2), 'utf-8');
  
  // 计算文件大小
  const originalSize = Buffer.byteLength(content, 'utf-8');
  const baseSize = Buffer.byteLength(JSON.stringify(base), 'utf-8');
  
  console.log(`   📊 Original: ${(originalSize / 1024).toFixed(1)}KB → Base: ${(baseSize / 1024).toFixed(1)}KB`);
  console.log(`   📁 Output: ${outputDir}`);
}

/**
 * 验证迁移结果
 */
function validateMigration(locale: string): boolean {
  const originalPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const basePath = path.join(process.cwd(), 'src', 'messages', locale, 'base.json');
  const toolsDir = path.join(process.cwd(), 'src', 'messages', locale, 'tools');
  
  if (!fs.existsSync(originalPath) || !fs.existsSync(basePath)) {
    return false;
  }
  
  const original: TranslationObject = JSON.parse(fs.readFileSync(originalPath, 'utf-8'));
  const base: TranslationObject = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
  
  // 重建完整翻译
  const rebuilt: TranslationObject = { ...base };
  
  if (fs.existsSync(toolsDir)) {
    const toolFiles = fs.readdirSync(toolsDir).filter(f => f.endsWith('.json'));
    const toolsObj = (rebuilt.tools || {}) as TranslationObject;
    
    for (const file of toolFiles) {
      const slug = file.replace('.json', '');
      const toolData = JSON.parse(fs.readFileSync(path.join(toolsDir, file), 'utf-8'));
      toolsObj[slug] = toolData;
    }
    
    rebuilt.tools = toolsObj;
  }
  
  // 比较工具数量
  const originalTools = original.tools as TranslationObject || {};
  const rebuiltTools = rebuilt.tools as TranslationObject || {};
  
  const originalToolCount = Object.keys(originalTools).filter(k => isToolTranslation(originalTools[k])).length;
  const rebuiltToolCount = Object.keys(rebuiltTools).filter(k => isToolTranslation(rebuiltTools[k])).length;
  
  if (originalToolCount !== rebuiltToolCount) {
    console.log(`   ⚠️  Tool count mismatch: original=${originalToolCount}, rebuilt=${rebuiltToolCount}`);
    return false;
  }
  
  return true;
}

/**
 * 主函数
 */
function main(): void {
  console.log('🚀 Starting translation split...\n');
  
  for (const locale of LOCALES) {
    processLocale(locale);
    
    // 验证迁移
    if (validateMigration(locale)) {
      console.log(`   ✅ Validation passed\n`);
    } else {
      console.log(`   ⚠️  Validation skipped or failed\n`);
    }
  }
  
  console.log('✨ Translation split complete!');
  console.log('\nNext steps:');
  console.log('1. Update src/i18n/request.ts to use the new loader');
  console.log('2. Update tool pages to load tool-specific translations');
  console.log('3. Test the application thoroughly');
  console.log('4. (Optional) Remove old monolithic translation files');
}

main();
