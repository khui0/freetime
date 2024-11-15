import daisyui from "daisyui";
import Typography from "@tailwindcss/typography";
import Scrollbar from "tailwind-scrollbar";
import ContainerQueries from "@tailwindcss/container-queries";
import catppuccin from "@catppuccin/daisyui";

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
  extend: {
    screens: {
      print: { raw: "print" },
    },
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
          accent: "#990000",
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
        "solar-light": {
          accent: "#b6d192",
          "accent-content": "#000000",
          neutral: "#dcdcdc",
          "neutral-content": "#525252",
          error: "#de4343",
          "error-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#eeeeee",
          "base-300": "#e4e4e4",
          "base-content": "#141414",
        },
        "solar-dark": {
          accent: "#97b472",
          "accent-content": "#000000",
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
      catppuccin("latte", {
        accent: "red",
      }),
      catppuccin("frappe", {
        accent: "lavender",
      }),
      catppuccin("macchiato", {
        accent: "lavender",
      }),
      catppuccin("mocha", {
        accent: "lavender",
      }),
    ],
  },
};
