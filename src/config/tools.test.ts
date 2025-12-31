import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { categories, tools, ToolCategory } from './tools';

// Import all language files
import en from '../messages/en.json';
import zh from '../messages/zh.json';
import es from '../messages/es.json';
import pt from '../messages/pt.json';
import ja from '../messages/ja.json';

const languageFiles = { en, zh, es, pt, ja };
const _languageNames = Object.keys(languageFiles);

/**
 * **Feature: add-new-tools, Property 1: 分类翻译完整性**
 * *For any* 新增分类，该分类在所有 5 个语言文件中都应该有对应的翻译键
 * **Validates: Requirements 1.2, 2.3, 3.3, 4.3, 5.3**
 */
describe('Property 1: Category Translation Completeness', () => {
  it('all categories should have translations in all language files', () => {
    const categoryIds = categories.map(c => c.id);
    
    fc.assert(
      fc.property(
        fc.constantFrom(...categoryIds),
        (categoryId: ToolCategory) => {
          for (const [lang, messages] of Object.entries(languageFiles)) {
            const categoryTranslations = (messages as { categories: Record<string, string> }).categories;
            expect(
              categoryTranslations[categoryId],
              `Category "${categoryId}" missing translation in ${lang}.json`
            ).toBeDefined();
            expect(
              typeof categoryTranslations[categoryId],
              `Category "${categoryId}" translation in ${lang}.json should be a string`
            ).toBe('string');
            expect(
              categoryTranslations[categoryId].length,
              `Category "${categoryId}" translation in ${lang}.json should not be empty`
            ).toBeGreaterThan(0);
          }
          return true;
        }
      ),
      { numRuns: categories.length }
    );
  });

  it('should have all 10 categories defined', () => {
    const expectedCategories: ToolCategory[] = [
      'text', 'encoding', 'generators', 'converters', 'development',
      'security', 'network', 'image', 'math', 'charts'
    ];
    
    expect(categories.map(c => c.id).sort()).toEqual(expectedCategories.sort());
  });
});

/**
 * **Feature: add-new-tools, Property 3: 工具分类正确性**
 * *For any* 工具配置，其 category 属性必须是 ToolCategory 类型中定义的有效值
 * **Validates: Requirements 2.2, 3.2, 4.2, 5.2**
 */
describe('Property 3: Tool Category Validity', () => {
  it('all tools should have valid category values', () => {
    const validCategories = categories.map(c => c.id);
    
    fc.assert(
      fc.property(
        fc.constantFrom(...tools),
        (tool) => {
          expect(
            validCategories,
            `Tool "${tool.slug}" has invalid category "${tool.category}"`
          ).toContain(tool.category);
          return true;
        }
      ),
      { numRuns: tools.length }
    );
  });
});

// Verify specific tool migrations
describe('Tool Migration Verification', () => {
  it('security tools should be in security category', () => {
    const securityTools = ['text-encryption', 'hash-generator', 'file-hash', 'password-generator'];
    for (const slug of securityTools) {
      const tool = tools.find(t => t.slug === slug);
      expect(tool?.category, `${slug} should be in security category`).toBe('security');
    }
  });

  it('network tools should be in network category', () => {
    const networkTools = ['ip-lookup', 'url-encoder', 'url-parser', 'http-status'];
    for (const slug of networkTools) {
      const tool = tools.find(t => t.slug === slug);
      expect(tool?.category, `${slug} should be in network category`).toBe('network');
    }
  });

  it('image tools should be in image category', () => {
    const imageTools = ['image-to-base64', 'placeholder-image', 'qr-generator', 'barcode-generator', 'svg-optimizer'];
    for (const slug of imageTools) {
      const tool = tools.find(t => t.slug === slug);
      expect(tool?.category, `${slug} should be in image category`).toBe('image');
    }
  });

  it('math tools should be in math category', () => {
    const mathTools = ['number-base-converter', 'aspect-ratio', 'chmod-calculator'];
    for (const slug of mathTools) {
      const tool = tools.find(t => t.slug === slug);
      expect(tool?.category, `${slug} should be in math category`).toBe('math');
    }
  });
});


/**
 * **Feature: add-popular-tools, Property 10: Tool Registration Completeness**
 * *For any* tool in tools.ts, it should have:
 * 1. A unique kebab-case slug
 * 2. A valid category
 * 3. A component name that matches the expected pattern
 * **Validates: Requirements 9.1, 9.2, 9.3**
 */
describe('Property 10: Tool Registration Completeness', () => {
  it('all tools should have unique slugs', () => {
    const slugs = tools.map(t => t.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size, 'Duplicate tool slugs found').toBe(slugs.length);
  });

  it('all tool slugs should be kebab-case', () => {
    const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    
    fc.assert(
      fc.property(
        fc.constantFrom(...tools),
        (tool) => {
          expect(
            kebabCaseRegex.test(tool.slug),
            `Tool slug "${tool.slug}" is not in kebab-case format`
          ).toBe(true);
          return true;
        }
      ),
      { numRuns: tools.length }
    );
  });

  it('all tools should have a component name', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...tools),
        (tool) => {
          expect(
            tool.component,
            `Tool "${tool.slug}" is missing component name`
          ).toBeDefined();
          expect(
            tool.component.length,
            `Tool "${tool.slug}" has empty component name`
          ).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: tools.length }
    );
  });

  it('all tools should have an icon', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...tools),
        (tool) => {
          expect(
            tool.icon,
            `Tool "${tool.slug}" is missing icon`
          ).toBeDefined();
          expect(
            tool.icon.length,
            `Tool "${tool.slug}" has empty icon`
          ).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: tools.length }
    );
  });

  // Verify the 7 new tools are registered
  it('new popular tools should be registered', () => {
    const newToolSlugs = [
      'env-parser',
      'json-schema-generator',
      'time-calculator',
      'batch-timestamp-converter',
      'regex-visualizer',
      'crontab-calendar',
      'fake-data-generator'
    ];
    
    for (const slug of newToolSlugs) {
      const tool = tools.find(t => t.slug === slug);
      expect(tool, `Tool "${slug}" should be registered in tools.ts`).toBeDefined();
      expect(tool?.popular, `Tool "${slug}" should be marked as popular`).toBe(true);
    }
  });
});
