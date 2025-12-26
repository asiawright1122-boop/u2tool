# 搜索引擎站长平台配置指南

本指南详细说明如何在各大搜索引擎站长平台注册、验证和提交 Sitemap，以加速网站收录和提升排名。

## 目录

1. [Google Search Console](#1-google-search-console)
2. [Bing Webmaster Tools](#2-bing-webmaster-tools)
3. [百度站长平台](#3-百度站长平台)
4. [Yandex Webmaster](#4-yandex-webmaster)
5. [360 站长平台](#5-360-站长平台)
6. [IndexNow 配置](#6-indexnow-配置)

---

## 1. Google Search Console

### 1.1 注册步骤

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 使用 Google 账号登录
3. 点击「添加资源」
4. 选择「网址前缀」方式，输入 `https://www.u2tool.com`

### 1.2 验证方式（推荐 HTML 标签）

1. 选择「HTML 标签」验证方式
2. 复制提供的 meta 标签，格式如：
   ```html
   <meta name="google-site-verification" content="YOUR_VERIFICATION_CODE" />
   ```
3. 在 `.env.local` 中添加：
   ```bash
   GOOGLE_SITE_VERIFICATION=YOUR_VERIFICATION_CODE
   ```
4. 确认 `src/app/[locale]/layout.tsx` 中已包含验证标签
5. 部署后点击「验证」

### 1.3 提交 Sitemap

1. 在左侧菜单选择「Sitemap」
2. 输入 Sitemap URL：`sitemap.xml`
3. 点击「提交」
4. 等待 Google 抓取（通常 1-3 天）

### 1.4 其他优化

- **请求编入索引**：在「网址检查」中输入重要页面 URL，点击「请求编入索引」
- **覆盖范围报告**：定期检查是否有索引错误
- **效果报告**：监控搜索表现和点击率

---

## 2. Bing Webmaster Tools

### 2.1 注册步骤

1. 访问 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 使用 Microsoft 账号登录
3. 点击「添加站点」
4. 输入 `https://www.u2tool.com`

### 2.2 验证方式

**方式一：从 Google 导入（推荐）**
1. 如果已验证 Google Search Console，可直接导入
2. 点击「从 GSC 导入」，授权后自动验证

**方式二：HTML 标签**
1. 选择「HTML Meta 标签」
2. 复制 meta 标签：
   ```html
   <meta name="msvalidate.01" content="YOUR_BING_CODE" />
   ```
3. 在 `.env.local` 中添加：
   ```bash
   BING_SITE_VERIFICATION=YOUR_BING_CODE
   ```

### 2.3 提交 Sitemap

1. 在左侧菜单选择「Sitemaps」
2. 点击「提交 Sitemap」
3. 输入：`https://www.u2tool.com/sitemap.xml`
4. 点击「提交」

### 2.4 IndexNow 集成

Bing 原生支持 IndexNow，配置后可实时通知页面更新：
```bash
# 运行批量提交
npx ts-node scripts/submit-indexnow.ts
```

---

## 3. 百度站长平台

### 3.1 注册步骤

1. 访问 [百度站长平台](https://ziyuan.baidu.com)
2. 使用百度账号登录
3. 点击「用户中心」→「站点管理」→「添加网站」
4. 输入 `www.u2tool.com`

### 3.2 验证方式（已配置）

当前已配置 HTML 文件验证：
- 验证文件：`public/baidu_verify_codeva-DaI2NqB1Qi.html`
- 验证码：`codeva-DaI2NqB1Qi`

### 3.3 提交 Sitemap

1. 进入「链接提交」→「sitemap」
2. 输入：`https://www.u2tool.com/sitemap.xml`
3. 点击「提交」

### 3.4 主动推送（可选）

百度支持主动推送 API，可在 `scripts/` 目录创建推送脚本：
```bash
# 推送 URL 到百度
curl -H 'Content-Type:text/plain' \
  --data-binary @urls.txt \
  "http://data.zz.baidu.com/urls?site=www.u2tool.com&token=YOUR_TOKEN"
```

---

## 4. Yandex Webmaster

### 4.1 注册步骤

1. 访问 [Yandex Webmaster](https://webmaster.yandex.com)
2. 使用 Yandex 账号登录（可用 Google 账号注册）
3. 点击「+」添加站点
4. 输入 `https://www.u2tool.com`

### 4.2 验证方式（已配置）

当前已配置 HTML 文件验证：
- 验证文件：`public/yandex_d3e0d052e17a742e.html`
- 验证码：`d3e0d052e17a742e`

### 4.3 提交 Sitemap

1. 进入「Indexing」→「Sitemap files」
2. 点击「Add」
3. 输入：`https://www.u2tool.com/sitemap.xml`
4. 点击「Add」

### 4.4 IndexNow 集成

Yandex 也支持 IndexNow，使用相同的提交脚本即可。

---

## 5. 360 站长平台

### 5.1 注册步骤

1. 访问 [360 站长平台](https://zhanzhang.so.com)
2. 使用 360 账号登录
3. 点击「添加网站」
4. 输入 `www.u2tool.com`

### 5.2 验证方式（已配置）

当前已配置 HTML 文件验证：
- 验证文件：`public/360_a9a62516e3a7977830175b7fb2eb1f66.html`
- 验证码：`a9a62516e3a7977830175b7fb2eb1f66`

### 5.3 提交 Sitemap

1. 进入「收录管理」→「Sitemap」
2. 输入：`https://www.u2tool.com/sitemap.xml`
3. 点击「提交」

---

## 6. IndexNow 配置

IndexNow 是一种即时通知搜索引擎页面更新的协议，支持 Bing、Yandex 等。

### 6.1 当前配置

- **API Key**: `35151298dc86454c8fbd19a34aaba6d7`
- **验证文件**: `public/35151298dc86454c8fbd19a34aaba6d7.txt`
- **环境变量**: `.env.local` 中的 `INDEXNOW_KEY`

### 6.2 使用方法

```bash
# 测试模式（不实际提交）
npx ts-node scripts/submit-indexnow.ts --dry-run

# 提交所有 URL
npx ts-node scripts/submit-indexnow.ts

# 只提交中文页面
npx ts-node scripts/submit-indexnow.ts --locale=zh

# 只提交特定分类
npx ts-node scripts/submit-indexnow.ts --category=encoding
```

### 6.3 自动化提交

建议在以下场景触发 IndexNow 提交：
1. 新工具上线后
2. 内容更新后
3. 定期（每周）全量提交

---

## 快速检查清单

| 平台 | 状态 | Sitemap | 验证方式 |
|-----|------|---------|---------|
| Google | ⏳ 待配置 | sitemap.xml | HTML 标签 |
| Bing | ⏳ 待配置 | sitemap.xml | HTML 标签/GSC 导入 |
| 百度 | ✅ 已验证 | sitemap.xml | HTML 文件 |
| Yandex | ✅ 已验证 | sitemap.xml | HTML 文件 |
| 360 | ✅ 已验证 | sitemap.xml | HTML 文件 |
| IndexNow | ✅ 已配置 | - | API Key |

---

## 常见问题

### Q: 验证失败怎么办？
A: 确保验证文件/标签已部署到生产环境，等待 DNS 缓存刷新后重试。

### Q: Sitemap 提交后多久生效？
A: 通常 1-7 天，Google 和 Bing 较快，百度可能需要更长时间。

### Q: IndexNow 提交失败怎么办？
A: 检查 API Key 是否正确，验证文件是否可访问。查看 `logs/` 目录下的日志文件。

### Q: 如何监控收录情况？
A: 在各站长平台查看「索引状态」或「收录量」报告。

---

## 相关资源

- [Google Search Console 帮助](https://support.google.com/webmasters)
- [Bing Webmaster 帮助](https://www.bing.com/webmasters/help)
- [百度站长平台帮助](https://ziyuan.baidu.com/college)
- [IndexNow 官方文档](https://www.indexnow.org/documentation)
