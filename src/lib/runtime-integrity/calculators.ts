type TeamMemberLike = {
  hoursPerDay?: number;
  daysOff?: number;
  meetings?: number;
  adminTime?: number;
};

type SprintConfigLike = {
  durationDays?: number;
  holidays?: number;
  focusFactor?: number;
};

type VelocityItem = {
  committed?: number;
  completed?: number;
  value?: number;
};

type DuplicateOccurrence = {
  start: number;
  end: number;
};

type DuplicateBlock = {
  occurrences?: DuplicateOccurrence[];
};

function parseHexColor(input: string): [number, number, number] | null {
  const normalized = input.trim().replace(/^#/, '');

  if (!/^[\da-f]{3}$|^[\da-f]{6}$/i.test(normalized)) {
    return null;
  }

  const expanded =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => `${char}${char}`)
          .join('')
      : normalized;

  return [
    Number.parseInt(expanded.slice(0, 2), 16),
    Number.parseInt(expanded.slice(2, 4), 16),
    Number.parseInt(expanded.slice(4, 6), 16),
  ];
}

function channelToLinear(channel: number): number {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function luminance(input: string): number {
  const rgb = parseHexColor(input);
  if (!rgb) {
    return 0;
  }

  const [red, green, blue] = rgb.map(channelToLinear);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(foreground: string, background: string): number {
  const first = luminance(foreground);
  const second = luminance(background);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return Math.round((((lighter + 0.05) / (darker + 0.05)) * 100) * 100) / 10000;
}

export function getWCAGLevel(ratio: number, largeText = false): { aa: boolean; aaa: boolean } {
  const safeRatio = Number.isFinite(ratio) ? ratio : 0;
  return largeText
    ? { aa: safeRatio >= 3, aaa: safeRatio >= 4.5 }
    : { aa: safeRatio >= 4.5, aaa: safeRatio >= 7 };
}

export function calculateBreakEven(
  fixedCosts: number,
  variableCostPerUnit: number,
  sellingPricePerUnit: number
): {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  contributionMarginRatio: number;
} {
  const contributionMargin = sellingPricePerUnit - variableCostPerUnit;
  const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;

  return {
    breakEvenUnits,
    breakEvenRevenue: breakEvenUnits * sellingPricePerUnit,
    contributionMargin,
    contributionMarginRatio:
      sellingPricePerUnit > 0 ? (contributionMargin / sellingPricePerUnit) * 100 : 0,
  };
}

export function calculateCapacity(member: TeamMemberLike = {}, config: SprintConfigLike = {}): number {
  const durationDays = Math.max(0, Number(config.durationDays ?? 0));
  const holidays = Math.max(0, Number(config.holidays ?? 0));
  const daysOff = Math.max(0, Number(member.daysOff ?? 0));
  const hoursPerDay = Math.max(0, Number(member.hoursPerDay ?? 0));
  const focusFactor = Math.max(0, Math.min(1, Number(config.focusFactor ?? 1)));
  const meetings = Math.max(0, Number(member.meetings ?? 0));
  const adminTime = Math.max(0, Number(member.adminTime ?? 0));

  const availableDays = Math.max(durationDays - holidays - daysOff, 0);
  const grossHours = availableDays * hoursPerDay;
  const usableHours = Math.max(grossHours - meetings - adminTime, 0) * focusFactor;

  return Math.round(usableHours * 10) / 10;
}

function calculateVelocityStats(items: VelocityItem[]) {
  const completedValues = items
    .map((item) => Number(item.completed ?? item.value ?? 0))
    .filter((value) => Number.isFinite(value));

  if (completedValues.length === 0) {
    return {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      trend: 'stable' as const,
      completionRate: 0,
      predictedNext: 0,
    };
  }

  const sorted = [...completedValues].sort((left, right) => left - right);
  const totalCompleted = completedValues.reduce((sum, value) => sum + value, 0);
  const average = totalCompleted / completedValues.length;
  const median =
    sorted.length % 2 === 1
      ? sorted[Math.floor(sorted.length / 2)]
      : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const committedTotal = items.reduce((sum, item) => sum + Number(item.committed ?? 0), 0);
  const trend =
    completedValues.length < 2
      ? 'stable'
      : completedValues[completedValues.length - 1] > completedValues[0]
        ? 'up'
        : completedValues[completedValues.length - 1] < completedValues[0]
          ? 'down'
          : 'stable';

  return {
    average: Math.round(average * 10) / 10,
    median,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    trend,
    completionRate: committedTotal > 0 ? Math.round((totalCompleted / committedTotal) * 100) : 0,
    predictedNext: Math.round(average),
  };
}

function calculateDuplicationStats(code: string, duplicates: DuplicateBlock[]) {
  const lines = code.split(/\r?\n/);
  const totalLines = lines.length;
  const duplicateLineNumbers = new Set<number>();

  for (const duplicate of duplicates) {
    for (const occurrence of duplicate.occurrences ?? []) {
      for (let line = occurrence.start; line <= occurrence.end; line += 1) {
        duplicateLineNumbers.add(line);
      }
    }
  }

  const duplicateLines = duplicateLineNumbers.size;
  return {
    totalLines,
    duplicateLines,
    duplicationPercentage: totalLines > 0 ? Math.round((duplicateLines / totalLines) * 100) : 0,
  };
}

export function calculateStats(
  items: VelocityItem[] | string = [],
  duplicates: DuplicateBlock[] = []
): Record<string, number | string> {
  if (typeof items === 'string') {
    return calculateDuplicationStats(items, duplicates);
  }

  return calculateVelocityStats(items);
}
