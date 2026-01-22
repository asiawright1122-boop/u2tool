import { iconRegistry, DefaultIcon } from '@/config/iconRegistry';

interface ToolIconProps {
    slug: string;
    emoji?: string;
    className?: string;
}

export default function ToolIcon({ slug, emoji, className = "w-6 h-6" }: ToolIconProps) {
    const icon = iconRegistry[slug];

    if (icon) {
        return (
            <div className={className}>
                {/* Clone element to add className if needed, though usually className is on wrapper */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-full h-full"
                >
                    {icon.props.children}
                </svg>
            </div>
        );
    }

    // Fallback to emoji if no icon mapped
    if (emoji) {
        return <span className={className} style={{ fontSize: '1.5em', lineHeight: 1 }}>{emoji}</span>;
    }

    return <div className={className}>{DefaultIcon}</div>;
}
