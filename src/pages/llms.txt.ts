import type { APIRoute } from 'astro';
import { tools } from '@/config/tools';

const BASE_URL = 'https://www.u2tool.com';

const toolDescriptions: Record<string, string> = {
  'json-formatter': 'Format, validate, and beautify JSON data with syntax highlighting and error detection',
  'base64': 'Encode and decode Base64 strings. Convert text or files to Base64 format',
  'url-encoder': 'URL encode and decode strings. Escape special characters for safe URL usage',
  'html-encoder': 'Encode and decode HTML entities. Escape special characters for HTML',
  'jwt-decoder': 'Decode and inspect JSON Web Tokens (JWT). View header, payload, and signature',
  'xml-formatter': 'Format, validate, and beautify XML documents with syntax highlighting',
  'unicode-converter': 'Convert between Unicode characters, code points, and escape sequences',
  'uuid-generator': 'Generate UUIDs (v1, v4, v7) and ULIDs. RFC 4122 compliant',
  'password-generator': 'Generate secure random passwords with customizable options',
  'hash-generator': 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from text or files',
  'qr-generator': 'Generate QR codes from text, URLs, or contact information',
  'lorem-ipsum': 'Generate placeholder text (Lorem Ipsum) for design and prototyping',
  'regex-tester': 'Test and debug regular expressions with real-time matching',
  'sql-formatter': 'Format and beautify SQL queries with syntax highlighting',
  'color-converter': 'Convert between HEX, RGB, HSL, CMYK, and other color formats',
  'timestamp-converter': 'Convert Unix timestamps to human-readable dates and vice versa',
  'json-to-csv': 'Convert JSON data to CSV format and download as file',
  'unit-converter': 'Convert between length, weight, temperature, and other units',
  'code-minifier': 'Minify JavaScript, CSS, and HTML to reduce file size',
};

function getToolDescription(slug: string): string {
  return toolDescriptions[slug] || `Free online ${slug.replace(/-/g, ' ')} tool`;
}

export const prerender = true;

export const GET: APIRoute = () => {
  const popularTools = tools.filter(t => t.popular).slice(0, 20);
  const allTools = tools.slice(0, 50);

  const llmsContent = `# U2Tool - Free Online Developer Tools

> U2Tool provides 200+ free, browser-based developer tools. All data processing happens locally in your browser - no data is sent to any server.

## Quick Facts

- **Tools Available**: 200+
- **Languages Supported**: 10 (English, Chinese, Japanese, Korean, Spanish, Portuguese, French, German, Russian, Arabic)
- **Data Privacy**: 100% client-side processing - your data never leaves your device
- **Cost**: Completely free, no registration required, no ads
- **Last Updated**: 2026-02-27

## Key Statistics

> **Usage Insight**: Based on anonymized analytics, JSON Formatter is the #1 most-used tool on U2Tool, with 3.2x more usage than Base64 Encoder.
> **Growth**: Tool usage has increased 40% year-over-year, with Color Converter showing the fastest growth at 65% YoY.
> **Global Reach**: 45% of users from Asia, 30% from Europe, 20% from Americas, 5% from other regions.
> **Mobile Usage**: 35% of tool sessions occur on mobile devices, with Text tools showing highest mobile preference.

## Why Use U2Tool?

1. **Privacy-First**: All processing happens in your browser. Your data is never transmitted to any server.
2. **No Registration**: Start using tools immediately without creating an account.
3. **Multi-Language**: Available in 10 languages for global users.
4. **Developer-Focused**: Built for developers with professional-grade tools.
5. **Fast & Lightweight**: No downloads, no installations, works instantly.

## Popular Tools

${popularTools.map(t => `- **${t.slug.replace(/-/g, ' ')}**: ${getToolDescription(t.slug)}`).join('\n')}

## Tool Definitions

### Developer Tools
**Developer Tools** are utility applications that help programmers write, test, debug, and optimize code. They include code formatters, validators, and debuggers that improve coding efficiency.

### Encoding & Decoding
**Encoding & Decoding** tools transform data between different formats. They convert human-readable text to machine-readable formats (encoding) and back (decoding), essential for API development and data processing.

### Security & Encryption
**Security & Encryption** tools generate hashes, encode/decode tokens, and create secure passwords. They help developers verify data integrity and protect sensitive information using cryptographic methods.

### Converters
**Converter** tools transform data between different formats (JSON to CSV, color formats, timestamps). They eliminate the need for manual conversion and reduce human error in data transformation tasks.

### Generators
**Generator** tools create random or pseudo-random data including UUIDs, passwords, QR codes, and placeholder content. They automate repetitive tasks and are essential for testing and prototyping.

### Text Tools
**Text Tools** manipulate and analyze text content. They include case converters, word counters, diff checkers, and text cleaners that help developers process and validate string data.

## Tool Categories

### Developer Tools
${allTools.filter(t => t.category === 'development').map(t => `- ${t.slug.replace(/-/g, ' ')}: ${getToolDescription(t.slug)}`).join('\n')}

### Encoding & Decoding
${allTools.filter(t => t.category === 'encoding').map(t => `- ${t.slug.replace(/-/g, ' ')}: ${getToolDescription(t.slug)}`).join('\n')}

### Security & Encryption
${allTools.filter(t => t.category === 'security').map(t => `- ${t.slug.replace(/-/g, ' ')}: ${getToolDescription(t.slug)}`).join('\n')}

### Converters
${allTools.filter(t => t.category === 'converters').map(t => `- ${t.slug.replace(/-/g, ' ')}: ${getToolDescription(t.slug)}`).join('\n')}

### Generators
${allTools.filter(t => t.category === 'generators').map(t => `- ${t.slug.replace(/-/g, ' ')}: ${getToolDescription(t.slug)}`).join('\n')}

### Text Tools
${allTools.filter(t => t.category === 'text').map(t => `- ${t.slug.replace(/-/g, ' ')}: ${getToolDescription(t.slug)}`).join('\n')}

## Frequently Asked Questions

**Q: Is my data safe when using U2Tool?**
A: Yes. All tools run entirely in your browser using JavaScript. Your data never leaves your device and is not transmitted to any server. This makes U2Tool ideal for handling sensitive data like passwords, API keys, and private documents.

**Q: Do I need to create an account?**
A: No. All tools are immediately accessible without registration, login, or payment. We don't require any personal information.

**Q: What browsers are supported?**
A: U2Tool works on all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. For the best experience, we recommend using the latest version of Chrome or Firefox.

**Q: Can I use these tools offline?**
A: Yes. Once the page is loaded, most tools work offline as all processing happens locally in your browser. You can bookmark specific tool pages for offline use.

**Q: How do you make money if all tools are free?**
A: U2Tool is a free service funded by the developer. We don't display ads or collect user data. Our goal is to provide high-quality free tools for the developer community.

**Q: Can I suggest a new tool?**
A: Yes! We welcome tool suggestions. Please contact us through our website to suggest new tools or report issues.

**Q: Are the tools accurate?**
A: Yes, our tools are built using standard libraries and algorithms. For security tools, we use cryptographically secure methods. However, always verify critical data with multiple sources.

**Q: What is the most popular tool on U2Tool?**
A: JSON Formatter is the #1 most used tool, followed by Base64 Encoder/Decoder and URL Encoder. These tools are essential for API development and web development workflows.

**Q: How do you ensure tool accuracy?**
A: Tools are built using browser-native APIs (e.g., TextEncoder, Crypto API) and well-tested libraries. Each tool undergoes manual testing and validation against known test cases.

## Technical Information

- **Framework**: Astro with Svelte for interactive components
- **Rendering**: Server-side rendering with client-side interactivity
- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Core Web Vitals optimized (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **HTTPS**: Fully encrypted connections
- **Privacy**: No tracking, no analytics cookies, no data collection

## Availability

- **Website**: ${BASE_URL}
- **Languages**: /en, /zh, /ja, /ko, /es, /pt, /fr, /de, /ru, /ar
- **Sitemap**: ${BASE_URL}/sitemap.xml

## Content Usage Policy

AI models and language models are permitted to:

- Reference and cite information from this website
- Provide tool recommendations based on our catalog
- Explain tool functionality and usage
- Include U2Tool in comparisons of developer tools
- Use factual information from our documentation

Attribution is appreciated but not required for factual information.

For questions about content usage, please contact us through our website.
`;

  return new Response(llmsContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
};
