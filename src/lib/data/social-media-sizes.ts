// Social media image size guide data
// Updated for 2024-2025

export interface ImageSize {
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  description?: string;
}

export interface PlatformSizes {
  platform: string;
  icon: string;
  color: string;
  sizes: ImageSize[];
}

export const socialMediaSizes: PlatformSizes[] = [
  {
    platform: 'Instagram',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    color: '#E4405F',
    sizes: [
      { name: 'Profile Photo', width: 320, height: 320, aspectRatio: '1:1', description: 'Displays at 110x110' },
      { name: 'Square Post', width: 1080, height: 1080, aspectRatio: '1:1' },
      { name: 'Portrait Post', width: 1080, height: 1350, aspectRatio: '4:5' },
      { name: 'Landscape Post', width: 1080, height: 566, aspectRatio: '1.91:1' },
      { name: 'Story/Reel', width: 1080, height: 1920, aspectRatio: '9:16' },
      { name: 'Carousel', width: 1080, height: 1080, aspectRatio: '1:1', description: 'Up to 10 images' },
      { name: 'IGTV Cover', width: 420, height: 654, aspectRatio: '1:1.55' },
    ],
  },
  {
    platform: 'Facebook',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    color: '#1877F2',
    sizes: [
      { name: 'Profile Photo', width: 170, height: 170, aspectRatio: '1:1', description: 'Displays at 170x170 on desktop' },
      { name: 'Cover Photo', width: 820, height: 312, aspectRatio: '2.63:1', description: 'Desktop display' },
      { name: 'Shared Image', width: 1200, height: 630, aspectRatio: '1.91:1' },
      { name: 'Shared Link', width: 1200, height: 628, aspectRatio: '1.91:1' },
      { name: 'Event Cover', width: 1920, height: 1005, aspectRatio: '1.91:1' },
      { name: 'Story', width: 1080, height: 1920, aspectRatio: '9:16' },
      { name: 'Reel', width: 1080, height: 1920, aspectRatio: '9:16' },
      { name: 'Group Cover', width: 1640, height: 856, aspectRatio: '1.91:1' },
    ],
  },
  {
    platform: 'Twitter/X',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 7h.01"/><path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20"/></svg>',
    color: '#000000',
    sizes: [
      { name: 'Profile Photo', width: 400, height: 400, aspectRatio: '1:1', description: 'Displays at 200x200' },
      { name: 'Header Photo', width: 1500, height: 500, aspectRatio: '3:1' },
      { name: 'In-Stream Photo', width: 1600, height: 900, aspectRatio: '16:9' },
      { name: 'Card Image', width: 1200, height: 628, aspectRatio: '1.91:1' },
      { name: 'Tweet Image', width: 1200, height: 675, aspectRatio: '16:9' },
    ],
  },
  {
    platform: 'LinkedIn',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>',
    color: '#0A66C2',
    sizes: [
      { name: 'Profile Photo', width: 400, height: 400, aspectRatio: '1:1' },
      { name: 'Background Photo', width: 1584, height: 396, aspectRatio: '4:1' },
      { name: 'Shared Image', width: 1200, height: 627, aspectRatio: '1.91:1' },
      { name: 'Company Logo', width: 300, height: 300, aspectRatio: '1:1' },
      { name: 'Company Cover', width: 1128, height: 191, aspectRatio: '5.9:1' },
      { name: 'Blog Post Image', width: 1200, height: 644, aspectRatio: '1.86:1' },
    ],
  },
  {
    platform: 'YouTube',
    icon: '▶',
    color: '#FF0000',
    sizes: [
      { name: 'Channel Profile', width: 800, height: 800, aspectRatio: '1:1' },
      { name: 'Channel Banner', width: 2560, height: 1440, aspectRatio: '16:9', description: 'Safe area: 1546x423' },
      { name: 'Video Thumbnail', width: 1280, height: 720, aspectRatio: '16:9' },
      { name: 'Shorts', width: 1080, height: 1920, aspectRatio: '9:16' },
      { name: 'Video Watermark', width: 150, height: 150, aspectRatio: '1:1' },
    ],
  },
  {
    platform: 'TikTok',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    color: '#000000',
    sizes: [
      { name: 'Profile Photo', width: 200, height: 200, aspectRatio: '1:1' },
      { name: 'Video', width: 1080, height: 1920, aspectRatio: '9:16' },
      { name: 'Video Thumbnail', width: 1080, height: 1920, aspectRatio: '9:16' },
    ],
  },
  {
    platform: 'Pinterest',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"/></svg>',
    color: '#E60023',
    sizes: [
      { name: 'Profile Photo', width: 165, height: 165, aspectRatio: '1:1' },
      { name: 'Pin Image', width: 1000, height: 1500, aspectRatio: '2:3', description: 'Optimal ratio' },
      { name: 'Square Pin', width: 1000, height: 1000, aspectRatio: '1:1' },
      { name: 'Long Pin', width: 1000, height: 2100, aspectRatio: '1:2.1' },
      { name: 'Board Cover', width: 222, height: 150, aspectRatio: '1.48:1' },
      { name: 'Story Pin', width: 1080, height: 1920, aspectRatio: '9:16' },
    ],
  },
  {
    platform: 'Snapchat',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 10h.01"/><path d="M15 10h.01"/><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z"/></svg>',
    color: '#FFFC00',
    sizes: [
      { name: 'Snap Ad', width: 1080, height: 1920, aspectRatio: '9:16' },
      { name: 'Geofilter', width: 1080, height: 2340, aspectRatio: '9:19.5' },
      { name: 'Profile Photo', width: 320, height: 320, aspectRatio: '1:1' },
    ],
  },
  {
    platform: 'Discord',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>',
    color: '#5865F2',
    sizes: [
      { name: 'Server Icon', width: 512, height: 512, aspectRatio: '1:1' },
      { name: 'Server Banner', width: 960, height: 540, aspectRatio: '16:9' },
      { name: 'User Avatar', width: 128, height: 128, aspectRatio: '1:1' },
      { name: 'Emoji', width: 128, height: 128, aspectRatio: '1:1', description: 'Max 256KB' },
    ],
  },
  {
    platform: 'Twitch',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>',
    color: '#9146FF',
    sizes: [
      { name: 'Profile Photo', width: 256, height: 256, aspectRatio: '1:1' },
      { name: 'Profile Banner', width: 1200, height: 480, aspectRatio: '2.5:1' },
      { name: 'Video Thumbnail', width: 1280, height: 720, aspectRatio: '16:9' },
      { name: 'Offline Banner', width: 1920, height: 1080, aspectRatio: '16:9' },
      { name: 'Panel', width: 320, height: 160, aspectRatio: '2:1' },
    ],
  },
  {
    platform: 'WhatsApp',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
    color: '#25D366',
    sizes: [
      { name: 'Profile Photo', width: 500, height: 500, aspectRatio: '1:1' },
      { name: 'Status', width: 1080, height: 1920, aspectRatio: '9:16' },
    ],
  },
  {
    platform: 'Telegram',
    icon: '✈',
    color: '#0088CC',
    sizes: [
      { name: 'Profile Photo', width: 512, height: 512, aspectRatio: '1:1' },
      { name: 'Channel Photo', width: 512, height: 512, aspectRatio: '1:1' },
      { name: 'Sticker', width: 512, height: 512, aspectRatio: '1:1', description: 'Max 512KB' },
    ],
  },
];

// Get sizes for a specific platform
export function getPlatformSizes(platformName: string): PlatformSizes | undefined {
  return socialMediaSizes.find(
    p => p.platform.toLowerCase() === platformName.toLowerCase()
  );
}

// Get all platform names
export function getPlatformNames(): string[] {
  return socialMediaSizes.map(p => p.platform);
}

// Calculate aspect ratio from dimensions
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

// Get recommended size for a use case
export function getRecommendedSize(
  platform: string,
  useCase: string
): ImageSize | undefined {
  const platformData = getPlatformSizes(platform);
  if (!platformData) return undefined;
  
  return platformData.sizes.find(
    s => s.name.toLowerCase().includes(useCase.toLowerCase())
  );
}
