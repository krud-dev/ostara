import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import React, { useCallback } from 'react';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import { useRestartApp } from '../../../apis/requests/ui/restartApp';

type DaemonUnhealthyProps = {};

export default function DaemonUnhealthy({}: DaemonUnhealthyProps) {
  const restartAppState = useRestartApp();

  const restartAppHandler = useCallback((): void => {
    restartAppState.mutate({});
  }, []);

  return (
    <Page sx={{ height: '100%' }}>
      <Card sx={{ height: '100%' }}>
        <CardContent
          sx={{
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <IconViewer icon={'NewReleasesOutlined'} sx={{ color: 'error.main', fontSize: 48 }} />

          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <FormattedMessage id={'daemonIsDown'} values={{ alias: 'Daemon' }} />
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            <FormattedMessage id={'backgroundServiceCrashed'} />
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Button variant="outlined" color="error" onClick={restartAppHandler}>
              <FormattedMessage id={'restartApp'} />
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  );
}
