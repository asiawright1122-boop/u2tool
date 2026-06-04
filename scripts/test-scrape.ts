import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

async function test() {
  const url = 'https://en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage';
  console.log('Fetching:', url);
  try {
    const res = await fetch(url);
    console.log('Status:', res.status);
    if (res.status !== 200) {
      console.error('Non-200 status');
      return;
    }
    const html = await res.text();
    console.log('Fetched HTML length:', html.length);
    const $ = cheerio.load(html);
    console.log('Number of tables:', $('table').length);
    console.log('Number of wikitable tables:', $('table.wikitable').length);

    const table = $('table.wikitable').first();
    const rowsToCheck = [1, 2, 3, 4, 10, 100, 495];
    for (const rIdx of rowsToCheck) {
      const row = table.find('tr').eq(rIdx);
      const tds = row.find('td');
      console.log(`Row ${rIdx} td count:`, tds.length);
      const groupLetters: string[] = [];
      for (let i = 0; i < 12; i++) {
        const text = $(tds[i]).text().trim();
        if (text) groupLetters.push(text);
      }
      const matches: string[] = [];
      for (let i = 12; i < 20; i++) {
        matches.push($(tds[i]).text().trim());
      }
      console.log(`  Key: ${groupLetters.join('')}`);
      console.log(`  Matches:`, matches.join(' | '));
    }
  } catch (err: any) {
    console.error('Error fetching:', err.message);
  }
}

test();
