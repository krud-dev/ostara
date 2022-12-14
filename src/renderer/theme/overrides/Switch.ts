import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Switch(theme: Theme): Components {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          boxShadow: theme.customShadows.z1,
        },
        track: {
          opacity: 1,
          backgroundColor: theme.palette.grey[500],
        },
        switchBase: {
          left: 0,
          right: 'auto',
          '&:not(:.Mui-checked)': {
            color: theme.palette.grey[isLight ? 100 : 300],
          },
          '&.Mui-checked.Mui-disabled, &.Mui-disabled': {
            color: theme.palette.grey[isLight ? 400 : 600],
          },
          '&.Mui-disabled+.MuiSwitch-track': {
            opacity: 1,
            backgroundColor: `${theme.palette.action.disabledBackground} !important`,
          },
        },
      },
    },
  };
}
