import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#14396A",
          foreground: "#FFFFFF",
          dark: "#0E2A4E",
          light: "#0B5CAD",
          deep: "#0A2140",
        },
        amber: {
          DEFAULT: "#F2A900",
          dark: "#D99500",
          light: "#FEF6D8",
        },
        link: "#0B5CAD",
        ink: {
          DEFAULT: "#1B2430",
          muted: "#5B6675",
        },
        page: "#F5F7FA",
        surface: "#FFFFFF",
        hairline: "#D5DBE3",
        "table-head": "#EEF1F5",
        "status-good-bg": "#E6F4EA",
        "status-good-fg": "#14532D",
        "status-good-border": "#86C79B",
        "status-watch-bg": "#FEF6D8",
        "status-watch-fg": "#6B4E00",
        "status-watch-border": "#E5C34D",
        "status-warning-bg": "#FDEAD7",
        "status-warning-fg": "#8A3B00",
        "status-warning-border": "#F0A15E",
        "status-danger-bg": "#FBE3E1",
        "status-danger-fg": "#8B1A12",
        "status-danger-border": "#E88B84",
        "status-neutral-bg": "#EEF1F5",
        "status-neutral-fg": "#3D4756",
        "status-neutral-border": "#C5CDD8",
        "rain-light-bg": "#E6F0FB",
        "rain-light-fg": "#12467A",
        "rain-light-border": "#A9C8EC",
        "rain-moderate-bg": "#CFE3F8",
        "rain-moderate-fg": "#0E3A66",
        "rain-moderate-border": "#86B2E0",
        "rain-heavy-bg": "#0E3A66",
        "rain-heavy-fg": "#FFFFFF",
        "rain-heavy-border": "#0E3A66",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-public-sans)",
          "Public Sans",
          "var(--font-noto-sans)",
          "Noto Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      maxWidth: {
        site: "1200px",
      },
      spacing: {
        site: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
