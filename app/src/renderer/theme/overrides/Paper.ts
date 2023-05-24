import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Paper(theme: Theme): Components {
  return {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },

      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  };
}
