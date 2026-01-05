'use client';

import { ReactNode } from 'react';

/**
 * 首页布局组件属性
 */
export interface HomePageLayoutProps {
  /** 主内容区域 */
  children: ReactNode;
  /** 右侧边栏内容 */
  rightSidebar?: ReactNode;
  /** 当前活动的分类 */
  activeCategory?: string;
  /** 分类选择回调 */
  onCategorySelect?: (categoryId: string) => void;
  /** 首页点击回调（用于清除分类筛选） */
  onHomeClick?: () => void;
  /** 是否阻止分类导航跳转 */
  preventNavigation?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 首页布局容器组件
 * 注意：侧边栏已移到全局布局中，此组件仅处理首页特定的布局需求
 * 
 * @see Requirements 2.1, 4.1, 4.2, 4.3, 4.4, 4.5
 */
export default function HomePageLayout({
  children,
  rightSidebar,
  className = '',
}: HomePageLayoutProps) {
  return (
    <div className={className}>
      {/* 主内容区域 */}
      <div className={rightSidebar ? 'xl:mr-[280px]' : ''}>
        {children}
      </div>

      {/* 右侧边栏 - 桌面端显示 */}
      {rightSidebar && (
        <aside className="hidden xl:block fixed right-0 top-16 bottom-0 w-[280px] z-30 overflow-y-auto border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="p-4">
            {rightSidebar}
          </div>
        </aside>
      )}
    </div>
  );
}
