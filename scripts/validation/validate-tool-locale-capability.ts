import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

import {
  type CapabilityEvidenceReference,
  getPilotToolCapabilityProfiles,
  getToolCapabilityProfile,
  type ToolCapabilityProfile,
} from '../../src/config/tool-capabilities';
import { locales, type Locale } from '../../src/lib/i18n';
import { loadToolPageMessages } from '../../src/lib/translations';
import {
  repositoryEvidenceTestModule,
  validateCapabilityEvidenceReference,
  type CapabilityEvidenceSubject,
  type RepositoryEvidenceTestModule,
} from './validate-tool-capability-claims';

export interface LocaleCapabilityIssue {
  locale: string;
  slug: string;
  code:
    | 'missing-disclosure'
    | 'native-language-overclaim'
    | 'missing-fixtures';
  message: string;
}

const defaultRepositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

interface StructuredProfileEvidence {
  subject: CapabilityEvidenceSubject;
  evidence: CapabilityEvidenceReference;
}

function structuredProfileEvidence(
  profile: ToolCapabilityProfile,
): StructuredProfileEvidence[] {
  const optionalEntries: Array<{
    subject: CapabilityEvidenceSubject;
    evidence?: CapabilityEvidenceReference;
  }> = [
    ...profile.evidenceTests.map((evidence) => ({
      subject: {
        slug: profile.slug,
        category: 'profile' as const,
        id: 'release-readiness',
      },
      evidence,
    })),
    ...profile.modes.map((item) => ({
      subject: { slug: profile.slug, category: 'mode' as const, id: item.id },
      evidence: item.evidence,
    })),
    ...profile.acceptedInputs.map((item) => ({
      subject: {
        slug: profile.slug,
        category: 'accepted-input' as const,
        id: item.id,
      },
      evidence: item.evidence,
    })),
    ...profile.producedOutputs.map((item) => ({
      subject: {
        slug: profile.slug,
        category: 'produced-output' as const,
        id: item.id,
      },
      evidence: item.evidence,
    })),
    ...profile.browserOnlyFeatures.map((item) => ({
      subject: {
        slug: profile.slug,
        category: 'browser-feature' as const,
        id: item.id,
      },
      evidence: item.evidence,
    })),
    ...profile.optionalServerFeatures.map((item) => ({
      subject: {
        slug: profile.slug,
        category: 'optional-server-feature' as const,
        id: item.id,
      },
      evidence: item.evidence,
    })),
    ...profile.limits.map((item) => ({
      subject: { slug: profile.slug, category: 'limit' as const, id: item.id },
      evidence: item.evidence,
    })),
    {
      subject: {
        slug: profile.slug,
        category: 'engine',
        id: 'language-support',
      },
      evidence: profile.supportedLocales.engine.evidence,
    },
  ];

  return optionalEntries.filter(
    (entry): entry is StructuredProfileEvidence => Boolean(entry.evidence),
  );
}

function hasLocaleFixtureEvidence(
  slug: string,
  locale: string,
  evidenceTests: readonly string[],
  repositoryRoot = defaultRepositoryRoot,
): boolean {
  const fixturePath = `src/lib/fixtures/${slug}/${locale}.ts`;
  const absoluteFixturePath = path.join(repositoryRoot, fixturePath);
  const fixtureReference = `fixtures/${slug}/${locale}`;
  const evidenceSources = evidenceTests.flatMap((evidencePath) => {
    const absoluteEvidencePath = path.resolve(repositoryRoot, evidencePath);
    const relativeEvidencePath = path.relative(
      repositoryRoot,
      absoluteEvidencePath,
    );
    if (
      path.isAbsolute(evidencePath) ||
      relativeEvidencePath === '..' ||
      relativeEvidencePath.startsWith(`..${path.sep}`) ||
      !/\.test\.[cm]?[jt]sx?$/u.test(relativeEvidencePath) ||
      !existsSync(absoluteEvidencePath)
    ) {
      return [];
    }

    return [readFileSync(absoluteEvidencePath, 'utf8')];
  });

  const fixtureDirectory = path.dirname(absoluteFixturePath);
  if (existsSync(fixtureDirectory)) {
    return (
      existsSync(absoluteFixturePath) &&
      evidenceSources.some((source) => source.includes(fixtureReference))
    );
  }

  const engineMarker = `[capability:${slug}:engine:language-support]`;
  return evidenceSources.some((source) => {
    if (!source.includes(engineMarker)) {
      return false;
    }
    if (locale === 'en') {
      return true;
    }

    const localeLiteral = new RegExp(
      `(?:["']${locale}["']|\\b${locale}\\s*:)`,
      'u',
    );
    return (
      localeLiteral.test(source) &&
      /(?:fixture|prompt|sample|input|output|message)/iu.test(source)
    );
  });
}

function exactRunnableTestBody(
  module: RepositoryEvidenceTestModule,
  testName: string,
): ts.ConciseBody | null {
  const sourceFile = ts.createSourceFile(
    module.file,
    module.source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const bodies: ts.ConciseBody[] = [];
  const visit = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      (node.expression.text === 'it' || node.expression.text === 'test') &&
      ts.isStringLiteral(node.arguments[0]) &&
      node.arguments[0].text === testName
    ) {
      const implementation = node.arguments[1];
      if (
        implementation &&
        (ts.isArrowFunction(implementation) ||
          ts.isFunctionExpression(implementation))
      ) {
        bodies.push(implementation.body);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return bodies.length === 1 ? bodies[0] : null;
}

function normalizedModulePath(value: string): string {
  return value.replace(/\.[cm]?[jt]sx?$/u, '').split(path.sep).join('/');
}

interface FixtureImportBinding {
  localName: string;
  importedName: string;
}

function fixtureImportBindings(
  module: RepositoryEvidenceTestModule,
  fixturePath: string,
  repositoryRoot: string,
): FixtureImportBinding[] {
  const sourceFile = ts.createSourceFile(
    module.file,
    module.source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const expectedModulePath = normalizedModulePath(
    path.resolve(repositoryRoot, fixturePath),
  );
  const bindings: FixtureImportBinding[] = [];

  for (const statement of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(statement) ||
      !ts.isStringLiteral(statement.moduleSpecifier) ||
      !statement.importClause
    ) {
      continue;
    }
    const resolvedImportPath = normalizedModulePath(
      path.resolve(
        repositoryRoot,
        path.dirname(module.file),
        statement.moduleSpecifier.text,
      ),
    );
    if (resolvedImportPath !== expectedModulePath) {
      continue;
    }

    if (statement.importClause.name) {
      bindings.push({
        localName: statement.importClause.name.text,
        importedName: 'default',
      });
    }
    const namedBindings = statement.importClause.namedBindings;
    if (namedBindings && ts.isNamespaceImport(namedBindings)) {
      bindings.push({ localName: namedBindings.name.text, importedName: '*' });
    } else if (namedBindings) {
      for (const element of namedBindings.elements) {
        bindings.push({
          localName: element.name.text,
          importedName: element.propertyName?.text ?? element.name.text,
        });
      }
    }
  }

  return bindings;
}

function propertyNameText(name: ts.PropertyName | ts.BindingName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }
  if (ts.isNumericLiteral(name)) {
    return name.text;
  }
  return null;
}

function containsMeaningfulLiteral(node: ts.Node): boolean {
  if (
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
    node.text.trim().length > 0
  ) {
    return true;
  }
  return node.getChildren().some(containsMeaningfulLiteral);
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
  let current = expression;
  while (
    ts.isAsExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function meaningfulFixtureExports(
  fixturePath: string,
  repositoryRoot: string,
): Map<string, Set<string>> {
  const absoluteFixturePath = path.resolve(repositoryRoot, fixturePath);
  if (!existsSync(absoluteFixturePath)) {
    return new Map();
  }
  const sourceFile = ts.createSourceFile(
    fixturePath,
    readFileSync(absoluteFixturePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const exports = new Map<string, Set<string>>();

  for (const statement of sourceFile.statements) {
    if (
      !ts.isVariableStatement(statement) ||
      !statement.modifiers?.some(
        ({ kind }) => kind === ts.SyntaxKind.ExportKeyword,
      )
    ) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
        continue;
      }
      const meaningfulProperties = new Set<string>();
      const initializer = unwrapExpression(declaration.initializer);
      if (ts.isObjectLiteralExpression(initializer)) {
        for (const property of initializer.properties) {
          if (
            ts.isPropertyAssignment(property) &&
            containsMeaningfulLiteral(property.initializer)
          ) {
            const propertyName = propertyNameText(property.name);
            if (propertyName) {
              meaningfulProperties.add(propertyName);
            }
          }
        }
      } else if (containsMeaningfulLiteral(initializer)) {
        meaningfulProperties.add('*');
      }
      if (meaningfulProperties.size > 0) {
        exports.set(declaration.name.text, meaningfulProperties);
      }
    }
  }

  return exports;
}

function exactTestExercisesMeaningfulFixture(input: {
  module: RepositoryEvidenceTestModule;
  evidence: CapabilityEvidenceReference;
  fixturePath: string;
  repositoryRoot: string;
}): boolean {
  const testBody = exactRunnableTestBody(input.module, input.evidence.testName);
  const importBindings = fixtureImportBindings(
    input.module,
    input.fixturePath,
    input.repositoryRoot,
  );
  const fixtureExports = meaningfulFixtureExports(
    input.fixturePath,
    input.repositoryRoot,
  );
  if (!testBody || importBindings.length === 0 || fixtureExports.size === 0) {
    return false;
  }

  const meaningfulBindingProperties = new Map<string, Set<string>>();
  for (const binding of importBindings) {
    if (binding.importedName === '*') {
      continue;
    }
    const properties = fixtureExports.get(binding.importedName);
    if (properties) {
      meaningfulBindingProperties.set(binding.localName, properties);
    }
  }
  if (meaningfulBindingProperties.size === 0) {
    return false;
  }

  const taintedNames = new Set<string>();
  const expressionUsesFixtureData = (node: ts.Node): boolean => {
    if (ts.isIdentifier(node)) {
      const properties = meaningfulBindingProperties.get(node.text);
      return Boolean(properties?.has('*') || taintedNames.has(node.text));
    }
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression)
    ) {
      return Boolean(
        meaningfulBindingProperties
          .get(node.expression.text)
          ?.has(node.name.text),
      );
    }
    if (
      ts.isElementAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.argumentExpression &&
      ts.isStringLiteral(node.argumentExpression)
    ) {
      return Boolean(
        meaningfulBindingProperties
          .get(node.expression.text)
          ?.has(node.argumentExpression.text),
      );
    }
    return node.getChildren().some(expressionUsesFixtureData);
  };

  const variableDeclarations: ts.VariableDeclaration[] = [];
  const collectVariables = (node: ts.Node): void => {
    if (ts.isVariableDeclaration(node)) {
      variableDeclarations.push(node);
    }
    ts.forEachChild(node, collectVariables);
  };
  collectVariables(testBody);
  let changed = true;
  while (changed) {
    changed = false;
    for (const declaration of variableDeclarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.initializer &&
        !taintedNames.has(declaration.name.text) &&
        expressionUsesFixtureData(declaration.initializer)
      ) {
        taintedNames.add(declaration.name.text);
        changed = true;
      }
    }
  }

  let meaningfulAssertion = false;
  const findAssertion = (node: ts.Node): void => {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'expect' &&
      node.arguments.some(expressionUsesFixtureData)
    ) {
      meaningfulAssertion = true;
      return;
    }
    ts.forEachChild(node, findAssertion);
  };
  findAssertion(testBody);
  return meaningfulAssertion;
}

function exactStructuredEvidenceIsRunnable(
  entry: StructuredProfileEvidence,
  repositoryRoot: string,
): RepositoryEvidenceTestModule | null {
  const loadModule = (file: string) =>
    repositoryEvidenceTestModule(file, repositoryRoot);
  if (
    validateCapabilityEvidenceReference(
      entry.subject,
      entry.evidence,
      loadModule,
    )
  ) {
    return null;
  }
  return loadModule(entry.evidence.file);
}

function exactTestCoversLocale(
  module: RepositoryEvidenceTestModule,
  testName: string,
  locale: string,
): boolean {
  const body = exactRunnableTestBody(module, testName);
  if (!body) {
    return false;
  }
  let hasLocaleProperty = false;
  let iteratesLocales = false;
  let assertsNonEmptyData = false;
  const visit = (node: ts.Node): void => {
    if (
      ts.isPropertyAssignment(node) &&
      propertyNameText(node.name) === locale
    ) {
      hasLocaleProperty = true;
    }
    if (
      ts.isForOfStatement(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'locales'
    ) {
      iteratesLocales = true;
    }
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      node.expression.name.text === 'toBeGreaterThan' &&
      node.arguments.some(
        (argument) => ts.isNumericLiteral(argument) && argument.text === '0',
      )
    ) {
      assertsNonEmptyData = true;
    }
    ts.forEachChild(node, visit);
  };
  visit(body);
  return hasLocaleProperty && iteratesLocales && assertsNonEmptyData;
}

function hasStructuredLocaleEvidence(input: {
  profile: ToolCapabilityProfile;
  locale: string;
  evidence: readonly StructuredProfileEvidence[];
  repositoryRoot: string;
}): boolean {
  if (input.profile.supportedLocales.engine.kind !== 'engine-limited') {
    return true;
  }

  const fixturePath = `src/lib/fixtures/${input.profile.slug}/${input.locale}.ts`;
  const fixtureDirectory = path.dirname(
    path.resolve(input.repositoryRoot, fixturePath),
  );
  if (existsSync(fixtureDirectory)) {
    if (!existsSync(path.resolve(input.repositoryRoot, fixturePath))) {
      return false;
    }
    return input.evidence.some((entry) => {
      const module = exactStructuredEvidenceIsRunnable(
        entry,
        input.repositoryRoot,
      );
      return Boolean(
        module &&
          exactTestExercisesMeaningfulFixture({
            module,
            evidence: entry.evidence,
            fixturePath,
            repositoryRoot: input.repositoryRoot,
          }),
      );
    });
  }

  const engineEvidence = input.evidence.find(
    ({ subject }) =>
      subject.category === 'engine' && subject.id === 'language-support',
  );
  if (!engineEvidence) {
    return false;
  }
  const module = exactStructuredEvidenceIsRunnable(
    engineEvidence,
    input.repositoryRoot,
  );
  if (!module) {
    return false;
  }
  return input.profile.supportedLocales.engine.local.length === 1
    ? true
    : exactTestCoversLocale(
        module,
        engineEvidence.evidence.testName,
        input.locale,
      );
}

function collectMessageStrings(value: unknown, values: string[] = []): string[] {
  if (typeof value === 'string') {
    values.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) {
      collectMessageStrings(item, values);
    }
  } else if (typeof value === 'object' && value !== null) {
    for (const item of Object.values(value)) {
      collectMessageStrings(item, values);
    }
  }

  return values;
}

function messageStatements(messages: Record<string, unknown>): string[] {
  return collectMessageStrings(messages).flatMap(
    (value) => value.match(/[^\n\r.!?。！？؟؛;]+[.!?。！？؟؛;]?/gu) ?? [],
  );
}

function hasEngineLanguageDisclosure(
  slug: string,
  locale: string,
  messages: Record<string, unknown>,
): boolean {
  const englishLanguageByLocale: Readonly<Record<string, RegExp>> = {
    en: /\bEnglish\b/iu,
    zh: /(?:英语|英文)/u,
    ja: /英語/u,
    ko: /영어/u,
    es: /\bingl(?:és|esa|eses|esas)\b/iu,
    pt: /\bingl(?:ês|esa|eses|esas)\b/iu,
    fr: /\banglai(?:s|se|ses)\b/iu,
    de: /\benglisch\p{L}*\b/iu,
    ru: /английск\p{L}*/iu,
    ar: /(?:إنجليزي|إنجليزية|الإنجليزي|الإنجليزية)/u,
  };
  const grammarInputByLocale: Readonly<Record<string, RegExp>> = {
    en: /\b(?:text|input)\b/iu,
    zh: /(?:文本|输入)/u,
    ja: /(?:テキスト|入力)/u,
    ko: /(?:텍스트|입력)/u,
    es: /\b(?:texto|entrada)\b/iu,
    pt: /\b(?:texto|entrada)\b/iu,
    fr: /\b(?:texte|saisie)\b/iu,
    de: /\b(?:Text|Eingabe)\p{L}*\b/iu,
    ru: /(?:текст|ввод)\p{L}*/iu,
    ar: /(?:نص|إدخال)/u,
  };
  const diagnosticOutputByLocale: Readonly<Record<string, RegExp>> = {
    en: /\b(?:diagnostic|explanation|finding)\p{L}*\b/iu,
    zh: /(?:诊断|说明|结果)/u,
    ja: /(?:診断|説明|指摘)/u,
    ko: /(?:진단|설명|결과)/u,
    es: /\b(?:diagnóstic|explicaci|hallazgo)\p{L}*\b/iu,
    pt: /\b(?:diagnóstic|explicaç|achado)\p{L}*\b/iu,
    fr: /\b(?:diagnostic|explication|constat)\p{L}*\b/iu,
    de: /\b(?:Diagnose|Erklärung|Hinweis)\p{L}*\b/iu,
    ru: /(?:диагност|объяснен|замечан)\p{L}*/iu,
    ar: /(?:تشخيص|تفسير|نتائج)/u,
  };
  const grammarActionByLocale: Readonly<Record<string, RegExp>> = {
    en: /\b(?:accepts?|checks?|evaluates?|requires?|reviews?|processes?)\b/iu,
    zh: /(?:接受|检查|处理|评估|要求)/u,
    ja: /(?:受け付け|確認|処理|評価|必要)/u,
    ko: /(?:입력받|검토|처리|평가|요구)/u,
    es: /\b(?:acepta|comprueba|evalúa|revisa|procesa|requiere)\p{L}*\b/iu,
    pt: /\b(?:aceita|avalia|revisa|processa|requer)\p{L}*\b/iu,
    fr: /\b(?:accepte|évalue|vérifie|examine|traite|exige)\p{L}*\b/iu,
    de: /\b(?:akzeptiert|bewertet|prüft|verarbeitet|erfordert)\p{L}*\b/iu,
    ru: /(?:принима|провер|оценива|обрабатыва|требу)\p{L}*/iu,
    ar: /(?:يقبل|تقبل|يراجع|تراجع|يفحص|تفحص|يقيّم|تقيّم|يعالج|تعالج|يتطلب|تتطلب)/u,
  };
  const languagePattern = englishLanguageByLocale[locale];
  const boundaryPattern =
    slug === 'grammar-checker'
      ? grammarInputByLocale[locale]
      : slug === 'sql-query-optimizer'
        ? diagnosticOutputByLocale[locale]
        : undefined;
  const actionPattern =
    slug === 'grammar-checker' ? grammarActionByLocale[locale] : undefined;

  if (languagePattern && boundaryPattern) {
    return messageStatements(messages).some(
      (statement) =>
        languagePattern.test(statement) &&
        boundaryPattern.test(statement) &&
        (!actionPattern || actionPattern.test(statement)),
    );
  }

  return false;
}

function hasUnsupportedLocaleEngineOverclaim(
  profile: ToolCapabilityProfile,
  locale: string,
  messages: Record<string, unknown>,
): boolean {
  if (profile.supportedLocales.engine.kind !== 'engine-limited') {
    return false;
  }
  const supportedEngineLocales = [
    ...profile.supportedLocales.engine.local,
    ...profile.supportedLocales.engine.optionalServer,
  ] as readonly string[];
  if (supportedEngineLocales.includes(locale)) {
    return false;
  }

  const detectorByLocale: Readonly<
    Record<
      string,
      {
        target: RegExp;
        action: RegExp;
        negationBefore: RegExp;
        negationAfter?: RegExp;
      }
    >
  > = {
    en: {
      target:
        /(?:\bEnglish\b.{0,12}\b(?:grammar|diagnostic|explanation|text|input)\p{L}*\b|\b(?:grammar|diagnostic|explanation|text|input)\p{L}*\b.{0,12}\bin\s+English\b)/iu,
      action:
        /\b(?:accepts?|checks?|corrects?|supports?|provides?|shows?|generates?|evaluates?|processes?)\b/giu,
      negationBefore: /(?:does\s+not|doesn't|do\s+not|don't|not|never)\s*$/iu,
    },
    zh: {
      target:
        /(?:(?:中文|汉语|普通话).{0,4}(?:语法|诊断|说明|文本|输入)|(?:语法|诊断|说明|文本|输入).{0,4}(?:中文|汉语|普通话))/u,
      action: /(?:接受|检查|纠正|支持|提供|显示|生成|评估|处理)/gu,
      negationBefore: /(?:不|未|没有|不会)\s*$/u,
    },
    ja: {
      target:
        /(?:日本語.{0,4}(?:文法|診断|説明|テキスト|入力)|(?:文法|診断|説明|テキスト|入力).{0,4}日本語)/u,
      action: /(?:受け付け|確認|修正|対応|提供|表示|生成|評価|処理)/gu,
      negationBefore: /(?:非|未)\s*$/u,
      negationAfter: /^(?:しない|しません|していない|していません|できない|できません)/u,
    },
    ko: {
      target:
        /(?:한국어.{0,4}(?:문법|진단|설명|텍스트|입력)|(?:문법|진단|설명|텍스트|입력).{0,4}한국어)/u,
      action: /(?:입력받|검사|교정|지원|제공|표시|생성|평가|처리)/gu,
      negationBefore: /(?:안|못)\s*$/u,
      negationAfter: /^(?:하지\s*않|할\s*수\s*없)/u,
    },
    es: {
      target:
        /(?:\b(?:gramática|diagnóstic|explicaci|texto|entrada)\p{L}*\b.{0,12}\ben\s+(?:español|castellano)\p{L}*\b|\b(?:español|española|castellano|castellana)\p{L}*\b.{0,12}\b(?:gramática|diagnóstic|explicaci|texto|entrada)\p{L}*\b)/iu,
      action:
        /\b(?:acepta|comprueba|corrige|admite|soporta|ofrece|proporciona|muestra|genera|evalúa|procesa)\p{L}*\b/giu,
      negationBefore: /(?:no|nunca)\s*$/iu,
    },
    pt: {
      target:
        /(?:\b(?:gramática|diagnóstic|explicaç|texto|entrada)\p{L}*\b.{0,12}\bem\s+português\p{L}*\b|\b(?:português|portuguesa)\p{L}*\b.{0,12}\b(?:gramática|diagnóstic|explicaç|texto|entrada)\p{L}*\b)/iu,
      action:
        /\b(?:aceita|verifica|corrige|suporta|oferece|fornece|mostra|gera|avalia|processa)\p{L}*\b/giu,
      negationBefore: /(?:não|nunca)\s*$/iu,
    },
    fr: {
      target:
        /(?:\b(?:grammaire|diagnostic|explication|texte|saisie)\p{L}*\b.{0,6}\ben\s+français\p{L}*\b|\b(?:français|française)\p{L}*\s+(?:grammaire|diagnostic|explication|texte|saisie)\p{L}*\b)/iu,
      action:
        /\b(?:accepte|vérifie|corrige|prend\s+en\s+charge|offre|fournit|affiche|génère|évalue|traite)\p{L}*\b/giu,
      negationBefore: /(?:ne|n['’]|jamais)\s*$/iu,
      negationAfter: /^\s*(?:pas|jamais)\b/iu,
    },
    de: {
      target:
        /(?:\b(?:deutsch)\p{L}*\b.{0,12}\b(?:Grammatik|Diagnose|Erklärung|Text|Eingabe)\p{L}*\b|\b(?:Grammatik|Diagnose|Erklärung|Text|Eingabe)\p{L}*\b.{0,12}\bauf\s+Deutsch\b)/iu,
      action:
        /\b(?:akzeptiert|prüft|korrigiert|unterstützt|bietet|liefert|zeigt|erzeugt|bewertet|verarbeitet)\p{L}*\b/giu,
      negationBefore: /(?:nicht|nie)\s*$/iu,
    },
    ru: {
      target:
        /(?:(?:русск\p{L}*)\s+(?:грамматик|диагност|объяснен|текст|ввод)\p{L}*|(?:грамматик|диагност|объяснен|текст|ввод)\p{L}*.{0,12}(?:на\s+русском\s+языке|русск\p{L}*))/iu,
      action:
        /(?:принима|проверя|исправля|поддержива|предоставля|показыва|вывод|формиру|оценива|обрабатыва)\p{L}*/giu,
      negationBefore: /(?:не|никогда)\s*$/iu,
    },
    ar: {
      target:
        /(?:(?:قواعد|تشخيص|تفسير|نص|إدخال).{0,12}(?:بالعربية|باللغة العربية)|(?:العربية|العربي).{0,12}(?:قواعد|تشخيص|تفسير|نص|إدخال))/u,
      action:
        /(?:يقبل|تقبل|يفحص|تفحص|يصحح|تصحح|يدعم|تدعم|يوفر|توفر|يعرض|تعرض|ينشئ|تنشئ|يقيّم|تقيّم|يعالج|تعالج)/gu,
      negationBefore: /(?:لا|لن|لم)\s*$/u,
    },
  };
  const detector = detectorByLocale[locale];
  if (!detector) {
    return false;
  }

  return messageStatements(messages).some((statement) => {
    if (
      /[?？؟]\s*$/u.test(statement) ||
      !detector.target.test(statement)
    ) {
      return false;
    }

    detector.action.lastIndex = 0;
    const actions = [...statement.matchAll(detector.action)];
    detector.action.lastIndex = 0;
    return actions.some((action) => {
      const actionIndex = action.index ?? 0;
      const beforeAction = statement.slice(0, actionIndex);
      const afterAction = statement.slice(actionIndex + action[0].length);
      return (
        !detector.negationBefore.test(beforeAction) &&
        !(detector.negationAfter?.test(afterAction) ?? false)
      );
    });
  });
}

export interface ToolLocaleCapabilityRunDependencies {
  profiles: readonly ToolCapabilityProfile[];
  locales: readonly string[];
  repositoryRoot?: string;
  loadMergedMessages: (
    locale: string,
    slug: string,
  ) => Promise<Record<string, unknown>>;
}

export interface ToolLocaleCapabilityRunReport {
  profileCount: number;
  localePageCount: number;
  issues: LocaleCapabilityIssue[];
  notReleaseReadyProfiles: string[];
  exitCode: 0 | 1;
}

type ToolLocaleCapabilityInput = {
  locale: string;
  slug: string;
  mergedMessages: Record<string, unknown>;
  evidenceTests: readonly string[];
};

function validateToolLocaleCapabilityAgainstProfile(
  input: ToolLocaleCapabilityInput,
  profile: ToolCapabilityProfile,
  structuredEvidenceContext?: {
    evidence: readonly StructuredProfileEvidence[];
    repositoryRoot: string;
  },
): LocaleCapabilityIssue[] {
  if (profile.supportedLocales.engine.kind === 'language-neutral') {
    return [];
  }

  const issues: LocaleCapabilityIssue[] = [];
  const isLocalEngineLocale = (
    profile.supportedLocales.engine.local as readonly string[]
  ).includes(input.locale);
  const isSupportedEngineLocale = (
    [
      ...profile.supportedLocales.engine.local,
      ...profile.supportedLocales.engine.optionalServer,
    ] as readonly string[]
  ).includes(input.locale);

  if (
    hasUnsupportedLocaleEngineOverclaim(
      profile,
      input.locale,
      input.mergedMessages,
    )
  ) {
    issues.push({
      locale: input.locale,
      slug: input.slug,
      code: 'native-language-overclaim',
      message: `Localized copy claims native ${input.locale} engine support that the profile does not declare.`,
    });
  }

  if (
    !isSupportedEngineLocale &&
    !hasEngineLanguageDisclosure(
      input.slug,
      input.locale,
      input.mergedMessages,
    )
  ) {
    issues.push({
      locale: input.locale,
      slug: input.slug,
      code: 'missing-disclosure',
      message:
        'Localized UI copy must explicitly disclose the supported engine language.',
    });
  }

  if (
    profile.enforcement === 'release-blocking' &&
    isLocalEngineLocale &&
    !(structuredEvidenceContext
      ? hasStructuredLocaleEvidence({
          profile,
          locale: input.locale,
          evidence: structuredEvidenceContext.evidence,
          repositoryRoot: structuredEvidenceContext.repositoryRoot,
        })
      : hasLocaleFixtureEvidence(
          input.slug,
          input.locale,
          input.evidenceTests,
        ))
  ) {
    issues.push({
      locale: input.locale,
      slug: input.slug,
      code: 'missing-fixtures',
      message: `Release-blocking local engine locale ${input.locale} lacks matching fixture-backed test evidence.`,
    });
  }

  return issues;
}

export function validateToolLocaleCapability(
  input: ToolLocaleCapabilityInput,
): LocaleCapabilityIssue[] {
  const profile = getToolCapabilityProfile(input.slug);
  return profile
    ? validateToolLocaleCapabilityAgainstProfile(input, profile)
    : [];
}

export function flattenProfileEvidenceTestFiles(
  profile: ToolCapabilityProfile,
): string[] {
  return [
    ...new Set(
      structuredProfileEvidence(profile).map(({ evidence }) => evidence.file),
    ),
  ];
}

function compareIssues(
  left: LocaleCapabilityIssue,
  right: LocaleCapabilityIssue,
): number {
  return (
    left.locale.localeCompare(right.locale) ||
    left.slug.localeCompare(right.slug) ||
    left.code.localeCompare(right.code) ||
    left.message.localeCompare(right.message)
  );
}

export async function runToolLocaleCapabilityValidation(
  dependencies: ToolLocaleCapabilityRunDependencies,
): Promise<ToolLocaleCapabilityRunReport> {
  const issues: LocaleCapabilityIssue[] = [];
  let localePageCount = 0;

  for (const profile of dependencies.profiles) {
    const structuredEvidence = structuredProfileEvidence(profile);
    const evidenceTests = flattenProfileEvidenceTestFiles(profile);
    for (const locale of dependencies.locales) {
      localePageCount += 1;
      issues.push(
        ...validateToolLocaleCapabilityAgainstProfile(
          {
            locale,
            slug: profile.slug,
            mergedMessages: await dependencies.loadMergedMessages(
              locale,
              profile.slug,
            ),
            evidenceTests,
          },
          profile,
          {
            evidence: structuredEvidence,
            repositoryRoot:
              dependencies.repositoryRoot ?? defaultRepositoryRoot,
          },
        ),
      );
    }
  }

  issues.sort(compareIssues);
  const notReleaseReadyProfiles = dependencies.profiles
    .filter(({ enforcement }) => enforcement === 'inventory')
    .map(({ slug }) => slug)
    .sort();

  return {
    profileCount: dependencies.profiles.length,
    localePageCount,
    issues,
    notReleaseReadyProfiles,
    exitCode: issues.length === 0 ? 0 : 1,
  };
}

export function runToolLocaleCapabilityCli(): Promise<ToolLocaleCapabilityRunReport> {
  return runToolLocaleCapabilityValidation({
    profiles: getPilotToolCapabilityProfiles(),
    locales,
    loadMergedMessages: (locale, slug) =>
      loadToolPageMessages(locale as Locale, slug),
  });
}

async function main(): Promise<void> {
  const report = await runToolLocaleCapabilityCli();

  for (const issue of report.issues) {
    process.stderr.write(
      `${issue.locale}/tools/${issue.slug} ${issue.code}: ${issue.message}\n`,
    );
  }
  for (const slug of report.notReleaseReadyProfiles) {
    process.stdout.write(
      `${slug} not release-ready: inventory enforcement\n`,
    );
  }

  const status = report.issues.length === 0 ? 'passed' : 'failed';
  const summary = `Tool locale capability ${status}. profiles=${report.profileCount} localePages=${report.localePageCount} issues=${report.issues.length} notReleaseReady=${report.notReleaseReadyProfiles.length}\n`;
  (report.issues.length === 0 ? process.stdout : process.stderr).write(summary);
  process.exitCode = report.exitCode;
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : '';
if (import.meta.url === invokedPath) {
  main().catch((error) => {
    process.stderr.write(
      `Fatal: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 1;
  });
}
