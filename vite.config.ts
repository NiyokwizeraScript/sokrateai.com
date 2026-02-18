import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Custom plugin to run Express app as middleware
const expressServer = () => {
  return {
    name: 'express-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api')) {
          return next();
        }
        
        try {
          const { default: app } = await import(path.resolve(__dirname, './api/index.js'));
          app(req, res, next);
        } catch (error) {
          console.error('API Error:', error);
          next(error);
        }
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), expressServer()],
    server: {
        port: 8000,
        host: '0.0.0.0',
        // Proxy is no longer needed since we handle /api internally
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
})
