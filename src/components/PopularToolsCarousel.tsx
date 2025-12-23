'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface Tool {
  slug: string;
  category: string;
  icon: string;
}

interface PopularToolsCarouselProps {
  tools: Tool[];
  displayCount?: number;
  rotateInterval?: number;
}

export default function PopularToolsCarousel({ 
  tools, 
  displayCount = 12,
  rotateInterval = 8000 
}: PopularToolsCarouselProps) {
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(0);
  
  // Calculate pages
  const totalPages = Math.ceil(tools.length / displayCount);
  const pages = Array.from({ length: totalPages }, (_, i) => 
    tools.slice(i * displayCount, (i + 1) * displayCount)
  );

  // Auto rotation
  useEffect(() => {
    if (totalPages <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentPage(prev => (prev + 1) % totalPages);
    }, rotateInterval);

    return () => clearInterval(timer);
  }, [totalPages, rotateInterval]);

  const goToNext = () => {
    setCurrentPage(prev => (prev + 1) % totalPages);
  };

  const goToPrev = () => {
    setCurrentPage(prev => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="relative">
      {/* Sliding Window */}
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentPage * 100}%)` }}
        >
          {pages.map((pageTools, pageIndex) => (
            <div key={pageIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageTools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="group p-6 bg-gray-800/50 border border-gray-700/50 rounded-xl hover:bg-gray-800 hover:border-gray-600 hover:shadow-xl hover:shadow-black/20 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                          {t(`tools.${tool.slug}.name`)}
                        </h3>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {t(`tools.${tool.slug}.description`)}
                        </p>
                        <span className="inline-flex items-center gap-1 mt-3 text-xs text-gray-400">
                          <span className="px-2 py-0.5 bg-gray-700/50 rounded">{t(`categories.${tool.category}`)}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={goToPrev}
          className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700 hover:border-gray-600 transition-colors"
          aria-label="Previous"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPage === index 
                  ? 'w-6 bg-blue-500' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              aria-label={`Page ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-700 hover:border-gray-600 transition-colors"
          aria-label="Next"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Page Info */}
      <p className="text-center text-sm text-gray-400 mt-3">
        {currentPage + 1} / {totalPages}
      </p>
    </div>
  );
}
