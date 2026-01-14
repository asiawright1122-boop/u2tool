'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface Slide {
  title: string;
  content: string[];
  notes?: string;
}

export default function MarkdownToSlides() {
  const t = useTranslations('tools.markdown-to-slides');
  const [markdown, setMarkdown] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'gradient'>('light');

  const parseMarkdown = useCallback((md: string): Slide[] => {
    const slideTexts = md.split(/^---$/m).filter(s => s.trim());
    
    return slideTexts.map(slideText => {
      const lines = slideText.trim().split('\n');
      let title = '';
      const content: string[] = [];
      let notes = '';
      let inNotes = false;

      for (const line of lines) {
        if (line.startsWith('# ')) {
          title = line.replace(/^# /, '');
        } else if (line.startsWith('## ')) {
          title = line.replace(/^## /, '');
        } else if (line.toLowerCase().startsWith('notes:') || line.toLowerCase().startsWith('speaker notes:')) {
          inNotes = true;
          notes = line.replace(/^(notes:|speaker notes:)/i, '').trim();
        } else if (inNotes) {
          notes += '\n' + line;
        } else if (line.trim()) {
          content.push(line);
        }
      }

      return { title, content, notes: notes.trim() || undefined };
    });
  }, []);

  const handleConvert = useCallback(() => {
    const parsedSlides = parseMarkdown(markdown);
    setSlides(parsedSlides);
    setCurrentSlide(0);
  }, [markdown, parseMarkdown]);

  const handlePrevSlide = useCallback(() => {
    setCurrentSlide(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      handlePrevSlide();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      handleNextSlide();
    } else if (e.key === 'Escape') {
      setIsPresenting(false);
    }
  }, [handlePrevSlide, handleNextSlide]);

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white';
      case 'gradient':
        return 'bg-gradient-to-br from-purple-600 to-blue-500 text-white';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const exportToHtml = useCallback(() => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presentation</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    .slide { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 2rem; }
    .slide-light { background: white; color: #1a1a1a; }
    .slide-dark { background: #1a1a1a; color: white; }
    .slide-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
    h1 { font-size: 3rem; margin-bottom: 2rem; text-align: center; }
    ul { font-size: 1.5rem; line-height: 2; }
    li { margin: 0.5rem 0; }
    p { font-size: 1.5rem; line-height: 1.8; text-align: center; max-width: 800px; }
    @media print { .slide { page-break-after: always; } }
  </style>
</head>
<body>
${slides.map(slide => `
  <div class="slide slide-${theme}">
    ${slide.title ? `<h1>${slide.title}</h1>` : ''}
    ${slide.content.some(c => c.startsWith('- ') || c.startsWith('* ')) 
      ? `<ul>${slide.content.filter(c => c.startsWith('- ') || c.startsWith('* ')).map(c => `<li>${c.replace(/^[-*] /, '')}</li>`).join('')}</ul>`
      : slide.content.map(c => `<p>${c}</p>`).join('')}
  </div>
`).join('')}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'presentation.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [slides, theme]);

  const sampleMarkdown = `# Welcome to My Presentation
This is the first slide

---

## Key Points
- First important point
- Second important point
- Third important point

Notes: Remember to explain each point in detail

---

## Conclusion
Thank you for your attention!

- Questions?
- Contact: example@email.com`;

  return (
    <div className="space-y-6" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('markdownInput')}
            </label>
            <button
              onClick={() => setMarkdown(sampleMarkdown)}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              {t('loadSample')}
            </button>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="w-full h-80 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('hint')}
          </p>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('preview')}
            </label>
            <div className="flex items-center gap-2">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'gradient')}
                className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="light">{t('themeLight')}</option>
                <option value="dark">{t('themeDark')}</option>
                <option value="gradient">{t('themeGradient')}</option>
              </select>
            </div>
          </div>

          {slides.length > 0 ? (
            <div className={`h-80 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden ${getThemeClasses()}`}>
              <div className="h-full flex flex-col justify-center items-center p-6 text-center">
                {slides[currentSlide]?.title && (
                  <h2 className="text-2xl font-bold mb-4">{slides[currentSlide].title}</h2>
                )}
                <div className="space-y-2">
                  {slides[currentSlide]?.content.map((line, i) => (
                    <p key={i} className="text-lg">
                      {line.startsWith('- ') || line.startsWith('* ') 
                        ? `• ${line.replace(/^[-*] /, '')}`
                        : line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-80 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">{t('noSlides')}</p>
            </div>
          )}

          {/* Slide Navigation */}
          {slides.length > 0 && (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevSlide}
                disabled={currentSlide === 0}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                ← {t('prev')}
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentSlide + 1} / {slides.length}
              </span>
              <button
                onClick={handleNextSlide}
                disabled={currentSlide === slides.length - 1}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {t('next')} →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleConvert}
          disabled={!markdown.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {t('convert')}
        </button>
        {slides.length > 0 && (
          <>
            <button
              onClick={() => setIsPresenting(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {t('present')}
            </button>
            <button
              onClick={exportToHtml}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {t('exportHtml')}
            </button>
          </>
        )}
      </div>

      {/* Speaker Notes */}
      {slides.length > 0 && slides[currentSlide]?.notes && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            {t('speakerNotes')}
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            {slides[currentSlide].notes}
          </p>
        </div>
      )}

      {/* Fullscreen Presentation Mode */}
      {isPresenting && (
        <div 
          className={`fixed inset-0 z-50 ${getThemeClasses()}`}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="h-full flex flex-col justify-center items-center p-12 text-center">
            {slides[currentSlide]?.title && (
              <h1 className="text-5xl font-bold mb-8">{slides[currentSlide].title}</h1>
            )}
            <div className="space-y-4">
              {slides[currentSlide]?.content.map((line, i) => (
                <p key={i} className="text-3xl">
                  {line.startsWith('- ') || line.startsWith('* ') 
                    ? `• ${line.replace(/^[-*] /, '')}`
                    : line}
                </p>
              ))}
            </div>
          </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-8">
            <button
              onClick={handlePrevSlide}
              disabled={currentSlide === 0}
              className="px-6 py-3 bg-white/20 rounded-lg disabled:opacity-30 hover:bg-white/30 transition-colors"
            >
              ←
            </button>
            <span className="text-lg">{currentSlide + 1} / {slides.length}</span>
            <button
              onClick={handleNextSlide}
              disabled={currentSlide === slides.length - 1}
              className="px-6 py-3 bg-white/20 rounded-lg disabled:opacity-30 hover:bg-white/30 transition-colors"
            >
              →
            </button>
          </div>
          <button
            onClick={() => setIsPresenting(false)}
            className="absolute top-4 right-4 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            {t('exitPresent')}
          </button>
        </div>
      )}
    </div>
  );
}
