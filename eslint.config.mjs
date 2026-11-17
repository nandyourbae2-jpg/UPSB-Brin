import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts", "playwright-report/**", "test-results/**"],
  },
  {
    rules: {
      // Aturan rekayasa: TypeScript ketat, tanpa `any` tanpa alasan tertulis.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/ban-ts-comment": ["error", { "ts-ignore": true, "ts-expect-error": "allow-with-description" }],
    },
  },
];

export default config;
