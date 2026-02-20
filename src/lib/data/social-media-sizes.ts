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
    icon: '📸',
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
    icon: '👤',
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
    icon: '🐦',
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
    icon: '💼',
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
    icon: '▶️',
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
    icon: '🎵',
    color: '#000000',
    sizes: [
      { name: 'Profile Photo', width: 200, height: 200, aspectRatio: '1:1' },
      { name: 'Video', width: 1080, height: 1920, aspectRatio: '9:16' },
      { name: 'Video Thumbnail', width: 1080, height: 1920, aspectRatio: '9:16' },
    ],
  },
  {
    platform: 'Pinterest',
    icon: '📌',
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
    icon: '👻',
    color: '#FFFC00',
    sizes: [
      { name: 'Snap Ad', width: 1080, height: 1920, aspectRatio: '9:16' },
      { name: 'Geofilter', width: 1080, height: 2340, aspectRatio: '9:19.5' },
      { name: 'Profile Photo', width: 320, height: 320, aspectRatio: '1:1' },
    ],
  },
  {
    platform: 'Discord',
    icon: '🎮',
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
    icon: '🎮',
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
    icon: '💬',
    color: '#25D366',
    sizes: [
      { name: 'Profile Photo', width: 500, height: 500, aspectRatio: '1:1' },
      { name: 'Status', width: 1080, height: 1920, aspectRatio: '9:16' },
    ],
  },
  {
    platform: 'Telegram',
    icon: '✈️',
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
