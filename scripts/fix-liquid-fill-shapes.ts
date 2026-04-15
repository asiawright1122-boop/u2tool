#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

const locales = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];

const shapeTranslations = {
  en: {
    circle: 'Circle',
    rect: 'Rectangle',
    roundRect: 'Rounded Rectangle',
    triangle: 'Triangle',
    diamond: 'Diamond',
    pin: 'Pin',
    arrow: 'Arrow',
  },
  zh: {
    circle: '圆形',
    rect: '矩形',
    roundRect: '圆角矩形',
    triangle: '三角形',
    diamond: '菱形',
    pin: '图钉',
    arrow: '箭头',
  },
  ja: {
    circle: '円',
    rect: '長方形',
    roundRect: '角丸長方形',
    triangle: '三角形',
    diamond: 'ひし形',
    pin: 'ピン',
    arrow: '矢印',
  },
  ko: {
    circle: '원',
    rect: '직사각형',
    roundRect: '둥근 직사각형',
    triangle: '삼각형',
    diamond: '다이아몬드',
    pin: '핀',
    arrow: '화살표',
  },
  es: {
    circle: 'Círculo',
    rect: 'Rectángulo',
    roundRect: 'Rectángulo Redondeado',
    triangle: 'Triángulo',
    diamond: 'Diamante',
    pin: 'Alfiler',
    arrow: 'Flecha',
  },
  pt: {
    circle: 'Círculo',
    rect: 'Retângulo',
    roundRect: 'Retângulo Arredondado',
    triangle: 'Triângulo',
    diamond: 'Diamante',
    pin: 'Alfinete',
    arrow: 'Seta',
  },
  fr: {
    circle: 'Cercle',
    rect: 'Rectangle',
    roundRect: 'Rectangle Arrondi',
    triangle: 'Triangle',
    diamond: 'Diamant',
    pin: 'Épingle',
    arrow: 'Flèche',
  },
  de: {
    circle: 'Kreis',
    rect: 'Rechteck',
    roundRect: 'Abgerundetes Rechteck',
    triangle: 'Dreieck',
    diamond: 'Raute',
    pin: 'Stecknadel',
    arrow: 'Pfeil',
  },
  ru: {
    circle: 'Круг',
    rect: 'Прямоугольник',
    roundRect: 'Скругленный прямоугольник',
    triangle: 'Треугольник',
    diamond: 'Ромб',
    pin: 'Булавка',
    arrow: 'Стрелка',
  },
  ar: {
    circle: 'دائرة',
    rect: 'مستطيل',
    roundRect: 'مستطيل مستدير',
    triangle: 'مثلث',
    diamond: 'معين',
    pin: 'دبوس',
    arrow: 'سهم',
  },
};

async function fixLiquidFillShapes() {
  console.log('🔍 Checking liquid-fill-chart-generator shapes translations...\n');

  let totalFixed = 0;

  for (const locale of locales) {
    const filePath = path.join(process.cwd(), 'src/messages', `${locale}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${locale}.json not found, skipping...`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    if (!data.tools || !data.tools['liquid-fill-chart-generator']) {
      console.log(`⚠️  ${locale}: liquid-fill-chart-generator not found`);
      continue;
    }

    const tool = data.tools['liquid-fill-chart-generator'];
    
    // Check if shapes object exists
    if (!tool.shapes) {
      console.log(`✏️  ${locale}: Adding shapes object`);
      tool.shapes = shapeTranslations[locale as keyof typeof shapeTranslations];
      totalFixed++;
    } else {
      // Check each shape
      const shapes = shapeTranslations[locale as keyof typeof shapeTranslations];
      let missingShapes = false;
      
      for (const [key, value] of Object.entries(shapes)) {
        if (!tool.shapes[key]) {
          console.log(`✏️  ${locale}: Adding missing shape '${key}'`);
          tool.shapes[key] = value;
          missingShapes = true;
        }
      }
      
      if (missingShapes) {
        totalFixed++;
      } else {
        console.log(`✅ ${locale}: All shapes present`);
      }
    }

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  }

  console.log(`\n✅ Fixed ${totalFixed} language files`);
}

fixLiquidFillShapes().catch(console.error);
