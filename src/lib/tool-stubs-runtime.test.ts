import { describe, expect, it } from 'vitest';
import {
  base64UrlEncode,
  calculateBreakEven,
  calculateCapacity,
  calculateStats,
  decodeJwt,
  formatJson,
  formatSql,
  generateGo,
  generateJava,
  generateJavaScript,
  generatePhp,
  generatePython,
  generateRuby,
  generateSecret,
  generateTotp,
  getContrastRatio,
  getWCAGLevel,
  minifySql,
  parseCurlCommand,
  parseResponse,
  sortObject,
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

  it('formats and minifies SQL strings', () => {
    const sql =
      "select id, name from users where status = 'active' and created_at > '2024-01-01' order by name desc limit 10";

    expect(formatSql(sql)).toContain('\nFROM users');
    expect(formatSql(sql)).toContain('\n  AND created_at');
    expect(minifySql(sql)).toBe(
      "SELECT id, name FROM users WHERE status = 'active' AND created_at > '2024-01-01' ORDER BY name DESC LIMIT 10"
    );
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

  it('keeps shared generator exports stable for non-curl shapes', () => {
    const openApiLike = {
      openapi: '3.0.0',
      paths: {
        '/users': {
          get: {
            operationId: 'listUsers',
          },
        },
      },
    };

    expect(generatePython(openApiLike)).toBe('');
    expect(generateGo(openApiLike)).toBe('');
  });
});
