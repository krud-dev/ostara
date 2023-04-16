import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Divider, Drawer, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useUi } from 'renderer/contexts/UiContext';
import { FormattedMessage } from 'react-intl';
import { CloseOutlined, SettingsOutlined } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { COMPONENTS_SPACING, NAVBAR_HEIGHT } from '../../../../constants/ui';
import { ThemeSource } from '../../../../../infra/ui/models/electronTheme';
import { useSubscribeToEvent } from '../../../../apis/requests/subscriptions/subscribeToEvent';
import { IpcRendererEvent } from 'electron';

export default function SettingsMenu() {
  const { themeSource, setThemeSource, analyticsEnabled, setAnalyticsEnabled } = useUi();

  const [open, setOpen] = useState<boolean>(false);

  const toggleOpenHandler = useCallback((): void => {
    setOpen((prev) => !prev);
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
