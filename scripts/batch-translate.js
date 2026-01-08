const fs = require('fs');

// 工具翻译数据
const toolTranslations = {
  es: require('./translations/es-batch3.json'),
  pt: require('./translations/pt-batch3.json'),
  fr: require('./translations/fr-batch3.json'),
  de: require('./translations/de-batch3.json'),
  ru: require('./translations/ru-batch3.json'),
  ar: require('./translations/ar-batch3.json')
};

const locales = ['es', 'pt', 'fr', 'de', 'ru', 'ar'];

locales.forEach(locale => {
  const filePath = `src/messages/${locale}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  Object.keys(toolTranslations[locale]).forEach(toolSlug => {
    if (data.tools && data.tools[toolSlug]) {
      data.tools[toolSlug] = toolTranslations[locale][toolSlug];
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${locale}.json`);
});
