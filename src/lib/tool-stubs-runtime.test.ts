import { describe, expect, it } from 'vitest';
import {
  applyBitFlags,
  analyzeQuery,
  analyzeComplexity,
  analyzeDeadCode,
  analyzePerformance,
  ASCII_FONTS,
  base64UrlEncode,
  buildCrc32Table,
  buildOutlineTree,
  calculateBreakEven,
  calculateCapacity,
  calculateAspectRatio,
  calculateInflation,
  calculateMargin,
  calculateMarkup,
  calculateProjectEstimation,
  calculateStats,
  caesarCipher,
  cardPatterns,
  checkVulnerabilities,
  commonPasswords,
  commonTypos,
  convertTime,
  convertSqlToMongo,
  crc32,
  decodeJwt,
  detectMemoryLeaks,
  disposableDomains,
  detectFormat,
  EXAMPLE_CODE,
  EXAMPLE_PACKAGE_JSON,
  EXAMPLE_SPEC,
  EXAMPLE_SQL,
  extractHeadings,
  findAvailableSlots,
  findClosestColor,
  findDuplicates,
  findUnusedImports,
  flipMap,
  formatDocument,
  formatHour,
  formatJson,
  formatTime,
  formatSql,
  fromSeconds,
  formatMac,
  formatMinutesToTime,
  generateChangelog,
  generateCommitMessage,
  generateDataclass,
  generateDeployment,
  generateDockerCompose,
  generateExampleFile,
  generateFullSchema,
  generateGraphQLSchema,
  generateHashtags,
  generateHtmlToc,
  generateHPA,
  generateIngress,
  generateGo,
  generateImports,
  generateJava,
  generateJavaClass,
  generateJavaScript,
  generateKotlinClass,
  generateMinutes,
  generateNamespace,
  generateOutline,
  generateOutput,
  generatePhp,
  generatePrisma,
  generateProtoFile,
  generatePython,
  generateRawSQL,
  generateRuby,
  generateService,
  generateSecret,
  generateSvg,
  generateTotp,
  generateToc,
  generateTypeORM,
  generateTypeScript,
  getContrastRatio,
  getDaysUntil,
  getRiskLevel,
  getRiskScore,
  getWCAGLevel,
  isAvailable,
  isIpAddress,
  jsonToDart,
  jsonToProto,
  jsonToToml,
  jsonToYaml,
  minifyHtml,
  minifyXml,
  minifySql,
  mergeJsonObjects,
  mergeBusySlots,
  mirrorMap,
  MORSE_CODE,
  NATO_ALPHABET,
  normalizePrefix,
  optimizeSQL,
  parseEnvContent,
  parseTimestamp,
  parseCurlCommand,
  parseDependencies,
  parseGitLog,
  parseResponse,
  parseScatterCSV,
  parseSchema,
  parseTimeToMinutes,
  parseToml,
  parseTocInput,
  parseYaml,
  sortObject,
  sqlToJson,
  sizeToTailwind,
  testForInjection,
  toSeconds,
  toEnv,
  toJson,
  toPinyin,
  toYaml,
  tokenizeRegex,
  formatValue,
  freeProviders,
  generateBackupScript,
  generateCleanedCode,
  generateCrontab,
  getSqlType,
  COMMON_RESOLUTIONS,
  ibanSpecs,
  getMonthRuns,
  getNextRuns,
  parseCron,
  parseCronExpression,
  parseConflicts,
  quoteIdentifier,
  randomByte,
  REVERSE_MORSE,
  rot13,
  smallCapsMap,
  subscriptMap,
  superscriptMap,
  validateIP,
  vigenereCipher,
  K,
  bicDatabase,
  emojiData,
} from './tool-stubs';

describe('tool-stubs runtime replacements', () => {
  it('encodes base64url and decodes JWT payloads', () => {
    const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = base64UrlEncode(
      JSON.stringify({ sub: '123', exp: 4102444800, iat: 1700000000 })
    );

    const decoded = decodeJwt(`${header}.${payload}.signature`);

    expect(decoded?.header.alg).toBe('HS256');
    expect(decoded?.payload.sub).toBe('123');
    expect(decoded?.expiresAt).toBeInstanceOf(Date);
    expect(decoded?.isExpired).toBe(false);
  });

  it('generates a base32 secret and deterministic TOTP code', async () => {
    const secret = generateSecret(32);

    expect(secret).toMatch(/^[A-Z2-7]{32}$/);
    await expect(
      generateTotp('GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', 30, 6, 59000)
    ).resolves.toBe('287082');
  });

  it('sorts nested objects and formats JSON output', () => {
    const sorted = sortObject({
      zebra: 1,
      apple: { zebra: 1, apple: 2 },
      mango: [{ beta: true, alpha: false }],
    });

    expect(Object.keys(sorted)).toEqual(['apple', 'mango', 'zebra']);
    expect(Object.keys((sorted as { apple: Record<string, unknown> }).apple)).toEqual([
      'apple',
      'zebra',
    ]);
    expect(formatJson(sorted, 2)).toContain('\n  "apple"');
  });

  it('parses raw HTTP responses into structured output', () => {
    const parsed = parseResponse(`HTTP/1.1 200 OK
Content-Type: application/json
X-Trace-Id: abc123

{"ok":true,"count":2}`);

    expect(parsed?.status).toBe(200);
    expect(parsed?.headers?.['X-Trace-Id']).toBe('abc123');
    expect(parsed?.contentType).toBe('application/json');
    expect(parsed?.body).toEqual({ ok: true, count: 2 });
  });

  it('computes break-even and team capacity metrics', () => {
    expect(calculateBreakEven(10000, 25, 50)).toMatchObject({
      breakEvenUnits: 400,
      breakEvenRevenue: 20000,
      contributionMargin: 25,
      contributionMarginRatio: 50,
    });

    expect(
      calculateCapacity(
        { hoursPerDay: 8, daysOff: 1, meetings: 8, adminTime: 4 },
        { durationDays: 10, holidays: 0, focusFactor: 0.8 }
      )
    ).toBe(48);
  });

  it('supports both sprint velocity and duplication stats', () => {
    expect(
      calculateStats([
        { committed: 30, completed: 25 },
        { committed: 28, completed: 28 },
        { committed: 32, completed: 30 },
      ])
    ).toMatchObject({
      average: 27.7,
      median: 28,
      min: 25,
      max: 30,
      trend: 'up',
      completionRate: 92,
      predictedNext: 28,
    });

    expect(
      calculateStats('line1\nline2\nline3\nline4', [
        { occurrences: [{ start: 2, end: 3 }] },
      ])
    ).toMatchObject({
      totalLines: 4,
      duplicateLines: 2,
      duplicationPercentage: 50,
    });
  });

  it('computes accessibility contrast helpers', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');

    expect(ratio).toBe(21);
    expect(getWCAGLevel(ratio, false)).toEqual({ aa: true, aaa: true });
    expect(getWCAGLevel(3.2, true)).toEqual({ aa: true, aaa: false });
  });

  it('implements deterministic text, checksum, and IP helpers', () => {
    expect(caesarCipher('Attack at dawn!', 3)).toBe('Dwwdfn dw gdzq!');
    expect(caesarCipher('Dwwdfn dw gdzq!', 3, true)).toBe('Attack at dawn!');
    expect(rot13('Hello, World!')).toBe('Uryyb, Jbeyq!');
    expect(vigenereCipher('ATTACKATDAWN', 'LEMON')).toBe('LXFOPVEFRNHR');
    expect(crc32(new TextEncoder().encode('123456789'), buildCrc32Table()).toString(16)).toBe('cbf43926');
    const detectCard = (value: string) => cardPatterns.find((card) => card.pattern.test(value))?.type;
    expect(detectCard('4111111111111111')).toBe('Visa');
    expect(detectCard('5555555555554444')).toBe('Mastercard');
    expect(detectCard('378282246310005')).toBe('American Express');
    expect(detectCard('6011111111111117')).toBe('Discover');
    expect(cardPatterns.length).toBeGreaterThanOrEqual(8);
    expect(validateIP('192.168.1.1')).toMatchObject({
      isValid: true,
      type: 'IPv4',
      details: { isPrivate: true, class: 'C' },
    });
    expect(validateIP('::1')).toMatchObject({ isValid: true, type: 'IPv6' });
    expect(isIpAddress('example.com')).toBe(false);
  });

  it('provides text utility reference data for visible transforms', () => {
    expect(ASCII_FONTS.standard.H).toHaveLength(5);
    const firstAsciiRow = 'HELLO'
      .split('')
      .map((character) => ASCII_FONTS.standard[character]?.[0] || ASCII_FONTS.standard[' '][0])
      .join(' ');
    expect(firstAsciiRow).toContain('█');

    expect(MORSE_CODE.S).toBe('...');
    expect(MORSE_CODE.O).toBe('---');
    expect(REVERSE_MORSE['...']).toBe('S');
    expect(NATO_ALPHABET.A).toBe('Alpha');
    expect(NATO_ALPHABET.C).toBe('Charlie');

    expect(smallCapsMap.a).toBe('ᴀ');
    expect(superscriptMap['2']).toBe('²');
    expect(subscriptMap['2']).toBe('₂');
    expect(flipMap.a).toBe('ɐ');
    expect(mirrorMap.b).toBe('d');
  });

  it('provides validation reference data for password and email tools', () => {
    expect(commonPasswords).toContain('password');
    expect(commonPasswords).toContain('123456');

    expect(commonTypos['gamil.com']).toBe('gmail.com');
    expect(commonTypos['hotmial.com']).toBe('hotmail.com');

    expect(freeProviders).toContain('gmail.com');
    expect(freeProviders).toContain('proton.me');

    expect(disposableDomains.some((domain) => 'mailinator.com'.includes(domain))).toBe(true);
    expect(disposableDomains.some((domain) => '10minutemail.com'.includes(domain))).toBe(true);
  });

  it('generates and formats MAC address bytes with secure random input', () => {
    expect(normalizePrefix('aa:bb:cc')).toEqual([170, 187, 204]);
    expect(normalizePrefix('0011.2233.4455')).toEqual([0, 17, 34, 51, 68, 85]);
    expect(normalizePrefix('abc')).toBeNull();
    expect(applyBitFlags(0x00, true, false)).toBe(0x02);
    expect(applyBitFlags(0xff, false, false)).toBe(0xfc);
    expect(formatMac([2, 0, 0, 255, 16, 11], { uppercase: false, separator: '-' })).toBe('02-00-00-ff-10-0b');

    const byte = randomByte();
    expect(Number.isInteger(byte)).toBe(true);
    expect(byte).toBeGreaterThanOrEqual(0);
    expect(byte).toBeLessThanOrEqual(255);
  });

  it('converts Chinese text to pinyin with and without tones', () => {
    expect(toPinyin('汉语', true)).toBe('hàn yǔ');
    expect(toPinyin('汉语', false)).toBe('han yu');
  });

  it('implements aspect ratio and small finance calculators', () => {
    expect(calculateAspectRatio(1920, 1080)).toBe('16:9');
    expect(calculateMarkup(50, 100)).toMatchObject({
      sellingPrice: 100,
      profit: 50,
      profitMargin: 50,
    });
    expect(calculateMargin(50, 100)).toMatchObject({
      profit: 50,
      grossProfit: 50,
      profitMargin: 50,
      markup: 100,
    });
    expect(calculateInflation(1000, 2020, 2022, 10)).toMatchObject({
      adjustedValue: 1210,
      totalInflation: 21,
    });
  });

  it('converts time calculator values to and from seconds', () => {
    expect(toSeconds({ hours: 1, minutes: 2, seconds: 3 })).toBe(3723);
    expect(fromSeconds(-90)).toEqual({ hours: 0, minutes: 1, seconds: 30, negative: true });
    expect(formatTime(fromSeconds(3661), '24h')).toBe('01:01:01');
    expect(formatTime(fromSeconds(-3661), '24h')).toBe('-01:01:01');
  });

  it('formats and minifies SQL strings', () => {
    const sql =
      "select id, name from users where status = 'active' and created_at > '2024-01-01' order by name desc limit 10";

    expect(formatSql(sql)).toContain('\nFROM users');
    expect(formatSql(sql)).toContain('\n  AND created_at');
    expect(minifySql(sql)).toBe(
      "SELECT id, name FROM users WHERE status = 'active' AND created_at > '2024-01-01' ORDER BY name DESC LIMIT 10"
    );
  });

  it('detects SQL injection patterns and returns optimization suggestions', () => {
    const injection = testForInjection(EXAMPLE_CODE);
    expect(injection.vulnerable).toBe(true);
    expect(injection.issues.map((issue) => issue.type)).toContain('String concatenated SQL');
    expect(injection.score).toBeLessThan(100);

    const safe = testForInjection("db.query('SELECT id FROM users WHERE id = ?', [req.params.id])");
    expect(safe.vulnerable).toBe(false);

    const optimized = optimizeSQL(EXAMPLE_SQL);
    expect(optimized.optimized).toContain('SELECT');
    expect(optimized.score).toBeLessThan(100);
    expect(optimized.suggestions.map((suggestion) => suggestion.type)).toContain('warning');
  });

  it('builds simplified query execution plan steps for SQL text', () => {
    const plan = analyzeQuery(EXAMPLE_SQL);

    expect(Array.isArray(plan)).toBe(true);
    expect(plan.map((step: { operation: string }) => step.operation)).toEqual(
      expect.arrayContaining(['Read query', 'Filter rows', 'Review filter shape', 'Sort results'])
    );
    expect(plan.reduce((sum: number, step: { cost: number }) => sum + step.cost, 0)).toBeGreaterThan(0);
    expect(plan.some((step: { warning?: string }) => step.warning)).toBe(true);
  });

  it('finds duplicate code windows and removes unused imports conservatively', () => {
    const duplicates = findDuplicates(EXAMPLE_CODE, 3);
    expect(duplicates.length).toBeGreaterThan(0);
    expect(duplicates[0].occurrences.length).toBeGreaterThan(1);

    const imports = findUnusedImports(EXAMPLE_CODE) as Array<{ source: string; unused: string[]; used: string[] }>;
    const promisesImport = imports.find((item) => item.source === 'fs/promises');
    expect(promisesImport?.unused).toEqual(['unlink']);
    expect(promisesImport?.used).toEqual(['readFile', 'saveFile']);

    const cleaned = generateCleanedCode(EXAMPLE_CODE, imports);
    expect(cleaned).toContain("import { readFile, writeFile as saveFile } from 'fs/promises';");
    expect(cleaned).not.toContain('unlink');
  });

  it('analyzes code complexity, dead code, and performance heuristics', () => {
    const complexity = analyzeComplexity(EXAMPLE_CODE, 'javascript');
    expect(complexity.totalLines).toBeGreaterThan(10);
    expect(complexity.codeLines).toBeGreaterThan(5);
    expect(complexity.functions.map((item: { name: string }) => item.name)).toEqual(
      expect.arrayContaining(['normalizeUser', 'normalizeAdmin'])
    );
    expect(complexity.overallComplexity).toBeGreaterThan(0);
    expect(complexity.maintainabilityIndex).toBeGreaterThan(0);

    const deadCode = analyzeDeadCode(`
function used() { return 1; }
function unused() { return 2; }
const orphan = 3;
console.log(used());
`);
    expect(deadCode.map((item: { name: string }) => item.name)).toEqual(
      expect.arrayContaining(['unused', 'orphan'])
    );

    const performance = analyzePerformance(`
for (const user of users) {
  for (const order of orders) console.log(user.id, order.id);
}
const parsed = JSON.parse(payload);
document.querySelectorAll('.row').forEach((row) => row.remove());
`);
    expect(performance.totalTime).toBeGreaterThan(0);
    expect(performance.operations.map((item: { name: string }) => item.name)).toEqual(
      expect.arrayContaining(['Nested loop penalty', 'JSON serialization work'])
    );
    expect(performance.hotspots.length).toBeGreaterThan(0);
    expect(performance.suggestions.length).toBeGreaterThan(0);
  });

  it('extracts document headings and renders outlines and tables of contents', () => {
    const headings = extractHeadings('# Title\n\n## Intro\n\n<h3>Details</h3>');
    expect(headings.map((heading) => `${heading.level}:${heading.text}`)).toEqual([
      '1:Title',
      '2:Intro',
      '3:Details',
    ]);

    const tree = buildOutlineTree(headings);
    expect(generateOutline(tree, { format: 'markdown', includeLinks: true, numbered: true, maxDepth: 3 })).toContain('[1. Title](#title)');
    expect(generateOutline(tree, { format: 'html', includeLinks: true, numbered: false, maxDepth: 3 })).toContain('<ul>');

    const toc = parseTocInput('Intro | 1\n  Install | 3\nUsage | 5');
    expect(toc[0].children[0]).toMatchObject({ title: 'Install', page: '3' });
    expect(generateToc(toc, { style: 'dotted', showPageNumbers: true, indentSize: 2 })).toContain('Intro');
    expect(generateHtmlToc(toc, { style: 'numbered', showPageNumbers: true })).toContain('<ol>');
  });

  it('generates Git helper outputs from structured inputs', () => {
    expect(generateCommitMessage({
      type: 'feat',
      scope: 'tools',
      subject: 'add git helpers',
      body: 'Generate conventional commit messages.',
      breaking: true,
      breakingDescription: 'old format removed',
      issues: '#123',
    })).toContain('feat(tools)!: add git helpers');

    const changelog = generateChangelog([
      { version: '1.2.0', date: '2026-05-06', entries: [{ type: 'added', description: 'Git helpers', issue: '#123' }] },
    ], 'keepachangelog');
    expect(changelog).toContain('### Added');
    expect(changelog).toContain('Git helpers');

    const commits = parseGitLog('abc1234|def5678 9999999|Ada|2026-05-06|Merge branch main');
    expect(commits[0]).toMatchObject({ shortHash: 'abc1234', isMerge: true, parents: ['def5678', '9999999'] });
  });

  it('generates Docker Compose and Kubernetes YAML manifests', () => {
    const compose = generateDockerCompose([
      { name: 'app', image: 'node:20-alpine', ports: ['3000:3000'], environment: { NODE_ENV: 'production' }, volumes: ['.:/app'], dependsOn: ['db'], restart: 'unless-stopped', command: 'npm start' },
      { name: 'db', image: 'postgres:16-alpine', volumes: ['postgres_data:/var/lib/postgresql/data'], ports: [], environment: {}, dependsOn: [], restart: 'unless-stopped', command: '' },
    ]);
    expect(compose).toContain('services:');
    expect(compose).toContain('postgres_data:');

    const config = {
      name: 'api',
      namespace: 'prod',
      image: 'example/api:1.0.0',
      replicas: 2,
      port: 80,
      targetPort: 3000,
      serviceType: 'ClusterIP',
      resources: { cpuRequest: '100m', cpuLimit: '500m', memoryRequest: '128Mi', memoryLimit: '512Mi' },
      envVars: [{ key: 'NODE_ENV', value: 'production' }],
      ingressHost: 'api.example.com',
      hpaMinReplicas: 2,
      hpaMaxReplicas: 5,
      hpaTargetCPU: 75,
    };
    expect(generateNamespace('prod')).toContain('kind: Namespace');
    expect(generateDeployment(config)).toContain('kind: Deployment');
    expect(generateService(config)).toContain('targetPort: 3000');
    expect(generateIngress(config)).toContain('api.example.com');
    expect(generateHPA(config)).toContain('averageUtilization: 75');
  });

  it('generates social hashtags and meeting minutes text', () => {
    const tags = generateHashtags('AI developer tools', 'linkedin', 5);
    expect(tags.hashtags).toHaveLength(5);
    expect(tags.hashtags[0]).toMatch(/^#/);

    const minutes = generateMinutes({
      title: 'Planning',
      date: '2026-05-06',
      time: '10:00',
      location: 'Zoom',
      attendees: 'Ada, Grace',
      agenda: '1. Roadmap',
      discussion: 'Reviewed scope.',
      decisions: 'Ship phase 1.',
      actionItems: [{ task: 'Write tests', assignee: 'Ada', dueDate: '2026-05-07' }],
      nextMeeting: 'Next Wednesday',
    }, 'markdown');
    expect(minutes).toContain('# Planning');
    expect(minutes).toContain('Write tests');
  });

  it('calculates project estimates, risk levels, and room availability', () => {
    const estimate = calculateProjectEstimation([
      { optimistic: 2, mostLikely: 3, pessimistic: 5 },
      { optimistic: 1, mostLikely: 2, pessimistic: 4 },
    ]);
    expect(estimate.expected).toBe(5.3);
    expect(estimate.confidence95.max).toBeGreaterThan(estimate.expected);

    expect(getRiskScore(3, 5)).toBe(15);
    expect(getRiskLevel(15)).toMatchObject({ level: 'Critical', color: 'red' });
    expect(isAvailable({ bookings: [{ start: 540, end: 600 }] }, 600, 660)).toBe(true);
    expect(isAvailable({ bookings: [{ start: 540, end: 600 }] }, 570, 630)).toBe(false);
  });

  it('generates environment variable files and parses scatter CSV data', () => {
    const vars = [
      { key: 'NODE_ENV', value: 'production', description: 'Runtime mode', required: true, secret: false },
      { key: 'API_KEY', value: 'secret value', description: 'API key', required: true, secret: true },
    ];
    expect(generateOutput(vars, 'env')).toContain('API_KEY="secret value"');
    expect(generateOutput(vars, 'json')).toContain('"NODE_ENV": "production"');
    expect(generateExampleFile(vars)).toContain('API_KEY=');

    const parsed = parseScatterCSV('series,x,y\nA,1,2\nA,3,4\nB,5,6');
    expect(parsed).toEqual([
      { name: 'A', data: [{ x: 1, y: 2 }, { x: 3, y: 4 }] },
      { name: 'B', data: [{ x: 5, y: 6 }] },
    ]);
  });

  it('generates database migrations and parses CREATE TABLE schemas', () => {
    const columns = [
      { name: 'id', type: 'SERIAL', nullable: false, primaryKey: true, unique: false, defaultValue: '', foreignKey: '' },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, primaryKey: false, unique: true, defaultValue: '', foreignKey: '' },
    ];
    expect(generateRawSQL('users', columns, 'postgresql', 'create')).toContain('CREATE TABLE "users"');
    expect(generatePrisma('users', columns)).toContain('model User');
    expect(generateTypeORM('users', columns)).toContain("@Entity('users')");

    const schema = parseSchema(`CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      org_id INTEGER REFERENCES organizations(id)
    );`);
    expect(schema[0]).toMatchObject({
      name: 'users',
      columns: [
        { name: 'id', pk: true },
        { name: 'email' },
        { name: 'org_id', fk: 'organizations.id' },
      ],
    });
  });

  it('converts INSERT SQL rows to JSON objects', () => {
    expect(
      sqlToJson("INSERT INTO users (id, name, active) VALUES (1, 'Ada', true), (2, 'Linus', false);")
    ).toEqual([
      { id: 1, name: 'Ada', active: true },
      { id: 2, name: 'Linus', active: false },
    ]);
  });

  it('converts common SQL statements to MongoDB shell queries', () => {
    const select = convertSqlToMongo("SELECT name, email FROM users WHERE age >= 18 AND status = 'active' ORDER BY name LIMIT 10");
    expect(select).toMatchObject({ collection: 'users', operation: 'find' });
    expect(select?.query).toContain('db.users.find');
    expect(select?.query).toContain('"age": {\n    "$gte": 18');
    expect(select?.query).toContain('.sort(');
    expect(select?.query).toContain('.limit(10)');

    const insert = convertSqlToMongo("INSERT INTO users (name, age) VALUES ('Ada', 36), ('Linus', 55)");
    expect(insert).toMatchObject({ operation: 'insertMany' });
    expect(insert?.query).toContain('db.users.insertMany');

    const update = convertSqlToMongo("UPDATE users SET status = 'inactive' WHERE age < 18");
    expect(update?.query).toContain('updateMany');
    expect(update?.query).toContain('"$set"');

    const deletion = convertSqlToMongo("DELETE FROM sessions WHERE last_seen < '2024-01-01'");
    expect(deletion?.query).toContain('deleteMany');
  });

  it('minifies HTML and XML without returning empty stubs', () => {
    expect(minifyHtml('<div>\n  <span>Hello</span>\n</div>')).toBe('<div><span>Hello</span></div>');
    expect(minifyXml('<root>\n  <item>value</item>\n</root>')).toBe('<root><item>value</item></root>');
  });

  it('ships IBAN country specs with valid MOD-97 examples', () => {
    expect(Object.keys(ibanSpecs)).toHaveLength(96);
    expect(ibanSpecs.DE).toMatchObject({
      name: 'Germany',
      length: 22,
      example: 'DE89370400440532013000',
    });
    expect(ibanSpecs.GB.example).toBe('GB82WEST12345698765432');

    const mod97 = (iban: string): number => {
      const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
      let remainder = 0;
      for (const char of rearranged) {
        const value = /[A-Z]/.test(char) ? String(char.charCodeAt(0) - 55) : char;
        for (const digit of value) {
          remainder = (remainder * 10 + Number(digit)) % 97;
        }
      }
      return remainder;
    };

    for (const [countryCode, spec] of Object.entries(ibanSpecs)) {
      expect(spec.example, countryCode).toHaveLength(spec.length);
      expect(mod97(spec.example), countryCode).toBe(1);
    }
  });

  it('ships common display resolution presets for the pixel density calculator', () => {
    expect(COMMON_RESOLUTIONS).toEqual(
      expect.arrayContaining([
        { name: 'Full HD 1080p', width: 1920, height: 1080 },
        { name: '4K UHD', width: 3840, height: 2160 },
        { name: '8K UHD', width: 7680, height: 4320 },
      ])
    );
    expect(COMMON_RESOLUTIONS).toHaveLength(7);
  });

  it('parses env files and exports common formats', () => {
    const parsed = parseEnvContent('API_KEY=abc123\nEMPTY=\nAPI_KEY=duplicate');

    expect(parsed.entries).toHaveLength(3);
    expect(parsed.errors[0]).toContain('duplicate key API_KEY');
    expect(toEnv(parsed.entries)).toContain('API_KEY=abc123');
    expect(toJson(parsed.entries)).toContain('"EMPTY": ""');
    expect(toYaml(parsed.entries)).toContain('API_KEY: abc123');
  });

  it('converts YAML/TOML documents without silent empty outputs', () => {
    const yamlObject = parseYaml('name: Ada\nactive: true\nskills:\n  - math\n  - code');
    expect(yamlObject).toEqual({ name: 'Ada', active: true, skills: ['math', 'code'] });
    expect(jsonToYaml(yamlObject)).toContain('skills:');

    const tomlObject = parseToml('title = "Example"\n[database]\nports = [8001, 8002]\nenabled = true');
    expect(tomlObject).toEqual({
      title: 'Example',
      database: { ports: [8001, 8002], enabled: true },
    });
    expect(jsonToToml(tomlObject)).toContain('[database]');
    expect(() => parseToml('__proto__ = "polluted"')).toThrow(/Unsafe object key/);
  });

  it('generates schemas and typed model code from JSON samples', () => {
    const sample = {
      id: 1,
      userName: 'ada',
      active: true,
      tags: ['admin'],
      address: { city: 'London' },
    };

    const python = generateDataclass(sample, 'User', { useDataclass: true, useOptional: true });
    expect(generateImports({ useDataclass: true, useOptional: true }, false, true)).toContain('dataclass');
    expect(python.main).toContain('class User');
    expect(python.main).toContain('user_name: str');
    expect(python.nested.join('\n')).toContain('class Address');

    expect(generateJavaClass(sample, 'User', { packageName: 'com.example', useGettersSetters: true }).main).toContain('private String userName;');
    expect(generateKotlinClass(sample, 'User', { useDataClass: true, useNullable: true }).main).toContain('data class User');
    expect(jsonToDart(JSON.stringify(sample), 'User')).toContain('class User');

    const graphql = generateGraphQLSchema(sample, 'User');
    expect(graphql).toContain('type User');
    expect(graphql).toContain('address: Address');

    const proto = jsonToProto(sample, 'User');
    expect(proto.fields.map((field: { name: string }) => field.name)).toContain('user_name');
    expect(generateProtoFile(proto, 'example')).toContain('message User');

    const schema = generateFullSchema(sample, { draft: 'draft-07', markAllRequired: true, includeExamples: true });
    expect(schema).toMatchObject({
      type: 'object',
      properties: { id: { type: 'integer' } },
      required: ['id', 'userName', 'active', 'tags', 'address'],
    });
  });

  it('parses dependency manifests and flags known vulnerable package ranges', () => {
    const dependencies = parseDependencies(EXAMPLE_PACKAGE_JSON);
    if (!dependencies) throw new Error('Expected example dependencies to parse');

    expect(dependencies).toMatchObject({
      lodash: '4.17.20',
      minimist: '1.2.5',
      webpack: '5.90.0',
    });

    const vulnerabilities = checkVulnerabilities(dependencies);
    expect(vulnerabilities.map((item) => `${item.severity}:${item.package}`)).toEqual([
      'critical:minimist',
      'high:axios',
      'high:lodash',
      'medium:jquery',
    ]);

    expect(parseDependencies('left-pad@1.3.0\n@scope/pkg: ^2.0.0')).toMatchObject({
      'left-pad': '1.3.0',
      '@scope/pkg': '^2.0.0',
    });
  });

  it('merges JSON and formats SQL helper values', () => {
    expect(mergeJsonObjects('{"a":1,"nested":{"x":1}}', '{"b":2,"nested":{"y":2}}', 'deep')).toContain('"y": 2');
    expect(getSqlType(true, 'postgresql')).toBe('BOOLEAN');
    expect(quoteIdentifier('user name', 'postgresql')).toBe('"user name"');
    expect(formatValue("O'Reilly", 'mysql')).toBe("'O''Reilly'");
  });

  it('supports timestamp, tailwind size, color, and milestone helpers', () => {
    expect(detectFormat('1700000000')).toBe('seconds');
    expect(parseTimestamp('1700000000000', 'milliseconds')?.toISOString()).toBe('2023-11-14T22:13:20.000Z');
    expect(sizeToTailwind('16px', 'p')).toBe('p-4');
    expect(sizeToTailwind('8px', 'rounded')).toBe('rounded-lg');
    expect(findClosestColor('#4682B4')[0]).toMatchObject({ name: 'Steel Blue' });
    expect(getDaysUntil('not-a-date')).toBe(0);
  });

  it('computes scheduling helpers without placeholder fallbacks', () => {
    expect(parseTimeToMinutes('09:30')).toBe(570);
    expect(parseTimeToMinutes('9 pm')).toBe(1260);
    expect(parseTimeToMinutes('invalid')).toBe(0);
    expect(formatMinutesToTime(1440)).toBe('24:00');
    expect(formatHour(25)).toBe('01:00');
    expect(formatHour(-1)).toBe('23:00');

    expect(
      mergeBusySlots([
        { start: 540, end: 600 },
        { start: 590, end: 660 },
        { start: 800, end: 820 },
      ])
    ).toEqual([
      { start: 540, end: 660, label: undefined, source: undefined },
      { start: 800, end: 820, label: undefined, source: undefined },
    ]);

    const conflicts = parseConflicts('09:00-10:00 Standup\n13:30 to 14:00 Review');
    expect(conflicts).toMatchObject([
      { start: 540, end: 600 },
      { start: 810, end: 840 },
    ]);

    const available = findAvailableSlots(
      [
        {
          name: 'Alice',
          busySlots: [
            { start: 540, end: 600 },
            { start: 780, end: 840 },
          ],
        },
        { name: 'Bob', busySlots: [{ start: '10:00', end: '11:00' }] },
      ],
      '09:00',
      '12:00',
      30
    );
    expect(available).toEqual([{ start: 660, end: 720 }]);

    expect(
      convertTime(
        '09:00',
        'America/New_York',
        'Europe/London',
        new Date('2026-01-15T12:00:00Z')
      )
    ).toBe('14:00');
  });

  it('parses cron schedules and calculates upcoming run times', () => {
    const parsed = parseCron('*/15 9-17 * * 1-5');
    if (!parsed) throw new Error('Expected cron expression to parse');
    if (!parsed.minute || !parsed.hour || !parsed.dayOfWeek) {
      throw new Error('Expected parsed cron fields to be present');
    }

    expect(parsed.minute).toMatchObject({ values: [0, 15, 30, 45], all: false });
    expect(parsed.hour.values).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17]);
    expect(parsed.dayOfWeek.values).toEqual([1, 2, 3, 4, 5]);

    const nextRuns = getNextRuns('0 9 * * 1-5', 2, new Date(2026, 4, 4, 8, 58));
    expect(nextRuns.map((date) => [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()])).toEqual([
      [2026, 4, 4, 9, 0],
      [2026, 4, 5, 9, 0],
    ]);

    const monthRuns = getMonthRuns('0 0 1 * *', 2026, 4);
    expect(monthRuns.map((date) => date.getDate())).toEqual([1]);
    expect(parseCronExpression('* * * * *', (key) => key)).toBe('everyMinute');
  });

  it('generates shell-quoted database backup scripts and crontab entries', () => {
    const config = {
      database: 'postgresql',
      host: 'db.example.com',
      dbName: "app prod; rm -rf /",
      username: 'backup-user',
      schedule: 'daily',
      retention: 14,
      compression: true,
      outputPath: '/tmp/backups',
    };

    const script = generateBackupScript(config);
    expect(script).toContain('pg_dump -h "$DB_HOST" -U "$DB_USER" "$DB_NAME"');
    expect(script).toContain("DB_NAME='app prod; rm -rf /'");
    expect(script).toContain('gzip -f "$BACKUP_FILE"');
    expect(script).toContain('find "$BACKUP_DIR" -type f -name "$DB_NAME-*" -mtime +"$RETENTION_DAYS" -delete');

    const crontab = generateCrontab(config);
    expect(crontab).toBe("0 2 * * * '/tmp/backups/backup-app-prod-rm-rf.sh' >> '/tmp/backups/backup-app-prod-rm-rf.sh.log' 2>&1");
  });

  it('parses representative curl commands and generates code for supported languages', () => {
    const parsed = parseCurlCommand(`curl -X POST 'https://api.example.com/users' \\
  -H 'Content-Type: application/json' \\
  -H 'Authorization: Bearer token123' \\
  -d '{"name":"John","email":"john@example.com"}'`);

    expect(parsed).toMatchObject({
      method: 'POST',
      url: 'https://api.example.com/users',
      dataType: 'json',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token123',
      },
    });
    expect(parsed.data).toContain('"name":"John"');

    expect(generateJavaScript(parsed)).toContain("fetch('https://api.example.com/users'");
    expect(generateJavaScript(parsed)).toContain("method: 'POST'");
    expect(generatePython(parsed)).toContain('requests.request(');
    expect(generatePython(parsed)).toContain('"POST"');
    expect(generateGo(parsed)).toContain('http.NewRequest("POST", "https://api.example.com/users"');
    expect(generateJava(parsed)).toContain('.method("POST", HttpRequest.BodyPublishers.ofString(');
    expect(generatePhp(parsed)).toContain("CURLOPT_POSTFIELDS => '{\"name\":\"John\",\"email\":\"john@example.com\"}'");
    expect(generateRuby(parsed)).toContain("request = Net::HTTP::Post.new(uri.request_uri)");
  });

  it('generates API clients from OpenAPI specs', () => {
    const openApiLike = {
      openapi: '3.0.0',
      info: { title: 'Users API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com' }],
      paths: {
        '/users': {
          get: {
            operationId: 'listUsers',
            parameters: [
              { name: 'limit', in: 'query', schema: { type: 'integer' } },
            ],
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: { type: 'array', items: { $ref: '#/components/schemas/User' } },
                  },
                },
              },
            },
          },
          post: {
            operationId: 'createUser',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/CreateUserRequest' },
                },
              },
            },
            responses: {
              '201': {
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
        '/users/{id}': {
          get: {
            operationId: 'getUser',
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            ],
            responses: {
              '200': {
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            required: ['id', 'email'],
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              active: { type: 'boolean' },
            },
          },
          CreateUserRequest: {
            type: 'object',
            required: ['email'],
            properties: {
              email: { type: 'string' },
            },
          },
        },
      },
    };

    const typeScript = generateTypeScript(openApiLike);
    expect(typeScript).toContain('export interface User');
    expect(typeScript).toContain('export async function listUsers');
    expect(typeScript).toContain('Promise<User[]>');
    expect(typeScript).toContain('encodeURIComponent(String(id))');

    expect(generateTypeScript(EXAMPLE_SPEC)).toContain('createUser(body: CreateUserRequest');
    expect(generatePython(openApiLike)).toContain('def list_users(');
    expect(generatePython(openApiLike)).toContain('requests.request');
    expect(generateGo(openApiLike)).toContain('func (c *Client) ListUsers');
  });

  it('formats documents with cleanup options', () => {
    const formatted = formatDocument(' hello ,world.\r\n\r\n this   is a test ', {
      trimLines: true,
      removeExtraSpaces: true,
      removeBlankLines: true,
      normalizeLineBreaks: true,
      capitalizeFirst: true,
      fixPunctuation: true,
      lineWidth: 12,
      indentStyle: 'spaces',
      indentSize: 2,
    });

    expect(formatted).toContain('  Hello,');
    expect(formatted).toContain('  world.');
    expect(formatted).toContain('  This is a');
    expect(formatted).not.toContain('\r');
  });

  it('detects common JavaScript memory leak patterns', () => {
    const result = detectMemoryLeaks(`
const cache = [];
window.addEventListener('resize', () => console.log(cache.length));
const timer = setInterval(() => cache.push(new Array(1000)), 1000);
const url = URL.createObjectURL(new Blob(['x']));
const observer = new MutationObserver(() => {});
observer.observe(document.body, { childList: true });
`);

    expect(result.score).toBeLessThan(100);
    expect(result.issues.map((issue: { type: string }) => issue.type)).toEqual(
      expect.arrayContaining([
        'Event listener without cleanup',
        'Uncleared interval',
        'Object URL not revoked',
        'Observer without disconnect',
      ])
    );
  });

  it('tokenizes regex patterns and renders a safe SVG diagram', () => {
    const tokens = tokenizeRegex('^(user|admin)-\\d{2,4}$');
    expect(tokens.map((token: { type: string }) => token.type)).toEqual(
      expect.arrayContaining(['anchor', 'group', 'special', 'quantifier'])
    );

    const svg = generateSvg(tokens);
    expect(svg).toContain('<svg');
    expect(svg).toContain('Regular expression diagram');
    expect(svg).not.toContain('<script');
  });

  it('provides genuine developer-db and emojiData reference collections', () => {
    // 验证 K (物理/密码学常量)
    expect(K).toBeInstanceOf(Array);
    expect(K.some(c => c.symbol === 'c' && c.value === 299792458)).toBe(true);

    // 验证 bicDatabase (SWIFT/BIC 银行代码)
    expect(bicDatabase).toBeInstanceOf(Object);
    expect(bicDatabase['CHASUS33XXX']).toMatchObject({ bankName: 'JPMorgan Chase Bank, N.A.', city: 'New York' });

    // 验证 emojiData (表情数据)
    expect(emojiData).toBeInstanceOf(Array);
    expect(emojiData.some(e => e.emoji === '😀' && e.category === 'smileys')).toBe(true);
  });
});
