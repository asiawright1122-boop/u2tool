import { describe, expect, it } from 'vitest';
import { WORLD_CUP_2026_GROUPS, advanceBracket, buildDefaultBracket } from './world-cup-2026-bracket';

describe('world cup 2026 bracket helper', () => {
  it('defines twelve groups for a 48-team tournament', () => {
    expect(WORLD_CUP_2026_GROUPS).toHaveLength(12);
    expect(WORLD_CUP_2026_GROUPS.every((group) => group.teams.length === 4)).toBe(true);
  });

  it('builds a default knockout bracket with thirty-two entrants', () => {
    const state = buildDefaultBracket();
    expect(state.rounds[0].name).toBe('Round of 32');
    expect(state.rounds[0].matches).toHaveLength(16);
  });

  it('advances explicit winners through the final', () => {
    const state = buildDefaultBracket();
    const picks = Object.fromEntries(
      state.rounds.flatMap((round) => round.matches.map((match) => [match.id, match.home]))
    );
    const result = advanceBracket(state, picks);
    expect(result.champion).toBe(state.rounds[0].matches[0].home);
    expect(result.rounds.at(-1)?.name).toBe('Final');
    expect(result.summary).toContain('Champion:');
  });

  it('uses localized round and champion labels when provided', () => {
    const state = buildDefaultBracket();
    const result = advanceBracket(state, {}, {
      roundNames: ['32 强', '16 强', '四分之一决赛', '半决赛', '决赛'],
      championLabel: '冠军',
    });

    expect(result.rounds[0].name).toBe('32 强');
    expect(result.rounds.at(-1)?.name).toBe('决赛');
    expect(result.summary).toContain('冠军:');
  });
});
