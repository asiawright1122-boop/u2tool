const fs = require('fs');
const en = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const slugs = Object.keys(en.tools).filter(k => typeof en.tools[k] === 'object' && en.tools[k].name);
const noFaq = slugs.filter(s => {
  const t = en.tools[s];
  return !t.faqs || (Array.isArray(t.faqs) && t.faqs.length === 0);
});
console.log('Missing FAQ:', noFaq.length);
console.log('Sample:', noFaq.slice(0, 5).join(', '));
