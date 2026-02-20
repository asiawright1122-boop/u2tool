<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['dockerfile-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.dockerfile-generator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Types
  interface EnvVar {
  key: string;
  value: string;
}
  interface DockerfileConfig {
  baseImage: string;
  workdir: string;
  copyCommands: string[];
  runCommands: string[];
  exposePort: string;
  envVars: EnvVar[];
  entrypoint: string;
  cmd: string;
}

  let config = $state({
    baseImage: 'node:20-alpine',
    workdir: '/app',
    copyCommands: ['package*.json ./'],
    runCommands: ['npm install'],
    exposePort: '3000',
    envVars: [{ key: 'NODE_ENV', value: 'production' }],
    entrypoint: '',
    cmd: 'npm start',
  });

  let output = $state('');

  let copied = $state(false);

  // Functions
  function addCopyCommand() {
    config = ({
      ...config,
      copyCommands: [...config.copyCommands, ''],
    });
  }
  function updateCopyCommand(index: number, value: string) {
    config = ({
      ...config,
      copyCommands: config.copyCommands.map((cmd, i) => i === index ? value : cmd),
    });
  }
  function removeCopyCommand(index: number) {
    config = ({
      ...config,
      copyCommands: config.copyCommands.filter((_, i) => i !== index),
    });
  }
  function addRunCommand() {
    config = ({
      ...config,
      runCommands: [...config.runCommands, ''],
    });
  }
  function updateRunCommand(index: number, value: string) {
    config = ({
      ...config,
      runCommands: config.runCommands.map((cmd, i) => i === index ? value : cmd),
    });
  }
  function removeRunCommand(index: number) {
    config = ({
      ...config,
      runCommands: config.runCommands.filter((_, i) => i !== index),
    });
  }
  function addEnvVar() {
    config = ({
      ...config,
      envVars: [...config.envVars, { key: '', value: '' }],
    });
  }
  function updateEnvVar(index: number, field: 'key' | 'value', value: string) {
    config = ({
      ...config,
      envVars: config.envVars.map((env, i) => 
        i === index ? { ...env, [field]: value } : env
      ),
    });
  }
  function removeEnvVar(index: number) {
    config = ({
      ...config,
      envVars: config.envVars.filter((_, i) => i !== index),
    });
  }
  function generateDockerfile() {
    const lines: string[] = [];
    
    // FROM
    lines.push(`FROM ${config.baseImage}`);
    lines.push('');
    
    // WORKDIR
    if (config.workdir) {
      lines.push(`WORKDIR ${config.workdir}`);
      lines.push('');
    }
    
    // ENV
    const validEnvVars = config.envVars.filter(env => env.key.trim());
    if (validEnvVars.length > 0) {
      for (const env of validEnvVars) {
        lines.push(`ENV ${env.key}=${env.value}`);
      }
      lines.push('');
    }
    
    // COPY
    const validCopyCommands = config.copyCommands.filter(cmd => cmd.trim());
    for (const cmd of validCopyCommands) {
      lines.push(`COPY ${cmd}`);
    }
    if (validCopyCommands.length > 0) {
      lines.push('');
    }
    
    // RUN
    const validRunCommands = config.runCommands.filter(cmd => cmd.trim());
    for (const cmd of validRunCommands) {
      lines.push(`RUN ${cmd}`);
    }
    if (validRunCommands.length > 0) {
      lines.push('');
    }
    
    // EXPOSE
    if (config.exposePort) {
      lines.push(`EXPOSE ${config.exposePort}`);
      lines.push('');
    }
    
    // ENTRYPOINT
    if (config.entrypoint) {
      const parts = config.entrypoint.split(' ').map(p => `"${p}"`).join(', ');
      lines.push(`ENTRYPOINT [${parts}]`);
    }
    
    // CMD
    if (config.cmd) {
      const parts = config.cmd.split(' ').map(p => `"${p}"`).join(', ');
      lines.push(`CMD [${parts}]`);
    }
    
    output = lines.join('\n');
  }
  async function copyToClipboard() {
    await navigator.clipboard.writeText(output);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
  function downloadFile() {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Dockerfile';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    config = {
      baseImage: 'node:20-alpine',
      workdir: '/app',
      copyCommands: [''],
      runCommands: [''],
      exposePort: '',
      envVars: [{ key: '', value: '' }],
      entrypoint: '',
      cmd: '',
    };
    output = '';
  }

</script>


    <div class="space-y-6">
      <!-- Base Image -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('baseImage')}
        </label>
        <select
          value={config.baseImage}
          onchange={(e) => config = ({ ...config, baseImage: e.target.value })}
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {#each BASE_IMAGES as img (img.value)}
<option  value={img.value}>{img.label}</option>
{/each}
        </select>
      </div>

      <!-- Working Directory -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('workdir')}
        </label>
        <input
          type="text"
          value={config.workdir}
          onchange={(e) => config = ({ ...config, workdir: e.target.value })}
          placeholder="/app"
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Environment Variables -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('envVars')}
        </label>
        <div class="space-y-2">
          {#each config.envVars as env, index (index)}
<div  class="flex gap-2">
              <input
                type="text"
                value={env.key}
                onchange={(e) => updateEnvVar(index, 'key', e.target.value)}
                placeholder={t('envKey')}
                class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={env.value}
                onchange={(e) => updateEnvVar(index, 'value', e.target.value)}
                placeholder={t('envValue')}
                class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onclick={() => removeEnvVar(index)}
                class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
{/each}
          <button
            onclick={addEnvVar}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
          >
            + {t('addEnvVar')}
          </button>
        </div>
      </div>

      <!-- COPY Commands -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('copyCommands')}
        </label>
        <div class="space-y-2">
          {#each config.copyCommands as cmd, index (index)}
<div  class="flex gap-2">
              <input
                type="text"
                value={cmd}
                onchange={(e) => updateCopyCommand(index, e.target.value)}
                placeholder="package*.json ./"
                class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <button
                onclick={() => removeCopyCommand(index)}
                class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
{/each}
          <button
            onclick={addCopyCommand}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
          >
            + {t('addCopy')}
          </button>
        </div>
      </div>

      <!-- RUN Commands -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('runCommands')}
        </label>
        <div class="space-y-2">
          {#each config.runCommands as cmd, index (index)}
<div  class="flex gap-2">
              <input
                type="text"
                value={cmd}
                onchange={(e) => updateRunCommand(index, e.target.value)}
                placeholder="npm install"
                class="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <button
                onclick={() => removeRunCommand(index)}
                class="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                ✕
              </button>
            </div>
{/each}
          <button
            onclick={addRunCommand}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
          >
            + {t('addRun')}
          </button>
        </div>
      </div>

      <!-- Expose Port -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('exposePort')}
        </label>
        <input
          type="text"
          value={config.exposePort}
          onchange={(e) => config = ({ ...config, exposePort: e.target.value })}
          placeholder="3000"
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Entrypoint -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('entrypoint')}
        </label>
        <input
          type="text"
          value={config.entrypoint}
          onchange={(e) => config = ({ ...config, entrypoint: e.target.value })}
          placeholder="node server.js"
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      <!-- CMD -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('cmd')}
        </label>
        <input
          type="text"
          value={config.cmd}
          onchange={(e) => config = ({ ...config, cmd: e.target.value })}
          placeholder="npm start"
          class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-center gap-4">
        <button
          onclick={generateDockerfile}
          class="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onclick={clearAll}
          class="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      <!-- Output -->
      {#if output}
<div>
          <div class="flex justify-between items-center mb-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Dockerfile</label>
            <div class="flex gap-2">
              <button
                onclick={copyToClipboard}
                class="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onclick={downloadFile}
                class="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre class="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
            {output}
          </pre>
        </div>
{/if}
    </div>
  
