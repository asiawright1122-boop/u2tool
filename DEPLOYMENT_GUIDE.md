# U2Tool 上线部署指南

> 域名：**www.u2tool.com**

## 📋 SEO 优化完成状态

### ✅ 已完成的 SEO 优化

| 类别 | 项目 | 状态 |
|------|------|------|
| **基础 SEO** | Sitemap.xml | ✅ 多语言 alternates |
| | Robots.txt | ✅ 30+ 搜索引擎爬虫 |
| | Canonical URLs | ✅ 自动生成 |
| | hreflang 标签 | ✅ 5 种语言 |
| **结构化数据** | WebSite JSON-LD | ✅ 首页 |
| | SoftwareApplication JSON-LD | ✅ 工具页 |
| | BreadcrumbList JSON-LD | ✅ 面包屑 |
| | Organization JSON-LD | ✅ 组织信息 |
| | FAQ JSON-LD | ✅ 常见问题 |
| | HowTo JSON-LD | ✅ 使用说明 |
| | CollectionPage JSON-LD | ✅ 分类页 |
| **搜索引擎** | Google | ✅ 验证支持 |
| | Bing | ✅ 验证支持 |
| | 百度 | ✅ 验证 + 移动适配 |
| | 360 | ✅ 验证支持 |
| | 搜狗 | ✅ 验证支持 |
| | 神马 | ✅ 验证支持 |
| | 头条 | ✅ 验证支持 |
| | Yandex | ✅ 验证支持 |
| **移动端优化** | PWA manifest | ✅ 完整配置 |
| | Apple 移动端 | ✅ 启动画面 + 状态栏 |
| | Android 移动端 | ✅ 全屏模式 |
| | 视口优化 | ✅ 刘海屏适配 |
| **性能优化** | DNS 预取 | ✅ |
| | 预连接 | ✅ |
| | HTTP 缓存 | ✅ |
| | 骨架屏加载 | ✅ |
| **安全优化** | X-Content-Type-Options | ✅ |
| | X-Frame-Options | ✅ |
| | X-XSS-Protection | ✅ |

---

## 🚀 Vercel 部署步骤

### 步骤 1：准备代码

```bash
# 确保代码已提交到 Git
git add .
git commit -m "配置域名 www.u2tool.com"
git push origin main
```

### 步骤 2：Vercel 部署

1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "Add New Project"
3. 导入你的 Git 仓库
4. 配置环境变量（见下方）
5. 点击 "Deploy"

### 步骤 3：配置环境变量

在 Vercel 项目设置 → Environment Variables 中添加：

| 变量名 | 值 | 必填 |
|--------|-----|------|
| `NEXT_PUBLIC_BASE_URL` | `https://www.u2tool.com` | ✅ |
| `GOOGLE_SITE_VERIFICATION` | 从 Google Search Console 获取 | 推荐 |
| `BING_SITE_VERIFICATION` | 从 Bing Webmaster 获取 | 推荐 |
| `BAIDU_SITE_VERIFICATION` | 从百度站长平台获取 | 推荐 |

---

## 🌐 域名 DNS 配置

### 在你的域名注册商处添加以下 DNS 记录：

#### 方式 A：使用 Vercel DNS（推荐）

| 类型 | 名称 | 值 |
|------|------|-----|
| A | @ | 76.76.19.19 |
| CNAME | www | cname.vercel-dns.com |

#### 方式 B：仅 www 子域名

| 类型 | 名称 | 值 |
|------|------|-----|
| CNAME | www | cname.vercel-dns.com |

### 在 Vercel 中添加域名

1. 进入项目 Settings → Domains
2. 添加 `www.u2tool.com`
3. 添加 `u2tool.com`（设置重定向到 www）
4. 等待 SSL 证书自动配置（通常 1-5 分钟）

---

## 🔍 搜索引擎站长平台注册

### 1. Google Search Console
- 地址：https://search.google.com/search-console
- 添加资源 → 输入 `https://www.u2tool.com`
- 验证方式：HTML 标签（复制验证码到环境变量）
- 提交 Sitemap：`https://www.u2tool.com/sitemap.xml`

### 2. Bing Webmaster Tools
- 地址：https://www.bing.com/webmasters
- 添加站点 → 输入 `https://www.u2tool.com`
- 可从 Google Search Console 导入
- 提交 Sitemap

### 3. 百度站长平台
- 地址：https://ziyuan.baidu.com/
- 用户中心 → 站点管理 → 添加网站
- 验证方式：HTML 标签
- 提交 Sitemap
- 开启移动适配（自适应）

### 4. 360 站长平台
- 地址：https://zhanzhang.so.com/
- 添加站点并验证
- 提交 Sitemap

### 5. 搜狗站长平台
- 地址：https://zhanzhang.sogou.com/
- 添加站点并验证

### 6. 神马站长平台（UC 浏览器）
- 地址：https://zhanzhang.sm.cn/
- 添加站点并验证

### 7. 头条站长平台
- 地址：https://zhanzhang.toutiao.com/
- 添加站点并验证

---

## ✅ 上线后检查清单

### SEO 验证

- [ ] 访问 `https://www.u2tool.com/sitemap.xml` 确认可访问
- [ ] 访问 `https://www.u2tool.com/robots.txt` 确认可访问
- [ ] 使用 [Rich Results Test](https://search.google.com/test/rich-results) 验证结构化数据
- [ ] 使用 [PageSpeed Insights](https://pagespeed.web.dev/) 测试性能

### 功能验证

- [ ] 首页各语言版本正常加载
- [ ] 工具页面正常工作
- [ ] 语言切换功能正常
- [ ] PWA 安装功能正常（移动端）

### 性能目标

| 指标 | 目标值 |
|------|--------|
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |

---

## 🔧 常见问题

### Q: SSL 证书未生效？
A: Vercel 自动配置 SSL，等待 5-10 分钟。如仍有问题，检查 DNS 配置是否正确。

### Q: 百度收录慢？
A: 百度收录较慢是正常的，建议：
1. 在百度站长平台提交 Sitemap
2. 使用"链接提交"功能主动推送
3. 保持内容更新

### Q: 如何查看搜索引擎收录情况？
A: 在搜索引擎中搜索 `site:www.u2tool.com`

---

*最后更新: 2024-12-23*
