import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr({
      svgrOptions: {
        exportType: "named",
      },
    }),
  ],
  html: {
    tags: [
      { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
      { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" } },
      {
        tag: "link",
        attrs: {
          rel: "preload",
          href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap",
          as: "style",
          onload: "this.onload=null;this.rel='stylesheet'",
        },
      },
    ],
  },
});
