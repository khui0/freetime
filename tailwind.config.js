import daisyui from "daisyui";
import Typography from "@tailwindcss/typography";
import Scrollbar from "tailwind-scrollbar";
import ContainerQueries from "@tailwindcss/container-queries";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  plugins: [
    daisyui,
    Typography(),
    Scrollbar({
      nocompatible: true,
      preferredStrategy: "pseudoelements",
    }),
    ContainerQueries,
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  daisyui: {
    themes: [
      {
        light: {
          accent: "#990000",
          "accent-content": "#ffffff",
          neutral: "#dcdcdc",
          "neutral-content": "#525252",
          error: "#de4343",
          "error-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#eeeeee",
          "base-300": "#e4e4e4",
          "base-content": "#141414",

          "--rounded-box": "1.5rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.9",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        dark: {
          accent: "#990000",
          "accent-content": "#ffffff",
          neutral: "#525252",
          "neutral-content": "#dcdcdc",
          error: "#de4343",
          "error-content": "#ffffff",
          "base-100": "#181818",
          "base-200": "#222222",
          "base-300": "#313131",
          "base-content": "#ffffff",

          "--rounded-box": "1.5rem",
          "--rounded-btn": "1rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.9",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
    ],
  },
};
