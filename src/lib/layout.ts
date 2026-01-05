/**
 * 响应式布局工具函数
 * @see Requirements 4.1, 4.2, 4.3
 */

/**
 * 布局模式类型
 * - desktop: 桌面端 (≥1024px) - 完整侧边栏
 * - tablet: 平板端 (768-1023px) - 折叠侧边栏（仅图标）
 * - mobile: 移动端 (<768px) - 底部导航
 */
export type LayoutMode = 'desktop' | 'tablet' | 'mobile';

/**
 * 响应式断点配置
 */
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
} as const;

/**
 * 侧边栏尺寸配置
 */
export const SIDEBAR_CONFIG = {
  expandedWidth: 220,
  collapsedWidth: 64,
} as const;

/**
 * 根据视口宽度计算布局模式
 * @param width - 视口宽度（像素）
 * @returns 布局模式
 * 
 * @example
 * getLayoutMode(1200) // 'desktop'
 * getLayoutMode(900)  // 'tablet'
 * getLayoutMode(500)  // 'mobile'
 */
export function getLayoutMode(width: number): LayoutMode {
  if (width >= BREAKPOINTS.desktop) {
    return 'desktop';
  }
  if (width >= BREAKPOINTS.tablet) {
    return 'tablet';
  }
  return 'mobile';
}

/**
 * 判断是否应该显示侧边栏
 * @param mode - 布局模式
 * @returns 是否显示侧边栏
 */
export function shouldShowSidebar(mode: LayoutMode): boolean {
  return mode === 'desktop' || mode === 'tablet';
}

/**
 * 判断侧边栏是否应该折叠
 * @param mode - 布局模式
 * @returns 是否折叠
 */
export function shouldCollapseSidebar(mode: LayoutMode): boolean {
  return mode === 'tablet';
}

/**
 * 判断是否应该显示移动端底部导航
 * @param mode - 布局模式
 * @returns 是否显示底部导航
 */
export function shouldShowMobileNav(mode: LayoutMode): boolean {
  return mode === 'mobile';
}

/**
 * 获取侧边栏宽度
 * @param mode - 布局模式
 * @returns 侧边栏宽度（像素）
 */
export function getSidebarWidth(mode: LayoutMode): number {
  if (mode === 'mobile') {
    return 0;
  }
  if (mode === 'tablet') {
    return SIDEBAR_CONFIG.collapsedWidth;
  }
  return SIDEBAR_CONFIG.expandedWidth;
}
