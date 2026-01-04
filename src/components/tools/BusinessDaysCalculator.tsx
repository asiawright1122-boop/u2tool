'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Holiday {
  date: string;
  name: string;
}

export default function BusinessDaysCalculator() {
  const t = useTranslations('tools');
  
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  });
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayName, setNewHolidayName] = useState('');
  
  // Reverse calculation mode
  const [reverseMode, setReverseMode] = useState(false);
  const [businessDaysToAdd, setBusinessDaysToAdd] = useState(10);

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isHoliday = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(h => h.date === dateStr);
  };

  const calculateBusinessDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) return null;
    
    let totalDays = 0;
    let businessDays = 0;
    let weekendDays = 0;
    let holidayDays = 0;
    
    const current = new Date(start);
    while (current <= end) {
      totalDays++;
      const isWeekendDay = isWeekend(current);
      const isHolidayDay = isHoliday(current);
      
      if (isWeekendDay && excludeWeekends) {
        weekendDays++;
      } else if (isHolidayDay) {
        holidayDays++;
      } else {
        businessDays++;
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return { totalDays, businessDays, weekendDays, holidayDays };
  }, [startDate, endDate, excludeWeekends, holidays]);

  const calculateEndDateFromBusinessDays = useMemo(() => {
    if (!startDate || businessDaysToAdd <= 0) return null;
    
    const start = new Date(startDate);
    let addedDays = 0;
    const current = new Date(start);
    
    while (addedDays < businessDaysToAdd) {
      current.setDate(current.getDate() + 1);
      const isWeekendDay = isWeekend(current);
      const isHolidayDay = isHoliday(current);
      
      if (excludeWeekends && isWeekendDay) continue;
      if (isHolidayDay) continue;
      
      addedDays++;
    }
    
    return current.toISOString().split('T')[0];
  }, [startDate, businessDaysToAdd, excludeWeekends, holidays]);

  const addHoliday = () => {
    if (newHolidayDate && newHolidayName) {
      setHolidays([...holidays, { date: newHolidayDate, name: newHolidayName }]);
      setNewHolidayDate('');
      setNewHolidayName('');
    }
  };

  const removeHoliday = (index: number) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setReverseMode(false)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            !reverseMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('businessDays.calculateDays')}
        </button>
        <button
          onClick={() => setReverseMode(true)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            reverseMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {t('businessDays.calculateEndDate')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('businessDays.startDate')}
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>

          {!reverseMode ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('businessDays.endDate')}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('businessDays.businessDaysToAdd')}
              </label>
              <input
                type="number"
                min="1"
                value={businessDaysToAdd}
                onChange={(e) => setBusinessDaysToAdd(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="excludeWeekends"
              checked={excludeWeekends}
              onChange={(e) => setExcludeWeekends(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="excludeWeekends" className="text-sm text-gray-700 dark:text-gray-300">
              {t('businessDays.excludeWeekends')}
            </label>
          </div>

          {/* Holidays Section */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              {t('businessDays.customHolidays')}
            </h3>
            
            <div className="flex gap-2 mb-3">
              <input
                type="date"
                value={newHolidayDate}
                onChange={(e) => setNewHolidayDate(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
              <input
                type="text"
                value={newHolidayName}
                onChange={(e) => setNewHolidayName(e.target.value)}
                placeholder={t('businessDays.holidayName')}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
              />
              <button
                onClick={addHoliday}
                disabled={!newHolidayDate || !newHolidayName}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {t('add')}
              </button>
            </div>

            {holidays.length > 0 && (
              <div className="space-y-2">
                {holidays.map((holiday, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {holiday.date} - {holiday.name}
                    </span>
                    <button
                      onClick={() => removeHoliday(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
            {t('result')}
          </h3>

          {!reverseMode ? (
            calculateBusinessDays ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {calculateBusinessDays.businessDays}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('businessDays.businessDays')}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                      {calculateBusinessDays.totalDays}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('businessDays.totalDays')}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-xl font-semibold text-orange-500">
                      {calculateBusinessDays.weekendDays}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {t('businessDays.weekendDays')}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg text-center">
                    <div className="text-xl font-semibold text-red-500">
                      {calculateBusinessDays.holidayDays}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {t('businessDays.holidayDays')}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                {t('businessDays.invalidDateRange')}
              </p>
            )
          ) : (
            calculateEndDateFromBusinessDays && (
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {t('businessDays.calculatedEndDate')}
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {calculateEndDateFromBusinessDays}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {new Date(calculateEndDateFromBusinessDays).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
