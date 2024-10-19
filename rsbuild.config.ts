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
    meta: [
      { tag: "meta", attrs: { property: "og:title", content: "Ohddang's Website" } },
      { tag: "meta", attrs: { property: "og:description", content: "프론트엔드 개발자 오영곤의 웹사이트입니다." } },
      { tag: "meta", attrs: { property: "og:image", content: "./images/509.webp" } },
    ],
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
