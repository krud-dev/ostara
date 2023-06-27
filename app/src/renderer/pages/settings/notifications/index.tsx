import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Alert, Card, CardContent, CardHeader, Container, Grow, Link, MenuItem, TextField } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import { ANIMATION_GROW_TOP_STYLE, ANIMATION_TIMEOUT_LONG, COMPONENTS_SPACING } from '../../../constants/ui';
import { FormattedMessage } from 'react-intl';
import { useSettingsContext } from 'renderer/contexts/SettingsContext';
import { TransitionGroup } from 'react-transition-group';

const SettingsNotifications: FunctionComponent = () => {
  const { notificationsActive, setNotificationsActive, notificationsSoundActive, setNotificationsSoundActive } =
    useSettingsContext();

  const canOpenOsSettings = useMemo<boolean>(() => window.notifications.canOpenOsSettings(), []);

  const openOsSettingsHandler = useCallback((event: React.MouseEvent): void => {
    event.preventDefault();
    window.notifications.openOsSettings();
  }, []);

  return (
    <Page sx={{ height: '100%', p: 0 }}>
      <Container disableGutters maxWidth={'md'} sx={{ m: 'auto', p: COMPONENTS_SPACING }}>
        <TransitionGroup component={null}>
          <Grow timeout={ANIMATION_TIMEOUT_LONG} style={ANIMATION_GROW_TOP_STYLE}>
            <Card>
              <CardHeader title={<FormattedMessage id={'notifications'} />} />
              <CardContent>
                <TextField
                  fullWidth
                  label={<FormattedMessage id="enableNotifications" />}
                  margin="normal"
                  select
                  value={notificationsActive}
                  onChange={(e) => setNotificationsActive(e.target.value === 'true')}
                >
                  <MenuItem value={'true'}>
                    <FormattedMessage id="yes" />
                  </MenuItem>
                  <MenuItem value={'false'}>
                    <FormattedMessage id="no" />
                  </MenuItem>
                </TextField>

                {notificationsActive && (
                  <>
                    <Alert severity={'info'} variant={'outlined'} sx={{ mt: 2, mb: 1 }}>
                      <FormattedMessage
                        id="notReceivingNotifications"
                        values={{
                          settings: canOpenOsSettings ? (
                            <Link href={`#`} onClick={openOsSettingsHandler} sx={{ color: 'info.main' }}>
                              <FormattedMessage id={'operatingSystemSettings'} />
                            </Link>
                          ) : (
                            <FormattedMessage id={'operatingSystemSettings'} />
                          ),
                        }}
                      />
                    </Alert>

                    <TextField
                      fullWidth
                      label={<FormattedMessage id="notificationsSound" />}
                      margin="normal"
                      select
                      value={notificationsSoundActive}
                      onChange={(e) => setNotificationsSoundActive(e.target.value === 'true')}
                    >
                      <MenuItem value={'true'}>
                        <FormattedMessage id="yes" />
                      </MenuItem>
                      <MenuItem value={'false'}>
                        <FormattedMessage id="no" />
                      </MenuItem>
                    </TextField>
                  </>
                )}
              </CardContent>
            </Card>
          </Grow>
        </TransitionGroup>
      </Container>
    </Page>
  );
};

export default SettingsNotifications;
