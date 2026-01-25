# Requirements Document

## Introduction

本需求文档定义了为 U2Tool 项目添加第 51 批热门低竞争工具的功能需求。基于 2025-2026 年市场调研，选择了 18 个高价值、低竞争、可在浏览器端完全运行的在线工具。这些工具涵盖开发配置生成器、文档处理、编码加密、实用计算器等类别。

## Glossary

- **Tool_Registry**: 工具注册系统，包含 `src/config/tools.ts` 中的工具配置数组
- **Tool_Wrapper**: 动态导入包装器，位于 `src/components/tools/ToolWrapper.tsx`
- **Translation_System**: 国际化翻译系统，包含 10 种语言的翻译文件
- **Tool_Component**: 工具的 React 组件实现
- **AI_Translate_Script**: AI 翻译脚本 `scripts/ai-translate-tool.ts`
- **Tools_Catalog**: 工具目录文档 `docs/TOOLS_CATALOG.md`

## Requirements

### Requirement 1: 开发配置生成器工具

**User Story:** As a developer, I want to generate common configuration files, so that I can quickly set up new projects without manual configuration.

#### Acceptance Criteria

1. WHEN a user opens the Dockerfile Generator tool, THE Tool_Component SHALL display a form with base image, commands, ports, and environment variables options
2. WHEN a user configures Dockerfile options and clicks generate, THE Tool_Component SHALL produce a valid Dockerfile content
3. WHEN a user opens the ESLint Config Generator tool, THE Tool_Component SHALL display options for framework, style guide, and rules
4. WHEN a user configures ESLint options and clicks generate, THE Tool_Component SHALL produce a valid .eslintrc.json content
5. WHEN a user opens the Prettier Config Generator tool, THE Tool_Component SHALL display options for formatting preferences
6. WHEN a user configures Prettier options and clicks generate, THE Tool_Component SHALL produce a valid .prettierrc content
7. WHEN a user opens the TSConfig Generator tool, THE Tool_Component SHALL display options for TypeScript compiler settings
8. WHEN a user configures TSConfig options and clicks generate, THE Tool_Component SHALL produce a valid tsconfig.json content
9. WHEN a user opens the EditorConfig Generator tool, THE Tool_Component SHALL display options for editor settings
10. WHEN a user configures EditorConfig options and clicks generate, THE Tool_Component SHALL produce a valid .editorconfig content

### Requirement 2: GitHub 文档生成器工具

**User Story:** As a developer, I want to generate GitHub documentation files, so that I can maintain professional project documentation.

#### Acceptance Criteria

1. WHEN a user opens the GitHub README Generator tool, THE Tool_Component SHALL display a form with project name, description, features, installation, and usage sections
2. WHEN a user fills in README sections and clicks generate, THE Tool_Component SHALL produce a well-formatted README.md content
3. WHEN a user opens the Changelog Generator tool, THE Tool_Component SHALL display options for version, date, and change categories (Added, Changed, Fixed, Removed)
4. WHEN a user adds changelog entries and clicks generate, THE Tool_Component SHALL produce a CHANGELOG.md following Keep a Changelog format
5. WHEN a user opens the License Generator tool, THE Tool_Component SHALL display a list of common open source licenses (MIT, Apache 2.0, GPL, BSD, etc.)
6. WHEN a user selects a license and enters author information, THE Tool_Component SHALL produce the complete license text with proper attribution

### Requirement 3: 编码加密工具

**User Story:** As a user, I want to encode and decode text using classic ciphers, so that I can learn about cryptography or encode messages.

#### Acceptance Criteria

1. WHEN a user opens the ROT13 Encoder tool, THE Tool_Component SHALL display input and output text areas with encode/decode toggle
2. WHEN a user enters text and selects encode, THE Tool_Component SHALL apply ROT13 transformation to the text
3. WHEN a user opens the Caesar Cipher tool, THE Tool_Component SHALL display input, output, and a shift value selector (1-25)
4. WHEN a user enters text and sets shift value, THE Tool_Component SHALL apply Caesar cipher transformation
5. WHEN a user opens the Vigenere Cipher tool, THE Tool_Component SHALL display input, output, and a keyword input field
6. WHEN a user enters text and keyword, THE Tool_Component SHALL apply Vigenere cipher transformation
7. FOR ALL cipher tools, THE Tool_Component SHALL support both encryption and decryption modes

### Requirement 4: 校验和验证工具

**User Story:** As a developer, I want to verify file integrity using checksums, so that I can ensure files are not corrupted or tampered with.

#### Acceptance Criteria

1. WHEN a user opens the Checksum Verifier tool, THE Tool_Component SHALL display file upload area and checksum input field
2. WHEN a user uploads a file, THE Tool_Component SHALL calculate MD5, SHA-1, SHA-256, and SHA-512 hashes
3. WHEN a user enters an expected checksum, THE Tool_Component SHALL compare it with calculated hashes and indicate match/mismatch
4. WHEN checksums match, THE Tool_Component SHALL display a success indicator with green styling
5. WHEN checksums do not match, THE Tool_Component SHALL display a failure indicator with red styling

### Requirement 5: 财务计算器工具

**User Story:** As a user, I want to calculate financial metrics, so that I can make informed investment and business decisions.

#### Acceptance Criteria

1. WHEN a user opens the Inflation Calculator tool, THE Tool_Component SHALL display inputs for amount, start year, end year, and inflation rate
2. WHEN a user enters values and clicks calculate, THE Tool_Component SHALL compute the inflation-adjusted value
3. WHEN a user opens the Break Even Calculator tool, THE Tool_Component SHALL display inputs for fixed costs, variable cost per unit, and selling price per unit
4. WHEN a user enters values and clicks calculate, THE Tool_Component SHALL compute break-even point in units and revenue
5. WHEN a user opens the Margin Calculator tool, THE Tool_Component SHALL display inputs for cost and selling price
6. WHEN a user enters values and clicks calculate, THE Tool_Component SHALL compute profit margin percentage and markup percentage
7. WHEN a user opens the Markup Calculator tool, THE Tool_Component SHALL display inputs for cost and desired markup percentage
8. WHEN a user enters values and clicks calculate, THE Tool_Component SHALL compute selling price and profit amount

### Requirement 6: 社交媒体工具

**User Story:** As a content creator, I want to generate social media content elements, so that I can improve my online presence.

#### Acceptance Criteria

1. WHEN a user opens the Hashtag Generator tool, THE Tool_Component SHALL display a topic input field and platform selector
2. WHEN a user enters a topic and selects platform, THE Tool_Component SHALL generate relevant hashtags for that platform
3. WHEN a user opens the Bio Generator tool, THE Tool_Component SHALL display inputs for profession, interests, and tone
4. WHEN a user fills in bio details, THE Tool_Component SHALL generate multiple bio variations
5. WHEN a user opens the Email Signature Generator tool, THE Tool_Component SHALL display inputs for name, title, company, contact info, and social links
6. WHEN a user fills in signature details, THE Tool_Component SHALL generate HTML and plain text email signatures

### Requirement 7: 工具注册和翻译

**User Story:** As a system, I want all new tools properly registered and translated, so that users can access them in all supported languages.

#### Acceptance Criteria

1. WHEN a new tool is added, THE Tool_Registry SHALL contain an entry with slug, category, icon, and component name
2. WHEN a new tool is added, THE Tool_Wrapper SHALL contain a dynamic import for the tool component
3. WHEN a new tool is added, THE Translation_System SHALL contain translations in all 10 languages (en, zh, ja, ko, es, pt, fr, de, ru, ar)
4. WHEN a new tool is added, THE Translation_System SHALL include name, description, seo_title, seo_description, detailed_description, usage_steps, and usage_examples
5. WHEN all tools are added, THE Tools_Catalog SHALL be updated with new tool entries and statistics

### Requirement 8: 用户界面一致性

**User Story:** As a user, I want all tools to have consistent UI patterns, so that I can easily use any tool without learning new interfaces.

#### Acceptance Criteria

1. FOR ALL new tools, THE Tool_Component SHALL use the project's existing UI components and styling
2. FOR ALL new tools, THE Tool_Component SHALL include copy-to-clipboard functionality for output
3. FOR ALL new tools, THE Tool_Component SHALL include clear/reset functionality
4. FOR ALL new tools, THE Tool_Component SHALL be fully responsive on mobile devices
5. FOR ALL new tools, THE Tool_Component SHALL support dark mode through the existing theme system
