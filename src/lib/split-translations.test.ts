/**
 * 迁移脚本属性测试
 * 
 * Property 5: Migration round-trip consistency
 * 对于任何原始翻译文件，拆分后再合并应该产生等价的内容
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// 测试用的临时目录
const TEST_DIR = path.join(process.cwd(), 'test-translations-temp');

// 清理测试目录
function cleanupTestDir() {
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true });
  }
}

// 创建测试目录
function setupTestDir() {
  cleanupTestDir();
  fs.mkdirSync(TEST_DIR, { recursive: true });
}

// 判断是否是工具翻译
function isToolTranslation(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return 'name' in obj && 'description' in obj;
}

// 基础 UI 键
const TOOLS_BASE_KEYS = [
  'input', 'output', 'copy', 'clear', 'generate', 'convert', 'format',
  'copied', 'paste', 'minify', 'beautify', 'encode', 'decode', 'download',
  'result', 'error', 'errorEncoding', 'errorDecoding', 'errorInvalidInput',
];

// 提取基础翻译
function extractToolsBase(tools: Record<string, unknown>): Record<string, unknown> {
  const base: Record<string, unknown> = {};
  for (const key of Object.keys(tools)) {
    if (TOOLS_BASE_KEYS.includes(key) || !isToolTranslation(tools[key])) {
      base[key] = tools[key];
    }
  }
  return base;
}

// 提取工具翻译
function extractToolTranslations(tools: Record<string, unknown>): Map<string, Record<string, unknown>> {
  const toolTranslations = new Map<string, Record<string, unknown>>();
  for (const key of Object.keys(tools)) {
    if (isToolTranslation(tools[key]) && !TOOLS_BASE_KEYS.includes(key)) {
      toolTranslations.set(key, tools[key] as Record<string, unknown>);
    }
  }
  return toolTranslations;
}

// 拆分翻译
function splitTranslations(original: Record<string, unknown>): {
  base: Record<string, unknown>;
  tools: Map<string, Record<string, unknown>>;
} {
  const base: Record<string, unknown> = {};
  
  // 复制非 tools 的键
  for (const key of Object.keys(original)) {
    if (key !== 'tools') {
      base[key] = original[key];
    }
  }
  
  // 处理 tools
  let toolTranslations = new Map<string, Record<string, unknown>>();
  if ('tools' in original && typeof original.tools === 'object') {
    const toolsObj = original.tools as Record<string, unknown>;
    base.tools = extractToolsBase(toolsObj);
    toolTranslations = extractToolTranslations(toolsObj);
  }
  
  return { base, tools: toolTranslations };
}

// 合并翻译
function mergeTranslations(
  base: Record<string, unknown>,
  tools: Map<string, Record<string, unknown>>
): Record<string, unknown> {
  const merged = { ...base };
  
  if (tools.size > 0) {
    const toolsObj = (merged.tools || {}) as Record<string, unknown>;
    for (const [slug, data] of tools) {
      toolsObj[slug] = data;
    }
    merged.tools = toolsObj;
  }
  
  return merged;
}

// 生成随机工具翻译
const toolTranslationArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  description: fc.string({ minLength: 1, maxLength: 200 }),
  seo_title: fc.option(fc.string({ minLength: 1, maxLength: 60 })),
  seo_description: fc.option(fc.string({ minLength: 1, maxLength: 160 })),
});

// 生成随机工具 slug
const toolSlugArb = fc.stringMatching(/^[a-z][a-z0-9-]{2,30}$/);

// 生成随机翻译对象
const translationArb = fc.record({
  site: fc.record({
    name: fc.string({ minLength: 1, maxLength: 20 }),
    tagline: fc.string({ minLength: 1, maxLength: 100 }),
  }),
  categories: fc.record({
    text: fc.string({ minLength: 1, maxLength: 30 }),
    encoding: fc.string({ minLength: 1, maxLength: 30 }),
  }),
  nav: fc.record({
    home: fc.string({ minLength: 1, maxLength: 20 }),
    tools: fc.string({ minLength: 1, maxLength: 20 }),
  }),
  tools: fc.record({
    input: fc.string({ minLength: 1, maxLength: 20 }),
    output: fc.string({ minLength: 1, maxLength: 20 }),
    copy: fc.string({ minLength: 1, maxLength: 20 }),
  }),
});

describe('Translation Migration Properties', () => {
  beforeAll(() => {
    setupTestDir();
  });

  afterAll(() => {
    cleanupTestDir();
  });

  /**
   * Property 5: Migration round-trip consistency
   * 拆分后再合并应该保留所有工具翻译
   */
  it('should preserve all tool translations after split and merge (Property 5)', () => {
    fc.assert(
      fc.property(
        fc.array(fc.tuple(toolSlugArb, toolTranslationArb), { minLength: 1, maxLength: 10 }),
        (toolEntries) => {
          // 构建原始翻译对象
          const original: Record<string, unknown> = {
            site: { name: 'Test Site' },
            tools: {
              input: 'Input',
              output: 'Output',
            } as Record<string, unknown>,
          };
          
          // 添加工具翻译
          const toolsObj = original.tools as Record<string, unknown>;
          for (const [slug, data] of toolEntries) {
            toolsObj[slug] = data;
          }
          
          // 拆分
          const { base, tools } = splitTranslations(original);
          
          // 合并
          const merged = mergeTranslations(base, tools);
          
          // 验证：所有工具翻译都应该存在
          const mergedTools = merged.tools as Record<string, unknown>;
          for (const [slug, expectedData] of toolEntries) {
            expect(mergedTools[slug]).toBeDefined();
            const actualData = mergedTools[slug] as Record<string, unknown>;
            expect(actualData.name).toBe((expectedData as Record<string, unknown>).name);
            expect(actualData.description).toBe((expectedData as Record<string, unknown>).description);
          }
          
          // 验证：工具数量一致
          const originalToolCount = toolEntries.length;
          const mergedToolCount = Object.keys(mergedTools).filter(k => isToolTranslation(mergedTools[k])).length;
          expect(mergedToolCount).toBe(originalToolCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Base translations are preserved
   * 基础翻译应该完整保留
   */
  it('should preserve base translations after split', () => {
    fc.assert(
      fc.property(translationArb, (original) => {
        const { base } = splitTranslations(original);
        
        // 验证基础键存在
        expect(base.site).toEqual(original.site);
        expect(base.categories).toEqual(original.categories);
        expect(base.nav).toEqual(original.nav);
        
        // 验证 tools 中的基础 UI 键存在
        const baseTools = base.tools as Record<string, unknown>;
        const originalTools = original.tools as Record<string, unknown>;
        expect(baseTools.input).toBe(originalTools.input);
        expect(baseTools.output).toBe(originalTools.output);
        expect(baseTools.copy).toBe(originalTools.copy);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Tool translations are correctly extracted
   * 工具翻译应该被正确提取
   */
  it('should correctly identify and extract tool translations', () => {
    fc.assert(
      fc.property(
        fc.array(fc.tuple(toolSlugArb, toolTranslationArb), { minLength: 0, maxLength: 5 }),
        (toolEntries) => {
          const tools: Record<string, unknown> = {
            input: 'Input',
            output: 'Output',
          };
          
          for (const [slug, data] of toolEntries) {
            tools[slug] = data;
          }
          
          const extracted = extractToolTranslations(tools);
          
          // 验证提取的数量正确
          expect(extracted.size).toBe(toolEntries.length);
          
          // 验证每个工具都被提取
          for (const [slug] of toolEntries) {
            expect(extracted.has(slug)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Real Translation File Validation', () => {
  it('should validate English translation file structure', () => {
    const enPath = path.join(process.cwd(), 'src', 'messages', 'en.json');
    
    if (!fs.existsSync(enPath)) {
      console.log('Skipping: en.json not found');
      return;
    }
    
    const content = fs.readFileSync(enPath, 'utf-8');
    const translations = JSON.parse(content);
    
    // 验证基础结构
    expect(translations.site).toBeDefined();
    expect(translations.categories).toBeDefined();
    expect(translations.nav).toBeDefined();
    expect(translations.tools).toBeDefined();
    
    // 验证 tools 中有工具翻译
    const tools = translations.tools as Record<string, unknown>;
    const toolCount = Object.keys(tools).filter(k => isToolTranslation(tools[k])).length;
    
    console.log(`Found ${toolCount} tool translations in en.json`);
    expect(toolCount).toBeGreaterThan(0);
  });
});
