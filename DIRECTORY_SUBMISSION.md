# U2Tool 外链提交指南

## 📊 提交状态

运行 `node scripts/navigation-submitter.cjs status` 查看当前状态

## 🚀 快速提交链接

### 高优先级（建议首先提交）

| 目录 | 链接 | 需要登录 |
|------|------|----------|
| Product Hunt | https://www.producthunt.com/posts/new | 是 |
| StackShare | https://stackshare.io/submissions/new | 是 |
| AlternativeTo | https://alternativeto.net/software/u2tool/ | 否 |
| SaaS Discovery | https://saasdiscovery.co/submit | 否 |
| ToolScout | https://toolscout.io/submit | 否 |

### 中优先级

| 目录 | 链接 | 需要登录 |
|------|------|----------|
| Betalist | https://betalist.com/submit | 是 |
| SaaSHub | https://saashub.com/submit | 否 |
| Future Tools | https://futuretools.io/submit | 否 |
| There's an AI for That | https://theresanaiforthat.com/submit | 否 |
| Online Tools IO | https://onlinetools.io/submit | 否 |

### 低优先级

| 目录 | 链接 | 备注 |
|------|------|------|
| Reddit | https://reddit.com/r/webdev | 发帖 |
| Hacker News | https://news.ycombinator.com | 发帖 |
| Dev.to | https://dev.to | 写文章 |
| Hashnode | https://hashnode.com | 写博客 |
| Stack Overflow | https://stackoverflow.com | 回答问题 |

## 📝 提交信息

复制以下信息用于提交：

```
网站名称: U2Tool
网站URL: https://www.u2tool.com
描述: 200+ free online developer tools - JSON formatter, Base64 encoder, QR generator, password generator, and more.
邮箱: contact@u2tool.com
分类: Developer Tools, Online Tools, Utilities
标签: developer tools, json formatter, base64, qr code, password generator, uuid generator, hash generator, color converter
```

## 🔧 脚本命令

```bash
# 查看所有目录
node scripts/navigation-submitter.cjs list

# 查看特定分类
node scripts/navigation-submitter.cjs list developer

# 标记已提交
node scripts/navigation-submitter.cjs submit "Product Hunt"

# 标记已批准
node scripts/navigation-submitter.cjs approve "Product Hunt"

# 查看状态
node scripts/navigation-submitter.cjs status

# 导出CSV
node scripts/navigation-submitter.cjs export

# 发现更多目录
node scripts/navigation-submitter.cjs discover
```

## 📁 生成的文件

- `data/directory-submissions.json` - 提交进度
- `data/directory-backlinks.csv` - 外链列表

## 💡 最佳实践

1. **先提交高优先级目录** - 这些有最高的SEO价值
2. **创建账户** - 在 Product Hunt、StackShare 创建账户，方便后续提交
3. **持续更新** - 定期运行 `node scripts/navigation-submitter.cjs discover` 发现新目录
4. **标记状态** - 提交后用脚本标记，方便跟踪

## 🔄 自动化测试

```bash
# 测试哪些目录可以自动提交
node scripts/auto-submitter.cjs
```

---

更新时间: 2026-02-27
