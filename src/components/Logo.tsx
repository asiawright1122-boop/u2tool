'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function Logo({ width = 32, height = 32, className = '' }: LogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 在客户端挂载前，使用深色 logo 作为默认（避免 hydration 问题）
  const logoSrc = mounted && resolvedTheme === 'light' 
    ? '/icons/u2tool-logo-light.svg' 
    : '/icons/u2tool-logo-dark.svg';

  return (
    <Image 
      src={logoSrc}
      alt="u2tool logo" 
      width={width}
      height={height}
      className={`object-contain ${className}`}
      priority
    />
  );
}
