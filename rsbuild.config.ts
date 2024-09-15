import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    tags: [
      { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.googleapis.com" } },
      { tag: "link", attrs: { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" } },
      { tag: "link", attrs: { href: "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100..900&display=swap", rel: "stylesheet" } },
    ],
  },
});
