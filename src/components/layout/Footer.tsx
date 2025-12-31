'use client';

import { useTranslations } from 'next-intl';
// 使用 i18n routing 的 Link 组件，确保语言切换时保持当前语言
import { Link } from '@/i18n/routing';
import Logo from '@/components/Logo';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Logo width={24} height={24} />
            <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {t('site.name')}
            </span>
          </Link>
          
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('footer.about')}
            </Link>
            <Link href="/blog" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('footer.blog')}
            </Link>
            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
          
          <p className="text-sm text-gray-500">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
