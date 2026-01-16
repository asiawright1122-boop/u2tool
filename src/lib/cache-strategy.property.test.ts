import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { tools } from '@/config/tools';

/**
 * Cache Strategy 属性测试
 * 
 * Property 4: Cache Headers Consistency
 * Property 10: Static Generation for Popular Tools
 * 
 * @see Requirements 5.1, 5.3, 5.4
 */

describe('Cache Strategy Property Tests', () => {
  describe('Property 4: Cache Headers Consistency', () => {
    const configPath = path.join(process.cwd(), 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf-8');

    it('has cache headers configuration', () => {
      expect(configContent).toContain('async headers()');
      expect(configContent).toContain('Cache-Control');
    });

    it('static assets have long cache (1 year)', () => {
      expect(configContent).toContain('max-age=31536000');
      expect(configContent).toContain('immutable');
    });

    it('static assets include common file types', () => {
      expect(configContent).toContain('svg');
      expect(configContent).toContain('jpg');
      expect(configContent).toContain('png');
      expect(configContent).toContain('webp');
      expect(configContent).toContain('woff2');
    });

    it('Next.js static files have immutable cache', () => {
      expect(configContent).toContain('/_next/static/:path*');
    });

    it('HTML pages have stale-while-revalidate', () => {
      expect(configContent).toContain('stale-while-revalidate');
    });

    it('API routes have appropriate cache', () => {
      expect(configContent).toContain('/api/:path*');
    });

    it('sitemap and robots have daily cache', () => {
      expect(configContent).toContain('sitemap.xml');
      expect(configContent).toContain('robots.txt');
      expect(configContent).toContain('max-age=86400');
    });
  });

  describe('Property 10: Static Generation for Popular Tools', () => {
    const toolPagePath = path.join(process.cwd(), 'src/app/[locale]/tools/[slug]/page.tsx');
    const toolPageContent = fs.readFileSync(toolPagePath, 'utf-8');

    it('has generateStaticParams function', () => {
      expect(toolPageContent).toContain('export function generateStaticParams');
    });

    it('filters popular tools for static generation', () => {
      expect(toolPageContent).toContain('popular');
      expect(toolPageContent).toContain('filter');
    });

    it('enables dynamic params for non-popular tools', () => {
      expect(toolPageContent).toContain('export const dynamicParams = true');
    });

    it('popular tools exist in configuration', () => {
      const popularTools = tools.filter(t => t.popular);
      expect(popularTools.length).toBeGreaterThan(0);
    });

    it('popular tools are a reasonable subset', () => {
      const popularTools = tools.filter(t => t.popular);
      const totalTools = tools.length;
      
      // 热门工具应该是总数的一部分（不超过 50%）
      expect(popularTools.length).toBeLessThan(totalTools * 0.5);
      // 但至少有一些热门工具
      expect(popularTools.length).toBeGreaterThan(10);
    });
  });

  describe('Image Optimization', () => {
    const configPath = path.join(process.cwd(), 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf-8');

    it('has image optimization configuration', () => {
      expect(configContent).toContain('images:');
    });

    it('supports modern image formats', () => {
      expect(configContent).toContain('image/avif');
      expect(configContent).toContain('image/webp');
    });

    it('has minimum cache TTL for images', () => {
      expect(configContent).toContain('minimumCacheTTL');
    });
  });

  describe('Compression', () => {
    const configPath = path.join(process.cwd(), 'next.config.js');
    const configContent = fs.readFileSync(configPath, 'utf-8');

    it('compression is enabled', () => {
      expect(configContent).toContain('compress: true');
    });
  });
});
