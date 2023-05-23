import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Link(theme: Theme): Components {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },

      styleOverrides: {
        root: {},
      },
    },
  };
}
