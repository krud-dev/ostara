import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Container(theme: Theme): Components {
  return {
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
      },
      styleOverrides: {
        root: {},
      },
    },
  };
}
