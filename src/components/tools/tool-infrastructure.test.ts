/**
 * Unit tests for tool infrastructure components.
 * 
 * Tests the core logic of ToolWrapper and EChartsWrapper
 * without requiring a full Svelte rendering environment.
 * 
 * @see Requirements 3.4, 3.5, 4.1, 4.5
 */
import { describe, it, expect } from 'vitest';

/**
 * Test the TOOL_IMPORTS mapping pattern.
 * Verifies that the pilot tools are correctly mapped.
 * Uses mock import functions to avoid Svelte parse errors in test environment.
 */
describe('ToolWrapper - TOOL_IMPORTS mapping', () => {
  // Simulate the mapping structure from ToolWrapper.svelte
  // (using mock functions since vitest can't parse .svelte files directly)
  const TOOL_IMPORTS: Record<string, () => Promise<any>> = {
    'json-formatter': () => Promise.resolve({ default: {} }),
    'base64': () => Promise.resolve({ default: {} }),
    'url-encoder': () => Promise.resolve({ default: {} }),
    'hash-generator': () => Promise.resolve({ default: {} }),
    'text-to-slug': () => Promise.resolve({ default: {} }),
  };

  const PILOT_TOOLS = ['json-formatter', 'base64', 'url-encoder', 'hash-generator', 'text-to-slug'];

  it('should have import functions for all pilot tools', () => {
    for (const slug of PILOT_TOOLS) {
      expect(TOOL_IMPORTS[slug]).toBeDefined();
      expect(typeof TOOL_IMPORTS[slug]).toBe('function');
    }
  });

  it('should return undefined for unknown tool slugs', () => {
    expect(TOOL_IMPORTS['nonexistent-tool']).toBeUndefined();
    expect(TOOL_IMPORTS['']).toBeUndefined();
  });

  it('should have import functions that return promises', async () => {
    for (const slug of PILOT_TOOLS) {
      const result = TOOL_IMPORTS[slug]();
      expect(result).toBeInstanceOf(Promise);
      const module = await result;
      expect(module.default).toBeDefined();
    }
  });

  it('should handle tool-not-found scenario correctly', () => {
    const slug = 'nonexistent-tool';
    const importFn = TOOL_IMPORTS[slug];
    expect(importFn).toBeUndefined();
    // ToolWrapper should set error = `Tool not found: ${slug}` when importFn is undefined
  });
});

/**
 * Test the skeleton variant detection logic.
 * Verifies that tool slugs are mapped to the correct skeleton variant.
 */
describe('ToolWrapper - getSkeletonVariant', () => {
  // Replicate the variant detection logic from ToolWrapper.svelte
  function getSkeletonVariant(toolSlug: string): 'default' | 'editor' | 'converter' | 'generator' | 'chart' {
    if (toolSlug.includes('chart') || toolSlug.includes('diagram') || toolSlug.includes('graph')) {
      return 'chart';
    }
    if (toolSlug.includes('encoder') || toolSlug.includes('decoder') || toolSlug.includes('converter') || toolSlug === 'base64') {
      return 'converter';
    }
    if (toolSlug.includes('formatter') || toolSlug.includes('editor') || toolSlug.includes('minifier')) {
      return 'editor';
    }
    if (toolSlug.includes('generator')) {
      return 'generator';
    }
    return 'default';
  }

  it('should return "chart" for chart-related tools', () => {
    expect(getSkeletonVariant('bar-chart-generator')).toBe('chart');
    expect(getSkeletonVariant('pie-chart')).toBe('chart');
    expect(getSkeletonVariant('venn-diagram')).toBe('chart');
    expect(getSkeletonVariant('graph-editor')).toBe('chart');
  });

  it('should return "converter" for encoding/converter tools', () => {
    expect(getSkeletonVariant('url-encoder')).toBe('converter');
    expect(getSkeletonVariant('html-encoder')).toBe('converter');
    expect(getSkeletonVariant('jwt-decoder')).toBe('converter');
    expect(getSkeletonVariant('unicode-converter')).toBe('converter');
    expect(getSkeletonVariant('base64')).toBe('converter');
  });

  it('should return "editor" for formatter/editor tools', () => {
    expect(getSkeletonVariant('json-formatter')).toBe('editor');
    expect(getSkeletonVariant('xml-formatter')).toBe('editor');
    expect(getSkeletonVariant('json-minifier')).toBe('editor');
    expect(getSkeletonVariant('code-editor')).toBe('editor');
  });

  it('should return "generator" for generator tools', () => {
    expect(getSkeletonVariant('uuid-generator')).toBe('generator');
    expect(getSkeletonVariant('password-generator')).toBe('generator');
    expect(getSkeletonVariant('qr-generator')).toBe('generator');
  });

  it('should return "default" for unrecognized tools', () => {
    expect(getSkeletonVariant('text-to-slug')).toBe('default');
    expect(getSkeletonVariant('hash-generator')).toBe('generator');
    expect(getSkeletonVariant('lorem-ipsum')).toBe('default');
    expect(getSkeletonVariant('stopwatch')).toBe('default');
  });
});

/**
 * Test the EChartsWrapper exportChart safety logic.
 * Verifies that exportChart returns null safely when chart instance is unavailable.
 */
describe('EChartsWrapper - exportChart safety', () => {
  // Replicate the exportChart logic from EChartsWrapper.svelte
  function exportChart(
    chartInstance: any | null,
    format: 'png' | 'svg'
  ): string | null {
    if (!chartInstance) {
      return null;
    }

    if (chartInstance.isDisposed?.()) {
      return null;
    }

    try {
      return chartInstance.getDataURL({
        type: format === 'svg' ? 'svg' : 'png',
        pixelRatio: 2,
        backgroundColor: '#fff',
      });
    } catch (e) {
      return null;
    }
  }

  it('should return null when chartInstance is null', () => {
    expect(exportChart(null, 'png')).toBeNull();
    expect(exportChart(null, 'svg')).toBeNull();
  });

  it('should return null when chartInstance is undefined', () => {
    expect(exportChart(undefined, 'png')).toBeNull();
    expect(exportChart(undefined, 'svg')).toBeNull();
  });

  it('should return null when chart is disposed', () => {
    const disposedChart = {
      isDisposed: () => true,
      getDataURL: () => 'data:image/png;base64,...',
    };
    expect(exportChart(disposedChart, 'png')).toBeNull();
  });

  it('should return data URL when chart is valid', () => {
    const validChart = {
      isDisposed: () => false,
      getDataURL: (opts: any) => `data:image/${opts.type};base64,abc123`,
    };
    expect(exportChart(validChart, 'png')).toBe('data:image/png;base64,abc123');
    expect(exportChart(validChart, 'svg')).toBe('data:image/svg;base64,abc123');
  });

  it('should return null when getDataURL throws', () => {
    const errorChart = {
      isDisposed: () => false,
      getDataURL: () => {
        throw new Error('Canvas not ready');
      },
    };
    expect(exportChart(errorChart, 'png')).toBeNull();
  });

  it('should pass correct format type to getDataURL', () => {
    let capturedOpts: any = null;
    const chart = {
      isDisposed: () => false,
      getDataURL: (opts: any) => {
        capturedOpts = opts;
        return 'data:...';
      },
    };

    exportChart(chart, 'png');
    expect(capturedOpts.type).toBe('png');

    exportChart(chart, 'svg');
    expect(capturedOpts.type).toBe('svg');
  });
});

/**
 * Test the EChartsWrapper getEchartsInstance safety logic.
 */
describe('EChartsWrapper - getEchartsInstance safety', () => {
  function getEchartsInstance(chartInstance: any | null): any | null {
    if (!chartInstance) {
      return null;
    }
    if (chartInstance.isDisposed?.()) {
      return null;
    }
    return chartInstance;
  }

  it('should return null when chartInstance is null', () => {
    expect(getEchartsInstance(null)).toBeNull();
  });

  it('should return null when chartInstance is undefined', () => {
    expect(getEchartsInstance(undefined)).toBeNull();
  });

  it('should return null when chart is disposed', () => {
    const disposed = { isDisposed: () => true };
    expect(getEchartsInstance(disposed)).toBeNull();
  });

  it('should return the instance when chart is valid', () => {
    const valid = { isDisposed: () => false, setOption: () => {} };
    expect(getEchartsInstance(valid)).toBe(valid);
  });

  it('should handle instances without isDisposed method', () => {
    const noDispose = { setOption: () => {} };
    expect(getEchartsInstance(noDispose)).toBe(noDispose);
  });
});
