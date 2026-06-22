# skill-evidence-map

`skill-evidence-map` creates deterministic evidence maps for portable agent skills. It reads local `SKILL.md`, README, docs, and fixtures, then reports whether triggers, required inputs, side-effect boundaries, examples, validation workflow, fixtures, and verification commands are present.

## Quickstart

```bash
npm install
npm run build
node dist/cli.js scan test/fixtures/good-skill --out tmp/evidence.json
node dist/cli.js render tmp/evidence.json --format markdown
node dist/cli.js check test/fixtures/good-skill
```

## CLI

- `scan <path> --out <file>` writes a JSON evidence map.
- `map <path>` prints the JSON evidence map.
- `render <json> --format markdown` prints a pull-request friendly matrix.
- `check <path> [--fail-on missing-boundaries]` exits non-zero when required evidence is missing.

## Safety Notes

The tool is local-first and read-only. It does not install skills, call LLMs, push branches, or write outside the requested `--out` path. Treat generated maps as review evidence, not a guarantee of skill quality.

## Limitations

Evidence detection is deterministic keyword and file based. It catches missing release-readiness signals but does not judge whether instructions are clear, truthful, or complete.
