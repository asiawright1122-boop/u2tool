import { describe, expect, it } from 'vitest';
import {
  fillMissingKeysInRoot,
  flatten,
  getMissingKeys,
} from '../../scripts/maintenance/fill-missing-translation-keys';

describe('fill-missing-translation-keys', () => {
  it('detects keys missing from a locale payload', () => {
    const reference = flatten({
      tools: {
        demo: {
          name: 'Demo',
          faqs: [
            { question: 'Q1', answer: 'A1' },
            { question: 'Q2', answer: 'A2' },
          ],
        },
      },
    });
    const locale = flatten({
      tools: {
        demo: {
          name: '演示',
          faqs: [{ question: 'Q1', answer: 'A1' }],
        },
      },
    });

    expect(getMissingKeys(reference, locale)).toEqual([
      'tools.demo.faqs[1].question',
      'tools.demo.faqs[1].answer',
    ]);
  });

  it('fills missing nested object and array keys into the root locale file', () => {
    const root = {
      tools: {
        demo: {
          name: '演示',
        },
      },
    };
    const reference = flatten({
      tools: {
        demo: {
          name: 'Demo',
          info: 'Info',
          faqs: [
            { question: 'Q1', answer: 'A1' },
            { question: 'Q2', answer: 'A2' },
          ],
        },
      },
    });
    const locale = flatten(root);

    const missingKeys = fillMissingKeysInRoot(root, reference, locale);

    expect(missingKeys).toEqual([
      'tools.demo.info',
      'tools.demo.faqs[0].question',
      'tools.demo.faqs[0].answer',
      'tools.demo.faqs[1].question',
      'tools.demo.faqs[1].answer',
    ]);
    expect(root).toEqual({
      tools: {
        demo: {
          name: '演示',
          info: 'Info',
          faqs: [
            { question: 'Q1', answer: 'A1' },
            { question: 'Q2', answer: 'A2' },
          ],
        },
      },
    });
  });
});
