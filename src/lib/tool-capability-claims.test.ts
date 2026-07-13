import { describe, expect, it } from "vitest";
import { getPilotToolCapabilityProfiles } from "../config/tool-capabilities";
import {
  affirmativeClaimFixture,
  limitationClaimFixture,
} from "./tool-capability-claim-test-fixtures";
import { hasLocalizedCapabilityClaimDetector } from "./tool-capability-claim-taxonomy";
import { locales, type Locale } from "./i18n";
import { assessToolCapabilityClaims } from "./tool-capability-claims";

const hexGridLocaleFixtures: Record<
  Locale,
  { affirmative: string; limitation: string }
> = {
  en: {
    affirmative: "Opens local files and displays an offset grid.",
    limitation: "It does not open files or display an offset grid.",
  },
  zh: {
    affirmative: "可以打开本地文件并显示偏移网格。",
    limitation: "不能打开文件，也不显示偏移网格。",
  },
  ja: {
    affirmative: "ローカルファイルを開き、オフセットグリッドを表示できます。",
    limitation: "ファイルは開けず、オフセットグリッドも表示しません。",
  },
  ko: {
    affirmative: "로컬 파일을 열고 오프셋 그리드를 표시합니다.",
    limitation: "파일을 열 수 없고 오프셋 그리드도 표시하지 않습니다.",
  },
  es: {
    affirmative: "Abre archivos locales y muestra una cuadrícula de offsets.",
    limitation: "No abre archivos ni muestra una cuadrícula de offsets.",
  },
  pt: {
    affirmative: "Abre arquivos locais e mostra uma grade de offsets.",
    limitation: "Não abre arquivos nem mostra uma grade de offsets.",
  },
  fr: {
    affirmative: "Ouvre les fichiers locaux et affiche une grille d’offsets.",
    limitation: "N’ouvre pas de fichiers et n’affiche pas de grille d’offsets.",
  },
  de: {
    affirmative: "Öffnet lokale Dateien und zeigt ein Offset-Raster an.",
    limitation: "Öffnet keine Dateien und zeigt kein Offset-Raster an.",
  },
  ru: {
    affirmative: "Открывает локальные файлы и показывает сетку смещений.",
    limitation: "Не открывает файлы и не показывает сетку смещений.",
  },
  ar: {
    affirmative: "يفتح الملفات المحلية ويعرض شبكة الإزاحات.",
    limitation: "لا يفتح الملفات ولا يعرض شبكة الإزاحات.",
  },
};

const faqNoLocaleFixtures: Record<
  Locale,
  { question: string; answer: string }
> = {
  en: { question: "Does this tool execute SQL queries?", answer: "No." },
  zh: { question: "此工具会执行 SQL 查询吗？", answer: "否。" },
  ja: { question: "このツールはSQLクエリを実行しますか？", answer: "いいえ。" },
  ko: { question: "이 도구는 SQL 쿼리를 실행하나요?", answer: "아니요." },
  es: { question: "¿Esta herramienta ejecuta consultas SQL?", answer: "No." },
  pt: { question: "Esta ferramenta executa consultas SQL?", answer: "Não." },
  fr: { question: "Cet outil exécute-t-il des requêtes SQL ?", answer: "Non." },
  de: { question: "Führt dieses Tool SQL-Abfragen aus?", answer: "Nein." },
  ru: { question: "Этот инструмент выполняет SQL-запросы?", answer: "Нет." },
  ar: { question: "هل تنفذ هذه الأداة استعلامات SQL؟", answer: "لا." },
};

const faqRecommendationLocaleFixtures: Record<
  Locale,
  { currentSubject: string; external: string }
> = {
  en: {
    currentSubject:
      "Use this application to execute SQL queries against your database.",
    external: "Use your database server to execute SQL queries.",
  },
  zh: {
    currentSubject: "使用此应用程序执行 SQL 查询，并连接您的数据库。",
    external: "使用您的数据库服务器执行 SQL 查询。",
  },
  ja: {
    currentSubject:
      "このアプリケーションでSQLクエリを実行し、外部データベースを使用してください。",
    external: "外部データベースでSQLクエリを実行してください。",
  },
  ko: {
    currentSubject:
      "이 애플리케이션에서 SQL 쿼리를 실행하고 외부 데이터베이스를 사용하세요.",
    external: "외부 데이터베이스에서 SQL 쿼리를 실행하세요.",
  },
  es: {
    currentSubject:
      "Usa esta aplicación, que ejecuta consultas SQL en su base de datos.",
    external: "Usa su base de datos externa, que ejecuta consultas SQL.",
  },
  pt: {
    currentSubject:
      "Usa este aplicativo, que executa consultas SQL no seu banco de dados.",
    external: "Usa seu banco de dados externo, que executa consultas SQL.",
  },
  fr: {
    currentSubject:
      "Utilise cette application, qui exécute des requêtes SQL sur votre serveur.",
    external: "Utilise votre serveur externe, qui exécute des requêtes SQL.",
  },
  de: {
    currentSubject:
      "Nutzt diese Anwendung: Sie führt SQL-Abfragen mit Ihrer Datenbank aus.",
    external: "Nutzt Ihre externe Datenbank: Sie führt SQL-Abfragen aus.",
  },
  ru: {
    currentSubject:
      "Используйте это приложение: оно выполняет SQL-запросы на вашем внешнем сервере.",
    external: "Используйте внешний сервер: он выполняет SQL-запросы.",
  },
  ar: {
    currentSubject:
      "استخدم هذا التطبيق، فهو ينفذ استعلامات SQL عبر الخادم الخارجي.",
    external: "استخدم الخادم الخارجي، فهو ينفذ استعلامات SQL.",
  },
};

const faqDelayedExternalLocaleFixtures: Record<Locale, readonly string[]> = {
  en: [
    "Use our application to execute SQL queries against your database.",
    "Use the application to execute SQL queries against your external database.",
    "Use U2Tool to execute SQL queries against your database.",
  ],
  zh: [
    "使用我们的应用程序执行 SQL 查询，并连接您的数据库。",
    "使用该应用程序执行 SQL 查询，并连接您的外部数据库。",
    "使用 U2Tool 执行 SQL 查询，并连接您的数据库。",
  ],
  ja: [
    "私たちのアプリケーションでSQLクエリを実行し、外部データベースを使用してください。",
    "そのアプリケーションでSQLクエリを実行し、外部データベースを使用してください。",
    "U2ToolでSQLクエリを実行し、外部データベースを使用してください。",
  ],
  ko: [
    "우리 애플리케이션에서 SQL 쿼리를 실행하고 외부 데이터베이스를 사용하세요.",
    "그 애플리케이션에서 SQL 쿼리를 실행하고 외부 데이터베이스를 사용하세요.",
    "U2Tool에서 SQL 쿼리를 실행하고 외부 데이터베이스를 사용하세요.",
  ],
  es: [
    "Usa nuestra aplicación, que ejecuta consultas SQL contra su base de datos externa.",
    "Usa la aplicación, que ejecuta consultas SQL contra su base de datos externa.",
    "Usa U2Tool, que ejecuta consultas SQL contra su base de datos externa.",
  ],
  pt: [
    "Usa nosso aplicativo, que executa consultas SQL no seu banco de dados externo.",
    "Usa o aplicativo, que executa consultas SQL no seu banco de dados externo.",
    "Usa U2Tool, que executa consultas SQL no seu banco de dados externo.",
  ],
  fr: [
    "Utilise notre application, qui exécute des requêtes SQL sur votre serveur externe.",
    "Utilise l’application, qui exécute des requêtes SQL sur votre serveur externe.",
    "Utilise U2Tool, qui exécute des requêtes SQL sur votre serveur externe.",
  ],
  de: [
    "Nutzt unsere Anwendung: Sie führt SQL-Abfragen mit Ihrer externen Datenbank aus.",
    "Nutzt die Anwendung: Sie führt SQL-Abfragen mit Ihrer externen Datenbank aus.",
    "Nutzt U2Tool: Es führt SQL-Abfragen mit Ihrer externen Datenbank aus.",
  ],
  ru: [
    "Используйте наше приложение: оно выполняет SQL-запросы на вашем внешнем сервере.",
    "Используйте приложение: оно выполняет SQL-запросы на вашем внешнем сервере.",
    "Используйте U2Tool: он выполняет SQL-запросы на вашем внешнем сервере.",
  ],
  ar: [
    "استخدم تطبيقنا، فهو ينفذ استعلامات SQL عبر الخادم الخارجي.",
    "استخدم التطبيق، فهو ينفذ استعلامات SQL عبر الخادم الخارجي.",
    "استخدم U2Tool، فهو ينفذ استعلامات SQL عبر الخادم الخارجي.",
  ],
};

const localeFamilyFixtures: Record<
  Locale,
  Record<
    "grammar-checker" | "sql-query-optimizer" | "excel-viewer" | "typing-speed-test" | "gantt-chart-generator",
    { affirmative: string; limitation: string; code: string }
  >
> = {
  en: {
    "grammar-checker": { affirmative: "Uses AI for grammar checking.", limitation: "Does not use AI for grammar checking.", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "Executes SQL queries.", limitation: "Does not execute SQL queries.", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "Provides advanced regex filters.", limitation: "Does not provide advanced regex filters.", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "Offers a fixed timer.", limitation: "Does not offer a fixed timer.", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "Identifies task dependencies.", limitation: "Does not identify task dependencies.", code: "gantt-generator-dependencies-claim" },
  },
  zh: {
    "grammar-checker": { affirmative: "使用人工智能进行语法检查。", limitation: "不使用人工智能进行语法检查。", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "可以执行 SQL 查询。", limitation: "不能执行 SQL 查询。", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "提供正则表达式高级筛选。", limitation: "不提供正则表达式高级筛选。", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "提供固定计时器。", limitation: "不提供固定计时器。", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "识别任务依赖。", limitation: "不识别任务依赖。", code: "gantt-generator-dependencies-claim" },
  },
  ja: {
    "grammar-checker": { affirmative: "人工知能を使用して文法をチェックします。", limitation: "人工知能を使用して文法をチェックしません。", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "SQLクエリを実行できます。", limitation: "SQLクエリは実行できません。", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "正規表現による高度なフィルターを提供します。", limitation: "正規表現による高度なフィルターは提供しません。", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "固定タイマーを提供します。", limitation: "固定タイマーは提供しません。", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "タスク依存関係を識別します。", limitation: "タスク依存関係は識別しません。", code: "gantt-generator-dependencies-claim" },
  },
  ko: {
    "grammar-checker": { affirmative: "인공지능을 사용해 문법을 검사합니다.", limitation: "인공지능을 사용해 문법을 검사하지 않습니다.", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "SQL 쿼리를 실행합니다.", limitation: "SQL 쿼리를 실행하지 않습니다.", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "정규식 고급 필터를 제공합니다.", limitation: "정규식 고급 필터를 제공하지 않습니다.", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "고정 타이머를 제공합니다.", limitation: "고정 타이머를 제공하지 않습니다.", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "작업 종속성을 식별합니다.", limitation: "작업 종속성을 식별하지 않습니다.", code: "gantt-generator-dependencies-claim" },
  },
  es: {
    "grammar-checker": { affirmative: "Usa IA para la corrección gramatical.", limitation: "No usa IA para la corrección gramatical.", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "Ejecuta consultas SQL.", limitation: "No ejecuta consultas SQL.", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "Ofrece filtros avanzados con expresiones regulares.", limitation: "No ofrece filtros avanzados con expresiones regulares.", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "Ofrece un temporizador fijo.", limitation: "No ofrece un temporizador fijo.", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "Identifica dependencias entre tareas.", limitation: "No identifica dependencias entre tareas.", code: "gantt-generator-dependencies-claim" },
  },
  pt: {
    "grammar-checker": { affirmative: "Usa IA para correção gramatical.", limitation: "Não usa IA para correção gramatical.", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "Executa consultas SQL.", limitation: "Não executa consultas SQL.", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "Oferece filtros avançados com expressões regulares.", limitation: "Não oferece filtros avançados com expressões regulares.", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "Oferece um temporizador fixo.", limitation: "Não oferece um temporizador fixo.", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "Identifica dependências entre tarefas.", limitation: "Não identifica dependências entre tarefas.", code: "gantt-generator-dependencies-claim" },
  },
  fr: {
    "grammar-checker": { affirmative: "Utilise l’IA pour la correction grammaticale.", limitation: "N’utilise pas l’IA pour la correction grammaticale.", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "Exécute des requêtes SQL.", limitation: "N’exécute pas de requêtes SQL.", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "Offre des filtres avancés avec des expressions régulières.", limitation: "N’offre pas de filtres avancés avec des expressions régulières.", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "Offre un minuteur fixe.", limitation: "N’offre pas de minuteur fixe.", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "Identifie les dépendances entre tâches.", limitation: "N’identifie pas les dépendances entre tâches.", code: "gantt-generator-dependencies-claim" },
  },
  de: {
    "grammar-checker": { affirmative: "Verwendet KI für die Grammatikprüfung.", limitation: "Verwendet keine KI für die Grammatikprüfung.", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "Führt SQL-Abfragen aus.", limitation: "Führt keine SQL-Abfragen aus.", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "Bietet erweiterte Filter mit regulären Ausdrücken.", limitation: "Bietet keine erweiterten Filter mit regulären Ausdrücken.", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "Bietet einen festen Timer.", limitation: "Bietet keinen festen Timer.", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "Identifiziert Aufgabenabhängigkeiten.", limitation: "Identifiziert keine Aufgabenabhängigkeiten.", code: "gantt-generator-dependencies-claim" },
  },
  ru: {
    "grammar-checker": { affirmative: "Использует ИИ для проверки грамматики.", limitation: "Не использует ИИ для проверки грамматики.", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "Выполняет SQL-запросы.", limitation: "Не выполняет SQL-запросы.", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "Предлагает расширенные фильтры с регулярными выражениями.", limitation: "Не предлагает расширенные фильтры с регулярными выражениями.", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "Предлагает фиксированный таймер.", limitation: "Не предлагает фиксированный таймер.", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "Определяет зависимости задач.", limitation: "Не определяет зависимости задач.", code: "gantt-generator-dependencies-claim" },
  },
  ar: {
    "grammar-checker": { affirmative: "يستخدم الذكاء الاصطناعي لتدقيق القواعد.", limitation: "لا يستخدم الذكاء الاصطناعي لتدقيق القواعد.", code: "grammar-checker-ai-claim" },
    "sql-query-optimizer": { affirmative: "ينفذ استعلامات SQL.", limitation: "لا ينفذ استعلامات SQL.", code: "sql-optimizer-execution-claim" },
    "excel-viewer": { affirmative: "يوفر تصفية متقدمة بتعبيرات منتظمة.", limitation: "لا يوفر تصفية متقدمة بتعبيرات منتظمة.", code: "excel-viewer-advanced-filter-claim" },
    "typing-speed-test": { affirmative: "يوفر مؤقتًا ثابتًا.", limitation: "لا يوفر مؤقتًا ثابتًا.", code: "typing-speed-test-fixed-timer-claim" },
    "gantt-chart-generator": { affirmative: "يحدد تبعيات المهام.", limitation: "لا يحدد تبعيات المهام.", code: "gantt-generator-dependencies-claim" },
  },
};

describe("assessToolCapabilityClaims", () => {
  it.each(Object.entries(hexGridLocaleFixtures))(
    "enforces Hex file/grid claims in %s without blocking truthful limitations",
    (locale, fixture) => {
      const affirmative = assessToolCapabilityClaims({
        slug: "hex-editor",
        locale,
        text: fixture.affirmative,
      });
      const limitation = assessToolCapabilityClaims({
        slug: "hex-editor",
        locale,
        text: fixture.limitation,
      });

      expect(affirmative.issues.map((issue) => issue.code)).toContain(
        "hex-editor-grid-claim",
      );
      expect(limitation.issues).toEqual([]);
    },
  );

  it.each(Object.entries(localeFamilyFixtures))(
    "enforces every pilot claim family in %s without blocking truthful limitations",
    (locale, fixtures) => {
      for (const [slug, fixture] of Object.entries(fixtures)) {
        const affirmative = assessToolCapabilityClaims({
          slug,
          locale,
          text: fixture.affirmative,
        });
        const limitation = assessToolCapabilityClaims({
          slug,
          locale,
          text: fixture.limitation,
        });

        expect(affirmative.issues.map((issue) => issue.code), `${slug}/${locale}`).toContain(
          fixture.code,
        );
        expect(limitation.issues, `${slug}/${locale}`).toEqual([]);
      }
    },
  );

  it("has a deterministic detector for every governed claim in every UI locale", () => {
    for (const profile of getPilotToolCapabilityProfiles()) {
      for (const claim of profile.forbiddenClaims) {
        for (const locale of locales) {
          expect(
            hasLocalizedCapabilityClaimDetector(claim.code, locale),
            `${profile.slug}/${claim.code}/${locale}`,
          ).toBe(true);
        }
      }
    }
  });

  it("enforces every governed claim code in every UI locale and permits its honest limitation", () => {
    const failures: string[] = [];
    for (const profile of getPilotToolCapabilityProfiles()) {
      for (const claim of profile.forbiddenClaims) {
        for (const locale of locales) {
          const affirmative = assessToolCapabilityClaims({
            slug: profile.slug,
            locale,
            text: affirmativeClaimFixture(claim.code, locale),
          });
          const limitation = assessToolCapabilityClaims({
            slug: profile.slug,
            locale,
            text: limitationClaimFixture(claim.code, locale),
          });

          if (!affirmative.issues.some((issue) => issue.code === claim.code)) {
            failures.push(
              `${profile.slug}/${claim.code}/${locale}/affirmative`,
            );
          }
          if (limitation.issues.length > 0) {
            failures.push(
              `${profile.slug}/${claim.code}/${locale}/limitation:${limitation.issues.map((issue) => issue.code).join(",")}`,
            );
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("blocks Excel advanced-filter and multi-column-sort overclaims", () => {
    const advancedFilter = assessToolCapabilityClaims({
      slug: "excel-viewer",
      locale: "ar",
      text: "يوفر تصفية متعددة الشروط مع تعبيرات REGEX.",
    });
    const multiSort = assessToolCapabilityClaims({
      slug: "excel-viewer",
      locale: "de",
      text: "Bietet hierarchische Sortierung über mehrere Spalten.",
    });

    expect(advancedFilter.issues.map((issue) => issue.code)).toContain(
      "excel-viewer-advanced-filter-claim",
    );
    expect(multiSort.issues.map((issue) => issue.code)).toContain(
      "excel-viewer-multi-sort-claim",
    );
  });

  it("blocks the concrete Arabic Hex overclaim set from the 60-page audit", () => {
    const report = assessToolCapabilityClaims({
      slug: "hex-editor",
      locale: "ar",
      text: [
        "يسمح بتحليل البيانات الثنائية على مستوى البايت ويعرضها في جداول.",
        "اختر نوع التشفير من القائمة المنسدلة وحدد ترتيب البايت.",
        "تتيح الأداة التعديل المباشر على القيم السداسية.",
        "انقر على زر تصدير لحفظ النتيجة في ملف نصي.",
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "hex-editor-grid-claim",
        "hex-editor-byte-edit-claim",
        "hex-editor-unsupported-encoding-claim",
        "hex-editor-file-export-claim",
      ]),
    );
  });

  it("blocks the concrete Arabic Excel and German Gantt overclaims", () => {
    const excel = assessToolCapabilityClaims({
      slug: "excel-viewer",
      locale: "ar",
      text: [
        "تنشئ تمثيلاً بصرياً باستخدام HTML5 Canvas مع دعم التنسيق الشرطي.",
        "تستخدم فلترة متعددة الشروط مع تعبيرات REGEX.",
        "توفر فرزاً هرمياً عبر أعمدة متعددة.",
        "اضغط على تصدير البيانات لحفظ النتائج كملف CSV.",
      ].join("\n"),
    });
    const gantt = assessToolCapabilityClaims({
      slug: "gantt-chart-generator",
      locale: "de",
      text: "Der visuelle Zeitplan hilft, Aufgabenabhängigkeiten zu identifizieren.",
    });

    expect(excel.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        "excel-viewer-formatting-fidelity-claim",
        "excel-viewer-advanced-filter-claim",
        "excel-viewer-multi-sort-claim",
        "excel-viewer-export-claim",
      ]),
    );
    expect(gantt.issues.map((issue) => issue.code)).toContain(
      "gantt-generator-dependencies-claim",
    );
  });

  it.each([
    [
      "de",
      "Der visuelle Zeitplan hilft, Abhängigkeiten zu identifizieren. Planen Sie ein Bauvorhaben mit Meilensteinen.",
    ],
    [
      "ja",
      "視覚的なタイムラインは、タスクの依存関係を特定するのに役立ちます。マイルストーンを含む建設プロジェクトを計画します。",
    ],
    [
      "pt",
      "A linha do tempo visual ajuda a identificar dependências de tarefas. Planeje um projeto com marcos.",
    ],
    [
      "fr",
      "La chronologie visuelle aide à identifier les dépendances des tâches. Planifiez un projet avec des jalons.",
    ],
    [
      "ru",
      "Визуальный график помогает определить зависимости задач. Планируйте проект с вехами.",
    ],
  ] as const)(
    "blocks the current %s Gantt dependency and milestone copy",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "gantt-chart-generator",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toEqual(
        expect.arrayContaining([
          "gantt-generator-dependencies-claim",
          "gantt-generator-milestones-claim",
        ]),
      );
    },
  );

  it("blocks native Russian grammar claims while the engine is English-only", () => {
    const report = assessToolCapabilityClaims({
      slug: "grammar-checker",
      locale: "ru",
      text: "Проверяет русскую грамматику, орфографию и пунктуацию.",
    });

    expect(report.governed).toBe(true);
    expect(report.issues.map((issue) => issue.code)).toContain(
      "grammar-checker-native-non-english-claim",
    );
  });

  it("allows explicit English-input disclosure on a Russian UI page", () => {
    const report = assessToolCapabilityClaims({
      slug: "grammar-checker",
      locale: "ru",
      text: "Интерфейс переведен на русский язык, но локальная проверка предназначена для английского текста.",
    });

    expect(report.issues).toEqual([]);
  });

  it("does not block a non-governed legacy tool", () => {
    const report = assessToolCapabilityClaims({
      slug: "json-formatter",
      locale: "en",
      text: "Format JSON in your browser.",
    });

    expect(report).toEqual({ governed: false, issues: [] });
  });

  it("preserves FAQ question context when a bare affirmative answer confirms an overclaim", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "en",
      text: "Does this tool execute SQL queries?\nYes.",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not turn a FAQ question with a bare negative answer into an overclaim", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "en",
      text: "Does this tool execute SQL queries?\nNo.",
    });

    expect(report.issues).toEqual([]);
  });

  it("keeps a bare negative FAQ answer associated with its explanation", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "en",
      text: [
        "Can it replace EXPLAIN ANALYZE?",
        "No. Use your database's EXPLAIN tools for real execution plans.",
      ].join("\n"),
    });

    expect(report.issues).toEqual([]);
  });

  it("does not let a bare negative FAQ answer mask a contradictory explanation", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "en",
      text: [
        "Does this tool execute SQL queries?",
        "No. It executes SQL queries anyway.",
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not treat this application as an external FAQ recommendation", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "en",
      text: [
        "Does this tool execute SQL queries?",
        "No. Use this application to execute SQL queries against your database.",
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not treat this application server as an external FAQ recommendation", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "en",
      text: [
        "Does this tool execute SQL queries?",
        "No. Run SQL queries on this application server.",
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not treat our application as externally owned because a database appears later", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "en",
      text: [
        "Does this tool execute SQL queries?",
        "No. Use our application to execute SQL queries against your database.",
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    "Use the application to execute SQL queries against your external database.",
    "Use U2Tool to execute SQL queries against your database.",
  ])(
    "does not treat a current or definite object as external: %s",
    (explanation) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale: "en",
        text: [
          "Does this tool execute SQL queries?",
          `No. ${explanation}`,
        ].join("\n"),
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each(locales)(
    "distinguishes current-subject and explicitly external FAQ recommendations in %s",
    (locale) => {
      const faq = faqNoLocaleFixtures[locale];
      const recommendations = faqRecommendationLocaleFixtures[locale];
      const currentSubject = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text: [
          faq.question,
          `${faq.answer} ${recommendations.currentSubject}`,
        ].join("\n"),
      });
      const external = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text: [
          faq.question,
          `${faq.answer} ${recommendations.external}`,
        ].join("\n"),
      });

      expect(currentSubject.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
      expect(external.issues).toEqual([]);
    },
  );

  it.each(locales)(
    "does not let a later external noun reclassify the direct FAQ object in %s",
    (locale) => {
      const faq = faqNoLocaleFixtures[locale];
      const failures = faqDelayedExternalLocaleFixtures[locale].filter(
        (explanation) => {
          const report = assessToolCapabilityClaims({
            slug: "sql-query-optimizer",
            locale,
            text: [faq.question, `${faq.answer} ${explanation}`].join("\n"),
          });
          return !report.issues.some(
            (issue) => issue.code === "sql-optimizer-execution-claim",
          );
        },
      );

      expect(failures).toEqual([]);
    },
  );

  it("does not suppress a Japanese modifier-first recommendation for this application", () => {
    const faq = faqNoLocaleFixtures.ja;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: [
        faq.question,
        `${faq.answer} 外部データベースに接続したこのアプリケーションでSQLクエリを実行してください。`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not suppress a Japanese modifier-first recommendation located in our application", () => {
    const faq = faqNoLocaleFixtures.ja;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: [
        faq.question,
        `${faq.answer} 外部データベースに接続した私たちのアプリケーションでSQLクエリを実行してください。`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not suppress a Korean modifier-first recommendation for this application", () => {
    const faq = faqNoLocaleFixtures.ko;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ko",
      text: [
        faq.question,
        `${faq.answer} 외부 데이터베이스에 연결된 이 애플리케이션에서 SQL 쿼리를 실행하세요.`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    [
      "ja",
      "外部データベースに接続した当アプリケーションでSQLクエリを実行してください。",
    ],
    [
      "ja",
      "外部データベースに接続した本アプリケーションでSQLクエリを実行してください。",
    ],
    [
      "ja",
      "外部データベースに接続したこのWebアプリケーションでSQLクエリを実行してください。",
    ],
    [
      "ko",
      "외부 데이터베이스에 연결된 우리 애플리케이션에서 SQL 쿼리를 실행하세요.",
    ],
    [
      "ko",
      "외부 데이터베이스에 연결된 본 애플리케이션에서 SQL 쿼리를 실행하세요.",
    ],
    [
      "ko",
      "외부 데이터베이스에 연결된 이 웹 애플리케이션에서 SQL 쿼리를 실행하세요.",
    ],
  ] as const)(
    "flags a formal current-location modifier in %s: %s",
    (locale, explanation) => {
      const faq = faqNoLocaleFixtures[locale];
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text: [faq.question, `${faq.answer} ${explanation}`].join("\n"),
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    [
      "ja",
      "外部データベースに接続した別のアプリケーションでSQLクエリを実行してください。",
    ],
    [
      "ko",
      "외부 데이터베이스에 연결된 다른 애플리케이션에서 SQL 쿼리를 실행하세요.",
    ],
  ] as const)(
    "allows an honest modifier-first external FAQ recommendation in %s",
    (locale, explanation) => {
      const faq = faqNoLocaleFixtures[locale];
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text: [faq.question, `${faq.answer} ${explanation}`].join("\n"),
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    [
      "ja",
      "外部データベースに接続した別のアプリケーションで、このツールが生成したSQLクエリを実行してください。",
    ],
    [
      "ko",
      "외부 데이터베이스에 연결된 다른 애플리케이션에서 이 도구가 생성한 SQL 쿼리를 실행하세요.",
    ],
  ] as const)(
    "allows an external execution location when the current tool is only the generator in %s",
    (locale, explanation) => {
      const faq = faqNoLocaleFixtures[locale];
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text: [faq.question, `${faq.answer} ${explanation}`].join("\n"),
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each(locales)(
    "flags a contradictory bare-No FAQ explanation in %s",
    (locale) => {
      const fixture = faqNoLocaleFixtures[locale];
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text: [
          fixture.question,
          `${fixture.answer} ${affirmativeClaimFixture(
            "sql-optimizer-execution-claim",
            locale,
          )}`,
        ].join("\n"),
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each(locales)(
    "allows an honest bare-No FAQ limitation in %s",
    (locale) => {
      const fixture = faqNoLocaleFixtures[locale];
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text: [
          fixture.question,
          `${fixture.answer} ${limitationClaimFixture(
            "sql-optimizer-execution-claim",
            locale,
          )}`,
        ].join("\n"),
      });

      expect(report.issues).toEqual([]);
    },
  );

  it("scans the affirmative side of a mixed positive/negative clause", () => {
    const report = assessToolCapabilityClaims({
      slug: "hex-editor",
      locale: "en",
      text: "It does not open files, but it edits individual bytes directly.",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "hex-editor-byte-edit-claim",
    );
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "hex-editor-grid-claim",
    );
  });

  it("does not let an unrelated previous limitation mask the next assertion", () => {
    const report = assessToolCapabilityClaims({
      slug: "hex-editor",
      locale: "en",
      text: "No file export. Edits individual bytes directly.",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "hex-editor-byte-edit-claim",
    );
    expect(report.issues.map((issue) => issue.code)).not.toContain(
      "hex-editor-file-export-claim",
    );
  });

  it.each([
    ["de", "Kein Dateiexport. Ermöglicht, einzelne Bytes direkt zu bearbeiten."],
    ["zh", "不导出文件。可以直接编辑字节。"],
  ] as const)(
    "evaluates the assertion after an unrelated %s limitation independently",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "hex-editor",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "hex-editor-byte-edit-claim",
      );
      expect(report.issues.map((issue) => issue.code)).not.toContain(
        "hex-editor-file-export-claim",
      );
    },
  );

  it.each([
    ["en", "No file export. It does not edit individual bytes directly."],
    ["zh", "不导出文件。不能直接编辑字节。"],
  ] as const)(
    "allows an honest two-sentence limitation in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "hex-editor",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );
});
