# PRD: skill-evidence-map

Status: in-progress
Decision: build next
Created: 2026-06-22

## Pitch

`skill-evidence-map` turns a portable agent skill into a local release-readiness map that links triggers, required inputs, side-effect boundaries, fixtures, docs, and verification commands.

## Why It Matters

Skill repos often have the right pieces but no quick way to prove that the `SKILL.md`, fixtures, README, and release notes agree. Agents need a deterministic evidence map before opening a release-candidate PR.

## Source / Attribution

Inspired by Roger's skill packaging lanes, release-candidate evidence habits, and today's `skillfixture-hub` build. It should be an original local-first mapper and must not copy private skill content.

## V1 Scope

- TypeScript CLI with `scan`, `map`, `render`, and `check`.
- Parse local `SKILL.md`, README, fixture files, and docs metadata.
- Emit JSON and Markdown evidence maps.
- Flag missing required inputs, side-effect boundaries, examples, validation workflow, fixtures, and verification commands.
- Include fixture-backed tests and a smoke command.

## Out of Scope

- Judging skill quality with LLM calls.
- Installing skills into live hosts.
- Publishing release artifacts.

## CLI Sketch

```bash
skill-evidence-map scan ./my-skill --out tmp/evidence.json
skill-evidence-map render tmp/evidence.json --format markdown
skill-evidence-map check ./my-skill --fail-on missing-boundaries
```

## Required Deliverables

- `docs/PRD.md`, `docs/TASKS.md`, and `docs/ORCHESTRATION.md`.
- `SKILL.md` describing when agents should use the tool.
- Local CLI/library API, fixtures, tests, smoke script, package metadata, README, and release-candidate notes.

## Verification

Run `npm test`, `npm run check`, `npm run build`, `npm run smoke`, `bash scripts/validate.sh`, and a CLI fixture smoke.

## Agent Prompt

Build `skill-evidence-map` as a local-first release evidence mapper for portable agent skills. Keep outputs deterministic, reviewable, and safe for public repos.
