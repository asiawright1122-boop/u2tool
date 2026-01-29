/**
 * 修复被错误翻译的工具名称
 */
const fs = require('fs');

const fixes = {
  'base64-image-converter': {
    en: { name: 'Base64 Image Converter', description: 'Convert images to Base64 strings and Base64 to images' },
    zh: { name: 'Base64 图片转换器', description: '将图片转换为 Base64 字符串，或将 Base64 转换为图片' },
    ja: { name: 'Base64 画像変換ツール', description: '画像を Base64 文字列に変換、または Base64 を画像に変換' },
    ko: { name: 'Base64 이미지 변환기', description: '이미지를 Base64 문자열로 변환하거나 Base64를 이미지로 변환' },
    es: { name: 'Convertidor de imágenes Base64', description: 'Convierte imágenes a cadenas Base64 y viceversa' },
    pt: { name: 'Conversor de imagens Base64', description: 'Converta imagens para strings Base64 e vice-versa' },
    fr: { name: 'Convertisseur d\'images Base64', description: 'Convertissez les images en chaînes Base64 et inversement' },
    de: { name: 'Base64 Bildkonverter', description: 'Konvertieren Sie Bilder in Base64-Zeichenfolgen und umgekehrt' },
    ru: { name: 'Конвертер изображений Base64', description: 'Конвертируйте изображения в строки Base64 и обратно' },
    ar: { name: 'محول صور Base64', description: 'تحويل الصور إلى سلاسل Base64 والعكس' }
  }
};

const languages = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

for (const lang of languages) {
  const filePath = `src/messages/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  for (const [toolSlug, langFixes] of Object.entries(fixes)) {
    const fix = langFixes[lang];
    if (fix && data.tools[toolSlug]) {
      Object.assign(data.tools[toolSlug], fix);
    }
  }
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✓ ${lang}.json`);
}

console.log('\n完成！');
