import { describe, expect, it } from 'vitest';
import { parseCurlCommand, generateJavaScript, generatePython, generatePhp, generateGo, generateJava } from './curl';

describe('basic cURL recovery contract', () => {
  it('infers POST and preserves quoted repeated spaces', () => {
    const parsed = parseCurlCommand(`curl https://api.example.com/ -d '{"note":"keep  two"}'`);
    expect(parsed.method).toBe('POST');
    expect(parsed.data).toBe('{"note":"keep  two"}');
  });
  it('keeps explicit methods, line continuations and headers', () => {
    const parsed = parseCurlCommand(`curl https://api.example.com/ \\\n -X PATCH -H 'X-Note: keep  two' -d 'hello  world'`);
    expect(parsed).toMatchObject({ method: 'PATCH', headers: { 'X-Note': 'keep  two' }, data: 'hello  world' });
  });
  it('JavaScript form output preserves the raw body and is executable with fake fetch', async () => {
    const parsed = parseCurlCommand(`curl https://api.example.com/ -d 'a=1&b=two'`);
    const code = generateJavaScript(parsed);
    expect(code).not.toContain('return data;');
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    let request: any;
    await new AsyncFunction('fetch', 'console', code)(async (url: string, options: any) => {
      request = { url, ...options }; return { json: async () => ({}) };
    }, { log() {} });
    expect(request).toMatchObject({ method: 'POST', body: 'a=1&b=two' });
  });
  it('Python JSON output uses native boolean and null literals', () => {
    const parsed = parseCurlCommand(`curl https://api.example.com/ -d '{"enabled":true,"optional":null}'`);
    expect(generatePython(parsed)).toContain('"enabled": True');
    expect(generatePython(parsed)).toContain('"optional": None');
  });
  it('PHP, Go and Java escape the quoted request body', () => {
    const parsed = parseCurlCommand(`curl https://api.example.com/ -d '{"note":"keep  two"}'`);
    expect(generatePhp(parsed)).toContain(`CURLOPT_POSTFIELDS => '{"note":"keep  two"}'`);
    expect(generateGo(parsed)).toContain('strings.NewReader("{\\"note\\":\\"keep  two\\"}")');
    expect(generateJava(parsed)).toContain('BodyPublishers.ofString("{\\"note\\":\\"keep  two\\"}")');
  });
  it('does not generate code with a missing URL', () => {
    for (const generator of [generateJavaScript, generatePython, generatePhp, generateGo, generateJava]) {
      expect(generator(parseCurlCommand(''))).toBe('');
    }
  });
});
