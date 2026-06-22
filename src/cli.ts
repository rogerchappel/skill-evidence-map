import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { missingKeys, renderMarkdown, scanSkill, type EvidenceMap } from "./index.js";

export async function main(argv: string[]): Promise<void> {
  const [command, target, ...rest] = argv;
  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }
  if (!target) throw new Error(`Missing target for ${command}.`);

  if (command === "scan" || command === "map") {
    const map = scanSkill(target);
    const out = option(rest, "--out");
    if (out) {
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, `${JSON.stringify(map, null, 2)}\n`);
    } else {
      console.log(JSON.stringify(map, null, 2));
    }
    return;
  }

  if (command === "render") {
    const parsed = JSON.parse(readFileSync(target, "utf8")) as EvidenceMap;
    console.log(renderMarkdown(parsed));
    return;
  }

  if (command === "check") {
    const map = scanSkill(target);
    const missing = missingKeys(map);
    if (missing.length > 0) {
      console.error(`Missing evidence: ${missing.join(", ")}`);
      process.exitCode = 1;
    } else {
      console.log(`Evidence complete: ${map.summary.present} checks present.`);
    }
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

function option(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function printHelp(): void {
  console.log(`skill-evidence-map scan <skill-dir> [--out file]\nskill-evidence-map map <skill-dir>\nskill-evidence-map render <evidence.json> --format markdown\nskill-evidence-map check <skill-dir>`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
