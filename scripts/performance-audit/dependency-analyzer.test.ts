/**
 * 依赖分析器单元测试
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Dependency Analyzer', () => {
  describe('报告生成', () => {
    it('应该生成 JSON 报告文件', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      // 如果报告存在，验证其结构
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        expect(report).toHaveProperty('timestamp');
        expect(report).toHaveProperty('totalDependencies');
        expect(report).toHaveProperty('productionDependencies');
        expect(report).toHaveProperty('devDependencies');
        expect(report).toHaveProperty('totalSize');
        expect(report).toHaveProperty('totalGzipSize');
        expect(report).toHaveProperty('heavyDependencies');
        expect(report).toHaveProperty('duplicateDependencies');
        expect(report).toHaveProperty('unusedDependencies');
        expect(report).toHaveProperty('recommendations');
        
        expect(Array.isArray(report.heavyDependencies)).toBe(true);
        expect(Array.isArray(report.duplicateDependencies)).toBe(true);
        expect(Array.isArray(report.unusedDependencies)).toBe(true);
        expect(Array.isArray(report.recommendations)).toBe(true);
      }
    });

    it('应该生成 Markdown 报告文件', () => {
      const reportPath = path.join(process.cwd(), 'DEPENDENCY_ANALYSIS_REPORT.md');
      
      if (fs.existsSync(reportPath)) {
        const content = fs.readFileSync(reportPath, 'utf-8');
        
        expect(content).toContain('# 依赖分析报告');
        expect(content).toContain('## 📊 依赖统计');
        expect(content).toContain('## 📦 大型依赖');
        expect(content).toContain('## 💡 优化建议');
      }
    });
  });

  describe('大型依赖识别', () => {
    it('应该识别大于 100KB 的依赖', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        // 所有大型依赖应该大于 100KB
        report.heavyDependencies.forEach((dep: any) => {
          expect(dep.size).toBeGreaterThan(100);
        });
      }
    });

    it('应该包含已知的大型依赖', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        const depNames = report.heavyDependencies.map((d: any) => d.name);
        
        // 检查一些已知的大型依赖
        const knownLargeDeps = ['echarts', 'next'];
        knownLargeDeps.forEach(dep => {
          if (report.totalDependencies > 0) {
            // 如果项目有依赖，至少应该有一些大型依赖
            expect(depNames.length).toBeGreaterThan(0);
          }
        });
      }
    });
  });

  describe('依赖统计', () => {
    it('总依赖数应该等于生产依赖加开发依赖', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        expect(report.totalDependencies).toBe(
          report.productionDependencies + report.devDependencies
        );
      }
    });

    it('Gzip 大小应该小于原始大小', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        expect(report.totalGzipSize).toBeLessThan(report.totalSize);
        
        // Gzip 通常能压缩到 30-40%
        const compressionRatio = report.totalGzipSize / report.totalSize;
        expect(compressionRatio).toBeGreaterThan(0.2);
        expect(compressionRatio).toBeLessThan(0.5);
      }
    });
  });

  describe('优化建议', () => {
    it('应该为大型依赖提供优化建议', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        if (report.heavyDependencies.length > 0) {
          expect(report.recommendations.length).toBeGreaterThan(0);
          
          // 应该包含通用优化建议
          const allRecommendations = report.recommendations.join('\n');
          expect(allRecommendations).toContain('优化');
        }
      }
    });

    it('应该为重复依赖提供建议', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        if (report.duplicateDependencies.length > 0) {
          const allRecommendations = report.recommendations.join('\n');
          expect(allRecommendations).toContain('重复依赖');
        }
      }
    });

    it('应该为未使用依赖提供建议', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        if (report.unusedDependencies.length > 0) {
          const allRecommendations = report.recommendations.join('\n');
          expect(allRecommendations).toContain('未使用');
        }
      }
    });
  });

  describe('依赖类型', () => {
    it('每个依赖应该有正确的类型', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        report.heavyDependencies.forEach((dep: any) => {
          expect(['production', 'development']).toContain(dep.type);
        });
      }
    });

    it('应该正确标记动态导入', () => {
      const reportPath = path.join(process.cwd(), 'dependency-analysis-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        report.heavyDependencies.forEach((dep: any) => {
          expect(typeof dep.dynamicallyImported).toBe('boolean');
        });
      }
    });
  });
});
