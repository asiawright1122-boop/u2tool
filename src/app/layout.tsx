import './globals.css';

/**
 * 根布局组件
 * HTML lang 属性由 [locale]/layout.tsx 通过 generateStaticParams 动态设置
 * @see Requirements 1.2
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // lang 属性将由 Next.js 根据 [locale] 路由参数自动设置
    // suppressHydrationWarning 避免服务端/客户端 hydration 警告
    <html suppressHydrationWarning>
      <body className="bg-black text-white min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
