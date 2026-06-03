import { describe, it, expect, beforeEach } from 'vitest';

// Mock Svelte 5 Runes for test environment
if (typeof (globalThis as any).$state === 'undefined') {
  (globalThis as any).$state = (val: any) => val;
  (globalThis as any).$derived = (val: any) => val;
  (globalThis as any).$derived.by = (fn: any) => fn();
  (globalThis as any).$effect = (fn: any) => {};
}

import { WorldCupCalcState } from './world-cup-calc-state.svelte';

describe('WorldCupCalcState', () => {
  let state: WorldCupCalcState;

  beforeEach(() => {
    state = new WorldCupCalcState();
  });

  it('should initialize matches from schedule data', () => {
    expect(state.matches.length).toBeGreaterThan(0);
    const groupMatches = state.matches.filter(m => m.stage === 'group');
    expect(groupMatches.length).toBe(72); // 12 groups * 6 matches = 72
  });

  it('should update score correctly and compute standings', () => {
    // Let's check Group A first match M1 (USA vs SUI)
    // Initially, scores are null
    const m1 = state.matches.find(m => m.id === 'M1')!;
    expect(m1.homeScore).toBeNull();
    expect(m1.awayScore).toBeNull();

    // Update score
    state.updateScore('M1', 2, 1);
    expect(m1.homeScore).toBe(2);
    expect(m1.awayScore).toBe(1);

    // Check Group A standings
    const standingsA = state.groupStandings['A'];
    expect(standingsA).toBeDefined();
    // USA should have 3 points now, SUI should have 0
    const usa = standingsA.find(t => t.id === 'USA')!;
    expect(usa.points).toBe(3);
  });

  it('should swap standings for completely tied teams in a group', () => {
    // Initial state: no scores, USA/SUI are sorted by FIFA rank
    const standingsBefore = [...state.groupStandings['A']];
    expect(standingsBefore[0].id).toBe('USA');
    expect(standingsBefore[1].id).toBe('SUI');

    // Swap index 0 and 1
    state.swapStandings('A', 0, 1);
    const standingsAfter = state.groupStandings['A'];
    expect(standingsAfter[0].id).toBe('SUI');
    expect(standingsAfter[1].id).toBe('USA');
  });

  it('should swap third-place rankings', () => {
    // Initially third places are computed
    const rankingsBefore = [...state.thirdPlaceRankings];
    const topTeam = rankingsBefore[0].id;
    const secondTeam = rankingsBefore[1].id;

    // Swap 0 and 1
    state.swapThirdPlace(0, 1);
    const rankingsAfter = state.thirdPlaceRankings;
    expect(rankingsAfter[0].id).toBe(secondTeam);
    expect(rankingsAfter[1].id).toBe(topTeam);
  });

  it('should cascade reset predicted winners when knockout matchups change', () => {
    // Setup predicting winner for M73 (Winner A vs Runner-up B)
    // By default Winner A = USA, Runner-up B = COL (calculated via rankings)
    const m73 = state.knockoutBracket.matchesMap['M73'];
    expect(m73.homeTeam).toBe('USA');
    expect(m73.awayTeam).toBe('POL');

    // Predict winner as USA
    state.predictWinner('M73', 'USA');
    expect(state.knockoutBracket.matchesMap['M73'].winner).toBe('USA');

    // M89 (R16) uses Winner M73 vs Winner M74
    // Since Winner M73 is USA, homeTeam of M89 should be USA
    expect(state.knockoutBracket.matchesMap['M89'].homeTeam).toBe('USA');

    // Predict winner of M89 as USA
    state.predictWinner('M89', 'USA');
    expect(state.knockoutBracket.matchesMap['M89'].winner).toBe('USA');

    // Now, change the group stage standings of Group A so USA is no longer 1st (Winner A)
    // We can swap USA (1st) with SUI (2nd) in Group A
    state.swapStandings('A', 0, 1); // SUI is now 1st, USA is 2nd

    // The new matchup for M73 should have homeTeam as SUI
    const m73New = state.knockoutBracket.matchesMap['M73'];
    expect(m73New.homeTeam).toBe('SUI');

    // Since the previous prediction for M73 was 'USA', but USA is no longer playing in M73 (it's SUI vs COL),
    // the prediction for M73 must be reset to null!
    expect(state.knockoutBracket.matchesMap['M73'].winner).toBeNull();

    // Consequently, M89 homeTeam becomes empty, and its predicted winner is also reset!
    expect(state.knockoutBracket.matchesMap['M89'].homeTeam).toBe('');
    expect(state.knockoutBracket.matchesMap['M89'].winner).toBeNull();
  });
});
