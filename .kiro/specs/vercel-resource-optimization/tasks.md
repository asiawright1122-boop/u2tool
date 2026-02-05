# Implementation Plan: Vercel Resource Optimization

## Overview

本实现计划将 Vercel 资源优化分为 8 个主要阶段，从基础配置优化开始，逐步实现 Edge Config、Blob 存储、监控系统等高级功能。每个阶段都包含测试任务以确保正确性。

## Tasks

- [x] 1. 优化 ISR 和静态生成配置
  - [x] 1.1 更新工具页面 ISR 配置
    - 在 `src/app/[locale]/tools/[slug]/page.tsx` 添加 `export const revalidate = 2592000`
    - 扩展 `generateStaticParams` 预生成前 3 种语言的所有工具页面
    - _Requirements: 1.1, 2.1, 2.5_
  
  - [x] 1.2 更新分类页面 ISR 配置
    - 在 `src/app/[locale]/tools/category/[category]/page.tsx` 添加 `export const revalidate = 604800`
    - 更新 `generateStaticParams` 预生成所有分类页面
    - _Requirements: 1.2, 2.2_
  
  - [x] 1.3 更新首页 ISR 配置
    - 在 `src/app/[locale]/page.tsx` 添加 `export const revalidate = 2592000`
    - 确保所有 10 种语言的首页都被预生成
    - _Requirements: 1.3, 2.3_
  
  - [x] 1.4 编写静态参数生成属性测试
    - **Property 1: Static Params Generation Coverage**
    - 验证 generateStaticParams 返回正确的参数组合
    - **Validates: Requirements 2.1, 2.2, 2.3**

- [x] 2. 优化 HTTP 缓存头配置
  - [x] 2.1 更新 next.config.js 缓存头
    - 将 HTML 页面缓存从 24 小时延长到 7 天
    - 添加 `Vercel-CDN-Cache-Control` 头
    - 添加 `stale-while-revalidate` 30 天配置
    - _Requirements: 3.1, 15.1, 15.2_
  
  - [x] 2.2 更新 API 路由缓存头
    - 将 API 缓存从 1 分钟延长到 1 小时
    - 添加 `stale-while-revalidate` 24 小时配置
    - _Requirements: 3.3, 10.2_
  
  - [x] 2.3 优化 OG 图片 API 缓存
    - 确保 ETag 和 304 响应正常工作
    - 添加 Vary 头防止缓存污染
    - _Requirements: 3.4, 3.5, 3.6, 10.1_
  
  - [x] 2.4 编写缓存头属性测试
    - **Property 2: Cache Header Consistency**
    - **Property 3: ETag Conditional Response**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.6**

- [x] 3. Checkpoint - 验证基础优化
  - 运行所有测试确保通过
  - 验证缓存头配置正确
  - 如有问题请询问用户

- [-] 4. 实现 Edge Config 配置管理
  - [-] 4.1 安装 Edge Config 依赖
    - 运行 `npm install @vercel/edge-config`
    - _Requirements: 13.1_
  
  - [ ] 4.2 创建 Edge Config 工具库
    - 创建 `src/lib/edge-config.ts`
    - 实现 `getLocaleRules`、`getFeatureFlags`、`getRedirects` 函数
    - 实现回退逻辑
    - _Requirements: 13.1, 13.2, 13.3, 13.7_
  
  - [ ] 4.3 更新 Middleware 使用 Edge Config
    - 修改 `src/middleware.ts` 从 Edge Config 读取 locale 规则
    - 保留硬编码配置作为回退
    - _Requirements: 13.5, 19.3_
  
  - [ ] 4.4 编写 Edge Config 属性测试
    - **Property 8: Edge Config Fallback**
    - 测试 Edge Config 读取失败时的回退逻辑
    - **Validates: Requirements 13.7**

- [ ] 5. 实现 Vercel Blob 存储
  - [ ] 5.1 安装 Blob 存储依赖
    - 运行 `npm install @vercel/blob`
    - _Requirements: 14.1_
  
  - [ ] 5.2 创建 Blob 存储工具库
    - 创建 `src/lib/blob-storage.ts`
    - 实现 `storeOGImage`、`getOGImageUrl`、`storePDFTemplate`、`storeJSONData` 函数
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [ ] 5.3 创建 OG 图片预生成脚本
    - 创建 `scripts/generate-og-images.ts`
    - 预生成常用工具的 OG 图片并存储到 Blob
    - _Requirements: 14.1, 17.1_
  
  - [ ] 5.4 编写 Blob 存储属性测试
    - **Property 9: Blob Storage URL Validity**
    - 测试 Blob 存储操作返回有效 URL
    - **Validates: Requirements 14.5, 14.6**

- [ ] 6. Checkpoint - 验证存储功能
  - 运行所有测试确保通过
  - 验证 Edge Config 和 Blob 存储正常工作
  - 如有问题请询问用户

- [x] 7. 优化 Middleware 性能
  - [x] 7.1 优化 Middleware matcher 配置
    - 更新 matcher 配置跳过更多静态资源
    - 添加更精确的路径匹配模式
    - _Requirements: 6.1, 19.1_
  
  - [x] 7.2 实现 Locale Cookie 优化
    - 延长 cookie 有效期到 30 天
    - 实现早期返回逻辑
    - _Requirements: 6.3, 19.2, 19.5_
  
  - [x] 7.3 减少重定向
    - 对搜索引擎爬虫使用 rewrite 而非 redirect
    - 优化 canonical URL 处理
    - _Requirements: 6.5_
  
  - [x] 7.4 编写 Middleware 属性测试
    - **Property 6: Middleware Static Asset Bypass**
    - **Property 7: Middleware Locale Cookie Persistence**
    - **Validates: Requirements 6.1, 6.3, 6.6, 19.2**

- [-] 8. 优化翻译文件加载
  - [ ] 8.1 创建优化的翻译加载器
    - 创建 `src/lib/translations-optimized.ts`
    - 实现内存缓存和 localStorage 缓存
    - _Requirements: 5.1, 5.5_
  
  - [ ] 8.2 实现懒加载工具翻译
    - 修改翻译加载逻辑，只在工具页面加载工具翻译
    - 实现增量加载机制
    - _Requirements: 5.3, 5.6_
  
  - [ ] 8.3 编写翻译加载属性测试
    - **Property 4: Translation Loading Isolation**
    - **Property 5: Translation Caching Round-Trip**
    - **Validates: Requirements 5.1, 5.3, 5.5, 5.6**

- [x] 9. 实现智能预取
  - [x] 9.1 创建 SmartLink 组件
    - 创建 `src/components/SmartLink.tsx`
    - 实现悬停预取和网络感知
    - _Requirements: 7.1, 7.4, 7.5, 7.6_
  
  - [x] 9.2 更新导航组件使用 SmartLink
    - 替换关键导航链接为 SmartLink
    - 配置预取策略
    - _Requirements: 7.2, 7.3_
  
  - [x] 9.3 编写智能预取属性测试
    - **Property 13: Smart Prefetch Network Awareness**
    - 测试慢速网络下跳过预取
    - **Validates: Requirements 7.5**

- [ ] 10. Checkpoint - 验证性能优化
  - 运行所有测试确保通过
  - 验证 Middleware 和翻译加载优化
  - 如有问题请询问用户

- [x] 11. 实现资源监控系统
  - [x] 11.1 创建资源监控服务
    - 创建 `src/lib/resource-monitor.ts`
    - 实现 `logISRRegeneration`、`checkResourceThresholds` 函数
    - _Requirements: 9.1, 9.3, 20.2, 20.3_
  
  - [x] 11.2 创建 ISR 重新生成日志
    - 在页面组件中添加重新生成日志
    - 记录时间戳和页面路径
    - _Requirements: 1.4, 9.1_
  
  - [x] 11.3 创建资源使用告警 API
    - 创建 `src/app/api/resource-check/route.ts`
    - 实现阈值检查和告警逻辑
    - _Requirements: 9.6, 20.4, 20.5_
  
  - [x] 11.4 编写资源监控属性测试
    - **Property 10: Resource Threshold Alerting**
    - **Property 12: ISR Regeneration Logging**
    - **Validates: Requirements 1.4, 9.1, 20.2, 20.3**

- [x] 12. 实现请求去重
  - [x] 12.1 创建请求去重工具
    - 创建 `src/lib/request-dedup.ts`
    - 实现并发请求合并逻辑
    - _Requirements: 18.1, 18.6_
  
  - [x] 12.2 应用请求去重到 API 调用
    - 在关键 API 调用处使用请求去重
    - 实现 SWR 模式的客户端缓存
    - _Requirements: 18.3, 18.4_
  
  - [x] 12.3 编写请求去重属性测试
    - **Property 11: Request Deduplication**
    - 测试并发请求只触发一次源请求
    - **Validates: Requirements 18.1, 18.6**

- [x] 13. 优化第三方脚本加载
  - [x] 13.1 更新 ThirdPartyScripts 组件
    - 修改 `src/components/ThirdPartyScripts.tsx`
    - 使用 `strategy="lazyOnload"` 加载分析脚本
    - _Requirements: 12.1, 12.2_
  
  - [x] 13.2 添加 DNS 预取和预连接
    - 在 layout 中添加 `dns-prefetch` 和 `preconnect` 链接
    - _Requirements: 12.3_

- [ ] 14. 优化 Bundle 大小
  - [ ] 14.1 验证动态导入配置
    - 确认 ECharts、PDF.js、jspdf 使用动态导入
    - 检查 ToolWrapper 的懒加载配置
    - _Requirements: 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 14.2 运行 Bundle 分析
    - 运行 `ANALYZE=true npm run build`
    - 记录主要 bundle 大小
    - 识别优化机会
    - _Requirements: 4.1, 4.6_
  
  - [ ] 14.3 编写动态导入属性测试
    - **Property 14: Dynamic Import Lazy Loading**
    - 验证大型库只在需要时加载
    - **Validates: Requirements 4.2, 4.3, 4.4**

- [x] 15. 创建 On-Demand Revalidation API
  - [x] 15.1 创建 Revalidation API 端点
    - 创建 `src/app/api/revalidate/route.ts`
    - 实现按路径触发重新验证
    - 添加 API 密钥验证
    - _Requirements: 1.5, 15.7, 16.3_
  
  - [x] 15.2 创建批量重新验证脚本
    - 创建 `scripts/revalidate-pages.ts`
    - 支持按工具、分类或语言批量重新验证
    - _Requirements: 16.6_

- [ ] 16. Final Checkpoint - 完整验证
  - 运行所有测试确保通过
  - 验证所有优化功能正常工作
  - 运行 bundle 分析确认大小在限制内
  - 如有问题请询问用户

- [ ] 17. 创建文档和监控仪表板
  - [ ] 17.1 更新 README 文档
    - 添加资源优化配置说明
    - 添加 Edge Config 和 Blob 使用说明
    - _Requirements: 9.4_
  
  - [ ] 17.2 创建资源使用监控脚本
    - 创建 `scripts/check-resource-usage.ts`
    - 实现每日/每周资源使用报告
    - _Requirements: 9.4, 9.5, 20.4_

## Notes

- 所有任务都是必需的，包括测试任务
- 每个 Checkpoint 用于验证阶段性成果，确保增量进展
- 属性测试使用 fast-check 库，需要配置至少 100 次迭代
- Edge Config 和 Blob 存储需要在 Vercel 控制台创建相应资源
- 建议在开发环境充分测试后再部署到生产环境
