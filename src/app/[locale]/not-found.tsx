import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

/**
 * 404 页面组件
 * 提供友好的错误提示和导航选项
 * SEO 优化：包含返回首页和工具列表的链接
 */
export default function NotFound() {
  const t = useTranslations();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 图标 */}
        <div className="text-8xl mb-6">🔍</div>
        
        {/* 错误标题 */}
        <h1 className="text-4xl font-bold mb-4 text-white">
          {t('errors.notFound.title')}
        </h1>
        
        {/* 错误描述 */}
        <p className="text-gray-400 mb-8 text-lg">
          {t('errors.notFound.description')}
        </p>
        
        {/* 导航链接 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            {t('errors.notFound.backHome')}
          </Link>
          <Link
            href="/tools"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
          >
            {t('errors.notFound.browseTools')}
          </Link>
        </div>
      </div>
    </div>
  );
}
