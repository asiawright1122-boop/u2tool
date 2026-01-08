import * as fs from 'fs';
const base = JSON.parse(fs.readFileSync('src/messages/es/base.json', 'utf8'));
console.log('ES base.json keys:', Object.keys(base).join(', '));
console.log('nav:', !!base.nav);
console.log('tools:', !!base.tools);
console.log('tools.toolIntroduction:', !!base.tools?.toolIntroduction);
