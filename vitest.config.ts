import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node", // backend
		globals: true,
		include: ["./tests/**/*.test.ts", "./tests/**/*.spec.ts"],
		setupFiles: ["./tests/setup.ts"],
		env: {
			NODE_ENV: "test"
		},
		coverage: {
			reporter: ["text", "json", "html"],
			exclude: ["node_modules/", "dist/", "tests/", "**/*.test.ts", "**/*.spec.ts"]
		}
	}
});
