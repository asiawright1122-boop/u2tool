export interface Match {
  id: string;
  stage: 'group' | 'knockout';
  group?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
}

export interface TeamStanding {
  id: string;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number; // Goals For / Goals Scored
  ga: number; // Goals Against
  gd: number; // Goal Difference
  fifaRank: number;
}

/**
 * Helper to check if a match has valid played scores
 */
function isMatchPlayed(m: Match): boolean {
  return (
    m.homeScore !== null &&
    m.homeScore !== undefined &&
    String(m.homeScore) !== '' &&
    m.awayScore !== null &&
    m.awayScore !== undefined &&
    String(m.awayScore) !== ''
  );
}

/**
 * Computes group standings for a given group of teams.
 */
export function computeGroupStandings(
  group: string,
  teams: string[],
  matches: Match[],
  fifaRankings: Record<string, number>,
  customTiesOverride?: string[] | Record<string, string[]>
): TeamStanding[] {
  // Resolve custom overrides for this specific group
  let overrides: string[] | undefined = undefined;
  if (customTiesOverride) {
    if (Array.isArray(customTiesOverride)) {
      overrides = customTiesOverride;
    } else if (typeof customTiesOverride === 'object') {
      overrides = (customTiesOverride as Record<string, string[]>)[group];
    }
  }

  // Filter matches played between the teams in this group
  const groupMatches = matches.filter(
    m => teams.includes(m.homeTeam) && teams.includes(m.awayTeam)
  );

  // Initialize standings map
  const standingsMap: Record<string, TeamStanding> = {};
  for (const tid of teams) {
    standingsMap[tid] = {
      id: tid,
      points: 0,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      fifaRank: fifaRankings[tid] || 999
    };
  }

  // Calculate overall statistics
  for (const m of groupMatches) {
    if (!isMatchPlayed(m)) continue;
    const home = standingsMap[m.homeTeam];
    const away = standingsMap[m.awayTeam];
    if (!home || !away) continue;

    const hs = Number(m.homeScore);
    const as = Number(m.awayScore);

    home.played++;
    away.played++;
    home.gf += hs;
    away.gf += as;
    home.ga += as;
    away.ga += hs;
    home.gd += hs - as;
    away.gd += as - hs;

    if (hs > as) {
      home.points += 3;
      home.won++;
      away.lost++;
    } else if (hs < as) {
      away.points += 3;
      away.won++;
      home.lost++;
    } else {
      home.points += 1;
      away.points += 1;
      home.drawn++;
      away.drawn++;
    }
  }

  // Safety defense: check if any match was actually played
  const totalPlayed = Object.values(standingsMap).reduce((sum, s) => sum + s.played, 0);
  if (totalPlayed === 0) {
    const sortedIds = [...teams].sort((a, b) => {
      if (overrides) {
        const idxA = overrides.indexOf(a);
        const idxB = overrides.indexOf(b);
        const valA = idxA === -1 ? 999 : idxA;
        const valB = idxB === -1 ? 999 : idxB;
        if (valA !== valB) return valA - valB;
      }
      const rankA = fifaRankings[a] || 999;
      const rankB = fifaRankings[b] || 999;
      if (rankA !== rankB) return rankA - rankB;
      return a.localeCompare(b);
    });
    return sortedIds.map(tid => standingsMap[tid]);
  }

  // Recursive partition function for resolving ties
  function sortSubset(subset: string[], level: 'h2h' | 'overall' | 'fallback'): string[] {
    if (subset.length <= 1) return subset;

    if (level === 'h2h') {
      const miniStats: Record<string, { points: number; gd: number; gf: number }> = {};
      for (const tid of subset) {
        miniStats[tid] = { points: 0, gd: 0, gf: 0 };
      }

      // Compute mini-league statistics for subset
      for (const m of groupMatches) {
        if (!isMatchPlayed(m)) continue;
        if (subset.includes(m.homeTeam) && subset.includes(m.awayTeam)) {
          const hs = Number(m.homeScore);
          const as = Number(m.awayScore);
          const hStats = miniStats[m.homeTeam];
          const aStats = miniStats[m.awayTeam];

          hStats.gf += hs;
          aStats.gf += as;
          hStats.gd += hs - as;
          aStats.gd += as - hs;

          if (hs > as) {
            hStats.points += 3;
          } else if (hs < as) {
            aStats.points += 3;
          } else {
            hStats.points += 1;
            aStats.points += 1;
          }
        }
      }

      // Sort by H2H stats
      const sorted = [...subset].sort((a, b) => {
        const sA = miniStats[a];
        const sB = miniStats[b];
        if (sB.points !== sA.points) return sB.points - sA.points;
        if (sB.gd !== sA.gd) return sB.gd - sA.gd;
        if (sB.gf !== sA.gf) return sB.gf - sA.gf;
        return 0;
      });

      // Partition into groups with identical H2H stats
      const groups: string[][] = [];
      let currentGroup: string[] = [sorted[0]];

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const sPrev = miniStats[prev];
        const sCurr = miniStats[curr];

        if (
          sPrev.points === sCurr.points &&
          sPrev.gd === sCurr.gd &&
          sPrev.gf === sCurr.gf
        ) {
          currentGroup.push(curr);
        } else {
          groups.push(currentGroup);
          currentGroup = [curr];
        }
      }
      groups.push(currentGroup);

      // If no ties were broken (only one partition containing all subset items), move to overall
      if (groups.length === 1 && groups[0].length === subset.length) {
        return sortSubset(subset, 'overall');
      }

      // Recursively resolve each subgroup
      let result: string[] = [];
      for (const g of groups) {
        result = result.concat(sortSubset(g, 'h2h'));
      }
      return result;
    }

    if (level === 'overall') {
      // Sort by overall GD, then overall GS
      const sorted = [...subset].sort((a, b) => {
        const sA = standingsMap[a];
        const sB = standingsMap[b];
        if (sB.gd !== sA.gd) return sB.gd - sA.gd;
        if (sB.gf !== sA.gf) return sB.gf - sA.gf;
        return 0;
      });

      const groups: string[][] = [];
      let currentGroup: string[] = [sorted[0]];

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1];
        const curr = sorted[i];
        const sPrev = standingsMap[prev];
        const sCurr = standingsMap[curr];

        if (sPrev.gd === sCurr.gd && sPrev.gf === sCurr.gf) {
          currentGroup.push(curr);
        } else {
          groups.push(currentGroup);
          currentGroup = [curr];
        }
      }
      groups.push(currentGroup);

      if (groups.length === 1 && groups[0].length === subset.length) {
        return sortSubset(subset, 'fallback');
      }

      let result: string[] = [];
      for (const g of groups) {
        result = result.concat(sortSubset(g, 'fallback'));
      }
      return result;
    }

    // Fallback level: custom override, FIFA rank, alphabetical ID
    return [...subset].sort((a, b) => {
      if (overrides) {
        const idxA = overrides.indexOf(a);
        const idxB = overrides.indexOf(b);
        const valA = idxA === -1 ? 999 : idxA;
        const valB = idxB === -1 ? 999 : idxB;
        if (valA !== valB) return valA - valB;
      }
      const rA = standingsMap[a].fifaRank;
      const rB = standingsMap[b].fifaRank;
      if (rA !== rB) return rA - rB;
      return a.localeCompare(b);
    });
  }

  // Initial group sorting by overall points
  const initialSorted = [...teams].sort((a, b) => {
    return standingsMap[b].points - standingsMap[a].points;
  });

  const groups: string[][] = [];
  let currentGroup: string[] = [initialSorted[0]];

  for (let i = 1; i < initialSorted.length; i++) {
    const prev = initialSorted[i - 1];
    const curr = initialSorted[i];
    if (standingsMap[prev].points === standingsMap[curr].points) {
      currentGroup.push(curr);
    } else {
      groups.push(currentGroup);
      currentGroup = [curr];
    }
  }
  groups.push(currentGroup);

  let finalSortedIds: string[] = [];
  for (const g of groups) {
    finalSortedIds = finalSortedIds.concat(sortSubset(g, 'h2h'));
  }

  return finalSortedIds.map(tid => standingsMap[tid]);
}

/**
 * Sorts the third-place teams across groups.
 */
export function computeThirdPlaceRankings(
  thirdPlaces: TeamStanding[],
  fifaRankings: Record<string, number>,
  customTiesOverride?: string[] | Record<string, string[]>
): TeamStanding[] {
  let overrides: string[] | undefined = undefined;
  if (customTiesOverride) {
    if (Array.isArray(customTiesOverride)) {
      overrides = customTiesOverride;
    } else if (typeof customTiesOverride === 'object') {
      overrides = (customTiesOverride as Record<string, string[]>)['3rd_ranking'];
    }
  }

  return [...thirdPlaces].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;

    // Check custom override if all footballing stats are identical
    if (overrides) {
      const idxA = overrides.indexOf(a.id);
      const idxB = overrides.indexOf(b.id);
      const valA = idxA === -1 ? 999 : idxA;
      const valB = idxB === -1 ? 999 : idxB;
      if (valA !== valB) return valA - valB;
    }

    // Fallback to FIFA ranking
    const rankA = fifaRankings[a.id] || 999;
    const rankB = fifaRankings[b.id] || 999;
    if (rankA !== rankB) return rankA - rankB;

    // Final stable fallback
    return a.id.localeCompare(b.id);
  });
}
