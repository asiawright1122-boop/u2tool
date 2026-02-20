import { describe, it, expect } from 'vitest';
import { createTranslator } from './translations';

describe('translations module', () => {
  describe('createTranslator', () => {
    const translations = {
      name: 'JSON Formatter',
      description: 'Format and beautify JSON data',
      seo_title: 'Free JSON Formatter Online',
      nested: {
        key: 'nested value',
        deep: {
          value: 'deep nested value',
        },
      },
      usage_steps: ['Step 1', 'Step 2', 'Step 3'],
    };

    const t = createTranslator(translations);

    it('should resolve top-level keys', () => {
      expect(t('name')).toBe('JSON Formatter');
      expect(t('description')).toBe('Format and beautify JSON data');
    });

    it('should resolve dot-notation nested keys', () => {
      expect(t('nested.key')).toBe('nested value');
      expect(t('nested.deep.value')).toBe('deep nested value');
    });

    it('should return MISSING message for non-existent keys', () => {
      expect(t('nonexistent')).toBe('MISSING: nonexistent');
      expect(t('nested.nonexistent')).toBe('MISSING: nested.nonexistent');
    });

    it('should return fallback for non-existent keys when provided', () => {
      expect(t('nonexistent', 'Default')).toBe('Default');
      expect(t('nested.missing', 'Fallback')).toBe('Fallback');
    });

    it('should return MISSING for array values without fallback', () => {
      expect(t('usage_steps')).toBe('MISSING: usage_steps');
    });

    it('should return fallback for array values when provided', () => {
      expect(t('usage_steps', 'Steps')).toBe('Steps');
    });

    it('should handle empty translations object', () => {
      const emptyT = createTranslator({});
      expect(emptyT('anything')).toBe('MISSING: anything');
      expect(emptyT('anything', 'fallback')).toBe('fallback');
    });
  });
});
