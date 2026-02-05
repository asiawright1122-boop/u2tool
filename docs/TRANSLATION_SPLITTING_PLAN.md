# 翻译文件拆分方案

## ✅ 实施状态

**状态**: 已完成并验证  
**完成日期**: 2026-02-05  
**构建验证**: ✅ 2394 个静态页面成功生成  
**测试验证**: ✅ 2970 个测试全部通过

### 启用方式

在 `.env.local` 中设置：
```
NEXT_PUBLIC_USE_SPLIT_TRANSLATIONS=true
```

### 实际效果

| 页面 | 拆分前 | 拆分后 | 减少 |
|------|--------|--------|------|
| 首页 | 1.6 MB | ~15 KB | 99% |
| 工具列表 | 1.6 MB | ~185 KB | 88% |
| 工具详情 | 1.6 MB | ~187 KB | 88% |

---

## 原始状态

### 文件大小
| 语言 | 主文件大小 | 说明 |
|------|-----------|------|
| en.json | 1.6 MB | 英文（基准） |
| zh.json | 1.7 MB | 中文 |
| ja.json | 1.7 MB | 日文 |
| ko.json | 1.6 MB | 韩文 |
| es.json | 1.7 MB | 西班牙文 |
| pt.json | 1.7 MB | 葡萄牙文 |
| fr.json | 1.7 MB | 法文 |
| de.json | 1.7 MB | 德文 |
| ru.json | 2.5 MB | 俄文（最大） |
| ar.json | 2.1 MB | 阿拉伯文 |
| **总计** | **~18 MB** | 10 种语言 |

### 结构分析

```
{locale}.json
├── site (0.3 KB) - 站点基本信息
├── categories (0.4 KB) - 分类名称
├── categories_seo (3.5 KB) - 分类 SEO
├── pages (0.3 KB) - 页面标题
├── ranking_seo (0.5 KB) - 排名页 SEO
├── nav (0.4 KB) - 导航
├── home (1.3 KB) - 首页
├── tools (1,317 KB) - 工具翻译 ⚠️ 最大
│   ├── 通用 UI (3.6 KB) - 146 个字符串
│   └── 工具特定 (1,313 KB) - 635 个工具
├── tool (94.6 KB) - 工具元数据
├── privacy (1.2 KB) - 隐私政策
├── terms (1.4 KB) - 服务条款
├── about (1.5 KB) - 关于页面
├── footer (0.1 KB) - 页脚
├── theme (0.1 KB) - 主题
├── blog (0.4 KB) - 博客
├── errors (0.2 KB) - 错误信息
├── compare (0.4 KB) - 比较页面
├── countries (0.2 KB) - 国家名称
├── tax (2.3 KB) - 税务计算器
├── launches (3.7 KB) - 发布信息
└── common (0.3 KB) - 通用文本
```

## 拆分方案

### 方案 1: 按页面类型拆分（推荐）

将翻译文件按页面类型拆分，实现按需加载：

```
src/messages/{locale}/
├── core.json (~10 KB)      # 核心翻译（每个页面都需要）
│   ├── site
│   ├── nav
│   ├── footer
│   ├── theme
│   ├── errors
│   └── common
│
├── home.json (~5 KB)       # 首页专用
│   ├── home
│   └── categories
│
├── tools-ui.json (~5 KB)   # 工具页面通用 UI
│   └── tools (仅字符串部分)
│
├── tools/                  # 每个工具单独文件
│   ├── json-formatter.json (~2 KB)
│   ├── base64.json (~2 KB)
│   └── ... (635 个文件)
│
├── pages/                  # 静态页面
│   ├── privacy.json
│   ├── terms.json
│   └── about.json
│
└── seo.json (~5 KB)        # SEO 元数据
    ├── categories_seo
    └── ranking_seo
```

**优点**：
- 首页只加载 ~15 KB（core + home）
- 工具页面按需加载单个工具翻译
- 显著减少初始加载大小

**缺点**：
- 需要修改翻译加载逻辑
- 增加文件数量

### 方案 2: 按功能模块拆分

```
src/messages/{locale}/
├── base.json (~100 KB)     # 基础翻译
│   ├── site, nav, footer, theme
│   ├── home, categories
│   ├── errors, common
│   └── tools (仅通用 UI)
│
├── tools-meta.json (~95 KB) # 工具元数据
│   └── tool (name, description, seo_*)
│
├── tools-content.json (~1.2 MB) # 工具详细内容
│   └── tools (detailed_description, usage_*)
│
└── pages.json (~5 KB)      # 静态页面
    ├── privacy, terms, about
    └── blog
```

**优点**：
- 文件数量少，管理简单
- 可以按需加载 tools-content

**缺点**：
- tools-content 仍然很大
- 不够精细

### 方案 3: 混合拆分（最佳实践）

结合方案 1 和 2 的优点：

```
src/messages/{locale}/
├── core.json (~15 KB)      # 核心 + 首页
│   ├── site, nav, footer, theme
│   ├── home, categories, categories_seo
│   ├── errors, common
│   └── tools (仅通用 UI 字符串)
│
├── tools-index.json (~95 KB) # 工具列表元数据
│   └── 所有工具的 name, description, seo_*
│
├── tools/                  # 工具详细内容（按需加载）
│   ├── json-formatter.json
│   ├── base64.json
│   └── ... (仅包含 detailed_description, usage_*)
│
└── static/                 # 静态页面（按需加载）
    ├── privacy.json
    ├── terms.json
    ├── about.json
    └── blog.json
```

## 实现步骤

### 第 1 步：创建拆分脚本

```bash
npx tsx scripts/split-translations-v2.ts
```

### 第 2 步：更新翻译加载器

修改 `src/lib/translations.ts`：

```typescript
// 加载核心翻译（每个页面）
export async function loadCoreMessages(locale: string) {
  return import(`@/messages/${locale}/core.json`);
}

// 加载工具索引（工具列表页）
export async function loadToolsIndex(locale: string) {
  return import(`@/messages/${locale}/tools-index.json`);
}

// 加载单个工具详情（工具详情页）
export async function loadToolDetail(locale: string, slug: string) {
  return import(`@/messages/${locale}/tools/${slug}.json`);
}
```

### 第 3 步：更新页面组件

```typescript
// 首页
const messages = await loadCoreMessages(locale);

// 工具列表页
const [core, toolsIndex] = await Promise.all([
  loadCoreMessages(locale),
  loadToolsIndex(locale),
]);

// 工具详情页
const [core, toolsIndex, toolDetail] = await Promise.all([
  loadCoreMessages(locale),
  loadToolsIndex(locale),
  loadToolDetail(locale, slug),
]);
```

## 预期效果

| 页面 | 当前加载 | 拆分后加载 | 减少 |
|------|---------|-----------|------|
| 首页 | 1.6 MB | ~15 KB | 99% |
| 工具列表 | 1.6 MB | ~110 KB | 93% |
| 工具详情 | 1.6 MB | ~115 KB | 93% |
| 静态页面 | 1.6 MB | ~20 KB | 99% |

## Cloudflare Workers 兼容性

拆分后的翻译文件可以：

1. **打包到 Worker** - core.json + tools-index.json (~110 KB)
2. **存储到 R2/KV** - 工具详细翻译按需获取
3. **边缘缓存** - 利用 Cloudflare CDN 缓存翻译文件

### R2 存储方案

```
r2://u2tool-translations/
├── en/tools/json-formatter.json
├── en/tools/base64.json
├── zh/tools/json-formatter.json
└── ...
```

### 加载流程

```
1. Worker 启动 → 加载 core.json (内置)
2. 用户访问工具页 → 从 R2 获取工具翻译
3. 缓存到 KV → 后续请求直接从 KV 读取
```

## 下一步

### ✅ 已完成
1. ✅ 运行 `npx tsx scripts/split-translations-v2.ts` 执行拆分
2. ✅ 更新翻译加载逻辑 (`src/lib/translations.ts`)
3. ✅ 测试所有页面功能 (2970 tests passed)
4. ✅ 构建验证 (2394 pages generated)

### 待部署
1. 部署到 Vercel 生产环境
2. 验证生产环境翻译加载正常
3. 监控性能指标变化

### 回滚方案
如需回滚，只需删除或设置为 false：
```
NEXT_PUBLIC_USE_SPLIT_TRANSLATIONS=false
```
原始翻译文件保持不变，可随时切换回 v1 模式。
