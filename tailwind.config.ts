import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102027",
        pitch: "#136f63",
        grass: "#2fbf71",
        sun: "#f2c94c",
        coral: "#ef6351",
        sky: "#63b3ed"
      },
      boxShadow: {
        panel: "0 18px 70px rgba(16, 32, 39, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
