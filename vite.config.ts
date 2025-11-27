import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: '/',
    define: {
      // Robustly check both process.env (Netlify system vars) and loaded env (Vite)
      // This fixes the issue where Netlify vars weren't being picked up
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || env.API_KEY || process.env.VITE_API_KEY || ''),
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      emptyOutDir: true,
    },
    server: {
      host: true,
    }
  };
});