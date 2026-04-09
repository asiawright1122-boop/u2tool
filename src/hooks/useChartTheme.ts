/**
 * Chart theme colors for ECharts components (Svelte version)
 *
 * Exposes a live view over the current chart theme so existing chart
 * generators can read up-to-date colors without per-component watchers.
 */

import {
  darkTheme,
  lightTheme,
  getChartTheme,
  isDarkThemeActive,
  type ChartThemeColors,
} from '@/lib/chart-theme';

type LiveChartTheme = ChartThemeColors & { isDark: boolean; mounted: boolean };

const LIVE_THEME_KEYS: Array<keyof LiveChartTheme> = [
  'backgroundColor',
  'textColor',
  'axisLineColor',
  'axisLabelColor',
  'splitLineColor',
  'tooltipBg',
  'tooltipBorder',
  'tooltipText',
  'legendText',
  'labelColor',
  'isDark',
  'mounted',
];

/**
 * Get chart theme colors based on current dark/light mode.
 * The returned object is backed by getters so theme reads stay current
 * when callers pass `getChartOption` into EChartsWrapper.
 */
export function useChartTheme(): LiveChartTheme {
  return new Proxy({} as LiveChartTheme, {
    get(_, property: keyof LiveChartTheme) {
      if (property === 'mounted') {
        return typeof document !== 'undefined';
      }

      if (property === 'isDark') {
        return isDarkThemeActive();
      }

      return getChartTheme()[property as keyof ChartThemeColors];
    },
    ownKeys() {
      return LIVE_THEME_KEYS;
    },
    getOwnPropertyDescriptor() {
      return {
        configurable: true,
        enumerable: true,
      };
    },
  });
}

export { darkTheme, lightTheme };
