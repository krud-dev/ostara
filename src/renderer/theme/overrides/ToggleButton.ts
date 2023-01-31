import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

declare module '@mui/material/ToggleButton' {
  interface ToggleButtonPropsColorOverrides {
    fatal: true;
  }
}

export default function ToggleButton(theme: Theme): Components {
  return {
    MuiToggleButton: {},
  };
}
