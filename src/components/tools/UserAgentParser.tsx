'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface ParsedUA {
  browser: { name: string; version: string };
  os: { name: string; version: string };
  device: { type: string; vendor: string; model: string };
  engine: { name: string; version: string };
}

export function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: { name: 'Unknown', version: '' },
    os: { name: 'Unknown', version: '' },
    device: { type: 'Desktop', vendor: '', model: '' },
    engine: { name: 'Unknown', version: '' },
  };

  if (!ua) return result;

  // Browser detection
  if (/Edg\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Edge', version: RegExp.$1 };
  } else if (/OPR\/(\d+[.\d]*)/.test(ua) || /Opera\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Opera', version: RegExp.$1 };
  } else if (/Chrome\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Chrome', version: RegExp.$1 };
  } else if (/Firefox\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Firefox', version: RegExp.$1 };
  } else if (/Safari\/(\d+[.\d]*)/.test(ua) && /Version\/(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Safari', version: RegExp.$1 };
  } else if (/MSIE (\d+[.\d]*)/.test(ua) || /Trident.*rv:(\d+[.\d]*)/.test(ua)) {
    result.browser = { name: 'Internet Explorer', version: RegExp.$1 };
  }

  // OS detection
  if (/Windows NT (\d+[.\d]*)/.test(ua)) {
    const version = RegExp.$1;
    const winVersions: Record<string, string> = {
      '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista', '5.1': 'XP'
    };
    result.os = { name: 'Windows', version: winVersions[version] || version };
  } else if (/Mac OS X (\d+[_.\d]*)/.test(ua)) {
    result.os = { name: 'macOS', version: RegExp.$1.replace(/_/g, '.') };
  } else if (/Android (\d+[.\d]*)/.test(ua)) {
    result.os = { name: 'Android', version: RegExp.$1 };
    result.device.type = 'Mobile';
  } else if (/iPhone|iPad|iPod/.test(ua)) {
    result.os.name = 'iOS';
    if (/OS (\d+[_\d]*)/.test(ua)) {
      result.os.version = RegExp.$1.replace(/_/g, '.');
    }
    result.device.type = /iPad/.test(ua) ? 'Tablet' : 'Mobile';
    result.device.vendor = 'Apple';
  } else if (/Linux/.test(ua)) {
    result.os = { name: 'Linux', version: '' };
  }

  // Engine detection
  if (/AppleWebKit\/(\d+[.\d]*)/.test(ua)) {
    result.engine = { name: 'WebKit', version: RegExp.$1 };
  } else if (/Gecko\/(\d+)/.test(ua)) {
    result.engine = { name: 'Gecko', version: RegExp.$1 };
  } else if (/Trident\/(\d+[.\d]*)/.test(ua)) {
    result.engine = { name: 'Trident', version: RegExp.$1 };
  }

  // Device detection
  if (/Mobile|Android/.test(ua) && !/iPad/.test(ua)) {
    result.device.type = 'Mobile';
  } else if (/Tablet|iPad/.test(ua)) {
    result.device.type = 'Tablet';
  }

  return result;
}

export default function UserAgentParser() {
  const t = useTranslations('tools');
  const [userAgent, setUserAgent] = useState('');
  const [parsed, setParsed] = useState<ParsedUA | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  useEffect(() => {
    if (userAgent) {
      setParsed(parseUserAgent(userAgent));
    } else {
      setParsed(null);
    }
  }, [userAgent]);

  const useCurrentUA = () => {
    if (typeof navigator !== 'undefined') {
      setUserAgent(navigator.userAgent);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">{t('uaParser.userAgent')}</label>
        <div className="flex gap-2">
          <textarea
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            placeholder={t('uaParser.placeholder')}
            className="flex-1 h-24 p-3 bg-gray-900 border border-gray-700 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={useCurrentUA}
          className="mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
        >
          {t('uaParser.useCurrent')}
        </button>
      </div>

      {parsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="text-sm text-gray-300 mb-2">{t('uaParser.browser')}</div>
            <div className="text-lg font-medium">{parsed.browser.name}</div>
            {parsed.browser.version && (
              <div className="text-sm text-gray-300">{t('uaParser.version')}: {parsed.browser.version}</div>
            )}
          </div>

          <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="text-sm text-gray-300 mb-2">{t('uaParser.os')}</div>
            <div className="text-lg font-medium">{parsed.os.name}</div>
            {parsed.os.version && (
              <div className="text-sm text-gray-300">{t('uaParser.version')}: {parsed.os.version}</div>
            )}
          </div>

          <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="text-sm text-gray-300 mb-2">{t('uaParser.device')}</div>
            <div className="text-lg font-medium">{parsed.device.type}</div>
            {parsed.device.vendor && (
              <div className="text-sm text-gray-300">{parsed.device.vendor} {parsed.device.model}</div>
            )}
          </div>

          <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
            <div className="text-sm text-gray-300 mb-2">{t('uaParser.engine')}</div>
            <div className="text-lg font-medium">{parsed.engine.name}</div>
            {parsed.engine.version && (
              <div className="text-sm text-gray-300">{t('uaParser.version')}: {parsed.engine.version}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
