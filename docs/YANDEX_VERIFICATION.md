# Yandex Webmaster 验证指南

## ✅ 已完成的配置

### 1. 更新验证码

已更新 Yandex 验证码为：`8ca42f005723223b`

**文件位置：**
- `src/lib/seo.ts` - 第 30 行
- 默认值已更新，如果设置了 `YANDEX_SITE_VERIFICATION` 环境变量，会优先使用环境变量

### 2. Meta 标签自动添加

验证 meta 标签会自动添加到所有页面的 `<head>` 部分：

```html
<meta name="yandex-verification" content="8ca42f005723223b" />
```

**实现位置：**
- `src/app/[locale]/layout.tsx` - 通过 `getVerificationTags()` 函数自动添加

## 🚀 部署步骤

### 步骤 1：部署代码

```bash
# 提交更改
git add .
git commit -m "更新 Yandex 验证码为 8ca42f005723223b"
git push origin main

# 如果使用 Vercel，会自动部署
# 如果使用其他平台，请按照相应流程部署
```

### 步骤 2：等待部署完成

- Vercel 通常需要 1-3 分钟
- 其他平台请参考相应文档

### 步骤 3：验证 Meta 标签

部署完成后，运行验证脚本：

```bash
npx ts-node scripts/verify-yandex-meta.ts
```

或者手动检查：
1. 访问 https://www.u2tool.com
2. 右键 → 查看页面源代码
3. 搜索 `yandex-verification`
4. 确认 content 值为 `8ca42f005723223b`

## 🔍 在 Yandex Webmaster 中验证

### 步骤 1：访问验证页面

1. 访问 [Yandex Webmaster](https://webmaster.yandex.com)
2. 选择站点 `https://www.u2tool.com`
3. 进入验证页面（如果还在验证流程中）

### 步骤 2：检查 Meta 标签

1. 确保选择了 "Meta tag" 标签页
2. 验证码应该显示为：`8ca42f005723223b`

### 步骤 3：验证站点

1. 点击 "Verify" 按钮
2. Yandex 会检查网站首页的 meta 标签
3. 如果验证成功，会显示成功消息

## ⚠️ 常见问题

### Q: 验证失败怎么办？

**A: 检查以下几点：**

1. **代码是否已部署**
   - 运行验证脚本确认生产环境已更新
   - 手动检查页面源代码

2. **等待时间**
   - 部署后可能需要几分钟才能生效
   - 清除浏览器缓存后重试

3. **环境变量**
   - 如果设置了 `YANDEX_SITE_VERIFICATION` 环境变量
   - 确保环境变量值为 `8ca42f005723223b`
   - 或者在 Vercel 项目设置中检查环境变量

4. **Meta 标签格式**
   - 确保 meta 标签在 `<head>` 部分
   - 格式：`<meta name="yandex-verification" content="8ca42f005723223b" />`

### Q: 如何检查环境变量？

**A: 在 Vercel 中：**
1. 进入项目 Settings → Environment Variables
2. 查找 `YANDEX_SITE_VERIFICATION`
3. 如果存在，确保值为 `8ca42f005723223b`
4. 如果不存在，代码会使用默认值（已更新）

### Q: 验证后还需要做什么？

**A: 验证成功后：**

1. **提交 Sitemap**
   - 进入 "Indexing" → "Sitemap files"
   - 添加：`https://www.u2tool.com/sitemap.xml`

2. **检查索引状态**
   - 定期查看 "Indexing" → "Indexing status"
   - 监控页面索引情况

3. **使用 IndexNow**
   - Yandex 支持 IndexNow 协议
   - 运行：`npm run submit:indexnow`

## 📝 相关文件

- `src/lib/seo.ts` - SEO 配置和验证码
- `src/app/[locale]/layout.tsx` - Meta 标签注入
- `scripts/verify-yandex-meta.ts` - 验证脚本
- `docs/SEO_SETUP_GUIDE.md` - SEO 设置指南

## ✅ 验证清单

- [ ] 代码已更新（验证码：`8ca42f005723223b`）
- [ ] 代码已提交到 Git
- [ ] 代码已部署到生产环境
- [ ] 运行验证脚本确认 meta 标签正确
- [ ] 在 Yandex Webmaster 中点击 "Verify"
- [ ] 验证成功
- [ ] 提交 Sitemap
