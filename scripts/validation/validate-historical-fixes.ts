#!/usr/bin/env node

import { validateHooksDependencies, printHooksIssues } from './validate-hooks-dependencies.js';
import { validateEChartsLazyLoading, printEChartsIssues } from './validate-echarts-lazy-loading.js';
import { validateDefensiveProgramming, printDefensiveIssues } from './validate-defensive-programming.js';
import { validateTranslations, printTranslationIssues } from './validate-translations.js';
import fs from 'fs-extra';

/**
 * 运行所有验证
 */
async function validateAll() {
  console.log('🔍 开始验证历史修复...\n');
  
  // 1. React Hooks 依赖验证
  console.log('1️⃣ 验证 React Hooks 依赖...');
  const hooksIssues = await validateHooksDependencies();
  printHooksIssues(hooksIssues);
  
  // 2. ECharts 懒加载验证
  console.log('\n2️⃣ 验证 ECharts 懒加载...');
  const echartsIssues = await validateEChartsLazyLoading();
  printEChartsIssues(echartsIssues);
  
  // 3. 防御性编程验证
  console.log('\n3️⃣ 验证防御性编程...');
  const defensiveIssues = await validateDefensiveProgramming();
  printDefensiveIssues(defensiveIssues);
  
  // 4. 翻译完整性验证
  console.log('\n4️⃣ 验证翻译完整性...');
  const translationIssues = await validateTranslations();
  printTranslationIssues(translationIssues);
  
  // 生成报告
  const report = generateReport({
    hooksIssues,
    echartsIssues,
    defensiveIssues,
    translationIssues,
  });
  
  await fs.ensureDir('docs');
  await fs.writeFile('docs/HISTORICAL_FIXES_VALIDATION.md', report, 'utf-8');
  console.log('\n✅ 验证报告已生成: docs/HISTORICAL_FIXES_VALIDATION.md');
  
  // 计算总问题数
  const totalIssues = 
    hooksIssues.length + 
    echartsIssues.length + 
    defensiveIssues.length + 
    translationIssues.length;
  
  if (totalIssues === 0) {
    console.log('\n🎉 所有验证都通过了！');
    process.exit(0);
  } else {
    console.log(`\n⚠️  发现 ${totalIssues} 个问题需要修复`);
    process.exit(1);
  }
}

/**
 * 生成验证报告
 */
function generateReport(results: any): string {
  const lines: string[] = [];
  
  lines.push('# 历史修复验证报告\n');
  lines.push(`生成时间: ${new Date().toLocaleString('zh-CN')}\n`);
  
  // 总结
  lines.push('## 验证总结\n');
  const totalIssues = 
    results.hooksIssues.length + 
    results.echartsIssues.length + 
    results.defensiveIssues.length + 
    results.translationIssues.length;
  
  lines.push(`- **总问题数**: ${totalIssues}`);
  lines.push(`- **React Hooks 依赖**: ${results.hooksIssues.length} 个问题`);
  lines.push(`- **ECharts 懒加载**: ${results.echartsIssues.length} 个问题`);
  lines.push(`- **防御性编程**: ${results.defensiveIssues.length} 个问题`);
  lines.push(`- **翻译完整性**: ${results.translationIssues.length} 个问题\n`);
  
  // React Hooks 依赖
  if (results.hooksIssues.length > 0) {
    lines.push('## React Hooks 依赖问题\n');
    for (const issue of results.hooksIssues) {
      lines.push(`### ${issue.file}:${issue.line}\n`);
      lines.push(`- **Hook**: ${issue.hook}`);
      lines.push(`- **严重程度**: ${issue.severity}`);
      lines.push(`- **问题**: ${issue.issue}\n`);
    }
  }
  
  // ECharts 懒加载
  if (results.echartsIssues.length > 0) {
    lines.push('## ECharts 懒加载问题\n');
    for (const issue of results.echartsIssues) {
      lines.push(`### ${issue.file}:${issue.line}\n`);
      lines.push(`- **问题**: ${issue.issue}\n`);
    }
  }
  
  // 防御性编程
  if (results.defensiveIssues.length > 0) {
    lines.push('## 防御性编程问题\n');
    for (const issue of results.defensiveIssues) {
      lines.push(`### ${issue.file}:${issue.line}\n`);
      lines.push(`- **问题**: ${issue.issue}`);
      lines.push(`- **代码**: \`${issue.code}\`\n`);
    }
  }
  
  // 翻译完整性
  if (results.translationIssues.length > 0) {
    lines.push('## 翻译完整性问题\n');
    for (const issue of results.translationIssues) {
      lines.push(`### ${issue.locale}\n`);
      lines.push(`缺失 ${issue.missingKeys.length} 个翻译键:\n`);
      for (const key of issue.missingKeys.slice(0, 20)) {
        lines.push(`- ${key}`);
      }
      if (issue.missingKeys.length > 20) {
        lines.push(`- ... 还有 ${issue.missingKeys.length - 20} 个\n`);
      }
      lines.push('');
    }
  }
  
  return lines.join('\n');
}

// 运行验证
validateAll().catch(error => {
  console.error('\n❌ 验证失败:', error);
  process.exit(1);
});
