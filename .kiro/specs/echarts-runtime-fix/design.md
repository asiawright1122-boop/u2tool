# Design Document

## Overview

本设计文档描述如何修复所有 48 个 ECharts 图表工具的运行时错误。错误的根本原因是 `exportChart` 函数在调用 `getEchartsInstance()` 时返回 `undefined`，导致无法访问 `setOption` 方法。

## Root Cause Analysis

### 错误信息

```
Uncaught (in promise) Error: Renderer 'undefined' is not imported. Please import it first.
at new ZRender (zrender.js:61:23)
```

和

```
TypeError: Cannot read properties of undefined (reading 'setOption')
at EChartsReactCore.updateEChartsOption (core.tsx:223:20)
```

### 真正的根本原因

**ECharts 5.x 需要显式导入和注册渲染器**

ECharts 5.x 采用了按需导入的架构，不再自动包含所有组件。必须：

1. **导入渲染器**：`CanvasRenderer` 或 `SVGRenderer`
2. **导入图表类型**：`BarChart`, `LineChart`, `PieChart` 等
3. **导入组件**：`TitleComponent`, `TooltipComponent`, `GridComponent` 等
4. **注册组件**：使用 `echarts.use([...])` 注册所有导入的组件

### 为什么之前能工作？

之前的代码可能：
- 使用了完整的 ECharts 包（`echarts` 而非 `echarts/core`）
- 或者在其他地方全局注册了组件

### 修复前的代码

```typescript
import * as echarts from 'echarts/core';
import type { EChartsOption } from 'echarts';
// ❌ 缺少渲染器和组件导入
```

### 修复后的代码

```typescript
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  // ... 其他图表类型
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  // ... 其他组件
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// ✅ 注册所有组件
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  // ... 所有导入的组件
  CanvasRenderer,
]);
```

## Solution Design

### Solution: 添加完整的 ECharts 导入（已实施）

在所有图表组件中添加必要的 ECharts 导入和注册：

```typescript
import * as echarts from 'echarts/core';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册 ECharts 组件
echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  MapChart,
  TreeChart,
  TreemapChart,
  GraphChart,
  GaugeChart,
  FunnelChart,
  ParallelChart,
  SankeyChart,
  BoxplotChart,
  CandlestickChart,
  EffectScatterChart,
  LinesChart,
  HeatmapChart,
  PictorialBarChart,
  ThemeRiverChart,
  SunburstChart,
  CustomChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  LegendComponent,
  RadarComponent,
  ToolboxComponent,
  DataZoomComponent,
  VisualMapComponent,
  TimelineComponent,
  CalendarComponent,
  GraphicComponent,
  MarkPointComponent,
  MarkLineComponent,
  MarkAreaComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);
```

**优点**:
- 解决了根本问题
- 符合 ECharts 5.x 的最佳实践
- 支持按需加载（虽然这里导入了所有组件）

**缺点**:
- 增加了代码量
- 每个组件都需要相同的导入（可以考虑创建共享配置）

### 未来优化方案

可以创建一个共享的 ECharts 配置文件：

```typescript
// src/lib/echarts-config.ts
import * as echarts from 'echarts/core';
import { /* ... 所有导入 */ } from 'echarts/charts';
// ...

echarts.use([/* ... 所有组件 */]);

export { echarts };
```

然后在组件中：

```typescript
import { echarts } from '@/lib/echarts-config';
```

这样可以：
- 减少重复代码
- 统一管理 ECharts 配置
- 更容易维护

## Implementation Strategy

### Phase 1: 快速修复（优先级 P0）

1. 修复 BarChartGenerator 和 LineChartGenerator（已修复依赖项的组件）
2. 测试验证修复效果
3. 如果有效，批量应用到其他 36 个组件

### Phase 2: 全面修复

1. 修复剩余的 10 个基础图表
2. 修复 16 个高级图表
3. 修复 8 个分组/堆叠图表
4. 修复 8 个特殊图表

### Phase 3: 测试和验证

1. 本地测试所有 48 个图表工具
2. 测试导出功能（PNG/SVG）
3. 测试数据更新和主题切换
4. 部署到 Vercel 并验证

## Rollback Plan

如果修复失败，回滚策略：

### Option A: 部分回滚

只回滚 `getChartOption` 的依赖项修改，保留其他有价值的修改：

```bash
# 回滚到 c78038f 的 getChartOption 实现
git show c78038f:src/components/tools/BarChartGenerator.tsx > temp.tsx
# 手动提取 getChartOption 部分
```

### Option B: 完全回滚

回滚到 c78038f commit：

```bash
git revert ec9a108..HEAD
git push origin main --force
```

### Option C: 混合方案

1. 保留依赖项修复（移除 `t` 和解构 `chartTheme`）
2. 添加安全检查到 `exportChart`
3. 如果仍然失败，则完全回滚

## Testing Plan

### Unit Tests

```typescript
describe('BarChartGenerator', () => {
  it('should handle export when chart is not ready', () => {
    const { getByText } = render(<BarChartGenerator />);
    const exportButton = getByText('Download PNG');
    
    // 立即点击，ECharts 可能还没准备好
    fireEvent.click(exportButton);
    
    // 不应该崩溃
    expect(console.warn).toHaveBeenCalledWith('ECharts instance not ready');
  });
  
  it('should export chart when ready', async () => {
    const { getByText } = render(<BarChartGenerator />);
    
    // 等待图表渲染
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument();
    });
    
    const exportButton = getByText('Download PNG');
    fireEvent.click(exportButton);
    
    // 应该成功导出
    expect(console.warn).not.toHaveBeenCalled();
  });
});
```

### Manual Tests

1. **加载测试**: 打开每个图表工具，验证图表能正常渲染
2. **导出测试**: 点击 PNG/SVG 导出按钮，验证能成功下载
3. **数据更新测试**: 修改数据，验证图表能正确更新
4. **主题切换测试**: 切换明暗主题，验证图表主题正确更新
5. **性能测试**: 验证修复后性能没有明显下降

## Documentation Updates

### development-rules.md

添加新的经验教训：

```markdown
### 2026-01-22 (第四次修复): ECharts 导出功能防御性编程

**问题**：修复 React Hooks 依赖项后，图表工具出现运行时错误
**错误**：`Cannot read properties of undefined (reading 'setOption')`
**原因**：
1. exportChart 函数没有检查 ECharts 实例是否存在
2. getEchartsInstance() 可能返回 undefined
3. 缺少防御性编程措施

**解决**：
1. 在 exportChart 函数中添加安全检查
2. 检查 chartRef.current 和 echartInstance 是否存在
3. 提供友好的错误提示而非崩溃

**经验教训**：
- **永远不要假设外部依赖一定存在**
- 访问可能为 undefined 的对象前必须检查
- 防御性编程是必须的，不是可选的
- 第三方库的方法可能返回 undefined
```

## Performance Considerations

添加安全检查对性能的影响：
- **CPU**: 可忽略（只是简单的 if 检查）
- **内存**: 无影响
- **用户体验**: 正面影响（防止崩溃）

## Security Considerations

无安全影响。

## Accessibility Considerations

如果导出失败，应该：
1. 显示可访问的错误消息
2. 使用 aria-live 区域通知屏幕阅读器
3. 提供重试选项

## Browser Compatibility

修复方案兼容所有现代浏览器。

## Monitoring and Logging

添加监控：
1. 记录 ECharts 实例创建失败的次数
2. 记录导出失败的原因
3. 使用 console.warn 而非 console.error（不是致命错误）
