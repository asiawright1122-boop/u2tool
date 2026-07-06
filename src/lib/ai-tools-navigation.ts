import { getLocalizedPath, type Locale } from './i18n';

export const AI_TOOLS_DIRECTORY_PATH = '/ai' as const;

export function getAiToolsDirectoryHref(locale: Locale): string {
  return getLocalizedPath(locale, AI_TOOLS_DIRECTORY_PATH);
}

export function getAiToolsDirectoryLabel(locale: Locale): string {
  return locale === 'zh' ? 'AI 工具集' : 'AI Tools';
}
