import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/factory/oneTimeMsg.ts"),
			name: "MyLib", // global name for UMD
			fileName: "oneTimeMsg",
			formats: ["es", "umd"], // ES module + UMD for browser/node
		},
		outDir: "dist",
		sourcemap: false,
		emptyOutDir: true,
	},
});
