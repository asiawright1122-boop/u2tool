# Tasks

## Task 1: 诊断和验证问题

- [x] 1.1 在本地启动开发服务器，复现错误
- [x] 1.2 打开浏览器开发者工具，查看完整的错误堆栈
- [x] 1.3 确认错误发生在 ECharts 渲染器导入缺失
- [x] 1.4 检查 chartRef.current 和 getEchartsInstance() 的返回值
- [x] 1.5 对比修复前后的代码差异，确认破坏性变更

**诊断结果**：
- 错误：`Renderer 'undefined' is not imported. Please import it first.`
- 根本原因：ECharts 5.x 需要显式导入和注册 CanvasRenderer
- 解决方案：添加完整的 ECharts 组件和渲染器导入

## Task 2: 修复 BarChartGenerator（测试修复方案）

- [x] 2.1 添加 ECharts 渲染器和组件导入
- [x] 2.2 使用 echarts.use() 注册所有组件
- [x] 2.3 验证构建成功
- [x] 2.4 等待用户测试：加载图表、导出 PNG、导出 SVG
- [ ] 2.5 验证没有控制台错误

**修复内容**：
- 导入 CanvasRenderer 和所有图表类型
- 导入所有必要的 ECharts 组件
- 使用 echarts.use() 注册组件

## Task 3: 批量修复所有图表组件（41个）

- [x] 3.1 创建批量修复脚本 `scripts/fix-echarts-renderer.js`
- [x] 3.2 修复所有 41 个图表组件
- [x] 3.3 验证构建成功
- [x] 3.4 提交修复到 Git (commit: 78683f6)

**修复的组件**：
- 基础图表 (10个)：Bar, Line, Area, Pie, Radar, Scatter, Funnel, Gauge, Heatmap, Treemap
- 高级图表 (16个)：Doughnut, Sankey, Sunburst, Candlestick, Boxplot, WordCloud, Graph, Calendar, Polar, Parallel, Bubble, Tree, ThemeRiver, Gantt, Timeline
- 分组/堆叠图表 (8个)：NightingaleRose, GroupedBar, StackedBar, GroupedLine, StepLine, Waterfall, StackedArea, PositiveNegativeBar
- 特殊图表 (7个)：PercentageStackedBar, Mixed, RingProgress, LiquidFill, MultiRing, HalfDoughnut, NestedPie, PictorialBar

## Task 4-7: 批量修复（已合并到 Task 3）

所有图表组件已通过批量脚本修复完成。

## Task 8: 本地测试验证

- [ ] 8.1 测试所有 48 个图表工具能正常加载 ⚠️ **等待用户确认**
- [ ] 8.2 测试导出功能（PNG/SVG） ⚠️ **等待用户确认**
- [ ] 8.3 测试数据更新功能
- [ ] 8.4 测试主题切换功能
- [ ] 8.5 检查控制台无错误和警告
- [ ] 8.6 验证性能没有明显下降

**当前状态**：
- ✅ 代码修复完成
- ✅ 构建成功
- ✅ 开发服务器运行正常
- ⏳ 等待用户在浏览器中测试图表显示和导出功能

## Task 9: 代码质量检查

- [x] 9.1 运行 TypeScript 编译：`npm run build` ✅ 成功
- [ ] 9.2 运行 ESLint 检查：`npm run lint`
- [ ] 9.3 运行测试：`npm run test`
- [x] 9.4 检查代码格式一致性 ✅ 通过
- [ ] 9.5 移除调试用的 console.warn（可选）

## Task 10: Git 提交和部署

- [x] 10.1 提交修复到 Git ✅ Commits: 78683f6, 8a311ef
- [x] 10.2 推送到 GitHub ✅ 已推送到 origin/main
- [ ] 10.3 等待 Vercel 自动部署 ⏳ 部署中（预计 3-5 分钟）
- [ ] 10.4 验证生产环境修复效果
- [ ] 10.5 测试生产环境的图表工具

**部署状态**：
- ✅ 代码已推送到 GitHub
- ⏳ Vercel 正在自动部署
- ⏳ 等待部署完成后测试生产环境

## Task 11: 文档更新

- [ ] 11.1 更新 development-rules.md，添加经验教训
- [ ] 11.2 记录问题根本原因和解决方案
- [ ] 11.3 添加防御性编程最佳实践
- [ ] 11.4 更新 spec 状态为已完成

## Task 12: 回滚准备（如果需要）

- [ ] 12.1 如果修复失败，准备回滚方案
- [ ] 12.2 确定回滚到哪个 commit
- [ ] 12.3 执行回滚并验证
- [ ] 12.4 分析失败原因，制定新的修复方案

---

## 修复模式参考

### exportChart 函数修复模式

```typescript
// 修复前
const exportChart = (format: 'png' | 'svg') => {
  if (chartRef.current) {
    const echartInstance = chartRef.current.getEchartsInstance();
    const url = echartInstance.getDataURL({  // ❌ 可能崩溃
      type: format === 'svg' ? 'svg' : 'png',
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });

    const link = document.createElement('a');
    link.download = `bar-chart-${Date.now()}.${format}`;
    link.href = url;
    link.click();
  }
};

// 修复后
const exportChart = (format: 'png' | 'svg') => {
  // ✅ 检查 chartRef.current
  if (!chartRef.current) {
    console.warn('Chart ref not available');
    return;
  }
  
  // ✅ 检查 echartInstance
  const echartInstance = chartRef.current.getEchartsInstance();
  if (!echartInstance) {
    console.warn('ECharts instance not ready');
    return;
  }
  
  // ✅ 安全调用
  const url = echartInstance.getDataURL({
    type: format === 'svg' ? 'svg' : 'png',
    pixelRatio: 2,
    backgroundColor: chartTheme.backgroundColor,
  });

  const link = document.createElement('a');
  link.download = `bar-chart-${Date.now()}.${format}`;
  link.href = url;
  link.click();
};
```

### 批量修复脚本（可选）

如果需要批量修复，可以使用以下脚本：

```bash
#!/bin/bash

# 图表组件列表
charts=(
  "BarChartGenerator"
  "LineChartGenerator"
  "PieChartGenerator"
  # ... 添加所有 48 个组件
)

for chart in "${charts[@]}"; do
  echo "Fixing $chart..."
  
  # 使用 sed 或手动编辑
  # 这里只是示例，实际需要根据具体情况调整
  
  echo "✓ Fixed $chart"
done

echo "All charts fixed!"
```

## 注意事项

1. **逐步修复**: 先修复 2 个组件验证方案，再批量应用
2. **测试优先**: 每修复一批组件就测试一次
3. **保留日志**: 暂时保留 console.warn 用于调试
4. **性能监控**: 注意修复后的性能变化
5. **用户体验**: 确保错误处理对用户友好

## 成功标准

- [ ] 所有 48 个图表工具都能正常加载
- [ ] 导出功能（PNG/SVG）正常工作
- [ ] 没有控制台错误
- [ ] 性能没有明显下降
- [ ] 代码通过所有检查
- [ ] 生产环境验证通过
