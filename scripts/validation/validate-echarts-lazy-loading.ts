#!/usr/bin/env node

import { glob } from 'glob';
import fs from 'fs-extra';

export interface EChartsIssue {
  file: string;
  line: number;
  issue: string;
}

/**
 * 验证 ECharts 懒加载
 */
export async function validateEChartsLazyLoading(): Promise<EChartsIssue[]> {
  const issues: EChartsIssue[] = [];
  
  // 扫描所有图表组件
  const files = await glob('src/components/tools/*Chart*.svelte');
  
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // 检查是否直接导入 echarts
      if (line.includes("import") && line.includes("echarts")) {
        // 检查是否是模块级别的同步导入
        if (line.includes("import * as echarts") || 
            line.includes("import echarts") ||
            line.includes("from 'echarts/core'") ||
            line.includes('from "echarts/core"')) {
          issues.push({
            file,
            line: lineNumber,
            issue: '直接导入 echarts，应该使用 EChartsWrapper 实现懒加载',
          });
        }
      }
      
      // 检查是否使用 ReactEChartsCore
      if (line.includes('ReactEChartsCore') && !line.includes('EChartsWrapper')) {
        issues.push({
          file,
          line: lineNumber,
          issue: '使用 ReactEChartsCore，应该改用 EChartsWrapper',
        });
      }
      
      // 检查是否有 echarts.use
      if (line.includes('echarts.use')) {
        issues.push({
          file,
          line: lineNumber,
          issue: '模块级别的 echarts.use 会阻塞主线程，应该使用 EChartsWrapper',
        });
      }
    }
  }
  
  return issues;
}

/**
 * 打印验证结果
 */
export function printEChartsIssues(issues: EChartsIssue[]): void {
  if (issues.length === 0) {
    console.log('✅ 所有图表组件都正确使用了 ECharts 懒加载');
    return;
  }
  
  console.log(`\n发现 ${issues.length} 个 ECharts 懒加载问题:\n`);
  
  for (const issue of issues) {
    console.log(`${issue.file}:${issue.line}`);
    console.log(`  ❌ ${issue.issue}\n`);
  }
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  validateEChartsLazyLoading()
    .then(issues => {
      printEChartsIssues(issues);
      process.exit(issues.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('错误:', error);
      process.exit(1);
    });
}
