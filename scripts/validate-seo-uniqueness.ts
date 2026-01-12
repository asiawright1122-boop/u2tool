/**
 * SEO 唯一性验证脚本
 * 
 * 检查所有工具页面的 SEO 标题和描述是否唯一
 * 特别关注拉丁语系语言（es, pt, fr, de）的翻译是否正确使用
 */

import * as fs from 'fs';
import * as path from 'path';

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const latinLocales = ['es', 'pt', 'fr', 'de'];

interface ToolTranslation {
  name?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
}

interface Messages {
  tools?: Record<string, ToolTranslation>;
  tool?: Record<string, ToolTranslation>;
}

interface SeoData {
  locale: string;
  slug: string;
  title: string;
  description: string;
  source: 'translation' | 'template';
}

function loadMessages(locale: string): Messages {
  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getToolSeoData(messages: Messages, slug: string, locale: string): { title: string; description: string; source: 'translation' | 'template' } {
  // 优先从 tool 命名空间获取
  let toolData = messages.tool?.[slug];
  
  // 如果 tool 命名空间没有，尝试 tools 命名空间
  if (!toolData) {
    toolData = messages.tools?.[slug];
  }
  
  const toolName = toolData?.name || slug;
  const toolDescription = toolData?.description || '';
  
  // 检查是否有翻译的 SEO 数据
  const rawSeoTitle = toolData?.seo_title;
  const rawSeoDescription = toolData?.seo_description;
  
  // 模板
  const seoTitleTemplates: Record<string, string> = {
    en: `Free ${toolName} Online | U2Tool`,
    zh: `${toolName} - 免费在线工具 | U2Tool`,
    ja: `${toolName} - 無料オンラインツール | U2Tool`,
    ko: `${toolName} - 무료 온라인 도구 | U2Tool`,
    es: `${toolName} Gratis Online | U2Tool`,
    pt: `${toolName} Grátis Online | U2Tool`,
    fr: `${toolName} Gratuit en Ligne | U2Tool`,
    de: `${toolName} Kostenlos Online | U2Tool`,
    ru: `${toolName} - Бесплатный Онлайн | U2Tool`,
    ar: `${toolName} - أداة مجانية عبر الإنترنت | U2Tool`,
  };
  
  const seoDescTemplates: Record<string, string> = {
    en: `Use ${toolName} online for free. ${toolDescription} No registration required.`,
    zh: `免费在线使用${toolName}。${toolDescription} 无需注册。`,
    ja: `${toolName}を無料でオンライン使用。${toolDescription} 登録不要。`,
    ko: `${toolName}을(를) 무료로 온라인에서 사용하세요. ${toolDescription} 등록 불필요.`,
    es: `Use ${toolName} en línea gratis. ${toolDescription} Sin registro.`,
    pt: `Use ${toolName} online gratuitamente. ${toolDescription} Sem registro.`,
    fr: `Utilisez ${toolName} en ligne gratuitement. ${toolDescription} Sans inscription.`,
    de: `Verwenden Sie ${toolName} kostenlos online. ${toolDescription} Keine Registrierung.`,
    ru: `Используйте ${toolName} онлайн бесплатно. ${toolDescription} Без регистрации.`,
    ar: `استخدم ${toolName} مجانًا عبر الإنترنت. ${toolDescription} بدون تسجيل.`,
  };
  
  const title = rawSeoTitle || seoTitleTemplates[locale] || seoTitleTemplates.en;
  const description = rawSeoDescription || seoDescTemplates[locale] || seoDescTemplates.en;
  const source = rawSeoTitle ? 'translation' : 'template';
  
  return { title, description, source };
}

function getAllToolSlugs(): string[] {
  const enMessages = loadMessages('en');
  const slugs = new Set<string>();
  
  if (enMessages.tools) {
    for (const slug of Object.keys(enMessages.tools)) {
      if (typeof enMessages.tools[slug] === 'object' && enMessages.tools[slug].name) {
        slugs.add(slug);
      }
    }
  }
  
  if (enMessages.tool) {
    for (const slug of Object.keys(enMessages.tool)) {
      slugs.add(slug);
    }
  }
  
  return Array.from(slugs);
}

function main() {
  console.log('=== SEO 唯一性验证 ===\n');
  
  const toolSlugs = getAllToolSlugs();
  console.log(`检查 ${toolSlugs.length} 个工具，${locales.length} 种语言\n`);
  
  const allSeoData: SeoData[] = [];
  const titleCounts: Record<string, number> = {};
  const descCounts: Record<string, number> = {};
  
  // 统计每种语言使用翻译 vs 模板的情况
  const localeStats: Record<string, { translation: number; template: number }> = {};
  
  for (const locale of locales) {
    localeStats[locale] = { translation: 0, template: 0 };
    const messages = loadMessages(locale);
    
    for (const slug of toolSlugs) {
      const { title, description, source } = getToolSeoData(messages, slug, locale);
      
      allSeoData.push({ locale, slug, title, description, source });
      
      titleCounts[title] = (titleCounts[title] || 0) + 1;
      descCounts[description] = (descCounts[description] || 0) + 1;
      
      if (source === 'translation') {
        localeStats[locale].translation++;
      } else {
        localeStats[locale].template++;
      }
    }
  }
  
  // 输出每种语言的统计
  console.log('=== 各语言翻译使用情况 ===\n');
  for (const locale of locales) {
    const stats = localeStats[locale];
    const total = stats.translation + stats.template;
    const pct = ((stats.translation / total) * 100).toFixed(1);
    const isLatin = latinLocales.includes(locale);
    const marker = isLatin ? ' (拉丁语系)' : '';
    console.log(`${locale}${marker}: ${stats.translation}/${total} 使用翻译 (${pct}%), ${stats.template} 使用模板`);
  }
  
  // 检查重复标题
  console.log('\n=== 重复标题检查 ===\n');
  const duplicateTitles = Object.entries(titleCounts).filter(([, count]) => count > 1);
  
  if (duplicateTitles.length === 0) {
    console.log('✓ 没有重复的 SEO 标题');
  } else {
    console.log(`✗ 发现 ${duplicateTitles.length} 个重复的 SEO 标题:\n`);
    
    // 只显示前 10 个
    for (const [title, count] of duplicateTitles.slice(0, 10)) {
      console.log(`  "${title.substring(0, 50)}..." 出现 ${count} 次`);
      
      // 显示哪些工具/语言使用了这个标题
      const matches = allSeoData.filter(d => d.title === title);
      for (const match of matches.slice(0, 3)) {
        console.log(`    - ${match.locale}/${match.slug} (${match.source})`);
      }
      if (matches.length > 3) {
        console.log(`    - ... 还有 ${matches.length - 3} 个`);
      }
    }
    
    if (duplicateTitles.length > 10) {
      console.log(`\n  ... 还有 ${duplicateTitles.length - 10} 个重复标题`);
    }
  }
  
  // 检查重复描述
  console.log('\n=== 重复描述检查 ===\n');
  const duplicateDescs = Object.entries(descCounts).filter(([, count]) => count > 1);
  
  if (duplicateDescs.length === 0) {
    console.log('✓ 没有重复的 SEO 描述');
  } else {
    console.log(`✗ 发现 ${duplicateDescs.length} 个重复的 SEO 描述:\n`);
    
    // 只显示前 10 个
    for (const [desc, count] of duplicateDescs.slice(0, 10)) {
      console.log(`  "${desc.substring(0, 50)}..." 出现 ${count} 次`);
    }
    
    if (duplicateDescs.length > 10) {
      console.log(`\n  ... 还有 ${duplicateDescs.length - 10} 个重复描述`);
    }
  }
  
  // 特别检查拉丁语系语言
  console.log('\n=== 拉丁语系语言检查 (es, pt, fr, de) ===\n');
  
  for (const locale of latinLocales) {
    const stats = localeStats[locale];
    const total = stats.translation + stats.template;
    const pct = ((stats.translation / total) * 100).toFixed(1);
    
    if (stats.template > 0) {
      console.log(`⚠ ${locale}: ${stats.template} 个工具使用模板（可能缺少翻译）`);
      
      // 列出使用模板的工具
      const templateTools = allSeoData.filter(d => d.locale === locale && d.source === 'template');
      if (templateTools.length <= 5) {
        for (const tool of templateTools) {
          console.log(`    - ${tool.slug}`);
        }
      } else {
        console.log(`    - ${templateTools.slice(0, 3).map(t => t.slug).join(', ')} ... 等 ${templateTools.length} 个`);
      }
    } else {
      console.log(`✓ ${locale}: 所有 ${total} 个工具都使用翻译 (${pct}%)`);
    }
  }
  
  // 总结
  console.log('\n=== 总结 ===\n');
  const totalPages = toolSlugs.length * locales.length;
  const duplicateTitlePages = duplicateTitles.reduce((sum, [, count]) => sum + count - 1, 0);
  const duplicateDescPages = duplicateDescs.reduce((sum, [, count]) => sum + count - 1, 0);
  
  console.log(`总页面数: ${totalPages}`);
  console.log(`重复标题数: ${duplicateTitles.length} (影响 ${duplicateTitlePages} 个页面)`);
  console.log(`重复描述数: ${duplicateDescs.length} (影响 ${duplicateDescPages} 个页面)`);
  
  if (duplicateTitles.length === 0 && duplicateDescs.length === 0) {
    console.log('\n✓ SEO 验证通过！所有页面的标题和描述都是唯一的。');
    process.exit(0);
  } else {
    console.log('\n✗ SEO 验证失败！存在重复的标题或描述。');
    process.exit(1);
  }
}

main();
