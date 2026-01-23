# 性能验证指南

## 快速验证步骤

### 1. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 或 http://localhost:3001 启动。

### 2. 打开浏览器开发者工具

- Chrome: `F12` 或 `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- 切换到 Console 标签页

### 3. 验证性能监控工具

在控制台输入：

```javascript
window.__perfMonitor.printReport()
```

应该看到类似以下输出：

```
📊 Performance Report
🌐 Web Vitals
  CLS: 0.001 (threshold: < 0.1) ✅
  INP: 50ms (threshold: < 200ms) ✅
  LCP: 1200ms (threshold: < 2500ms) ✅
  TTFB: 100ms (threshold: < 800ms) ✅
🐢 Long Tasks
  No long tasks detected ✅
💾 Memory Usage
  Current: 50.2 MB / 100.5 MB
  Growth: +5.1 MB (10.2%)
  Trend: stable
🔧 Tool Load Times
  (工具加载时间统计)
```

### 4. 执行压力测试

1. 连续快速点击 10-20 个不同的工具
2. 观察是否出现 "页面无响应" 警告
3. 检查控制台是否有 Long Task 警告

### 5. 检查内存使用

```javascript
// 查看内存使用情况
window.__perfMonitor.getMemoryUsage()
```

预期结果：
- 内存增长应该 < 50MB（20次操作后）
- 趋势应该是 "stable" 而不是 "increasing"

## 性能目标

| 指标 | 目标值 | 说明 |
|------|--------|------|
| 工具加载时间 (P90) | < 1000ms | 90% 的工具应在 1 秒内加载 |
| 主线程阻塞 | < 50ms | 单次任务不应超过 50ms |
| 内存增长 | < 50MB | 20次操作后内存增长不超过 50MB |
| CLS | < 0.1 | 累积布局偏移 |
| INP | < 200ms | 交互到下一次绘制 |
| LCP | < 2500ms | 最大内容绘制 |

## 常见问题排查

### 问题：`window.__perfMonitor` 未定义

**原因**：性能监控只在本地开发环境启用

**解决**：确保在 localhost 或 127.0.0.1 访问

### 问题：Long Task 警告频繁出现

**原因**：可能是大型库加载或复杂计算

**解决**：
1. 检查是否有未优化的同步操作
2. 考虑使用 Web Worker 处理复杂计算

### 问题：内存持续增长

**原因**：可能存在内存泄漏

**解决**：
1. 检查组件是否正确清理资源
2. 使用 Chrome DevTools Memory 面板分析

## 已实现的优化

1. **动态导入队列** - 限制并发导入数量，防止主线程阻塞
2. **组件缓存** - LRU 缓存策略，避免重复加载
3. **加载超时处理** - 10 秒超时，提供重试选项
4. **React.memo** - 避免不必要的重渲染
5. **startTransition** - 标记低优先级更新
6. **内存压力检测** - 自动清理资源

## 相关文件

- `src/components/PerformanceMonitor.tsx` - 性能监控组件
- `src/lib/import-queue.ts` - 动态导入队列
- `src/lib/component-cache.ts` - 组件缓存
- `src/components/tools/ToolWrapper.tsx` - 工具包装器
- `scripts/performance-audit/performance-benchmark.ts` - 性能基准测试
