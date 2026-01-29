const fs = require('fs');

// 需要添加 loadExample 的工具
const toolsNeedingLoadExample = [
  'code-complexity-analyzer',
  'code-duplication-finder',
  'database-schema-visualizer',
  'dead-code-analyzer',
  'dependency-vulnerability-checker',
  'json-to-protobuf-converter',
  'memory-leak-detector',
  'performance-profiler',
  'query-execution-planner',
  'sql-injection-tester',
  'sql-query-optimizer',
  'swagger-to-code-generator',
  'unused-imports-finder'
];

const translations = {
  en: 'Load Example',
  zh: '加载示例',
  ja: '例を読み込む',
  ko: '예제 로드',
  es: 'Cargar ejemplo',
  pt: 'Carregar exemplo',
  fr: 'Charger un exemple',
  de: 'Beispiel laden',
  ru: 'Загрузить пример',
  ar: 'تحميل مثال'
};

const languages = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

languages.forEach(lang => {
  const filePath = `src/messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  toolsNeedingLoadExample.forEach(slug => {
    if (data.tools[slug]) {
      data.tools[slug].loadExample = translations[lang];
    }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`Updated ${lang}.json`);
});

console.log('\nDone!');
