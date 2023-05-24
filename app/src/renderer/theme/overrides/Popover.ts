import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Popover(theme: Theme): Components {
  return {
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: theme.customShadows.z12,
        },
      },
    },
  };
}
