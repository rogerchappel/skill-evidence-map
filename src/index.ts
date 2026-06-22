import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export type EvidenceStatus = "present" | "missing";

export interface EvidenceItem {
  key: string;
  label: string;
  status: EvidenceStatus;
  sources: string[];
  detail: string;
}

export interface EvidenceMap {
  schema: "skill-evidence-map/v1";
  target: string;
  checksum: string;
  summary: {
    present: number;
    missing: number;
  };
  evidence: EvidenceItem[];
}

const REQUIRED = [
  {
    key: "triggers",
    label: "When to use triggers",
    patterns: [/when to use/i, /trigger/i, /use this skill/i],
    files: ["SKILL.md"]
  },
  {
    key: "required-inputs",
    label: "Required inputs",
    patterns: [/required inputs?/i, /inputs?/i],
    files: ["SKILL.md", "README.md"]
  },
  {
    key: "side-effect-boundaries",
    label: "Side-effect boundaries",
    patterns: [/side-effect/i, /boundar/i, /must not/i, /read-only/i],
    files: ["SKILL.md", "README.md"]
  },
  {
    key: "approval-requirements",
    label: "Approval requirements",
    patterns: [/approval/i, /confirm/i, /permission/i],
    files: ["SKILL.md", "README.md"]
  },
  {
    key: "examples",
    label: "Examples",
    patterns: [/##\s+examples?/i, /```(?:bash|sh|text)?/i],
    files: ["SKILL.md", "README.md"]
  },
  {
    key: "validation-workflow",
    label: "Validation workflow",
    patterns: [/validation workflow/i, /npm test/i, /smoke/i, /validate/i],
    files: ["SKILL.md", "README.md", "docs/ORCHESTRATION.md"]
  },
  {
    key: "fixtures",
    label: "Fixtures",
    patterns: [/fixture/i],
    files: ["test", "fixtures"]
  },
  {
    key: "release-docs",
    label: "Release candidate docs",
    patterns: [/release candidate/i, /classification/i],
    files: ["docs/RELEASE_CANDIDATE.md", "docs/PRD.md"]
  }
] as const;

export function scanSkill(targetPath: string): EvidenceMap {
  const files = collectFiles(targetPath);
  const evidence = REQUIRED.map((rule) => {
    const sourceHits = files.filter((file) => {
      const normalized = file.path.replaceAll("\\", "/");
      return rule.files.some((hint) => normalized === hint || normalized.startsWith(`${hint}/`) || normalized.endsWith(`/${hint}`));
    });
    const matched = sourceHits.filter((file) => rule.patterns.some((pattern) => pattern.test(file.content)));
    return {
      key: rule.key,
      label: rule.label,
      status: matched.length > 0 ? "present" : "missing",
      sources: matched.map((file) => file.path).sort(),
      detail: matched.length > 0 ? `Matched ${matched.length} source file(s).` : "No matching release-readiness evidence found."
    } satisfies EvidenceItem;
  });
  const present = evidence.filter((item) => item.status === "present").length;
  return {
    schema: "skill-evidence-map/v1",
    target: targetPath,
    checksum: checksum(evidence),
    summary: {
      present,
      missing: evidence.length - present
    },
    evidence
  };
}

export function renderMarkdown(map: EvidenceMap): string {
  const rows = map.evidence.map((item) => {
    const sources = item.sources.length > 0 ? item.sources.join(", ") : "-";
    return `| ${item.label} | ${item.status} | ${sources} | ${item.detail} |`;
  });
  return [
    `# Skill Evidence Map`,
    "",
    `Target: \`${map.target}\``,
    `Checksum: \`${map.checksum}\``,
    "",
    `Present: ${map.summary.present}`,
    `Missing: ${map.summary.missing}`,
    "",
    "| Evidence | Status | Sources | Detail |",
    "| --- | --- | --- | --- |",
    ...rows,
    ""
  ].join("\n");
}

export function missingKeys(map: EvidenceMap): string[] {
  return map.evidence.filter((item) => item.status === "missing").map((item) => item.key);
}

function collectFiles(root: string) {
  const wanted = new Set(["SKILL.md", "README.md", "package.json"]);
  const files: Array<{ path: string; content: string }> = [];
  walk(root, (path) => {
    const rel = relative(root, path).replaceAll("\\", "/");
    if (wanted.has(rel) || rel.startsWith("docs/") || rel.startsWith("test/") || rel.startsWith("fixtures/")) {
      files.push({ path: rel, content: readFileSync(path, "utf8") });
    }
  });
  return files;
}

function walk(path: string, visit: (path: string) => void): void {
  if (!existsSync(path)) return;
  const stat = statSync(path);
  if (stat.isFile()) {
    visit(path);
    return;
  }
  for (const entry of readdirSync(path).sort()) {
    if (entry === "node_modules" || entry === "dist" || entry === ".git") continue;
    walk(join(path, entry), visit);
  }
}

function checksum(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 16);
}
