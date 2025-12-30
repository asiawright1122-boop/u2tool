'use client';

// 使用 i18n routing 的 Link 和 useRouter，确保语言切换时保持当前语言
import { Link, useRouter, usePathname as useI18nPathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { locales, localeNames, type Locale } from '@/i18n/routing';
import { categories, tools } from '@/config/tools';
import ThemeToggle from '@/components/ThemeToggle';

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const i18nPathname = useI18nPathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof tools>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 从URL路径中提取当前语言
  const currentLocale = (locales.find((l) => pathname.startsWith(`/${l}`)) || 'en') as Locale;

  // 语言切换处理函数
  const handleLocaleChange = (newLocale: Locale) => {
    // 使用 i18n router 切换语言，会自动保持当前路径
    router.replace(i18nPathname, { locale: newLocale });
  };

  // Real search functionality - searches tool names and descriptions
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const results = tools.filter(tool => {
        // Get translated name and description
        const toolName = t(`tools.${tool.slug}.name`).toLowerCase();
        const toolDesc = t(`tools.${tool.slug}.description`).toLowerCase();
        const categoryName = t(`categories.${tool.category}`).toLowerCase();

        // Match against name, description, category, or slug
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
  }, [searchQuery, t]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSelect = (slug: string) => {
    // 使用 i18n routing 的 router，自动保持当前语言
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
    <header className="fixed top-0 w-full bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - 使用相对路径，i18n Link 会自动添加 locale */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🧰</span>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {t('site.name')}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            {t('nav.home')}
          </Link>

          {/* Tools Dropdown - Only Categories */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className="flex items-center gap-1 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
              {t('nav.tools')}
              <svg className={`w-4 h-4 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {toolsDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl py-2">
                {categories.map((cat) => {
                  const toolCount = tools.filter(tool => tool.category === cat.id).length;
                  return (
                    <Link
                      key={cat.id}
                      href={`/tools?category=${cat.id}`}
                      className="flex items-center justify-between px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => setToolsDropdownOpen(false)}
                    >
                      <span>{t(`categories.${cat.id}`)}</span>
                      <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                        {toolCount}
                      </span>
                    </Link>
                  );
                })}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                  <Link
                    href="/tools"
                    className="flex items-center justify-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    onClick={() => setToolsDropdownOpen(false)}
                  >
                    {t('nav.viewAllTools')} →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Blog Link - 放在工具下拉菜单后面 */}
          <Link
            href="/blog"
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            {t('nav.blog')}
          </Link>
        </nav>

        {/* Right Side: Search + Theme + Language */}
        <div className="flex items-center gap-3">
          {/* Search Box */}
          <div className="relative" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                onFocus={() => searchQuery && setShowSearchResults(true)}
                placeholder={t('nav.searchPlaceholder')}
                className="w-40 sm:w-48 lg:w-56 px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
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
                    {t('nav.noResults') || 'No tools found'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Language Switcher - 使用按钮触发语言切换 */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              href="/tools"
              className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.tools')}
            </Link>
            <Link
              href="/blog"
              className="block px-4 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.blog')}
            </Link>

            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <p className="px-4 py-2 text-xs text-gray-500 uppercase">{t('home.categories')}</p>
              {categories.map((cat) => {
                const toolCount = tools.filter(tool => tool.category === cat.id).length;
                return (
                  <Link
                    key={cat.id}
                    href={`/tools?category=${cat.id}`}
                    className="flex items-center justify-between px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      {t(`categories.${cat.id}`)}
                    </span>
                    <span className="text-xs text-gray-500">{toolCount}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
