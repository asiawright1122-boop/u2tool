import fs from 'fs';
import path from 'path';

const LOCALES = ['ar', 'de', 'en', 'es', 'fr', 'ja', 'ko', 'pt', 'ru', 'zh'];
const TOOLS = ['world-cup-group-calculator', 'world-cup-timezone-planner', 'world-cup-visa-assistant', 'world-cup-simulator', 'world-cup-budget-calculator', 'developer-cryptography-toolbox'];
const messagesDir = path.join(process.cwd(), 'src', 'messages');

function getKeys(obj: any, prefix = ''): string[] {
  let keys: string[] = [];
  if (typeof obj !== 'object' || obj === null) return keys;
  
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    keys.push(fullKey);
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      keys = keys.concat(getKeys(val, fullKey));
    }
  }
  return keys;
}

function runCompare() {
  for (const tool of TOOLS) {
    console.log(`\n==================================================`);
    console.log(`Comparing translation keys for tool: ${tool}`);
    console.log(`==================================================`);
    
    const enPath = path.join(messagesDir, 'en', 'tools', `${tool}.json`);
    if (!fs.existsSync(enPath)) {
      console.error(`English translation file not found: ${enPath}`);
      continue;
    }
    
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const enKeys = new Set(getKeys(enData));
    
    for (const locale of LOCALES.filter(l => l !== 'en')) {
      const locPath = path.join(messagesDir, locale, 'tools', `${tool}.json`);
      if (!fs.existsSync(locPath)) {
        console.log(`  [${locale}] ❌ FILE MISSING: ${locPath}`);
        continue;
      }
      
      const locData = JSON.parse(fs.readFileSync(locPath, 'utf8'));
      const locKeys = getKeys(locData);
      
      const missingKeys = [...enKeys].filter(k => !locKeys.includes(k));
      if (missingKeys.length > 0) {
        console.log(`  [${locale}] 🔴 Missing ${missingKeys.length} keys:`);
        missingKeys.forEach(k => console.log(`    - ${k}`));
      } else {
        console.log(`  [${locale}] 🟢 Fully aligned`);
      }
    }
  }
}

runCompare();
