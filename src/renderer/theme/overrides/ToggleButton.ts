import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function ToggleButton(theme: Theme): Components {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: theme.palette.grey[500],
          border: `solid 1px ${theme.palette.grey[500_32]}`,
          '&.Mui-selected': {
            color: theme.palette.grey[isLight ? 600 : 0],
            backgroundColor: theme.palette.action.selected,
          },
          '&.Mui-disabled': {
            color: theme.palette.grey[500_48],
          },
        },
      },
    },
  };
}
