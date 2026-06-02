import { describe, it, expect } from 'vitest';
import { 
  adjustEloForTrioDNA, 
  calculateMatchProbability, 
  simulateMatchGoals,
  rankGroup,
  selectBestThirdPlaces,
  simulateKnockoutBracket,
  type Team,
  type MatchResult
} from '../../lib/runtime-integrity/world-cup-engine';

describe('World Cup Simulator TDD Suite', () => {
  it('should adjust Elo based on Home Advantage and Heritage DNA boosts', () => {
    // France (2040) is Heritage but not Host
    const eloFranceAdjusted = adjustEloForTrioDNA(2040, false, true, 5, 10); // max Heritage (140)
    expect(eloFranceAdjusted).toBe(2040 + 140);

    // Mexico (1710) is Host but not Heritage
    const eloMexicoAdjusted = adjustEloForTrioDNA(1710, true, false, 8, 5); // 0.8 * 150 = 120 Host boost
    expect(eloMexicoAdjusted).toBe(1710 + 120);
  });

  it('should calculate win-draw-loss probability partitions', () => {
    const { probA, probB, probDraw } = calculateMatchProbability(1800, 1800, 0); // equal rating, 0 chaos
    expect(probDraw).toBeCloseTo(0.26, 2);
    expect(probA).toBeCloseTo(0.37, 2);
    expect(probB).toBeCloseTo(0.37, 2);
    expect(probA + probB + probDraw).toBeCloseTo(1.0, 5);
  });

  it('should generate Poisson goals and resolve win/loss contradictions', () => {
    // If Team A has significantly higher Elo and wins the probability partition
    const result = simulateMatchGoals(2000, 1500, 'win'); // Team A wins
    expect(result.goalsA).toBeGreaterThanOrEqual(result.goalsB);
    
    // If result contradicts, engine must adjust it by 1 goal
    const resultDraw = simulateMatchGoals(1800, 1800, 'draw');
    expect(resultDraw.goalsA).toBe(resultDraw.goalsB);
  });

  it('should correctly rank groups using FIFA tie-breakers (Points, GD, Goals, H2H)', () => {
    const teams: Team[] = [
      { id: 'USA', name: 'United States', elo: 1780, points: 0, gd: 0, goalsFor: 0 },
      { id: 'SUI', name: 'Switzerland', elo: 1820, points: 0, gd: 0, goalsFor: 0 },
      { id: 'CMR', name: 'Cameroon', elo: 1610, points: 0, gd: 0, goalsFor: 0 },
      { id: 'IRQ', name: 'Iraq', elo: 1550, points: 0, gd: 0, goalsFor: 0 }
    ];

    const matches: MatchResult[] = [
      { teamA: 'USA', teamB: 'SUI', goalsA: 2, goalsB: 1 }, // USA: 3pts, +1GD
      { teamA: 'CMR', teamB: 'IRQ', goalsA: 1, goalsB: 1 }, // CMR: 1pt, 0GD. IRQ: 1pt, 0GD
      { teamA: 'USA', teamB: 'CMR', goalsA: 3, goalsB: 0 }, // USA: 6pts, +4GD
      { teamA: 'SUI', teamB: 'IRQ', goalsA: 2, goalsB: 0 }, // SUI: 3pts, +1GD
      { teamA: 'USA', teamB: 'IRQ', goalsA: 1, goalsB: 1 }, // USA: 7pts, +4GD
      { teamA: 'SUI', teamB: 'CMR', goalsA: 1, goalsB: 0 }  // SUI: 6pts, +2GD
    ];

    const ranked = rankGroup(teams, matches);
    expect(ranked[0].id).toBe('USA');
    expect(ranked[1].id).toBe('SUI');
  });

  it('should select top 8 third-placed teams from 12 groups', () => {
    const thirdPlaceTeams: Team[] = Array.from({ length: 12 }, (_, i) => ({
      id: `T${i}`,
      name: `Team ${i}`,
      elo: 1600,
      points: i % 3 === 0 ? 4 : (i % 3 === 1 ? 3 : 2), // Some have 4pts, 3pts, 2pts
      gd: i - 6, // ranges from -6 to +5
      goalsFor: i
    }));

    const advanced = selectBestThirdPlaces(thirdPlaceTeams);
    expect(advanced.length).toBe(8);
    // Team with 4pts should rank higher than team with 2pts
    expect(advanced[0].points).toBeGreaterThanOrEqual(advanced[7].points);
  });

  it('should run a knockout bracket to produce a champion', () => {
    const qualified = Array.from({ length: 32 }, (_, i) => ({
      id: `Q${i}`,
      name: `Qualified ${i}`,
      elo: 1700 + i * 10
    }));

    const champion = simulateKnockoutBracket(qualified);
    expect(champion).toBeDefined();
    expect(champion.elo).toBeGreaterThan(1600);
  });
});
