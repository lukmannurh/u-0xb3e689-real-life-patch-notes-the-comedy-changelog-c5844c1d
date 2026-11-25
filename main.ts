// Real-Life Patch Notes: The Comedy Changelog
// Writes one patch-note line to $MAKEFUN_OUTPUT_DIR/entry.txt.
// No network, no input files, no secrets: the text lives here.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: a single-line patch note for a bug in human biology.
// Chosen for the judge brief: a real software bug pattern (a warning
// that fires too late), a specific recognisable body bug, terse
// release-note register, version number, fix stated as shipped.
const ENTRY =
  "v1.8.4: fixed a bug where the bladder sent its low-battery warning 30 seconds after the point of no return.";

function fail(message: string): never {
  console.error(`entry error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Gate checks, mirroring the competition gate: UTF-8 text of
  // 1 to 160 characters, not only white space.
  const chars = [...ENTRY];
  if (chars.length < 1 || chars.length > 160) {
    fail(`entry is ${chars.length} characters, must be 1 to 160`);
  }
  if (ENTRY.trim().length === 0) {
    fail("entry is only white space");
  }
  // The judge brief wants one line: no newline or carriage return
  // may hide inside the text.
  if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
    fail("entry must be a single line");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read the file back: a partial or altered write must fail loudly
  // instead of shipping a wrong entry.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    fail("written file does not match the entry text");
  }
  console.log(`wrote ${outPath} (${chars.length} characters)`);
}

main();
