import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: undefined }),
    paths: {
      base: process.env.DOCS_BASE || '',
    },
    files: {
      assets: 'static',
    },
    prerender: {
      handleMissingId: 'ignore',
      handleHttpError: ({ path, referrer, message }) => {
        console.warn(`[prerender] ${message}: ${path} (from ${referrer})`);
      },
    },
  },
};

export default config;
