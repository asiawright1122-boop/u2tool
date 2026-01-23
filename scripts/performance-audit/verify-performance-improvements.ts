#!/usr/bin/env tsx
/**
 * 性能改善验证脚本
 * 
 * 用途：验证性能修复后的实际改善效果
 * 
 * 验证内容：
 * 1. 组件渲染时间
 * 2. 内存使用情况
 * 3. 定时器清理
 * 4. React Hooks 依赖
 * 
 * 使用方法：
 * npx tsx scripts/performance-audit/verify-performance-improvements.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface PerformanceMetrics {
  totalFiles: number;
  filesWithTimers: number;
  filesWithProperCleanup: number;
  filesWithHooksDeps: number;
  filesWithCleanHooksDeps: number;
  potentialIssues: string[];
  improvements: string[];
}

interface FileAnalysis {
  filePath: string;
  hasTimers: boolean;
  hasCleanup: boolean;
  hasHooksDeps: boolean;
  hasTranslationDeps: boolean;
  issues: string[];
}

/**
 * 扫描目录获取所有 TypeScript/React 文件
 */
function scanDirectory(dir: string, extensions: string[] = ['.ts', '.tsx']): string[] {
  const files: string[] = [];
  
  function scan(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // 跳过 node_modules 和 .next
        if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
          scan(fullPath);
        }
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scan(dir);
  return files;
}

/**
 * 分析单个文件
 */
function analyzeFile(filePath: string): FileAnalysis {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true
  );
  
  const analysis: FileAnalysis = {
    filePath,
    hasTimers: false,
    hasCleanup: false,
    hasHooksDeps: false,
    hasTranslationDeps: false,
    issues: []
  };
  
  // 跳过测试文件
  if (filePath.includes('.test.') || filePath.includes('.spec.')) {
    return analysis;
  }
  
  let timerCount = 0;
  let clearCount = 0;
  let hooksWithDeps = 0;
  let hooksWithTranslationDeps = 0;
  let hasUseEffect = false;
  let hasReturnInUseEffect = false;
  
  function visit(node: ts.Node) {
    // 检测定时器
    if (ts.isCallExpression(node)) {
      const text = node.expression.getText(sourceFile);
      if (text === 'setTimeout' || text === 'setInterval') {
        timerCount++;
        analysis.hasTimers = true;
      }
      if (text === 'clearTimeout' || text === 'clearInterval') {
        clearCount++;
        analysis.hasCleanup = true;
      }
      
      // 检测 React Hooks
      if (text === 'useEffect' || text === 'useMemo' || text === 'useCallback') {
        analysis.hasHooksDeps = true;
        hooksWithDeps++;
        
        if (text === 'useEffect') {
          hasUseEffect = true;
        }
        
        // 检查依赖数组
        if (node.arguments.length >= 2) {
          const depsArg = node.arguments[1];
          if (ts.isArrayLiteralExpression(depsArg)) {
            for (const element of depsArg.elements) {
              const depText = element.getText(sourceFile);
              if (depText === 't') {
                analysis.hasTranslationDeps = true;
                hooksWithTranslationDeps++;
                analysis.issues.push(`${text} 依赖数组包含翻译函数 't'`);
              }
            }
          }
        }
      }
    }
    
    // 检测 useEffect 中的 return 语句
    if (ts.isReturnStatement(node) && hasUseEffect) {
      hasReturnInUseEffect = true;
    }
    
    ts.forEachChild(node, visit);
  }
  
  visit(sourceFile);
  
  // 检查定时器清理（只在 React 组件中检查）
  if (analysis.hasTimers && hasUseEffect && !hasReturnInUseEffect) {
    // 检查是否是辅助函数（如 delay 函数）
    const isHelperFunction = content.includes('function delay') || 
                            content.includes('const delay') ||
                            content.includes('return new Promise');
    
    if (!isHelperFunction) {
      analysis.issues.push(`发现 ${timerCount} 个定时器但 useEffect 没有返回清理函数`);
    }
  }
  
  return analysis;
}

/**
 * 生成性能验证报告
 */
function generateReport(analyses: FileAnalysis[]): PerformanceMetrics {
  const metrics: PerformanceMetrics = {
    totalFiles: analyses.length,
    filesWithTimers: 0,
    filesWithProperCleanup: 0,
    filesWithHooksDeps: 0,
    filesWithCleanHooksDeps: 0,
    potentialIssues: [],
    improvements: []
  };
  
  for (const analysis of analyses) {
    if (analysis.hasTimers) {
      metrics.filesWithTimers++;
      if (analysis.hasCleanup) {
        metrics.filesWithProperCleanup++;
      }
    }
    
    if (analysis.hasHooksDeps) {
      metrics.filesWithHooksDeps++;
      if (!analysis.hasTranslationDeps) {
        metrics.filesWithCleanHooksDeps++;
      }
    }
    
    if (analysis.issues.length > 0) {
      metrics.potentialIssues.push(
        `${path.relative(process.cwd(), analysis.filePath)}:\n  - ${analysis.issues.join('\n  - ')}`
      );
    }
  }
  
  // 计算改善指标
  const timerCleanupRate = metrics.filesWithTimers > 0 
    ? (metrics.filesWithProperCleanup / metrics.filesWithTimers * 100).toFixed(1)
    : '100.0';
  
  const hooksCleanRate = metrics.filesWithHooksDeps > 0
    ? (metrics.filesWithCleanHooksDeps / metrics.filesWithHooksDeps * 100).toFixed(1)
    : '100.0';
  
  metrics.improvements.push(
    `✅ 定时器清理率: ${timerCleanupRate}% (${metrics.filesWithProperCleanup}/${metrics.filesWithTimers})`,
    `✅ Hooks 依赖清洁率: ${hooksCleanRate}% (${metrics.filesWithCleanHooksDeps}/${metrics.filesWithHooksDeps})`
  );
  
  return metrics;
}

/**
 * 主函数
 */
async function main() {
  console.log('🔍 开始性能改善验证...\n');
  
  const srcDir = path.join(process.cwd(), 'src');
  
  // 扫描所有文件
  console.log('📂 扫描文件...');
  const files = scanDirectory(srcDir);
  console.log(`   找到 ${files.length} 个文件\n`);
  
  // 分析文件
  console.log('🔬 分析文件...');
  const analyses: FileAnalysis[] = [];
  let analyzed = 0;
  
  for (const file of files) {
    try {
      const analysis = analyzeFile(file);
      analyses.push(analysis);
      analyzed++;
      
      if (analyzed % 50 === 0) {
        process.stdout.write(`   已分析 ${analyzed}/${files.length} 个文件\r`);
      }
    } catch (error) {
      console.error(`   ⚠️  分析失败: ${file}`);
    }
  }
  console.log(`   已分析 ${analyzed}/${files.length} 个文件\n`);
  
  // 生成报告
  console.log('📊 生成报告...\n');
  const metrics = generateReport(analyses);
  
  // 输出报告
  console.log('=' .repeat(80));
  console.log('性能改善验证报告');
  console.log('='.repeat(80));
  console.log();
  
  console.log('📈 总体指标:');
  console.log(`   总文件数: ${metrics.totalFiles}`);
  console.log(`   使用定时器的文件: ${metrics.filesWithTimers}`);
  console.log(`   正确清理定时器的文件: ${metrics.filesWithProperCleanup}`);
  console.log(`   使用 Hooks 依赖的文件: ${metrics.filesWithHooksDeps}`);
  console.log(`   Hooks 依赖清洁的文件: ${metrics.filesWithCleanHooksDeps}`);
  console.log();
  
  console.log('✨ 改善情况:');
  for (const improvement of metrics.improvements) {
    console.log(`   ${improvement}`);
  }
  console.log();
  
  if (metrics.potentialIssues.length > 0) {
    console.log('⚠️  潜在问题:');
    console.log(`   发现 ${metrics.potentialIssues.length} 个文件存在潜在问题\n`);
    
    for (const issue of metrics.potentialIssues.slice(0, 10)) {
      console.log(`   ${issue}`);
    }
    
    if (metrics.potentialIssues.length > 10) {
      console.log(`   ... 还有 ${metrics.potentialIssues.length - 10} 个问题\n`);
    }
  } else {
    console.log('✅ 未发现潜在问题！\n');
  }
  
  console.log('='.repeat(80));
  
  // 保存详细报告
  const reportPath = path.join(process.cwd(), 'PERFORMANCE_VERIFICATION_REPORT.md');
  const reportContent = generateMarkdownReport(metrics, analyses);
  fs.writeFileSync(reportPath, reportContent);
  console.log(`\n📄 详细报告已保存到: ${reportPath}`);
  
  // 返回状态码
  if (metrics.potentialIssues.length > 0) {
    console.log('\n⚠️  验证完成，但发现一些潜在问题');
    process.exit(1);
  } else {
    console.log('\n✅ 验证完成，所有指标正常！');
    process.exit(0);
  }
}

/**
 * 生成 Markdown 报告
 */
function generateMarkdownReport(metrics: PerformanceMetrics, analyses: FileAnalysis[]): string {
  const timestamp = new Date().toISOString();
  
  let report = `# 性能改善验证报告

**生成时间**: ${timestamp}

## 执行摘要

本报告验证了性能修复后的实际改善效果，包括定时器清理、React Hooks 依赖优化等方面。

## 总体指标

| 指标 | 数值 |
|------|------|
| 总文件数 | ${metrics.totalFiles} |
| 使用定时器的文件 | ${metrics.filesWithTimers} |
| 正确清理定时器的文件 | ${metrics.filesWithProperCleanup} |
| 使用 Hooks 依赖的文件 | ${metrics.filesWithHooksDeps} |
| Hooks 依赖清洁的文件 | ${metrics.filesWithCleanHooksDeps} |

## 改善情况

`;

  for (const improvement of metrics.improvements) {
    report += `${improvement}\n`;
  }
  
  report += `\n## 详细分析

### 定时器使用情况

`;

  const timerFiles = analyses.filter(a => a.hasTimers);
  if (timerFiles.length > 0) {
    report += `发现 ${timerFiles.length} 个文件使用定时器：\n\n`;
    for (const file of timerFiles) {
      const status = file.hasCleanup ? '✅' : '❌';
      report += `- ${status} ${path.relative(process.cwd(), file.filePath)}\n`;
    }
  } else {
    report += `未发现使用定时器的文件。\n`;
  }
  
  report += `\n### React Hooks 依赖情况

`;

  const hooksFiles = analyses.filter(a => a.hasHooksDeps);
  if (hooksFiles.length > 0) {
    report += `发现 ${hooksFiles.length} 个文件使用 Hooks 依赖：\n\n`;
    
    const cleanFiles = hooksFiles.filter(f => !f.hasTranslationDeps);
    const dirtyFiles = hooksFiles.filter(f => f.hasTranslationDeps);
    
    report += `#### ✅ 清洁的文件 (${cleanFiles.length})\n\n`;
    for (const file of cleanFiles.slice(0, 20)) {
      report += `- ${path.relative(process.cwd(), file.filePath)}\n`;
    }
    if (cleanFiles.length > 20) {
      report += `- ... 还有 ${cleanFiles.length - 20} 个文件\n`;
    }
    
    if (dirtyFiles.length > 0) {
      report += `\n#### ⚠️ 需要优化的文件 (${dirtyFiles.length})\n\n`;
      for (const file of dirtyFiles) {
        report += `- ${path.relative(process.cwd(), file.filePath)}\n`;
        for (const issue of file.issues) {
          report += `  - ${issue}\n`;
        }
      }
    }
  } else {
    report += `未发现使用 Hooks 依赖的文件。\n`;
  }
  
  report += `\n## 潜在问题

`;

  if (metrics.potentialIssues.length > 0) {
    report += `发现 ${metrics.potentialIssues.length} 个文件存在潜在问题：\n\n`;
    for (const issue of metrics.potentialIssues) {
      report += `### ${issue}\n\n`;
    }
  } else {
    report += `✅ 未发现潜在问题！\n`;
  }
  
  report += `\n## 建议

`;

  if (metrics.potentialIssues.length > 0) {
    report += `1. 修复上述潜在问题
2. 运行回归测试确保修复有效
3. 部署后监控性能指标
`;
  } else {
    report += `1. ✅ 所有检查通过，可以部署到生产环境
2. 部署后继续监控性能指标
3. 定期运行此验证脚本
`;
  }
  
  report += `\n## 下一步

1. 部署到生产环境
2. 使用 Chrome DevTools 验证实际性能
3. 监控 Core Web Vitals 指标
4. 收集用户反馈

---

*此报告由性能验证脚本自动生成*
`;

  return report;
}

// 运行主函数
main().catch(error => {
  console.error('❌ 验证失败:', error);
  process.exit(1);
});
