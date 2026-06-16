import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const distDir = path.join(repoRoot, 'dist', 'client');
const enJsonPath = path.join(repoRoot, 'src/messages/en.json');

const EXEMPT_STRINGS = new Set([
  'u2tool',
  'U2Tool'
]);

function extractStrings(obj: any, set: Set<string>) {
  if (typeof obj === 'string') {
    if (obj.length > 10 && !EXEMPT_STRINGS.has(obj)) {
      set.add(obj);
    }
  } else if (typeof obj === 'object' && obj !== null) {
    for (const key of Object.keys(obj)) {
      extractStrings(obj[key], set);
    }
  }
}

async function main() {
  console.log('=== Running TDK Translation Completeness Validation ===\n');

  if (!fs.existsSync(distDir)) {
    console.error(`Error: build output directory dist/client does not exist at ${distDir}.`);
    process.exit(1);
  }

  if (!fs.existsSync(enJsonPath)) {
    console.error(`Error: en.json not found at ${enJsonPath}.`);
    process.exit(1);
  }

  const enData = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  const englishStrings = new Set<string>();
  extractStrings(enData, englishStrings);

  console.log(`Extracted ${englishStrings.size} English fallback strings for comparison.`);

  const htmlFiles = await glob('**/*.html', { cwd: distDir });
  
  let violations = 0;

  for (const relativePath of htmlFiles) {
    // Skip english files
    if (relativePath === 'index.html' || relativePath.startsWith('en/') || relativePath.includes('/en/')) {
        continue;
    }

    const fullPath = path.join(distDir, relativePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const $ = cheerio.load(content);

    const lang = $('html').attr('lang');
    if (lang === 'en' || !lang) {
      continue;
    }

    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content')?.trim();
    
    if (title && englishStrings.has(title)) {
       console.error(`❌ Fallback Leak in ${relativePath}: <title> matches English exactly: "${title}"`);
       violations++;
    } else if (title) {
       const baseTitle = title.split('|')[0].trim();
       if (englishStrings.has(baseTitle)) {
           console.error(`❌ Fallback Leak in ${relativePath}: base <title> matches English exactly: "${baseTitle}"`);
           violations++;
       }
    }

    if (description && englishStrings.has(description)) {
       console.error(`❌ Fallback Leak in ${relativePath}: <meta name="description"> matches English exactly: "${description}"`);
       violations++;
    }

    const tdkContent = [title, description].join(' ').toUpperCase();
    const forbidden = ['TODO', 'PLACEHOLDER', 'MISSING', '${BASE_URL}'];
    for (const token of forbidden) {
       if (tdkContent.includes(token.toUpperCase())) {
           console.error(`❌ Placeholder Leak in ${relativePath}: TDK contains forbidden token "${token}"`);
           violations++;
       }
    }
  }

  if (violations > 0) {
    console.error(`\n❌ TDK Translation validation failed with ${violations} violations.`);
    process.exit(1);
  }

  console.log('✅ All non-English HTML pages have localized TDKs without English fallbacks!');
}

main().catch(err => {
  console.error('Unexpected TDK translation validation error:', err);
  process.exit(1);
});
