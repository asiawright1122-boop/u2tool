# Tasks: Page Unresponsive Fix

## Phase 1: 诊断和监控 (Priority: Critical)

### 1. 修复性能监控工具
- [x] 1.1 重构 PerformanceMonitor 为独立的 Client Component
  - 创建 `src/components/PerformanceMonitor.tsx` 作为 Client Component
  - 使用 `'use client'` 指令确保在浏览器中运行
  - 移除对 `process.env.NODE_ENV` 的依赖，改用 `window.location.hostname` 检测
- [x] 1.2 集成 Web Vitals API
  - 安装并配置 `web-vitals` 库
  - 监控 CLS, FID, LCP, INP, TTFB 指标
  - 在控制台输出实时指标
- [x] 1.3 实现 Long Task 监控
  - 使用 PerformanceObserver 监控 longtask
  - 记录超过 50ms 的任务及其调用栈
  - 在控制台输出警告
- [x] 1.4 实现内存监控
  - 使用 `performance.memory` API 监控内存使用
  - 每 5 秒记录一次内存快照
  - 检测内存增长趋势并发出警告

### 2. 建立性能基准
- [x] 2.1 创建性能基准测试脚本
  - 测量工具加载时间（目标: 90% < 1s）
  - 测量主线程阻塞时间（目标: 单次 < 50ms）
  - 测量内存增长（目标: 20次操作后 < 50MB）
- [x] 2.2 记录修复前的性能数据
  - 运行基准测试并保存结果
  - 生成性能报告作为对比基准

## Phase 2: 快速修复 (Priority: High)

### 3. 实现动态导入队列
- [x] 3.1 创建 ImportQueue 类
  - 实现导入任务队列
  - 限制并发导入数量（最多 2 个）
  - 支持优先级排序
- [x] 3.2 实现导入取消机制
  - 支持取消低优先级导入
  - 当用户快速切换工具时，取消未完成的导入
- [x] 3.3 集成到 ToolWrapper
  - 修改 ToolWrapper 使用 ImportQueue
  - 添加加载状态指示器

### 4. 实现组件缓存
- [x] 4.1 创建 ComponentCache 类
  - 实现 LRU 缓存策略
  - 最多缓存 15 个组件
  - 支持内存大小估算
- [x] 4.2 集成到 ToolWrapper
  - 优先从缓存加载组件
  - 加载后自动缓存
- [x] 4.3 实现缓存清理机制
  - 当内存压力大时自动清理
  - 提供手动清理接口

### 5. 优化 ToolWrapper 组件
- [x] 5.1 减少不必要的重渲染
  - 使用 React.memo 包装组件
  - 优化 useEffect 依赖项
- [x] 5.2 添加错误边界
  - 捕获组件加载错误
  - 显示友好的错误信息和重试按钮
- [x] 5.3 添加加载超时处理
  - 设置 10 秒加载超时
  - 超时后显示错误信息

## Phase 3: 架构优化 (Priority: Medium)

### 6. 拆分 ToolRegistry
- [x] 6.1 分析工具分类
  - 统计每个分类的工具数量
  - 确定拆分策略
- [ ]* 6.2 创建分类注册表文件（可选 - 当前优化已足够）
  - `registries/text-tools.ts` - 文本工具
  - `registries/image-tools.ts` - 图片工具
  - `registries/converter-tools.ts` - 转换工具
  - `registries/calculator-tools.ts` - 计算工具
  - `registries/generator-tools.ts` - 生成工具
  - `registries/chart-tools.ts` - 图表工具
- [ ]* 6.3 实现按需加载注册表（可选 - 当前优化已足够）
  - 根据工具分类动态加载对应注册表
  - 缓存已加载的注册表

### 7. 优化大型库加载
- [x] 7.1 创建 LibraryLoader 工具类
  - 统一管理大型库的加载
  - 实现库实例缓存
- [ ]* 7.2 优化 XLSX 库加载（可选 - 已使用动态导入）
  - 确保所有使用 XLSX 的组件都使用动态导入
  - 共享 XLSX 实例
- [ ]* 7.3 优化 PDF 库加载（可选 - 已使用动态导入）
  - 确保所有使用 PDF 的组件都使用动态导入
  - 共享 PDF 实例
- [x] 7.4 优化 ECharts 加载 ✅ 关键修复
  - 创建 EChartsWrapper 组件实现真正的懒加载
  - 修复 42 个图表组件，移除模块级别的同步导入
  - 使用 requestIdleCallback 延迟加载
  - 并行加载所有 ECharts 依赖

### 8. 实现资源清理机制
- [x] 8.1 创建 ResourceCleaner 类
  - 注册清理回调
  - 组件卸载时执行清理
- [x] 8.2 集成到工具组件
  - 在组件卸载时清理资源
  - 释放大型对象引用

## Phase 4: 长期优化 (Priority: Low)

### 9. React 18 并发渲染优化
- [x] 9.1 使用 startTransition 标记低优先级更新
  - 工具切换使用 startTransition
  - 避免阻塞用户交互
- [ ]* 9.2 使用 useDeferredValue 延迟非关键更新（可选）
  - 延迟工具列表渲染
  - 优先响应用户输入
- [ ]* 9.3 优化 Suspense 边界（可选）
  - 设置合理的 Suspense 边界
  - 避免过度挂起

### 10. Vercel 部署优化
- [x] 10.1 优化缓存策略
  - 为工具组件设置长期缓存
  - 配置 stale-while-revalidate
- [x] 10.2 配置 Vercel Analytics
  - 启用 Speed Insights
  - 监控真实用户性能数据
- [ ]* 10.3 优化 ISR 配置（可选）
  - 为工具页面设置合理的重新验证时间

### 11. 用户体验降级策略
- [x] 11.1 实现性能问题检测
  - 检测主线程阻塞
  - 检测内存不足
- [x] 11.2 实现友好的错误提示
  - 显示加载指示器
  - 提供重试选项
- [x] 11.3 实现自动恢复机制
  - 自动清理未使用的组件
  - 建议用户刷新页面

## Phase 5: 测试和验证 (Priority: High)

### 12. 性能回归测试
- [x] 12.1 创建自动化性能测试
  - 测试连续切换 20 个工具
  - 验证无页面无响应
- [x] 12.2 创建内存泄漏测试
  - 测试内存增长趋势
  - 验证内存稳定
- [ ]* 12.3 集成到 CI/CD（可选）
  - 在 PR 中运行性能测试
  - 阻止性能回归的代码合并

### 13. 用户验证
- [x] 13.1 在开发环境验证
  - 连续点击 10+ 个工具
  - 确认无页面无响应
- [ ]* 13.2 在 Staging 环境验证（可选）
  - 进行 A/B 测试
  - 收集性能数据
- [ ]* 13.3 在生产环境验证（可选）
  - 逐步推广
  - 监控真实用户反馈

### 14. 文档更新
- [x] 14.1 更新开发规范
  - 添加性能优化最佳实践
  - 记录本次修复的经验教训
- [x] 14.2 创建性能监控指南
  - 如何使用性能监控工具
  - 如何诊断性能问题
- [x] 14.3 更新部署指南
  - 添加性能相关的部署配置
  - 添加性能监控配置

---

## 完成总结

### 已完成的核心优化 (Phase 1-2)

1. **性能监控系统** (`src/components/PerformanceMonitor.tsx`)
   - Web Vitals 监控 (CLS, INP, LCP, TTFB)
   - Long Task 监控 (>50ms 任务)
   - 内存使用监控 (每 5 秒快照)
   - 全局可访问: `window.__perfMonitor.printReport()`

2. **动态导入队列** (`src/lib/import-queue.ts`)
   - 限制并发导入数量 (最多 2 个)
   - 支持优先级排序
   - 支持取消机制
   - 使用 requestIdleCallback 优化

3. **组件缓存** (`src/lib/component-cache.ts`)
   - LRU 缓存策略
   - 最多缓存 15 个组件
   - 自动清理机制
   - 缓存命中率统计

4. **优化的 ToolWrapper** (`src/components/tools/ToolWrapper.tsx`)
   - 使用 React.memo 避免重渲染
   - 使用 startTransition 优化渲染
   - 加载超时处理 (10 秒)
   - 友好的错误提示和重试

5. **库加载器** (`src/lib/library-loader.ts`)
   - 统一管理大型库加载
   - 库实例缓存
   - 加载时间追踪

6. **资源清理器** (`src/lib/resource-cleaner.ts`)
   - 统一资源清理
   - 内存压力检测
   - 自动清理旧资源

7. **ECharts 懒加载优化** (`src/components/tools/EChartsWrapper.tsx`) ✅ 关键修复
   - 创建统一的 ECharts 包装组件
   - 使用动态导入实现真正的懒加载
   - 使用 requestIdleCallback 延迟加载
   - 并行加载所有 ECharts 依赖
   - 修复 42 个图表组件，移除模块级别的同步导入
   - 提供加载状态和错误处理

### 使用方法

在浏览器控制台中：
```javascript
// 查看性能报告
window.__perfMonitor.printReport()

// 查看组件缓存统计
window.__perfMonitor.getComponentCacheStats()

// 查看内存使用
window.__perfMonitor.getMemoryUsage()
```
