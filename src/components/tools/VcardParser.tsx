'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { parseVCard, type VCardContact, type VCardParseResult } from '@/lib/vcard-parser';

export default function VcardParser() {
  const t = useTranslations('tools.vcard-parser');
  const tg = useTranslations('tools');
  const [input, setInput] = useState('');
  const [contacts, setContacts] = useState<VCardContact[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parse = useCallback(() => {
    if (!input.trim()) {
      setContacts([]);
      setError('');
      return;
    }

    try {
      const result = parseVCard(input);
      setContacts(result.contacts);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setContacts([]);
    }
  }, [input]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(contacts, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button onClick={parse} className="btn-primary">
          {t('parse')}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-secondary"
        >
          {t('uploadFile')}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".vcf,.vcard"
          onChange={handleFileUpload}
          className="hidden"
        />
        {contacts.length > 0 && (
          <button onClick={exportToJSON} className="btn-secondary">
            {t('exportJSON')}
          </button>
        )}
        <button onClick={() => { setInput(''); setContacts([]); setError(''); }} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div>
        <label className="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('vcardContent')}</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          placeholder={t('inputPlaceholder')}
        />
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {contacts.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            {t('foundContacts')}: {contacts.length}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {contact.fullName || t('unnamed')}
                </h4>
                {contact.emails && contact.emails.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    📧 {contact.emails[0].address}
                  </p>
                )}
                {contact.phones && contact.phones.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    📱 {contact.phones[0].number}
                  </p>
                )}
                {contact.organization && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    🏢 {contact.organization}
                  </p>
                )}
                {contact.title && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    💼 {contact.title}
                  </p>
                )}
                {contact.addresses && contact.addresses.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    📍 {contact.addresses[0].formatted}
                  </p>
                )}
                {contact.urls && contact.urls.length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    🔗 {contact.urls[0]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
