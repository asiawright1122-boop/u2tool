# 需求文档：Astro + Svelte 迁移

## 简介

将 U2Tool 在线工具集网站从 Next.js 16 + React 19 技术栈迁移到 Astro 5.x + Svelte 5.x 技术栈。项目包含 500+ 纯前端工具组件、10 种语言支持、~5,100 个页面、18.9 MB 翻译文件。迁移目标是利用 Astro 岛屿架构大幅减少客户端 JS、实现静态生成所有页面、原生支持 Cloudflare Workers/Pages 部署，同时保持所有功能和 SEO 完整性。

## 术语表

- **Migration_System**: 整个从 Next.js + React 到 Astro + Svelte 的迁移系统
- **Astro_Project**: 基于 Astro 5.x 框架的新项目
- **Svelte_Component**: 使用 Svelte 5.x 编写的交互式工具组件
- **Island_Architecture**: Astro 岛屿架构，静态 HTML 中嵌入可交互的 Svelte 组件
- **Tool_Component**: 单个工具的 Svelte 组件（如 JSON 格式化器、Base64 编码器等）
- **I18n_System**: 国际化系统，负责 10 种语言的翻译加载和路由
- **Translation_Loader**: 翻译文件加载器，负责按需加载翻译数据
- **SEO_System**: 搜索引擎优化系统，包含元数据、结构化数据、sitemap 等
- **Build_Pipeline**: Astro 构建流水线，负责静态生成所有页面
- **Component_Converter**: 自动化脚本，将 React 组件转换为 Svelte 组件
- **ECharts_Wrapper**: ECharts 图表库的 Svelte 懒加载包装组件
- **Cloudflare_Adapter**: Astro 的 Cloudflare Workers/Pages 部署适配器
- **Tool_Registry**: 工具注册表，管理 500+ 工具的配置和动态加载


## 需求

### 需求 1：Astro 项目初始化与基础架构

**用户故事：** 作为开发者，我希望搭建 Astro 5.x + Svelte 5.x 项目骨架，以便为后续迁移提供基础框架。

#### 验收标准

1. THE Astro_Project SHALL 使用 Astro 5.x 框架初始化，集成 Svelte 5.x、Tailwind CSS 4.x 和 TypeScript
2. THE Astro_Project SHALL 配置 Cloudflare_Adapter 以支持 Cloudflare Workers/Pages 部署
3. THE Astro_Project SHALL 复用现有 `src/config/tools.ts` 中的工具配置数据结构（slug、category、icon、component、popular 字段）
4. THE Astro_Project SHALL 定义与现有项目一致的路由结构：`/{locale}` 首页、`/{locale}/tools` 工具列表、`/{locale}/tools/{slug}` 工具详情、`/{locale}/categories/{category}` 分类页
5. WHEN Astro_Project 构建完成时，THE Build_Pipeline SHALL 静态生成所有 10 种语言的页面

### 需求 2：国际化系统迁移

**用户故事：** 作为用户，我希望在新站点中继续使用 10 种语言浏览工具，以便获得本地化体验。

#### 验收标准

1. THE I18n_System SHALL 支持 10 种语言：en、zh、ja、ko、es、pt、fr、de、ru、ar
2. THE I18n_System SHALL 复用现有 `src/messages/{locale}.json` 翻译文件，保持翻译键结构不变
3. WHEN 用户访问 `/{locale}/tools/{slug}` 页面时，THE Translation_Loader SHALL 仅加载该工具所需的翻译数据，而非整个语言文件
4. WHEN 用户首次访问站点时，THE I18n_System SHALL 根据浏览器 Accept-Language 头或 IP 地理位置检测用户语言偏好
5. THE I18n_System SHALL 在 URL 路径中包含语言前缀（如 `/en/tools/json-formatter`）
6. WHEN 用户切换语言时，THE I18n_System SHALL 保持当前页面路径不变，仅替换语言前缀
7. THE I18n_System SHALL 支持 RTL（从右到左）布局用于阿拉伯语（ar）页面
8. WHEN 翻译键缺失时，THE I18n_System SHALL 回退到英语（en）翻译

### 需求 3：工具组件迁移

**用户故事：** 作为用户，我希望所有 500+ 工具在新站点中功能完全一致，以便继续使用我依赖的工具。

#### 验收标准

1. THE Component_Converter SHALL 提供自动化脚本，将 React TSX 组件转换为 Svelte 组件的基础结构
2. WHEN 一个 React 工具组件被转换为 Svelte_Component 时，THE Svelte_Component SHALL 保持与原组件相同的输入输出行为
3. THE Tool_Registry SHALL 管理所有 500+ 工具的配置，支持按 slug 查找工具和按 category 过滤
4. WHEN 用户访问工具详情页时，THE Island_Architecture SHALL 仅对工具交互区域进行客户端水合（hydration），页面其余部分保持纯静态 HTML
5. THE Svelte_Component SHALL 使用 Svelte 5 的 runes 语法（$state、$derived、$effect）管理组件状态
6. WHEN 工具组件需要大型第三方库（如 ECharts、pdfjs-dist、xlsx）时，THE Svelte_Component SHALL 使用动态 import() 懒加载该库

### 需求 4：ECharts 图表工具迁移

**用户故事：** 作为用户，我希望 48 个图表工具在新站点中正常工作且加载流畅，以便继续生成各类图表。

#### 验收标准

1. THE ECharts_Wrapper SHALL 提供 Svelte 版本的 ECharts 懒加载包装组件
2. WHEN 用户打开图表工具页面时，THE ECharts_Wrapper SHALL 使用动态 import() 异步加载 ECharts 库，避免阻塞主线程
3. WHILE ECharts 库正在加载时，THE ECharts_Wrapper SHALL 显示加载骨架屏
4. IF ECharts 库加载失败，THEN THE ECharts_Wrapper SHALL 显示错误提示并提供重试按钮
5. THE ECharts_Wrapper SHALL 支持图表导出功能（PNG、SVG 格式），并在 ECharts 实例未就绪时安全返回
6. WHEN 48 个图表组件被迁移后，THE Svelte_Component SHALL 保持与原 React 组件相同的图表配置和交互行为


### 需求 5：SEO 系统迁移

**用户故事：** 作为站长，我希望迁移后 SEO 表现不退化，以便保持搜索引擎排名和流量。

#### 验收标准

1. THE SEO_System SHALL 为每个工具页面生成唯一的 title 和 description 元数据，使用对应语言的 seo_title 和 seo_description 翻译键
2. THE SEO_System SHALL 为每个页面生成完整的 hreflang 标签，包含所有 10 种语言的互相引用和 x-default 指向英语版本
3. THE SEO_System SHALL 为每个页面生成绝对路径的 canonical URL（格式：`https://www.u2tool.com/{locale}/tools/{slug}`）
4. THE SEO_System SHALL 为工具页面生成结构化数据：SoftwareApplication、HowTo、FAQPage、BreadcrumbList
5. THE SEO_System SHALL 生成包含所有 ~5,100 个页面的 sitemap.xml
6. THE SEO_System SHALL 生成 robots.txt 文件
7. WHEN 旧 URL 路径与新 URL 路径不同时，THE SEO_System SHALL 配置 301 重定向规则
8. THE SEO_System SHALL 保持现有的工具别名重定向（如 `base64-encoder` → `base64`）

### 需求 6：页面布局与主题系统迁移

**用户故事：** 作为用户，我希望新站点保持相同的视觉风格和暗色模式支持，以便获得一致的使用体验。

#### 验收标准

1. THE Astro_Project SHALL 迁移 Header、Footer、GlobalSidebar 布局组件为 Astro 组件或 Svelte 组件
2. THE Astro_Project SHALL 实现暗色/亮色主题切换功能，使用 Svelte store 管理主题状态
3. WHEN 用户切换主题时，THE Astro_Project SHALL 将主题偏好存储到 localStorage 并立即应用
4. THE Astro_Project SHALL 在页面加载时读取 localStorage 中的主题偏好，避免主题闪烁（FOUC）
5. THE Astro_Project SHALL 使用 Tailwind CSS 4.x 实现与现有站点一致的样式
6. THE Astro_Project SHALL 支持阿拉伯语的 RTL 布局方向
7. THE Astro_Project SHALL 实现面包屑导航组件，包含正确的 BreadcrumbList 结构化数据

### 需求 7：API 路由迁移

**用户故事：** 作为开发者，我希望现有的 API 功能在新架构中继续工作，以便支持 OG 图片生成、汇率查询等功能。

#### 验收标准

1. THE Astro_Project SHALL 将现有 3 个 API 路由迁移为 Astro API endpoints 或 Cloudflare Workers 函数
2. WHEN 请求 `/api/og` 时，THE Astro_Project SHALL 动态生成 Open Graph 图片
3. WHEN 请求 `/api/exchange-rates` 时，THE Astro_Project SHALL 返回最新汇率数据
4. WHEN 请求 `/api/indexnow-key` 时，THE Astro_Project SHALL 返回 IndexNow 验证密钥
5. IF API 请求失败，THEN THE Astro_Project SHALL 返回适当的 HTTP 错误状态码和错误信息

### 需求 8：性能优化

**用户故事：** 作为用户，我希望新站点加载速度更快，以便获得流畅的使用体验。

#### 验收标准

1. THE Astro_Project SHALL 利用岛屿架构，使工具详情页的初始 HTML 不包含工具组件的 JavaScript（仅在需要交互时水合）
2. THE Build_Pipeline SHALL 静态生成所有 ~5,100 个页面的 HTML
3. WHEN 用户访问工具页面时，THE Translation_Loader SHALL 仅加载当前语言和当前工具的翻译数据（平均 2.5KB），而非整个语言文件（0.7-1.3MB）
4. THE Astro_Project SHALL 实现字体预加载（Plus Jakarta Sans，仅 400/600/700 字重）
5. THE Astro_Project SHALL 达到 Core Web Vitals 目标：LCP < 2.5s、INP < 200ms、CLS < 0.1
6. WHEN 工具组件使用大型第三方库时，THE Svelte_Component SHALL 使用 requestIdleCallback 或 setTimeout 延迟加载，避免阻塞主线程
7. THE Astro_Project SHALL 配置适当的 Cache-Control 头：静态资源使用长期缓存（immutable），HTML 页面使用 stale-while-revalidate 策略

### 需求 9：Cloudflare 部署

**用户故事：** 作为运维人员，我希望新站点部署到 Cloudflare Workers/Pages，以便获得全球 CDN 加速和更低的运营成本。

#### 验收标准

1. THE Astro_Project SHALL 使用 `@astrojs/cloudflare` 适配器配置 Cloudflare 部署
2. THE Build_Pipeline SHALL 生成符合 Cloudflare Pages 限制的构建产物（单文件 < 25MB，总文件数 < 20,000）
3. WHEN 构建产物超过 Cloudflare 限制时，THE Build_Pipeline SHALL 将翻译文件存储到 Cloudflare KV 或 R2，而非打包到构建产物中
4. THE Astro_Project SHALL 配置 Cloudflare CDN 缓存规则，静态资源缓存至少 30 天
5. IF 部署失败，THEN THE Build_Pipeline SHALL 输出明确的错误信息指示失败原因

### 需求 10：自动化迁移工具

**用户故事：** 作为开发者，我希望有自动化脚本辅助批量迁移 500+ 组件，以便提高迁移效率并减少人工错误。

#### 验收标准

1. THE Component_Converter SHALL 提供 CLI 脚本，接受 React TSX 文件路径作为输入，输出对应的 Svelte 组件文件
2. WHEN Component_Converter 转换一个 React 组件时，THE Component_Converter SHALL 将 useState 转换为 Svelte $state rune
3. WHEN Component_Converter 转换一个 React 组件时，THE Component_Converter SHALL 将 useEffect 转换为 Svelte $effect rune
4. WHEN Component_Converter 转换一个 React 组件时，THE Component_Converter SHALL 将 JSX 语法转换为 Svelte 模板语法（{#if}、{#each}、{@html} 等）
5. WHEN Component_Converter 转换一个 React 组件时，THE Component_Converter SHALL 将 className 属性转换为 class 属性
6. WHEN Component_Converter 遇到无法自动转换的模式时，THE Component_Converter SHALL 在输出文件中插入 `<!-- TODO: 手动转换 -->` 注释标记
7. THE Component_Converter SHALL 生成迁移报告，列出成功转换、需要手动调整和转换失败的组件

### 需求 11：测试与验证

**用户故事：** 作为开发者，我希望迁移后的站点通过全面测试，以便确保功能完整性和质量。

#### 验收标准

1. THE Migration_System SHALL 配置 Vitest 作为单元测试框架，Playwright 作为端到端测试框架
2. WHEN 运行端到端测试时，THE Migration_System SHALL 验证所有 14 个工具分类页面可正常访问
3. WHEN 运行端到端测试时，THE Migration_System SHALL 验证至少 50 个代表性工具的核心功能正常工作
4. WHEN 运行端到端测试时，THE Migration_System SHALL 验证 10 种语言的页面均可正常渲染
5. WHEN 运行端到端测试时，THE Migration_System SHALL 验证主题切换功能正常工作
6. THE Migration_System SHALL 运行翻译完整性测试，确保所有工具在所有语言中的翻译键完整
7. THE Migration_System SHALL 验证所有页面的结构化数据符合 Schema.org 规范

### 需求 12：渐进式迁移策略

**用户故事：** 作为项目经理，我希望迁移过程可控且可回滚，以便降低迁移风险。

#### 验收标准

1. THE Migration_System SHALL 支持分阶段迁移：先迁移静态页面（首页、分类页），再迁移工具组件
2. WHEN 迁移某个阶段完成时，THE Migration_System SHALL 提供该阶段的功能验证清单
3. THE Migration_System SHALL 保留原 Next.js 项目代码，直到新站点完全验证通过
4. WHEN 新站点出现严重问题时，THE Migration_System SHALL 支持快速回滚到原 Next.js 站点
5. THE Migration_System SHALL 提供迁移进度追踪，记录已迁移和未迁移的工具组件列表