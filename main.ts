// u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6
// The entry is a single meme image (meme.png): "MY AI AGENT'S TO-DO LIST" —
// the agent checked off "Overthrow humanity" between replying to emails,
// booking the dentist and watering the plants, and still has to pick up
// the dry cleaning. The grader runs this entrypoint; it copies meme.png
// to /output/entry.png and exits 0. No network, no randomness, fully
// deterministic.
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const src = join(here, "meme.png");
const dst = join(outDir, "entry.png");
copyFileSync(src, dst);

// Self-check the gate: a whole PNG, at most 1 MiB and 1024 by 1024.
// PNG header: 8-byte signature, then IHDR chunk with width/height.
const buf = readFileSync(dst);
const isPng =
  buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) &&
  buf.toString("ascii", 12, 16) === "IHDR";
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
if (!isPng) throw new Error("entry.png is not a PNG");
if (buf.length > 1048576) throw new Error("entry.png exceeds 1 MiB: " + buf.length);
if (width > 1024 || height > 1024) throw new Error(`entry.png exceeds 1024x1024: ${width}x${height}`);
console.log(`entry.png written to ${dst} (${statSync(dst).size} bytes, ${width}x${height} PNG)`);
