import { marked } from 'marked';
import { sanitizeMarkdownHtml } from './sanitize';

export function renderMarkdownHtml(markdown: string): string {
  try {
    const rawHtml = marked.parse(String(markdown || ''), {
      breaks: true,
      gfm: true,
    }) as string;

    return sanitizeMarkdownHtml(rawHtml);
  } catch {
    return '<p>Error parsing markdown</p>';
  }
}
