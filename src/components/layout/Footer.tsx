'use client';

import { useTranslations } from 'next-intl';
// 使用 i18n routing 的 Link 组件，确保语言切换时保持当前语言
import { Link } from '@/i18n/routing';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧰</span>
            <span className="font-bold">{t('site.name')}</span>
          </div>
          
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition-colors">
              {t('footer.about')}
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">
              {t('footer.blog')}
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
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
