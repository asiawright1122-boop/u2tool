#!/usr/bin/env tsx

/**
 * 代码分割检查工具
 * 
 * 检查大型依赖是否使用动态导入和代码分割：
 * 1. 扫描所有 import 语句
 * 2. 识别静态导入的大型库
 * 3. 检测 dynamic() 和 lazy() 的使用
 * 4. 特别检查 ECharts 组件的导入方式
 * 5. 生成代码分割建议
 * 
 * 使用方法：
 *   npx tsx scripts/performance-audit/code-splitting-checker.ts
 *   npx tsx scripts/performance-audit/code-splitting-checker.ts --fix
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface ImportStatement {
  file: string;
  line: number;
  column: number;
  importType: 'static' | 'dynamic' | 'require';
  moduleName: string;
  importClause: string;
  isDynamic: boolean;
  isLazy: boolean;
}

interface CodeSplittingIssue {
  file: string;
  line: number;
  column: number;
  severity: 'critical' | 'warning' | 'info';
  moduleName: string;
  moduleSize: number; // KB
  currentImportType: 'static' | 'dynamic' | 'require';
  suggestion: string;
  autoFixable: boolean;
  fixCode?: string;
}

interface CodeSplittingReport {
  timestamp: string;
  totalFiles: number;
  totalImports: number;
  staticImports: number;
  dynamicImports: number;
  issues: CodeSplittingIssue[];
  issuesByModule: Map<string, CodeSplittingIssue[]>;
  recommendations: string[];
}

// 已知大型库的大小（KB）
const HEAVY_LIBRARIES: Record<string, number> = {
  'echarts': 800,
  'echarts-for-react': 50,
  'echarts-liquidfill': 30,
  'echarts-wordcloud': 40,
  'xlsx': 600,
  'jspdf': 200,
  'pdf-lib': 180,
  'pdfjs-dist': 400,
  'html2pdf.js': 150,
  'html2canvas': 100,
  'mammoth': 150,
  'marked': 50,
  'lucide-react': 200,
  'react-markdown': 40,
  'colorthief': 30,
  'gif.js': 50,
  'gifuct-js': 40,
  'exifreader': 60,
};

// 应该使用动态导入的库（> 100KB）
const SHOULD_BE_DYNAMIC = Object.entries(HEAVY_LIBRARIES)
  .filter(([_, size]) => size > 100)
  .map(([name]) => name);

class CodeSplittingChecker {
  private imports: ImportStatement[] = [];
  private issues: CodeSplittingIssue[] = [];
  private issuesByModule: Map<string, CodeSplittingIssue[]> = new Map();
  private dynamicallyLoadedComponents: Set<string> = new Set();

  /**
   * 运行代码分割检查
   */
  async check(): Promise<CodeSplittingReport> {
    console.log('🔍 开始代码分割检查...\n');

    // 0. 解析 ToolRegistry，识别动态加载的组件
    console.log('📋 解析 ToolRegistry...');
    await this.parseDynamicallyLoadedComponents();
    console.log(`   找到 ${this.dynamicallyLoadedComponents.size} 个动态加载的组件\n`);

    // 1. 扫描所有源文件
    console.log('📂 扫描源文件...');
    const sourceFiles = this.getAllSourceFiles();
    console.log(`   找到 ${sourceFiles.length} 个源文件\n`);

    // 2. 分析每个文件的导入语句
    console.log('📊 分析导入语句...');
    for (const file of sourceFiles) {
      await this.analyzeFile(file);
    }
    console.log(`   找到 ${this.imports.length} 个导入语句\n`);

    // 3. 识别问题
    console.log('🔎 识别代码分割问题...');
    this.identifyIssues();
    console.log(`   发现 ${this.issues.length} 个问题\n`);

    // 4. 生成报告
    const report = this.generateReport();

    // 5. 输出报告
    this.printReport(report);

    // 6. 保存报告
    this.saveReport(report);

    return report;
  }

  /**
   * 解析 ToolRegistry，识别动态加载的组件
   */
  private async parseDynamicallyLoadedComponents(): Promise<void> {
    const registryPath = path.join(process.cwd(), 'src/components/tools/ToolRegistry.tsx');
    
    if (!fs.existsSync(registryPath)) {
      console.warn('   ⚠️ ToolRegistry.tsx 不存在，跳过动态组件解析');
      return;
    }

    const content = fs.readFileSync(registryPath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      registryPath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const visit = (node: ts.Node) => {
      // 查找 createToolImport(() => import('./ComponentName'))
      if (ts.isCallExpression(node)) {
        const expression = node.expression;
        
        if (ts.isIdentifier(expression) && expression.text === 'createToolImport') {
          const firstArg = node.arguments[0];
          
          if (firstArg && ts.isArrowFunction(firstArg)) {
            const body = firstArg.body;
            
            if (ts.isCallExpression(body) && body.expression.kind === ts.SyntaxKind.ImportKeyword) {
              const importArg = body.arguments[0];
              
              if (importArg && ts.isStringLiteral(importArg)) {
                const componentPath = importArg.text;
                // 转换为文件路径: './ComponentName' -> 'src/components/tools/ComponentName.tsx'
                const componentName = componentPath.replace('./', '');
                const fullPath = `src/components/tools/${componentName}.tsx`;
                this.dynamicallyLoadedComponents.add(fullPath);
              }
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  /**
   * 获取所有源文件
   */
  private getAllSourceFiles(): string[] {
    const files: string[] = [];
    const srcDir = path.join(process.cwd(), 'src');

    if (!fs.existsSync(srcDir)) {
      throw new Error('src 目录不存在');
    }

    const scanDirectory = (dir: string) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // 跳过 node_modules 和 .next
          if (entry.name !== 'node_modules' && entry.name !== '.next') {
            scanDirectory(fullPath);
          }
        } else if (entry.isFile() && /\.(ts|tsx|js|jsx)$/.test(entry.name)) {
          files.push(fullPath);
        }
      }
    };

    scanDirectory(srcDir);
    return files;
  }

  /**
   * 分析单个文件
   */
  private async analyzeFile(filePath: string): Promise<void> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    const visit = (node: ts.Node) => {
      // 检查静态导入: import ... from '...'
      if (ts.isImportDeclaration(node)) {
        const moduleSpecifier = node.moduleSpecifier;
        if (ts.isStringLiteral(moduleSpecifier)) {
          const moduleName = moduleSpecifier.text;
          const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());

          // 检查是否是类型导入 (import type)
          const isTypeOnly = node.importClause?.isTypeOnly || false;

          // 类型导入不会增加 bundle 大小，跳过
          if (isTypeOnly) {
            return;
          }

          this.imports.push({
            file: path.relative(process.cwd(), filePath),
            line: line + 1,
            column: character + 1,
            importType: 'static',
            moduleName,
            importClause: node.getText(sourceFile),
            isDynamic: false,
            isLazy: false,
          });
        }
      }

      // 检查动态导入: import('...')
      if (ts.isCallExpression(node)) {
        const expression = node.expression;

        // import() 调用
        if (expression.kind === ts.SyntaxKind.ImportKeyword) {
          const arg = node.arguments[0];
          if (arg && ts.isStringLiteral(arg)) {
            const moduleName = arg.text;
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());

            this.imports.push({
              file: path.relative(process.cwd(), filePath),
              line: line + 1,
              column: character + 1,
              importType: 'dynamic',
              moduleName,
              importClause: node.getText(sourceFile),
              isDynamic: true,
              isLazy: false,
            });
          }
        }

        // dynamic(() => import('...'))
        if (ts.isIdentifier(expression) && expression.text === 'dynamic') {
          const arg = node.arguments[0];
          if (arg && ts.isArrowFunction(arg)) {
            const body = arg.body;
            if (ts.isCallExpression(body) && body.expression.kind === ts.SyntaxKind.ImportKeyword) {
              const importArg = body.arguments[0];
              if (importArg && ts.isStringLiteral(importArg)) {
                const moduleName = importArg.text;
                const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());

                this.imports.push({
                  file: path.relative(process.cwd(), filePath),
                  line: line + 1,
                  column: character + 1,
                  importType: 'dynamic',
                  moduleName,
                  importClause: node.getText(sourceFile),
                  isDynamic: true,
                  isLazy: false,
                });
              }
            }
          }
        }

        // lazy(() => import('...'))
        if (ts.isIdentifier(expression) && expression.text === 'lazy') {
          const arg = node.arguments[0];
          if (arg && ts.isArrowFunction(arg)) {
            const body = arg.body;
            if (ts.isCallExpression(body) && body.expression.kind === ts.SyntaxKind.ImportKeyword) {
              const importArg = body.arguments[0];
              if (importArg && ts.isStringLiteral(importArg)) {
                const moduleName = importArg.text;
                const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());

                this.imports.push({
                  file: path.relative(process.cwd(), filePath),
                  line: line + 1,
                  column: character + 1,
                  importType: 'dynamic',
                  moduleName,
                  importClause: node.getText(sourceFile),
                  isDynamic: false,
                  isLazy: true,
                });
              }
            }
          }
        }

        // require('...')
        if (ts.isIdentifier(expression) && expression.text === 'require') {
          const arg = node.arguments[0];
          if (arg && ts.isStringLiteral(arg)) {
            const moduleName = arg.text;
            const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());

            this.imports.push({
              file: path.relative(process.cwd(), filePath),
              line: line + 1,
              column: character + 1,
              importType: 'require',
              moduleName,
              importClause: node.getText(sourceFile),
              isDynamic: false,
              isLazy: false,
            });
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  /**
   * 识别代码分割问题
   */
  private identifyIssues(): void {
    for (const imp of this.imports) {
      // 检查文件是否是动态加载的组件
      const isDynamicallyLoaded = this.dynamicallyLoadedComponents.has(imp.file);
      
      // 先检查是否是 ECharts Tree-shaking 导入（在提取包名之前）
      if (this.isEChartsTreeShaking(imp)) {
        // 这是正确的按需导入方式，跳过
        continue;
      }
      
      // 提取包名（去除子路径）
      const packageName = this.extractPackageName(imp.moduleName);

      // 检查是否是大型库
      if (HEAVY_LIBRARIES[packageName]) {
        const moduleSize = HEAVY_LIBRARIES[packageName];

        // 如果是静态导入且大于 100KB
        if (imp.importType === 'static' && moduleSize > 100) {
          const issue: CodeSplittingIssue = {
            file: imp.file,
            line: imp.line,
            column: imp.column,
            severity: moduleSize > 300 ? 'critical' : 'warning',
            moduleName: packageName,
            moduleSize,
            currentImportType: 'static',
            suggestion: this.generateSuggestion(packageName, imp, isDynamicallyLoaded),
            autoFixable: this.isAutoFixable(imp, isDynamicallyLoaded),
            fixCode: this.generateFixCode(imp, isDynamicallyLoaded),
          };

          this.issues.push(issue);

          // 按模块分组
          if (!this.issuesByModule.has(packageName)) {
            this.issuesByModule.set(packageName, []);
          }
          this.issuesByModule.get(packageName)!.push(issue);
        }
      }
    }

    // 按严重程度排序
    this.issues.sort((a, b) => {
      if (a.severity !== b.severity) {
        const severityOrder = { critical: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return b.moduleSize - a.moduleSize;
    });
  }

  /**
   * 检查是否是 ECharts Tree-shaking 导入
   */
  private isEChartsTreeShaking(imp: ImportStatement): boolean {
    const moduleName = imp.moduleName;
    
    // echarts/core 是按需导入的核心模块
    if (moduleName === 'echarts/core') {
      return true;
    }
    
    // echarts/charts, echarts/components 等是按需导入
    if (moduleName.startsWith('echarts/') && moduleName !== 'echarts') {
      return true;
    }
    
    // echarts-for-react/lib/core 也是按需导入
    if (moduleName.includes('echarts-for-react/lib/')) {
      return true;
    }
    
    return false;
  }

  /**
   * 提取包名
   */
  private extractPackageName(moduleName: string): string {
    // 处理相对路径
    if (moduleName.startsWith('.')) {
      return moduleName;
    }

    // 处理 scoped packages (@org/package)
    if (moduleName.startsWith('@')) {
      const parts = moduleName.split('/');
      return parts.slice(0, 2).join('/');
    }

    // 处理普通包
    return moduleName.split('/')[0];
  }

  /**
   * 生成修复建议
   */
  private generateSuggestion(packageName: string, imp: ImportStatement, isDynamicallyLoaded: boolean = false): string {
    const suggestions: string[] = [];

    // 如果组件已经动态加载
    if (isDynamicallyLoaded) {
      suggestions.push(`✅ 组件已通过 ToolRegistry 动态加载`);
      suggestions.push(`但内部仍有大型库的静态导入，考虑进一步优化`);
    } else {
      // 通用建议
      suggestions.push(`使用动态导入减少初始 bundle 大小`);
    }

    // 特定库的建议
    if (packageName === 'echarts') {
      if (isDynamicallyLoaded) {
        suggestions.push(`考虑使用 echarts/core 和按需导入图表类型`);
      } else {
        suggestions.push(`ECharts 应该在组件级别使用 dynamic() 导入`);
        suggestions.push(`参考 src/components/tools/ToolWrapper.tsx 的实现`);
      }
    } else if (packageName === 'xlsx') {
      suggestions.push(`XLSX 应该只在需要时动态加载`);
      suggestions.push(`考虑在用户点击导出按钮时再加载`);
    } else if (packageName.includes('pdf')) {
      suggestions.push(`PDF 库应该使用动态导入或 CDN 加载`);
    } else if (packageName === 'lucide-react') {
      suggestions.push(`使用按需导入单个图标: import { IconName } from 'lucide-react'`);
    }

    return suggestions.join('\n   ');
  }

  /**
   * 检查是否可以自动修复
   */
  private isAutoFixable(imp: ImportStatement, isDynamicallyLoaded: boolean = false): boolean {
    // 如果组件已经动态加载，不需要自动修复
    if (isDynamicallyLoaded) {
      return false;
    }

    // 组件文件可以自动修复
    if (imp.file.includes('/components/') && imp.file.endsWith('.tsx')) {
      return true;
    }

    // 工具文件可以自动修复
    if (imp.file.includes('/tools/') && imp.file.endsWith('.tsx')) {
      return true;
    }

    return false;
  }

  /**
   * 生成修复代码
   */
  private generateFixCode(imp: ImportStatement, isDynamicallyLoaded: boolean = false): string | undefined {
    if (!this.isAutoFixable(imp, isDynamicallyLoaded)) {
      return undefined;
    }

    // 生成 dynamic import 代码
    const packageName = this.extractPackageName(imp.moduleName);

    if (packageName === 'echarts' || packageName.startsWith('echarts-')) {
      return `// 使用动态导入\nimport dynamic from 'next/dynamic';\nconst EChartsComponent = dynamic(() => import('${imp.moduleName}'), { ssr: false });`;
    }

    return `// 使用动态导入\nconst module = await import('${imp.moduleName}');`;
  }

  /**
   * 生成报告
   */
  private generateReport(): CodeSplittingReport {
    const staticImports = this.imports.filter(i => i.importType === 'static').length;
    const dynamicImports = this.imports.filter(i => i.importType === 'dynamic' || i.isDynamic || i.isLazy).length;

    const recommendations = this.generateRecommendations();

    return {
      timestamp: new Date().toISOString(),
      totalFiles: new Set(this.imports.map(i => i.file)).size,
      totalImports: this.imports.length,
      staticImports,
      dynamicImports,
      issues: this.issues,
      issuesByModule: this.issuesByModule,
      recommendations,
    };
  }

  /**
   * 生成优化建议
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    // 统计问题
    const criticalCount = this.issues.filter(i => i.severity === 'critical').length;
    const warningCount = this.issues.filter(i => i.severity === 'warning').length;

    if (criticalCount > 0) {
      recommendations.push(`## 🚨 Critical 问题 (${criticalCount} 个)`);
      recommendations.push('');
      recommendations.push('这些大型库（> 300KB）应该立即使用动态导入：');
      recommendations.push('');

      const criticalIssues = this.issues.filter(i => i.severity === 'critical');
      const moduleGroups = new Map<string, number>();

      for (const issue of criticalIssues) {
        moduleGroups.set(issue.moduleName, (moduleGroups.get(issue.moduleName) || 0) + 1);
      }

      for (const [module, count] of moduleGroups.entries()) {
        const size = HEAVY_LIBRARIES[module];
        recommendations.push(`- **${module}** (${size}KB): ${count} 处静态导入`);
      }

      recommendations.push('');
    }

    if (warningCount > 0) {
      recommendations.push(`## ⚠️ Warning 问题 (${warningCount} 个)`);
      recommendations.push('');
      recommendations.push('这些库（100-300KB）建议使用动态导入：');
      recommendations.push('');

      const warningIssues = this.issues.filter(i => i.severity === 'warning');
      const moduleGroups = new Map<string, number>();

      for (const issue of warningIssues) {
        moduleGroups.set(issue.moduleName, (moduleGroups.get(issue.moduleName) || 0) + 1);
      }

      for (const [module, count] of moduleGroups.entries()) {
        const size = HEAVY_LIBRARIES[module];
        recommendations.push(`- **${module}** (${size}KB): ${count} 处静态导入`);
      }

      recommendations.push('');
    }

    // 通用建议
    recommendations.push('## 💡 通用优化建议');
    recommendations.push('');
    recommendations.push('### 1. 使用 Next.js dynamic()');
    recommendations.push('```typescript');
    recommendations.push("import dynamic from 'next/dynamic';");
    recommendations.push('');
    recommendations.push("const HeavyComponent = dynamic(() => import('./HeavyComponent'), {");
    recommendations.push('  ssr: false, // 禁用服务端渲染（如果不需要）');
    recommendations.push("  loading: () => <div>Loading...</div> // 加载状态");
    recommendations.push('});');
    recommendations.push('```');
    recommendations.push('');

    recommendations.push('### 2. 使用 React.lazy()');
    recommendations.push('```typescript');
    recommendations.push("import { lazy, Suspense } from 'react';");
    recommendations.push('');
    recommendations.push("const HeavyComponent = lazy(() => import('./HeavyComponent'));");
    recommendations.push('');
    recommendations.push('function App() {');
    recommendations.push('  return (');
    recommendations.push('    <Suspense fallback={<div>Loading...</div>}>');
    recommendations.push('      <HeavyComponent />');
    recommendations.push('    </Suspense>');
    recommendations.push('  );');
    recommendations.push('}');
    recommendations.push('```');
    recommendations.push('');

    recommendations.push('### 3. 按需导入');
    recommendations.push('```typescript');
    recommendations.push('// ❌ 不好：导入整个库');
    recommendations.push("import * as echarts from 'echarts';");
    recommendations.push('');
    recommendations.push('// ✅ 好：按需导入');
    recommendations.push("import { BarChart } from 'echarts/charts';");
    recommendations.push("import { GridComponent } from 'echarts/components';");
    recommendations.push('```');
    recommendations.push('');

    recommendations.push('### 4. 使用 CDN');
    recommendations.push('对于某些大型库，考虑使用 CDN 加载：');
    recommendations.push('- PDF.js');
    recommendations.push('- ECharts（如果不需要服务端渲染）');
    recommendations.push('- 其他第三方可视化库');
    recommendations.push('');

    recommendations.push('### 5. 代码分割最佳实践');
    recommendations.push('- 路由级别分割：每个页面是独立的 chunk');
    recommendations.push('- 组件级别分割：大型组件使用 dynamic() 或 lazy()');
    recommendations.push('- 库级别分割：大型第三方库动态导入');
    recommendations.push('- 按需加载：用户交互时再加载（如点击按钮）');

    return recommendations;
  }

  /**
   * 打印报告
   */
  private printReport(report: CodeSplittingReport): void {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 代码分割检查报告');
    console.log('='.repeat(80));
    console.log(`\n⏰ 检查时间: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    console.log(`\n📊 导入统计:`);
    console.log(`  - 扫描文件: ${report.totalFiles} 个`);
    console.log(`  - 总导入数: ${report.totalImports} 个`);
    console.log(`  - 静态导入: ${report.staticImports} 个`);
    console.log(`  - 动态导入: ${report.dynamicImports} 个`);
    console.log(`  - 动态导入率: ${((report.dynamicImports / report.totalImports) * 100).toFixed(1)}%`);

    // 问题统计
    const criticalCount = report.issues.filter(i => i.severity === 'critical').length;
    const warningCount = report.issues.filter(i => i.severity === 'warning').length;
    const infoCount = report.issues.filter(i => i.severity === 'info').length;

    console.log(`\n🔍 问题统计:`);
    console.log(`  - 总问题数: ${report.issues.length} 个`);
    console.log(`  - Critical: ${criticalCount} 个`);
    console.log(`  - Warning: ${warningCount} 个`);
    console.log(`  - Info: ${infoCount} 个`);

    // 详细问题列表
    if (report.issues.length > 0) {
      console.log(`\n📋 问题详情:`);
      console.log('='.repeat(80));

      // 按模块分组显示
      for (const [moduleName, issues] of report.issuesByModule.entries()) {
        const moduleSize = HEAVY_LIBRARIES[moduleName];
        const severityIcon = issues[0].severity === 'critical' ? '🚨' : '⚠️';

        console.log(`\n${severityIcon} ${moduleName} (${moduleSize}KB) - ${issues.length} 处静态导入`);
        console.log('-'.repeat(80));

        for (const issue of issues.slice(0, 5)) {
          console.log(`\n📍 ${issue.file}:${issue.line}:${issue.column}`);
          console.log(`   建议: ${issue.suggestion.split('\n').join('\n   ')}`);
          if (issue.autoFixable) {
            console.log(`   ✅ 可自动修复`);
          }
        }

        if (issues.length > 5) {
          console.log(`\n   ... 还有 ${issues.length - 5} 处`);
        }
      }
    }

    // 优化建议
    console.log('\n\n💡 优化建议:');
    console.log('='.repeat(80));
    report.recommendations.forEach(rec => console.log(rec));

    console.log('\n' + '='.repeat(80));
  }

  /**
   * 保存报告
   */
  private saveReport(report: CodeSplittingReport): void {
    // 保存 JSON 报告
    const jsonPath = path.join(process.cwd(), 'code-splitting-report.json');
    const jsonData = {
      ...report,
      issuesByModule: Array.from(report.issuesByModule.entries()).map(([module, issues]) => ({
        module,
        issues,
      })),
    };
    fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
    console.log(`\n📄 JSON 报告已保存到: ${jsonPath}`);

    // 保存 Markdown 报告
    this.saveMarkdownReport(report);
  }

  /**
   * 保存 Markdown 报告
   */
  private saveMarkdownReport(report: CodeSplittingReport): void {
    const lines: string[] = [];

    lines.push('# 代码分割检查报告');
    lines.push('');
    lines.push(`**检查时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    lines.push('');

    lines.push('## 📊 导入统计');
    lines.push('');
    lines.push('| 指标 | 数值 |');
    lines.push('|------|------|');
    lines.push(`| 扫描文件 | ${report.totalFiles} |`);
    lines.push(`| 总导入数 | ${report.totalImports} |`);
    lines.push(`| 静态导入 | ${report.staticImports} |`);
    lines.push(`| 动态导入 | ${report.dynamicImports} |`);
    lines.push(`| 动态导入率 | ${((report.dynamicImports / report.totalImports) * 100).toFixed(1)}% |`);
    lines.push('');

    // 问题统计
    const criticalCount = report.issues.filter(i => i.severity === 'critical').length;
    const warningCount = report.issues.filter(i => i.severity === 'warning').length;
    const infoCount = report.issues.filter(i => i.severity === 'info').length;

    lines.push('## 🔍 问题统计');
    lines.push('');
    lines.push('| 严重程度 | 数量 |');
    lines.push('|----------|------|');
    lines.push(`| 🚨 Critical | ${criticalCount} |`);
    lines.push(`| ⚠️ Warning | ${warningCount} |`);
    lines.push(`| ℹ️ Info | ${infoCount} |`);
    lines.push(`| **总计** | **${report.issues.length}** |`);
    lines.push('');

    // 按模块分组的问题
    if (report.issuesByModule.size > 0) {
      lines.push('## 📦 按模块分组');
      lines.push('');
      lines.push('| 模块 | 大小 | 问题数 | 严重程度 |');
      lines.push('|------|------|--------|----------|');

      for (const [moduleName, issues] of report.issuesByModule.entries()) {
        const moduleSize = HEAVY_LIBRARIES[moduleName];
        const severity = issues[0].severity === 'critical' ? '🚨 Critical' : '⚠️ Warning';
        lines.push(`| ${moduleName} | ${moduleSize}KB | ${issues.length} | ${severity} |`);
      }
      lines.push('');
    }

    // 详细问题列表
    if (report.issues.length > 0) {
      lines.push('## 📋 问题详情');
      lines.push('');

      for (const [moduleName, issues] of report.issuesByModule.entries()) {
        const moduleSize = HEAVY_LIBRARIES[moduleName];
        const severityIcon = issues[0].severity === 'critical' ? '🚨' : '⚠️';

        lines.push(`### ${severityIcon} ${moduleName} (${moduleSize}KB)`);
        lines.push('');
        lines.push(`发现 ${issues.length} 处静态导入：`);
        lines.push('');

        for (const issue of issues) {
          lines.push(`#### 📍 \`${issue.file}:${issue.line}:${issue.column}\``);
          lines.push('');
          lines.push('**建议**:');
          lines.push('```');
          lines.push(issue.suggestion);
          lines.push('```');
          lines.push('');

          if (issue.autoFixable && issue.fixCode) {
            lines.push('**修复代码**:');
            lines.push('```typescript');
            lines.push(issue.fixCode);
            lines.push('```');
            lines.push('');
          }
        }
      }
    }

    // 优化建议
    lines.push('## 💡 优化建议');
    lines.push('');
    report.recommendations.forEach(rec => lines.push(rec));
    lines.push('');

    const mdPath = path.join(process.cwd(), 'CODE_SPLITTING_REPORT.md');
    fs.writeFileSync(mdPath, lines.join('\n'));
    console.log(`📄 Markdown 报告已保存到: ${mdPath}\n`);
  }
}

// 主函数
async function main() {
  const checker = new CodeSplittingChecker();

  try {
    await checker.check();
    process.exit(0);
  } catch (error) {
    console.error('❌ 检查过程中出错:', error);
    process.exit(1);
  }
}

main();
