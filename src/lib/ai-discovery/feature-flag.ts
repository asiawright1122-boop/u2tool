export function isAiDiscoveryEnabled(): boolean {
  return import.meta.env.PUBLIC_AI_DISCOVERY_ENABLED === 'true';
}
