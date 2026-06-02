export interface Team {
  id: string;
  name: string;
  elo: number;
  points: number;
  gd: number;
  goalsFor: number;
}

export interface MatchResult {
  teamA: string;
  teamB: string;
  goalsA: number;
  goalsB: number;
}

export interface BaseTeam {
  id: string;
  name: string;
  elo: number;
  isHost: boolean;
  isHeritage: boolean;
  group: string;
}

// 48 Teams of the 2026 FIFA World Cup
export const BASE_TEAMS: BaseTeam[] = [
  // Group A
  { id: 'USA', name: 'United States', elo: 1780, isHost: true, isHeritage: false, group: 'A' },
  { id: 'SUI', name: 'Switzerland', elo: 1820, isHost: false, isHeritage: false, group: 'A' },
  { id: 'CMR', name: 'Cameroon', elo: 1610, isHost: false, isHeritage: false, group: 'A' },
  { id: 'IRQ', name: 'Iraq', elo: 1550, isHost: false, isHeritage: false, group: 'A' },

  // Group B
  { id: 'CAN', name: 'Canada', elo: 1690, isHost: true, isHeritage: false, group: 'B' },
  { id: 'COL', name: 'Colombia', elo: 1850, isHost: false, isHeritage: false, group: 'B' },
  { id: 'POL', name: 'Poland', elo: 1710, isHost: false, isHeritage: false, group: 'B' },
  { id: 'UZB', name: 'Uzbekistan', elo: 1580, isHost: false, isHeritage: false, group: 'B' },

  // Group C
  { id: 'MEX', name: 'Mexico', elo: 1710, isHost: true, isHeritage: false, group: 'C' },
  { id: 'DEN', name: 'Denmark', elo: 1800, isHost: false, isHeritage: false, group: 'C' },
  { id: 'EGY', name: 'Egypt', elo: 1640, isHost: false, isHeritage: false, group: 'C' },
  { id: 'NZL', name: 'New Zealand', elo: 1480, isHost: false, isHeritage: false, group: 'C' },

  // Group D
  { id: 'ARG', name: 'Argentina', elo: 2080, isHost: false, isHeritage: true, group: 'D' },
  { id: 'SWE', name: 'Sweden', elo: 1790, isHost: false, isHeritage: false, group: 'D' },
  { id: 'ALG', name: 'Algeria', elo: 1630, isHost: false, isHeritage: false, group: 'D' },
  { id: 'KSA', name: 'Saudi Arabia', elo: 1600, isHost: false, isHeritage: false, group: 'D' },

  // Group E
  { id: 'FRA', name: 'France', elo: 2040, isHost: false, isHeritage: true, group: 'E' },
  { id: 'CRO', name: 'Croatia', elo: 1910, isHost: false, isHeritage: false, group: 'E' },
  { id: 'ECU', name: 'Ecuador', elo: 1740, isHost: false, isHeritage: false, group: 'E' },
  { id: 'UAE', name: 'UAE', elo: 1520, isHost: false, isHeritage: false, group: 'E' },

  // Group F
  { id: 'BEL', name: 'Belgium', elo: 1940, isHost: false, isHeritage: false, group: 'F' },
  { id: 'MAR', name: 'Morocco', elo: 1870, isHost: false, isHeritage: false, group: 'F' },
  { id: 'UKR', name: 'Ukraine', elo: 1750, isHost: false, isHeritage: false, group: 'F' },
  { id: 'PAN', name: 'Panama', elo: 1590, isHost: false, isHeritage: false, group: 'F' },

  // Group G
  { id: 'BRA', name: 'Brazil', elo: 2020, isHost: false, isHeritage: true, group: 'G' },
  { id: 'NED', name: 'Netherlands', elo: 1950, isHost: false, isHeritage: false, group: 'G' },
  { id: 'SEN', name: 'Senegal', elo: 1720, isHost: false, isHeritage: false, group: 'G' },
  { id: 'JAM', name: 'Jamaica', elo: 1540, isHost: false, isHeritage: false, group: 'G' },

  // Group H
  { id: 'ENG', name: 'England', elo: 1990, isHost: false, isHeritage: true, group: 'H' },
  { id: 'URU', name: 'Uruguay', elo: 1880, isHost: false, isHeritage: true, group: 'H' },
  { id: 'KOR', name: 'South Korea', elo: 1760, isHost: false, isHeritage: false, group: 'H' },
  { id: 'CRC', name: 'Costa Rica', elo: 1580, isHost: false, isHeritage: false, group: 'H' },

  // Group I
  { id: 'POR', name: 'Portugal', elo: 1980, isHost: false, isHeritage: false, group: 'I' },
  { id: 'JPN', name: 'Japan', elo: 1830, isHost: false, isHeritage: false, group: 'I' },
  { id: 'AUT', name: 'Austria', elo: 1770, isHost: false, isHeritage: false, group: 'I' },
  { id: 'TUN', name: 'Tunisia', elo: 1610, isHost: false, isHeritage: false, group: 'I' },

  // Group J
  { id: 'ITA', name: 'Italy', elo: 1960, isHost: false, isHeritage: true, group: 'J' },
  { id: 'GER', name: 'Germany', elo: 1920, isHost: false, isHeritage: true, group: 'J' },
  { id: 'CHI', name: 'Chile', elo: 1730, isHost: false, isHeritage: false, group: 'J' },
  { id: 'IRN', name: 'Iran', elo: 1650, isHost: false, isHeritage: false, group: 'J' },

  // Group K
  { id: 'ESP', name: 'Spain', elo: 2010, isHost: false, isHeritage: true, group: 'K' },
  { id: 'PER', name: 'Peru', elo: 1710, isHost: false, isHeritage: false, group: 'K' },
  { id: 'NGA', name: 'Nigeria', elo: 1660, isHost: false, isHeritage: false, group: 'K' },
  { id: 'AUS', name: 'Australia', elo: 1680, isHost: false, isHeritage: false, group: 'K' },

  // Group L
  { id: 'TUR', name: 'Turkey', elo: 1780, isHost: false, isHeritage: false, group: 'L' },
  { id: 'HUN', name: 'Hungary', elo: 1790, isHost: false, isHeritage: false, group: 'L' },
  { id: 'CIV', name: 'Ivory Coast', elo: 1680, isHost: false, isHeritage: false, group: 'L' },
  { id: 'RSA', name: 'South Africa', elo: 1590, isHost: false, isHeritage: false, group: 'L' },
];

// 1. Trio DNA Strength Adjustment Formula
export function adjustEloForTrioDNA(
  baseElo: number,
  isHost: boolean,
  isHeritage: boolean,
  homeSlider: number,
  heritageSlider: number
): number {
  const hostBoost = isHost ? (homeSlider / 10) * 150 : 0;
  const heritageBoost = isHeritage ? (heritageSlider / 10) * 140 : 0;
  return baseElo + hostBoost + heritageBoost;
}

// 2. Win-Draw-Loss Probability Calculator (using Chaos Thermodynamic scale)
export function calculateMatchProbability(eloA: number, eloB: number, chaos: number) {
  const chaosScale = 1 + (chaos / 10) * 1.5;
  const expWinA = 1 / (1 + Math.pow(10, (eloB - eloA) / (400 * chaosScale)));
  const probDraw = 0.26 * Math.exp(-Math.pow((eloA - eloB) / 300, 2));
  const probA = expWinA * (1 - probDraw);
  const probB = (1 - expWinA) * (1 - probDraw);
  return { probA, probB, probDraw };
}

// Helper for generating Poisson random number
function poissonRandom(lambda: number): number {
  const L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

// 3. Poisson Goals Generator with Outcome Alignment
export function simulateMatchGoals(eloA: number, eloB: number, outcome: 'win' | 'loss' | 'draw'): { goalsA: number, goalsB: number } {
  const lambdaA = Math.max(0.2, 1.3 + (eloA - eloB) / 400);
  const lambdaB = Math.max(0.2, 1.3 + (eloB - eloA) / 400);

  let goalsA = poissonRandom(lambdaA);
  let goalsB = poissonRandom(lambdaB);

  // Resolve Poisson contradiction with outcome space
  if (outcome === 'win' && goalsA <= goalsB) {
    goalsA = goalsB + 1;
  } else if (outcome === 'loss' && goalsB <= goalsA) {
    goalsB = goalsA + 1;
  } else if (outcome === 'draw' && goalsA !== goalsB) {
    const avg = Math.round((goalsA + goalsB) / 2);
    goalsA = avg;
    goalsB = avg;
  }

  return { goalsA, goalsB };
}

// 4. FIFA Group Stage Standings Sorter
export function rankGroup(teams: Team[], matches: MatchResult[]): Team[] {
  const standings = teams.map(t => ({ ...t, points: 0, gd: 0, goalsFor: 0 }));

  matches.forEach(m => {
    const tA = standings.find(t => t.id === m.teamA)!;
    const tB = standings.find(t => t.id === m.teamB)!;

    tA.goalsFor += m.goalsA;
    tB.goalsFor += m.goalsB;
    tA.gd += (m.goalsA - m.goalsB);
    tB.gd += (m.goalsB - m.goalsA);

    if (m.goalsA > m.goalsB) {
      tA.points += 3;
    } else if (m.goalsA < m.goalsB) {
      tB.points += 3;
    } else {
      tA.points += 1;
      tB.points += 1;
    }
  });

  return standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.goalsFor - a.goalsFor; // Simplified (excluding head-to-head mapping)
  });
}

// 5. 2026 Best 3rd-Places filtering
export function selectBestThirdPlaces(thirdPlaces: Team[]): Team[] {
  return [...thirdPlaces].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.goalsFor - a.goalsFor;
  }).slice(0, 8);
}

// 6. 32-Team Elimination Bracket
export function simulateKnockoutBracket(teams: { id: string, name: string, elo: number }[]): { id: string, name: string, elo: number } {
  let currentRound = [...teams];
  while (currentRound.length > 1) {
    const nextRound: typeof currentRound = [];
    for (let i = 0; i < currentRound.length; i += 2) {
      const teamA = currentRound[i];
      const teamB = currentRound[i+1];
      // Calculate standard probability to determine winner
      const expWinA = 1 / (1 + Math.pow(10, (teamB.elo - teamA.elo) / 400));
      const winner = Math.random() < expWinA ? teamA : teamB;
      nextRound.push(winner);
    }
    currentRound = nextRound;
  }
  return currentRound[0];
}

// 7. Full World Cup Tournament Simulation
export function simulateFullTournament(
  homeSlider: number,
  heritageSlider: number,
  chaosSlider: number
): {
  champion: BaseTeam;
  runnerUp: BaseTeam;
  semiFinalists: BaseTeam[];
  quarterFinalists: BaseTeam[];
  roundOf16: BaseTeam[];
  roundOf32: BaseTeam[];
  groupStageExit: BaseTeam[];
} {
  // Step 1: Adjust Elo ratings
  const teamsMap = new Map<string, { id: string, name: string, elo: number, base: BaseTeam }>();
  BASE_TEAMS.forEach(bt => {
    const adjustedElo = adjustEloForTrioDNA(bt.elo, bt.isHost, bt.isHeritage, homeSlider, heritageSlider);
    teamsMap.set(bt.id, { id: bt.id, name: bt.name, elo: adjustedElo, base: bt });
  });

  // Step 2: Group Stage Simulation
  const groups = new Map<string, string[]>(); // groupName -> teamIds
  BASE_TEAMS.forEach(bt => {
    if (!groups.has(bt.group)) {
      groups.set(bt.group, []);
    }
    groups.get(bt.group)!.push(bt.id);
  });

  const groupStandings = new Map<string, Team[]>();
  const thirdPlaceTeams: Team[] = [];

  groups.forEach((teamIds, groupName) => {
    const groupTeams: Team[] = teamIds.map(id => ({
      id,
      name: teamsMap.get(id)!.name,
      elo: teamsMap.get(id)!.elo,
      points: 0,
      gd: 0,
      goalsFor: 0
    }));

    const groupMatches: MatchResult[] = [];
    // Round-robin matches
    for (let i = 0; i < teamIds.length; i++) {
      for (let j = i + 1; j < teamIds.length; j++) {
        const teamA = groupTeams[i];
        const teamB = groupTeams[j];

        const { probA, probB } = calculateMatchProbability(teamA.elo, teamB.elo, chaosSlider);
        const r = Math.random();
        let outcome: 'win' | 'loss' | 'draw' = 'draw';
        if (r < probA) {
          outcome = 'win';
        } else if (r < probA + probB) {
          outcome = 'loss';
        }

        const goals = simulateMatchGoals(teamA.elo, teamB.elo, outcome);
        groupMatches.push({
          teamA: teamA.id,
          teamB: teamB.id,
          goalsA: goals.goalsA,
          goalsB: goals.goalsB
        });
      }
    }

    const ranked = rankGroup(groupTeams, groupMatches);
    groupStandings.set(groupName, ranked);
    thirdPlaceTeams.push(ranked[2]); // 3rd placed team
  });

  // Step 3: Select qualified teams
  const top2Teams: Team[] = [];
  groupStandings.forEach(ranked => {
    top2Teams.push(ranked[0]);
    top2Teams.push(ranked[1]);
  });

  const best3rdTeams = selectBestThirdPlaces(thirdPlaceTeams);
  const best3rdIds = new Set(best3rdTeams.map(t => t.id));

  const groupStageExit: BaseTeam[] = [];
  groupStandings.forEach(ranked => {
    // 4th place exits
    groupStageExit.push(teamsMap.get(ranked[3].id)!.base);
    // 3rd place that didn't qualify exits
    if (!best3rdIds.has(ranked[2].id)) {
      groupStageExit.push(teamsMap.get(ranked[2].id)!.base);
    }
  });

  // Combine top 2 from each group + 8 best third places to get 32 teams
  const qualifiedForKnockout = [...top2Teams, ...best3rdTeams].map(t => teamsMap.get(t.id)!);

  // Step 4: Knockout stage
  // For simplicity and alignment with bracket size, we pair them.
  // Note: Standard 2026 bracket mapping would be Winner A vs 3rd C/D/I/J etc.,
  // but to preserve exact deterministic tree size of 32 -> 16 -> 8 -> 4 -> 2 -> 1
  // we can shuffle or pair them logically (e.g. Winner A vs Runner-up B, etc.)
  // Let's pair them in a simple order or simulate bracket.
  // We pair:
  // - Winner Group A vs Runner B, Winner B vs Runner A, etc. (24 teams)
  // - Best 3rd places matched against remaining Winners.
  // To avoid complex group constraints during Monte Carlo iteration, we pair the 32 teams sequentially:
  // (Qualified are 32 teams: 24 top2 + 8 best3rd)
  // Let's shuffle/sort them to make sure group stage rematches are less frequent, or pair Winner G1 vs Runner G2, etc.
  // Let's do a simple pairwise match simulation.
  let currentRound = [...qualifiedForKnockout];
  
  // Track exits at each round
  const roundOf32Exits: BaseTeam[] = [];
  const roundOf16Exits: BaseTeam[] = [];
  const quarterFinalExits: BaseTeam[] = [];
  const semiFinalExits: BaseTeam[] = [];

  // Round of 32
  let nextRound: typeof currentRound = [];
  for (let i = 0; i < currentRound.length; i += 2) {
    const teamA = currentRound[i];
    const teamB = currentRound[i+1];
    const expWinA = 1 / (1 + Math.pow(10, (teamB.elo - teamA.elo) / 400));
    const winner = Math.random() < expWinA ? teamA : teamB;
    const loser = winner.id === teamA.id ? teamB : teamA;
    nextRound.push(winner);
    roundOf32Exits.push(loser.base);
  }
  currentRound = nextRound;

  // Round of 16
  nextRound = [];
  for (let i = 0; i < currentRound.length; i += 2) {
    const teamA = currentRound[i];
    const teamB = currentRound[i+1];
    const expWinA = 1 / (1 + Math.pow(10, (teamB.elo - teamA.elo) / 400));
    const winner = Math.random() < expWinA ? teamA : teamB;
    const loser = winner.id === teamA.id ? teamB : teamA;
    nextRound.push(winner);
    roundOf16Exits.push(loser.base);
  }
  currentRound = nextRound;

  // Quarter-Finals
  nextRound = [];
  for (let i = 0; i < currentRound.length; i += 2) {
    const teamA = currentRound[i];
    const teamB = currentRound[i+1];
    const expWinA = 1 / (1 + Math.pow(10, (teamB.elo - teamA.elo) / 400));
    const winner = Math.random() < expWinA ? teamA : teamB;
    const loser = winner.id === teamA.id ? teamB : teamA;
    nextRound.push(winner);
    quarterFinalExits.push(loser.base);
  }
  currentRound = nextRound;

  // Semi-Finals
  nextRound = [];
  for (let i = 0; i < currentRound.length; i += 2) {
    const teamA = currentRound[i];
    const teamB = currentRound[i+1];
    const expWinA = 1 / (1 + Math.pow(10, (teamB.elo - teamA.elo) / 400));
    const winner = Math.random() < expWinA ? teamA : teamB;
    const loser = winner.id === teamA.id ? teamB : teamA;
    nextRound.push(winner);
    semiFinalExits.push(loser.base);
  }
  currentRound = nextRound;

  // Final
  const teamA = currentRound[0];
  const teamB = currentRound[1];
  const expWinA = 1 / (1 + Math.pow(10, (teamB.elo - teamA.elo) / 400));
  const champion = Math.random() < expWinA ? teamA : teamB;
  const runnerUp = champion.id === teamA.id ? teamB : teamA;

  return {
    champion: champion.base,
    runnerUp: runnerUp.base,
    semiFinalists: semiFinalExits,
    quarterFinalists: quarterFinalExits,
    roundOf16: roundOf16Exits,
    roundOf32: roundOf32Exits,
    groupStageExit: groupStageExit,
  };
}
