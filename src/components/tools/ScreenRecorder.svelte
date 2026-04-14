<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

  let state = $state('idle' as RecordingState);

  let recordedUrl = $state(null);

  let duration = $state(0);

  let error = $state('');

  let mediaRecorderRef = $state(null);

  let chunksRef = $state([]);

  let timerRef = $state(null);

  let streamRef = $state(null);

  function startTimer() {
    timerRef = setInterval(() => {
      duration = duration + 1;
    }, 1000);
  }

  function stopTimer() {
    if (timerRef) {
      clearInterval(timerRef);
      timerRef = null;
    }
  }

  async function startRecording() {
    error = '';
    recordedUrl = null;
    duration = 0;
    chunksRef = [];

    try {
      // 请求屏幕共享权限
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
        },
        audio: true,
      });

      streamRef = stream;

      // 创建 MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        recordedUrl = url;
        state = 'stopped';
        stopTimer();
      };

      // 监听用户停止共享
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorderRef?.state === 'recording') {
          mediaRecorderRef.stop();
        }
      };

      mediaRecorderRef = mediaRecorder;
      mediaRecorder.start(1000); // 每秒收集一次数据
      state = 'recording';
      startTimer();
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          error = t('screen-recorder.permissionDenied');
        } else {
          error = t('screen-recorder.startError');
        }
      }
    }
  }

  function pauseRecording() {
    if (mediaRecorderRef?.state === 'recording') {
      mediaRecorderRef.pause();
      state = 'paused';
      stopTimer();
    }
  }

  function resumeRecording() {
    if (mediaRecorderRef?.state === 'paused') {
      mediaRecorderRef.resume();
      state = 'recording';
      startTimer();
    }
  }

  function stopRecording() {
    if (mediaRecorderRef && mediaRecorderRef.state !== 'inactive') {
      mediaRecorderRef.stop();
      streamRef?.getTracks().forEach(track => track.stop());
    }
  }

  function downloadRecording() {
    if (recordedUrl) {
      const a = document.createElement('a');
      a.href = recordedUrl;
      a.download = `screen-recording-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
      a.click();
    }
  }

  function resetRecording() {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    recordedUrl = null;
    state = 'idle';
    duration = 0;
    error = '';
  }

  // Functions
  function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  const isSupported = typeof navigator !== 'undefined' && 
    'mediaDevices' in navigator && 
    'getDisplayMedia' in navigator.mediaDevices;

</script>


    <div class="space-y-6">
      <!-- 控制区域 -->
      <div class="flex flex-col items-center gap-4">
        <!-- 计时器 -->
        <div class="text-4xl font-mono font-bold text-gray-900 dark:text-white">
          {formatTime(duration)}
        </div>

        <!-- 状态指示 -->
        {#if state === 'recording'}
<div class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <span class="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></span>
            {t('screen-recorder.recording')}
          </div>
{/if}
        {#if state === 'paused'}
<div class="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <span class="w-3 h-3 bg-yellow-600 rounded-full"></span>
            {t('screen-recorder.paused')}
          </div>
{/if}

        <!-- 控制按钮 -->
        <div class="flex gap-3">
          {#if state === 'idle'}
<button
              onclick={startRecording}
              class="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <span class="w-4 h-4 bg-white rounded-full"></span>
              {t('screen-recorder.start')}
            </button>
{/if}

          {#if state === 'recording'}
<div>

              <button
                onclick={pauseRecording}
                class="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                ⏸ {t('screen-recorder.pause')}
              </button>
              <button
                onclick={stopRecording}
                class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ⏹ {t('screen-recorder.stop')}
              </button>
            
</div>
{/if}

          {#if state === 'paused'}
<div>

              <button
                onclick={resumeRecording}
                class="px-6 py-3 btn-success rounded-lg hover:bg-green-700 transition-colors"
              >
                ▶ {t('screen-recorder.resume')}
              </button>
              <button
                onclick={stopRecording}
                class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ⏹ {t('screen-recorder.stop')}
              </button>
            
</div>
{/if}

          {#if state === 'stopped'}
<button
              onclick={resetRecording}
              class="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg> {t('screen-recorder.newRecording')}
            </button>
{/if}
        </div>
      </div>

      <!-- 错误提示 -->
      {#if error}
<div class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
{/if}

      <!-- 录制结果 -->
      {#if recordedUrl}
<div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {t('screen-recorder.preview')}
          </h3>
          
          <video
            src={recordedUrl}
            controls
            class="w-full rounded-lg border border-gray-200 dark:border-gray-700"></video>

          <button
            onclick={downloadRecording}
            class="w-full px-6 py-3 btn-success rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            ⬇ {t('screen-recorder.download')}
          </button>
        </div>
{/if}

      <!-- 使用说明 -->
      {#if state === 'idle'}
{#if !recordedUrl}
        <div class="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <h4 class="font-medium text-amber-900 dark:text-amber-300 mb-2">
            {t('screen-recorder.instructions')}
          </h4>
          <ul class="text-sm text-amber-700 dark:text-amber-400 space-y-1 list-disc list-inside">
            <li>{t('screen-recorder.instruction1')}</li>
            <li>{t('screen-recorder.instruction2')}</li>
            <li>{t('screen-recorder.instruction3')}</li>
          </ul>
        </div>
      {/if}
{/if}
    </div>
  
