import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, GlobalStyles } from '@mui/material';
import { ColorSchema } from 'renderer/theme/config/palette';
import {
  CheckCircleTwoTone,
  ErrorTwoTone,
  InfoTwoTone,
  ReportProblemTwoTone,
  SvgIconComponent,
} from '@mui/icons-material';

function SnackbarStyles() {
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  return (
    <GlobalStyles
      styles={{
        '#root': {
          '& .SnackbarContent-root': {
            width: '100%',
            padding: theme.spacing(1.5),
            margin: theme.spacing(0.25, 0),
            boxShadow: theme.customShadows.z8,
            borderRadius: theme.shape.borderRadius,
            color: theme.palette.grey[isLight ? 0 : 800],
            backgroundColor: theme.palette.grey[isLight ? 900 : 0],
            '&.SnackbarItem-variantSuccess, &.SnackbarItem-variantError, &.SnackbarItem-variantWarning, &.SnackbarItem-variantInfo':
              {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
              },
          },
          '& .SnackbarItem-message': {
            padding: '0 !important',
            fontWeight: theme.typography.fontWeightMedium,
          },
          '& .SnackbarItem-action': {
            marginRight: 0,
            color: theme.palette.action.active,
            '& svg': { width: 20, height: 20 },
          },
        },
      }}
    />
  );
}

type SnackbarIconProps = {
  Icon: SvgIconComponent;
  color: ColorSchema;
};

function SnackbarIcon({ Icon, color }: SnackbarIconProps) {
  return (
    <Box
      component="span"
      sx={{
        mr: 1.5,
        width: 40,
        height: 40,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) => alpha(theme.palette[color].main, 0.16),
      }}
    >
      <Icon fontSize={'medium'} color={color} />
    </Box>
  );
}

type NotistackProviderProps = {
  children: ReactNode;
};

export default function NotistackProvider({
  children,
}: NotistackProviderProps) {
  return (
    <>
      <SnackbarStyles />

      <SnackbarProvider
        dense
        maxSnack={5}
        // preventDuplicate
        autoHideDuration={3000}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        iconVariant={{
          success: <SnackbarIcon Icon={CheckCircleTwoTone} color="success" />,
          error: <SnackbarIcon Icon={ErrorTwoTone} color="error" />,
          warning: <SnackbarIcon Icon={ReportProblemTwoTone} color="warning" />,
          info: <SnackbarIcon Icon={InfoTwoTone} color="info" />,
        }}
      >
        {children}
      </SnackbarProvider>
    </>
  );
}
