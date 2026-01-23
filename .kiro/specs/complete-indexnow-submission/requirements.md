# Requirements Document

## Introduction

本规范定义了一个完整的 IndexNow 批量提交系统，用于将 U2Tool 网站的所有页面（约 4,000+ 个 URL）提交到 IndexNow 协议支持的搜索引擎（Bing、Yandex 等）。系统需要支持灵活的提交选项、可靠的错误处理、详细的日志记录和断点续传功能。

## Glossary

- **IndexNow**: 一个开放协议，允许网站即时通知搜索引擎内容更新
- **Batch_Submission**: 批量提交，将多个 URL 打包成一个请求提交
- **Exponential_Backoff**: 指数退避，一种重试策略，每次重试的等待时间呈指数增长
- **Dry_Run**: 测试模式，模拟提交过程但不实际发送请求
- **URL_Generator**: URL 生成器，根据工具列表和语言生成所有页面 URL
- **Submission_Report**: 提交报告，记录提交过程的详细信息和统计数据
- **Failed_URL_List**: 失败 URL 列表，记录提交失败的 URL 以便重试
- **Tool_Config**: 工具配置，从 src/config/tools.ts 读取的工具列表
- **Static_Pages**: 静态页面，包括首页、关于、博客、隐私政策等
- **Category_Pages**: 分类页面，按工具分类展示的页面
- **Tool_Pages**: 工具页面，每个工具的详情页面

## Requirements

### Requirement 1: URL 生成

**User Story:** 作为系统管理员，我希望能够动态生成所有页面的 URL 列表，以便完整提交到 IndexNow。

#### Acceptance Criteria

1. WHEN 系统启动时，THE URL_Generator SHALL 从 Tool_Config 读取所有工具的 slug
2. WHEN 生成 URL 时，THE URL_Generator SHALL 为每个工具生成 10 种语言的 URL（en, zh, ja, ko, es, pt, fr, de, ru, ar）
3. WHEN 生成 URL 时，THE URL_Generator SHALL 包含所有 Static_Pages 的多语言版本
4. WHEN 生成 URL 时，THE URL_Generator SHALL 包含所有 Category_Pages 的多语言版本
5. THE URL_Generator SHALL 生成格式为 `{baseUrl}/{locale}/tools/{slug}` 的工具页面 URL
6. THE URL_Generator SHALL 生成格式为 `{baseUrl}/{locale}/tools/category/{category}` 的分类页面 URL
7. THE URL_Generator SHALL 生成格式为 `{baseUrl}/{locale}` 的静态页面 URL

### Requirement 2: 批量提交

**User Story:** 作为系统管理员，我希望能够批量提交 URL 到 IndexNow，以提高提交效率。

#### Acceptance Criteria

1. WHEN 提交 URL 时，THE Batch_Submission SHALL 将 URL 列表分成多个批次
2. THE Batch_Submission SHALL 支持自定义批次大小（默认 100，最大 10000）
3. WHEN 提交批次时，THE Batch_Submission SHALL 使用 POST 方法发送到 IndexNow API
4. WHEN 提交批次时，THE Batch_Submission SHALL 包含 host、key、keyLocation 和 urlList 字段
5. WHEN 收到响应时，THE Batch_Submission SHALL 将 HTTP 200 或 202 状态码视为成功
6. WHEN 批次之间，THE Batch_Submission SHALL 添加 500ms 延迟以避免速率限制

### Requirement 3: 错误处理和重试

**User Story:** 作为系统管理员，我希望系统能够自动重试失败的请求，以提高提交成功率。

#### Acceptance Criteria

1. WHEN 提交失败时，THE Batch_Submission SHALL 使用 Exponential_Backoff 策略重试
2. THE Exponential_Backoff SHALL 最多重试 5 次
3. THE Exponential_Backoff SHALL 使用基础延迟 1000ms，每次重试延迟翻倍（1s, 2s, 4s, 8s, 16s）
4. WHEN 收到 4xx 客户端错误时，THE Batch_Submission SHALL 不进行重试
5. WHEN 收到 5xx 服务器错误时，THE Batch_Submission SHALL 继续重试直到达到最大重试次数
6. WHEN 所有重试都失败时，THE Batch_Submission SHALL 记录失败信息和 URL 列表

### Requirement 4: 灵活的提交选项

**User Story:** 作为系统管理员，我希望能够灵活控制提交范围，以便按需提交特定内容。

#### Acceptance Criteria

1. WHEN 使用 --locale 参数时，THE URL_Generator SHALL 只生成指定语言的 URL
2. WHEN 使用 --category 参数时，THE URL_Generator SHALL 只生成指定分类的工具 URL
3. WHEN 使用 --dry-run 参数时，THE Batch_Submission SHALL 模拟提交但不发送实际请求
4. WHEN 使用 --batch-size 参数时，THE Batch_Submission SHALL 使用指定的批次大小
5. WHEN 使用 --verbose 参数时，THE Batch_Submission SHALL 显示详细的提交过程信息
6. WHEN 使用 --help 参数时，THE Batch_Submission SHALL 显示帮助信息并退出

### Requirement 5: 进度显示

**User Story:** 作为系统管理员，我希望能够实时查看提交进度，以便了解提交状态。

#### Acceptance Criteria

1. WHEN 开始提交时，THE Batch_Submission SHALL 显示总 URL 数量和批次数量
2. WHEN 提交每个批次时，THE Batch_Submission SHALL 显示当前批次编号和进度百分比
3. WHEN 批次提交成功时，THE Batch_Submission SHALL 显示 ✅ 成功标记
4. WHEN 批次提交失败时，THE Batch_Submission SHALL 显示 ❌ 失败标记和错误信息
5. WHEN 批次重试时，THE Batch_Submission SHALL 显示重试次数和等待时间
6. WHEN 所有批次完成时，THE Batch_Submission SHALL 显示总体统计信息

### Requirement 6: 日志记录

**User Story:** 作为系统管理员，我希望系统能够记录详细的提交日志，以便分析和审计。

#### Acceptance Criteria

1. WHEN 提交完成时，THE Batch_Submission SHALL 生成 JSON 格式的日志文件
2. THE Submission_Report SHALL 包含时间戳、配置信息、统计数据和详细结果
3. THE Submission_Report SHALL 记录每个批次的提交状态、URL 数量和错误信息
4. THE Submission_Report SHALL 计算成功率（成功 URL 数 / 总 URL 数）
5. THE Submission_Report SHALL 保存到 logs 目录，文件名包含时间戳
6. WHEN 有失败批次时，THE Batch_Submission SHALL 生成 Failed_URL_List 文本文件

### Requirement 7: 断点续传

**User Story:** 作为系统管理员，我希望能够重试失败的 URL，而不需要重新提交所有 URL。

#### Acceptance Criteria

1. WHEN 提交失败时，THE Batch_Submission SHALL 将失败的 URL 保存到 Failed_URL_List
2. THE Failed_URL_List SHALL 每行包含一个 URL
3. THE Failed_URL_List SHALL 保存到 logs 目录，文件名包含时间戳
4. THE Batch_Submission SHALL 支持从文件读取 URL 列表进行重试
5. WHEN 使用 --retry-file 参数时，THE Batch_Submission SHALL 读取指定文件中的 URL 进行提交
6. THE Batch_Submission SHALL 在控制台输出重试命令示例

### Requirement 8: 环境配置

**User Story:** 作为系统管理员，我希望能够通过环境变量配置系统，以便在不同环境中使用。

#### Acceptance Criteria

1. THE Batch_Submission SHALL 从环境变量 INDEXNOW_KEY 读取 IndexNow API 密钥
2. THE Batch_Submission SHALL 从环境变量 NEXT_PUBLIC_BASE_URL 读取网站基础 URL
3. WHEN INDEXNOW_KEY 未配置且非 Dry_Run 模式时，THE Batch_Submission SHALL 显示错误并退出
4. WHEN NEXT_PUBLIC_BASE_URL 未配置时，THE Batch_Submission SHALL 使用默认值 https://www.u2tool.com
5. THE Batch_Submission SHALL 优先从 .env.local 加载环境变量，然后从 .env 加载
6. THE Batch_Submission SHALL 在日志中记录配置信息（密钥只显示前 8 个字符）

### Requirement 9: 提交报告

**User Story:** 作为系统管理员，我希望能够查看详细的提交报告，以便评估提交效果。

#### Acceptance Criteria

1. WHEN 提交完成时，THE Batch_Submission SHALL 在控制台显示格式化的报告
2. THE Submission_Report SHALL 包含配置信息（站点、模式、语言、分类）
3. THE Submission_Report SHALL 包含提交统计（总 URL、成功数、失败数、成功率）
4. THE Submission_Report SHALL 包含批次统计（总批次、成功批次、失败批次）
5. WHEN 有失败批次时，THE Submission_Report SHALL 显示失败批次详情
6. THE Submission_Report SHALL 使用表格和分隔线提高可读性

### Requirement 10: 测试模式

**User Story:** 作为开发人员，我希望能够在测试模式下验证功能，而不实际提交到 IndexNow。

#### Acceptance Criteria

1. WHEN 使用 --dry-run 参数时，THE Batch_Submission SHALL 不发送实际的 HTTP 请求
2. WHEN 在 Dry_Run 模式时，THE Batch_Submission SHALL 模拟成功的提交响应
3. WHEN 在 Dry_Run 模式时，THE Batch_Submission SHALL 显示 [DRY RUN] 标记
4. WHEN 在 Dry_Run 模式时，THE Batch_Submission SHALL 不检查 INDEXNOW_KEY 是否配置
5. WHEN 在 Dry_Run 模式时，THE Batch_Submission SHALL 生成完整的日志和报告
6. WHEN 在 Dry_Run 模式时，THE Batch_Submission SHALL 不保存失败 URL 列表
