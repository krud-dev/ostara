import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Link(theme: Theme): Components {
  return {
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },

      styleOverrides: {
        root: {
          '&[disabled]': {
            color: theme.palette.action.disabled,
            pointerEvents: 'none',
            cursor: 'default',
            '&:hover': {
              textDecoration: 'none',
            },
          },
        },
      },
    },
  };
}
