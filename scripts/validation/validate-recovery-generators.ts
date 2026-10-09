import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import puppeteer, { type Page } from 'puppeteer';

const base = new URL(process.env.FETCH_BASE_URL ?? 'http://127.0.0.1:4327');
if (!['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) throw new Error('Requires local preview');
const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const failures: string[] = [];
const island = 'astro-island[component-url*="ToolWrapper"]';
await mkdir('artifacts/validation/generator-interactions', { recursive: true });
async function open(slug: string, width = 1280, locale = 'zh'): Promise<Page> {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 900 });
  await page.evaluateOnNewDocument(`
    window.__downloads = [];
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) window.__downloads.push({ name: this.download, href: this.href });
    };
  `);
  const response = await page.goto(new URL(`/${locale}/tools/${slug}/`, base).href, { waitUntil: 'networkidle0' });
  assert.equal(response?.status(), 200);
  await page.$eval(island, el => el.scrollIntoView({ block: 'center' }));
  return page;
}
async function check(name: string, run: () => Promise<void>) {
  try { await run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push(`${name}: ${String(error)}`); }
}
try {
  for (const width of [1280, 390]) {
    await check(`wordcloud text ${width}`, async () => {
      const page = await open('wordcloud-generator', width);
      try {
        await page.waitForSelector(`${island} canvas`);
        await page.$eval('#word-cloud-generator-field-11', el => {
          (el as HTMLTextAreaElement).value = 'apple apple banana 中文 中文';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await page.$eval('#word-cloud-generator-field-11', el => el.parentElement!.querySelector('button')!.click());
        const rows = await page.$$eval(`${island} .max-h-48 input`, els => els.map(el => (el as HTMLInputElement).value));
        assert.deepEqual(rows, ['apple', '20', '中文', '20', 'banana', '10']);
        assert.equal(await page.$eval(`${island} .max-h-48`, el => el.scrollWidth <= el.clientWidth), true, 'Word rows must not hide delete buttons beyond their viewport');
        await (await page.$(`${island} .space-y-4`))!.screenshot({ path: `artifacts/validation/generator-interactions/wordcloud-${width}.png` });
      } finally { await page.close(); }
    });
    await check(`graph remove/add ${width}`, async () => {
      const page = await open('graph-chart-generator', width);
      const errors: string[] = [];
      page.on('pageerror', e => errors.push(String(e)));
      try {
        await page.waitForSelector(`${island} canvas`);
        await page.$eval(`${island} .max-h-40 button`, el => (el as HTMLButtonElement).click());
        await page.$eval(`${island} .max-h-40`, el => el.parentElement!.querySelector('button')!.click());
        const ids = await page.$$eval(`${island} .max-h-32 select:first-child option`, els => els.slice(0, 6).map(el => (el as HTMLOptionElement).value));
        assert.equal(new Set(ids).size, 6, JSON.stringify({ ids, errors }));
        assert.deepEqual(errors, []);
        assert.equal(await page.$eval(`${island} .max-h-40`, el => el.scrollWidth <= el.clientWidth), true, 'Node rows must not overflow horizontally');
        await (await page.$(`${island} .space-y-4`))!.screenshot({ path: `artifacts/validation/generator-interactions/graph-${width}.png` });
      } finally { await page.close(); }
    });
  }
  for (const slug of ['wordcloud-generator', 'graph-chart-generator']) {
    await check(`${slug} exports`, async () => {
      const page = await open(slug);
      try {
        await page.waitForSelector(`${island} canvas`);
        // Export again after SVG to ensure disposing the detached painter leaves
        // the live chart and its storage intact.
        for (const format of ['PNG', 'SVG', 'PNG']) {
          await page.$eval(island, (el, format) => {
            const button = [...el.querySelectorAll('button')].find(el => el.textContent?.includes(format));
            if (!button) throw new Error(`Missing ${format} button`);
            button!.click();
          }, format);
        }
        const downloads = await page.evaluate(() => (window as any).__downloads.map((x: any) => ({ name: x.name, mime: x.href.split(',')[0] })));
        assert.equal(downloads.length, 3, JSON.stringify(downloads));
        assert.match(downloads[0].mime, /^data:image\/png/);
        assert.match(downloads[2].mime, /^data:image\/png/);
        assert.match(downloads[1].mime, /^data:image\/svg\+xml/, JSON.stringify(downloads));
        const svgSummary = await page.evaluate(() => {
          const href = (window as any).__downloads[1].href as string;
          const svg = decodeURIComponent(href.slice(href.indexOf(',') + 1));
          const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
          return { root: doc.documentElement.localName, errors: doc.querySelectorAll('parsererror').length,
            text: doc.querySelectorAll('text').length, paths: doc.querySelectorAll('path').length,
            images: doc.querySelectorAll('image').length };
        });
        assert.equal(svgSummary.root, 'svg');
        assert.equal(svgSummary.errors, 0);
        assert.ok(svgSummary.text > 1, JSON.stringify(svgSummary));
        if (slug === 'graph-chart-generator') assert.ok(svgSummary.paths > 0, JSON.stringify(svgSummary));
        assert.equal(svgSummary.images, 0, 'SVG must contain vectors, not an embedded PNG');
      } finally { await page.close(); }
    });
  }
  for (const locale of ['zh', 'en']) await check(`curl ${locale} implicit POST, whitespace and five outputs`, async () => {
    const page = await open('curl-converter', 1280, locale);
    try {
      const body = '{"enabled":true,"note":"keep  two"}';
      await page.$eval('#curl-converter-field-5', (el, body) => {
        (el as HTMLTextAreaElement).value = `curl https://api.example.com/users -H 'Content-Type: application/json' -d '${body}'`;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, body);
      await page.$eval(island, el => (el.querySelector('button') as HTMLButtonElement).click());
      const code = await page.$eval(`${island} pre code`, el => el.textContent!);
      // Execute only locally generated test code with a fake fetch, never a network request.
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      let request: any;
      await new AsyncFunction('fetch', 'console', code)(async (url: string, options: any) => {
        request = { url, ...options }; return { json: async () => ({}) };
      }, { log() {} });
      assert.equal(request.method, 'POST');
      assert.equal(JSON.parse(request.body).note, 'keep  two');
      for (const [language, marker] of Object.entries({ python: 'requests.request(', php: 'CURLOPT_POSTFIELDS', go: 'http.NewRequest(', java: 'BodyPublishers.ofString(' })) {
        await page.select('#curl-converter-field-4', language);
        await page.$eval(island, el => (el.querySelector('button') as HTMLButtonElement).click());
        const output = await page.$eval(`${island} pre code`, el => el.textContent!);
        assert.ok(output.includes(marker), `${language}: missing template`);
        assert.ok(output.includes('POST') && output.includes('keep  two'), `${language}: request details changed`);
      }
    } finally { await page.close(); }
  });
} finally { await browser.close(); }
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
