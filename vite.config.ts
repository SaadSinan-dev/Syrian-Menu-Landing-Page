import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'
import { resolveApiBase } from './scripts/api-config.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(resolveApiBase(env.VITE_API_URL, mode === 'production')),
    },
    server: {
      proxy: {
        '/api/v1': {
          target: env.MARKETING_API_PROXY_TARGET || 'http://127.0.0.1:3001',
          changeOrigin: false,
        },
      },
    },
    plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  }
})
