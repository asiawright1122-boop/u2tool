# Technical Analysis: 2026 World Cup Monte Carlo Probability Simulator

## 1. Executive Summary
本项目对 2026 年世界杯蒙特卡洛概率模拟器（`world-cup-simulator`）的底层数学引擎、Svelte 5 组件结构、ECharts 图表集成以及 10 国语言的国际化和 SEO 规范进行了深入的代码审查与验证。现有实现已处于高度完成状态，且所有的 Vitest 单元测试与主题/Parity 校验均已完全通过。

---

## 2. Codebase Exploration & Technical Audit

### 2.1 Svelte 5 Reactivity (Runes)
模拟器在 `WorldCupSimulator.svelte` 中广泛应用了 Svelte 5 的现代反应式原语（Runes）：
- **`$props`**: 接收外部传入的 `locale` 与 `translations`：
  ```typescript
  let { locale, translations } = $props<{ locale: string; translations: any }>();
  ```
- **`$state`**: 声明各种内部状态，例如滑块数值（`homeSlider`, `heritageSlider`, `chaosSlider`）、焦点队伍选择（`focusTeamA`, `focusTeamB`）以及模拟运行时的控制变量（`isSimulating`, `simProgress` 等）：
  ```typescript
  let homeSlider = $state(5);
  let heritageSlider = $state(5);
  let chaosSlider = $state(5);
  let focusTeamA = $state('BRA');
  let focusTeamB = $state('ARG');
  ```
- **`$derived` / `$derived.by`**: 用于计算高开销的衍生依赖。例如双人对决概率 `directH2H` 和 ECharts 的图表配置项 `championChartOption` 与 `radarChartOption`：
  ```typescript
  let directH2H = $derived.by(() => { ... });
  let championChartOption = $derived.by(() => { ... });
  ```
- **`$effect`**: 处理异步模拟完成后的回调，以及响应用户切换焦点球队时的数据重新结算：
  ```typescript
  $effect(() => {
    if (simCompleted) {
      calculateFocusAdvancement(focusTeamA, 10000);
      calculateFocusAdvancement(focusTeamB, 10000);
    }
  });
  ```

### 2.2 ECharts Wrapper & Responsive Dark Mode
模拟器集成了一个高度优化的 `EChartsWrapper.svelte` 组件，核心功能包括：
1. **异步分块加载 (Idle Callback & Dynamic Import)**: 利用 `requestIdleCallback` 在浏览器空闲时动态加载对应的运行时模块（如 `common-runtime`, `hierarchy-runtime` 等），以避免阻塞主线程，极大提升页面交互响应速度。
2. **主题同步 (Theme Sync)**: 支持 `MutationObserver` 监听文档根节点上的 `.dark` 类与样式变化，并在触发 `u2tool:themechange` 事件时通过 `requestAnimationFrame` 自动执行重绘，与整站的主题切换无缝咬合。
3. **响应式尺寸调整 (Responsive Resize)**: 使用 `ResizeObserver` 动态监听图表容器尺寸，确保图表在不同尺寸的视口（如移动端和桌面端）中自动执行 `.resize()`。

### 2.3 Strict Dark Mode & Scoped Styling (Titanium-Gold Theme)
模拟器采用严格的** Obsidian Minimalist Swiss Gold Theme**（黑金曜石质感主题）。主要特征为：
- **无浅色模式**: 整体外层容器强制声明 `.dark bg-[#0a0a0a] text-neutral-200 border border-neutral-800`，不提供亮色背景切换。
- **精细的颜色 Token**:
  - 极暗背景: `#0a0a0a`
  - 卡片背景: `#121212`
  - 哑光古铜金: `#8a6623` / `#c5a059` (用于关键边框、数字加成与文字高亮)
  - 亮金色: `#e5c47f` / `#D4AF37`
  - 渐变色: 模拟运行按钮和图表系列采用 `#D4AF37` 到 `#B8860B` 的哑光渐变金。
- **强制范围样式覆盖**: 为防止 Astro 框架的全局亮色 CSS 样式对表单元素（`select`, `option`, `input[type="range"]`, `button`）造成污染，组件底部使用了极具针对性的 `:global` 局部 CSS 覆盖：
  ```css
  .world-cup-simulator-container :global(select) {
    background-color: #0a0a0a !important;
    color: #e5e5e5 !important;
    border-color: #262626 !important;
  }
  ```
- **禁止过度动效**: 避免使用流光 (shimmer) 或炫目发光特效，以维持瑞士私人银行般冷峻、专业的低调精算感。

### 2.4 Localization Setup & SEO Constraints
系统的本地化文件分两层管理：
1. **全局词条**: `src/messages/[locale]/base.json` 中的 `tools.world-cup-simulator` 块。
2. **独立工具页面**: `src/messages/[locale]/tools/world-cup-simulator.json` 包含 `detailed_description`、`usage_steps`、`usage_examples` 以及三问三答的 `faqs` 块。

系统对多语言翻译长度和内容有着严格的 SEO 校验规定（位于 `translations.test.ts` 与 `seo-governance.test.ts`）：
- **CJK (中、日、韩) 规则**: 字符密度高，信息承载量大，校验规则限制其描述长度在 **70 至 140 字符** 之间。
- **拉丁与拼音语系规则**: 字符密度低，校验规则限制其描述长度在 **120 至 160 字符** 之间。
- **SEO Title**: 标题长度上限为 **60 字符**。
- **关键字对齐**: 需保证翻译版本中没有多余的占位符且英文字学术语（如 Monte Carlo, ELO ratings）的翻译拼写规范完全统一。

---

## 3. Simulation Engine Architecture (`world-cup-engine.ts`)

数学引擎由以下 7 个核心要素解耦构建：

1. **Elo 数据库 (BASE_TEAMS)**: 包含了 2026 年扩军后的 48 支球队，每支球队包含 `id`, `name`, `elo` 评分, `group` (A 到 L 组), 以及是否为东道主 (`isHost`) 或传统豪门 (`isHeritage`)。
2. **Trio DNA Elo 调整公式 (`adjustEloForTrioDNA`)**:
   $$Elo_{\text{adjusted}} = Elo_{\text{base}} + \text{isHost} \times \left(\frac{\text{homeSlider}}{10} \times 150\right) + \text{isHeritage} \times \left(\frac{\text{heritageSlider}}{10} \times 140\right)$$
   主场加成上限 +150，传统豪门底蕴加成上限 +140。
3. **比赛胜平负概率计算 (`calculateMatchProbability`)**:
   引入混沌度（Chaos）热力学缩放因子：
   $$\text{chaosScale} = 1 + \frac{\text{chaosSlider}}{10} \times 1.5$$
   通过 logistic 分布拟合双方胜率，并引入基于 Elo 差值的正态分布平局率计算（基础平局率 26%）：
   $$P(\text{Draw}) = 0.26 \times e^{-\left(\frac{Elo_A - Elo_B}{300}\right)^2}$$
4. **泊松进球生成器与结果校正 (`simulateMatchGoals` & `poissonRandom`)**:
   基于双方 Elo 评分计算期望进球率（$\lambda_A, \lambda_B$），生成泊松分布的进球数。如果随机生成的进球数与第 3 步得到的胜平负结果相冲突，则通过 $+1$ 或取平均值等算法进行强制校正，以保证胜平负结果与进球数逻辑一致。
5. **小组赛积分榜排序 (`rankGroup`)**:
   遵循 FIFA 小组赛规则，对各组 4 支球队的 6 场单循环赛结果进行积分累加，并依次按积分、净胜球、进球数进行降序排列（省略了复杂的胜负关系和公平竞赛积分）。
6. **八支最佳小组第三筛选 (`selectBestThirdPlaces`)**:
   将 12 个小组的第三名汇聚，按照积分、净胜球、进球数降序排列，筛选出前 8 名晋级 32 强淘汰赛。
7. **32强淘汰赛树 (`simulateKnockoutBracket` & `simulateFullTournament`)**:
   将 24 支小组前两名球队与 8 支最佳第三名进行配对，以单败淘汰制模拟 32强 -> 16强 -> 8强 -> 4强 -> 半决赛 -> 决赛，最终决出冠亚军。

---

## 4. Presentation & Visualization Design

前端视图采用分栏响应式设计：
- **左侧微调控制面板**: 
  - **Trio DNA 微调滑块**: `Home Advantage`, `Heritage DNA`, `Wildcard Chaos`（爆冷概率）。
  - **焦点对决选择器**: 下拉选择两支队伍，实时展现 1 场模拟的胜平负比例（以金-灰-蓝条状比例展示）。
  - **运行模拟按钮**: 点击触发 10,000 次蒙特卡洛计算。
- **右侧模拟预测看板**:
  - **冠军概率图表 (Bar)**: 横向柱状图，展示夺冠概率最高的前 15 支队伍，支持金色渐变色。
  - **焦点对决雷达图 (Radar)**: 对比两支选定球队的 5 维数据：基础 Elo、修正后 Elo、晋级淘汰赛率、进入决赛率、夺冠率。
  - **晋级概率漏斗**: 清晰对比两支焦点球队在各个阶段（夺冠、亚军、四强、八强、十六强、三十二强、小组赛淘汰）的精算留存率。
- **底部运行说明区**: 简要阐述模拟逻辑和参数配置对计算公式的影响。

---

## 5. Project Implementation & Verification Plan

为保证该工具在项目中的健壮部署与代码完整性，规划如下 4 个阶段里程碑。

```
+-----------------------------------------------------------------------------------+
|                                 IMPLEMENTATION PLAN                               |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  MILESTONE 1             MILESTONE 2             MILESTONE 3             MILESTONE 4|
|  [Math & Engine] ------> [UI & ECharts] -------> [Locales & SEO] ------> [QA & Tests]
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Milestone 1: Math Engine Integrity & Test Verifications
- **任务目标**: 验证 `world-cup-engine.ts` 中的公式计算与蒙特卡洛数据采样逻辑的准确度与运行效率。
- **契约输入/输出**:
  - `adjustEloForTrioDNA`: `(baseElo: number, isHost: boolean, isHeritage: boolean, homeSlider: number, heritageSlider: number) => number`
  - `calculateMatchProbability`: `(eloA: number, eloB: number, chaos: number) => { probA: number, probB: number, probDraw: number }`
  - `simulateFullTournament`: `(home: number, heritage: number, chaos: number) => TournamentExits`
- **主要验证文件**:
  - `/Users/kaka/Dev/u2tool/src/lib/runtime-integrity/world-cup-engine.ts`
  - `/Users/kaka/Dev/u2tool/src/components/tools/WorldCupSimulator.test.ts`
- **验证命令**:
  ```bash
  npx vitest run src/components/tools/WorldCupSimulator.test.ts
  ```

### Milestone 2: UI Presentation & ECharts Lifecycle Verification
- **任务目标**: 验证 Svelte 5 组件与 ECharts 响应式渲染在初始化、重试和主题变更时的生命周期管理。
- **契约输入/输出**:
  - `EChartsWrapper.svelte` Props 契约: `option`, `theme`, `showLoading`, `notMerge`
  - 异步非阻塞 Monte Carlo 触发器: 通过 `requestAnimationFrame` 分批（每次 250 次模拟）进行 10,000 次迭代，以防止阻塞主线程渲染。
- **主要验证文件**:
  - `/Users/kaka/Dev/u2tool/src/components/tools/WorldCupSimulator.svelte`
  - `/Users/kaka/Dev/u2tool/src/components/tools/EChartsWrapper.svelte`
  - `/Users/kaka/Dev/u2tool/src/hooks/useChartTheme.ts`
- **验证命令**:
  ```bash
  npm run qa:theme-parity
  ```

### Milestone 3: Multilingual Compliance & SEO Constraints Audit
- **任务目标**: 校验 10 国语言翻译文本与 SEO 描述在规则校验下的合法性（CJK 限制与拼音限制）。
- **主要验证文件**:
  - `/Users/kaka/Dev/u2tool/src/messages/[ar|de|en|es|fr|ja|ko|pt|ru|zh]/tools/world-cup-simulator.json`
- **验证命令**:
  ```bash
  npm run qa:tool-locales
  ```

### Milestone 4: Comprehensive QA & Smoke Tests
- **任务目标**: 验证整站构建、路由、工具自动注册与依赖映射。
- **主要验证文件**:
  - `/Users/kaka/Dev/u2tool/src/config/tools/fun.ts`
  - `/Users/kaka/Dev/u2tool/src/components/tools/ToolImportMap.ts`
- **验证命令**:
  ```bash
  npm run qa:production
  ```
