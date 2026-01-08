/**
 * 网站地图完整性验证脚本
 * 检查 sitemap 是否包含所有预期的页面
 * 
 * 用法: npx tsx scripts/validate-sitemap-completeness.ts
 */

import { tools, categories } from '../src/config/tools';
import { SEO_CONFIG, SEO_LOCALES } from '../src/lib/seo';
import { blogPosts } from '../src/config/blog';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = SEO_CONFIG.siteUrl;

interface ValidationResult {
  totalExpected: number;
  totalFound: number;
  missing: string[];
  extra: string[];
  valid: boolean;
}

/**
 * 生成所有预期的 URL 列表
 */
function generateExpectedUrls(): string[] {
  const urls: string[] = [];

  for (const locale of SEO_LOCALES) {
    // 首页
    urls.push(`${BASE_URL}/${locale}`);
    
    // About 页面
    urls.push(`${BASE_URL}/${locale}/about`);
    
    // Blog 列表页
    urls.push(`${BASE_URL}/${locale}/blog`);
    
    // 博客文章页面
    for (const post of blogPosts) {
      urls.push(`${BASE_URL}/${locale}/blog/${post.slug}`);
    }
    
    // Privacy 页面
    urls.push(`${BASE_URL}/${locale}/privacy`);
    
    // Terms 页面
    urls.push(`${BASE_URL}/${locale}/terms`);
    
    // 工具列表页
    urls.push(`${BASE_URL}/${locale}/tools`);
    
    // 分类页面
    for (const category of categories) {
      urls.push(`${BASE_URL}/${locale}/tools/category/${category.id}`);
    }
    
    // 工具页面
    for (const tool of tools) {
      urls.push(`${BASE_URL}/${locale}/tools/${tool.slug}`);
    }
  }

  return urls;
}

/**
 * 从 sitemap.xml 文件中提取 URL
 */
function extractUrlsFromSitemap(sitemapPath: string): string[] {
  if (!fs.existsSync(sitemapPath)) {
    console.error(`Sitemap file not found: ${sitemapPath}`);
    return [];
  }

  const content = fs.readFileSync(sitemapPath, 'utf-8');
  const urlRegex = /<loc>([^<]+)<\/loc>/g;
  const urls: string[] = [];
  let match;

  while ((match = urlRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * 验证 sitemap 完整性
 */
function validateSitemap(sitemapPath: string): ValidationResult {
  const expectedUrls = generateExpectedUrls();
  const actualUrls = extractUrlsFromSitemap(sitemapPath);
  
  const expectedSet = new Set(expectedUrls);
  const actualSet = new Set(actualUrls);
  
  // 找出缺失的 URL
  const missing = expectedUrls.filter(url => !actualSet.has(url));
  
  // 找出多余的 URL（在 sitemap 中但不在预期列表中）
  const extra = actualUrls.filter(url => !expectedSet.has(url));
  
  return {
    totalExpected: expectedUrls.length,
    totalFound: actualUrls.length,
    missing,
    extra,
    valid: missing.length === 0,
  };
}

/**
 * 按类型分组缺失的 URL
 */
function groupMissingUrls(urls: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {
    tools: [],
    categories: [],
    blog: [],
    static: [],
    other: [],
  };

  for (const url of urls) {
    if (url.includes('/tools/category/')) {
      groups.categories.push(url);
    } else if (url.includes('/tools/')) {
      groups.tools.push(url);
    } else if (url.includes('/blog/')) {
      groups.blog.push(url);
    } else if (url.includes('/about') || url.includes('/privacy') || url.includes('/terms')) {
      groups.static.push(url);
    } else {
      groups.other.push(url);
    }
  }

  return groups;
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 Validating sitemap completeness...\n');
  
  // 检查 sitemap.xml 文件
  const sitemapPath = path.join(process.cwd(), 'sitemap.xml');
  const publicSitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  let targetPath = sitemapPath;
  if (!fs.existsSync(sitemapPath) && fs.existsSync(publicSitemapPath)) {
    targetPath = publicSitemapPath;
  }
  
  if (!fs.existsSync(targetPath)) {
    console.log('⚠️  No sitemap.xml found. Generating expected URL list...\n');
    
    const expectedUrls = generateExpectedUrls();
    console.log(`📊 Expected URLs: ${expectedUrls.length}`);
    console.log(`   - Locales: ${SEO_LOCALES.length}`);
    console.log(`   - Tools: ${tools.length}`);
    console.log(`   - Categories: ${categories.length}`);
    console.log(`   - Blog posts: ${blogPosts.length}`);
    console.log(`   - Static pages: 4 (home, about, privacy, terms)`);
    
    // 计算每个 locale 的 URL 数量
    const urlsPerLocale = 1 + 1 + 1 + blogPosts.length + 1 + 1 + 1 + categories.length + tools.length;
    console.log(`   - URLs per locale: ${urlsPerLocale}`);
    console.log(`   - Total: ${urlsPerLocale * SEO_LOCALES.length}`);
    
    return;
  }
  
  console.log(`📄 Checking sitemap: ${targetPath}\n`);
  
  const result = validateSitemap(targetPath);
  
  console.log('📊 Summary:');
  console.log(`   Expected URLs: ${result.totalExpected}`);
  console.log(`   Found URLs: ${result.totalFound}`);
  console.log(`   Missing: ${result.missing.length}`);
  console.log(`   Extra: ${result.extra.length}`);
  console.log('');
  
  if (result.missing.length > 0) {
    console.log('❌ Missing URLs:');
    const grouped = groupMissingUrls(result.missing);
    
    if (grouped.tools.length > 0) {
      console.log(`\n   🔧 Tools (${grouped.tools.length}):`);
      // 只显示前 10 个，避免输出过长
      grouped.tools.slice(0, 10).forEach(url => console.log(`      - ${url}`));
      if (grouped.tools.length > 10) {
        console.log(`      ... and ${grouped.tools.length - 10} more`);
      }
    }
    
    if (grouped.categories.length > 0) {
      console.log(`\n   📁 Categories (${grouped.categories.length}):`);
      grouped.categories.slice(0, 10).forEach(url => console.log(`      - ${url}`));
      if (grouped.categories.length > 10) {
        console.log(`      ... and ${grouped.categories.length - 10} more`);
      }
    }
    
    if (grouped.blog.length > 0) {
      console.log(`\n   📝 Blog (${grouped.blog.length}):`);
      grouped.blog.slice(0, 10).forEach(url => console.log(`      - ${url}`));
      if (grouped.blog.length > 10) {
        console.log(`      ... and ${grouped.blog.length - 10} more`);
      }
    }
    
    if (grouped.static.length > 0) {
      console.log(`\n   📄 Static pages (${grouped.static.length}):`);
      grouped.static.forEach(url => console.log(`      - ${url}`));
    }
    
    if (grouped.other.length > 0) {
      console.log(`\n   ❓ Other (${grouped.other.length}):`);
      grouped.other.slice(0, 10).forEach(url => console.log(`      - ${url}`));
      if (grouped.other.length > 10) {
        console.log(`      ... and ${grouped.other.length - 10} more`);
      }
    }
  }
  
  if (result.extra.length > 0) {
    console.log('\n⚠️  Extra URLs (in sitemap but not expected):');
    result.extra.slice(0, 10).forEach(url => console.log(`   - ${url}`));
    if (result.extra.length > 10) {
      console.log(`   ... and ${result.extra.length - 10} more`);
    }
  }
  
  console.log('');
  if (result.valid) {
    console.log('✅ Sitemap is complete!');
  } else {
    console.log('❌ Sitemap has missing URLs. Please check the sitemap generation logic.');
    process.exit(1);
  }
}

main();
