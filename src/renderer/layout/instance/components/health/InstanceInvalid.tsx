import { Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import React, { useCallback, useMemo, useState } from 'react';
import { getInstanceHealthStatusColor } from 'renderer/utils/itemUtils';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import { showUpdateItemDialog } from 'renderer/utils/dialogUtils';
import FormattedDateAndRelativeTime from 'renderer/components/time/FormattedDateAndRelativeTime';
import { useUpdateEffect } from 'react-use';
import { useFetchInstanceHealth } from 'renderer/apis/requests/instance/fetchInstanceHealth';
import { LoadingButton } from '@mui/lab';
import { InstanceHealthRO, InstanceRO } from '../../../../../common/generated_definitions';

type InstanceInvalidProps = {
  item: InstanceRO;
};

export default function InstanceInvalid({ item }: InstanceInvalidProps) {
  const [health, setHealth] = useState<InstanceHealthRO>(item.health);

  useUpdateEffect(() => {
    setHealth(item.health);
  }, [item.health]);

  const healthStatusColor = useMemo<string | undefined>(() => getInstanceHealthStatusColor(health), [health]);

  const updateHandler = useCallback((): void => {
    showUpdateItemDialog(item);
  }, [item]);

  const healthState = useFetchInstanceHealth();

  const refreshHandler = useCallback(async (): Promise<void> => {
    try {
      const result = await healthState.mutateAsync({ instanceId: item.id });
      setHealth(result);
    } catch (e) {}
  }, [item, healthState]);

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
            <FormattedMessage id={'instanceAliasInvalid'} values={{ alias: item.displayName }} />
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
                    <FormattedDateAndRelativeTime value={health.lastUpdateTime} />
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={2} justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    <FormattedMessage id={'lastStatusChangeTime'} />
                  </Typography>
                  <Typography variant="subtitle2">
                    <FormattedDateAndRelativeTime value={health.lastStatusChangeTime} />
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Button variant="outlined" color="primary" onClick={updateHandler}>
              <FormattedMessage id={'updateInstance'} />
            </Button>
            <LoadingButton variant="outlined" color="primary" onClick={refreshHandler} loading={healthState.isLoading}>
              <FormattedMessage id={'refreshStatus'} />
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  );
}
