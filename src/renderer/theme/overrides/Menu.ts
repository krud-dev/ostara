import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';
import { COMPONENTS_SPACING } from 'renderer/constants/ui';

export default function Menu(theme: Theme): Components {
  return {
    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(1),
          paddingLeft: theme.spacing(COMPONENTS_SPACING),
          paddingRight: theme.spacing(COMPONENTS_SPACING),
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
