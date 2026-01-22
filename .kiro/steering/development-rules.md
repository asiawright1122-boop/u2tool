# U2Tool 项目开发规则

## 📋 概述

本文档总结了项目开发过程中积累的经验和规则，所有开发工作都应遵循这些规则。

---

## 🔧 一、SEO 优化规则

### 1.1 元数据规则

1. **每个页面必须有唯一的 title 和 description**
   - 工具页面：使用 `seo_title` 和 `seo_description` 翻译键
   - 分类页面：使用分类特定的标题模板
   - 避免重复：不同页面不能使用相同的标题/描述

2. **多语言 SEO 元数据**
   - 所有 10 种语言都必须有本地化的 SEO 元数据
   - 不能使用英文作为其他语言的 fallback（会导致重复内容问题）
   - 检查 `loadToolMessages` 函数确保正确加载本地化元数据

3. **Canonical URL 规则**
   - 必须使用绝对 URL（包含域名）
   - 格式：`https://www.u2tool.com/{locale}/tools/{slug}`
   - 不能使用相对 URL

4. **Hreflang 配置**
   - 所有页面必须包含 10 种语言的 hreflang 标签
   - 必须包含 `x-default` 指向英文版本
   - hreflang 必须是双向的（互相引用）

### 1.2 结构化数据规则

1. **必需的 Schema 类型**
   - 工具页面：`SoftwareApplication`, `HowTo`, `FAQPage`, `BreadcrumbList`
   - 首页：`WebSite` with `SearchAction`, `Organization`
   - 分类页面：`CollectionPage`, `BreadcrumbList`

2. **FAQ 内容规则**
   - 每个工具至少 3-5 个特定 FAQ
   - 避免使用通用模板 FAQ
   - FAQ 必须本地化

3. **HowTo 步骤规则**
   - 每个工具至少 5 个详细步骤
   - 包含预估时间
   - 步骤必须本地化

### 1.3 内部链接规则

1. **相关工具链接**
   - 每个工具页面至少显示 6 个相关工具
   - 使用语义相关性计算，不是随机选择

2. **面包屑导航**
   - 所有页面必须有面包屑
   - 包含正确的 Schema 标记

3. **链接深度**
   - 所有页面必须在 3 次点击内可达
   - 不能有孤立页面

---

## 🌐 二、国际化 (i18n) 规则

### 2.1 支持的语言

项目支持 10 种语言：`en`, `zh`, `ja`, `ko`, `es`, `pt`, `fr`, `de`, `ru`, `ar`

### 2.2 翻译文件结构

```
src/messages/
├── {locale}.json          # 主翻译文件（必须完整）
├── {locale}/
│   ├── base.json          # 基础翻译（自动生成）
│   └── tools/
│       └── {slug}.json    # 工具详细翻译（自动生成）
```

### 2.3 翻译规则

1. **永远不要只更新部分语言** - 必须同时更新所有 10 种语言
2. **检查组件使用的翻译键** - 确保所有使用的键都有对应翻译
3. **运行测试验证** - 每次修改翻译后运行 `npm run test -- --run src/messages/translations.test.ts`
4. **更新拆分文件** - 修改主翻译文件后运行 `npx tsx scripts/split-translations.ts`

### 2.4 常见翻译键

```json
{
  "tools": {
    "inputPlaceholder": "在此输入文本...",
    "outputPlaceholder": "结果将显示在这里...",
    "copy": "复制",
    "copied": "已复制！",
    "clear": "清空",
    "input": "输入",
    "output": "输出",
    "convert": "转换",
    "generate": "生成",
    "format": "格式化",
    "download": "下载",
    "error": "错误"
  }
}
```

---

## ⚡ 三、性能优化规则

### 3.1 Core Web Vitals 目标

- **LCP** (Largest Contentful Paint): < 2.5s
- **INP** (Interaction to Next Paint): < 200ms
- **CLS** (Cumulative Layout Shift): < 0.1

### 3.2 代码分割规则

1. **工具组件必须使用动态导入**
   ```typescript
   const ToolComponent = dynamic(() => import('./ToolComponent'))
   ```

2. **大型库使用懒加载**
   - 图表库、编辑器等大型依赖必须动态导入

3. **图片优化**
   - 使用 Next.js Image 组件
   - 提供 width 和 height 防止 CLS
   - 使用 WebP 格式

### 3.3 预加载规则

1. **关键资源预加载**
   - 字体文件使用 preload
   - 关键 CSS 内联

2. **智能预取**
   - 鼠标悬停时预取链接页面
   - 预连接外部域名

---

## 🧹 四、代码质量规则

### 4.1 禁止事项

1. **生产代码中禁止**
   - `console.log` 语句
   - `debugger` 语句
   - 未使用的变量和导入

2. **文件管理**
   - 不提交临时文件（如根目录的 `0`, `Markdown` 等）
   - 一次性脚本执行后应删除

### 4.2 Next.js 最佳实践

1. **Server Components 优先**
   - 默认使用 Server Components
   - 只在需要时使用 Client Components（hooks, 事件处理, 浏览器 API）

2. **'use client' 指令**
   - 只在必要的组件顶部添加
   - 不要在 Server Component 中添加

3. **TypeScript 类型**
   - 所有函数参数和返回值必须有类型
   - 避免使用 `any`

### 4.3 测试规则

1. **运行测试验证修改**
   ```bash
   npm run test -- --run
   ```

2. **翻译测试**
   ```bash
   npm run test -- --run src/messages/translations.test.ts
   ```

---

## 📁 五、项目结构规则

### 5.1 工具组件位置

```
src/components/tools/[ComponentName].tsx
```

### 5.2 配置文件位置

- 工具配置：`src/config/tools.ts`
- 动态导入注册：`src/components/tools/ToolWrapper.tsx`
- 翻译文件：`src/messages/{locale}.json`

### 5.3 文档位置

- 工具目录：`docs/TOOLS_CATALOG.md`
- SEO 指南：`docs/SEO_SETUP_GUIDE.md`
- 部署指南：`DEPLOYMENT_GUIDE.md`

---

## ✅ 六、检查清单

### 添加新工具

- [ ] 查阅 `docs/TOOLS_CATALOG.md` 确认工具不重复
- [ ] 在 `src/config/tools.ts` 添加工具配置
- [ ] 在 `src/components/tools/ToolWrapper.tsx` 添加动态导入
- [ ] 创建组件文件
- [ ] 在所有 10 个语言文件中添加翻译
- [ ] 检查组件使用的所有翻译键是否存在
- [ ] 运行 `npx tsx scripts/split-translations.ts`
- [ ] 更新 `docs/TOOLS_CATALOG.md`
- [ ] 运行测试验证

### SEO 修改

- [ ] 确保所有页面有唯一的 title 和 description
- [ ] 检查 canonical URL 是绝对路径
- [ ] 验证 hreflang 标签完整
- [ ] 运行 `npx tsx scripts/validate-seo-fixes.ts`
- [ ] 检查结构化数据有效性

### 翻译修改

- [ ] 更新所有 10 种语言
- [ ] 运行 `npx tsx scripts/split-translations.ts`
- [ ] 运行翻译测试
- [ ] 检查组件中使用的翻译键

### 代码提交前

- [ ] 运行 `npm run lint`
- [ ] 运行 `npm run test -- --run`
- [ ] 检查无 console.log 和 debugger
- [ ] 确保无临时文件

---

## 🚨 七、历史问题记录

### 2025-01-04: 翻译键缺失

**问题**：切换语言时出现 `MISSING_MESSAGE` 错误
**原因**：组件使用了翻译键但翻译文件中没有对应的键
**解决**：为所有 10 种语言添加缺失的翻译键

### 2025-01-05: SEO 重复标题

**问题**：93% 的页面使用相同标题，98% 使用相同描述
**原因**：`loadToolMessages` 函数没有正确加载本地化的 SEO 元数据
**解决**：修复元数据加载逻辑，确保使用本地化的 seo_title 和 seo_description

### 2025-01-06: Canonical URL 问题

**问题**：Google Search Console 报告 65 个重复页面
**原因**：canonical URL 使用相对路径而非绝对路径
**解决**：修改为使用绝对 URL（包含域名）

### 2026-01-22: 图表工具无响应问题

**问题**：所有 48 个图表工具点击后出现"页面无响应"错误，浏览器标签页冻结
**原因**：
1. useEffect 依赖项中使用了 `chartTheme` 对象，导致无限循环
2. EChartsComponent 初始化 useEffect 依赖项配置不当
3. React Hooks 顺序违规

**解决**：
1. 修改 36 个图表组件，将 `chartTheme` 依赖替换为具体属性（如 `chartTheme.backgroundColor`）
2. 优化 EChartsComponent，初始化 useEffect 使用空依赖数组 `[]`
3. 使用 `useRef` 保持回调引用稳定
4. 移除不必要的 mounted 状态检查

**经验教训**：
- 对象和函数作为 useEffect 依赖会导致无限循环
- 应该使用原始值或 useRef 保持引用稳定
- useMemo/useCallback 的依赖项配置至关重要

### 2026-01-22 (第二次修复): 图表工具 useMemo 依赖项问题

**问题**：修复 useEffect 后，图表工具仍然存在性能问题和潜在的无限循环风险
**原因**：
1. 翻译函数 `t` 在 useMemo 依赖项中，每次渲染都会创建新引用
2. `useTranslations` 返回的 `t` 函数不是稳定引用
3. 导致 chartOption 不必要地重新计算

**解决**：
1. 从所有图表组件的 useMemo 依赖项中移除 `t` 函数
2. 添加 ESLint 注释 `// eslint-disable-next-line react-hooks/exhaustive-deps` 说明原因
3. 批量修复了 BarChartGenerator 和 LineChartGenerator

**经验教训**：
- **翻译函数 `t` 不应该作为 React Hooks 依赖项**
- `useTranslations` 返回的函数每次渲染都是新引用
- 在 useMemo/useCallback 中使用 `t` 时，应该从依赖项中排除
- 使用 ESLint 注释明确说明为什么禁用依赖检查

### 2026-01-22 (第三次修复): 批量修复所有图表组件

**问题**：发现还有 36 个图表组件存在相同的依赖项问题
**原因**：
1. 所有图表组件都使用了 `chartTheme` 对象作为依赖项
2. 35 个组件导入了 `useDebounce` 但未使用
3. 部分组件仍然包含 `t` 函数依赖

**解决**：
1. 批量修复 36 个图表组件的依赖项配置
2. 将 `chartTheme` 对象依赖替换为具体属性
3. 从依赖项中移除翻译函数 `t`
4. 移除所有未使用的 `useDebounce` 导入
5. 为所有修改添加 ESLint 注释

**修复的组件列表 (36个)**：
AreaChartGenerator, BoxplotChartGenerator, BubbleChartGenerator, CandlestickChartGenerator, DoughnutChartGenerator, FunnelChartGenerator, GanttChartGenerator, GaugeChartGenerator, GraphChartGenerator, GroupedBarChartGenerator, GroupedLineChartGenerator, HalfDoughnutChartGenerator, HeatmapChartGenerator, LiquidFillChartGenerator, MixedChartGenerator, MultiRingChartGenerator, NestedPieChartGenerator, NightingaleRoseChartGenerator, ParallelChartGenerator, PercentageStackedBarChartGenerator, PictorialBarChartGenerator, PieChartGenerator, PolarBarChartGenerator, PositiveNegativeBarChartGenerator, RadarChartGenerator, RingProgressChartGenerator, SankeyChartGenerator, ScatterChartGenerator, StackedAreaChartGenerator, StackedBarChartGenerator, StepLineChartGenerator, SunburstChartGenerator, TimelineChartGenerator, TreeChartGenerator, TreemapChartGenerator, WaterfallChartGenerator

**影响**：
- 修复了所有 48 个 ECharts 图表工具（包括之前修复的 BarChartGenerator 和 LineChartGenerator）
- 防止无限循环和页面无响应
- 显著提升图表渲染性能
- 减少不必要的重新渲染

**经验教训**：
- 对象和函数作为依赖项会导致性能问题
- 应该使用原始值（如 `chartTheme.backgroundColor`）而不是对象（`chartTheme`）
- 批量修复时使用脚本可以提高效率
- 未使用的导入应该及时清理

---

## 📝 八、常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 测试
npm run test -- --run

# 翻译测试
npm run test -- --run src/messages/translations.test.ts

# 更新翻译拆分文件
npx tsx scripts/split-translations.ts

# SEO 验证
npx tsx scripts/validate-seo-fixes.ts

# 代码检查
npm run lint

# 检查翻译完整性
node check-translations.js
```

---

## 🔄 九、更新日志

- **2026-01-22**: 批量修复所有 48 个 ECharts 图表工具的 React Hooks 依赖项问题
- **2026-01-16**: 全面优化 - 清理临时文件、添加环境检查日志、补全所有工具 FAQ（394 个工具 100% 覆盖）
- **2025-01-07**: 创建综合开发规则文档
- **2025-01-06**: 修复 Google Search Console 报告的问题
- **2025-01-05**: 修复 SEO 重复标题问题
- **2025-01-04**: 修复翻译键缺失问题

