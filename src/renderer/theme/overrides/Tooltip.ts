import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Tooltip(theme: Theme): Components {
  const isLight = theme.palette.mode === 'light';

  return {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      },
      styleOverrides: {
        tooltip: {
          textAlign: 'center',
          backgroundColor: theme.palette.grey[isLight ? 800 : 700],
        },
        arrow: {
          color: theme.palette.grey[isLight ? 800 : 700],
        },
      },
    },
  };
}
