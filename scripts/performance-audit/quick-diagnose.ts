#!/usr/bin/env tsx

/**
 * 快速性能诊断脚本
 * 
 * 快速扫描项目中的关键性能问题：
 * 1. React Hooks 依赖项问题（对象、函数、翻译函数 t）
 * 2. 内存泄漏风险（事件监听器、定时器、ECharts 实例）
 * 3. 大型依赖（> 100KB）
 * 4. 缺少代码分割
 * 
 * 使用方法：
 *   npx tsx scripts/performance-audit/quick-diagnose.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface DiagnosticIssue {
  file: string;
  line: number;
  column: number;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  suggestion: string;
}

interface DiagnosticReport {
  timestamp: string;
  totalFiles: number;
  totalIssues: number;
  criticalIssues: number;
  warningIssues: number;
  issues: DiagnosticIssue[];
  summary: {
    hooksIssues: number;
    memoryLeakRisks: number;
    largeDependencies: number;
    missingCodeSplitting: number;
  };
}

class QuickDiagnostic {
  private issues: DiagnosticIssue[] = [];
  private filesScanned = 0;

  /**
   * 运行快速诊断
   */
  async run(): Promise<DiagnosticReport> {
    console.log('🔍 开始快速性能诊断...\n');

    // 1. 扫描 React Hooks 问题
    console.log('📊 扫描 React Hooks 使用...');
    await this.scanHooksIssues();

    // 2. 扫描内存泄漏风险
    console.log('💾 检查内存泄漏风险...');
    await this.scanMemoryLeaks();

    // 3. 检查大型依赖
    console.log('📦 分析依赖大小...');
    await this.checkLargeDependencies();

    // 4. 检查代码分割
    console.log('✂️  检查代码分割...');
    await this.checkCodeSplitting();

    // 生成报告
    const report = this.generateReport();
    
    // 输出报告
    this.printReport(report);
    
    // 保存报告
    this.saveReport(report);

    return report;
  }

  /**
   * 扫描 React Hooks 问题
   */
  private async scanHooksIssues(): Promise<void> {
    const componentsDir = path.join(process.cwd(), 'src/components');
    const files = this.getAllTsxFiles(componentsDir);

    for (const file of files) {
      this.filesScanned++;
      const content = fs.readFileSync(file, 'utf-8');
      const sourceFile = ts.createSourceFile(
        file,
        content,
        ts.ScriptTarget.Latest,
        true
      );

      this.analyzeHooksInFile(sourceFile, file);
    }
  }

  /**
   * 分析文件中的 Hooks 使用
   */
  private analyzeHooksInFile(sourceFile: ts.SourceFile, filePath: string): void {
    const visit = (node: ts.Node) => {
      // 检测 useEffect、useMemo、useCallback
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        if (ts.isIdentifier(expression)) {
          const hookName = expression.text;
          
          if (['useEffect', 'useMemo', 'useCallback'].includes(hookName)) {
            this.analyzeHookCall(node, hookName, sourceFile, filePath);
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  /**
   * 分析单个 Hook 调用
   */
  private analyzeHookCall(
    node: ts.CallExpression,
    hookName: string,
    sourceFile: ts.SourceFile,
    filePath: string
  ): void {
    // 获取依赖数组（第二个参数）
    const depsArg = node.arguments[1];
    
    if (!depsArg) {
      // useEffect 没有依赖数组 - 可能导致每次渲染都执行
      if (hookName === 'useEffect') {
        const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
        this.addIssue({
          file: path.relative(process.cwd(), filePath),
          line: line + 1,
          column: character + 1,
          severity: 'warning',
          category: 'React Hooks',
          message: `${hookName} 缺少依赖数组，每次渲染都会执行`,
          suggestion: '添加依赖数组，或使用空数组 [] 表示只在挂载时执行'
        });
      }
      return;
    }

    // 检查依赖数组
    if (ts.isArrayLiteralExpression(depsArg)) {
      for (const dep of depsArg.elements) {
        // 检测对象字面量
        if (ts.isObjectLiteralExpression(dep)) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(dep.getStart());
          this.addIssue({
            file: path.relative(process.cwd(), filePath),
            line: line + 1,
            column: character + 1,
            severity: 'critical',
            category: 'React Hooks',
            message: `${hookName} 依赖数组中包含对象字面量，会导致无限循环`,
            suggestion: '将对象提取到组件外部或使用 useMemo 包装'
          });
        }

        // 检测函数表达式
        if (ts.isArrowFunction(dep) || ts.isFunctionExpression(dep)) {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(dep.getStart());
          this.addIssue({
            file: path.relative(process.cwd(), filePath),
            line: line + 1,
            column: character + 1,
            severity: 'critical',
            category: 'React Hooks',
            message: `${hookName} 依赖数组中包含函数表达式，会导致无限循环`,
            suggestion: '将函数提取到组件外部或使用 useCallback 包装'
          });
        }

        // 检测翻译函数 t
        if (ts.isIdentifier(dep) && dep.text === 't') {
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(dep.getStart());
          this.addIssue({
            file: path.relative(process.cwd(), filePath),
            line: line + 1,
            column: character + 1,
            severity: 'warning',
            category: 'React Hooks',
            message: `${hookName} 依赖数组中包含翻译函数 't'，会导致不必要的重渲染`,
            suggestion: '从依赖数组中移除 t，并添加 ESLint 注释说明原因'
          });
        }
      }
    }
  }

  /**
   * 扫描内存泄漏风险
   */
  private async scanMemoryLeaks(): Promise<void> {
    const componentsDir = path.join(process.cwd(), 'src/components');
    const files = this.getAllTsxFiles(componentsDir);

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      // 检查事件监听器
      lines.forEach((line, index) => {
        if (line.includes('addEventListener') && !content.includes('removeEventListener')) {
          this.addIssue({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            column: line.indexOf('addEventListener') + 1,
            severity: 'critical',
            category: '内存泄漏',
            message: '检测到 addEventListener 但没有对应的 removeEventListener',
            suggestion: '在 useEffect 的清理函数中添加 removeEventListener'
          });
        }

        // 检查定时器
        if ((line.includes('setTimeout') || line.includes('setInterval')) && 
            !content.includes('clearTimeout') && !content.includes('clearInterval')) {
          this.addIssue({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            column: Math.max(line.indexOf('setTimeout'), line.indexOf('setInterval')) + 1,
            severity: 'critical',
            category: '内存泄漏',
            message: '检测到定时器但没有清理代码',
            suggestion: '在 useEffect 的清理函数中添加 clearTimeout/clearInterval'
          });
        }

        // 检查 ECharts 实例
        if (line.includes('getEchartsInstance') && !content.includes('.dispose()')) {
          this.addIssue({
            file: path.relative(process.cwd(), file),
            line: index + 1,
            column: line.indexOf('getEchartsInstance') + 1,
            severity: 'warning',
            category: '内存泄漏',
            message: 'ECharts 实例可能没有正确销毁',
            suggestion: '在组件卸载时调用 echartInstance.dispose()'
          });
        }
      });
    }
  }

  /**
   * 检查大型依赖
   */
  private async checkLargeDependencies(): Promise<void> {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    // 已知的大型依赖
    const knownLargeDeps: Record<string, number> = {
      'echarts': 800, // KB
      '@sentry/nextjs': 200,
      'next': 500,
      'react': 100,
      'typescript': 300
    };

    for (const [dep, size] of Object.entries(knownLargeDeps)) {
      if (dependencies[dep] && size > 100) {
        this.addIssue({
          file: 'package.json',
          line: 0,
          column: 0,
          severity: 'info',
          category: '依赖优化',
          message: `大型依赖: ${dep} (~${size}KB)`,
          suggestion: '考虑使用动态导入或按需加载来减少初始 bundle 大小'
        });
      }
    }
  }

  /**
   * 检查代码分割
   */
  private async checkCodeSplitting(): Promise<void> {
    const toolWrapperPath = path.join(process.cwd(), 'src/components/tools/ToolWrapper.tsx');
    
    if (!fs.existsSync(toolWrapperPath)) {
      return;
    }

    const content = fs.readFileSync(toolWrapperPath, 'utf-8');
    const lines = content.split('\n');

    // 检查是否使用 dynamic import
    let hasDynamicImport = false;
    lines.forEach((line, index) => {
      if (line.includes('dynamic(') && line.includes('import(')) {
        hasDynamicImport = true;
      }

      // 检查静态导入大型库
      if (line.match(/^import .* from ['"]echarts['"]/)) {
        this.addIssue({
          file: 'src/components/tools/ToolWrapper.tsx',
          line: index + 1,
          column: 1,
          severity: 'warning',
          category: '代码分割',
          message: 'ECharts 使用静态导入，应该使用动态导入',
          suggestion: '使用 dynamic(() => import(...)) 进行懒加载'
        });
      }
    });

    if (!hasDynamicImport) {
      this.addIssue({
        file: 'src/components/tools/ToolWrapper.tsx',
        line: 0,
        column: 0,
        severity: 'warning',
        category: '代码分割',
        message: 'ToolWrapper 可能没有使用动态导入',
        suggestion: '使用 next/dynamic 进行代码分割'
      });
    }
  }

  /**
   * 递归获取所有 .tsx 文件
   */
  private getAllTsxFiles(dir: string): string[] {
    const files: string[] = [];

    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.getAllTsxFiles(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * 添加问题
   */
  private addIssue(issue: DiagnosticIssue): void {
    this.issues.push(issue);
  }

  /**
   * 生成报告
   */
  private generateReport(): DiagnosticReport {
    const criticalIssues = this.issues.filter(i => i.severity === 'critical');
    const warningIssues = this.issues.filter(i => i.severity === 'warning');

    return {
      timestamp: new Date().toISOString(),
      totalFiles: this.filesScanned,
      totalIssues: this.issues.length,
      criticalIssues: criticalIssues.length,
      warningIssues: warningIssues.length,
      issues: this.issues.sort((a, b) => {
        // 按严重程度排序
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }),
      summary: {
        hooksIssues: this.issues.filter(i => i.category === 'React Hooks').length,
        memoryLeakRisks: this.issues.filter(i => i.category === '内存泄漏').length,
        largeDependencies: this.issues.filter(i => i.category === '依赖优化').length,
        missingCodeSplitting: this.issues.filter(i => i.category === '代码分割').length
      }
    };
  }

  /**
   * 打印报告
   */
  private printReport(report: DiagnosticReport): void {
    console.log('\n' + '='.repeat(80));
    console.log('📊 快速诊断报告');
    console.log('='.repeat(80));
    console.log(`\n⏰ 扫描时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    console.log(`📁 扫描文件: ${report.totalFiles} 个`);
    console.log(`\n🔴 Critical 问题: ${report.criticalIssues} 个`);
    console.log(`🟡 Warning 问题: ${report.warningIssues} 个`);
    console.log(`📊 总问题数: ${report.totalIssues} 个`);

    console.log('\n📈 问题分类统计:');
    console.log(`  - React Hooks 问题: ${report.summary.hooksIssues} 个`);
    console.log(`  - 内存泄漏风险: ${report.summary.memoryLeakRisks} 个`);
    console.log(`  - 大型依赖: ${report.summary.largeDependencies} 个`);
    console.log(`  - 代码分割问题: ${report.summary.missingCodeSplitting} 个`);

    // 只显示 critical 问题的详情
    const criticalIssues = report.issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      console.log('\n🔴 Critical 问题详情:');
      console.log('='.repeat(80));
      
      criticalIssues.slice(0, 10).forEach((issue, index) => {
        console.log(`\n${index + 1}. [${issue.category}] ${issue.file}:${issue.line}:${issue.column}`);
        console.log(`   问题: ${issue.message}`);
        console.log(`   建议: ${issue.suggestion}`);
      });

      if (criticalIssues.length > 10) {
        console.log(`\n   ... 还有 ${criticalIssues.length - 10} 个 critical 问题`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('💡 下一步建议:');
    console.log('='.repeat(80));
    
    if (report.criticalIssues > 0) {
      console.log('\n1. 优先修复 Critical 问题（可能导致无限循环和页面无响应）');
      console.log('2. 运行完整分析: npx tsx scripts/performance-audit/run-full-audit.ts');
      console.log('3. 查看详细报告: cat performance-audit-report.json');
    } else {
      console.log('\n✅ 没有发现 Critical 问题！');
      console.log('   可以运行完整审查来获取更详细的分析。');
    }

    console.log('\n');
  }

  /**
   * 保存报告
   */
  private saveReport(report: DiagnosticReport): void {
    const reportPath = path.join(process.cwd(), 'performance-audit-quick-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 报告已保存到: ${reportPath}\n`);

    // 同时生成 Markdown 报告
    this.saveMarkdownReport(report);
  }

  /**
   * 保存 Markdown 报告
   */
  private saveMarkdownReport(report: DiagnosticReport): void {
    const lines: string[] = [];

    lines.push('# 前端性能快速诊断报告');
    lines.push('');
    lines.push(`**扫描时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    lines.push(`**扫描文件**: ${report.totalFiles} 个`);
    lines.push('');
    lines.push('## 📊 问题统计');
    lines.push('');
    lines.push(`- 🔴 **Critical 问题**: ${report.criticalIssues} 个`);
    lines.push(`- 🟡 **Warning 问题**: ${report.warningIssues} 个`);
    lines.push(`- 📊 **总问题数**: ${report.totalIssues} 个`);
    lines.push('');
    lines.push('## 📈 问题分类');
    lines.push('');
    lines.push(`| 分类 | 数量 |`);
    lines.push(`|------|------|`);
    lines.push(`| React Hooks 问题 | ${report.summary.hooksIssues} |`);
    lines.push(`| 内存泄漏风险 | ${report.summary.memoryLeakRisks} |`);
    lines.push(`| 大型依赖 | ${report.summary.largeDependencies} |`);
    lines.push(`| 代码分割问题 | ${report.summary.missingCodeSplitting} |`);
    lines.push('');

    // Critical 问题详情
    const criticalIssues = report.issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      lines.push('## 🔴 Critical 问题详情');
      lines.push('');
      
      criticalIssues.forEach((issue, index) => {
        lines.push(`### ${index + 1}. ${issue.message}`);
        lines.push('');
        lines.push(`**文件**: \`${issue.file}:${issue.line}:${issue.column}\``);
        lines.push(`**分类**: ${issue.category}`);
        lines.push(`**建议**: ${issue.suggestion}`);
        lines.push('');
      });
    }

    // Warning 问题摘要
    const warningIssues = report.issues.filter(i => i.severity === 'warning');
    if (warningIssues.length > 0) {
      lines.push('## 🟡 Warning 问题摘要');
      lines.push('');
      lines.push(`共 ${warningIssues.length} 个 warning 问题，详见 JSON 报告。`);
      lines.push('');
    }

    lines.push('## 💡 下一步建议');
    lines.push('');
    if (report.criticalIssues > 0) {
      lines.push('1. 优先修复 Critical 问题（可能导致无限循环和页面无响应）');
      lines.push('2. 运行完整分析获取更详细的报告');
      lines.push('3. 使用自动修复脚本批量修复常见问题');
    } else {
      lines.push('✅ 没有发现 Critical 问题！可以运行完整审查来获取更详细的分析。');
    }

    const mdPath = path.join(process.cwd(), 'PERFORMANCE_AUDIT_QUICK_REPORT.md');
    fs.writeFileSync(mdPath, lines.join('\n'));
    console.log(`📄 Markdown 报告已保存到: ${mdPath}\n`);
  }
}

// 运行诊断
async function main() {
  const diagnostic = new QuickDiagnostic();
  
  try {
    await diagnostic.run();
    process.exit(0);
  } catch (error) {
    console.error('❌ 诊断过程中出错:', error);
    process.exit(1);
  }
}

main();
