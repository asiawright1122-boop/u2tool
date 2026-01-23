# 性能调试指南

## 🎯 目的

本指南帮助用户和开发者诊断"页面无响应"等性能问题。

---

## 🔧 使用内置性能监控工具

我们已经添加了一个性能监控工具，可以帮助追踪和诊断性能问题。

### 启用性能监控

性能监控在开发环境中自动启用。如果你在生产环境中遇到问题，可以：

1. 克隆项目到本地
2. 运行 `npm run dev`
3. 在浏览器中访问 `http://localhost:3000`

### 使用监控工具

打开浏览器控制台（F12），你会看到：

```
💡 Performance monitor available at window.__performanceMonitor
   Use __performanceMonitor.printReport() to see statistics
```

#### 查看性能报告

在控制台中输入：

```javascript
__performanceMonitor.printReport()
```

你会看到类似这样的报告：

```
📊 Performance Report
  🔧 Tool Load Statistics
    ┌─────────┬──────────────────┬───────────────┬──────────────┬────────────┐
    │ (index) │ Tool             │ Avg Load Time │ Max Load Time│ Load Count │
    ├─────────┼──────────────────┼───────────────┼──────────────┼────────────┤
    │ 0       │ 'excel-viewer'   │ '1234ms'      │ '1500ms'     │ 3          │
    │ 1       │ 'pdf-merger'     │ '987ms'       │ '1200ms'     │ 2          │
    └─────────┴──────────────────┴───────────────┴──────────────┴────────────┘
  
  💾 Memory Usage
    Current: 45.2 MB
    Limit: 2048 MB
    Trend: increasing
    ⚠️ Memory usage is increasing - possible memory leak!
```

#### 查看特定工具的统计

```javascript
__performanceMonitor.getToolLoadStats('excel-viewer')
```

输出：

```javascript
{
  count: 3,
  avgDuration: 1234,
  minDuration: 1000,
  maxDuration: 1500
}
```

#### 查看内存使用情况

```javascript
__performanceMonitor.getMemoryUsage()
```

输出：

```javascript
{
  current: {
    usedJSHeapSize: 47456789,
    totalJSHeapSize: 52428800,
    jsHeapSizeLimit: 2147483648
  },
  snapshots: [...],
  trend: 'increasing'
}
```

---

## 🔍 使用 Chrome DevTools 诊断

### 1. Performance Profiler

1. 打开 Chrome DevTools (F12)
2. 切换到 "Performance" 标签
3. 点击录制按钮（圆圈图标）
4. 重现问题（点击多个工具）
5. 停止录制
6. 分析结果：
   - 查找长任务（Long Tasks）
   - 检查主线程活动
   - 查看 JavaScript 执行时间

### 2. Memory Profiler

1. 打开 Chrome DevTools (F12)
2. 切换到 "Memory" 标签
3. 选择 "Heap snapshot"
4. 点击 "Take snapshot"
5. 操作应用（点击多个工具）
6. 再次点击 "Take snapshot"
7. 比较两个快照：
   - 查找 "Detached DOM tree"
   - 检查对象数量增长
   - 查看内存增长趋势

### 3. Network 面板

1. 打开 Chrome DevTools (F12)
2. 切换到 "Network" 标签
3. 重现问题
4. 检查：
   - 并发请求数量
   - 请求大小
   - 加载时间
   - 是否有失败的请求

---

## 📋 问题复现步骤模板

如果你遇到性能问题，请按照以下模板提供信息：

### 环境信息

```
浏览器: Chrome 120.0.0.0
操作系统: macOS 14.0
设备: MacBook Pro M1
网络: WiFi / 4G / 5G
```

### 复现步骤

```
1. 打开首页
2. 点击工具 A
3. 等待 2 秒
4. 点击工具 B
5. 等待 2 秒
6. 点击工具 C
7. 此时出现"页面无响应"警告
```

### 性能数据

```javascript
// 在控制台运行
__performanceMonitor.printReport()

// 复制输出结果
```

### 控制台错误

```
// 复制控制台中的所有错误和警告
```

### 截图

- Performance Profiler 截图
- Memory Profiler 截图
- Network 面板截图

---

## 🛠️ 常见问题和解决方案

### 问题 1: 工具加载缓慢

**症状**: 某个工具加载时间超过 1 秒

**诊断**:
```javascript
__performanceMonitor.getToolLoadStats('slow-tool-slug')
```

**可能原因**:
1. 工具依赖大型库（如 xlsx, pdf-lib）
2. 网络连接慢
3. 浏览器缓存未启用

**解决方案**:
1. 检查 Network 面板，确认是否是网络问题
2. 清除浏览器缓存并重试
3. 检查工具是否使用了动态导入

### 问题 2: 内存持续增长

**症状**: `__performanceMonitor.getMemoryUsage()` 显示 trend 为 'increasing'

**诊断**:
1. 使用 Memory Profiler 拍摄多个快照
2. 比较快照，查找增长的对象

**可能原因**:
1. 事件监听器未清理
2. 定时器未清理
3. 闭包引用未释放
4. DOM 节点未释放

**解决方案**:
1. 检查组件的 useEffect 清理函数
2. 确保所有 setTimeout/setInterval 都有对应的 clear
3. 检查是否有 detached DOM 节点

### 问题 3: 页面无响应

**症状**: 浏览器显示"页面无响应"警告

**诊断**:
1. 使用 Performance Profiler 录制
2. 查找长任务（Long Tasks）

**可能原因**:
1. 主线程被阻塞
2. 大量同步计算
3. 无限循环
4. 大量 DOM 操作

**解决方案**:
1. 将耗时操作移到 Web Worker
2. 使用 requestIdleCallback 延迟非关键操作
3. 优化算法，减少计算量
4. 使用虚拟滚动减少 DOM 节点

---

## 🚀 性能优化建议

### 1. 减少初始加载

- 使用代码分割
- 懒加载非关键组件
- 优化图片大小

### 2. 优化渲染性能

- 使用 React.memo 避免不必要的重渲染
- 优化 useEffect 依赖数组
- 避免在渲染函数中创建新对象/函数

### 3. 内存管理

- 及时清理事件监听器
- 清理定时器
- 避免闭包陷阱

### 4. 网络优化

- 启用 HTTP/2
- 使用 CDN
- 压缩资源

---

## 📞 获取帮助

如果你按照本指南操作后仍然无法解决问题，请：

1. 收集上述所有诊断信息
2. 创建 GitHub Issue
3. 附上性能报告和截图
4. 描述详细的复现步骤

我们会尽快帮助你解决问题！

---

## 🔗 相关资源

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Chrome DevTools Memory](https://developer.chrome.com/docs/devtools/memory-problems/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)

---

**最后更新**: 2026-01-23
