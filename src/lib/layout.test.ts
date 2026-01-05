/**
 * 响应式布局工具函数测试
 * @see Design Property 3: 响应式布局断点正确性
 * @see Requirements 4.1, 4.2, 4.3
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import {
  getLayoutMode,
  shouldShowSidebar,
  shouldCollapseSidebar,
  shouldShowMobileNav,
  getSidebarWidth,
  BREAKPOINTS,
  SIDEBAR_CONFIG,
  type LayoutMode,
} from './layout';

describe('getLayoutMode', () => {
  /**
   * Property 3: 响应式布局断点正确性
   * For any viewport width value, the layout mode calculation function SHALL return
   * the correct mode: 'desktop' for width ≥ 1024px, 'tablet' for 768px ≤ width < 1024px,
   * and 'mobile' for width < 768px.
   * 
   * Feature: sidebar-category-navigation, Property 3: 响应式布局断点正确性
   * Validates: Requirements 4.1, 4.2, 4.3
   */
  it('should return correct layout mode for any viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5000 }),
        (width) => {
          const mode = getLayoutMode(width);
          
          if (width >= BREAKPOINTS.desktop) {
            expect(mode).toBe('desktop');
          } else if (width >= BREAKPOINTS.tablet) {
            expect(mode).toBe('tablet');
          } else {
            expect(mode).toBe('mobile');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // 边界值测试
  it('should return mobile for width 0', () => {
    expect(getLayoutMode(0)).toBe('mobile');
  });

  it('should return mobile for width 767', () => {
    expect(getLayoutMode(767)).toBe('mobile');
  });

  it('should return tablet for width 768', () => {
    expect(getLayoutMode(768)).toBe('tablet');
  });

  it('should return tablet for width 1023', () => {
    expect(getLayoutMode(1023)).toBe('tablet');
  });

  it('should return desktop for width 1024', () => {
    expect(getLayoutMode(1024)).toBe('desktop');
  });

  it('should return desktop for width 1920', () => {
    expect(getLayoutMode(1920)).toBe('desktop');
  });
});

describe('shouldShowSidebar', () => {
  it('should return true for desktop mode', () => {
    expect(shouldShowSidebar('desktop')).toBe(true);
  });

  it('should return true for tablet mode', () => {
    expect(shouldShowSidebar('tablet')).toBe(true);
  });

  it('should return false for mobile mode', () => {
    expect(shouldShowSidebar('mobile')).toBe(false);
  });
});

describe('shouldCollapseSidebar', () => {
  it('should return false for desktop mode', () => {
    expect(shouldCollapseSidebar('desktop')).toBe(false);
  });

  it('should return true for tablet mode', () => {
    expect(shouldCollapseSidebar('tablet')).toBe(true);
  });

  it('should return false for mobile mode', () => {
    expect(shouldCollapseSidebar('mobile')).toBe(false);
  });
});

describe('shouldShowMobileNav', () => {
  it('should return false for desktop mode', () => {
    expect(shouldShowMobileNav('desktop')).toBe(false);
  });

  it('should return false for tablet mode', () => {
    expect(shouldShowMobileNav('tablet')).toBe(false);
  });

  it('should return true for mobile mode', () => {
    expect(shouldShowMobileNav('mobile')).toBe(true);
  });
});

describe('getSidebarWidth', () => {
  it('should return expanded width for desktop mode', () => {
    expect(getSidebarWidth('desktop')).toBe(SIDEBAR_CONFIG.expandedWidth);
  });

  it('should return collapsed width for tablet mode', () => {
    expect(getSidebarWidth('tablet')).toBe(SIDEBAR_CONFIG.collapsedWidth);
  });

  it('should return 0 for mobile mode', () => {
    expect(getSidebarWidth('mobile')).toBe(0);
  });

  /**
   * Property: 侧边栏宽度与布局模式一致性
   * For any layout mode, the sidebar width should be consistent with the mode.
   */
  it('should return consistent sidebar width for any layout mode', () => {
    const modes: LayoutMode[] = ['desktop', 'tablet', 'mobile'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...modes),
        (mode) => {
          const width = getSidebarWidth(mode);
          
          if (mode === 'desktop') {
            expect(width).toBe(SIDEBAR_CONFIG.expandedWidth);
          } else if (mode === 'tablet') {
            expect(width).toBe(SIDEBAR_CONFIG.collapsedWidth);
          } else {
            expect(width).toBe(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
