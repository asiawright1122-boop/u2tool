'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

type Command = 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE TABLE';

export default function SqlGenerator() {
  const t = useTranslations('tools');
  const [command, setCommand] = useState<Command>('SELECT');
  const [tableName, setTableName] = useState('users');
  const [columns, setColumns] = useState('id, name, email, created_at');
  const [where, setWhere] = useState('active = 1');
  const [orderBy, setOrderBy] = useState('id DESC');
  const [limit, setLimit] = useState('10');
  
  // INSERT specific
  const [values, setValues] = useState("'John Doe', 'john@example.com', NOW()");

  // UPDATE specific
  const [updates, setUpdates] = useState("status = 'active', updated_at = NOW()");

  // CREATE TABLE specific
  const [tableSchema, setTableSchema] = useState(
`id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255) NOT NULL,
email VARCHAR(255) UNIQUE,
status ENUM('active', 'inactive') DEFAULT 'active',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
  );

  const generateSql = () => {
    switch (command) {
      case 'SELECT':
        return `SELECT ${columns}
FROM ${tableName}
WHERE ${where}
ORDER BY ${orderBy}
LIMIT ${limit};`;
      case 'INSERT':
        return `INSERT INTO ${tableName} (${columns})
VALUES (${values});`;
      case 'UPDATE':
        return `UPDATE ${tableName}
SET ${updates}
WHERE ${where};`;
      case 'DELETE':
        return `DELETE FROM ${tableName}
WHERE ${where};`;
      case 'CREATE TABLE':
        return `CREATE TABLE ${tableName} (
${tableSchema.split('\n').map(line => '  ' + line.trim()).join('\n')}
);`;
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <label className="block text-sm font-medium text-gray-300 mb-4">{t('sqlGenerator.commandType')}</label>
        <div className="flex flex-wrap gap-2 mb-6">
          {(['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE TABLE'] as Command[]).map((cmd) => (
            <button
              key={cmd}
              onClick={() => setCommand(cmd)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                command === cmd
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {cmd}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">{t('sqlGenerator.tableName')}</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>

            {command !== 'DELETE' && command !== 'CREATE TABLE' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('sqlGenerator.columns')}</label>
                <input
                  type="text"
                  value={columns}
                  onChange={(e) => setColumns(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            )}

            {command === 'INSERT' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('sqlGenerator.values')}</label>
                <input
                  type="text"
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            )}

            {command === 'UPDATE' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('sqlGenerator.setUpdates')}</label>
                <input
                  type="text"
                  value={updates}
                  onChange={(e) => setUpdates(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            )}

            {command === 'CREATE TABLE' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('sqlGenerator.schemaDefinition')}</label>
                <textarea
                  value={tableSchema}
                  onChange={(e) => setTableSchema(e.target.value)}
                  rows={6}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            )}

            {(command === 'SELECT' || command === 'UPDATE' || command === 'DELETE') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('sqlGenerator.whereClause')}</label>
                <input
                  type="text"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            )}

            {command === 'SELECT' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{t('sqlGenerator.orderBy')}</label>
                  <input
                    type="text"
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">{t('sqlGenerator.limit')}</label>
                  <input
                    type="text"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
             <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-300">{t('sqlGenerator.generatedSql')}</label>
              <button
                onClick={() => navigator.clipboard.writeText(generateSql())}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                {t('sqlGenerator.copySql')}
              </button>
            </div>
            <textarea
              readOnly
              value={generateSql()}
              rows={16}
              className="w-full bg-black border border-gray-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
