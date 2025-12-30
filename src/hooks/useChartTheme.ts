'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export interface ChartThemeColors {
  backgroundColor: string;
  textColor: string;
  axisLineColor: string;
  axisLabelColor: string;
  splitLineColor: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  legendText: string;
  labelColor: string;
}

// 深色主题颜色
const darkTheme: ChartThemeColors = {
  backgroundColor: '#1f2937',
  textColor: '#fff',
  axisLineColor: '#374151',
  axisLabelColor: '#9ca3af',
  splitLineColor: '#374151',
  tooltipBg: 'rgba(31, 41, 55, 0.9)',
  tooltipBorder: '#374151',
  tooltipText: '#e5e7eb',
  legendText: '#e5e7eb',
  labelColor: '#e5e7eb',
};

// 亮色主题颜色
const lightTheme: ChartThemeColors = {
  backgroundColor: '#ffffff',
  textColor: '#1f2937',
  axisLineColor: '#d1d5db',
  axisLabelColor: '#4b5563',
  splitLineColor: '#e5e7eb',
  tooltipBg: 'rgba(255, 255, 255, 0.95)',
  tooltipBorder: '#d1d5db',
  tooltipText: '#1f2937',
  legendText: '#374151',
  labelColor: '#374151',
};

export function useChartTheme(): ChartThemeColors & { isDark: boolean; mounted: boolean } {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';
  const colors = isDark ? darkTheme : lightTheme;

  return {
    ...colors,
    isDark,
    mounted,
  };
}

export { darkTheme, lightTheme };
