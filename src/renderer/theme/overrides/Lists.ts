import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Lists(theme: Theme): Components {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
          minWidth: 'auto',
        },
      },
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: theme.spacing(2),
        },
      },
    },
    MuiListItemText: {
      defaultProps: {
        primaryTypographyProps: {
          variant: 'body2',
        },
      },
      styleOverrides: {
        root: {
          marginTop: 0,
          marginBottom: 0,
        },
        multiline: {
          marginTop: 0,
          marginBottom: 0,
        },
      },
    },
  };
}
