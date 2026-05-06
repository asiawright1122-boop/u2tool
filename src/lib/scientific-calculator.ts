export type AngleMode = 'rad' | 'deg';

interface EvaluateOptions {
  angleMode?: AngleMode;
}

type Token =
  | { type: 'number'; value: number }
  | { type: 'identifier'; value: string }
  | { type: 'operator'; value: Operator }
  | { type: 'lparen' }
  | { type: 'rparen' }
  | { type: 'comma' };

type Operator = '+' | '-' | '*' | '/' | '^' | '%' | 'mod';

const FUNCTION_NAMES = new Set([
  'sin',
  'cos',
  'tan',
  'asin',
  'acos',
  'atan',
  'log',
  'ln',
  'sqrt',
  'abs',
  'exp',
  'pow',
]);

export function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function radiansToDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function factorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Invalid factorial input');
  }

  if (n > 170) {
    throw new Error('Factorial input too large');
  }

  let result = 1;
  for (let i = 2; i <= n; i += 1) {
    result *= i;
  }
  return result;
}

export function evaluateExpression(expression: string, options: EvaluateOptions = {}): number {
  const parser = new ExpressionParser(tokenize(expression), options.angleMode || 'rad');
  const result = parser.parse();

  if (!Number.isFinite(result)) {
    throw new Error('Invalid result');
  }

  return Object.is(result, -0) ? 0 : result;
}

function tokenize(expression: string): Token[] {
  const tokens: Token[] = [];
  const source = String(expression || '');
  let index = 0;

  while (index < source.length) {
    const char = source[index];

    if (/\s/.test(char)) {
      index += 1;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'lparen' });
      index += 1;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'rparen' });
      index += 1;
      continue;
    }

    if (char === ',') {
      tokens.push({ type: 'comma' });
      index += 1;
      continue;
    }

    const operator = normalizeOperator(char);
    if (operator) {
      tokens.push({ type: 'operator', value: operator });
      index += 1;
      continue;
    }

    if (char === '√') {
      tokens.push({ type: 'identifier', value: 'sqrt' });
      index += 1;
      continue;
    }

    if (isNumberStart(source, index)) {
      const { nextIndex, value } = readNumber(source, index);
      tokens.push({ type: 'number', value });
      index = nextIndex;
      continue;
    }

    if (char === 'π') {
      tokens.push({ type: 'identifier', value: 'pi' });
      index += 1;
      continue;
    }

    if (/[A-Za-z]/.test(char)) {
      const start = index;
      while (index < source.length && /[A-Za-z]/.test(source[index])) {
        index += 1;
      }

      const value = source.slice(start, index).toLowerCase();
      tokens.push(value === 'mod' ? { type: 'operator', value: 'mod' } : { type: 'identifier', value });
      continue;
    }

    throw new Error(`Unsupported character: ${char}`);
  }

  return tokens;
}

function normalizeOperator(char: string): Operator | null {
  switch (char) {
    case '+':
    case '*':
    case '/':
    case '^':
    case '%':
      return char;
    case '-':
    case '−':
      return '-';
    case '×':
      return '*';
    case '÷':
      return '/';
    default:
      return null;
  }
}

function isNumberStart(source: string, index: number): boolean {
  const char = source[index];
  return /\d/.test(char) || (char === '.' && /\d/.test(source[index + 1] || ''));
}

function readNumber(source: string, start: number): { nextIndex: number; value: number } {
  let index = start;

  while (index < source.length && /\d/.test(source[index])) {
    index += 1;
  }

  if (source[index] === '.') {
    index += 1;
    while (index < source.length && /\d/.test(source[index])) {
      index += 1;
    }
  }

  if (
    /[eE]/.test(source[index] || '') &&
    (/[\d]/.test(source[index + 1] || '') ||
      (/[+-]/.test(source[index + 1] || '') && /\d/.test(source[index + 2] || '')))
  ) {
    index += 1;
    if (/[+-]/.test(source[index] || '')) {
      index += 1;
    }
    while (index < source.length && /\d/.test(source[index])) {
      index += 1;
    }
  }

  const value = Number(source.slice(start, index));
  if (!Number.isFinite(value)) {
    throw new Error('Invalid number');
  }

  return { nextIndex: index, value };
}

class ExpressionParser {
  private position = 0;

  constructor(
    private readonly tokens: Token[],
    private readonly angleMode: AngleMode
  ) {}

  parse(): number {
    if (this.tokens.length === 0) {
      throw new Error('Expression is empty');
    }

    const value = this.parseExpression();
    if (this.current()) {
      throw new Error('Unexpected token');
    }
    return value;
  }

  private parseExpression(): number {
    return this.parseAdditive();
  }

  private parseAdditive(): number {
    let value = this.parseMultiplicative();

    while (true) {
      if (this.matchOperator('+')) {
        value += this.parseMultiplicative();
      } else if (this.matchOperator('-')) {
        value -= this.parseMultiplicative();
      } else {
        return value;
      }
    }
  }

  private parseMultiplicative(): number {
    let value = this.parseUnary();

    while (true) {
      if (this.matchOperator('*')) {
        value *= this.parseUnary();
      } else if (this.matchOperator('/')) {
        value /= this.parseUnary();
      } else if (this.matchOperator('%') || this.matchOperator('mod')) {
        value %= this.parseUnary();
      } else {
        return value;
      }
    }
  }

  private parseUnary(): number {
    if (this.matchOperator('+')) {
      return this.parseUnary();
    }

    if (this.matchOperator('-')) {
      return -this.parseUnary();
    }

    return this.parsePower();
  }

  private parsePower(): number {
    const left = this.parsePrimary();

    if (this.matchOperator('^')) {
      return Math.pow(left, this.parseUnary());
    }

    return left;
  }

  private parsePrimary(): number {
    const token = this.consume();

    if (!token) {
      throw new Error('Unexpected end of expression');
    }

    if (token.type === 'number') {
      return token.value;
    }

    if (token.type === 'identifier') {
      return this.parseIdentifier(token.value);
    }

    if (token.type === 'lparen') {
      const value = this.parseExpression();
      this.expect('rparen');
      return value;
    }

    throw new Error('Unexpected token');
  }

  private parseIdentifier(identifier: string): number {
    if (identifier === 'pi') {
      return Math.PI;
    }

    if (identifier === 'e') {
      return Math.E;
    }

    if (!FUNCTION_NAMES.has(identifier)) {
      throw new Error(`Unsupported identifier: ${identifier}`);
    }

    this.expect('lparen');
    const args: number[] = [];

    if (!this.peek('rparen')) {
      do {
        args.push(this.parseExpression());
      } while (this.match('comma'));
    }

    this.expect('rparen');
    return this.callFunction(identifier, args);
  }

  private callFunction(name: string, args: number[]): number {
    const one = () => {
      if (args.length !== 1) {
        throw new Error(`${name} expects one argument`);
      }
      return args[0];
    };

    const toRadians = (value: number) => (this.angleMode === 'deg' ? degreesToRadians(value) : value);
    const fromRadians = (value: number) => (this.angleMode === 'deg' ? radiansToDegrees(value) : value);

    switch (name) {
      case 'sin':
        return Math.sin(toRadians(one()));
      case 'cos':
        return Math.cos(toRadians(one()));
      case 'tan':
        return Math.tan(toRadians(one()));
      case 'asin':
        return fromRadians(Math.asin(one()));
      case 'acos':
        return fromRadians(Math.acos(one()));
      case 'atan':
        return fromRadians(Math.atan(one()));
      case 'log':
        return Math.log10(one());
      case 'ln':
        return Math.log(one());
      case 'sqrt':
        return Math.sqrt(one());
      case 'abs':
        return Math.abs(one());
      case 'exp':
        return Math.exp(one());
      case 'pow':
        if (args.length !== 2) {
          throw new Error('pow expects two arguments');
        }
        return Math.pow(args[0], args[1]);
      default:
        throw new Error(`Unsupported function: ${name}`);
    }
  }

  private current(): Token | undefined {
    return this.tokens[this.position];
  }

  private consume(): Token | undefined {
    const token = this.current();
    this.position += 1;
    return token;
  }

  private expect(type: Token['type']): void {
    if (!this.match(type)) {
      throw new Error(`Expected ${type}`);
    }
  }

  private peek(type: Token['type']): boolean {
    return this.current()?.type === type;
  }

  private match(type: Token['type']): boolean {
    if (!this.peek(type)) {
      return false;
    }

    this.position += 1;
    return true;
  }

  private matchOperator(operator: Operator): boolean {
    const token = this.current();
    if (token?.type !== 'operator' || token.value !== operator) {
      return false;
    }

    this.position += 1;
    return true;
  }
}
