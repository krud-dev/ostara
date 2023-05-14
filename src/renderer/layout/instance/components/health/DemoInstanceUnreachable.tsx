import { Button, Card, CardContent, CardHeader, Divider, Stack, Typography } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import React, { useCallback, useState } from 'react';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';
import { LoadingButton } from '@mui/lab';
import { useUpdateEffect } from 'react-use';
import { InstanceHealthRO, InstanceRO } from '../../../../../common/generated_definitions';
import DetailsLabelValueHorizontal from '../../../../components/table/details/DetailsLabelValueHorizontal';
import { useUpdateInstanceHealth } from '../../../../apis/requests/instance/health/updateInstanceHealth';
import useRestartDemo from '../../../../hooks/demo/useRestartDemo';
import useStopDemo from '../../../../hooks/demo/useStopDemo';

type DemoInstanceUnreachableProps = {
  item: InstanceRO;
};

export default function DemoInstanceUnreachable({ item }: DemoInstanceUnreachableProps) {
  const { restartDemo, loading: loadingRestart } = useRestartDemo();
  const { stopDemo, loading: loadingStop } = useStopDemo();

  const [health, setHealth] = useState<InstanceHealthRO>(item.health);

  useUpdateEffect(() => {
    setHealth(item.health);
  }, [item.health]);

  const healthState = useUpdateInstanceHealth();

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
          <IconViewer icon={'HourglassEmptyOutlined'} sx={{ color: 'text.primary', fontSize: 48 }} />

          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <FormattedMessage id={'demoServiceLoading'} />
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            <FormattedMessage id={'takeTimeToLoadDemo'} />
          </Typography>

          <Card variant={'outlined'} sx={{ mt: 3 }}>
            <CardHeader title={<FormattedMessage id={'additionalInformation'} />} />

            <CardContent>
              <Stack spacing={2}>
                <DetailsLabelValueHorizontal label={<FormattedMessage id={'actuatorUrl'} />} value={item.actuatorUrl} />

                <Divider />

                <DetailsLabelValueHorizontal
                  label={<FormattedMessage id={'lastUpdateTime'} />}
                  value={<FormattedDateAndRelativeTime value={health.lastUpdateTime} />}
                />
                <DetailsLabelValueHorizontal
                  label={<FormattedMessage id={'lastStatusChangeTime'} />}
                  value={<FormattedDateAndRelativeTime value={health.lastStatusChangeTime} />}
                />
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <LoadingButton variant="outlined" color="primary" onClick={refreshHandler} loading={healthState.isLoading}>
              <FormattedMessage id={'refreshStatus'} />
            </LoadingButton>
            <LoadingButton variant="outlined" color="warning" onClick={restartDemo} loading={loadingRestart}>
              <FormattedMessage id={'restartDemo'} />
            </LoadingButton>
            <LoadingButton variant="outlined" color="error" onClick={stopDemo} loading={loadingStop}>
              <FormattedMessage id={'stopDemo'} />
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  );
}
