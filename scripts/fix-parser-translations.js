const fs = require('fs');

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

// 需要添加的翻译键
const parserFixes = {
  'ical-parser': {
    en: { parse: 'Parse', uploadFile: 'Upload File', icsContent: 'iCal Content', foundEvents: 'Events Found', summary: 'Summary', start: 'Start', end: 'End', location: 'Location', exportJSON: 'Export JSON', inputPlaceholder: 'Paste iCal/ICS content here or upload a file...' },
    zh: { parse: '解析', uploadFile: '上传文件', icsContent: 'iCal 内容', foundEvents: '发现事件', summary: '摘要', start: '开始', end: '结束', location: '位置', exportJSON: '导出 JSON', inputPlaceholder: '在此粘贴 iCal/ICS 内容或上传文件...' },
    ja: { parse: '解析', uploadFile: 'ファイルをアップロード', icsContent: 'iCal コンテンツ', foundEvents: 'イベント発見', summary: '概要', start: '開始', end: '終了', location: '場所', exportJSON: 'JSON エクスポート', inputPlaceholder: 'iCal/ICS コンテンツをここに貼り付けるか、ファイルをアップロード...' },
    ko: { parse: '파싱', uploadFile: '파일 업로드', icsContent: 'iCal 내용', foundEvents: '이벤트 발견', summary: '요약', start: '시작', end: '종료', location: '위치', exportJSON: 'JSON 내보내기', inputPlaceholder: 'iCal/ICS 내용을 여기에 붙여넣거나 파일을 업로드...' },
    es: { parse: 'Analizar', uploadFile: 'Subir Archivo', icsContent: 'Contenido iCal', foundEvents: 'Eventos Encontrados', summary: 'Resumen', start: 'Inicio', end: 'Fin', location: 'Ubicación', exportJSON: 'Exportar JSON', inputPlaceholder: 'Pegue el contenido iCal/ICS aquí o suba un archivo...' },
    pt: { parse: 'Analisar', uploadFile: 'Enviar Arquivo', icsContent: 'Conteúdo iCal', foundEvents: 'Eventos Encontrados', summary: 'Resumo', start: 'Início', end: 'Fim', location: 'Local', exportJSON: 'Exportar JSON', inputPlaceholder: 'Cole o conteúdo iCal/ICS aqui ou envie um arquivo...' },
    fr: { parse: 'Analyser', uploadFile: 'Télécharger Fichier', icsContent: 'Contenu iCal', foundEvents: 'Événements Trouvés', summary: 'Résumé', start: 'Début', end: 'Fin', location: 'Lieu', exportJSON: 'Exporter JSON', inputPlaceholder: 'Collez le contenu iCal/ICS ici ou téléchargez un fichier...' },
    de: { parse: 'Analysieren', uploadFile: 'Datei Hochladen', icsContent: 'iCal Inhalt', foundEvents: 'Ereignisse Gefunden', summary: 'Zusammenfassung', start: 'Start', end: 'Ende', location: 'Ort', exportJSON: 'JSON Exportieren', inputPlaceholder: 'iCal/ICS-Inhalt hier einfügen oder Datei hochladen...' },
    ru: { parse: 'Разобрать', uploadFile: 'Загрузить Файл', icsContent: 'Содержимое iCal', foundEvents: 'Найдено Событий', summary: 'Сводка', start: 'Начало', end: 'Конец', location: 'Место', exportJSON: 'Экспорт JSON', inputPlaceholder: 'Вставьте содержимое iCal/ICS или загрузите файл...' },
    ar: { parse: 'تحليل', uploadFile: 'رفع ملف', icsContent: 'محتوى iCal', foundEvents: 'الأحداث الموجودة', summary: 'ملخص', start: 'البداية', end: 'النهاية', location: 'الموقع', exportJSON: 'تصدير JSON', inputPlaceholder: 'الصق محتوى iCal/ICS هنا أو ارفع ملف...' }
  },
  'vcard-parser': {
    en: { parse: 'Parse', uploadFile: 'Upload File', vcardContent: 'vCard Content', foundContacts: 'Contacts Found', unnamed: 'Unnamed Contact', exportJSON: 'Export JSON', inputPlaceholder: 'Paste vCard/VCF content here or upload a file...' },
    zh: { parse: '解析', uploadFile: '上传文件', vcardContent: 'vCard 内容', foundContacts: '发现联系人', unnamed: '未命名联系人', exportJSON: '导出 JSON', inputPlaceholder: '在此粘贴 vCard/VCF 内容或上传文件...' },
    ja: { parse: '解析', uploadFile: 'ファイルをアップロード', vcardContent: 'vCard コンテンツ', foundContacts: '連絡先発見', unnamed: '名前なし', exportJSON: 'JSON エクスポート', inputPlaceholder: 'vCard/VCF コンテンツをここに貼り付けるか、ファイルをアップロード...' },
    ko: { parse: '파싱', uploadFile: '파일 업로드', vcardContent: 'vCard 내용', foundContacts: '연락처 발견', unnamed: '이름 없음', exportJSON: 'JSON 내보내기', inputPlaceholder: 'vCard/VCF 내용을 여기에 붙여넣거나 파일을 업로드...' },
    es: { parse: 'Analizar', uploadFile: 'Subir Archivo', vcardContent: 'Contenido vCard', foundContacts: 'Contactos Encontrados', unnamed: 'Sin Nombre', exportJSON: 'Exportar JSON', inputPlaceholder: 'Pegue el contenido vCard/VCF aquí o suba un archivo...' },
    pt: { parse: 'Analisar', uploadFile: 'Enviar Arquivo', vcardContent: 'Conteúdo vCard', foundContacts: 'Contatos Encontrados', unnamed: 'Sem Nome', exportJSON: 'Exportar JSON', inputPlaceholder: 'Cole o conteúdo vCard/VCF aqui ou envie um arquivo...' },
    fr: { parse: 'Analyser', uploadFile: 'Télécharger Fichier', vcardContent: 'Contenu vCard', foundContacts: 'Contacts Trouvés', unnamed: 'Sans Nom', exportJSON: 'Exporter JSON', inputPlaceholder: 'Collez le contenu vCard/VCF ici ou téléchargez un fichier...' },
    de: { parse: 'Analysieren', uploadFile: 'Datei Hochladen', vcardContent: 'vCard Inhalt', foundContacts: 'Kontakte Gefunden', unnamed: 'Unbenannt', exportJSON: 'JSON Exportieren', inputPlaceholder: 'vCard/VCF-Inhalt hier einfügen oder Datei hochladen...' },
    ru: { parse: 'Разобрать', uploadFile: 'Загрузить Файл', vcardContent: 'Содержимое vCard', foundContacts: 'Найдено Контактов', unnamed: 'Без Имени', exportJSON: 'Экспорт JSON', inputPlaceholder: 'Вставьте содержимое vCard/VCF или загрузите файл...' },
    ar: { parse: 'تحليل', uploadFile: 'رفع ملف', vcardContent: 'محتوى vCard', foundContacts: 'جهات الاتصال الموجودة', unnamed: 'بدون اسم', exportJSON: 'تصدير JSON', inputPlaceholder: 'الصق محتوى vCard/VCF هنا أو ارفع ملف...' }
  }
};

// 处理每个语言文件
locales.forEach(locale => {
  const filePath = `src/messages/${locale}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  let modified = false;
  
  Object.entries(parserFixes).forEach(([toolSlug, translations]) => {
    const toolTranslations = translations[locale];
    if (!toolTranslations) return;
    
    if (!data.tools[toolSlug]) {
      console.log(`Warning: ${toolSlug} not found in ${locale}.json`);
      return;
    }
    
    Object.entries(toolTranslations).forEach(([key, value]) => {
      if (!data.tools[toolSlug][key]) {
        data.tools[toolSlug][key] = value;
        modified = true;
        console.log(`Added ${toolSlug}.${key} to ${locale}.json`);
      }
    });
  });
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`Updated ${locale}.json`);
  }
});

console.log('\nDone! Now run: npx tsx scripts/split-translations.ts');
