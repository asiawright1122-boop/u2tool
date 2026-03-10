# 图表工具翻译键缺失和页面加载卡顿修复 - 设计文档

## Overview

本设计文档针对图表工具（ECharts 相关工具）的两个关键问题进行系统分析和修复方案设计：

1. **翻译键查找失败**：组件使用错误的键名格式查找翻译，导致页面显示 "MISSING: tools.xxx.loadSample" 等未翻译的键
2. **页面加载卡顿**：ECharts 库在模块级别同步导入，阻塞主线程，导致页面加载缓慢

这两个问题严重影响了用户体验，需要通过统一的翻译键查找机制和异步懒加载方案来解决。

## Glossary

- **Bug_Condition (C)**: 触发 bug 的条件 - 用户访问图表工具页面时，翻译键查找失败或页面加载卡顿
- **Property (P)**: 期望的正确行为 - 翻译键正确加载，页面快速响应
- **Preservation**: 需要保持不变的行为 - 非图表工具的页面加载和翻译功能不受影响
- **EChartsWrapper**: 位于 `src/components/tools/EChartsWrapper.svelte` 的 ECharts 包装组件
- **Translation Scope**: 翻译对象的作用域，如 `translations['tools']['boxplot-chart-generator']`
- **Module-level Import**: 在模块顶部进行的同步导入，会在模块加载时立即执行
- **Dynamic Import**: 使用 `import()` 进行的异步导入，可以延迟加载

## Bug Details

### Bug Condition

图表工具在以下条件下会出现翻译键缺失和页面加载卡顿的问题：

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type PageLoadEvent
  OUTPUT: boolean
  
  RETURN input.toolType IN ['chart-generator', 'echarts-tool']
         AND input.action IN ['page-load', 'language-switch']
         AND (translationKeyLookupFails(input) OR pageLoadStalls(input))
END FUNCTION
```

### Examples

**Example 1: 翻译键查找失败**
- 用户访问 Boxplot Chart Generator 页面
- 组件尝试查找翻译键 `t('loadSample')`
- 当前实现使用 `translations['tools']['boxplot-chart-generator']['loadSample']` 查找
- 但翻译文件中的键名可能不匹配，导致返回 "MISSING: tools.boxplot-chart-generator.loadSample"
- 页面显示未翻译的键名而非实际的中文/英文文本

**Example 2: 页面加载卡顿**
- 用户点击图表工具链接
- 浏览器开始加载 BoxplotChartGenerator.svelte 组件
- 组件在模块级别导入 ECharts 库（~1MB）
- 主线程被阻塞数秒，用户看到空白页面或加载动画
- 浏览器可能显示 "页面无响应" 警告

**Example 3: 语言切换时翻译键缺失**
- 用户在图表工具页面切换语言（如从英文切换到中文）
- 翻译对象更新，但翻译键查找逻辑不正确
- 某些翻译键无法找到，页面显示混合的翻译和未翻译的键

**Example 4: 多个图表工具同时加载**
- 用户快速切换多个图表工具
- 每个工具都会同步加载 ECharts 库
- 主线程被多次阻塞，导致页面完全无响应

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- 非图表工具的页面加载和翻译功能必须保持不变
- 其他工具（如文本转换、计算工具等）的加载性能不受影响
- 语言切换功能对所有页面都继续正常工作
- 现有的图表功能（导出、配置等）在修复后继续可用

**Scope:**
所有不涉及图表工具的输入应该完全不受此修复影响。这包括：
- 访问非图表工具页面
- 在非图表工具中进行语言切换
- 使用其他工具的导出、下载等功能
- 访问首页、分类页面等非工具页面

## Hypothesized Root Cause

基于 bug 描述和代码分析，最可能的问题包括：

1. **翻译键查找逻辑不一致**
   - 不同的图表组件使用不同的翻译键查找方式
   - 翻译文件中的键名结构与组件中的查找逻辑不匹配
   - 缺乏统一的翻译键查找工具函数

2. **ECharts 库同步加载阻塞主线程**
   - 所有图表组件在模块级别导入 ECharts 库
   - 模块加载时会立即执行 `echarts.use([...])` 注册所有图表类型
   - 库体积大（~1MB），同步加载会阻塞主线程数秒

3. **缺乏加载状态管理**
   - EChartsWrapper 虽然有加载状态，但没有提供清晰的用户反馈
   - 用户不知道页面是在加载还是卡顿

4. **没有并发控制机制**
   - 快速切换工具时，多个 ECharts 库同时加载
   - 没有队列或限流机制来控制并发加载

## Correctness Properties

Property 1: Bug Condition - 翻译键正确查找

_For any_ 图表工具页面加载或语言切换事件，修复后的翻译键查找函数 SHALL 使用正确的键名格式从翻译对象中查找翻译，返回对应语言的翻译文本而非 "MISSING" 错误。

**Validates: Requirements 2.1, 2.3**

Property 2: Bug Condition - 页面快速加载

_For any_ 用户访问图表工具页面的事件，修复后的 ECharts 异步加载机制 SHALL 在不阻塞主线程的情况下加载 ECharts 库，页面应在 1 秒内显示加载状态，在 3 秒内完成图表渲染。

**Validates: Requirements 2.2, 2.4**

Property 3: Preservation - 非图表工具不受影响

_For any_ 非图表工具的页面加载或语言切换事件，修复后的代码 SHALL 产生与原始代码完全相同的结果，保持所有现有功能不变。

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

假设我们的根本原因分析是正确的，以下是需要进行的具体修改：

**File**: `src/components/tools/EChartsWrapper.svelte`

**Changes**:
1. **改进加载状态管理**
   - 添加更详细的加载阶段（初始化、加载库、初始化图表）
   - 提供更清晰的用户反馈

2. **实现异步懒加载**
   - 使用 `requestIdleCallback` 延迟 ECharts 库加载
   - 在浏览器空闲时加载库，避免阻塞用户交互
   - 添加加载超时处理

3. **添加错误恢复机制**
   - 加载失败时提供重试按钮
   - 记录详细的错误信息用于调试

**File**: `src/lib/translation-helper.ts` (新建)

**Changes**:
1. **创建统一的翻译键查找工具**
   - 提供 `getToolTranslation(toolSlug, key)` 函数
   - 处理嵌套键名（如 `'tips.tip1'`）
   - 返回翻译文本或 "MISSING" 错误

2. **支持多层级键名**
   - 支持点号分隔的键名（如 `'sampleData.monday'`）
   - 自动处理键名不存在的情况

**File**: `src/components/tools/BoxplotChartGenerator.svelte` (及其他图表组件)

**Changes**:
1. **使用统一的翻译键查找函数**
   - 替换现有的 `t()` 函数实现
   - 使用新的 `getToolTranslation()` 工具函数

2. **改进 EChartsWrapper 使用**
   - 添加加载状态处理
   - 提供错误恢复机制

## Testing Strategy

### Validation Approach

测试策略采用两阶段方法：首先在未修复的代码上演示 bug，然后验证修复后的代码能够正确处理所有情况并保持现有功能不变。

### Exploratory Bug Condition Checking

**Goal**: 在实现修复前演示 bug 的具体表现，确认或反驳根本原因分析。

**Test Plan**: 
1. 访问各个图表工具页面，观察翻译键查找是否失败
2. 测量页面加载时间，观察是否出现卡顿
3. 快速切换多个图表工具，观察是否出现页面无响应

**Test Cases**:
1. **翻译键查找测试**：访问 Boxplot Chart Generator，检查是否显示 "MISSING" 错误（会在未修复代码上失败）
2. **页面加载性能测试**：测量从点击工具链接到页面可交互的时间（未修复代码会超过 3 秒）
3. **语言切换测试**：在图表工具页面切换语言，检查翻译是否正确更新（未修复代码可能显示混合的翻译和未翻译的键）
4. **并发加载测试**：快速切换 5 个不同的图表工具，观察页面是否无响应（未修复代码会出现卡顿）

**Expected Counterexamples**:
- 翻译键查找返回 "MISSING: tools.xxx.loadSample" 等错误
- 页面加载时间超过 3 秒
- 快速切换工具时浏览器显示 "页面无响应" 警告

### Fix Checking

**Goal**: 验证对于所有触发 bug 的输入，修复后的函数都能产生期望的正确行为。

**Pseudocode:**
```
FOR ALL input WHERE isBugCondition(input) DO
  result := fixedFunction(input)
  ASSERT translationKeyFound(result)
  ASSERT pageLoadTime(result) < 3000ms
  ASSERT noMainThreadBlocking(result)
END FOR
```

### Preservation Checking

**Goal**: 验证对于所有不触发 bug 的输入，修复后的函数都能产生与原始函数相同的结果。

**Pseudocode:**
```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT originalFunction(input) = fixedFunction(input)
END FOR
```

**Testing Approach**: 属性基础测试推荐用于保持检查，因为：
- 它自动生成许多测试用例，覆盖输入域
- 它捕获手动测试可能遗漏的边界情况
- 它提供强有力的保证，确保行为对所有非 bug 输入保持不变

**Test Plan**: 
1. 在未修复代码上观察非图表工具的行为
2. 编写属性基础测试捕获该行为
3. 验证修复后的代码继续通过这些测试

**Test Cases**:
1. **非图表工具翻译测试**：访问文本转换工具，验证翻译正确显示
2. **非图表工具加载性能测试**：验证非图表工具的加载时间不受影响
3. **语言切换保持测试**：在非图表工具页面切换语言，验证翻译正确更新
4. **图表功能保持测试**：修复后验证图表导出、配置等功能继续正常工作

### Unit Tests

- 翻译键查找函数的单元测试（测试各种键名格式）
- EChartsWrapper 加载状态管理的单元测试
- 错误处理和恢复机制的单元测试
- 各个图表组件的翻译键查找测试

### Property-Based Tests

- 生成随机的翻译键和工具 slug，验证翻译查找函数的正确性
- 生成随机的页面加载事件序列，验证加载状态管理的正确性
- 生成随机的语言切换事件，验证翻译更新的正确性
- 测试快速切换多个工具的场景，验证没有页面无响应

### Integration Tests

- 完整的图表工具加载流程测试（从点击链接到图表渲染）
- 图表工具中的语言切换测试
- 图表导出功能测试
- 多个图表工具的切换测试
