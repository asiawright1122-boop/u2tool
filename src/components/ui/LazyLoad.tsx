'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  /** 占位内容 */
  placeholder?: ReactNode;
  /** 触发加载的阈值（距离视口的距离） */
  rootMargin?: string;
  /** 触发加载的可见比例 */
  threshold?: number;
  /** 是否只加载一次 */
  once?: boolean;
  /** 自定义类名 */
  className?: string;
}

/**
 * 懒加载组件
 * 使用 Intersection Observer 实现内容懒加载
 * 优化 LCP 和减少初始加载时间
 */
export function LazyLoad({
  children,
  placeholder = null,
  rootMargin = '100px',
  threshold = 0,
  once = true,
  className = '',
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 检查浏览器是否支持 Intersection Observer
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, once]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : placeholder}
    </div>
  );
}

/**
 * 懒加载图片组件
 * 自动处理图片懒加载和占位
 */
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#374151',
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(img);
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        width,
        height,
        backgroundColor: isLoaded ? 'transparent' : placeholderColor,
      }}
    >
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    </div>
  );
}

export default LazyLoad;
