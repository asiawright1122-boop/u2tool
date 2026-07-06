export type WorldCupGroup = {
  id: string;
  teams: string[];
};

export type WorldCupMatch = {
  id: string;
  home: string;
  away: string;
  winner?: string;
};

export type WorldCupRound = {
  name: string;
  matches: WorldCupMatch[];
};

export type WorldCupBracketState = {
  rounds: WorldCupRound[];
};

export type WorldCupBracketResult = {
  rounds: WorldCupRound[];
  champion: string;
  summary: string;
};

const GROUP_IDS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
const ROUND_NAMES = ['Round of 32', 'Round of 16', 'Quarterfinals', 'Semifinals', 'Final'];

export const WORLD_CUP_2026_GROUPS: WorldCupGroup[] = GROUP_IDS.map((groupId) => ({
  id: groupId,
  teams: [`${groupId}1 seed`, `${groupId}2 seed`, `${groupId}3 seed`, `${groupId}4 seed`],
}));

function defaultEntrants(): string[] {
  const winners = GROUP_IDS.map((groupId) => `${groupId}1 seed`);
  const runnersUp = GROUP_IDS.map((groupId) => `${groupId}2 seed`);
  const thirdPlace = GROUP_IDS.slice(0, 8).map((groupId) => `${groupId}3 seed`);
  return [...winners, ...runnersUp, ...thirdPlace];
}

function buildMatches(roundName: string, entrants: string[], roundIndex: number): WorldCupMatch[] {
  const matches: WorldCupMatch[] = [];
  for (let index = 0; index < entrants.length; index += 2) {
    matches.push({
      id: `${roundName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index / 2 + 1}`,
      home: entrants[index],
      away: entrants[index + 1],
    });
  }

  return matches.map((match, index) => ({
    ...match,
    id: `${ROUND_NAMES[roundIndex].toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`,
  }));
}

export function buildDefaultBracket(): WorldCupBracketState {
  return {
    rounds: ROUND_NAMES.map((name, index) => ({
      name,
      matches: index === 0 ? buildMatches(name, defaultEntrants(), 0) : [],
    })),
  };
}

function pickWinner(match: WorldCupMatch, picks: Record<string, string>): string {
  const selected = picks[match.id];
  if (selected === match.home || selected === match.away) {
    return selected;
  }
  return match.home;
}

export function advanceBracket(state: WorldCupBracketState, picks: Record<string, string>): WorldCupBracketResult {
  const rounds: WorldCupRound[] = [];
  let currentMatches = state.rounds[0]?.matches || [];

  for (let roundIndex = 0; roundIndex < ROUND_NAMES.length; roundIndex += 1) {
    const name = ROUND_NAMES[roundIndex];
    const matches = currentMatches.map((match) => ({
      ...match,
      winner: pickWinner(match, picks),
    }));
    rounds.push({ name, matches });

    if (matches.length === 1) {
      break;
    }

    const winners = matches.map((match) => match.winner || match.home);
    currentMatches = buildMatches(ROUND_NAMES[roundIndex + 1], winners, roundIndex + 1);
  }

  const finalRound = rounds.at(-1);
  const champion = finalRound?.matches[0]?.winner || finalRound?.matches[0]?.home || '';
  const summary = [
    ...rounds.map((round) => `${round.name}: ${round.matches.map((match) => match.winner || match.home).join(', ')}`),
    `Champion: ${champion}`,
  ].join('\n');

  return {
    rounds,
    champion,
    summary,
  };
}
