# Requirements Document

## Introduction

本规范定义了为开发者工具箱网站添加新工具和新分类的需求。目标是扩展现有工具集，增加更多实用的开发者工具，并通过新增分类来更好地组织工具。当前系统有 5 个分类（text、encoding、generators、converters、development）和约 80 个工具。

## Glossary

- **Tool**: 一个独立的在线工具组件，提供特定功能
- **Category**: 工具的分类，用于组织和展示工具
- **ToolCategory**: TypeScript 类型，定义工具分类的标识符
- **Tool Component**: React 组件，实现工具的具体功能和 UI
- **i18n**: 国际化，支持多语言翻译

## Requirements

### Requirement 1: 新增工具分类

**User Story:** As a 用户, I want 工具按更细致的分类组织, so that 我能更快找到需要的工具。

#### Acceptance Criteria

1. WHEN 添加新分类 THEN THE 系统 SHALL 在 `src/config/tools.ts` 中更新 `ToolCategory` 类型和 `categories` 数组
2. WHEN 添加新分类 THEN THE 系统 SHALL 在所有语言文件（en.json、zh.json、es.json、pt.json、ja.json）中添加分类翻译
3. WHEN 新分类添加完成 THEN THE 系统 SHALL 在工具列表页面正确显示新分类

### Requirement 2: 新增安全工具分类 (security)

**User Story:** As a 开发者, I want 安全相关工具有独立分类, so that 我能快速找到加密、哈希等安全工具。

#### Acceptance Criteria

1. WHEN 创建安全分类 THEN THE 系统 SHALL 添加 `security` 分类，图标为 🔒
2. WHEN 安全分类创建后 THEN THE 系统 SHALL 将现有安全相关工具（text-encryption、hash-generator、file-hash、password-generator）迁移到此分类
3. WHEN 安全分类显示时 THEN THE 系统 SHALL 在所有语言中显示正确的分类名称

### Requirement 3: 新增网络工具分类 (network)

**User Story:** As a 开发者, I want 网络相关工具有独立分类, so that 我能快速找到 IP、URL、HTTP 等网络工具。

#### Acceptance Criteria

1. WHEN 创建网络分类 THEN THE 系统 SHALL 添加 `network` 分类，图标为 🌐
2. WHEN 网络分类创建后 THEN THE 系统 SHALL 将现有网络相关工具（ip-lookup、url-encoder、url-parser、http-status）迁移到此分类
3. WHEN 网络分类显示时 THEN THE 系统 SHALL 在所有语言中显示正确的分类名称

### Requirement 4: 新增图像工具分类 (image)

**User Story:** As a 设计师/开发者, I want 图像相关工具有独立分类, so that 我能快速找到图像处理工具。

#### Acceptance Criteria

1. WHEN 创建图像分类 THEN THE 系统 SHALL 添加 `image` 分类，图标为 🖼️
2. WHEN 图像分类创建后 THEN THE 系统 SHALL 将现有图像相关工具（image-to-base64、placeholder-image、qr-generator、barcode-generator、svg-optimizer）迁移到此分类
3. WHEN 图像分类显示时 THEN THE 系统 SHALL 在所有语言中显示正确的分类名称

### Requirement 5: 新增数学/计算工具分类 (math)

**User Story:** As a 开发者, I want 数学计算工具有独立分类, so that 我能快速找到计算器和数学工具。

#### Acceptance Criteria

1. WHEN 创建数学分类 THEN THE 系统 SHALL 添加 `math` 分类，图标为 🔢
2. WHEN 数学分类创建后 THEN THE 系统 SHALL 将现有数学相关工具（number-base-converter、aspect-ratio、chmod-calculator）迁移到此分类
3. WHEN 数学分类显示时 THEN THE 系统 SHALL 在所有语言中显示正确的分类名称

### Requirement 6: 新增安全工具

**User Story:** As a 开发者, I want 更多安全相关工具, so that 我能处理各种安全需求。

#### Acceptance Criteria

1. WHEN 用户使用 RSA 密钥生成器 THEN THE 系统 SHALL 生成 RSA 公钥和私钥对
2. WHEN 用户使用 HMAC 生成器 THEN THE 系统 SHALL 使用指定密钥和算法生成 HMAC 签名
3. WHEN 用户使用 TOTP 生成器 THEN THE 系统 SHALL 生成基于时间的一次性密码
4. WHEN 用户使用密码强度检测器 THEN THE 系统 SHALL 分析密码强度并给出评分和建议

### Requirement 7: 新增网络工具

**User Story:** As a 开发者, I want 更多网络相关工具, so that 我能处理各种网络开发需求。

#### Acceptance Criteria

1. WHEN 用户使用 DNS 查询工具 THEN THE 系统 SHALL 查询域名的 DNS 记录
2. WHEN 用户使用 User Agent 解析器 THEN THE 系统 SHALL 解析 User Agent 字符串并显示浏览器、操作系统等信息
3. WHEN 用户使用 HTTP Header 解析器 THEN THE 系统 SHALL 解析和格式化 HTTP 头信息
4. WHEN 用户使用 CIDR 计算器 THEN THE 系统 SHALL 计算 IP 地址范围和子网信息

### Requirement 8: 新增图像工具

**User Story:** As a 设计师/开发者, I want 更多图像处理工具, so that 我能处理各种图像需求。

#### Acceptance Criteria

1. WHEN 用户使用图片压缩器 THEN THE 系统 SHALL 压缩图片并保持可接受的质量
2. WHEN 用户使用图片裁剪器 THEN THE 系统 SHALL 允许用户裁剪图片到指定尺寸
3. WHEN 用户使用图片格式转换器 THEN THE 系统 SHALL 在 PNG、JPG、WebP 等格式之间转换
4. WHEN 用户使用 Favicon 生成器 THEN THE 系统 SHALL 从图片生成多尺寸 favicon

### Requirement 9: 新增数学/计算工具

**User Story:** As a 开发者, I want 更多数学计算工具, so that 我能处理各种计算需求。

#### Acceptance Criteria

1. WHEN 用户使用百分比计算器 THEN THE 系统 SHALL 计算百分比、增减比例等
2. WHEN 用户使用科学计算器 THEN THE 系统 SHALL 支持基本运算和科学函数
3. WHEN 用户使用进制计算器 THEN THE 系统 SHALL 支持不同进制的数学运算
4. WHEN 用户使用统计计算器 THEN THE 系统 SHALL 计算平均值、中位数、标准差等统计数据

### Requirement 10: 新增开发工具

**User Story:** As a 开发者, I want 更多开发辅助工具, so that 我能提高开发效率。

#### Acceptance Criteria

1. WHEN 用户使用 Git 命令生成器 THEN THE 系统 SHALL 生成常用 Git 命令
2. WHEN 用户使用 .gitignore 生成器 THEN THE 系统 SHALL 根据项目类型生成 .gitignore 文件
3. WHEN 用户使用 Docker Compose 生成器 THEN THE 系统 SHALL 生成 docker-compose.yml 配置
4. WHEN 用户使用 Nginx 配置生成器 THEN THE 系统 SHALL 生成 Nginx 配置文件
5. WHEN 用户使用 package.json 生成器 THEN THE 系统 SHALL 生成 Node.js 项目配置文件

### Requirement 11: 新增文本工具

**User Story:** As a 用户, I want 更多文本处理工具, so that 我能处理各种文本需求。

#### Acceptance Criteria

1. WHEN 用户使用文本排序器 THEN THE 系统 SHALL 按字母、数字或自定义规则排序文本行
2. WHEN 用户使用文本提取器 THEN THE 系统 SHALL 从文本中提取邮箱、URL、电话等信息
3. WHEN 用户使用文本模板生成器 THEN THE 系统 SHALL 根据模板和数据生成文本
4. WHEN 用户使用 Emoji 选择器 THEN THE 系统 SHALL 提供 Emoji 搜索和复制功能

### Requirement 12: 新增转换器工具

**User Story:** As a 开发者, I want 更多格式转换工具, so that 我能在不同格式之间转换数据。

#### Acceptance Criteria

1. WHEN 用户使用 JSON 转 SQL THEN THE 系统 SHALL 将 JSON 数据转换为 SQL INSERT 语句
2. WHEN 用户使用 JSON 转 Java 类 THEN THE 系统 SHALL 将 JSON 转换为 Java POJO 类
3. WHEN 用户使用 JSON 转 Python 类 THEN THE 系统 SHALL 将 JSON 转换为 Python dataclass
4. WHEN 用户使用 JSON 转 Kotlin 类 THEN THE 系统 SHALL 将 JSON 转换为 Kotlin data class
5. WHEN 用户使用 TOML/JSON 转换器 THEN THE 系统 SHALL 在 TOML 和 JSON 之间转换

### Requirement 13: 工具组件实现规范

**User Story:** As a 开发者, I want 所有工具遵循统一的实现规范, so that 代码保持一致性和可维护性。

#### Acceptance Criteria

1. WHEN 创建新工具组件 THEN THE 系统 SHALL 使用 React 函数组件和 TypeScript
2. WHEN 创建新工具组件 THEN THE 系统 SHALL 使用 `useTranslations` hook 实现国际化
3. WHEN 创建新工具组件 THEN THE 系统 SHALL 使用 Tailwind CSS 进行样式设计
4. WHEN 创建新工具组件 THEN THE 系统 SHALL 在浏览器端处理所有数据，不上传到服务器
5. WHEN 创建新工具组件 THEN THE 系统 SHALL 提供复制、清空等基本操作按钮

### Requirement 14: 国际化支持

**User Story:** As a 国际用户, I want 所有新工具支持多语言, so that 我能使用自己的语言。

#### Acceptance Criteria

1. WHEN 添加新工具 THEN THE 系统 SHALL 在所有 5 个语言文件中添加工具名称和描述翻译
2. WHEN 添加新工具 THEN THE 系统 SHALL 在所有语言文件中添加工具特定的 UI 文本翻译
3. WHEN 添加新工具 THEN THE 系统 SHALL 提供 SEO 标题和描述的翻译
