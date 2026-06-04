import puppeteer from 'puppeteer';
import fs from 'fs';

function findChromeExecutable() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ];
  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function run() {
  const executablePath = findChromeExecutable();
  if (!executablePath) {
    console.error('Could not find local Chrome executable.');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log(`[BROWSER CONSOLE ${msg.type()}]:`, msg.text());
  });
  
  page.on('pageerror', err => {
    console.error('[BROWSER PAGEERROR]:', err.message, err.stack);
  });
  
  console.log('Navigating to calculator page on port 4322...');
  try {
    await page.goto('http://localhost:4322/zh/tools/world-cup-group-calculator/', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    console.log('Scrolling down to trigger client:visible Intersection Observer...');
    await page.evaluate(() => {
      window.scrollTo(0, 1000);
    });
    console.log('Waiting for 3 seconds for client-side rendering...');
    await new Promise(r => setTimeout(r, 3000));
  } catch (err: any) {
    console.error('Navigation or wait failed:', err.message);
  } finally {
    await browser.close();
    console.log('Done.');
  }
}

run();
