"use client"

// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FF7D29",
      light: "#FFBF78",
      dark: "#FF6D00",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e2e2e2",
      light: "#eeeeee",
      dark: "#e6aa43",
      contrastText: "#FF6D00"
    },
    background: {
      default: "#e2e2e2",
      paper: "#eeeeee",
    },
  },
  typography: {
    fontFamily: 'Lato, Roboto, Arial, sans-serif',
    button: {
      textTransform: "none"
    }
  },
  // Add more theme configuration as needed
});