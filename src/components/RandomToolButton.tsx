'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface Tool {
  slug: string;
  icon: string;
}

interface RandomToolButtonProps {
  tools: Tool[];
  rotateInterval?: number;
  className?: string;
}

export default function RandomToolButton({ 
  tools, 
  rotateInterval = 3000,
  className = ''
}: RandomToolButtonProps) {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // 初始随机选择
    setCurrentIndex(Math.floor(Math.random() * tools.length));
  }, [tools.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          let next = Math.floor(Math.random() * tools.length);
          // 确保不重复
          while (next === prev && tools.length > 1) {
            next = Math.floor(Math.random() * tools.length);
          }
          return next;
        });
        setIsTransitioning(false);
      }, 200);
    }, rotateInterval);

    return () => clearInterval(timer);
  }, [tools.length, rotateInterval]);

  const currentTool = tools[currentIndex];

  if (!currentTool) return null;

  return (
    <Link 
      href={`/tools/${currentTool.slug}`} 
      className={`inline-flex items-center gap-2 transition-all duration-200 ${
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      } ${className}`}
    >
      <span>{t('home.hero.tryTool')} {t(`tools.${currentTool.slug}.name`)}</span>
    </Link>
  );
}
