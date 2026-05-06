<script lang="ts">
  import { generateBackupScript, generateCrontab } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['database-backup-scheduler'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.database-backup-scheduler.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
interface BackupConfig {
  database: 'postgresql' | 'mysql' | 'mongodb';
  host: string;
  dbName: string;
  username: string;
  schedule: 'hourly' | 'daily' | 'weekly' | 'monthly';
  retention: number;
  compression: boolean;
  outputPath: string;
}

  let config = $state<BackupConfig>({
    database: 'postgresql',
    host: 'localhost',
    dbName: 'mydb',
    username: 'dbuser',
    schedule: 'daily',
    retention: 7,
    compression: true,
    outputPath: '/var/backups/database',
  });

  let copied = $state<string | null>(null);

  function updateConfig<Key extends keyof BackupConfig>(key: Key, value: BackupConfig[Key]) {
    config = ({ ...config, [key]: value });
  }

  let script = $derived(generateBackupScript(config));

  let crontab = $derived(generateCrontab(config));

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    copied = key;
    setTimeout(() => copied = null, 2000);
  }

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database')}</label>
          <select value={config.database} onchange={(e) => updateConfig('database', (e.currentTarget as HTMLSelectElement).value as BackupConfig['database'])}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-host">{t('host')}</label>
          <input type="text" id="db-host" name="host" bind:value={config.host}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-name">{t('databaseName')}</label>
          <input type="text" id="db-name" name="dbName" bind:value={config.dbName}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-username">{t('username')}</label>
          <input type="text" id="db-username" name="username" bind:value={config.username}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-schedule">{t('schedule')}</label>
          <select value={config.schedule} onchange={(e) => updateConfig('schedule', (e.currentTarget as HTMLSelectElement).value as BackupConfig['schedule'])}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="hourly">{t('hourly')}</option>
            <option value="daily">{t('daily')}</option>
            <option value="weekly">{t('weekly')}</option>
            <option value="monthly">{t('monthly')}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-retention">{t('retention')}</label>
          <input type="number" id="db-retention" name="retention" bind:value={config.retention} min={1}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div class="col-span-2">
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-output-path">{t('outputPath')}</label>
          <input type="text" id="db-output-path" name="outputPath" bind:value={config.outputPath}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
      </div>

      <label class="flex items-center gap-2">
        <input type="checkbox" id="db-compression" name="compression" checked={config.compression} onchange={(e) => updateConfig('compression', (e.currentTarget as HTMLInputElement).checked)} class="rounded" />
        <span class="text-sm text-gray-700 dark:text-gray-300">{t('enableCompression')}</span>
      </label>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">{t('backupScript')}</label>
          <button onclick={() => handleCopy(script, 'script')} class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400">
            {copied === 'script' ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-xs font-mono text-gray-800 dark:text-gray-200 max-h-64">
          {script}
        </pre>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="tool-label">{t('crontabEntry')}</label>
          <button onclick={() => handleCopy(crontab, 'cron')} class="text-sm text-amber-600 hover:text-amber-700 dark:text-amber-400">
            {copied === 'cron' ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {crontab}
        </pre>
      </div>
    </div>
  
