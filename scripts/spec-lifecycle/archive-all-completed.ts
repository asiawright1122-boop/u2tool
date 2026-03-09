#!/usr/bin/env node

import { checkAllSpecs } from './check-spec-status.js';
import { archiveSpec } from './archive-spec.js';
import * as path from 'path';

/**
 * 归档所有已完成的 Spec
 */
async function archiveAllCompleted() {
  console.log('🗂️  开始批量归档已完成的 Spec...\n');
  
  // 获取所有 Spec 状态
  const specs = await checkAllSpecs('.kiro/specs');
  const completedSpecs = specs.filter(s => s.canArchive);
  
  if (completedSpecs.length === 0) {
    console.log('✅ 没有需要归档的 Spec');
    return;
  }
  
  console.log(`发现 ${completedSpecs.length} 个可归档的 Spec\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const spec of completedSpecs) {
    try {
      console.log(`归档: ${spec.name}...`);
      const result = await archiveSpec(spec.path, {
        force: false,
        dryRun: false,
      });
      
      if (result.success) {
        successCount++;
      } else {
        failCount++;
        console.error(`  失败: ${result.error}`);
      }
    } catch (error) {
      failCount++;
      console.error(`  错误: ${error}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('归档完成');
  console.log('='.repeat(50));
  console.log(`成功: ${successCount} 个`);
  console.log(`失败: ${failCount} 个`);
  
  if (failCount > 0) {
    process.exit(1);
  }
}

// 运行
archiveAllCompleted().catch(error => {
  console.error('\n❌ 批量归档失败:', error);
  process.exit(1);
});
