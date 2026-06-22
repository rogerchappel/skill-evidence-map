#!/usr/bin/env bash
set -euo pipefail
node dist/cli.js scan test/fixtures/good-skill --out tmp/evidence.json
node dist/cli.js render tmp/evidence.json --format markdown > tmp/evidence.md
node dist/cli.js check test/fixtures/good-skill
