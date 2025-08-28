import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#7DD3FC", // Sky blue pastel
          secondary: "#C7D2FE", // Indigo pastel
          accent: "#A7F3D0", // Emerald pastel
          error: "#FECACA", // Red pastel
          info: "#BFDBFE", // Blue pastel
          success: "#BBF7D0", // Green pastel
          warning: "#FEF3C7", // Amber pastel
          surface: "#F8FAFC", // Very light gray
          background: "#FFFFFF",
          "on-primary": "#0369A1", // Darker blue for text on primary
          "on-secondary": "#4338CA", // Darker indigo for text on secondary
          "on-surface": "#1E293B", // Dark slate for text
        },
      },
      dark: {
        colors: {
          primary: "#0EA5E9", // Darker sky blue
          secondary: "#6366F1", // Darker indigo
          accent: "#10B981", // Darker emerald
          error: "#EF4444", // Darker red
          info: "#3B82F6", // Darker blue
          success: "#22C55E", // Darker green
          warning: "#F59E0B", // Darker amber
          surface: "#1E293B",
          background: "#0F172A",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
  },
});
