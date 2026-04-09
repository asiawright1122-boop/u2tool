import { isPublicAiDiscoveryEnabled } from '@/lib/public-env';

export function isAiDiscoveryEnabled(): boolean {
  return isPublicAiDiscoveryEnabled();
}
