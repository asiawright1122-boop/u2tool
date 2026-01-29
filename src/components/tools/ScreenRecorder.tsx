'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export default function ScreenRecorder() {
  const t = useTranslations('tools');
  const [state, setState] = useState<RecordingState>('idle');
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = useCallback(async () => {
    setError('');
    setRecordedUrl(null);
    setDuration(0);
    chunksRef.current = [];

    try {
      // 请求屏幕共享权限
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
        },
        audio: true,
      });

      streamRef.current = stream;

      // 创建 MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setState('stopped');
        stopTimer();
      };

      // 监听用户停止共享
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000); // 每秒收集一次数据
      setState('recording');
      startTimer();
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError(t('screen-recorder.permissionDenied'));
        } else {
          setError(t('screen-recorder.startError'));
        }
      }
    }
  }, [t, startTimer, stopTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setState('paused');
      stopTimer();
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setState('recording');
      startTimer();
    }
  }, [startTimer]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
    }
  }, []);

  const downloadRecording = useCallback(() => {
    if (recordedUrl) {
      const a = document.createElement('a');
      a.href = recordedUrl;
      a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      a.click();
    }
  }, [recordedUrl]);

  const resetRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedUrl(null);
    setState('idle');
    setDuration(0);
    setError('');
  }, [recordedUrl]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 检查浏览器支持
  const isSupported = typeof navigator !== 'undefined' && 
    'mediaDevices' in navigator && 
    'getDisplayMedia' in navigator.mediaDevices;

  if (!isSupported) {
    return (
      <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-yellow-700 dark:text-yellow-400">
          {t('screen-recorder.notSupported')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 控制区域 */}
      <div className="flex flex-col items-center gap-4">
        {/* 计时器 */}
        <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
          {formatTime(duration)}
        </div>

        {/* 状态指示 */}
        {state === 'recording' && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
            {t('screen-recorder.recording')}
          </div>
        )}
        {state === 'paused' && (
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <span className="w-3 h-3 bg-yellow-600 rounded-full" />
            {t('screen-recorder.paused')}
          </div>
        )}

        {/* 控制按钮 */}
        <div className="flex gap-3">
          {state === 'idle' && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <span className="w-4 h-4 bg-white rounded-full" />
              {t('screen-recorder.start')}
            </button>
          )}

          {state === 'recording' && (
            <>
              <button
                onClick={pauseRecording}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                ⏸️ {t('screen-recorder.pause')}
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ⏹️ {t('screen-recorder.stop')}
              </button>
            </>
          )}

          {state === 'paused' && (
            <>
              <button
                onClick={resumeRecording}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ▶️ {t('screen-recorder.resume')}
              </button>
              <button
                onClick={stopRecording}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ⏹️ {t('screen-recorder.stop')}
              </button>
            </>
          )}

          {state === 'stopped' && (
            <button
              onClick={resetRecording}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 {t('screen-recorder.newRecording')}
            </button>
          )}
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* 录制结果 */}
      {recordedUrl && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('screen-recorder.preview')}
          </h3>
          
          <video
            src={recordedUrl}
            controls
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
          />

          <button
            onClick={downloadRecording}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            ⬇️ {t('screen-recorder.download')}
          </button>
        </div>
      )}

      {/* 使用说明 */}
      {state === 'idle' && !recordedUrl && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
            {t('screen-recorder.instructions')}
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
            <li>{t('screen-recorder.instruction1')}</li>
            <li>{t('screen-recorder.instruction2')}</li>
            <li>{t('screen-recorder.instruction3')}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
