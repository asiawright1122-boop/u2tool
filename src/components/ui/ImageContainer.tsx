'use client';

/**
 * 图片容器组件
 * 用于防止图片加载时的布局偏移 (CLS)
 * 
 * 功能：
 * 1. 预留图片空间，防止布局偏移
 * 2. 支持 aspect-ratio 和固定尺寸两种模式
 * 3. 提供加载状态骨架屏
 * 4. 支持图片加载失败的占位符
 * 
 * @see Requirements 3.1, 1.4
 */

import React, { useState, useCallback, useMemo } from 'react';

export interface ImageContainerProps {
  /** 图片源 */
  src: string;
  /** 图片替代文本 */
  alt: string;
  /** 宽度 (可选，用于固定尺寸模式) */
  width?: number;
  /** 高度 (可选，用于固定尺寸模式) */
  height?: number;
  /** 宽高比 (可选，用于响应式模式，格式如 "16/9" 或 1.777) */
  aspectRatio?: string | number;
  /** 最大宽度 */
  maxWidth?: string;
  /** 最大高度 */
  maxHeight?: string;
  /** 最小高度 (用于动态图片预留空间) */
  minHeight?: string;
  /** 图片填充模式 */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /** 自定义图片类名 */
  className?: string;
  /** 容器类名 */
  containerClassName?: string;
  /** 是否显示加载骨架屏 */
  showSkeleton?: boolean;
  /** 骨架屏颜色 */
  skeletonColor?: string;
  /** 加载完成回调 */
  onLoad?: () => void;
  /** 加载错误回调 */
  onError?: () => void;
  /** 额外的图片属性 */
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

/**
 * 图片容器组件
 * 自动处理图片加载状态，防止 CLS
 */
export function ImageContainer({
  src,
  alt,
  width,
  height,
  aspectRatio,
  maxWidth = '100%',
  maxHeight,
  minHeight,
  objectFit = 'contain',
  className = '',
  containerClassName = '',
  showSkeleton = true,
  skeletonColor,
  onLoad,
  onError,
  imgProps = {},
}: ImageContainerProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 处理加载完成
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // 处理加载错误
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
    onError?.();
  }, [onError]);

  // 计算容器样式
  const containerStyle = useMemo<React.CSSProperties>(() => {
    const style: React.CSSProperties = {
      position: 'relative',
      overflow: 'hidden',
      maxWidth,
    };

    // 固定尺寸模式
    if (width !== undefined && height !== undefined) {
      style.width = width;
      style.height = height;
    }
    // 宽高比模式
    else if (aspectRatio !== undefined) {
      style.aspectRatio = typeof aspectRatio === 'number' 
        ? String(aspectRatio) 
        : aspectRatio;
      style.width = '100%';
    }

    if (maxHeight) {
      style.maxHeight = maxHeight;
    }

    if (minHeight) {
      style.minHeight = minHeight;
    }

    return style;
  }, [width, height, aspectRatio, maxWidth, maxHeight, minHeight]);

  // 计算图片样式
  const imgStyle = useMemo<React.CSSProperties>(() => ({
    width: '100%',
    height: '100%',
    objectFit,
    opacity: isLoaded && !hasError ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
  }), [objectFit, isLoaded, hasError]);

  // 骨架屏样式
  const skeletonStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    inset: 0,
    backgroundColor: skeletonColor || 'var(--skeleton-bg, #e5e7eb)',
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
  }), [skeletonColor, isLoaded]);

  // 错误占位符
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${containerClassName}`}
        style={containerStyle}
        role="img"
        aria-label={alt}
      >
        <div className="text-gray-400 dark:text-gray-500 text-center p-4">
          <svg
            className="w-8 h-8 mx-auto mb-2"
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
          <span className="text-sm">Image failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${containerClassName}`}
      style={containerStyle}
    >
      {/* 骨架屏 */}
      {showSkeleton && (
        <div
          className="animate-pulse rounded-lg"
          style={skeletonStyle}
          aria-hidden="true"
        />
      )}
      
      {/* 图片 */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={className}
        style={imgStyle}
        loading="lazy"
        decoding="async"
        {...imgProps}
      />
    </div>
  );
}

/**
 * 预设的图片容器变体
 */

/** 缩略图容器 - 固定 1:1 比例 */
export function ThumbnailContainer(props: Omit<ImageContainerProps, 'aspectRatio'>) {
  return <ImageContainer {...props} aspectRatio="1/1" objectFit="cover" />;
}

/** 预览图容器 - 16:9 比例 */
export function PreviewContainer(props: Omit<ImageContainerProps, 'aspectRatio'>) {
  return <ImageContainer {...props} aspectRatio="16/9" objectFit="contain" />;
}

/** 全宽图片容器 - 自适应高度 */
export function FullWidthContainer(props: Omit<ImageContainerProps, 'maxWidth'>) {
  return <ImageContainer {...props} maxWidth="100%" minHeight="200px" />;
}

export default ImageContainer;
