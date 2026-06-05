export interface LlmsTxtItem {
  title: string;
  url: string;
  description?: string;
  type?: string;
}

export interface LlmsTxtSection {
  title: string;
  items: LlmsTxtItem[];
}

export interface LlmsTxtData {
  title: string;
  summary: string;
  detail?: string;
  sections: LlmsTxtSection[];
}

export function generateLlmsTxt(data: LlmsTxtData): string {
  let output = `# ${data.title.trim()}\n\n`;
  if (data.summary && data.summary.trim()) {
    output += `> ${data.summary.trim()}\n\n`;
  }
  if (data.detail && data.detail.trim()) {
    output += `${data.detail.trim()}\n\n`;
  }

  for (const section of data.sections) {
    if (!section.title || !section.title.trim()) continue;
    
    // Check if there is at least one valid item to render
    const validItems = section.items.filter(item => item.title && item.title.trim() && item.url && item.url.trim());
    if (validItems.length === 0) continue;

    output += `## ${section.title.trim()}\n\n`;
    for (const item of validItems) {
      const typeStr = item.type && item.type.trim() ? ` [${item.type.trim()}]` : '';
      const descStr = item.description && item.description.trim() ? `: ${item.description.trim()}` : '';
      output += `- [${item.title.trim()}](${item.url.trim()})${typeStr}${descStr}\n`;
    }
    output += '\n';
  }

  return output.trim();
}
