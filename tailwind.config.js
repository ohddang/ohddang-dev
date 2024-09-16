/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        notoSans: ["Noto Sans KR", "sans-serif"],
      },
      animation: {
        "rotate-gradient": "rotate-gradient 4s linear infinite",
        "rotate-z": "rotate-z 4s linear infinite",
        "gradient-animation": "gradient-animation 10s ease infinite",
        "color-morph": "color-morph 10s linear infinite",
        "color-morph-border": "color-morph-border",
        "slide-down": "slide-down 0.5s ease-in-out",
        "soccer-path": "soccer-path",
        "passion-path": "passion-path",
        "projects-path": "projects-path",
        "experience-path": "experience-path",
        "fire-path": "fire-path",
      },
    },
  },
};
