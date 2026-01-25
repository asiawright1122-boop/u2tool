const fs = require('fs');

const batch51 = ['dockerfile-generator', 'eslint-config-generator', 'prettier-config-generator', 'tsconfig-generator', 'editorconfig-generator', 'github-readme-generator', 'changelog-generator', 'license-generator', 'rot13-encoder', 'caesar-cipher', 'vigenere-cipher', 'checksum-verifier', 'inflation-calculator', 'break-even-calculator', 'margin-calculator', 'markup-calculator', 'hashtag-generator', 'email-signature-generator'];
const batch52 = ['glassmorphism-generator', 'neumorphism-generator', 'blob-generator', 'wave-generator', 'mesh-gradient-generator', 'noise-texture-generator', 'commit-message-generator', 'bandwidth-calculator', 'data-transfer-calculator', 'pixel-density-calculator', 'dpi-calculator'];
const allTools = [...batch51, ...batch52];
const locales = ['zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));

for (const locale of locales) {
  const localePath = 'src/messages/' + locale + '.json';
  const data = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  let added = 0;
  
  for (const slug of allTools) {
    if (!data.tools[slug] || !data.tools[slug].name) {
      if (en.tools[slug]) {
        data.tools[slug] = { ...en.tools[slug] };
        added++;
      }
    }
  }
  
  if (added > 0) {
    fs.writeFileSync(localePath, JSON.stringify(data, null, 2) + '\n');
    console.log(locale + ': 添加了 ' + added + ' 个工具翻译');
  }
}
console.log('完成！');
