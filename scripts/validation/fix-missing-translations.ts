#!/usr/bin/env node
import fs from 'fs-extra';
import * as path from 'path';

/**
 * 修复缺失的翻译键
 */

const MISSING_TRANSLATIONS = {
  ja: {
    'tools.toml-json.faqs': [
      { q: 'TOMLとは何ですか？', a: 'TOML（Tom\'s Obvious, Minimal Language）は、設定ファイル用の最小限の設定ファイル形式です。' },
      { q: 'TOMLをJSONに変換する理由は？', a: 'JSONはより広くサポートされており、多くのプログラミング言語やツールで使用できます。' },
      { q: 'このツールは無料ですか？', a: 'はい、完全に無料で、登録も不要です。' }
    ],
    'tools.html-encoder.faqs': [
      { q: 'HTMLエンコードとは何ですか？', a: 'HTMLエンコードは、特殊文字をHTMLエンティティに変換するプロセスです。' },
      { q: 'なぜHTMLエンコードが必要ですか？', a: 'XSS攻撃を防ぎ、HTMLコードが正しく表示されるようにするためです。' },
      { q: 'このツールは安全ですか？', a: 'はい、すべての処理はブラウザ内で行われ、データは送信されません。' }
    ]
  },
  ko: {
    'tools.toml-json.faqs': [
      { q: 'TOML이란 무엇인가요?', a: 'TOML(Tom\'s Obvious, Minimal Language)은 구성 파일을 위한 최소한의 구성 파일 형식입니다.' },
      { q: 'TOML을 JSON으로 변환하는 이유는?', a: 'JSON은 더 널리 지원되며 많은 프로그래밍 언어와 도구에서 사용할 수 있습니다.' },
      { q: '이 도구는 무료인가요?', a: '네, 완전히 무료이며 등록이 필요하지 않습니다.' }
    ]
  },
  es: {
    'tools.toml-json.faqs': [
      { q: '¿Qué es TOML?', a: 'TOML (Tom\'s Obvious, Minimal Language) es un formato de archivo de configuración mínimo para archivos de configuración.' },
      { q: '¿Por qué convertir TOML a JSON?', a: 'JSON es más ampliamente compatible y se puede usar en muchos lenguajes de programación y herramientas.' },
      { q: '¿Esta herramienta es gratuita?', a: 'Sí, es completamente gratuita y no requiere registro.' }
    ]
  },
  pt: {
    'tools.toml-json.faqs': [
      { q: 'O que é TOML?', a: 'TOML (Tom\'s Obvious, Minimal Language) é um formato de arquivo de configuração mínimo para arquivos de configuração.' },
      { q: 'Por que converter TOML para JSON?', a: 'JSON é mais amplamente suportado e pode ser usado em muitas linguagens de programação e ferramentas.' },
      { q: 'Esta ferramenta é gratuita?', a: 'Sim, é completamente gratuita e não requer registro.' }
    ]
  },
  fr: {
    'tools.toml-json.faqs': [
      { q: 'Qu\'est-ce que TOML ?', a: 'TOML (Tom\'s Obvious, Minimal Language) est un format de fichier de configuration minimal pour les fichiers de configuration.' },
      { q: 'Pourquoi convertir TOML en JSON ?', a: 'JSON est plus largement pris en charge et peut être utilisé dans de nombreux langages de programmation et outils.' },
      { q: 'Cet outil est-il gratuit ?', a: 'Oui, il est entièrement gratuit et ne nécessite aucune inscription.' }
    ]
  },
  de: {
    'tools.toml-json.faqs': [
      { q: 'Was ist TOML?', a: 'TOML (Tom\'s Obvious, Minimal Language) ist ein minimales Konfigurationsdateiformat für Konfigurationsdateien.' },
      { q: 'Warum TOML in JSON konvertieren?', a: 'JSON wird breiter unterstützt und kann in vielen Programmiersprachen und Tools verwendet werden.' },
      { q: 'Ist dieses Tool kostenlos?', a: 'Ja, es ist völlig kostenlos und erfordert keine Registrierung.' }
    ],
    'tools.xml-formatter.faqs': [
      { q: 'Was ist XML-Formatierung?', a: 'XML-Formatierung ist der Prozess, XML-Code lesbar und gut strukturiert zu machen.' },
      { q: 'Warum XML formatieren?', a: 'Formatiertes XML ist einfacher zu lesen, zu debuggen und zu warten.' },
      { q: 'Ist dieses Tool sicher?', a: 'Ja, alle Verarbeitungen erfolgen in Ihrem Browser und Daten werden nicht übertragen.' }
    ]
  },
  ru: {
    'tools.toml-json.faqs': [
      { q: 'Что такое TOML?', a: 'TOML (Tom\'s Obvious, Minimal Language) - это минимальный формат файла конфигурации для файлов конфигурации.' },
      { q: 'Зачем конвертировать TOML в JSON?', a: 'JSON более широко поддерживается и может использоваться во многих языках программирования и инструментах.' },
      { q: 'Этот инструмент бесплатный?', a: 'Да, он полностью бесплатный и не требует регистрации.' }
    ],
    'tools.xml-formatter.faqs': [
      { q: 'Что такое форматирование XML?', a: 'Форматирование XML - это процесс создания читаемого и хорошо структурированного XML-кода.' },
      { q: 'Зачем форматировать XML?', a: 'Отформатированный XML легче читать, отлаживать и поддерживать.' },
      { q: 'Этот инструмент безопасен?', a: 'Да, вся обработка происходит в вашем браузере, и данные не передаются.' }
    ]
  },
  ar: {
    'tools.toml-json.faqs': [
      { q: 'ما هو TOML؟', a: 'TOML (Tom\'s Obvious, Minimal Language) هو تنسيق ملف تكوين بسيط لملفات التكوين.' },
      { q: 'لماذا تحويل TOML إلى JSON؟', a: 'JSON مدعوم على نطاق أوسع ويمكن استخدامه في العديد من لغات البرمجة والأدوات.' },
      { q: 'هل هذه الأداة مجانية؟', a: 'نعم، إنها مجانية تمامًا ولا تتطلب التسجيل.' }
    ],
    'tools.xml-formatter.faqs': [
      { q: 'ما هو تنسيق XML؟', a: 'تنسيق XML هو عملية جعل كود XML قابلاً للقراءة ومنظمًا بشكل جيد.' },
      { q: 'لماذا تنسيق XML؟', a: 'XML المنسق أسهل في القراءة والتصحيح والصيانة.' },
      { q: 'هل هذه الأداة آمنة؟', a: 'نعم، تتم جميع المعالجات في متصفحك ولا يتم نقل البيانات.' }
    ]
  }
};

async function addMissingTranslations() {
  console.log('🔧 开始修复缺失的翻译...\n');
  
  let fixedCount = 0;
  
  for (const [locale, translations] of Object.entries(MISSING_TRANSLATIONS)) {
    const filePath = path.join('src/messages', `${locale}.json`);
    
    if (!(await fs.pathExists(filePath))) {
      console.warn(`  ⚠️  文件不存在: ${locale}.json`);
      continue;
    }
    
    const content = await fs.readJSON(filePath);
    
    for (const [key, value] of Object.entries(translations)) {
      const keys = key.split('.');
      let current: any = content;
      
      // 导航到正确的位置
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // 添加缺失的键
      const lastKey = keys[keys.length - 1];
      if (!current[lastKey]) {
        current[lastKey] = value;
        console.log(`  ✅ 已添加: ${locale} - ${key}`);
        fixedCount++;
      } else {
        console.log(`  ⏭️  已存在: ${locale} - ${key}`);
      }
    }
    
    // 保存文件
    await fs.writeJSON(filePath, content, { spaces: 2 });
  }
  
  console.log(`\n📊 修复统计:`);
  console.log(`  ✅ 已添加: ${fixedCount} 个翻译键`);
}

addMissingTranslations().catch(console.error);
