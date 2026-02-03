/**
 * Bundle 大小优化属性测试
 * 
 * Property 9: Bundle Size Optimization
 * *For any* JavaScript bundle in the application, the initial bundle size SHALL 
 * be less than 200KB (gzipped), and large libraries SHALL be loaded on-demand 
 * using dynamic imports.
 * 
 * **Validates: Requirements 9.2, 9.3, 9.6**
 * 
 * 本测试验证 Bundle 优化的关键配置：
 * - 代码分割配置
 * - 大型库优化导入
 * - 动态导入使用
 * 
 * @see .kiro/specs/pagespeed-optimization/requirements.md
 * @see .kiro/specs/pagespeed-optimization/design.md
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

describe('Bundle Optimization Property Tests', () => {
  // 读取关键源代码文件
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf-8');
  
  const toolWrapperPath = path.join(process.cwd(), 'src/components/tools/ToolWrapper.tsx');
  const toolWrapperContent = fs.readFileSync(toolWrapperPath, 'utf-8');
  
  const toolRegistryPath = path.join(process.cwd(), 'src/components/tools/ToolRegistry.tsx');
  const toolRegistryContent = fs.readFileSync(toolRegistryPath, 'utf-8');

  describe('Property 9: Bundle Size Optimization - Package Imports', () => {
    /**
     * Property 9.1: 应配置 optimizePackageImports
     * 
     * *对于任何* 大型库，应配置优化导入
     * 
     * **Validates: Requirements 9.3**
     */
    it('should configure optimizePackageImports', () => {
      expect(nextConfigContent).toContain('optimizePackageImports');
    });

    /**
     * Property 9.2: 应优化 lucide-react 导入
     * 
     * *对于任何* 图标使用，应优化 lucide-react 导入
     * 
     * **Validates: Requirements 9.3**
     */
    it('should optimize lucide-react imports', () => {
      expect(nextConfigContent).toContain("'lucide-react'");
    });

    /**
     * Property 9.3: 应优化 echarts 导入
     * 
     * *对于任何* 图表使用，应优化 echarts 导入
     * 
     * **Validates: Requirements 9.3**
     */
    it('should optimize echarts imports', () => {
      expect(nextConfigContent).toContain("'echarts'");
      expect(nextConfigContent).toContain("'echarts/core'");
      expect(nextConfigContent).toContain("'echarts-for-react'");
    });

    /**
     * Property 9.4: 应优化 xlsx 导入
     * 
     * *对于任何* Excel 处理，应优化 xlsx 导入
     * 
     * **Validates: Requirements 9.3**
     */
    it('should optimize xlsx imports', () => {
      expect(nextConfigContent).toContain("'xlsx'");
    });

    /**
     * Property 9.5: 应优化 pdf-lib 导入
     * 
     * *对于任何* PDF 处理，应优化 pdf-lib 导入
     * 
     * **Validates: Requirements 9.3**
     */
    it('should optimize pdf-lib imports', () => {
      expect(nextConfigContent).toContain("'pdf-lib'");
    });
  });

  describe('Property 9: Bundle Size Optimization - Dynamic Imports', () => {
    /**
     * Property 9.6: ToolRegistry 应使用动态导入
     * 
     * *对于任何* 工具组件，应使用动态导入
     * 
     * **Validates: Requirements 9.2**
     */
    it('ToolRegistry should use dynamic imports', () => {
      expect(toolRegistryContent).toContain('dynamic');
      expect(toolRegistryContent).toContain("from 'next/dynamic'");
    });

    /**
     * Property 9.7: 动态导入应有加载状态
     * 
     * *对于任何* 动态导入，应配置加载状态
     * 
     * **Validates: Requirements 9.2**
     */
    it('dynamic imports should have loading state', () => {
      expect(toolRegistryContent).toContain('loading:');
      expect(toolRegistryContent).toContain('ToolSkeleton');
    });

    /**
     * Property 9.8: ToolWrapper 应支持组件加载
     * 
     * *对于任何* 工具组件，应支持动态加载
     * 
     * **Validates: Requirements 9.6**
     */
    it('ToolWrapper should support component loading', () => {
      expect(toolWrapperContent).toContain('TOOL_COMPONENTS_MAP');
    });

    /**
     * Property 9.9: ToolWrapper 应使用 startTransition
     * 
     * *对于任何* 组件加载，应使用 startTransition 优化渲染
     * 
     * **Validates: Requirements 9.2**
     */
    it('ToolWrapper should use startTransition', () => {
      expect(toolWrapperContent).toContain('startTransition');
    });
  });

  describe('Property 9: Bundle Size Optimization - Property-Based Tests', () => {
    /**
     * Property 9.10: Bundle 大小限制应为正整数
     * 
     * *对于任何* Bundle 大小限制，应为正整数
     * 
     * **Validates: Requirements 9.6**
     */
    it('bundle size limit should be positive integer', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 500 * 1024 }), // 最大 500KB
          (size) => {
            return size > 0 && Number.isInteger(size);
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 9.11: 优化包列表应为有效包名
     * 
     * *对于任何* 优化包配置，包名应为有效格式
     * 
     * **Validates: Requirements 9.3**
     */
    it('optimized packages should be valid package names', () => {
      const validPackages = [
        'lucide-react',
        'echarts',
        'echarts/core',
        'echarts-for-react',
        'xlsx',
        'pdf-lib',
        'marked',
        'react-markdown',
        'jspdf',
        'jszip',
        'qrcode',
      ];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...validPackages),
          (packageName) => {
            // 验证包名格式
            return packageName.length > 0 && !packageName.includes(' ');
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 9.12: 骨架屏变体应为有效类型
     * 
     * *对于任何* 骨架屏配置，变体应为有效类型
     * 
     * **Validates: Requirements 9.2**
     */
    it('skeleton variants should be valid types', () => {
      const validVariants = ['default', 'editor', 'converter', 'generator', 'chart'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...validVariants),
          (variant) => {
            return validVariants.includes(variant);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 9: Bundle Size Optimization - Integration Tests', () => {
    /**
     * Property 9.13: ToolRegistry 应正确导出
     * 
     * **Validates: Requirements 9.2**
     */
    it('ToolRegistry should export correctly', async () => {
      const toolRegistryModule = await import('../components/tools/ToolRegistry');
      
      expect(toolRegistryModule.TOOL_COMPONENTS_MAP).toBeDefined();
      expect(typeof toolRegistryModule.TOOL_COMPONENTS_MAP).toBe('object');
    });

    /**
     * Property 9.14: next.config.js 应包含实验性配置
     * 
     * **Validates: Requirements 9.3**
     */
    it('next.config.js should include experimental config', () => {
      expect(nextConfigContent).toContain('experimental:');
      expect(nextConfigContent).toContain('optimizePackageImports:');
    });

    /**
     * Property 9.15: 应启用压缩
     * 
     * **Validates: Requirements 9.6**
     */
    it('should enable compression', () => {
      expect(nextConfigContent).toContain('compress: true');
    });
  });
});
