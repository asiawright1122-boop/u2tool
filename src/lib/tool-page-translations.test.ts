import { describe, expect, it } from 'vitest';

import { buildGenericToolTranslationKeys, buildToolWrapperTranslations } from './tool-page-translations';

describe('tool page translation payloads', () => {
  it('keeps shared tool UI namespaces even when they contain a description label', () => {
    const toolsCommon = {
      copy: 'Copy',
      invoice: {
        invoice: 'INVOICE',
        description: 'Description',
      },
      'json-formatter': {
        name: 'JSON Formatter',
        description: 'Format JSON',
      },
    };

    const genericKeys = buildGenericToolTranslationKeys(toolsCommon, ['json-formatter']);

    expect(genericKeys.copy).toBe('Copy');
    expect(genericKeys.invoice).toEqual({
      invoice: 'INVOICE',
      description: 'Description',
    });
    expect(genericKeys['json-formatter']).toBeUndefined();
  });

  it('adds the current tool messages after generic keys', () => {
    const payload = buildToolWrapperTranslations({
      currentSlug: 'json-formatter',
      currentToolMessages: { name: 'JSON Formatter', description: 'Format JSON' },
      toolSlugs: ['json-formatter'],
      toolsCommon: {
        copy: 'Copy',
        invoice: { description: 'Description' },
        'json-formatter': { name: 'Stale JSON Formatter' },
      },
    });

    expect(payload.tools.copy).toBe('Copy');
    expect(payload.tools.invoice).toEqual({ description: 'Description' });
    expect(payload.tools['json-formatter']).toEqual({
      name: 'JSON Formatter',
      description: 'Format JSON',
    });
  });
});
