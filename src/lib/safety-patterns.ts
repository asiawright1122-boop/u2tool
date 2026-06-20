/**
 * Authoritative reasoning-trace / internal-deliberation patterns.
 *
 * Single source of truth for ADR 0002 (No Internal Reasoning in Frontend)
 * enforcement. Consumed by both:
 *   - source-file scanning (scripts/validation/validate-front-end-safety.ts)
 *   - live-HTML scanning (scripts/validation/validate-live-redirects.ts, Phase 76)
 *
 * Keeping these patterns in one place prevents the two consumers from drifting
 * on what counts as a forbidden internal trace.
 */

export interface ForbiddenPattern {
  label: string;
  pattern: RegExp;
}

export const REASONING_TRACE_PATTERNS: ForbiddenPattern[] = [
  { label: 'chain-of-thought', pattern: /\bchain[-\s]?of[-\s]?thought\b/i },
  { label: 'reasoning trace', pattern: /\breasoning\s+trace\b/i },
  { label: 'internal reasoning', pattern: /\binternal\s+reasoning\b/i },
  { label: 'hidden reasoning', pattern: /\bhidden\s+reasoning\b/i },
  { label: 'hidden prompt', pattern: /\bhidden\s+prompt\b/i },
  { label: 'developer message leak', pattern: /\bdeveloper\s+messages?\b/i },
  { label: 'agent handoff leak', pattern: /\bagent\s+handoffs?\b/i },
  { label: 'scratchpad reasoning leak', pattern: /\bscratchpad\b.*\b(reasoning|thought|deliberation)\b/i },
  { label: 'model thinking leak', pattern: /\b(show|display|reveal)\b.*\b(model|assistant|agent)\b.*\bthinking\b/i },
  { label: 'Chinese chain-of-thought', pattern: /思考链|推理链/ },
  { label: 'Chinese internal reasoning', pattern: /内部(?:推理|思考)/ },
  { label: 'Chinese hidden prompt', pattern: /隐藏提示词|系统提示词/ },
];
