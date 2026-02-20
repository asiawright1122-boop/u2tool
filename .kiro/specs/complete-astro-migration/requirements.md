# 需求文档：完成 Astro + Svelte 迁移

## 简介

本文档定义了系统性完成 U2Tool 从 Next.js + React 到 Astro 5.x + Svelte 5.x 迁移的需求。当前迁移状态：509 个 Svelte 组件文件中仅 282 个（55%）能通过编译，227 个（45%）存在编译错误。根本原因是转换器脚本 `convert-react-to-svelte.ts` 存在系统性缺陷。本 spec 的核心策略是：修复转换器根因 → 重新转换全部组件 → 验证构建 → 部署准备，而非逐个修补已损坏的输出文件。

## 术语表

- **Converter**: React TSX → Svelte 5 自动转换脚本 (`astro-u2tool/scripts/convert-react-to-svelte.ts`)
- **Svelte_Compiler**: Svelte 5 编译器，用于验证 `.svelte` 文件语法正确性
- **Self_Closing_Tag**: HTML 自闭合标签（如 `<textarea />`），在 Svelte 中必须写为 `<textarea></textarea>`
- **Block_Tag**: Svelte 模板控制流标签（`{#if}`, `{/if}`, `{#each}`, `{/each}`, `{:else}`）
- **JSX_Ternary**: React JSX 中的三元表达式（`{cond ? <A/> : <B/>}`）
- **Rune**: Svelte 5 的响应式原语（`$state`, `$derived`, `$effect`, `$props`）
- **Build_Pipeline**: Astro 静态构建流水线，生成所有 ~5,100 个页面的 HTML
- **Source_Component**: 原始 React TSX 组件文件（位于 `src/components/tools/` 目录）
- **Target_Component**: 转换后的 Svelte 组件文件（位于 `astro-u2tool/src/components/tools/` 目录）
- **Void_Element**: HTML 空元素（如 `<br>`, `<hr>`, `<img>`, `<input>`），不需要闭合标签
- **Non_Void_Element**: 非空 HTML 元素（如 `<textarea>`, `<canvas>`, `<select>`, `<div>`），在 Svelte 中不允许自闭合

## 需求

### 需求 1：项目清理

**用户故事：** 作为开发者，我希望清除所有失败的修补脚本和报告文件，以便从干净的状态重新开始系统性修复。

#### 验收标准

1. WHEN 清理执行时，THE Converter SHALL 保留 `convert-react-to-svelte.ts` 及其测试文件 `__tests__/convert-react-to-svelte.test.ts`，删除 `astro-u2tool/scripts/` 目录下所有其他 `.cjs`、`.sh`、`.mjs` 修补脚本
2. WHEN 清理执行时，THE Build_Pipeline SHALL 删除 `astro-u2tool/` 根目录下所有 `.md` 报告文件（COMPREHENSIVE_FIX_COMPLETE.md、MIGRATION_STATUS.md 等）和所有 `.json` 报告文件（FIX_REPORT.json、BATCH_FIX_REPORT.json 等）
3. WHEN 清理执行时，THE Build_Pipeline SHALL 删除 `astro-u2tool/` 下的备份目录（backup-before-comprehensive-fix/、backup-svelte-components-*/ 等）
4. WHEN 清理执行时，THE Build_Pipeline SHALL 删除 `astro-u2tool/` 下的临时文件（test-hash.svelte、test-hash.tsx、tool-imports-generated.txt、fix-log.txt、fix-progress.log、continuous-fix.log、build.log）
5. WHEN 清理完成后，THE Build_Pipeline SHALL 仅保留项目核心文件：astro.config.mjs、package.json、package-lock.json、tsconfig.json、svelte.config.js、vitest.config.ts、src/ 目录、public/ 目录、scripts/convert-react-to-svelte.ts 及其测试


### 需求 2：修复转换器 - 自闭合标签处理

**用户故事：** 作为开发者，我希望转换器正确处理所有 HTML 自闭合标签，以便生成的 Svelte 组件不会出现 "attempted to close element not open" 编译错误。

#### 验收标准

1. WHEN Converter 遇到 Non_Void_Element 的自闭合写法（如 `<textarea />`、`<canvas />`、`<select />`、`<option />`、`<div />`、`<span />`、`<button />`、`<label />`、`<a />`）时，THE Converter SHALL 将其转换为显式开闭标签对（如 `<textarea></textarea>`）
2. WHEN Converter 遇到 Void_Element 的自闭合写法（如 `<br />`、`<hr />`、`<img />`、`<input />`）时，THE Converter SHALL 保留其自闭合形式或转换为无斜杠形式（如 `<br>`），因为 Void_Element 在 Svelte 中允许自闭合
3. WHEN Converter 遇到 SVG 元素的自闭合写法（如 `<path />`、`<circle />`、`<rect />`、`<line />`、`<image />`）时，THE Converter SHALL 将其转换为显式开闭标签对（如 `<path></path>`），因为 SVG 元素在 Svelte 中不允许自闭合
4. WHEN Converter 处理带属性的自闭合标签（如 `<textarea class="..." placeholder="..." />`）时，THE Converter SHALL 保留所有属性并正确生成闭合标签
5. FOR ALL 转换后的 Target_Component 文件，THE Svelte_Compiler SHALL 不报告任何 "attempted to close element not open" 错误

### 需求 3：修复转换器 - Block_Tag 生成

**用户故事：** 作为开发者，我希望转换器生成正确配对的 Svelte 控制流标签，以便不会出现 "Unexpected block closing tag" 编译错误。

#### 验收标准

1. WHEN Converter 将 JSX 条件渲染 `{condition && <Component />}` 转换为 Svelte 模板时，THE Converter SHALL 生成恰好一对 `{#if condition}...{/if}` 标签
2. WHEN Converter 将嵌套条件渲染转换为 Svelte 模板时，THE Converter SHALL 确保每个 `{#if}` 都有且仅有一个对应的 `{/if}`
3. WHEN Converter 将 `.map()` 调用转换为 `{#each}` 时，THE Converter SHALL 确保每个 `{#each}` 都有且仅有一个对应的 `{/each}`
4. FOR ALL 转换后的 Target_Component 文件，`{#if}` 标签的数量 SHALL 等于 `{/if}` 标签的数量
5. FOR ALL 转换后的 Target_Component 文件，`{#each}` 标签的数量 SHALL 等于 `{/each}` 标签的数量
6. FOR ALL 转换后的 Target_Component 文件，THE Svelte_Compiler SHALL 不报告任何 "Unexpected block closing tag" 错误

### 需求 4：修复转换器 - JSX 表达式完整转换

**用户故事：** 作为开发者，我希望转换器完整处理所有 JSX 表达式模式，以便不会残留 React 语法。

#### 验收标准

1. WHEN Converter 遇到 JSX_Ternary（`{cond ? <A/> : <B/>}`）时，THE Converter SHALL 将其完整转换为 `{#if cond}<A/>{:else}<B/>{/if}`
2. WHEN Converter 遇到嵌套 JSX_Ternary 时，THE Converter SHALL 递归处理所有层级的三元表达式
3. WHEN Converter 遇到模板中的 `.map()` 调用时，THE Converter SHALL 将其转换为 `{#each}` 块，包括处理链式调用（如 `.filter().map()`）
4. WHEN Converter 遇到 `.map()` 回调中包含条件渲染时，THE Converter SHALL 在 `{#each}` 块内正确嵌套 `{#if}` 块
5. FOR ALL 转换后的 Target_Component 文件，模板部分 SHALL 不包含任何 `.map(` 调用
6. FOR ALL 转换后的 Target_Component 文件，模板部分 SHALL 不包含任何 JSX 三元表达式（`? <` 模式后跟 `: <` 模式）

### 需求 5：修复转换器 - TypeScript 与特殊语法处理

**用户故事：** 作为开发者，我希望转换器正确区分 TypeScript 泛型、正则表达式和 HTML 标签，以便不会产生误转换。

#### 验收标准

1. WHEN Converter 遇到 TypeScript 泛型语法（如 `<typeof X>`、`<string>`、`<number>`）在模板表达式中时，THE Converter SHALL 不将其误识别为 HTML 标签
2. WHEN Converter 遇到模板中的正则表达式字面量（如 `/pattern/g`）时，THE Converter SHALL 不将 `/` 误识别为自闭合标签的一部分
3. WHEN Converter 遇到 `className=` 属性时，THE Converter SHALL 将其全部转换为 `class=`
4. WHEN Converter 遇到 `useState` 残留时，THE Converter SHALL 将其转换为 `$state` rune
5. FOR ALL 转换后的 Target_Component 文件，THE Svelte_Compiler SHALL 不报告任何 "Unexpected token" 错误
6. FOR ALL 转换后的 Target_Component 文件，模板部分 SHALL 不包含 `className=` 属性


### 需求 6：修复转换器 - HTML 结构完整性

**用户故事：** 作为开发者，我希望转换器生成结构正确的 HTML，以便不会出现标签嵌套错误。

#### 验收标准

1. WHEN Converter 在条件块（`{#if}`）内包裹 HTML 元素时，THE Converter SHALL 确保条件块不会打断已有的 HTML 标签嵌套结构
2. WHEN Converter 生成模板时，THE Converter SHALL 确保所有非空 HTML 元素都有正确的开闭标签配对
3. WHEN Converter 处理包含多个根元素的 JSX 时，THE Converter SHALL 正确移除 React Fragment（`<>...</>`）而不破坏内部结构
4. FOR ALL 转换后的 Target_Component 文件，THE Svelte_Compiler SHALL 不报告任何 "</div> attempted to close element not open" 类型的错误

### 需求 7：重新转换全部组件

**用户故事：** 作为开发者，我希望使用修复后的转换器重新转换所有 500+ 组件，以便用正确的输出替换所有损坏的文件。

#### 验收标准

1. WHEN 重新转换执行时，THE Converter SHALL 从原始 React Source_Component 目录（`src/components/tools/`）读取所有 `.tsx` 工具组件文件
2. WHEN 重新转换执行时，THE Converter SHALL 覆盖 `astro-u2tool/src/components/tools/` 目录下所有已有的 `.svelte` 文件
3. WHEN 每个组件转换完成后，THE Converter SHALL 使用 Svelte_Compiler 检查输出文件的语法正确性
4. WHEN 重新转换完成后，THE Converter SHALL 生成一份迁移报告，包含：成功编译的组件数量、编译失败的组件列表及错误信息
5. WHEN 重新转换完成后，编译成功率 SHALL 达到 95% 以上（至少 480+ 个组件通过编译）

### 需求 8：手动修复剩余组件

**用户故事：** 作为开发者，我希望对转换器无法自动处理的少量复杂组件进行针对性修复，以便达到 100% 编译通过。

#### 验收标准

1. WHEN 重新转换后仍有组件编译失败时，THE Converter SHALL 按错误类型分类这些组件，生成分类修复清单
2. WHEN 修复 ECharts 图表组件时，THE Target_Component SHALL 使用 EChartsWrapper.svelte 进行懒加载，而非直接导入 ECharts 库
3. WHEN 修复使用大型第三方库的组件（PDF、XLSX 等）时，THE Target_Component SHALL 使用动态 `import()` 懒加载
4. WHEN 所有手动修复完成后，ALL Target_Component 文件 SHALL 通过 Svelte_Compiler 编译检查，编译成功率达到 100%

### 需求 9：构建验证

**用户故事：** 作为开发者，我希望验证 Astro 构建能成功生成所有页面，以便确认迁移完整性。

#### 验收标准

1. WHEN 执行 `astro build` 时，THE Build_Pipeline SHALL 以 0 个错误完成构建
2. WHEN 构建完成后，THE Build_Pipeline SHALL 生成所有 10 种语言 × 500+ 工具的静态 HTML 页面（约 5,100+ 个页面）
3. WHEN 构建完成后，THE Build_Pipeline SHALL 生成包含所有页面 URL 的 sitemap.xml
4. WHEN 构建完成后，THE Build_Pipeline SHALL 验证至少 20 个代表性工具页面的 HTML 包含正确的工具组件标记
5. IF 构建过程中出现错误，THEN THE Build_Pipeline SHALL 输出明确的错误信息，包含失败的文件路径和错误类型

### 需求 10：部署准备

**用户故事：** 作为运维人员，我希望完成 Cloudflare Pages 部署配置，以便新站点可以上线。

#### 验收标准

1. THE Build_Pipeline SHALL 配置 Cloudflare Pages 的 `_redirects` 文件，包含旧 URL 到新 URL 的 301 重定向规则
2. THE Build_Pipeline SHALL 配置 `_headers` 文件，为静态资源设置长期缓存头（`Cache-Control: public, max-age=31536000, immutable`）
3. THE Build_Pipeline SHALL 验证构建产物符合 Cloudflare Pages 限制（单文件 < 25MB，总文件数 < 20,000）
4. WHEN 翻译文件总大小超过 Cloudflare 限制时，THE Build_Pipeline SHALL 使用按需加载策略，仅在页面中内联当前工具所需的翻译数据
5. THE Build_Pipeline SHALL 验证所有 10 种语言的页面均可正确渲染，包括 RTL 布局的阿拉伯语页面