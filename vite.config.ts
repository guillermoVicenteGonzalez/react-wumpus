import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// preview: {
	// 	host: true,
	// 	port: 5173,
	// },
	server: {
		host: true,
		port: 5173,
		watch: {
			usePolling: true,
		},
	},
});
