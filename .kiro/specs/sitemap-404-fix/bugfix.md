# Sitemap 404 错误修复需求文档

## 介绍

修复搜索引擎提交界面报告的 sitemap 404 错误问题。当前 sitemap.xml 成功提交（5,160 个 URL），但 sitemap-tools.xml 和 sitemap-pages.xml 出现 404 错误。采用 **301 重定向方案**，将这两个 URL 永久重定向到主 sitemap.xml，避免维护多个 sitemap 文件。

## Bug 分析

### 当前行为（缺陷）

1.1 当搜索引擎尝试访问 `/sitemap-tools.xml` 时，系统返回 404 错误（文件不存在）
1.2 当搜索引擎尝试访问 `/sitemap-pages.xml` 时，系统返回 404 错误（文件不存在）
1.3 当用户或爬虫访问不存在的 sitemap 文件时，会影响 SEO 性能和索引效率

### 期望行为（正确）

2.1 当搜索引擎访问 `/sitemap-tools.xml` 时，系统应返回 **301 永久重定向** 到 `/sitemap.xml`
2.2 当搜索引擎访问 `/sitemap-pages.xml` 时，系统应返回 **301 永久重定向** 到 `/sitemap.xml`
2.3 搜索引擎应自动跟随重定向，访问主 sitemap.xml，消除 404 错误

### 不变行为（回归预防）

3.1 当搜索引擎访问现有的 `/sitemap.xml` 时，系统应继续返回包含所有页面的完整 sitemap（5,160 个 URL）
3.2 当访问现有 sitemap 时，系统应继续包含正确的 hreflang 标签和元数据
3.3 当生成 sitemap 时，系统应继续使用相同的 URL 格式和优先级设置
3.4 新工具添加时，应自动包含在主 sitemap 中，无需修改重定向文件