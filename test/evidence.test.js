import assert from "node:assert/strict";
import { test } from "node:test";
import { missingKeys, renderMarkdown, scanSkill } from "../dist/index.js";

test("maps complete skill evidence", () => {
  const map = scanSkill("test/fixtures/good-skill");
  assert.equal(map.summary.missing, 0);
  assert.deepEqual(missingKeys(map), []);
  assert.match(renderMarkdown(map), /Side-effect boundaries/);
});

test("reports missing boundaries", () => {
  const map = scanSkill("test/fixtures/incomplete-skill");
  assert.ok(missingKeys(map).includes("side-effect-boundaries"));
});
