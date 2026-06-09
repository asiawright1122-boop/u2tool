# 2026世界杯工具浅色模式自适应设计规范

本设计规范详细描述了 5 个世界杯工具页面如何完美自适应浅色模式。

## 目标
* 5 个世界杯工具（Group Calculator, Simulator, Timezone Planner, Visa Assistant, Budget Calculator）能够在全局浅色模式下呈现出对比度高、色彩统一的高级亮色 UI。
* 在深色模式下完美保留原本的“曜石暗金”黑曜石主题。
* ECharts 动态数据图表能无缝跟随系统/网站主题切换进行重绘。

## 方案细节

### 1. 主题状态监听机制
对于 ECharts 等需要通过 JS 传递配置的主构件，我们使用 Svelte 5 的 `$state` 声明一个响应式的 `isDark` 变量，并在 `onMount` 中挂载 `MutationObserver` 实时追踪全局 `html` 节点的 `.dark` 类，这样在系统/网站切换主题时能够实时刷新布尔值，触发衍生属性 `donutChartOption` 等重新计算。

```typescript
  let isDark = $state(false);

  onMount(() => {
    isDark = document.documentElement.classList.contains('dark');
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  });
```

### 2. 配色适配明细

#### A. 容器与包裹层 (Simulator & Budget)
* **最外层容器**：
  * 修改前：`dark bg-[#0a0a0a] border-neutral-800 text-neutral-200`
  * 修改后：`bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200`
* **内部卡片背景**：
  * 修改前：`bg-neutral-900/40 border border-neutral-900`
  * 修改后：`bg-neutral-50/80 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-900`
* **辅助与说明性文字**：
  * 修改前：`text-neutral-400` / `text-neutral-300`
  * 修改后：`text-neutral-500 dark:text-neutral-400` / `text-neutral-700 dark:text-neutral-300`
* **团队总预算与大字卡片**（Budget）：
  * 修改前：`bg-gradient-to-br from-neutral-950 to-neutral-900 border border-neutral-800`
  * 修改后：`bg-gradient-to-br from-amber-500/5 to-amber-600/10 dark:from-neutral-950 dark:to-neutral-900 border border-amber-500/20 dark:border-neutral-800`

#### B. 局域 CSS 隔离覆盖 (Simulator & Budget)
在 `<style>` 标签中，将之前硬编码的黑色外观隔离在 `:global(.dark)` 范围内：
* **Select 元素**：无前缀时为白色背景+灰字（浅色）； `:global(.dark)` 时为 `#0a0a0a` 背景+白字（深色）。
* **Option 元素**：同上。
* **Preset 预设方案按钮**：同上。
* **Range 进度条**：同上。

#### C. ECharts 图表重绘色彩 (Simulator & Budget)
* **X/Y 轴与网格分割线**：`isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'`
* **X/Y 轴文本颜色**：`isDark ? '#a3a3a3' : '#4b5563'`
* **图例 Legend 文本颜色**：`isDark ? '#d4d4d8' : '#374151'`
* **Tooltip 背景与文字**：
  * 背景：`isDark ? '#171717' : '#ffffff'`
  * 文字：`isDark ? '#d4d4d8' : '#1f2937'`
  * 边框：`isDark ? '#262626' : '#e5e7eb'`
* **Pie/Donut 切割线**：`isDark ? '#0a0a0a' : '#ffffff'`

#### D. Timezone Planner, Visa Assistant, Group Calculator
* 这些页面本身已经通过双主题自适应逻辑（即使用了 `bg-white/70 dark:bg-neutral-900/40` 等）实现了浅色模式渲染，只需确认或微调局部细微表现，保证整体一致性。
