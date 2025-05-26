import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      include: "**/*.{js,jsx}"
    })
  ],
  server: {
    port: 3000,
    open: true,
    cors: true,
    host: true,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          ui: ['@heroicons/react', 'react-icons', 'framer-motion']
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'three',
      '@react-three/fiber',
      '@react-three/drei'
    ]
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': '/src'
    }
  }
}) 