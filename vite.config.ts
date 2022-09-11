import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

const base = "https://iamcsharper.github.io/react-configurator/dist/";
// const base = '';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    tsconfigPaths(),
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  base,
  esbuild: {
    define: {
      this: "window",
    },
    jsxFactory: `jsx`,
    // jsxInject: `import { jsx } from '@emotion/react'`,
  },
});
