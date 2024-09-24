import { defineConfig } from "@juxio/cli";

export default defineConfig({
  /* Whether to apply preflight styles */
  preflight: true,

  /* A list of glob file patterns to watch for styling configurations */
  include: ["./src/**/*.{js,jsx,ts,tsx}", "./pages/**/*.{js,jsx,ts,tsx}"],

  exclude: [],

  globalCss: {
    "*": {
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    },
  },

  /* The core tokens */
  core_tokens: {
    color: {
      brand_100: {
        $value: "#0070f3",
        $description: "Primary brand color",
      },
      brand_200: {
        $value: "#ff0080",
        $description: "Secondary brand color",
      },
    },
    dimension: {
      spacing_100: {
        $value: "8px",
        $description: "Base spacing unit",
      },
    },
  },

  definitions_directory: "./src/jux/types",

  /* The tokens and themes for the design system */
  themes: {
    light: {
      color: {
        primary: {
          $value: "{core.color.brand_100}",
          $description: "Primary color",
        },
      },
      dimension: {
        specific: {
          button_radius: {
            $value: "{core.dimension.spacing_100}",
            $description: "Button border radius",
          },
        },
      },
    },
    dark: {
      color: {
        primary: {
          $value: "{core.color.brand_200}",
          $description: "Primary color",
        },
      },
      dimension: {
        specific: {
          button_radius: {
            $value: "{core.dimension.spacing_100}",
            $description: "Button border radius",
          },
        },
      },
    },
  },
});
