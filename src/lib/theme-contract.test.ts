import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildThemeInitScript,
  resolveThemePreference,
  THEME_STORAGE_KEY,
} from './theme-contract';

const mockLocalStorage: Record<string, string> = {};
let systemPrefersDark = false;
const mockClassList = {
  toggle: vi.fn(),
};
const mockStyle = {
  colorScheme: '',
};

vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
});

vi.stubGlobal('window', {
  matchMedia: vi.fn(() => ({
    matches: systemPrefersDark,
  })),
});

vi.stubGlobal('document', {
  documentElement: {
    classList: mockClassList,
    style: mockStyle,
  },
});

describe('theme contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
    systemPrefersDark = false;
    mockStyle.colorScheme = '';
  });

  it('resolves the saved-theme matrix deterministically', () => {
    expect(resolveThemePreference('dark', false)).toBe('dark');
    expect(resolveThemePreference('light', true)).toBe('light');
    expect(resolveThemePreference('system', true)).toBe('dark');
    expect(resolveThemePreference('system', false)).toBe('light');
    expect(resolveThemePreference(null, true)).toBe('dark');
    expect(resolveThemePreference(null, false)).toBe('light');
  });

  it('builds an inline init script that applies the shared contract', () => {
    const script = buildThemeInitScript();
    mockLocalStorage[THEME_STORAGE_KEY] = 'system';
    systemPrefersDark = true;

    new Function(script)();

    expect(localStorage.getItem).toHaveBeenCalledWith(THEME_STORAGE_KEY);
    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', true);
    expect(mockStyle.colorScheme).toBe('dark');
  });

  it('falls back to light mode in the init script when no preference is saved', () => {
    const script = buildThemeInitScript();
    systemPrefersDark = false;

    new Function(script)();

    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', false);
    expect(mockStyle.colorScheme).toBe('light');
  });
});
