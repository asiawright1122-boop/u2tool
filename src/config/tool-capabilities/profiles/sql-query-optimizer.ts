import { locales } from '@/lib/i18n';
import { defineToolCapabilityProfile } from '../define-profile';

const analyzerEvidence = {
  file: 'src/lib/sql-query-optimizer.test.ts',
  testName:
    'reports SELECT * and an unbounded read with evidence [capability:sql-query-optimizer:profile:release-readiness] [capability:sql-query-optimizer:mode:local-static-analysis] [capability:sql-query-optimizer:accepted-input:sql-text] [capability:sql-query-optimizer:produced-output:analysis-score] [capability:sql-query-optimizer:produced-output:diagnostic-findings] [capability:sql-query-optimizer:browser-feature:static-heuristics]',
};

const browserAnalysisEvidence = {
  file: 'src/components/tools/SqlQueryOptimizer.test.ts',
  testName:
    'analyzes the selected dialect and renders score, formatted SQL, evidence, index candidates, and limitations without a network request [capability:sql-query-optimizer:profile:release-readiness] [capability:sql-query-optimizer:mode:local-static-analysis] [capability:sql-query-optimizer:accepted-input:sql-text] [capability:sql-query-optimizer:accepted-input:sql-dialect] [capability:sql-query-optimizer:produced-output:analysis-score] [capability:sql-query-optimizer:produced-output:formatted-sql] [capability:sql-query-optimizer:produced-output:diagnostic-findings] [capability:sql-query-optimizer:produced-output:index-candidates] [capability:sql-query-optimizer:browser-feature:dialect-selector] [capability:sql-query-optimizer:browser-feature:static-heuristics] [capability:sql-query-optimizer:browser-feature:sql-formatting] [capability:sql-query-optimizer:browser-feature:composite-index-candidates] [capability:sql-query-optimizer:limit:no-database-connection] [capability:sql-query-optimizer:limit:no-query-execution] [capability:sql-query-optimizer:limit:no-automatic-rewrite] [capability:sql-query-optimizer:limit:unverified-indexes] [capability:sql-query-optimizer:limit:no-speed-guarantee]',
};

const explainEvidence = {
  file: 'src/components/tools/SqlQueryOptimizer.test.ts',
  testName:
    'analyzes optional pasted EXPLAIN text for the selected dialect [capability:sql-query-optimizer:mode:pasted-explain-analysis] [capability:sql-query-optimizer:accepted-input:explain-text] [capability:sql-query-optimizer:produced-output:explain-findings] [capability:sql-query-optimizer:browser-feature:explain-token-analysis]',
};

const copyEvidence = {
  file: 'src/components/tools/SqlQueryOptimizer.test.ts',
  testName:
    'copies formatted SQL and the visible findings [capability:sql-query-optimizer:browser-feature:copy-controls]',
};

const diagnosticLanguageEvidence = {
  file: 'src/components/tools/SqlQueryOptimizer.test.ts',
  testName:
    'discloses English local diagnostics on a non-English page [capability:sql-query-optimizer:limit:english-diagnostics]',
};

const engineEvidence = {
  file: 'src/lib/sql-query-optimizer.test.ts',
  testName:
    'formats SQL without changing the submitted text and keeps local diagnostics in English [capability:sql-query-optimizer:produced-output:formatted-sql] [capability:sql-query-optimizer:browser-feature:sql-formatting] [capability:sql-query-optimizer:engine:language-support]',
};

export const sqlQueryOptimizerCapabilityProfile = defineToolCapabilityProfile({
  slug: 'sql-query-optimizer',
  version: '2.0.0',
  enforcement: 'release-blocking',
  modes: [
    {
      id: 'local-static-analysis',
      labelKey:
        'tools.sql-query-optimizer.capabilities.modes.localStaticAnalysis',
      runtime: 'browser',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'pasted-explain-analysis',
      labelKey:
        'tools.sql-query-optimizer.capabilities.modes.pastedExplainAnalysis',
      runtime: 'browser',
      evidence: explainEvidence,
    },
  ],
  acceptedInputs: [
    {
      id: 'sql-text',
      labelKey: 'tools.sql-query-optimizer.capabilities.inputs.sqlText',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'sql-dialect',
      labelKey: 'tools.sql-query-optimizer.capabilities.inputs.sqlDialect',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'explain-text',
      labelKey: 'tools.sql-query-optimizer.capabilities.inputs.explainText',
      evidence: explainEvidence,
    },
  ],
  producedOutputs: [
    {
      id: 'analysis-score',
      labelKey: 'tools.sql-query-optimizer.capabilities.outputs.analysisScore',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'formatted-sql',
      labelKey: 'tools.sql-query-optimizer.capabilities.outputs.formattedSql',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'diagnostic-findings',
      labelKey:
        'tools.sql-query-optimizer.capabilities.outputs.diagnosticFindings',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'index-candidates',
      labelKey:
        'tools.sql-query-optimizer.capabilities.outputs.indexCandidates',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'explain-findings',
      labelKey:
        'tools.sql-query-optimizer.capabilities.outputs.explainFindings',
      evidence: explainEvidence,
    },
  ],
  supportedLocales: {
    ui: locales,
    engine: {
      kind: 'engine-limited',
      local: ['en'],
      optionalServer: [],
      evidence: engineEvidence,
    },
  },
  browserOnlyFeatures: [
    {
      id: 'dialect-selector',
      labelKey:
        'tools.sql-query-optimizer.capabilities.features.dialectSelector',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'static-heuristics',
      labelKey:
        'tools.sql-query-optimizer.capabilities.features.staticHeuristics',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'sql-formatting',
      labelKey:
        'tools.sql-query-optimizer.capabilities.features.sqlFormatting',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'composite-index-candidates',
      labelKey:
        'tools.sql-query-optimizer.capabilities.features.compositeIndexCandidates',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'explain-token-analysis',
      labelKey:
        'tools.sql-query-optimizer.capabilities.features.explainTokenAnalysis',
      evidence: explainEvidence,
    },
    {
      id: 'copy-controls',
      labelKey: 'tools.sql-query-optimizer.capabilities.features.copyControls',
      evidence: copyEvidence,
    },
  ],
  optionalServerFeatures: [],
  limits: [
    {
      id: 'english-diagnostics',
      labelKey:
        'tools.sql-query-optimizer.capabilities.limits.englishDiagnostics',
      evidence: diagnosticLanguageEvidence,
    },
    {
      id: 'no-database-connection',
      labelKey:
        'tools.sql-query-optimizer.capabilities.limits.noDatabaseConnection',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'no-query-execution',
      labelKey:
        'tools.sql-query-optimizer.capabilities.limits.noQueryExecution',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'no-automatic-rewrite',
      labelKey:
        'tools.sql-query-optimizer.capabilities.limits.noAutomaticRewrite',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'unverified-indexes',
      labelKey:
        'tools.sql-query-optimizer.capabilities.limits.unverifiedIndexes',
      evidence: browserAnalysisEvidence,
    },
    {
      id: 'no-speed-guarantee',
      labelKey:
        'tools.sql-query-optimizer.capabilities.limits.noSpeedGuarantee',
      evidence: browserAnalysisEvidence,
    },
  ],
  forbiddenClaims: [
    {
      code: 'sql-optimizer-connection-claim',
      pattern:
        /(?<!does not )(?<!doesn't )(?<!no )\b(?:connects? to|queries?) (?:a )?(?:live )?database\b/i,
      reason: 'The browser analyzer does not connect to a database.',
    },
    {
      code: 'sql-optimizer-execution-claim',
      pattern:
        /(?<!does not )(?<!doesn't )(?<!no )\b(?:executes?|runs?) (?:the )?(?:SQL|query|queries)\b/i,
      reason: 'The analyzer reviews text without executing SQL.',
    },
    {
      code: 'sql-optimizer-automatic-rewrite-claim',
      pattern:
        /(?<!does not )(?<!doesn't )(?<!no )\b(?:automatically rewrites?|rewrites? automatically|automatically applies?|applies? automatically) (?:the )?(?:SQL|query|queries|changes?)\b/i,
      reason: 'The analyzer formats SQL but never rewrites or applies changes automatically.',
    },
    {
      code: 'sql-optimizer-verified-index-claim',
      pattern:
        /(?<!does not )(?<!doesn't )(?<!cannot )(?<!can't )\b(?:verifies?|checks?) (?:whether )?(?:the )?(?:suggested )?indexes? (?:exist|exists|against (?:the )?schema)\b|\bverified index (?:advice|candidates?|recommendations?)\b/i,
      reason: 'Index candidates are not verified against a database schema.',
    },
    {
      code: 'sql-optimizer-speed-guarantee-claim',
      pattern:
        /(?<!does not )(?<!doesn't )(?<!cannot )(?<!can't )\b(?:guarantees?|promises?) (?:faster )?(?:query )?(?:speed|performance|execution|improvements?)\b/i,
      reason: 'Static suggestions cannot guarantee database performance gains.',
    },
  ],
  targetSearchIntents: [
    'sql-query-optimizer.static-query-review',
    'sql-query-optimizer.pasted-explain-review',
  ],
  evidenceTests: [
    analyzerEvidence,
    {
      file: 'src/messages/sql-query-optimizer-catalog.test.ts',
      testName:
        'keeps every root aggregate SQL entry identical to its truthful base entry [capability:sql-query-optimizer:profile:release-readiness]',
    },
  ],
});
