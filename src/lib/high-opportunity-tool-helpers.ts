export type JsonRepairResult = {
  valid: boolean;
  output: string;
  fixes: string[];
  error?: string;
};

export type JsonLinesValidationResult = {
  valid: boolean;
  validLines: number;
  invalidLines: Array<{ line: number; message: string }>;
  normalized: string;
};

export type LlmsTxtValidationResult = {
  valid: boolean;
  title: string;
  links: number;
  issues: string[];
  warnings: string[];
};

export type AiRobotsPolicy = 'block-training' | 'allow-discovery' | 'custom';

export type AiRobotsInput = {
  policy: AiRobotsPolicy;
  sitemapUrl?: string;
  extraAgents?: string[];
};

export type McpValidationResult = {
  validJson: boolean;
  valid: boolean;
  serverCount: number;
  errors: string[];
  warnings: string[];
  normalized: string;
};

export type McpServerConfigInput = {
  client: 'claude' | 'codex' | 'cursor' | 'vscode' | string;
  serverName: string;
  command: string;
  argsText?: string;
  envText?: string;
};

const AI_CRAWLER_AGENTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
];

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function stripJsonComments(input: string) {
  let output = '';
  let changed = false;
  let inString = false;
  let quote = '';
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (inString) {
      output += char;
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === quote) {
        inString = false;
        quote = '';
      }
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quote = char;
      output += char;
      continue;
    }

    if (char === '/' && next === '/') {
      changed = true;
      while (index < input.length && input[index] !== '\n') {
        index += 1;
      }
      output += '\n';
      continue;
    }

    if (char === '/' && next === '*') {
      changed = true;
      index += 2;
      while (index < input.length && !(input[index] === '*' && input[index + 1] === '/')) {
        index += 1;
      }
      index += 1;
      continue;
    }

    output += char;
  }

  return { output, changed };
}

function convertSingleQuotedStrings(input: string) {
  let changed = false;
  const output = input.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_match, value: string) => {
    changed = true;
    return JSON.stringify(value.replace(/\\'/g, "'"));
  });

  return { output, changed };
}

function quoteObjectKeys(input: string) {
  let changed = false;
  const output = input.replace(/([{,]\s*)([A-Za-z_$][\w$-]*)(\s*:)/g, (_match, prefix: string, key: string, suffix: string) => {
    changed = true;
    return `${prefix}${JSON.stringify(key)}${suffix}`;
  });

  return { output, changed };
}

function removeTrailingCommas(input: string) {
  let changed = false;
  const output = input.replace(/,\s*([}\]])/g, (_match, close: string) => {
    changed = true;
    return close;
  });

  return { output, changed };
}

export function repairJson(input: string): JsonRepairResult {
  const fixes: string[] = [];
  let candidate = input.trim();

  const comments = stripJsonComments(candidate);
  if (comments.changed) {
    fixes.push('Removed JavaScript-style comments');
    candidate = comments.output;
  }

  const quotedKeys = quoteObjectKeys(candidate);
  if (quotedKeys.changed) {
    fixes.push('Quoted unquoted object keys');
    candidate = quotedKeys.output;
  }

  const singleQuotes = convertSingleQuotedStrings(candidate);
  if (singleQuotes.changed) {
    fixes.push('Converted single-quoted strings');
    candidate = singleQuotes.output;
  }

  const trailingCommas = removeTrailingCommas(candidate);
  if (trailingCommas.changed) {
    fixes.push('Removed trailing commas');
    candidate = trailingCommas.output;
  }

  try {
    return {
      valid: true,
      output: JSON.stringify(JSON.parse(candidate), null, 2),
      fixes,
    };
  } catch (error) {
    return {
      valid: false,
      output: '',
      fixes,
      error: errorMessage(error),
    };
  }
}

export function validateJsonLines(input: string): JsonLinesValidationResult {
  const normalized: string[] = [];
  const invalidLines: Array<{ line: number; message: string }> = [];

  input.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    try {
      normalized.push(JSON.stringify(JSON.parse(trimmed)));
    } catch (error) {
      invalidLines.push({ line: index + 1, message: errorMessage(error) });
    }
  });

  return {
    valid: invalidLines.length === 0,
    validLines: normalized.length,
    invalidLines,
    normalized: normalized.join('\n'),
  };
}

export function validateLlmsTxt(input: string): LlmsTxtValidationResult {
  const lines = input.split(/\r?\n/);
  const issues: string[] = [];
  const warnings: string[] = [];
  const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);
  const firstContent = firstContentIndex >= 0 ? lines[firstContentIndex].trim() : '';
  const title = firstContent.startsWith('# ') ? firstContent.slice(2).trim() : '';
  const hasSummary = lines.some((line) => line.trim().startsWith('> '));
  let links = 0;

  if (!title) {
    issues.push('First non-empty line should be a Markdown H1 title.');
  }

  if (!hasSummary) {
    warnings.push('Add a short blockquote summary after the title.');
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('- ')) {
      return;
    }
    const isMarkdownLink = /^- \[[^\]]+\]\(https?:\/\/[^)\s]+\)$/.test(trimmed);
    if (isMarkdownLink) {
      links += 1;
      return;
    }
    issues.push(`Line ${index + 1} list item should use Markdown link syntax.`);
  });

  return {
    valid: issues.length === 0,
    title,
    links,
    issues,
    warnings,
  };
}

function uniqueNonEmpty(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function generateAiRobotsTxt(input: AiRobotsInput): string {
  const agents = uniqueNonEmpty([...AI_CRAWLER_AGENTS, ...(input.extraAgents || [])]);
  const lines: string[] = [
    '# AI crawler policy generated by U2Tool',
    '# Review this file before publishing.',
  ];

  for (const agent of agents) {
    lines.push('', `User-agent: ${agent}`);
    if (input.policy === 'allow-discovery' && /SearchBot|Perplexity-User|Claude-User|ChatGPT-User/.test(agent)) {
      lines.push('Allow: /');
    } else if (input.policy === 'custom') {
      lines.push('# Add Allow or Disallow rules for this user agent.');
    } else {
      lines.push('Disallow: /');
    }
  }

  if (input.sitemapUrl?.trim()) {
    lines.push('', `Sitemap: ${input.sitemapUrl.trim()}`);
  }

  return lines.join('\n').trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function looksLikePlaceholder(value: string) {
  return value === '' || /^\$\{[^}]+\}$/.test(value) || /^<[^>]+>$/.test(value) || /^process\.env\./.test(value);
}

export function validateMcpJsonConfig(input: string): McpValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch (error) {
    return {
      validJson: false,
      valid: false,
      serverCount: 0,
      errors: [errorMessage(error)],
      warnings: [],
      normalized: '',
    };
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!isRecord(parsed)) {
    return {
      validJson: true,
      valid: false,
      serverCount: 0,
      errors: ['MCP config root must be an object.'],
      warnings,
      normalized: JSON.stringify(parsed, null, 2),
    };
  }

  const servers = parsed.mcpServers;
  if (!isRecord(servers)) {
    return {
      validJson: true,
      valid: false,
      serverCount: 0,
      errors: ['mcpServers object is required.'],
      warnings,
      normalized: JSON.stringify(parsed, null, 2),
    };
  }

  for (const [name, config] of Object.entries(servers)) {
    if (!isRecord(config)) {
      errors.push(`${name} must be an object.`);
      continue;
    }
    if (typeof config.command !== 'string' || config.command.trim() === '') {
      errors.push(`${name}.command is required.`);
    }
    if ('args' in config && !Array.isArray(config.args)) {
      errors.push(`${name}.args must be an array when provided.`);
    }
    if ('env' in config) {
      if (!isRecord(config.env)) {
        errors.push(`${name}.env must be an object when provided.`);
      } else if (Object.values(config.env).some((value) => typeof value === 'string' && !looksLikePlaceholder(value))) {
        warnings.push(`${name}.env includes a concrete value; prefer environment placeholders for shared configs.`);
      }
    }
  }

  return {
    validJson: true,
    valid: errors.length === 0,
    serverCount: Object.keys(servers).length,
    errors,
    warnings,
    normalized: JSON.stringify(parsed, null, 2),
  };
}

function splitArgs(input: string) {
  const args: string[] = [];
  let current = '';
  let quote = '';
  let escaped = false;

  for (const char of input.trim()) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) {
        quote = '';
      } else {
        current += char;
      }
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        args.push(current);
        current = '';
      }
      continue;
    }
    current += char;
  }

  if (current) {
    args.push(current);
  }

  return args;
}

function parseEnv(input: string) {
  const env: Record<string, string> = {};
  for (const line of input.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || !trimmed.includes('=')) {
      continue;
    }
    const separator = trimmed.indexOf('=');
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key) {
      env[key] = value;
    }
  }
  return env;
}

export function generateMcpServerConfig(input: McpServerConfigInput): string {
  const serverName = input.serverName.trim() || 'example-server';
  const command = input.command.trim() || 'npx';
  const args = splitArgs(input.argsText || '');
  const env = parseEnv(input.envText || '');
  const server: Record<string, unknown> = { command };

  if (args.length > 0) {
    server.args = args;
  }
  if (Object.keys(env).length > 0) {
    server.env = env;
  }

  return JSON.stringify({
    mcpServers: {
      [serverName]: server,
    },
  }, null, 2);
}
