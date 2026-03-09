#!/usr/bin/env node

import { glob } from 'glob';
import fs from 'fs-extra';

export interface HookIssue {
  file: string;
  line: number;
  hook: string;
  issue: string;
  severity: 'error' | 'warning';
}

/**
 * 验证 React Hooks 依赖
 */
export async function validateHooksDependencies(): Promise<HookIssue[]> {
  const issues: HookIssue[] = [];
  
  // 扫描所有 Svelte 组件
  const files = await glob('src/components/**/*.svelte');
  
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;
      
      // 检查 useEffect
      if (line.includes('useEffect')) {
        const issue = checkUseEffect(line, lines, i);
        if (issue) {
          issues.push({
            file,
            line: lineNumber,
            hook: 'useEffect',
            issue,
            severity: 'warning',
          });
        }
      }
      
      // 检查 useMemo
      if (line.includes('useMemo')) {
        const issue = checkUseMemo(line, lines, i);
        if (issue) {
          issues.push({
            file,
            line: lineNumber,
            hook: 'useMemo',
            issue,
            severity: 'warning',
          });
        }
      }
      
      // 检查 useCallback
      if (line.includes('useCallback')) {
        const issue = checkUseCallback(line, lines, i);
        if (issue) {
          issues.push({
            file,
            line: lineNumber,
            hook: 'useCallback',
            issue,
            severity: 'warning',
          });
        }
      }
      
      // 检查翻译函数 t 的使用
      if (line.includes('useEffect') || line.includes('useMemo') || line.includes('useCallback')) {
        const tIssue = checkTranslationFunction(line, lines, i);
        if (tIssue) {
          issues.push({
            file,
            line: lineNumber,
            hook: 'translation',
            issue: tIssue,
            severity: 'error',
          });
        }
      }
    }
  }
  
  return issues;
}

/**
 * 检查 useEffect 依赖
 */
function checkUseEffect(line: string, lines: string[], index: number): string | null {
  // 查找依赖数组
  const deps = findDependencyArray(lines, index);
  if (!deps) return null;
  
  // 检查是否包含翻译函数 t
  if (deps.includes(', t]') || deps.includes('[t]') || deps.includes('[t,')) {
    return '依赖数组包含翻译函数 t，会导致不必要的重渲染';
  }
  
  return null;
}

/**
 * 检查 useMemo 依赖
 */
function checkUseMemo(line: string, lines: string[], index: number): string | null {
  const deps = findDependencyArray(lines, index);
  if (!deps) return null;
  
  if (deps.includes(', t]') || deps.includes('[t]') || deps.includes('[t,')) {
    return '依赖数组包含翻译函数 t，会导致不必要的重计算';
  }
  
  return null;
}

/**
 * 检查 useCallback 依赖
 */
function checkUseCallback(line: string, lines: string[], index: number): string | null {
  const deps = findDependencyArray(lines, index);
  if (!deps) return null;
  
  if (deps.includes(', t]') || deps.includes('[t]') || deps.includes('[t,')) {
    return '依赖数组包含翻译函数 t，会导致不必要的重创建';
  }
  
  return null;
}

/**
 * 检查翻译函数的使用
 */
function checkTranslationFunction(line: string, lines: string[], index: number): string | null {
  const deps = findDependencyArray(lines, index);
  if (!deps) return null;
  
  // 检查是否在依赖数组中包含 t
  if (deps.includes(', t]') || deps.includes('[t]') || deps.includes('[t,')) {
    return '翻译函数 t 不应该作为依赖项（useTranslations 返回的函数每次渲染都是新引用）';
  }
  
  return null;
}

/**
 * 查找依赖数组
 */
function findDependencyArray(lines: string[], startIndex: number): string | null {
  // 从当前行开始向下查找依赖数组
  for (let i = startIndex; i < Math.min(startIndex + 10, lines.length); i++) {
    const line = lines[i];
    
    // 查找 [...]
    const match = line.match(/\[([^\]]*)\]/);
    if (match) {
      return match[0];
    }
  }
  
  return null;
}

/**
 * 打印验证结果
 */
export function printHooksIssues(issues: HookIssue[]): void {
  if (issues.length === 0) {
    console.log('✅ 未发现 React Hooks 依赖问题');
    return;
  }
  
  console.log(`\n发现 ${issues.length} 个 React Hooks 依赖问题:\n`);
  
  // 按文件分组
  const byFile = new Map<string, HookIssue[]>();
  for (const issue of issues) {
    if (!byFile.has(issue.file)) {
      byFile.set(issue.file, []);
    }
    byFile.get(issue.file)!.push(issue);
  }
  
  for (const [file, fileIssues] of byFile) {
    console.log(`\n${file}:`);
    for (const issue of fileIssues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️';
      console.log(`  ${icon} 行 ${issue.line} (${issue.hook}): ${issue.issue}`);
    }
  }
  
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  
  console.log(`\n总计: ${errors} 个错误, ${warnings} 个警告`);
}

// CLI 入口
if (import.meta.url === `file://${process.argv[1]}`) {
  validateHooksDependencies()
    .then(issues => {
      printHooksIssues(issues);
      process.exit(issues.filter(i => i.severity === 'error').length > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('错误:', error);
      process.exit(1);
    });
}
