/**
 * 移动端优化检查模块属性测试
 * 使用 fast-check 进行属性测试
 * Feature: seo-audit-ai-safe
 * Property 4: Mobile Optimization
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  checkTouchTargetSize,
  checkFontSize,
  checkInputTypes,
  checkViewport,
  runMobileCheck,
  validateTailwindClasses,
  generateMobileSuggestions,
  MOBILE_CONFIG,
  type ElementInfo,
  type MobileCheckResult,
} from './mobile-checker';

describe('Mobile Checker - Property Tests', () => {
  describe('Property 4: Mobile Optimization', () => {
    // 属性测试：触摸目标检查结果始终有效
    it('touch target check should always return valid structure', () => {
      fc.assert(
        fc.property(
          fc.record({
            tagName: fc.string(),
            computedWidth: fc.option(fc.integer({ min: 0, max: 500 }), { nil: undefined }),
            computedHeight: fc.option(fc.integer({ min: 0, max: 500 }), { nil: undefined }),
          }),
          (element) => {
            const result = checkTouchTargetSize(element as ElementInfo);
            return (
              typeof result.passed === 'boolean' &&
              Array.isArray(result.issues)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：大于等于 44px 的元素应该通过
    it('elements >= 44px should pass touch target check', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: MOBILE_CONFIG.minTouchTargetSize, max: 200 }),
          fc.integer({ min: MOBILE_CONFIG.minTouchTargetSize, max: 200 }),
          (width, height) => {
            const element: ElementInfo = {
              tagName: 'button',
              computedWidth: width,
              computedHeight: height,
            };
            const result = checkTouchTargetSize(element);
            return result.passed;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：小于 44px 的元素应该失败
    it('elements < 44px should fail touch target check', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: MOBILE_CONFIG.minTouchTargetSize - 1 }),
          fc.integer({ min: 1, max: MOBILE_CONFIG.minTouchTargetSize - 1 }),
          (width, height) => {
            const element: ElementInfo = {
              tagName: 'button',
              computedWidth: width,
              computedHeight: height,
            };
            const result = checkTouchTargetSize(element);
            return !result.passed && result.issues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：字体大小检查结果始终有效
    it('font size check should always return valid structure', () => {
      fc.assert(
        fc.property(
          fc.record({
            tagName: fc.string(),
            styles: fc.option(
              fc.record({
                fontSize: fc.option(fc.oneof(
                  fc.constant('12px'),
                  fc.constant('14px'),
                  fc.constant('16px'),
                  fc.constant('18px'),
                  fc.constant('1rem'),
                  fc.constant('1.5rem')
                ), { nil: undefined }),
              }),
              { nil: undefined }
            ),
          }),
          (element) => {
            const result = checkFontSize(element as ElementInfo);
            return (
              typeof result.passed === 'boolean' &&
              Array.isArray(result.issues)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：大于等于 16px 的字体应该通过
    it('font size >= 16px should pass', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: MOBILE_CONFIG.minBaseFontSize, max: 48 }),
          (fontSize) => {
            const element: ElementInfo = {
              tagName: 'p',
              styles: { fontSize: `${fontSize}px` },
            };
            const result = checkFontSize(element);
            return result.passed;
          }
        ),
        { numRuns: 100 }
      );
    });

    // 属性测试：小于 16px 的字体应该失败
    it('font size < 16px should fail', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 8, max: MOBILE_CONFIG.minBaseFontSize - 1 }),
          (fontSize) => {
            const element: ElementInfo = {
              tagName: 'p',
              styles: { fontSize: `${fontSize}px` },
            };
            const result = checkFontSize(element);
            return !result.passed && result.issues.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Input Types Validation', () => {
    // 属性测试：输入类型检查结果始终有效
    it('input types check should always return valid structure', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              type: fc.option(fc.constantFrom('text', 'email', 'tel', 'number', 'url'), { nil: undefined }),
              name: fc.option(fc.string(), { nil: undefined }),
              placeholder: fc.option(fc.string(), { nil: undefined }),
            }),
            { minLength: 0, maxLength: 10 }
          ),
          (inputs) => {
            const result = checkInputTypes(inputs);
            return (
              typeof result.passed === 'boolean' &&
              Array.isArray(result.issues)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 测试：email 输入应该使用 type="email"
    it('email input should use type="email"', () => {
      const inputs = [{ type: 'text', name: 'email', placeholder: 'Enter email' }];
      const result = checkInputTypes(inputs);
      expect(result.passed).toBe(false);
      expect(result.issues.some(i => i.includes('email'))).toBe(true);
    });

    // 测试：正确的输入类型应该通过
    it('correct input types should pass', () => {
      const inputs = [
        { type: 'email', name: 'email' },
        { type: 'tel', name: 'phone' },
        { type: 'url', name: 'website' },
      ];
      const result = checkInputTypes(inputs);
      expect(result.passed).toBe(true);
    });
  });

  describe('Viewport Validation', () => {
    // 属性测试：视口检查结果始终有效
    it('viewport check should always return valid structure', () => {
      fc.assert(
        fc.property(
          fc.option(fc.string(), { nil: null }),
          (viewportContent) => {
            const result = checkViewport(viewportContent);
            return (
              typeof result.passed === 'boolean' &&
              Array.isArray(result.issues)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 测试：缺少 viewport 应该失败
    it('missing viewport should fail', () => {
      const result = checkViewport(null);
      expect(result.passed).toBe(false);
      expect(result.issues.length).toBeGreaterThan(0);
    });

    // 测试：正确的 viewport 应该通过
    it('correct viewport should pass', () => {
      const result = checkViewport('width=device-width, initial-scale=1');
      expect(result.passed).toBe(true);
    });

    // 测试：禁用缩放应该失败
    it('disabled scaling should fail', () => {
      const result = checkViewport('width=device-width, user-scalable=no');
      expect(result.passed).toBe(false);
      expect(result.issues.some(i => i.includes('scaling'))).toBe(true);
    });
  });

  describe('Full Mobile Check', () => {
    // 属性测试：完整检查结果始终有效
    it('full mobile check should always return valid structure', () => {
      fc.assert(
        fc.property(
          fc.record({
            interactiveElements: fc.option(
              fc.array(
                fc.record({
                  tagName: fc.constantFrom('button', 'a', 'input'),
                  computedWidth: fc.option(fc.integer({ min: 20, max: 100 }), { nil: undefined }),
                  computedHeight: fc.option(fc.integer({ min: 20, max: 100 }), { nil: undefined }),
                }),
                { minLength: 0, maxLength: 5 }
              ),
              { nil: undefined }
            ),
            viewportContent: fc.option(fc.string(), { nil: undefined }),
          }),
          (config) => {
            const result = runMobileCheck(config as Parameters<typeof runMobileCheck>[0]);
            return (
              typeof result.isOptimized === 'boolean' &&
              typeof result.score === 'number' &&
              result.score >= 0 &&
              result.score <= 100
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 测试：完全优化的配置应该得到高分
    it('fully optimized config should get high score', () => {
      const result = runMobileCheck({
        interactiveElements: [
          { tagName: 'button', computedWidth: 48, computedHeight: 48 },
        ],
        textElements: [
          { tagName: 'p', styles: { fontSize: '16px' } },
        ],
        inputs: [
          { type: 'email', name: 'email' },
        ],
        viewportContent: 'width=device-width, initial-scale=1',
      });
      
      expect(result.isOptimized).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(75);
    });

    // 测试：未优化的配置应该得到低分
    it('unoptimized config should get low score', () => {
      const result = runMobileCheck({
        interactiveElements: [
          { tagName: 'button', computedWidth: 20, computedHeight: 20 },
        ],
        textElements: [
          { tagName: 'p', styles: { fontSize: '12px' } },
        ],
        inputs: [
          { type: 'text', name: 'email' },
        ],
        viewportContent: null,
      });
      
      expect(result.isOptimized).toBe(false);
      expect(result.score).toBeLessThan(75);
    });
  });

  describe('Tailwind Classes Validation', () => {
    // 属性测试：Tailwind 类验证结果始终有效
    it('tailwind validation should always return valid structure', () => {
      fc.assert(
        fc.property(
          fc.string(),
          (classes) => {
            const result = validateTailwindClasses(classes);
            return (
              typeof result.passed === 'boolean' &&
              Array.isArray(result.issues)
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 测试：响应式类应该被识别
    it('should recognize responsive classes', () => {
      const result = validateTailwindClasses('p-4 sm:p-6 md:p-8');
      expect(result.suggestions?.some(s => s.includes('responsive'))).toBeFalsy();
    });

    // 测试：小文本应该产生建议
    it('should suggest for small text', () => {
      const result = validateTailwindClasses('text-xs text-gray-500');
      expect(result.suggestions?.some(s => s.includes('Small text'))).toBe(true);
    });
  });

  describe('Mobile Suggestions', () => {
    // 属性测试：建议始终是字符串数组
    it('suggestions should always be string array', () => {
      fc.assert(
        fc.property(
          fc.record({
            isOptimized: fc.boolean(),
            score: fc.integer({ min: 0, max: 100 }),
            touchTargetSize: fc.record({
              passed: fc.boolean(),
              issues: fc.array(fc.string()),
            }),
            fontSize: fc.record({
              passed: fc.boolean(),
              issues: fc.array(fc.string()),
            }),
            viewport: fc.record({
              passed: fc.boolean(),
              issues: fc.array(fc.string()),
            }),
            inputTypes: fc.record({
              passed: fc.boolean(),
              issues: fc.array(fc.string()),
            }),
          }),
          (result) => {
            const suggestions = generateMobileSuggestions(result as MobileCheckResult);
            return (
              Array.isArray(suggestions) &&
              suggestions.every(s => typeof s === 'string')
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    // 测试：失败的检查应该产生建议
    it('failed checks should produce suggestions', () => {
      const result: MobileCheckResult = {
        isOptimized: false,
        score: 25,
        touchTargetSize: { passed: false, issues: ['Too small'] },
        fontSize: { passed: false, issues: ['Too small'] },
        viewport: { passed: false, issues: ['Missing'] },
        inputTypes: { passed: false, issues: ['Wrong type'] },
      };
      
      const suggestions = generateMobileSuggestions(result);
      expect(suggestions.length).toBeGreaterThan(0);
    });

    // 测试：完全通过应该只有分数建议
    it('fully passed should have minimal suggestions', () => {
      const result: MobileCheckResult = {
        isOptimized: true,
        score: 100,
        touchTargetSize: { passed: true, issues: [] },
        fontSize: { passed: true, issues: [] },
        viewport: { passed: true, issues: [] },
        inputTypes: { passed: true, issues: [] },
      };
      
      const suggestions = generateMobileSuggestions(result);
      expect(suggestions.length).toBe(0);
    });
  });

  describe('CSS Value Parsing', () => {
    // 测试：px 值应该正确解析
    it('should parse px values correctly', () => {
      const element: ElementInfo = {
        tagName: 'button',
        styles: { width: '48px', height: '48px' },
      };
      const result = checkTouchTargetSize(element);
      expect(result.passed).toBe(true);
    });

    // 测试：rem 值应该正确解析
    it('should parse rem values correctly', () => {
      const element: ElementInfo = {
        tagName: 'p',
        styles: { fontSize: '1rem' }, // 1rem = 16px
      };
      const result = checkFontSize(element);
      expect(result.passed).toBe(true);
    });

    // 测试：小于 1rem 的字体应该失败
    it('should fail for font size less than 1rem', () => {
      const element: ElementInfo = {
        tagName: 'p',
        styles: { fontSize: '0.75rem' }, // 0.75rem = 12px
      };
      const result = checkFontSize(element);
      expect(result.passed).toBe(false);
    });
  });
});
