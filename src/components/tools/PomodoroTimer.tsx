'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';

type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export default function PomodoroTimer() {
  const t = useTranslations('tools');
  
  // Settings
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<TimerPhase>('work');
  const [timeRemaining, setTimeRemaining] = useState(workDuration * 60);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQAA');
  }, []);

  const playNotification = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  const getDurationForPhase = useCallback((phase: TimerPhase) => {
    switch (phase) {
      case 'work': return workDuration * 60;
      case 'shortBreak': return shortBreakDuration * 60;
      case 'longBreak': return longBreakDuration * 60;
    }
  }, [workDuration, shortBreakDuration, longBreakDuration]);

  const handleSessionComplete = useCallback(() => {
    playNotification();
    
    if (currentPhase === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        setCurrentPhase('longBreak');
        setTimeRemaining(longBreakDuration * 60);
      } else {
        setCurrentPhase('shortBreak');
        setTimeRemaining(shortBreakDuration * 60);
      }
    } else {
      setCurrentPhase('work');
      setTimeRemaining(workDuration * 60);
    }
    setIsRunning(false);
  }, [currentPhase, completedSessions, sessionsBeforeLongBreak, longBreakDuration, shortBreakDuration, workDuration, playNotification]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRunning) {
      handleSessionComplete();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, handleSessionComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(getDurationForPhase(currentPhase));
  };

  const skipPhase = () => {
    setIsRunning(false);
    if (currentPhase === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      if (newCompletedSessions % sessionsBeforeLongBreak === 0) {
        setCurrentPhase('longBreak');
        setTimeRemaining(longBreakDuration * 60);
      } else {
        setCurrentPhase('shortBreak');
        setTimeRemaining(shortBreakDuration * 60);
      }
    } else {
      setCurrentPhase('work');
      setTimeRemaining(workDuration * 60);
    }
  };

  const switchPhase = (phase: TimerPhase) => {
    setIsRunning(false);
    setCurrentPhase(phase);
    setTimeRemaining(getDurationForPhase(phase));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = 1 - (timeRemaining / getDurationForPhase(currentPhase));
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);

  const phaseColors = {
    work: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', stroke: '#ef4444' },
    shortBreak: { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', stroke: '#22c55e' },
    longBreak: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', stroke: '#3b82f6' },
  };

  return (
    <div className="space-y-6">
      {/* Phase Tabs */}
      <div className="flex justify-center gap-2">
        {(['work', 'shortBreak', 'longBreak'] as TimerPhase[]).map((phase) => (
          <button
            key={phase}
            onClick={() => switchPhase(phase)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPhase === phase
                ? `${phaseColors[phase].bg} ${phaseColors[phase].text}`
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t(`pomodoro.${phase}`)}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className={`${phaseColors[currentPhase].bg} rounded-2xl p-8 flex flex-col items-center`}>
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="128" cy="128" r="120" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
            <circle cx="128" cy="128" r="120" fill="none" stroke={phaseColors[currentPhase].stroke} strokeWidth="8"
              strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-5xl font-bold ${phaseColors[currentPhase].text}`}>{formatTime(timeRemaining)}</span>
            <span className="text-gray-500 dark:text-gray-400 mt-2">{t(`pomodoro.${currentPhase}`)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mt-6">
          <button onClick={toggleTimer}
            className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
              isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            }`}>
            {isRunning ? t('pomodoro.pause') : t('pomodoro.start')}
          </button>
          <button onClick={resetTimer} className="px-6 py-3 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
            {t('pomodoro.reset')}
          </button>
          <button onClick={skipPhase} className="px-6 py-3 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600">
            {t('pomodoro.skip')}
          </button>
        </div>
      </div>

      {/* Session Counter */}
      <div className="flex justify-center items-center gap-4">
        <span className="text-gray-600 dark:text-gray-400">{t('pomodoro.completedSessions')}:</span>
        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedSessions}</span>
        <button onClick={() => setCompletedSessions(0)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          {t('clear')}
        </button>
      </div>

      {/* Settings Toggle */}
      <div className="flex justify-center">
        <button onClick={() => setShowSettings(!showSettings)}
          className="text-blue-600 dark:text-blue-400 hover:underline">
          {showSettings ? t('pomodoro.hideSettings') : t('pomodoro.showSettings')}
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">{t('pomodoro.settings')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('pomodoro.workDuration')} ({t('pomodoro.minutes')})</label>
              <input type="number" min="1" max="60" value={workDuration} onChange={(e) => { setWorkDuration(parseInt(e.target.value) || 25); if (currentPhase === 'work' && !isRunning) setTimeRemaining((parseInt(e.target.value) || 25) * 60); }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('pomodoro.shortBreakDuration')} ({t('pomodoro.minutes')})</label>
              <input type="number" min="1" max="30" value={shortBreakDuration} onChange={(e) => { setShortBreakDuration(parseInt(e.target.value) || 5); if (currentPhase === 'shortBreak' && !isRunning) setTimeRemaining((parseInt(e.target.value) || 5) * 60); }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('pomodoro.longBreakDuration')} ({t('pomodoro.minutes')})</label>
              <input type="number" min="1" max="60" value={longBreakDuration} onChange={(e) => { setLongBreakDuration(parseInt(e.target.value) || 15); if (currentPhase === 'longBreak' && !isRunning) setTimeRemaining((parseInt(e.target.value) || 15) * 60); }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">{t('pomodoro.sessionsBeforeLongBreak')}</label>
              <input type="number" min="1" max="10" value={sessionsBeforeLongBreak} onChange={(e) => setSessionsBeforeLongBreak(parseInt(e.target.value) || 4)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="soundEnabled" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} className="w-4 h-4" />
            <label htmlFor="soundEnabled" className="text-sm text-gray-600 dark:text-gray-400">{t('pomodoro.soundNotification')}</label>
          </div>
        </div>
      )}
    </div>
  );
}
