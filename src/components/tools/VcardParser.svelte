<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['vcard-parser'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.vcard-parser.${key}`;
  }
  function tg(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { parseVCard, type VCardContact, type VCardParseResult } from '@/lib/vcard-parser';

  let input = $state('');

  let contacts = $state([]);

  let error = $state('');

  let fileInputRef = $state(null);

  function parse() {
    if (!input.trim()) {
      contacts = [];
      error = '';
      return;
    }

    try {
      const result = parseVCard(input);
      contacts = result.contacts;
      error = '';
    } catch (e) {
      error = (e as Error).message;
      contacts = [];
    }
  }

  // Functions
  function handleFileUpload(e: Event) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      input = content;
    };
    reader.readAsText(file);
  }
  function exportToJSON() {
    const json = JSON.stringify(contacts, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.json';
    a.click();
    URL.revokeObjectURL(url);
  }

</script>


    <div class="space-y-4">
      <div class="flex flex-wrap gap-2">
        <button onclick={parse} class="btn-primary">
          {t('parse')}
        </button>
        <button
          onclick={() => fileInputRef?.click()}
          class="btn-secondary"
        >
          {t('uploadFile')}
        </button>
        <input
          bind:this={fileInputRef}
          type="file"
          accept=".vcf,.vcard"
          onchange={handleFileUpload}
          class="hidden"
        />
        {#if contacts.length > 0}
<button onclick={exportToJSON} class="btn-secondary">
            {t('exportJSON')}
          </button>
{/if}
        <button onclick={() => { input = ''; contacts = []; error = ''; }} class="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      <div>
        <label class="block text-sm text-gray-600 dark:text-gray-300 mb-2">{t('vcardContent')}</label>
        <textarea
          bind:value={input}
          class="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
          placeholder={t('inputPlaceholder')}></textarea>
      </div>

      {#if error}
<div class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg p-3 text-sm">
          {error}
        </div>
{/if}

      {#if contacts.length > 0}
<div class="space-y-2">
          <h3 class="font-medium text-gray-700 dark:text-gray-300">
            {t('foundContacts')}: {contacts.length}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each contacts as contact, index (index)}
<div  class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 dark:text-white mb-2">
                  {contact.fullName || t('unnamed')}
                </h4>
                {#if contact.emails}
contact.emails.length > 0 && (
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    📧 {contact.emails[0].address}
                  </p>
                )
{/if}
                {#if contact.phones}
contact.phones.length > 0 && (
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    📱 {contact.phones[0].number}
                  </p>
                )
{/if}
                {#if contact.organization}
<p class="text-sm text-gray-600 dark:text-gray-300">
                    🏢 {contact.organization}
                  </p>
{/if}
                {#if contact.title}
<p class="text-sm text-gray-600 dark:text-gray-300">
                    💼 {contact.title}
                  </p>
{/if}
                {#if contact.addresses}
contact.addresses.length > 0 && (
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    📍 {contact.addresses[0].formatted}
                  </p>
                )
{/if}
                {#if contact.urls}
contact.urls.length > 0 && (
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    🔗 {contact.urls[0]}
                  </p>
                )
{/if}
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
