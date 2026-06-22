# skill-evidence-map

## When To Use

Use this skill before opening a release-candidate PR for an agent skill repo. It is useful when an agent needs to prove that `SKILL.md`, README, fixtures, docs, and verification commands line up.

## Required Inputs

- A local skill repository path.
- Read access to `SKILL.md`, README, docs, package metadata, and fixtures when present.
- Optional `--out` path for a JSON evidence map.

## Side-Effect Boundaries

The CLI only reads the target repo and writes an explicit output file when `--out` is provided. It must not install skills, publish packages, call external services, or modify source files.

## Approval Requirements

No approval is needed for local scans. Ask for approval before using any generated evidence to publish, merge, tag, or change repository settings.

## Examples

```bash
skill-evidence-map scan ./my-skill --out tmp/evidence.json
skill-evidence-map render tmp/evidence.json --format markdown
skill-evidence-map check ./my-skill --fail-on missing-boundaries
```

## Validation Workflow

Run `npm test`, `npm run check`, `npm run build`, `npm run smoke`, and `bash scripts/validate.sh`. Review missing evidence before classifying the release candidate.
