import type { Locale } from '@/lib/i18n';
import { buildLlmsContentFromMessages } from '@/lib/llms-content-builder';
import { loadBaseMessages } from '@/lib/translations';

export async function buildLlmsContent(
  locale: Locale = 'en',
  assetBaseUrl?: string | URL,
  options?: { isFull?: boolean }
): Promise<string> {
  const baseMessages = await loadBaseMessages(locale, assetBaseUrl);
  return buildLlmsContentFromMessages(locale, baseMessages, options);
}
