import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';

export default function Breadcrumbs(theme: Theme): Components {
  return {
    MuiBreadcrumbs: {
      styleOverrides: {
        separator: {
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2),
        },
      },
    },
  };
}
