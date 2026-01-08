import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RateCache, CacheEntry } from './rate-cache';

describe('RateCache', () => {
  let cache: RateCache;

  beforeEach(() => {
    cache = new RateCache(60); // 60 minutes TTL
  });

  describe('set and get', () => {
    it('should store and retrieve rates', () => {
      const rates = { EUR: 0.92, GBP: 0.79 };
      cache.set('USD', rates);

      const entry = cache.get('USD');
      expect(entry).not.toBeNull();
      expect(entry?.rates).toEqual(rates);
      expect(entry?.base).toBe('USD');
    });

    it('should return null for non-existent key', () => {
      const entry = cache.get('EUR');
      expect(entry).toBeNull();
    });

    it('should overwrite existing entry', () => {
      const rates1 = { EUR: 0.92 };
      const rates2 = { EUR: 0.93, GBP: 0.80 };

      cache.set('USD', rates1);
      cache.set('USD', rates2);

      const entry = cache.get('USD');
      expect(entry?.rates).toEqual(rates2);
    });
  });

  describe('TTL and expiration', () => {
    it('should mark fresh entries as valid', () => {
      const rates = { EUR: 0.92 };
      cache.set('USD', rates);

      const entry = cache.get('USD');
      expect(entry).not.toBeNull();
      expect(cache.isValid(entry!)).toBe(true);
    });

    it('should mark expired entries as invalid', () => {
      const cache = new RateCache(0.001); // Very short TTL (0.06 seconds)
      const rates = { EUR: 0.92 };
      
      cache.set('USD', rates);

      // Wait for expiration
      return new Promise((resolve) => {
        setTimeout(() => {
          const entry = cache.get('USD');
          expect(entry).toBeNull(); // Should be removed
          resolve(undefined);
        }, 100);
      });
    });

    it('should remove expired entries on get', () => {
      const cache = new RateCache(0.001);
      const rates = { EUR: 0.92 };
      
      cache.set('USD', rates);
      expect(cache.size()).toBe(1);

      return new Promise((resolve) => {
        setTimeout(() => {
          cache.get('USD'); // This should remove the expired entry
          expect(cache.size()).toBe(0);
          resolve(undefined);
        }, 100);
      });
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set('USD', { EUR: 0.92 });
      cache.set('EUR', { USD: 1.09 });
      cache.set('GBP', { USD: 1.27 });

      expect(cache.size()).toBe(3);

      cache.clear();

      expect(cache.size()).toBe(0);
      expect(cache.get('USD')).toBeNull();
      expect(cache.get('EUR')).toBeNull();
      expect(cache.get('GBP')).toBeNull();
    });
  });

  describe('size and keys', () => {
    it('should return correct size', () => {
      expect(cache.size()).toBe(0);

      cache.set('USD', { EUR: 0.92 });
      expect(cache.size()).toBe(1);

      cache.set('EUR', { USD: 1.09 });
      expect(cache.size()).toBe(2);

      cache.set('USD', { EUR: 0.93 }); // Overwrite
      expect(cache.size()).toBe(2);
    });

    it('should return all keys', () => {
      cache.set('USD', { EUR: 0.92 });
      cache.set('EUR', { USD: 1.09 });
      cache.set('GBP', { USD: 1.27 });

      const keys = cache.keys();
      expect(keys).toHaveLength(3);
      expect(keys).toContain('USD');
      expect(keys).toContain('EUR');
      expect(keys).toContain('GBP');
    });
  });

  describe('timestamp', () => {
    it('should store current timestamp', () => {
      const before = new Date();
      cache.set('USD', { EUR: 0.92 });
      const after = new Date();

      const entry = cache.get('USD');
      expect(entry).not.toBeNull();
      expect(entry!.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(entry!.timestamp.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });
});
