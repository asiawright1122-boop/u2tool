#!/usr/bin/env tsx

/**
 * 批量修复图表组件的翻译键查找逻辑
 * 
 * 将所有图表组件中的自定义 t() 和 tg() 函数替换为使用 translation-helper
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// 需要修复的图表组件模式
const CHART_COMPONENT_PATTERNS = [
  'src/components/tools/*ChartGenerator.svelte',
  'src/components/tools/*Chart.svelte',
];

// 旧的翻译函数模式（需要替换）
// 匹配从 "// Translation helpers" 到 "// Imports" 之间的所有内容
const OLD_TRANSLATION_PATTERN = /\/\/ Translation helpers\s+function t\(key: string(?:, vars\?: Record<string, string \| number>)?\): string \{[\s\S]*?\}\s+function tg\(key: string\): string \{[\s\S]*?\}\s+(?=\/\/ Imports)/;

// 新的翻译函数导入
function getNewTranslationImport(toolSlug: string): string {
  return `// Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, '${toolSlug}');
  const tg = createGeneralTranslator(translations);

  `;
}

// 从文件名提取工具 slug
function extractToolSlug(filename: string): string {
  // 例如：BarChartGenerator.svelte -> bar-chart-generator
  const basename = filename.split('/').pop()?.replace('.svelte', '') || '';
  
  // 将 PascalCase 转换为 kebab-case
  return basename
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

async function fixChartComponent(filePath: string): Promise<boolean> {
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // 检查是否包含旧的翻译函数
    if (!OLD_TRANSLATION_PATTERN.test(content)) {
      console.log(`⏭️  跳过 ${filePath} - 未找到旧的翻译函数`);
      return false;
    }

    // 提取工具 slug
    const toolSlug = extractToolSlug(filePath);
    
    // 替换翻译函数
    const newContent = content.replace(
      OLD_TRANSLATION_PATTERN,
      getNewTranslationImport(toolSlug)
    );

    // 检查是否有实际变化
    if (newContent === content) {
      console.log(`⏭️  跳过 ${filePath} - 无需修改`);
      return false;
    }

    // 写入文件
    writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ 修复 ${filePath} (${toolSlug})`);
    return true;

  } catch (error) {
    console.error(`❌ 修复失败 ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔍 搜索需要修复的图表组件...\n');

  const files: string[] = [];
  for (const pattern of CHART_COMPONENT_PATTERNS) {
    const matches = await glob(pattern);
    files.push(...matches);
  }

  console.log(`📋 找到 ${files.length} 个图表组件\n`);

  let fixedCount = 0;
  let skippedCount = 0;

  for (const file of files) {
    const fixed = await fixChartComponent(file);
    if (fixed) {
      fixedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log(`\n📊 修复完成:`);
  console.log(`   ✅ 已修复: ${fixedCount} 个`);
  console.log(`   ⏭️  已跳过: ${skippedCount} 个`);
  console.log(`   📁 总计: ${files.length} 个`);
}

main().catch(console.error);
