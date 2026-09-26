import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#06080f",
        panel: "#101726",
        ink: "#f4f7ff",
        muted: "#a4b0cc",
        accent: "#2f85ff",
        accentSoft: "#5ca4ff",
      },
      boxShadow: {
        card: "0 14px 32px -18px rgba(7, 15, 34, 0.75)",
      },
      backgroundImage: {
        radialGrid:
          "radial-gradient(circle at center, rgba(72, 140, 246, 0.16) 0%, rgba(6, 8, 15, 0) 64%)",
      },
    },
  },
  plugins: [],
};

export default config;
