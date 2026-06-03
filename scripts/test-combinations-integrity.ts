import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../src/lib/data/world-cup-3rd-combinations.json');

function testIntegrity() {
  console.log('Running combinations integrity checks...');

  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: File does not exist at ${jsonPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  let combinations: any;
  try {
    combinations = JSON.parse(fileContent);
  } catch (err: any) {
    console.error('Error: Failed to parse JSON file:', err.message);
    process.exit(1);
  }

  const keys = Object.keys(combinations);
  const expectedCount = 495;

  console.log(`Found ${keys.length} combination entries.`);

  if (keys.length !== expectedCount) {
    console.error(`Fail: Expected exactly ${expectedCount} combinations, but found ${keys.length}.`);
    process.exit(1);
  }

  const requiredSlots = ['M75', 'M76', 'M81', 'M82', 'M87_H', 'M87_A', 'M88_H', 'M88_A'];
  const validGroups = new Set(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']);

  for (const key of keys) {
    // Validate combination key format (e.g. "ABCDEFGH")
    if (key.length !== 8) {
      console.error(`Fail: Key "${key}" must be exactly 8 characters long.`);
      process.exit(1);
    }

    const uniqueChars = new Set(key.split(''));
    if (uniqueChars.size !== 8) {
      console.error(`Fail: Key "${key}" contains duplicate characters.`);
      process.exit(1);
    }

    const isSorted = key.split('').every((char, i, arr) => i === 0 || char > arr[i - 1]);
    if (!isSorted) {
      console.error(`Fail: Key "${key}" characters must be sorted alphabetically.`);
      process.exit(1);
    }

    for (const char of key) {
      if (!validGroups.has(char)) {
        console.error(`Fail: Key "${key}" contains invalid group letter "${char}".`);
        process.exit(1);
      }
    }

    const mapping = combinations[key];
    if (!mapping) {
      console.error(`Fail: Mapping for key "${key}" is missing or falsy.`);
      process.exit(1);
    }

    for (const slot of requiredSlots) {
      const val = mapping[slot];
      if (val === undefined || val === null) {
        console.error(`Fail: Slot "${slot}" in combination "${key}" is undefined or null.`);
        process.exit(1);
      }

      if (typeof val !== 'string') {
        console.error(`Fail: Slot "${slot}" in combination "${key}" is not a string: ${typeof val}`);
        process.exit(1);
      }

      // Check if value is formatted like '3X' where X is one of the letters in the key
      if (!/^3[A-L]$/.test(val)) {
        console.error(`Fail: Slot "${slot}" in combination "${key}" has invalid value format "${val}".`);
        process.exit(1);
      }

      const groupLetter = val.substring(1);
      if (!uniqueChars.has(groupLetter)) {
        console.error(`Fail: Slot "${slot}" in combination "${key}" refers to group "${groupLetter}" which is not in the combination key.`);
        process.exit(1);
      }
    }
  }

  console.log('Success: All integrity checks passed!');
}

testIntegrity();
