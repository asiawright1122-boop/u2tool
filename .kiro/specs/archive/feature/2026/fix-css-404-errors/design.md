# Design Document: Fix CSS 404 Errors

## Overview

本设计文档描述了如何修复由错误的 CSS 预加载代码导致的前端页面卡死问题。问题的核心在于 `src/app/[locale]/layout.tsx` 中包含了一个指向不存在资源的预加载链接，导致浏览器产生大量 404 错误，进而可能阻塞资源加载并引起页面卡死。

### 问题分析

1. **错误代码位置**: `src/app/[locale]/layout.tsx` 第 152 行
   ```html
   <link rel="preload" as="style" href="/globals.css" />
   ```

2. **为什么这是错误的**:
   - `globals.css` 实际位于 `src/app/globals.css`
   - Next.js 已经在 `src/app/layout.tsx` 中通过 `import './globals.css'` 导入了该文件
   - Next.js 会自动处理 CSS 的打包、优化和加载
   - 手动添加的预加载链接指向 `/globals.css`（即 `public/globals.css`），该文件不存在
   - 浏览器尝试加载不存在的资源，产生 404 错误

3. **影响**:
   - Vercel 日志中出现大量 404 错误
   - 浏览器资源加载可能被阻塞
   - 用户可能遇到页面卡死或加载弹窗
   - 影响用户体验和网站性能指标

### 解决方案

删除错误的预加载代码，让 Next.js 自动处理 CSS 加载。Next.js 的构建系统会：
- 自动提取和优化 CSS
- 在适当的时机注入 CSS 链接
- 处理 CSS 的代码分割和缓存
- 确保 CSS 在需要时被加载

## Architecture

### 当前架构

```
src/app/layout.tsx (Root Layout)
  ├─ import './globals.css'  ✓ 正确的导入方式
  └─ return children
      └─ src/app/[locale]/layout.tsx (Locale Layout)
          ├─ <head>
          │   ├─ DNS prefetch links  ✓ 保留
          │   ├─ Preconnect links    ✓ 保留
          │   ├─ <link rel="preload" href="/globals.css" />  ✗ 错误，需删除
          │   └─ Other meta tags     ✓ 保留
          └─ <body>
              └─ Page content
```

### 修改后架构

```
src/app/layout.tsx (Root Layout)
  ├─ import './globals.css'  ✓ 正确的导入方式
  └─ return children
      └─ src/app/[locale]/layout.tsx (Locale Layout)
          ├─ <head>
          │   ├─ DNS prefetch links  ✓ 保留
          │   ├─ Preconnect links    ✓ 保留
          │   └─ Other meta tags     ✓ 保留
          └─ <body>
              └─ Page content

Next.js Build System (自动处理)
  ├─ CSS 提取和优化
  ├─ CSS 代码分割
  ├─ 自动注入 <link> 标签
  └─ 缓存优化
```

## Components and Interfaces

### 修改的组件

#### LocaleLayout Component (`src/app/[locale]/layout.tsx`)

**当前代码** (第 152 行):
```tsx
<head>
  {/* === 性能优化：DNS 预取和预连接 === */}
  <link rel="dns-prefetch" href="//fonts.googleapis.com" />
  <link rel="dns-prefetch" href="//fonts.gstatic.com" />
  <link rel="dns-prefetch" href="//www.google-analytics.com" />
  <link rel="dns-prefetch" href="//hm.baidu.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  
  {/* === 性能优化：预加载关键资源 === */}
  <link rel="preload" as="style" href="/globals.css" />  {/* ✗ 删除此行 */}
  
  {/* ... 其他标签 ... */}
</head>
```

**修改后代码**:
```tsx
<head>
  {/* === 性能优化：DNS 预取和预连接 === */}
  <link rel="dns-prefetch" href="//fonts.googleapis.com" />
  <link rel="dns-prefetch" href="//fonts.gstatic.com" />
  <link rel="dns-prefetch" href="//www.google-analytics.com" />
  <link rel="dns-prefetch" href="//hm.baidu.com" />
  <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  
  {/* Next.js 自动处理 CSS 加载，无需手动预加载 */}
  
  {/* ... 其他标签 ... */}
</head>
```

### 不修改的组件

以下组件和配置保持不变：

1. **RootLayout** (`src/app/layout.tsx`): 继续通过 `import './globals.css'` 导入全局样式
2. **DNS Prefetch Links**: 保留所有 DNS 预取链接
3. **Preconnect Links**: 保留所有预连接链接
4. **Apple Startup Images**: 保留所有 Apple 启动画面配置
5. **Meta Tags**: 保留所有其他 meta 标签
6. **Critical CSS**: 保留内联的关键 CSS

## Data Models

本修复不涉及数据模型变更。

## Correctness Properties

*属性（Property）是关于系统行为的特征或规则，应该在所有有效执行中保持为真。属性是人类可读规范和机器可验证正确性保证之间的桥梁。*

### Property 1: 错误的 CSS 预加载链接已移除

*For any* 渲染的 LocaleLayout 组件，其输出的 HTML 中不应包含指向 `/globals.css` 的预加载链接标签

**Validates: Requirements 1.1, 1.2**

**测试方法**: 渲染组件并解析输出的 HTML，验证不存在 `<link rel="preload" as="style" href="/globals.css" />` 标签

### Property 2: 保留必要的性能优化资源

*For any* 渲染的 LocaleLayout 组件，其输出的 HTML 中应包含所有必要的 DNS prefetch、preconnect 和移动端优化标签

**Validates: Requirements 4.1, 4.2, 4.3**

**测试方法**: 渲染组件并验证以下资源链接存在：
- DNS prefetch links: `fonts.googleapis.com`, `fonts.gstatic.com`, `www.google-analytics.com`, `hm.baidu.com`
- Preconnect links: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
- Apple startup images: 至少包含主要设备尺寸的启动画面链接



## Error Handling

本修复主要是删除错误的代码，不涉及复杂的错误处理逻辑。但需要注意以下几点：

### 构建时验证

1. **Next.js 构建验证**
   - 确保修改后的代码能够成功构建
   - 验证没有 TypeScript 类型错误
   - 确认 CSS 导入正常工作

2. **HTML 输出验证**
   - 检查生成的 HTML 中不包含错误的预加载链接
   - 确认 Next.js 自动注入的 CSS 链接存在

### 运行时监控

1. **404 错误监控**
   - 部署后监控 Vercel 日志，确认 `/globals.css` 的 404 错误消失
   - 使用 Vercel Analytics 跟踪错误率变化

2. **性能监控**
   - 使用 Web Vitals Reporter 监控 LCP、INP、CLS 指标
   - 确保修改后性能指标保持稳定或改善

### 回滚计划

如果修改导致意外问题：

1. **快速回滚**: 通过 Git 恢复删除的预加载代码
2. **验证回滚**: 确认页面恢复正常（即使有 404 错误）
3. **重新分析**: 调查为什么删除预加载会导致问题
4. **替代方案**: 考虑修正预加载路径而非删除（不推荐，因为 Next.js 已自动处理）

## Testing Strategy

### 单元测试

**目标**: 验证组件渲染输出的正确性

#### Test 1: 验证错误的 CSS 预加载链接已移除

```typescript
describe('LocaleLayout Component', () => {
  it('should not include preload link for /globals.css', () => {
    // 渲染组件
    const html = renderToString(<LocaleLayout params={{ locale: 'en' }}>...</LocaleLayout>);
    
    // 验证不包含错误的预加载链接
    expect(html).not.toContain('<link rel="preload" as="style" href="/globals.css"');
    expect(html).not.toContain('href="/globals.css"');
  });
});
```

#### Test 2: 验证保留了必要的性能优化资源

```typescript
describe('LocaleLayout Component', () => {
  it('should preserve DNS prefetch links', () => {
    const html = renderToString(<LocaleLayout params={{ locale: 'en' }}>...</LocaleLayout>);
    
    // 验证 DNS prefetch links 存在
    expect(html).toContain('rel="dns-prefetch" href="//fonts.googleapis.com"');
    expect(html).toContain('rel="dns-prefetch" href="//fonts.gstatic.com"');
    expect(html).toContain('rel="dns-prefetch" href="//www.google-analytics.com"');
    expect(html).toContain('rel="dns-prefetch" href="//hm.baidu.com"');
  });
  
  it('should preserve preconnect links', () => {
    const html = renderToString(<LocaleLayout params={{ locale: 'en' }}>...</LocaleLayout>);
    
    // 验证 preconnect links 存在
    expect(html).toContain('rel="preconnect" href="https://fonts.googleapis.com"');
    expect(html).toContain('rel="preconnect" href="https://fonts.gstatic.com"');
  });
  
  it('should preserve Apple startup images', () => {
    const html = renderToString(<LocaleLayout params={{ locale: 'en' }}>...</LocaleLayout>);
    
    // 验证至少包含一些主要的 Apple 启动画面
    expect(html).toContain('rel="apple-touch-startup-image"');
    expect(html).toContain('apple-splash-2048-2732.png');
  });
});
```

### 集成测试

**目标**: 验证实际运行环境中的行为

#### Test 3: 验证没有 404 错误（E2E 测试）

```typescript
describe('Page Loading', () => {
  it('should not produce 404 errors for /globals.css', async () => {
    const page = await browser.newPage();
    const requests: string[] = [];
    const failedRequests: string[] = [];
    
    // 监听网络请求
    page.on('request', (request) => {
      requests.push(request.url());
    });
    
    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });
    
    // 访问页面
    await page.goto('http://localhost:3000/en');
    await page.waitForLoadState('networkidle');
    
    // 验证没有 /globals.css 的 404 错误
    const cssRequests = failedRequests.filter(url => url.includes('globals.css'));
    expect(cssRequests).toHaveLength(0);
  });
});
```

#### Test 4: 验证样式正常加载（E2E 测试）

```typescript
describe('Page Styling', () => {
  it('should apply global styles correctly', async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/en');
    
    // 检查 body 元素的样式
    const bodyStyles = await page.evaluate(() => {
      const body = document.querySelector('body');
      const styles = window.getComputedStyle(body);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontFamily: styles.fontFamily,
      };
    });
    
    // 验证样式已应用（具体值取决于 globals.css 的内容）
    expect(bodyStyles.backgroundColor).toBeDefined();
    expect(bodyStyles.color).toBeDefined();
    expect(bodyStyles.fontFamily).toContain('sans');
  });
});
```

### 手动测试清单

部署到生产环境前，需要进行以下手动测试：

1. **本地开发环境测试**
   - [ ] 运行 `npm run dev`
   - [ ] 访问多个页面（首页、工具页、分类页）
   - [ ] 打开浏览器开发者工具 Network 面板
   - [ ] 确认没有 `/globals.css` 的 404 错误
   - [ ] 确认页面样式正常显示

2. **构建和预览测试**
   - [ ] 运行 `npm run build`
   - [ ] 运行 `npm run start`
   - [ ] 重复上述测试步骤

3. **多语言测试**
   - [ ] 测试所有 10 种语言的页面
   - [ ] 确认每种语言的样式都正常

4. **性能测试**
   - [ ] 使用 Lighthouse 测试性能指标
   - [ ] 确认 LCP < 2.5s
   - [ ] 确认 CLS < 0.1

5. **Vercel 预览部署测试**
   - [ ] 创建 PR 并等待 Vercel 预览部署
   - [ ] 在预览环境中重复上述测试
   - [ ] 检查 Vercel 日志，确认没有 404 错误

### 测试配置

- **单元测试**: 使用 Vitest 或 Jest
- **E2E 测试**: 使用 Playwright 或 Cypress
- **最小测试迭代次数**: 单元测试不需要多次迭代（确定性测试）
- **测试标签**: 
  - Feature: fix-css-404-errors, Property 1: 错误的 CSS 预加载链接已移除
  - Feature: fix-css-404-errors, Property 2: 保留必要的性能优化资源

## Implementation Notes

### 修改步骤

1. **定位代码**: 打开 `src/app/[locale]/layout.tsx` 文件
2. **找到错误行**: 搜索 `<link rel="preload" as="style" href="/globals.css" />`（约在第 152 行）
3. **删除该行**: 完整删除该行代码
4. **更新注释**: 可选地添加注释说明 Next.js 自动处理 CSS
5. **保存文件**: 保存修改

### 验证步骤

1. **本地测试**: 运行 `npm run dev` 并访问页面
2. **检查 Network**: 打开浏览器开发者工具，确认没有 404 错误
3. **检查样式**: 确认页面样式正常显示
4. **运行测试**: 执行 `npm run test -- --run`
5. **构建验证**: 运行 `npm run build` 确保构建成功

### 部署后监控

1. **Vercel 日志**: 监控部署后的日志，确认 404 错误消失
2. **Analytics**: 检查 Vercel Analytics 的错误率
3. **Web Vitals**: 监控性能指标是否保持稳定
4. **用户反馈**: 关注是否有用户报告页面加载问题

### 预期结果

- ✅ Vercel 日志中不再出现 `/globals.css` 的 404 错误
- ✅ 页面样式正常加载和显示
- ✅ 页面加载速度保持稳定或改善
- ✅ 用户不再遇到页面卡死或加载弹窗问题
- ✅ 所有性能优化资源（DNS prefetch、preconnect 等）继续正常工作
