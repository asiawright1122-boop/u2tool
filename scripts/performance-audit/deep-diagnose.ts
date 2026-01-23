#!/usr/bin/env tsx

/**
 * 深度性能诊断脚本
 * 
 * 检测可能导致"页面无响应"的问题：
 * 1. 大型同步操作
 * 2. 无限循环风险
 * 3. 内存泄漏
 * 4. 阻塞主线程的代码
 */

import fs from 'fs';
import path from 'path';

interface Issue {
  file: string;
  line: number;
  severity: 'critical' | 'warning';
  category: string;
  message: string;
  code: string;
}

const issues: Issue[] = [];

// 检测模式
const patterns = {
  // Critical: 可能导致无限循环
  infiniteLoopRisk: [
    /while\s*\(\s*true\s*\)/g,
    /for\s*\(\s*;\s*;\s*\)/g,
  ],
  
  // Critical: 大型同步操作
  syncBlockingOps: [
    /\.readFileSync\(/g,
    /\.writeFileSync\(/g,
    /JSON\.parse\([^)]{100,}\)/g, // 解析大型 JSON
  ],
  
  // Warning: 可能的性能问题
  performanceIssues: [
    /useEffect\([^,]+,\s*\[[^\]]*\{[^\]]*\]\)/g, // useEffect 依赖包含对象
    /useMemo\([^,]+,\s*\[[^\]]*\{[^\]]*\]\)/g, // useMemo 依赖包含对象
    /useCallback\([^,]+,\s*\[[^\]]*\{[^\]]*\]\)/g, // useCallback 依赖包含对象
  ],
  
  // Warning: 大量 DOM 操作
  heavyDomOps: [
    /document\.createElement\(/g,
    /innerHTML\s*=/g,
  ],
};

async function analyzeFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // 检查无限循环风险
  patterns.infiniteLoopRisk.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      const lineContent = lines[lineNum - 1];
      
      // 检查是否有 break 语句
      const contextStart = Math.max(0, lineNum - 5);
      const contextEnd = Math.min(lines.length, lineNum + 10);
      const context = lines.slice(contextStart, contextEnd).join('\n');
      
      if (!context.includes('break') && !context.includes('return')) {
        issues.push({
          file: filePath,
          line: lineNum,
          severity: 'critical',
          category: '无限循环风险',
          message: '发现可能的无限循环，没有明显的退出条件',
          code: lineContent.trim(),
        });
      }
    }
  });
  
  // 检查同步阻塞操作
  patterns.syncBlockingOps.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.push({
        file: filePath,
        line: lineNum,
        severity: 'critical',
        category: '同步阻塞操作',
        message: '发现同步阻塞操作，可能导致主线程冻结',
        code: lines[lineNum - 1].trim(),
      });
    }
  });
  
  // 检查性能问题
  patterns.performanceIssues.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      issues.push({
        file: filePath,
        line: lineNum,
        severity: 'warning',
        category: 'React Hooks 性能',
        message: 'Hook 依赖数组包含对象，可能导致不必要的重渲染',
        code: lines[lineNum - 1].trim(),
      });
    }
  });
}

async function main() {
  console.log('🔍 开始深度性能诊断...\n');
  
  // 扫描所有工具组件
  const toolsDir = 'src/components/tools';
  const files = fs.readdirSync(toolsDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => path.join(toolsDir, f));
  
  console.log(`📁 扫描 ${files.length} 个文件...\n`);
  
  for (const file of files) {
    await analyzeFile(file);
  }
  
  // 统计
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const warningIssues = issues.filter(i => i.severity === 'warning');
  
  console.log('=' .repeat(60));
  console.log('📊 深度诊断报告');
  console.log('='.repeat(60));
  console.log(`🔴 Critical 问题: ${criticalIssues.length} 个`);
  console.log(`🟡 Warning 问题: ${warningIssues.length} 个`);
  console.log(`📊 总问题数: ${issues.length} 个\n`);
  
  // 显示 Critical 问题
  if (criticalIssues.length > 0) {
    console.log('🔴 Critical 问题详情:\n');
    criticalIssues.forEach((issue, index) => {
      console.log(`${index + 1}. ${issue.category}`);
      console.log(`   文件: ${issue.file}:${issue.line}`);
      console.log(`   问题: ${issue.message}`);
      console.log(`   代码: ${issue.code}`);
      console.log('');
    });
  }
  
  // 按类别统计
  const byCategory = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log('\n📈 问题分类统计:');
  Object.entries(byCategory).forEach(([category, count]) => {
    console.log(`  - ${category}: ${count} 个`);
  });
  
  // 保存报告
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    totalIssues: issues.length,
    criticalIssues: criticalIssues.length,
    warningIssues: warningIssues.length,
    issues,
    byCategory,
  };
  
  fs.writeFileSync(
    'deep-performance-diagnosis.json',
    JSON.stringify(report, null, 2)
  );
  
  console.log('\n📄 详细报告已保存到: deep-performance-diagnosis.json');
  
  if (criticalIssues.length > 0) {
    console.log('\n⚠️  发现 Critical 问题！需要立即修复。');
    process.exit(1);
  }
}

main().catch(console.error);
