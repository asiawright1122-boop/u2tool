/**
 * Chart Theme Utility
 * 
 * Provides chart-specific color themes for ECharts components.
 * Detects dark/light mode from the document's .dark class.
 * 
 * Equivalent to the React useChartTheme hook, but as a plain function
 * that can be called reactively in Svelte components.
 */

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

/**
 * Get chart theme colors based on current dark/light mode.
 * Reads the .dark class from the document element.
 */
export function getChartTheme(): ChartThemeColors {
  return isDarkThemeActive() ? darkTheme : lightTheme;
}

export function isDarkThemeActive(): boolean {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.documentElement.classList.contains('dark');
}

export { darkTheme, lightTheme };
