import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0A0118",
          2:       "#14082B",
          elev:    "#1A0F32",
          card:    "rgba(255, 255, 255, 0.04)",
        },
        ink: {
          DEFAULT: "#FFFFFF",
          soft:    "rgba(255, 255, 255, 0.85)",
          mute:    "rgba(255, 255, 255, 0.55)",
          faint:   "rgba(255, 255, 255, 0.32)",
        },
        line: {
          DEFAULT: "rgba(255, 255, 255, 0.10)",
          soft:    "rgba(255, 255, 255, 0.05)",
        },
        accent: {
          pink:   "#FF006E",
          purple: "#8338EC",
          blue:   "#3A86FF",
          lime:   "#06FFA5",
          yellow: "#FFBE0B",
          orange: "#FB5607",
        },
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        sans:    ["Inter", "system-ui", "sans-serif"],
        body:    ["Inter", "system-ui", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
      borderRadius: {
        sm: "10px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
