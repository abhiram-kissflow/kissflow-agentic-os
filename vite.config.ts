import { defineConfig } from 'vite';

// Project GitHub Pages serve under /<repo>/. Base is applied at build time only,
// so the dev server stays at the clean root. Override the repo slug with
// GH_PAGES_BASE if the repository is renamed.
const REPO_BASE = process.env.GH_PAGES_BASE ?? '/-kissflow-agentic-os/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? REPO_BASE : '/',
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
}));
