const fs = require('fs');
const langs = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const translations = {
  en: { showLess: 'Show Less', showMore: 'Show All' },
  zh: { showLess: '收起', showMore: '显示全部' },
  ja: { showLess: '折りたたむ', showMore: 'すべて表示' },
  ko: { showLess: '접기', showMore: '모두 보기' },
  es: { showLess: 'Mostrar menos', showMore: 'Mostrar todo' },
  pt: { showLess: 'Mostrar menos', showMore: 'Mostrar tudo' },
  fr: { showLess: 'Afficher moins', showMore: 'Afficher tout' },
  de: { showLess: 'Weniger anzeigen', showMore: 'Alle anzeigen' },
  ru: { showLess: 'Свернуть', showMore: 'Показать все' },
  ar: { showLess: 'عرض أقل', showMore: 'عرض الكل' },
};

langs.forEach(lang => {
  const filePath = 'src/messages/' + lang + '.json';
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.common) data.common = {};
  data.common.showLess = translations[lang].showLess;
  data.common.showMore = translations[lang].showMore;
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log('✓ ' + lang);
});
console.log('Done!');
