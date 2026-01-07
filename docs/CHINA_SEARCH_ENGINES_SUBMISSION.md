# 中国搜索引擎提交指南

## 📋 概述

本指南涵盖搜狗、神马（UC）、头条搜索的站点提交流程。这些平台都需要手动操作，没有公开的 API 推送接口。

**Sitemap URL**: `https://www.u2tool.com/sitemap.xml`

---

## 1. 搜狗站长平台

### 注册和验证

1. **访问**: https://zhanzhang.sogou.com
2. **注册**: 使用搜狗账号或微信扫码登录
3. **添加站点**: 点击「添加网站」→ 输入 `www.u2tool.com`
4. **验证方式**（选择一种）:
   - **文件验证**（推荐）: 下载验证文件放到 `public/` 目录
   - **HTML 标签验证**: 添加 meta 标签到页面
   - **CNAME 验证**: 添加 DNS 记录

### 提交 Sitemap

1. 进入站点管理后台
2. 左侧菜单 → **链接提交** → **Sitemap 提交**
3. 输入: `https://www.u2tool.com/sitemap.xml`
4. 点击「提交」

### 其他功能

- **链接提交**: 可以手动提交重要 URL
- **死链提交**: 如果有失效页面可以提交
- **索引量查询**: 查看收录情况

---

## 2. 神马站长平台（UC 浏览器搜索）

### 注册和验证

1. **访问**: https://zhanzhang.sm.cn
2. **注册**: 使用阿里系账号（淘宝/支付宝）登录
3. **添加站点**: 点击「添加网站」→ 输入 `www.u2tool.com`
4. **验证方式**:
   - **文件验证**: 下载 `sm_xxxxxx.html` 放到 `public/` 目录
   - **HTML 标签验证**: 添加 meta 标签

### 提交 Sitemap

1. 进入站点管理后台
2. 左侧菜单 → **链接提交** → **Sitemap 提交**
3. 输入: `https://www.u2tool.com/sitemap.xml`
4. 点击「提交」

### 注意事项

- 神马主要服务移动端用户（UC 浏览器）
- 确保网站移动端适配良好
- 可以提交移动端专用 sitemap（如果有）

---

## 3. 头条站长平台（今日头条/抖音搜索）

### 注册和验证

1. **访问**: https://zhanzhang.toutiao.com
2. **注册**: 使用字节跳动账号（今日头条/抖音）登录
3. **添加站点**: 点击「添加网站」→ 输入 `www.u2tool.com`
4. **验证方式**:
   - **文件验证**: 下载验证文件放到 `public/` 目录
   - **HTML 标签验证**: 添加 meta 标签

### 提交 Sitemap

1. 进入站点管理后台
2. 左侧菜单 → **链接提交** → **Sitemap 提交**
3. 输入: `https://www.u2tool.com/sitemap.xml`
4. 点击「提交」

### 特别说明

- 头条搜索流量主要来自今日头条 App 和抖音
- 适合内容型网站，工具站效果可能一般
- 但提交不会有坏处，建议都提交

---

## 📝 验证文件管理

如果选择文件验证，需要将验证文件放到 `public/` 目录：

```
public/
├── baidu_verify_codeva-DaI2NqB1Qi.html  # 百度（已有）
├── 360_a9a62516e3a7977830175b7fb2eb1f66.html  # 360（已有）
├── sogou_xxxxxx.html  # 搜狗（待添加）
├── sm_xxxxxx.html  # 神马（待添加）
├── toutiao_xxxxxx.html  # 头条（待添加）
```

### 添加验证文件后

1. 提交代码: `git add . && git commit -m "Add search engine verification files" && git push`
2. 等待部署完成
3. 回到各站长平台点击「验证」

---

## 🔧 HTML 标签验证（可选）

如果选择 HTML 标签验证，需要在 `src/app/[locale]/layout.tsx` 中添加：

```tsx
// 在 <head> 部分添加
<meta name="sogou_site_verification" content="YOUR_SOGOU_CODE" />
<meta name="shenma-site-verification" content="YOUR_SHENMA_CODE" />
<meta name="bytedance-verification-code" content="YOUR_TOUTIAO_CODE" />
```

这些标签位置已经在 layout.tsx 中预留，只需要填入验证码即可。

---

## ✅ 提交检查清单

### 搜狗
- [ ] 注册搜狗站长账号
- [ ] 添加站点 www.u2tool.com
- [ ] 完成站点验证
- [ ] 提交 Sitemap

### 神马
- [ ] 注册神马站长账号
- [ ] 添加站点 www.u2tool.com
- [ ] 完成站点验证
- [ ] 提交 Sitemap

### 头条
- [ ] 注册头条站长账号
- [ ] 添加站点 www.u2tool.com
- [ ] 完成站点验证
- [ ] 提交 Sitemap

---

## 📊 中国搜索引擎市场份额参考

| 搜索引擎 | 市场份额 | 主要场景 |
|---------|---------|---------|
| 百度 | ~60% | PC + 移动 |
| 搜狗 | ~15% | PC + 微信搜索 |
| 神马 | ~10% | 移动端（UC 浏览器）|
| 360 | ~8% | PC 端 |
| 头条 | ~5% | 今日头条/抖音 App |
| 必应 | ~2% | PC 端 |

---

## 🔗 快速链接

| 平台 | 站长平台 | Sitemap 提交 |
|-----|---------|-------------|
| 搜狗 | https://zhanzhang.sogou.com | 链接提交 → Sitemap |
| 神马 | https://zhanzhang.sm.cn | 链接提交 → Sitemap |
| 头条 | https://zhanzhang.toutiao.com | 链接提交 → Sitemap |

---

## ⚠️ 注意事项

1. **验证文件不要删除** - 搜索引擎会定期检查
2. **Sitemap 保持更新** - 每次添加新工具后自动更新
3. **耐心等待** - 收录需要时间，通常 1-4 周
4. **移动适配** - 神马和头条主要服务移动用户，确保移动端体验良好
5. **内容质量** - 搜索引擎越来越重视内容质量，工具页面要有详细说明

---

## 📅 更新日志

- **2026-01-06**: 创建文档
