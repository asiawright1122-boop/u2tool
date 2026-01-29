/**
 * 全面审查所有语言的 SEO 本地化和个性化
 */
const fs = require('fs');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 各语言应该包含的关键词
const LOCALE_KEYWORDS = {
  en: ['free', 'online', 'tool', 'generator', 'converter', 'calculator'],
  zh: ['免费', '在线', '工具', '生成器', '转换器', '计算器'],
  ja: ['無料', 'オンライン', 'ツール', 'ジェネレーター', 'コンバーター', '計算機'],
  ko: ['무료', '온라인', '도구', '생성기', '변환기', '계산기'],
  es: ['gratis', 'online', 'herramienta', 'generador', 'convertidor', 'calculadora', 'gratuito', 'convertir', 'generar'],
  pt: ['grátis', 'online', 'ferramenta', 'gerador', 'conversor', 'calculadora', 'gratuito', 'converter', 'gerar'],
  fr: ['gratuit', 'en ligne', 'outil', 'générateur', 'convertisseur', 'calculateur', 'convertir', 'générer'],
  de: ['kostenlos', 'online', 'tool', 'generator', 'konverter', 'rechner', 'werkzeug', 'umwandeln'],
  ru: ['бесплатн', 'онлайн', 'инструмент', 'генератор', 'конвертер', 'калькулятор'],
  ar: ['مجان', 'عبر الإنترنت', 'أداة', 'مولد', 'محول', 'حاسبة']
};

// 各语言的特征词（用于检测是否已翻译）
const LOCALE_MARKERS = {
  es: ['gratis', 'gratuito', 'herramienta', 'convertidor', 'generador', 'calculadora', 'línea', 'convierte', 'genera'],
  pt: ['grátis', 'gratuito', 'ferramenta', 'conversor', 'gerador', 'calculadora', 'linha', 'converte', 'gera'],
  fr: ['gratuit', 'outil', 'convertisseur', 'générateur', 'calculateur', 'ligne', 'convertit', 'génère'],
  de: ['kostenlos', 'werkzeug', 'konverter', 'generator', 'rechner', 'umwandeln', 'erstellen'],
  ko: ['무료', '온라인', '도구', '생성기', '변환기', '계산기'],
  ja: ['無料', 'オンライン', 'ツール', 'ジェネレーター', 'コンバーター'],
  ru: ['бесплатн', 'онлайн', 'инструмент', 'генератор', 'конвертер'],
  ar: ['مجان', 'أداة', 'مولد', 'محول', 'حاسبة']
};

// 检查是否为纯英文（未翻译）
function isEnglishOnly(text, locale) {
  if (!text) return false;
  
  // 对于非拉丁语系语言，检查是否只包含 ASCII
  if (['zh', 'ja', 'ko', 'ru', 'ar'].includes(locale)) {
    // 如果只包含 ASCII 字符且有英文单词，则认为是英文
    if (/^[\x00-\x7F]+$/.test(text) && /[a-zA-Z]{4,}/.test(text)) {
      return true;
    }
    return false;
  }
  
  // 对于拉丁语系语言（es, pt, fr, de），检查是否包含该语言的特征词
  const markers = LOCALE_MARKERS[locale] || [];
  const lowerText = text.toLowerCase();
  
  // 如果包含该语言的特征词，则认为已翻译
  if (markers.some(marker => lowerText.includes(marker.toLowerCase()))) {
    return false;
  }
  
  // 德语中 "Tool" 是常用外来词，不应该被视为英文
  if (locale === 'de' && lowerText.includes('tool')) {
    // 检查是否有其他德语特征
    const germanWords = ['und', 'oder', 'für', 'mit', 'von', 'ein', 'eine', 'der', 'die', 'das', 'ist', 'sind', 'werden', 'können'];
    if (germanWords.some(word => lowerText.includes(word))) {
      return false;
    }
  }
  
  // 纯英文的特征词（这些词在其他语言中不常用）
  const pureEnglishWords = ['free', 'generator', 'converter', 'calculator', 'create', 'convert', 'generate', 'check', 'edit', 'view'];
  const hasPureEnglishWords = pureEnglishWords.some(word => {
    // 检查是否是独立单词（前后有空格或在开头/结尾）
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(text);
  });
  
  return hasPureEnglishWords;
}

// 检查是否包含本地化关键词
function hasLocalKeywords(text, locale) {
  if (!text) return false;
  const keywords = LOCALE_KEYWORDS[locale] || [];
  const lowerText = text.toLowerCase();
  return keywords.some(kw => lowerText.includes(kw.toLowerCase()));
}

const results = {};

// 获取实际工具列表（有 name 字段且 name 不是 UI 标签的才是工具）
const enData = JSON.parse(fs.readFileSync('src/messages/en.json', 'utf8'));
const realToolSlugs = new Set();
for (const [slug, tool] of Object.entries(enData.tools)) {
  if (typeof tool === 'object' && tool.name && tool.description) {
    // 排除 UI 命名空间（它们的 name 通常是短标签如 "Package Name", "Version" 等）
    // 实际工具的 name 通常更长且更具描述性
    if (tool.name.length > 15 || slug.includes('-')) {
      realToolSlugs.add(slug);
    }
  }
}
console.log(`实际工具数量: ${realToolSlugs.size}`);

for (const locale of LOCALES) {
  const filePath = `src/messages/${locale}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  const stats = {
    total: 0,
    missingTitle: [],
    missingDesc: [],
    englishTitle: [],
    englishDesc: [],
    noKeywordsTitle: [],
    noKeywordsDesc: [],
    duplicateTitles: {},
    duplicateDescs: {}
  };
  
  const seenTitles = {};
  const seenDescs = {};
  
  for (const [slug, tool] of Object.entries(data.tools)) {
    if (typeof tool !== 'object') continue;
    // 只检查实际工具，跳过 UI 命名空间
    if (!realToolSlugs.has(slug)) continue;
    stats.total++;
    
    const title = tool.seo_title;
    const desc = tool.seo_description;
    
    // 检查缺失
    if (!title) stats.missingTitle.push(slug);
    if (!desc) stats.missingDesc.push(slug);
    
    // 检查是否仍为英文（非英文语言）
    if (locale !== 'en') {
      if (title && isEnglishOnly(title, locale)) {
        stats.englishTitle.push({ slug, title });
      }
      if (desc && isEnglishOnly(desc, locale)) {
        stats.englishDesc.push({ slug, desc: desc.substring(0, 50) });
      }
    }
    
    // 检查是否包含本地化关键词
    if (title && !hasLocalKeywords(title, locale)) {
      stats.noKeywordsTitle.push({ slug, title });
    }
    if (desc && !hasLocalKeywords(desc, locale)) {
      stats.noKeywordsDesc.push({ slug, desc: desc.substring(0, 50) });
    }
    
    // 检查重复
    if (title) {
      if (seenTitles[title]) {
        if (!stats.duplicateTitles[title]) {
          stats.duplicateTitles[title] = [seenTitles[title]];
        }
        stats.duplicateTitles[title].push(slug);
      } else {
        seenTitles[title] = slug;
      }
    }
  }
  
  results[locale] = stats;
}

// 输出报告
console.log('=== SEO 本地化审查报告 ===\n');

for (const [locale, stats] of Object.entries(results)) {
  console.log(`\n📂 ${locale.toUpperCase()} (${stats.total} 个工具)`);
  console.log('─'.repeat(40));
  
  // 缺失检查
  if (stats.missingTitle.length > 0) {
    console.log(`  ❌ 缺少 seo_title: ${stats.missingTitle.length} 个`);
  }
  if (stats.missingDesc.length > 0) {
    console.log(`  ❌ 缺少 seo_description: ${stats.missingDesc.length} 个`);
  }
  
  // 英文内容检查（非英文语言）
  if (locale !== 'en') {
    if (stats.englishTitle.length > 0) {
      console.log(`  ⚠️  seo_title 仍为英文: ${stats.englishTitle.length} 个`);
      stats.englishTitle.slice(0, 5).forEach(i => 
        console.log(`      - ${i.slug}: "${i.title.substring(0, 50)}..."`)
      );
      if (stats.englishTitle.length > 5) {
        console.log(`      ... 还有 ${stats.englishTitle.length - 5} 个`);
      }
    }
    if (stats.englishDesc.length > 0) {
      console.log(`  ⚠️  seo_description 仍为英文: ${stats.englishDesc.length} 个`);
      stats.englishDesc.slice(0, 5).forEach(i => 
        console.log(`      - ${i.slug}`)
      );
      if (stats.englishDesc.length > 5) {
        console.log(`      ... 还有 ${stats.englishDesc.length - 5} 个`);
      }
    }
  }
  
  // 关键词检查
  const noKwTitle = stats.noKeywordsTitle.length;
  const noKwDesc = stats.noKeywordsDesc.length;
  if (noKwTitle > 0 || noKwDesc > 0) {
    console.log(`  📊 缺少本地化关键词:`);
    if (noKwTitle > 0) console.log(`      - seo_title: ${noKwTitle} 个`);
    if (noKwDesc > 0) console.log(`      - seo_description: ${noKwDesc} 个`);
  }
  
  // 重复检查
  const dupTitles = Object.keys(stats.duplicateTitles).length;
  if (dupTitles > 0) {
    console.log(`  🔄 重复的 seo_title: ${dupTitles} 组`);
  }
  
  // 如果没有问题
  if (stats.missingTitle.length === 0 && 
      stats.missingDesc.length === 0 && 
      stats.englishTitle.length === 0 && 
      stats.englishDesc.length === 0 &&
      dupTitles === 0) {
    console.log(`  ✅ SEO 内容完整且已本地化`);
  }
}

// 汇总需要修复的工具
console.log('\n\n=== 需要修复的工具汇总 ===\n');

const allEnglishTools = new Set();
const toolsByLocale = {};

for (const [locale, stats] of Object.entries(results)) {
  if (locale === 'en') continue;
  
  const tools = new Set();
  stats.englishTitle.forEach(i => tools.add(i.slug));
  stats.englishDesc.forEach(i => tools.add(i.slug));
  
  if (tools.size > 0) {
    toolsByLocale[locale] = [...tools];
    tools.forEach(t => allEnglishTools.add(t));
  }
}

if (allEnglishTools.size > 0) {
  console.log(`需要翻译的工具: ${allEnglishTools.size} 个`);
  
  // 按语言输出
  for (const [locale, tools] of Object.entries(toolsByLocale)) {
    console.log(`  ${locale}: ${tools.length} 个`);
  }
  
  fs.writeFileSync('seo-needs-translation.txt', [...allEnglishTools].join('\n'));
  console.log('\n已保存到 seo-needs-translation.txt');
} else {
  console.log('✅ 所有工具的 SEO 内容都已本地化！');
}
