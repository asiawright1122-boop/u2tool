# 设计文档：Astro + Svelte 迁移

## 概述

本设计描述将 U2Tool 从 Next.js 16 + React 19 迁移到 Astro 5.x + Svelte 5.x 的技术方案。核心策略是利用 Astro 的岛屿架构将 500+ 工具页面静态生成为纯 HTML，仅在工具交互区域使用 Svelte 组件进行客户端水合。翻译文件通过构建时注入和按需加载相结合的方式处理 18.9 MB 数据。部署目标为 Cloudflare Pages。

### 关键设计决策

1. **Astro 岛屿架构**：页面骨架（Header、Footer、SEO 元数据、面包屑）为纯静态 HTML，工具组件使用 `client:visible` 指令按需水合
2. **Svelte 5 runes**：使用 `$state`、`$derived`、`$effect` 替代 React hooks，编译时优化消除虚拟 DOM 开销
3. **翻译按需加载**：构建时将翻译拆分为每工具每语言的 JSON 文件，运行时通过 fetch 按需加载
4. **自动化转换脚本**：使用 AST 解析 React TSX 并生成 Svelte 组件骨架，减少手动迁移工作量
5. **Cloudflare Pages 静态部署**：所有 ~5,100 页面预渲染为 HTML，API 路由使用 Cloudflare Functions

## 架构

### 整体架构图

```mermaid
graph TB
    subgraph "构建时 (Build Time)"
        A[Astro Build Pipeline] --> B[静态 HTML 生成<br/>~5,100 页面]
        A --> C[Svelte 组件编译<br/>500+ 工具]
        A --> D[翻译文件拆分<br/>5,000+ JSON 文件]
        A --> E[CSS/JS 打包<br/>Tailwind + Svelte]
    end

    subgraph "运行时 (Runtime)"
        F[用户请求] --> G[Cloudflare CDN]
        G --> H{缓存命中?}
        H -->|是| I[返回缓存内容]
        H -->|否| J[Cloudflare Pages]
        J --> K[静态 HTML]
        J --> L[Cloudflare Functions<br/>API 路由]
        K --> M[浏览器渲染]
        M --> N[Svelte 岛屿水合<br/>client:visible]
        N --> O[按需加载翻译 JSON]
        N --> P[按需加载第三方库<br/>ECharts/PDF/Excel]
    end

    subgraph "存储"
        Q[Cloudflare Pages<br/>HTML + JS + CSS]
        R[Cloudflare KV<br/>翻译数据 (可选)]
    end
```

### 项目目录结构

```
astro-u2tool/
├── astro.config.mjs          # Astro 配置（Svelte、Tailwind、Cloudflare 适配器）
├── svelte.config.js           # Svelte 5 配置
├── tailwind.config.ts         # Tailwind CSS 4.x 配置
├── tsconfig.json
├── package.json
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro   # 基础布局（HTML head、Header、Footer）
│   ├── pages/
│   │   ├── [locale]/
│   │   │   ├── index.astro            # 首页
│   │   │   ├── tools/
│   │   │   │   ├── index.astro        # 工具列表页
│   │   │   │   └── [slug].astro       # 工具详情页
│   │   │   └── categories/
│   │   │       └── [category].astro   # 分类页
│   │   ├── api/
│   │   │   ├── og.ts                  # OG 图片生成
│   │   │   ├── exchange-rates.ts      # 汇率 API
│   │   │   └── indexnow-key.ts        # IndexNow 验证
│   │   ├── robots.txt.ts              # 动态 robots.txt
│   │   └── sitemap.xml.ts             # 动态 sitemap
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.svelte          # 头部导航（需交互：语言切换、主题切换）
│   │   │   ├── Footer.astro           # 页脚（纯静态）
│   │   │   ├── Sidebar.svelte         # 侧边栏（需交互：展开/收起）
│   │   │   └── Breadcrumb.astro       # 面包屑（纯静态）
│   │   ├── tools/
│   │   │   ├── ToolWrapper.svelte     # 工具包装器（懒加载 + 错误边界）
│   │   │   ├── EChartsWrapper.svelte  # ECharts 懒加载包装
│   │   │   ├── ToolSkeleton.svelte    # 加载骨架屏
│   │   │   └── [500+ 工具组件].svelte # 各工具 Svelte 组件
│   │   ├── ui/
│   │   │   ├── ThemeToggle.svelte     # 主题切换按钮
│   │   │   └── LanguageSelector.svelte # 语言选择器
│   │   └── seo/
│   │       ├── StructuredData.astro   # 结构化数据注入
│   │       └── HreflangTags.astro     # Hreflang 标签
│   ├── lib/
│   │   ├── i18n.ts                    # i18n 核心逻辑
│   │   ├── translations.ts           # 翻译加载器
│   │   ├── seo.ts                     # SEO 工具函数（复用现有逻辑）
│   │   ├── theme.ts                   # 主题 store（Svelte writable）
│   │   └── tools.ts                   # 工具配置（复用现有数据）
│   ├── config/
│   │   └── tools.ts                   # 工具注册表（直接复用）
│   ├── messages/                      # 翻译文件（直接复用）
│   │   ├── {locale}.json
│   │   └── {locale}/tools/{slug}.json
│   └── styles/
│       └── global.css                 # 全局样式 + Tailwind
├── scripts/
│   ├── convert-react-to-svelte.ts     # React → Svelte 转换脚本
│   ├── generate-static-pages.ts       # 静态页面生成辅助
│   └── split-translations.ts          # 翻译拆分脚本（复用）
└── public/
    └── ...                            # 静态资源
```


## 组件与接口

### 1. Astro 页面层

#### 工具详情页 `[slug].astro`

```astro
---
// src/pages/[locale]/tools/[slug].astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import StructuredData from '@/components/seo/StructuredData.astro';
import HreflangTags from '@/components/seo/HreflangTags.astro';
import Breadcrumb from '@/components/layout/Breadcrumb.astro';
import { tools, getToolBySlug } from '@/config/tools';
import { locales } from '@/lib/i18n';
import { loadToolMessages } from '@/lib/translations';
import { generateSoftwareApplicationJsonLd, generateHowToJsonLd } from '@/lib/seo';

// 静态路径生成
export function getStaticPaths() {
  return locales.flatMap(locale =>
    tools.map(tool => ({
      params: { locale, slug: tool.slug },
      props: { locale, tool }
    }))
  );
}

const { locale, tool } = Astro.props;
const messages = await loadToolMessages(locale, tool.slug);
const seoTitle = messages.seo_title || messages.name;
const seoDescription = messages.seo_description || messages.description;
---

<BaseLayout title={seoTitle} description={seoDescription} locale={locale}>
  <HreflangTags path={`/tools/${tool.slug}`} slot="head" />
  <StructuredData
    type="SoftwareApplication"
    data={generateSoftwareApplicationJsonLd({ slug: tool.slug, locale })}
    slot="head"
  />

  <Breadcrumb locale={locale} tool={tool} />

  <!-- 工具组件：岛屿架构，仅在可见时水合 -->
  <div id="tool-container">
    {/* 动态导入对应的 Svelte 工具组件 */}
    <ToolWrapper
      client:visible
      slug={tool.slug}
      locale={locale}
      translations={messages}
    />
  </div>

  <!-- 相关工具、FAQ 等静态内容 -->
  <RelatedTools tools={getRelatedTools(tool)} locale={locale} />
  <ToolFAQ slug={tool.slug} locale={locale} faqs={messages.faqs} />
</BaseLayout>
```

### 2. Svelte 组件层

#### ToolWrapper.svelte - 工具包装器

```svelte
<script lang="ts">
  // src/components/tools/ToolWrapper.svelte
  import { onMount } from 'svelte';
  import ToolSkeleton from './ToolSkeleton.svelte';

  interface Props {
    slug: string;
    locale: string;
    translations: Record<string, unknown>;
  }

  let { slug, locale, translations }: Props = $props();

  let ToolComponent: any = $state(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // 工具组件映射表（动态导入）
  const TOOL_IMPORTS: Record<string, () => Promise<any>> = {
    'json-formatter': () => import('./JsonFormatter.svelte'),
    'base64': () => import('./Base64.svelte'),
    // ... 500+ 工具映射
  };

  onMount(async () => {
    const importFn = TOOL_IMPORTS[slug];
    if (!importFn) {
      error = `Tool not found: ${slug}`;
      loading = false;
      return;
    }

    try {
      const module = await importFn();
      ToolComponent = module.default;
      loading = false;
    } catch (e) {
      error = `Failed to load tool: ${slug}`;
      loading = false;
    }
  });

  function retry() {
    loading = true;
    error = null;
    const importFn = TOOL_IMPORTS[slug];
    if (importFn) {
      importFn().then(m => {
        ToolComponent = m.default;
        loading = false;
      }).catch(() => {
        error = `Failed to load tool: ${slug}`;
        loading = false;
      });
    }
  }
</script>

{#if loading}
  <ToolSkeleton />
{:else if error}
  <div class="text-center p-8">
    <p class="text-red-500">{error}</p>
    <button onclick={retry} class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
      重试
    </button>
  </div>
{:else if ToolComponent}
  <svelte:component this={ToolComponent} {locale} {translations} />
{/if}
```

#### EChartsWrapper.svelte - 图表懒加载

```svelte
<script lang="ts">
  // src/components/tools/EChartsWrapper.svelte
  import { onMount, onDestroy } from 'svelte';

  interface Props {
    option: Record<string, unknown>;
    style?: string;
    theme?: string;
  }

  let { option, style = 'height: 400px; width: 100%', theme }: Props = $props();

  let chartContainer: HTMLDivElement;
  let chartInstance: any = $state(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      // 使用 requestIdleCallback 延迟加载
      await new Promise<void>(resolve => {
        if ('requestIdleCallback' in window) {
          requestIdleCallback(() => resolve(), { timeout: 1000 });
        } else {
          setTimeout(resolve, 10);
        }
      });

      // 并行加载 ECharts 模块
      const [echarts, { CanvasRenderer }, charts, components] = await Promise.all([
        import('echarts/core'),
        import('echarts/renderers'),
        import('echarts/charts'),
        import('echarts/components'),
      ]);

      // 注册组件
      echarts.use([
        charts.BarChart, charts.LineChart, charts.PieChart,
        charts.ScatterChart, charts.RadarChart, charts.FunnelChart,
        charts.GaugeChart, charts.HeatmapChart, charts.TreemapChart,
        charts.SankeyChart, charts.SunburstChart, charts.CandlestickChart,
        charts.BoxplotChart, charts.GraphChart, charts.TreeChart,
        charts.ParallelChart, charts.PictorialBarChart, charts.ThemeRiverChart,
        charts.CustomChart,
        components.TitleComponent, components.TooltipComponent,
        components.GridComponent, components.LegendComponent,
        components.ToolboxComponent, components.DataZoomComponent,
        components.VisualMapComponent, components.DatasetComponent,
        components.TransformComponent, components.PolarComponent,
        components.RadarComponent,
        CanvasRenderer,
      ]);

      chartInstance = echarts.init(chartContainer, theme);
      chartInstance.setOption(option);
      loading = false;

      // 响应式调整
      const resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize();
      });
      resizeObserver.observe(chartContainer);

      return () => resizeObserver.disconnect();
    } catch (e) {
      error = 'Failed to load chart library';
      loading = false;
    }
  });

  onDestroy(() => {
    chartInstance?.dispose();
  });

  // 响应 option 变化
  $effect(() => {
    if (chartInstance && option) {
      chartInstance.setOption(option, true);
    }
  });

  export function getEchartsInstance() {
    return chartInstance;
  }

  export function exportChart(format: 'png' | 'svg') {
    if (!chartInstance) return null;
    return chartInstance.getDataURL({ type: format === 'svg' ? 'svg' : 'png' });
  }
</script>

<div bind:this={chartContainer} {style} class="relative">
  {#if loading}
    <div class="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p class="text-sm text-gray-500">加载图表...</p>
      </div>
    </div>
  {/if}
  {#if error}
    <div class="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20 rounded-lg">
      <div class="text-center">
        <p class="text-red-500 text-sm">{error}</p>
        <button onclick={() => location.reload()} class="mt-2 px-3 py-1 text-xs bg-red-500 text-white rounded">
          重试
        </button>
      </div>
    </div>
  {/if}
</div>
```

### 3. i18n 系统

#### 翻译加载器 `translations.ts`

```typescript
// src/lib/translations.ts
export const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'] as const;
export type Locale = typeof locales[number];

// 构建时：直接 import JSON（用于 Astro 页面的静态生成）
export async function loadBaseMessages(locale: Locale): Promise<Record<string, unknown>> {
  const messages = await import(`../messages/${locale}.json`);
  return messages.default;
}

export async function loadToolMessages(locale: Locale, slug: string): Promise<Record<string, unknown>> {
  const base = await loadBaseMessages(locale);
  const toolsObj = base.tools as Record<string, any> || {};
  const toolData = toolsObj[slug] || {};

  // 加载详细翻译
  let detailed = {};
  try {
    const mod = await import(`../messages/${locale}/tools/${slug}.json`);
    detailed = mod.default;
  } catch {
    // 回退到英语
    if (locale !== 'en') {
      try {
        const mod = await import(`../messages/en/tools/${slug}.json`);
        detailed = mod.default;
      } catch {}
    }
  }

  return { ...detailed, ...toolData };
}

// 运行时：Svelte 组件内的翻译辅助函数
export function createTranslator(translations: Record<string, unknown>) {
  return function t(key: string, fallback?: string): string {
    const keys = key.split('.');
    let value: any = translations;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return fallback || `MISSING: ${key}`;
    }
    return typeof value === 'string' ? value : fallback || `MISSING: ${key}`;
  };
}
```

### 4. 主题系统

```typescript
// src/lib/theme.ts
import { writable } from 'svelte/store';

type Theme = 'light' | 'dark' | 'system';

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>('system');

  return {
    subscribe,
    toggle() {
      update(current => {
        const next = current === 'dark' ? 'light' : 'dark';
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', next);
        }
        applyTheme(next);
        return next;
      });
    },
    init() {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('theme') as Theme | null;
        if (saved) {
          set(saved);
          applyTheme(saved);
        }
      }
    }
  };
}

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const isDark = theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export const theme = createThemeStore();
```


### 5. SEO 系统

SEO 逻辑大部分可直接复用现有 `src/lib/seo.ts` 中的函数。主要变化是将 Next.js 的 `Metadata` API 替换为 Astro 的 `<head>` 模板注入。

#### BaseLayout.astro

```astro
---
// src/layouts/BaseLayout.astro
import HreflangTags from '@/components/seo/HreflangTags.astro';

interface Props {
  title: string;
  description: string;
  locale: string;
  canonicalPath?: string;
}

const { title, description, locale, canonicalPath } = Astro.props;
const BASE_URL = 'https://www.u2tool.com';
const canonical = `${BASE_URL}/${locale}${canonicalPath || Astro.url.pathname.replace(`/${locale}`, '')}`;
const isRTL = locale === 'ar';
---

<!DOCTYPE html>
<html lang={locale} dir={isRTL ? 'rtl' : 'ltr'} class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} | U2Tool</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <HreflangTags path={canonicalPath || Astro.url.pathname.replace(`/${locale}`, '')} />
  <slot name="head" />
  <!-- 主题防闪烁脚本（内联，阻塞渲染前执行） -->
  <script is:inline>
    (function() {
      const t = localStorage.getItem('theme');
      const d = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
      document.documentElement.classList.toggle('dark', d);
    })();
  </script>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <Header client:load locale={locale} />
  <main>
    <slot />
  </main>
  <Footer locale={locale} />
</body>
</html>
```

### 6. 自动化转换脚本

#### React → Svelte 转换器架构

```mermaid
graph LR
    A[React TSX 文件] --> B[TypeScript AST 解析<br/>ts-morph]
    B --> C[提取 hooks<br/>useState/useEffect/useMemo]
    C --> D[提取 JSX 模板]
    D --> E[转换 hooks → runes<br/>useState → $state<br/>useEffect → $effect]
    E --> F[转换 JSX → Svelte 模板<br/>className → class<br/>条件渲染 → {#if}]
    F --> G[生成 .svelte 文件]
    G --> H[标记需手动处理的部分<br/>TODO 注释]
    H --> I[迁移报告]
```

转换规则映射表：

| React 模式 | Svelte 5 等价 | 已知问题 |
|---|---|---|
| `const [x, setX] = useState(init)` | `let x = $state(init)` | ✅ 工作正常 |
| `useEffect(() => { ... }, [deps])` | `$effect(() => { ... })` | ✅ 工作正常 |
| `useMemo(() => val, [deps])` | `let val = $derived(expression)` | ✅ 工作正常 |
| `useCallback(fn, [deps])` | 直接使用函数（Svelte 无需 useCallback） | ✅ 工作正常 |
| `useRef(init)` | `let ref = $state(init)` 或 `bind:this` | ✅ 工作正常 |
| `{condition && <Comp />}` | `{#if condition}<Comp />{/if}` | ✅ 单元素正常 |
| `{condition && <><Comp1 /><Comp2 /></>}` | `{#if condition}<div><Comp1 /><Comp2 /></div>{/if}` | ❌ **缺少包装 div** |
| `{arr.map(x => <Comp />)}` | `{#each arr as x}<Comp />{/each}` | ✅ 工作正常 |
| `{condition ? <A /> : <B />}` | `{#if condition}<A />{:else}<B />{/if}` | ✅ 工作正常 |
| `className="..."` | `class="..."` | ✅ 工作正常 |
| `dangerouslySetInnerHTML` | `{@html content}` | ✅ 工作正常 |
| `onChange={handler}` | `oninput={handler}` 或 `onchange={handler}` | ✅ 工作正常 |
| `onClick={handler}` | `onclick={handler}` | ✅ 工作正常 |
| `<input value={x} onChange={...} />` | `<input bind:value={x} />` | ✅ 工作正常 |
| 函数声明 `function foo() {}` | 函数声明 `function foo() {}` | ❌ **函数体被拆散** |
| 嵌套 React 组件 `<ResultCard />` | 需要转换为 Svelte 组件 | ❌ **未识别和转换** |

### 已发现的转换脚本 Bug

#### Bug 1: 函数提取逻辑错误（严重）

**问题**：`extractRegularFunctions` 无法正确识别函数边界，导致函数体被拆散到模块级别。

**示例**：
```typescript
// React 原始代码
function calculateMedian(numbers: number[]): number {
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}
```

**错误的转换结果**：
```typescript
// Svelte 错误输出
const sorted = [...numbers].sort((a, b) => a - b);
const mid = Math.floor(sorted.length / 2);
return sorted.length % 2 !== 0  // ❌ return 在函数外部！
  ? sorted[mid]
  : (sorted[mid - 1] + sorted[mid]) / 2;
}  // ❌ 多余的闭合括号
```

**根本原因**：`extractRegularFunctions` 使用 `body.forEachChild()` 只遍历直接子节点，无法正确提取完整的函数声明。

#### Bug 2: `{#if}` 块缺少包装 div（中等）

**问题**：当条件渲染包含多个兄弟元素时，转换后的 `{#if}` 块缺少包装 `<div>`，导致 Svelte 编译错误。

**示例**：
```jsx
// React 原始代码
{condition && (
  <>
    <Component1 />
    <Component2 />
  </>
)}
```

**错误的转换结果**：
```svelte
{#if condition}
<Component1 />
<Component2 />
{/if}
```

**正确的转换结果**：
```svelte
{#if condition}
<div>
  <Component1 />
  <Component2 />
</div>
{/if}
```

**根本原因**：`transformConditionalAnd` 函数移除了 React Fragment (`<>`) 但没有检查是否需要添加包装元素。

#### Bug 3: 嵌套 React 组件未转换（中等）

**问题**：模板中使用的嵌套 React 组件（如 `<ResultCard />`）未被识别和转换为 Svelte 组件。

**示例**：
```jsx
// React 原始代码
function ResultCard({ label, value }: Props) {
  return <div>{label}: {value}</div>;
}

export default function Tool() {
  return <ResultCard label="Test" value="123" />;
}
```

**错误的转换结果**：
```svelte
<script>
  // ResultCard 函数被提取但格式错误
  function ResultCard({ label, value }: Props) { ... }
</script>

<!-- 模板中仍然使用 ResultCard，但它不是有效的 Svelte 组件 -->
<ResultCard label="Test" value="123" />
```

**正确的转换结果**：
```svelte
<script>
  // 将 ResultCard 转换为 Svelte snippet 或单独的组件
  // 或者内联展开
</script>
```

**根本原因**：转换脚本没有识别和处理嵌套组件定义。

## 数据模型

### 工具配置（复用现有）

```typescript
// src/config/tools.ts - 直接复用，无需修改
export type ToolCategory = 'text' | 'encoding' | 'generators' | 'converters' |
  'development' | 'security' | 'network' | 'image' | 'math' | 'charts' |
  'office' | 'lifestyle' | 'finance' | 'fun';

export interface Tool {
  slug: string;
  category: ToolCategory;
  icon: string;
  component: string;
  popular?: boolean;
}
```

### 翻译数据结构（复用现有）

```typescript
// 每个工具的翻译结构
interface ToolTranslation {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  detailed_description?: string;
  usage_steps?: string[];
  usage_examples?: string[];
  // 工具特定的 UI 翻译键
  [key: string]: unknown;
}

// 基础翻译结构
interface BaseTranslation {
  site: Record<string, string>;
  nav: Record<string, string>;
  categories: Record<string, string>;
  home: Record<string, string>;
  tools: Record<string, ToolTranslation>;
  // ...其他命名空间
}
```

### 迁移进度追踪

```typescript
interface MigrationProgress {
  totalTools: number;           // 500+
  convertedTools: string[];     // 已转换的 slug 列表
  manualFixNeeded: string[];    // 需要手动修复的 slug 列表
  failedTools: string[];        // 转换失败的 slug 列表
  lastUpdated: string;          // ISO 日期
}
```