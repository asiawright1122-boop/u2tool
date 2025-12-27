'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { categories } from '@/config/tools';

export default function CategoryList() {
    const t = useTranslations('categories');

    return (
        <div className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-sm sticky top-16 z-40">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-3 mask-edge-fade">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/tools/category/${category.id}`}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-800 bg-gray-900/50 text-gray-400 hover:text-white hover:border-blue-500/50 hover:bg-blue-500/10 transition-all whitespace-nowrap text-sm group"
                        >
                            <span className="group-hover:scale-110 transition-transform">{category.icon}</span>
                            <span>{t(category.id)}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
