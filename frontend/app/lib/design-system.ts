// Sophisticated color palette for the entire application
export const colorPalette = {
  // Primary brand colors - sophisticated blues and purples
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },

  // Secondary colors - elegant purples
  secondary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
  },

  // Accent colors - warm and inviting
  accent: {
    orange: "#f97316",
    amber: "#f59e0b",
    emerald: "#10b981",
    rose: "#f43f5e",
    teal: "#14b8a6",
  },

  // Neutral colors - sophisticated grays
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },

  // Cameroon-inspired colors (subtle integration)
  cameroon: {
    green: "#059669", // More subtle green
    red: "#dc2626", // Refined red
    yellow: "#d97706", // Warmer yellow
  },
}

// Theme configurations
export const themes = {
  light: {
    background: "linear-gradient(135deg, #fafafa 0%, #f0f9ff 50%, #faf5ff 100%)",
    surface: "rgba(255, 255, 255, 0.8)",
    surfaceHover: "rgba(255, 255, 255, 0.95)",
    text: {
      primary: "#171717",
      secondary: "#525252",
      muted: "#737373",
    },
    border: "rgba(228, 228, 231, 0.5)",
  },
  dark: {
    background: "linear-gradient(135deg, #0c0a09 0%, #0c1426 50%, #1e1b4b 100%)",
    surface: "rgba(15, 23, 42, 0.8)",
    surfaceHover: "rgba(15, 23, 42, 0.95)",
    text: {
      primary: "#f8fafc",
      secondary: "#cbd5e1",
      muted: "#94a3b8",
    },
    border: "rgba(51, 65, 85, 0.3)",
  },
}
