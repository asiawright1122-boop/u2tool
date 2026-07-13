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

  it("uses the final Japanese location when an external source generates the query", () => {
    const faq = faqNoLocaleFixtures.ja;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: [
        faq.question,
        `${faq.answer} 外部データベースで生成したSQLクエリをこのアプリケーションで実行してください。`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("uses the final Korean location when an external source generates the query", () => {
    const faq = faqNoLocaleFixtures.ko;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ko",
      text: [
        faq.question,
        `${faq.answer} 외부 데이터베이스에서 생성한 SQL 쿼리를 이 애플리케이션에서 실행하세요.`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    [
      "ja",
      "別のアプリケーションで生成したSQLクエリをこのアプリケーションで実行してください。",
    ],
    [
      "ko",
      "다른 애플리케이션에서 생성한 SQL 쿼리를 이 애플리케이션에서 실행하세요.",
    ],
  ] as const)(
    "does not let an earlier external generator location authorize current execution in %s",
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

  it("binds a Japanese execution action before a later external check", () => {
    const faq = faqNoLocaleFixtures.ja;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: [
        faq.question,
        `${faq.answer} このアプリケーションでSQLクエリを実行し、結果を外部データベースで確認してください。`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not borrow a Japanese location from an earlier check action", () => {
    const faq = faqNoLocaleFixtures.ja;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: [
        faq.question,
        `${faq.answer} 結果を外部データベースで確認し、SQLクエリを実行してください。`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("binds a Korean execution action before a later external check", () => {
    const faq = faqNoLocaleFixtures.ko;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ko",
      text: [
        faq.question,
        `${faq.answer} 이 애플리케이션에서 SQL 쿼리를 실행하고 결과를 외부 데이터베이스에서 확인하세요.`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not borrow a Korean location from an earlier check action", () => {
    const faq = faqNoLocaleFixtures.ko;
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ko",
      text: [
        faq.question,
        `${faq.answer} 결과를 외부 데이터베이스에서 확인하고 SQL 쿼리를 실행하세요.`,
      ].join("\n"),
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    [
      "ja",
      "SQLクエリの構文を分析して、データベースでの実行方法を説明します。",
    ],
    [
      "ko",
      "SQL 쿼리 구문을 분석하고 데이터베이스에서 실행하는 방법을 설명합니다.",
    ],
  ] as const)(
    "does not treat explanatory execution prose as an execution action in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    ["ja", "SQLクエリの実行手順を表示します。"],
    ["ja", "SQLクエリの実行方法を説明します。"],
    ["ja", "SQLクエリの実行ガイドを表示します。"],
    ["ko", "SQL 쿼리 실행 단계를 표시합니다."],
    ["ko", "SQL 쿼리 실행 방법을 설명합니다."],
    ["ko", "SQL 쿼리 실행 지침을 표시합니다."],
  ] as const)(
    "does not treat displayed or explained execution guidance as execution in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    [
      "ja",
      "SQLクエリの実行方法を説明し、このアプリケーションでSQLクエリを実行します。",
    ],
    [
      "ko",
      "SQL 쿼리 실행 방법을 설명하고 이 애플리케이션에서 SQL 쿼리를 실행합니다.",
    ],
  ] as const)(
    "does not let execution guidance mask a separate affirmative action in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    [
      "ja",
      "別のアプリケーションでSQLクエリを実行し、結果をこのアプリケーションで確認してください。",
    ],
    [
      "ko",
      "다른 애플리케이션에서 SQL 쿼리를 실행하고 결과를 이 애플리케이션에서 확인하세요.",
    ],
  ] as const)(
    "binds an explicitly external location to its own execution action in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it("carries a Japanese SQL object into an adjacent execution action", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "SQLクエリを分析し、このアプリケーションで実行します。",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("carries a Korean SQL object into an adjacent execution action", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ko",
      text: "SQL 쿼리를 분석하고 이 애플리케이션에서 실행합니다.",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    [
      "ja",
      "SQLクエリの実行方法を説明し、このアプリケーションで実行します。",
    ],
    [
      "ko",
      "SQL 쿼리 실행 방법을 설명하고 이 애플리케이션에서 실행합니다.",
    ],
  ] as const)(
    "carries SQL context through meta guidance into an elided execution in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it("separates a Japanese after-clause from an unlocated execution", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "外部データベースでSQLクエリを分析した後、実行します。",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    [
      "ja",
      "外部データベースでSQLクエリを分析してから、実行します。",
    ],
    [
      "ja",
      "外部データベースでSQLクエリを分析したのち、実行します。",
    ],
    [
      "ko",
      "외부 데이터베이스에서 SQL 쿼리를 분석한 후 실행합니다.",
    ],
    [
      "ko",
      "외부 데이터베이스에서 SQL 쿼리를 분석한 다음 실행합니다.",
    ],
    [
      "ko",
      "외부 데이터베이스에서 SQL 쿼리를 분석하고 나서 실행합니다.",
    ],
  ] as const)(
    "separates temporal analysis from an unlocated execution in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    ["ja", "SQLクエリを分析し、別のアプリケーションで実行します。"],
    ["ko", "SQL 쿼리를 분석하고 다른 애플리케이션에서 실행합니다."],
  ] as const)(
    "carries SQL context without reclassifying external execution in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it("does not let a later Japanese negative action suppress execution", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "このアプリケーションでSQLクエリを実行できますが、結果は保存できません。",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("does not let a later Korean negative action suppress execution", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ko",
      text: "이 애플리케이션에서 SQL 쿼리를 실행할 수 있지만 결과는 저장할 수 없습니다.",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    ["ja", "このアプリケーションではSQLクエリを実行できません。"],
    ["ko", "이 애플리케이션에서는 SQL 쿼리를 실행할 수 없습니다."],
  ] as const)(
    "keeps direct negative execution clean in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it("lets a Japanese non-SQL direct object override carried SQL context", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "SQLクエリを分析し、このアプリケーションでテストを実行します。",
    });

    expect(report.issues).toEqual([]);
  });

  it("recognizes a Japanese nominalized cannot-execute predicate", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "このアプリケーションではSQLクエリを実行することはできません。",
    });

    expect(report.issues).toEqual([]);
  });

  it("separates a Japanese hiragana-after clause from execution", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "外部データベースでSQLクエリを分析したあと、実行します。",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    ["ko", "SQL 쿼리를 분석하고 이 애플리케이션에서 테스트를 실행합니다."],
    ["ja", "SQLクエリを分析し、このアプリケーションで処理を実行します。"],
    ["ja", "SQLクエリを分析し、このアプリケーションでタスクを実行します。"],
    [
      "ja",
      "SQLクエリを分析し、このアプリケーションでSQLクエリのテストを実行します。",
    ],
    ["ko", "SQL 쿼리를 분석하고 이 애플리케이션에서 프로세스를 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 이 애플리케이션에서 작업을 실행합니다."],
    [
      "ko",
      "SQL 쿼리를 분석하고 이 애플리케이션에서 SQL 쿼리 테스트를 실행합니다.",
    ],
  ] as const)(
    "lets an explicit non-SQL execution object override carried context in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    [
      "ja",
      "SQLクエリを分析し、テストを実行し、このアプリケーションで実行します。",
    ],
    [
      "ko",
      "SQL 쿼리를 분석하고 테스트를 실행하고 이 애플리케이션에서 실행합니다.",
    ],
  ] as const)(
    "keeps SQL context cleared after a non-SQL execution object in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    [
      "ja",
      "SQLクエリを分析し、テストを実行し、このアプリケーションでSQLクエリを実行します。",
    ],
    [
      "ko",
      "SQL 쿼리를 분석하고 테스트를 실행하고 이 애플리케이션에서 SQL 쿼리를 실행합니다.",
    ],
  ] as const)(
    "restores governed context for a later explicit SQL object in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    ["ja", "このアプリケーションではSQLクエリを実行できない。"],
    ["ja", "このアプリケーションではSQLクエリの実行には対応していません。"],
    ["ja", "このアプリケーションではSQLクエリを実行することができない。"],
    ["ja", "このアプリケーションではSQLクエリの実行には対応していない。"],
    ["ko", "이 애플리케이션에서는 SQL 쿼리를 실행할 수 없어요."],
    ["ko", "이 애플리케이션에서는 SQL 쿼리를 실행할 수 없다."],
    ["ko", "이 애플리케이션에서는 SQL 쿼리를 실행하지 못합니다."],
    ["ko", "이 애플리케이션에서는 SQL 쿼리를 실행하지 못해요."],
    ["ko", "이 애플리케이션에서는 SQL 쿼리를 실행하지 못한다."],
  ] as const)(
    "keeps execute-predicate-local negative morphology clean in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    [
      "ja",
      "外部データベースでSQLクエリを分析したあとに、実行します。",
    ],
    [
      "ja",
      "外部データベースでSQLクエリを分析したあとで、実行します。",
    ],
    [
      "ja",
      "外部データベースでSQLクエリを分析したあとから、実行します。",
    ],
    [
      "ko",
      "외부 데이터베이스에서 SQL 쿼리를 분석한 뒤 실행합니다.",
    ],
    [
      "ko",
      "외부 데이터베이스에서 SQL 쿼리를 분석한 뒤에 실행합니다.",
    ],
  ] as const)(
    "separates added temporal synonyms from execution in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    [
      "ja",
      "外部データベースで生成したSQLクエリをこのアプリケーションで実行します。",
    ],
    [
      "ko",
      "외부 데이터베이스에서 생성한 SQL 쿼리를 이 애플리케이션에서 실행합니다.",
    ],
  ] as const)(
    "preserves generated-query attributive forms in %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it("treats an explicit Japanese SQL statement object as governed", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "このアプリケーションでSQL文を実行します。",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it("clears carried SQL context for a Japanese topicalized test object", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "SQLクエリを分析し、テストはこのアプリケーションで実行します。",
    });

    expect(report.issues).toEqual([]);
  });

  it("recognizes a Japanese continuative cannot-execute predicate", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "このアプリケーションではSQL文を実行できず、分析のみ行います。",
    });

    expect(report.issues).toEqual([]);
  });

  it.each([
    ["ja", "このアプリケーションでSQL 文を実行します。"],
    ["ja", "このアプリケーションでクエリ文を実行します。"],
    ["ja", "このアプリケーションでクエリ 文を実行します。"],
    ["ja", "このアプリケーションでSQLクエリ文を実行します。"],
    ["ja", "このアプリケーションでSQLステートメントを実行します。"],
    ["ja", "SQL文はこのアプリケーションで実行します。"],
    ["ko", "이 애플리케이션에서 SQL 문을 실행합니다."],
    ["ko", "이 애플리케이션에서 SQL문을 실행합니다."],
    ["ko", "이 애플리케이션에서 쿼리문을 실행합니다."],
    ["ko", "이 애플리케이션에서 쿼리 문을 실행합니다."],
    ["ko", "이 애플리케이션에서 SQL 쿼리문을 실행합니다."],
    ["ko", "이 애플리케이션에서 SQL쿼리문을 실행합니다."],
    ["ko", "이 애플리케이션에서 SQL 쿼리 문을 실행합니다."],
    ["ko", "SQL문은 이 애플리케이션에서 실행합니다."],
  ] as const)(
    "treats SQL/query statement object variants as governed in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    ["ja", "SQLクエリを分析し、処理はこのアプリケーションで実行します。"],
    ["ja", "SQLクエリを分析し、プロセスはこのアプリケーションで実行します。"],
    ["ja", "SQLクエリを分析し、タスクはこのアプリケーションで実行します。"],
    ["ko", "SQL 쿼리를 분석하고 테스트 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 프로세스 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 작업 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 테스트는 이 애플리케이션에서 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 프로세스는 이 애플리케이션에서 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 작업은 이 애플리케이션에서 실행합니다."],
  ] as const)(
    "clears stale SQL context for topic or omitted non-SQL objects in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    ["ko", "이 애플리케이션에서는 SQL 문을 실행할 수 없음."],
    ["ko", "이 애플리케이션에서는 SQL문을 실행할 수 없고 분석만 합니다."],
    ["ko", "이 애플리케이션에서는 SQL문 실행이 불가능합니다."],
    ["ko", "이 애플리케이션에서는 SQL 쿼리문 실행을 지원하지 않아요."],
    ["ko", "이 애플리케이션에서는 SQL문 실행할수없음."],
    ["ko", "이 애플리케이션에서는 SQL문 실행을지원하지않아요."],
    ["ko", "이 애플리케이션에서는 SQL문 실행을 지원하지 않는다."],
  ] as const)(
    "keeps added Korean execute-local negative forms clean in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it("clears carried SQL context for Japanese no-particle test execution", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "SQLクエリを分析し、このアプリケーションでテスト実行します。",
    });

    expect(report.issues).toEqual([]);
  });

  it("recognizes a Japanese nominalized continuative negative", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "このアプリケーションではSQL文を実行することができず、分析のみ行います。",
    });

    expect(report.issues).toEqual([]);
  });

  it.each([
    ["ja", "SQLクエリを分析し、このアプリケーションで処理実行します。"],
    ["ja", "SQLクエリを分析し、このアプリケーションでタスク実行します。"],
    ["ja", "SQLクエリを分析し、このアプリケーションでバッチ実行します。"],
    ["ja", "SQLクエリを分析し、テストもこのアプリケーションで実行します。"],
    ["ja", "SQLクエリを分析し、処理もこのアプリケーションで実行します。"],
    ["ja", "SQLクエリを分析し、タスクもこのアプリケーションで実行します。"],
    ["ko", "SQL 쿼리를 분석하고 배치 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 테스트도 이 애플리케이션에서 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 프로세스도 이 애플리케이션에서 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 작업도 이 애플리케이션에서 실행합니다."],
  ] as const)(
    "clears stale context for generalized explicit non-SQL objects in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    ["ja", "このアプリケーションでSQL文実行します。"],
    ["ja", "このアプリケーションでクエリ文実行します。"],
    ["ko", "이 애플리케이션에서 SQL문 실행합니다."],
    ["ko", "이 애플리케이션에서 쿼리문 실행합니다."],
  ] as const)(
    "keeps generalized no-particle SQL objects governed in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    ["ja", "このアプリケーションではSQL文を実行できなくて、分析のみ行います。"],
    [
      "ja",
      "このアプリケーションではSQL文を実行することができなくて、分析のみ行います。",
    ],
    ["ko", "이 애플리케이션에서는 SQL문 실행은 불가능합니다."],
    ["ko", "이 애플리케이션에서는 SQL문을 실행할 수 없지만 분석은 가능합니다."],
    ["ko", "이 애플리케이션에서는 SQL문을 실행할 수 없으며 분석만 합니다."],
    ["ko", "이 애플리케이션에서는 SQL문 실행 지원하지 않습니다."],
    ["ko", "이 애플리케이션에서는 SQL문 실행은불가능."],
    ["ko", "이 애플리케이션에서는 SQL문 실행할수없지만 분석은 가능합니다."],
    ["ko", "이 애플리케이션에서는 SQL문 실행 지원하지 않아요."],
  ] as const)(
    "keeps normalized execute-local continuative negatives clean in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it("keeps Japanese adverbial execution as true SQL-object elision", () => {
    const report = assessToolCapabilityClaims({
      slug: "sql-query-optimizer",
      locale: "ja",
      text: "SQLクエリを分析し、このアプリケーションですぐ実行します。",
    });

    expect(report.issues.map((issue) => issue.code)).toContain(
      "sql-optimizer-execution-claim",
    );
  });

  it.each([
    ["ja", "SQLクエリを分析し、このツールは実行します。"],
    ["ja", "SQLクエリを分析し、このツールも実行します。"],
    ["ko", "SQL 쿼리를 분석하고 이 도구는 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 이 도구도 실행합니다."],
  ] as const)(
    "keeps a topic-marked executing subject as SQL-object elision in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    ["ja", "SQLクエリを分析し、ワークフローも実行します。"],
    ["ko", "SQL 쿼리를 분석하고 워크플로도 실행합니다."],
  ] as const)(
    "does not treat an unknown topic/additive head as a non-SQL object in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    ["ja", "SQLクエリを分析し、安全に実行します。"],
    ["ja", "SQLクエリを分析し、このアプリケーションでは実行します。"],
    ["ja", "SQLクエリを分析し、このアプリケーションでも実行します。"],
    ["ko", "SQL 쿼리를 분석하고 이 애플리케이션에서 즉시 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 안전하게 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 이 애플리케이션에서는 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 이 애플리케이션에서도 실행합니다."],
  ] as const)(
    "keeps adverbial or locative execution as SQL-object elision in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    ["ja", "SQLクエリを分析し、このアプリケーションでジョブ実行します。"],
    ["ja", "SQLクエリを分析し、このアプリケーションでコード実行します。"],
    ["ja", "SQLクエリを分析し、ワークフローを実行します。"],
    ["ko", "SQL 쿼리를 분석하고 잡 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 코드 실행합니다."],
    ["ko", "SQL 쿼리를 분석하고 워크플로를 실행합니다."],
  ] as const)(
    "keeps documented compounds and generic accusative non-SQL objects clean in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    [
      "ja",
      "SQLクエリを分析し、ワークフローをこのアプリケーションで実行します。",
    ],
    [
      "ko",
      "SQL 쿼리를 분석하고 워크플로를 이 애플리케이션에서 실행합니다.",
    ],
  ] as const)(
    "finds an accusative object before an intervening location in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues).toEqual([]);
    },
  );

  it.each([
    [
      "ja",
      "SQLクエリを分析し、ワークフローをこのアプリケーションでSQL文を安全に実行します。",
    ],
    [
      "ko",
      "SQL 쿼리를 분석하고 워크플로를 이 애플리케이션에서 SQL 문을 안전하게 실행합니다.",
    ],
  ] as const)(
    "lets the final SQL accusative object restore governed context in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
      });

      expect(report.issues.map((issue) => issue.code)).toContain(
        "sql-optimizer-execution-claim",
      );
    },
  );

  it.each([
    [
      "ja",
      "SQLクエリを分析し、SQL文をこのアプリケーションでワークフローを安全に実行します。",
    ],
    [
      "ko",
      "SQL 쿼리를 분석하고 SQL 문을 이 애플리케이션에서 워크플로를 안전하게 실행합니다.",
    ],
  ] as const)(
    "lets the final non-SQL accusative object clear governed context in %s: %s",
    (locale, text) => {
      const report = assessToolCapabilityClaims({
        slug: "sql-query-optimizer",
        locale,
        text,
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
