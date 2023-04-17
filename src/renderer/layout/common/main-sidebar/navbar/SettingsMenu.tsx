import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Box, Divider, Drawer, IconButton, Link, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useSettings } from 'renderer/contexts/SettingsContext';
import { FormattedMessage } from 'react-intl';
import { CloseOutlined, SettingsOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from '../../../../constants/ui';
import { ThemeSource } from '../../../../../infra/ui/models/electronTheme';
import { useSubscribeToEvent } from '../../../../apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';
import { useRestartApp } from '../../../../apis/requests/ui/restartApp';

export default function SettingsMenu() {
  const {
    themeSource,
    setThemeSource,
    analyticsEnabled,
    setAnalyticsEnabled,
    errorReportingEnabled,
    errorReportingChanged,
    setErrorReportingEnabled,
    autoUpdateEnabled,
    setAutoUpdateEnabled,
  } = useSettings();

  const [open, setOpen] = useState<boolean>(false);

  const toggleOpenHandler = useCallback((): void => {
    setOpen((prev) => !prev);
  }, []);

  const restartAppState = useRestartApp();

  const restartAppHandler = useCallback((event: React.MouseEvent): void => {
    event.preventDefault();
    restartAppState.mutate({});
  }, []);

  const subscribeToTriggerEventsState = useSubscribeToEvent();

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    (async () => {
      unsubscribe = await subscribeToTriggerEventsState.mutateAsync({
        event: 'trigger:openSettings',
        listener: (event: IpcRendererEvent) => {
          setOpen(true);
        },
      });
    })();
    return () => {
      unsubscribe?.();
    };
  }, []);

  const appVersion = useMemo<string>(() => window.appVersion, []);

  return (
    <>
      <Box sx={{ '-webkit-app-region': 'no-drag' }}>
        <IconButton size={'small'} onClick={toggleOpenHandler} sx={{ color: 'text.primary' }}>
          <SettingsOutlined fontSize={'medium'} />
        </IconButton>
      </Box>

      <Drawer
        anchor={'right'}
        open={open}
        onClose={toggleOpenHandler}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: 320,
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
            backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.72),
            boxShadow: (theme) => theme.customShadows.z24,
          },
        }}
        BackdropProps={{ invisible: true }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ height: NAVBAR_HEIGHT - 1, px: COMPONENTS_SPACING }}
          >
            <Typography variant="subtitle2">
              <FormattedMessage id={'settings'} />
            </Typography>
            <IconButton size={'small'} onClick={toggleOpenHandler}>
              <CloseOutlined fontSize={'small'} />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ flexGrow: 1 }}>
            <PerfectScrollbar>
              <Stack spacing={COMPONENTS_SPACING} sx={{ p: COMPONENTS_SPACING }}>
                <TextField
                  fullWidth
                  label={<FormattedMessage id="theme" />}
                  margin="normal"
                  select
                  value={themeSource}
                  onChange={(e) => setThemeSource(e.target.value as ThemeSource)}
                >
                  <MenuItem value={'system'}>
                    <FormattedMessage id="system" />
                  </MenuItem>
                  <MenuItem value={'dark'}>
                    <FormattedMessage id="dark" />
                  </MenuItem>
                  <MenuItem value={'light'}>
                    <FormattedMessage id="light" />
                  </MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label={<FormattedMessage id="allowTracking" />}
                  margin="normal"
                  select
                  value={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.value === 'true')}
                  helperText={<FormattedMessage id="allowTrackingDescription" />}
                >
                  <MenuItem value={'true'}>
                    <FormattedMessage id="yes" />
                  </MenuItem>
                  <MenuItem value={'false'}>
                    <FormattedMessage id="no" />
                  </MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label={<FormattedMessage id="allowErrorReporting" />}
                  margin="normal"
                  select
                  value={errorReportingEnabled}
                  onChange={(e) => setErrorReportingEnabled(e.target.value === 'true')}
                  helperText={<FormattedMessage id="allowErrorReportingDescription" />}
                >
                  <MenuItem value={'true'}>
                    <FormattedMessage id="yes" />
                  </MenuItem>
                  <MenuItem value={'false'}>
                    <FormattedMessage id="no" />
                  </MenuItem>
                </TextField>

                {errorReportingChanged && (
                  <Alert severity={'info'} variant={'outlined'}>
                    <FormattedMessage
                      id="restartAppChangesTakeAffect"
                      values={{
                        restart: (
                          <Link href={'#'} color={'info.main'} onClick={restartAppHandler}>
                            <FormattedMessage id={'restart'} />
                          </Link>
                        ),
                      }}
                    />
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label={<FormattedMessage id="automaticUpdates" />}
                  margin="normal"
                  select
                  value={autoUpdateEnabled}
                  onChange={(e) => setAutoUpdateEnabled(e.target.value === 'true')}
                >
                  <MenuItem value={'true'}>
                    <FormattedMessage id="yes" />
                  </MenuItem>
                  <MenuItem value={'false'}>
                    <FormattedMessage id="no" />
                  </MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  label={<FormattedMessage id="appVersion" />}
                  margin="normal"
                  value={appVersion}
                  inputProps={{ readOnly: true }}
                />
              </Stack>
            </PerfectScrollbar>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
