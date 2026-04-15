#!/usr/bin/env tsx

/**
 * 智能审计引擎
 * 
 * 功能：整合组件扫描和翻译验证，生成完整的审计报告
 */

import fs from 'fs';
import path from 'path';
import { 
  scanComponentTranslationKeys, 
  type ComponentScanResult,
  type TranslationKeyUsage 
} from './component-scanner';
import { 
  validateAllLocales, 
  checkCrossLanguageConsistency,
  type ValidationResult 
} from './translation-validator';

export interface Tool {
  slug: string;
  category: string;
  component: string;
}

export interface AuditIssue {
  type: 'missing_translation' | 'missing_component' | 'translation_key_error' | 'naming_issue' | 'dynamic_key_issue';
  tool: string;
  locale?: string;
  key?: string;
  details: string;
  severity: 'high' | 'medium' | 'low';
}

export interface ToolAuditResult {
  slug: string;
  component: string;
  componentExists: boolean;
  usedKeys: TranslationKeyUsage[];
  validationResults: ValidationResult[];
  issues: AuditIssue[];
  crossLanguageConsistency: {
    consistent: boolean;
    issues: string[];
  };
}

export interface AuditReport {
  timestamp: string;
  summary: {
    totalTools: number;
    toolsWithIssues: number;
    totalIssues: number;
    issuesByType: Record<string, number>;
    issuesBySeverity: Record<string, number>;
  };
  tools: ToolAuditResult[];
}

/**
 * 加载工具配置
 */
function loadTools(): Tool[] {
  const toolsConfigPath = path.join(process.cwd(), 'src', 'config', 'tools.ts');
  const content = fs.readFileSync(toolsConfigPath, 'utf-8');
  
  const toolsMatch = content.match(/export const tools: Tool\[\] = \[([\s\S]*?)\];/);
  if (!toolsMatch) {
    throw new Error('无法解析 tools.ts');
  }
  
  const toolsStr = toolsMatch[1];
  const tools: Tool[] = [];
  
  const toolRegex = /\{\s*slug:\s*['"]([^'"]+)['"]\s*,\s*category:\s*['"]([^'"]+)['"]\s*,[\s\S]*?component:\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = toolRegex.exec(toolsStr)) !== null) {
    tools.push({
      slug: match[1],
      category: match[2],
      component: match[3],
    });
  }
  
  return tools;
}

/**
 * 检查组件文件是否存在
 */
function checkComponentExists(component: string): boolean {
  const componentPath = path.join(
    process.cwd(), 
    'src', 
    'components', 
    'tools', 
    `${component}.svelte`
  );
  return fs.existsSync(componentPath);
}

/**
 * 审计单个工具
 */
async function auditTool(tool: Tool): Promise<ToolAuditResult> {
  const result: ToolAuditResult = {
    slug: tool.slug,
    component: tool.component,
    componentExists: false,
    usedKeys: [],
    validationResults: [],
    issues: [],
    crossLanguageConsistency: { consistent: true, issues: [] },
  };

  // 1. 检查组件是否存在
  result.componentExists = checkComponentExists(tool.component);
  
  if (!result.componentExists) {
    result.issues.push({
      type: 'missing_component',
      tool: tool.slug,
      details: `组件文件不存在: ${tool.component}.svelte`,
      severity: 'high',
    });
    return result;
  }

  // 2. 扫描组件翻译键
  const componentPath = path.join(
    process.cwd(),
    'src',
    'components',
    'tools',
    `${tool.component}.svelte`
  );
  
  const scanResult = scanComponentTranslationKeys(componentPath);
  result.usedKeys = scanResult.usedKeys;

  // 3. 验证所有语言的翻译
  result.validationResults = validateAllLocales(tool.slug, result.usedKeys);

  // 4. 分析验证结果，生成问题列表
  for (const validation of result.validationResults) {
    // 缺少基本翻译
    if (!validation.hasBasicKeys) {
      result.issues.push({
        type: 'missing_translation',
        tool: tool.slug,
        locale: validation.locale,
        details: `缺少基本翻译键: ${validation.missingKeys.join(', ')}`,
        severity: 'high',
      });
    }

    // 缺少翻译键
    if (validation.missingKeys.length > 0 && validation.hasBasicKeys) {
      result.issues.push({
        type: 'translation_key_error',
        tool: tool.slug,
        locale: validation.locale,
        details: `组件使用了不存在的翻译键: ${validation.missingKeys.join(', ')}`,
        severity: 'medium',
      });
    }

    // 命名问题
    if (validation.namingIssues.length > 0) {
      result.issues.push({
        type: 'naming_issue',
        tool: tool.slug,
        locale: validation.locale,
        details: `命名问题: ${validation.namingIssues.map(i => i.details).join('; ')}`,
        severity: 'low',
      });
    }

    // 动态键问题
    if (validation.dynamicKeyIssues.length > 0) {
      result.issues.push({
        type: 'dynamic_key_issue',
        tool: tool.slug,
        locale: validation.locale,
        details: `动态键问题: ${validation.dynamicKeyIssues.map(i => i.details).join('; ')}`,
        severity: 'medium',
      });
    }
  }

  // 5. 检查跨语言一致性
  result.crossLanguageConsistency = checkCrossLanguageConsistency(tool.slug);

  return result;
}

/**
 * 运行完整审计
 */
export async function runFullAudit(
  options: {
    parallel?: boolean;
    maxConcurrency?: number;
    onProgress?: (current: number, total: number, tool: string) => void;
  } = {}
): Promise<AuditReport> {
  const { parallel = true, maxConcurrency = 10, onProgress } = options;

  console.log('🔍 开始全面审计...\n');
  console.log('='.repeat(80));

  const tools = loadTools();
  console.log(`\n📊 找到 ${tools.length} 个工具\n`);

  const toolResults: ToolAuditResult[] = [];

  if (parallel) {
    // 并行处理（分批）
    for (let i = 0; i < tools.length; i += maxConcurrency) {
      const batch = tools.slice(i, i + maxConcurrency);
      const batchResults = await Promise.all(
        batch.map(tool => auditTool(tool))
      );
      toolResults.push(...batchResults);

      if (onProgress) {
        onProgress(i + batch.length, tools.length, batch[batch.length - 1].slug);
      }
    }
  } else {
    // 串行处理
    for (let i = 0; i < tools.length; i++) {
      const tool = tools[i];
      const result = await auditTool(tool);
      toolResults.push(result);

      if (onProgress) {
        onProgress(i + 1, tools.length, tool.slug);
      }
    }
  }

  // 生成汇总报告
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    summary: {
      totalTools: tools.length,
      toolsWithIssues: toolResults.filter(r => r.issues.length > 0).length,
      totalIssues: toolResults.reduce((sum, r) => sum + r.issues.length, 0),
      issuesByType: {},
      issuesBySeverity: {},
    },
    tools: toolResults,
  };

  // 统计问题类型
  toolResults.forEach(result => {
    result.issues.forEach(issue => {
      report.summary.issuesByType[issue.type] = 
        (report.summary.issuesByType[issue.type] || 0) + 1;
      report.summary.issuesBySeverity[issue.severity] = 
        (report.summary.issuesBySeverity[issue.severity] || 0) + 1;
    });
  });

  return report;
}

/**
 * 生成可读的审计报告
 */
export function generateReadableReport(report: AuditReport): string {
  let output = '\n' + '='.repeat(80) + '\n';
  output += '\n📋 审计报告\n\n';

  if (report.summary.totalIssues === 0) {
    output += '✅ 太棒了！所有工具都没有问题。\n\n';
    return output;
  }

  output += `❌ 发现 ${report.summary.totalIssues} 个问题，涉及 ${report.summary.toolsWithIssues} 个工具\n\n`;

  // 问题统计
  output += '📊 问题统计：\n';
  Object.entries(report.summary.issuesByType).forEach(([type, count]) => {
    const typeNames: Record<string, string> = {
      missing_component: '缺少组件文件',
      missing_translation: '缺少翻译',
      translation_key_error: '翻译键错误',
      naming_issue: '命名问题',
      dynamic_key_issue: '动态键问题',
    };
    output += `  - ${typeNames[type] || type}: ${count}\n`;
  });

  output += '\n📊 严重程度统计：\n';
  Object.entries(report.summary.issuesBySeverity).forEach(([severity, count]) => {
    const icon = severity === 'high' ? '🔴' : severity === 'medium' ? '🟡' : '🟢';
    output += `  ${icon} ${severity}: ${count}\n`;
  });

  // 详细问题列表（只显示前 20 个）
  output += '\n' + '='.repeat(80) + '\n';
  output += '\n🔴 详细问题列表（前 20 个）：\n\n';

  const toolsWithIssues = report.tools.filter(t => t.issues.length > 0).slice(0, 20);

  toolsWithIssues.forEach(tool => {
    output += `### ${tool.slug}\n\n`;
    tool.issues.forEach(issue => {
      const icon = issue.severity === 'high' ? '🔴' : issue.severity === 'medium' ? '🟡' : '🟢';
      output += `  ${icon} ${issue.details}\n`;
      if (issue.locale) {
        output += `     语言: ${issue.locale}\n`;
      }
    });
    output += '\n';
  });

  if (report.summary.toolsWithIssues > 20) {
    output += `... 还有 ${report.summary.toolsWithIssues - 20} 个工具有问题\n\n`;
  }

  return output;
}

/**
 * 保存审计报告
 */
export function saveAuditReport(report: AuditReport, outputPath: string): void {
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 详细报告已保存到: ${outputPath}`);
}

// CLI 支持
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  (async () => {
    const startTime = Date.now();

    const report = await runFullAudit({
      parallel: true,
      maxConcurrency: 10,
      onProgress: (current, total, tool) => {
        const percent = ((current / total) * 100).toFixed(1);
        process.stdout.write(`\r进度: ${current}/${total} (${percent}%) - ${tool}          `);
      },
    });

    console.log('\n');

    // 显示可读报告
    console.log(generateReadableReport(report));

    // 保存详细报告
    const outputPath = path.join(process.cwd(), 'tools-audit-report-final.json');
    saveAuditReport(report, outputPath);

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n⏱️  审计耗时: ${duration}秒`);

    // 如果有问题，退出码为 1
    process.exit(report.summary.totalIssues > 0 ? 1 : 0);
  })();
}
