import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Select(theme: Theme): Components {
  return {
    MuiSelect: {
      defaultProps: {
        IconComponent: ExpandMoreRoundedIcon,
      },

      styleOverrides: {
        select: {},
      },
    },
  };
}
