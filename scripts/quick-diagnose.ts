#!/usr/bin/env tsx
/**
 * 快速诊断脚本
 * 直接在项目根目录运行，无需安装额外依赖
 */

import { readFileSync, statSync, readdirSync } from 'fs'
import { join } from 'path'

console.log('🔍 U2Tool 性能快速诊断\n')
console.log('='.repeat(60))

// 1. 检查 Middleware 大小
console.log('\n📊 1. Middleware 分析')
console.log('-'.repeat(60))
try {
  const middlewarePath = 'src/middleware.ts'
  const middlewareStats = statSync(middlewarePath)
  const middlewareCode = readFileSync(middlewarePath, 'utf-8')
  
  console.log(`✓ 文件大小: ${(middlewareStats.size / 1024).toFixed(2)} KB`)
  
  // 检查潜在问题
  const issues: string[] = []
  
  if (middlewareStats.size > 1024 * 1024) {
    issues.push('⚠️  Middleware 文件超过 1MB，可能影响 Edge Function 性能')
  }
  
  if (middlewareCode.includes('readFileSync') || middlewareCode.includes('execSync')) {
    issues.push('🔴 检测到阻塞性 I/O 操作（readFileSync/execSync）')
  }
  
  const acceptLanguageCount = (middlewareCode.match(/Accept-Language/g) || []).length
  if (acceptLanguageCount > 2) {
    issues.push(`⚠️  Accept-Language 处理逻辑复杂（出现 ${acceptLanguageCount} 次）`)
  }
  
  if (middlewareCode.includes('fetch(')) {
    issues.push('⚠️  Middleware 中包含 fetch 调用，可能导致延迟')
  }
  
  if (issues.length > 0) {
    console.log('\n发现的问题:')
    issues.forEach(issue => console.log(`  ${issue}`))
  } else {
    console.log('✅ 未发现明显问题')
  }
  
} catch (error) {
  console.log('❌ 无法分析 Middleware:', error)
}

// 2. 检查翻译文件
console.log('\n📚 2. 翻译文件分析')
console.log('-'.repeat(60))
try {
  const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar']
  let totalSize = 0
  const largeFiles: Array<{ locale: string; size: number }> = []
  let filesFound = 0
  
  for (const locale of locales) {
    try {
      const filePath = `src/messages/${locale}.json`
      const stats = statSync(filePath)
      totalSize += stats.size
      filesFound++
      
      if (stats.size > 100 * 1024) {
        largeFiles.push({ locale, size: stats.size })
      }
    } catch {
      // 文件不存在
    }
  }
  
  console.log(`✓ 找到 ${filesFound} 个翻译文件`)
  console.log(`✓ 总大小: ${(totalSize / 1024).toFixed(2)} KB`)
  console.log(`✓ 平均大小: ${(totalSize / filesFound / 1024).toFixed(2)} KB`)
  
  if (largeFiles.length > 0) {
    console.log(`\n⚠️  发现 ${largeFiles.length} 个超过 100KB 的文件:`)
    largeFiles.forEach(({ locale, size }) => {
      console.log(`  - ${locale}.json: ${(size / 1024).toFixed(2)} KB`)
    })
    console.log('\n💡 建议: 考虑拆分大型翻译文件，实现按需加载')
  }
  
  if (totalSize > 1024 * 1024) {
    console.log(`\n⚠️  翻译文件总大小超过 1MB (${(totalSize / 1024 / 1024).toFixed(2)} MB)`)
    console.log('💡 建议: 实现翻译文件的懒加载策略')
  }
  
} catch (error) {
  console.log('❌ 无法分析翻译文件:', error)
}

// 3. 检查 Bundle 配置
console.log('\n📦 3. Bundle 配置检查')
console.log('-'.repeat(60))
try {
  const nextConfig = readFileSync('next.config.js', 'utf-8')
  
  const checks = [
    { pattern: /compress:\s*true/, message: '✓ 启用了压缩' },
    { pattern: /optimizePackageImports/, message: '✓ 配置了包导入优化' },
    { pattern: /dynamic\s*\(/, message: '✓ 使用了动态导入' },
  ]
  
  checks.forEach(({ pattern, message }) => {
    if (pattern.test(nextConfig)) {
      console.log(message)
    }
  })
  
  // 检查大型依赖
  const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'))
  const largeDeps = ['echarts', 'pdf-lib', 'xlsx', 'html2canvas', 'jspdf']
  const foundLargeDeps = largeDeps.filter(dep => 
    packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
  )
  
  if (foundLargeDeps.length > 0) {
    console.log(`\n⚠️  检测到大型依赖包: ${foundLargeDeps.join(', ')}`)
    console.log('💡 建议: 确保这些库使用动态导入，仅在需要时加载')
  }
  
} catch (error) {
  console.log('❌ 无法检查 Bundle 配置:', error)
}

// 4. 检查布局文件中的资源加载
console.log('\n🎨 4. 资源加载检查')
console.log('-'.repeat(60))
try {
  const layoutPath = 'src/app/[locale]/layout.tsx'
  const layoutCode = readFileSync(layoutPath, 'utf-8')
  
  // 检查预连接数量
  const preconnectCount = (layoutCode.match(/rel="preconnect"/g) || []).length
  console.log(`✓ 预连接数量: ${preconnectCount}`)
  
  if (preconnectCount > 3) {
    console.log('⚠️  预连接数量过多，建议限制在 3 个以内')
  }
  
  // 检查 Apple 启动画面
  const appleSplashCount = (layoutCode.match(/apple-touch-startup-image/g) || []).length
  console.log(`✓ Apple 启动画面: ${appleSplashCount} 个`)
  
  if (appleSplashCount > 5) {
    console.log('⚠️  Apple 启动画面过多，考虑移除不必要的尺寸')
  }
  
  // 检查第三方脚本
  if (layoutCode.includes('GoogleAnalytics') || layoutCode.includes('Analytics')) {
    console.log('✓ 已集成分析工具')
  }
  
} catch (error) {
  console.log('❌ 无法检查资源加载:', error)
}

// 5. 总结和建议
console.log('\n📋 5. 诊断总结')
console.log('='.repeat(60))
console.log('\n🎯 关键建议:')
console.log('  1. 优化 Middleware 性能（简化 locale 检测逻辑）')
console.log('  2. 实现翻译文件按需加载')
console.log('  3. 确保大型库使用动态导入')
console.log('  4. 减少预连接和启动画面数量')
console.log('  5. 检查 Cloudflare 代理设置（可能与 Vercel 冲突）')

console.log('\n📊 下一步:')
console.log('  • 运行 npm run build 检查 Bundle 大小')
console.log('  • 使用 Lighthouse 测试实际性能')
console.log('  • 检查 Vercel 和 Cloudflare 配置')

console.log('\n' + '='.repeat(60) + '\n')
