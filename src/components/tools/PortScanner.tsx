'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface PortInfo {
  port: number;
  service: string;
  descKey: string;
}

const commonPorts: PortInfo[] = [
  { port: 21, service: 'FTP', descKey: 'descFtp' },
  { port: 22, service: 'SSH', descKey: 'descSsh' },
  { port: 23, service: 'Telnet', descKey: 'descTelnet' },
  { port: 25, service: 'SMTP', descKey: 'descSmtp' },
  { port: 53, service: 'DNS', descKey: 'descDns' },
  { port: 80, service: 'HTTP', descKey: 'descHttp' },
  { port: 110, service: 'POP3', descKey: 'descPop3' },
  { port: 143, service: 'IMAP', descKey: 'descImap' },
  { port: 443, service: 'HTTPS', descKey: 'descHttps' },
  { port: 465, service: 'SMTPS', descKey: 'descSmtps' },
  { port: 587, service: 'SMTP', descKey: 'descSmtpSubmission' },
  { port: 993, service: 'IMAPS', descKey: 'descImaps' },
  { port: 995, service: 'POP3S', descKey: 'descPop3s' },
  { port: 3306, service: 'MySQL', descKey: 'descMysql' },
  { port: 3389, service: 'RDP', descKey: 'descRdp' },
  { port: 5432, service: 'PostgreSQL', descKey: 'descPostgresql' },
  { port: 5900, service: 'VNC', descKey: 'descVnc' },
  { port: 6379, service: 'Redis', descKey: 'descRedis' },
  { port: 8080, service: 'HTTP-Alt', descKey: 'descHttpAlt' },
  { port: 8443, service: 'HTTPS-Alt', descKey: 'descHttpsAlt' },
  { port: 27017, service: 'MongoDB', descKey: 'descMongodb' },
];

export default function PortScanner() {
  const t = useTranslations('tools.port-scanner');
  const [searchTerm, setSearchTerm] = useState('');
  const [customPort, setCustomPort] = useState('');

  const filteredPorts = commonPorts.filter(p => 
    p.port.toString().includes(searchTerm) ||
    p.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t(p.descKey).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPortInfo = (port: number): PortInfo | null => {
    return commonPorts.find(p => p.port === port) || null;
  };

  const customPortInfo = customPort ? getPortInfo(parseInt(customPort)) : null;

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
        <p className="text-sm">
          🔍 {t('note')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('searchPorts')}</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">{t('lookupPort')}</label>
          <input
            type="number"
            value={customPort}
            onChange={(e) => setCustomPort(e.target.value)}
            placeholder={t('portPlaceholder')}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
            min="1"
            max="65535"
          />
        </div>
      </div>

      {customPort && (
        <div className="p-4 bg-gray-800 rounded-lg">
          <div className="text-lg font-semibold mb-2">{t('port')} {customPort}</div>
          {customPortInfo ? (
            <div className="space-y-2">
              <div><span className="text-gray-300">{t('service')}:</span> {customPortInfo.service}</div>
              <div><span className="text-gray-300">{t('descriptionLabel')}:</span> {t(customPortInfo.descKey)}</div>
            </div>
          ) : (
            <div className="text-gray-300">
              {parseInt(customPort) >= 1 && parseInt(customPort) <= 65535
                ? t('unknownPort')
                : t('invalidPort')}
            </div>
          )}
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">{t('commonPorts')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4">{t('port')}</th>
                <th className="text-left py-3 px-4">{t('service')}</th>
                <th className="text-left py-3 px-4">{t('descriptionLabel')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredPorts.map((port) => (
                <tr key={port.port} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-3 px-4 font-mono text-blue-400">{port.port}</td>
                  <td className="py-3 px-4 font-semibold">{port.service}</td>
                  <td className="py-3 px-4 text-gray-300">{t(port.descKey)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPorts.length === 0 && (
          <div className="text-center py-8 text-gray-300">
            {t('noResults')}
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-800/50 rounded-lg">
        <h4 className="font-semibold mb-2">{t('portRanges')}</h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-400">0-1023:</span>
            <span className="text-gray-300 ml-2">{t('wellKnown')}</span>
          </div>
          <div>
            <span className="text-blue-400">1024-49151:</span>
            <span className="text-gray-300 ml-2">{t('registered')}</span>
          </div>
          <div>
            <span className="text-blue-400">49152-65535:</span>
            <span className="text-gray-300 ml-2">{t('dynamic')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
