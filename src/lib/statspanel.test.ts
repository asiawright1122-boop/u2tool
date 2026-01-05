import { describe, it, expect } from 'vitest';
import { getToolCount } from '@/components/StatsPanel';

describe('StatsPanel - Tool Count', () => {
  /**
   * Property 10: 统计面板工具数量准确性
   * Feature: sidebar-category-navigation, Property 10
   * Validates: Requirements 5.1
   */
  it('should return a positive tool count', () => {
    const count = getToolCount();
    expect(count).toBeGreaterThan(0);
  });

  it('should return a number', () => {
    const count = getToolCount();
    expect(typeof count).toBe('number');
  });

  it('should return at least 200 tools', () => {
    const count = getToolCount();
    expect(count).toBeGreaterThanOrEqual(200);
  });
});
