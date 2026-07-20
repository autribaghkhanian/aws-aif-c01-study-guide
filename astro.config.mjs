import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://autribaghkhanian.github.io',
  base: '/aws-aif-c01-study-guide',
  integrations: [mdx()],
  vite: { plugins: [tailwindcss()] },
});
