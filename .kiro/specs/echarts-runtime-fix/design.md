# Design Document

## Overview

本设计文档描述如何修复所有 48 个 ECharts 图表工具的运行时错误。错误的根本原因是 `exportChart` 函数在调用 `getEchartsInstance()` 时返回 `undefined`，导致无法访问 `setOption` 方法。

## Root Cause Analysis

### 错误信息

```
Cannot read properties of undefined (reading 'setOption')
at ToolWrapper.tsx:14
```

### 错误发生位置

虽然错误堆栈显示在 ToolWrapper.tsx:14，但实际错误发生在图表组件的 `exportChart` 函数中：

```typescript
const exportChart = (format: 'png' | 'svg') => {
  if (chartRef.current) {
    const echartInstance = chartRef.current.getEchartsInstance();
    // echartInstance 是 undefined！
    const url = echartInstance.getDataURL({  // ❌ 错误发生在这里
      type: format === 'svg' ? 'svg' : 'png',
      pixelRatio: 2,
      backgroundColor: chartTheme.backgroundColor,
    });
    // ...
  }
};
```

### 可能的原因

1. **ECharts 实例未初始化**: ReactEChartsCore 组件还没有完成初始化
2. **ref 绑定问题**: chartRef 没有正确绑定到 ReactEChartsCore 组件
3. **时序问题**: exportChart 在 ECharts 实例创建之前被调用
4. **依赖项问题**: useCallback 的依赖项配置导致函数引用丢失

### 对比修复前后的代码

**修复前（c78038f）**:
```typescript
const getChartOption = useCallback((): EChartsOption => {
  // ...
}, [data, chartTitle, colorTheme, showLegend, showGrid, horizontal, t, chartTheme]);
```

**修复后（ec9a108）**:
```typescript
const getChartOption = useCallback((): EChartsOption => {
  // ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data, chartTitle, colorTheme, showLegend, showGrid, horizontal, chartTheme.backgroundColor, chartTheme.textColor, chartTheme.legendText, chartTheme.splitLineColor, chartTheme.axisLineColor, chartTheme.axisLabelColor, chartTheme.labelColor]);
```

**关键差异**:
- 移除了翻译函数 `t`
- 将 `chartTheme` 对象替换为具体属性

这些修改本身是正确的，但可能触发了其他问题。

## Solution Design

### Solution 1: 添加安全检查（推荐）

在 `exportChart` 函数中添加防御性检查：

```typescript
const exportChart = (format: 'png' | 'svg') => {
  if (chartRef.current) {
    const echartInstance = chartRef.current.getEchartsInstance();
    
    // ✅ 添加安全检查
    if (!echartInstance) {
      console.warn('ECharts instance not ready');
      return;
    }
    
    const url = echartInstance.getDataURL({
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
```

**优点**:
- 简单直接，不影响其他逻辑
- 防止崩溃，提供友好的错误处理
- 适用于所有图表组件

**缺点**:
- 治标不治本，没有解决 ECharts 实例为 undefined 的根本原因

### Solution 2: 使用 useEffect 确保实例存在

添加 useEffect 来验证 ECharts 实例：

```typescript
const [isChartReady, setIsChartReady] = useState(false);

useEffect(() => {
  if (chartRef.current) {
    const instance = chartRef.current.getEchartsInstance();
    if (instance) {
      setIsChartReady(true);
    }
  }
}, []);

const exportChart = (format: 'png' | 'svg') => {
  if (!isChartReady || !chartRef.current) {
    alert(t('chartNotReady'));
    return;
  }
  
  const echartInstance = chartRef.current.getEchartsInstance();
  // ...
};
```

**优点**:
- 明确跟踪 ECharts 实例状态
- 可以禁用导出按钮直到图表准备好

**缺点**:
- 增加了状态管理复杂度
- 需要添加翻译键

### Solution 3: 延迟导出调用

使用 setTimeout 延迟导出调用，确保 ECharts 实例已创建：

```typescript
const exportChart = (format: 'png' | 'svg') => {
  // 延迟执行，确保 ECharts 实例已创建
  setTimeout(() => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      if (!echartInstance) {
        console.warn('ECharts instance not ready');
        return;
      }
      // ...
    }
  }, 100);
};
```

**优点**:
- 简单实现
- 给 ECharts 实例创建留出时间

**缺点**:
- 不可靠，100ms 可能不够
- 用户体验差（延迟）

### Solution 4: 检查 ReactEChartsCore 配置

验证 ReactEChartsCore 组件配置是否正确：

```typescript
<ReactEChartsCore
  ref={chartRef}
  echarts={echarts}  // ✅ 确保正确导入
  option={getChartOption()}  // ✅ 确保返回有效配置
  style={{ height: '400px', width: '100%' }}
  notMerge={true}
  lazyUpdate={true}
/>
```

检查点：
1. `echarts` 是否正确导入：`import * as echarts from 'echarts/core'`
2. `getChartOption()` 是否返回有效的 EChartsOption
3. `ref` 是否正确绑定

## Recommended Approach

**采用 Solution 1 + Solution 4 的组合**：

1. **立即修复**: 在所有 48 个图表组件的 `exportChart` 函数中添加安全检查
2. **验证配置**: 检查 ReactEChartsCore 配置是否正确
3. **测试验证**: 逐个测试图表工具，确保修复有效

### 修复模式

```typescript
// 修复前
const exportChart = (format: 'png' | 'svg') => {
  if (chartRef.current) {
    const echartInstance = chartRef.current.getEchartsInstance();
    const url = echartInstance.getDataURL({  // ❌ 可能崩溃
      // ...
    });
    // ...
  }
};

// 修复后
const exportChart = (format: 'png' | 'svg') => {
  if (!chartRef.current) {
    console.warn('Chart ref not available');
    return;
  }
  
  const echartInstance = chartRef.current.getEchartsInstance();
  if (!echartInstance) {
    console.warn('ECharts instance not ready');
    return;
  }
  
  const url = echartInstance.getDataURL({  // ✅ 安全
    type: format === 'svg' ? 'svg' : 'png',
    pixelRatio: 2,
    backgroundColor: chartTheme.backgroundColor,
  });

  const link = document.createElement('a');
  link.download = `${slug}-chart-${Date.now()}.${format}`;
  link.href = url;
  link.click();
};
```

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
