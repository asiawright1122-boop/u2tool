# Requirements Document

## Introduction

修复所有 48 个 ECharts 图表工具在运行时出现的 "Failed to load" 错误。错误信息显示 `Cannot read properties of undefined (reading 'setOption')`，发生在 ToolWrapper.tsx 第 14 行。虽然代码构建成功，但在浏览器中加载图表时失败。

## Glossary

- **Runtime_Error**: 运行时错误，代码编译通过但执行时失败
- **ECharts_Instance**: ECharts 图表实例，通过 `echartInstance.setOption()` 设置图表配置
- **ReactEChartsCore**: echarts-for-react 库提供的 React 组件
- **chartRef**: React ref，用于访问 ECharts 实例
- **getEchartsInstance()**: ReactEChartsCore 提供的方法，返回 ECharts 实例

## Requirements

### Requirement 1: 诊断运行时错误根本原因

**User Story:** 作为开发者，我需要准确诊断运行时错误的根本原因，以便制定正确的修复方案。

#### Acceptance Criteria

1. WHEN 分析错误堆栈时，THE System SHALL 确定错误发生的确切位置和调用链
2. WHEN 检查 chartRef 时，THE System SHALL 验证 ref 是否正确初始化
3. WHEN 检查 getEchartsInstance() 调用时，THE System SHALL 确认调用时机是否正确
4. WHEN 分析组件生命周期时，THE System SHALL 确认 ECharts 实例创建时机
5. WHEN 对比修复前后代码时，THE System SHALL 识别破坏性变更

### Requirement 2: 修复 exportChart 函数

**User Story:** 作为开发者，我需要确保 exportChart 函数在调用时 ECharts 实例已经存在。

#### Acceptance Criteria

1. WHEN exportChart 被调用时，THE System SHALL 检查 chartRef.current 是否存在
2. WHEN getEchartsInstance() 被调用时，THE System SHALL 确保返回值不为 undefined
3. WHEN ECharts 实例不存在时，THE System SHALL 提供友好的错误提示
4. WHEN 添加安全检查时，THE System SHALL 不影响正常的导出功能
5. FOR ALL 48 个图表组件，THE System SHALL 添加相同的安全检查

### Requirement 3: 验证 ReactEChartsCore 配置

**User Story:** 作为开发者，我需要确保 ReactEChartsCore 组件配置正确，能够正常创建 ECharts 实例。

#### Acceptance Criteria

1. WHEN 配置 ReactEChartsCore 时，THE System SHALL 确保 echarts 参数正确传递
2. WHEN 配置 option 时，THE System SHALL 确保 getChartOption() 返回有效配置
3. WHEN 配置 ref 时，THE System SHALL 确保 ref 正确绑定到组件
4. WHEN 配置 notMerge 和 lazyUpdate 时，THE System SHALL 使用正确的值
5. WHEN 组件渲染时，THE System SHALL 确保 ECharts 实例成功创建

### Requirement 4: 修复依赖项配置

**User Story:** 作为开发者，我需要确保 useCallback 的依赖项配置正确，不会导致 ECharts 实例丢失。

#### Acceptance Criteria

1. WHEN getChartOption 使用 useCallback 时，THE System SHALL 确保依赖项完整
2. WHEN 依赖项包含 chartTheme 属性时，THE System SHALL 确保属性值稳定
3. WHEN 翻译函数 t 被使用时，THE System SHALL 正确处理其在依赖项中的位置
4. WHEN 依赖项变化时，THE System SHALL 不影响 ECharts 实例的存在
5. FOR ALL 48 个图表组件，THE System SHALL 验证依赖项配置正确

### Requirement 5: 添加防御性编程

**User Story:** 作为开发者，我需要添加防御性编程措施，确保即使出现意外情况也不会导致崩溃。

#### Acceptance Criteria

1. WHEN 访问 chartRef.current 时，THE System SHALL 先检查其是否存在
2. WHEN 调用 getEchartsInstance() 时，THE System SHALL 检查返回值
3. WHEN ECharts 实例不存在时，THE System SHALL 记录警告信息
4. WHEN 导出功能失败时，THE System SHALL 显示用户友好的错误消息
5. WHEN 添加检查时，THE System SHALL 不影响正常功能

### Requirement 6: 测试修复效果

**User Story:** 作为开发者，我需要全面测试修复效果，确保所有图表工具都能正常工作。

#### Acceptance Criteria

1. WHEN 测试图表加载时，THE System SHALL 验证图表能成功渲染
2. WHEN 测试导出功能时，THE System SHALL 验证 PNG/SVG 导出正常
3. WHEN 测试数据更新时，THE System SHALL 验证图表能正确更新
4. WHEN 测试主题切换时，THE System SHALL 验证主题切换正常
5. FOR ALL 48 个图表工具，THE System SHALL 执行完整测试
6. WHEN 测试完成后，THE System SHALL 确认没有控制台错误

### Requirement 7: 回滚策略

**User Story:** 作为开发者，如果修复失败，我需要有明确的回滚策略。

#### Acceptance Criteria

1. WHEN 修复失败时，THE System SHALL 能够回滚到上一个工作版本
2. WHEN 回滚时，THE System SHALL 保留有价值的修改（如翻译键修复）
3. WHEN 回滚时，THE System SHALL 撤销破坏性变更
4. WHEN 回滚完成后，THE System SHALL 验证图表工具恢复正常
5. WHEN 记录回滚原因时，THE System SHALL 提供详细的技术分析

### Requirement 8: 文档更新

**User Story:** 作为开发者，我需要详细的文档说明问题原因和解决方案。

#### Acceptance Criteria

1. WHEN 文档化问题时，THE System SHALL 提供完整的错误堆栈和截图
2. WHEN 说明根本原因时，THE System SHALL 解释为什么之前的修复导致问题
3. WHEN 提供解决方案时，THE System SHALL 包含代码示例
4. WHEN 更新开发规则时，THE System SHALL 添加防御性编程最佳实践
5. WHEN 记录经验教训时，THE System SHALL 说明如何避免类似问题

## Affected Components

### 基础图表 (10个)
1. bar-chart-generator
2. line-chart-generator
3. pie-chart-generator
4. radar-chart-generator
5. scatter-chart-generator
6. area-chart-generator
7. funnel-chart-generator
8. gauge-chart-generator
9. heatmap-chart-generator
10. treemap-chart-generator

### 高级图表 (16个)
11. doughnut-chart-generator
12. sankey-chart-generator
13. sunburst-chart-generator
14. candlestick-chart-generator
15. boxplot-chart-generator
16. wordcloud-generator
17. graph-chart-generator
18. calendar-heatmap-generator
19. polar-bar-chart-generator
20. parallel-chart-generator
21. bubble-chart-generator
22. tree-chart-generator
23. theme-river-generator
24. gantt-chart-generator
25. venn-diagram-generator
26. timeline-chart-generator

### 分组/堆叠图表 (8个)
27. nightingale-rose-chart-generator
28. grouped-bar-chart-generator
29. stacked-bar-chart-generator
30. grouped-line-chart-generator
31. step-line-chart-generator
32. waterfall-chart-generator
33. stacked-area-chart-generator
34. positive-negative-bar-chart-generator

### 特殊图表 (8个)
35. percentage-stacked-bar-chart-generator
36. mixed-chart-generator
37. ring-progress-chart-generator
38. liquid-fill-chart-generator
39. multi-ring-chart-generator
40. half-doughnut-chart-generator
41. nested-pie-chart-generator
42. pictorial-bar-chart-generator

## Priority

**P0 - Critical**: 所有图表工具都无法使用，严重影响用户体验。

## Success Criteria

1. 所有 48 个图表工具都能正常加载和渲染
2. 导出功能（PNG/SVG）正常工作
3. 没有控制台错误或警告
4. 性能没有明显下降
5. 代码通过 TypeScript 编译和 ESLint 检查
