#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { pathToFileURL } from 'url';
import { tools } from '../../src/config/tools/index';
import type { ToolCategory } from '../../src/config/tools/types';
import { locales, type Locale } from '../../src/lib/i18n';

type Faq = {
  question: string;
  answer: string;
};

type LocaleToolCopy = {
  name: string;
  description: string;
  seo_title: string;
  seo_description: string;
  detailed_description?: string;
  usage_steps?: string[];
  usage_examples?: string[];
  faqs?: Faq[];
};

type ToolSpec = {
  slug: string;
  category: ToolCategory;
  icon: string;
  component?: string;
  popular?: boolean;
  search_intent?: string;
  aliases?: string[];
  locales: Partial<Record<Locale, LocaleToolCopy>>;
};

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };

type SupportTemplate = {
  detailSuffix: string;
  usageSteps: string[];
  usageExamples: string[];
  freeQuestion: string;
  freeAnswer: string;
  privacyQuestion: string;
  privacyAnswer: string;
  noteQuestion: string;
  noteAnswer: string;
};

const CATEGORY_CONFIG: Record<ToolCategory, { file: string; exportName: string }> = {
  text: { file: 'src/config/tools/text.ts', exportName: 'TEXT_TOOLS' },
  encoding: { file: 'src/config/tools/encoding.ts', exportName: 'ENCODING_TOOLS' },
  generators: { file: 'src/config/tools/generators.ts', exportName: 'GENERATORS_TOOLS' },
  converters: { file: 'src/config/tools/converters.ts', exportName: 'CONVERTERS_TOOLS' },
  development: { file: 'src/config/tools/development.ts', exportName: 'DEVELOPMENT_TOOLS' },
  security: { file: 'src/config/tools/security.ts', exportName: 'SECURITY_TOOLS' },
  network: { file: 'src/config/tools/network.ts', exportName: 'NETWORK_TOOLS' },
  image: { file: 'src/config/tools/image.ts', exportName: 'IMAGE_TOOLS' },
  math: { file: 'src/config/tools/math.ts', exportName: 'MATH_TOOLS' },
  charts: { file: 'src/config/tools/charts.ts', exportName: 'CHARTS_TOOLS' },
  office: { file: 'src/config/tools/office.ts', exportName: 'OFFICE_TOOLS' },
  lifestyle: { file: 'src/config/tools/lifestyle.ts', exportName: 'LIFESTYLE_TOOLS' },
  finance: { file: 'src/config/tools/finance.ts', exportName: 'FINANCE_TOOLS' },
  fun: { file: 'src/config/tools/fun.ts', exportName: 'FUN_TOOLS' },
};

const SUPPORT_TEMPLATES: Record<Locale, SupportTemplate> = {
  en: {
    detailSuffix: 'Review the calculated or generated result.',
    usageSteps: [
      'Enter the required values in the form',
      'Review the calculated or generated result',
      'Copy the result or use the preview shown',
      'Adjust values to compare another scenario',
    ],
    usageExamples: [
      'Use it during a quick review or planning session',
      'Compare scenarios without creating a spreadsheet',
      'Create copy-ready results for reports, campaigns, or notes',
    ],
    freeQuestion: '{name} is free?',
    freeAnswer: 'Yes. The tool runs free in the browser and does not require an account.',
    privacyQuestion: 'Does the tool upload my inputs?',
    privacyAnswer: 'No. The calculation or generation runs locally in the browser.',
    noteQuestion: 'Is there any important note?',
    noteAnswer: 'Use the result as a practical helper and review it before publishing or relying on it.',
  },
  zh: {
    detailSuffix: '查看计算或生成结果。',
    usageSteps: ['在表单中输入所需值', '查看计算或生成结果', '复制结果或使用显示的预览', '调整数值以比较另一个场景'],
    usageExamples: ['用于快速检查或计划', '无需创建表格即可比较场景', '生成可复制到报告、活动或笔记中的结果'],
    freeQuestion: '{name} 是免费的吗？',
    freeAnswer: '是的。该工具可在浏览器中免费使用，无需账户。',
    privacyQuestion: '工具会上传我的输入吗？',
    privacyAnswer: '不会。计算或生成逻辑在浏览器本地运行。',
    noteQuestion: '有什么重要提示？',
    noteAnswer: '请将结果作为实用辅助，并在发布或依赖前自行复核。',
  },
  ja: {
    detailSuffix: '計算または生成された結果を確認します。',
    usageSteps: ['フォームに必要な値を入力します', '計算または生成された結果を確認します', '結果をコピーするか、表示されたプレビューを使用します', '値を調整して別のシナリオを比較します'],
    usageExamples: ['短時間の確認や計画に使用します', 'スプレッドシートを作らずにシナリオを比較します', 'レポート、キャンペーン、メモに使える結果を作成します'],
    freeQuestion: '{name} は無料ですか？',
    freeAnswer: 'はい。ブラウザで無料で使え、アカウントは不要です。',
    privacyQuestion: '入力内容はアップロードされますか？',
    privacyAnswer: 'いいえ。計算または生成処理はブラウザ内で実行されます。',
    noteQuestion: '重要な注意点はありますか？',
    noteAnswer: '結果は実用的な補助として使い、公開または利用前に確認してください。',
  },
  ko: {
    detailSuffix: '계산되거나 생성된 결과를 확인하세요.',
    usageSteps: ['양식에 필요한 값을 입력합니다', '계산되거나 생성된 결과를 확인합니다', '결과를 복사하거나 표시된 미리보기를 사용합니다', '값을 조정해 다른 시나리오를 비교합니다'],
    usageExamples: ['빠른 검토나 계획 중에 사용하세요', '스프레드시트 없이 시나리오를 비교하세요', '보고서, 캠페인, 노트에 바로 쓸 수 있는 결과를 만드세요'],
    freeQuestion: '{name}은 무료인가요?',
    freeAnswer: '예. 이 도구는 브라우저에서 무료로 사용할 수 있으며 계정이 필요하지 않습니다.',
    privacyQuestion: '입력값이 업로드되나요?',
    privacyAnswer: '아니요. 계산 또는 생성은 브라우저에서 로컬로 실행됩니다.',
    noteQuestion: '중요한 참고 사항이 있나요?',
    noteAnswer: '결과는 실용적인 보조 자료로 사용하고 게시하거나 의존하기 전에 검토하세요.',
  },
  es: {
    detailSuffix: 'Revisa el resultado calculado o generado.',
    usageSteps: ['Introduce los valores requeridos en el formulario', 'Revisa el resultado calculado o generado', 'Copia el resultado o usa la vista previa mostrada', 'Ajusta los valores para comparar otro escenario'],
    usageExamples: ['Úsalo durante una revisión o planificación rápida', 'Compara escenarios sin crear una hoja de cálculo', 'Crea resultados listos para informes, campañas o notas'],
    freeQuestion: '¿{name} es gratis?',
    freeAnswer: 'Sí. La herramienta es gratuita en el navegador y no requiere cuenta.',
    privacyQuestion: '¿La herramienta sube mis datos?',
    privacyAnswer: 'No. El cálculo o la generación se ejecuta localmente en el navegador.',
    noteQuestion: '¿Hay alguna nota importante?',
    noteAnswer: 'Usa el resultado como ayuda práctica y revísalo antes de publicarlo o depender de él.',
  },
  pt: {
    detailSuffix: 'Revise o resultado calculado ou gerado.',
    usageSteps: ['Digite os valores necessários no formulário', 'Revise o resultado calculado ou gerado', 'Copie o resultado ou use a prévia exibida', 'Ajuste os valores para comparar outro cenário'],
    usageExamples: ['Use em uma revisão ou planejamento rápido', 'Compare cenários sem criar uma planilha', 'Crie resultados prontos para relatórios, campanhas ou notas'],
    freeQuestion: '{name} é grátis?',
    freeAnswer: 'Sim. A ferramenta é gratuita no navegador e não exige conta.',
    privacyQuestion: 'A ferramenta envia meus dados?',
    privacyAnswer: 'Não. O cálculo ou a geração roda localmente no navegador.',
    noteQuestion: 'Há alguma observação importante?',
    noteAnswer: 'Use o resultado como apoio prático e revise-o antes de publicar ou depender dele.',
  },
  fr: {
    detailSuffix: 'Vérifiez le résultat calculé ou généré.',
    usageSteps: ['Saisissez les valeurs requises dans le formulaire', 'Vérifiez le résultat calculé ou généré', 'Copiez le résultat ou utilisez l’aperçu affiché', 'Ajustez les valeurs pour comparer un autre scénario'],
    usageExamples: ['Utilisez-le pour une vérification ou une planification rapide', 'Comparez des scénarios sans créer de feuille de calcul', 'Créez des résultats prêts à copier pour rapports, campagnes ou notes'],
    freeQuestion: '{name} est-il gratuit ?',
    freeAnswer: 'Oui. L’outil fonctionne gratuitement dans le navigateur et ne nécessite pas de compte.',
    privacyQuestion: 'L’outil téléverse-t-il mes données ?',
    privacyAnswer: 'Non. Le calcul ou la génération s’exécute localement dans le navigateur.',
    noteQuestion: 'Y a-t-il une remarque importante ?',
    noteAnswer: 'Utilisez le résultat comme aide pratique et vérifiez-le avant publication ou utilisation.',
  },
  de: {
    detailSuffix: 'Prüfe das berechnete oder generierte Ergebnis.',
    usageSteps: ['Gib die erforderlichen Werte in das Formular ein', 'Prüfe das berechnete oder generierte Ergebnis', 'Kopiere das Ergebnis oder nutze die Vorschau', 'Passe Eingaben an, um ein weiteres Szenario zu vergleichen'],
    usageExamples: ['Nutze das Tool für schnelle Planung oder Prüfung', 'Vergleiche Szenarien ohne Tabellenkalkulation', 'Erstelle kopierfertige Ergebnisse für Berichte, Kampagnen oder Notizen'],
    freeQuestion: 'Ist {name} kostenlos?',
    freeAnswer: 'Ja. Das Tool ist im Browser kostenlos nutzbar und benötigt kein Konto.',
    privacyQuestion: 'Werden meine Eingaben hochgeladen?',
    privacyAnswer: 'Nein. Die Berechnung oder Generierung läuft lokal im Browser.',
    noteQuestion: 'Gibt es wichtige Hinweise?',
    noteAnswer: 'Nutze das Ergebnis als praktische Hilfe und prüfe es, bevor du es veröffentlichst oder dich darauf verlässt.',
  },
  ru: {
    detailSuffix: 'Проверьте рассчитанный или сгенерированный результат.',
    usageSteps: ['Введите необходимые значения в форму', 'Проверьте рассчитанный или сгенерированный результат', 'Скопируйте результат или используйте показанный предпросмотр', 'Измените значения, чтобы сравнить другой сценарий'],
    usageExamples: ['Используйте для быстрой проверки или планирования', 'Сравнивайте сценарии без создания таблицы', 'Создавайте готовые результаты для отчетов, кампаний или заметок'],
    freeQuestion: '{name} бесплатный?',
    freeAnswer: 'Да. Инструмент бесплатно работает в браузере и не требует учетной записи.',
    privacyQuestion: 'Инструмент загружает мои данные?',
    privacyAnswer: 'Нет. Расчет или генерация выполняется локально в браузере.',
    noteQuestion: 'Есть важное примечание?',
    noteAnswer: 'Используйте результат как практическую помощь и проверяйте его перед публикацией или использованием.',
  },
  ar: {
    detailSuffix: 'راجع النتيجة المحسوبة أو الناتجة.',
    usageSteps: ['أدخل القيم المطلوبة في النموذج', 'راجع النتيجة المحسوبة أو الناتجة', 'انسخ النتيجة أو استخدم المعاينة المعروضة', 'عدّل القيم لمقارنة سيناريو آخر'],
    usageExamples: ['استخدمها أثناء مراجعة أو تخطيط سريع', 'قارن السيناريوهات بدون إنشاء جدول بيانات', 'أنشئ نتائج جاهزة للنسخ للتقارير أو الحملات أو الملاحظات'],
    freeQuestion: 'هل {name} مجاني؟',
    freeAnswer: 'نعم. تعمل الأداة مجانًا في المتصفح ولا تتطلب حسابًا.',
    privacyQuestion: 'هل ترفع الأداة بياناتي؟',
    privacyAnswer: 'لا. تتم عملية الحساب أو التوليد محليًا داخل المتصفح.',
    noteQuestion: 'هل توجد ملاحظة مهمة؟',
    noteAnswer: 'استخدم النتيجة كمساعدة عملية وراجعها قبل النشر أو الاعتماد عليها.',
  },
};

function parseArgs(argv: string[]) {
  const args = {
    specPath: '',
    dryRun: false,
    skipImportMap: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--spec') {
      args.specPath = argv[index + 1] || '';
      index += 1;
      continue;
    }
    if (arg.startsWith('--spec=')) {
      args.specPath = arg.slice('--spec='.length);
      continue;
    }
    if (arg === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (arg === '--skip-import-map') {
      args.skipImportMap = true;
      continue;
    }
    if (!arg.startsWith('-') && !args.specPath) {
      args.specPath = arg;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!args.specPath) {
    throw new Error('Usage: npm run tools:onboard -- --spec path/to/tool-spec.json [--dry-run] [--skip-import-map]');
  }

  return args;
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readJson(filePath: string): JsonObject {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as JsonObject;
}

function writeJson(filePath: string, json: unknown, dryRun: boolean, changedFiles: Set<string>) {
  const next = `${JSON.stringify(json, null, 2)}\n`;
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  if (current === next) {
    return;
  }

  changedFiles.add(filePath);
  if (!dryRun) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, next);
  }
}

function validateSpec(spec: ToolSpec) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(spec.slug)) {
    throw new Error(`Invalid slug: ${spec.slug}`);
  }

  if (!CATEGORY_CONFIG[spec.category]) {
    throw new Error(`Invalid category: ${spec.category}`);
  }

  if (!spec.icon) {
    throw new Error('Spec must include icon');
  }

  if (!isPlainObject(spec.locales)) {
    throw new Error('Spec must include locales');
  }

  const missing: string[] = [];
  for (const locale of locales) {
    const copy = spec.locales[locale];
    if (!copy) {
      missing.push(`${locale}: missing locale copy`);
      continue;
    }

    for (const key of ['name', 'description', 'seo_title', 'seo_description'] as const) {
      if (!copy[key] || typeof copy[key] !== 'string') {
        missing.push(`${locale}: missing ${key}`);
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(`Tool spec is incomplete:\n${missing.map((item) => `- ${item}`).join('\n')}`);
  }
}

function ensureToolConfig(spec: ToolSpec, dryRun: boolean, changedFiles: Set<string>) {
  const existing = tools.find((tool) => tool.slug === spec.slug);
  if (existing) {
    console.log(`config: ${spec.slug} already exists in ${existing.category}`);
    return;
  }

  const config = CATEGORY_CONFIG[spec.category];
  const configPath = path.join(process.cwd(), config.file);
  const current = fs.readFileSync(configPath, 'utf8');
  const component = spec.component || 'PopularUtilityTool';
  const popular = spec.popular ? ', popular: true' : '';
  const newEntry = `  { slug: '${spec.slug}', category: '${spec.category}', icon: '${spec.icon}', component: '${component}'${popular} },\n`;
  const next = current.replace(/\];\s*$/, `${newEntry}];\n`);

  if (next === current) {
    throw new Error(`Unable to append tool entry to ${configPath}`);
  }

  changedFiles.add(configPath);
  if (!dryRun) {
    fs.writeFileSync(configPath, next);
  }
}

function ensureBaseMessages(spec: ToolSpec, dryRun: boolean, changedFiles: Set<string>) {
  for (const locale of locales) {
    const filePath = locale === 'en'
      ? path.join(process.cwd(), 'src/messages/en/base.json')
      : path.join(process.cwd(), `src/messages/${locale}/base.json`);
    const json = readJson(filePath);
    const toolsSection = isPlainObject(json.tools) ? json.tools : {};
    json.tools = toolsSection;
    const copy = spec.locales[locale] as LocaleToolCopy;

    toolsSection[spec.slug] = {
      name: copy.name,
      description: copy.description,
      seo_title: copy.seo_title,
      seo_description: copy.seo_description,
    };

    writeJson(filePath, json, dryRun, changedFiles);
  }
}

function renderTemplate(template: string, name: string) {
  return template.replace(/\{name\}/g, name);
}

function ensureSplitMessages(spec: ToolSpec, dryRun: boolean, changedFiles: Set<string>) {
  for (const locale of locales) {
    const copy = spec.locales[locale] as LocaleToolCopy;
    const support = SUPPORT_TEMPLATES[locale];
    const filePath = path.join(process.cwd(), `src/messages/${locale}/tools/${spec.slug}.json`);
    const detailSuffix = support.detailSuffix;
    const detailedDescription = copy.detailed_description || `${copy.name} — ${copy.description} ${detailSuffix}`;
    const splitMessages = {
      detailed_description: detailedDescription,
      usage_steps: copy.usage_steps || support.usageSteps,
      usage_examples: copy.usage_examples || support.usageExamples,
      faqs: copy.faqs || [
        {
          question: renderTemplate(support.freeQuestion, copy.name),
          answer: support.freeAnswer,
        },
        {
          question: support.privacyQuestion,
          answer: support.privacyAnswer,
        },
        {
          question: support.noteQuestion,
          answer: support.noteAnswer,
        },
      ],
    };

    writeJson(filePath, splitMessages, dryRun, changedFiles);
  }
}

function generateImportMap(dryRun: boolean, skipImportMap: boolean) {
  if (dryRun || skipImportMap) {
    return;
  }

  execFileSync('npx', ['tsx', 'scripts/generate-tool-import-map.ts'], {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

export function runToolOnboarding(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const specPath = path.resolve(process.cwd(), args.specPath);
  const spec = readJson(specPath) as ToolSpec;
  validateSpec(spec);

  const changedFiles = new Set<string>();
  ensureToolConfig(spec, args.dryRun, changedFiles);
  ensureBaseMessages(spec, args.dryRun, changedFiles);
  ensureSplitMessages(spec, args.dryRun, changedFiles);
  generateImportMap(args.dryRun, args.skipImportMap);

  console.log(args.dryRun ? 'Dry run complete.' : 'Tool onboarding complete.');
  if (changedFiles.size === 0) {
    console.log('No file changes needed.');
  } else {
    console.log('Changed files:');
    for (const file of changedFiles) {
      console.log(`- ${path.relative(process.cwd(), file)}`);
    }
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (invokedPath === import.meta.url) {
  runToolOnboarding();
}
