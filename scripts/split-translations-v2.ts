#!/usr/bin/env npx tsx
/**
 * 翻译文件拆分脚本 v2
 * 
 * 将大型翻译文件拆分为按需加载的小文件：
 * - core.json: 核心翻译（每个页面都需要）
 * - tools-index.json: 工具列表元数据
 * - tools/{slug}.json: 工具详细内容
 * - static/{page}.json: 静态页面内容
 * 
 * 使用方法：
 *   npx tsx scripts/split-translations-v2.ts
 *   npx tsx scripts/split-translations-v2.ts --dry-run  # 仅分析，不写入
 *   npx tsx scripts/split-translations-v2.ts --locale en  # 仅处理指定语言
 */

import * as fs from 'fs';
import * as path from 'path';

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const MESSAGES_DIR = 'src/messages';

// 核心翻译键（每个页面都需要）
const CORE_KEYS = [
  'site',
  'nav',
  'footer',
  'theme',
  'errors',
  'common',
  'home',
  'categories',
  'countries',
];

// 工具通用 UI 键（字符串类型的 tools.* 键）
const TOOLS_UI_KEYS = [
  'popular', 'input', 'output', 'copy', 'clear', 'add',
  'expandAll', 'collapseAll', 'generate', 'convert', 'format',
  'download', 'upload', 'reset', 'save', 'delete', 'edit',
  'preview', 'settings', 'options', 'result', 'error', 'success',
  'loading', 'processing', 'done', 'cancel', 'confirm', 'close',
  'inputPlaceholder', 'outputPlaceholder', 'copied', 'copyFailed',
];

// 静态页面键
const STATIC_PAGE_KEYS = ['privacy', 'terms', 'about', 'blog'];

// SEO 相关键
const SEO_KEYS = ['categories_seo', 'ranking_seo', 'pages'];

interface SplitResult {
  locale: string;
  core: Record<string, unknown>;
  toolsIndex: Record<string, unknown>;
  toolsDetail: Record<string, Record<string, unknown>>;
  staticPages: Record<string, Record<string, unknown>>;
  seo: Record<string, unknown>;
  stats: {
    coreSize: number;
    toolsIndexSize: number;
    toolsDetailSize: number;
    staticPagesSize: number;
    seoSize: number;
    totalOriginal: number;
  };
}

function splitTranslations(locale: string): SplitResult {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  
  // 1. 提取核心翻译
  const core: Record<string, unknown> = {};
  CORE_KEYS.forEach(key => {
    if (data[key]) {
      core[key] = data[key];
    }
  });
  
  // 2. 提取工具通用 UI
  const toolsUI: Record<string, string> = {};
  if (data.tools) {
    Object.entries(data.tools).forEach(([key, value]) => {
      if (typeof value === 'string') {
        toolsUI[key] = value;
      }
    });
  }
  core.tools = toolsUI;
  
  // 3. 提取工具索引（name, description, seo_*）
  const toolsIndex: Record<string, unknown> = {};
  if (data.tools) {
    Object.entries(data.tools).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const toolData = value as Record<string, unknown>;
        toolsIndex[key] = {
          name: toolData.name,
          description: toolData.description,
          seo_title: toolData.seo_title,
          seo_description: toolData.seo_description,
        };
      }
    });
  }
  // 合并 tool 对象（如果存在）
  if (data.tool) {
    Object.entries(data.tool).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const toolData = value as Record<string, unknown>;
        if (!toolsIndex[key]) {
          toolsIndex[key] = {};
        }
        Object.assign(toolsIndex[key] as Record<string, unknown>, {
          name: toolData.name || (toolsIndex[key] as Record<string, unknown>).name,
          description: toolData.description || (toolsIndex[key] as Record<string, unknown>).description,
          seo_title: toolData.seo_title || (toolsIndex[key] as Record<string, unknown>).seo_title,
          seo_description: toolData.seo_description || (toolsIndex[key] as Record<string, unknown>).seo_description,
        });
      }
    });
  }
  
  // 4. 提取工具详细内容
  const toolsDetail: Record<string, Record<string, unknown>> = {};
  if (data.tools) {
    Object.entries(data.tools).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        const toolData = value as Record<string, unknown>;
        const detail: Record<string, unknown> = {};
        
        // 提取详细内容字段
        Object.entries(toolData).forEach(([k, v]) => {
          if (!['name', 'description', 'seo_title', 'seo_description'].includes(k)) {
            detail[k] = v;
          }
        });
        
        if (Object.keys(detail).length > 0) {
          toolsDetail[key] = detail;
        }
      }
    });
  }
  
  // 5. 提取静态页面
  const staticPages: Record<string, Record<string, unknown>> = {};
  STATIC_PAGE_KEYS.forEach(key => {
    if (data[key]) {
      staticPages[key] = data[key];
    }
  });
  
  // 6. 提取 SEO 相关
  const seo: Record<string, unknown> = {};
  SEO_KEYS.forEach(key => {
    if (data[key]) {
      seo[key] = data[key];
    }
  });
  
  // 7. 添加其他未分类的键到 core
  const allUsedKeys = [...CORE_KEYS, ...STATIC_PAGE_KEYS, ...SEO_KEYS, 'tools', 'tool'];
  Object.keys(data).forEach(key => {
    if (!allUsedKeys.includes(key) && !core[key]) {
      core[key] = data[key];
    }
  });
  
  // 计算大小
  const stats = {
    coreSize: JSON.stringify(core).length,
    toolsIndexSize: JSON.stringify(toolsIndex).length,
    toolsDetailSize: Object.values(toolsDetail).reduce((sum, v) => sum + JSON.stringify(v).length, 0),
    staticPagesSize: JSON.stringify(staticPages).length,
    seoSize: JSON.stringify(seo).length,
    totalOriginal: content.length,
  };
  
  return {
    locale,
    core,
    toolsIndex,
    toolsDetail,
    staticPages,
    seo,
    stats,
  };
}

function writeFiles(result: SplitResult, dryRun: boolean): void {
  const localeDir = path.join(MESSAGES_DIR, result.locale, 'v2');
  
  if (!dryRun) {
    // 创建目录
    fs.mkdirSync(localeDir, { recursive: true });
    fs.mkdirSync(path.join(localeDir, 'tools'), { recursive: true });
    fs.mkdirSync(path.join(localeDir, 'static'), { recursive: true });
    
    // 写入 core.json
    fs.writeFileSync(
      path.join(localeDir, 'core.json'),
      JSON.stringify(result.core, null, 2)
    );
    
    // 写入 tools-index.json
    fs.writeFileSync(
      path.join(localeDir, 'tools-index.json'),
      JSON.stringify(result.toolsIndex, null, 2)
    );
    
    // 写入 seo.json
    fs.writeFileSync(
      path.join(localeDir, 'seo.json'),
      JSON.stringify(result.seo, null, 2)
    );
    
    // 写入工具详细文件
    Object.entries(result.toolsDetail).forEach(([slug, content]) => {
      fs.writeFileSync(
        path.join(localeDir, 'tools', `${slug}.json`),
        JSON.stringify(content, null, 2)
      );
    });
    
    // 写入静态页面文件
    Object.entries(result.staticPages).forEach(([page, content]) => {
      fs.writeFileSync(
        path.join(localeDir, 'static', `${page}.json`),
        JSON.stringify(content, null, 2)
      );
    });
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const localeArg = args.find(a => a.startsWith('--locale='));
  const targetLocales = localeArg 
    ? [localeArg.split('=')[1]] 
    : LOCALES;
  
  console.log('='.repeat(60));
  console.log('翻译文件拆分工具 v2');
  console.log('='.repeat(60));
  console.log(`模式: ${dryRun ? '分析模式（不写入文件）' : '执行模式'}`);
  console.log(`目标语言: ${targetLocales.join(', ')}`);
  console.log('');
  
  const results: SplitResult[] = [];
  
  for (const locale of targetLocales) {
    console.log(`\n处理 ${locale}...`);
    const result = splitTranslations(locale);
    results.push(result);
    
    console.log(`  原始大小: ${formatSize(result.stats.totalOriginal)}`);
    console.log(`  拆分后:`);
    console.log(`    - core.json: ${formatSize(result.stats.coreSize)}`);
    console.log(`    - tools-index.json: ${formatSize(result.stats.toolsIndexSize)}`);
    console.log(`    - tools/*.json: ${formatSize(result.stats.toolsDetailSize)} (${Object.keys(result.toolsDetail).length} 个文件)`);
    console.log(`    - static/*.json: ${formatSize(result.stats.staticPagesSize)} (${Object.keys(result.staticPages).length} 个文件)`);
    console.log(`    - seo.json: ${formatSize(result.stats.seoSize)}`);
    
    const totalSplit = result.stats.coreSize + result.stats.toolsIndexSize + 
                       result.stats.toolsDetailSize + result.stats.staticPagesSize + 
                       result.stats.seoSize;
    console.log(`  拆分后总大小: ${formatSize(totalSplit)}`);
    
    if (!dryRun) {
      writeFiles(result, dryRun);
      console.log(`  ✓ 文件已写入 src/messages/${locale}/v2/`);
    }
  }
  
  // 汇总
  console.log('\n' + '='.repeat(60));
  console.log('汇总');
  console.log('='.repeat(60));
  
  const totalOriginal = results.reduce((sum, r) => sum + r.stats.totalOriginal, 0);
  const totalCore = results.reduce((sum, r) => sum + r.stats.coreSize, 0);
  const totalToolsIndex = results.reduce((sum, r) => sum + r.stats.toolsIndexSize, 0);
  
  console.log(`\n原始总大小: ${formatSize(totalOriginal)}`);
  console.log(`\n首页加载 (core.json):`);
  console.log(`  每种语言: ~${formatSize(totalCore / results.length)}`);
  console.log(`  减少: ${((1 - totalCore / results.length / (totalOriginal / results.length)) * 100).toFixed(1)}%`);
  
  console.log(`\n工具列表页加载 (core + tools-index):`);
  const toolsListSize = (totalCore + totalToolsIndex) / results.length;
  console.log(`  每种语言: ~${formatSize(toolsListSize)}`);
  console.log(`  减少: ${((1 - toolsListSize / (totalOriginal / results.length)) * 100).toFixed(1)}%`);
  
  if (dryRun) {
    console.log('\n💡 这是分析模式，未写入任何文件。');
    console.log('   运行不带 --dry-run 参数来执行拆分。');
  } else {
    console.log('\n✅ 拆分完成！');
    console.log('   文件已写入 src/messages/{locale}/v2/ 目录');
    console.log('   下一步：更新翻译加载逻辑以使用新的文件结构');
  }
}

main().catch(console.error);
