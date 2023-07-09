import { Theme } from '@mui/material/styles';
import { Components } from '@mui/material/styles/components';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from 'renderer/constants/ui';

// ----------------------------------------------------------------------

export default function Dialog(theme: Theme): Components {
  const dialogMarginTop = NAVBAR_HEIGHT + parseInt(theme.spacing(COMPONENTS_SPACING), 10);
  const dialogMarginBottom = parseInt(theme.spacing(4), 10);
  return {
    MuiDialog: {
      styleOverrides: {
        root: {
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
          },
        },
        paper: {
          marginTop: dialogMarginTop,
          marginBottom: dialogMarginBottom,
          maxHeight: `calc(100% - ${dialogMarginTop + dialogMarginBottom}px)`,
          boxShadow: theme.customShadows.dialog,
          '&.MuiPaper-rounded': {
            borderRadius: theme.shape.borderRadiusMd,
          },
          '&.MuiDialog-paperFullScreen': {
            borderRadius: 0,
          },
          '&.MuiDialog-paper .MuiDialogActions-root': {
            padding: theme.spacing(3),
          },
          '@media (max-width: 600px)': {
            margin: theme.spacing(2),
          },
          '@media (max-width: 663.95px)': {
            '&.MuiDialog-paperWidthSm.MuiDialog-paperScrollBody': {
              maxWidth: '100%',
            },
          },
        },
        paperFullWidth: {
          width: '100%',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: theme.spacing(3, 3, 0),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderTop: 0,
          borderBottom: 0,
          padding: theme.spacing(3),
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          '& > :not(:first-of-type)': {
            marginLeft: theme.spacing(1.5),
          },
        },
      },
    },
  };
}
