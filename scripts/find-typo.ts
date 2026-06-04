import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backupPath = path.join(__dirname, 'offline-wc-combinations-backup.html');
const html = fs.readFileSync(backupPath, 'utf-8');
const $ = cheerio.load(html);

const table = $('table.wikitable').first();
table.find('tr').each((i, row) => {
  const tds = $(row).find('td');
  if (tds.length < 20) return;
  
  const groupLetters: string[] = [];
  const cellTexts: string[] = [];
  for (let colIdx = 0; colIdx < 12; colIdx++) {
    const text = $(tds[colIdx]).text().trim();
    cellTexts.push(text);
    if (text) {
      groupLetters.push(text.toUpperCase());
    }
  }
  const key = groupLetters.join('');
  if (key.includes('S')) {
    console.log(`Row ${i} parsed key: ${key}`);
    console.log(`Raw cell HTML:`, $(row).html());
  }
});
