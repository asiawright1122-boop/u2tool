export interface CommonResolution {
  name: string;
  width: number;
  height: number;
}

export const commonResolutions: CommonResolution[] = [
  { name: 'HD 720p', width: 1280, height: 720 },
  { name: 'Full HD 1080p', width: 1920, height: 1080 },
  { name: 'QHD 1440p', width: 2560, height: 1440 },
  { name: 'UltraWide QHD', width: 3440, height: 1440 },
  { name: '4K UHD', width: 3840, height: 2160 },
  { name: '5K', width: 5120, height: 2880 },
  { name: '8K UHD', width: 7680, height: 4320 },
];
