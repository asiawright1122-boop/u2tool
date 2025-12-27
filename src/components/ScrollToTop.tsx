'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 页面导航时自动滚动到顶部
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 页面路径变化时滚动到顶部
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
