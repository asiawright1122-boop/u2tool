/** A regex match is a review hint, not a vulnerability verdict or safety score. */
export function describeInjectionResult(result: { issues: readonly unknown[] }) {
  return {
    label: result.issues.length ? 'Potential risk patterns detected' : 'No patterns detected',
    caution: 'Heuristic pattern check only. No match does not establish safety. False positives and missed vulnerabilities are possible; review parameter binding and application data flow separately.',
  };
}
