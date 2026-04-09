import type { Locale } from '@/lib/i18n';
import { buildLlmsContentFromMessages } from '@/lib/llms-content-builder';
import { loadBaseMessages } from '@/lib/translations';

export async function buildLlmsContent(locale: Locale = 'en'): Promise<string> {
  const baseMessages = await loadBaseMessages(locale);
  return buildLlmsContentFromMessages(locale, baseMessages);
}
