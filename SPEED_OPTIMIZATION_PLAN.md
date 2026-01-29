# Vercel 免费套餐性能优化方案

## 当前问题分析

从 Speed Insights 数据：
- **FCP**: 2.85s (目标 < 1.8s) ❌
- **LCP**: 2.94s (目标 < 2.5s) ❌
- **TTFB**: 0.82s (偏高) ⚠️
- **INP**: 72ms ✅
- **CLS**: 0 ✅

### 问题页面
| 页面 | 得分 | 问题 |
|------|------|------|
| `/[locale]/tools/[slug]` | 88 | 工具组件动态加载 |
| `/[locale]` | 87 | 首页内容较多 |
| `/[locale]/tools` | 57 | 渲染 498 个工具卡片 |

### 地区问题
- 中亚（哈萨克斯坦、吉尔吉斯斯坦）: 33-41 分
- 阿尔及利亚: 25 分
- 原因：距离 Vercel 边缘节点远

---

## 优化方案

### 1. 工具列表页优化（最紧急，得分 57）

**问题**：一次性渲染 498 个工具卡片，导致：
- 大量 DOM 节点
- 长时间 JavaScript 执行
- 大量翻译调用

**解决方案**：

#### A. 虚拟滚动（推荐）
```tsx
// 使用 react-window 或 @tanstack/react-virtual
// 只渲染可见区域的工具卡片
import { FixedSizeGrid } from 'react-window';
```

#### B. 分页加载
```tsx
// 初始只加载前 20 个工具
// 滚动到底部时加载更多
const [visibleCount, setVisibleCount] = useState(20);
```

#### C. 按分类折叠
```tsx
// 默认折叠非热门分类
// 点击展开时才渲染工具卡片
const [expandedCategories, setExpandedCategories] = useState(['encoding']);
```

### 2. 静态生成优化

**当前**：工具页面按需生成（ISR）
**优化**：增加预渲染页面数量

```js
// next.config.js
module.exports = {
  // 增加静态生成超时
  staticPageGenerationTimeout: 300,
}
```

```tsx
// page.tsx - 预渲染更多热门工具
export function generateStaticParams() {
  // 当前只预渲染 popular 工具
  // 可以增加到前 100 个最常用的工具
  const topTools = tools.slice(0, 100);
  // ...
}
```

### 3. 字体优化

**当前**：加载 Plus Jakarta Sans (400, 600, 700)
**优化**：

```tsx
// 使用系统字体作为 fallback，减少字体加载时间
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],  // 移除 600
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});
```

### 4. 翻译加载优化

**问题**：每个页面加载完整翻译文件（~500KB）

**解决方案**：

```tsx
// 按需加载翻译
// 工具列表页只加载工具名称
const toolNames = await loadToolNames(locale);

// 工具详情页才加载完整翻译
const toolMessages = await loadToolMessages(locale, slug);
```

### 5. 图片优化

```tsx
// 使用 Next.js Image 组件的 priority 属性
// 首屏图片优先加载
<Image
  src={tool.icon}
  priority={index < 6}  // 前 6 个工具图标优先加载
  loading={index < 6 ? 'eager' : 'lazy'}
/>
```

### 6. 边缘缓存优化

```js
// next.config.js - 增加页面缓存时间
{
  source: '/:locale(en|zh|es|pt|ja|ko|fr|de|ru|ar)/tools',
  headers: [
    {
      key: 'Cache-Control',
      // 增加到 24 小时，stale-while-revalidate 7 天
      value: 'public, max-age=86400, stale-while-revalidate=604800',
    },
  ],
}
```

### 7. 组件懒加载

```tsx
// 非首屏组件懒加载
const RelatedTools = dynamic(() => import('@/components/RelatedTools'), {
  loading: () => <div className="h-40 animate-pulse bg-gray-200" />,
});

const ToolFAQ = dynamic(() => import('@/components/ToolFAQ'), {
  loading: () => <div className="h-32 animate-pulse bg-gray-200" />,
});
```

### 8. 减少 JavaScript Bundle

```bash
# 分析 bundle 大小
ANALYZE=true npm run build
```

主要优化目标：
- echarts: ~1MB → 按需加载
- xlsx: ~400KB → 按需加载
- pdf-lib: ~300KB → 按需加载

---

## 实施优先级

1. **高优先级**（立即实施）
   - [ ] 工具列表页分页/虚拟滚动
   - [ ] 增加页面缓存时间
   - [ ] 非首屏组件懒加载

2. **中优先级**（本周）
   - [ ] 翻译按需加载
   - [ ] 字体优化
   - [ ] 预渲染更多页面

3. **低优先级**（后续）
   - [ ] Bundle 分析和优化
   - [ ] 图片优化

---

## 预期效果

| 指标 | 当前 | 目标 |
|------|------|------|
| FCP | 2.85s | < 1.8s |
| LCP | 2.94s | < 2.5s |
| TTFB | 0.82s | < 0.5s |
| 工具列表页得分 | 57 | > 80 |
| 整体得分 | 88 | > 90 |

---

## 关于地区问题

中亚和北非地区得分低是因为：
1. Vercel 免费套餐边缘节点有限
2. 这些地区网络基础设施较差

**解决方案**：
- 升级 Vercel Pro（更多边缘节点）
- 或使用 Cloudflare CDN 前置
- 或接受这些地区的较低得分（用户量可能不大）
