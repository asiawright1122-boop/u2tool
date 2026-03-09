# 实现计划：完成 Astro + Svelte 迁移

## 概述

系统性修复转换器根因，重新转换全部 500+ 组件，验证构建并准备部署。使用 TypeScript 实现所有脚本，Vitest + fast-check 进行测试。

## 任务

- [x] 1. 项目清理
  - [x] 1.1 创建清理脚本 `astro-u2tool/scripts/cleanup-migration.ts`
    - 删除 `astro-u2tool/scripts/` 下所有 `.cjs`、`.sh`、`.mjs`、`.py` 修补脚本（保留 `convert-react-to-svelte.ts`、`convert-react-to-svelte-v2.ts`、`__tests__/` 目录）
    - 删除 `astro-u2tool/scripts/` 下所有 `.json` 报告文件（audit-report.json、compile-report.json、runtime-issues-report.json、undefined-vars-report.json）
    - 删除 `astro-u2tool/` 根目录下所有 `.md` 报告文件（COMPREHENSIVE_FIX_COMPLETE.md、COMPREHENSIVE_FIX_PLAN.md、COMPREHENSIVE_FIX_SUMMARY.md、CONVERSION_FIX_STATUS.md、FINAL_FIX_SUMMARY.md、FINAL_VERIFICATION_REPORT.txt、MIGRATION_STATUS.md、REACT_TO_SVELTE_FIX_REPORT.md、RUNTIME_FIXES_REPORT.md）
    - 删除 `astro-u2tool/` 根目录下所有 `.json` 报告文件（BATCH_FIX_REPORT.json、COMPREHENSIVE_FIX_REPORT.json、FINAL_BATCH_FIX_REPORT.json、FIX_REPORT.json、migration-report.json、REACT_COMPONENTS_IN_SVELTE.json、REACT_FUNCTIONS_REPORT.json、SMART_FIX_REPORT.json、SVELTE_FIX_REPORT.json、ULTIMATE_CHECK_REPORT.json、ULTIMATE_STRUCTURE_FIX_REPORT.json）
    - 删除备份目录（backup-before-comprehensive-fix/、backup-svelte-components-*/）
    - 删除临时文件（test-hash.svelte、test-hash.tsx、tool-imports-generated.txt、fix-log.txt、fix-progress.log、continuous-fix.log、build.log）
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. 修复转换器 - 自闭合标签处理
  - [x] 2.1 在 `convert-react-to-svelte.ts` 中新增 `fixSelfClosingNonVoidElements` 函数
    - 定义 `VOID_ELEMENTS` 常量集合（area, base, br, col, embed, hr, img, input, link, meta, param, source, track, wbr）
    - 使用正则匹配 `<tagName ... />` 模式
    - 如果 tagName 不在 VOID_ELEMENTS 中，转换为 `<tagName ...></tagName>`
    - 保留所有原始属性
    - 处理 SVG 元素（path, circle, rect, line, polyline, polygon, ellipse, image, text, g 等）
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [ ]* 2.2 编写 Property 1 和 Property 2 的属性测试
    - **Property 1: 非空元素自闭合修复**
    - **Property 2: 空元素保持不变**
    - 使用 fast-check 生成随机标签名和属性
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [x] 3. 修复转换器 - Block Tag 生成
  - [x] 3.1 改进 `transformConditionalAnd` 函数
    - 在迭代循环中，跳过已经是 `{#if}` 开头的表达式，避免重复转换
    - 添加对 `{:else}` 和 `{:else if}` 的识别，不将其误判为新的条件表达式
    - _Requirements: 3.1, 3.2_

  - [x] 3.2 改进 `transformTernary` 函数
    - 支持递归处理嵌套三元表达式（分支中包含三元）
    - 确保每个转换产生完整的 `{#if}...{:else}...{/if}` 结构
    - _Requirements: 4.1, 4.2_

  - [x] 3.3 改进 `transformArrayMap` 函数
    - 改进 `parseMapCallback` 对多行回调体的处理
    - 处理回调体中包含条件渲染的情况
    - 处理链式调用（.filter().map()、.sort().map() 等）
    - _Requirements: 4.3, 4.5_

  - [x] 3.4 新增 `validateAndFixBlockTags` 后处理函数
    - 使用栈结构验证 `{#if}/{:else}/{/if}` 和 `{#each}/{/each}` 的嵌套正确性
    - 统计开闭标签数量，如果不匹配则尝试移除多余的闭合标签
    - 在无法自动修复时记录到 ConversionResult.todos
    - _Requirements: 3.4, 3.5_

  - [ ]* 3.5 编写 Property 3 的属性测试
    - **Property 3: Block Tag 平衡不变量**
    - 生成包含条件渲染和 .map() 的 JSX 模板，验证转换后 block tags 平衡
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**

- [x] 4. 修复转换器 - TypeScript 与特殊语法保护
  - [x] 4.1 新增 `protectTypeScriptGenerics` 和 `restoreTypeScriptGenerics` 函数
    - 在模板转换前，将 TypeScript 泛型语法（`<typeof X>`、`<string>`、`<number>` 等）替换为占位符
    - 使用 Map 存储占位符到原始内容的映射
    - 在模板转换完成后恢复原始内容
    - _Requirements: 5.1_

  - [x] 4.2 新增 `protectRegexLiterals` 和 `restoreRegexLiterals` 函数
    - 在模板转换前，将正则表达式字面量（`/pattern/flags`）替换为占位符
    - 避免正则中的 `/` 和 `<>` 被误识别为 HTML 标签语法
    - 在模板转换完成后恢复原始内容
    - _Requirements: 5.2_

  - [x] 4.3 确保 `className` → `class` 转换的完整性
    - 在所有模板转换步骤完成后，再次执行 `transformClassName` 作为兜底
    - 确保动态生成的模板片段中的 `className` 也被转换
    - _Requirements: 5.3, 5.6_

  - [x] 4.4 确保 `useState` 残留被完整处理
    - 检查 `extractUseState` 函数对所有 useState 模式的覆盖
    - 处理解构赋值模式（`const [x, setX] = useState()`）和非标准模式
    - _Requirements: 5.4_

  - [ ]* 4.5 编写 Property 6 的属性测试
    - **Property 6: TypeScript 泛型与正则表达式保护**
    - 生成包含泛型和正则的模板表达式，验证转换后语义不变
    - **Validates: Requirements 5.1, 5.2**

- [x] 5. 修复转换器 - HTML 结构完整性
  - [x] 5.1 改进条件块内 HTML 元素的包裹逻辑
    - 确保 `{#if}` 块不会打断已有的 HTML 标签嵌套结构
    - 当条件块内有多个兄弟元素时，用包装元素（`<div>` 或 Svelte fragment）包裹
    - _Requirements: 6.1, 6.2_

  - [x] 5.2 改进 React Fragment 移除逻辑
    - 正确移除 `<>...</>` 和 `<React.Fragment>...</React.Fragment>`
    - 确保移除 Fragment 后不破坏内部元素的嵌套结构
    - _Requirements: 6.3_

  - [x] 5.3 集成所有修复到转换器主流程
    - 更新 `transformJsxToSvelteTemplate` 函数，按正确顺序调用所有新增/改进的函数
    - 执行顺序：预处理（保护泛型/正则）→ 核心转换（10 步）→ 后处理（自闭合修复 → 恢复泛型/正则 → Block Tag 验证 → className 兜底）
    - _Requirements: 2.1-2.5, 3.1-3.6, 4.1-4.6, 5.1-5.6, 6.1-6.4_

  - [ ]* 5.4 编写 Property 5 和 Property 7 的属性测试
    - **Property 5: React 语法零残留**
    - **Property 7: React Fragment 干净移除**
    - **Validates: Requirements 4.5, 4.6, 5.3, 5.6, 6.3**

- [x] 6. 转换器验证检查点
  - [x] 6.1 编写转换器单元测试覆盖所有 9 类错误
    - 为每种错误类型编写至少 3 个具体的输入/输出示例测试
    - 测试边界情况：空输入、深度嵌套、属性中包含特殊字符
    - 测试 ECharts 组件的特殊转换逻辑
    - 运行所有测试确保通过
    - _Requirements: 2.1-2.5, 3.1-3.6, 4.1-4.6, 5.1-5.6, 6.1-6.4_

  - [x] 6.2 选取 20 个代表性 React 组件进行端到端转换验证
    - 选择覆盖所有错误类型的组件（包含自闭合标签、条件渲染、.map()、三元表达式、TypeScript 泛型、正则、ECharts 等）
    - 对每个组件执行转换 → Svelte 编译检查 → 验证无错误
    - 如果有失败，修复转换器后重新验证
    - _Requirements: 7.3, 7.5_

- [x] 7. 重新转换全部组件
  - [x] 7.1 创建批量重新转换脚本 `astro-u2tool/scripts/batch-reconvert.ts`
    - 扫描 `src/components/tools/` 目录下所有 `.tsx` 工具组件文件
    - 对每个文件调用修复后的 `convertFile` 函数
    - 输出覆盖 `astro-u2tool/src/components/tools/` 下对应的 `.svelte` 文件
    - 对每个输出文件运行 Svelte 编译检查
    - 生成 JSON 格式的迁移报告（total、success、failed 及详情）
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [x] 7.2 执行批量重新转换
    - 运行 `npx tsx astro-u2tool/scripts/batch-reconvert.ts`
    - 验证编译成功率 >= 95%
    - 如果成功率 < 95%，分析失败原因，回到任务 2-5 修复转换器，然后重新执行
    - _Requirements: 7.5_

  - [x] 7.3 更新 ToolWrapper.svelte 的导入映射
    - 确保所有成功转换的组件都在 ToolWrapper.svelte 的动态导入表中注册
    - slug 映射必须与 `src/config/tools.ts` 一致
    - _Requirements: 7.1_

- [x] 8. 手动修复剩余组件
  - [x] 8.1 分析并分类编译失败的组件
    - 从迁移报告中提取失败组件列表
    - 按错误类型分组，确定修复优先级（热门工具优先）
    - _Requirements: 8.1_

  - [x] 8.2 修复 ECharts 图表组件
    - 确保所有 48 个图表组件使用 EChartsWrapper.svelte
    - 验证图表渲染、选项响应式更新和导出功能
    - _Requirements: 8.2_

  - [x] 8.3 修复使用大型第三方库的组件
    - 处理 PDF（pdfjs-dist）、XLSX（xlsx）、QRCode 等库的动态导入
    - 确保懒加载逻辑在 Svelte 中正确工作
    - _Requirements: 8.3_

  - [x] 8.4 验证 100% 编译通过
    - 运行全量 Svelte 编译检查
    - 确保所有 500+ 组件通过编译
    - 如果仍有失败，逐个修复直到 100%
    - _Requirements: 8.4_

- [x] 9. 构建验证
  - [x] 9.1 执行 `astro build` 完整构建
    - 运行 `npm run build` 在 `astro-u2tool/` 目录
    - 验证构建以 0 个错误完成
    - 记录构建时间和输出文件数量
    - _Requirements: 9.1_

  - [x] 9.2 验证生成的页面数量和内容
    - 统计生成的 HTML 文件数量，确认约 5,100+ 个页面
    - 抽样检查 20 个工具页面的 HTML 内容，确认包含正确的工具组件标记
    - 验证 sitemap.xml 包含所有页面 URL
    - _Requirements: 9.2, 9.3, 9.4_

  - [x] 9.3 验证多语言页面渲染
    - 检查 10 种语言的首页、工具列表页、工具详情页
    - 验证阿拉伯语页面的 RTL 布局
    - 验证翻译内容正确加载
    - _Requirements: 10.5_

- [x] 10. 部署准备
  - [x] 10.1 配置 Cloudflare Pages 部署文件
    - 创建/更新 `_redirects` 文件，包含 301 重定向规则
    - 创建/更新 `_headers` 文件，配置缓存策略
    - 验证构建产物符合 Cloudflare Pages 限制
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 10.2 验证翻译文件加载策略
    - 确认翻译数据在构建时内联到页面中（静态内容）
    - 确认工具特定翻译按需加载（客户端水合时）
    - 验证翻译文件不会导致超出 Cloudflare 文件大小限制
    - _Requirements: 10.4_

  - [x] 10.3 最终验证清单
    - 运行 Lighthouse 检查 5 个代表性页面（目标：LCP < 2.5s、INP < 200ms、CLS < 0.1）
    - 验证 301 重定向规则正确工作
    - 验证所有 10 种语言页面可正常访问
    - 确认回滚方案：保留原 Next.js 项目，DNS 切换即可回滚
    - _Requirements: 10.1-10.5_

## 注意事项

- 标记 `*` 的任务为可选任务，可跳过以加快进度
- 每个任务引用了对应的需求编号，确保可追溯性
- 任务 6 是关键检查点：转换器修复完成后，必须通过验证才能进入批量转换阶段
- 任务 7.2 有循环依赖：如果成功率不达标，需要回到任务 2-5 继续修复转换器
- 手动修复（任务 8）预计涉及 5-25 个组件（取决于转换器修复质量）
- 构建验证（任务 9）是最终的质量关卡，必须 0 错误才能进入部署准备
