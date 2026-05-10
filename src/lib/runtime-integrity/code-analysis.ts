type ComplexityFunction = {
  name: string;
  line: number;
  cyclomaticComplexity: number;
  linesOfCode: number;
  parameters: number;
};

type DeadCodeItem = {
  type: 'function' | 'variable' | 'class' | 'export';
  name: string;
  line: number;
  code: string;
  reason: string;
};

type PerformanceOperation = {
  name: string;
  time: number;
  percentage: number;
  calls: number;
};

const FUNCTION_KEYWORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'function']);

function splitLines(code: unknown): string[] {
  return String(code ?? '').replace(/\r\n?/g, '\n').split('\n');
}

function countMatches(input: string, pattern: RegExp): number {
  return input.match(pattern)?.length ?? 0;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function stripStringsAndComments(input: string): string {
  return input
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/\/\/.*$/gm, ' ')
    .replace(/(['"`])(?:\\.|(?!\1)[\s\S])*?\1/g, ' ');
}

function countParameters(value: string | undefined): number {
  if (!value?.trim()) return 0;
  return value.split(',').map((part) => part.trim()).filter(Boolean).length;
}

function findFunctionEnd(lines: string[], startIndex: number): number {
  let depth = 0;
  let seenBrace = false;

  for (let index = startIndex; index < lines.length; index += 1) {
    const line = stripStringsAndComments(lines[index]);
    for (const char of line) {
      if (char === '{') {
        depth += 1;
        seenBrace = true;
      } else if (char === '}') {
        depth -= 1;
      }
    }
    if (seenBrace && depth <= 0) return index;
  }

  return startIndex;
}

function detectFunctions(lines: string[]): ComplexityFunction[] {
  const functions: ComplexityFunction[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const functionMatch =
      trimmed.match(/^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)/) ??
      trimmed.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/) ??
      trimmed.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?([A-Za-z_$][\w$]*)\s*=>/) ??
      trimmed.match(/^([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/);

    if (!functionMatch) return;

    const name = functionMatch[1];
    if (FUNCTION_KEYWORDS.has(name)) return;

    const endIndex = findFunctionEnd(lines, index);
    const body = lines.slice(index, endIndex + 1).join('\n');
    const lexicalBody = stripStringsAndComments(body);
    const cyclomaticComplexity =
      1 +
      countMatches(lexicalBody, /\b(if|else\s+if|for|while|case|catch)\b/g) +
      countMatches(lexicalBody, /&&|\|\||\?/g);

    functions.push({
      name,
      line: index + 1,
      cyclomaticComplexity,
      linesOfCode: lines.slice(index, endIndex + 1).filter((item) => item.trim()).length,
      parameters: countParameters(functionMatch[2]),
    });
  });

  return functions;
}

export function analyzeComplexity(code: unknown = '', _language = 'javascript') {
  const lines = splitLines(code);
  const blankLines = lines.filter((line) => !line.trim()).length;
  const commentLines = lines.filter((line) => {
    const trimmed = line.trim();
    return trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*');
  }).length;
  const totalLines = lines.length;
  const codeLines = Math.max(0, totalLines - blankLines - commentLines);
  const functions = detectFunctions(lines);
  const fallbackComplexity =
    1 +
    countMatches(stripStringsAndComments(String(code ?? '')), /\b(if|else\s+if|for|while|case|catch)\b/g);
  const overallComplexity =
    functions.length > 0
      ? functions.reduce((sum, item) => sum + item.cyclomaticComplexity, 0)
      : fallbackComplexity;
  const averageFunctionSize =
    functions.length > 0
      ? functions.reduce((sum, item) => sum + item.linesOfCode, 0) / functions.length
      : codeLines;
  const maintainabilityIndex = clampScore(
    100 - overallComplexity * 4 - Math.max(0, averageFunctionSize - 20) * 1.5 - functions.length
  );

  return {
    totalLines,
    codeLines,
    commentLines,
    blankLines,
    functions,
    overallComplexity,
    maintainabilityIndex,
  };
}

function declarationCandidates(lines: string[]): DeadCodeItem[] {
  const candidates: DeadCodeItem[] = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    const exportMatch = trimmed.match(/^export\s+(?:async\s+)?(?:function|class|const|let|var)\s+([A-Za-z_$][\w$]*)/);
    const functionMatch = trimmed.match(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/);
    const variableMatch = trimmed.match(/^(?:const|let|var)\s+([A-Za-z_$][\w$]*)\b/);
    const classMatch = trimmed.match(/^class\s+([A-Za-z_$][\w$]*)\b/);

    if (exportMatch) {
      candidates.push({
        type: 'export',
        name: exportMatch[1],
        line: index + 1,
        code: trimmed,
        reason: 'Exported declaration is not referenced elsewhere in this snippet.',
      });
    } else if (functionMatch) {
      candidates.push({
        type: 'function',
        name: functionMatch[1],
        line: index + 1,
        code: trimmed,
        reason: 'Function is declared but not called elsewhere in this snippet.',
      });
    } else if (classMatch) {
      candidates.push({
        type: 'class',
        name: classMatch[1],
        line: index + 1,
        code: trimmed,
        reason: 'Class is declared but not instantiated or extended elsewhere in this snippet.',
      });
    } else if (variableMatch) {
      candidates.push({
        type: 'variable',
        name: variableMatch[1],
        line: index + 1,
        code: trimmed,
        reason: 'Variable is assigned but not read elsewhere in this snippet.',
      });
    }
  });

  return candidates;
}

export function analyzeDeadCode(code: unknown = ''): DeadCodeItem[] {
  const lines = splitLines(code);
  const lexicalCode = stripStringsAndComments(String(code ?? ''));

  return declarationCandidates(lines)
    .filter((candidate) => {
      const pattern = new RegExp(`\\b${candidate.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      const references = lexicalCode.match(pattern)?.length ?? 0;
      return references <= 1;
    })
    .sort((left, right) => left.line - right.line);
}

function addOperation(operations: PerformanceOperation[], name: string, calls: number, unitTime: number): void {
  if (calls <= 0) return;
  operations.push({
    name,
    calls,
    time: Math.max(1, Math.round(calls * unitTime)),
    percentage: 0,
  });
}

export function analyzePerformance(code: unknown = '') {
  const source = String(code ?? '');
  const lexicalCode = stripStringsAndComments(source);
  const operations: PerformanceOperation[] = [];
  const loopCount = countMatches(lexicalCode, /\b(for|while)\s*\(/g);
  const nestedLoopCount = countMatches(lexicalCode, /\b(for|while)\s*\([^)]*\)\s*\{[\s\S]{0,300}\b(for|while)\s*\(/g);
  const domQueryCount = countMatches(lexicalCode, /\b(querySelector(All)?|getElementById|getElementsByClassName)\s*\(/g);
  const jsonCount = countMatches(lexicalCode, /\bJSON\.(parse|stringify)\s*\(/g);
  const ioCount = countMatches(lexicalCode, /\b(readFile|writeFile|saveFile|fetch|db\.query)\s*\(/g);
  const arrayPassCount = countMatches(lexicalCode, /\.(map|filter|reduce|forEach|sort)\s*\(/g);
  const regexCount = countMatches(lexicalCode, /\bnew\s+RegExp\s*\(/g);

  addOperation(operations, 'Loop iteration blocks', loopCount, 4);
  addOperation(operations, 'Nested loop penalty', nestedLoopCount, 18);
  addOperation(operations, 'DOM lookup operations', domQueryCount, 6);
  addOperation(operations, 'JSON serialization work', jsonCount, 5);
  addOperation(operations, 'I/O or network/database calls', ioCount, 12);
  addOperation(operations, 'Array traversal operations', arrayPassCount, 3);
  addOperation(operations, 'Dynamic regular expressions', regexCount, 4);

  const totalTime = operations.reduce((sum, item) => sum + item.time, 0);
  const normalizedTotal = Math.max(totalTime, 1);
  const normalizedOperations = operations.map((operation) => ({
    ...operation,
    percentage: Math.round((operation.time / normalizedTotal) * 100),
  }));
  const hotspots: string[] = [];
  const suggestions: string[] = [];

  if (nestedLoopCount > 0) {
    hotspots.push('Nested loops can grow quadratically as input size increases.');
    suggestions.push('Consider indexing data, pre-grouping collections, or replacing nested scans with maps/sets.');
  }
  if (ioCount > 0) {
    hotspots.push('I/O, network, or database calls dominate runtime compared with local computation.');
    suggestions.push('Batch external calls, cache stable results, and keep database access outside tight loops.');
  }
  if (domQueryCount > 0) {
    hotspots.push('Repeated DOM lookups can force extra browser work.');
    suggestions.push('Cache DOM references before loops and update the DOM in batches.');
  }
  if (arrayPassCount > 2) {
    hotspots.push('Multiple array passes may allocate intermediate collections.');
    suggestions.push('Combine adjacent map/filter/reduce passes when profiling shows they are hot.');
  }
  if (jsonCount > 0) {
    suggestions.push('Avoid repeated JSON parse/stringify calls in hot paths; parse once and reuse structured data.');
  }

  return {
    totalTime: totalTime || Math.max(1, Math.round(splitLines(code).filter((line) => line.trim()).length * 0.2)),
    operations: normalizedOperations,
    hotspots,
    suggestions,
  };
}
