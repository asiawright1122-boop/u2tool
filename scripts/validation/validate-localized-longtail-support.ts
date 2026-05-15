import fs from 'fs';
import path from 'path';

const locales = ['zh', 'es', 'pt', 'ja', 'ko', 'fr', 'de', 'ru', 'ar'] as const;

const targetSlugs = [
  'vcard-to-csv-converter',
  'docker-run-to-docker-compose-converter',
  'llms-txt-generator',
  'etsy-fee-calculator',
  'freelance-rate-calculator',
  'linkedin-headline-generator',
  'linkedin-summary-generator',
  'email-subject-line-generator',
  'instagram-bio-generator',
  'youtube-description-generator',
] as const;

const requiredAnchorsBySlug: Record<(typeof targetSlugs)[number], string[]> = {
  'vcard-to-csv-converter': ['BEGIN:VCARD', 'first_name,last_name,full_name,email,phone,company,title,address'],
  'docker-run-to-docker-compose-converter': ['--name', 'Compose YAML'],
  'llms-txt-generator': ['llms.txt', 'canonical URL', 'Key Pages'],
  'etsy-fee-calculator': ['Etsy-style fee assumptions', 'offsite ads rate', 'profit margin'],
  'freelance-rate-calculator': ['billable hours', 'hourly rate', 'yearly revenue'],
  'linkedin-headline-generator': ['LinkedIn headline', 'role', 'achievement'],
  'linkedin-summary-generator': ['LinkedIn', 'About', 'experience'],
  'email-subject-line-generator': ['subject line', 'campaign topic', 'benefit'],
  'instagram-bio-generator': ['Instagram', 'CTA', 'tone'],
  'youtube-description-generator': ['YouTube Studio', 'resource links', 'hashtags'],
};

const forbiddenTemplateResidueByLocale: Record<(typeof locales)[number], string[]> = {
  zh: ['快速起草', '最合适的结果复制到资料页', '受众、价格、格式或源数据'],
  es: ['primer borrador', 'mejor versión', 'audiencia, el precio'],
  pt: ['ponto de partida', 'melhor versão', 'audiência, preço'],
  ja: ['最適な結果をプロフィール', '対象者、価格、形式', '下書き作成、前提'],
  ko: ['가장 적합한 결과', '대상, 가격, 형식', '빠른 초안 작성'],
  fr: ['premier brouillon', 'meilleure version', 'l’audience, le prix'],
  de: ['ersten Entwurf', 'beste Version', 'Zielgruppe, Preis'],
  ru: ['лучшую версию', 'профиль, кампанию', 'быстрых черновиков'],
  ar: ['أفضل نسخة', 'أنشئ نسخة أخرى', 'الملف الشخصي أو الحملة'],
};

type ToolSupportCopy = {
  detailed_description?: unknown;
  usage_steps?: unknown;
  usage_examples?: unknown;
  faqs?: unknown;
};

function assert(condition: unknown, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function loadToolSupportCopy(locale: string, slug: string): ToolSupportCopy {
  const filePath = path.join(process.cwd(), 'src/messages', locale, 'tools', `${slug}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ToolSupportCopy;
}

function flattenCopy(copy: ToolSupportCopy): string {
  return [
    copy.detailed_description,
    ...(Array.isArray(copy.usage_steps) ? copy.usage_steps : []),
    ...(Array.isArray(copy.usage_examples) ? copy.usage_examples : []),
    ...(Array.isArray(copy.faqs)
      ? copy.faqs.flatMap((faq) => (typeof faq === 'object' && faq ? Object.values(faq) : []))
      : []),
  ]
    .filter((value) => typeof value === 'string')
    .join('\n');
}

let checked = 0;

for (const locale of locales) {
  for (const slug of targetSlugs) {
    const copy = loadToolSupportCopy(locale, slug);
    const label = `${locale}/${slug}`;
    const flat = flattenCopy(copy);

    assert(typeof copy.detailed_description === 'string' && copy.detailed_description.length > 120, `${label}: missing detailed description`);
    assert(Array.isArray(copy.usage_steps) && copy.usage_steps.length === 4, `${label}: expected 4 usage steps`);
    assert(Array.isArray(copy.usage_examples) && copy.usage_examples.length === 3, `${label}: expected 3 usage examples`);
    assert(Array.isArray(copy.faqs) && copy.faqs.length === 4, `${label}: expected 4 FAQs`);

    for (const [index, faq] of (copy.faqs || []).entries()) {
      assert(typeof faq === 'object' && faq !== null, `${label}: FAQ ${index + 1} must be an object`);
      const record = faq as Record<string, unknown>;
      assert(typeof record.question === 'string' && record.question.length > 0, `${label}: FAQ ${index + 1} missing question`);
      assert(typeof record.answer === 'string' && record.answer.length > 0, `${label}: FAQ ${index + 1} missing answer`);
      assert(!('q' in record) && !('a' in record), `${label}: FAQ ${index + 1} uses q/a keys instead of question/answer`);
    }

    for (const required of requiredAnchorsBySlug[slug]) {
      assert(flat.includes(required), `${label}: missing support-depth anchor "${required}"`);
    }

    for (const forbidden of forbiddenTemplateResidueByLocale[locale]) {
      assert(!flat.includes(forbidden), `${label}: contains old template residue "${forbidden}"`);
    }

    checked += 1;
  }
}

console.log(`Localized long-tail support checks passed. files=${checked}`);
