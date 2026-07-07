export type AiPromptGoal = 'writing' | 'coding' | 'seo' | 'translation' | 'image' | 'data';

export interface AiPromptOptimizerInput {
  audience: string;
  constraints: string;
  draft: string;
  format: string;
  goal: AiPromptGoal;
  tone: string;
}

export interface AiPromptOptimizerResult {
  checklist: string[];
  gaps: string[];
  optimizedPrompt: string;
  sectionCount: number;
  wordCount: number;
}

export interface JsonToPromptInput {
  audience: string;
  includeSchema: boolean;
  jsonText: string;
  outputFormat: string;
  task: string;
}

export interface JsonToPromptResult {
  arrayCount: number;
  error: string | null;
  keyCount: number;
  prompt: string;
  schemaSummary: string[];
  topLevelType: string;
}

const goalInstructions: Record<AiPromptGoal, string[]> = {
  writing: [
    'Clarify the reader, purpose, and desired action before drafting.',
    'Prefer concrete examples and remove vague filler.',
  ],
  coding: [
    'Ask for inputs, expected behavior, constraints, and edge cases before implementation.',
    'Request concise code plus notes about assumptions and failure modes.',
  ],
  seo: [
    'Separate search intent, primary keyword, secondary entities, and snippet-ready output.',
    'Avoid unverifiable ranking claims and keep metadata aligned with the page body.',
  ],
  translation: [
    'Preserve meaning, product terms, formatting, and locale-specific tone.',
    'Ask the model to flag ambiguous terms instead of guessing silently.',
  ],
  image: [
    'Specify subject, composition, medium, lighting, camera or style references, and exclusions.',
    'Keep brand, safety, and aspect-ratio constraints explicit.',
  ],
  data: [
    'Define the schema, fields to inspect, calculations, and output table shape.',
    'Ask the model to call out missing or suspicious data before conclusions.',
  ],
};

function clean(value: string, fallback: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  return normalized || fallback;
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

export function optimizeAiPrompt(input: AiPromptOptimizerInput): AiPromptOptimizerResult {
  const draft = clean(input.draft, 'Describe the task you want the AI model to complete.');
  const audience = clean(input.audience, 'the intended reader or user');
  const tone = clean(input.tone, 'clear, practical, and direct');
  const format = clean(input.format, 'a structured response with headings and bullet points');
  const constraints = clean(input.constraints, 'state assumptions, avoid unsupported claims, and keep the answer actionable');
  const goal = input.goal in goalInstructions ? input.goal : 'writing';
  const instructions = goalInstructions[goal];

  const gaps: string[] = [];
  if (!/\b(audience|reader|user|customer|developer|team)\b/i.test(input.draft)) {
    gaps.push('Target audience is not explicit in the draft prompt.');
  }
  if (!/\b(format|table|json|markdown|bullets?|list|steps?)\b/i.test(input.draft)) {
    gaps.push('Output format is not explicit in the draft prompt.');
  }
  if (!/\b(limit|avoid|must|should|constraint|do not|without)\b/i.test(input.draft)) {
    gaps.push('Constraints or exclusions are light; add boundaries before running the prompt.');
  }

  const checklist = [
    'Confirm the task, audience, and output format before sending.',
    'Review factual claims and source-sensitive language in the final answer.',
    'Copy the prompt into your AI tool, then adapt examples to your real context.',
  ];

  const optimizedPrompt = [
    `Role: You are a ${tone} AI assistant optimizing for a ${goal} task.`,
    `Task: ${draft}`,
    `Audience: ${audience}.`,
    `Output format: ${format}.`,
    `Constraints: ${constraints}.`,
    'Goal-specific instructions:',
    ...instructions.map((instruction) => `- ${instruction}`),
    'Execution rules:',
    '- Start with the most useful answer, not a preamble.',
    '- Ask clarifying questions only when missing information would materially change the result.',
    '- Separate facts, assumptions, and recommendations when accuracy matters.',
    '- End with a short checklist the user can act on.',
  ].join('\n');

  return {
    checklist,
    gaps,
    optimizedPrompt,
    sectionCount: (optimizedPrompt.match(/^[A-Z][^:\n]+:/gm) || []).length,
    wordCount: countWords(optimizedPrompt),
  };
}

function valueType(value: unknown): string {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  return typeof value;
}

function summarizeValue(value: unknown, path = '$', depth = 0): string[] {
  if (depth > 2) {
    return [`${path}: ${valueType(value)}`];
  }

  if (Array.isArray(value)) {
    const first = value[0];
    return [
      `${path}: array(${value.length})`,
      ...(first === undefined ? [] : summarizeValue(first, `${path}[]`, depth + 1)),
    ];
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).slice(0, 12);
    return [
      `${path}: object(${Object.keys(value as Record<string, unknown>).length} keys)`,
      ...entries.flatMap(([key, child]) => summarizeValue(child, `${path}.${key}`, depth + 1)),
    ];
  }

  const sample = typeof value === 'string' && value.length > 36 ? `${value.slice(0, 33)}...` : String(value);
  return [`${path}: ${valueType(value)}${value === undefined ? '' : ` = ${sample}`}`];
}

function countKeys(value: unknown): number {
  if (Array.isArray(value)) {
    return value.reduce((sum, item) => sum + countKeys(item), 0);
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).reduce(
      (sum, [, child]) => sum + 1 + countKeys(child),
      0
    );
  }
  return 0;
}

function countArrays(value: unknown): number {
  if (Array.isArray(value)) {
    return 1 + value.reduce((sum, item) => sum + countArrays(item), 0);
  }
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).reduce<number>(
      (sum, child) => sum + countArrays(child),
      0
    );
  }
  return 0;
}

export function buildJsonToPrompt(input: JsonToPromptInput): JsonToPromptResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(input.jsonText);
  } catch (error) {
    return {
      arrayCount: 0,
      error: error instanceof Error ? error.message : 'Invalid JSON input.',
      keyCount: 0,
      prompt: '',
      schemaSummary: [],
      topLevelType: 'invalid',
    };
  }

  const task = clean(input.task, 'analyze this JSON and explain the important patterns');
  const audience = clean(input.audience, 'a practical user who needs a concise answer');
  const outputFormat = clean(input.outputFormat, 'a concise Markdown summary with bullets');
  const schemaSummary = summarizeValue(parsed).slice(0, 18);
  const keyCount = countKeys(parsed);
  const arrayCount = countArrays(parsed);
  const topLevelType = valueType(parsed);
  const schemaBlock = input.includeSchema
    ? ['JSON shape:', ...schemaSummary.map((line) => `- ${line}`)]
    : ['JSON shape: infer the structure from the pasted JSON.'];

  const prompt = [
    'Role: You are a careful data assistant.',
    `Task: ${task}.`,
    `Audience: ${audience}.`,
    `Output format: ${outputFormat}.`,
    ...schemaBlock,
    'Instructions:',
    '- Read the JSON before answering.',
    '- Mention missing, null, or suspicious fields when they affect the answer.',
    '- Do not invent fields that are not present in the JSON.',
    '- Keep recommendations tied to specific keys or values from the data.',
    'JSON input:',
    '```json',
    JSON.stringify(parsed, null, 2),
    '```',
  ].join('\n');

  return {
    arrayCount,
    error: null,
    keyCount,
    prompt,
    schemaSummary,
    topLevelType,
  };
}
