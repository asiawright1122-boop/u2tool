/**
 * 修复嵌套翻译键
 */
const fs = require('fs');

const languages = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const nestedTranslations = {
  'resume-builder': {
    en: { placeholders: { name: 'Your Name', title: 'Job Title', email: 'email@example.com', phone: '+1 234 567 890', location: 'City, Country', website: 'website.com' }, templates: { professional: 'Professional', minimal: 'Minimal', creative: 'Creative' } },
    zh: { placeholders: { name: '您的姓名', title: '职位头衔', email: 'email@example.com', phone: '+86 123 4567 8900', location: '城市, 国家', website: 'website.com' }, templates: { professional: '专业', minimal: '简约', creative: '创意' } },
    ja: { placeholders: { name: 'お名前', title: '職種', email: 'email@example.com', phone: '+81 90 1234 5678', location: '都市, 国', website: 'website.com' }, templates: { professional: 'プロフェッショナル', minimal: 'ミニマル', creative: 'クリエイティブ' } },
    ko: { placeholders: { name: '이름', title: '직함', email: 'email@example.com', phone: '+82 10 1234 5678', location: '도시, 국가', website: 'website.com' }, templates: { professional: '전문가', minimal: '미니멀', creative: '크리에이티브' } },
    es: { placeholders: { name: 'Tu nombre', title: 'Título del puesto', email: 'email@example.com', phone: '+34 612 345 678', location: 'Ciudad, País', website: 'website.com' }, templates: { professional: 'Profesional', minimal: 'Minimalista', creative: 'Creativo' } },
    pt: { placeholders: { name: 'Seu nome', title: 'Cargo', email: 'email@example.com', phone: '+55 11 91234 5678', location: 'Cidade, País', website: 'website.com' }, templates: { professional: 'Profissional', minimal: 'Minimalista', creative: 'Criativo' } },
    fr: { placeholders: { name: 'Votre nom', title: 'Titre du poste', email: 'email@example.com', phone: '+33 6 12 34 56 78', location: 'Ville, Pays', website: 'website.com' }, templates: { professional: 'Professionnel', minimal: 'Minimaliste', creative: 'Créatif' } },
    de: { placeholders: { name: 'Ihr Name', title: 'Berufsbezeichnung', email: 'email@example.com', phone: '+49 170 1234567', location: 'Stadt, Land', website: 'website.com' }, templates: { professional: 'Professionell', minimal: 'Minimalistisch', creative: 'Kreativ' } },
    ru: { placeholders: { name: 'Ваше имя', title: 'Должность', email: 'email@example.com', phone: '+7 999 123 45 67', location: 'Город, Страна', website: 'website.com' }, templates: { professional: 'Профессиональный', minimal: 'Минималистичный', creative: 'Креативный' } },
    ar: { placeholders: { name: 'اسمك', title: 'المسمى الوظيفي', email: 'email@example.com', phone: '+966 50 123 4567', location: 'المدينة، البلد', website: 'website.com' }, templates: { professional: 'احترافي', minimal: 'بسيط', creative: 'إبداعي' } }
  },
  'carbon-footprint-calculator': {
    en: { levels: { low: 'Low', average: 'Average', high: 'High', veryHigh: 'Very High' } },
    zh: { levels: { low: '低', average: '平均', high: '高', veryHigh: '非常高' } },
    ja: { levels: { low: '低', average: '平均', high: '高', veryHigh: '非常に高い' } },
    ko: { levels: { low: '낮음', average: '평균', high: '높음', veryHigh: '매우 높음' } },
    es: { levels: { low: 'Bajo', average: 'Promedio', high: 'Alto', veryHigh: 'Muy alto' } },
    pt: { levels: { low: 'Baixo', average: 'Médio', high: 'Alto', veryHigh: 'Muito alto' } },
    fr: { levels: { low: 'Faible', average: 'Moyen', high: 'Élevé', veryHigh: 'Très élevé' } },
    de: { levels: { low: 'Niedrig', average: 'Durchschnitt', high: 'Hoch', veryHigh: 'Sehr hoch' } },
    ru: { levels: { low: 'Низкий', average: 'Средний', high: 'Высокий', veryHigh: 'Очень высокий' } },
    ar: { levels: { low: 'منخفض', average: 'متوسط', high: 'مرتفع', veryHigh: 'مرتفع جداً' } }
  },
  'dpi-calculator': {
    en: { quality: { excellent: 'Excellent', good: 'Good', acceptable: 'Acceptable', low: 'Low' } },
    zh: { quality: { excellent: '优秀', good: '良好', acceptable: '可接受', low: '低' } },
    ja: { quality: { excellent: '優秀', good: '良好', acceptable: '許容範囲', low: '低' } },
    ko: { quality: { excellent: '우수', good: '좋음', acceptable: '허용 가능', low: '낮음' } },
    es: { quality: { excellent: 'Excelente', good: 'Bueno', acceptable: 'Aceptable', low: 'Bajo' } },
    pt: { quality: { excellent: 'Excelente', good: 'Bom', acceptable: 'Aceitável', low: 'Baixo' } },
    fr: { quality: { excellent: 'Excellent', good: 'Bon', acceptable: 'Acceptable', low: 'Faible' } },
    de: { quality: { excellent: 'Ausgezeichnet', good: 'Gut', acceptable: 'Akzeptabel', low: 'Niedrig' } },
    ru: { quality: { excellent: 'Отлично', good: 'Хорошо', acceptable: 'Приемлемо', low: 'Низко' } },
    ar: { quality: { excellent: 'ممتاز', good: 'جيد', acceptable: 'مقبول', low: 'منخفض' } }
  },
  'pixel-density-calculator': {
    en: { quality: { excellent: 'Excellent', good: 'Good', average: 'Average', low: 'Low' } },
    zh: { quality: { excellent: '优秀', good: '良好', average: '一般', low: '低' } },
    ja: { quality: { excellent: '優秀', good: '良好', average: '平均', low: '低' } },
    ko: { quality: { excellent: '우수', good: '좋음', average: '평균', low: '낮음' } },
    es: { quality: { excellent: 'Excelente', good: 'Bueno', average: 'Promedio', low: 'Bajo' } },
    pt: { quality: { excellent: 'Excelente', good: 'Bom', average: 'Médio', low: 'Baixo' } },
    fr: { quality: { excellent: 'Excellent', good: 'Bon', average: 'Moyen', low: 'Faible' } },
    de: { quality: { excellent: 'Ausgezeichnet', good: 'Gut', average: 'Durchschnitt', low: 'Niedrig' } },
    ru: { quality: { excellent: 'Отлично', good: 'Хорошо', average: 'Средне', low: 'Низко' } },
    ar: { quality: { excellent: 'ممتاز', good: 'جيد', average: 'متوسط', low: 'منخفض' } }
  }
};

// 深度合并函数
function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else if (target[key] === undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

// 应用翻译
for (const lang of languages) {
  const filePath = `src/messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let addedCount = 0;
  
  for (const [toolSlug, langTranslations] of Object.entries(nestedTranslations)) {
    const toolTranslations = langTranslations[lang];
    if (!toolTranslations) continue;
    
    if (!data.tools[toolSlug]) {
      data.tools[toolSlug] = {};
    }
    
    const before = JSON.stringify(data.tools[toolSlug]);
    deepMerge(data.tools[toolSlug], toolTranslations);
    const after = JSON.stringify(data.tools[toolSlug]);
    
    if (before !== after) addedCount++;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ ${lang}.json - 更新了 ${addedCount} 个工具的嵌套翻译`);
}

console.log('\n完成！');
