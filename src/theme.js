import { extendTheme } from "@chakra-ui/react";

const themes = {
  default: {
    // Default theme
    colors: {
      light: {
        background: "#FFFFFF",
        text: "#000000",
        primary: "#3182CE",
        secondary: "#9B2C2C",
      },
      dark: {
        background: "#1A202C",
        text: "#FFFFFF",
        primary: "#63B3ED",
        secondary: "#ED8936",
      },
    },
  },
  // // Add more themes as needed
  // custom1: {
  //   colors: {
  //     light: {
  //       background: "#F7FAFC",
  //       text: "#1A202C",
  //       primary: "#4A5568",
  //       secondary: "#CBD5E0",
  //     },
  //     dark: {
  //       background: "#2D3748",
  //       text: "#E2E8F0",
  //       primary: "#718096",
  //       secondary: "#A0AEC0",
  //     },
  //   },
  // },
  // custom2: {
  //   colors: {
  //     light: {
  //       background: "#EDF2F7",
  //       text: "#2D3748",
  //       primary: "#2C5282",
  //       secondary: "#9B2C2C",
  //     },
  //     dark: {
  //       background: "#1A202C",
  //       text: "#E2E8F0",
  //       primary: "#4C51BF",
  //       secondary: "#DD6B20",
  //     },
  //   },
  // },
};

const theme = extendTheme({
  config: {
    initialColorMode: "dark", // Set the initial color mode to dark
    useSystemColorMode: true, // Disable using system color mode
  },
  // Merge the default theme with additional themes
  ...themes.default,
  // Add more themes here
  // ...themes.custom1,
  // ...themes.custom2,
});

export default theme;
