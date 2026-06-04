import type { APIContext } from 'astro';
import scheduleData from '../../lib/data/world-cup-schedule.json';
import { foldLine, escapeText } from '../../lib/ics-helper';
import { loadToolPageMessages } from '../../lib/translations';
import type { Locale } from '../../lib/i18n';

export interface Match {
  id: string;
  stage: 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'third' | 'final';
  group: string | null;
  utcTime: string;
  stadium: string;
  homeTeam: string;
  awayTeam: string;
  homePlaceholder: string | null;
  awayPlaceholder: string | null;
  venueCity: string;
  sequence: number;
}

const schedule = scheduleData as Match[];

// Convert Date to iCalendar standard UTC string (YYYYMMDDTHHMMSSZ)
export function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

const LOCALIZED_PLACEHOLDERS: Record<string, Record<string, string>> = {
  zh: {
    "Winner Group A": "A组第一", "Winner Group B": "B组第一", "Winner Group C": "C组第一", "Winner Group D": "D组第一",
    "Winner Group E": "E组第一", "Winner Group F": "F组第一", "Winner Group G": "G组第一", "Winner Group H": "H组第一",
    "Winner Group I": "I组第一", "Winner Group J": "J组第一", "Winner Group K": "K组第一", "Winner Group L": "L组第一",
    "Runner-up Group A": "A组第二", "Runner-up Group B": "B组第二", "Runner-up Group C": "C组第二", "Runner-up Group D": "D组第二",
    "Runner-up Group E": "E组第二", "Runner-up Group F": "F组第二", "Runner-up Group G": "G组第二", "Runner-up Group H": "H组第二",
    "Runner-up Group I": "I组第二", "Runner-up Group J": "J组第二", "Runner-up Group K": "K组第二", "Runner-up Group L": "L组第二",
    "Best 3rd Group A/B/C": "最佳小组第三 A/B/C", "Best 3rd Group D/E/F": "最佳小组第三 D/E/F",
    "Best 3rd Group G/H/I": "最佳小组第三 G/H/I", "Best 3rd Group J/K/L": "最佳小组第三 J/K/L",
    "Best 3rd Group A/B/C/D": "最佳小组第三 A/B/C/D", "Best 3rd Group E/F/G/H": "最佳小组第三 E/F/G/H",
    "Best 3rd Group I/J/K/L": "最佳小组第三 I/J/K/L", "Best 3rd Group A-H": "最佳小组第三 A-H",
    "Best 3rd Group C-J": "最佳小组第三 C-J", "Best 3rd Group E-L": "最佳小组第三 E-L"
  },
  en: {
    "Winner Group A": "Winner Group A", "Winner Group B": "Winner Group B", "Winner Group C": "Winner Group C", "Winner Group D": "Winner Group D",
    "Winner Group E": "Winner Group E", "Winner Group F": "Winner Group F", "Winner Group G": "Winner Group G", "Winner Group H": "Winner Group H",
    "Winner Group I": "Winner Group I", "Winner Group J": "Winner Group J", "Winner Group K": "Winner Group K", "Winner Group L": "Winner Group L",
    "Runner-up Group A": "Runner-up Group A", "Runner-up Group B": "Runner-up Group B", "Runner-up Group C": "Runner-up Group C", "Runner-up Group D": "Runner-up Group D",
    "Runner-up Group E": "Runner-up Group E", "Runner-up Group F": "Runner-up Group F", "Runner-up Group G": "Runner-up Group G", "Runner-up Group H": "Runner-up Group H",
    "Runner-up Group I": "Runner-up Group I", "Runner-up Group J": "Runner-up Group J", "Runner-up Group K": "Runner-up Group K", "Runner-up Group L": "Runner-up Group L"
  }
};

function translateTeam(teamCode: string, locale: string, teamsDict: any): string {
  if (!teamCode) return '';
  if (teamsDict && teamsDict[teamCode]) {
    return teamsDict[teamCode];
  }
  return teamCode;
}

function translatePlaceholder(val: string | null | undefined, locale: string, translationPlaceholders?: any): string {
  if (!val) return '';
  if (translationPlaceholders && translationPlaceholders[val]) {
    return translationPlaceholders[val];
  }
  const dict = LOCALIZED_PLACEHOLDERS[locale] || LOCALIZED_PLACEHOLDERS['en'];
  if (dict && dict[val]) {
    return dict[val];
  }
  
  // Regex translation fallback
  const matchWinner = val.match(/^Winner Group ([A-L])$/);
  if (matchWinner) {
    const grp = matchWinner[1];
    if (locale === 'zh') return `${grp}组第一`;
    if (locale === 'ja') return `グループ${grp} 1位`;
    if (locale === 'ko') return `${grp}조 1위`;
  }
  const matchRunner = val.match(/^Runner-up Group ([A-L])$/);
  if (matchRunner) {
    const grp = matchRunner[1];
    if (locale === 'zh') return `${grp}组第二`;
    if (locale === 'ja') return `グループ${grp} 2位`;
    if (locale === 'ko') return `${grp}조 2位`;
  }
  const match3rd = val.match(/^Best 3rd Group (.*)$/);
  if (match3rd) {
    const grps = match3rd[1];
    if (locale === 'zh') return `最佳小组第三 ${grps}`;
  }

  return val;
}

function getStageLabel(stage: string, locale: string, messages: any): string {
  if (stage === 'r32' && messages.r32_title) return messages.r32_title;
  if (stage === 'r16' && messages.r16_title) return messages.r16_title;
  if (stage === 'qf' && messages.qf_title) return messages.qf_title;
  if (stage === 'sf' && messages.sf_title) return messages.sf_title;
  if (stage === 'final' && messages.final_title) return messages.final_title;
  if (stage === 'third' && messages.third_place_playoff) return messages.third_place_playoff;

  switch (stage) {
    case 'r32': return 'Round of 32';
    case 'r16': return 'Round of 16';
    case 'qf': return 'Quarter-Finals';
    case 'sf': return 'Semi-Finals';
    case 'third': return 'Third-Place Playoff';
    case 'final': return 'Final';
    default: return '';
  }
}

// Generate RFC 5545 iCalendar content string
export function generateIcsContent(
  matches: Match[],
  alarmMinutes?: number,
  locale: string = 'en',
  messages: any = {}
): string {
  const dtstamp = formatIcsDate(new Date());
  
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//U2Tool//World Cup 2026 Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:FIFA World Cup 2026',
    'X-WR-TIMEZONE:UTC'
  ];

  for (const match of matches) {
    const start = new Date(match.utcTime);
    // DTEND defaults to 2 hours after DTSTART
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    const isHomeTba = match.homeTeam.startsWith('TBA');
    const isAwayTba = match.awayTeam.startsWith('TBA');

    const homeName = translateTeam(match.homeTeam, locale, messages.teams);
    const awayName = translateTeam(match.awayTeam, locale, messages.teams);

    let summary = '';
    if (match.stage === 'group') {
      const groupWord = messages.group || 'Group';
      let groupLabel = `(${groupWord} ${match.group})`;
      if (locale === 'zh') {
        groupLabel = `(${match.group}组)`;
      } else if (locale === 'ja' || locale === 'ko') {
        groupLabel = `(グループ ${match.group})`;
      }
      summary = `🏆 ${homeName} vs ${awayName} ${groupLabel}`;
    } else {
      const stageLabel = getStageLabel(match.stage, locale, messages);
      const homeLabel = isHomeTba 
        ? translatePlaceholder(match.homePlaceholder, locale, messages.placeholders) 
        : homeName;
      const awayLabel = isAwayTba 
        ? translatePlaceholder(match.awayPlaceholder, locale, messages.placeholders) 
        : awayName;
      summary = `🏆 [${stageLabel}] ${homeLabel} vs ${awayLabel}`;
    }

    let stageUpper = match.stage.toUpperCase();
    let venueWord = 'Venue';
    let genWord = 'Generated by';
    if (locale === 'zh') {
      venueWord = '比赛场馆';
      genWord = '生成自';
    }
    const description = `FIFA World Cup 2026 - ${stageUpper}\n` +
      `${venueWord}: ${match.venueCity} (${match.stadium})\n` +
      `${genWord} u2tool.com`;

    const location = `${match.venueCity}, ${match.stadium}`;

    const eventLines = [
      'BEGIN:VEVENT',
      `UID:${match.id}-2026-FIFA-U2TOOL`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART:${formatIcsDate(start)}`,
      `DTEND:${formatIcsDate(end)}`,
      `SUMMARY:${escapeText(summary)}`,
      `DESCRIPTION:${escapeText(description)}`,
      `LOCATION:${escapeText(location)}`,
      `SEQUENCE:${match.sequence || 0}`
    ];

    if (alarmMinutes !== undefined && !isNaN(alarmMinutes)) {
      eventLines.push(
        'BEGIN:VALARM',
        `TRIGGER:-PT${alarmMinutes}M`,
        'ACTION:DISPLAY',
        'DESCRIPTION:Match Reminder',
        'END:VALARM'
      );
    }

    eventLines.push('END:VEVENT');

    // Fold each line of the event and push to calendar array
    for (const line of eventLines) {
      ics.push(foldLine(line));
    }
  }

  ics.push('END:VCALENDAR');
  
  // Connect lines with CRLF as required by RFC 5545
  return ics.join('\r\n') + '\r\n';
}

// Astro GET Handler
export async function GET(context: APIContext) {
  const { url } = context;
  const teamsParam = url.searchParams.get('teams');
  const stadiumsParam = url.searchParams.get('stadiums');
  const alarmParam = url.searchParams.get('alarm');
  const localeParam = url.searchParams.get('locale') || 'en';

  const supportedLocales = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'zh'];
  const locale = supportedLocales.includes(localeParam) ? localeParam : 'en';

  let messages: any = {};
  try {
    messages = await loadToolPageMessages(locale as Locale, 'world-cup-group-calculator');
  } catch (e) {
    // Graceful fallback
  }

  const selectedTeams = teamsParam ? teamsParam.split(',').filter(Boolean) : [];
  const selectedStadiums = stadiumsParam ? stadiumsParam.split(',').filter(Boolean) : [];
  const alarmMinutes = alarmParam ? Number(alarmParam) : undefined;

  let filtered = schedule;

  if (selectedTeams.length > 0) {
    filtered = filtered.filter(
      m => selectedTeams.includes(m.homeTeam) || selectedTeams.includes(m.awayTeam)
    );
  }

  if (selectedStadiums.length > 0) {
    filtered = filtered.filter(m => selectedStadiums.includes(m.stadium));
  }

  const icsContent = generateIcsContent(filtered, alarmMinutes, locale, messages);

  return new Response(icsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="world-cup-2026.ics"',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
