#!/usr/bin/env tsx

import { readFileSync, writeFileSync } from 'fs';

const filesToFix = [
  'src/components/tools/PictorialBarChartGenerator.svelte',
  'src/components/tools/PercentageStackedBarChartGenerator.svelte',
  'src/components/tools/NestedPieChartGenerator.svelte',
  'src/components/tools/MultiRingChartGenerator.svelte',
  'src/components/tools/MixedChartGenerator.svelte',
  'src/components/tools/LiquidFillChartGenerator.svelte',
  'src/components/tools/HalfDoughnutChartGenerator.svelte',
  'src/components/tools/GroupedBarChartGenerator.svelte',
];

function extractToolSlug(filename: string): string {
  const basename = filename.split('/').pop()?.replace('.svelte', '') || '';
  return basename
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
}

function fixComponent(filePath: string): boolean {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const toolSlug = extractToolSlug(filePath);
    
    // 匹配单个 t() 函数定义（没有 tg）
    const singleTPattern = /\/\/ Translation helpers\s+function t\(key: string\): string \{[\s\S]*?\}\s+(?=\/\/ Imports)/;
    
    if (singleTPattern.test(content)) {
      const newContent = content.replace(
        singleTPattern,
        `// Translation helpers
  import { createToolTranslator, createGeneralTranslator } from '@/lib/translation-helper';
  const t = createToolTranslator(translations, '${toolSlug}');
  const tg = createGeneralTranslator(translations);

  `
      );
      
      writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ 修复 ${filePath}`);
      return true;
    }
    
    console.log(`⏭️  跳过 ${filePath} - 未找到匹配的模式`);
    return false;
  } catch (error) {
    console.error(`❌ 修复失败 ${filePath}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔍 修复剩余的图表组件...\n');
  
  let fixedCount = 0;
  
  for (const file of filesToFix) {
    if (fixComponent(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n📊 修复完成: ${fixedCount}/${filesToFix.length} 个文件`);
}

main().catch(console.error);
