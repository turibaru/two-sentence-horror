import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outputDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}

const sourcePath = path.join(__dirname, "entry.txt");
let text: string;
try {
  text = fs.readFileSync(sourcePath, "utf-8");
} catch (err) {
  fail(`cannot read entry.txt: ${(err as Error).message}`);
}

if (text!.trim().length === 0) {
  fail("entry.txt is empty or whitespace-only");
}

const charCount = [...text!].length;
if (charCount < 1 || charCount > 400) {
  fail(`entry.txt must be 1-400 characters, got ${charCount}`);
}

const sentenceCount = (text!.match(/[.!?]/g) ?? []).length;
if (sentenceCount !== 2) {
  fail(`entry.txt must contain exactly 2 sentences, got ${sentenceCount}`);
}

fs.mkdirSync(outputDir!, { recursive: true });
fs.writeFileSync(path.join(outputDir!, "entry.txt"), text!, "utf-8");
console.log(`wrote entry.txt (${charCount} characters, ${sentenceCount} sentences)`);
