// gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the
// repository root to /output/POST.json, where the gate reads it. That is all the program
// has to do. The entry is the post itself: the meme (meme.png, made in-session: a
// Vice City sunset with the real make.fun ghost worked into the scene) is posted on X
// from a public account with make.fun and the play code in its text, POST.json names
// the post, and the house reads the post from X and hands it to the judge.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The gate refuses a placeholder address (valid 0), so refuse to run with one:
// POST.json must name a real posted X status before this entry is submitted.
const postPath = join(BOT_DIR, 'POST.json');
let postUrl: string;
try {
  postUrl = (JSON.parse(readFileSync(postPath, 'utf8')) as { url: string }).url;
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (!/^https:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+$/.test(postUrl)) {
  console.error(`POST.json does not name a real X post yet: ${postUrl}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(postPath, join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
