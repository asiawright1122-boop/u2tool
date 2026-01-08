'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface WheelOption {
  id: string;
  label: string;
  color: string;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8B500', '#00CED1', '#FF69B4', '#32CD32', '#FF7F50'
];

export default function DecisionWheel() {
  const t = useTranslations('tools.decision-wheel');
  const tCommon = useTranslations('tools');

  const [options, setOptions] = useState<WheelOption[]>([
    { id: '1', label: 'Option 1', color: COLORS[0] },
    { id: '2', label: 'Option 2', color: COLORS[1] },
    { id: '3', label: 'Option 3', color: COLORS[2] },
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addOption = () => {
    const newId = Date.now().toString();
    const colorIndex = options.length % COLORS.length;
    setOptions([...options, { id: newId, label: `Option ${options.length + 1}`, color: COLORS[colorIndex] }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(options.filter(o => o.id !== id));
    }
  };

  const updateOption = (id: string, label: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, label } : o));
  };

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sliceAngle = (2 * Math.PI) / options.length;

    options.forEach((option, index) => {
      const startAngle = index * sliceAngle + (rotation * Math.PI / 180);
      const endAngle = startAngle + sliceAngle;

      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = option.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      
      const text = option.label.length > 15 ? option.label.substring(0, 15) + '...' : option.label;
      ctx.fillText(text, radius - 20, 5);
      ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 5, centerY);
    ctx.lineTo(centerX + radius - 15, centerY - 15);
    ctx.lineTo(centerX + radius - 15, centerY + 15);
    ctx.closePath();
    ctx.fillStyle = '#333';
    ctx.fill();
  }, [options, rotation]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);

    // Random spin amount (5-10 full rotations + random angle)
    const spins = 5 + Math.random() * 5;
    const extraAngle = Math.random() * 360;
    const totalRotation = spins * 360 + extraAngle;

    // Animate the spin
    const startRotation = rotation;
    const duration = 4000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentRotation = startRotation + totalRotation * easeOut;
      setRotation(currentRotation % 360);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Determine winner
        const finalAngle = (360 - (currentRotation % 360)) % 360;
        const sliceAngle = 360 / options.length;
        const winnerIndex = Math.floor(finalAngle / sliceAngle);
        setWinner(options[winnerIndex].label);
        setIsSpinning(false);

        // Play sound
        if (soundEnabled && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    requestAnimationFrame(animate);
  }, [isSpinning, options, rotation, soundEnabled]);

  const reset = () => {
    setRotation(0);
    setWinner(null);
    setOptions([
      { id: '1', label: 'Option 1', color: COLORS[0] },
      { id: '2', label: 'Option 2', color: COLORS[1] },
      { id: '3', label: 'Option 3', color: COLORS[2] },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wheel */}
        <div className="flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={350}
            height={350}
            className="max-w-full"
          />
          
          {/* Winner Display */}
          {winner && (
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700 text-center">
              <div className="text-sm text-gray-600 dark:text-gray-400">{t('winner')}</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{winner}</div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={spin}
              disabled={isSpinning || options.length < 2}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all font-medium"
            >
              {t('spin')}
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={reset}
              className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('options')} ({options.length})
          </label>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0"
                  style={{ backgroundColor: option.color }}
                />
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(option.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => removeOption(option.id)}
                  disabled={options.length <= 2}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addOption}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg w-full justify-center"
          >
            <Plus className="w-4 h-4" />
            {t('addOption')}
          </button>
        </div>
      </div>

    </div>
  );
}