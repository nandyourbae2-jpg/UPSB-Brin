import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  CONTENT_ENV: z.enum(["staging", "production"]).default("staging"),
  // Opsional sampai ditetapkan pemilik produk (atau SiteSetting di M4).
  SITE_WHATSAPP_NUMBER: z
    .string()
    .regex(/^\d{9,15}$/, "Format digit internasional tanpa +, mis. 6281234567890")
    .optional()
    .or(z.literal("")),
  SHOW_INDICATIVE_PRICES: z.enum(["true", "false"]).default("true"),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

/** Membaca dan memvalidasi variabel lingkungan. Gagal cepat dengan pesan yang jelas. */
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Variabel lingkungan tidak valid. ${detail}. Lihat .env.example.`);
  }
  const env = parsed.data;
  // Produksi Vercel tidak boleh berjalan dengan gerbang konten staging.
  if (env.VERCEL_ENV === "production" && env.CONTENT_ENV !== "production") {
    throw new Error('CONTENT_ENV harus "production" di lingkungan produksi Vercel.');
  }
  cached = env;
  return env;
}

/** Halaman internal (kitchen-sink) hanya boleh ada di luar produksi. */
export function isProductionDeploy(): boolean {
  return process.env.VERCEL_ENV === "production";
}
