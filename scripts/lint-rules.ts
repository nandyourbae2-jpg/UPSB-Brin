/**
 * Linter aturan proyek yang tidak bisa dicakup ESLint bawaan.
 * Menolak: emoji, spasi di luar token, nilai piksel bebas, gradasi dekoratif,
 * label kapital berjarak, dan frasa klaim terlarang di src/.
 * Keluar dengan kode 1 bila ada pelanggaran.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const srcDir = join(root, "src");

// Berkas yang dikecualikan: hasil generate dan modul 3D (gradasi/emisi dibahas di rule 3D).
const skipFiles = new Set([join("src", "styles", "tokens.css")]);
const skipDirs = ["fonts", join("src", "3d")];

// Token spasi sah (angka Tailwind = kelipatan 4 px).
const allowedSpace = new Set(["0", "1", "2", "3", "4", "5", "6", "8", "10", "12", "16", "px", "auto", "full", "screen"]);
const spacingPrefix = "(?:p|px|py|pt|pr|pb|pl|ps|pe|m|mx|my|mt|mr|mb|ml|ms|me|gap|gap-x|gap-y|space-x|space-y|inset|inset-x|inset-y|top|right|bottom|left|size|w|h|min-w|min-h|max-w|max-h)";
// Angka bulat atau pecahan sederhana yang dipakai sebagai nilai spasi.
const spaceClass = new RegExp(`(?<![\\w-])-?${spacingPrefix}-(\\d+(?:\\.\\d+)?)(?![\\w/.-])`, "g");

const claimPhrases = [
  /bebas\s+virus/i,
  /terindeks\s+virus/i,
  /tahan\s+semua\s+kondisi/i,
  /stok\s+(?:pasti|tersedia\s+selalu)/i,
  /dijamin\s+(?:kirim|tiba|stok|tumbuh|cocok)/i,
  /jaminan\s+dataran\s+rendah/i,
  /afiliasi\s+brin/i,
  /sertifikat\s+pvt\s+(?:nomor|no\.?)\s*\d+/i,
];

interface Violation {
  file: string;
  line: number;
  rule: string;
  text: string;
}

const violations: Violation[] = [];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(root, full);
    if (skipDirs.some((d) => rel === d || rel.startsWith(`${d}/`))) continue;
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(tsx?|css)$/.test(name) && !skipFiles.has(rel)) out.push(full);
  }
  return out;
}

const emoji = /\p{Extended_Pictographic}/u;

for (const file of walk(srcDir)) {
  const rel = relative(root, file);
  const lines = readFileSync(file, "utf8").split("\n");
  const isContent = rel.startsWith(join("src", "content")) || rel.startsWith(join("src", "app"));
  const isClassContext = /\.tsx$/.test(file);

  lines.forEach((text, i) => {
    const line = i + 1;
    const add = (rule: string) => violations.push({ file: rel, line, rule, text: text.trim() });
    const trimmed = text.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) {
      // Komentar boleh menyebut frasa terlarang sebagai contoh; tetap periksa emoji.
      if (emoji.test(text)) add("emoji");
      return;
    }

    if (emoji.test(text)) add("emoji");
    if (/linear-gradient|radial-gradient|conic-gradient|\bbg-gradient-|\bbg-linear-|\bfrom-\w|\bvia-\w|\bto-\w+-\d/.test(text)) add("gradasi-dekoratif");
    if (/\buppercase\b|\btracking-(?:wide|wider|widest)\b/.test(text)) add("label-kapital-berjarak");

    if (isClassContext) {
      // Nilai piksel bebas di dalam kelas Tailwind, mis. p-[13px], w-[250px].
      if (/(?<![\w-])-?(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|gap|gap-x|gap-y|space-x|space-y|top|right|bottom|left|size)-\[[^\]]*\d+px[^\]]*\]/.test(text)) {
        add("piksel-bebas");
      }
      for (const m of text.matchAll(spaceClass)) {
        const n = m[1] ?? "";
        if (!allowedSpace.has(n)) add(`spasi-di-luar-token(${m[0]})`);
      }
    }

    if (isContent) {
      // Abaikan frasa negatif/disclaimer yang menjelaskan larangan secara eksplisit (mis. "bukan sertifikat bebas virus" atau "tidak bebas virus").
      const withoutNegation = text.replace(/\b(?:bukan|tidak|tanpa|dilarang)\s+(?:klaim\s+|sertifikat\s+|pernyataan\s+)?(?:bebas\s+virus|terindeks\s+virus|afiliasi\s+brin)/gi, "");
      for (const re of claimPhrases) if (re.test(withoutNegation)) add(`klaim-terlarang(${re.source})`);
    }
  });
}

if (violations.length > 0) {
  console.error(`lint-rules: ${violations.length} pelanggaran`);
  for (const v of violations) console.error(`  ${v.file}:${v.line}  [${v.rule}]  ${v.text}`);
  process.exit(1);
}
console.log("lint-rules: bersih");
