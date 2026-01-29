'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

type Database = 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
type Framework = 'raw' | 'prisma' | 'typeorm' | 'sequelize' | 'knex';

interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue: string;
  foreignKey: string;
}

const DATA_TYPES: Record<Database, string[]> = {
  postgresql: ['INTEGER', 'BIGINT', 'SERIAL', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'TIMESTAMP', 'DATE', 'DECIMAL(10,2)', 'UUID', 'JSONB', 'ARRAY'],
  mysql: ['INT', 'BIGINT', 'VARCHAR(255)', 'TEXT', 'BOOLEAN', 'DATETIME', 'DATE', 'DECIMAL(10,2)', 'JSON', 'ENUM'],
  sqlite: ['INTEGER', 'TEXT', 'REAL', 'BLOB', 'NUMERIC'],
  mongodb: ['String', 'Number', 'Boolean', 'Date', 'ObjectId', 'Array', 'Object'],
};

function generateRawSQL(tableName: string, columns: Column[], database: Database, action: 'create' | 'alter'): string {
  const lines: string[] = [];
  // 使用字符串替换避免 Tailwind JIT 误解析正则表达式
  const timestamp = new Date().toISOString().split('.')[0].replace(/-/g, '').replace(/:/g, '').replace(/T/g, '');
  
  lines.push(`-- Migration: ${action}_${tableName}_${timestamp}`);
  lines.push(`-- Database: ${database}`);
  lines.push('');
  
  if (action === 'create') {
    lines.push(`CREATE TABLE ${tableName} (`);
    const colDefs: string[] = [];
    const constraints: string[] = [];
    
    columns.forEach(col => {
      let def = `  ${col.name} ${col.type}`;
      if (col.primaryKey) def += ' PRIMARY KEY';
      if (!col.nullable && !col.primaryKey) def += ' NOT NULL';
      if (col.unique && !col.primaryKey) def += ' UNIQUE';
      if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`;
      colDefs.push(def);
      
      if (col.foreignKey) {
        const [refTable, refCol] = col.foreignKey.split('.');
        constraints.push(`  FOREIGN KEY (${col.name}) REFERENCES ${refTable}(${refCol})`);
      }
    });
    
    lines.push([...colDefs, ...constraints].join(',\n'));
    lines.push(');');
    lines.push('');
    lines.push('-- Rollback');
    lines.push(`DROP TABLE IF EXISTS ${tableName};`);
  } else {
    columns.forEach(col => {
      lines.push(`ALTER TABLE ${tableName} ADD COLUMN ${col.name} ${col.type}${col.nullable ? '' : ' NOT NULL'}${col.defaultValue ? ` DEFAULT ${col.defaultValue}` : ''};`);
    });
  }
  
  return lines.join('\n');
}

function generatePrisma(tableName: string, columns: Column[]): string {
  const lines: string[] = [];
  
  lines.push(`model ${tableName.charAt(0).toUpperCase() + tableName.slice(1)} {`);
  
  columns.forEach(col => {
    let type = col.type.toLowerCase();
    if (type.includes('int') || type.includes('serial')) type = 'Int';
    else if (type.includes('varchar') || type.includes('text')) type = 'String';
    else if (type.includes('bool')) type = 'Boolean';
    else if (type.includes('timestamp') || type.includes('datetime')) type = 'DateTime';
    else if (type.includes('decimal') || type.includes('real')) type = 'Float';
    else if (type.includes('uuid')) type = 'String @db.Uuid';
    else if (type.includes('json')) type = 'Json';
    else type = 'String';
    
    let def = `  ${col.name} ${type}`;
    if (!col.nullable) def = def.replace(type, type + '?').replace('?', '');
    if (col.nullable) def += '?';
    if (col.primaryKey) def += ' @id';
    if (col.type.toLowerCase().includes('serial')) def += ' @default(autoincrement())';
    if (col.unique && !col.primaryKey) def += ' @unique';
    if (col.defaultValue) {
      if (col.defaultValue.toLowerCase() === 'now()') def += ' @default(now())';
      else def += ` @default(${col.defaultValue})`;
    }
    
    lines.push(def);
  });
  
  lines.push('}');
  
  return lines.join('\n');
}

function generateTypeORM(tableName: string, columns: Column[]): string {
  const lines: string[] = [];
  const className = tableName.charAt(0).toUpperCase() + tableName.slice(1);
  
  lines.push(`import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';`);
  lines.push('');
  lines.push(`@Entity('${tableName}')`);
  lines.push(`export class ${className} {`);
  
  columns.forEach(col => {
    let type = 'string';
    if (col.type.toLowerCase().includes('int')) type = 'number';
    else if (col.type.toLowerCase().includes('bool')) type = 'boolean';
    else if (col.type.toLowerCase().includes('timestamp') || col.type.toLowerCase().includes('date')) type = 'Date';
    
    if (col.primaryKey) {
      if (col.type.toLowerCase().includes('serial')) {
        lines.push('  @PrimaryGeneratedColumn()');
      } else {
        lines.push('  @PrimaryColumn()');
      }
    } else {
      const options: string[] = [];
      if (col.nullable) options.push('nullable: true');
      if (col.unique) options.push('unique: true');
      if (col.defaultValue) options.push(`default: ${col.defaultValue}`);
      lines.push(`  @Column(${options.length > 0 ? `{ ${options.join(', ')} }` : ''})`);
    }
    lines.push(`  ${col.name}: ${type};`);
    lines.push('');
  });
  
  lines.push('}');
  
  return lines.join('\n');
}

export default function DatabaseMigrationGenerator() {
  const t = useTranslations('tools.database-migration-generator');
  const tCommon = useTranslations('tools');
  const [tableName, setTableName] = useState('users');
  const [database, setDatabase] = useState<Database>('postgresql');
  const [framework, setFramework] = useState<Framework>('raw');
  const [action, setAction] = useState<'create' | 'alter'>('create');
  const [columns, setColumns] = useState<Column[]>([
    { id: '1', name: 'id', type: 'SERIAL', nullable: false, primaryKey: true, unique: false, defaultValue: '', foreignKey: '' },
    { id: '2', name: 'email', type: 'VARCHAR(255)', nullable: false, primaryKey: false, unique: true, defaultValue: '', foreignKey: '' },
    { id: '3', name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false, unique: false, defaultValue: 'NOW()', foreignKey: '' },
  ]);
  const [copied, setCopied] = useState(false);

  const addColumn = useCallback(() => {
    setColumns(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      type: DATA_TYPES[database][0],
      nullable: true,
      primaryKey: false,
      unique: false,
      defaultValue: '',
      foreignKey: '',
    }]);
  }, [database]);

  const removeColumn = useCallback((id: string) => {
    setColumns(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateColumn = useCallback((id: string, field: keyof Column, value: string | boolean) => {
    setColumns(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  }, []);

  const result = useMemo(() => {
    if (!tableName || columns.length === 0) return '';
    
    switch (framework) {
      case 'raw':
        return generateRawSQL(tableName, columns, database, action);
      case 'prisma':
        return generatePrisma(tableName, columns);
      case 'typeorm':
        return generateTypeORM(tableName, columns);
      default:
        return generateRawSQL(tableName, columns, database, action);
    }
  }, [tableName, columns, database, framework, action]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('tableName')}</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('database')}</label>
          <select
            value={database}
            onChange={(e) => setDatabase(e.target.value as Database)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('framework')}</label>
          <select
            value={framework}
            onChange={(e) => setFramework(e.target.value as Framework)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="raw">{t('rawSql')}</option>
            <option value="prisma">Prisma</option>
            <option value="typeorm">TypeORM</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('action')}</label>
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as 'create' | 'alter')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="create">{t('createTable')}</option>
            <option value="alter">{t('alterTable')}</option>
          </select>
        </div>
      </div>

      {/* Columns */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('columns')}</label>
          <button
            onClick={addColumn}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {t('addColumn')}
          </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {columns.map((col) => (
            <div key={col.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <input
                type="text"
                value={col.name}
                onChange={(e) => updateColumn(col.id, 'name', e.target.value)}
                placeholder={t("columnNamePlaceholder")}
                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <select
                value={col.type}
                onChange={(e) => updateColumn(col.id, 'type', e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              >
                {DATA_TYPES[database].map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={col.primaryKey} onChange={(e) => updateColumn(col.id, 'primaryKey', e.target.checked)} className="rounded" />
                {t('pk')}
              </label>
              <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={col.nullable} onChange={(e) => updateColumn(col.id, 'nullable', e.target.checked)} className="rounded" />
                {t('nullable')}
              </label>
              <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                <input type="checkbox" checked={col.unique} onChange={(e) => updateColumn(col.id, 'unique', e.target.checked)} className="rounded" />
                {t('unique')}
              </label>
              <button onClick={() => removeColumn(col.id)} className="text-red-500 hover:text-red-600">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('generatedMigration')}
            </label>
            <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              {copied ? tCommon('copied') : tCommon('copy')}
            </button>
          </div>
          <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-80">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
