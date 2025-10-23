import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig(({ command }) => {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
  const base = command === 'build' && repo ? `/${repo}/` : '/'

  return {
    base,
    plugins: [nodePolyfills(), react()],
    resolve: {
      alias: {
        '@': '/src',
        buffer: 'buffer',
      },
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
        'Cross-Origin-Embedder-Policy': 'unsafe-none',
      },
    },
  }
})
