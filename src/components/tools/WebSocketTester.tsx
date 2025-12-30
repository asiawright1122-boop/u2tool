'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Message {
  id: number;
  type: 'sent' | 'received' | 'system';
  content: string;
  timestamp: Date;
}

export default function WebSocketTester() {
  const t = useTranslations('tools.websocket-tester');
  const [url, setUrl] = useState('wss://echo.websocket.org');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messageIdRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const addMessage = useCallback((type: Message['type'], content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: messageIdRef.current++,
        type,
        content,
        timestamp: new Date(),
      },
    ]);
  }, []);

  const connect = useCallback(() => {
    if (!url.trim()) return;

    setIsConnecting(true);
    addMessage('system', t('connecting', { url }));

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        addMessage('system', t('connected'));
      };

      ws.onmessage = (event) => {
        addMessage('received', event.data);
      };

      ws.onerror = () => {
        addMessage('system', t('errorConnection'));
        setIsConnecting(false);
      };

      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        addMessage('system', t('disconnected', { code: event.code.toString() }));
      };

      wsRef.current = ws;
    } catch {
      addMessage('system', t('errorInvalidUrl'));
      setIsConnecting(false);
    }
  }, [url, addMessage, t]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(() => {
    if (!message.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      return;
    }

    wsRef.current.send(message);
    addMessage('sent', message);
    setMessage('');
  }, [message, addMessage]);

  const clearMessages = () => {
    setMessages([]);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const sampleUrls = [
    { label: 'Echo Server', url: 'wss://echo.websocket.org' },
    { label: 'Binance BTC/USDT', url: 'wss://stream.binance.com:9443/ws/btcusdt@trade' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {t('serverUrl')}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="wss://example.com/socket"
              disabled={isConnected}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
            />
          </div>
          <div className="flex items-end gap-2">
            {!isConnected ? (
              <button
                onClick={connect}
                disabled={isConnecting || !url.trim()}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isConnecting ? t('connecting_btn') : t('connect')}
              </button>
            ) : (
              <button
                onClick={disconnect}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                {t('disconnect')}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{t('quickConnect')}:</span>
          {sampleUrls.map((sample) => (
            <button
              key={sample.url}
              onClick={() => setUrl(sample.url)}
              disabled={isConnected}
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
          }`}
        />
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {isConnected ? t('statusConnected') : isConnecting ? t('statusConnecting') : t('statusDisconnected')}
        </span>
      </div>

      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
          <span className="font-medium text-gray-700 dark:text-gray-300">{t('messages')}</span>
          <button
            onClick={clearMessages}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-200"
          >
            {t('clear')}
          </button>
        </div>
        <div className="h-80 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-900">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-300 py-8">
              {t('noMessages')}
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 text-sm ${
                  msg.type === 'sent'
                    ? 'justify-end'
                    : msg.type === 'received'
                    ? 'justify-start'
                    : 'justify-center'
                }`}
              >
                {msg.type === 'system' ? (
                  <span className="text-gray-500 dark:text-gray-300 italic">
                    [{formatTime(msg.timestamp)}] {msg.content}
                  </span>
                ) : (
                  <div
                    className={`max-w-[80%] p-2 rounded-lg ${
                      msg.type === 'sent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="break-all font-mono text-xs">{msg.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        msg.type === 'sent' ? 'text-blue-200' : 'text-gray-500 dark:text-gray-300'
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder={t('messagePlaceholder')}
          disabled={!isConnected}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !message.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {t('send')}
        </button>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
        <h3 className="font-medium text-yellow-700 dark:text-yellow-300 mb-2">{t('note')}</h3>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">{t('noteText')}</p>
      </div>
    </div>
  );
}
