// One Line, One Laugh — entry runner (rewritten).
//
// The joke itself is a fixed string: the same bytes go to stdout and to
// every copy of entry.txt on each run. Nothing here reads the clock, the
// network, or any random source, so repeated runs cannot drift apart.
//
// Where the file lands:
//   - MAKEFUN_OUTPUT_DIR when that variable is set (the grading sandbox
//     sets it to /output, and per-run scratch dirs are used while
//     verifying determinism), otherwise /output when that directory
//     already exists (the grading sandbox case), otherwise next to this
//     script (entry.txt in the repo folder, local runs only). The script
//     folder is never written when an output folder is available: the
//     grading sandbox mounts the repository read-only, so a write there
//     would throw and fail the run.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OPENER = "My smart fridge emailed me a diet plan,";
const TWIST = "so I unplugged it and ate the evidence.";

function assemble(parts: readonly string[]): string {
  return parts.join(" ");
}

function collectDestinations(): string[] {
  const override = (process.env.MAKEFUN_OUTPUT_DIR ?? "").trim();
  if (override.length > 0) {
    return [override];
  }
  if (existsSync("/output")) {
    return ["/output"];
  }
  return [new URL(".", import.meta.url).pathname];
}

function publish(joke: string): void {
  for (const folder of collectDestinations()) {
    mkdirSync(folder, { recursive: true });
    writeFileSync(join(folder, "entry.txt"), joke, "utf8");
  }
}

const joke = assemble([OPENER, TWIST]);
publish(joke);
console.log(joke);
