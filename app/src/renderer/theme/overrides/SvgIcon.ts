import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function SvgIcon(theme: Theme): Components {
  return {
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeSmall: {
          width: 20,
          height: 20,
          fontSize: 'inherit',
        },
        fontSizeLarge: {
          width: 32,
          height: 32,
          fontSize: 'inherit',
        },
      },
    },
  };
}
