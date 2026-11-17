/**
 * Memeriksa anggaran ukuran bundel PRD §5.5:
 * - JS awal rute beranda (tanpa 3D) <= 180 KB gzip
 * - Potongan 3D lazy <= 500 KB gzip
 * Dijalankan setelah `npm run build`. Keluar dengan kode 1 bila melampaui batas.
 */
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { gzipSync } from "node:zlib";

const LIMIT_HOME_KB = 180;
const LIMIT_3D_KB = 500;
const root = resolve(import.meta.dirname, "..");
const nextDir = join(root, ".next");

const buildManifestPath = join(nextDir, "build-manifest.json");
if (!existsSync(buildManifestPath)) {
  console.error("check-bundle: .next/build-manifest.json tidak ditemukan. Jalankan `npm run build` lebih dulu.");
  process.exit(1);
}

interface BuildManifest {
  polyfillFiles: string[];
  rootMainFiles: string[];
}

interface ClientModuleEntry {
  chunks?: string[];
}

const buildManifest = JSON.parse(readFileSync(buildManifestPath, "utf8")) as BuildManifest;
const files = new Set<string>([...buildManifest.polyfillFiles, ...buildManifest.rootMainFiles]);

const homeManifestPath = join(nextDir, "server/app/page_client-reference-manifest.js");
if (existsSync(homeManifestPath)) {
  const code = readFileSync(homeManifestPath, "utf8");
  const sandbox: { globalThis: { __RSC_MANIFEST?: Record<string, { clientModules?: Record<string, ClientModuleEntry> }> } } = {
    globalThis: {},
  };
  runInNewContext(code, sandbox);
  const homeManifest = sandbox.globalThis.__RSC_MANIFEST?.["/page"];
  if (homeManifest?.clientModules) {
    for (const mod of Object.values(homeManifest.clientModules)) {
      for (const chunk of mod.chunks ?? []) {
        if (typeof chunk === "string" && chunk.endsWith(".js")) files.add(chunk);
      }
    }
  }
}

let totalGzipBytes = 0;
for (const relPath of files) {
  const fullPath = join(nextDir, relPath);
  if (!existsSync(fullPath)) continue;
  const bytes = gzipSync(readFileSync(fullPath)).length;
  totalGzipBytes += bytes;
  console.log(`  ${relPath}: ${(bytes / 1024).toFixed(2)} KB gzip`);
}

const totalKb = totalGzipBytes / 1024;
console.log(`check-bundle: total JS awal / = ${totalKb.toFixed(2)} KB gzip (batas <= ${LIMIT_HOME_KB} KB)`);

let failed = false;
if (totalKb > LIMIT_HOME_KB) {
  console.error(`check-bundle: JS awal / MELAMPAUI batas ${LIMIT_HOME_KB} KB gzip.`);
  failed = true;
}

const loadablePath = join(nextDir, "react-loadable-manifest.json");
if (existsSync(loadablePath)) {
  const loadable = JSON.parse(readFileSync(loadablePath, "utf8")) as Record<string, { files?: string[] }>;
  const sceneKey = Object.keys(loadable).find((k) => k.includes("FlowerScene"));
  if (sceneKey) {
    const chunkFiles = new Set((loadable[sceneKey]?.files ?? []).filter((f) => f.endsWith(".js")));
    let sceneGzipBytes = 0;
    for (const relPath of chunkFiles) {
      const fullPath = join(nextDir, relPath);
      if (!existsSync(fullPath)) continue;
      const bytes = gzipSync(readFileSync(fullPath)).length;
      sceneGzipBytes += bytes;
    }
    const sceneKb = sceneGzipBytes / 1024;
    console.log(`check-bundle: potongan 3D lazy (${sceneKey}) = ${sceneKb.toFixed(2)} KB gzip (batas <= ${LIMIT_3D_KB} KB)`);
    if (sceneKb > LIMIT_3D_KB) {
      console.error(`check-bundle: potongan 3D MELAMPAUI batas ${LIMIT_3D_KB} KB gzip.`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
