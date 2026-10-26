import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ['test/*.test.ts'],
    reporters: [ 'default' ],
    slowTestThreshold: 1500, // temps maximum de réponse considéré comme normal
    typecheck: {
      tsconfig: "./tsconfig.test.json"
    }
  }
});
