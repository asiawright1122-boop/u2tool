'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type SizeSystem = 'us' | 'uk' | 'eu' | 'fr' | 'au' | 'jp';

interface BraSize {
  band: number;
  cup: string;
}

// Cup size conversion tables
const cupSizes = ['AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H'];
const euCupSizes = ['AA', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];

// Band size conversions
const bandConversions: Record<number, Record<SizeSystem, number | string>> = {
  28: { us: 28, uk: 28, eu: 60, fr: 75, au: 6, jp: 60 },
  30: { us: 30, uk: 30, eu: 65, fr: 80, au: 8, jp: 65 },
  32: { us: 32, uk: 32, eu: 70, fr: 85, au: 10, jp: 70 },
  34: { us: 34, uk: 34, eu: 75, fr: 90, au: 12, jp: 75 },
  36: { us: 36, uk: 36, eu: 80, fr: 95, au: 14, jp: 80 },
  38: { us: 38, uk: 38, eu: 85, fr: 100, au: 16, jp: 85 },
  40: { us: 40, uk: 40, eu: 90, fr: 105, au: 18, jp: 90 },
  42: { us: 42, uk: 42, eu: 95, fr: 110, au: 20, jp: 95 },
  44: { us: 44, uk: 44, eu: 100, fr: 115, au: 22, jp: 100 },
  46: { us: 46, uk: 46, eu: 105, fr: 120, au: 24, jp: 105 },
};

const systemNames: Record<SizeSystem, string> = {
  us: 'US',
  uk: 'UK',
  eu: 'EU',
  fr: 'FR/ES',
  au: 'AU/NZ',
  jp: 'JP',
};

export default function BraSizeCalculator() {
  const t = useTranslations('tools.bra-size-calculator');
  const tc = useTranslations('tools');
  
  const [mode, setMode] = useState<'calculate' | 'convert'>('calculate');
  const [underbust, setUnderbust] = useState('');
  const [bust, setBust] = useState('');
  const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
  const [selectedBand, setSelectedBand] = useState<number | null>(null);
  const [selectedCup, setSelectedCup] = useState<string | null>(null);
  
  // Calculate bra size from measurements
  const calculateSize = (): BraSize | null => {
    const underVal = parseFloat(underbust);
    const bustVal = parseFloat(bust);
    
    if (isNaN(underVal) || isNaN(bustVal)) return null;
    
    // Convert to inches if needed
    const underInch = unit === 'cm' ? underVal / 2.54 : underVal;
    const bustInch = unit === 'cm' ? bustVal / 2.54 : bustVal;
    
    // Calculate band size (round to nearest even number)
    let band = Math.round(underInch);
    if (band % 2 !== 0) band += 1;
    if (band < 28) band = 28;
    if (band > 46) band = 46;
    
    // Calculate cup size
    const diff = bustInch - underInch;
    let cupIndex = Math.round(diff) - 1;
    if (cupIndex < 0) cupIndex = 0;
    if (cupIndex >= cupSizes.length) cupIndex = cupSizes.length - 1;
    
    return { band, cup: cupSizes[cupIndex] };
  };

  const calculatedSize = calculateSize();
  const displayBand = mode === 'calculate' ? calculatedSize?.band : selectedBand;
  const displayCup = mode === 'calculate' ? calculatedSize?.cup : selectedCup;

  // Get converted sizes
  const getConvertedSizes = () => {
    if (!displayBand || !displayCup) return null;
    
    const bandData = bandConversions[displayBand];
    if (!bandData) return null;
    
    const cupIndex = cupSizes.indexOf(displayCup);
    
    return {
      us: `${bandData.us}${displayCup}`,
      uk: `${bandData.uk}${displayCup}`,
      eu: `${bandData.eu}${euCupSizes[cupIndex] || displayCup}`,
      fr: `${bandData.fr}${euCupSizes[cupIndex] || displayCup}`,
      au: `${bandData.au}${displayCup}`,
      jp: `${bandData.jp}${euCupSizes[cupIndex] || displayCup}`,
    };
  };

  const convertedSizes = getConvertedSizes();

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('calculate')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'calculate'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('calculateMode')}
        </button>
        <button
          onClick={() => setMode('convert')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'convert'
              ? 'bg-pink-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('convertMode')}
        </button>
      </div>

      {mode === 'calculate' ? (
        /* Measurement Input */
        <div className="space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded text-sm ${
                unit === 'cm' ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              cm
            </button>
            <button
              onClick={() => setUnit('inch')}
              className={`px-3 py-1 rounded text-sm ${
                unit === 'inch' ? 'bg-pink-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              inches
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('underbust')} ({unit})
            </label>
            <input
              type="number"
              value={underbust}
              onChange={(e) => setUnderbust(e.target.value)}
              placeholder={unit === 'cm' ? '70-120' : '28-46'}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">{t('underbustHelp')}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('bust')} ({unit})
            </label>
            <input
              type="number"
              value={bust}
              onChange={(e) => setBust(e.target.value)}
              placeholder={unit === 'cm' ? '80-140' : '32-54'}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">{t('bustHelp')}</p>
          </div>
        </div>
      ) : (
        /* Size Selection */
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('selectBand')}
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(bandConversions).map((band) => (
                <button
                  key={band}
                  onClick={() => setSelectedBand(parseInt(band))}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedBand === parseInt(band)
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('selectCup')}
            </label>
            <div className="flex flex-wrap gap-2">
              {cupSizes.map((cup) => (
                <button
                  key={cup}
                  onClick={() => setSelectedCup(cup)}
                  className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                    selectedCup === cup
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cup}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {convertedSizes && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('yourSize')}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {(Object.keys(systemNames) as SizeSystem[]).map(system => (
              <div key={system} className="p-4 rounded-lg text-center bg-white dark:bg-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {systemNames[system]}
                </div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {convertedSizes[system]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4">
        <h4 className="font-medium text-pink-800 dark:text-pink-200 mb-2">
          {t('fittingTips')}
        </h4>
        <ul className="text-sm text-pink-700 dark:text-pink-300 space-y-1 list-disc list-inside">
          <li>{t('tip1')}</li>
          <li>{t('tip2')}</li>
          <li>{t('tip3')}</li>
          <li>{t('tip4')}</li>
        </ul>
      </div>
    </div>
  );
}
