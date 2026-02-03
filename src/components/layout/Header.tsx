'use client';

import { useRouter, usePathname as useI18nPathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { locales, localeNames, type Locale } from '@/i18n/routing';
import { tools } from '@/config/tools';
import ThemeToggle from '@/components/ThemeToggle';
import { useDebounce } from '@/hooks/useDebounce';

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const i18nPathname = useI18nPathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof tools>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 从URL路径中提取当前语言
  const currentLocale = (locales.find((l) => pathname.startsWith(`/${l}`)) || 'en') as Locale;

  // 语言切换处理函数
  const handleLocaleChange = (newLocale: Locale) => {
    router.replace(i18nPathname, { locale: newLocale });
  };

  // 搜索功能
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery.trim().length > 0) {
      const query = debouncedSearchQuery.toLowerCase();
      const results = tools.filter(tool => {
        const toolName = t(`tools.${tool.slug}.name`).toLowerCase();
        const toolDesc = t(`tools.${tool.slug}.description`).toLowerCase();
        const categoryName = t(`categories.${tool.category}`).toLowerCase();
        return toolName.includes(query) ||
          toolDesc.includes(query) ||
          categoryName.includes(query) ||
          tool.slug.toLowerCase().includes(query);
      });
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery]);

  // 点击外部关闭搜索结果
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (slug: string) => {
    router.push(`/tools/${slug}`);
    setSearchQuery('');
    setShowSearchResults(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handleSearchSelect(searchResults[0].slug);
    }
    if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  return (
    <header
      className="fixed top-0 right-0 left-0 md:left-[64px] lg:left-[220px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md z-40 h-16 border-b border-gray-200 dark:border-gray-800"
    >
      <div className="h-full px-4 flex items-center justify-center">
        {/* 搜索框 - 居中显示 */}
        <div className="relative w-full max-w-md" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              placeholder={t('nav.searchPlaceholder')}
              aria-label={t('nav.searchPlaceholder')}
              className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label={t('common.clear') || 'Clear search'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* ... (search results results) ... */}
          {/* 搜索结果下拉 - preserved implicitly by not changing lines outside the chunk, wait, I need to match the target content carefully or use broader context */}
          {/* I will break this into chunks to be safe */}


          {/* 搜索结果下拉 */}
          {showSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
              {searchResults.length > 0 ? (
                <>
                  {searchResults.slice(0, 6).map((tool) => (
                    <button
                      key={tool.slug}
                      onClick={() => handleSearchSelect(tool.slug)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors"
                    >
                      <span className="text-xl">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {t(`tools.${tool.slug}.name`)}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {t(`categories.${tool.category}`)}
                        </div>
                      </div>
                    </button>
                  ))}
                  {searchResults.length > 6 && (
                    <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-200 dark:border-gray-700">
                      +{searchResults.length - 6} more results
                    </div>
                  )}
                </>
              ) : (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  {t('nav.noResults')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 右侧：主题切换 + 语言切换 - 绝对定位 */}
        <div className="absolute right-4 flex items-center gap-3">
          <ThemeToggle />

          {/* 语言切换 */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
              aria-label={`Current language: ${localeNames[currentLocale]}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg ${locale === currentLocale ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700/50' : 'text-gray-700 dark:text-gray-300'
                    }`}
                >
                  {localeNames[locale]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
