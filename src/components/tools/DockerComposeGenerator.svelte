<script lang="ts">
  import { SERVICES } from '@/lib/tool-stubs';

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
                
