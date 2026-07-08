<script lang="ts">
  import { SERVICES as stubServices } from '@/lib/tool-stubs';

  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['docker-compose-generator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.docker-compose-generator.${key}`;
  }

  // Types
  interface Service {
  id: string;
  name: string;
  image: string;
  ports?: string[];
  environment?: Record<string, string>;
  volumes?: string[];
}

  const fallbackServices: Service[] = [
    { id: 'mysql', name: 'MySQL', image: 'mysql:8', ports: ['3306:3306'], environment: { MYSQL_ROOT_PASSWORD: 'password' }, volumes: ['mysql_data:/var/lib/mysql'] },
    { id: 'postgres', name: 'PostgreSQL', image: 'postgres:16', ports: ['5432:5432'], environment: { POSTGRES_PASSWORD: 'password' }, volumes: ['postgres_data:/var/lib/postgresql/data'] },
    { id: 'mongodb', name: 'MongoDB', image: 'mongo:7', ports: ['27017:27017'], volumes: ['mongo_data:/data/db'] },
    { id: 'redis', name: 'Redis', image: 'redis:7-alpine', ports: ['6379:6379'] },
    { id: 'rabbitmq', name: 'RabbitMQ', image: 'rabbitmq:3-management', ports: ['5672:5672', '15672:15672'] },
    { id: 'elasticsearch', name: 'Elasticsearch', image: 'elasticsearch:8.12.0', ports: ['9200:9200'], environment: { discovery_type: 'single-node' } },
    { id: 'nginx', name: 'Nginx', image: 'nginx:alpine', ports: ['8080:80'] },
    { id: 'minio', name: 'MinIO', image: 'minio/minio', ports: ['9000:9000', '9001:9001'], environment: { MINIO_ROOT_USER: 'minio', MINIO_ROOT_PASSWORD: 'password123' } },
    { id: 'adminer', name: 'Adminer', image: 'adminer', ports: ['8081:8080'] },
    { id: 'mailhog', name: 'MailHog', image: 'mailhog/mailhog', ports: ['1025:1025', '8025:8025'] },
  ];
  const SERVICES: Service[] = Array.isArray(stubServices) && stubServices.length > 0 ? stubServices : fallbackServices;

  let selectedServices = $state([]);

  let output = $state('');

  let composeVersion = $state('3.8');

  // Functions
  function toggleService(id: string) {
    selectedServices = selectedServices.includes(id) ? selectedServices.filter((s) => s !== id) : [...selectedServices, id]
    ;
  }
  function generate() {
    if (selectedServices.length === 0) return;

    const services: Record<string, unknown> = {};
    const volumes: string[] = [];

    for (const id of selectedServices) {
      const service = SERVICES.find((s) => s.id === id);
      if (!service) continue;

      const serviceConfig: Record<string, unknown> = {
        image: service.image,
        restart: 'unless-stopped',
      };

      if (service.ports) {
        serviceConfig.ports = service.ports;
      }

      if (service.environment) {
        serviceConfig.environment = service.environment;
      }

      if (service.volumes) {
        serviceConfig.volumes = service.volumes;
        // Extract volume names
        for (const vol of service.volumes) {
          const match = vol.match(/^([^:./]+):/);
          if (match && !volumes.includes(match[1])) {
            volumes.push(match[1]);
          }
        }
      }

      services[id] = serviceConfig;
    }

    // Build YAML manually for better formatting
    let yaml = `version: '${composeVersion}'\n\nservices:\n`;

    for (const [name, config] of Object.entries(services)) {
      yaml += `  ${name}:\n`;
      const cfg = config as Record<string, unknown>;
      
      yaml += `    image: ${cfg.image}\n`;
      yaml += `    restart: ${cfg.restart}\n`;

      if (cfg.ports) {
        yaml += `    ports:\n`;
        for (const port of cfg.ports as string[]) {
          yaml += `      - "${port}"\n`;
        }
      }

      if (cfg.environment) {
        yaml += `    environment:\n`;
        for (const [key, value] of Object.entries(cfg.environment as Record<string, string>)) {
          yaml += `      ${key}: ${value}\n`;
        }
      }

      if (cfg.volumes) {
        yaml += `    volumes:\n`;
        for (const vol of cfg.volumes as string[]) {
          yaml += `      - ${vol}\n`;
        }
      }

      yaml += '\n';
    }

    if (volumes.length > 0) {
      yaml += 'volumes:\n';
      for (const vol of volumes) {
        yaml += `  ${vol}:\n`;
      }
    }

    output = yaml;
  }
  function copyOutput() {
    navigator.clipboard.writeText(output);
  }
  function downloadOutput() {
    const blob = new Blob([output], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'docker-compose.yml';
    link.click();
    URL.revokeObjectURL(url);
  }
  function clearAll() {
    selectedServices = [];
    output = '';
  }
  const categories = [
    { name: t('databases'), ids: ['mysql', 'postgres', 'mongodb', 'redis'] },
    { name: t('messaging'), ids: ['rabbitmq', 'elasticsearch'] },
    { name: t('utilities'), ids: ['nginx', 'minio', 'adminer', 'mailhog'] },
  ];

</script>

<div class="space-y-6">
  <div>
    <label for="docker-compose-generator-field-3" class="tool-label">{t('composeVersion')}</label>
    <select
      bind:value={composeVersion}
      class="w-full max-w-xs px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100" id="docker-compose-generator-field-3">
      <option value="3.8">3.8</option>
      <option value="3.9">3.9</option>
      <option value="3.7">3.7</option>
    </select>
  </div>

  <div class="space-y-4">
    {#each categories as category (category.name)}
      <section class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-gray-100 mb-3">{category.name}</h3>
        <div class="flex flex-wrap gap-2">
          {#each category.ids as id (id)}
            {@const service = SERVICES.find((item) => item.id === id)}
            {#if service}
              <button
                onclick={() => toggleService(id)}
                class={`px-3 py-1.5 rounded text-sm ${
                  selectedServices.includes(id)
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {service.name}
              </button>
            {/if}
          {/each}
        </div>
      </section>
    {/each}
  </div>

  <div class="flex flex-wrap gap-3">
    <button onclick={generate} class="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium">
      {t('generate')}
    </button>
    <button onclick={clearAll} class="px-5 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-gray-900 dark:text-gray-100">
      {t('clear')}
    </button>
  </div>

  {#if output}
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <div class="tool-label">docker-compose.yml</div>
        <div class="flex gap-2">
          <button onclick={copyOutput} class="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm">{t('copy')}</button>
          <button onclick={downloadOutput} class="px-3 py-1 bg-emerald-600 text-white rounded text-sm">{t('download')}</button>
        </div>
      </div>
      <pre class="p-4 bg-gray-950 text-green-300 rounded-lg overflow-auto text-sm whitespace-pre-wrap">{output}</pre>
    </div>
  {/if}
</div>
