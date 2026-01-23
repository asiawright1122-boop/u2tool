#!/usr/bin/env tsx

/**
 * 修复复制按钮定时器模式
 * 
 * 这个脚本专门修复常见的复制按钮定时器模式：
 * setTimeout(() => setCopied(false), 2000)
 * 
 * 修复策略：
 * 1. 添加 useRef 来存储定时器 ID
 * 2. 在组件卸载时清理定时器
 * 3. 在设置新定时器前清理旧定时器（防止快速点击）
 * 
 * 使用方法：
 *   npx tsx scripts/performance-audit/fix-copy-timer-pattern.ts [--dry-run] [--file=path]
 */

import * as fs from 'fs';
import * as path from 'path';

interface FixResult {
  file: string;
  fixed: boolean;
  changes: string[];
  error?: string;
}

class CopyTimerFixer {
  private results: FixResult[] = [];
  private dryRun: boolean;

  constructor(dryRun: boolean = false) {
    this.dryRun = dryRun;
  }

  /**
   * 运行修复
   */
  async run(targetFile?: string): Promise<void> {
    console.log('🔧 开始修复复制按钮定时器模式...\n');
    
    if (this.dryRun) {
      console.log('⚠️  DRY RUN 模式 - 不会实际修改文件\n');
    }

    let files: string[] = [];

    if (targetFile) {
      // 修复单个文件
      files = [targetFile];
    } else {
      // 读取诊断报告
      const reportPath = path.join(process.cwd(), 'performance-audit-quick-report.json');
      
      if (!fs.existsSync(reportPath)) {
        console.error('❌ 找不到诊断报告，请先运行: npx tsx scripts/performance-audit/quick-diagnose.ts');
        process.exit(1);
      }

      const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
      
      // 筛选出定时器泄漏问题的文件
      const timerLeaks = report.issues.filter((issue: any) => 
        issue.category === '内存泄漏' && 
        issue.message.includes('定时器')
      );

      // 去重文件列表
      const fileSet = new Set(timerLeaks.map((issue: any) => issue.file));
      files = Array.from(fileSet);
    }

    console.log(`📊 将处理 ${files.length} 个文件\n`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const file of files) {
      const result = await this.fixFile(file);
      this.results.push(result);

      if (result.fixed) {
        fixedCount++;
        console.log(`✅ ${file}`);
        result.changes.forEach(change => console.log(`   - ${change}`));
      } else {
        skippedCount++;
        if (result.error && !result.error.includes('已有清理代码')) {
          console.log(`⚠️  ${file} - ${result.error}`);
        }
      }
    }

    // 输出总结
    console.log('\n' + '='.repeat(80));
    console.log('📊 修复总结');
    console.log('='.repeat(80));
    console.log(`✅ 成功修复: ${fixedCount} 个文件`);
    console.log(`⚠️  跳过: ${skippedCount} 个文件`);
    console.log(`📊 总计: ${files.length} 个文件`);

    if (this.dryRun) {
      console.log('\n⚠️  这是 DRY RUN 模式，没有实际修改文件');
      console.log('   移除 --dry-run 参数来实际应用修复');
    } else {
      console.log('\n💡 后续步骤:');
      console.log('1. 检查修复后的代码');
      console.log('2. 运行 npm run build 确保没有编译错误');
      console.log('3. 测试复制功能是否正常');
      console.log('4. 如有问题，可以从 .backup 文件恢复');
    }

    // 保存修复报告
    this.saveReport();
  }

  /**
   * 修复单个文件
   */
  private async fixFile(filePath: string): Promise<FixResult> {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      return {
        file: filePath,
        fixed: false,
        changes: [],
        error: '文件不存在'
      };
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const originalContent = content;
      const changes: string[] = [];

      // 检查是否已经有清理代码
      if (content.includes('clearTimeout') || content.includes('clearInterval')) {
        return {
          file: filePath,
          fixed: false,
          changes: [],
          error: '已有清理代码'
        };
      }

      // 检查是否有 setTimeout 模式
      const hasSetTimeout = content.includes('setTimeout');
      if (!hasSetTimeout) {
        return {
          file: filePath,
          fixed: false,
          changes: [],
          error: '未检测到 setTimeout'
        };
      }

      // 应用修复
      const fixedContent = this.applyFix(content);

      if (fixedContent !== originalContent) {
        if (!this.dryRun) {
          // 备份原文件
          fs.writeFileSync(fullPath + '.backup', originalContent);
          // 写入修复后的内容
          fs.writeFileSync(fullPath, fixedContent);
        }

        changes.push('添加了 useRef 来存储定时器 ID');
        changes.push('添加了 useEffect 清理函数');
        changes.push('在设置新定时器前清理旧定时器');

        return {
          file: filePath,
          fixed: true,
          changes
        };
      }

      return {
        file: filePath,
        fixed: false,
        changes: [],
        error: '无需修改'
      };

    } catch (error) {
      return {
        file: filePath,
        fixed: false,
        changes: [],
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * 应用修复
   */
  private applyFix(content: string): string {
    const lines = content.split('\n');
    
    // 1. 检查是否已经导入了 useRef
    const hasUseRef = content.includes('useRef');
    
    // 2. 找到 React 导入行
    let reactImportLine = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("from 'react'") || lines[i].includes('from "react"')) {
        reactImportLine = i;
        break;
      }
    }

    // 3. 如果没有 useRef，添加到导入中
    if (!hasUseRef && reactImportLine !== -1) {
      const importLine = lines[reactImportLine];
      if (importLine.includes('useState')) {
        // 在 useState 后面添加 useRef
        lines[reactImportLine] = importLine.replace('useState', 'useState, useRef');
      } else if (importLine.includes('use')) {
        // 在其他 hook 后面添加
        lines[reactImportLine] = importLine.replace(/use\w+/, '$&, useRef');
      }
    }

    // 4. 找到组件函数的开始
    let componentStart = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^(?:export\s+)?(?:default\s+)?function\s+\w+/) || 
          lines[i].match(/^const\s+\w+\s*[:=]\s*\(/)) {
        componentStart = i;
        break;
      }
    }

    if (componentStart === -1) {
      return content; // 找不到组件，跳过
    }

    // 5. 找到第一个 useState 的位置，在其后添加 useRef
    let firstStateHook = -1;
    for (let i = componentStart; i < lines.length; i++) {
      if (lines[i].includes('useState') || lines[i].includes('useTranslations')) {
        firstStateHook = i;
        break;
      }
    }

    if (firstStateHook !== -1) {
      // 获取缩进
      const indent = this.getIndent(lines[firstStateHook]);
      
      // 在第一个 state hook 后添加 timer ref
      const refLine = `${indent}const timerRef = useRef<NodeJS.Timeout | null>(null);`;
      lines.splice(firstStateHook + 1, 0, refLine);
    }

    // 6. 找到所有 setTimeout 并修改
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 匹配 setTimeout(() => setCopied(false), 2000) 模式
      if (line.includes('setTimeout') && line.includes('setCopied')) {
        const indent = this.getIndent(line);
        
        // 替换为清理旧定时器 + 设置新定时器
        const newLines = [
          `${indent}// 清理旧定时器`,
          `${indent}if (timerRef.current) {`,
          `${indent}  clearTimeout(timerRef.current);`,
          `${indent}}`,
          `${indent}// 设置新定时器`,
          line.replace('setTimeout(', 'timerRef.current = setTimeout(')
        ];
        
        lines.splice(i, 1, ...newLines);
        i += newLines.length - 1; // 跳过新添加的行
      }
    }

    // 7. 添加 useEffect 清理函数
    // 找到 return 语句前的位置
    let returnLine = -1;
    for (let i = componentStart; i < lines.length; i++) {
      if (lines[i].trim().startsWith('return')) {
        returnLine = i;
        break;
      }
    }

    if (returnLine !== -1) {
      const indent = this.getIndent(lines[returnLine]);
      
      // 在 return 前添加 useEffect
      const cleanupEffect = [
        '',
        `${indent}// 组件卸载时清理定时器`,
        `${indent}useEffect(() => {`,
        `${indent}  return () => {`,
        `${indent}    if (timerRef.current) {`,
        `${indent}      clearTimeout(timerRef.current);`,
        `${indent}    }`,
        `${indent}  };`,
        `${indent}}, []);`,
        ''
      ];
      
      lines.splice(returnLine, 0, ...cleanupEffect);
    }

    // 8. 确保导入了 useEffect
    if (!content.includes('useEffect') && reactImportLine !== -1) {
      lines[reactImportLine] = lines[reactImportLine].replace('useRef', 'useRef, useEffect');
    }

    return lines.join('\n');
  }

  /**
   * 获取行的缩进
   */
  private getIndent(line: string): string {
    const match = line.match(/^(\s*)/);
    return match ? match[1] : '';
  }

  /**
   * 保存修复报告
   */
  private saveReport(): void {
    const reportPath = path.join(process.cwd(), 'copy-timer-fix-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      dryRun: this.dryRun,
      results: this.results,
      summary: {
        total: this.results.length,
        fixed: this.results.filter(r => r.fixed).length,
        skipped: this.results.filter(r => !r.fixed).length
      }
    };

    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 修复报告已保存到: ${reportPath}`);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const fileArg = args.find(arg => arg.startsWith('--file='));
  const targetFile = fileArg ? fileArg.split('=')[1] : undefined;

  const fixer = new CopyTimerFixer(dryRun);

  try {
    await fixer.run(targetFile);
    process.exit(0);
  } catch (error) {
    console.error('❌ 修复过程中出错:', error);
    process.exit(1);
  }
}

main();
