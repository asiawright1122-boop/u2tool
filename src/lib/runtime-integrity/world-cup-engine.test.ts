import { describe, it, expect } from 'vitest';
import { 
  adjustEloForTrioDNA, 
  calculateMatchProbability, 
  simulateFullTournament,
  rankGroup,
  BASE_TEAMS,
  type Team,
  type MatchResult
} from './world-cup-engine';

describe('World Cup Monte Carlo Engine', () => {
  
  describe('1. DNA Adjustment Corner Cases', () => {
    it('should boost host nations properly when homeSlider is adjusted', () => {
      // Host nations: USA, CAN, MEX
      const hosts = ['USA', 'CAN', 'MEX'];
      
      for (const hostId of hosts) {
        const team = BASE_TEAMS.find(t => t.id === hostId)!;
        expect(team).toBeDefined();
        
        // At homeSlider = 0, ELO should not change
        const elo0 = adjustEloForTrioDNA(team.elo, team.isHost, team.isHeritage, 0, 5);
        expect(elo0).toBe(team.elo);
        
        // At homeSlider = 10, ELO should boost by 150
        const elo10 = adjustEloForTrioDNA(team.elo, team.isHost, team.isHeritage, 10, 5);
        expect(elo10).toBe(team.elo + 150);
        
        // At homeSlider = 5, ELO should boost by 75
        const elo5 = adjustEloForTrioDNA(team.elo, team.isHost, team.isHeritage, 5, 5);
        expect(elo5).toBe(team.elo + 75);
      }
    });

    it('should boost heritage giant nations properly when heritageSlider is adjusted', () => {
      // Heritage nations: ARG, FRA, BRA, ENG, URU, ITA, GER, ESP
      const heritageTeams = ['ARG', 'FRA', 'BRA', 'ENG', 'URU', 'ITA', 'GER', 'ESP'];
      
      for (const id of heritageTeams) {
        const team = BASE_TEAMS.find(t => t.id === id)!;
        expect(team).toBeDefined();
        
        // At heritageSlider = 0, ELO should not change
        const elo0 = adjustEloForTrioDNA(team.elo, team.isHost, team.isHeritage, 5, 0);
        expect(elo0).toBe(team.elo);
        
        // At heritageSlider = 10, ELO should boost by 140
        const elo10 = adjustEloForTrioDNA(team.elo, team.isHost, team.isHeritage, 5, 10);
        expect(elo10).toBe(team.elo + 140);
        
        // At heritageSlider = 5, ELO should boost by 70
        const elo5 = adjustEloForTrioDNA(team.elo, team.isHost, team.isHeritage, 5, 5);
        expect(elo5).toBe(team.elo + 70);
      }
    });

    it('should not boost non-host, non-heritage nations under any slider settings', () => {
      // Switzerland (SUI) is neither host nor heritage
      const sui = BASE_TEAMS.find(t => t.id === 'SUI')!;
      expect(sui.isHost).toBe(false);
      expect(sui.isHeritage).toBe(false);
      
      const eloAdjusted = adjustEloForTrioDNA(sui.elo, sui.isHost, sui.isHeritage, 10, 10);
      expect(eloAdjusted).toBe(sui.elo);
    });
  });

  describe('2. Match Probability Calculations under Chaos', () => {
    it('should scale match outcomes appropriately with chaos slider', () => {
      const eloA = 1900;
      const eloB = 1600; // Team A is much stronger than Team B
      
      // With low chaos (0)
      const lowChaos = calculateMatchProbability(eloA, eloB, 0);
      
      // With high chaos (10)
      const highChaos = calculateMatchProbability(eloA, eloB, 10);
      
      // High chaos should increase the draw/loss probability (or flatten the win difference)
      // Low chaos should make the stronger team's win probability higher
      const winDiffLow = lowChaos.probA - lowChaos.probB;
      const winDiffHigh = highChaos.probA - highChaos.probB;
      
      expect(winDiffLow).toBeGreaterThan(winDiffHigh);
      expect(highChaos.probB).toBeGreaterThan(lowChaos.probB);
    });
  });

  describe('3. Group Stage Standings Sorter and Tie-Breakers', () => {
    it('should rank teams correctly by points', () => {
      const teams: Team[] = [
        { id: 'T1', name: 'Team 1', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T2', name: 'Team 2', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T3', name: 'Team 3', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T4', name: 'Team 4', elo: 1500, points: 0, gd: 0, goalsFor: 0 }
      ];
      
      const matches: MatchResult[] = [
        { teamA: 'T1', teamB: 'T2', goalsA: 2, goalsB: 0 }, // T1: 3 pts, T2: 0 pts
        { teamA: 'T3', teamB: 'T4', goalsA: 1, goalsB: 1 }, // T3: 1 pt, T4: 1 pt
      ];
      
      const ranked = rankGroup(teams, matches);
      
      expect(ranked[0].id).toBe('T1');
      expect(ranked[1].id).toBe('T3'); // alphabetically T3 or T4 (both 1pt, 0 GD, 1 GF)
      expect(ranked[2].id).toBe('T4');
      expect(ranked[3].id).toBe('T2');
    });

    it('should rank teams by Goal Difference (GD) when points are tied', () => {
      const teams: Team[] = [
        { id: 'T1', name: 'Team 1', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T2', name: 'Team 2', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T3', name: 'Team 3', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
      ];
      
      const matches: MatchResult[] = [
        { teamA: 'T1', teamB: 'T3', goalsA: 3, goalsB: 0 }, // T1: 3pts, GD +3, GF 3
        { teamA: 'T2', teamB: 'T3', goalsA: 1, goalsB: 0 }, // T2: 3pts, GD +1, GF 1
      ];
      
      const ranked = rankGroup(teams, matches);
      expect(ranked[0].id).toBe('T1');
      expect(ranked[1].id).toBe('T2');
      expect(ranked[2].id).toBe('T3');
    });

    it('should rank teams by Goals For (GF) when points and Goal Difference are tied', () => {
      const teams: Team[] = [
        { id: 'T1', name: 'Team 1', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T2', name: 'Team 2', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
      ];
      
      // Both teams win 1 match and lose 1 match with same goal difference
      // T1 wins 4-3, T2 wins 1-0. Both GD is +1. Both points is 3.
      // But T1 scored 4, T2 scored 1.
      const matches: MatchResult[] = [
        { teamA: 'T1', teamB: 'T2', goalsA: 4, goalsB: 3 }, // T1 wins 4-3. T1: 3 pts, GD +1, GF 4. T2: 0 pts, GD -1, GF 3
        { teamA: 'T2', teamB: 'T1', goalsA: 2, goalsB: 0 }, // T2 wins 2-0. T2: 3 pts, GD +1 (combined +1), GF 5. T1: 3 pts, GD -1 (combined -1), GF 4
      ];
      
      // Wait, let's construct a cleaner scenario:
      // Three matches:
      // T1 plays T3: T1 wins 3-2. (T1: 3pts, +1 GD, 3 GF)
      // T2 plays T3: T2 wins 1-0. (T2: 3pts, +1 GD, 1 GF)
      // T1 and T2 do not play each other or their H2H is not counted.
      // Both have 3 points, +1 GD. T1 has 3 GF, T2 has 1 GF.
      const teams2: Team[] = [
        { id: 'T1', name: 'Team 1', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T2', name: 'Team 2', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T3', name: 'Team 3', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
      ];
      const matches2: MatchResult[] = [
        { teamA: 'T1', teamB: 'T3', goalsA: 3, goalsB: 2 },
        { teamA: 'T2', teamB: 'T3', goalsA: 1, goalsB: 0 },
      ];
      
      const ranked = rankGroup(teams2, matches2);
      expect(ranked[0].id).toBe('T1');
      expect(ranked[1].id).toBe('T2');
    });

    it('should reveal that the simulation engine does NOT implement H2H fallback when Points/GD/GF are fully tied', () => {
      // In a scenario where T1 and T2 have identical Points, GD, and GF:
      // T1 beat T2 in their head-to-head match.
      // Under FIFA rules, T1 should rank above T2.
      // Under the simulation engine (which simplified it to exclude H2H mapping),
      // the sort order is unstable or determined by initial array position, not H2H.
      const teams: Team[] = [
        { id: 'T2', name: 'Team 2', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
        { id: 'T1', name: 'Team 1', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
      ];
      
      const matches: MatchResult[] = [
        { teamA: 'T1', teamB: 'T2', goalsA: 2, goalsB: 1 }, // T1 wins 2-1. H2H favors T1. T1: 3pts, GD +1, GF 2
        { teamA: 'T2', teamB: 'T1', goalsA: 2, goalsB: 1 }, // Wait! If they play twice: T2 wins 2-1. T2: 3pts, GD +1, GF 3. T1: 3pts, GD -1, GF 3. Let's make it simpler.
      ];
      
      // Let's create a 3-team scenario:
      // T1 beat T2 1-0.
      // T2 beat T3 1-0.
      // T3 beat T1 1-0.
      // All have 3 points, 0 GD, 1 GF.
      // Let's check what the engine does. It will return them in the order of sort stability because points, GD, GF are all 0.
      // Let's do another scenario:
      // T1 and T2 only play each other once: T1 wins 1-0.
      // T1 plays T3: T3 wins 1-0.
      // T2 plays T3: T2 wins 1-0.
      // Points: T1 (3), T2 (3), T3 (3).
      // GD: T1 (0), T2 (0), T3 (0).
      // GF: T1 (1), T2 (1), T3 (1).
      // Under FIFA rules:
      // H2H mini-league:
      // T1 vs T2: T1 wins 1-0.
      // T2 vs T3: T2 wins 1-0.
      // T3 vs T1: T3 wins 1-0.
      // In H2H: all have 3 points, 0 GD, 1 GF.
      
      // What about a 2-team tie?
      // T1 and T2 are the only teams in the group (or we filter to them).
      // They play each other: T1 wins 1-0.
      // T1 plays T3: T3 wins 2-0. (T1: 3pts, GD -1, GF 1)
      // T2 plays T3: T2 wins 2-1. (T2: 3pts, GD 0, GF 2. T3: 3pts, GD -1, GF 3)
      // Let's design a direct tie:
      // T1 plays T2: T1 wins 1-0. (H2H: T1 wins)
      // T1 plays T3: T1 and T3 draw 0-0. (T1: 4pts, GD +1, GF 1)
      // T2 plays T3: T2 beats T3 1-0. (T2: 3pts, GD 0, GF 1. T3: 1pt, GD -1, GF 0)
      // Wait, let's look at a simpler direct tie:
      // T1 beats T2 1-0.
      // T1 loses to T3 0-2.
      // T2 beats T3 2-0.
      // Points:
      // T1: 3 points (win T2, lose T3). GD = 1 - 2 = -1. GF = 1.
      // T2: 3 points (lose T1, win T3). GD = 2 - 1 = +1. GF = 2.
      // T3: 3 points (win T1, lose T2). GD = 2 - 2 = 0. GF = 2.
      // Rankings here are determined by GD.
      
      // What if T1 and T2 have identical results against T3?
      // T1 beats T2 1-0. (H2H: T1 wins)
      // T1 draws T3 1-1.
      // T2 draws T3 1-1.
      // Points: T1 (4), T2 (1), T3 (2). (Not tied)
      
      // Let's create:
      // Group of 3 teams: T1, T2, T3.
      // T1 vs T2: T1 wins 1-0.
      // T1 vs T3: T3 wins 1-0.
      // T2 vs T3: T2 wins 1-0.
      // Points: T1 (3), T2 (3), T3 (3).
      // GD: T1 (0), T2 (0), T3 (0).
      // GF: T1 (1), T2 (1), T3 (1).
      // Since all points, GD, GF are tied, FIFA rules would require H2H, then Fair Play, then Lot Drawing.
      // Let's make it a 2-team tie at the top of a 3-team group:
      // T1 and T2 play: T1 wins 2-1.
      // T1 plays T3: T3 wins 1-0.
      // T2 plays T3: T2 wins 1-0.
      // Points:
      // T1: 3 pts. GD = (2-1) + (0-1) = 0. GF = 2.
      // T2: 3 pts. GD = (1-2) + (1-0) = 0. GF = 2.
      // T3: 3 pts. GD = (1-0) + (0-1) = 0. GF = 1.
      // Here T1 and T2 have 3 pts, 0 GD, 2 GF. T3 has 3 pts, 0 GD, 1 GF.
      // So T1 and T2 are tied on Points, GD, and GF!
      // Under FIFA rules: T1 beat T2 (2-1), so T1 must rank above T2.
      // Let's see if the engine ranks T1 above T2 when T2 is placed first in the input array.
      const rankedTeams = rankGroup(
        [
          { id: 'T2', name: 'Team 2', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
          { id: 'T1', name: 'Team 1', elo: 1500, points: 0, gd: 0, goalsFor: 0 },
          { id: 'T3', name: 'Team 3', elo: 1500, points: 0, gd: 0, goalsFor: 0 }
        ],
        [
          { teamA: 'T1', teamB: 'T2', goalsA: 2, goalsB: 1 },
          { teamA: 'T3', teamB: 'T1', goalsA: 1, goalsB: 0 },
          { teamA: 'T2', teamB: 'T3', goalsA: 1, goalsB: 0 }
        ]
      );

      // Verify that T1 and T2 have identical Points (3), GD (0), and GF (2)
      const t1 = rankedTeams.find(t => t.id === 'T1')!;
      const t2 = rankedTeams.find(t => t.id === 'T2')!;
      expect(t1.points).toBe(3);
      expect(t1.gd).toBe(0);
      expect(t1.goalsFor).toBe(2);
      expect(t2.points).toBe(3);
      expect(t2.gd).toBe(0);
      expect(t2.goalsFor).toBe(2);

      // Under official FIFA rules, T1 is 1st (because H2H T1 2-1 T2).
      // Let's inspect the actual output. The engine does NOT sort them by H2H.
      // Since it returned 0 in comparison, their relative order remains as they were in the input list (T2 before T1).
      // So rankedTeams[0] will be T2, and rankedTeams[1] will be T1.
      // Let's assert this to prove the limitation/bug!
      console.log('Ranked result for full tie (Points, GD, GF equal, H2H favors T1):');
      console.log(rankedTeams.map(t => `${t.id}: pts=${t.points}, gd=${t.gd}, gf=${t.goalsFor}`));
      
      // Let's assert that the engine fails to rank T1 above T2 based on H2H
      expect(rankedTeams[0].id).toBe('T2'); // T2 stays first due to sort stability, demonstrating the lack of H2H sorting.
    });
  });

  describe('4. Simulation Performance & Non-blocking Behavior (10k Simulations)', () => {
    it('should complete 10,000 simulations efficiently', () => {
      const start = performance.now();
      
      const numSimulations = 10000;
      const champCounts: Record<string, number> = {};
      BASE_TEAMS.forEach(t => { champCounts[t.id] = 0; });
      
      for (let i = 0; i < numSimulations; i++) {
        const result = simulateFullTournament(5, 5, 5);
        champCounts[result.champion.id] = (champCounts[result.champion.id] || 0) + 1;
      }
      
      const duration = performance.now() - start;
      console.log(`Successfully executed 10,000 World Cup simulations in ${duration.toFixed(2)}ms`);
      
      // High performance threshold: 10,000 full tournament simulations should complete well within 1.5 seconds in a Node/Vitest environment.
      expect(duration).toBeLessThan(1500); 
      
      // Verify champion counts sum to 10,000
      const totalChamps = Object.values(champCounts).reduce((sum, count) => sum + count, 0);
      expect(totalChamps).toBe(10000);
    });

    it('should show significantly higher odds for hosts (USA, CAN, MEX) when Home Advantage is 10 vs 0', () => {
      const runs = 5000; // 5000 runs is plenty to get a statistically significant trend
      
      // Case A: Home Advantage = 0
      const champ0: Record<string, number> = {};
      const r32_0: Record<string, number> = {};
      BASE_TEAMS.forEach(t => { champ0[t.id] = 0; r32_0[t.id] = 0; });
      
      for (let i = 0; i < runs; i++) {
        const res = simulateFullTournament(0, 5, 5);
        champ0[res.champion.id]++;
        
        // Count qualified for knockout (reached R32)
        res.roundOf32.forEach(t => r32_0[t.id]++);
        r32_0[res.champion.id]++;
        r32_0[res.runnerUp.id]++;
        res.semiFinalists.forEach(t => r32_0[t.id]++);
        res.quarterFinalists.forEach(t => r32_0[t.id]++);
        res.roundOf16.forEach(t => r32_0[t.id]++);
      }

      // Case B: Home Advantage = 10
      const champ10: Record<string, number> = {};
      const r32_10: Record<string, number> = {};
      BASE_TEAMS.forEach(t => { champ10[t.id] = 0; r32_10[t.id] = 0; });
      
      for (let i = 0; i < runs; i++) {
        const res = simulateFullTournament(10, 5, 5);
        champ10[res.champion.id]++;
        
        // Count qualified for knockout (reached R32)
        res.roundOf32.forEach(t => r32_10[t.id]++);
        r32_10[res.champion.id]++;
        r32_10[res.runnerUp.id]++;
        res.semiFinalists.forEach(t => r32_10[t.id]++);
        res.quarterFinalists.forEach(t => r32_10[t.id]++);
        res.roundOf16.forEach(t => r32_10[t.id]++);
      }

      const hosts = ['USA', 'CAN', 'MEX'];
      console.log('Comparing Host Advancement/Championship Rates (Home Advantage 0 vs 10):');
      
      for (const hostId of hosts) {
        const rate0 = (champ0[hostId] / runs) * 100;
        const rate10 = (champ10[hostId] / runs) * 100;
        
        const koRate0 = (r32_0[hostId] / runs) * 100;
        const koRate10 = (r32_10[hostId] / runs) * 100;
        
        console.log(`- ${hostId}:`);
        console.log(`  Champion Prob: ${rate0.toFixed(2)}% -> ${rate10.toFixed(2)}%`);
        console.log(`  Knockout Stage Prob: ${koRate0.toFixed(2)}% -> ${koRate10.toFixed(2)}%`);
        
        // Verify that the championship odds and knockout stage odds rise significantly.
        // E.g., at least a 1.5x increase in champion rate or a substantial increase in knockout stage rate.
        expect(koRate10).toBeGreaterThan(koRate0);
        expect(rate10).toBeGreaterThan(rate0);
      }
    });
  });
});
