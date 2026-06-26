import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    // three.js and gsap are large vendor libs; split them into their own
    // chunks so the app entry stays small. three's core is ~560 kB and cannot
    // be reduced further, so the warning limit is lifted to cover that single
    // known vendor chunk rather than firing on every build.
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
          return undefined;
        },
      },
    },
  },
});
