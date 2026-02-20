import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock browser APIs before importing the module
const mockLocalStorage: Record<string, string> = {};
const mockClassList = {
  toggle: vi.fn(),
};

vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
  setItem: vi.fn((key: string, value: string) => {
    mockLocalStorage[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockLocalStorage[key];
  }),
});

vi.stubGlobal('document', {
  documentElement: {
    classList: mockClassList,
  },
});

vi.stubGlobal('window', {
  matchMedia: vi.fn(() => ({ matches: false })),
});

// Import after mocks are set up
import { theme } from './theme';
import type { Theme } from './theme';

describe('theme store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear mock localStorage
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
  });

  it('should have a subscribe method', () => {
    expect(typeof theme.subscribe).toBe('function');
  });

  it('should have toggle and init methods', () => {
    expect(typeof theme.toggle).toBe('function');
    expect(typeof theme.init).toBe('function');
  });

  it('should initialize with system theme when no saved preference', () => {
    theme.init();
    let currentTheme: Theme = 'light';
    const unsubscribe = theme.subscribe((value) => {
      currentTheme = value;
    });
    expect(currentTheme).toBe('system');
    unsubscribe();
  });

  it('should initialize with saved theme from localStorage', () => {
    mockLocalStorage['theme'] = 'dark';
    theme.init();
    let currentTheme: Theme = 'light';
    const unsubscribe = theme.subscribe((value) => {
      currentTheme = value;
    });
    expect(currentTheme).toBe('dark');
    unsubscribe();
  });

  it('should toggle between light and dark', () => {
    // Start from dark
    mockLocalStorage['theme'] = 'dark';
    theme.init();

    // Toggle should switch to light
    theme.toggle();
    let currentTheme: Theme = 'system';
    const unsubscribe = theme.subscribe((value) => {
      currentTheme = value;
    });
    expect(currentTheme).toBe('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    unsubscribe();
  });

  it('should apply dark class via document.documentElement.classList.toggle', () => {
    mockLocalStorage['theme'] = 'dark';
    theme.init();
    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', true);
  });
});
