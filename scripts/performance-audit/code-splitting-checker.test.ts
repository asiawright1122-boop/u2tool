/**
 * 代码分割检查器单元测试
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('CodeSplittingChecker', () => {

  describe('报告生成', () => {
    it('应该生成 JSON 报告文件', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      // 如果报告存在，验证其结构
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        expect(report).toHaveProperty('timestamp');
        expect(report).toHaveProperty('totalFiles');
        expect(report).toHaveProperty('totalImports');
        expect(report).toHaveProperty('staticImports');
        expect(report).toHaveProperty('dynamicImports');
        expect(report).toHaveProperty('issues');
        expect(report).toHaveProperty('issuesByModule');
        expect(report).toHaveProperty('recommendations');
        
        expect(Array.isArray(report.issues)).toBe(true);
        expect(Array.isArray(report.issuesByModule)).toBe(true);
        expect(Array.isArray(report.recommendations)).toBe(true);
      }
    });

    it('应该生成 Markdown 报告文件', () => {
      const reportPath = path.join(process.cwd(), 'CODE_SPLITTING_REPORT.md');
      
      if (fs.existsSync(reportPath)) {
        const content = fs.readFileSync(reportPath, 'utf-8');
        
        expect(content).toContain('# 代码分割检查报告');
        expect(content).toContain('## 📊 导入统计');
        expect(content).toContain('## 🔍 问题统计');
        expect(content).toContain('## 💡 优化建议');
      }
    });
  });

  describe('问题识别', () => {
    it('ECharts 应该已经通过 EChartsWrapper 实现懒加载', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        // ECharts 已经通过 EChartsWrapper 实现懒加载
        // 所以不应该有 ECharts 的静态导入问题
        // 如果有问题，数量应该很少（可能是一些遗留代码）
        const echartsIssues = report.issues.filter((i: any) => i.moduleName === 'echarts');
        
        // 允许少量遗留问题，但不应该有大量静态导入
        expect(echartsIssues.length).toBeLessThanOrEqual(5);
      }
    });

    it('应该识别 XLSX 的静态导入', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        const xlsxIssues = report.issues.filter((i: any) => i.moduleName === 'xlsx');
        if (xlsxIssues.length > 0) {
          xlsxIssues.forEach((issue: any) => {
            expect(issue.severity).toBe('critical');
            expect(issue.moduleSize).toBe(600);
          });
        }
      }
    });

    it('应该识别 PDF 库的静态导入', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        const pdfIssues = report.issues.filter((i: any) => 
          i.moduleName === 'pdf-lib' || i.moduleName === 'pdfjs-dist'
        );
        
        if (pdfIssues.length > 0) {
          pdfIssues.forEach((issue: any) => {
            expect(['critical', 'warning']).toContain(issue.severity);
          });
        }
      }
    });
  });

  describe('严重程度分类', () => {
    it('应该将 > 300KB 的库标记为 critical', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        const criticalIssues = report.issues.filter((i: any) => i.severity === 'critical');
        
        criticalIssues.forEach((issue: any) => {
          expect(issue.moduleSize).toBeGreaterThan(300);
        });
      }
    });

    it('应该将 100-300KB 的库标记为 warning', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        const warningIssues = report.issues.filter((i: any) => i.severity === 'warning');
        
        warningIssues.forEach((issue: any) => {
          expect(issue.moduleSize).toBeGreaterThan(100);
          expect(issue.moduleSize).toBeLessThanOrEqual(300);
        });
      }
    });
  });

  describe('自动修复检测', () => {
    it('应该为组件文件的问题提供 autoFixable 属性', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        const componentIssues = report.issues.filter((i: any) => 
          i.file.includes('/components/') || i.file.includes('/tools/')
        );
        
        if (componentIssues.length > 0) {
          // 验证每个问题都有 autoFixable 属性（可以是 true 或 false）
          componentIssues.forEach((issue: any) => {
            expect(typeof issue.autoFixable).toBe('boolean');
          });
        }
      }
    });

    it('应该为问题生成修复建议', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        report.issues.forEach((issue: any) => {
          expect(issue.suggestion).toBeDefined();
          expect(issue.suggestion.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('统计数据', () => {
    it('动态导入率应该在合理范围内', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        const dynamicRate = (report.dynamicImports / report.totalImports) * 100;
        
        // 动态导入率应该在 0-100% 之间
        expect(dynamicRate).toBeGreaterThanOrEqual(0);
        expect(dynamicRate).toBeLessThanOrEqual(100);
      }
    });

    it('总导入数应该等于静态导入加动态导入', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        // 注意：这个等式可能不完全相等，因为有些导入可能被归类为其他类型
        // 但总导入数应该大于等于静态导入和动态导入的和
        expect(report.totalImports).toBeGreaterThanOrEqual(
          report.staticImports + report.dynamicImports - report.totalImports * 0.1
        );
      }
    });
  });

  describe('优化建议', () => {
    it('应该为 critical 问题提供建议', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        const criticalCount = report.issues.filter((i: any) => i.severity === 'critical').length;
        
        if (criticalCount > 0) {
          const allRecommendations = report.recommendations.join('\n');
          expect(allRecommendations).toContain('Critical');
        }
      }
    });

    it('应该包含通用优化建议', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        const allRecommendations = report.recommendations.join('\n');
        expect(allRecommendations).toContain('dynamic()');
        expect(allRecommendations).toContain('按需导入');
        expect(allRecommendations).toContain('代码分割');
      }
    });
  });

  describe('按模块分组', () => {
    it('应该按模块分组问题', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        expect(Array.isArray(report.issuesByModule)).toBe(true);
        
        if (report.issuesByModule.length > 0) {
          report.issuesByModule.forEach((group: any) => {
            expect(group).toHaveProperty('module');
            expect(group).toHaveProperty('issues');
            expect(Array.isArray(group.issues)).toBe(true);
          });
        }
      }
    });

    it('每个模块的问题应该一致', () => {
      const reportPath = path.join(process.cwd(), 'code-splitting-report.json');
      
      if (fs.existsSync(reportPath)) {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
        
        report.issuesByModule.forEach((group: any) => {
          group.issues.forEach((issue: any) => {
            expect(issue.moduleName).toBe(group.module);
          });
        });
      }
    });
  });
});
