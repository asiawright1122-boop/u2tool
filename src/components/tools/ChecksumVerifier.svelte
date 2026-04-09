<script lang="ts">
  import { calculateHash, calculateMD5 } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['checksum-verifier'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.checksum-verifier.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ChecksumResult {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

  let file = $state(null);

  let checksums = $state(null);

  let expectedChecksum = $state('');

  let isCalculating = $state(false);

  let verificationResult = $state(null);

  let copied = $state(null);

  async function calculateChecksums() {
    if (!file) return;
    
    isCalculating = true;
    try {
      const [md5, sha1, sha256, sha512] = await Promise.all([
        calculateMD5(file),
        calculateHash(file, 'SHA-1'),
        calculateHash(file, 'SHA-256'),
        calculateHash(file, 'SHA-512'),
      ]);
      
      checksums = { md5, sha1, sha256, sha512 };
      
      // Auto-verify if expected checksum is provided
      if (expectedChecksum) {
        verifyChecksum({ md5, sha1, sha256, sha512 });
      }
    } catch (error) {
      console.error('Error calculating checksums:', error);
    } finally {
      isCalculating = false;
    }
  }

  // Functions
  async function handleFileChange(e: Event) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Check file size (max 100MB)
    if (selectedFile.size > 100 * 1024 * 1024) {
      alert(t('fileTooLarge'));
      return;
    }
    
    file = selectedFile;
    checksums = null;
    verificationResult = null;
  }
  function verifyChecksum(results: ChecksumResult) {
    const normalized = expectedChecksum.toLowerCase().trim();
    if (!normalized) {
      verificationResult = null;
      return;
    }
    
    // Check against each algorithm
    if (normalized === results.md5.toLowerCase()) {
      verificationResult = { match: true, algorithm: 'MD5' };
    } else if (normalized === results.sha1.toLowerCase()) {
      verificationResult = { match: true, algorithm: 'SHA-1' };
    } else if (normalized === results.sha256.toLowerCase()) {
      verificationResult = { match: true, algorithm: 'SHA-256' };
    } else if (normalized === results.sha512.toLowerCase()) {
      verificationResult = { match: true, algorithm: 'SHA-512' };
    } else {
      verificationResult = { match: false, algorithm: null };
    }
  }
  function handleExpectedChecksumChange(value: string) {
    expectedChecksum = value;
    if (checksums) {
      const normalized = value.toLowerCase().trim();
      if (!normalized) {
        verificationResult = null;
        return;
      }
      
      if (normalized === checksums.md5.toLowerCase()) {
        verificationResult = { match: true, algorithm: 'MD5' };
      } else if (normalized === checksums.sha1.toLowerCase()) {
        verificationResult = { match: true, algorithm: 'SHA-1' };
      } else if (normalized === checksums.sha256.toLowerCase()) {
        verificationResult = { match: true, algorithm: 'SHA-256' };
      } else if (normalized === checksums.sha512.toLowerCase()) {
        verificationResult = { match: true, algorithm: 'SHA-512' };
      } else {
        verificationResult = { match: false, algorithm: null };
      }
    }
  }
  async function copyToClipboard(value: string, algorithm: string) {
    await navigator.clipboard.writeText(value);
    copied = algorithm;
    setTimeout(() => copied = null, 2000);
  }
  function clearAll() {
    file = null;
    checksums = null;
    expectedChecksum = '';
    verificationResult = null;
  }
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

</script>


    <div class="space-y-6">
      <!-- File Upload -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectFile')}
        </label>
        <div class="flex items-center justify-center w-full">
          <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span class="font-semibold">{t('clickToUpload')}</span>
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">{t('maxSize')}</p>
            </div>
            <input type="file" class="hidden" onchange={handleFileChange} />
          </label>
        </div>
      </div>

      <!-- File Info -->
      {#if file}
<div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div class="flex items-center gap-3">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <div>
              <p class="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>
{/if}

      <!-- Expected Checksum -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('expectedChecksum')}
        </label>
        <input
          type="text"
          value={expectedChecksum}
          onchange={(e) => handleExpectedChecksumChange(e.target.value)}
          placeholder={t('expectedChecksumPlaceholder')}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={calculateChecksums}
          disabled={!file || isCalculating}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-lg font-medium text-white"
        >
          {isCalculating ? t('calculating') : t('calculate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Verification Result -->
      {#if verificationResult}
<div class={`p-4 rounded-lg ${
          verificationResult.match 
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <div class="flex items-center gap-2">
            {#if verificationResult.match}

                <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="font-medium text-green-700 dark:text-green-300">
                  {t('match')} ({verificationResult.algorithm})
                </span>
              
{:else}

                <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width={2} d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="font-medium text-red-700 dark:text-red-300">
                  {t('noMatch')}
                </span>
              
{/if}
          </div>
        </div>
{/if}

      <!-- Checksums -->
      {#if checksums}
<div class="space-y-3">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">{t('calculatedChecksums')}</h3>
          
          {#each [
            { label: 'MD5', value: checksums.md5, note: t('md5Note') },
            { label: 'SHA-1', value: checksums.sha1 },
            { label: 'SHA-256', value: checksums.sha256 },
            { label: 'SHA-512', value: checksums.sha512 },
          ] as { label, value, note } (label)}
<div  class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex justify-between items-center mb-1">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                <button
                  onclick={() => copyToClipboard(value, label)}
                  class="px-2 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs text-gray-900 dark:text-gray-100"
                >
                  {copied === label ? tCommon('copied') : tCommon('copy')}
                </button>
              </div>
              <code class="block text-xs font-mono text-gray-600 dark:text-gray-400 break-all">
                {value}
              </code>
              {#if note}
<p class="mt-1 text-xs text-yellow-600 dark:text-yellow-400">{note}</p>
{/if}
            </div>
{/each}
        </div>
{/if}
    </div>
  
