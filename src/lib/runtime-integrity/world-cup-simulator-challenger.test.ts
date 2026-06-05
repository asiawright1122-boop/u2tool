import { describe, it, expect } from 'vitest';
import {
  adjustEloForTrioDNA,
  simulateFullTournament,
  rankGroup,
  BASE_TEAMS,
  type Team as SimTeam,
  type MatchResult as SimMatchResult
} from './world-cup-engine';
import {
  computeGroupStandings,
  type Match
} from './world-cup-calculator-engine';

describe('World Cup Simulator Challenger Tests', () => {

  describe('1. Home Advantage ELO & Odds Boost Corner Cases', () => {
    it('should correctly boost ELO for hosts (USA, CAN, MEX) when Home Advantage is 10 vs 0', () => {
      const hosts = BASE_TEAMS.filter(t => t.isHost);
      expect(hosts.map(h => h.id)).toContain('USA');
      expect(hosts.map(h => h.id)).toContain('CAN');
      expect(hosts.map(h => h.id)).toContain('MEX');

      hosts.forEach(host => {
        const eloAt0 = adjustEloForTrioDNA(host.elo, host.isHost, host.isHeritage, 0, 5);
        const eloAt10 = adjustEloForTrioDNA(host.elo, host.isHost, host.isHeritage, 10, 5);
        
        // ELO difference should be exactly 150 points
        expect(eloAt10 - eloAt0).toBe(150);
      });
    });

    it('should demonstrate a significant increase in progression/championship odds for hosts when Home Advantage is set to 10 vs 0', () => {
      const runs = 1000; // Run 1000 times for each setting to get a reliable statistical boost
      
      // Run with Home Advantage = 0
      const champsAt0: Record<string, number> = { USA: 0, CAN: 0, MEX: 0 };
      const koAt0: Record<string, number> = { USA: 0, CAN: 0, MEX: 0 };
      
      for (let i = 0; i < runs; i++) {
        const sim = simulateFullTournament(0, 5, 5);
        if (['USA', 'CAN', 'MEX'].includes(sim.champion.id)) {
          champsAt0[sim.champion.id]++;
        }
        // Count who reached knockout stage (anything except groupStageExit)
        const exits = new Set(sim.groupStageExit.map(t => t.id));
        ['USA', 'CAN', 'MEX'].forEach(id => {
          if (!exits.has(id)) {
            koAt0[id]++;
          }
        });
      }

      // Run with Home Advantage = 10
      const champsAt10: Record<string, number> = { USA: 0, CAN: 0, MEX: 0 };
      const koAt10: Record<string, number> = { USA: 0, CAN: 0, MEX: 0 };
      
      for (let i = 0; i < runs; i++) {
        const sim = simulateFullTournament(10, 5, 5);
        if (['USA', 'CAN', 'MEX'].includes(sim.champion.id)) {
          champsAt10[sim.champion.id]++;
        }
        const exits = new Set(sim.groupStageExit.map(t => t.id));
        ['USA', 'CAN', 'MEX'].forEach(id => {
          if (!exits.has(id)) {
            koAt10[id]++;
          }
        });
      }

      console.log('--- Home Advantage Odds Boost Results (Runs: ' + runs + ') ---');
      ['USA', 'CAN', 'MEX'].forEach(id => {
        const koProb0 = koAt0[id] / runs;
        const koProb10 = koAt10[id] / runs;
        const champProb0 = champsAt0[id] / runs;
        const champProb10 = champsAt10[id] / runs;
        
        console.log(`${id}: Knockout Stage Odds (HomeAdv=0): ${(koProb0 * 100).toFixed(1)}% | (HomeAdv=10): ${(koProb10 * 100).toFixed(1)}%`);
        console.log(`${id}: Champion Odds (HomeAdv=0): ${(champProb0 * 100).toFixed(2)}% | (HomeAdv=10): ${(champProb10 * 100).toFixed(2)}%`);
        
        // Assert progression odds rise
        expect(koProb10).toBeGreaterThan(koProb0);
      });
    });
  });

  describe('2. Performance Benchmark (10,000 simulations)', () => {
    it('should complete 10,000 simulations in under 2 seconds and measure performance', () => {
      const totalRuns = 10000;
      const startTime = performance.now();
      
      for (let i = 0; i < totalRuns; i++) {
        simulateFullTournament(5, 5, 5);
      }
      
      const endTime = performance.now();
      const durationMs = endTime - startTime;
      const avgMs = durationMs / totalRuns;
      
      console.log('--- 10,000 Simulations Benchmark ---');
      console.log(`Total duration: ${durationMs.toFixed(2)} ms`);
      console.log(`Average duration per tournament simulation: ${avgMs.toFixed(4)} ms`);
      
      expect(durationMs).toBeLessThan(2000); // Must run in under 2000ms
    });
  });

  describe('3. FIFA Rules vs UEFA Rules Tie-breaker Validation', () => {
    it('should highlight discrepancy: computeGroupStandings uses UEFA (H2H first) whereas FIFA uses Overall GD first', () => {
      const mockFifaRankings: Record<string, number> = {
        USA: 11,
        SUI: 28,
        CMR: 37,
        IRQ: 40
      };

      const teams = ['USA', 'SUI', 'CMR', 'IRQ'];
      
      // Scenario where USA and SUI are tied on 6 points:
      // USA: beats CMR 5-0, beats IRQ 1-0, loses to SUI 0-1.
      // Total USA: 6 points, GD +5 (6-1). GF: 6.
      // SUI: beats USA 1-0, beats CMR 1-0, loses to IRQ 0-2.
      // Total SUI: 6 points, GD 0 (2-2). GF: 2.
      const matches: Match[] = [
        { id: 'M1', stage: 'group', homeTeam: 'SUI', awayTeam: 'USA', homeScore: 1, awayScore: 0 },
        { id: 'M2', stage: 'group', homeTeam: 'USA', awayTeam: 'CMR', homeScore: 5, awayScore: 0 },
        { id: 'M3', stage: 'group', homeTeam: 'SUI', awayTeam: 'CMR', homeScore: 1, awayScore: 0 },
        { id: 'M4', stage: 'group', homeTeam: 'USA', awayTeam: 'IRQ', homeScore: 1, awayScore: 0 },
        { id: 'M5', stage: 'group', homeTeam: 'IRQ', awayTeam: 'SUI', homeScore: 2, awayScore: 0 },
        { id: 'M6', stage: 'group', homeTeam: 'CMR', awayTeam: 'IRQ', homeScore: 1, awayScore: 0 } // CMR/IRQ filler
      ];

      // A. Run interactive calculator logic (computeGroupStandings)
      const standingsInteractive = computeGroupStandings('A', teams, matches, mockFifaRankings);
      
      // Under interactive calculator (UEFA rules), SUI is ranked 1st because of H2H win vs USA (1-0).
      expect(standingsInteractive[0].id).toBe('SUI');
      expect(standingsInteractive[1].id).toBe('USA');

      // B. Run simulation engine logic (rankGroup)
      // Map to world-cup-engine structures
      const simTeams: SimTeam[] = [
        { id: 'USA', name: 'USA', elo: 1780, points: 0, gd: 0, goalsFor: 0 },
        { id: 'SUI', name: 'SUI', elo: 1820, points: 0, gd: 0, goalsFor: 0 },
        { id: 'CMR', name: 'CMR', elo: 1610, points: 0, gd: 0, goalsFor: 0 },
        { id: 'IRQ', name: 'IRQ', elo: 1550, points: 0, gd: 0, goalsFor: 0 }
      ];
      
      const simMatches: SimMatchResult[] = matches.map(m => ({
        teamA: m.homeTeam,
        teamB: m.awayTeam,
        goalsA: m.homeScore!,
        goalsB: m.awayScore!
      }));

      const standingsSim = rankGroup(simTeams, simMatches);
      
      // Under simulation engine (simplified FIFA rules), USA is ranked 1st because of superior overall GD (+5 vs 0).
      expect(standingsSim[0].id).toBe('USA');
      expect(standingsSim[1].id).toBe('SUI');
      
      console.log('--- Tie-breaker Discrepancy Verified ---');
      console.log(`Interactive Calculator (UEFA style - H2H first) 1st: ${standingsInteractive[0].id}, 2nd: ${standingsInteractive[1].id}`);
      console.log(`Simulation Engine (FIFA style - Overall GD first) 1st: ${standingsSim[0].id}, 2nd: ${standingsSim[1].id}`);
    });
  });
});
