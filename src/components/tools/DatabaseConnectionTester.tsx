'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

interface ConnectionConfig {
  type: 'postgresql' | 'mysql' | 'mongodb' | 'redis';
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

const DEFAULT_PORTS: Record<string, string> = {
  postgresql: '5432',
  mysql: '3306',
  mongodb: '27017',
  redis: '6379',
};

function generateConnectionString(config: ConnectionConfig): string {
  const { type, host, port, database, username, password, ssl } = config;
  
  switch (type) {
    case 'postgresql':
      return `postgresql://${username}:${password}@${host}:${port}/${database}${ssl ? '?sslmode=require' : ''}`;
    case 'mysql':
      return `mysql://${username}:${password}@${host}:${port}/${database}${ssl ? '?ssl=true' : ''}`;
    case 'mongodb':
      return `mongodb://${username}:${password}@${host}:${port}/${database}${ssl ? '?ssl=true' : ''}`;
    case 'redis':
      return `redis://${username ? `${username}:${password}@` : ''}${host}:${port}`;
    default:
      return '';
  }
}

function generateCodeSnippet(config: ConnectionConfig): string {
  const connStr = generateConnectionString(config);
  
  switch (config.type) {
    case 'postgresql':
      return `// Node.js with pg
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: '${connStr}'
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Connection failed:', err);
  else console.log('Connected:', res.rows[0]);
});`;
    case 'mysql':
      return `// Node.js with mysql2
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection('${connStr}');
const [rows] = await connection.execute('SELECT 1');
console.log('Connected:', rows);`;
    case 'mongodb':
      return `// Node.js with mongodb
const { MongoClient } = require('mongodb');
const client = new MongoClient('${connStr}');

await client.connect();
console.log('Connected to MongoDB');
const db = client.db('${config.database}');`;
    case 'redis':
      return `// Node.js with redis
const redis = require('redis');
const client = redis.createClient({ url: '${connStr}' });

await client.connect();
console.log('Connected to Redis');
await client.ping();`;
    default:
      return '';
  }
}

export default function DatabaseConnectionTester() {
  const t = useTranslations('tools');
  const [config, setConfig] = useState<ConnectionConfig>({
    type: 'postgresql',
    host: 'localhost',
    port: '5432',
    database: 'mydb',
    username: 'user',
    password: 'password',
    ssl: false,
  });
  const [copied, setCopied] = useState<string | null>(null);

  const updateConfig = useCallback(<K extends keyof ConnectionConfig>(key: K, value: ConnectionConfig[K]) => {
    setConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      if (key === 'type') {
        newConfig.port = DEFAULT_PORTS[value as string] || prev.port;
      }
      return newConfig;
    });
  }, []);

  const connectionString = generateConnectionString(config);
  const codeSnippet = generateCodeSnippet(config);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.databaseType')}</label>
          <select value={config.type} onChange={(e) => updateConfig('type', e.target.value as ConnectionConfig['type'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
            <option value="redis">Redis</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.host')}</label>
          <input type="text" value={config.host} onChange={(e) => updateConfig('host', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.port')}</label>
          <input type="text" value={config.port} onChange={(e) => updateConfig('port', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.database')}</label>
          <input type="text" value={config.database} onChange={(e) => updateConfig('database', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.username')}</label>
          <input type="text" value={config.username} onChange={(e) => updateConfig('username', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database-connection-tester.password')}</label>
          <input type="password" value={config.password} onChange={(e) => updateConfig('password', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={config.ssl} onChange={(e) => updateConfig('ssl', e.target.checked)} className="rounded" />
        <span className="text-sm text-gray-700 dark:text-gray-300">{t('database-connection-tester.useSSL')}</span>
      </label>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('database-connection-tester.connectionString')}</label>
          <button onClick={() => handleCopy(connectionString, 'conn')} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied === 'conn' ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {connectionString}
        </pre>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('database-connection-tester.codeSnippet')}</label>
          <button onClick={() => handleCopy(codeSnippet, 'code')} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied === 'code' ? t('copied') : t('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {codeSnippet}
        </pre>
      </div>

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <p className="text-sm text-yellow-700 dark:text-yellow-400">
          <strong>{t('database-connection-tester.note')}:</strong> {t('database-connection-tester.noteText')}
        </p>
      </div>
    </div>
  );
}
