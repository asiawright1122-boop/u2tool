# 需求文档：修复剩余 29 个 Svelte 编译失败组件

## 简介

U2Tool 项目正在从 Next.js + React 迁移到 Astro 5.x + Svelte 5.x。转换器脚本 `convert-react-to-svelte.ts` 已成功转换 478/507 个组件（94.3%），但剩余 29 个组件在 Svelte 编译时失败。本需求描述修复转换器以处理这 29 个组件的所有错误模式，将编译成功率提升到 100%。

## 术语表

- **Converter**: 转换器脚本 `astro-u2tool/scripts/convert-react-to-svelte.ts`，使用 ts-morph 将 React TSX 组件转换为 Svelte 5 组件
- **Svelte_Compiler**: Svelte 5 编译器，用于验证生成的 `.svelte` 文件是否语法正确
- **Batch_Reconvert**: 批量重新转换脚本 `astro-u2tool/scripts/batch-reconvert.ts`，对所有 507 个组件执行转换并运行编译检查
- **React_Type_Annotation**: React 特有的 TypeScript 类型注解，如 `React.ChangeEvent<HTMLInputElement>`、`React.DragEvent`、`React.ReactElement[]`
- **Sequence_Expression**: JavaScript 逗号序列表达式（如 `(a, b)`），Svelte runes 模式不允许其作为属性值
- **Table_Child_Constraint**: Svelte 严格检查 `<table>` 元素的子节点，不允许文本节点（包括 `{#if}` 块）直接作为 `<table>` 的子元素
- **Duplicate_Declaration**: 转换过程中同一变量被声明两次（如 props 中的 `locale` 与内部 `let locale`）
- **Invalid_Element_Name**: Svelte 要求组件名是有效的变量名或点号表达式，不接受无效的标签名
- **Constant_Assignment**: 尝试对 `const` 声明的变量进行赋值操作

## 需求

### 需求 1：清除 React 类型注解残留

**用户故事：** 作为迁移工程师，我希望转换器能自动清除所有 React 特有的类型注解，使生成的 Svelte 组件不包含任何 React 类型引用。

#### 验收标准

1. WHEN Converter 遇到函数参数中的 `React.ChangeEvent<HTMLInputElement>` 类型注解, THE Converter SHALL 将其替换为 `Event` 并在使用处添加 `(e.target as HTMLInputElement)` 类型断言
2. WHEN Converter 遇到函数参数中的 `React.ChangeEvent<HTMLTextAreaElement>` 类型注解, THE Converter SHALL 将其替换为 `Event`
3. WHEN Converter 遇到函数参数中的 `React.ChangeEvent<HTMLSelectElement>` 类型注解, THE Converter SHALL 将其替换为 `Event`
4. WHEN Converter 遇到 `React.DragEvent` 或 `React.DragEvent<HTMLElement>` 类型注解, THE Converter SHALL 将其替换为 `DragEvent`
5. WHEN Converter 遇到 `React.MouseEvent` 类型注解, THE Converter SHALL 将其替换为 `MouseEvent`
6. WHEN Converter 遇到 `React.KeyboardEvent` 类型注解, THE Converter SHALL 将其替换为 `KeyboardEvent`
7. WHEN Converter 遇到 `React.ReactElement[]` 或 `React.ReactNode` 类型注解, THE Converter SHALL 将其移除或替换为通用类型
8. WHEN Converter 遇到 `React.FormEvent` 类型注解, THE Converter SHALL 将其替换为 `Event`
9. WHEN Converter 处理完成后, THE 生成的 Svelte 文件 SHALL 不包含任何以 `React.` 开头的类型引用

### 需求 2：修复 Unexpected Token 解析错误

**用户故事：** 作为迁移工程师，我希望转换器能正确处理导致 "Unexpected token" 编译错误的各种 React 语法模式，使所有组件都能通过 Svelte 编译。

#### 验收标准

1. WHEN Converter 遇到 JSX 中内联的 TypeScript 类型断言（如 `as HTMLInputElement`）, THE Converter SHALL 将其正确转换为 Svelte 兼容的语法
2. WHEN Converter 遇到 JSX 属性中的复杂表达式（包含泛型语法 `<T>`）, THE Converter SHALL 保护泛型语法不被误识别为 HTML 标签
3. WHEN Converter 遇到模板中残留的 JSX 语法片段, THE Converter SHALL 将其转换为有效的 Svelte 模板语法
4. WHEN Converter 遇到 script 块中残留的 React Hook 调用（如未转换的 `useState`）, THE Converter SHALL 将其转换为对应的 Svelte runes
5. WHEN Converter 遇到包含子组件函数（返回 JSX 的内部函数）的组件, THE Converter SHALL 将子组件函数转换为 Svelte snippet 或内联模板

### 需求 3：修复 Table 子元素约束错误

**用户故事：** 作为迁移工程师，我希望转换器能正确处理 `<table>` 元素内的条件渲染，使生成的 Svelte 代码符合 HTML 规范中 table 的子元素约束。

#### 验收标准

1. WHEN Converter 生成的 Svelte 模板中 `{#if}` 块直接作为 `<table>` 的子元素, THE Converter SHALL 将 `{#if}` 块包裹在 `<tbody>` 中或将条件移到 `<table>` 外层
2. WHEN Converter 生成的 Svelte 模板中 `{#each}` 块直接作为 `<table>` 的子元素, THE Converter SHALL 将 `{#each}` 块包裹在 `<tbody>` 中
3. WHEN Converter 生成的 Svelte 模板中文本节点直接作为 `<table>` 的子元素, THE Converter SHALL 移除该文本节点或将其移到 `<table>` 外部

### 需求 4：修复变量重复声明错误

**用户故事：** 作为迁移工程师，我希望转换器能检测并避免变量重复声明，使生成的 Svelte 组件中每个变量只声明一次。

#### 验收标准

1. WHEN Converter 将 React props 解构为 Svelte `$props()` 并且组件内部也声明了同名变量, THE Converter SHALL 重命名内部变量以避免冲突
2. WHEN Converter 在 script 块中检测到同一标识符被声明两次, THE Converter SHALL 将第二次声明改为赋值语句或重命名变量
3. WHEN Converter 处理完成后, THE 生成的 Svelte 文件 SHALL 不包含任何重复的变量声明

### 需求 5：修复 Expected Token 错误

**用户故事：** 作为迁移工程师，我希望转换器能生成语法完整的 Svelte 文件，不缺少任何必要的闭合符号。

#### 验收标准

1. WHEN Converter 生成 Svelte 模板, THE 模板中所有 `{` SHALL 有对应的 `}`
2. WHEN Converter 生成 Svelte 模板, THE 模板中所有 `<tag>` SHALL 有对应的 `</tag>` 或为自闭合标签
3. WHEN Converter 生成 script 块, THE script 块中所有花括号、圆括号和方括号 SHALL 正确配对

### 需求 6：修复 Sequence Expression 错误

**用户故事：** 作为迁移工程师，我希望转换器能正确处理 Svelte runes 模式下不允许的序列表达式。

#### 验收标准

1. WHEN Converter 遇到属性值中的逗号序列表达式（如 `onclick={(a, b)}`）, THE Converter SHALL 将其包裹在括号中或重构为单一表达式
2. WHEN Converter 生成的 Svelte 模板中属性值包含序列表达式, THE Converter SHALL 确保该表达式被括号包裹以符合 runes 模式要求

### 需求 7：修复 Invalid Element Name 错误

**用户故事：** 作为迁移工程师，我希望转换器能确保所有生成的 Svelte 模板中的元素名称都是有效的。

#### 验收标准

1. WHEN Converter 生成的模板中包含无效的组件标签名（非有效变量名或点号表达式）, THE Converter SHALL 将其替换为有效的 HTML 元素或移除无效标签
2. WHEN Converter 遇到动态组件渲染（如 `<{component}>`）, THE Converter SHALL 使用 Svelte 的 `<svelte:component>` 语法替代

### 需求 8：修复 Constant Assignment 错误

**用户故事：** 作为迁移工程师，我希望转换器能正确区分需要可变和不可变的变量声明。

#### 验收标准

1. WHEN Converter 将 React 状态转换为 Svelte `$state()` 并且后续代码对该变量进行赋值, THE Converter SHALL 使用 `let` 而非 `const` 声明该变量
2. WHEN Converter 检测到 `const` 声明的变量在后续代码中被重新赋值, THE Converter SHALL 将 `const` 改为 `let`

### 需求 9：批量重新转换与验证

**用户故事：** 作为迁移工程师，我希望修复后的转换器能一次性重新转换所有 507 个组件，并且全部通过 Svelte 编译检查。

#### 验收标准

1. WHEN Batch_Reconvert 使用修复后的 Converter 重新转换所有 507 个组件, THE 编译成功率 SHALL 达到 100%
2. WHEN Batch_Reconvert 完成后, THE 迁移报告 SHALL 显示 0 个编译失败的组件
3. WHEN 之前成功转换的 478 个组件被重新转换, THE 这些组件 SHALL 继续通过编译检查（无回归）

### 需求 10：测试覆盖

**用户故事：** 作为迁移工程师，我希望每种错误修复都有对应的自动化测试，确保修复的正确性和防止回归。

#### 验收标准

1. THE 测试套件 SHALL 为每种错误类型（需求 1-8）包含至少一个针对性的测试用例
2. WHEN 运行 `npx vitest run --config vitest.config.ts`, THE 所有测试 SHALL 通过
3. THE 测试套件 SHALL 包含属性测试，验证转换器的通用正确性属性
