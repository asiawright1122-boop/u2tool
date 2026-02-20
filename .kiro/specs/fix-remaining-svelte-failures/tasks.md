# Implementation Plan: 修复剩余 29 个 Svelte 编译失败组件

## Overview

修复转换器 `convert-react-to-svelte.ts` 中的 8 种错误模式，通过在现有管道中新增修复函数，将 507 个组件的编译成功率从 94.3% 提升到 100%。所有修改集中在转换器脚本和测试文件中。

## Tasks

- [x] 1. 实现 Script 块修复函数
  - [x] 1.1 实现 `stripReactTypes` 函数
    - 在 `convert-react-to-svelte.ts` 中新增 `stripReactTypes(script: string): string` 函数
    - 定义 `REACT_TYPE_MAP` 映射表，覆盖所有 React 事件类型到原生 DOM 类型的映射
    - 使用正则匹配 `React.ChangeEvent<...>`、`React.DragEvent`、`React.MouseEvent`、`React.TouchEvent`、`React.KeyboardEvent`、`React.FormEvent`、`React.ReactElement`、`React.ReactNode` 等模式
    - 将匹配到的类型替换为对应的原生类型（Event, DragEvent, MouseEvent 等）
    - 对于未知的 `React.` 类型，替换为 `any`
    - 在 `cleanupScriptBlock` 函数末尾调用此函数
    - 导出函数以便测试
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9_

  - [ ]* 1.2 编写 `stripReactTypes` 属性测试
    - **Property 1: React 类型注解完全清除**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9**

  - [x] 1.3 实现 `fixDuplicateDeclarations` 函数
    - 在 `convert-react-to-svelte.ts` 中新增 `fixDuplicateDeclarations(script: string, propsVarNames: string[]): string` 函数
    - 解析 script 块中的所有 `let`/`const`/`var` 声明，收集变量名
    - 检测与 `propsVarNames` 冲突的内部声明，将内部变量重命名（添加前缀如 `_internal` 或 `selected`）
    - 检测同一作用域内的重复声明，移除第二次声明或改为赋值
    - 在 `generateScriptBlock` 中调用此函数，传入从 `$props()` 解构的变量名列表
    - 导出函数以便测试
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 1.4 编写 `fixDuplicateDeclarations` 属性测试
    - **Property 3: 无重复变量声明**
    - **Validates: Requirements 4.1, 4.2, 4.3**

  - [x] 1.5 实现 `fixConstAssignment` 函数
    - 在 `convert-react-to-svelte.ts` 中新增 `fixConstAssignment(script: string): string` 函数
    - 收集所有 `const` 声明的变量名
    - 检查这些变量是否在后续代码中被赋值（`varName = ...`）
    - 如果被赋值，将 `const` 改为 `let`
    - 在 `cleanupScriptBlock` 函数中调用
    - 导出函数以便测试
    - _Requirements: 8.1, 8.2_

  - [ ]* 1.6 编写 `fixConstAssignment` 属性测试
    - **Property 6: Const 赋值修复**
    - **Validates: Requirements 8.1, 8.2**

- [x] 2. Checkpoint - 确保 Script 块修复测试通过
  - 运行 `npx vitest run --config vitest.config.ts` 确保所有测试通过
  - 如有问题请询问用户

- [x] 3. 实现 Template 块修复函数
  - [x] 3.1 实现 `fixTableChildConstraints` 函数
    - 在 `convert-react-to-svelte.ts` 中新增 `fixTableChildConstraints(template: string): string` 函数
    - 解析 `<table>...</table>` 块，检查直接子节点
    - 如果 `{#if}`、`{#each}` 块或文本节点直接作为 `<table>` 子元素，将其包裹在 `<tbody>` 中
    - 保留已有的 `<thead>`、`<tbody>`、`<tfoot>` 结构不变
    - 在 `transformJsxToSvelteTemplate` 管道的 Step 22 之后调用
    - 导出函数以便测试
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 3.2 编写 `fixTableChildConstraints` 属性测试
    - **Property 2: Table 子元素约束修复**
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [x] 3.3 实现 `fixSequenceExpressions` 函数
    - 在 `convert-react-to-svelte.ts` 中新增 `fixSequenceExpressions(template: string): string` 函数
    - 匹配属性值中的序列表达式模式：`attr={(expr1, expr2)}`
    - 将序列表达式包裹在括号中或重构为箭头函数体 `attr={() => { expr1; expr2; }}`
    - 特别处理事件处理器中的序列表达式（如 `onchange={(e) => a = b, c}`）
    - 在 `transformJsxToSvelteTemplate` 管道中调用
    - 导出函数以便测试
    - _Requirements: 6.1, 6.2_

  - [ ]* 3.4 编写 `fixSequenceExpressions` 属性测试
    - **Property 5: 序列表达式安全**
    - **Validates: Requirements 6.1, 6.2**

  - [x] 3.5 实现 `fixInvalidElementNames` 函数
    - 在 `convert-react-to-svelte.ts` 中新增 `fixInvalidElementNames(template: string): string` 函数
    - 检测模板中不是有效 HTML 标签名或 Svelte 组件名的标签
    - 处理残留的未转换三元表达式导致的无效标签（如 `parseInt(customPort) <= 65535` 被解析为标签）
    - 处理残留的 JSX 函数调用（如 `{renderText()}`）在模板中的引用
    - 在 `transformJsxToSvelteTemplate` 管道中调用
    - 导出函数以便测试
    - _Requirements: 7.1, 7.2_

  - [x] 3.6 实现 `cleanupResidualJsx` 函数
    - 在 `convert-react-to-svelte.ts` 中新增 `cleanupResidualJsx(template: string): string` 函数
    - 清理模板中残留的 JSX 特有语法：`ref={...}` → `bind:this={...}`
    - 清理残留的 `key={...}` 属性（Svelte 使用 `{#each ... as item (key)}` 语法）
    - 清理残留的 `style={{...}}` 对象语法 → Svelte 的 `style="..."` 字符串语法
    - 在 `transformJsxToSvelteTemplate` 管道最后调用
    - 导出函数以便测试
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ]* 3.7 编写 Template 块修复的单元测试
    - 为 fixTableChildConstraints 编写 CsvViewer 和 HtmlTableGenerator 的具体测试用例
    - 为 fixSequenceExpressions 编写 EslintConfigGenerator 的具体测试用例
    - 为 fixInvalidElementNames 编写 PortScanner 和 TypingSpeedTest 的具体测试用例
    - 为 cleanupResidualJsx 编写边界情况测试
    - _Requirements: 10.1_

- [x] 4. Checkpoint - 确保 Template 块修复测试通过
  - 运行 `npx vitest run --config vitest.config.ts` 确保所有测试通过
  - 如有问题请询问用户

- [x] 5. 改进现有转换函数处理边界情况
  - [x] 5.1 改进 `transformTernary` 处理不完整转换
    - 分析 PortScanner 中 `parseInt(customPort) >= 1 ? ... : ...` 未被正确转换的原因
    - 修复 `parseTernaryParts` 对包含比较运算符的条件的处理
    - 确保嵌套三元表达式被递归处理
    - _Requirements: 2.1, 5.1, 5.2_

  - [x] 5.2 改进 `protectTypeScriptGenerics` 处理 TreeChartGenerator 的泛型
    - 分析 TreeChartGenerator 中 "Expected token >" 错误的具体原因
    - 修复泛型保护函数对特定模式的遗漏
    - _Requirements: 2.2_

  - [x] 5.3 改进子组件函数处理
    - 分析 ScientificCalculator (Button) 和 TypingSpeedTest (renderText) 中子组件函数的模式
    - 在 `extractRegularFunctions` 中识别返回 JSX 的函数
    - 将这些函数转换为 Svelte `{#snippet}` 语法或内联到模板中
    - _Requirements: 2.5_

  - [ ]* 5.4 编写改进函数的单元测试
    - 测试 transformTernary 对比较运算符条件的处理
    - 测试 protectTypeScriptGenerics 对 TreeChartGenerator 模式的处理
    - 测试子组件函数到 snippet 的转换
    - _Requirements: 10.1_

- [x] 6. Checkpoint - 确保所有改进测试通过
  - 运行 `npx vitest run --config vitest.config.ts` 确保所有测试通过
  - 如有问题请询问用户

- [x] 7. 集成管道并批量验证
  - [x] 7.1 将所有新函数集成到转换管道
    - 在 `transformJsxToSvelteTemplate` 中按正确顺序添加新步骤调用
    - 在 `cleanupScriptBlock` 和 `generateScriptBlock` 中添加新函数调用
    - 确保函数调用顺序正确，不产生冲突
    - _Requirements: 9.1_

  - [x] 7.2 运行批量重新转换并验证
    - 执行 `npx tsx astro-u2tool/scripts/batch-reconvert.ts`
    - 检查迁移报告中的失败数量
    - 如果仍有失败，分析具体错误并迭代修复
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 7.3 编写花括号平衡属性测试
    - **Property 4: 花括号平衡不变量**
    - **Validates: Requirements 5.1, 5.3**

- [x] 8. Final checkpoint - 确保全部测试通过且编译成功率 100%
  - 运行 `npx vitest run --config vitest.config.ts` 确保所有测试通过
  - 运行 `npx tsx astro-u2tool/scripts/batch-reconvert.ts` 确认 100% 成功率
  - 如有问题请询问用户

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 所有新函数追加到现有管道末尾，不修改已有步骤逻辑
- 每个 checkpoint 都应验证之前成功的 478 个组件无回归
- Property tests 使用 fast-check 库，每个属性至少 100 次迭代
- 测试运行命令: `npx vitest run --config vitest.config.ts`（在 astro-u2tool/ 目录）
- 批量转换命令: `npx tsx astro-u2tool/scripts/batch-reconvert.ts`
