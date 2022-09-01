import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

console.log(">>>>", path.resolve(__dirname, "src/styles/common.less"));
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				additionalData: `@import "${path.resolve(
					__dirname,
					"src/styles/common.less"
				)}";`,
			},
		},
	},
	resolve: {
		alias: {
			"@src": path.resolve(__dirname, "./src"),
		},
	},
});
