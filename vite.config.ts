
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // Injeta apenas a chave necessária de forma segura
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  }
});
