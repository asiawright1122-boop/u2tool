#!/usr/bin/env node

import fs from 'fs-extra';
import * as path from 'path';

export interface TranslationIssue {
  locale: string;
  missingKeys: string[];
}

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

/**
 * 验证翻译完整性
 */
export async function validateTranslations(): Promise<TranslationIssue[]> {
  const issues: TranslationIssue[] = [];
  
  // 读取所有语言的翻译文件
  const translations = new Map<string, any>();
  
  for (const locale of LOCALES) {
    const filePath = path.join('src/messages', `${locale}.json`);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf-8');
      translations.set(locale, JSON.parse(content));
    }
  }
  
  // 以英文为基准，检查其他语言是否有缺失的键
  const enTranslations = translations.get('en');
  if (!enTranslations) {
    throw new Error('英文翻译文件不存在');
  }
  
  const enKeys = getAllKeys(enTranslations);
  
  for (const locale of LOCALES) {
    if (locale === 'en') continue;
    
    const localeTranslations = translations.get(locale);
    if (!localeTranslations) {
      issues.push({
        locale,
        missingKeys: ['整个翻译文件缺失'],
      });
      continue;
    }
    
    const localeKeys = getAllKeys(localeTranslations);
    const missingKeys = enKeys.filter(key => !localeKeys.includes(key));
    
    if (missingKeys.length > 0) {
      issues.push({
        locale,
        missingKeys,
      });
    }
  }
  
  return issues;
}

/**
 * 获取所有键（扁平化）
 */
function getAllKeys(obj: any, prefix = ''): string[] {
  const keys: string[] = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

/**
 * 打印验证结果
 */
export function printTranslationIssues(issues: TranslationIssue[]): void {
  if (issues.length === 0) {
    console.log('✅ 所有语言的翻译都是完整的');
    return;
  }
  
  console.log(`\n发现 ${issues.length} 个语言有缺失的翻译:\n`);
  
  for (const issue of issues) {
    console.log(`${issue.locale}:`);
    console.log(`  缺失 ${issue.missingKeys.length} 个键`);
    
    if (issue.missingKeys.length <= 10) {
      for (const key of issue.missingKeys) {
        console.log(`    - ${key}`);
      }
    } else {
      for (const key of issue.missingKeys.slice(0, 10)) {
        console.log(`    - ${key}`);
      }
      console.log(`    ... 还有 ${issue.missingKeys.length - 10} 个`);
    }
    console.log();
  }
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  validateTranslations()
    .then(issues => {
      printTranslationIssues(issues);
      process.exit(issues.length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('错误:', error);
      process.exit(1);
    });
}
