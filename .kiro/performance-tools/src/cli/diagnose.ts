#!/usr/bin/env node
/**
 * 诊断命令行工具
 * 快速诊断 Vercel + Cloudflare 部署的性能问题
 */

import { PerformanceAnalyzer } from '../analyzers/performance-analyzer.js'

async function main() {
  console.log('🔍 开始性能诊断...\n')
  
  const analyzer = new PerformanceAnalyzer()
  
  try {
    // 1. 分析 Middleware
    console.log('📊 分析 Middleware 性能...')
    const middlewareReport = await analyzer.analyzeMiddleware('src/middleware.ts')
    console.log(`  ✓ Middleware 大小: ${(middlewareReport.codeSize / 1024).toFixed(2)} KB`)
    console.log(`  ✓ 发现 ${middlewareReport.bottlenecks.length} 个潜在问题\n`)
    
    // 2. 分析翻译文件
    console.log('📚 分析翻译文件...')
    const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar']
    const translationReport = await analyzer.analyzeTranslations(locales)
    console.log(`  ✓ 总大小: ${(translationReport.totalSize / 1024).toFixed(2)} KB`)
    console.log(`  ✓ 分析了 ${translationReport.filesAnalyzed} 个文件`)
    console.log(`  ✓ 大文件: ${translationReport.largeFiles.length} 个\n`)
    
    // 3. 生成报告
    console.log('📋 生成诊断报告...')
    const report = await analyzer.generateReport({
      middleware: middlewareReport,
      translations: translationReport
    })
    
    console.log(`\n${'='.repeat(60)}`)
    console.log('📊 诊断报告')
    console.log('='.repeat(60))
    console.log(`优先级评分: ${report.priorityScore}`)
    console.log(`影响程度: ${report.estimatedImpact}`)
    console.log(`发现问题: ${report.issues.length} 个\n`)
    
    if (report.issues.length > 0) {
      console.log('🔴 发现的问题:')
      report.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. [${issue.severity.toUpperCase()}] ${issue.title}`)
        console.log(`     ${issue.description}`)
      })
    }
    
    if (translationReport.recommendations.length > 0) {
      console.log('\n💡 建议:')
      translationReport.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. ${rec}`)
      })
    }
    
    console.log(`\n${'='.repeat(60)}\n`)
    
  } catch (error) {
    console.error('❌ 诊断失败:', error)
    process.exit(1)
  }
}

main()
