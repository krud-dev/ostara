import { Button, Card, CardContent, CardHeader, Divider, Link, Stack, Typography } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import React, { ReactNode, useCallback, useMemo, useState } from 'react';
import { getInstanceHealthStatusColor } from 'renderer/utils/itemUtils';
import { IconViewer } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import { showUpdateItemDialog } from 'renderer/utils/dialogUtils';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';
import { LoadingButton } from '@mui/lab';
import { useUpdateEffect } from 'react-use';
import { InstanceHealthRO, InstanceRO } from '../../../../../common/generated_definitions';
import { useNavigatorTree } from '../../../../contexts/NavigatorTreeContext';
import DetailsLabelValueHorizontal from '../../../../components/table/details/DetailsLabelValueHorizontal';
import { useUpdateInstanceHealth } from '../../../../apis/requests/instance/health/updateInstanceHealth';
import useItemDisplayName from '../../../../hooks/useItemDisplayName';

type InstanceUnreachableProps = {
  item: InstanceRO;
};

export default function InstanceUnreachable({ item }: InstanceUnreachableProps) {
  const { getItem } = useNavigatorTree();

  const [health, setHealth] = useState<InstanceHealthRO>(item.health);

  const displayName = useItemDisplayName(item);

  useUpdateEffect(() => {
    setHealth(item.health);
  }, [item.health]);

  const healthStatusColor = useMemo<string | undefined>(() => getInstanceHealthStatusColor(health), [health]);

  const updateHandler = useCallback((): void => {
    showUpdateItemDialog(item);
  }, [item]);

  const healthState = useUpdateInstanceHealth();

  const refreshHandler = useCallback(async (): Promise<void> => {
    try {
      const result = await healthState.mutateAsync({ instanceId: item.id });
      setHealth(result);
    } catch (e) {}
  }, [item, healthState]);

  const updateInstanceHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      showUpdateItemDialog(item);
    },
    [item]
  );

  const updateApplicationHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      const application = getItem(item.parentApplicationId);
      if (!application) {
        return;
      }

      showUpdateItemDialog(application);
    },
    [item, getItem]
  );

  const troubleshooting = useMemo<ReactNode | undefined>(() => {
    const status = health.statusCode;
    switch (status) {
      case 401:
        return (
          <Link href={`#`} onClick={updateApplicationHandler}>
            <FormattedMessage id={'checkAuthenticationConfiguration'} />
          </Link>
        );
      case 404:
        return (
          <Link href={`#`} onClick={updateInstanceHandler}>
            <FormattedMessage id={'checkActuatorUrl'} />
          </Link>
        );
      default:
        return undefined;
    }
  }, [health]);

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
          <IconViewer icon={'CrisisAlertOutlined'} sx={{ color: healthStatusColor, fontSize: 48 }} />

          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            <FormattedMessage id={'instanceAliasUnreachable'} values={{ alias: displayName }} />
          </Typography>

          <Typography sx={{ color: 'text.secondary' }}>
            <FormattedMessage id={'checkNetworkAndActuatorUrl'} />
          </Typography>

          <Card variant={'outlined'} sx={{ mt: 3 }}>
            <CardHeader title={<FormattedMessage id={'additionalInformation'} />} />

            <CardContent>
              <Stack spacing={2}>
                <DetailsLabelValueHorizontal label={<FormattedMessage id={'actuatorUrl'} />} value={item.actuatorUrl} />
                <DetailsLabelValueHorizontal
                  label={<FormattedMessage id={'error'} />}
                  value={health.statusText}
                  valueSx={{ color: 'error.main' }}
                />

                {troubleshooting && (
                  <DetailsLabelValueHorizontal
                    label={<FormattedMessage id={'troubleshooting'} />}
                    value={troubleshooting}
                  />
                )}

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
