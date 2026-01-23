#!/usr/bin/env tsx
/**
 * 性能回归测试脚本
 * 
 * 用途：防止已修复的性能问题再次出现
 * 
 * 测试内容：
 * 1. 定时器必须有清理代码
 * 2. React Hooks 依赖不能包含翻译函数 't'
 * 3. useEffect 必须有清理函数（如果有副作用）
 * 4. 对象和函数不应该直接作为依赖
 * 
 * 使用方法：
 * npx tsx scripts/performance-audit/regression-tests.ts
 * 
 * CI/CD 集成：
 * 在 GitHub Actions 中运行此脚本，如果失败则阻止合并
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface RegressionTest {
  name: string;
  description: string;
  check: (file: string, sourceFile: ts.SourceFile) => TestResult;
}

interface TestResult {
  passed: boolean;
  issues: string[];
}

interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalFiles: number;
  filesWithIssues: number;
  issues: Map<string, string[]>;
}

/**
 * 回归测试定义
 */
const regressionTests: RegressionTest[] = [
  {
    name: 'timer-cleanup',
    description: '定时器必须有清理代码',
    check: (file, sourceFile) => {
      const issues: string[] = [];
      
      // 跳过测试文件
      if (file.includes('.test.') || file.includes('.spec.')) {
        return { passed: true, issues: [] };
      }
      
      // 跳过辅助函数文件（如 delay 函数）
      const content = sourceFile.getFullText();
      if (content.includes('function delay') || 
          content.includes('const delay') ||
          (content.includes('return new Promise') && content.includes('setTimeout'))) {
        return { passed: true, issues: [] };
      }
      
      let hasTimer = false;
      let hasClear = false;
      let hasUseEffect = false;
      let hasReturnStatement = false;
      
      function visit(node: ts.Node) {
        if (ts.isCallExpression(node)) {
          const text = node.expression.getText(sourceFile);
          if (text === 'setTimeout' || text === 'setInterval') {
            hasTimer = true;
          }
          if (text === 'clearTimeout' || text === 'clearInterval') {
            hasClear = true;
          }
          if (text === 'useEffect') {
            hasUseEffect = true;
          }
        }
        
        if (ts.isReturnStatement(node) && hasUseEffect) {
          hasReturnStatement = true;
        }
        
        ts.forEachChild(node, visit);
      }
      
      visit(sourceFile);
      
      if (hasTimer && !hasClear) {
        issues.push('发现定时器但没有清理代码（clearTimeout/clearInterval）');
      }
      
      if (hasTimer && hasUseEffect && !hasReturnStatement) {
        issues.push('useEffect 中使用定时器但没有返回清理函数');
      }
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  },
  
  {
    name: 'hooks-translation-deps',
    description: 'React Hooks 依赖不能包含翻译函数 t',
    check: (file, sourceFile) => {
      const issues: string[] = [];
      
      function visit(node: ts.Node) {
        if (ts.isCallExpression(node)) {
          const text = node.expression.getText(sourceFile);
          if (text === 'useEffect' || text === 'useMemo' || text === 'useCallback') {
            if (node.arguments.length >= 2) {
              const depsArg = node.arguments[1];
              if (ts.isArrayLiteralExpression(depsArg)) {
                for (const element of depsArg.elements) {
                  const depText = element.getText(sourceFile);
                  if (depText === 't') {
                    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
                    issues.push(`第 ${line} 行: ${text} 依赖数组包含翻译函数 't'`);
                  }
                }
              }
            }
          }
        }
        
        ts.forEachChild(node, visit);
      }
      
      visit(sourceFile);
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  },
  
  {
    name: 'hooks-object-deps',
    description: 'React Hooks 依赖不应该包含对象字面量',
    check: (file, sourceFile) => {
      const issues: string[] = [];
      
      function visit(node: ts.Node) {
        if (ts.isCallExpression(node)) {
          const text = node.expression.getText(sourceFile);
          if (text === 'useEffect' || text === 'useMemo' || text === 'useCallback') {
            if (node.arguments.length >= 2) {
              const depsArg = node.arguments[1];
              if (ts.isArrayLiteralExpression(depsArg)) {
                for (const element of depsArg.elements) {
                  if (ts.isObjectLiteralExpression(element)) {
                    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
                    issues.push(`第 ${line} 行: ${text} 依赖数组包含对象字面量（会导致无限循环）`);
                  }
                }
              }
            }
          }
        }
        
        ts.forEachChild(node, visit);
      }
      
      visit(sourceFile);
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  },
  
  {
    name: 'hooks-function-deps',
    description: 'React Hooks 依赖不应该包含函数表达式',
    check: (file, sourceFile) => {
      const issues: string[] = [];
      
      function visit(node: ts.Node) {
        if (ts.isCallExpression(node)) {
          const text = node.expression.getText(sourceFile);
          if (text === 'useEffect' || text === 'useMemo' || text === 'useCallback') {
            if (node.arguments.length >= 2) {
              const depsArg = node.arguments[1];
              if (ts.isArrayLiteralExpression(depsArg)) {
                for (const element of depsArg.elements) {
                  if (ts.isArrowFunction(element) || ts.isFunctionExpression(element)) {
                    const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
                    issues.push(`第 ${line} 行: ${text} 依赖数组包含函数表达式（会导致无限循环）`);
                  }
                }
              }
            }
          }
        }
        
        ts.forEachChild(node, visit);
      }
      
      visit(sourceFile);
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  },
  
  {
    name: 'event-listener-cleanup',
    description: 'addEventListener 必须有对应的 removeEventListener',
    check: (file, sourceFile) => {
      const issues: string[] = [];
      let hasAddListener = false;
      let hasRemoveListener = false;
      
      function visit(node: ts.Node) {
        if (ts.isCallExpression(node)) {
          const text = node.expression.getText(sourceFile);
          if (text.includes('addEventListener')) {
            hasAddListener = true;
          }
          if (text.includes('removeEventListener')) {
            hasRemoveListener = true;
          }
        }
        
        ts.forEachChild(node, visit);
      }
      
      visit(sourceFile);
      
      if (hasAddListener && !hasRemoveListener) {
        issues.push('发现 addEventListener 但没有对应的 removeEventListener');
      }
      
      return {
        passed: issues.length === 0,
        issues
      };
    }
  }
];

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
 * 运行回归测试
 */
function runRegressionTests(files: string[]): TestSummary {
  const summary: TestSummary = {
    totalTests: regressionTests.length,
    passedTests: 0,
    failedTests: 0,
    totalFiles: files.length,
    filesWithIssues: 0,
    issues: new Map()
  };
  
  let processed = 0;
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const sourceFile = ts.createSourceFile(
        file,
        content,
        ts.ScriptTarget.Latest,
        true
      );
      
      const fileIssues: string[] = [];
      
      for (const test of regressionTests) {
        const result = test.check(file, sourceFile);
        if (!result.passed) {
          fileIssues.push(`[${test.name}] ${test.description}`);
          fileIssues.push(...result.issues.map(i => `  - ${i}`));
        }
      }
      
      if (fileIssues.length > 0) {
        summary.filesWithIssues++;
        summary.issues.set(file, fileIssues);
      }
      
      processed++;
      if (processed % 50 === 0) {
        process.stdout.write(`   已测试 ${processed}/${files.length} 个文件\r`);
      }
    } catch (error) {
      console.error(`   ⚠️  测试失败: ${file}`);
    }
  }
  
  console.log(`   已测试 ${processed}/${files.length} 个文件\n`);
  
  // 计算通过/失败的测试数
  summary.passedTests = summary.totalTests - (summary.filesWithIssues > 0 ? summary.totalTests : 0);
  summary.failedTests = summary.filesWithIssues > 0 ? summary.totalTests : 0;
  
  return summary;
}

/**
 * 生成测试报告
 */
function generateReport(summary: TestSummary): string {
  const timestamp = new Date().toISOString();
  
  let report = `# 性能回归测试报告

**生成时间**: ${timestamp}

## 执行摘要

本报告包含性能回归测试的结果，用于防止已修复的性能问题再次出现。

## 测试结果

| 指标 | 数值 |
|------|------|
| 总测试数 | ${summary.totalTests} |
| 通过的测试 | ${summary.passedTests} |
| 失败的测试 | ${summary.failedTests} |
| 总文件数 | ${summary.totalFiles} |
| 有问题的文件 | ${summary.filesWithIssues} |

## 测试覆盖

`;

  for (const test of regressionTests) {
    report += `- ✅ ${test.name}: ${test.description}\n`;
  }
  
  report += `\n## 详细结果

`;

  if (summary.filesWithIssues === 0) {
    report += `✅ **所有测试通过！** 未发现性能回归问题。\n`;
  } else {
    report += `⚠️ **发现 ${summary.filesWithIssues} 个文件存在问题**\n\n`;
    
    for (const [file, issues] of summary.issues.entries()) {
      const relativePath = path.relative(process.cwd(), file);
      report += `### ${relativePath}\n\n`;
      for (const issue of issues) {
        report += `${issue}\n`;
      }
      report += `\n`;
    }
  }
  
  report += `## 建议

`;

  if (summary.filesWithIssues > 0) {
    report += `1. ❌ **不要合并此 PR** - 发现性能回归问题
2. 修复上述问题
3. 重新运行回归测试
4. 确保所有测试通过后再合并
`;
  } else {
    report += `1. ✅ 所有回归测试通过
2. 可以安全合并此 PR
3. 继续监控生产环境性能
`;
  }
  
  report += `\n## 如何修复

### 定时器清理

\`\`\`typescript
// ❌ 错误
useEffect(() => {
  const timer = setTimeout(() => {
    // ...
  }, 1000);
}, []);

// ✅ 正确
useEffect(() => {
  const timer = setTimeout(() => {
    // ...
  }, 1000);
  
  return () => clearTimeout(timer);
}, []);
\`\`\`

### React Hooks 依赖

\`\`\`typescript
// ❌ 错误 - 包含翻译函数 t
useEffect(() => {
  console.log(t('message'));
}, [data, t]);

// ✅ 正确 - 移除 t
useEffect(() => {
  console.log(t('message'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]);

// ❌ 错误 - 对象字面量
useMemo(() => {
  return { value: data };
}, [{ value: data }]);

// ✅ 正确 - 使用原始值
useMemo(() => {
  return { value: data };
}, [data]);
\`\`\`

### 事件监听器清理

\`\`\`typescript
// ❌ 错误
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ 正确
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
\`\`\`

---

*此报告由性能回归测试脚本自动生成*
`;

  return report;
}

/**
 * 主函数
 */
async function main() {
  console.log('🧪 开始性能回归测试...\n');
  
  const srcDir = path.join(process.cwd(), 'src');
  
  // 扫描所有文件
  console.log('📂 扫描文件...');
  const files = scanDirectory(srcDir);
  console.log(`   找到 ${files.length} 个文件\n`);
  
  // 运行测试
  console.log('🔬 运行回归测试...');
  const summary = runRegressionTests(files);
  
  // 输出结果
  console.log('=' .repeat(80));
  console.log('性能回归测试结果');
  console.log('='.repeat(80));
  console.log();
  
  console.log('📊 测试统计:');
  console.log(`   总测试数: ${summary.totalTests}`);
  console.log(`   通过的测试: ${summary.passedTests}`);
  console.log(`   失败的测试: ${summary.failedTests}`);
  console.log(`   总文件数: ${summary.totalFiles}`);
  console.log(`   有问题的文件: ${summary.filesWithIssues}`);
  console.log();
  
  if (summary.filesWithIssues === 0) {
    console.log('✅ 所有回归测试通过！\n');
  } else {
    console.log(`⚠️  发现 ${summary.filesWithIssues} 个文件存在问题:\n`);
    
    let count = 0;
    for (const [file, issues] of summary.issues.entries()) {
      if (count >= 5) {
        console.log(`   ... 还有 ${summary.filesWithIssues - 5} 个文件\n`);
        break;
      }
      
      const relativePath = path.relative(process.cwd(), file);
      console.log(`   ${relativePath}:`);
      for (const issue of issues.slice(0, 3)) {
        console.log(`     ${issue}`);
      }
      if (issues.length > 3) {
        console.log(`     ... 还有 ${issues.length - 3} 个问题`);
      }
      console.log();
      count++;
    }
  }
  
  console.log('='.repeat(80));
  
  // 保存报告
  const reportPath = path.join(process.cwd(), 'PERFORMANCE_REGRESSION_TEST_REPORT.md');
  const reportContent = generateReport(summary);
  fs.writeFileSync(reportPath, reportContent);
  console.log(`\n📄 详细报告已保存到: ${reportPath}`);
  
  // 返回状态码
  if (summary.filesWithIssues > 0) {
    console.log('\n❌ 回归测试失败 - 发现性能问题');
    process.exit(1);
  } else {
    console.log('\n✅ 回归测试通过！');
    process.exit(0);
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 测试失败:', error);
  process.exit(1);
});
