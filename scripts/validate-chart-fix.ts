#!/usr/bin/env tsx

/**
 * 验证图表工具翻译和加载修复
 */

import { readFileSync } from 'fs';
import { glob } from 'glob';

async function main() {
  console.log('🔍 验证图表工具修复情况...\n');

  const chartFiles = await glob('src/components/tools/*ChartGenerator.svelte');
  
  let usingHelperCount = 0;
  let notUsingHelperCount = 0;
  const notUsingHelperFiles: string[] = [];

  for (const file of chartFiles) {
    const content = readFileSync(file, 'utf-8');
    
    if (content.includes('createToolTranslator') && content.includes('createGeneralTranslator')) {
      usingHelperCount++;
    } else {
      notUsingHelperCount++;
      notUsingHelperFiles.push(file);
    }
  }

  console.log('📊 统计结果:');
  console.log(`   ✅ 使用 translation-helper: ${usingHelperCount} 个`);
  console.log(`   ⚠️  未使用 translation-helper: ${notUsingHelperCount} 个`);
  
  if (notUsingHelperFiles.length > 0) {
    console.log('\n⚠️  以下文件未使用 translation-helper:');
    notUsingHelperFiles.forEach(file => console.log(`   - ${file}`));
  }

  // 检查 EChartsWrapper
  console.log('\n🔍 检查 EChartsWrapper...');
  const wrapperContent = readFileSync('src/components/tools/EChartsWrapper.svelte', 'utf-8');
  
  const hasLoadingPhase = wrapperContent.includes('loadingPhase');
  const hasRetry = wrapperContent.includes('retryLoad');
  const hasIdleCallback = wrapperContent.includes('requestIdleCallback');
  
  console.log(`   ${hasLoadingPhase ? '✅' : '❌'} 加载状态管理`);
  console.log(`   ${hasRetry ? '✅' : '❌'} 重试机制`);
  console.log(`   ${hasIdleCallback ? '✅' : '❌'} requestIdleCallback 优化`);

  console.log('\n✅ 验证完成！');
  
  if (notUsingHelperCount === 0 && hasLoadingPhase && hasRetry && hasIdleCallback) {
    console.log('\n🎉 所有修复已成功应用！');
    process.exit(0);
  } else {
    console.log('\n⚠️  部分修复未完成，请检查上述问题。');
    process.exit(1);
  }
}

main().catch(console.error);
