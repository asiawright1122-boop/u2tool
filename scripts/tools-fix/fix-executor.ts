#!/usr/bin/env tsx

/**
 * 批量修复执行器
 * 
 * 功能：执行翻译修复操作，包括备份、修复、验证和回滚
 */

import fs from 'fs';
import path from 'path';
import { generateTranslation, type TranslationTemplate } from './translation-generator';

export interface FixOperation {
  type: 'add_key' | 'rename_key' | 'sync_languages' | 'fix_naming';
  tool: string;
  locale: string;
  key: string;
  value?: string;
  oldKey?: string;
  newKey?: string;
}

export interface FixResult {
  operation: FixOperation;
  success: boolean;
  error?: string;
  backupPath?: string;
}

export interface FixPlan {
  timestamp: string;
  operations: FixOperation[];
  estimatedTime: number;
  affectedFiles: string[];
  backupDir: string;
}

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

/**
 * 创建备份
 */
export function createBackup(locale: string, backupDir: string): string {
  const sourcePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const backupPath = path.join(backupDir, `${locale}.json.backup`);

  // 确保备份目录存在
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // 复制文件
  fs.copyFileSync(sourcePath, backupPath);

  return backupPath;
}

/**
 * 恢复备份
 */
export function restoreBackup(locale: string, backupPath: string): void {
  const targetPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  fs.copyFileSync(backupPath, targetPath);
}

/**
 * 加载翻译文件
 */
function loadTranslationFile(locale: string): any {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 保存翻译文件
 */
function saveTranslationFile(locale: string, data: any): void {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
}

/**
 * 设置嵌套值
 */
function setNestedValue(obj: any, keyPath: string, value: any): void {
  const parts = keyPath.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
}

/**
 * 删除嵌套键
 */
function deleteNestedKey(obj: any, keyPath: string): boolean {
  const parts = keyPath.split('.');
  let current = obj;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current) || typeof current[part] !== 'object') {
      return false;
    }
    current = current[part];
  }

  const lastPart = parts[parts.length - 1];
  if (lastPart in current) {
    delete current[lastPart];
    return true;
  }

  return false;
}

/**
 * 执行单个修复操作
 */
export async function executeFixOperation(
  operation: FixOperation,
  backupDir: string
): Promise<FixResult> {
  const result: FixResult = {
    operation,
    success: false,
  };

  try {
    // 创建备份
    result.backupPath = createBackup(operation.locale, backupDir);

    // 加载翻译文件
    const translations = loadTranslationFile(operation.locale);

    // 确保 tools 对象存在
    if (!translations.tools) {
      translations.tools = {};
    }

    // 确保工具对象存在
    if (!translations.tools[operation.tool]) {
      translations.tools[operation.tool] = {};
    }

    const toolTranslations = translations.tools[operation.tool];

    // 执行操作
    switch (operation.type) {
      case 'add_key':
        if (operation.value) {
          setNestedValue(toolTranslations, operation.key, operation.value);
          result.success = true;
        } else {
          result.error = 'Missing value for add_key operation';
        }
        break;

      case 'rename_key':
        if (operation.oldKey && operation.newKey) {
          // 获取旧值
          const oldValue = getNestedValue(toolTranslations, operation.oldKey);
          if (oldValue !== undefined) {
            // 设置新键
            setNestedValue(toolTranslations, operation.newKey, oldValue);
            // 删除旧键
            deleteNestedKey(toolTranslations, operation.oldKey);
            result.success = true;
          } else {
            result.error = `Old key '${operation.oldKey}' not found`;
          }
        } else {
          result.error = 'Missing oldKey or newKey for rename_key operation';
        }
        break;

      case 'fix_naming':
        // 修复命名问题（例如：Q1 -> q1）
        if (operation.oldKey && operation.newKey) {
          const oldValue = getNestedValue(toolTranslations, operation.oldKey);
          if (oldValue !== undefined) {
            setNestedValue(toolTranslations, operation.newKey, oldValue);
            deleteNestedKey(toolTranslations, operation.oldKey);
            result.success = true;
          }
        }
        break;

      default:
        result.error = `Unknown operation type: ${operation.type}`;
    }

    // 保存修改
    if (result.success) {
      saveTranslationFile(operation.locale, translations);
    }

  } catch (error) {
    result.error = `${error}`;
    result.success = false;

    // 恢复备份
    if (result.backupPath) {
      try {
        restoreBackup(operation.locale, result.backupPath);
      } catch (restoreError) {
        result.error += ` (Failed to restore backup: ${restoreError})`;
      }
    }
  }

  return result;
}

/**
 * 获取嵌套值
 */
function getNestedValue(obj: any, keyPath: string): any {
  const parts = keyPath.split('.');
  let current = obj;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * 批量执行修复操作
 */
export async function executeBatchFix(
  operations: FixOperation[],
  options: {
    parallel?: boolean;
    maxConcurrency?: number;
    onProgress?: (current: number, total: number, operation: FixOperation) => void;
  } = {}
): Promise<FixResult[]> {
  const { parallel = false, maxConcurrency = 5, onProgress } = options;

  // 创建备份目录
  const backupDir = path.join(
    process.cwd(),
    'backups',
    `fix-${Date.now()}`
  );

  const results: FixResult[] = [];

  if (parallel) {
    // 并行执行（分批）
    for (let i = 0; i < operations.length; i += maxConcurrency) {
      const batch = operations.slice(i, i + maxConcurrency);
      const batchResults = await Promise.all(
        batch.map(op => executeFixOperation(op, backupDir))
      );
      results.push(...batchResults);

      if (onProgress) {
        onProgress(i + batch.length, operations.length, batch[batch.length - 1]);
      }
    }
  } else {
    // 串行执行
    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];
      const result = await executeFixOperation(operation, backupDir);
      results.push(result);

      if (onProgress) {
        onProgress(i + 1, operations.length, operation);
      }
    }
  }

  return results;
}

/**
 * 生成修复计划
 */
export function generateFixPlan(
  missingKeys: Array<{
    tool: string;
    locale: string;
    keys: string[];
  }>
): FixPlan {
  const operations: FixOperation[] = [];

  for (const item of missingKeys) {
    for (const key of item.keys) {
      // 生成翻译
      const template = generateTranslation(key, item.locale, {
        toolSlug: item.tool,
      });

      if (template) {
        operations.push({
          type: 'add_key',
          tool: item.tool,
          locale: item.locale,
          key,
          value: template.value,
        });
      }
    }
  }

  // 计算受影响的文件
  const affectedLocales = new Set(operations.map(op => op.locale));
  const affectedFiles = Array.from(affectedLocales).map(
    locale => `src/messages/${locale}.json`
  );

  // 估算时间（每个操作约 10ms）
  const estimatedTime = operations.length * 10;

  const backupDir = path.join(
    process.cwd(),
    'backups',
    `fix-${Date.now()}`
  );

  return {
    timestamp: new Date().toISOString(),
    operations,
    estimatedTime,
    affectedFiles,
    backupDir,
  };
}

/**
 * 验证修复结果
 */
export function validateFix(
  tool: string,
  locale: string,
  keys: string[]
): { valid: boolean; missingKeys: string[] } {
  try {
    const translations = loadTranslationFile(locale);
    const toolTranslations = translations.tools?.[tool];

    if (!toolTranslations) {
      return { valid: false, missingKeys: keys };
    }

    const missingKeys: string[] = [];

    for (const key of keys) {
      const value = getNestedValue(toolTranslations, key);
      if (value === undefined) {
        missingKeys.push(key);
      }
    }

    return {
      valid: missingKeys.length === 0,
      missingKeys,
    };
  } catch (error) {
    return { valid: false, missingKeys: keys };
  }
}

/**
 * 生成修复报告
 */
export function generateFixReport(results: FixResult[]): string {
  const total = results.length;
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  let report = '# 修复执行报告\n\n';
  report += `- 总操作数: ${total}\n`;
  report += `- 成功: ${successful}\n`;
  report += `- 失败: ${failed}\n`;
  report += `- 成功率: ${((successful / total) * 100).toFixed(1)}%\n\n`;

  if (failed > 0) {
    report += '## 失败的操作\n\n';
    results.filter(r => !r.success).forEach(result => {
      report += `### ${result.operation.tool} (${result.operation.locale})\n`;
      report += `- 操作: ${result.operation.type}\n`;
      report += `- 键: ${result.operation.key}\n`;
      report += `- 错误: ${result.error}\n\n`;
    });
  }

  return report;
}

// CLI 支持
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  console.log('批量修复执行器');
  console.log('请使用 interactive-fixer.ts 进行交互式修复');
}
