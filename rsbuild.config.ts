import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { pluginOpenGraph } from "rsbuild-plugin-open-graph";

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSvgr({
      svgrOptions: {
        exportType: "named",
      },
    }),
    pluginOpenGraph({
      title: "Ohddang's Website",
      type: "website",
      url: "https://rsbuild.dev/",
      image: "./images/509.webp",
      description: "프론트엔드 개발자 오영곤의 웹사이트입니다.",
    }),
  ],
  html: {
    title: "Ohddang's Website",
    favicon: "./src/assets/509.ico",
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
