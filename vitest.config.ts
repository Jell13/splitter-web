import { defineConfig, configDefaults } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "convex",
          include: ["convex/**/*.test.{ts,js}"],
          environment: "edge-runtime",
        },
      },
      {
        extends: true,
        test: {
          name: "frontend",
          include: ["**/*.test.{ts,tsx,js,jsx}"],
          exclude: [...configDefaults.exclude, "convex/**", "tests/**"],
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
        },
      },
    ],
  },
});