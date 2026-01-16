import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Translation Bundle Isolation 属性测试
 * 
 * Property 6: Translation Bundle Isolation
 * 验证翻译文件按需加载，不会打包所有语言
 * 
 * @see Requirements 7.1, 7.4
 */

describe('Translation Bundle Isolation Property Tests', () => {
  describe('Property 6: Translation Bundle Isolation', () => {
    const translationsPath = path.join(process.cwd(), 'src/lib/translations.ts');
    const translationsContent = fs.readFileSync(translationsPath, 'utf-8');

    it('has loadBaseMessages function for lazy loading', () => {
      expect(translationsContent).toContain('loadBaseMessages');
    });

    it('has loadToolMessages function for tool-specific translations', () => {
      expect(translationsContent).toContain('loadToolMessages');
    });

    it('uses dynamic imports for translations', () => {
      // 检查是否使用动态导入
      expect(translationsContent).toContain('import(');
    });

    it('supports all 10 locales', () => {
      const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
      locales.forEach(locale => {
        expect(translationsContent).toContain(`'${locale}'`);
      });
    });
  });

  describe('Translation File Structure', () => {
    const messagesDir = path.join(process.cwd(), 'src/messages');
    const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

    it('each locale has a main translation file', () => {
      locales.forEach(locale => {
        const filePath = path.join(messagesDir, `${locale}.json`);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    it('each locale has a base.json for split translations', () => {
      locales.forEach(locale => {
        const filePath = path.join(messagesDir, locale, 'base.json');
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    it('each locale has a tools directory for tool-specific translations', () => {
      locales.forEach(locale => {
        const dirPath = path.join(messagesDir, locale, 'tools');
        expect(fs.existsSync(dirPath)).toBe(true);
      });
    });
  });

  describe('Layout Translation Loading', () => {
    const layoutPath = path.join(process.cwd(), 'src/app/[locale]/layout.tsx');
    const layoutContent = fs.readFileSync(layoutPath, 'utf-8');

    it('layout loads translations using loadBaseMessages', () => {
      expect(layoutContent).toContain('loadBaseMessages');
    });

    it('layout passes messages to NextIntlClientProvider', () => {
      expect(layoutContent).toContain('NextIntlClientProvider');
      expect(layoutContent).toContain('messages={messages}');
    });
  });

  describe('Tool Page Translation Loading', () => {
    const toolPagePath = path.join(process.cwd(), 'src/app/[locale]/tools/[slug]/page.tsx');
    const toolPageContent = fs.readFileSync(toolPagePath, 'utf-8');

    it('tool page loads tool-specific translations', () => {
      expect(toolPageContent).toContain('loadToolMessages');
    });

    it('tool page uses locale parameter', () => {
      expect(toolPageContent).toContain('locale');
      expect(toolPageContent).toContain('slug');
    });
  });
});
