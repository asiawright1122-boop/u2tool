# Bing URL Submission API 使用指南

## 📋 概述

本项目支持两种方式向 Bing 提交 URL：

1. **IndexNow** - 实时通知协议（已配置）
2. **URL Submission API** - Bing 官方批量提交 API（本文档）

## 🔧 配置步骤

### 步骤 1: 获取 Bing API Key

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 登录并选择你的站点 `u2tool.com`
3. 点击左侧菜单 **Settings** → **API Access**
4. 找到 **API Key** 并复制

### 步骤 2: 配置环境变量

在 `.env.local` 文件中添加：

```bash
BING_API_KEY=your_api_key_here
```

## 📝 使用方法

### 基本命令

```bash
# 测试模式（不实际提交）
npx tsx scripts/submit-bing.ts --dry-run

# 实际提交所有 URL
npx tsx scripts/submit-bing.ts

# 只提交中文页面
npx tsx scripts/submit-bing.ts --locale=zh

# 只提交特定分类
npx tsx scripts/submit-bing.ts --category=encoding

# 设置批次大小（最大 500）
npx tsx scripts/submit-bing.ts --batch-size=200

# 显示详细输出
npx tsx scripts/submit-bing.ts --verbose
```

### 命令行选项

| 选项 | 说明 | 示例 |
|------|------|------|
| `--dry-run` | 测试模式，不实际提交 | `--dry-run` |
| `--locale=<lang>` | 只提交指定语言 | `--locale=zh` |
| `--category=<cat>` | 只提交指定分类 | `--category=image` |
| `--batch-size=<n>` | 批次大小（默认100，最大500） | `--batch-size=200` |
| `--verbose` | 显示详细输出 | `--verbose` |
| `--help` | 显示帮助信息 | `--help` |

## 📊 API 限制

- 每次请求最多 500 个 URL
- 每天有配额限制（根据站点等级不同）
- 建议在非高峰时段提交

## 🔍 日志

提交日志保存在 `logs/` 目录：

```
logs/bing-submit-2026-01-07T08-30-00-000Z.json
```

日志包含：
- 提交配置
- 成功/失败统计
- 每个批次的详细结果

## ⚠️ 注意事项

1. **首次使用前**：先用 `--dry-run` 测试
2. **API Key 安全**：不要将 API Key 提交到代码仓库
3. **频率限制**：避免频繁提交，建议每天一次
4. **配额管理**：关注 Bing Webmaster Tools 中的配额使用情况

## 🔗 相关资源

- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Bing URL Submission API 文档](https://www.bing.com/webmasters/help/submit-urls-to-bing-62f2860a)
- [IndexNow 配置指南](./BING_INDEXNOW_SETUP.md)

## 📝 更新记录

- 2026-01-07: 创建 Bing URL Submission API 脚本
