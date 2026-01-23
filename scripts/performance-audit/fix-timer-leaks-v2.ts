#!/usr/bin/env tsx

/**
 * 修复定时器内存泄漏 V2
 * 
 * 改进版本，更智能地识别组件边界和插入位置
 * 
 * 使用方法：
 *   npx tsx scripts/performance-audit/fix-timer-leaks-v2.ts [--dry-run]
 */

import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

interface FixResult {
  file: string;
  fixed: boolean;
  changes: string[];
  error?: string;
}

class TimerLeakFixerV2 {
  private results: FixResult[] = [];
  private dryRun: boolean;

  constructor(dryRun: boolean = false) {
    this.dryRun = dryRun;
  }

  async run(): Promise<void> {
    console.log('🔧 开始修复定时器内存泄漏 (V2)...\n');
    
    if (this.dryRun) {
      console.log('⚠️  DRY RUN 模式 - 不会实际修改文件\n');
    }

    const reportPath = path.join(process.cwd(), 'performance-audit-quick-report.json');
    
    if (!fs.existsSync(reportPath)) {
      console.error('❌ 找不到诊断报告');
      process.exit(1);
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    const timerLeaks = report.issues.filter((issue: any) => 
      issue.category === '内存泄漏' && issue.message.includes('定时器')
    );

    const fileSet = new Set(timerLeaks.map((issue: any) => issue.file));
    const files = Array.from(fileSet);

    console.log(`📊 将处理 ${files.length} 个文件\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      const result = await this.fixFile(file);
      this.results.push(result);

      if (result.fixed) {
        fixedCount++;
        console.log(`✅ ${file}`);
      } else {
        skippedCount++;
        if (result.error && !result.error.includes('已有清理代码')) {
          console.log(`⚠️  ${file} - ${result.error}`);
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 修复总结');
    console.log('='.repeat(80));
    console.log(`✅ 成功修复: ${fixedCount} 个文件`);
    console.log(`⚠️  跳过: ${skippedCount} 个文件`);
    console.log(`📊 总计: ${files.length} 个文件`);

    if (!this.dryRun && fixedCount > 0) {
      console.log('\n💡 下一步: 运行 npm run build 验证修复');
    }
  }

  private async fixFile(filePath: string): Promise<FixResult> {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return { file: filePath, fixed: false, changes: [], error: '文件不存在' };
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      // 检查是否已经有清理代码
      if (content.includes('clearTimeout') || content.includes('clearInterval')) {
        return { file: filePath, fixed: false, changes: [], error: '已有清理代码' };
      }

      // 检查是否有 setTimeout
      if (!content.includes('setTimeout')) {
        return { file: filePath, fixed: false, changes: [], error: '未检测到 setTimeout' };
      }

      // 使用 TypeScript AST 进行智能修复
      const fixedContent = this.smartFix(content, fullPath);

      if (fixedContent !== content) {
        if (!this.dryRun) {
          fs.writeFileSync(fullPath + '.backup', content);
          fs.writeFileSync(fullPath, fixedContent);
        }

        return {
          file: filePath,
          fixed: true,
          changes: ['添加定时器清理代码']
        };
      }

      return { file: filePath, fixed: false, changes: [], error: '无需修改' };

    } catch (error) {
      return {
        file: filePath,
        fixed: false,
        changes: [],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private smartFix(content: string, filePath: string): string {
    const sourceFile = ts.createSourceFile(
      filePath,
      content,
      ts.ScriptTarget.Latest,
      true
    );

    let componentNode: ts.Node | null = null;
    let hasSetTimeout = false;

    // 找到组件函数
    const visit = (node: ts.Node) => {
      // 查找函数组件
      if (ts.isFunctionDeclaration(node) || ts.isVariableStatement(node)) {
        const text = node.getText(sourceFile);
        if (text.includes('export default') || text.includes('export function')) {
          componentNode = node;
        }
      }

      // 检查是否有 setTimeout
      if (node.getText(sourceFile).includes('setTimeout')) {
        hasSetTimeout = true;
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    if (!componentNode || !hasSetTimeout) {
      return content;
    }

    // 使用简单的字符串替换方法
    return this.simpleStringFix(content);
  }

  private simpleStringFix(content: string): string {
    const lines = content.split('\n');
    let modified = false;

    // 1. 添加 useRef 和 useEffect 到导入
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("from 'react'") || lines[i].includes('from "react"')) {
        if (!lines[i].includes('useRef')) {
          lines[i] = lines[i].replace('useState', 'useState, useRef');
          modified = true;
        }
        if (!lines[i].includes('useEffect')) {
          lines[i] = lines[i].replace('useRef', 'useRef, useEffect');
          modified = true;
        }
        break;
      }
    }

    // 2. 找到组件函数的开始
    let componentStart = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^export default function/) || 
          lines[i].match(/^const \w+ = \(\) => {/)) {
        componentStart = i;
        break;
      }
    }

    if (componentStart === -1) return content;

    // 3. 找到第一个 useState 或 useTranslations
    let firstHook = -1;
    for (let i = componentStart; i < lines.length; i++) {
      if (lines[i].includes('useState') || lines[i].includes('useTranslations')) {
        firstHook = i;
        break;
      }
    }

    if (firstHook !== -1) {
      const indent = this.getIndent(lines[firstHook]);
      // 找到最后一个连续的 hook
      let lastHook = firstHook;
      for (let i = firstHook + 1; i < Math.min(firstHook + 20, lines.length); i++) {
        const line = lines[i].trim();
        if (line.startsWith('const') && (line.includes('use') || line.includes('='))) {
          lastHook = i;
        } else if (line && !line.startsWith('//')) {
          break;
        }
      }

      // 在最后一个 hook 后添加 timerRef
      lines.splice(lastHook + 1, 0, `${indent}const timerRef = useRef<NodeJS.Timeout | null>(null);`);
      modified = true;
    }

    // 4. 修改 setTimeout 调用
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('setTimeout') && lines[i].includes('setCopied')) {
        const indent = this.getIndent(lines[i]);
        const originalLine = lines[i];
        
        // 插入清理代码
        const newLines = [
          `${indent}if (timerRef.current) clearTimeout(timerRef.current);`,
          originalLine.replace('setTimeout(', 'timerRef.current = setTimeout(')
        ];
        
        lines.splice(i, 1, ...newLines);
        i += newLines.length - 1;
        modified = true;
      }
    }

    // 5. 在组件的 return 前添加 useEffect
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim().startsWith('return') && lines[i].includes('(') || lines[i].includes('<')) {
        const indent = this.getIndent(lines[i]);
        
        const cleanupCode = [
          '',
          `${indent}useEffect(() => {`,
          `${indent}  return () => {`,
          `${indent}    if (timerRef.current) clearTimeout(timerRef.current);`,
          `${indent}  };`,
          `${indent}}, []);`,
          ''
        ];
        
        lines.splice(i, 0, ...cleanupCode);
        modified = true;
        break;
      }
    }

    return modified ? lines.join('\n') : content;
  }

  private getIndent(line: string): string {
    const match = line.match(/^(\s*)/);
    return match ? match[1] : '';
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const fixer = new TimerLeakFixerV2(dryRun);

  try {
    await fixer.run();
    process.exit(0);
  } catch (error) {
    console.error('❌ 修复过程中出错:', error);
    process.exit(1);
  }
}

main();
