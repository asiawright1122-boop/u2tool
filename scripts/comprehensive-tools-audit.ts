#!/usr/bin/env tsx

/**
 * 全面审计所有工具的翻译和加载状态
 * 
 * 目标：
 * 1. 检查所有工具的翻译键完整性
 * 2. 检查所有工具组件是否存在
 * 3. 检查 ToolWrapper 中的动态导入配置
 * 4. 生成详细的问题报告
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

interface Tool {
  slug: string;
  category: string;
  component: string;
}

interface Issue {
  type: 'missing_translation' | 'missing_component' | 'missing_wrapper' | 'translation_key_error';
  tool: string;
  locale?: string;
  key?: string;
  details: string;
}

const issues: Issue[] = [];

// 1. 读取工具配置
function loadTools(): Tool[] {
  const toolsConfigPath = path.join(process.cwd(), 'src', 'config', 'tools.ts');
  const content = fs.readFileSync(toolsConfigPath, 'utf-8');
  
  // 简单解析 tools 数组（假设格式规范）
  const toolsMatch = content.match(/export const tools: Tool\[\] = \[([\s\S]*?)\];/);
  if (!toolsMatch) {
    console.error('无法解析 tools.ts');
    return [];
  }
  
  const toolsStr = toolsMatch[1];
  const tools: Tool[] = [];
  
  // 匹配每个工具对象
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

// 2. 检查组件文件是否存在
function checkComponentExists(component: string): boolean {
  const componentPath = path.join(process.cwd(), 'src', 'components', 'tools', `${component}.svelte`);
  return fs.existsSync(componentPath);
}

// 3. 检查 ToolWrapper 中的动态导入
function checkToolWrapperImport(component: string): boolean {
  const wrapperPath = path.join(process.cwd(), 'src', 'components', 'tools', 'ToolWrapper.svelte');
  const content = fs.readFileSync(wrapperPath, 'utf-8');
  
  // 检查是否有该组件的动态导入
  const importRegex = new RegExp(`['"]${component}['"]\\s*:\\s*\\(\\)\\s*=>\\s*import\\(['"]\\.\/${component}`, 'i');
  return importRegex.test(content);
}

// 4. 检查翻译键完整性
function checkTranslations(slug: string, locale: string): string[] {
  const translationPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  
  if (!fs.existsSync(translationPath)) {
    return ['translation_file_not_found'];
  }
  
  const content = fs.readFileSync(translationPath, 'utf-8');
  const data = JSON.parse(content);
  
  const missingKeys: string[] = [];
  
  // 检查基本键
  if (!data.tools || !data.tools[slug]) {
    return ['tool_not_found_in_translations'];
  }
  
  const tool = data.tools[slug];
  
  // 必需的基本键
  const requiredKeys = ['name', 'description'];
  for (const key of requiredKeys) {
    if (!tool[key]) {
      missingKeys.push(key);
    }
  }
  
  return missingKeys;
}

// 5. 扫描组件文件中使用的翻译键
function scanComponentTranslationKeys(component: string): string[] {
  const componentPath = path.join(process.cwd(), 'src', 'components', 'tools', `${component}.svelte`);
  
  if (!fs.existsSync(componentPath)) {
    return [];
  }
  
  const content = fs.readFileSync(componentPath, 'utf-8');
  const keys: string[] = [];
  
  // 匹配 t('key') 和 t("key") 和 t(`key`)
  const tRegex = /\bt\s*\(\s*['"`]([^'"`]+)['"`]\s*\)/g;
  let match;
  
  while ((match = tRegex.exec(content)) !== null) {
    keys.push(match[1]);
  }
  
  // 匹配 t(`sampleData.${variable}`) 这种模式
  const dynamicRegex = /\bt\s*\(\s*`([^`]*)\$\{[^}]+\}([^`]*)`\s*\)/g;
  while ((match = dynamicRegex.exec(content)) !== null) {
    // 记录动态键的模式
    keys.push(`${match[1]}*${match[2]}`);
  }
  
  return [...new Set(keys)];
}

// 6. 验证组件使用的翻译键是否存在
function verifyComponentTranslationKeys(slug: string, component: string, locale: string): string[] {
  const translationPath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  
  if (!fs.existsSync(translationPath)) {
    return [];
  }
  
  const content = fs.readFileSync(translationPath, 'utf-8');
  const data = JSON.parse(content);
  
  if (!data.tools || !data.tools[slug]) {
    return [];
  }
  
  const tool = data.tools[slug];
  const usedKeys = scanComponentTranslationKeys(component);
  const missingKeys: string[] = [];
  
  for (const key of usedKeys) {
    // 跳过动态键（包含 * 的）
    if (key.includes('*')) {
      continue;
    }
    
    // 检查嵌套键（如 sampleData.q1）
    if (key.includes('.')) {
      const parts = key.split('.');
      let current: any = tool;
      let found = true;
      
      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          found = false;
          break;
        }
      }
      
      if (!found) {
        missingKeys.push(key);
      }
    } else {
      // 简单键
      if (!(key in tool)) {
        missingKeys.push(key);
      }
    }
  }
  
  return missingKeys;
}

// 主函数
async function main() {
  console.log('🔍 开始全面审计所有工具...\n');
  console.log('='.repeat(80));
  
  const tools = loadTools();
  console.log(`\n📊 找到 ${tools.length} 个工具\n`);
  
  let totalIssues = 0;
  const toolsWithIssues: string[] = [];
  
  for (const tool of tools) {
    const toolIssues: Issue[] = [];
    
    // 检查 1: 组件文件是否存在
    if (!checkComponentExists(tool.component)) {
      toolIssues.push({
        type: 'missing_component',
        tool: tool.slug,
        details: `组件文件不存在: ${tool.component}.svelte`,
      });
    }
    
    // 检查 2: ToolWrapper 中是否有动态导入
    if (!checkToolWrapperImport(tool.component)) {
      toolIssues.push({
        type: 'missing_wrapper',
        tool: tool.slug,
        details: `ToolWrapper.svelte 中缺少动态导入配置`,
      });
    }
    
    // 检查 3: 所有语言的翻译
    for (const locale of LOCALES) {
      const missingBasicKeys = checkTranslations(tool.slug, locale);
      
      if (missingBasicKeys.length > 0) {
        toolIssues.push({
          type: 'missing_translation',
          tool: tool.slug,
          locale,
          details: `缺少基本翻译键: ${missingBasicKeys.join(', ')}`,
        });
      }
      
      // 检查 4: 组件使用的翻译键是否存在（只检查英文，避免重复）
      if (locale === 'en' && checkComponentExists(tool.component)) {
        const missingComponentKeys = verifyComponentTranslationKeys(tool.slug, tool.component, locale);
        
        if (missingComponentKeys.length > 0) {
          toolIssues.push({
            type: 'translation_key_error',
            tool: tool.slug,
            locale: 'all',
            details: `组件使用了不存在的翻译键: ${missingComponentKeys.join(', ')}`,
          });
        }
      }
    }
    
    if (toolIssues.length > 0) {
      toolsWithIssues.push(tool.slug);
      issues.push(...toolIssues);
      totalIssues += toolIssues.length;
    }
  }
  
  // 生成报告
  console.log('\n' + '='.repeat(80));
  console.log('\n📋 审计报告\n');
  
  if (issues.length === 0) {
    console.log('✅ 太棒了！所有工具都没有问题。\n');
    return;
  }
  
  console.log(`❌ 发现 ${totalIssues} 个问题，涉及 ${toolsWithIssues.length} 个工具\n`);
  
  // 按问题类型分组
  const issuesByType = {
    missing_component: issues.filter(i => i.type === 'missing_component'),
    missing_wrapper: issues.filter(i => i.type === 'missing_wrapper'),
    missing_translation: issues.filter(i => i.type === 'missing_translation'),
    translation_key_error: issues.filter(i => i.type === 'translation_key_error'),
  };
  
  console.log('📊 问题统计：');
  console.log(`  - 缺少组件文件: ${issuesByType.missing_component.length}`);
  console.log(`  - 缺少 ToolWrapper 配置: ${issuesByType.missing_wrapper.length}`);
  console.log(`  - 缺少翻译: ${issuesByType.missing_translation.length}`);
  console.log(`  - 翻译键错误: ${issuesByType.translation_key_error.length}`);
  
  // 详细问题列表
  console.log('\n' + '='.repeat(80));
  console.log('\n🔴 详细问题列表：\n');
  
  for (const [type, typeIssues] of Object.entries(issuesByType)) {
    if (typeIssues.length === 0) continue;
    
    const typeNames = {
      missing_component: '缺少组件文件',
      missing_wrapper: '缺少 ToolWrapper 配置',
      missing_translation: '缺少翻译',
      translation_key_error: '翻译键错误',
    };
    
    console.log(`\n### ${typeNames[type as keyof typeof typeNames]} (${typeIssues.length})\n`);
    
    for (const issue of typeIssues) {
      console.log(`  ❌ ${issue.tool}`);
      if (issue.locale) {
        console.log(`     语言: ${issue.locale}`);
      }
      console.log(`     ${issue.details}`);
      console.log();
    }
  }
  
  // 生成 JSON 报告
  const reportPath = path.join(process.cwd(), 'tools-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTools: tools.length,
    toolsWithIssues: toolsWithIssues.length,
    totalIssues,
    issuesByType: {
      missing_component: issuesByType.missing_component.length,
      missing_wrapper: issuesByType.missing_wrapper.length,
      missing_translation: issuesByType.missing_translation.length,
      translation_key_error: issuesByType.translation_key_error.length,
    },
    issues,
  }, null, 2));
  
  console.log('='.repeat(80));
  console.log(`\n📄 详细报告已保存到: ${reportPath}\n`);
  
  process.exit(issues.length > 0 ? 1 : 0);
}

main().catch(console.error);
