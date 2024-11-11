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

// theme.js
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode: mode, // 'light' or 'dark'
    background: {
      default: mode === 'light' ? '#FFFFFF' : '#1A202C',
      paper: mode === 'light' ? '#F7FAFC' : '#2D3748',
      custom: mode === 'light' ? '#F7FAFC' : '#1A202C',
      box: mode === 'light' ? '#EDF2F7' : '#2D3748',
    },
    text: {
      primary: mode === 'light' ? '#000000' : '#FFFFFF',
      secondary: mode === 'light' ? '#2D3748' : '#E2E8F0',
    },
    primary: {
      main: mode === 'light' ? '#3182CE' : '#63B3ED',
    },
    secondary: {
      main: mode === 'light' ? '#9B2C2C' : '#ED8936',
    },
    customColors: {
      redWhite: {
        main: '#FF0000',
        contrastText: '#FFFFFF',
      },
      gray: {
        light: '#F7FAFC',
        main: '#EDF2F7',
        dark: '#2D3748',
      },
      border: mode === 'light' ? '#CBD5E0' : '#4A5568',
    },
  },
  typography: {
    // Customize typography if needed
  },
  // You can add more customizations here
});


