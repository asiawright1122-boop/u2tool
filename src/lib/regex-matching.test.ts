import { describe, expect, it } from 'vitest';
import { collectRegexMatches } from './regex-matching';

describe('collectRegexMatches', () => {
  it('advances past zero-length global matches', () => {
    const result = collectRegexMatches(/^/gm, 'one\ntwo');

    expect(result.limited).toBe(false);
    expect(result.matches.map((match) => match.index)).toEqual([0, 4]);
  });

  it('preserves single-match behavior for non-global regexes', () => {
    const result = collectRegexMatches(/\w+/, 'one two');

    expect(result.matches).toEqual([
      { match: 'one', index: 0, captures: [], groups: undefined },
    ]);
  });

  it('caps pathological match counts', () => {
    const result = collectRegexMatches(/(?=a)/g, 'aaaaa', 3);

    expect(result.limited).toBe(true);
    expect(result.matches).toHaveLength(3);
    expect(result.matches.map((match) => match.index)).toEqual([0, 1, 2]);
  });
});
