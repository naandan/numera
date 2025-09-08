import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Asimovian", "sans-serif"], // Default seluruh project
      },
    },
  },
  plugins: [],
};

export default config;
