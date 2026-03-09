# Tasks

## Task 1: 为更多热门工具添加 FAQ 内容

### Description
为额外 7 个热门工具添加特定的 FAQ 内容，支持所有 10 种语言。

### Files to Modify
- `src/lib/tool-specific-faqs-extra-2.ts` - 新建文件，添加更多工具 FAQ
- `src/lib/tool-specific-faqs.ts` - 导入并合并新的 FAQ 配置

### Acceptance Criteria
- [x] 为以下工具添加 FAQ：regex-tester, diff-checker, html-encoder, word-counter, markdown-preview, lorem-ipsum-generator, cron-expression-generator
- [x] 每个工具至少 5 个 FAQ
- [x] 支持所有 10 种语言 (en, zh, es, pt, ja, ru, fr, de, ko, ar)
- [x] 测试通过

### 完成情况
- 创建了 `src/lib/tool-specific-faqs-extra-2.ts` 文件
- 添加了 7 个工具的 FAQ（每个工具 5 个问答，10 种语言）
- 更新了 `src/lib/tool-specific-faqs.ts` 导入新配置
- 现在共有 17 个工具有专属 FAQ（原有 10 个 + 新增 7 个）

---

## Task 2: 创建工具特定 HowTo 步骤

### Description
为热门工具创建特定的 HowTo 步骤，替代通用步骤。

### Files to Modify
- `src/lib/tool-specific-howto.ts` - 新建文件，添加工具特定 HowTo 步骤配置
- `src/lib/seo.ts` - 更新 getToolHowToSteps 函数使用特定步骤

### Acceptance Criteria
- [x] 为 Top 7 热门工具创建特定 HowTo 步骤（json-formatter, base64, uuid-generator, qr-generator, password-generator, hash-generator, regex-tester）
- [x] 每个工具 5 个详细步骤
- [x] 支持所有 10 种语言
- [x] 添加 totalTime 字段（ISO 8601 格式）
- [x] 测试通过

### 完成情况
- 创建了 `src/lib/tool-specific-howto.ts` 文件
- 添加了 7 个工具的特定 HowTo 步骤（每个工具 5 步，10 种语言）
- 更新了 `src/lib/seo.ts` 中的 `getToolHowToSteps` 函数，优先使用特定步骤
- 添加了 `getToolHowToTotalTime` 函数获取工具特定的总时间

---

## Task 3: 增强 SoftwareApplication Schema

### Description
增强 SoftwareApplication JSON-LD，添加 datePublished、dateModified、featureList 等字段。

### Files to Modify
- `src/lib/seo.ts` - 增强 generateSoftwareApplicationJsonLd 函数
- `src/app/[locale]/tools/[slug]/page.tsx` - 使用增强的 schema
- `src/config/tool-metadata.ts` - 新建文件，存储工具元数据

### Acceptance Criteria
- [x] 添加 datePublished 字段
- [x] 添加 dateModified 字段
- [x] 添加 featureList 字段
- [x] 添加 softwareVersion 字段
- [x] 测试通过

### 完成情况
- 创建了 `src/config/tool-metadata.ts` 文件，包含工具元数据配置
- 为 15 个热门工具添加了特定的元数据（功能列表、版本等）
- 更新了 `src/app/[locale]/tools/[slug]/page.tsx` 使用增强的 schema
- 所有 1644 个测试通过

---

## Task 4: 验证结构化数据

### Description
创建验证脚本检查所有结构化数据的完整性和有效性。

### Files to Create
- `scripts/validate-structured-data-enhanced.ts` - 增强的验证脚本

### Acceptance Criteria
- [x] 验证 FAQ JSON-LD 格式
- [x] 验证 HowTo JSON-LD 格式
- [x] 验证 SoftwareApplication JSON-LD 格式
- [x] 报告缺失字段和错误

### 完成情况
- 创建了 `scripts/validate-structured-data-enhanced.ts` 验证脚本
- 验证 ISO 8601 日期格式
- 验证 ISO 8601 时间间隔格式
- 验证 FAQ 和 HowTo 内容完整性
- 验证结果：290 个工具，0 个错误，275 个警告（使用默认元数据）
