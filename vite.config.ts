import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      name: 'sdk',
      entry: 'src/websdk.ts',
    },
  },
});
