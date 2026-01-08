const fs = require('fs');
const path = require('path');

// New translation keys to add
const newKeys = {
  lastUpdated: {
    en: 'Last Updated',
    zh: '最后更新',
    ja: '最終更新',
    ko: '마지막 업데이트',
    es: 'Última actualización',
    pt: 'Última atualização',
    fr: 'Dernière mise à jour',
    de: 'Zuletzt aktualisiert',
    ru: 'Последнее обновление',
    ar: 'آخر تحديث',
  },
  updatedAgo: {
    en: 'Updated {time} ago',
    zh: '{time}前更新',
    ja: '{time}前に更新',
    ko: '{time} 전 업데이트됨',
    es: 'Actualizado hace {time}',
    pt: 'Atualizado há {time}',
    fr: 'Mis à jour il y a {time}',
    de: 'Vor {time} aktualisiert',
    ru: 'Обновлено {time} назад',
    ar: 'تم التحديث منذ {time}',
  },
  updating: {
    en: 'Updating exchange rates...',
    zh: '正在更新汇率...',
    ja: '為替レートを更新中...',
    ko: '환율 업데이트 중...',
    es: 'Actualizando tasas de cambio...',
    pt: 'Atualizando taxas de câmbio...',
    fr: 'Mise à jour des taux de change...',
    de: 'Wechselkurse werden aktualisiert...',
    ru: 'Обновление обменных курсов...',
    ar: 'تحديث أسعار الصرف...',
  },
  updateFailed: {
    en: 'Unable to fetch latest rates, using static rates',
    zh: '无法获取最新汇率，使用静态汇率',
    ja: '最新レートを取得できません。静的レートを使用しています',
    ko: '최신 환율을 가져올 수 없습니다. 정적 환율 사용 중',
    es: 'No se pueden obtener las tasas más recientes, usando tasas estáticas',
    pt: 'Não foi possível obter as taxas mais recentes, usando taxas estáticas',
    fr: 'Impossible de récupérer les derniers taux, utilisation des taux statiques',
    de: 'Aktuelle Kurse können nicht abgerufen werden, statische Kurse werden verwendet',
    ru: 'Не удалось получить последние курсы, используются статические курсы',
    ar: 'تعذر الحصول على أحدث الأسعار، استخدام الأسعار الثابتة',
  },
  usingStaticRates: {
    en: 'Using static rates (may not be up-to-date)',
    zh: '使用静态汇率（可能不是最新）',
    ja: '静的レートを使用中（最新ではない可能性があります）',
    ko: '정적 환율 사용 중 (최신이 아닐 수 있음)',
    es: 'Usando tasas estáticas (pueden no estar actualizadas)',
    pt: 'Usando taxas estáticas (podem não estar atualizadas)',
    fr: 'Utilisation de taux statiques (peuvent ne pas être à jour)',
    de: 'Statische Kurse werden verwendet (möglicherweise nicht aktuell)',
    ru: 'Используются статические курсы (могут быть неактуальными)',
    ar: 'استخدام الأسعار الثابتة (قد لا تكون محدثة)',
  },
  refresh: {
    en: 'Refresh',
    zh: '刷新',
    ja: '更新',
    ko: '새로고침',
    es: 'Actualizar',
    pt: 'Atualizar',
    fr: 'Actualiser',
    de: 'Aktualisieren',
    ru: 'Обновить',
    ar: 'تحديث',
  },
  rateSource: {
    en: 'Rate Source',
    zh: '汇率来源',
    ja: 'レートソース',
    ko: '환율 출처',
    es: 'Fuente de tasas',
    pt: 'Fonte de taxas',
    fr: 'Source des taux',
    de: 'Kursquelle',
    ru: 'Источник курсов',
    ar: 'مصدر الأسعار',
  },
  sourceApi: {
    en: 'Live API',
    zh: '实时 API',
    ja: 'ライブ API',
    ko: '실시간 API',
    es: 'API en vivo',
    pt: 'API ao vivo',
    fr: 'API en direct',
    de: 'Live-API',
    ru: 'Живой API',
    ar: 'API مباشر',
  },
  sourceCache: {
    en: 'Cached',
    zh: '缓存',
    ja: 'キャッシュ',
    ko: '캐시됨',
    es: 'En caché',
    pt: 'Em cache',
    fr: 'En cache',
    de: 'Zwischengespeichert',
    ru: 'Кэшировано',
    ar: 'مخزن مؤقتًا',
  },
  sourceFallback: {
    en: 'Static Data',
    zh: '静态数据',
    ja: '静的データ',
    ko: '정적 데이터',
    es: 'Datos estáticos',
    pt: 'Dados estáticos',
    fr: 'Données statiques',
    de: 'Statische Daten',
    ru: 'Статические данные',
    ar: 'بيانات ثابتة',
  },
};

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

locales.forEach((locale) => {
  const filePath = path.join(__dirname, '..', 'src', 'messages', `${locale}.json`);
  
  try {
    // Read the file
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Find currency-converter section
    if (!data.tools || !data.tools['currency-converter']) {
      console.log(`⚠️  ${locale}.json: currency-converter section not found`);
      return;
    }
    
    // Add new keys
    let added = 0;
    Object.keys(newKeys).forEach((key) => {
      if (!data.tools['currency-converter'][key]) {
        data.tools['currency-converter'][key] = newKeys[key][locale];
        added++;
      }
    });
    
    if (added > 0) {
      // Write back to file
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`✅ ${locale}.json: Added ${added} new keys`);
    } else {
      console.log(`✓  ${locale}.json: All keys already exist`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${locale}.json:`, error.message);
  }
});

console.log('\n✨ Translation keys added successfully!');
console.log('📝 Next step: Run `npx tsx scripts/split-translations.ts` to update split files');
