import { describe, expect, it } from 'vitest';
import {
  AI_TOOLS_DIRECTORY_PATH,
  getAiToolsDirectoryHref,
  getAiToolsDirectoryLabel,
} from './ai-tools-navigation';

describe('ai tools navigation', () => {
  it('exposes the canonical AI directory path', () => {
    expect(AI_TOOLS_DIRECTORY_PATH).toBe('/ai');
  });

  it('builds localized AI directory hrefs', () => {
    expect(getAiToolsDirectoryHref('en')).toBe('/en/ai/');
    expect(getAiToolsDirectoryHref('zh')).toBe('/zh/ai/');
  });

  it('uses Chinese label for zh and English fallback for other locales', () => {
    expect(getAiToolsDirectoryLabel('zh')).toBe('AI 工具集');
    expect(getAiToolsDirectoryLabel('en')).toBe('AI Tools');
    expect(getAiToolsDirectoryLabel('fr')).toBe('AI Tools');
  });
});
