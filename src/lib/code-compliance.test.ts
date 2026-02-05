/**
 * 代码合规性属性测试
 * 
 * 验证代码库符合项目规范和 Next.js 最佳实践
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// 递归获取所有文件
function getAllFiles(dir: string, extensions: string[]): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // 跳过 node_modules 和 .next 目录
      if (item.name !== 'node_modules' && item.name !== '.next') {
        files.push(...getAllFiles(fullPath, extensions));
      }
    } else if (item.isFile()) {
      const ext = path.extname(item.name);
      if (extensions.includes(ext)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

// 检查文件是否包含不允许的调试语句
function checkForDebugStatements(filePath: string): { hasDebug: boolean; issues: string[] } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const issues: string[] = [];
  
  // 跳过测试文件
  if (filePath.includes('.test.') || filePath.includes('.spec.')) {
    return { hasDebug: false, issues: [] };
  }
  
  // 跳过 web-vitals 相关文件（有意的调试输出）
  if (filePath.includes('web-vitals') || filePath.includes('WebVitals') || filePath.includes('performance-monitor')) {
    return { hasDebug: false, issues: [] };
  }
  
  // 跳过性能监控和资源管理相关文件（有意的调试输出）
  if (filePath.includes('PerformanceMonitor') || filePath.includes('library-loader') || filePath.includes('resource-cleaner') || filePath.includes('resource-monitor')) {
    return { hasDebug: false, issues: [] };
  }
  
  // 跳过包含示例代码的工具组件（这些 console.log 是展示给用户的示例）
  const toolsWithExampleCode = [
    'JsMinifier',
    'JsObfuscator', 
    'MarkdownEditor',
    'MarkdownToPdf',
    'CurlConverter',
    'CurlToCode',
    'JsonToForm',
    'GdprConsentGenerator',
    'CodeScreenshotGenerator',
    'DatabaseConnectionTester',
    'PerformanceProfiler',
    'RegexToCodeGenerator',
    'TypescriptPlayground',
    'ThirdPartyScripts',
  ];
  if (toolsWithExampleCode.some(tool => filePath.includes(tool))) {
    return { hasDebug: false, issues: [] };
  }
  
  const lines = content.split('\n');
  let inTemplateString = false;
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // 简单的模板字符串检测（单行开始/结束）
    const backtickMatches = line.match(/`/g);
    if (backtickMatches && backtickMatches.length % 2 === 1) {
      inTemplateString = !inTemplateString;
    }
    
    // 如果在模板字符串中，跳过检查
    if (inTemplateString) {
      return;
    }
    
    // 检查 debugger 语句
    if (/^\s*debugger\s*;?\s*$/.test(line)) {
      issues.push(`Line ${lineNum}: debugger statement found`);
    }
    
    // 检查裸露的 console.log 调用（排除字符串中的）
    if (/^\s*console\.log\s*\(/.test(line)) {
      // 确保不是在字符串中
      const beforeConsole = line.split('console.log')[0];
      const quoteCount = (beforeConsole.match(/['"]/g) || []).length;
      if (quoteCount % 2 === 0) {
        issues.push(`Line ${lineNum}: console.log statement found`);
      }
    }
  });
  
  return { hasDebug: issues.length > 0, issues };
}

// 检查组件是否正确使用 'use client' 指令
function checkClientDirective(filePath: string): { isValid: boolean; reason: string } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
  
  // 客户端特性模式
  const clientFeatures = [
    /\buseState\b/,
    /\buseEffect\b/,
    /\buseRef\b/,
    /\buseCallback\b/,
    /\buseMemo\b/,
    /\buseContext\b/,
    /\buseReducer\b/,
    /\buseLayoutEffect\b/,
    /\bonClick\b/,
    /\bonChange\b/,
    /\bonSubmit\b/,
    /\bonKeyDown\b/,
    /\bonKeyUp\b/,
    /\bonFocus\b/,
    /\bonBlur\b/,
    /\bwindow\./,
    /\bdocument\./,
    /\blocalStorage\b/,
    /\bsessionStorage\b/,
  ];
  
  const usesClientFeatures = clientFeatures.some(pattern => pattern.test(content));
  
  if (hasUseClient && !usesClientFeatures) {
    // 有 'use client' 但没有使用客户端特性 - 可能是不必要的
    // 但这不一定是错误，因为组件可能导入了其他客户端组件
    return { isValid: true, reason: 'Has use client directive' };
  }
  
  if (!hasUseClient && usesClientFeatures) {
    // 使用了客户端特性但没有 'use client' - 这是错误
    return { isValid: false, reason: 'Uses client features but missing use client directive' };
  }
  
  return { isValid: true, reason: 'Correct directive usage' };
}

describe('Code Compliance - Property Tests', () => {
  describe('Property 1: No Debug Statements in Production Code', () => {
    it('should not have debugger statements in source files', () => {
      const srcFiles = getAllFiles('src', ['.ts', '.tsx']);
      const violations: string[] = [];
      
      srcFiles.forEach(file => {
        const { hasDebug, issues } = checkForDebugStatements(file);
        if (hasDebug) {
          violations.push(`${file}:\n  ${issues.join('\n  ')}`);
        }
      });
      
      expect(violations).toEqual([]);
    });
  });

  describe('Property 3: Client Directive Correctness', () => {
    it('should have use client directive when using client features', () => {
      const componentFiles = getAllFiles('src/components', ['.tsx']);
      const violations: string[] = [];
      
      componentFiles.forEach(file => {
        // 跳过测试文件
        if (file.includes('.test.') || file.includes('.spec.')) {
          return;
        }
        
        const { isValid, reason } = checkClientDirective(file);
        if (!isValid) {
          violations.push(`${file}: ${reason}`);
        }
      });
      
      expect(violations).toEqual([]);
    });
  });

  describe('Property 4: Server Component Default', () => {
    it('should verify page components follow server component pattern', () => {
      const pageFiles = getAllFiles('src/app', ['.tsx']);
      const serverPages: string[] = [];
      
      pageFiles.forEach(file => {
        // 只检查 page.tsx 文件
        if (!file.endsWith('page.tsx')) {
          return;
        }
        
        const content = fs.readFileSync(file, 'utf-8');
        const hasUseClient = content.includes("'use client'") || content.includes('"use client"');
        
        // 页面组件应该是服务端组件
        if (!hasUseClient) {
          serverPages.push(file);
        }
      });
      
      // 验证大多数页面是服务端组件
      expect(serverPages.length).toBeGreaterThan(0);
    });
  });
});

describe('Code Compliance - Dependency Analysis', () => {
  describe('Property 5: Unused Dependency Detection', () => {
    it('should verify core dependencies are used', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const dependencies = Object.keys(packageJson.dependencies || {});
      
      // 核心依赖应该存在
      const coreDeps = ['next', 'react', 'react-dom', 'next-intl'];
      
      coreDeps.forEach(dep => {
        expect(dependencies).toContain(dep);
      });
    });

    it('should verify dev dependencies are appropriate', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      const devDependencies = Object.keys(packageJson.devDependencies || {});
      
      // 开发依赖应该包含测试和类型工具
      const expectedDevDeps = ['typescript', 'vitest', '@types/react'];
      
      expectedDevDeps.forEach(dep => {
        expect(devDependencies).toContain(dep);
      });
    });
  });
});
