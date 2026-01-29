/**
 * 添加剩余需要翻译的 UI 文本
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 需要添加的翻译
const translations = {
  // 通用翻译 - 添加到 tools 根级别
  common: {
    submit: { en: 'Submit', zh: '提交', ja: '送信', ko: '제출', es: 'Enviar', pt: 'Enviar', fr: 'Soumettre', de: 'Absenden', ru: 'Отправить', ar: 'إرسال' },
    click: { en: 'Click', zh: '点击', ja: 'クリック', ko: '클릭', es: 'Clic', pt: 'Clique', fr: 'Cliquer', de: 'Klicken', ru: 'Нажмите', ar: 'انقر' },
    never: { en: 'Never', zh: '从不', ja: '決して', ko: '절대', es: 'Nunca', pt: 'Nunca', fr: 'Jamais', de: 'Niemals', ru: 'Никогда', ar: 'أبداً' },
    link: { en: 'Link', zh: '链接', ja: 'リンク', ko: '링크', es: 'Enlace', pt: 'Link', fr: 'Lien', de: 'Link', ru: 'Ссылка', ar: 'رابط' },
  },
  
  // 工具特定翻译
  'batch-timestamp-converter': {
    localFormat: { en: 'Local Format', zh: '本地格式', ja: 'ローカル形式', ko: '로컬 형식', es: 'Formato Local', pt: 'Formato Local', fr: 'Format Local', de: 'Lokales Format', ru: 'Локальный формат', ar: 'التنسيق المحلي' },
  },
  
  'prettier-config-generator': {
    never: { en: 'Never', zh: '从不', ja: '決して', ko: '절대', es: 'Nunca', pt: 'Nunca', fr: 'Jamais', de: 'Niemals', ru: 'Никогда', ar: 'أبداً' },
  },
  
  'unused-imports-finder': {
    click: { en: 'Click', zh: '点击', ja: 'クリック', ko: '클릭', es: 'Clic', pt: 'Clique', fr: 'Cliquer', de: 'Klicken', ru: 'Нажмите', ar: 'انقر' },
    clickToAnalyze: { en: 'Click to analyze', zh: '点击分析', ja: 'クリックして分析', ko: '클릭하여 분석', es: 'Clic para analizar', pt: 'Clique para analisar', fr: 'Cliquer pour analyser', de: 'Klicken zum Analysieren', ru: 'Нажмите для анализа', ar: 'انقر للتحليل' },
  },
  
  'html-to-markdown': {
    link: { en: 'Link', zh: '链接', ja: 'リンク', ko: '링크', es: 'Enlace', pt: 'Link', fr: 'Lien', de: 'Link', ru: 'Ссылка', ar: 'رابط' },
  },
  
  'json-to-form': {
    submit: { en: 'Submit', zh: '提交', ja: '送信', ko: '제출', es: 'Enviar', pt: 'Enviar', fr: 'Soumettre', de: 'Absenden', ru: 'Отправить', ar: 'إرسال' },
  },
};

// 添加翻译
function addTranslations() {
  console.log('🔧 添加剩余翻译...\n');
  
  LOCALES.forEach(locale => {
    const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    let addedCount = 0;
    
    // 添加通用翻译
    Object.entries(translations.common).forEach(([key, trans]) => {
      if (!data.tools[key]) {
        data.tools[key] = trans[locale];
        addedCount++;
      }
    });
    
    // 添加工具特定翻译
    Object.entries(translations).forEach(([toolSlug, keys]) => {
      if (toolSlug === 'common') return;
      
      if (!data.tools[toolSlug]) {
        data.tools[toolSlug] = {};
      }
      
      Object.entries(keys).forEach(([key, trans]) => {
        if (!data.tools[toolSlug][key]) {
          data.tools[toolSlug][key] = trans[locale];
          addedCount++;
        }
      });
    });
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ ${locale}.json - 添加了 ${addedCount} 个翻译键`);
  });
  
  console.log('\n✅ 完成！');
}

addTranslations();
