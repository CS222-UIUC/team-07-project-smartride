//this is the file to connect frontend and backend

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';  // or @vitejs/plugin-vue, etc.

export default defineConfig({
  plugins: [react()],
  server: {
    // This tells Vite: if the frontend requests /api/..., forward it to Flask at port 5000
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
});
