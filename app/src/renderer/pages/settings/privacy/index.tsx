import React, { FunctionComponent, useCallback } from 'react';
import { Alert, Card, CardContent, CardHeader, Container, Link, MenuItem, TextField } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import { COMPONENTS_SPACING } from '../../../constants/ui';
import { FormattedMessage } from 'react-intl';
import { useSettings } from 'renderer/contexts/SettingsContext';
import { useRestartApp } from 'renderer/apis/requests/ui/restartApp';

const SettingsPrivacy: FunctionComponent = () => {
  const {
    analyticsEnabled,
    setAnalyticsEnabled,
    errorReportingEnabled,
    errorReportingChanged,
    setErrorReportingEnabled,
  } = useSettings();
  const restartAppState = useRestartApp();

  const restartAppHandler = useCallback((event: React.MouseEvent): void => {
    event.preventDefault();
    restartAppState.mutate({});
  }, []);

  return (
    <Page sx={{ height: '100%', p: 0 }}>
      <Container disableGutters maxWidth={'md'} sx={{ m: 'auto', p: COMPONENTS_SPACING }}>
        <Card>
          <CardHeader title={<FormattedMessage id={'privacy'} />} />
          <CardContent>
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
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
};

export default SettingsPrivacy;
