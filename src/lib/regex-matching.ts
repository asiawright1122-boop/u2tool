export interface RegexMatchResult {
  match: string;
  index: number;
  captures: string[];
  groups?: Record<string, string>;
}

export interface RegexMatchCollection {
  matches: RegexMatchResult[];
  limited: boolean;
}

const DEFAULT_MAX_MATCHES = 1000;

function advanceStringIndex(input: string, index: number, unicode: boolean): number {
  if (!unicode || index + 1 >= input.length) {
    return index + 1;
  }

  const first = input.charCodeAt(index);
  if (first < 0xd800 || first > 0xdbff) {
    return index + 1;
  }

  const second = input.charCodeAt(index + 1);
  return second >= 0xdc00 && second <= 0xdfff ? index + 2 : index + 1;
}

function advanceZeroLengthMatch(regex: RegExp, input: string, index: number): void {
  const supportsUnicodeSets = 'unicodeSets' in regex && Boolean((regex as RegExp & { unicodeSets?: boolean }).unicodeSets);
  regex.lastIndex = advanceStringIndex(input, index, regex.unicode || supportsUnicodeSets);
}

export function collectRegexMatches(
  regex: RegExp,
  input: string,
  maxMatches = DEFAULT_MAX_MATCHES
): RegexMatchCollection {
  const matches: RegexMatchResult[] = [];
  const shouldIterate = regex.global || regex.sticky;
  const text = String(input ?? '');
  const limit = Math.max(1, Math.trunc(maxMatches) || DEFAULT_MAX_MATCHES);

  regex.lastIndex = 0;

  if (!shouldIterate) {
    const match = regex.exec(text);
    return {
      matches: match
        ? [{
            match: match[0],
            index: match.index,
            captures: match.slice(1),
            groups: match.groups,
          }]
        : [],
      limited: false,
    };
  }

  let limited = false;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      match: match[0],
      index: match.index,
      captures: match.slice(1),
      groups: match.groups,
    });

    if (matches.length >= limit) {
      limited = regex.lastIndex < text.length;
      break;
    }

    if (match[0].length === 0) {
      advanceZeroLengthMatch(regex, text, regex.lastIndex);
    }
  }

  return { matches, limited };
}
