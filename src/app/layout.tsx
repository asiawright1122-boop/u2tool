import './globals.css';

/**
 * 根布局组件
 * 仅导入全局样式，实际 HTML 结构由 [locale]/layout.tsx 处理
 * 这样可以避免嵌套的 <html> 标签问题
 * @see Requirements 1.2
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 直接返回 children，让 [locale]/layout.tsx 处理完整的 HTML 结构
  return children;
}
