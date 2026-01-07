/**
 * 图片优化模块
 * 提供图片优化、WebP 转换、占位符生成和懒加载配置
 * @see Requirements 2.1, 2.5
 */

// 图片优化配置接口
export interface ImageOptimizationConfig {
  quality: number;           // 0-100
  maxWidth: number;          // Maximum width in pixels
  formats: ('webp' | 'avif' | 'original')[];
  lazyLoadThreshold: number; // Pixels from viewport
}

// 优化后的图片接口
export interface OptimizedImage {
  src: string;
  srcSet: string;
  width: number;
  height: number;
  placeholder: string;      // Base64 blur placeholder or CSS color
  loading: 'lazy' | 'eager';
  sizes?: string;
}

// 图片元数据接口
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  aspectRatio: number;
}

// 默认配置
export const DEFAULT_CONFIG: ImageOptimizationConfig = {
  quality: 80,
  maxWidth: 1920,
  formats: ['webp', 'original'],
  lazyLoadThreshold: 200,
};

// 响应式断点
export const RESPONSIVE_BREAKPOINTS = [320, 640, 768, 1024, 1280, 1920];

// 常见图片宽高比
export const COMMON_ASPECT_RATIOS = {
  '16:9': 16 / 9,
  '4:3': 4 / 3,
  '1:1': 1,
  '3:2': 3 / 2,
  '21:9': 21 / 9,
};

/**
 * 生成优化后的图片配置
 * @param src - 原始图片路径
 * @param config - 优化配置
 * @param metadata - 图片元数据（可选）
 * @returns 优化后的图片配置
 */
export function optimizeImage(
  src: string,
  config: Partial<ImageOptimizationConfig> = {},
  metadata?: Partial<ImageMetadata>
): OptimizedImage {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // 确定图片尺寸
  const width = metadata?.width || finalConfig.maxWidth;
  const height = metadata?.height || Math.round(width / (metadata?.aspectRatio || 16 / 9));
  
  // 生成 srcSet
  const srcSet = generateSrcSet(src, finalConfig, width);
  
  // 生成占位符
  const placeholder = generatePlaceholder(src, metadata);
  
  // 确定加载策略
  const loading = determineLoadingStrategy(src);
  
  // 生成 sizes 属性
  const sizes = generateSizes(width);
  
  return {
    src: getOptimizedSrc(src, finalConfig),
    srcSet,
    width,
    height,
    placeholder,
    loading,
    sizes,
  };
}

/**
 * 生成模糊占位符
 * @param src - 原始图片路径
 * @param metadata - 图片元数据（可选）
 * @returns 占位符字符串（Base64 或 CSS 颜色）
 */
export function generatePlaceholder(
  src: string,
  metadata?: Partial<ImageMetadata>
): string {
  // 如果有预生成的占位符，直接返回
  if (src.includes('placeholder=')) {
    const match = src.match(/placeholder=([^&]+)/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
  }
  
  // 基于图片路径生成一致的颜色
  const hash = simpleHash(src);
  const hue = hash % 360;
  const saturation = 10 + (hash % 20); // 10-30%
  const lightness = 85 + (hash % 10);  // 85-95%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * 生成 srcSet 属性
 * @param src - 原始图片路径
 * @param config - 优化配置
 * @param maxWidth - 最大宽度
 * @returns srcSet 字符串
 */
export function generateSrcSet(
  src: string,
  config: ImageOptimizationConfig,
  maxWidth: number
): string {
  const breakpoints = RESPONSIVE_BREAKPOINTS.filter(bp => bp <= maxWidth);
  
  // 确保包含最大宽度
  if (!breakpoints.includes(maxWidth) && maxWidth <= config.maxWidth) {
    breakpoints.push(maxWidth);
  }
  
  const srcSetEntries = breakpoints.map(width => {
    const optimizedSrc = getOptimizedSrcWithWidth(src, config, width);
    return `${optimizedSrc} ${width}w`;
  });
  
  return srcSetEntries.join(', ');
}

/**
 * 获取优化后的图片 URL
 * @param src - 原始图片路径
 * @param config - 优化配置
 * @returns 优化后的 URL
 */
export function getOptimizedSrc(
  src: string,
  config: Partial<ImageOptimizationConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // 如果是外部 URL，直接返回
  if (isExternalUrl(src)) {
    return src;
  }
  
  // 如果已经是优化后的 URL，直接返回
  if (src.includes('/_next/image')) {
    return src;
  }
  
  // 使用 Next.js 图片优化
  const params = new URLSearchParams({
    url: src,
    w: finalConfig.maxWidth.toString(),
    q: finalConfig.quality.toString(),
  });
  
  return `/_next/image?${params.toString()}`;
}

/**
 * 获取指定宽度的优化图片 URL
 * @param src - 原始图片路径
 * @param config - 优化配置
 * @param width - 目标宽度
 * @returns 优化后的 URL
 */
export function getOptimizedSrcWithWidth(
  src: string,
  config: ImageOptimizationConfig,
  width: number
): string {
  // 如果是外部 URL，直接返回
  if (isExternalUrl(src)) {
    return src;
  }
  
  // 使用 Next.js 图片优化
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: config.quality.toString(),
  });
  
  return `/_next/image?${params.toString()}`;
}

/**
 * 生成 sizes 属性
 * @param maxWidth - 最大宽度
 * @returns sizes 字符串
 */
export function generateSizes(maxWidth: number): string {
  const sizes: string[] = [];
  
  // 移动端
  if (maxWidth >= 640) {
    sizes.push('(max-width: 640px) 100vw');
  }
  
  // 平板
  if (maxWidth >= 1024) {
    sizes.push('(max-width: 1024px) 80vw');
  }
  
  // 桌面
  sizes.push(`${Math.min(maxWidth, 1200)}px`);
  
  return sizes.join(', ');
}

/**
 * 确定图片加载策略
 * @param src - 图片路径
 * @returns 加载策略
 */
export function determineLoadingStrategy(src: string): 'lazy' | 'eager' {
  // 首屏关键图片使用 eager
  const criticalPatterns = [
    /logo/i,
    /hero/i,
    /banner/i,
    /og-image/i,
    /favicon/i,
  ];
  
  for (const pattern of criticalPatterns) {
    if (pattern.test(src)) {
      return 'eager';
    }
  }
  
  // 默认使用懒加载
  return 'lazy';
}

/**
 * 检查是否为外部 URL
 * @param src - 图片路径
 * @returns 是否为外部 URL
 */
export function isExternalUrl(src: string): boolean {
  return src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//');
}

/**
 * 计算图片宽高比
 * @param width - 宽度
 * @param height - 高度
 * @returns 宽高比
 */
export function calculateAspectRatio(width: number, height: number): number {
  if (height === 0) return 1;
  return width / height;
}

/**
 * 根据宽高比计算高度
 * @param width - 宽度
 * @param aspectRatio - 宽高比
 * @returns 高度
 */
export function calculateHeight(width: number, aspectRatio: number): number {
  if (aspectRatio === 0) return width;
  return Math.round(width / aspectRatio);
}

/**
 * 验证图片配置
 * @param config - 配置对象
 * @returns 验证结果
 */
export function validateConfig(config: Partial<ImageOptimizationConfig>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (config.quality !== undefined) {
    if (config.quality < 0 || config.quality > 100) {
      errors.push('Quality must be between 0 and 100');
    }
  }
  
  if (config.maxWidth !== undefined) {
    if (config.maxWidth < 1) {
      errors.push('Max width must be at least 1');
    }
    if (config.maxWidth > 4096) {
      errors.push('Max width should not exceed 4096');
    }
  }
  
  if (config.lazyLoadThreshold !== undefined) {
    if (config.lazyLoadThreshold < 0) {
      errors.push('Lazy load threshold must be non-negative');
    }
  }
  
  if (config.formats !== undefined) {
    const validFormats = ['webp', 'avif', 'original'];
    for (const format of config.formats) {
      if (!validFormats.includes(format)) {
        errors.push(`Invalid format: ${format}`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 获取支持的图片格式
 * @returns 支持的格式列表
 */
export function getSupportedFormats(): string[] {
  // 在浏览器环境中检测支持的格式
  if (typeof document !== 'undefined') {
    const formats: string[] = ['original'];
    
    // 检测 WebP 支持
    const canvas = document.createElement('canvas');
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      formats.unshift('webp');
    }
    
    return formats;
  }
  
  // 服务端默认支持所有格式
  return ['webp', 'avif', 'original'];
}

/**
 * 简单哈希函数（用于生成一致的占位符颜色）
 * @param str - 输入字符串
 * @returns 哈希值
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * 生成图片预加载链接
 * @param src - 图片路径
 * @param config - 优化配置
 * @returns 预加载链接 HTML
 */
export function generatePreloadLink(
  src: string,
  config: Partial<ImageOptimizationConfig> = {}
): string {
  const optimizedSrc = getOptimizedSrc(src, config);
  return `<link rel="preload" as="image" href="${optimizedSrc}" />`;
}

/**
 * 获取图片优化建议
 * @param metadata - 图片元数据
 * @param config - 当前配置
 * @returns 优化建议列表
 */
export function getOptimizationRecommendations(
  metadata: ImageMetadata,
  config: ImageOptimizationConfig
): string[] {
  const recommendations: string[] = [];
  
  // 检查图片尺寸
  if (metadata.width > config.maxWidth) {
    recommendations.push(`图片宽度 (${metadata.width}px) 超过最大宽度 (${config.maxWidth}px)，建议调整尺寸`);
  }
  
  // 检查格式
  if (metadata.format === 'png' && !metadata.format.includes('transparency')) {
    recommendations.push('PNG 图片可以转换为 WebP 格式以减少文件大小');
  }
  
  if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
    recommendations.push('JPEG 图片可以转换为 WebP 格式以获得更好的压缩');
  }
  
  // 检查宽高比
  const aspectRatio = calculateAspectRatio(metadata.width, metadata.height);
  if (aspectRatio > 3 || aspectRatio < 0.33) {
    recommendations.push('图片宽高比较极端，可能影响布局稳定性');
  }
  
  return recommendations;
}
