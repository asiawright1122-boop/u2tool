# 图表工具翻译键缺失和页面加载卡顿修复

## Introduction

图表工具（ECharts 相关工具）在加载时出现两个关键问题：
1. 翻译键查找失败，导致页面显示 "MISSING: tools.xxx.loadSample" 等未翻译的键
2. 页面加载卡顿，用户看到持续的加载动画，无法正常交互

这些问题影响了至少 6 个图表工具的正常使用，严重降低了用户体验。

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN 用户访问图表工具页面（如 Area Chart Generator）THEN 页面显示翻译键缺失错误 "MISSING: tools.area-chart-generator.loadSample"

1.2 WHEN 用户访问图表工具页面 THEN 页面加载动画持续显示，页面卡顿无法正常加载

1.3 WHEN 组件尝试查找翻译键 THEN 使用错误的键名格式（如 `translations['tools']['Area']` 而非 `translations['tools']['area-chart-generator']`）导致查找失败

1.4 WHEN ECharts 库在模块级别同步导入时 THEN 主线程被阻塞，导致页面加载缓慢

### Expected Behavior (Correct)

2.1 WHEN 用户访问图表工具页面 THEN 所有翻译键正确加载，页面显示正确的中文/英文/其他语言文本

2.2 WHEN 用户访问图表工具页面 THEN 页面快速加载完成，用户可以立即看到工具界面和交互元素

2.3 WHEN 组件查找翻译键时 THEN 使用正确的键名格式（`translations['tools']['area-chart-generator']`）确保查找成功

2.4 WHEN ECharts 库加载时 THEN 使用异步动态导入和 requestIdleCallback 延迟加载，避免阻塞主线程

### Unchanged Behavior (Regression Prevention)

3.1 WHEN 用户访问非图表工具页面 THEN 系统 SHALL CONTINUE TO 正常加载和显示翻译内容

3.2 WHEN 用户切换语言时 THEN 系统 SHALL CONTINUE TO 正确更新所有页面的语言显示

3.3 WHEN 用户使用其他工具（非图表工具）时 THEN 系统 SHALL CONTINUE TO 保持原有的加载性能和用户体验

3.4 WHEN 图表工具已正确加载后 THEN 系统 SHALL CONTINUE TO 支持所有现有的图表功能（导出、配置等）
