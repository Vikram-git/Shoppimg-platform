import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Shoppimg-platform/', // ✅ MUST MATCH REPO NAME
})