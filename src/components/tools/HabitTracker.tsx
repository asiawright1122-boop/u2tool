'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  color: string;
}

const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function HabitTracker() {
  const t = useTranslations('tools.habit-tracker');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  useEffect(() => {
    const saved = localStorage.getItem('habits');
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (!newHabitName.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      completedDates: [],
      color: selectedColor,
    };
    setHabits([...habits, habit]);
    setNewHabitName('');
  };

  const toggleDay = (habitId: string, date: string) => {
    setHabits(habits.map(h => {
      if (h.id !== habitId) return h;
      const dates = h.completedDates.includes(date)
        ? h.completedDates.filter(d => d !== date)
        : [...h.completedDates, date];
      return { ...h, completedDates: dates };
    }));
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const days = getLast7Days();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getStreak = (habit: Habit): number => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      if (habit.completedDates.includes(dateStr)) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder={t('habitPlaceholder')}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          onKeyPress={(e) => e.key === 'Enter' && addHabit()}
        />
        <div className="flex gap-1">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-lg transition-transform ${selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-gray-400' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <button
          onClick={addHabit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {t('addHabit')}
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t('noHabits')}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-[1fr_repeat(7,40px)_60px_40px] gap-2 items-center text-sm text-gray-500 dark:text-gray-400">
            <div>{t('habit')}</div>
            {days.map((date) => (
              <div key={date} className="text-center">
                {dayNames[new Date(date).getDay()]}
              </div>
            ))}
            <div className="text-center">{t('streak')}</div>
            <div></div>
          </div>

          {habits.map((habit) => (
            <div
              key={habit.id}
              className="grid grid-cols-[1fr_repeat(7,40px)_60px_40px] gap-2 items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                <span className="font-medium text-gray-900 dark:text-white truncate">{habit.name}</span>
              </div>
              {days.map((date) => (
                <button
                  key={date}
                  onClick={() => toggleDay(habit.id, date)}
                  className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                    habit.completedDates.includes(date)
                      ? 'border-transparent'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                  style={{
                    backgroundColor: habit.completedDates.includes(date) ? habit.color : 'transparent',
                  }}
                >
                  {habit.completedDates.includes(date) && (
                    <span className="text-white">✓</span>
                  )}
                </button>
              ))}
              <div className="text-center font-medium text-gray-900 dark:text-white">
                🔥 {getStreak(habit)}
              </div>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-400">
        💡 {t('tip')}
      </div>
    </div>
  );
}
