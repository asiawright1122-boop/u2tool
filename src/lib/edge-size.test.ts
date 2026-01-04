/**
 * Edge Function 大小检查测试
 * 
 * Property 1: Middleware 不包含翻译导入
 * Property 2: Edge Function 大小限制
 * 
 * @see Requirements 1.1, 1.2, 1.3, 2.2, 4.2
 */

import { describe, it, expect, beforeAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const EDGE_CHUNKS_DIR = '.next/server/edge/chunks';
const WARNING_THRESHOLD_MB = 1.5;

describe('Edge Function Size Optimization', () => {
  beforeAll(() => {
    // 确保构建目录存在
    if (!fs.existsSync(EDGE_CHUNKS_DIR)) {
      console.warn(`警告: ${EDGE_CHUNKS_DIR} 目录不存在。请先运行 npm run build`);
    }
  });

  /**
   * Property 1: Middleware 不包含翻译导入
   * 
   * *对于任何* middleware 构建输出，edge chunks 中不应包含任何 `src_messages_` 前缀的文件。
   * 
   * **Validates: Requirements 1.1, 1.2, 2.2**
   */
  it('Property 1: Edge chunks should not contain translation files', () => {
    if (!fs.existsSync(EDGE_CHUNKS_DIR)) {
      console.warn('跳过测试: 构建目录不存在');
      return;
    }

    const files = fs.readdirSync(EDGE_CHUNKS_DIR);
    const jsFiles = files.filter(f => f.endsWith('.js') && !f.endsWith('.map'));
    
    // 检查是否包含翻译文件
    const translationFiles = jsFiles.filter(f => 
      f.includes('messages') || 
      f.includes('translations') ||
      f.includes('locale')
    );

    expect(translationFiles).toHaveLength(0);
  });

  /**
   * Property 2: Edge Function 大小限制
   * 
   * *对于任何* 构建输出，Edge Function 的总大小应小于 1.5 MB（留有安全余量）。
   * 
   * **Validates: Requirements 1.3, 4.2**
   */
  it('Property 2: Edge Function size should be under limit', () => {
    if (!fs.existsSync(EDGE_CHUNKS_DIR)) {
      console.warn('跳过测试: 构建目录不存在');
      return;
    }

    const files = fs.readdirSync(EDGE_CHUNKS_DIR);
    const jsFiles = files.filter(f => f.endsWith('.js') && !f.endsWith('.map'));
    
    let totalSize = 0;
    for (const file of jsFiles) {
      const filePath = path.join(EDGE_CHUNKS_DIR, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    }

    const totalMB = totalSize / 1024 / 1024;
    
    // 应该小于警告阈值（1.5 MB）
    expect(totalMB).toBeLessThan(WARNING_THRESHOLD_MB);
  });

  /**
   * 验证 middleware.ts 不导入翻译相关模块
   */
  it('middleware.ts should not import translation modules', () => {
    const middlewarePath = 'src/middleware.ts';
    
    if (!fs.existsSync(middlewarePath)) {
      console.warn('跳过测试: middleware.ts 不存在');
      return;
    }

    const content = fs.readFileSync(middlewarePath, 'utf-8');
    
    // 检查是否导入了翻译相关模块
    const forbiddenImports = [
      'translations',
      'messages',
      '@/lib/translations',
      '@/messages',
      'next-intl/middleware',
      'createMiddleware',
    ];

    for (const forbidden of forbiddenImports) {
      expect(content).not.toContain(`from '${forbidden}'`);
      expect(content).not.toContain(`from "${forbidden}"`);
    }
  });

  /**
   * 验证 i18n/request.ts 返回空 messages
   */
  it('i18n/request.ts should return empty messages', () => {
    const requestPath = 'src/i18n/request.ts';
    
    if (!fs.existsSync(requestPath)) {
      console.warn('跳过测试: i18n/request.ts 不存在');
      return;
    }

    const content = fs.readFileSync(requestPath, 'utf-8');
    
    // 检查是否返回空 messages
    expect(content).toContain('messages: {}');
    
    // 检查是否不导入翻译加载器
    expect(content).not.toContain('loadBaseMessages');
    expect(content).not.toContain('loadToolMessages');
  });
});
