import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

const sourceRoot = fileURLToPath(new URL('./src/', import.meta.url));

export default defineConfig({
  base: './',
  plugins: [
    {
      name: 'relative-public-asset-urls',
      apply: 'build',
      enforce: 'pre',
      transform(code, id) {
        // CSS URLs are handled by Vite. Runtime URLs in TS/JSX must also
        // resolve under the App's directory, including on GitHub Pages.
        if (!id.startsWith(sourceRoot) || !/\.tsx?$/.test(id)) return;
        return code.replace(/(["'`(])\/assets\//g, '$1./assets/');
      },
    },
    react(),
    tailwind(),
  ],
  server: {host: '0.0.0.0', port: 5317, strictPort: true},
  preview: {host: '0.0.0.0', port: 5317, strictPort: true},
});
