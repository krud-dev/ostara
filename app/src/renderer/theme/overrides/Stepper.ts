import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Stepper(theme: Theme): Components {
  return {
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: theme.palette.divider,
        },
      },
    },
  };
}
