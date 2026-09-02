import path from "node:path";
import { defineConfig } from "vitest/config";

/**
 * Unit tests only.
 *
 * The suite covers the pure modules — the calculators and the lead schema
 * helpers — which is where a silent arithmetic or validation change would do
 * real damage: a wrong EMI is a number a customer plans around, and a mobile
 * number that fails to normalise is a lead nobody can call back.
 *
 * The `@/` alias mirrors `tsconfig.json` so tests import modules exactly the
 * way the application does.
 */
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
