# 翻译加载问题调试指南

## 问题描述

Percentage Stacked Bar Chart Generator 工具显示 "MISSING: tools.percentage-stacked-bar..." 错误。

## 已验证的内容

✅ 翻译文件完整 - 所有必需的翻译键都存在于 `src/messages/en.json`
✅ 组件代码正确 - 使用了正确的翻译助手函数
✅ 翻译助手函数正确 - `createToolTranslator` 实现正确

## 可能的原因

1. **浏览器缓存** - 旧的 JavaScript 代码被缓存
2. **Astro 构建缓存** - `.astro/` 目录中的缓存文件过期
3. **开发服务器未重启** - 翻译文件更新后服务器未重启
4. **翻译对象传递问题** - 运行时翻译对象结构不正确

## 调试步骤

### 步骤 1: 清除浏览器缓存

1. 打开浏览器开发者工具 (F12)
2. 右键点击刷新按钮
3. 选择"清空缓存并硬性重新加载"

或使用快捷键：
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### 步骤 2: 清除 Astro 缓存并重启

```bash
# 停止开发服务器 (Ctrl+C)

# 清除缓存
rm -rf .astro dist

# 重新启动
npm run dev
```

### 步骤 3: 检查浏览器控制台

打开浏览器控制台 (F12)，查找：

1. **JavaScript 错误** - 红色错误信息
2. **网络请求失败** - 翻译文件加载失败
3. **翻译对象结构** - 在控制台运行：
   ```javascript
   // 检查翻译对象
   console.log(window.__translations);
   ```

### 步骤 4: 添加调试日志

在 `src/components/tools/PercentageStackedBarChartGenerator.svelte` 的开头添加：

```typescript
// 在 <script> 标签内，createToolTranslator 之后
console.log('=== Translation Debug ===');
console.log('translations object:', translations);
console.log('tools namespace:', translations.tools);
console.log('tool data:', translations.tools?.['percentage-stacked-bar-chart-generator']);
console.log('series1:', t('series1'));
console.log('series2:', t('series2'));
console.log('series3:', t('series3'));
```

### 步骤 5: 验证翻译文件

运行以下命令验证翻译文件：

```bash
# 检查英文翻译
grep -A 30 '"percentage-stacked-bar-chart-generator"' src/messages/en.json | grep -E '"(series1|series2|series3)"'

# 应该看到：
# "series1": "Series A",
# "series2": "Series B",
# "series3": "Series C",
```

### 步骤 6: 检查生产构建

如果在生产环境：

```bash
# 重新构建
npm run build

# 检查构建输出
ls -lh dist/
```

## 常见解决方案

### 解决方案 1: 完全清除缓存

```bash
# 停止所有进程
pkill -f "npm run dev"
pkill -f "astro"

# 清除所有缓存
rm -rf .astro dist node_modules/.vite node_modules/.astro

# 重新安装依赖（如果需要）
npm install

# 重启
npm run dev
```

### 解决方案 2: 检查翻译对象结构

在 `src/pages/[locale]/tools/[slug].astro` 中，确认 `toolTranslations` 的结构：

```typescript
// 应该是这样的结构：
const toolTranslations = {
  tools: {
    // 通用键
    copy: "Copy",
    clear: "Clear",
    // ... 其他通用键
    
    // 工具特定键
    "percentage-stacked-bar-chart-generator": {
      name: "Percentage Stacked Bar Chart Generator",
      series1: "Series A",
      series2: "Series B",
      series3: "Series C",
      // ... 其他键
    }
  }
};
```

### 解决方案 3: 强制重新加载翻译

在浏览器中，打开工具页面后：

1. 打开开发者工具 (F12)
2. 切换到 "Application" 或 "存储" 标签
3. 清除所有 "Local Storage" 和 "Session Storage"
4. 刷新页面

## 验证修复

修复后，应该看到：

1. ✅ 不再有 "MISSING: tools.percentage-stacked-bar..." 错误
2. ✅ 系列名称显示为 "Series A", "Series B", "Series C"
3. ✅ 所有按钮和标签都正确显示
4. ✅ 图表正常渲染

## 如果问题仍然存在

如果以上步骤都无法解决问题，请提供：

1. 浏览器控制台的完整错误信息
2. 网络标签中的翻译文件加载状态
3. 添加调试日志后的输出
4. 使用的浏览器和版本
5. 是本地开发环境还是生产环境

## 相关文件

- 组件: `src/components/tools/PercentageStackedBarChartGenerator.svelte`
- 翻译: `src/messages/en.json` (以及其他 9 种语言)
- 翻译助手: `src/lib/translation-helper.ts`
- 工具页面: `src/pages/[locale]/tools/[slug].astro`

## 最后更新

2026-04-15 - 验证所有翻译键都存在于翻译文件中
