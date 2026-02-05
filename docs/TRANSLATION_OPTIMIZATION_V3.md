# 翻译优化方案 V3 - 不拆分文件

## 问题分析

当前问题：
- 每个页面都嵌入完整翻译文件（1.6-2.5MB）
- 10 种语言 × 500+ 页面 = 巨大的构建产物
- Vercel 构建时磁盘空间不足

## 方案：按需加载翻译

### 核心思路

1. **服务端只传递当前页面需要的翻译**
2. **客户端按需加载额外翻译**
3. **翻译文件存储在 CDN**

### 实现步骤

#### 1. 修改 `src/i18n/request.ts` - 只加载核心翻译

```typescript
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  
  // 只加载核心翻译（约 50KB）
  // 包含：site, nav, footer, categories, common UI
  const coreMessages = await loadCoreMessages(locale);
  
  return {
    locale,
    messages: coreMessages,
  };
});
```

#### 2. 创建核心翻译提取脚本

从完整翻译文件中提取核心部分：
- site, nav, footer, theme, errors, common
- categories, categories_seo
- tools 下的通用 UI 字符串

#### 3. 工具页面按需加载工具翻译

```typescript
// 在工具页面组件中
const toolMessages = await loadToolMessages(locale, slug);
```

#### 4. 翻译文件放到 CDN

选项 A：Vercel Blob Storage
选项 B：Cloudflare R2
选项 C：GitHub Raw（免费但有限制）

### 预期效果

| 指标 | 当前 | 优化后 |
|------|------|--------|
| 页面嵌入翻译 | 1.6MB | ~50KB |
| 构建产物 | 10GB+ | ~2GB |
| 首次加载 | 慢 | 快 |

## 替代方案：减少预生成页面

如果不想改动翻译加载逻辑，可以大幅减少预生成页面：

### 当前策略
- en/zh/ja: 所有工具（~400 × 3 = 1200 页）
- 其他语言: 热门工具（~50 × 7 = 350 页）
- 总计: ~1550 工具页面 + 其他页面

### 优化策略
- 只预生成 en 的热门工具（~50 页）
- 其他全部用 ISR 按需生成

```typescript
export function generateStaticParams() {
  // 只预生成英文热门工具
  const popularTools = tools.filter(t => t.popular);
  return popularTools.map(tool => ({
    locale: 'en',
    slug: tool.slug,
  }));
}
```

### 预期效果
- 构建产物从 10GB 降到 ~500MB
- 首次访问非热门页面会稍慢（ISR 生成）
- 后续访问正常（已缓存）

## 推荐方案

**短期（立即可做）**：减少预生成页面数量
**中期**：实现核心翻译提取，减少页面嵌入大小
**长期**：翻译文件上 CDN，完全按需加载
