// theme.js
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: "#ddd",
      light: "#fff",
      dark: "#aaa",
      contrastText: "#000",
    },
    secondary: {
      main: "#e2e2e2",
      light: "#eeeeee",
      dark: "#e6aa43",
      contrastText: "#FF6D00",
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