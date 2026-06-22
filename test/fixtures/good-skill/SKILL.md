# Good Skill

## When To Use

Use this skill for local release evidence checks.

## Required Inputs

- Local repo path.

## Side-Effect Boundaries

Read-only except explicit output files. Must not call external services.

## Approval Requirements

Ask for approval before publishing or merging.

## Examples

```bash
good-skill check .
```

## Validation Workflow

Run npm test, npm run smoke, and bash scripts/validate.sh.
