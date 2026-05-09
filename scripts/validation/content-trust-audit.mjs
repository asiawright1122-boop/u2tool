import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assessSupportContentTrust } from '../../src/lib/content-trust.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const messagesRoot = path.join(repoRoot, 'src/messages');
const toolsConfigDir = path.join(repoRoot, 'src/config/tools');
const reportPath = path.join(repoRoot, 'docs/TOOL_CONTENT_TRUST_AUDIT_2026-05-05.md');

const MINIMUMS = {
  detailedDescriptionChars: 220,
  usageSteps: 3,
  usageExamples: 2,
  popularFaqs: 3,
};

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function stripJsonExtension(filename) {
  return filename.replace(/\.json$/i, '');
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function getArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim()) : [];
}

function getFaqs(messages) {
  if (Array.isArray(messages.faqs)) {
    return messages.faqs
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        question: typeof item.question === 'string' ? item.question : '',
        answer: typeof item.answer === 'string' ? item.answer : '',
      }))
      .filter((item) => item.question.trim() && item.answer.trim());
  }

  const faqs = [];
  for (let index = 1; index <= 20; index += 1) {
    const question = messages[`faq_q${index}`];
    const answer = messages[`faq_a${index}`];
    if (typeof question === 'string' && typeof answer === 'string') {
      faqs.push({ question, answer });
    }
  }
  return faqs;
}

function readPopularToolSlugs() {
  const popular = new Set();
  const toolConfigFiles = readdirSync(toolsConfigDir, { withFileTypes: true })
    .filter((entry) =>
      entry.isFile() &&
      entry.name.endsWith('.ts') &&
      !['categories.ts', 'index.ts', 'types.ts'].includes(entry.name)
    )
    .map((entry) => path.join(toolsConfigDir, entry.name))
    .sort((a, b) => a.localeCompare(b));

  for (const filePath of toolConfigFiles) {
    const source = readFileSync(filePath, 'utf8');
    const toolEntries = source.matchAll(/\{\s*slug:\s*['"]([^'"]+)['"][\s\S]*?\}/g);

    for (const match of toolEntries) {
      if (/\bpopular:\s*true\b/.test(match[0])) {
        popular.add(match[1]);
      }
    }
  }

  return popular;
}

function scanToolFile(locale, filePath, popularToolSlugs) {
  const slug = stripJsonExtension(path.basename(filePath));
  const messages = readJson(filePath);
  const detailedDescription = compact(messages.detailed_description || messages.detailedDescription || '');
  const usageSteps = getArray(messages.usage_steps || messages.usageSteps);
  const usageExamples = getArray(messages.usage_examples || messages.usageExamples);
  const faqs = getFaqs(messages);
  const trustReport = assessSupportContentTrust({
    slug,
    locale,
    name: messages.name,
    description: messages.description,
    detailedDescription,
    usageSteps,
    usageExamples,
    faqs,
  });
  const depthIssues = [];
  const isPopularEnglishTool = locale === 'en' && popularToolSlugs.has(slug);

  if (isPopularEnglishTool && detailedDescription.length < MINIMUMS.detailedDescriptionChars) {
    depthIssues.push({
      code: 'thin-detailed-description',
      message: `Popular English tool has a short detailed_description (${detailedDescription.length} chars).`,
    });
  }

  if (isPopularEnglishTool && usageSteps.length < MINIMUMS.usageSteps) {
    depthIssues.push({
      code: 'thin-usage-steps',
      message: `Popular English tool has ${usageSteps.length} usage steps; expected at least ${MINIMUMS.usageSteps}.`,
    });
  }

  if (isPopularEnglishTool && usageExamples.length < MINIMUMS.usageExamples) {
    depthIssues.push({
      code: 'thin-usage-examples',
      message: `Popular English tool has ${usageExamples.length} usage examples; expected at least ${MINIMUMS.usageExamples}.`,
    });
  }

  if (isPopularEnglishTool && faqs.length < MINIMUMS.popularFaqs) {
    depthIssues.push({
      code: 'thin-faqs',
      message: `Popular English tool has ${faqs.length} FAQs; expected at least ${MINIMUMS.popularFaqs}.`,
    });
  }

  return {
    locale,
    slug,
    filePath: path.relative(repoRoot, filePath),
    detailedDescriptionChars: detailedDescription.length,
    usageSteps: usageSteps.length,
    usageExamples: usageExamples.length,
    faqs: faqs.length,
    isPopularEnglishTool,
    trustReport,
    depthIssues,
  };
}

function scanAllTools() {
  const popularToolSlugs = readPopularToolSlugs();
  const localeDirs = readdirSync(messagesRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const results = [];

  for (const localeDir of localeDirs) {
    const toolsDir = path.join(messagesRoot, localeDir.name, 'tools');
    let toolFiles = [];
    try {
      toolFiles = readdirSync(toolsDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
        .map((entry) => path.join(toolsDir, entry.name));
    } catch {
      continue;
    }

    for (const filePath of toolFiles) {
      results.push(scanToolFile(localeDir.name, filePath, popularToolSlugs));
    }
  }

  return results;
}

function groupByIssue(results) {
  const issueCounts = new Map();
  for (const result of results) {
    for (const issue of result.trustReport.issues) {
      const current = issueCounts.get(issue.code) || { count: 0, severity: issue.severity, message: issue.message };
      current.count += 1;
      issueCounts.set(issue.code, current);
    }
    for (const issue of result.depthIssues) {
      const current = issueCounts.get(issue.code) || { count: 0, severity: 'depth', message: issue.message.replace(/\([^)]*\)/, '(...)') };
      current.count += 1;
      issueCounts.set(issue.code, current);
    }
  }

  return Array.from(issueCounts.entries())
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));
}

function buildMarkdownReport(results) {
  const highRiskResults = results.filter((result) =>
    result.trustReport.issues.some((issue) => issue.severity === 'high')
  );
  const mediumRiskResults = results.filter((result) =>
    result.trustReport.issues.some((issue) => issue.severity === 'medium')
  );
  const popularDepthResults = results.filter((result) => result.depthIssues.length > 0);
  const englishResults = results.filter((result) => result.locale === 'en');
  const popularEnglishResults = englishResults.filter((result) => result.isPopularEnglishTool);
  const issueCounts = groupByIssue(results);
  const topHighRisk = highRiskResults
    .flatMap((result) => result.trustReport.issues
      .filter((issue) => issue.severity === 'high')
      .map((issue) => ({ ...issue, locale: result.locale, slug: result.slug, filePath: result.filePath })))
    .sort((a, b) => {
      const localePriority = Number(b.locale === 'en') - Number(a.locale === 'en');
      if (localePriority !== 0) return localePriority;
      return a.slug.localeCompare(b.slug) || a.code.localeCompare(b.code);
    })
    .slice(0, 30);
  const topDepthRisks = popularDepthResults.slice(0, 30);

  return `# Tool Content Trust Audit - 2026-05-05

## Executive Summary

This audit checks tool support content against search-engine quality expectations and the actual U2Tool browser-first implementation. The primary recovery risk addressed here is not raw indexability: GSC Coverage showed indexed pages continued to rise while impressions collapsed. The next defensible layer is content trust, overclaiming, and thin support content.

- Tool message files scanned: ${results.length}
- English tool files scanned: ${englishResults.length}
- Popular English tool files checked for depth: ${popularEnglishResults.length}
- Files with high-confidence implementation overclaims: ${highRiskResults.length}
- Files with medium-confidence claims for future review: ${mediumRiskResults.length}
- Popular English files with depth gaps: ${popularDepthResults.length}

Runtime mitigation: high-confidence support-content issues are blocked by \`assessSupportContentTrust\` and replaced by safe fallback support content on tool detail pages.

## Search Engine Quality Basis

- Google Search Central: helpful content should be created for people first and should avoid content that leaves visitors needing to search again for better information. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Essentials: pages should be accessible, indexable, useful, and not deceptive or misleading. Source: https://developers.google.com/search/docs/essentials
- Bing Webmaster Guidelines: pages should provide clear, original, useful content and avoid deceptive or low-value patterns. Source: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a
- Yandex Webmaster guidance: site quality and relevance are ranking inputs, so content should match the user's task and not misrepresent page behavior. Source: https://yandex.com/support/webmaster/en/yandex-indexing/rank
- Baidu Search Resource Platform guidance broadly emphasizes user-oriented, high-quality content and crawlable pages. Source: https://ziyuan.baidu.com/

## Issue Distribution

| Code | Severity | Count | Meaning |
|---|---:|---:|---|
${issueCounts.map((issue) => `| \`${issue.code}\` | ${issue.severity} | ${issue.count} | ${issue.message.replace(/\|/g, '\\|')} |`).join('\n')}

## High-Confidence Overclaim Samples

| Locale | Tool | Field | Rule | Excerpt |
|---|---|---|---|---|
${topHighRisk.map((issue) => `| ${issue.locale} | \`${issue.slug}\` | \`${issue.field}\` | \`${issue.code}\` | ${issue.excerpt.replace(/\|/g, '\\|')} |`).join('\n') || '| - | - | - | - | No high-confidence overclaims found. |'}

## Popular English Depth Gaps

These are not automatic noindex problems. They are prioritization targets for content refresh because popular landing pages should give users concrete, page-accurate guidance, examples, and FAQs.

| Tool | Detailed Chars | Steps | Examples | FAQs | Gap Codes |
|---|---:|---:|---:|---:|---|
${topDepthRisks.map((result) => `| \`${result.slug}\` | ${result.detailedDescriptionChars} | ${result.usageSteps} | ${result.usageExamples} | ${result.faqs} | ${result.depthIssues.map((issue) => `\`${issue.code}\``).join(', ')} |`).join('\n') || '| - | - | - | - | - | No popular English depth gaps found. |'}

## Recovery Actions

1. Keep the runtime fallback guard active for all high-confidence implementation overclaims.
2. Refresh the highest-impression English tool pages first with page-accurate descriptions, usage steps, examples, and FAQs.
3. Use GSC Performance exports to decide the next content wave by lost impressions and current average position.
4. Re-run \`npm run report:content-trust\` after each content wave and before submitting more IndexNow batches.
`;
}

function main() {
  const results = scanAllTools();
  const report = buildMarkdownReport(results);
  mkdirSync(path.dirname(reportPath), { recursive: true });
  writeFileSync(reportPath, report);

  const highRiskCount = results.filter((result) =>
    result.trustReport.issues.some((issue) => issue.severity === 'high')
  ).length;
  const popularDepthGapCount = results.filter((result) => result.depthIssues.length > 0).length;

  console.log(`Content trust audit complete.`);
  console.log(`Scanned ${results.length} tool message files.`);
  console.log(`High-confidence overclaim files: ${highRiskCount} (runtime fallback mitigation active).`);
  console.log(`Popular English depth-gap files: ${popularDepthGapCount}.`);
  console.log(`Report written to ${path.relative(repoRoot, reportPath)}.`);
}

main();
