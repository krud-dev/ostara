import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Menu(theme: Theme): Components {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        },
      },
    },
  };
}
