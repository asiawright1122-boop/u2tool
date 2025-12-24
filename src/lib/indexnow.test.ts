/**
 * IndexNow 属性测试
 * Property 7: IndexNow Batch Efficiency
 * 验证批量 URL 提交的效率
 */

import { describe, it, expect } from 'vitest';
import {
  isValidIndexNowKey,
  generateIndexNowKey,
  generateToolUrls,
} from './indexnow';

// 测试用的模拟工具
const mockTools = [
  { slug: 'json-formatter' },
  { slug: 'base64' },
  { slug: 'uuid-generator' },
];

const locales = ['en', 'zh', 'es'];

describe('IndexNow - Property Tests', () => {
  describe('Property 7: IndexNow Batch Efficiency', () => {
    // 测试 URL 生成
    it('should generate correct URLs for all tools and locales', () => {
      const urls = generateToolUrls(mockTools, locales);
      
      // 应该生成 tools * locales 个 URL
      expect(urls.length).toBe(mockTools.length * locales.length);
      
      // 验证 URL 格式
      for (const url of urls) {
        expect(url).toMatch(/^https:\/\/.+\/\w+\/tools\/[\w-]+$/);
      }
    });

    // 测试所有 locale 都被覆盖
    it('should cover all locales for each tool', () => {
      const urls = generateToolUrls(mockTools, locales);
      
      for (const tool of mockTools) {
        for (const locale of locales) {
          const expectedUrl = expect.stringContaining(`/${locale}/tools/${tool.slug}`);
          expect(urls).toContainEqual(expectedUrl);
        }
      }
    });

    // 测试空输入处理
    it('should handle empty tools array', () => {
      const urls = generateToolUrls([], locales);
      expect(urls).toHaveLength(0);
    });

    it('should handle empty locales array', () => {
      const urls = generateToolUrls(mockTools, []);
      expect(urls).toHaveLength(0);
    });
  });

  describe('isValidIndexNowKey', () => {
    // 测试有效的 key
    it('should accept valid hexadecimal keys', () => {
      expect(isValidIndexNowKey('abcdef12')).toBe(true);
      expect(isValidIndexNowKey('ABCDEF12')).toBe(true);
      expect(isValidIndexNowKey('a1b2c3d4e5f6a7b8')).toBe(true);
      expect(isValidIndexNowKey('0123456789abcdef0123456789abcdef')).toBe(true);
    });

    // 测试无效的 key
    it('should reject invalid keys', () => {
      // 太短
      expect(isValidIndexNowKey('abc')).toBe(false);
      expect(isValidIndexNowKey('1234567')).toBe(false);
      
      // 包含非十六进制字符
      expect(isValidIndexNowKey('abcdefgh')).toBe(false);
      expect(isValidIndexNowKey('12345678!')).toBe(false);
      
      // 空字符串
      expect(isValidIndexNowKey('')).toBe(false);
    });

    // 测试边界情况
    it('should handle boundary cases', () => {
      // 最小长度 (8)
      expect(isValidIndexNowKey('12345678')).toBe(true);
      expect(isValidIndexNowKey('1234567')).toBe(false);
      
      // 128 字符（最大长度）
      const maxKey = 'a'.repeat(128);
      expect(isValidIndexNowKey(maxKey)).toBe(true);
    });
  });

  describe('generateIndexNowKey', () => {
    // 测试生成的 key 格式
    it('should generate valid 32-character hexadecimal key', () => {
      const key = generateIndexNowKey();
      
      expect(key).toHaveLength(32);
      expect(isValidIndexNowKey(key)).toBe(true);
    });

    // 测试唯一性
    it('should generate unique keys', () => {
      const keys = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        keys.add(generateIndexNowKey());
      }
      
      // 所有生成的 key 应该是唯一的
      expect(keys.size).toBe(100);
    });
  });
});
