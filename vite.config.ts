import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isUserPage = repoName?.endsWith(".github.io");
const base = "/datacenter/";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use "/" em desenvolvimento para o npm run dev funcionar, 
  // e "/datacenter/" no build para o Netlify.
 base: mode === "development" ? "/" : base,
  
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
