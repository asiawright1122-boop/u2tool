#!/usr/bin/env tsx

/**
 * 翻译文件验证器
 * 
 * 功能：验证翻译文件的完整性和一致性
 */

import fs from 'fs';
import path from 'path';
import type { TranslationKeyUsage } from './component-scanner';

export interface ValidationResult {
  tool: string;
  locale: string;
  hasBasicKeys: boolean;
  missingKeys: string[];
  extraKeys: string[];
  namingIssues: NamingIssue[];
  dynamicKeyIssues: DynamicKeyIssue[];
}

export interface NamingIssue {
  key: string;
  issue: 'case_inconsistency' | 'naming_convention' | 'duplicate';
  details: string;
}

export interface DynamicKeyIssue {
  pattern: string;
  missingValues: string[];
  details: string;
}

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const REQUIRED_BASIC_KEYS = ['name', 'description'];

/**
 * 加载翻译文件
 */
export function loadTranslationFile(locale: string): any {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  
  if (!fs.existsSync(filePath)) {
    throw new Error(`Translation file not found: ${filePath}`);
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * 检查嵌套键是否存在
 */
export function hasNestedKey(obj: any, keyPath: string): boolean {
  const parts = keyPath.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return false;
    }
  }
  
  return true;
}

/**
 * 获取嵌套键的值
 */
export function getNestedValue(obj: any, keyPath: string): any {
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
 * 验证工具的翻译
 */
export function validateToolTranslations(
  toolSlug: string,
  usedKeys: TranslationKeyUsage[],
  locale: string
): ValidationResult {
  const result: ValidationResult = {
    tool: toolSlug,
    locale,
    hasBasicKeys: true,
    missingKeys: [],
    extraKeys: [],
    namingIssues: [],
    dynamicKeyIssues: [],
  };

  try {
    const translations = loadTranslationFile(locale);
    
    if (!translations.tools || !translations.tools[toolSlug]) {
      result.hasBasicKeys = false;
      result.missingKeys.push('*all*');
      return result;
    }
    
    const toolTranslations = translations.tools[toolSlug];
    
    // 检查基本键
    for (const basicKey of REQUIRED_BASIC_KEYS) {
      if (!toolTranslations[basicKey]) {
        result.hasBasicKeys = false;
        result.missingKeys.push(basicKey);
      }
    }
    
    // 检查使用的键
    for (const usage of usedKeys) {
      if (usage.type === 'dynamic') {
        // 动态键需要特殊处理
        const pattern = usage.key;
        const dynamicIssue = validateDynamicKey(toolTranslations, pattern);
        if (dynamicIssue) {
          result.dynamicKeyIssues.push(dynamicIssue);
        }
      } else {
        // 静态键、嵌套键、条件键
        if (!hasNestedKey(toolTranslations, usage.key)) {
          result.missingKeys.push(usage.key);
        }
      }
    }
    
    // 检查命名一致性
    const namingIssues = checkNamingConsistency(toolTranslations);
    result.namingIssues.push(...namingIssues);
    
  } catch (error) {
    result.missingKeys.push(`Error: ${error}`);
  }

  return result;
}

/**
 * 验证动态键
 * 
 * 例如：sampleData.* 需要检查 sampleData 对象是否存在
 */
function validateDynamicKey(
  toolTranslations: any,
  pattern: string
): DynamicKeyIssue | null {
  // 提取基础路径
  // 例如：sampleData.* -> sampleData
  const basePath = pattern.replace(/\.\*.*$/, '');
  
  if (!hasNestedKey(toolTranslations, basePath)) {
    return {
      pattern,
      missingValues: [],
      details: `Base path '${basePath}' not found`,
    };
  }
  
  const baseObj = getNestedValue(toolTranslations, basePath);
  
  if (typeof baseObj !== 'object' || baseObj === null) {
    return {
      pattern,
      missingValues: [],
      details: `'${basePath}' is not an object`,
    };
  }
  
  // 检查是否为空对象
  if (Object.keys(baseObj).length === 0) {
    return {
      pattern,
      missingValues: [],
      details: `'${basePath}' is an empty object`,
    };
  }
  
  return null;
}

/**
 * 检查命名一致性
 */
function checkNamingConsistency(obj: any, prefix: string = ''): NamingIssue[] {
  const issues: NamingIssue[] = [];
  
  if (typeof obj !== 'object' || obj === null) {
    return issues;
  }
  
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    // 检查大小写不一致
    // 例如：Q1 和 q1 同时存在
    const lowerKey = key.toLowerCase();
    const upperKey = key.toUpperCase();
    
    if (key !== lowerKey && keys.includes(lowerKey)) {
      issues.push({
        key: fullKey,
        issue: 'case_inconsistency',
        details: `Both '${key}' and '${lowerKey}' exist`,
      });
    }
    
    if (key !== upperKey && keys.includes(upperKey)) {
      issues.push({
        key: fullKey,
        issue: 'case_inconsistency',
        details: `Both '${key}' and '${upperKey}' exist`,
      });
    }
    
    // 递归检查嵌套对象
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      issues.push(...checkNamingConsistency(obj[key], fullKey));
    }
  }
  
  return issues;
}

/**
 * 批量验证所有语言
 */
export function validateAllLocales(
  toolSlug: string,
  usedKeys: TranslationKeyUsage[]
): ValidationResult[] {
  return LOCALES.map(locale => 
    validateToolTranslations(toolSlug, usedKeys, locale)
  );
}

/**
 * 检查跨语言一致性
 */
export function checkCrossLanguageConsistency(
  toolSlug: string
): { consistent: boolean; issues: string[] } {
  const issues: string[] = [];
  
  try {
    const allTranslations = LOCALES.map(locale => {
      const data = loadTranslationFile(locale);
      return {
        locale,
        keys: data.tools?.[toolSlug] ? Object.keys(data.tools[toolSlug]) : [],
      };
    });
    
    // 使用英文作为基准
    const baseKeys = allTranslations.find(t => t.locale === 'en')?.keys || [];
    
    for (const translation of allTranslations) {
      if (translation.locale === 'en') continue;
      
      const missingKeys = baseKeys.filter(key => !translation.keys.includes(key));
      const extraKeys = translation.keys.filter(key => !baseKeys.includes(key));
      
      if (missingKeys.length > 0) {
        issues.push(`${translation.locale}: Missing keys: ${missingKeys.join(', ')}`);
      }
      
      if (extraKeys.length > 0) {
        issues.push(`${translation.locale}: Extra keys: ${extraKeys.join(', ')}`);
      }
    }
    
  } catch (error) {
    issues.push(`Error checking consistency: ${error}`);
  }
  
  return {
    consistent: issues.length === 0,
    issues,
  };
}

/**
 * 生成验证报告
 */
export function generateValidationReport(results: ValidationResult[]): string {
  let report = '# 翻译验证报告\n\n';
  
  const totalResults = results.length;
  const resultsWithIssues = results.filter(r => 
    !r.hasBasicKeys || 
    r.missingKeys.length > 0 || 
    r.namingIssues.length > 0 ||
    r.dynamicKeyIssues.length > 0
  );
  
  report += `- 验证结果数: ${totalResults}\n`;
  report += `- 有问题的结果: ${resultsWithIssues.length}\n`;
  report += `- 通过率: ${((totalResults - resultsWithIssues.length) / totalResults * 100).toFixed(1)}%\n\n`;
  
  if (resultsWithIssues.length > 0) {
    report += '## 问题详情\n\n';
    
    resultsWithIssues.forEach(result => {
      report += `### ${result.tool} (${result.locale})\n\n`;
      
      if (!result.hasBasicKeys) {
        report += '❌ 缺少基本键\n\n';
      }
      
      if (result.missingKeys.length > 0) {
        report += '**缺少的键:**\n';
        result.missingKeys.forEach(key => {
          report += `- ${key}\n`;
        });
        report += '\n';
      }
      
      if (result.namingIssues.length > 0) {
        report += '**命名问题:**\n';
        result.namingIssues.forEach(issue => {
          report += `- ${issue.key}: ${issue.details}\n`;
        });
        report += '\n';
      }
      
      if (result.dynamicKeyIssues.length > 0) {
        report += '**动态键问题:**\n';
        result.dynamicKeyIssues.forEach(issue => {
          report += `- ${issue.pattern}: ${issue.details}\n`;
        });
        report += '\n';
      }
    });
  }
  
  return report;
}

// CLI 支持
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const isMainModule = process.argv[1] === __filename;

if (isMainModule) {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: tsx translation-validator.ts <tool-slug>');
    process.exit(1);
  }
  
  const toolSlug = args[0];
  
  console.log(`🔍 验证工具翻译: ${toolSlug}\n`);
  
  // 这里需要先扫描组件获取使用的键
  // 简化版本：假设已经有扫描结果
  const usedKeys: TranslationKeyUsage[] = [];
  
  const results = validateAllLocales(toolSlug, usedKeys);
  
  console.log(generateValidationReport(results));
  
  // 检查跨语言一致性
  const consistency = checkCrossLanguageConsistency(toolSlug);
  
  if (!consistency.consistent) {
    console.log('\n## 跨语言一致性问题\n');
    consistency.issues.forEach(issue => {
      console.log(`- ${issue}`);
    });
  } else {
    console.log('\n✅ 跨语言一致性检查通过');
  }
}
