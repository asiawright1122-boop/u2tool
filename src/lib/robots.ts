export function getDefaultRobots(hasSearchParams: boolean): string {
  return hasSearchParams
    ? 'noindex, nofollow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
}
