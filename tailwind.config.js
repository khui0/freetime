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
        },
        dark: {
          accent: "#af2222",
          "accent-content": "#ffffff",
          neutral: "#525252",
          "neutral-content": "#dcdcdc",
          error: "#de4343",
          "error-content": "#ffffff",
          "base-100": "#111111",
          "base-200": "#202020",
          "base-300": "#252525",
          "base-content": "#ffffff",
        },
      },
    ],
  },
};
