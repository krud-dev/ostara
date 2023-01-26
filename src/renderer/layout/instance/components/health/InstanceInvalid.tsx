import { Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import { EnrichedInstance } from 'infra/configuration/model/configuration';
import Page from 'renderer/components/layout/Page';
import React, { useCallback, useMemo } from 'react';
import { getItemHealthStatusColor } from 'renderer/utils/itemUtils';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import { showUpdateItemDialog } from 'renderer/utils/dialogUtils';
import FormattedDateAndRelativeTime from 'renderer/components/time/FormattedDateAndRelativeTime';

type InstanceInvalidProps = {
  item: EnrichedInstance;
};

export default function InstanceInvalid({ item }: InstanceInvalidProps) {
  const healthStatusColor = useMemo<string | undefined>(() => getItemHealthStatusColor(item), [item]);

  const updateHandler = useCallback((): void => {
    showUpdateItemDialog(item);
  }, [item]);

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
          <IconViewer icon={'LinkOffOutlined'} sx={{ color: healthStatusColor, fontSize: 48 }} />

          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <FormattedMessage id={'instanceAliasInvalid'} values={{ alias: item.alias }} />
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            <FormattedMessage id={'checkActuatorUrl'} />
          </Typography>

          <Card variant={'outlined'} sx={{ mt: 3 }}>
            <CardHeader title={<FormattedMessage id={'additionalInformation'} />} />

            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <FormattedMessage id={'actuatorUrl'} />
                  </Typography>
                  <Typography variant="subtitle2">{item.actuatorUrl}</Typography>
                </Stack>

                <Divider />

                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <FormattedMessage id={'lastUpdateTime'} />
                  </Typography>
                  <Typography variant="subtitle2">
                    <FormattedDateAndRelativeTime value={item.health.lastUpdateTime} />
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <FormattedMessage id={'lastStatusChangeTime'} />
                  </Typography>
                  <Typography variant="subtitle2">
                    <FormattedDateAndRelativeTime value={item.health.lastStatusChangeTime} />
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Button variant="outlined" color="primary" onClick={updateHandler} sx={{ mt: 3 }}>
            <FormattedMessage id={'updateInstance'} />
          </Button>
        </CardContent>
      </Card>
    </Page>
  );
}
