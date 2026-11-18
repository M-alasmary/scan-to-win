import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// Strict Content-Security-Policy injected into production HTML only
// (dev server needs inline scripts for HMR). No external origins at all.
const csp = (): Plugin => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml(html) {
    const policy = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "media-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'none'",
    ].join('; ')
    return html.replace(
      '<meta charset="UTF-8" />',
      `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
    )
  },
})

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), csp()],
  build: {
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        poster: resolve(import.meta.dirname, 'poster.html'),
      },
    },
  },
})
