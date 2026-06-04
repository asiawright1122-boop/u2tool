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

const LOCALES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'zh'];
const TOOLS = ['world-cup-group-calculator', 'world-cup-timezone-planner', 'world-cup-visa-assistant', 'world-cup-simulator', 'world-cup-budget-calculator'];

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

  console.log('Testing World Cup tools across locales...');
  
  for (const tool of TOOLS) {
    console.log(`\n==================================================`);
    console.log(`Tool: ${tool}`);
    console.log(`==================================================`);
    
    for (const locale of LOCALES) {
      const page = await browser.newPage();
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });
      
      page.on('pageerror', err => {
        pageErrors.push(`${err.name}: ${err.message}\n${err.stack}`);
      });

      const url = `http://localhost:4322/${locale}/tools/${tool}/`;
      
      try {
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 10000
        });

        // Trigger client:visible Intersection Observer
        await page.evaluate(() => {
          window.scrollTo(0, 1000);
        });

        // Wait for rendering
        await new Promise(r => setTimeout(r, 2000));

        // Check if Initialising Engine is still visible
        const hasLoading = await page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('*'));
          return els.some(el => el.textContent && el.textContent.includes('Initialising Engine'));
        });

        const status = hasLoading ? '🔴 STUCK (Initialising)' : '🟢 LOADED';
        
        console.log(`  [${locale}] ${status}`);
        if (consoleErrors.length > 0) {
          console.log(`    Console Errors:`, consoleErrors);
        }
        if (pageErrors.length > 0) {
          console.log(`    Page Errors:`, pageErrors);
        }
      } catch (err: any) {
        console.log(`  [${locale}] ❌ FAILED TO NAVIGATE: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log('\nAll tests complete.');
}

run();
