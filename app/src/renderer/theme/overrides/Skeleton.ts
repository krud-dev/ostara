import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Skeleton(theme: Theme): Components {
  return {
    MuiSkeleton: {
      defaultProps: {
        animation: 'wave',
      },

      styleOverrides: {
        root: {
          backgroundColor: theme.palette.background.neutral,
        },
      },
    },
  };
}
