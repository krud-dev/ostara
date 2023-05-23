import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Badge(theme: Theme): Components {
  return {
    MuiBadge: {
      styleOverrides: {
        dot: {
          width: 10,
          height: 10,
          borderRadius: '50%',
        },
      },
    },
  };
}
