<script lang="ts">
  import { onDestroy } from 'svelte';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['websocket-tester'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.websocket-tester.${key}`;
  }

  // Types
  interface Message {
  id: number;
  type: 'sent' | 'received' | 'system';
  content: string;
  timestamp: Date;
}

  let url = $state('wss://echo.websocket.org');

  let message = $state('');

  let messages = $state([]);

  let isConnected = $state(false);

  let isConnecting = $state(false);

  let wsRef = $state(null);

  let messageIdRef = $state(0);

  let messagesEndRef = $state(null);

  function addMessage(type: Message['type'], content: string) {
    messages = [
      ...messages,
      {
        id: messageIdRef++,
        type,
        content,
        timestamp: new Date(),
      },
    ];
  }

  function connect() {
    if (!url.trim()) return;

    isConnecting = true;
    addMessage('system', t('connecting', { url }));

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        isConnected = true;
        isConnecting = false;
        addMessage('system', t('connected'));
      };

      ws.onmessage = (event) => {
        addMessage('received', event.data);
      };

      ws.onerror = () => {
        addMessage('system', t('errorConnection'));
        isConnecting = false;
      };

      ws.onclose = (event) => {
        isConnected = false;
        isConnecting = false;
        addMessage('system', t('disconnected', { code: event.code.toString() }));
      };

      wsRef = ws;
    } catch {
      addMessage('system', t('errorInvalidUrl'));
      isConnecting = false;
    }
  }

  function disconnect() {
    if (wsRef) {
      wsRef.close();
      wsRef = null;
    }
  }

  function sendMessage() {
    if (!message.trim() || !wsRef || wsRef.readyState !== WebSocket.OPEN) {
      return;
    }

    wsRef.send(message);
    addMessage('sent', message);
    message = '';
  }

  $effect(() => {
    scrollToBottom();
  });  onDestroy(() => {
    if (wsRef) {
        wsRef.close();
      }
  });

  // Functions
  function scrollToBottom() {
    messagesEndRef?.scrollIntoView({ behavior: 'smooth' });
  }
  function clearMessages() {
    messages = [];
  }
  function formatTime(date: Date) {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
  const sampleUrls = [
    { label: 'Echo Server', url: 'wss://echo.websocket.org' },
    { label: 'Binance BTC/USDT', url: 'wss://stream.binance.com:9443/ws/btcusdt@trade' },
  ];

</script>


    <div class="space-y-6">
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {t('serverUrl')}
            </label>
            <input
              type="text"
              bind:value={url}
              placeholder="wss://example.com/socket"
              disabled={isConnected}
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
            />
          </div>
          <div class="flex items-end gap-2">
            {#if !isConnected}
<button
                onclick={connect}
                disabled={isConnecting || !url.trim()}
                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isConnecting ? t('connecting_btn') : t('connect')}
              </button>
{:else}
<button
                onclick={disconnect}
                class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('disconnect')}
              </button>
{/if}
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <span class="text-sm text-gray-600 dark:text-gray-300">{t('quickConnect')}:</span>
          {#each sampleUrls as sample (sample.url)}
<button 
              onclick={() => url = sample.url}
              disabled={isConnected}
              class="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {sample.label}
            </button>
{/each}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <div
          class={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
          }`}></div>
        <span class="text-sm text-gray-600 dark:text-gray-300">
          {isConnected ? t('statusConnected') : isConnecting ? t('statusConnecting') : t('statusDisconnected')}
        </span>
      </div>

      <div class="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div class="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
          <span class="font-medium text-gray-700 dark:text-gray-300">{t('messages')}</span>
          <button
            onclick={clearMessages}
            class="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
          >
            {t('clear')}
          </button>
        </div>
        <div class="h-80 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
          {#if messages.length === 0}
<div class="text-center text-gray-500 dark:text-gray-300 py-8">
              {t('noMessages')}
            </div>
{:else}
{#each messages as msg (msg.id)}
<div 
                class={`flex gap-2 text-sm ${
                  msg.type === 'sent'
                    ? 'justify-end'
                    : msg.type === 'received'
                    ? 'justify-start'
                    : 'justify-center'
                }`}
              >
                {#if msg.type === 'system'}
<span class="text-gray-500 dark:text-gray-300 italic">
                    [{formatTime(msg.timestamp)}] {msg.content}
                  </span>
{:else}
<div
                    class={`max-w-[80%] p-2 rounded-lg ${
                      msg.type === 'sent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div class="break-all font-mono text-xs">{msg.content}</div>
                    <div
                      class={`text-xs mt-1 ${
                        msg.type === 'sent' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-300'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
{/if}
              </div>
{/each}
{/if}
          <div bind:this={messagesEndRef}></div>
        </div>
      </div>

      <div class="flex gap-2">
        <input
          type="text"
          bind:value={message}
          onkeydown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t('messagePlaceholder')}
          disabled={!isConnected}
          class="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
        />
        <button
          onclick={sendMessage}
          disabled={!isConnected || !message.trim()}
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {t('send')}
        </button>
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
        <h3 class="font-medium text-yellow-700 dark:text-yellow-300 mb-2">{t('note')}</h3>
        <p class="text-sm text-yellow-600 dark:text-yellow-400">{t('noteText')}</p>
      </div>
    </div>
  
