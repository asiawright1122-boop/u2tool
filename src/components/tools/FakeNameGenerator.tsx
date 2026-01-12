'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const nameData = {
  en: {
    male: ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle'],
    last: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'],
  },
  zh: {
    male: ['伟', '强', '磊', '军', '勇', '杰', '涛', '明', '超', '华', '建', '志', '刚', '斌', '鹏', '辉', '波', '宇', '浩', '凯'],
    female: ['芳', '娟', '敏', '静', '丽', '艳', '红', '梅', '玲', '霞', '燕', '秀', '英', '华', '慧', '婷', '雪', '琳', '晶', '倩'],
    last: ['王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗'],
  },
  ja: {
    male: ['太郎', '一郎', '健太', '翔太', '大輝', '拓海', '蓮', '悠真', '陽翔', '湊', '樹', '大和', '悠斗', '陽太', '颯太', '朝陽', '結翔', '蒼', '律', '伊織'],
    female: ['花子', '美咲', '陽菜', '結衣', '凛', '葵', '結菜', '咲良', '莉子', '芽依', '楓', '美月', '心春', '杏', '紬', '愛莉', '彩葉', '心結', '琴音', '詩'],
    last: ['佐藤', '鈴木', '高橋', '田中', '伊藤', '渡辺', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '斎藤', '清水'],
  },
  ko: {
    male: ['민준', '서준', '도윤', '예준', '시우', '하준', '주원', '지호', '지후', '준서', '준우', '현우', '도현', '건우', '우진', '선우', '서진', '민재', '현준', '연우'],
    female: ['서연', '서윤', '지우', '서현', '민서', '하은', '하윤', '윤서', '지유', '채원', '수아', '지민', '지아', '은서', '다은', '예은', '수빈', '지원', '소율', '예린'],
    last: ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '전'],
  },
  de: {
    male: ['Lukas', 'Leon', 'Finn', 'Paul', 'Jonas', 'Ben', 'Elias', 'Noah', 'Felix', 'Luis', 'Maximilian', 'Alexander', 'David', 'Tim', 'Niklas', 'Jan', 'Moritz', 'Julian', 'Philipp', 'Tom'],
    female: ['Emma', 'Mia', 'Hannah', 'Sofia', 'Anna', 'Emilia', 'Lena', 'Marie', 'Lea', 'Lina', 'Laura', 'Amelie', 'Johanna', 'Luisa', 'Clara', 'Sarah', 'Julia', 'Nele', 'Lara', 'Maja'],
    last: ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann'],
  },
  es: {
    male: ['Santiago', 'Mateo', 'Sebastián', 'Leonardo', 'Matías', 'Emiliano', 'Diego', 'Miguel', 'Daniel', 'Alejandro', 'Pablo', 'Nicolás', 'Samuel', 'Benjamín', 'Hugo', 'Martín', 'Lucas', 'Gabriel', 'David', 'Adrián'],
    female: ['Sofía', 'Valentina', 'Isabella', 'Camila', 'Valeria', 'Mariana', 'Luciana', 'Daniela', 'María', 'Gabriela', 'Victoria', 'Martina', 'Catalina', 'Emma', 'Sara', 'Paula', 'Elena', 'Natalia', 'Andrea', 'Ana'],
    last: ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 'Morales', 'Cruz', 'Ortiz', 'Gutiérrez', 'Chávez'],
  },
};

type Country = keyof typeof nameData;
type Gender = 'male' | 'female' | 'random';

export default function FakeNameGenerator() {
  const t = useTranslations('tools.fake-name-generator');
  const [country, setCountry] = useState<Country>('en');
  const [gender, setGender] = useState<Gender>('random');
  const [count, setCount] = useState(10);
  const [names, setNames] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generateNames = () => {
    const data = nameData[country];
    const generated: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const useGender = gender === 'random' 
        ? (Math.random() > 0.5 ? 'male' : 'female')
        : gender;
      
      const firstNames = data[useGender];
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = data.last[Math.floor(Math.random() * data.last.length)];
      
      if (country === 'zh' || country === 'ja' || country === 'ko') {
        generated.push(`${lastName}${firstName}`);
      } else {
        generated.push(`${firstName} ${lastName}`);
      }
    }
    
    setNames(generated);
  };

  const copyNames = () => {
    navigator.clipboard.writeText(names.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const countryLabels: Record<Country, string> = {
    en: t('english'),
    zh: t('chinese'),
    ja: t('japanese'),
    ko: t('korean'),
    de: t('german'),
    es: t('spanish'),
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('country')}
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as Country)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {Object.keys(nameData).map(c => (
              <option key={c} value={c}>{countryLabels[c as Country]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('gender')}
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="random">{t('random')}</option>
            <option value="male">{t('male')}</option>
            <option value="female">{t('female')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('count')}
          </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
            min="1"
            max="100"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={generateNames}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          🎲 {t('generate')}
        </button>
      </div>

      {names.length > 0 && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {t('generatedNames')} ({names.length})
            </h3>
            <button
              onClick={copyNames}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
            >
              {copied ? t('copied') : t('copyAll')}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {names.map((name, i) => (
              <div
                key={i}
                className="px-3 py-2 bg-white dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">{t('disclaimer')}</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-400">{t('disclaimerText')}</p>
      </div>
    </div>
  );
}
