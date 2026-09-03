import { tools } from '@/config/tools';
import { defaultLocale, isValidLocale } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import { loadBaseMessages } from '@/lib/translations';
import { buildComparisonDiscoveryIndex } from '@/lib/comparison-surfaces';
import { buildDiscoveryIndex } from './index-builder';
import { matchTools } from './matcher';
import { normalizeQuery } from './normalize';
import type {
  DiscoveryCandidate,
  DiscoveryDecision,
  DiscoveryMatch,
  IntentDictionary,
} from './types';

export interface DiscoverySearchResponse {
  query: string;
  normalizedQuery: string;
  matches: DiscoveryMatch[];
  action: DiscoveryDecision;
  confidence: number;
  error: 'EMPTY_QUERY' | null;
}

interface DiscoverySearchDependencies {
  buildIndex?: (locale: Locale) => Promise<DiscoveryCandidate[]>;
  intentDictionary?: IntentDictionary;
}

export interface DiscoverySearchInput {
  locale: string;
  query: string;
  maxResults?: number;
  assetBaseUrl?: string | URL;
  dependencies?: DiscoverySearchDependencies;
}

const DEFAULT_INTENT_DICTIONARY: IntentDictionary = {
  keywordsBySlug: {
    'json-to-csv': ['json to csv', 'convert json'],
    'cron-generator': ['cron expression', 'crontab'],
    'docker-compose-generator': ['docker compose', 'compose file'],
    'meta-tag-generator': ['meta tags', 'seo title'],
    'gitignore-generator': ['gitignore', '.gitignore'],
    'ip-validator': ['ip validator', 'validate ip', 'check ip format', 'ipv4 ipv6 check'],
    'ip-lookup': ['ip lookup', 'ip location', 'check my ip', 'ip info'],
    'gantt-chart-generator': ['gantt chart', 'project schedule', 'timeline chart', 'milestone plan'],
    'html-preview': ['html preview', 'live html', 'render html', 'html viewer'],
    'text-to-handwriting': ['text to handwriting', 'handwriting generator', 'convert text to handwriting'],
    'grammar-checker': ['grammar checker', 'check grammar', 'spell check', 'proofread text'],
    'iban-validator': ['iban validator', 'validate iban', 'check iban number'],
    'sql-query-optimizer': ['optimize mysql query online', 'mysql optimize query online', 'sql optimizer', 'optimize sql query', 'tune mysql query'],
    'image-to-pdf': ['image to pdf', 'imagen a pdf', 'convertir imagen a pdf', 'convert images to pdf', 'jpg to pdf online'],
    'nested-pie-chart-generator': ['nested pie chart', 'multi layer pie chart', 'nested doughnut chart', 'hierarchical pie chart'],
    'graph-chart-generator': ['graph chart', 'network graph generator', 'node link diagram', 'graph visualization online'],
    'timeline-chart-generator': ['timeline chart generator', 'timeline chart', 'project timeline', 'interactive timeline'],
    'database-connection-tester': ['test database connection online', 'mysql connection tester', 'postgres connection test', 'database ping'],
    'ical-parser': ['ical parser', 'ics viewer online', 'ical viewer', 'view ics file', 'parse ics calendar'],
    'morse-code-player': ['morse code player', 'morse player online', 'play morse code audio', 'text to morse audio'],
    'hex-editor': ['hex editor online', 'hex viewer', 'binary editor', 'edit hex bytes online', 'online hex editor'],
    'barcode-generator': ['barcode generator', 'create barcode online', 'free barcode maker', 'generate barcode image'],
    'file-size-calculator': ['file size calculator', 'calculate file size', 'bytes to mb converter', 'storage calculator'],
    'ascii-table': ['ascii table', 'ascii code chart', 'ascii character codes', 'ascii to hex', 'extended ascii table'],
    'gpa-calculator': ['gpa calculator', 'calculate gpa', 'college gpa calculator', 'high school gpa calculator', 'cumulative gpa'],
    'compound-interest-calculator': ['compound interest calculator', 'interest calculator', 'investment growth calculator', 'compound interest', 'calculate compound interest'],
    'typing-speed-test': ['typing speed test', 'typing test online', 'words per minute', 'wpm test', 'check typing speed'],
    'dice-roller': ['dice roller', 'roll a dice online', 'random dice', 'd6 dice roll', 'virtual dice'],
    'calendar-availability-finder': ['calendar availability finder', 'find meeting times', 'meeting availability', 'free time finder', 'schedule group meeting'],
    'bra-size-calculator': ['bra size calculator', 'calculate bra size', 'bra measurement tool', 'band and cup size calculator'],
    'gif-maker': ['gif maker', 'create animated gif', 'images to gif', 'online gif creator', 'animated gif maker'],
    'tsconfig-generator': ['tsconfig generator', 'generate tsconfig json', 'typescript config generator', 'tsconfig builder'],
    'css-grid-generator': ['css grid generator', 'grid layout generator', 'css grid builder', 'interactive css grid'],
    'mesh-gradient-generator': ['mesh gradient generator', 'css mesh gradient', 'gradient generator', 'modern gradient builder'],
    'margin-calculator': ['margin calculator', 'calculate profit margin', 'markup calculator', 'profit margin calculator', 'gross margin'],
    'dpi-calculator': ['dpi calculator', 'calculate dpi', 'ppi calculator', 'print resolution calculator', 'image dpi'],
    'ip-subnet-calculator': ['ip subnet calculator', 'subnet mask calculator', 'cidr subnet calculator', 'ipv4 subnet calculator'],
    'api-tester': ['api tester', 'test api online', 'http client online', 'rest api tester', 'send http request'],
    'wordcloud-generator': ['wordcloud generator', 'word cloud maker', 'create word cloud online', 'tag cloud generator'],
    'aspect-ratio-resizer': ['aspect ratio resizer', 'resize image aspect ratio', 'image aspect ratio changer', 'aspect ratio converter'],
    'screen-time-calculator': ['screen time calculator', 'calculate screen time', 'digital device time', 'screen addiction test'],
    'download-time-calculator': ['download time calculator', 'file download time', 'calculate download speed', 'transfer time calculator'],
    'totp-generator': ['totp generator', 'generate totp online', '2fa code generator', 'authenticator code online', 'time based otp'],
    'video-to-base64': ['video to base64', 'convert video to base64', 'video base64 converter', 'mp4 to base64'],
    'gauge-chart-generator': ['gauge chart generator', 'speedometer chart', 'gauge chart online', 'meter chart', 'kpi gauge'],
    'scatter-chart-generator': ['scatter chart generator', 'scatter plot online', 'scatter graph maker', 'xy scatter plot', 'correlation chart'],
    'decision-wheel': ['decision wheel', 'wheel spinner online', 'random choice picker', 'عجلة الحظ', 'عجلة القرارات'],
    'choose-text-tool': ['choose text tool', 'word counter vs text cleaner', 'text tool comparison'],
    'choose-jwt-tool': ['jwt decoder vs debugger', 'choose jwt tool', 'decode jwt token'],
    'choose-chart-type': ['bar vs line chart', 'choose chart type', 'pie chart or bar chart'],
  },
  keywordsByCategory: {
    text: ['text', 'word', 'markdown', 'slug', 'diff', 'writing'],
    converters: ['convert', 'transform'],
    generators: ['generate', 'builder', 'make'],
    development: ['code', 'developer', 'dev'],
    security: ['hash', 'password', 'encrypt', 'jwt', 'checksum', 'hmac'],
    charts: ['chart', 'graph', 'visualization', 'bar chart', 'line chart'],
    image: ['image', 'photo', 'png', 'jpg'],
  },
};

function computeDecision(score: number): DiscoveryDecision {
  if (score >= 180) {
    return 'direct';
  }
  if (score >= 80) {
    return 'suggest';
  }
  return 'fallback';
}

function computeConfidence(score: number): number {
  return Math.max(0, Math.min(1, score / 250));
}

async function defaultBuildIndex(
  locale: Locale,
  assetBaseUrl?: string | URL
): Promise<DiscoveryCandidate[]> {
  const baseMessages = await loadBaseMessages(locale, assetBaseUrl);
  const toolsObj = (baseMessages.tools as Record<string, unknown>) ?? {};
  const categoryMessages = (baseMessages.categories as Record<string, string>) ?? {};
  const toolNames = Object.fromEntries(
    tools.map((tool) => {
      const entry = toolsObj[tool.slug] as Record<string, unknown> | undefined;
      return [tool.slug, (entry?.name as string) || tool.slug];
    })
  );
  const toolDescriptions = Object.fromEntries(
    tools.map((tool) => {
      const entry = toolsObj[tool.slug] as Record<string, unknown> | undefined;
      return [tool.slug, (entry?.seo_description as string) || (entry?.description as string) || ''];
    })
  );

  return [
    ...buildDiscoveryIndex(tools, toolsObj, categoryMessages),
    ...buildComparisonDiscoveryIndex(locale, categoryMessages, toolNames, toolDescriptions),
  ];
}

export async function runDiscoverySearch(input: DiscoverySearchInput): Promise<DiscoverySearchResponse> {
  const normalizedQuery = normalizeQuery(input.query);

  if (!normalizedQuery) {
    return {
      query: input.query,
      normalizedQuery: '',
      matches: [],
      action: 'fallback',
      confidence: 0,
      error: 'EMPTY_QUERY',
    };
  }

  const locale = isValidLocale(input.locale) ? input.locale : defaultLocale;
  const buildIndex =
    input.dependencies?.buildIndex ??
    ((locale: Locale) => defaultBuildIndex(locale, input.assetBaseUrl));
  const intentDictionary = input.dependencies?.intentDictionary ?? DEFAULT_INTENT_DICTIONARY;

  const candidates = await buildIndex(locale);
  const matches = matchTools(normalizedQuery, candidates, intentDictionary, input.maxResults);
  const topScore = matches[0]?.score ?? 0;

  return {
    query: input.query,
    normalizedQuery,
    matches,
    action: computeDecision(topScore),
    confidence: computeConfidence(topScore),
    error: null,
  };
}
