import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, Container, Grow, Link, MenuItem, Stack, TextField } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import { ANIMATION_GROW_TOP_STYLE, ANIMATION_TIMEOUT_LONG, COMPONENTS_SPACING } from '../../../constants/ui';
import { FormattedMessage } from 'react-intl';
import { useSettings } from 'renderer/contexts/SettingsContext';
import { useAppUpdates } from 'renderer/contexts/AppUpdatesContext';
import { useSnackbar } from 'notistack';
import { useAnalytics } from 'renderer/contexts/AnalyticsContext';
import semverGt from 'semver/functions/gt';
import { ThemeSource } from 'infra/ui/models/electronTheme';
import { TransitionGroup } from 'react-transition-group';

const SettingsGeneral: FunctionComponent = () => {
  const { themeSource, setThemeSource } = useSettings();
  const {
    autoUpdateSupported,
    autoUpdateEnabled,
    setAutoUpdateEnabled,
    newVersionInfo,
    newVersionDownloaded,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
  } = useAppUpdates();
  const { enqueueSnackbar } = useSnackbar();
  const { track } = useAnalytics();

  const [appVersion, setAppVersion] = useState<string>('');

  useEffect(() => {
    (async () => {
      setAppVersion(await window.ui.getAppVersion());
    })();
  }, []);

  const appUpdatesView = useMemo<'none' | 'check' | 'download' | 'install'>(() => {
    if (!appVersion) {
      return 'none';
    }
    if (newVersionDownloaded && semverGt(newVersionDownloaded.version, appVersion) && autoUpdateSupported) {
      return 'install';
    }
    if (newVersionInfo && semverGt(newVersionInfo.version, appVersion)) {
      return 'download';
    }
    return 'check';
  }, [appVersion, autoUpdateSupported, newVersionInfo, newVersionDownloaded]);

  const checkForUpdatesHandler = useCallback(
    async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();

      track({ name: 'settings_check_for_updates' });

      const result = await checkForUpdates();
      if (result) {
        enqueueSnackbar(<FormattedMessage id="newVersionIsAvailable" values={{ version: result.version }} />, {
          variant: 'info',
        });
      } else {
        enqueueSnackbar(<FormattedMessage id="appIsUpToDate" />, { variant: 'info' });
      }
    },
    [checkForUpdates]
  );

  const downloadUpdateHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      track({ name: 'settings_download_update' });

      const downloadType = downloadUpdate();
      if (downloadType === 'internal') {
        enqueueSnackbar(<FormattedMessage id="downloadStarted" />, { variant: 'info' });
      }
    },
    [downloadUpdate]
  );

  const installUpdateHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      track({ name: 'settings_install_update' });

      installUpdate();
    },
    [installUpdate]
  );

  return (
    <Page sx={{ height: '100%', p: 0 }}>
      <Container disableGutters maxWidth={'md'} sx={{ m: 'auto', p: COMPONENTS_SPACING }}>
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <TransitionGroup component={null}>
            <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
              <Card>
                <CardHeader title={<FormattedMessage id={'theme'} />} />
                <CardContent>
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
                </CardContent>
              </Card>
            </Grow>

            <Grow timeout={ANIMATION_TIMEOUT_LONG * 2} style={ANIMATION_GROW_TOP_STYLE}>
              <Card>
                <CardHeader title={<FormattedMessage id={'updates'} />} />
                <CardContent>
                  {autoUpdateSupported && (
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
                  )}

                  <TextField
                    fullWidth
                    label={<FormattedMessage id="appVersion" />}
                    margin="normal"
                    value={appVersion}
                    inputProps={{ readOnly: true }}
                    helperText={
                      <>
                        {appUpdatesView === 'check' && (
                          <Link href={`#`} onClick={checkForUpdatesHandler} variant={'inherit'}>
                            <FormattedMessage id={'checkForUpdates'} />
                          </Link>
                        )}
                        {appUpdatesView === 'download' && (
                          <>
                            <FormattedMessage
                              id="newVersionIsAvailableAndReady"
                              values={{ version: newVersionInfo?.version }}
                            />
                            <br />
                            <Link href={`#`} onClick={downloadUpdateHandler} variant={'inherit'}>
                              <FormattedMessage id={'downloadUpdate'} />
                            </Link>
                          </>
                        )}
                        {appUpdatesView === 'install' && (
                          <>
                            <FormattedMessage id="appUpdateDownloadedAndReady" />
                            <br />
                            <Link href={`#`} onClick={installUpdateHandler} variant={'inherit'}>
                              <FormattedMessage id={'quitAndInstall'} />
                            </Link>
                          </>
                        )}
                      </>
                    }
                  />
                </CardContent>
              </Card>
            </Grow>
          </TransitionGroup>
        </Stack>
      </Container>
    </Page>
  );
};

export default SettingsGeneral;
