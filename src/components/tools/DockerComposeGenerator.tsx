'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface Service {
  id: string;
  name: string;
  image: string;
  ports?: string[];
  environment?: Record<string, string>;
  volumes?: string[];
}

const SERVICES: Service[] = [
  {
    id: 'mysql',
    name: 'MySQL',
    image: 'mysql:8.0',
    ports: ['3306:3306'],
    environment: {
      MYSQL_ROOT_PASSWORD: 'rootpassword',
      MYSQL_DATABASE: 'mydb',
      MYSQL_USER: 'user',
      MYSQL_PASSWORD: 'password',
    },
    volumes: ['mysql_data:/var/lib/mysql'],
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    image: 'postgres:15',
    ports: ['5432:5432'],
    environment: {
      POSTGRES_DB: 'mydb',
      POSTGRES_USER: 'user',
      POSTGRES_PASSWORD: 'password',
    },
    volumes: ['postgres_data:/var/lib/postgresql/data'],
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    image: 'mongo:6',
    ports: ['27017:27017'],
    environment: {
      MONGO_INITDB_ROOT_USERNAME: 'root',
      MONGO_INITDB_ROOT_PASSWORD: 'password',
    },
    volumes: ['mongo_data:/data/db'],
  },
  {
    id: 'redis',
    name: 'Redis',
    image: 'redis:7-alpine',
    ports: ['6379:6379'],
    volumes: ['redis_data:/data'],
  },
  {
    id: 'nginx',
    name: 'Nginx',
    image: 'nginx:alpine',
    ports: ['80:80', '443:443'],
    volumes: ['./nginx.conf:/etc/nginx/nginx.conf:ro'],
  },
  {
    id: 'rabbitmq',
    name: 'RabbitMQ',
    image: 'rabbitmq:3-management',
    ports: ['5672:5672', '15672:15672'],
    environment: {
      RABBITMQ_DEFAULT_USER: 'user',
      RABBITMQ_DEFAULT_PASS: 'password',
    },
    volumes: ['rabbitmq_data:/var/lib/rabbitmq'],
  },
  {
    id: 'elasticsearch',
    name: 'Elasticsearch',
    image: 'elasticsearch:8.11.0',
    ports: ['9200:9200', '9300:9300'],
    environment: {
      'discovery.type': 'single-node',
      'xpack.security.enabled': 'false',
    },
    volumes: ['es_data:/usr/share/elasticsearch/data'],
  },
  {
    id: 'minio',
    name: 'MinIO',
    image: 'minio/minio',
    ports: ['9000:9000', '9001:9001'],
    environment: {
      MINIO_ROOT_USER: 'minioadmin',
      MINIO_ROOT_PASSWORD: 'minioadmin',
    },
    volumes: ['minio_data:/data'],
  },
  {
    id: 'adminer',
    name: 'Adminer',
    image: 'adminer',
    ports: ['8080:8080'],
  },
  {
    id: 'mailhog',
    name: 'MailHog',
    image: 'mailhog/mailhog',
    ports: ['1025:1025', '8025:8025'],
  },
];

export default function DockerComposeGenerator() {
  const t = useTranslations('tools.docker-compose-generator');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [output, setOutput] = useState('');
  const [composeVersion, setComposeVersion] = useState('3.8');

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const generate = () => {
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

    setOutput(yaml);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'docker-compose.yml';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setSelectedServices([]);
    setOutput('');
  };

  const categories = [
    { name: t('databases'), ids: ['mysql', 'postgres', 'mongodb', 'redis'] },
    { name: t('messaging'), ids: ['rabbitmq', 'elasticsearch'] },
    { name: t('utilities'), ids: ['nginx', 'minio', 'adminer', 'mailhog'] },
  ];

  return (
    <div className="space-y-6">
      {/* Version Selection */}
      <div className="flex items-center gap-4">
        <label className="text-sm text-gray-300">{t('version')}:</label>
        <select
          value={composeVersion}
          onChange={(e) => setComposeVersion(e.target.value)}
          className="bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-sm"
        >
          <option value="3.8">3.8</option>
          <option value="3.9">3.9</option>
          <option value="3">3</option>
        </select>
      </div>

      {/* Service Selection */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.name}>
            <label className="text-sm font-medium text-gray-300 block mb-2">{category.name}</label>
            <div className="flex flex-wrap gap-2">
              {category.ids.map((id) => {
                const service = SERVICES.find((s) => s.id === id);
                if (!service) return null;
                return (
                  <button
                    key={id}
                    onClick={() => toggleService(id)}
                    className={`px-3 py-1.5 rounded text-sm ${
                      selectedServices.includes(id)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {service.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generate}
          disabled={selectedServices.length === 0}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium"
        >
          {t('generate')}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
        >
          {t('clear')}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-300">{t('outputLabel')}</label>
            <div className="flex gap-2">
              <button
                onClick={copyOutput}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
              >
                {t('copy')}
              </button>
              <button
                onClick={downloadOutput}
                className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-96 bg-gray-800 border border-gray-700 rounded-lg p-4 font-mono text-sm resize-none"
          />
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-800 rounded-lg p-4 text-sm text-gray-300">
        <p>{t('note')}</p>
      </div>
    </div>
  );
}
