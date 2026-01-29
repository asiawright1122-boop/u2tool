const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const translations = {
  placeholder: { en: 'Placeholder', zh: '占位符', ja: 'プレースホルダー', ko: '플레이스홀더', es: 'Marcador', pt: 'Espaço reservado', fr: 'Espace réservé', de: 'Platzhalter', ru: 'Заполнитель', ar: 'عنصر نائب' }
};

LOCALES.forEach(locale => {
  const filePath = path.join(__dirname, '..', 'src', 'messages', locale + '.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  Object.entries(translations).forEach(([key, trans]) => {
    if (!data.tools[key]) {
      data.tools[key] = trans[locale];
      console.log('Added ' + key + ' to ' + locale);
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});
console.log('Done!');
