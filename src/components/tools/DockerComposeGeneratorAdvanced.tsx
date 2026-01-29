'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

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

const SERVICE_TEMPLATES: Record<string, Partial<Service>> = {
  nginx: { image: 'nginx:alpine', ports: ['80:80', '443:443'], volumes: ['./nginx.conf:/etc/nginx/nginx.conf:ro'] },
  postgres: { image: 'postgres:15-alpine', ports: ['5432:5432'], environment: { POSTGRES_USER: 'user', POSTGRES_PASSWORD: 'password', POSTGRES_DB: 'mydb' }, volumes: ['postgres_data:/var/lib/postgresql/data'] },
  mysql: { image: 'mysql:8', ports: ['3306:3306'], environment: { MYSQL_ROOT_PASSWORD: 'root', MYSQL_DATABASE: 'mydb' }, volumes: ['mysql_data:/var/lib/mysql'] },
  redis: { image: 'redis:alpine', ports: ['6379:6379'], volumes: ['redis_data:/data'] },
  mongodb: { image: 'mongo:6', ports: ['27017:27017'], environment: { MONGO_INITDB_ROOT_USERNAME: 'root', MONGO_INITDB_ROOT_PASSWORD: 'password' }, volumes: ['mongo_data:/data/db'] },
  elasticsearch: { image: 'elasticsearch:8.11.0', ports: ['9200:9200'], environment: { 'discovery.type': 'single-node', 'xpack.security.enabled': 'false' }, volumes: ['es_data:/usr/share/elasticsearch/data'] },
  rabbitmq: { image: 'rabbitmq:3-management-alpine', ports: ['5672:5672', '15672:15672'], environment: { RABBITMQ_DEFAULT_USER: 'user', RABBITMQ_DEFAULT_PASS: 'password' } },
  node: { image: 'node:20-alpine', ports: ['3000:3000'], volumes: ['.:/app', '/app/node_modules'], command: 'npm run dev' },
  python: { image: 'python:3.11-slim', ports: ['8000:8000'], volumes: ['.:/app'], command: 'python app.py' },
};

function generateDockerCompose(services: Service[]): string {
  const lines: string[] = [];
  const volumes = new Set<string>();
  
  lines.push('version: "3.8"');
  lines.push('');
  lines.push('services:');
  
  services.forEach(service => {
    if (!service.name) return;
    
    lines.push(`  ${service.name}:`);
    lines.push(`    image: ${service.image || 'alpine'}`);
    
    if (service.command) {
      lines.push(`    command: ${service.command}`);
    }
    
    if (service.ports.length > 0) {
      lines.push('    ports:');
      service.ports.filter(p => p).forEach(port => {
        lines.push(`      - "${port}"`);
      });
    }
    
    if (Object.keys(service.environment).length > 0) {
      lines.push('    environment:');
      Object.entries(service.environment).forEach(([key, value]) => {
        if (key) lines.push(`      ${key}: "${value}"`);
      });
    }
    
    if (service.volumes.length > 0) {
      lines.push('    volumes:');
      service.volumes.filter(v => v).forEach(vol => {
        lines.push(`      - ${vol}`);
        const match = vol.match(/^([a-z_]+):/);
        if (match) volumes.add(match[1]);
      });
    }
    
    if (service.dependsOn.length > 0) {
      lines.push('    depends_on:');
      service.dependsOn.filter(d => d).forEach(dep => {
        lines.push(`      - ${dep}`);
      });
    }
    
    if (service.restart) {
      lines.push(`    restart: ${service.restart}`);
    }
    
    lines.push('');
  });
  
  if (volumes.size > 0) {
    lines.push('volumes:');
    volumes.forEach(vol => {
      lines.push(`  ${vol}:`);
    });
  }
  
  return lines.join('\n');
}

export default function DockerComposeGeneratorAdvanced() {
  const t = useTranslations('tools.docker-compose-generator-advanced');
  const tCommon = useTranslations('tools');
  const [services, setServices] = useState<Service[]>([
    { id: '1', name: 'app', image: 'node:20-alpine', ports: ['3000:3000'], environment: { NODE_ENV: 'development' }, volumes: ['.:/app'], dependsOn: ['db'], restart: 'unless-stopped', command: 'npm run dev' },
    { id: '2', name: 'db', image: 'postgres:15-alpine', ports: ['5432:5432'], environment: { POSTGRES_USER: 'user', POSTGRES_PASSWORD: 'password', POSTGRES_DB: 'mydb' }, volumes: ['postgres_data:/var/lib/postgresql/data'], dependsOn: [], restart: 'unless-stopped', command: '' },
  ]);
  const [copied, setCopied] = useState(false);

  const addService = useCallback((template?: string) => {
    const base = template ? SERVICE_TEMPLATES[template] : {};
    setServices(prev => [...prev, {
      id: Date.now().toString(),
      name: template || '',
      image: base.image || '',
      ports: base.ports || [],
      environment: base.environment || {},
      volumes: base.volumes || [],
      dependsOn: [],
      restart: 'unless-stopped',
      command: base.command || '',
    }]);
  }, []);

  const removeService = useCallback((id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateService = useCallback((id: string, field: keyof Service, value: unknown) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  }, []);

  const output = useMemo(() => generateDockerCompose(services), [services]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <div className="space-y-6">
      {/* Quick Add */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('quickAddService')}</label>
        <div className="flex flex-wrap gap-2">
          {Object.keys(SERVICE_TEMPLATES).map(template => (
            <button
              key={template}
              onClick={() => addService(template)}
              className="px-3 py-1.5 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50"
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('services')} ({services.length})</label>
          <button onClick={() => addService()} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('addEmptyService')}</button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {services.map((service) => (
            <div key={service.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateService(service.id, 'name', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  placeholder={t('serviceName')}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                />
                <button onClick={() => removeService(service.id)} className="text-red-500 hover:text-red-600">{t('remove')}</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">{t('image')}</label>
                  <input
                    type="text"
                    value={service.image}
                    onChange={(e) => updateService(service.id, 'image', e.target.value)}
                    placeholder="image:tag"
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400">{t('restartPolicy')}</label>
                  <select
                    value={service.restart}
                    onChange={(e) => updateService(service.id, 'restart', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">{t('none')}</option>
                    <option value="always">{t('always')}</option>
                    <option value="unless-stopped">{t('unlessStopped')}</option>
                    <option value="on-failure">{t('onFailure')}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">{t('ports')}</label>
                <input
                  type="text"
                  value={service.ports.join(', ')}
                  onChange={(e) => updateService(service.id, 'ports', e.target.value.split(',').map(p => p.trim()))}
                  placeholder="host:container"
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">{t('volumes')}</label>
                <input
                  type="text"
                  value={service.volumes.join(', ')}
                  onChange={(e) => updateService(service.id, 'volumes', e.target.value.split(',').map(v => v.trim()))}
                  placeholder="./local:/container"
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400">{t('dependsOn')}</label>
                <input
                  type="text"
                  value={service.dependsOn.join(', ')}
                  onChange={(e) => updateService(service.id, 'dependsOn', e.target.value.split(',').map(d => d.trim()))}
                  placeholder="db, redis"
                  className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">docker-compose.yml</label>
          <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-80">
          {output}
        </pre>
      </div>
    </div>
  );
}
