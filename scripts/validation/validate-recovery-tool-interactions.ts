import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import puppeteer from 'puppeteer';

const base = new URL(process.env.FETCH_BASE_URL ?? 'http://127.0.0.1:4327');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) throw new Error('Interaction gate requires local preview.');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
const failures: string[] = [];
await mkdir('artifacts/validation/tool-interactions', { recursive: true });
try {
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage();
    const crashes: string[] = [];
    page.on('pageerror', error => crashes.push(String(error)));
    await page.setViewport(viewport);
    // Capture clipboard API payloads in this test browser; no host clipboard writes.
    // Raw browser JS avoids transpiler-added helpers in serialized callbacks.
    await page.evaluateOnNewDocument(`
      Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
        writeText: async (value) => { window.__copied = value; },
      } });
    `);
    try {
      const response = await page.goto(new URL('/zh/tools/color-picker/', base).href, { waitUntil: 'networkidle0' });
      assert.equal(response?.status(), 200);
      await page.waitForSelector('#color-hex-input');
      const panel = await page.$eval('#color-hex-input', input => {
        const root = input.closest('.space-y-6')!;
        root.setAttribute('data-recovery-color-test', '');
        return '[data-recovery-color-test]';
      });
      const change = async (selector: string, value: string) => {
        await page.$eval(selector, (input, nextValue) => {
          (input as HTMLInputElement).value = nextValue;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }, value);
      };
      const assertFormats = async (hex: string, rgb: string, rgba: string, hsl: string) => {
        await page.waitForFunction((selector, expected) => {
          const values = Array.from(document.querySelectorAll(`${selector} [data-color-formats] .font-mono`)).map(el => el.textContent?.trim());
          return expected.every(value => values.includes(value));
        }, { timeout: 2000 }, panel, [hex, rgb, rgba, hsl]);
      };
      await change('#color-hex-input', '#ff0000');
      await assertFormats('#FF0000', 'rgb(255, 0, 0)', 'rgba(255, 0, 0, 1)', 'hsl(0, 100%, 50%)');
      await page.click(`${panel} [data-color-formats] button`);
      assert.equal(await page.evaluate(() => (window as any).__copied), '#FF0000');
      await change('#color-picker-input', '#00ff00');
      await assertFormats('#00FF00', 'rgb(0, 255, 0)', 'rgba(0, 255, 0, 1)', 'hsl(120, 100%, 50%)');
      await page.click(`${panel} button[title="#ffffff"]`);
      await assertFormats('#FFFFFF', 'rgb(255, 255, 255)', 'rgba(255, 255, 255, 1)', 'hsl(0, 0%, 100%)');
      await page.click(`${panel} button[title="#ff0000"]`);
      await assertFormats('#FF0000', 'rgb(255, 0, 0)', 'rgba(255, 0, 0, 1)', 'hsl(0, 100%, 50%)');
      await page.$eval(panel, el => el.scrollIntoView({ block: 'start' }));
      assert.equal(await page.$eval(panel, el => el.scrollWidth <= el.clientWidth), true, 'Tool panel must not overflow horizontally');
      await page.screenshot({ path: `artifacts/validation/tool-interactions/color-${viewport.width}.png` });
      assert.deepEqual(crashes, []);
      console.log(`PASS color-picker ${viewport.width}: HEX input, native color input, presets, recent colors and copy payload`);
    } catch (error) {
      failures.push(`color-picker ${viewport.width}: ${String(error)}`);
      console.error(crashes, await page.$eval('#color-hex-input', input => input.closest('.space-y-6')?.textContent).catch(() => 'No tool input'));
      await page.screenshot({ path: `artifacts/validation/tool-interactions/color-${viewport.width}-failure.png` });
    } finally { await page.close(); }
  }
  for (const browserZone of ['UTC', 'Asia/Shanghai', 'America/Los_Angeles']) {
    const page = await browser.newPage();
    try {
      await page.emulateTimezone(browserZone);
      await page.evaluateOnNewDocument(`
        const OriginalDate = Date;
        const fixed = OriginalDate.parse('2026-10-08T23:30:00Z');
        window.Date = class extends OriginalDate {
          constructor(...args) { super(...(args.length ? args : [fixed])); }
          static now() { return fixed; }
        };
      `);
      await page.goto(new URL('/zh/tools/timezone-converter/', base).href, { waitUntil: 'networkidle0' });
      await page.$eval('input[type="date"]', el => el.closest('.space-y-6')!.setAttribute('data-recovery-timezone-test', ''));
      const panel = '[data-recovery-timezone-test]';
      const read = () => page.$eval(panel, el => ({
        source: el.querySelector('select')!.value,
        date: el.querySelector<HTMLInputElement>('input[type="date"]')!.value,
        time: el.querySelector<HTMLInputElement>('input[type="time"]')!.value,
      }));
      const initial = await read();
      await page.select(`${panel} select`, 'Asia/Tokyo');
      await page.click(`${panel} button`);
      const nowTokyo = await read();
      assert.deepEqual({ initial, nowTokyo }, {
        initial: { source: 'UTC', date: '2026-10-08', time: '23:30' },
        nowTokyo: { source: 'Asia/Tokyo', date: '2026-10-09', time: '08:30' },
      });
      assert.equal(await page.$eval(`${panel} section .text-3xl`, el => el.textContent), '07:30:00');
      await page.$eval(`${panel} input[type="date"]`, el => {
        (el as HTMLInputElement).value = '';
        el.dispatchEvent(new Event('input', { bubbles: true }));
      });
      assert.equal((await read()).date, '', 'Clearing an input must not silently restore Now');
      assert.equal(await page.$eval(`${panel} section button`, el => (el as HTMLButtonElement).disabled), true);
      console.log(`PASS timezone-converter ${browserZone}: UTC selection and source-zone Now across midnight`);
    } catch (error) {
      failures.push(`timezone-converter ${browserZone}: ${String(error)}`);
    } finally { await page.close(); }
  }
} finally { await browser.close(); }
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
}
