# BRIEFING — 2026-06-04T15:19:30+08:00

## Mission
Build and integrate the 2026 World Cup Monte Carlo Probability Simulator (world-cup-simulator) with translations, Svelte 5, and ECharts.

## 🔒 My Identity
- Archetype: Project Orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /Users/kaka/Dev/u2tool/.agents/orchestrator
- Original parent: main agent
- Original parent conversation ID: 4eb91d59-1ae2-450b-a7c3-9e684cc66ce4

## 🔒 My Workflow
- **Pattern**: Project
- **Scope document**: /Users/kaka/Dev/u2tool/PROJECT.md
1. **Decompose**: Decompose the requirements into milestones.
2. **Dispatch & Execute**:
   - **Direct (iteration loop)**: Not applicable (we use decomposition/delegation to sub-orchestrators).
   - **Delegate (sub-orchestrator)**: Spawn a sub-orchestrator for each milestone.
3. **On failure** (in this order):
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
   - Escalate: report to parent (sub-orchestrators only, last resort)
4. **Succession**: Self-succeed when cumulative sub-agent spawn count >= 16 and all subagents are complete.
- **Work items**:
  1. Decompose & create PROJECT.md [pending]
  2. E2E Testing Track setup [pending]
  3. Milestone 1: Simulation Engine [pending]
  4. Milestone 2: Svelte 5 Component & ECharts UI [pending]
  5. Milestone 3: Translations & Route Config [pending]
  6. Milestone 4: Tests & Integration [pending]
- **Current phase**: 1
- **Current focus**: Decompose & create PROJECT.md

## 🔒 Key Constraints
- NEVER write, modify, or create source code files directly.
- NEVER run build/test commands yourself — require workers to do so.
- You MAY use file-editing tools ONLY for metadata/state files (.md) in your .agents/ folder.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh

## Current Parent
- Conversation ID: 4eb91d59-1ae2-450b-a7c3-9e684cc66ce4
- Updated: not yet

## Key Decisions Made
- Initialized briefing and progress tracking.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_initial_planning | teamwork_preview_explorer | Initial Codebase Explorer | completed | 944b3291-1673-466e-916c-db6ad4531b81 |
| worker_verification | teamwork_preview_worker | Verification Worker | completed | 10886876-bedf-4636-9b3c-55890ae5837b |
| reviewer_1 | teamwork_preview_reviewer | Reviewer 1 | in-progress | a392f27f-2f5b-48a6-b0e5-6a6a23e3ed68 |
| reviewer_2 | teamwork_preview_reviewer | Reviewer 2 | in-progress | 38aead98-5a1a-4804-a148-3e5f4c2d26fd |
| challenger_1 | teamwork_preview_challenger | Challenger 1 | in-progress | eeeebe58-50a9-42b5-8941-be39d659c03c |
| challenger_2 | teamwork_preview_challenger | Challenger 2 | completed | 6a0ab1fa-8f08-4867-b58f-1ae0ea8c9e62 |
| auditor_1 | teamwork_preview_auditor | Forensic Auditor | in-progress | 3c7b9f80-b954-481c-99d2-703ea430bd5f |

## Succession Status
- Succession required: no
- Spawn count: 7 / 16
- Pending subagents: a392f27f-2f5b-48a6-b0e5-6a6a23e3ed68, 38aead98-5a1a-4804-a148-3e5f4c2d26fd, eeeebe58-50a9-42b5-8941-be39d659c03c, 3c7b9f80-b954-481c-99d2-703ea430bd5f
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: 8919b044-e026-464a-8df6-006f7fa31bd7/task-33
- Safety timer: none
- On succession: kill all timers before spawning successor
- On context truncation: run `manage_task(Action="list")` — re-create if missing

## Artifact Index
- /Users/kaka/Dev/u2tool/.agents/orchestrator/BRIEFING.md — My working memory
- /Users/kaka/Dev/u2tool/.agents/orchestrator/progress.md — Liveness/progress report
- /Users/kaka/Dev/u2tool/.agents/orchestrator/original_prompt.md — Copy of original request
