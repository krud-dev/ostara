import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function IconButton(theme: Theme): Components {
  return {
    MuiIconButton: {
      styleOverrides: {
        root: {},
      },
    },
  };
}
