// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wjsutton.github.io',
  output: 'static',
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
});
