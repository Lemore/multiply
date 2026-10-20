/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Published as a GitHub Pages project site at https://lemore.github.io/multiply/
export default defineConfig({
  base: '/multiply/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});
