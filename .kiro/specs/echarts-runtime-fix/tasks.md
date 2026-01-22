# Tasks

## Task 1: 诊断和验证问题

- [ ] 1.1 在本地启动开发服务器，复现错误
- [ ] 1.2 打开浏览器开发者工具，查看完整的错误堆栈
- [ ] 1.3 确认错误发生在 exportChart 函数中
- [ ] 1.4 检查 chartRef.current 和 getEchartsInstance() 的返回值
- [ ] 1.5 对比修复前后的代码差异，确认破坏性变更

## Task 2: 修复 BarChartGenerator（测试修复方案）

- [ ] 2.1 在 exportChart 函数开头添加 chartRef.current 检查
- [ ] 2.2 添加 echartInstance 存在性检查
- [ ] 2.3 添加 console.warn 日志用于调试
- [ ] 2.4 测试修复效果：加载图表、导出 PNG、导出 SVG
- [ ] 2.5 验证没有控制台错误

## Task 3: 修复 LineChartGenerator（验证修复模式）

- [ ] 3.1 应用与 BarChartGenerator 相同的修复
- [ ] 3.2 测试修复效果
- [ ] 3.3 确认修复模式有效

## Task 4: 批量修复基础图表（8个）

- [ ] 4.1 修复 PieChartGenerator
- [ ] 4.2 修复 RadarChartGenerator
- [ ] 4.3 修复 ScatterChartGenerator
- [ ] 4.4 修复 AreaChartGenerator
- [ ] 4.5 修复 FunnelChartGenerator
- [ ] 4.6 修复 GaugeChartGenerator
- [ ] 4.7 修复 HeatmapChartGenerator
- [ ] 4.8 修复 TreemapChartGenerator

## Task 5: 批量修复高级图表（16个）

- [ ] 5.1 修复 DoughnutChartGenerator
- [ ] 5.2 修复 SankeyChartGenerator
- [ ] 5.3 修复 SunburstChartGenerator
- [ ] 5.4 修复 CandlestickChartGenerator
- [ ] 5.5 修复 BoxplotChartGenerator
- [ ] 5.6 修复 WordCloudGenerator
- [ ] 5.7 修复 GraphChartGenerator
- [ ] 5.8 修复 CalendarHeatmapGenerator
- [ ] 5.9 修复 PolarBarChartGenerator
- [ ] 5.10 修复 ParallelChartGenerator
- [ ] 5.11 修复 BubbleChartGenerator
- [ ] 5.12 修复 TreeChartGenerator
- [ ] 5.13 修复 ThemeRiverGenerator
- [ ] 5.14 修复 GanttChartGenerator
- [ ] 5.15 修复 VennDiagramGenerator
- [ ] 5.16 修复 TimelineChartGenerator

## Task 6: 批量修复分组/堆叠图表（8个）

- [ ] 6.1 修复 NightingaleRoseChartGenerator
- [ ] 6.2 修复 GroupedBarChartGenerator
- [ ] 6.3 修复 StackedBarChartGenerator
- [ ] 6.4 修复 GroupedLineChartGenerator
- [ ] 6.5 修复 StepLineChartGenerator
- [ ] 6.6 修复 WaterfallChartGenerator
- [ ] 6.7 修复 StackedAreaChartGenerator
- [ ] 6.8 修复 PositiveNegativeBarChartGenerator

## Task 7: 批量修复特殊图表（8个）

- [ ] 7.1 修复 PercentageStackedBarChartGenerator
- [ ] 7.2 修复 MixedChartGenerator
- [ ] 7.3 修复 RingProgressChartGenerator
- [ ] 7.4 修复 LiquidFillChartGenerator
- [ ] 7.5 修复 MultiRingChartGenerator
- [ ] 7.6 修复 HalfDoughnutChartGenerator
- [ ] 7.7 修复 NestedPieChartGenerator
- [ ] 7.8 修复 PictorialBarChartGenerator

## Task 8: 本地测试验证

- [ ] 8.1 测试所有 48 个图表工具能正常加载
- [ ] 8.2 测试导出功能（PNG/SVG）
- [ ] 8.3 测试数据更新功能
- [ ] 8.4 测试主题切换功能
- [ ] 8.5 检查控制台无错误和警告
- [ ] 8.6 验证性能没有明显下降

## Task 9: 代码质量检查

- [ ] 9.1 运行 TypeScript 编译：`npm run build`
- [ ] 9.2 运行 ESLint 检查：`npm run lint`
- [ ] 9.3 运行测试：`npm run test`
- [ ] 9.4 检查代码格式一致性
- [ ] 9.5 移除调试用的 console.warn（可选）

## Task 10: Git 提交和部署

- [ ] 10.1 提交修复到 Git
- [ ] 10.2 推送到 GitHub
- [ ] 10.3 等待 Vercel 自动部署
- [ ] 10.4 验证生产环境修复效果
- [ ] 10.5 测试生产环境的图表工具

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
