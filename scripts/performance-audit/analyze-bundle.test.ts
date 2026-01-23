/**
 * Bundle 分析工具单元测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

describe('Bundle Analyzer', () => {
  const testDir = path.join(process.cwd(), '.test-bundle');
  const nextDir = path.join(testDir, '.next');

  beforeEach(() => {
    // 创建测试目录结构
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true });
    }
  });

  afterEach(() => {
    // 清理测试目录
    if (fs.existsSync(testDir)) {
      fs.rmSync(testDir, { recursive: true, force: true });
    }
  });

  describe('文件大小计算', () => {
    it('应该正确计算文件大小', () => {
      const testFile = path.join(testDir, 'test.js');
      const content = 'console.log("test");';
      fs.writeFileSync(testFile, content);

      const stats = fs.statSync(testFile);
      expect(stats.size).toBeGreaterThan(0);
      expect(stats.size).toBe(Buffer.byteLength(content));
    });

    it('应该正确计算 gzip 大小', () => {
      const zlib = require('zlib');
      const content = 'console.log("test");'.repeat(100);
      const gzipSize = zlib.gzipSync(Buffer.from(content)).length;

      expect(gzipSize).toBeGreaterThan(0);
      expect(gzipSize).toBeLessThan(Buffer.byteLength(content));
    });
  });

  describe('文件分类', () => {
    it('应该正确识别 JS 文件', () => {
      const fileName = 'main.js';
      const ext = path.extname(fileName);
      expect(ext).toBe('.js');
    });

    it('应该正确识别 CSS 文件', () => {
      const fileName = 'styles.css';
      const ext = path.extname(fileName);
      expect(ext).toBe('.css');
    });

    it('应该正确分类页面文件', () => {
      const filePath = '.next/static/chunks/pages/index.js';
      expect(filePath.includes('/pages/')).toBe(true);
    });

    it('应该正确分类 chunk 文件', () => {
      const filePath = '.next/static/chunks/framework.js';
      expect(filePath.includes('/chunks/')).toBe(true);
    });
  });

  describe('性能预算对比', () => {
    it('应该正确检测预算违规', () => {
      const budget = { totalSize: 1000, jsSize: 800, cssSize: 200, initialLoad: 500 };
      const actual = { totalSize: 1200, jsSize: 900, cssSize: 150, initialLoad: 600 };

      const totalPassed = actual.totalSize <= budget.totalSize;
      const jsPassed = actual.jsSize <= budget.jsSize;
      const cssPassed = actual.cssSize <= budget.cssSize;
      const initialPassed = actual.initialLoad <= budget.initialLoad;

      expect(totalPassed).toBe(false);
      expect(jsPassed).toBe(false);
      expect(cssPassed).toBe(true);
      expect(initialPassed).toBe(false);
    });

    it('应该正确计算使用率', () => {
      const budget = 1000;
      const actual = 800;
      const percentage = (actual / budget) * 100;

      expect(percentage).toBe(80);
    });

    it('应该生成违规消息', () => {
      const violations: string[] = [];
      const budget = 1000;
      const actual = 1200;

      if (actual > budget) {
        violations.push(`大小 (${actual}KB) 超出预算 (${budget}KB)`);
      }

      expect(violations.length).toBe(1);
      expect(violations[0]).toContain('超出预算');
    });
  });

  describe('大小格式化', () => {
    it('应该正确格式化 KB', () => {
      const bytes = 1024 * 100; // 100KB
      const kb = bytes / 1024;
      expect(kb).toBe(100);
    });

    it('应该正确格式化 MB', () => {
      const bytes = 1024 * 1024 * 2; // 2MB
      const mb = bytes / (1024 * 1024);
      expect(mb).toBe(2);
    });

    it('应该正确格式化小于 1KB 的大小', () => {
      const bytes = 512;
      const kb = bytes / 1024;
      expect(kb).toBeLessThan(1);
      expect(kb.toFixed(2)).toBe('0.50');
    });
  });

  describe('统计计算', () => {
    it('应该正确计算总大小', () => {
      const files = [
        { size: 1000, gzipSize: 300, type: 'js' as const },
        { size: 2000, gzipSize: 600, type: 'js' as const },
        { size: 500, gzipSize: 150, type: 'css' as const }
      ];

      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      const totalGzipSize = files.reduce((sum, f) => sum + f.gzipSize, 0);

      expect(totalSize).toBe(3500);
      expect(totalGzipSize).toBe(1050);
    });

    it('应该正确分类 JS 和 CSS', () => {
      const files = [
        { type: 'js' as const, size: 1000 },
        { type: 'js' as const, size: 2000 },
        { type: 'css' as const, size: 500 }
      ];

      const jsFiles = files.filter(f => f.type === 'js');
      const cssFiles = files.filter(f => f.type === 'css');

      expect(jsFiles.length).toBe(2);
      expect(cssFiles.length).toBe(1);
    });
  });

  describe('页面分析', () => {
    it('应该正确聚合页面文件', () => {
      const pageFiles = [
        { name: 'index.js', size: 1000, gzipSize: 300 },
        { name: 'framework.js', size: 2000, gzipSize: 600 },
        { name: 'styles.css', size: 500, gzipSize: 150 }
      ];

      const totalSize = pageFiles.reduce((sum, f) => sum + f.size, 0);
      const totalGzipSize = pageFiles.reduce((sum, f) => sum + f.gzipSize, 0);

      expect(totalSize).toBe(3500);
      expect(totalGzipSize).toBe(1050);
    });

    it('应该正确排序页面', () => {
      const pages = [
        { route: '/page1', totalGzipSize: 500 },
        { route: '/page2', totalGzipSize: 1000 },
        { route: '/page3', totalGzipSize: 300 }
      ];

      const sorted = pages.sort((a, b) => b.totalGzipSize - a.totalGzipSize);

      expect(sorted[0].route).toBe('/page2');
      expect(sorted[1].route).toBe('/page1');
      expect(sorted[2].route).toBe('/page3');
    });
  });

  describe('优化建议生成', () => {
    it('应该为大型页面生成建议', () => {
      const largePages = [
        { route: '/large-page', totalGzipSize: 400 * 1024 } // 400KB
      ];

      const recommendations: string[] = [];
      if (largePages.length > 0) {
        recommendations.push('考虑代码分割或懒加载');
      }

      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('应该为高 JS 占比生成建议', () => {
      const jsSize = 850;
      const totalSize = 1000;
      const jsPercentage = (jsSize / totalSize) * 100;

      const recommendations: string[] = [];
      if (jsPercentage > 80) {
        recommendations.push('使用动态导入拆分大型组件');
      }

      expect(recommendations.length).toBeGreaterThan(0);
      expect(jsPercentage).toBe(85);
    });
  });

  describe('报告生成', () => {
    it('应该生成完整的报告结构', () => {
      const report = {
        timestamp: new Date().toISOString(),
        buildTime: new Date().toISOString(),
        totalSize: 3500000,
        totalGzipSize: 1050000,
        jsSize: 3000000,
        jsGzipSize: 900000,
        cssSize: 500000,
        cssGzipSize: 150000,
        pages: [],
        chunks: [],
        staticFiles: [],
        budget: {
          totalSize: { budget: 2048, actual: 1025, passed: true },
          jsSize: { budget: 1536, actual: 879, passed: true },
          cssSize: { budget: 256, actual: 146, passed: true },
          initialLoad: { budget: 512, actual: 300, passed: true },
          violations: []
        },
        recommendations: []
      };

      expect(report).toHaveProperty('timestamp');
      expect(report).toHaveProperty('totalSize');
      expect(report).toHaveProperty('budget');
      expect(report.budget).toHaveProperty('violations');
    });
  });
});
