'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';

// 太阳图标 (Light Mode)
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

// 月亮图标 (Dark Mode)
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

// 电脑图标 (System Mode)
const ComputerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

interface ThemeOption {
  value: 'light' | 'dark' | 'system';
  labelKey: string;
  icon: React.ReactNode;
}

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  // 防止 hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themeOptions: ThemeOption[] = [
    { value: 'light', labelKey: 'theme.light', icon: <SunIcon /> },
    { value: 'dark', labelKey: 'theme.dark', icon: <MoonIcon /> },
    { value: 'system', labelKey: 'theme.system', icon: <ComputerIcon /> },
  ];

  const getCurrentIcon = () => {
    if (!mounted) return <SunIcon />; // 默认图标，避免 hydration 问题
    if (theme === 'system') return <ComputerIcon />;
    return resolvedTheme === 'dark' ? <MoonIcon /> : <SunIcon />;
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, themeValue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleThemeChange(themeValue);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        aria-label={t('theme.toggle')}
        aria-expanded={dropdownOpen}
        aria-haspopup="listbox"
      >
        {getCurrentIcon()}
      </button>

      {dropdownOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
          role="listbox"
          aria-label={t('theme.toggle')}
        >
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeChange(option.value)}
              onKeyDown={(e) => handleKeyDown(e, option.value)}
              role="option"
              aria-selected={theme === option.value}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                theme === option.value
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {option.icon}
              <span>{t(option.labelKey)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
