import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Autocomplete(theme: Theme): Components {
  return {
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.z20,
        },
      },
    },
  };
}
