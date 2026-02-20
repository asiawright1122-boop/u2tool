<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface ConnectionConfig {
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

  let config = $state({
    type: 'postgresql',
    host: 'localhost',
    port: '5432',
    database: 'mydb',
    username: 'user',
    password: 'password',
    ssl: false,
  });

  let copied = $state(null);

  function updateConfig(key: K, value: ConnectionConfig[K]) {
    {
    const newConfig = { ...config, [key]: value };
      if (key === 'type') {
        newConfig.port = DEFAULT_PORTS[value as string] || config.port;
      }
    config = newConfig;
  };
  }

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    copied = key;
    setTimeout(() => copied = null, 2000);
  }

  // Functions
  const connectionString = generateConnectionString(config);
  const codeSnippet = generateCodeSnippet(config);

</script>


    <div class="space-y-6">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.databaseType')}</label>
          <select value={config.type} onchange={(e) => updateConfig('type', e.target.value as ConnectionConfig['type'])}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
            <option value="redis">Redis</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.host')}</label>
          <input type="text" value={config.host} onchange={(e) => updateConfig('host', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.port')}</label>
          <input type="text" value={config.port} onchange={(e) => updateConfig('port', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.database')}</label>
          <input type="text" value={config.database} onchange={(e) => updateConfig('database', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.username')}</label>
          <input type="text" value={config.username} onchange={(e) => updateConfig('username', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.password')}</label>
          <input type="password" value={config.password} onchange={(e) => updateConfig('password', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
      </div>

      <label class="flex items-center gap-2">
        <input type="checkbox" checked={config.ssl} onchange={(e) => updateConfig('ssl', e.target.checked)} class="rounded" />
        <span class="text-sm text-gray-700 dark:text-gray-300">{t('database-connection-tester.useSSL')}</span>
      </label>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('database-connection-tester.connectionString')}</label>
          <button onclick={() => handleCopy(connectionString, 'conn')} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied === 'conn' ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {connectionString}
        </pre>
      </div>

      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('database-connection-tester.codeSnippet')}</label>
          <button onclick={() => handleCopy(codeSnippet, 'code')} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied === 'code' ? t('copied') : t('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {codeSnippet}
        </pre>
      </div>

      <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p class="text-sm text-yellow-700 dark:text-yellow-400">
          <strong>{t('database-connection-tester.note')}:</strong> {t('database-connection-tester.noteText')}
        </p>
      </div>
    </div>
  
