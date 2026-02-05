/**
 * 资源监控属性测试
 * Property 10: Resource Threshold Alerting
 * Property 12: ISR Regeneration Logging
 * 
 * @see Requirements 1.4, 9.1, 20.2, 20.3
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import {
  checkResourceThresholds,
  logISRRegeneration,
  getISREventLog,
  clearEventLog,
  formatBytes,
  RESOURCE_LIMITS,
  ALERT_THRESHOLDS,
  type ResourceUsage,
} from './resource-monitor';

describe('Resource Monitor Properties', () => {
  beforeEach(() => {
    clearEventLog();
  });

  describe('Property 10: Resource Threshold Alerting', () => {
    it('should return warning when usage exceeds 50%', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 51, max: 79 }),
          (percent) => {
            const usage: ResourceUsage = {
              fastOriginTransfer: Math.floor(RESOURCE_LIMITS.fastOriginTransfer * percent / 100),
              fastDataTransfer: 0,
              isrWrites: 0,
              isrReads: 0,
              edgeRequests: 0,
              timestamp: new Date(),
            };
            
            const result = checkResourceThresholds(usage);
            return result.warnings.length > 0 && result.status === 'warning';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return critical when usage exceeds 80%', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 80, max: 100 }),
          (percent) => {
            const usage: ResourceUsage = {
              fastOriginTransfer: Math.floor(RESOURCE_LIMITS.fastOriginTransfer * percent / 100),
              fastDataTransfer: 0,
              isrWrites: 0,
              isrReads: 0,
              edgeRequests: 0,
              timestamp: new Date(),
            };
            
            const result = checkResourceThresholds(usage);
            return result.critical.length > 0 && result.status === 'critical';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return ok when usage is below 50%', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 49 }),
          (percent) => {
            const usage: ResourceUsage = {
              fastOriginTransfer: Math.floor(RESOURCE_LIMITS.fastOriginTransfer * percent / 100),
              fastDataTransfer: Math.floor(RESOURCE_LIMITS.fastDataTransfer * percent / 100),
              isrWrites: Math.floor(RESOURCE_LIMITS.isrWrites * percent / 100),
              isrReads: Math.floor(RESOURCE_LIMITS.isrReads * percent / 100),
              edgeRequests: Math.floor(RESOURCE_LIMITS.edgeRequests * percent / 100),
              timestamp: new Date(),
            };
            
            const result = checkResourceThresholds(usage);
            return result.status === 'ok' && result.warnings.length === 0 && result.critical.length === 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should check all resource types', () => {
      const resourceTypes = [
        'fastOriginTransfer',
        'fastDataTransfer',
        'isrWrites',
        'isrReads',
        'edgeRequests',
      ] as const;
      
      fc.assert(
        fc.property(
          fc.constantFrom(...resourceTypes),
          fc.integer({ min: 51, max: 79 }),
          (resourceType, percent) => {
            const usage: ResourceUsage = {
              fastOriginTransfer: 0,
              fastDataTransfer: 0,
              isrWrites: 0,
              isrReads: 0,
              edgeRequests: 0,
              timestamp: new Date(),
            };
            
            // 设置指定资源类型的使用量
            usage[resourceType] = Math.floor(RESOURCE_LIMITS[resourceType] * percent / 100);
            
            const result = checkResourceThresholds(usage);
            return result.warnings.length > 0;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include percentage in warning message', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 51, max: 79 }),
          (percent) => {
            const usage: ResourceUsage = {
              fastOriginTransfer: Math.floor(RESOURCE_LIMITS.fastOriginTransfer * percent / 100),
              fastDataTransfer: 0,
              isrWrites: 0,
              isrReads: 0,
              edgeRequests: 0,
              timestamp: new Date(),
            };
            
            const result = checkResourceThresholds(usage);
            // 检查警告消息中是否包含百分比
            return result.warnings.some(w => w.includes('%'));
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 12: ISR Regeneration Logging', () => {
    it('should log event with path and timestamp', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          (path) => {
            const pagePath = `/en/tools/${path}`;
            logISRRegeneration(pagePath);
            
            const events = getISREventLog();
            const lastEvent = events[events.length - 1];
            
            return (
              lastEvent.path === pagePath &&
              lastEvent.type === 'isr_regeneration' &&
              typeof lastEvent.timestamp === 'string' &&
              lastEvent.timestamp.length > 0
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include locale when provided', () => {
      const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...locales),
          fc.string({ minLength: 1, maxLength: 50 }),
          (locale, toolSlug) => {
            clearEventLog();
            const pagePath = `/${locale}/tools/${toolSlug}`;
            logISRRegeneration(pagePath, locale);
            
            const events = getISREventLog();
            const lastEvent = events[events.length - 1];
            
            return lastEvent.locale === locale;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include duration when provided', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          fc.integer({ min: 1, max: 10000 }),
          (path, duration) => {
            clearEventLog();
            logISRRegeneration(path, undefined, duration);
            
            const events = getISREventLog();
            const lastEvent = events[events.length - 1];
            
            return lastEvent.duration === duration;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should maintain event order', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 2, maxLength: 10 }),
          (paths) => {
            clearEventLog();
            
            for (const path of paths) {
              logISRRegeneration(`/en/tools/${path}`);
            }
            
            const events = getISREventLog();
            
            // 检查事件顺序
            for (let i = 0; i < paths.length; i++) {
              if (events[i].path !== `/en/tools/${paths[i]}`) {
                return false;
              }
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should generate valid ISO timestamp', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }),
          (path) => {
            clearEventLog();
            logISRRegeneration(path);
            
            const events = getISREventLog();
            const lastEvent = events[events.length - 1];
            
            // 验证 ISO 时间戳格式
            const date = new Date(lastEvent.timestamp);
            return !isNaN(date.getTime());
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Utility Functions', () => {
    it('should format bytes correctly', () => {
      const testCases: [number, string][] = [
        [0, '0 B'],
        [1024, '1 KB'],
        [1024 * 1024, '1 MB'],
        [1024 * 1024 * 1024, '1 GB'],
        [1024 * 1024 * 1024 * 1024, '1 TB'],
      ];
      
      for (const [bytes, expected] of testCases) {
        expect(formatBytes(bytes)).toBe(expected);
      }
    });

    it('should format bytes with decimals', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 1024 * 1024 * 1024 }),
          (bytes) => {
            const formatted = formatBytes(bytes);
            // 应该包含数字和单位
            return /^\d+(\.\d+)?\s+(B|KB|MB|GB|TB)$/.test(formatted);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Threshold Constants', () => {
    it('should have valid resource limits', () => {
      expect(RESOURCE_LIMITS.fastOriginTransfer).toBeGreaterThan(0);
      expect(RESOURCE_LIMITS.fastDataTransfer).toBeGreaterThan(0);
      expect(RESOURCE_LIMITS.isrWrites).toBeGreaterThan(0);
      expect(RESOURCE_LIMITS.isrReads).toBeGreaterThan(0);
      expect(RESOURCE_LIMITS.edgeRequests).toBeGreaterThan(0);
    });

    it('should have valid alert thresholds', () => {
      expect(ALERT_THRESHOLDS.warning).toBeGreaterThan(0);
      expect(ALERT_THRESHOLDS.warning).toBeLessThan(1);
      expect(ALERT_THRESHOLDS.critical).toBeGreaterThan(ALERT_THRESHOLDS.warning);
      expect(ALERT_THRESHOLDS.critical).toBeLessThanOrEqual(1);
    });
  });
});
