// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  test: {
    // Le decimos a Vitest que busque los archivos de prueba principalmente en la carpeta 'tests'
    include: ['tests/**/*.{test,spec}.ts'],
    clearMocks: true,
    // (Opcional) Configura un alias para facilitar las importaciones
    // alias: {
    //   '@': './src',
    // }
  },

  plugins: [tsconfigPaths()], 
});