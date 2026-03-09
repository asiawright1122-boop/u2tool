#!/usr/bin/env node

import { glob } from 'glob';
import fs from 'fs-extra';

export interface DefensiveIssue {
  file: string;
  line: number;
  issue: string;
  code: string;
}

/**
 * 验证防御性编程
 */
export async function validateDefensiveProgramming(): Promise<DefensiveIssue[]> {
  const issues: DefensiveIssue[] = [];
  
  // 扫描所有图表组件
  const files = await glob('src/components/tools/*Chart*.svelte');
  
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // 检查 exportChart 函数
      if (line.includes('const exportChart') || line.includes('function exportChart')) {
        // 检查接下来的几行是否有防御性检查
        const nextLines = lines.slice(i, Math.min(i + 15, lines.length)).join('\n');
        
        // 检查是否有 chartRef.current 检查
        if (!nextLines.includes('if (!chartRef.current)') && 
            !nextLines.includes('if (chartRef.current)')) {
          issues.push({
            file,
            line: lineNumber,
            issue: 'exportChart 函数缺少 chartRef.current 的 null 检查',
            code: line.trim(),
          });
        }
        
        // 检查是否有 echartInstance 检查
        if (nextLines.includes('getEchartsInstance()') && 
            !nextLines.includes('if (!echartInstance)') &&
            !nextLines.includes('if (echartInstance)')) {
          issues.push({
            file,
            line: lineNumber,
            issue: 'exportChart 函数缺少 echartInstance 的 null 检查',
            code: line.trim(),
          });
        }
      }
      
      // 检查直接访问可能为 undefined 的属性
      // 但排除已经在 exportChart 函数内部且有防御性检查的情况
      if (line.includes('.getEchartsInstance()') && 
          !line.includes('?')) {
        // 检查前面几行是否有 chartRef.current 的检查
        const prevLines = lines.slice(Math.max(0, i - 10), i).join('\n');
        const nextFewLines = lines.slice(i, Math.min(i + 5, lines.length)).join('\n');
        
        // 如果在 exportChart 函数内且有防御性检查，则跳过
        const inExportChart = prevLines.includes('function exportChart') || prevLines.includes('const exportChart');
        const hasDefensiveCheck = prevLines.includes('if (!chartRef.current)') && 
                                  nextFewLines.includes('if (!echartInstance)');
        
        if (!inExportChart || !hasDefensiveCheck) {
          issues.push({
            file,
            line: lineNumber,
            issue: '直接调用 getEchartsInstance() 可能返回 undefined',
            code: line.trim(),
          });
        }
      }
    }
  }
  
  return issues;
}

/**
 * 打印验证结果
 */
export function printDefensiveIssues(issues: DefensiveIssue[]): void {
  if (issues.length === 0) {
    console.log('✅ 所有代码都有适当的防御性检查');
    return;
  }
  
  console.log(`\n发现 ${issues.length} 个防御性编程问题:\n`);
  
  for (const issue of issues) {
    console.log(`${issue.file}:${issue.line}`);
    console.log(`  ❌ ${issue.issue}`);
    console.log(`  代码: ${issue.code}\n`);
  }
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  validateDefensiveProgramming()
    .then(issues => {
      printDefensiveIssues(issues);
      process.exit(issues.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('错误:', error);
      process.exit(1);
    });
}
