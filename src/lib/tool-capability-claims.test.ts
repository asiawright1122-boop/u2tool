import { describe, expect, it } from "vitest";
import { assessToolCapabilityClaims } from "./tool-capability-claims";

describe("assessToolCapabilityClaims", () => {
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
