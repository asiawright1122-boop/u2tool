<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['kubernetes-manifest-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.kubernetes-manifest-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface K8sConfig {
  name: string;
  namespace: string;
  image: string;
  replicas: number;
  port: number;
  targetPort: number;
  serviceType: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
  resources: {
    cpuRequest: string;
    cpuLimit: string;
    memoryRequest: string;
    memoryLimit: string;
  };
  envVars: Array<{ key: string; value: string }>;
  includeIngress: boolean;
  ingressHost: string;
  includeHPA: boolean;
  hpaMinReplicas: number;
  hpaMaxReplicas: number;
  hpaTargetCPU: number;
}

  let config = $state({
    name: 'my-app',
    namespace: 'default',
    image: 'nginx:latest',
    replicas: 3,
    port: 80,
    targetPort: 80,
    serviceType: 'ClusterIP',
    resources: { cpuRequest: '100m', cpuLimit: '500m', memoryRequest: '128Mi', memoryLimit: '512Mi' },
    envVars: [{ key: 'NODE_ENV', value: 'production' }],
    includeIngress: false,
    ingressHost: 'app.example.com',
    includeHPA: false,
    hpaMinReplicas: 2,
    hpaMaxReplicas: 10,
    hpaTargetCPU: 80,
  });

  let copied = $state(false);

  function updateConfig(key: K, value: K8sConfig[K]) {
    config = ({ ...config, [key]: value });
  }

  function addEnvVar() {
    config = ({ ...config, envVars: [...config.envVars, { key: '', value: '' }] });
  }

  function removeEnvVar(index: number) {
    config = ({ ...config, envVars: config.envVars.filter((_, i) => i !== index) });
  }

  function updateEnvVar(index: number, field: 'key' | 'value', value: string) {
    config = ({
      ...config,
      envVars: config.envVars.map((e, i) => i === index ? { ...e, [field]: value } : e),
    });
  }

  let output = $derived.by(() => {
    const parts: string[] = [];
    if (config.namespace !== 'default') {
      parts.push(generateNamespace(config.namespace));
    }
    parts.push(generateDeployment(config));
    parts.push(generateService(config));
    if (config.includeIngress) {
      parts.push(generateIngress(config));
    }
    if (config.includeHPA) {
      parts.push(generateHPA(config));
    }
    return parts.join('\n---\n');
  });

  function handleCopy() {
    navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

</script>


    <div class="space-y-6">
      <!-- Basic Config -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('appName')}</label>
          <input type="text" value={config.name} onchange={(e) => updateConfig('name', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('namespace')}</label>
          <input type="text" value={config.namespace} onchange={(e) => updateConfig('namespace', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('image')}</label>
          <input type="text" value={config.image} onchange={(e) => updateConfig('image', e.target.value)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('replicas')}</label>
          <input type="number" value={config.replicas} onchange={(e) => updateConfig('replicas', parseInt(e.target.value) || 1)} min={1}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
      </div>

      <!-- Ports & Service -->
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('servicePort')}</label>
          <input type="number" value={config.port} onchange={(e) => updateConfig('port', parseInt(e.target.value) || 80)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('containerPort')}</label>
          <input type="number" value={config.targetPort} onchange={(e) => updateConfig('targetPort', parseInt(e.target.value) || 80)}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('serviceType')}</label>
          <select value={config.serviceType} onchange={(e) => updateConfig('serviceType', e.target.value as K8sConfig['serviceType'])}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="ClusterIP">ClusterIP</option>
            <option value="NodePort">NodePort</option>
            <option value="LoadBalancer">LoadBalancer</option>
          </select>
        </div>
      </div>

      <!-- Resources -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('resources')}</label>
        <div class="grid grid-cols-4 gap-4">
          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('cpuRequest')}</label>
            <input type="text" value={config.resources.cpuRequest} onchange={(e) => updateConfig('resources', { ...config.resources, cpuRequest: e.target.value })}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('cpuLimit')}</label>
            <input type="text" value={config.resources.cpuLimit} onchange={(e) => updateConfig('resources', { ...config.resources, cpuLimit: e.target.value })}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('memoryRequest')}</label>
            <input type="text" value={config.resources.memoryRequest} onchange={(e) => updateConfig('resources', { ...config.resources, memoryRequest: e.target.value })}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('memoryLimit')}</label>
            <input type="text" value={config.resources.memoryLimit} onchange={(e) => updateConfig('resources', { ...config.resources, memoryLimit: e.target.value })}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
          </div>
        </div>
      </div>

      <!-- Environment Variables -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('environmentVariables')}</label>
          <button onclick={addEnvVar} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('addEnvVar')}</button>
        </div>
        <div class="space-y-2">
          {#each config.envVars as env, idx (idx)}
<div  class="flex gap-2">
              <input type="text" value={env.key} onchange={(e) => updateEnvVar(idx, 'key', e.target.value)} placeholder={t("keyPlaceholder")}
                class="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono" />
              <input type="text" value={env.value} onchange={(e) => updateEnvVar(idx, 'value', e.target.value)} placeholder={t("valuePlaceholder")}
                class="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
              <button onclick={() => removeEnvVar(idx)} class="text-red-500 hover:text-red-600">✕</button>
            </div>
{/each}
        </div>
      </div>

      <!-- Optional Components -->
      <div class="flex flex-wrap gap-6">
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={config.includeIngress} onchange={(e) => updateConfig('includeIngress', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('includeIngress')}</span>
        </label>
        {#if config.includeIngress}
<input type="text" value={config.ingressHost} onchange={(e) => updateConfig('ingressHost', e.target.value)} placeholder={t("hostPlaceholder")}
            class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
{/if}
        <label class="flex items-center gap-2">
          <input type="checkbox" checked={config.includeHPA} onchange={(e) => updateConfig('includeHPA', e.target.checked)} class="rounded" />
          <span class="text-sm text-gray-700 dark:text-gray-300">{t('includeHPA')}</span>
        </label>
      </div>

      <!-- Output -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('kubernetesManifests')}</label>
          <button onclick={handleCopy} class="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre class="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-96">
          {output}
        </pre>
      </div>
    </div>
  
