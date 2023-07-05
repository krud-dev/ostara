import React, { FunctionComponent, useCallback, useMemo } from 'react';
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Grow,
  Link,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import Page from 'renderer/components/layout/Page';
import { ANIMATION_GROW_TOP_STYLE, ANIMATION_TIMEOUT_LONG, COMPONENTS_SPACING } from '../../../constants/ui';
import { FormattedMessage } from 'react-intl';
import { useSettingsContext } from 'renderer/contexts/SettingsContext';
import { useAppUpdatesContext } from 'renderer/contexts/AppUpdatesContext';
import { useSnackbar } from 'notistack';
import { useAnalyticsContext } from 'renderer/contexts/AnalyticsContext';
import { ThemeSource } from 'infra/ui/models/electronTheme';
import { TransitionGroup } from 'react-transition-group';
import { onlineManager } from '@tanstack/react-query';
import { useUpdateEffect } from 'react-use';
import { getErrorMessage } from 'renderer/utils/errorUtils';

const SettingsGeneral: FunctionComponent = () => {
  const { themeSource, setThemeSource } = useSettingsContext();
  const {
    appVersion,
    autoUpdateSupported,
    checkForUpdatesLoading,
    checkForUpdatesCompleted,
    downloadUpdateLoading,
    newVersionInfo,
    newVersionDownloaded,
    updateError,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
  } = useAppUpdatesContext();
  const { enqueueSnackbar } = useSnackbar();
  const { track } = useAnalyticsContext();

  const appUpdatesView = useMemo<'none' | 'check' | 'download' | 'install'>(() => {
    if (!appVersion) {
      return 'none';
    }
    if (newVersionDownloaded && autoUpdateSupported) {
      return 'install';
    }
    if (newVersionInfo) {
      return 'download';
    }
    return 'check';
  }, [appVersion, autoUpdateSupported, newVersionInfo, newVersionDownloaded]);

  const checkForUpdatesHandler = useCallback(
    async (event: React.MouseEvent): Promise<void> => {
      event.preventDefault();

      track({ name: 'settings_check_for_updates' });

      if (!onlineManager.isOnline()) {
        enqueueSnackbar(<FormattedMessage id="noInternetConnectionCheckConnectionTryAgain" />, { variant: 'warning' });
        return;
      }

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

      downloadUpdate();
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

  useUpdateEffect(() => {
    if (updateError) {
      enqueueSnackbar(
        <>
          <FormattedMessage id="appUpdateGeneralError" />
          {` ${getErrorMessage(updateError)}`}
        </>,
        { variant: 'error' }
      );
    }
  }, [updateError]);

  return (
    <Page sx={{ height: '100%', p: 0 }}>
      <Container disableGutters maxWidth={'md'} sx={{ m: 'auto', p: COMPONENTS_SPACING }}>
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <TransitionGroup component={null}>
            <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
              <Card>
                <CardHeader title={<FormattedMessage id={'general'} />} />
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

                  <TextField
                    fullWidth
                    label={<FormattedMessage id="appVersion" />}
                    margin="normal"
                    value={appVersion}
                    inputProps={{ readOnly: true }}
                    helperText={
                      <>
                        {appUpdatesView === 'check' && (
                          <>
                            {checkForUpdatesCompleted && (
                              <>
                                <FormattedMessage id="appIsUpToDate" />
                                {'. '}
                              </>
                            )}
                            <Link
                              component={'button'}
                              onClick={checkForUpdatesHandler}
                              variant={'inherit'}
                              disabled={checkForUpdatesLoading}
                            >
                              <FormattedMessage id={'checkForUpdates'} />
                            </Link>
                          </>
                        )}
                        {appUpdatesView === 'download' && (
                          <>
                            <FormattedMessage
                              id="newVersionIsAvailableAndReady"
                              values={{ version: newVersionInfo?.version }}
                            />
                            <br />
                            <Stack direction={'row'} spacing={0.75} alignItems={'center'}>
                              <Link
                                component={'button'}
                                onClick={downloadUpdateHandler}
                                variant={'inherit'}
                                disabled={downloadUpdateLoading}
                              >
                                <FormattedMessage id={'downloadUpdate'} />
                              </Link>
                              {downloadUpdateLoading && <CircularProgress size={10} variant={'indeterminate'} />}
                            </Stack>
                          </>
                        )}
                        {appUpdatesView === 'install' && (
                          <>
                            <FormattedMessage id="appUpdateDownloadedAndReady" />
                            <br />
                            <Link component={'button'} onClick={installUpdateHandler} variant={'inherit'}>
                              <FormattedMessage id={'quitAndInstall'} />
                            </Link>
                          </>
                        )}
                      </>
                    }
                  />

                  {updateError && (
                    <Alert severity={'error'} variant={'outlined'}>
                      <FormattedMessage id="appUpdateGeneralError" />
                    </Alert>
                  )}
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
