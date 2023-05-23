import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Snackbar(theme: Theme): Components {
  return {
    MuiSnackbarContent: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
