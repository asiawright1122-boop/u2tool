/**
 * Shared heuristics for tool-page support content trust.
 *
 * The goal is conservative: catch high-confidence implementation claims that
 * don't line up with this repo's browser-first runtime, and flag medium-risk
 * marketing or backend claims for audit reports.
 */

/**
 * @typedef {{ question?: string, answer?: string }} FaqItem
 * @typedef {{
 *   slug: string,
 *   locale?: string,
 *   name?: string,
 *   description?: string,
 *   detailedDescription?: string,
 *   usageSteps?: string[],
 *   usageExamples?: string[],
 *   faqs?: FaqItem[],
 * }} SupportContentInput
 * @typedef {{
 *   severity: 'high' | 'medium',
 *   code: string,
 *   field: string,
 *   message: string,
 *   excerpt: string,
 * }} ContentTrustIssue
 * @typedef {{
 *   blockSupportContent: boolean,
 *   issues: ContentTrustIssue[],
 *   score: number,
 * }} ContentTrustReport
 * @typedef {{
 *   code: string,
 *   pattern: RegExp,
 *   message: string,
 *   slugs?: string[],
 * }} ContentTrustRule
 */

/** @type {ContentTrustRule[]} */
export const HIGH_CONFIDENCE_SUPPORT_CONTENT_RULES = [
  {
    code: 'imagemagick-runtime',
    pattern: /\bImageMagick\b/i,
    message: 'Mentions ImageMagick-backed processing that the repo does not ship.',
  },
  {
    code: 'gd-library-runtime',
    pattern: /\bGD Library\b/i,
    message: 'Mentions GD Library processing that is not part of the current runtime.',
  },
  {
    code: 'd3-runtime',
    pattern: /\bD3\.js\b/i,
    message: 'Mentions a D3.js chart runtime even though chart tools render through the shared ECharts stack.',
  },
  {
    code: 'svgjs-runtime',
    pattern: /\bSVG\.js\b/i,
    message: 'Mentions an SVG.js rendering stack that is not present in this repo.',
  },
  {
    code: 'webgl-export-claim',
    pattern: /\bWebGL-accelerated\b/i,
    message: 'Claims a WebGL-accelerated rendering path that is not evidenced in the repo.',
  },
  {
    code: 'codec-runtime-claim',
    pattern: /\blibpng\b|\blibjpeg\b|\blibwebp\b/i,
    message: 'Mentions native image codec pipelines that are not part of the browser-first implementation.',
  },
  {
    code: 'parallel-query-threading',
    pattern: /\bparallel query threading\b/i,
    message: 'Claims backend query-threading behavior that is not evidenced in the repo.',
  },
  {
    code: 'authoritative-geolocation',
    pattern: /\bauthoritative server IP geolocation metadata\b/i,
    message: 'Claims advanced DNS response enrichment that is not evidenced in the repo.',
  },
  {
    code: 'word-counter-backend-automata',
    pattern: /\bbackend processes text streams using finite-state automata\b/i,
    message: 'Claims a backend finite-state text engine, but the Word Counter component performs simple browser-side counts.',
    slugs: ['word-counter'],
  },
  {
    code: 'web-workers-claim',
    pattern: /\bWeb Workers implementation\b/i,
    message: 'Claims Web Worker execution that is not evidenced in the current tool implementation.',
    slugs: ['word-counter'],
  },
  {
    code: 'punkt-algorithm-claim',
    pattern: /\bPunkt algorithm\b/i,
    message: 'Claims Punkt sentence detection that is not present in the browser tool implementation.',
    slugs: ['word-counter'],
  },
  {
    code: 'unsupported-file-upload-claim',
    pattern: /\bdrag\/drop a \.txt\/\.docx file\b/i,
    message: 'Claims text/document drag-and-drop upload that is not present in the tool UI.',
    slugs: ['word-counter'],
  },
  {
    code: 'unsupported-export-dropdown',
    pattern: /\bExport Data['’]? dropdown\b/i,
    message: 'Claims an export dropdown that is not present in the current tool UI.',
    slugs: ['word-counter'],
  },
  {
    code: 'jwt-signature-verification-claim',
    pattern: /\bvalidate(?:s| the)? token'?s signature\b|\bSignature Verification\b/i,
    message: 'Claims JWT signature verification, but the current decoder only decodes and displays token parts.',
    slugs: ['jwt-decoder'],
  },
  {
    code: 'pcre2-runtime-claim',
    pattern: /\bPCRE2\b/i,
    message: 'Claims PCRE2 regex support, while the current Regex Tester uses the browser JavaScript RegExp engine.',
    slugs: ['regex-tester'],
  },
  {
    code: 'regex-replacement-preview-claim',
    pattern: /\breplacement preview mode\b|\bsimulate substitution operations\b/i,
    message: 'Claims regex replacement preview functionality that is not present in the current UI.',
    slugs: ['regex-tester'],
  },
  {
    code: 'webassembly-conversion-engine',
    pattern: /\bWebAssembly-based conversion engine\b/i,
    message: 'Claims a WebAssembly conversion engine that is not evidenced in the current timestamp tool.',
    slugs: ['timestamp-converter'],
  },
  {
    code: 'iana-timezone-picker-claim',
    pattern: /\bTimezone Offset Picker\b|\bmanual timezone specification\b|\bsearch for specific location via IANA Time Zone Database\b/i,
    message: 'Claims manual IANA timezone selection that is not present in the current timestamp UI.',
    slugs: ['timestamp-converter'],
  },
  {
    code: 'image-base64-transcode-claim',
    pattern: /\bPreserve Transparency\b|\btarget encoding format\b/i,
    message: 'Claims image transcoding controls that are not present in the current Image to Base64 UI.',
    slugs: ['image-to-base64'],
  },
  {
    code: 'hex-editor-grid-claim',
    pattern: /\bhex(?:adecimal)? grid\b|\b16-byte columnar\b|\boffset addresses\b|hex-дамп/i,
    message: 'Claims a hex grid or dump view, but the current Hex Editor exposes two text areas and conversion buttons.',
    slugs: ['hex-editor'],
  },
  {
    code: 'hex-editor-byte-edit-claim',
    pattern: /\bdirectly modify byte values\b|\bDouble-click any hex value\b|Измените отдельные байты/i,
    message: 'Claims direct byte editing that is not present in the current Hex Editor UI.',
    slugs: ['hex-editor'],
  },
  {
    code: 'hex-editor-unsupported-encoding-claim',
    pattern: /\bUTF-16LE\/BE\b|\bUTF-16BE\b|\bendianness\b|порядок байтов/i,
    message: 'Claims encoding or byte-order controls that are not present in the current Hex Editor UI.',
    slugs: ['hex-editor'],
  },
  {
    code: 'hex-editor-file-export-claim',
    pattern: /\bDownload as Hex File\b|Сохранить как \.bin/i,
    message: 'Claims file export that is not present in the current Hex Editor UI.',
    slugs: ['hex-editor'],
  },
];

/** @type {ContentTrustRule[]} */
export const MEDIUM_CONFIDENCE_SUPPORT_CONTENT_RULES = [
  {
    code: 'rest-api-claim',
    pattern: /\bRESTful API\b/i,
    message: 'Describes API/backend capabilities that may not exist on the page implementation.',
  },
  {
    code: 'server-side-reference',
    pattern: /\bserver-side\b/i,
    message: 'References server-side behavior on a browser-first tool page and should be verified.',
  },
  {
    code: 'redis-runtime',
    pattern: /\bRedis\b/i,
    message: 'Mentions Redis-specific behavior that should be verified against the actual tool UI.',
  },
  {
    code: 'print-ready-export',
    pattern: /\b300DPI\b/i,
    message: 'Claims print-grade export precision that should be backed by implementation evidence.',
  },
  {
    code: 'microservices-claim',
    pattern: /\bmicroservices?\b/i,
    message: 'References distributed backend architecture that may be unrelated to the page implementation.',
  },
  {
    code: 'openid-connect-claim',
    pattern: /\bOpenID Connect\b/i,
    message: 'References authentication-platform integrations that should be verified against the actual tool.',
  },
  {
    code: 'oauth2-claim',
    pattern: /\bOAuth2\b/i,
    message: 'References OAuth integrations that should be verified against the actual tool.',
  },
  {
    code: 'millions-claim',
    pattern: /\bmillions? of developers\b/i,
    message: 'Uses unsupported scale language that should be backed by evidence or removed.',
  },
];

function compactWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function buildExcerpt(text, matchIndex, matchLength) {
  const start = Math.max(0, matchIndex - 56);
  const end = Math.min(text.length, matchIndex + matchLength + 56);
  return compactWhitespace(text.slice(start, end));
}

function collectSupportContentEntries(input) {
  /** @type {{ field: string, text: string }[]} */
  const entries = [];

  if (typeof input.name === 'string' && input.name.trim()) {
    entries.push({ field: 'name', text: input.name.trim() });
  }
  if (typeof input.description === 'string' && input.description.trim()) {
    entries.push({ field: 'description', text: input.description.trim() });
  }
  if (typeof input.detailedDescription === 'string' && input.detailedDescription.trim()) {
    entries.push({ field: 'detailed_description', text: input.detailedDescription.trim() });
  }
  if (Array.isArray(input.usageSteps)) {
    input.usageSteps.forEach((step, index) => {
      if (typeof step === 'string' && step.trim()) {
        entries.push({ field: `usage_steps[${index}]`, text: step.trim() });
      }
    });
  }
  if (Array.isArray(input.usageExamples)) {
    input.usageExamples.forEach((example, index) => {
      if (typeof example === 'string' && example.trim()) {
        entries.push({ field: `usage_examples[${index}]`, text: example.trim() });
      }
    });
  }
  if (Array.isArray(input.faqs)) {
    input.faqs.forEach((faq, index) => {
      if (typeof faq?.question === 'string' && faq.question.trim()) {
        entries.push({ field: `faqs[${index}].question`, text: faq.question.trim() });
      }
      if (typeof faq?.answer === 'string' && faq.answer.trim()) {
        entries.push({ field: `faqs[${index}].answer`, text: faq.answer.trim() });
      }
    });
  }

  return entries;
}

/**
 * @param {SupportContentInput} input
 * @returns {ContentTrustReport}
 */
export function assessSupportContentTrust(input) {
  const entries = collectSupportContentEntries(input);
  /** @type {ContentTrustIssue[]} */
  const issues = [];
  const seen = new Set();

  const applyRules = (rules, severity) => {
    for (const entry of entries) {
      for (const rule of rules) {
        if (Array.isArray(rule.slugs) && !rule.slugs.includes(input.slug)) {
          continue;
        }

        const match = entry.text.match(rule.pattern);
        if (!match || typeof match.index !== 'number') {
          continue;
        }

        const dedupeKey = `${severity}:${rule.code}:${entry.field}`;
        if (seen.has(dedupeKey)) {
          continue;
        }
        seen.add(dedupeKey);

        issues.push({
          severity,
          code: rule.code,
          field: entry.field,
          message: rule.message,
          excerpt: buildExcerpt(entry.text, match.index, match[0].length),
        });
      }
    }
  };

  applyRules(HIGH_CONFIDENCE_SUPPORT_CONTENT_RULES, 'high');
  applyRules(MEDIUM_CONFIDENCE_SUPPORT_CONTENT_RULES, 'medium');

  const highIssueCount = issues.filter((issue) => issue.severity === 'high').length;
  const mediumIssueCount = issues.filter((issue) => issue.severity === 'medium').length;
  const score = highIssueCount * 3 + mediumIssueCount;

  return {
    blockSupportContent: highIssueCount > 0,
    issues,
    score,
  };
}
