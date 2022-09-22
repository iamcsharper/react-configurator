import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import dotenv from 'dotenv';
import EnvironmentPlugin from 'vite-plugin-environment';

dotenv.config();

const ASSET_URL = process.env.ASSET_URL || '';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    EnvironmentPlugin(['ASSET_URL', 'BASE_URL']),
    svgr(),
    tsconfigPaths(),
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  server: {
    port: 3000,
  },
  base: ASSET_URL,
  esbuild: {
    define: {
      this: 'window',
    },
    jsxFactory: `jsx`,
    // jsxInject: `import { jsx } from '@emotion/react'`,
  },
});
