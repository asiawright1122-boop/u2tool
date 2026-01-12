const fs = require('fs');

// Batch 49 tools
const batch49Tools = [
  'anagram-solver',
  'word-unscrambler', 
  'text-to-pdf',
  'unit-price-calculator',
  'bionic-reading-converter',
  'palindrome-checker',
  'character-map',
  'text-repeater',
  'fake-name-generator',
  'invisible-character-generator'
];

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// Check for English text in non-English locales
function hasEnglishText(value, locale) {
  if (locale === 'en') return false;
  if (typeof value !== 'string') return false;
  if (value.length < 15) return false;
  
  // Skip if it's a technical term or placeholder
  if (value.includes('{') || value.includes('%')) return false;
  
  // Check if the text is mostly ASCII letters (likely English)
  const asciiLetters = value.replace(/[^a-zA-Z]/g, '').length;
  const totalLetters = value.length;
  
  if (asciiLetters / totalLetters > 0.7) {
    return true;
  }
  return false;
}

// Check each tool in each locale
for (const tool of batch49Tools) {
  console.log('\n=== ' + tool + ' ===');
  
  for (const locale of locales) {
    const data = JSON.parse(fs.readFileSync('src/messages/' + locale + '.json', 'utf8'));
    const toolData = data.tools && data.tools[tool];
    
    if (!toolData) {
      console.log('  ' + locale + ': MISSING TOOL');
      continue;
    }
    
    const issues = [];
    
    // Check main fields
    const fieldsToCheck = ['name', 'description', 'seo_title', 'seo_description', 'detailed_description'];
    for (const field of fieldsToCheck) {
      if (toolData[field] && hasEnglishText(toolData[field], locale)) {
        issues.push(field + ': "' + toolData[field].substring(0, 50) + '..."');
      }
    }
    
    // Check usage_steps
    if (toolData.usage_steps && Array.isArray(toolData.usage_steps)) {
      for (let i = 0; i < toolData.usage_steps.length; i++) {
        if (hasEnglishText(toolData.usage_steps[i], locale)) {
          issues.push('usage_steps[' + i + ']: "' + toolData.usage_steps[i].substring(0, 40) + '..."');
        }
      }
    }
    
    // Check usage_examples
    if (toolData.usage_examples && Array.isArray(toolData.usage_examples)) {
      for (let i = 0; i < toolData.usage_examples.length; i++) {
        if (hasEnglishText(toolData.usage_examples[i], locale)) {
          issues.push('usage_examples[' + i + ']: "' + toolData.usage_examples[i].substring(0, 40) + '..."');
        }
      }
    }
    
    if (issues.length > 0) {
      console.log('  ' + locale + ': UNTRANSLATED');
      issues.forEach(i => console.log('    - ' + i));
    }
  }
}

console.log('\n\nDone!');
