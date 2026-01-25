/**
 * 修复硬编码占位符问题
 * 为所有 10 种语言添加缺失的翻译键
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['en', 'zh', 'ja', 'ko', 'es', 'pt', 'fr', 'de', 'ru', 'ar'];
const MESSAGES_DIR = path.join(process.cwd(), 'src', 'messages');

// 需要添加的翻译键
const TRANSLATIONS = {
  'api-tester': {
    headerNamePlaceholder: {
      en: 'Header name',
      zh: '请求头名称',
      ja: 'ヘッダー名',
      ko: '헤더 이름',
      es: 'Nombre del encabezado',
      pt: 'Nome do cabeçalho',
      fr: 'Nom de l\'en-tête',
      de: 'Header-Name',
      ru: 'Имя заголовка',
      ar: 'اسم الترويسة',
    },
    headerValuePlaceholder: {
      en: 'Value',
      zh: '值',
      ja: '値',
      ko: '값',
      es: 'Valor',
      pt: 'Valor',
      fr: 'Valeur',
      de: 'Wert',
      ru: 'Значение',
      ar: 'القيمة',
    },
  },
  'changelog-generator': {
    projectNamePlaceholder: {
      en: 'My Project',
      zh: '我的项目',
      ja: 'マイプロジェクト',
      ko: '내 프로젝트',
      es: 'Mi Proyecto',
      pt: 'Meu Projeto',
      fr: 'Mon Projet',
      de: 'Mein Projekt',
      ru: 'Мой проект',
      ar: 'مشروعي',
    },
    projectUrlPlaceholder: {
      en: 'https://github.com/user/repo',
      zh: 'https://github.com/用户名/仓库名',
      ja: 'https://github.com/user/repo',
      ko: 'https://github.com/user/repo',
      es: 'https://github.com/usuario/repo',
      pt: 'https://github.com/usuario/repo',
      fr: 'https://github.com/utilisateur/repo',
      de: 'https://github.com/benutzer/repo',
      ru: 'https://github.com/user/repo',
      ar: 'https://github.com/user/repo',
    },
    versionPlaceholder: {
      en: '1.0.0',
      zh: '1.0.0',
      ja: '1.0.0',
      ko: '1.0.0',
      es: '1.0.0',
      pt: '1.0.0',
      fr: '1.0.0',
      de: '1.0.0',
      ru: '1.0.0',
      ar: '1.0.0',
    },
    itemPlaceholder: {
      en: 'Enter item...',
      zh: '输入条目...',
      ja: '項目を入力...',
      ko: '항목 입력...',
      es: 'Ingrese elemento...',
      pt: 'Digite o item...',
      fr: 'Entrez l\'élément...',
      de: 'Element eingeben...',
      ru: 'Введите элемент...',
      ar: 'أدخل العنصر...',
    },
  },
  'email-signature-generator': {
    namePlaceholder: {
      en: 'John Doe',
      zh: '张三',
      ja: '山田太郎',
      ko: '홍길동',
      es: 'Juan Pérez',
      pt: 'João Silva',
      fr: 'Jean Dupont',
      de: 'Max Mustermann',
      ru: 'Иван Иванов',
      ar: 'محمد أحمد',
    },
    titlePlaceholder: {
      en: 'Software Engineer',
      zh: '软件工程师',
      ja: 'ソフトウェアエンジニア',
      ko: '소프트웨어 엔지니어',
      es: 'Ingeniero de Software',
      pt: 'Engenheiro de Software',
      fr: 'Ingénieur Logiciel',
      de: 'Software-Ingenieur',
      ru: 'Инженер-программист',
      ar: 'مهندس برمجيات',
    },
    companyPlaceholder: {
      en: 'Acme Inc.',
      zh: '某某公司',
      ja: '株式会社サンプル',
      ko: '주식회사 예시',
      es: 'Empresa S.A.',
      pt: 'Empresa Ltda.',
      fr: 'Entreprise SARL',
      de: 'Firma GmbH',
      ru: 'ООО Компания',
      ar: 'شركة مثال',
    },
    emailPlaceholder: {
      en: 'john@example.com',
      zh: 'zhangsan@example.com',
      ja: 'yamada@example.com',
      ko: 'hong@example.com',
      es: 'juan@ejemplo.com',
      pt: 'joao@exemplo.com',
      fr: 'jean@exemple.com',
      de: 'max@beispiel.de',
      ru: 'ivan@example.com',
      ar: 'mohamed@example.com',
    },
    phonePlaceholder: {
      en: '+1 (555) 123-4567',
      zh: '+86 138 0000 0000',
      ja: '+81 90-1234-5678',
      ko: '+82 10-1234-5678',
      es: '+34 612 345 678',
      pt: '+55 11 98765-4321',
      fr: '+33 6 12 34 56 78',
      de: '+49 170 1234567',
      ru: '+7 999 123-45-67',
      ar: '+966 50 123 4567',
    },
    websitePlaceholder: {
      en: 'www.example.com',
      zh: 'www.example.com',
      ja: 'www.example.com',
      ko: 'www.example.com',
      es: 'www.ejemplo.com',
      pt: 'www.exemplo.com',
      fr: 'www.exemple.com',
      de: 'www.beispiel.de',
      ru: 'www.example.com',
      ar: 'www.example.com',
    },
    usernamePlaceholder: {
      en: 'johndoe',
      zh: 'zhangsan',
      ja: 'yamada',
      ko: 'honggildong',
      es: 'juanperez',
      pt: 'joaosilva',
      fr: 'jeandupont',
      de: 'maxmustermann',
      ru: 'ivanov',
      ar: 'mohamed',
    },
  },
  'github-readme-generator': {
    projectNamePlaceholder: {
      en: 'My Awesome Project',
      zh: '我的精彩项目',
      ja: '素晴らしいプロジェクト',
      ko: '멋진 프로젝트',
      es: 'Mi Proyecto Increíble',
      pt: 'Meu Projeto Incrível',
      fr: 'Mon Super Projet',
      de: 'Mein Tolles Projekt',
      ru: 'Мой Потрясающий Проект',
      ar: 'مشروعي الرائع',
    },
    descriptionPlaceholder: {
      en: 'A brief description of your project...',
      zh: '项目简介...',
      ja: 'プロジェクトの簡単な説明...',
      ko: '프로젝트에 대한 간단한 설명...',
      es: 'Una breve descripción de tu proyecto...',
      pt: 'Uma breve descrição do seu projeto...',
      fr: 'Une brève description de votre projet...',
      de: 'Eine kurze Beschreibung Ihres Projekts...',
      ru: 'Краткое описание вашего проекта...',
      ar: 'وصف موجز لمشروعك...',
    },
    authorPlaceholder: {
      en: 'John Doe',
      zh: '张三',
      ja: '山田太郎',
      ko: '홍길동',
      es: 'Juan Pérez',
      pt: 'João Silva',
      fr: 'Jean Dupont',
      de: 'Max Mustermann',
      ru: 'Иван Иванов',
      ar: 'محمد أحمد',
    },
    authorGithubPlaceholder: {
      en: 'johndoe',
      zh: 'zhangsan',
      ja: 'yamada',
      ko: 'honggildong',
      es: 'juanperez',
      pt: 'joaosilva',
      fr: 'jeandupont',
      de: 'maxmustermann',
      ru: 'ivanov',
      ar: 'mohamed',
    },
    featurePlaceholder: {
      en: 'Feature description...',
      zh: '功能描述...',
      ja: '機能の説明...',
      ko: '기능 설명...',
      es: 'Descripción de la característica...',
      pt: 'Descrição do recurso...',
      fr: 'Description de la fonctionnalité...',
      de: 'Funktionsbeschreibung...',
      ru: 'Описание функции...',
      ar: 'وصف الميزة...',
    },
    installationPlaceholder: {
      en: 'npm install your-package',
      zh: 'npm install your-package',
      ja: 'npm install your-package',
      ko: 'npm install your-package',
      es: 'npm install your-package',
      pt: 'npm install your-package',
      fr: 'npm install your-package',
      de: 'npm install your-package',
      ru: 'npm install your-package',
      ar: 'npm install your-package',
    },
    usagePlaceholder: {
      en: "import { something } from 'your-package';",
      zh: "import { something } from 'your-package';",
      ja: "import { something } from 'your-package';",
      ko: "import { something } from 'your-package';",
      es: "import { something } from 'your-package';",
      pt: "import { something } from 'your-package';",
      fr: "import { something } from 'your-package';",
      de: "import { something } from 'your-package';",
      ru: "import { something } from 'your-package';",
      ar: "import { something } from 'your-package';",
    },
  },
  'license-generator': {
    authorPlaceholder: {
      en: 'John Doe',
      zh: '张三',
      ja: '山田太郎',
      ko: '홍길동',
      es: 'Juan Pérez',
      pt: 'João Silva',
      fr: 'Jean Dupont',
      de: 'Max Mustermann',
      ru: 'Иван Иванов',
      ar: 'محمد أحمد',
    },
    yearPlaceholder: {
      en: '2024',
      zh: '2024',
      ja: '2024',
      ko: '2024',
      es: '2024',
      pt: '2024',
      fr: '2024',
      de: '2024',
      ru: '2024',
      ar: '2024',
    },
  },
  'pace-calculator': {
    hoursShort: {
      en: 'H',
      zh: '时',
      ja: '時',
      ko: '시',
      es: 'H',
      pt: 'H',
      fr: 'H',
      de: 'Std',
      ru: 'Ч',
      ar: 'س',
    },
    minutesShort: {
      en: 'M',
      zh: '分',
      ja: '分',
      ko: '분',
      es: 'M',
      pt: 'M',
      fr: 'M',
      de: 'Min',
      ru: 'М',
      ar: 'د',
    },
    secondsShort: {
      en: 'S',
      zh: '秒',
      ja: '秒',
      ko: '초',
      es: 'S',
      pt: 'S',
      fr: 'S',
      de: 'Sek',
      ru: 'С',
      ar: 'ث',
    },
  },
};

function updateTranslations() {
  for (const locale of LOCALES) {
    const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    for (const [toolSlug, keys] of Object.entries(TRANSLATIONS)) {
      if (!data.tools[toolSlug]) {
        console.log(`Warning: Tool ${toolSlug} not found in ${locale}.json`);
        continue;
      }
      
      for (const [key, translations] of Object.entries(keys)) {
        if (!data.tools[toolSlug][key]) {
          data.tools[toolSlug][key] = translations[locale];
          console.log(`Added ${toolSlug}.${key} to ${locale}.json`);
        }
      }
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }
  
  console.log('\n✅ 翻译键添加完成！');
  console.log('请运行: npx tsx scripts/split-translations.ts 更新拆分文件');
}

updateTranslations();
