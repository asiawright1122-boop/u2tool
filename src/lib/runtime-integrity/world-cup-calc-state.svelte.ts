import scheduleData from '../data/world-cup-schedule.json';
import fifaRankingsData from '../data/fifa-rankings.json';
import combinationsData from '../data/world-cup-3rd-combinations.json';
import { computeGroupStandings, computeThirdPlaceRankings, type Match, type TeamStanding } from './world-cup-calculator-engine';

export class WorldCupCalcState {
  matches = $state<Match[]>([]);
  customTiesOverride = $state<Record<string, string[]>>({});
  predictedWinners = $state<Record<string, string>>({});

  groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  constructor() {
    this.reset();
  }

  reset() {
    this.matches = JSON.parse(JSON.stringify(scheduleData)).map((m: any) => ({
      ...m,
      homeScore: null,
      awayScore: null
    }));
    this.customTiesOverride = {};
    this.predictedWinners = {};
  }

  loadFromState(data: { matches: Match[], customTiesOverride: Record<string, string[]>, predictedWinners: Record<string, string> }) {
    if (data.matches) {
      data.matches.forEach(loadedM => {
        const m = this.matches.find(x => x.id === loadedM.id);
        if (m) {
          m.homeScore = loadedM.homeScore;
          m.awayScore = loadedM.awayScore;
        }
      });
    }
    if (data.customTiesOverride) {
      this.customTiesOverride = { ...data.customTiesOverride };
    }
    if (data.predictedWinners) {
      this.predictedWinners = { ...data.predictedWinners };
    }
  }

  saveState() {
    return {
      matches: this.matches.map(m => ({ id: m.id, homeScore: m.homeScore, awayScore: m.awayScore })),
      customTiesOverride: $state.snapshot(this.customTiesOverride),
      predictedWinners: $state.snapshot(this.predictedWinners)
    };
  }

  updateScore(matchId: string, homeScore: number | null, awayScore: number | null) {
    const m = this.matches.find(x => x.id === matchId);
    if (m) {
      m.homeScore = homeScore === null || homeScore === undefined || isNaN(Number(homeScore)) ? null : Number(homeScore);
      m.awayScore = awayScore === null || awayScore === undefined || isNaN(Number(awayScore)) ? null : Number(awayScore);
    }
    this.cleanupGhostPredictions();
  }

  predictWinner(matchId: string, teamId: string | null) {
    if (!teamId) {
      delete this.predictedWinners[matchId];
    } else {
      this.predictedWinners[matchId] = teamId;
    }
    this.predictedWinners = { ...this.predictedWinners };
    this.cleanupGhostPredictions();
  }

  swapStandings(group: string, index1: number, index2: number) {
    const standings = this.groupStandings[group];
    if (!standings || standings.length < 4) return;
    
    const teamIds = standings.map(t => t.id);
    const temp = teamIds[index1];
    teamIds[index1] = teamIds[index2];
    teamIds[index2] = temp;

    this.customTiesOverride[group] = teamIds;
    this.customTiesOverride = { ...this.customTiesOverride };
    this.cleanupGhostPredictions();
  }

  swapThirdPlace(index1: number, index2: number) {
    const rankings = this.thirdPlaceRankings;
    if (!rankings || rankings.length < 12) return;

    const teamIds = rankings.map(t => t.id);
    const temp = teamIds[index1];
    teamIds[index1] = teamIds[index2];
    teamIds[index2] = temp;

    this.customTiesOverride['3rd_ranking'] = teamIds;
    this.customTiesOverride = { ...this.customTiesOverride };
    this.cleanupGhostPredictions();
  }

  // 辅助获取指定组指定名次的球队 ID
  getTeamByPosition(group: string, rank: number): string {
    const standings = this.groupStandings[group];
    if (standings && standings[rank - 1]) {
      return standings[rank - 1].id;
    }
    return '';
  }

  // 小组所有球队映射
  get groupTeamsMap() {
    const map: Record<string, string[]> = {};
    for (const g of this.groups) {
      map[g] = [];
    }
    for (const m of this.matches) {
      if (m.stage === 'group' && m.group) {
        if (!map[m.group].includes(m.homeTeam)) map[m.group].push(m.homeTeam);
        if (!map[m.group].includes(m.awayTeam)) map[m.group].push(m.awayTeam);
      }
    }
    return map;
  }

  // 衍生：小组积分榜
  get groupStandings() {
    const standings: Record<string, TeamStanding[]> = {};
    for (const g of this.groups) {
      const teams = this.groupTeamsMap[g] || [];
      standings[g] = computeGroupStandings(
        g,
        teams,
        this.matches,
        fifaRankingsData as Record<string, number>,
        this.customTiesOverride
      );
    }
    return standings;
  }

  // 衍生：12个组的第三名
  get thirdPlaceTeams() {
    const list: TeamStanding[] = [];
    for (const g of this.groups) {
      const standings = this.groupStandings[g];
      if (standings && standings.length >= 3) {
        list.push(standings[2]);
      }
    }
    return list;
  }

  // 衍生：最好第三名大排名
  get thirdPlaceRankings() {
    return computeThirdPlaceRankings(
      this.thirdPlaceTeams,
      fifaRankingsData as Record<string, number>,
      this.customTiesOverride
    );
  }

  // 衍生：最好第3名的小组字母组合Key
  get qualifiedThirdPlaceGroupsKey() {
    const top8 = this.thirdPlaceRankings.slice(0, 8);
    const teamToGroup: Record<string, string> = {};
    for (const g of this.groups) {
      const teams = this.groupTeamsMap[g] || [];
      for (const t of teams) {
        teamToGroup[t] = g;
      }
    }
    const groupLetters = top8.map(t => teamToGroup[t.id]).filter(Boolean);
    groupLetters.sort();
    return groupLetters.join('');
  }

  // 衍生：第三名组合映射
  get thirdPlaceCombinationsMapping() {
    const key = this.qualifiedThirdPlaceGroupsKey;
    if (key.length === 8) {
      const mapping = (combinationsData as Record<string, Record<string, string>>)[key];
      if (mapping) {
        return mapping;
      }
    }
    return null;
  }

  // 衍生：淘汰赛对阵树（同时进行级联重置计算）
  get knockoutBracket() {
    const activeWinners: Record<string, string> = {};
    const matchesMap: Record<string, { id: string; stage: string; homeTeam: string; awayTeam: string; placeholderHome: string; placeholderAway: string; winner: string | null }> = {};

    const get3rdTeam = (slot: string) => {
      const mapping = this.thirdPlaceCombinationsMapping;
      if (mapping && mapping[slot]) {
        const val = mapping[slot]; // 比如 "3E"
        const groupLetter = val.charAt(1);
        return this.getTeamByPosition(groupLetter, 3);
      }
      return '';
    };

    // 1. R32
    const r32Config: Record<string, { h: () => string; a: () => string; ph: string; pa: string }> = {
      M73: { h: () => this.getTeamByPosition('A', 1), a: () => this.getTeamByPosition('B', 2), ph: '1A', pa: '2B' },
      M74: { h: () => this.getTeamByPosition('B', 1), a: () => this.getTeamByPosition('A', 2), ph: '1B', pa: '2A' },
      M75: { h: () => this.getTeamByPosition('C', 1), a: () => get3rdTeam('M75'), ph: '1C', pa: '3rd D/E/F' },
      M76: { h: () => this.getTeamByPosition('D', 1), a: () => get3rdTeam('M76'), ph: '1D', pa: '3rd A/B/C' },
      M77: { h: () => this.getTeamByPosition('E', 1), a: () => this.getTeamByPosition('F', 2), ph: '1E', pa: '2F' },
      M78: { h: () => this.getTeamByPosition('F', 1), a: () => this.getTeamByPosition('E', 2), ph: '1F', pa: '2E' },
      M79: { h: () => this.getTeamByPosition('G', 1), a: () => this.getTeamByPosition('H', 2), ph: '1G', pa: '2H' },
      M80: { h: () => this.getTeamByPosition('H', 1), a: () => this.getTeamByPosition('G', 2), ph: '1H', pa: '2G' },
      M81: { h: () => this.getTeamByPosition('I', 1), a: () => get3rdTeam('M81'), ph: '1I', pa: '3rd J/K/L' },
      M82: { h: () => this.getTeamByPosition('J', 1), a: () => get3rdTeam('M82'), ph: '1J', pa: '3rd G/H/I' },
      M83: { h: () => this.getTeamByPosition('K', 1), a: () => this.getTeamByPosition('L', 2), ph: '1K', pa: '2L' },
      M84: { h: () => this.getTeamByPosition('L', 1), a: () => this.getTeamByPosition('K', 2), ph: '1L', pa: '2K' },
      M85: { h: () => this.getTeamByPosition('C', 2), a: () => this.getTeamByPosition('D', 2), ph: '2C', pa: '2D' },
      M86: { h: () => this.getTeamByPosition('I', 2), a: () => this.getTeamByPosition('J', 2), ph: '2I', pa: '2J' },
      M87: { h: () => get3rdTeam('M87_H'), a: () => get3rdTeam('M87_A'), ph: '3rd D/E/F', pa: '3rd G/H/I' },
      M88: { h: () => get3rdTeam('M88_H'), a: () => get3rdTeam('M88_A'), ph: '3rd A/B/C', pa: '3rd J/K/L' }
    };

    for (const [id, cfg] of Object.entries(r32Config)) {
      const h = cfg.h();
      const a = cfg.a();
      const pred = this.predictedWinners[id];
      const validWinner = pred && (pred === h || pred === a) ? pred : null;
      if (validWinner) {
        activeWinners[id] = validWinner;
      }
      matchesMap[id] = {
        id,
        stage: 'r32',
        homeTeam: h,
        awayTeam: a,
        placeholderHome: cfg.ph,
        placeholderAway: cfg.pa,
        winner: validWinner
      };
    }

    // 2. R16
    const r16Config: Record<string, { hSrc: string; aSrc: string; ph: string; pa: string }> = {
      M89: { hSrc: 'M73', aSrc: 'M74', ph: 'Winner M73', pa: 'Winner M74' },
      M90: { hSrc: 'M75', aSrc: 'M76', ph: 'Winner M75', pa: 'Winner M76' },
      M91: { hSrc: 'M77', aSrc: 'M78', ph: 'Winner M77', pa: 'Winner M78' },
      M92: { hSrc: 'M79', aSrc: 'M80', ph: 'Winner M79', pa: 'Winner M80' },
      M93: { hSrc: 'M81', aSrc: 'M82', ph: 'Winner M81', pa: 'Winner M82' },
      M94: { hSrc: 'M83', aSrc: 'M84', ph: 'Winner M83', pa: 'Winner M84' },
      M95: { hSrc: 'M85', aSrc: 'M86', ph: 'Winner M85', pa: 'Winner M86' },
      M96: { hSrc: 'M87', aSrc: 'M88', ph: 'Winner M87', pa: 'Winner M88' }
    };

    for (const [id, cfg] of Object.entries(r16Config)) {
      const h = activeWinners[cfg.hSrc] || '';
      const a = activeWinners[cfg.aSrc] || '';
      const pred = this.predictedWinners[id];
      const validWinner = pred && (pred === h || pred === a) ? pred : null;
      if (validWinner) {
        activeWinners[id] = validWinner;
      }
      matchesMap[id] = {
        id,
        stage: 'r16',
        homeTeam: h,
        awayTeam: a,
        placeholderHome: cfg.ph,
        placeholderAway: cfg.pa,
        winner: validWinner
      };
    }

    // 3. QF
    const qfConfig: Record<string, { hSrc: string; aSrc: string; ph: string; pa: string }> = {
      M97: { hSrc: 'M89', aSrc: 'M90', ph: 'Winner M89', pa: 'Winner M90' },
      M98: { hSrc: 'M91', aSrc: 'M92', ph: 'Winner M91', pa: 'Winner M92' },
      M99: { hSrc: 'M93', aSrc: 'M94', ph: 'Winner M93', pa: 'Winner M94' },
      M100: { hSrc: 'M95', aSrc: 'M96', ph: 'Winner M95', pa: 'Winner M96' }
    };

    for (const [id, cfg] of Object.entries(qfConfig)) {
      const h = activeWinners[cfg.hSrc] || '';
      const a = activeWinners[cfg.aSrc] || '';
      const pred = this.predictedWinners[id];
      const validWinner = pred && (pred === h || pred === a) ? pred : null;
      if (validWinner) {
        activeWinners[id] = validWinner;
      }
      matchesMap[id] = {
        id,
        stage: 'qf',
        homeTeam: h,
        awayTeam: a,
        placeholderHome: cfg.ph,
        placeholderAway: cfg.pa,
        winner: validWinner
      };
    }

    // 4. SF
    const sfConfig: Record<string, { hSrc: string; aSrc: string; ph: string; pa: string }> = {
      M101: { hSrc: 'M97', aSrc: 'M98', ph: 'Winner M97', pa: 'Winner M98' },
      M102: { hSrc: 'M99', aSrc: 'M100', ph: 'Winner M99', pa: 'Winner M100' }
    };

    for (const [id, cfg] of Object.entries(sfConfig)) {
      const h = activeWinners[cfg.hSrc] || '';
      const a = activeWinners[cfg.aSrc] || '';
      const pred = this.predictedWinners[id];
      const validWinner = pred && (pred === h || pred === a) ? pred : null;
      if (validWinner) {
        activeWinners[id] = validWinner;
      }
      matchesMap[id] = {
        id,
        stage: 'sf',
        homeTeam: h,
        awayTeam: a,
        placeholderHome: cfg.ph,
        placeholderAway: cfg.pa,
        winner: validWinner
      };
    }

    // 5. Third-place match
    const getSfLoser = (sfId: string) => {
      const sf = matchesMap[sfId];
      if (sf && sf.homeTeam && sf.awayTeam && sf.winner) {
        return sf.winner === sf.homeTeam ? sf.awayTeam : sf.homeTeam;
      }
      return '';
    };

    const h103 = getSfLoser('M101');
    const a103 = getSfLoser('M102');
    const pred103 = this.predictedWinners['M103'];
    const validWinner103 = pred103 && (pred103 === h103 || pred103 === a103) ? pred103 : null;

    matchesMap['M103'] = {
      id: 'M103',
      stage: 'third',
      homeTeam: h103,
      awayTeam: a103,
      placeholderHome: 'Loser M101',
      placeholderAway: 'Loser M102',
      winner: validWinner103
    };

    // 6. Final
    const h104 = activeWinners['M101'] || '';
    const a104 = activeWinners['M102'] || '';
    const pred104 = this.predictedWinners['M104'];
    const validWinner104 = pred104 && (pred104 === h104 || pred104 === a104) ? pred104 : null;

    matchesMap['M104'] = {
      id: 'M104',
      stage: 'final',
      homeTeam: h104,
      awayTeam: a104,
      placeholderHome: 'Winner M101',
      placeholderAway: 'Winner M102',
      winner: validWinner104
    };

    return {
      matchesMap,
      activeWinners
    };
  }

  cleanupGhostPredictions() {
    const active = this.knockoutBracket.activeWinners;
    const m103 = this.knockoutBracket.matchesMap['M103'];
    if (m103 && m103.winner) {
      active['M103'] = m103.winner;
    }
    
    let changed = false;
    for (const key of Object.keys(this.predictedWinners)) {
      if (this.predictedWinners[key] && !active[key]) {
        delete this.predictedWinners[key];
        changed = true;
      }
    }
    if (changed) {
      this.predictedWinners = { ...this.predictedWinners };
    }
  }
}
