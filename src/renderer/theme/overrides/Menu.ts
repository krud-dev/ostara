import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Menu(theme: Theme): Components {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          paddingLeft: theme.spacing(2.5),
          paddingRight: theme.spacing(2.5),
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
