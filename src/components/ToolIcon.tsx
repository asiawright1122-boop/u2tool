import { iconRegistry, DefaultIcon } from '@/config/iconRegistry';
import { cloneElement, isValidElement } from 'react';

interface ToolIconProps {
    slug: string;
    emoji?: string;
    className?: string;
}

export default function ToolIcon({ slug, emoji, className = "w-6 h-6" }: ToolIconProps) {
    const icon = iconRegistry[slug];

    if (icon && isValidElement(icon)) {
        // Clone the lucide-react icon element and apply className
        return (
            <div className={className}>
                {cloneElement(icon, {
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
