import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Typography(theme: Theme): Components {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme.spacing(1),
        },
      },
    },
  };
}
