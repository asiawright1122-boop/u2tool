'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

type FieldType = 'name' | 'firstName' | 'lastName' | 'email' | 'phone' | 'address' | 'city' | 'country' | 'company' | 'jobTitle' | 'date' | 'number' | 'uuid' | 'url' | 'username';

interface Field {
  id: string;
  name: string;
  type: FieldType;
}

// Simple fake data generators
const generators: Record<FieldType, (locale: string) => string> = {
  name: (locale) => {
    const firstNames: Record<string, string[]> = {
      en: ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda'],
      zh: ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强'],
      ja: ['太郎', '花子', '一郎', '美咲', '健太', '愛', '翔太', '結衣'],
      ko: ['민준', '서연', '예준', '서윤', '도윤', '지우', '시우', '하윤'],
      es: ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Miguel', 'Rosa'],
      pt: ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Paulo', 'Fernanda'],
      fr: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Michel', 'Isabelle', 'François', 'Claire'],
      de: ['Hans', 'Anna', 'Peter', 'Maria', 'Klaus', 'Ursula', 'Wolfgang', 'Helga'],
      ru: ['Иван', 'Мария', 'Александр', 'Анна', 'Дмитрий', 'Елена', 'Сергей', 'Ольга'],
      ar: ['محمد', 'فاطمة', 'أحمد', 'عائشة', 'علي', 'زينب', 'عمر', 'مريم'],
    };
    const lastNames: Record<string, string[]> = {
      en: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'],
      zh: ['王', '李', '张', '刘', '陈', '杨', '赵', '黄'],
      ja: ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村'],
      ko: ['김', '이', '박', '최', '정', '강', '조', '윤'],
      es: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez'],
      pt: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira'],
      fr: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand'],
      de: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker'],
      ru: ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов'],
      ar: ['الأحمد', 'المحمد', 'العلي', 'الحسن', 'الخالد', 'السعيد', 'الناصر', 'الرشيد'],
    };
    const first = firstNames[locale] || firstNames.en;
    const last = lastNames[locale] || lastNames.en;
    return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`;
  },
  firstName: (locale) => {
    const names: Record<string, string[]> = {
      en: ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda'],
      zh: ['伟', '芳', '娜', '秀英', '敏', '静', '丽', '强'],
      ja: ['太郎', '花子', '一郎', '美咲', '健太', '愛', '翔太', '結衣'],
      ko: ['민준', '서연', '예준', '서윤', '도윤', '지우', '시우', '하윤'],
      es: ['Carlos', 'María', 'José', 'Ana', 'Luis', 'Carmen', 'Miguel', 'Rosa'],
      pt: ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Paulo', 'Fernanda'],
      fr: ['Jean', 'Marie', 'Pierre', 'Sophie', 'Michel', 'Isabelle', 'François', 'Claire'],
      de: ['Hans', 'Anna', 'Peter', 'Maria', 'Klaus', 'Ursula', 'Wolfgang', 'Helga'],
      ru: ['Иван', 'Мария', 'Александр', 'Анна', 'Дмитрий', 'Елена', 'Сергей', 'Ольга'],
      ar: ['محمد', 'فاطمة', 'أحمد', 'عائشة', 'علي', 'زينب', 'عمر', 'مريم'],
    };
    const list = names[locale] || names.en;
    return list[Math.floor(Math.random() * list.length)];
  },
  lastName: (locale) => {
    const names: Record<string, string[]> = {
      en: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'],
      zh: ['王', '李', '张', '刘', '陈', '杨', '赵', '黄'],
      ja: ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村'],
      ko: ['김', '이', '박', '최', '정', '강', '조', '윤'],
      es: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez'],
      pt: ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira'],
      fr: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand'],
      de: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker'],
      ru: ['Иванов', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Петров', 'Соколов', 'Михайлов'],
      ar: ['الأحمد', 'المحمد', 'العلي', 'الحسن', 'الخالد', 'السعيد', 'الناصر', 'الرشيد'],
    };
    const list = names[locale] || names.en;
    return list[Math.floor(Math.random() * list.length)];
  },
  email: () => {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com', 'test.com'];
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let name = '';
    for (let i = 0; i < 8; i++) {
      name += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
  },
  phone: () => {
    const formats = ['+1-XXX-XXX-XXXX', '+86-XXX-XXXX-XXXX', '+81-XX-XXXX-XXXX', '+82-XX-XXXX-XXXX'];
    const format = formats[Math.floor(Math.random() * formats.length)];
    return format.replace(/X/g, () => Math.floor(Math.random() * 10).toString());
  },
  address: () => {
    const streets = ['Main St', 'Oak Ave', 'Park Rd', 'Elm St', 'Cedar Ln', 'Pine Dr'];
    const num = Math.floor(Math.random() * 9999) + 1;
    return `${num} ${streets[Math.floor(Math.random() * streets.length)]}`;
  },
  city: (locale) => {
    const cities: Record<string, string[]> = {
      en: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Francisco'],
      zh: ['北京', '上海', '广州', '深圳', '杭州', '成都'],
      ja: ['東京', '大阪', '名古屋', '札幌', '福岡', '京都'],
      ko: ['서울', '부산', '인천', '대구', '대전', '광주'],
      es: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga'],
      pt: ['São Paulo', 'Rio de Janeiro', 'Lisboa', 'Porto', 'Brasília', 'Salvador'],
      fr: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'],
      de: ['Berlin', 'München', 'Hamburg', 'Frankfurt', 'Köln', 'Stuttgart'],
      ru: ['Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург', 'Казань', 'Сочи'],
      ar: ['القاهرة', 'دبي', 'الرياض', 'جدة', 'بيروت', 'عمان'],
    };
    const list = cities[locale] || cities.en;
    return list[Math.floor(Math.random() * list.length)];
  },
  country: (locale) => {
    const countries: Record<string, string[]> = {
      en: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France'],
      zh: ['中国', '美国', '日本', '韩国', '英国', '德国'],
      ja: ['日本', 'アメリカ', '中国', '韓国', 'イギリス', 'ドイツ'],
      ko: ['한국', '미국', '일본', '중국', '영국', '독일'],
      es: ['España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú'],
      pt: ['Brasil', 'Portugal', 'Angola', 'Moçambique', 'Cabo Verde', 'Guiné-Bissau'],
      fr: ['France', 'Canada', 'Belgique', 'Suisse', 'Maroc', 'Algérie'],
      de: ['Deutschland', 'Österreich', 'Schweiz', 'Luxemburg', 'Liechtenstein', 'Belgien'],
      ru: ['Россия', 'Украина', 'Беларусь', 'Казахстан', 'Узбекистан', 'Грузия'],
      ar: ['مصر', 'السعودية', 'الإمارات', 'الأردن', 'لبنان', 'المغرب'],
    };
    const list = countries[locale] || countries.en;
    return list[Math.floor(Math.random() * list.length)];
  },
  company: () => {
    const prefixes = ['Global', 'Tech', 'Digital', 'Smart', 'Future', 'Prime'];
    const suffixes = ['Corp', 'Inc', 'Ltd', 'Solutions', 'Systems', 'Group'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  },
  jobTitle: () => {
    const titles = ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'Marketing Manager', 'Sales Representative', 'HR Manager', 'CEO'];
    return titles[Math.floor(Math.random() * titles.length)];
  },
  date: () => {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
  },
  number: () => {
    return Math.floor(Math.random() * 10000).toString();
  },
  uuid: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  url: () => {
    const domains = ['example.com', 'test.org', 'sample.net', 'demo.io'];
    const paths = ['page', 'article', 'post', 'item', 'product'];
    return `https://${domains[Math.floor(Math.random() * domains.length)]}/${paths[Math.floor(Math.random() * paths.length)]}/${Math.floor(Math.random() * 1000)}`;
  },
  username: () => {
    const adjectives = ['cool', 'super', 'mega', 'ultra', 'pro', 'epic'];
    const nouns = ['user', 'coder', 'dev', 'ninja', 'guru', 'master'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}_${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`;
  },
};

const FIELD_TYPES: FieldType[] = ['name', 'firstName', 'lastName', 'email', 'phone', 'address', 'city', 'country', 'company', 'jobTitle', 'date', 'number', 'uuid', 'url', 'username'];

const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'zh', label: '中文' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'es', label: 'Español' },
  { value: 'pt', label: 'Português' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' },
];

export default function FakeDataGenerator() {
  const t = useTranslations('tools.fake-data-generator');
  const tg = useTranslations('tools');
  
  const [count, setCount] = useState(10);
  const [locale, setLocale] = useState('en');
  const [fields, setFields] = useState<Field[]>([
    { id: '1', name: 'name', type: 'name' },
    { id: '2', name: 'email', type: 'email' },
    { id: '3', name: 'phone', type: 'phone' },
  ]);
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [tableName, setTableName] = useState('users');
  const [copied, setCopied] = useState(false);

  const addField = () => {
    const id = Date.now().toString();
    setFields([...fields, { id, name: `field_${fields.length + 1}`, type: 'name' }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleGenerate = useCallback(() => {
    const generated: Record<string, string>[] = [];
    
    for (let i = 0; i < count; i++) {
      const record: Record<string, string> = {};
      for (const field of fields) {
        record[field.name] = generators[field.type](locale);
      }
      generated.push(record);
    }
    
    setData(generated);
  }, [count, locale, fields]);

  const handleClear = () => {
    setData([]);
  };

  const exportJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${row[h]}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportSql = () => {
    if (data.length === 0) return;
    
    const columns = Object.keys(data[0]);
    const values = data.map(row => {
      const vals = columns.map(c => `'${row[c].replace(/'/g, "''")}'`);
      return `(${vals.join(', ')})`;
    });
    
    const sql = `INSERT INTO ${tableName} (${columns.join(', ')})\nVALUES\n${values.join(',\n')};`;
    
    const blob = new Blob([sql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake-data.sql';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const json = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Configuration Section */}
      <div className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('count')}
          </label>
          <input
            type="number"
            min="1"
            max="1000"
            value={count}
            onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('locale')}
          </label>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {LOCALES.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fields Configuration */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('fields')}
          </label>
          <button
            onClick={addField}
            className="text-sm px-3 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50"
          >
            {t('addField')}
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <input
                type="text"
                value={field.name}
                onChange={(e) => updateField(field.id, { name: e.target.value })}
                placeholder={t('fieldName')}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <select
                value={field.type}
                onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {FIELD_TYPES.map(type => (
                  <option key={type} value={type}>{t(`types.${type}`)}</option>
                ))}
              </select>
              <button
                onClick={() => removeField(field.id)}
                className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg whitespace-nowrap"
                disabled={fields.length <= 1}
              >
                {t('removeField')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Table Name for SQL Export */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t('tableName')} (SQL)
        </label>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={handleGenerate} className="btn-primary">
          {t('generate')}
        </button>
        <button onClick={handleClear} className="btn-secondary">
          {tg('clear')}
        </button>
      </div>

      {/* Results Section */}
      {data.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('preview')} ({data.length})
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className={`text-sm px-3 py-1 rounded ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                }`}
              >
                {copied ? tg('copied') : tg('copy')}
              </button>
              <button
                onClick={exportJson}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportJson')}
              </button>
              <button
                onClick={exportCsv}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportCsv')}
              </button>
              <button
                onClick={exportSql}
                className="text-sm px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              >
                {t('exportSql')}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">#</th>
                  {fields.map(field => (
                    <th key={field.id} className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                      {field.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.slice(0, 20).map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-500 dark:text-gray-400">{index + 1}</td>
                    {fields.map(field => (
                      <td key={field.id} className="px-4 py-2 text-gray-900 dark:text-gray-100">
                        {row[field.name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length > 20 && (
              <div className="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
                ... and {data.length - 20} more rows
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
