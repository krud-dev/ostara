import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Radio(theme: Theme): Components {
  return {
    MuiRadio: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
          svg: {
            fontSize: 24,
            '&[font-size=small]': {
              fontSize: 20,
            },
          },
        },
      },
    },
  };
}
