<script lang="ts">
  import { SERVICE_TEMPLATES, generateDockerCompose } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['docker-compose-generator-advanced'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.docker-compose-generator-advanced.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface Service {
  id: string;
  name: string;
  image: string;
  ports: string[];
  environment: Record<string, string>;
  volumes: string[];
  dependsOn: string[];
  restart: string;
  command: string;
}

  let services = $state([
    { id: '1', name: 'app', image: 'node:20-alpine', ports: ['3000:3000'], environment: { NODE_ENV: 'development' }, volumes: ['.:/app'], dependsOn: ['db'], restart: 'unless-stopped', command: 'npm run dev' },
    { id: '2', name: 'db', image: 'postgres:15-alpine', ports: ['5432:5432'], environment: { POSTGRES_USER: 'user', POSTGRES_PASSWORD: 'password', POSTGRES_DB: 'mydb' }, volumes: ['postgres_data:/var/lib/postgresql/data'], dependsOn: [], restart: 'unless-stopped', command: '' },
  ]);

  let copied = $state(false);

  function addService(template?: string) {
    const base = template ? SERVICE_TEMPLATES[template] : {};
    services = [...services, {
      id: Date.now().toString(),
      name: template || '',
      image: base.image || '',
      ports: base.ports || [],
      environment: base.environment || {},
      volumes: base.volumes || [],
      dependsOn: [],
      restart: 'unless-stopped',
      command: base.command || '',
    }];
  }

  function removeService(id: string) {
    services = services.filter(s => s.id !== id);
  }

  function updateService(id: string, field: keyof Service, value: unknown) {
    services = services.map(s => s.id === id ? { ...s, [field]: value } : s);
  }

  let output = $derived(generateDockerCompose(services));

  function handleCopy() {
    navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Quick Add -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('quickAddService')}</label>
        <div class="flex flex-wrap gap-2">
          {#each Object.keys(SERVICE_TEMPLATES) as template (template)}
<button 
              onclick={() => addService(template)}
              class="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
            >
              {template}
            </button>
{/each}
        </div>
      </div>

      <!-- Services -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('services')} ({services.length})</label>
          <button onclick={() => addService()} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('addEmptyService')}</button>
        </div>
        <div class="space-y-4 max-h-96 overflow-y-auto">
          {#each services as service (service.id)}
<div  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div class="flex items-center justify-between">
                <input
                  type="text"
                  value={service.name}
                  onchange={(e) => updateService(service.id, 'name', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder={t('serviceName')}
                  class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                <button onclick={() => removeService(service.id)} class="text-red-500 hover:text-red-600">{t('remove')}</button>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs text-gray-500 dark:text-gray-400">{t('image')}</label>
                  <input
                    type="text"
                    value={service.image}
                    onchange={(e) => updateService(service.id, 'image', e.target.value)}
                    placeholder="image:tag"
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label class="text-xs text-gray-500 dark:text-gray-400">{t('restartPolicy')}</label>
                  <select
                    value={service.restart}
                    onchange={(e) => updateService(service.id, 'restart', e.target.value)}
                    class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">{t('none')}</option>
                    <option value="always">{t('always')}</option>
                    <option value="unless-stopped">{t('unlessStopped')}</option>
                    <option value="on-failure">{t('onFailure')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">{t('ports')}</label>
                <input
                  type="text"
                  value={service.ports.join(', ')}
                  onchange={(e) => updateService(service.id, 'ports', e.target.value.split(',').map(p => p.trim()))}
                  placeholder="host:container"
                  class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">{t('volumes')}</label>
                <input
                  type="text"
                  value={service.volumes.join(', ')}
                  onchange={(e) => updateService(service.id, 'volumes', e.target.value.split(',').map(v => v.trim()))}
                  placeholder="./local:/container"
                  class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label class="text-xs text-gray-500 dark:text-gray-400">{t('dependsOn')}</label>
                <input
                  type="text"
                  value={service.dependsOn.join(', ')}
                  onchange={(e) => updateService(service.id, 'dependsOn', e.target.value.split(',').map(d => d.trim()))}
                  placeholder="db, redis"
                  class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
{/each}
        </div>
      </div>

      <!-- Output -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">docker-compose.yml</label>
          <button onclick={handleCopy} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-80">
          {output}
        </pre>
      </div>
    </div>
  
