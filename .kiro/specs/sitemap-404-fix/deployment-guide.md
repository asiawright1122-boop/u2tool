# Sitemap 404 修复部署指南

## 概述

本指南描述如何部署 sitemap 404 修复，确保 `sitemap-tools.xml` 和 `sitemap-pages.xml` 文件正常工作。

## 部署前检查

### 1. 本地验证

```bash
# 启动开发服务器
npm run dev

# 运行验证脚本
npx tsx scripts/validate-sitemap-fix.ts
```

### 2. 构建测试

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview

# 验证生产构建的 sitemap
curl http://localhost:4321/sitemap-tools.xml
curl http://localhost:4321/sitemap-pages.xml
```

## 部署步骤

### 1. 代码部署

1. 提交所有更改到 Git
2. 推送到主分支
3. 触发生产部署

### 2. 验证部署

部署完成后，验证新的 sitemap 文件：

```bash
# 检查文件可访问性
curl -I https://www.u2tool.com/sitemap-tools.xml
curl -I https://www.u2tool.com/sitemap-pages.xml

# 检查内容
curl https://www.u2tool.com/sitemap-tools.xml | head -20
curl https://www.u2tool.com/sitemap-pages.xml | head -20
```

预期结果：
- HTTP 状态码：200
- Content-Type: application/xml
- 包含正确的 XML 声明和命名空间

## 搜索引擎提交

### 1. Google Search Console

1. 登录 [Google Search Console](https://search.google.com/search-console)
2. 选择网站属性
3. 进入 "Sitemaps" 菜单
4. 添加新的 sitemap：
   - `sitemap-tools.xml`
   - `sitemap-pages.xml`
5. 点击 "Submit" 提交

### 2. Bing Webmaster Tools

1. 登录 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 选择网站
3. 进入 "Sitemaps" 菜单
4. 提交新的 sitemap URL

### 3. 其他搜索引擎

按照类似流程提交到：
- 百度站长平台
- Yandex Webmaster
- 360 搜索站长平台

## 监控和验证

### 1. 搜索引擎索引状态

定期检查各搜索引擎控制台中的 sitemap 状态：
- 提交状态：已提交/已处理
- 发现的 URL 数量
- 索引的 URL 数量
- 错误报告

### 2. 网站分析

监控以下指标：
- 搜索引擎爬虫访问频率
- 新页面索引速度
- 搜索流量变化

### 3. 定期检查

建议每周检查：
```bash
# 检查 sitemap 可访问性
curl -s -o /dev/null -w "%{http_code}" https://www.u2tool.com/sitemap-tools.xml
curl -s -o /dev/null -w "%{http_code}" https://www.u2tool.com/sitemap-pages.xml

# 检查 URL 数量变化
curl -s https://www.u2tool.com/sitemap-tools.xml | grep -c "<url>"
curl -s https://www.u2tool.com/sitemap-pages.xml | grep -c "<url>"
```

## 故障排除

### 常见问题

1. **404 错误仍然存在**
   - 检查文件是否正确部署
   - 验证 Astro 路由配置
   - 清除 CDN 缓存

2. **XML 格式错误**
   - 检查 TypeScript 编译错误
   - 验证导入路径正确
   - 检查共享工具函数

3. **URL 数量不正确**
   - 验证工具和分类数据
   - 检查语言配置
   - 确认过滤逻辑

### 回滚计划

如果出现问题，可以快速回滚：

1. **临时解决方案**：
   - 创建重定向规则：
     ```
     /sitemap-tools.xml -> /sitemap.xml
     /sitemap-pages.xml -> /sitemap.xml
     ```

2. **完全回滚**：
   - 恢复到之前的代码版本
   - 重新部署
   - 在搜索引擎控制台中删除新的 sitemap

## 成功指标

修复成功的标志：
- ✅ 所有 sitemap 文件返回 200 状态码
- ✅ 搜索引擎控制台显示 "已提交" 状态
- ✅ 无 404 错误报告
- ✅ URL 发现和索引数量正常
- ✅ 现有 SEO 性能保持稳定

## 联系信息

如有问题，请联系：
- 开发团队：检查技术实现
- SEO 团队：监控搜索引擎表现
- 运维团队：处理部署和基础设施问题