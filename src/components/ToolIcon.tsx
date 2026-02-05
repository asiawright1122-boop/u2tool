'use client';

import { iconRegistry, DefaultIcon } from '@/config/iconRegistry';
import { cloneElement, isValidElement, ReactElement, useState, useEffect } from 'react';

interface ToolIconProps {
    slug: string;
    emoji?: string;
    className?: string;
}

export default function ToolIcon({ slug, emoji, className = "w-6 h-6" }: ToolIconProps) {
    // 使用 mounted 状态避免 hydration 不匹配
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);

    const icon = iconRegistry[slug];

    // 在客户端挂载前，返回占位符避免 hydration 错误
    if (!mounted) {
        return <div className={className} />;
    }

    if (icon && isValidElement(icon)) {
        // Clone the lucide-react icon element and apply className
        return (
            <div className={className}>
                {cloneElement(icon as ReactElement<{ className?: string; strokeWidth?: number }>, {
                    className: "w-full h-full",
                    strokeWidth: 2,
                })}
            </div>
        );
    }

    // Fallback to emoji if no icon mapped
    if (emoji) {
        return <span className={className} style={{ fontSize: '1.5em', lineHeight: 1 }}>{emoji}</span>;
    }

    return <div className={className}>{DefaultIcon}</div>;
}
