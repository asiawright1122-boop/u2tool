#!/usr/bin/env tsx

/**
 * 自动修复定时器内存泄漏脚本
 * 
 * 自动为使用 setTimeout/setInterval 的组件添加清理代码
 * 
 * 使用方法：
 *   npx tsx scripts/performance-audit/auto-fix-timer-leaks.ts [--dry-run]
 * 
 * 选项：
 *   --dry-run  只显示将要修改的内容，不实际修改文件
 */

import * as fs from 'fs';
import * as path from 'path';

interface FixResult {
  file: string;
  fixed: boolean;
  changes: string[];
  error?: string;
}

class TimerLeakFixer {
  private results: FixResult[] = [];
  private dryRun: boolean;

  constructor(dryRun: boolean = false) {
    this.dryRun = dryRun;
  }

  /**
   * 运行修复
   */
  async run(): Promise<void> {
    console.log('🔧 开始自动修复定时器内存泄漏...\n');
    
    if (this.dryRun) {
      console.log('⚠️  DRY RUN 模式 - 不会实际修改文件\n');
    }

    // 读取诊断报告
    const reportPath = path.join(process.cwd(), 'performance-audit-quick-report.json');
    
    if (!fs.existsSync(reportPath)) {
      console.error('❌ 找不到诊断报告，请先运行: npx tsx scripts/performance-audit/quick-diagnose.ts');
      process.exit(1);
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    
    // 筛选出定时器泄漏问题
    const timerLeaks = report.issues.filter((issue: any) => 
      issue.category === '内存泄漏' && 
      issue.message.includes('定时器')
    );

    console.log(`📊 发现 ${timerLeaks.length} 个定时器泄漏问题\n`);

    // 按文件分组
    const fileGroups = new Map<string, any[]>();
    for (const issue of timerLeaks) {
      const file = issue.file;
      if (!fileGroups.has(file)) {
        fileGroups.set(file, []);
      }
      fileGroups.get(file)!.push(issue);
    }

    console.log(`📁 涉及 ${fileGroups.size} 个文件\n`);

    // 逐个文件修复
    let fixedCount = 0;
    let skippedCount = 0;

    for (const [file, issues] of fileGroups) {
      const result = await this.fixFile(file, issues);
      this.results.push(result);

      if (result.fixed) {
        fixedCount++;
        console.log(`✅ ${file} - 已修复 ${result.changes.length} 处`);
      } else {
        skippedCount++;
        if (result.error) {
          console.log(`⚠️  ${file} - 跳过: ${result.error}`);
        }
      }
    }

    // 输出总结
    console.log('\n' + '='.repeat(80));
    console.log('📊 修复总结');
    console.log('='.repeat(80));
    console.log(`✅ 成功修复: ${fixedCount} 个文件`);
    console.log(`⚠️  跳过: ${skippedCount} 个文件`);
    console.log(`📊 总计: ${fileGroups.size} 个文件`);

    if (this.dryRun) {
      console.log('\n⚠️  这是 DRY RUN 模式，没有实际修改文件');
      console.log('   移除 --dry-run 参数来实际应用修复');
    }

    // 保存修复报告
    this.saveReport();
  }

  /**
   * 修复单个文件
   */
  private async fixFile(filePath: string, issues: any[]): Promise<FixResult> {
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

      // 分析代码结构
      const analysis = this.analyzeTimerUsage(content);

      if (analysis.timers.length === 0) {
        return {
          file: filePath,
          fixed: false,
          changes: [],
          error: '未检测到定时器'
        };
      }

      // 应用修复
      content = this.applyFixes(content, analysis);

      if (content !== originalContent) {
        if (!this.dryRun) {
          // 备份原文件
          fs.writeFileSync(fullPath + '.backup', originalContent);
          // 写入修复后的内容
          fs.writeFileSync(fullPath, content);
        }

        changes.push(`添加了 ${analysis.timers.length} 个定时器的清理代码`);

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
   * 分析定时器使用情况
   */
  private analyzeTimerUsage(content: string): {
    timers: Array<{
      type: 'setTimeout' | 'setInterval';
      line: number;
      varName: string | null;
    }>;
    hasUseEffect: boolean;
  } {
    const lines = content.split('\n');
    const timers: Array<{
      type: 'setTimeout' | 'setInterval';
      line: number;
      varName: string | null;
    }> = [];

    lines.forEach((line, index) => {
      // 检测 setTimeout
      const setTimeoutMatch = line.match(/(?:const|let|var)\s+(\w+)\s*=\s*setTimeout/);
      if (setTimeoutMatch) {
        timers.push({
          type: 'setTimeout',
          line: index,
          varName: setTimeoutMatch[1]
        });
      } else if (line.includes('setTimeout') && !line.includes('clearTimeout')) {
        timers.push({
          type: 'setTimeout',
          line: index,
          varName: null
        });
      }

      // 检测 setInterval
      const setIntervalMatch = line.match(/(?:const|let|var)\s+(\w+)\s*=\s*setInterval/);
      if (setIntervalMatch) {
        timers.push({
          type: 'setInterval',
          line: index,
          varName: setIntervalMatch[1]
        });
      } else if (line.includes('setInterval') && !line.includes('clearInterval')) {
        timers.push({
          type: 'setInterval',
          line: index,
          varName: null
        });
      }
    });

    const hasUseEffect = content.includes('useEffect');

    return { timers, hasUseEffect };
  }

  /**
   * 应用修复
   */
  private applyFixes(content: string, analysis: {
    timers: Array<{
      type: 'setTimeout' | 'setInterval';
      line: number;
      varName: string | null;
    }>;
    hasUseEffect: boolean;
  }): string {
    const lines = content.split('\n');

    // 策略1: 如果定时器在 useEffect 中，添加清理函数
    if (analysis.hasUseEffect) {
      content = this.addCleanupToUseEffect(content, analysis.timers);
    }

    // 策略2: 如果定时器不在 useEffect 中，包装到 useEffect 中
    // （这个比较复杂，暂时跳过，手动处理）

    return content;
  }

  /**
   * 为 useEffect 添加清理函数
   */
  private addCleanupToUseEffect(content: string, timers: Array<{
    type: 'setTimeout' | 'setInterval';
    line: number;
    varName: string | null;
  }>): string {
    const lines = content.split('\n');
    
    // 查找所有 useEffect
    const useEffectRanges: Array<{ start: number; end: number }> = [];
    let braceCount = 0;
    let inUseEffect = false;
    let useEffectStart = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.includes('useEffect(')) {
        inUseEffect = true;
        useEffectStart = i;
        braceCount = 0;
      }

      if (inUseEffect) {
        // 计算大括号
        for (const char of line) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
        }

        // 找到 useEffect 的结束
        if (braceCount === 0 && line.includes('}')) {
          useEffectRanges.push({ start: useEffectStart, end: i });
          inUseEffect = false;
        }
      }
    }

    // 为每个包含定时器的 useEffect 添加清理函数
    for (const timer of timers) {
      const timerLine = timer.line;

      // 找到包含这个定时器的 useEffect
      const useEffect = useEffectRanges.find(
        range => timerLine > range.start && timerLine < range.end
      );

      if (useEffect) {
        // 检查是否已经有 return 语句
        let hasReturn = false;
        for (let i = useEffect.start; i <= useEffect.end; i++) {
          if (lines[i].trim().startsWith('return')) {
            hasReturn = true;
            break;
          }
        }

        if (!hasReturn && timer.varName) {
          // 在 useEffect 结束前添加清理函数
          const indent = this.getIndent(lines[useEffect.end]);
          const clearFunc = timer.type === 'setTimeout' ? 'clearTimeout' : 'clearInterval';
          
          // 找到 useEffect 的最后一个有效行（不是 }, 或 });）
          let insertLine = useEffect.end;
          for (let i = useEffect.end; i > useEffect.start; i--) {
            const line = lines[i].trim();
            if (line && !line.match(/^[}\]],?\s*$/)) {
              insertLine = i + 1;
              break;
            }
          }

          // 插入清理代码
          const cleanupCode = [
            '',
            `${indent}  return () => {`,
            `${indent}    ${clearFunc}(${timer.varName});`,
            `${indent}  };`
          ];

          lines.splice(insertLine, 0, ...cleanupCode);
        }
      }
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
    const reportPath = path.join(process.cwd(), 'timer-leak-fix-report.json');
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

    // 生成 Markdown 报告
    this.saveMarkdownReport(report);
  }

  /**
   * 保存 Markdown 报告
   */
  private saveMarkdownReport(report: any): void {
    const lines: string[] = [];

    lines.push('# 定时器内存泄漏修复报告');
    lines.push('');
    lines.push(`**修复时间**: ${new Date(report.timestamp).toLocaleString('zh-CN')}`);
    lines.push(`**模式**: ${report.dryRun ? 'DRY RUN（未实际修改）' : '实际修复'}`);
    lines.push('');
    lines.push('## 📊 修复统计');
    lines.push('');
    lines.push(`- ✅ **成功修复**: ${report.summary.fixed} 个文件`);
    lines.push(`- ⚠️  **跳过**: ${report.summary.skipped} 个文件`);
    lines.push(`- 📊 **总计**: ${report.summary.total} 个文件`);
    lines.push('');

    // 成功修复的文件
    const fixed = report.results.filter((r: any) => r.fixed);
    if (fixed.length > 0) {
      lines.push('## ✅ 成功修复的文件');
      lines.push('');
      fixed.forEach((result: any) => {
        lines.push(`### ${result.file}`);
        lines.push('');
        result.changes.forEach((change: string) => {
          lines.push(`- ${change}`);
        });
        lines.push('');
      });
    }

    // 跳过的文件
    const skipped = report.results.filter((r: any) => !r.fixed);
    if (skipped.length > 0) {
      lines.push('## ⚠️  跳过的文件');
      lines.push('');
      lines.push('| 文件 | 原因 |');
      lines.push('|------|------|');
      skipped.forEach((result: any) => {
        lines.push(`| ${result.file} | ${result.error || '未知'} |`);
      });
      lines.push('');
    }

    if (!report.dryRun) {
      lines.push('## 💡 后续步骤');
      lines.push('');
      lines.push('1. 检查修复后的代码是否正确');
      lines.push('2. 运行测试确保功能正常');
      lines.push('3. 如有问题，可以从 .backup 文件恢复');
      lines.push('4. 提交代码前删除所有 .backup 文件');
    }

    const mdPath = path.join(process.cwd(), 'TIMER_LEAK_FIX_REPORT.md');
    fs.writeFileSync(mdPath, lines.join('\n'));
    console.log(`📄 Markdown 报告已保存到: ${mdPath}\n`);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');

  const fixer = new TimerLeakFixer(dryRun);

  try {
    await fixer.run();
    process.exit(0);
  } catch (error) {
    console.error('❌ 修复过程中出错:', error);
    process.exit(1);
  }
}

main();
