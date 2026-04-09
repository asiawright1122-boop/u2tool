import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getChartTheme, darkTheme, lightTheme } from '@/lib/chart-theme';
import { useChartTheme } from './useChartTheme';

const darkClassState = {
  enabled: false,
};

vi.stubGlobal('document', {
  documentElement: {
    classList: {
      contains: vi.fn((className: string) => className === 'dark' && darkClassState.enabled),
    },
  },
});

describe('useChartTheme', () => {
  beforeEach(() => {
    darkClassState.enabled = false;
    vi.clearAllMocks();
  });

  it('matches the light chart palette when the root is not dark', () => {
    expect(getChartTheme()).toEqual(lightTheme);
  });

  it('matches the dark chart palette when the root has the dark class', () => {
    darkClassState.enabled = true;
    expect(getChartTheme()).toEqual(darkTheme);
  });

  it('stays live after creation when the root dark class flips', () => {
    const chartTheme = useChartTheme();

    expect(chartTheme.mounted).toBe(true);
    expect(chartTheme.isDark).toBe(false);
    expect(chartTheme.backgroundColor).toBe(lightTheme.backgroundColor);
    expect(chartTheme.textColor).toBe(lightTheme.textColor);

    darkClassState.enabled = true;

    expect(chartTheme.isDark).toBe(true);
    expect(chartTheme.backgroundColor).toBe(darkTheme.backgroundColor);
    expect(chartTheme.textColor).toBe(darkTheme.textColor);
  });
});
