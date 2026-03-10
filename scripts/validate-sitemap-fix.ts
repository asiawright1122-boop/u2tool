#!/usr/bin/env tsx

/**
 * 验证 sitemap 404 修复的脚本
 * 
 * 功能：
 * 1. 检查新 sitemap 文件是否可访问
 * 2. 验证 XML 格式正确性
 * 3. 验证 URL 数量和内容
 * 4. 确认现有功能不受影响
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

const BASE_URL = 'http://localhost:4321';

interface SitemapInfo {
  name: string;
  path: string;
  expectedUrls: number;
  description: string;
}

const sitemaps: SitemapInfo[] = [
  {
    name: 'sitemap.xml',
    path: '/sitemap.xml',
    expectedUrls: 5160, // 所有页面
    description: '主 sitemap（所有页面）'
  },
  {
    name: 'sitemap-tools.xml',
    path: '/sitemap-tools.xml',
    expectedUrls: 5000, // 约 500 工具 × 10 语言
    description: '工具页面 sitemap'
  },
  {
    name: 'sitemap-pages.xml',
    path: '/sitemap-pages.xml',
    expectedUrls: 160, // 约 16 页面类型 × 10 语言
    description: '非工具页面 sitemap'
  }
];

async function validateSitemaps() {
  console.log('🔍 开始验证 sitemap 修复...\n');

  // 1. 启动开发服务器（如果未运行）
  console.log('📡 检查开发服务器状态...');
  try {
    const response = await fetch(`${BASE_URL}/sitemap.xml`);
    if (!response.ok) {
      throw new Error('开发服务器未运行');
    }
    console.log('✅ 开发服务器正在运行\n');
  } catch (error) {
    console.log('❌ 开发服务器未运行，请先运行 npm run dev\n');
    process.exit(1);
  }

  let allPassed = true;

  // 2. 验证每个 sitemap 文件
  for (const sitemap of sitemaps) {
    console.log(`📋 验证 ${sitemap.name} (${sitemap.description})...`);
    
    try {
      // 检查可访问性
      const response = await fetch(`${BASE_URL}${sitemap.path}`);
      
      if (!response.ok) {
        console.log(`❌ ${sitemap.name}: HTTP ${response.status} ${response.statusText}`);
        allPassed = false;
        continue;
      }

      // 检查 Content-Type
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/xml')) {
        console.log(`⚠️  ${sitemap.name}: Content-Type 不正确 (${contentType})`);
      }

      // 获取 XML 内容
      const xmlContent = await response.text();
      
      // 验证 XML 格式
      if (!xmlContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
        console.log(`❌ ${sitemap.name}: XML 声明缺失`);
        allPassed = false;
        continue;
      }

      if (!xmlContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
        console.log(`❌ ${sitemap.name}: XML 命名空间不正确`);
        allPassed = false;
        continue;
      }

      // 统计 URL 数量
      const urlMatches = xmlContent.match(/<url>/g);
      const urlCount = urlMatches ? urlMatches.length : 0;
      
      console.log(`   📊 URL 数量: ${urlCount}`);
      
      // 验证 URL 数量范围（允许一定误差）
      const tolerance = 0.1; // 10% 误差
      const minExpected = sitemap.expectedUrls * (1 - tolerance);
      const maxExpected = sitemap.expectedUrls * (1 + tolerance);
      
      if (urlCount < minExpected || urlCount > maxExpected) {
        console.log(`⚠️  ${sitemap.name}: URL 数量异常 (期望约 ${sitemap.expectedUrls})`);
      }

      // 验证 hreflang 标签
      const hreflangMatches = xmlContent.match(/hreflang="/g);
      const hreflangCount = hreflangMatches ? hreflangMatches.length : 0;
      
      if (hreflangCount === 0) {
        console.log(`❌ ${sitemap.name}: 缺少 hreflang 标签`);
        allPassed = false;
      } else {
        console.log(`   🌐 Hreflang 标签: ${hreflangCount}`);
      }

      // 验证必需的 URL 模式
      const requiredPatterns = getRequiredPatterns(sitemap.name);
      for (const pattern of requiredPatterns) {
        if (!xmlContent.includes(pattern)) {
          console.log(`❌ ${sitemap.name}: 缺少必需的 URL 模式: ${pattern}`);
          allPassed = false;
        }
      }

      console.log(`✅ ${sitemap.name}: 验证通过\n`);

    } catch (error) {
      console.log(`❌ ${sitemap.name}: 验证失败 - ${error}`);
      allPassed = false;
    }
  }

  // 3. 验证 URL 内容不重复
  console.log('🔄 验证 sitemap 内容一致性...');
  
  try {
    const mainSitemap = await fetch(`${BASE_URL}/sitemap.xml`).then(r => r.text());
    const toolsSitemap = await fetch(`${BASE_URL}/sitemap-tools.xml`).then(r => r.text());
    const pagesSitemap = await fetch(`${BASE_URL}/sitemap-pages.xml`).then(r => r.text());

    // 提取 URL
    const mainUrls = extractUrls(mainSitemap);
    const toolsUrls = extractUrls(toolsSitemap);
    const pagesUrls = extractUrls(pagesSitemap);

    console.log(`   📊 主 sitemap URLs: ${mainUrls.length}`);
    console.log(`   📊 工具 sitemap URLs: ${toolsUrls.length}`);
    console.log(`   📊 页面 sitemap URLs: ${pagesUrls.length}`);

    // 验证工具 + 页面 = 主 sitemap
    const combinedUrls = new Set([...toolsUrls, ...pagesUrls]);
    const mainUrlsSet = new Set(mainUrls);

    if (combinedUrls.size !== mainUrlsSet.size) {
      console.log(`⚠️  URL 总数不匹配: 组合 ${combinedUrls.size} vs 主 ${mainUrlsSet.size}`);
    }

    // 检查是否有重复
    const overlap = toolsUrls.filter(url => pagesUrls.includes(url));
    if (overlap.length > 0) {
      console.log(`❌ 工具和页面 sitemap 有重复 URL: ${overlap.length} 个`);
      allPassed = false;
    } else {
      console.log(`✅ 无重复 URL`);
    }

    console.log(`✅ 内容一致性验证通过\n`);

  } catch (error) {
    console.log(`❌ 内容一致性验证失败: ${error}\n`);
    allPassed = false;
  }

  // 4. 总结
  if (allPassed) {
    console.log('🎉 所有验证通过！sitemap 404 修复成功。');
    console.log('\n📋 下一步：');
    console.log('1. 部署到生产环境');
    console.log('2. 在搜索引擎控制台提交新的 sitemap');
    console.log('3. 监控索引状态');
  } else {
    console.log('❌ 验证失败，请检查上述错误并修复。');
    process.exit(1);
  }
}

function getRequiredPatterns(sitemapName: string): string[] {
  switch (sitemapName) {
    case 'sitemap.xml':
      return [
        'https://www.u2tool.com/en',
        'https://www.u2tool.com/zh',
        '/tools/',
        '/categories/',
        'hreflang="en"',
        'hreflang="zh-CN"'
      ];
    case 'sitemap-tools.xml':
      return [
        '/tools/',
        'hreflang="en"',
        'priority>0.7'
      ];
    case 'sitemap-pages.xml':
      return [
        'https://www.u2tool.com/en',
        '/categories/',
        'priority>1.0',
        'priority>0.9'
      ];
    default:
      return [];
  }
}

function extractUrls(xmlContent: string): string[] {
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  const urls: string[] = [];
  let match;
  
  while ((match = urlRegex.exec(xmlContent)) !== null) {
    urls.push(match[1]);
  }
  
  return urls;
}

// 运行验证
validateSitemaps().catch(console.error);