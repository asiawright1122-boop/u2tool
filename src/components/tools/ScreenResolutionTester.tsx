'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const commonResolutions = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Pro 11"', width: 834, height: 1194 },
  { name: 'iPad Pro 12.9"', width: 1024, height: 1366 },
  { name: 'HD', width: 1280, height: 720 },
  { name: 'Full HD', width: 1920, height: 1080 },
  { name: '2K QHD', width: 2560, height: 1440 },
  { name: '4K UHD', width: 3840, height: 2160 },
  { name: 'MacBook Air 13"', width: 1440, height: 900 },
  { name: 'MacBook Pro 14"', width: 3024, height: 1964 },
  { name: 'MacBook Pro 16"', width: 3456, height: 2234 },
];

export default function ScreenResolutionTester() {
  const t = useTranslations('tools.screen-resolution-tester');

  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(0);
  const [viewportWidth, setViewportWidth] = useState<number>(0);
  const [viewportHeight, setViewportHeight] = useState<number>(0);
  const [devicePixelRatio, setDevicePixelRatio] = useState<number>(1);
  const [colorDepth, setColorDepth] = useState<number>(0);
  const [orientation, setOrientation] = useState<string>('');
  const [customWidth, setCustomWidth] = useState<string>('');
  const [customHeight, setCustomHeight] = useState<string>('');

  useEffect(() => {
    const updateInfo = () => {
      setScreenWidth(window.screen.width);
      setScreenHeight(window.screen.height);
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
      setDevicePixelRatio(window.devicePixelRatio);
      setColorDepth(window.screen.colorDepth);
      setOrientation(window.screen.orientation?.type || 'unknown');
    };

    updateInfo();
    window.addEventListener('resize', updateInfo);
    return () => window.removeEventListener('resize', updateInfo);
  }, []);

  const openResolutionWindow = (width: number, height: number) => {
    window.open(
      window.location.href,
      '_blank',
      `width=${width},height=${height},menubar=no,toolbar=no,location=no,status=no`
    );
  };

  const openCustomResolution = () => {
    const w = parseInt(customWidth);
    const h = parseInt(customHeight);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      openResolutionWindow(w, h);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white">
        <h3 className="text-lg font-semibold mb-4">{t('currentScreen')}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm opacity-80">{t('screenResolution')}</div>
            <div className="text-2xl font-bold">{screenWidth} × {screenHeight}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">{t('viewportSize')}</div>
            <div className="text-2xl font-bold">{viewportWidth} × {viewportHeight}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">{t('devicePixelRatio')}</div>
            <div className="text-2xl font-bold">{devicePixelRatio}x</div>
          </div>
          <div>
            <div className="text-sm opacity-80">{t('colorDepth')}</div>
            <div className="text-2xl font-bold">{colorDepth} bit</div>
          </div>
          <div>
            <div className="text-sm opacity-80">{t('orientation')}</div>
            <div className="text-2xl font-bold">{orientation.split('-')[0]}</div>
          </div>
          <div>
            <div className="text-sm opacity-80">{t('physicalResolution')}</div>
            <div className="text-2xl font-bold">
              {Math.round(screenWidth * devicePixelRatio)} × {Math.round(screenHeight * devicePixelRatio)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">{t('customResolution')}</h3>
        <div className="flex gap-2">
          <input
            type="number"
            value={customWidth}
            onChange={(e) => setCustomWidth(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('width')}
          />
          <span className="flex items-center text-gray-500">×</span>
          <input
            type="number"
            value={customHeight}
            onChange={(e) => setCustomHeight(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder={t('height')}
          />
          <button
            onClick={openCustomResolution}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('test')}
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">{t('commonResolutions')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {commonResolutions.map((res) => (
            <button
              key={res.name}
              onClick={() => openResolutionWindow(res.width, res.height)}
              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white">{res.name}</div>
              <div className="text-sm text-gray-500">{res.width} × {res.height}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-3">{t('viewportIndicator')}</h3>
        <div className="flex justify-center">
          <div
            className="border-2 border-blue-500 rounded relative"
            style={{
              width: '300px',
              height: `${300 * (viewportHeight / viewportWidth)}px`,
              maxHeight: '200px',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              {viewportWidth} × {viewportHeight}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">{t('note')}</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          {t('noteText')}
        </p>
      </div>
    </div>
  );
}
