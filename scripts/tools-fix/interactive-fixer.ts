#!/usr/bin/env tsx

/**
 * 交互式修复界面
 * 
 * 功能：提供交互式界面来修复翻译问题
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import {
  generateTranslation,
  generateAllLocales,
  generateTranslationReport,
  type TranslationTemplate,
} from './translation-generator';
import {
  generateFixPlan,
  executeBatchFix,
  validateFix,
  generateFixReport,
  type FixOperation,
  type FixResult,
} from './fix-executor';

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * 审计问题接口
 */
interface AuditIssue {
  tool: string;
  locale: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  key?: string;
  details: string;
}

/**
 * 审计报告接口
 */
interface AuditReport {
  timestamp: string;
  summary: {
    totalTools: number;
    toolsWithIssues: number;
    totalIssues: number;
    issuesByType: Record<string, number>;
    issuesBySeverity: Record<string, number>;
  };
  tools: Array<{
    slug: string;
    category: string;
    component: string;
    issues: AuditIssue[];
  }>;
}

/**
 * 创建 readline 接口
 */
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

/**
 * 询问用户
 */
function question(rl: readline.Interface, query: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(query, resolve);
  });
}

/**
 * 打印标题
 */
function printTitle(title: string) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${title.padStart((60 + title.length) / 2)}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

/**
 * 打印分隔线
 */
function printSeparator() {
  console.log(`${colors.cyan}${'-'.repeat(60)}${colors.reset}`);
}

/**
 * 打印成功消息
 */
function printSuccess(message: string) {
  console.log(`${colors.green}✓${colors.reset} ${message}`);
}

/**
 * 打印错误消息
 */
function printError(message: string) {
  console.log(`${colors.red}✗${colors.reset} ${message}`);
}

/**
 * 打印警告消息
 */
function printWarning(message: string) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

/**
 * 打印信息消息
 */
function printInfo(message: string) {
  console.log(`${colors.blue}ℹ${colors.reset} ${message}`);
}

/**
 * 加载审计报告
 */
function loadAuditReport(reportPath: string): AuditReport | null {
  try {
    const content = fs.readFileSync(reportPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    printError(`无法加载审计报告: ${error}`);
    return null;
  }
}

/**
 * 显示审计摘要
 */
function displayAuditSummary(report: AuditReport) {
  printTitle('审计报告摘要');

  console.log(`${colors.bright}总体统计:${colors.reset}`);
  console.log(`  工具总数: ${report.summary.totalTools}`);
  console.log(`  有问题的工具: ${colors.red}${report.summary.toolsWithIssues}${colors.reset}`);
  console.log(`  问题总数: ${colors.red}${report.summary.totalIssues}${colors.reset}`);

  console.log(`\n${colors.bright}按类型分类:${colors.reset}`);
  Object.entries(report.summary.issuesByType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  console.log(`\n${colors.bright}按严重程度分类:${colors.reset}`);
  Object.entries(report.summary.issuesBySeverity).forEach(([severity, count]) => {
    const color = severity === 'high' ? colors.red : severity === 'medium' ? colors.yellow : colors.green;
    console.log(`  ${color}${severity}${colors.reset}: ${count}`);
  });

  printSeparator();
}

/**
 * 显示问题列表
 */
function displayIssues(report: AuditReport, limit: number = 20) {
  printTitle('问题列表（前 ' + limit + ' 个）');

  const toolsWithIssues = report.tools.filter(t => t.issues.length > 0);
  const displayTools = toolsWithIssues.slice(0, limit);

  displayTools.forEach((tool, index) => {
    console.log(`\n${colors.bright}${index + 1}. ${tool.slug}${colors.reset} (${tool.issues.length} 个问题)`);

    tool.issues.slice(0, 5).forEach(issue => {
      const severityColor = issue.severity === 'high' ? colors.red : issue.severity === 'medium' ? colors.yellow : colors.green;
      console.log(`   ${severityColor}[${issue.severity}]${colors.reset} ${issue.type}: ${issue.details}`);
      if (issue.key) {
        console.log(`   ${colors.cyan}键:${colors.reset} ${issue.key}`);
      }
    });

    if (tool.issues.length > 5) {
      console.log(`   ${colors.cyan}... 还有 ${tool.issues.length - 5} 个问题${colors.reset}`);
    }
  });

  if (toolsWithIssues.length > limit) {
    console.log(`\n${colors.cyan}... 还有 ${toolsWithIssues.length - limit} 个工具有问题${colors.reset}`);
  }

  printSeparator();
}

/**
 * 选择修复策略
 */
async function selectFixStrategy(rl: readline.Interface): Promise<string> {
  printTitle('选择修复策略');

  console.log('可用的修复策略:');
  console.log('  1. 自动修复所有问题（推荐）');
  console.log('  2. 只修复高优先级问题');
  console.log('  3. 只修复缺失的翻译键');
  console.log('  4. 只修复命名不一致问题');
  console.log('  5. 自定义修复');
  console.log('  0. 取消');

  const answer = await question(rl, '\n请选择 (0-5): ');
  return answer.trim();
}

/**
 * 从 details 字符串中提取翻译键
 */
function extractKeysFromDetails(details: string): string[] {
  // 匹配 "组件使用了不存在的翻译键: key1, key2, key3"
  const match = details.match(/翻译键:\s*(.+)$/);
  if (!match) return [];
  
  // 分割键名并清理空格
  return match[1]
    .split(',')
    .map(k => k.trim())
    .filter(k => k.length > 0);
}

/**
 * 生成修复操作
 */
function generateFixOperations(
  report: AuditReport,
  strategy: string
): FixOperation[] {
  const operations: FixOperation[] = [];

  for (const tool of report.tools) {
    if (tool.issues.length === 0) continue;

    for (const issue of tool.issues) {
      // 根据策略过滤问题
      if (strategy === '2' && issue.severity !== 'high') continue;
      if (strategy === '3' && issue.type !== 'translation_key_error') continue;
      if (strategy === '4' && issue.type !== 'naming_issue') continue;

      // 生成修复操作
      if (issue.type === 'translation_key_error') {
        // 从 details 中提取键名
        const keys = issue.key ? [issue.key] : extractKeysFromDetails(issue.details);
        
        for (const key of keys) {
          // 生成翻译
          const template = generateTranslation(key, issue.locale, {
            toolSlug: tool.slug,
          });

          if (template) {
            operations.push({
              type: 'add_key',
              tool: tool.slug,
              locale: issue.locale,
              key: key,
              value: template.value,
            });
          }
        }
      } else if (issue.type === 'naming_issue' && issue.key) {
        // 修复命名问题（例如：Q1 -> q1）
        const oldKey = issue.key;
        const newKey = oldKey.toLowerCase();

        operations.push({
          type: 'fix_naming',
          tool: tool.slug,
          locale: issue.locale,
          key: newKey,
          oldKey,
          newKey,
        });
      }
    }
  }

  return operations;
}

/**
 * 显示修复计划
 */
function displayFixPlan(operations: FixOperation[]) {
  printTitle('修复计划');

  console.log(`${colors.bright}操作统计:${colors.reset}`);
  console.log(`  总操作数: ${operations.length}`);

  const byType = operations.reduce((acc, op) => {
    acc[op.type] = (acc[op.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(`\n${colors.bright}按类型分类:${colors.reset}`);
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  const byLocale = operations.reduce((acc, op) => {
    acc[op.locale] = (acc[op.locale] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(`\n${colors.bright}按语言分类:${colors.reset}`);
  Object.entries(byLocale).forEach(([locale, count]) => {
    console.log(`  ${locale}: ${count}`);
  });

  const affectedTools = new Set(operations.map(op => op.tool));
  console.log(`\n${colors.bright}受影响的工具:${colors.reset} ${affectedTools.size}`);

  const estimatedTime = operations.length * 10; // 每个操作约 10ms
  console.log(`\n${colors.bright}预计时间:${colors.reset} ${(estimatedTime / 1000).toFixed(1)} 秒`);

  printSeparator();
}

/**
 * 确认修复
 */
async function confirmFix(rl: readline.Interface): Promise<boolean> {
  const answer = await question(rl, `\n${colors.yellow}确认执行修复? (y/n): ${colors.reset}`);
  return answer.trim().toLowerCase() === 'y';
}

/**
 * 执行修复
 */
async function executeFix(operations: FixOperation[]): Promise<FixResult[]> {
  printTitle('执行修复');

  console.log('正在执行修复操作...\n');

  const results = await executeBatchFix(operations, {
    parallel: true,
    maxConcurrency: 10,
    onProgress: (current, total, operation) => {
      const percent = ((current / total) * 100).toFixed(1);
      process.stdout.write(`\r进度: ${current}/${total} (${percent}%) - ${operation.tool} (${operation.locale})`);
    },
  });

  console.log('\n');
  return results;
}

/**
 * 显示修复结果
 */
function displayFixResults(results: FixResult[]) {
  printTitle('修复结果');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;

  console.log(`${colors.bright}总体结果:${colors.reset}`);
  console.log(`  总操作数: ${total}`);
  console.log(`  ${colors.green}成功: ${successful}${colors.reset}`);
  console.log(`  ${colors.red}失败: ${failed}${colors.reset}`);
  console.log(`  成功率: ${((successful / total) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log(`\n${colors.bright}${colors.red}失败的操作:${colors.reset}`);
    results.filter(r => !r.success).slice(0, 10).forEach(result => {
      console.log(`  ${result.operation.tool} (${result.operation.locale})`);
      console.log(`    操作: ${result.operation.type}`);
      console.log(`    键: ${result.operation.key}`);
      console.log(`    ${colors.red}错误: ${result.error}${colors.reset}`);
    });

    if (failed > 10) {
      console.log(`  ${colors.cyan}... 还有 ${failed - 10} 个失败的操作${colors.reset}`);
    }
  }

  printSeparator();
}

/**
 * 保存修复报告
 */
function saveFixReport(results: FixResult[], reportPath: string) {
  const report = generateFixReport(results);
  fs.writeFileSync(reportPath, report, 'utf-8');
  printSuccess(`修复报告已保存到: ${reportPath}`);
}

/**
 * 主函数
 */
async function main() {
  const rl = createInterface();

  try {
    printTitle('交互式翻译修复工具');

    // 1. 加载审计报告
    printInfo('正在加载审计报告...');

    const reportPath = process.argv[2] || 'tools-audit-report-final.json';
    const report = loadAuditReport(reportPath);

    if (!report) {
      printError('无法加载审计报告，请先运行审计脚本');
      printInfo('运行: npx tsx scripts/tools-audit/audit-engine.ts');
      rl.close();
      return;
    }

    printSuccess('审计报告加载成功');

    // 2. 显示审计摘要
    displayAuditSummary(report);

    // 3. 显示问题列表
    displayIssues(report);

    // 4. 选择修复策略
    const strategy = await selectFixStrategy(rl);

    if (strategy === '0') {
      printInfo('已取消修复');
      rl.close();
      return;
    }

    // 5. 生成修复操作
    printInfo('正在生成修复计划...');
    const operations = generateFixOperations(report, strategy);

    if (operations.length === 0) {
      printWarning('没有需要修复的操作');
      rl.close();
      return;
    }

    printSuccess(`生成了 ${operations.length} 个修复操作`);

    // 6. 显示修复计划
    displayFixPlan(operations);

    // 7. 确认修复
    const confirmed = await confirmFix(rl);

    if (!confirmed) {
      printInfo('已取消修复');
      rl.close();
      return;
    }

    // 8. 执行修复
    const results = await executeFix(operations);

    // 9. 显示修复结果
    displayFixResults(results);

    // 10. 保存修复报告
    const fixReportPath = `fix-report-${Date.now()}.md`;
    saveFixReport(results, fixReportPath);

    // 11. 提示下一步
    printTitle('下一步');
    console.log('1. 运行翻译拆分脚本:');
    console.log(`   ${colors.cyan}npx tsx scripts/split-translations.ts${colors.reset}`);
    console.log('\n2. 运行测试验证:');
    console.log(`   ${colors.cyan}npm run test -- --run src/messages/translations.test.ts${colors.reset}`);
    console.log('\n3. 手动测试工具加载:');
    console.log(`   ${colors.cyan}npm run dev${colors.reset}`);

    printSeparator();
    printSuccess('修复完成！');

  } catch (error) {
    printError(`发生错误: ${error}`);
  } finally {
    rl.close();
  }
}

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
