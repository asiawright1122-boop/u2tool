/**
 * Critical CSS - 关键 CSS 样式
 * 
 * 包含首屏渲染所需的最小 CSS，用于内联到 HTML 中
 * 减少渲染阻塞，提升 LCP 和 FCP
 * 
 * @see Requirements 2.1, 2.4
 */

/**
 * 关键 CSS 字符串
 * 包含：
 * - 骨架屏动画
 * - 基础布局样式
 * - 防 CLS 样式
 * - 暗色模式基础样式
 */
export const criticalCSS = `
/* 骨架屏动画 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* 防止布局偏移的最小高度 */
.tool-skeleton {
  min-height: 300px;
}

.tool-error-boundary {
  min-height: 300px;
}

/* 工具图标容器固定尺寸防止 CLS */
.tool-icon-container {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 基础布局 */
html {
  -webkit-text-size-adjust: 100%;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
  margin: 0;
  line-height: 1.5;
}

/* 暗色模式基础 */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }
}

.dark {
  color-scheme: dark;
}

/* 骨架屏颜色 */
.bg-gray-200 {
  background-color: rgb(229 231 235);
}

.dark .bg-gray-700 {
  background-color: rgb(55 65 81);
}

/* 圆角 */
.rounded-lg {
  border-radius: 0.5rem;
}

.rounded {
  border-radius: 0.25rem;
}

/* 间距 */
.space-y-4 > * + * {
  margin-top: 1rem;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

/* Flexbox */
.flex {
  display: flex;
}

.flex-1 {
  flex: 1 1 0%;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

/* Grid */
.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

/* 尺寸 */
.h-4 { height: 1rem; }
.h-10 { height: 2.5rem; }
.h-32 { height: 8rem; }
.h-40 { height: 10rem; }
.h-48 { height: 12rem; }
.h-64 { height: 16rem; }
.h-80 { height: 20rem; }

.w-16 { width: 4rem; }
.w-20 { width: 5rem; }
.w-24 { width: 6rem; }
.w-28 { width: 7rem; }
.w-32 { width: 8rem; }
.w-full { width: 100%; }

.min-h-\\[300px\\] {
  min-height: 300px;
}

/* 边距 */
.mt-2 { margin-top: 0.5rem; }
.mb-2 { margin-bottom: 0.5rem; }
.p-4 { padding: 1rem; }

/* 边框 */
.border {
  border-width: 1px;
}

.border-gray-200 {
  border-color: rgb(229 231 235);
}

.dark .border-gray-700 {
  border-color: rgb(55 65 81);
}

/* 屏幕阅读器专用 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* 文本颜色 */
.text-center {
  text-align: center;
}

.text-gray-600 {
  color: rgb(75 85 99);
}

.dark .text-gray-300 {
  color: rgb(209 213 219);
}
`.trim();

/**
 * 获取关键 CSS 的大小（字节）
 */
export function getCriticalCSSSize(): number {
  return new Blob([criticalCSS]).size;
}

/**
 * 关键 CSS 大小限制（14KB，符合 TCP 初始拥塞窗口）
 */
export const CRITICAL_CSS_SIZE_LIMIT = 14 * 1024;

/**
 * 检查关键 CSS 是否在大小限制内
 */
export function isCriticalCSSWithinLimit(): boolean {
  return getCriticalCSSSize() <= CRITICAL_CSS_SIZE_LIMIT;
}
