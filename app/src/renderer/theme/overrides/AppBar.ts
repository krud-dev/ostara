import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function AppBar(theme: Theme): Components {
  return {
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiToolbar: {
      defaultProps: {
        variant: 'regular',
      },
      styleOverrides: {
        root: {
          minHeight: `0px!important`,
        },
      },
    },
  };
}
