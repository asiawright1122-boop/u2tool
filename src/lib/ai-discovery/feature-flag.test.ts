import { afterEach, describe, expect, it, vi } from 'vitest';
import { isAiDiscoveryEnabled } from './feature-flag';

describe('ai discovery feature flag', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns false by default when env var is missing', () => {
    vi.stubEnv('PUBLIC_AI_DISCOVERY_ENABLED', undefined);
    expect(isAiDiscoveryEnabled()).toBe(false);
  });

  it('returns true only when env var is exactly true', () => {
    vi.stubEnv('PUBLIC_AI_DISCOVERY_ENABLED', 'true');
    expect(isAiDiscoveryEnabled()).toBe(true);
  });

  it('returns false for any other value', () => {
    vi.stubEnv('PUBLIC_AI_DISCOVERY_ENABLED', 'TRUE');
    expect(isAiDiscoveryEnabled()).toBe(false);

    vi.stubEnv('PUBLIC_AI_DISCOVERY_ENABLED', '1');
    expect(isAiDiscoveryEnabled()).toBe(false);
  });
});
