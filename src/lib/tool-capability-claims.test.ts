import { describe, expect, it } from "vitest";
import { getPilotToolCapabilityProfiles } from "../config/tool-capabilities";
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
});
