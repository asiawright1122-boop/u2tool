'use client';

import { useTranslations } from 'next-intl';
import { tools } from '@/config/tools';

/**
 * 统计项组件属性
 */
interface StatItemProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  className?: string;
}

/**
 * 统计项组件
 */
function StatItem({ icon, value, label, className = '' }: StatItemProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      </div>
    </div>
  );
}

/**
 * 统计面板组件属性
 */
export interface StatsPanelProps {
  /** 工具数量（可选，默认从配置获取） */
  toolCount?: number;
  /** 访问量（可选） */
  visitorCount?: number;
  /** 自定义类名 */
  className?: string;
}

/**
 * 统计面板组件
 * 显示工具数量和访问统计
 * 
 * @see Requirements 5.1, 5.2, 5.4
 */
export default function StatsPanel({
  toolCount,
  visitorCount = 0,
  className = '',
}: StatsPanelProps) {
  const t = useTranslations('home');
  
  // 使用传入的工具数量或从配置获取
  const actualToolCount = toolCount ?? tools.length;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      <div className="grid grid-cols-2 gap-4">
        {/* 工具数量 */}
        <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-500 dark:text-blue-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {actualToolCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('stats.tools')}</div>
        </div>

        {/* 访问量 */}
        <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
          <div className="w-8 h-8 mx-auto mb-2 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-500 dark:text-green-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-white">
            {visitorCount > 0 ? visitorCount.toLocaleString() : '-'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('stats.visitors')}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 获取工具总数
 * 用于测试和其他需要获取工具数量的场景
 */
export function getToolCount(): number {
  return tools.length;
}
