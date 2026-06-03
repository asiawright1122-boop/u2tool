import { describe, it, expect } from 'vitest';
import {
  computeGroupStandings,
  computeThirdPlaceRankings,
  type Match,
  type TeamStanding
} from './world-cup-calculator-engine';

describe('World Cup Calculator Engine', () => {
  const mockFifaRankings: Record<string, number> = {
    ARG: 1,
    FRA: 2,
    BEL: 3,
    BRA: 4,
    ENG: 5,
    USA: 11,
    MEX: 15,
    SUI: 28,
    CMR: 37,
    IRQ: 40
  };

  describe('computeGroupStandings - Basic Standings Computation', () => {
    it('should correctly calculate points, gd, and gf for a normal group stage scenario', () => {
      const teams = ['USA', 'SUI', 'CMR', 'IRQ'];
      const matches: Match[] = [
        { id: 'M1', stage: 'group', homeTeam: 'USA', awayTeam: 'SUI', homeScore: 2, awayScore: 1 },
        { id: 'M2', stage: 'group', homeTeam: 'CMR', awayTeam: 'IRQ', homeScore: 1, awayScore: 1 },
        { id: 'M3', stage: 'group', homeTeam: 'USA', awayTeam: 'CMR', homeScore: 3, awayScore: 0 },
        { id: 'M4', stage: 'group', homeTeam: 'SUI', awayTeam: 'IRQ', homeScore: 2, awayScore: 0 },
        { id: 'M5', stage: 'group', homeTeam: 'USA', awayTeam: 'IRQ', homeScore: 1, awayScore: 1 },
        { id: 'M6', stage: 'group', homeTeam: 'SUI', awayTeam: 'CMR', homeScore: 1, awayScore: 0 }
      ];

      const standings = computeGroupStandings('A', teams, matches, mockFifaRankings);

      expect(standings).toHaveLength(4);
      
      // USA: 2 wins, 1 draw = 7 pts. GF = 6, GA = 2, GD = +4.
      const usa = standings[0];
      expect(usa.id).toBe('USA');
      expect(usa.points).toBe(7);
      expect(usa.played).toBe(3);
      expect(usa.won).toBe(2);
      expect(usa.drawn).toBe(1);
      expect(usa.lost).toBe(0);
      expect(usa.gf).toBe(6);
      expect(usa.ga).toBe(2);
      expect(usa.gd).toBe(4);

      // SUI: 2 wins, 1 loss = 6 pts. GF = 4, GA = 2, GD = +2.
      const sui = standings[1];
      expect(sui.id).toBe('SUI');
      expect(sui.points).toBe(6);
      expect(sui.gf).toBe(4);
      expect(sui.gd).toBe(2);

      // IRQ: 2 draws, 1 loss = 2 pts. GF = 2, GA = 4, GD = -2.
      const irq = standings[2];
      expect(irq.id).toBe('IRQ');
      expect(irq.points).toBe(2);

      // CMR: 1 draw, 2 losses = 1 pt. GF = 1, GA = 5, GD = -4.
      const cmr = standings[3];
      expect(cmr.id).toBe('CMR');
      expect(cmr.points).toBe(1);
    });
  });

  describe('computeGroupStandings - H2H Tie-Breakers', () => {
    it('should resolve a 2-team tie using Head-to-Head result', () => {
      const teams = ['USA', 'SUI', 'CMR', 'IRQ'];
      // USA and SUI will both end up with 5 points, +1 GD, and 3 GF.
      // USA beat SUI 2-1 in their match.
      const matches: Match[] = [
        { id: 'M1', stage: 'group', homeTeam: 'USA', awayTeam: 'SUI', homeScore: 2, awayScore: 1 },
        { id: 'M2', stage: 'group', homeTeam: 'USA', awayTeam: 'CMR', homeScore: 1, awayScore: 1 },
        { id: 'M3', stage: 'group', homeTeam: 'SUI', awayTeam: 'CMR', homeScore: 1, awayScore: 1 },
        { id: 'M4', stage: 'group', homeTeam: 'USA', awayTeam: 'IRQ', homeScore: 0, awayScore: 0 },
        { id: 'M5', stage: 'group', homeTeam: 'SUI', awayTeam: 'IRQ', homeScore: 1, awayScore: 0 },
        { id: 'M6', stage: 'group', homeTeam: 'CMR', awayTeam: 'IRQ', homeScore: 0, awayScore: 0 }
      ];

      const standings = computeGroupStandings('A', teams, matches, mockFifaRankings);

      // USA and SUI are tied on pts, overall GD, overall GS.
      // USA wins H2H, so USA must be 1st, SUI 2nd.
      expect(standings[0].id).toBe('USA');
      expect(standings[1].id).toBe('SUI');
    });

    it('should resolve a 3-team tie-breaker using H2H mini-league', () => {
      const teams = ['USA', 'SUI', 'CMR', 'IRQ'];
      // USA, SUI, CMR will be tied on 6 points each. IRQ will have 0 points.
      // In H2H matches between USA, SUI, CMR:
      // USA 1-0 SUI, SUI 2-0 CMR, CMR 3-0 USA.
      // All three have 3 points in the mini-league.
      // Mini-league GD: SUI (+1), CMR (+1), USA (-2).
      // Mini-league GS: CMR (3), SUI (2).
      // So H2H ranking should be: 1. CMR, 2. SUI, 3. USA, 4. IRQ.
      const matches: Match[] = [
        { id: 'M1', stage: 'group', homeTeam: 'USA', awayTeam: 'SUI', homeScore: 1, awayScore: 0 },
        { id: 'M2', stage: 'group', homeTeam: 'SUI', awayTeam: 'CMR', homeScore: 2, awayScore: 0 },
        { id: 'M3', stage: 'group', homeTeam: 'CMR', awayTeam: 'USA', homeScore: 3, awayScore: 0 },
        { id: 'M4', stage: 'group', homeTeam: 'USA', awayTeam: 'IRQ', homeScore: 2, awayScore: 0 },
        { id: 'M5', stage: 'group', homeTeam: 'SUI', awayTeam: 'IRQ', homeScore: 2, awayScore: 0 },
        { id: 'M6', stage: 'group', homeTeam: 'CMR', awayTeam: 'IRQ', homeScore: 2, awayScore: 0 }
      ];

      const standings = computeGroupStandings('A', teams, matches, mockFifaRankings);

      expect(standings[0].id).toBe('CMR');
      expect(standings[1].id).toBe('SUI');
      expect(standings[2].id).toBe('USA');
      expect(standings[3].id).toBe('IRQ');
    });
  });

  describe('computeGroupStandings - Overall GD/GS and Fallbacks', () => {
    it('should fall back to overall GD when H2H is tied', () => {
      const teams = ['USA', 'SUI', 'CMR', 'IRQ'];
      // USA vs SUI is 1-1.
      // USA has better overall GD because of a larger win against CMR.
      const matches: Match[] = [
        { id: 'M1', stage: 'group', homeTeam: 'USA', awayTeam: 'SUI', homeScore: 1, awayScore: 1 },
        { id: 'M2', stage: 'group', homeTeam: 'USA', awayTeam: 'CMR', homeScore: 3, awayScore: 0 },
        { id: 'M3', stage: 'group', homeTeam: 'SUI', awayTeam: 'CMR', homeScore: 2, awayScore: 0 },
        { id: 'M4', stage: 'group', homeTeam: 'USA', awayTeam: 'IRQ', homeScore: 1, awayScore: 1 },
        { id: 'M5', stage: 'group', homeTeam: 'SUI', awayTeam: 'IRQ', homeScore: 1, awayScore: 1 },
        { id: 'M6', stage: 'group', homeTeam: 'CMR', awayTeam: 'IRQ', homeScore: 0, awayScore: 0 }
      ];

      const standings = computeGroupStandings('A', teams, matches, mockFifaRankings);

      // USA and SUI both have 5 points.
      // H2H is 1-1 (tied).
      // Overall GD: USA is +3, SUI is +2.
      // USA should be 1st.
      expect(standings[0].id).toBe('USA');
      expect(standings[1].id).toBe('SUI');
    });

    it('should fall back to FIFA World Ranking when all footballing metrics are tied', () => {
      const teams = ['USA', 'SUI', 'CMR', 'IRQ'];
      // USA and SUI have identical matches, scores, and H2H.
      const matches: Match[] = [
        { id: 'M1', stage: 'group', homeTeam: 'USA', awayTeam: 'SUI', homeScore: 1, awayScore: 1 },
        { id: 'M2', stage: 'group', homeTeam: 'USA', awayTeam: 'CMR', homeScore: 2, awayScore: 0 },
        { id: 'M3', stage: 'group', homeTeam: 'SUI', awayTeam: 'CMR', homeScore: 2, awayScore: 0 },
        { id: 'M4', stage: 'group', homeTeam: 'USA', awayTeam: 'IRQ', homeScore: 1, awayScore: 1 },
        { id: 'M5', stage: 'group', homeTeam: 'SUI', awayTeam: 'IRQ', homeScore: 1, awayScore: 1 },
        { id: 'M6', stage: 'group', homeTeam: 'CMR', awayTeam: 'IRQ', homeScore: 0, awayScore: 0 }
      ];

      const standings = computeGroupStandings('A', teams, matches, mockFifaRankings);

      // USA and SUI completely tied.
      // FIFA Rank: USA (11), SUI (28).
      // USA should be 1st.
      expect(standings[0].id).toBe('USA');
      expect(standings[1].id).toBe('SUI');
    });

    it('should respect custom overrides when specified for completely tied teams', () => {
      const teams = ['USA', 'SUI', 'CMR', 'IRQ'];
      const matches: Match[] = [
        { id: 'M1', stage: 'group', homeTeam: 'USA', awayTeam: 'SUI', homeScore: 1, awayScore: 1 },
        { id: 'M2', stage: 'group', homeTeam: 'USA', awayTeam: 'CMR', homeScore: 2, awayScore: 0 },
        { id: 'M3', stage: 'group', homeTeam: 'SUI', awayTeam: 'CMR', homeScore: 2, awayScore: 0 },
        { id: 'M4', stage: 'group', homeTeam: 'USA', awayTeam: 'IRQ', homeScore: 1, awayScore: 1 },
        { id: 'M5', stage: 'group', homeTeam: 'SUI', awayTeam: 'IRQ', homeScore: 1, awayScore: 1 },
        { id: 'M6', stage: 'group', homeTeam: 'CMR', awayTeam: 'IRQ', homeScore: 0, awayScore: 0 }
      ];

      // Custom override places SUI first
      const customOverride = ['SUI', 'USA', 'CMR', 'IRQ'];
      const standings = computeGroupStandings('A', teams, matches, mockFifaRankings, customOverride);

      expect(standings[0].id).toBe('SUI');
      expect(standings[1].id).toBe('USA');
    });

    it('should exit quickly and return teams sorted by FIFA rank/override when no matches have been played', () => {
      const teams = ['USA', 'SUI', 'CMR', 'IRQ'];
      const matches: Match[] = []; // No matches played

      const standings = computeGroupStandings('A', teams, matches, mockFifaRankings);

      // Initial state: Should sort by FIFA rank (USA: 11, SUI: 28, CMR: 37, IRQ: 40)
      expect(standings[0].id).toBe('USA');
      expect(standings[1].id).toBe('SUI');
      expect(standings[2].id).toBe('CMR');
      expect(standings[3].id).toBe('IRQ');
    });
  });

  describe('computeThirdPlaceRankings', () => {
    it('should sort third-place teams using points, gd, gf, FIFA rank, and custom override', () => {
      const thirdPlaces: TeamStanding[] = [
        { id: 'CMR', points: 3, played: 3, won: 1, drawn: 0, lost: 2, gf: 2, ga: 4, gd: -2, fifaRank: 37 },
        { id: 'SUI', points: 4, played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, fifaRank: 28 },
        { id: 'USA', points: 4, played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, fifaRank: 11 },
        { id: 'IRQ', points: 2, played: 3, won: 0, drawn: 2, lost: 1, gf: 1, ga: 2, gd: -1, fifaRank: 40 }
      ];

      const ranked = computeThirdPlaceRankings(thirdPlaces, mockFifaRankings);

      // SUI and USA both have 4 points, 0 GD, 3 GF.
      // USA (11) has better FIFA rank than SUI (28).
      // So USA is first, SUI is second, CMR is third, IRQ is fourth.
      expect(ranked[0].id).toBe('USA');
      expect(ranked[1].id).toBe('SUI');
      expect(ranked[2].id).toBe('CMR');
      expect(ranked[3].id).toBe('IRQ');
    });

    it('should respect custom overrides for third-place rankings when specified', () => {
      const thirdPlaces: TeamStanding[] = [
        { id: 'SUI', points: 4, played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, fifaRank: 28 },
        { id: 'USA', points: 4, played: 3, won: 1, drawn: 1, lost: 1, gf: 3, ga: 3, gd: 0, fifaRank: 11 }
      ];

      // Custom override places SUI first
      const customOverride = ['SUI', 'USA'];
      const ranked = computeThirdPlaceRankings(thirdPlaces, mockFifaRankings, customOverride);

      expect(ranked[0].id).toBe('SUI');
      expect(ranked[1].id).toBe('USA');
    });
  });
});
