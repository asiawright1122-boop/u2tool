#!/usr/bin/env tsx

/**
 * React Hooks 分析器
 * 
 * 系统性地分析项目中所有 React Hooks 的使用情况，识别：
 * 1. 对象和函数依赖（无限循环风险）
 * 2. 翻译函数 t 依赖（不必要的重渲染）
 * 3. 过时闭包问题（空依赖数组但使用外部变量）
 * 4. 缺少清理函数（内存泄漏风险）
 * 
 * 使用方法：
 *   npx tsx scripts/performance-audit/hooks-analyzer.ts
 *   npx tsx scripts/performance-audit/hooks-analyzer.ts --dir src/components/tools
 *   npx tsx scripts/performance-audit/hooks-analyzer.ts --file src/components/Header.tsx
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

// ============================================================================
// 数据结构定义
// ============================================================================

interface HooksIssue {
  file: string;
  line: number;
  column: number;
  hookType: 'useEffect' | 'useMemo' | 'useCallback';
  severity: 'critical' | 'warning' | 'info';
  issueType: 'infinite-loop-risk' | 'unnecessary-rerender' | 'stale-closure' | 'missing-cleanup';
  message: string;
  suggestion: string;
  autoFixable: boolean;
  codeSnippet?: string;
}

interface FileAnalysisResult {
  file: string;
  totalHooks: number;
  issues: HooksIssue[];
  hooksCount: {
    useEffect: number;
    useMemo: number;
    useCallback: number;
  };
}

interface HooksAnalysisResult {
  timestamp: string;
  totalFiles: number;
  totalHooks: number;
  totalIssues: number;
  issuesByType: {
    infiniteLoopRisk: HooksIssue[];
    unnecessaryRerender: HooksIssue[];
    staleClosure: HooksIssue[];
    missingCleanup: HooksIssue[];
  };
  issuesBySeverity: {
    critical: number;
    warning: number;
    info: number;
  };
  fileResults: FileAnalysisResult[];
}

// ============================================================================
// React Hooks 分析器类
// ============================================================================

class HooksAnalyzer {
  private issues: HooksIssue[] = [];
  private fileResults: FileAnalysisResult[] = [];
  private totalHooks = 0;

  /**
   * 分析指定目录下的所有组件文件
   */
  async analyzeDirectory(directory: string): Promise<HooksAnalysisResult> {
    console.log(`🔍 开始分析目录: ${directory}\n`);

    const files = this.getAllTsxFiles(directory);
    console.log(`📁 找到 ${files.length} 个文件\n`);

    for (const file of files) {
      await this.analyzeFile(file);
    }

    return this.generateReport();
  }

  /**
   * 分析单个文件
   */
  async analyzeFile(filePath: string): Promise<FileAnalysisResult> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const fileIssues: HooksIssue[] = [];
    const hooksCount = {
      useEffect: 0,
      useMemo: 0,
      useCallback: 0
    };

    // 遍历 AST 查找 Hook 调用
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isIdentifier(expression)) {
          const hookName = expression.text;
          
          if (hookName === 'useEffect') {
            hooksCount.useEffect++;
            this.totalHooks++;
            const issues = this.analyzeUseEffect(node, sourceFile, filePath);
            fileIssues.push(...issues);
          } else if (hookName === 'useMemo') {
            hooksCount.useMemo++;
            this.totalHooks++;
            const issues = this.analyzeUseMemo(node, sourceFile, filePath);
            fileIssues.push(...issues);
          } else if (hookName === 'useCallback') {
            hooksCount.useCallback++;
            this.totalHooks++;
            const issues = this.analyzeUseCallback(node, sourceFile, filePath);
            fileIssues.push(...issues);
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    const result: FileAnalysisResult = {
      file: path.relative(process.cwd(), filePath),
      totalHooks: hooksCount.useEffect + hooksCount.useMemo + hooksCount.useCallback,
      issues: fileIssues,
      hooksCount
    };

    this.fileResults.push(result);
    this.issues.push(...fileIssues);

    return result;
  }

  /**
   * 分析 useEffect 调用
   */
  private analyzeUseEffect(
    node: ts.CallExpression,
    sourceFile: ts.SourceFile,
    filePath: string
  ): HooksIssue[] {
    const issues: HooksIssue[] = [];

    // 检查依赖数组
    const depsArg = node.arguments[1];
    if (depsArg) {
      issues.push(...this.analyzeDependencies(node, depsArg, 'useEffect', sourceFile, filePath));
    }

    // 检查清理函数
    const callback = node.arguments[0];
    if (callback && (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback))) {
      const hasCleanup = this.hasCleanupFunction(callback);
      const hasSideEffects = this.hasSideEffects(callback, sourceFile);

      if (hasSideEffects && !hasCleanup) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        issues.push({
          file: path.relative(process.cwd(), filePath),
          line: line + 1,
          column: character + 1,
          hookType: 'useEffect',
          severity: 'warning',
          issueType: 'missing-cleanup',
          message: 'useEffect 有副作用但缺少清理函数',
          suggestion: '在 useEffect 中返回清理函数，移除事件监听器、清理定时器等',
          autoFixable: false,
          codeSnippet: this.getCodeSnippet(sourceFile, node)
        });
      }
    }

    return issues;
  }

  /**
   * 分析 useMemo 调用
   */
  private analyzeUseMemo(
    node: ts.CallExpression,
    sourceFile: ts.SourceFile,
    filePath: string
  ): HooksIssue[] {
    const issues: HooksIssue[] = [];

    const depsArg = node.arguments[1];
    if (depsArg) {
      issues.push(...this.analyzeDependencies(node, depsArg, 'useMemo', sourceFile, filePath));
    }

    return issues;
  }

  /**
   * 分析 useCallback 调用
   */
  private analyzeUseCallback(
    node: ts.CallExpression,
    sourceFile: ts.SourceFile,
    filePath: string
  ): HooksIssue[] {
    const issues: HooksIssue[] = [];

    const depsArg = node.arguments[1];
    if (depsArg) {
      issues.push(...this.analyzeDependencies(node, depsArg, 'useCallback', sourceFile, filePath));
    }

    return issues;
  }

  /**
   * 分析依赖数组
   */
  private analyzeDependencies(
    hookNode: ts.CallExpression,
    depsArg: ts.Expression,
    hookType: 'useEffect' | 'useMemo' | 'useCallback',
    sourceFile: ts.SourceFile,
    filePath: string
  ): HooksIssue[] {
    const issues: HooksIssue[] = [];

    if (!ts.isArrayLiteralExpression(depsArg)) {
      return issues;
    }

    for (const dep of depsArg.elements) {
      // 检测对象字面量
      if (ts.isObjectLiteralExpression(dep)) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(dep.getStart());
        issues.push({
          file: path.relative(process.cwd(), filePath),
          line: line + 1,
          column: character + 1,
          hookType,
          severity: 'critical',
          issueType: 'infinite-loop-risk',
          message: `${hookType} 依赖数组中包含对象字面量，会导致无限循环`,
          suggestion: '将对象提取到组件外部或使用 useMemo 包装',
          autoFixable: true,
          codeSnippet: this.getCodeSnippet(sourceFile, hookNode)
        });
      }

      // 检测函数表达式
      if (ts.isArrowFunction(dep) || ts.isFunctionExpression(dep)) {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(dep.getStart());
        issues.push({
          file: path.relative(process.cwd(), filePath),
          line: line + 1,
          column: character + 1,
          hookType,
          severity: 'critical',
          issueType: 'infinite-loop-risk',
          message: `${hookType} 依赖数组中包含函数表达式，会导致无限循环`,
          suggestion: '将函数提取到组件外部或使用 useCallback 包装',
          autoFixable: true,
          codeSnippet: this.getCodeSnippet(sourceFile, hookNode)
        });
      }

      // 检测翻译函数 t
      if (ts.isIdentifier(dep) && dep.text === 't') {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(dep.getStart());
        issues.push({
          file: path.relative(process.cwd(), filePath),
          line: line + 1,
          column: character + 1,
          hookType,
          severity: 'warning',
          issueType: 'unnecessary-rerender',
          message: `${hookType} 依赖数组中包含翻译函数 't'，会导致不必要的重渲染`,
          suggestion: '从依赖数组中移除 t，并添加 ESLint 注释: // eslint-disable-next-line react-hooks/exhaustive-deps',
          autoFixable: true,
          codeSnippet: this.getCodeSnippet(sourceFile, hookNode)
        });
      }

      // 检测可能的对象引用（chartTheme 等）
      if (ts.isIdentifier(dep)) {
        const depName = dep.text;
        // 常见的对象引用模式
        const objectPatterns = ['theme', 'config', 'options', 'settings', 'chartTheme'];
        if (objectPatterns.some(pattern => depName.toLowerCase().includes(pattern))) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(dep.getStart());
          issues.push({
            file: path.relative(process.cwd(), filePath),
            line: line + 1,
            column: character + 1,
            hookType,
            severity: 'warning',
            issueType: 'infinite-loop-risk',
            message: `${hookType} 依赖数组中包含可能的对象引用 '${depName}'，可能导致不必要的重渲染`,
            suggestion: `如果 ${depName} 是对象，考虑只依赖其具体属性（如 ${depName}.property）或使用 useMemo`,
            autoFixable: false,
            codeSnippet: this.getCodeSnippet(sourceFile, hookNode)
          });
        }
      }
    }

    return issues;
  }

  /**
   * 检查是否有清理函数
   */
  private hasCleanupFunction(callback: ts.ArrowFunction | ts.FunctionExpression): boolean {
    const body = callback.body;
    
    if (ts.isBlock(body)) {
      // 查找 return 语句
      for (const statement of body.statements) {
        if (ts.isReturnStatement(statement) && statement.expression) {
          // 检查返回的是否是函数
          if (ts.isArrowFunction(statement.expression) || ts.isFunctionExpression(statement.expression)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * 检查是否有副作用
   */
  private hasSideEffects(callback: ts.ArrowFunction | ts.FunctionExpression, sourceFile: ts.SourceFile): boolean {
    const text = callback.getText(sourceFile);
    
    // 检查常见的副作用模式
    const sideEffectPatterns = [
      'addEventListener',
      'setTimeout',
      'setInterval',
      'subscribe',
      'on(',
      'fetch(',
      'axios.'
    ];

    return sideEffectPatterns.some(pattern => text.includes(pattern));
  }

  /**
   * 获取代码片段
   */
  private getCodeSnippet(sourceFile: ts.SourceFile, node: ts.Node): string {
    const start = node.getStart(sourceFile);
    const end = node.getEnd();
    const text = sourceFile.text.substring(start, end);
    
    // 限制长度
    if (text.length > 200) {
      return text.substring(0, 200) + '...';
    }
    
    return text;
  }

  /**
   * 递归获取所有 .tsx 和 .ts 文件
   */
  private getAllTsxFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      console.error(`❌ 目录不存在: ${dir}`);
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // 跳过 node_modules 和 .next 等目录
        if (!['node_modules', '.next', '.git', 'dist', 'build'].includes(entry.name)) {
          files.push(...this.getAllTsxFiles(fullPath));
        }
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        // 跳过测试文件和类型定义文件
        if (!entry.name.endsWith('.test.ts') && !entry.name.endsWith('.test.tsx') && !entry.name.endsWith('.d.ts')) {
          files.push(fullPath);
        }
      }
    }

    return files;
  }

  /**
   * 生成分析报告
   */
  private generateReport(): HooksAnalysisResult {
    const infiniteLoopRisk = this.issues.filter(i => i.issueType === 'infinite-loop-risk');
    const unnecessaryRerender = this.issues.filter(i => i.issueType === 'unnecessary-rerender');
    const staleClosure = this.issues.filter(i => i.issueType === 'stale-closure');
    const missingCleanup = this.issues.filter(i => i.issueType === 'missing-cleanup');

    const critical = this.issues.filter(i => i.severity === 'critical').length;
    const warning = this.issues.filter(i => i.severity === 'warning').length;
    const info = this.issues.filter(i => i.severity === 'info').length;

    return {
      timestamp: new Date().toISOString(),
      totalFiles: this.fileResults.length,
      totalHooks: this.totalHooks,
      totalIssues: this.issues.length,
      issuesByType: {
        infiniteLoopRisk,
        unnecessaryRerender,
        staleClosure,
        missingCleanup
      },
      issuesBySeverity: {
        critical,
        warning,
        info
      },
      fileResults: this.fileResults
    };
  }

  /**
   * 打印报告到控制台
   */
  printReport(report: HooksAnalysisResult): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 React Hooks 分析报告');
    console.log('='.repeat(80));
    console.log(`\n⏰ 分析时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    console.log(`📁 分析文件: ${report.totalFiles} 个`);
    console.log(`🎣 总 Hooks 数: ${report.totalHooks} 个`);
    console.log(`\n🔴 Critical 问题: ${report.issuesBySeverity.critical} 个`);
    console.log(`🟡 Warning 问题: ${report.issuesBySeverity.warning} 个`);
    console.log(`🔵 Info 问题: ${report.issuesBySeverity.info} 个`);
    console.log(`📊 总问题数: ${report.totalIssues} 个`);

    console.log('\n📈 问题类型统计:');
    console.log(`  - 无限循环风险: ${report.issuesByType.infiniteLoopRisk.length} 个`);
    console.log(`  - 不必要的重渲染: ${report.issuesByType.unnecessaryRerender.length} 个`);
    console.log(`  - 过时闭包: ${report.issuesByType.staleClosure.length} 个`);
    console.log(`  - 缺少清理函数: ${report.issuesByType.missingCleanup.length} 个`);

    // 显示 Critical 问题详情
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.log('\n🔴 Critical 问题详情:');
      console.log('='.repeat(80));
      
      criticalIssues.slice(0, 10).forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.hookType}] ${issue.file}:${issue.line}:${issue.column}`);
        console.log(`   问题: ${issue.message}`);
        console.log(`   建议: ${issue.suggestion}`);
        console.log(`   可自动修复: ${issue.autoFixable ? '✅ 是' : '❌ 否'}`);
      });

      if (criticalIssues.length > 10) {
        console.log(`\n   ... 还有 ${criticalIssues.length - 10} 个 critical 问题`);
      }
    }

    // 显示文件统计（问题最多的前 10 个文件）
    const filesWithIssues = report.fileResults
      .filter(f => f.issues.length > 0)
      .sort((a, b) => b.issues.length - a.issues.length)
      .slice(0, 10);

    if (filesWithIssues.length > 0) {
      console.log('\n📁 问题最多的文件 (Top 10):');
      console.log('='.repeat(80));
      filesWithIssues.forEach((file, index) => {
        console.log(`${index + 1}. ${file.file}`);
        console.log(`   Hooks: ${file.totalHooks} 个, 问题: ${file.issues.length} 个`);
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log('💡 下一步建议:');
    console.log('='.repeat(80));
    
    if (report.issuesBySeverity.critical > 0) {
      console.log('\n1. 优先修复 Critical 问题（可能导致无限循环）');
      console.log('2. 查看详细报告: cat hooks-analysis-report.json');
      console.log('3. 运行自动修复: npx tsx scripts/performance-audit/auto-fix-hooks.ts');
    } else {
      console.log('\n✅ 没有发现 Critical 问题！');
      if (report.issuesBySeverity.warning > 0) {
        console.log('   建议修复 Warning 问题以进一步优化性能。');
      }
    }

    console.log('\n');
  }

  /**
   * 保存 JSON 报告
   */
  saveJsonReport(report: HooksAnalysisResult, outputPath: string): void {
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    console.log(`📄 JSON 报告已保存到: ${outputPath}`);
  }

  /**
   * 保存 Markdown 报告
   */
  saveMarkdownReport(report: HooksAnalysisResult, outputPath: string): void {
    const lines: string[] = [];

    lines.push('# React Hooks 分析报告');
    lines.push('');
    lines.push(`**分析时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    lines.push(`**分析文件**: ${report.totalFiles} 个`);
    lines.push(`**总 Hooks 数**: ${report.totalHooks} 个`);
    lines.push('');
    lines.push('## 📊 问题统计');
    lines.push('');
    lines.push('### 按严重程度');
    lines.push('');
    lines.push(`| 严重程度 | 数量 |`);
    lines.push(`|---------|------|`);
    lines.push(`| 🔴 Critical | ${report.issuesBySeverity.critical} |`);
    lines.push(`| 🟡 Warning | ${report.issuesBySeverity.warning} |`);
    lines.push(`| 🔵 Info | ${report.issuesBySeverity.info} |`);
    lines.push(`| **总计** | **${report.totalIssues}** |`);
    lines.push('');
    lines.push('### 按问题类型');
    lines.push('');
    lines.push(`| 问题类型 | 数量 |`);
    lines.push(`|---------|------|`);
    lines.push(`| 无限循环风险 | ${report.issuesByType.infiniteLoopRisk.length} |`);
    lines.push(`| 不必要的重渲染 | ${report.issuesByType.unnecessaryRerender.length} |`);
    lines.push(`| 过时闭包 | ${report.issuesByType.staleClosure.length} |`);
    lines.push(`| 缺少清理函数 | ${report.issuesByType.missingCleanup.length} |`);
    lines.push('');

    // Critical 问题详情
    const criticalIssues = report.issuesByType.infiniteLoopRisk.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      lines.push('## 🔴 Critical 问题详情');
      lines.push('');
      
      criticalIssues.forEach((issue, index) => {
        lines.push(`### ${index + 1}. ${issue.message}`);
        lines.push('');
        lines.push(`**文件**: \`${issue.file}:${issue.line}:${issue.column}\``);
        lines.push(`**Hook 类型**: ${issue.hookType}`);
        lines.push(`**问题类型**: ${issue.issueType}`);
        lines.push(`**可自动修复**: ${issue.autoFixable ? '✅ 是' : '❌ 否'}`);
        lines.push('');
        lines.push(`**建议**: ${issue.suggestion}`);
        lines.push('');
        if (issue.codeSnippet) {
          lines.push('**代码片段**:');
          lines.push('```typescript');
          lines.push(issue.codeSnippet);
          lines.push('```');
          lines.push('');
        }
      });
    }

    // Warning 问题摘要
    const warningIssues = this.issues.filter(i => i.severity === 'warning');
    if (warningIssues.length > 0) {
      lines.push('## 🟡 Warning 问题摘要');
      lines.push('');
      lines.push(`共 ${warningIssues.length} 个 warning 问题。`);
      lines.push('');
      
      // 按文件分组
      const issuesByFile = new Map<string, HooksIssue[]>();
      warningIssues.forEach(issue => {
        const existing = issuesByFile.get(issue.file) || [];
        existing.push(issue);
        issuesByFile.set(issue.file, existing);
      });

      lines.push('### 按文件分组');
      lines.push('');
      issuesByFile.forEach((issues, file) => {
        lines.push(`- **${file}**: ${issues.length} 个问题`);
      });
      lines.push('');
    }

    // 文件统计
    const filesWithIssues = report.fileResults
      .filter(f => f.issues.length > 0)
      .sort((a, b) => b.issues.length - a.issues.length);

    if (filesWithIssues.length > 0) {
      lines.push('## 📁 文件统计');
      lines.push('');
      lines.push(`| 文件 | Hooks 数 | 问题数 |`);
      lines.push(`|------|---------|--------|`);
      filesWithIssues.slice(0, 20).forEach(file => {
        lines.push(`| ${file.file} | ${file.totalHooks} | ${file.issues.length} |`);
      });
      lines.push('');
    }

    // 下一步建议
    lines.push('## 💡 下一步建议');
    lines.push('');
    if (report.issuesBySeverity.critical > 0) {
      lines.push('1. **优先修复 Critical 问题** - 这些问题可能导致无限循环和页面无响应');
      lines.push('2. **运行自动修复脚本** - `npx tsx scripts/performance-audit/auto-fix-hooks.ts`');
      lines.push('3. **手动修复复杂问题** - 某些问题需要理解业务逻辑才能正确修复');
      lines.push('4. **添加测试** - 确保修复后功能正常');
    } else {
      lines.push('✅ 没有发现 Critical 问题！');
      if (report.issuesBySeverity.warning > 0) {
        lines.push('');
        lines.push('建议修复 Warning 问题以进一步优化性能：');
        lines.push('- 移除不必要的依赖（如翻译函数 t）');
        lines.push('- 添加缺失的清理函数');
        lines.push('- 优化对象依赖');
      }
    }

    fs.writeFileSync(outputPath, lines.join('\n'));
    console.log(`📄 Markdown 报告已保存到: ${outputPath}`);
  }
}

// ============================================================================
// 命令行接口
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const analyzer = new HooksAnalyzer();

  let result: HooksAnalysisResult;

  // 解析命令行参数
  if (args.includes('--file')) {
    const fileIndex = args.indexOf('--file');
    const filePath = args[fileIndex + 1];
    
    if (!filePath) {
      console.error('❌ 请指定文件路径: --file <path>');
      process.exit(1);
    }

    console.log(`🔍 分析单个文件: ${filePath}\n`);
    await analyzer.analyzeFile(path.resolve(filePath));
    result = analyzer['generateReport']();
  } else if (args.includes('--dir')) {
    const dirIndex = args.indexOf('--dir');
    const dirPath = args[dirIndex + 1];
    
    if (!dirPath) {
      console.error('❌ 请指定目录路径: --dir <path>');
      process.exit(1);
    }

    result = await analyzer.analyzeDirectory(path.resolve(dirPath));
  } else {
    // 默认分析 src/components 目录
    const defaultDir = path.join(process.cwd(), 'src/components');
    result = await analyzer.analyzeDirectory(defaultDir);
  }

  // 打印报告
  analyzer.printReport(result);

  // 保存报告
  const jsonPath = path.join(process.cwd(), 'hooks-analysis-report.json');
  const mdPath = path.join(process.cwd(), 'HOOKS_ANALYSIS_REPORT.md');
  
  analyzer.saveJsonReport(result, jsonPath);
  analyzer.saveMarkdownReport(result, mdPath);

  // 根据问题数量设置退出码
  if (result.issuesBySeverity.critical > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// 运行分析
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 分析过程中出错:', error);
    process.exit(1);
  });
}

export { HooksAnalyzer, HooksAnalysisResult, HooksIssue, FileAnalysisResult };
