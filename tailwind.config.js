/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "mono-gray": {
          DEFAULT: "#808080", // 기본 모노톤 색상d
          50: "#f7f7f7",
          100: "#e1e1e1",
          200: "#cfcfcf",
          300: "#b1b1b1",
          400: "#9e9e9e",
          500: "#7e7e7e",
          600: "#626262",
          700: "#515151",
          800: "#3b3b3b",
          850: "#2f2f2f",
          900: "#222222",
          950: "#1a1a1a",
        },
      },
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
        swing: "swing 3s linear infinite",
        "swing-inverse": "swing-inverse 3s linear infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    // ... other plugins
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
          "&::-webkit-scrollbar": {
            display: "none" /* Chrome, Safari, Opera */,
          },
        },
      });
    },
  ],
};
