import { Metadata } from 'next';
import { Link } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { loadBaseMessages, type SupportedLocale } from '@/lib/translations';

/**
 * 404 页面元数据
 * 设置 noindex 防止搜索引擎索引404页面
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true, // 允许跟随链接，但不索引当前页面
  },
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
};

/**
 * 404 页面组件
 * 提供友好的错误提示和导航选项
 * SEO 优化：包含返回首页和工具列表的链接
 * 
 * 注意：由于 i18n/request.ts 返回空 messages（为了优化 Edge Function 大小），
 * 我们需要在这里直接加载翻译
 */
export default async function NotFound() {
  // 获取当前 locale
  const locale = await getLocale();
  
  // 直接加载翻译（因为 i18n/request.ts 返回空 messages）
  const messages = await loadBaseMessages(locale as SupportedLocale);
  const errors = messages.errors as Record<string, Record<string, string>> | undefined;
  const notFound = errors?.notFound || {};
  
  // 获取翻译文本，提供默认值
  const title = notFound.title || 'Page Not Found';
  const description = notFound.description || 'Sorry, the page you are looking for does not exist or has been moved.';
  const backHome = notFound.backHome || 'Back to Home';
  const browseTools = notFound.browseTools || 'Browse Tools';
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 图标 */}
        <div className="text-8xl mb-6">🔍</div>
        
        {/* 错误标题 */}
        <h1 className="text-4xl font-bold mb-4 text-white">
          {title}
        </h1>
        
        {/* 错误描述 */}
        <p className="text-gray-400 mb-8 text-lg">
          {description}
        </p>
        
        {/* 导航链接 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            {backHome}
          </Link>
          <Link
            href="/tools"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            {browseTools}
          </Link>
        </div>
      </div>
    </div>
  );
}
