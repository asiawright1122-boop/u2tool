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
{#if contact.emails.length > 0}
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> {contact.emails[0].address}
                  </p>
                {/if}
{/if}
                {#if contact.phones}
{#if contact.phones.length > 0}
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg> {contact.phones[0].number}
                  </p>
                {/if}
{/if}
                {#if contact.organization}
<p class="text-sm text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg> {contact.organization}
                  </p>
{/if}
                {#if contact.title}
<p class="text-sm text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg> {contact.title}
                  </p>
{/if}
                {#if contact.addresses}
{#if contact.addresses.length > 0}
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg> {contact.addresses[0].formatted}
                  </p>
                {/if}
{/if}
                {#if contact.urls}
{#if contact.urls.length > 0}
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> {contact.urls[0]}
                  </p>
                {/if}
{/if}
              </div>
{/each}
          </div>
        </div>
{/if}
    </div>
  
