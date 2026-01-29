'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

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

function generateCronExpression(schedule: string): string {
  switch (schedule) {
    case 'hourly': return '0 * * * *';
    case 'daily': return '0 2 * * *';
    case 'weekly': return '0 2 * * 0';
    case 'monthly': return '0 2 1 * *';
    default: return '0 2 * * *';
  }
}

function generateBackupScript(config: BackupConfig): string {
  const timestamp = '$(date +%Y%m%d_%H%M%S)';
  const filename = `${config.dbName}_backup_${timestamp}`;
  const ext = config.compression ? '.sql.gz' : '.sql';
  
  let script = `#!/bin/bash
# Database Backup Script
# Generated for ${config.database}
# Schedule: ${config.schedule} (${generateCronExpression(config.schedule)})

# Configuration
DB_HOST="${config.host}"
DB_NAME="${config.dbName}"
DB_USER="${config.username}"
BACKUP_DIR="${config.outputPath}"
RETENTION_DAYS=${config.retention}

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${config.dbName}_backup_$TIMESTAMP${ext}"

`;

  switch (config.database) {
    case 'postgresql':
      script += config.compression
        ? `# Create backup with compression
PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE`
        : `# Create backup
PGPASSWORD=$DB_PASS pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_FILE`;
      break;
    case 'mysql':
      script += config.compression
        ? `# Create backup with compression
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_FILE`
        : `# Create backup
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE`;
      break;
    case 'mongodb':
      script += `# Create backup
mongodump --host $DB_HOST --db $DB_NAME --username $DB_USER --password $DB_PASS --out $BACKUP_DIR/mongo_$TIMESTAMP
${config.compression ? 'tar -czf $BACKUP_FILE $BACKUP_DIR/mongo_$TIMESTAMP && rm -rf $BACKUP_DIR/mongo_$TIMESTAMP' : ''}`;
      break;
  }

  script += `

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "Backup completed successfully: $BACKUP_FILE"
    
    # Remove old backups
    find $BACKUP_DIR -name "${config.dbName}_backup_*" -type f -mtime +$RETENTION_DAYS -delete
    echo "Old backups cleaned up (retention: $RETENTION_DAYS days)"
else
    echo "Backup failed!"
    exit 1
fi
`;

  return script;
}

function generateCrontab(config: BackupConfig): string {
  const cron = generateCronExpression(config.schedule);
  return `# Add this line to crontab (crontab -e)
${cron} /path/to/backup_script.sh >> /var/log/db_backup.log 2>&1`;
}

export default function DatabaseBackupScheduler() {
  const t = useTranslations('tools.database-backup-scheduler');
  const tCommon = useTranslations('tools');
  const [config, setConfig] = useState<BackupConfig>({
    database: 'postgresql',
    host: 'localhost',
    dbName: 'mydb',
    username: 'dbuser',
    schedule: 'daily',
    retention: 7,
    compression: true,
    outputPath: '/var/backups/database',
  });
  const [copied, setCopied] = useState<string | null>(null);

  const updateConfig = useCallback(<K extends keyof BackupConfig>(key: K, value: BackupConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const script = useMemo(() => generateBackupScript(config), [config]);
  const crontab = useMemo(() => generateCrontab(config), [config]);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('database')}</label>
          <select value={config.database} onChange={(e) => updateConfig('database', e.target.value as BackupConfig['database'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mongodb">MongoDB</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('host')}</label>
          <input type="text" value={config.host} onChange={(e) => updateConfig('host', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('databaseName')}</label>
          <input type="text" value={config.dbName} onChange={(e) => updateConfig('dbName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('username')}</label>
          <input type="text" value={config.username} onChange={(e) => updateConfig('username', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('schedule')}</label>
          <select value={config.schedule} onChange={(e) => updateConfig('schedule', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="hourly">{t('hourly')}</option>
            <option value="daily">{t('daily')}</option>
            <option value="weekly">{t('weekly')}</option>
            <option value="monthly">{t('monthly')}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('retention')}</label>
          <input type="number" value={config.retention} onChange={(e) => updateConfig('retention', parseInt(e.target.value) || 7)} min={1}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('outputPath')}</label>
          <input type="text" value={config.outputPath} onChange={(e) => updateConfig('outputPath', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={config.compression} onChange={(e) => updateConfig('compression', e.target.checked)} className="rounded" />
        <span className="text-sm text-gray-700 dark:text-gray-300">{t('enableCompression')}</span>
      </label>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('backupScript')}</label>
          <button onClick={() => handleCopy(script, 'script')} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied === 'script' ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-xs font-mono text-gray-800 dark:text-gray-200 max-h-64">
          {script}
        </pre>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('crontabEntry')}</label>
          <button onClick={() => handleCopy(crontab, 'cron')} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied === 'cron' ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
          {crontab}
        </pre>
      </div>
    </div>
  );
}
