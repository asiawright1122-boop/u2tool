import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  const url = 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage';
  let html = '';

  try {
    console.log('Fetching online bracket combinations from Wikipedia...');
    const res = await fetch(url, { timeout: 10000 });
    if (res.status === 200) {
      html = await res.text();
      console.log('Successfully fetched online content.');
      // Save to offline backup cache
      const backupPath = path.join(__dirname, 'offline-wc-combinations-backup.html');
      fs.writeFileSync(backupPath, html, 'utf-8');
      console.log(`Saved fetched HTML to offline backup cache at: ${backupPath}`);
    } else {
      console.warn(`Online fetch returned status ${res.status}.`);
    }
  } catch (err: any) {
    console.warn('Online fetch failed or timed out:', err.message);
  }

  // Fallback to offline backup if online fetch failed
  if (!html || !html.includes('1Avs') || !html.includes('1Lvs')) {
    console.log('Falling back to local offline backup...');
    const backupPath = path.join(__dirname, 'offline-wc-combinations-backup.html');
    if (fs.existsSync(backupPath)) {
      html = fs.readFileSync(backupPath, 'utf-8');
    }
  }

  if (!html) {
    console.error('Error: Could not retrieve combinations HTML (both online fetch and offline backup failed or are empty).');
    process.exit(1);
  }

  const $ = cheerio.load(html);
  const combinations: Record<string, Record<string, string>> = {};

  // Locate the target table containing the combinations details
  let targetTable: cheerio.Cheerio | null = null;
  $('table.wikitable').each((_, el) => {
    const text = $(el).text();
    if (text.includes('1Avs') && text.includes('1Bvs') && text.includes('1Lvs')) {
      targetTable = $(el);
      return false; // break loop
    }
  });

  if (!targetTable) {
    console.error('Target combinations table not found in HTML!');
    process.exit(1);
  }

  const cleanVal = (cellText: string) => {
    const cleaned = cellText.replace(/\s+/g, '').toUpperCase();
    return cleaned.startsWith('3') ? cleaned : '3' + cleaned;
  };

  targetTable.find('tr').each((i: number, row: any) => {
    if (i === 0) return; // Skip table header row

    const tds = $(row).find('td');
    if (tds.length < 20) return; // Cell count validation to prevent out of bounds

    // Extract group letters from the first 12 tds (columns representing groups A to L)
    const groupLetters: string[] = [];
    for (let colIdx = 0; colIdx < 12; colIdx++) {
      const text = $(tds[colIdx]).text().trim();
      if (text) {
        groupLetters.push(String.fromCharCode(65 + colIdx));
      }
    }

    const key = groupLetters.join('');
    if (key.length !== 8) {
      // Each combination must have exactly 8 qualified third-placed teams
      return;
    }

    combinations[key] = {
      M75: cleanVal($(tds[12]).text()),
      M76: cleanVal($(tds[13]).text()),
      M81: cleanVal($(tds[14]).text()),
      M82: cleanVal($(tds[15]).text()),
      M87_H: cleanVal($(tds[16]).text()),
      M87_A: cleanVal($(tds[17]).text()),
      M88_H: cleanVal($(tds[18]).text()),
      M88_A: cleanVal($(tds[19]).text())
    };
  });

  const outPath = path.join(__dirname, '../src/lib/data/world-cup-3rd-combinations.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(combinations, null, 2), 'utf-8');
  console.log(`Successfully generated combinations JSON at: ${outPath}`);
  console.log(`Total entries parsed: ${Object.keys(combinations).length}`);
}

run();
