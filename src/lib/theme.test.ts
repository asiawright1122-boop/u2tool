import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock browser APIs before importing the module
const mockLocalStorage: Record<string, string> = {};
const storageListeners = new Set<(event: StorageEvent) => void>();
const mediaQueryListeners = new Set<(event: MediaQueryListEvent) => void>();
let systemPrefersDark = false;
const mockClassList = {
  toggle: vi.fn(),
};
const mockStyle = {
  colorScheme: '',
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
    style: mockStyle,
  },
});

vi.stubGlobal(
  'CustomEvent',
  class CustomEventMock<T = unknown> {
    type: string;
    detail: T | undefined;

    constructor(type: string, init?: CustomEventInit<T>) {
      this.type = type;
      this.detail = init?.detail;
    }
  }
);

vi.stubGlobal('window', {
  matchMedia: vi.fn(() => ({
    matches: systemPrefersDark,
    addEventListener: vi.fn((event: string, listener: (event: MediaQueryListEvent) => void) => {
      if (event === 'change') {
        mediaQueryListeners.add(listener);
      }
    }),
    removeEventListener: vi.fn((event: string, listener: (event: MediaQueryListEvent) => void) => {
      if (event === 'change') {
        mediaQueryListeners.delete(listener);
      }
    }),
    addListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => {
      mediaQueryListeners.add(listener);
    }),
    removeListener: vi.fn((listener: (event: MediaQueryListEvent) => void) => {
      mediaQueryListeners.delete(listener);
    }),
  })),
  addEventListener: vi.fn((event: string, listener: (event: StorageEvent) => void) => {
    if (event === 'storage') {
      storageListeners.add(listener);
    }
  }),
  removeEventListener: vi.fn((event: string, listener: (event: StorageEvent) => void) => {
    if (event === 'storage') {
      storageListeners.delete(listener);
    }
  }),
  dispatchEvent: vi.fn(),
});

// Import after mocks are set up
import { theme, THEME_CHANGE_EVENT } from './theme';
import type { Theme } from './theme';

describe('theme store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear mock localStorage
    Object.keys(mockLocalStorage).forEach((key) => delete mockLocalStorage[key]);
    systemPrefersDark = false;
    mockStyle.colorScheme = '';
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
    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', false);
    expect(mockStyle.colorScheme).toBe('light');
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
    expect(mockStyle.colorScheme).toBe('dark');
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

  it('should toggle from system dark mode to explicit light mode', () => {
    systemPrefersDark = true;
    theme.init();

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

  it('should react to system theme changes when preference is system', () => {
    theme.init();
    vi.clearAllMocks();

    systemPrefersDark = true;
    mediaQueryListeners.forEach((listener) => listener({ matches: true } as MediaQueryListEvent));

    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', true);
    expect(mockStyle.colorScheme).toBe('dark');
  });

  it('should sync theme changes from other tabs via storage events', () => {
    theme.init();
    vi.clearAllMocks();

    storageListeners.forEach((listener) =>
      listener({ key: 'theme', newValue: 'dark' } as StorageEvent)
    );

    let currentTheme: Theme = 'light';
    const unsubscribe = theme.subscribe((value) => {
      currentTheme = value;
    });

    expect(currentTheme).toBe('dark');
    expect(mockClassList.toggle).toHaveBeenCalledWith('dark', true);
    expect(window.dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: THEME_CHANGE_EVENT })
    );
    unsubscribe();
  });
});
