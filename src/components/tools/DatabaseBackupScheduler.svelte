<script lang="ts">
  import { K, generateBackupScript, generateCrontab } from '@/lib/tool-stubs';

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
  schedule: string;
  retention: number;
  compression: boolean;
  outputPath: string;
}

  let config = $state({
    database: 'postgresql',
    host: 'localhost',
    dbName: 'mydb',
    username: 'dbuser',
    schedule: 'daily',
    retention: 7,
    compression: true,
    outputPath: '/var/backups/database',
  });

  let copied = $state(null);

  function updateConfig(key: K, value: BackupConfig[K]) {
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
          <select value={config.database} onchange={(e) => updateConfig('database', e.target.value as BackupConfig['database'])}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-host">{t('host')}</label>
          <input type="text" id="db-host" name="host" value={config.host} onchange={(e) => updateConfig('host', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-name">{t('databaseName')}</label>
          <input type="text" id="db-name" name="dbName" value={config.dbName} onchange={(e) => updateConfig('dbName', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-username">{t('username')}</label>
          <input type="text" id="db-username" name="username" value={config.username} onchange={(e) => updateConfig('username', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-retention">{t('retention')}</label>
          <input type="number" id="db-retention" name="retention" value={config.retention} onchange={(e) => updateConfig('retention', parseInt(e.target.value) || 7)} min={1}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div class="col-span-2">
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1" for="db-output-path">{t('outputPath')}</label>
          <input type="text" id="db-output-path" name="outputPath" value={config.outputPath} onchange={(e) => updateConfig('outputPath', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
      </div>

      <label class="flex items-center gap-2">
        <input type="checkbox" id="db-compression" name="compression" checked={config.compression} onchange={(e) => updateConfig('compression', e.target.checked)} class="rounded" />
        <span class="text-sm text-gray-700 dark:text-gray-300">{t('enableCompression')}</span>
      </label>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('backupScript')}</label>
          <button onclick={() => handleCopy(script, 'script')} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied === 'script' ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-xs font-mono text-gray-800 dark:text-gray-200 max-h-64">
          {script}
        </pre>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('crontabEntry')}</label>
          <button onclick={() => handleCopy(crontab, 'cron')} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied === 'cron' ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {crontab}
        </pre>
      </div>
    </div>
  
