import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { assessSupportContentTrust } from '../../src/lib/content-trust.js';

const highValueCandidates = [
  { locale: 'ru', slug: 'hex-editor' },
  { locale: 'en', slug: 'hex-editor' },
  { locale: 'de', slug: 'text-to-handwriting' },
  { locale: 'ru', slug: 'barcode-generator' },
  { locale: 'fr', slug: 'file-size-calculator' },
  { locale: 'en', slug: 'morse-code-player' },
  { locale: 'en', slug: 'html-preview' },
  { locale: 'ru', slug: 'excel-merger' },
  { locale: 'en', slug: 'gantt-chart-generator' },
  { locale: 'en', slug: 'database-connection-tester' },
] as const;

interface ToolMessages {
  name?: string;
  description?: string;
  detailed_description?: string;
  usage_examples?: string[];
  usage_steps?: string[];
  faqs?: Array<{ question?: string; answer?: string }>;
}

function readToolMessages(locale: string, slug: string): ToolMessages {
  const filePath = path.join(process.cwd(), 'src/messages', locale, 'tools', `${slug}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as ToolMessages;
}

function supportWordCount(messages: ToolMessages): number {
  const faqText = (messages.faqs ?? [])
    .flatMap((item) => [item.question, item.answer])
    .filter(Boolean)
    .join(' ');
  const text = [
    messages.description,
    messages.detailed_description,
    ...(messages.usage_steps ?? []),
    ...(messages.usage_examples ?? []),
    faqText,
  ]
    .filter(Boolean)
    .join(' ');

  return text.split(/\s+/).filter(Boolean).length;
}

describe('GSC high-value recovery candidate content', () => {
  it.each(highValueCandidates)('$locale/$slug has enough truthful support content for index recovery', ({ locale, slug }) => {
    const messages = readToolMessages(locale, slug);
    const report = assessSupportContentTrust({
      slug,
      locale,
      name: messages.name ?? slug,
      description: messages.description,
      detailedDescription: messages.detailed_description,
      usageSteps: messages.usage_steps,
      usageExamples: messages.usage_examples,
      faqs: messages.faqs,
    });

    expect(report.blockSupportContent, report.issues.map((issue) => issue.code).join(', ')).toBe(false);
    expect(messages.detailed_description?.length ?? 0).toBeGreaterThanOrEqual(520);
    expect(messages.usage_steps?.length ?? 0).toBeGreaterThanOrEqual(5);
    expect(messages.usage_examples?.length ?? 0).toBeGreaterThanOrEqual(4);
    expect(messages.faqs?.length ?? 0).toBeGreaterThanOrEqual(5);
    expect(supportWordCount(messages)).toBeGreaterThanOrEqual(170);
  });
});
