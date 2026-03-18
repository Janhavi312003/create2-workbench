import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  worker: {
    format: 'es'
  },
  build: {
    // Suppress known upstream warning from `ox` deps about PURE annotations.
    rollupOptions: {
      onwarn(warning, warn) {
        const msg =
          typeof warning === 'string'
            ? warning
            : (warning as { message?: string }).message ?? ''

        if (
          msg.includes('contains an annotation that Rollup cannot interpret') &&
          msg.includes('/*#__PURE__*/')
        ) {
          return
        }

        warn(warning)
      },
    },
    // Avoid noisy warnings for large web3 vendor bundles.
    chunkSizeWarningLimit: 2000,
  },
})
