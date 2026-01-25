const fs = require('fs');

// Batch 51 工具
const batch51Tools = [
  'dockerfile-generator', 'eslint-config-generator', 'prettier-config-generator',
  'tsconfig-generator', 'editorconfig-generator', 'github-readme-generator',
  'changelog-generator', 'license-generator', 'rot13-encoder', 'caesar-cipher',
  'vigenere-cipher', 'checksum-verifier', 'inflation-calculator', 'break-even-calculator',
  'margin-calculator', 'markup-calculator', 'hashtag-generator', 'email-signature-generator'
];

// Batch 52 工具
const batch52Tools = [
  'glassmorphism-generator', 'neumorphism-generator', 'blob-generator',
  'wave-generator', 'mesh-gradient-generator', 'noise-texture-generator',
  'commit-message-generator', 'bandwidth-calculator', 'data-transfer-calculator',
  'pixel-density-calculator', 'dpi-calculator'
];

const languages = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const requiredFields = ['name', 'description', 'seo_title', 'seo_description', 'detailed_description', 'usage_steps', 'usage_examples'];

console.log('=== Batch 51 翻译检查 ===');
let batch51Missing = [];
for (const tool of batch51Tools) {
  for (const lang of languages) {
    const data = JSON.parse(fs.readFileSync('src/messages/' + lang + '.json', 'utf8'));
    const toolData = data.tools && data.tools[tool];
    if (!toolData) {
      batch51Missing.push({ tool, lang, issue: 'missing' });
    } else {
      const missing = requiredFields.filter(f => !toolData[f] || (Array.isArray(toolData[f]) && toolData[f].length === 0));
      if (missing.length > 0) {
        batch51Missing.push({ tool, lang, issue: 'incomplete', fields: missing });
      }
    }
  }
}

if (batch51Missing.length === 0) {
  console.log('✓ Batch 51 所有翻译完整');
} else {
  console.log('✗ Batch 51 缺失翻译:');
  const grouped = {};
  batch51Missing.forEach(m => {
    if (!grouped[m.tool]) grouped[m.tool] = [];
    grouped[m.tool].push(m.lang + (m.fields ? '(' + m.fields.join(',') + ')' : ''));
  });
  Object.keys(grouped).forEach(tool => {
    console.log('  ' + tool + ': ' + grouped[tool].join(', '));
  });
}

console.log('');
console.log('=== Batch 52 翻译检查 ===');
let batch52Missing = [];
for (const tool of batch52Tools) {
  for (const lang of languages) {
    const data = JSON.parse(fs.readFileSync('src/messages/' + lang + '.json', 'utf8'));
    const toolData = data.tools && data.tools[tool];
    if (!toolData) {
      batch52Missing.push({ tool, lang, issue: 'missing' });
    } else {
      const missing = requiredFields.filter(f => !toolData[f] || (Array.isArray(toolData[f]) && toolData[f].length === 0));
      if (missing.length > 0) {
        batch52Missing.push({ tool, lang, issue: 'incomplete', fields: missing });
      }
    }
  }
}

if (batch52Missing.length === 0) {
  console.log('✓ Batch 52 所有翻译完整');
} else {
  console.log('✗ Batch 52 缺失翻译:');
  const grouped = {};
  batch52Missing.forEach(m => {
    if (!grouped[m.tool]) grouped[m.tool] = [];
    grouped[m.tool].push(m.lang + (m.fields ? '(' + m.fields.join(',') + ')' : ''));
  });
  Object.keys(grouped).forEach(tool => {
    console.log('  ' + tool + ': ' + grouped[tool].join(', '));
  });
}

console.log('');
console.log('=== 总结 ===');
console.log('Batch 51 缺失数: ' + batch51Missing.length);
console.log('Batch 52 缺失数: ' + batch52Missing.length);
