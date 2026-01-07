'use client';

/**
 * 优化图片组件
 * 包含 width/height 属性防止 CLS，实现懒加载和占位符
 * @see Requirements 2.2, 2.3
 */

import React, { useState, useCallback, useMemo } from 'react';
import Image, { type ImageProps } from 'next/image';
import {
  optimizeImage,
  generatePlaceholder,
  determineLoadingStrategy,
  isExternalUrl,
  type ImageOptimizationConfig,
  type ImageMetadata,
} from '@/lib/image-optimizer';

export interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  /** 图片源路径 */
  src: string;
  /** 图片替代文本 */
  alt: string;
  /** 图片宽度 */
  width: number;
  /** 图片高度 */
  height: number;
  /** 优化配置 */
  optimizationConfig?: Partial<ImageOptimizationConfig>;
  /** 是否显示占位符 */
  showPlaceholder?: boolean;
  /** 自定义占位符颜色 */
  placeholderColor?: string;
  /** 是否为关键图片（首屏） */
  critical?: boolean;
  /** 加载完成回调 */
  onLoadComplete?: () => void;
  /** 加载错误回调 */
  onError?: () => void;
  /** 自定义类名 */
  className?: string;
  /** 容器样式 */
  containerClassName?: string;
}

/**
 * 优化图片组件
 * 自动处理懒加载、占位符、WebP 格式等优化
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  optimizationConfig,
  showPlaceholder = true,
  placeholderColor,
  critical = false,
  onLoadComplete,
  onError,
  className = '',
  containerClassName = '',
  priority,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 计算优化后的图片配置
  const optimizedConfig = useMemo(() => {
    const metadata: Partial<ImageMetadata> = {
      width,
      height,
      aspectRatio: width / height,
    };
    return optimizeImage(src, optimizationConfig, metadata);
  }, [src, width, height, optimizationConfig]);

  // 确定加载策略
  const loadingStrategy = useMemo(() => {
    if (critical || priority) {
      return 'eager';
    }
    return determineLoadingStrategy(src);
  }, [src, critical, priority]);

  // 生成占位符
  const placeholder = useMemo(() => {
    if (placeholderColor) {
      return placeholderColor;
    }
    return generatePlaceholder(src);
  }, [src, placeholderColor]);

  // 处理加载完成
  const handleLoadComplete = useCallback(() => {
    setIsLoaded(true);
    onLoadComplete?.();
  }, [onLoadComplete]);

  // 处理加载错误
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  // 如果加载失败，显示占位符
  if (hasError) {
    return (
      <div
        className={`relative overflow-hidden ${containerClassName}`}
        style={{
          width,
          height,
          backgroundColor: placeholder,
        }}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
    );
  }

  // 外部 URL 使用原生 img 标签
  if (isExternalUrl(src)) {
    return (
      <div
        className={`relative overflow-hidden ${containerClassName}`}
        style={{ width, height }}
      >
        {/* 占位符背景 */}
        {showPlaceholder && !isLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: placeholder }}
          />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loadingStrategy}
          onLoad={handleLoadComplete}
          onError={handleError}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={{ width, height, objectFit: 'cover' }}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${containerClassName}`}
      style={{ width, height }}
    >
      {/* 占位符背景 */}
      {showPlaceholder && !isLoaded && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: placeholder }}
        />
      )}
      
      {/* Next.js Image 组件 */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={critical || priority || loadingStrategy === 'eager'}
        loading={loadingStrategy}
        onLoad={handleLoadComplete}
        onError={handleError}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        sizes={optimizedConfig.sizes}
        {...props}
      />
    </div>
  );
}

/**
 * 响应式图片组件
 * 自动适应容器宽度
 */
export interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width' | 'height'> {
  /** 宽高比 (width / height) */
  aspectRatio: number;
  /** 最大宽度 */
  maxWidth?: number;
}

export function ResponsiveImage({
  aspectRatio,
  maxWidth = 1200,
  className = '',
  containerClassName = '',
  ...props
}: ResponsiveImageProps) {
  const height = Math.round(maxWidth / aspectRatio);

  return (
    <div
      className={`relative w-full ${containerClassName}`}
      style={{
        maxWidth,
        aspectRatio: `${aspectRatio}`,
      }}
    >
      <OptimizedImage
        {...props}
        width={maxWidth}
        height={height}
        className={`w-full h-auto ${className}`}
        containerClassName="w-full h-full"
      />
    </div>
  );
}

/**
 * 背景图片组件
 * 用于需要背景图片效果的场景
 */
export interface BackgroundImageProps {
  /** 图片源路径 */
  src: string;
  /** 图片替代文本 */
  alt: string;
  /** 子元素 */
  children?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 叠加层颜色 */
  overlayColor?: string;
  /** 叠加层透明度 (0-1) */
  overlayOpacity?: number;
}

export function BackgroundImage({
  src,
  alt,
  children,
  className = '',
  overlayColor = 'black',
  overlayOpacity = 0.5,
}: BackgroundImageProps) {
  const placeholder = generatePlaceholder(src);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: placeholder }}
    >
      {/* 背景图片 */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          priority={false}
          loading="lazy"
        />
      </div>
      
      {/* 叠加层 */}
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}
      
      {/* 内容 */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default OptimizedImage;
