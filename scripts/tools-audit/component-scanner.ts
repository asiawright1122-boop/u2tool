#!/usr/bin/env tsx

/**
 * 组件翻译键扫描器
 * 
 * 功能：扫描 Svelte 组件文件，提取所有使用的翻译键
 * 支持：静态键、嵌套键、动态键、条件键
 */

import fs from 'fs';
import path from 'path';

export interface TranslationKeyUsage {
  key: string;
  type: 'static' | 'dynamic' | 'nested' | 'conditional';
  pattern?: string; // 用于动态键
  line: number;
  context: string;
  fullMatch: string;
}

export interface ComponentScanResult {
  componentPath: string;
  componentName: string;
  usedKeys: TranslationKeyUsage[];
  errors: string[];
}

/**
 * 扫描组件文件，提取所有翻译键
 */
export function scanComponentTranslationKeys(
  componentPath: string
): ComponentScanResult {
  const result: ComponentScanResult = {
    componentPath,
    componentName: path.basename(componentPath, '.svelte'),
    usedKeys: [],
    errors: [],
  };

  try {
    const content = fs.readFileSync(componentPath, 'utf-8');
    const lines = content.split('\n');

    // 1. 静态键: t('key') 或 t("key")
    const staticRegex = /\bt\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
    
    // 2. 模板字符串键: t(`key`)
    const templateRegex = /\bt\s*\(\s*`([^`]+)`\s*\)/g;
    
    // 3. 条件键: t(condition ? 'key1' : 'key2')
    const conditionalRegex = /\bt\s*\(\s*[^)]*\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]\s*\)/g;

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();

      // 扫描静态键
      let match;
      while ((match = staticRegex.exec(line)) !== null) {
        const key = match[1];
        const type = key.includes('.') ? 'nested' : 'static';
        
        result.usedKeys.push({
          key,
          type,
          line: lineNumber,
          context: trimmedLine,
          fullMatch: match[0],
        });
      }

      // 扫描模板字符串键（可能包含动态部分）
      while ((match = templateRegex.exec(line)) !== null) {
        const template = match[1];
        
        // 检查是否包含变量插值
        if (template.includes('${')) {
          // 动态键
          const pattern = template.replace(/\$\{[^}]+\}/g, '*');
          result.usedKeys.push({
            key: pattern,
            type: 'dynamic',
            pattern: template,
            line: lineNumber,
            context: trimmedLine,
            fullMatch: match[0],
          });
        } else {
          // 静态模板字符串
          const type = template.includes('.') ? 'nested' : 'static';
          result.usedKeys.push({
            key: template,
            type,
            line: lineNumber,
            context: trimmedLine,
            fullMatch: match[0],
          });
        }
      }

      // 扫描条件键
      while ((match = conditionalRegex.exec(line)) !== null) {
        const key1 = match[1];
        const key2 = match[2];
        
        result.usedKeys.push({
          key: key1,
          type: 'conditional',
          line: lineNumber,
          context: trimmedLine,
          fullMatch: match[0],
        });
        
        result.usedKeys.push({
          key: key2,
          type: 'conditional',
          line: lineNumber,
          context: trimmedLine,
          fullMatch: match[0],
        });
      }
    });

    // 去重（保留第一次出现的位置）
    const seen = new Set<string>();
    result.usedKeys = result.usedKeys.filter(usage => {
      const id = `${usage.key}:${usage.type}`;
      if (seen.has(id)) {
        return false;
      }
      seen.add(id);
      return true;
    });

  } catch (error) {
    result.errors.push(`Failed to scan component: ${error}`);
  }

  return result;
}

/**
 * 批量扫描多个组件
 */
export function scanComponents(
  componentPaths: string[]
): ComponentScanResult[] {
  return componentPaths.map(scanComponentTranslationKeys);
}

/**
 * 扫描工具目录下的所有组件
 */
export function scanToolsDirectory(
  toolsDir: string = path.join(process.cwd(), 'src', 'components', 'tools')
): ComponentScanResult[] {
  const results: ComponentScanResult[] = [];

  try {
    const files = fs.readdirSync(toolsDir);
    
    for (const file of files) {
      if (file.endsWith('.svelte') && !file.startsWith('Tool')) {
        const componentPath = path.join(toolsDir, file);
        const result = scanComponentTranslationKeys(componentPath);
        results.push(result);
      }
    }
  } catch (error) {
    console.error(`Failed to scan tools directory: ${error}`);
  }

  return results;
}

/**
 * 分析动态键的可能值
 * 
 * 例如：t(`sampleData.${item.categoryKey}`)
 * 需要找出 categoryKey 的所有可能值
 */
export function analyzeDynamicKeyPatterns(
  scanResult: ComponentScanResult
): Map<string, string[]> {
  const patterns = new Map<string, string[]>();

  for (const usage of scanResult.usedKeys) {
    if (usage.type === 'dynamic' && usage.pattern) {
      // 简单的模式识别
      // 例如：sampleData.${variable} -> sampleData.*
      const basePattern = usage.key;
      
      // 尝试从组件代码中推断可能的值
      // 这里可以添加更复杂的静态分析逻辑
      patterns.set(basePattern, []);
    }
  }

  return patterns;
}

/**
 * 生成扫描报告
 */
export function generateScanReport(results: ComponentScanResult[]): string {
  const totalComponents = results.length;
  const totalKeys = results.reduce((sum, r) => sum + r.usedKeys.length, 0);
  const componentsWithErrors = results.filter(r => r.errors.length > 0).length;

  let report = '# 组件翻译键扫描报告\n\n';
  report += `- 扫描组件数: ${totalComponents}\n`;
  report += `- 发现翻译键: ${totalKeys}\n`;
  report += `- 扫描错误: ${componentsWithErrors}\n\n`;

  // 按类型统计
  const typeStats = {
    static: 0,
    nested: 0,
    dynamic: 0,
    conditional: 0,
  };

  results.forEach(result => {
    result.usedKeys.forEach(usage => {
      typeStats[usage.type]++;
    });
  });

  report += '## 翻译键类型统计\n\n';
  report += `- 静态键: ${typeStats.static}\n`;
  report += `- 嵌套键: ${typeStats.nested}\n`;
  report += `- 动态键: ${typeStats.dynamic}\n`;
  report += `- 条件键: ${typeStats.conditional}\n\n`;

  // 列出有错误的组件
  if (componentsWithErrors > 0) {
    report += '## 扫描错误\n\n';
    results.forEach(result => {
      if (result.errors.length > 0) {
        report += `### ${result.componentName}\n\n`;
        result.errors.forEach(error => {
          report += `- ${error}\n`;
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
  
  if (args.length === 0) {
    // 扫描所有工具组件
    console.log('🔍 扫描所有工具组件...\n');
    const results = scanToolsDirectory();
    
    console.log(generateScanReport(results));
    
    // 保存详细结果
    const outputPath = path.join(process.cwd(), 'component-scan-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 详细结果已保存到: ${outputPath}`);
    
  } else {
    // 扫描指定组件
    const componentPath = args[0];
    console.log(`🔍 扫描组件: ${componentPath}\n`);
    
    const result = scanComponentTranslationKeys(componentPath);
    
    console.log(`组件: ${result.componentName}`);
    console.log(`翻译键数量: ${result.usedKeys.length}\n`);
    
    if (result.usedKeys.length > 0) {
      console.log('使用的翻译键:');
      result.usedKeys.forEach(usage => {
        console.log(`  - ${usage.key} (${usage.type}) [行 ${usage.line}]`);
      });
    }
    
    if (result.errors.length > 0) {
      console.log('\n错误:');
      result.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }
  }
}
