#!/usr/bin/env npx tsx
/**
 * 性能报告生成脚本
 * 按页面类型分组显示 Core Web Vitals，生成优化建议
 * @see Requirements 1.3, 1.4
 * 
 * 使用方法:
 *   npx tsx scripts/generate-performance-report.ts
 *   npx tsx scripts/generate-performance-report.ts --json
 */

import * as fs from 'fs';
import * as path from 'path';

// 模拟性能数据（实际使用时从分析服务获取）
interface PerformanceDataPoint {
  url: string;
  pageType: string;
  metrics: {
    LCP?: number;
    INP?: number;
    CLS?: number;
    FCP?: number;
    TTFB?: number;
  };
  timestamp: string;
}

// 阈值配置
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
};

// 页面类型
type PageType = 'home' | 'tools-list' | 'tool-detail' | 'category' | 'other';

// 报告结构
interface PerformanceReport {
  generatedAt: string;
  summary: {
    totalPages: number;
    goodPages: number;
    needsImprovementPages: number;
    poorPages: number;
  };
  byPageType: Record<PageType, PageTypeReport>;
  recommendations: string[];
}

interface PageTypeReport {
  pageCount: number;
  averageMetrics: {
    LCP: number;
    INP: number;
    CLS: number;
    FCP: number;
    TTFB: number;
  };
  ratings: {
    LCP: string;
    INP: string;
    CLS: string;
    FCP: string;
    TTFB: string;
  };
  overallRating: string;
}

// 获取指标评级
function getMetricRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// 格式化指标值
function formatMetricValue(metric: string, value: number): string {
  if (metric === 'CLS') return value.toFixed(3);
  return `${Math.round(value)}ms`;
}

// 生成模拟数据（实际使用时从分析服务获取）
function generateSampleData(): PerformanceDataPoint[] {
  const pageTypes: PageType[] = ['home', 'tools-list', 'tool-detail', 'category'];
  const data: PerformanceDataPoint[] = [];
  
  // 为每种页面类型生成样本数据
  for (const pageType of pageTypes) {
    const count = pageType === 'tool-detail' ? 10 : 3;
    
    for (let i = 0; i < count; i++) {
      // 模拟真实的性能数据分布
      const baseMetrics = {
        home: { LCP: 1800, INP: 150, CLS: 0.05, FCP: 1200, TTFB: 600 },
        'tools-list': { LCP: 2200, INP: 180, CLS: 0.08, FCP: 1500, TTFB: 700 },
        'tool-detail': { LCP: 2500, INP: 200, CLS: 0.1, FCP: 1800, TTFB: 800 },
        category: { LCP: 2000, INP: 160, CLS: 0.06, FCP: 1400, TTFB: 650 },
        other: { LCP: 2000, INP: 170, CLS: 0.07, FCP: 1500, TTFB: 700 },
      };
      
      const base = baseMetrics[pageType];
      const variance = 0.3; // 30% 方差
      
      data.push({
        url: `https://www.u2tool.com/en/${pageType === 'home' ? '' : pageType === 'tool-detail' ? `tools/tool-${i}` : pageType}`,
        pageType,
        metrics: {
          LCP: base.LCP * (1 + (Math.random() - 0.5) * variance),
          INP: base.INP * (1 + (Math.random() - 0.5) * variance),
          CLS: base.CLS * (1 + (Math.random() - 0.5) * variance),
          FCP: base.FCP * (1 + (Math.random() - 0.5) * variance),
          TTFB: base.TTFB * (1 + (Math.random() - 0.5) * variance),
        },
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  }
  
  return data;
}

// 生成报告
function generateReport(data: PerformanceDataPoint[]): PerformanceReport {
  const byPageType: Record<string, PerformanceDataPoint[]> = {};
  
  // 按页面类型分组
  for (const point of data) {
    if (!byPageType[point.pageType]) {
      byPageType[point.pageType] = [];
    }
    byPageType[point.pageType].push(point);
  }
  
  const pageTypeReports: Record<PageType, PageTypeReport> = {} as Record<PageType, PageTypeReport>;
  let goodPages = 0;
  let needsImprovementPages = 0;
  let poorPages = 0;
  
  // 为每种页面类型生成报告
  for (const [pageType, points] of Object.entries(byPageType)) {
    const metrics = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'] as const;
    const averages: Record<string, number> = {};
    const ratings: Record<string, string> = {};
    
    // 计算平均值
    for (const metric of metrics) {
      const values = points
        .map(p => p.metrics[metric])
        .filter((v): v is number => v !== undefined);
      
      if (values.length > 0) {
        averages[metric] = values.reduce((a, b) => a + b, 0) / values.length;
        ratings[metric] = getMetricRating(metric, averages[metric]);
      } else {
        averages[metric] = 0;
        ratings[metric] = 'good';
      }
    }
    
    // 计算整体评级
    const coreRatings = ['LCP', 'INP', 'CLS'].map(m => ratings[m]);
    let overallRating: string;
    
    if (coreRatings.includes('poor')) {
      overallRating = 'poor';
      poorPages += points.length;
    } else if (coreRatings.includes('needs-improvement')) {
      overallRating = 'needs-improvement';
      needsImprovementPages += points.length;
    } else {
      overallRating = 'good';
      goodPages += points.length;
    }
    
    pageTypeReports[pageType as PageType] = {
      pageCount: points.length,
      averageMetrics: averages as PageTypeReport['averageMetrics'],
      ratings: ratings as PageTypeReport['ratings'],
      overallRating,
    };
  }
  
  // 生成建议
  const recommendations: string[] = [];
  
  for (const [pageType, report] of Object.entries(pageTypeReports)) {
    if (report.ratings.LCP !== 'good') {
      recommendations.push(`[${pageType}] 优化 LCP: 当前 ${formatMetricValue('LCP', report.averageMetrics.LCP)}，目标 < 2.5s`);
    }
    if (report.ratings.INP !== 'good') {
      recommendations.push(`[${pageType}] 优化 INP: 当前 ${formatMetricValue('INP', report.averageMetrics.INP)}，目标 < 200ms`);
    }
    if (report.ratings.CLS !== 'good') {
      recommendations.push(`[${pageType}] 优化 CLS: 当前 ${formatMetricValue('CLS', report.averageMetrics.CLS)}，目标 < 0.1`);
    }
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ 所有页面类型的 Core Web Vitals 都达到良好标准！');
  }
  
  return {
    generatedAt: new Date().toISOString(),
    summary: {
      totalPages: data.length,
      goodPages,
      needsImprovementPages,
      poorPages,
    },
    byPageType: pageTypeReports,
    recommendations,
  };
}

// 打印报告
function printReport(report: PerformanceReport): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 Core Web Vitals Performance Report');
  console.log('='.repeat(60));
  console.log(`Generated: ${report.generatedAt}\n`);
  
  // 摘要
  console.log('📈 Summary');
  console.log('-'.repeat(40));
  console.log(`Total Pages Analyzed: ${report.summary.totalPages}`);
  console.log(`  ✅ Good: ${report.summary.goodPages}`);
  console.log(`  ⚠️  Needs Improvement: ${report.summary.needsImprovementPages}`);
  console.log(`  ❌ Poor: ${report.summary.poorPages}`);
  console.log();
  
  // 按页面类型
  console.log('📄 By Page Type');
  console.log('-'.repeat(40));
  
  for (const [pageType, data] of Object.entries(report.byPageType)) {
    const ratingIcon = data.overallRating === 'good' ? '✅' : data.overallRating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`\n${ratingIcon} ${pageType.toUpperCase()} (${data.pageCount} pages)`);
    console.log(`   Overall: ${data.overallRating}`);
    console.log(`   LCP: ${formatMetricValue('LCP', data.averageMetrics.LCP)} (${data.ratings.LCP})`);
    console.log(`   INP: ${formatMetricValue('INP', data.averageMetrics.INP)} (${data.ratings.INP})`);
    console.log(`   CLS: ${formatMetricValue('CLS', data.averageMetrics.CLS)} (${data.ratings.CLS})`);
    console.log(`   FCP: ${formatMetricValue('FCP', data.averageMetrics.FCP)} (${data.ratings.FCP})`);
    console.log(`   TTFB: ${formatMetricValue('TTFB', data.averageMetrics.TTFB)} (${data.ratings.TTFB})`);
  }
  
  // 建议
  console.log('\n💡 Recommendations');
  console.log('-'.repeat(40));
  for (const rec of report.recommendations) {
    console.log(`  • ${rec}`);
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// 主函数
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  
  console.log('Generating performance report...\n');
  
  // 生成样本数据（实际使用时从分析服务获取）
  const data = generateSampleData();
  
  // 生成报告
  const report = generateReport(data);
  
  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }
  
  // 保存报告到文件
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  const reportPath = path.join(reportsDir, `performance-report-${new Date().toISOString().split('T')[0]}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report saved to: ${reportPath}`);
}

main().catch(console.error);
