'use client';

import SidebarNavigation from './SidebarNavigation';
import MobileBottomNav from './MobileBottomNav';
import { SIDEBAR_CONFIG } from '@/lib/layout';

/**
 * 全局侧边栏组件
 * 在全局布局中使用，提供统一的侧边栏导航
 * 
 * 响应式行为：
 * - 桌面端 (≥1024px): 展开状态，宽度 220px
 * - 平板端 (768-1023px): 折叠状态，宽度 64px
 * - 移动端 (<768px): 隐藏侧边栏，显示底部导航
 */
export default function GlobalSidebar() {
  return (
    <>
      {/* 左侧导航 - 桌面端显示（展开状态） */}
      <aside 
        className="hidden lg:block fixed left-0 top-0 bottom-0 z-40" 
        style={{ width: SIDEBAR_CONFIG.expandedWidth }}
      >
        <SidebarNavigation
          collapsed={false}
          preventNavigation={false}
        />
      </aside>

      {/* 左侧导航 - 平板端显示（折叠状态） */}
      <aside 
        className="hidden md:block lg:hidden fixed left-0 top-0 bottom-0 z-40" 
        style={{ width: SIDEBAR_CONFIG.collapsedWidth }}
      >
        <SidebarNavigation
          collapsed={true}
          preventNavigation={false}
        />
      </aside>

      {/* 移动端底部导航 */}
      <MobileBottomNav />
    </>
  );
}
