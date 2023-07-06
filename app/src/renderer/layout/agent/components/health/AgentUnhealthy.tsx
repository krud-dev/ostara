import { Button, Card, CardContent, CardHeader, Divider, Link, Stack, Typography } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { getAgentHealthStatusColor, getAgentHealthStatusIcon, isItemUpdatable } from 'renderer/utils/itemUtils';
import { IconViewer, MUIconType } from 'renderer/components/common/IconViewer';
import { FormattedMessage } from 'react-intl';
import { showUpdateItemDialog } from 'renderer/utils/dialogUtils';
import FormattedDateAndRelativeTime from 'renderer/components/format/FormattedDateAndRelativeTime';
import { LoadingButton } from '@mui/lab';
import { AgentRO } from 'common/generated_definitions';
import DetailsLabelValueHorizontal from 'renderer/components/table/details/DetailsLabelValueHorizontal';
import useItemDisplayName from 'renderer/hooks/items/useItemDisplayName';
import useAgentHealth from 'renderer/hooks/items/useAgentHealth';

type AgentUnhealthyProps = {
  item: AgentRO;
};

export default function AgentUnhealthy({ item }: AgentUnhealthyProps) {
  const { health, loading: refreshLoading, refreshHealth } = useAgentHealth(item);

  const displayName = useItemDisplayName(item);
  const updateDisabled = useMemo<boolean>(() => !isItemUpdatable(item), [item]);
  const healthStatusColor = useMemo<string | undefined>(() => getAgentHealthStatusColor(health.status), [health]);
  const healthStatusIcon = useMemo<MUIconType>(() => getAgentHealthStatusIcon(health.status), [health]);

  const updateHandler = useCallback(
    (event: React.MouseEvent): void => {
      event.preventDefault();

      showUpdateItemDialog(item);
    },
    [item]
  );

  const message = useMemo<ReactNode>(() => {
    const status = health.statusCode;
    switch (status) {
      case 400:
      case 401:
        return <FormattedMessage id={'invalidAgentAuthentication'} />;
      case 404:
      case -3:
        return <FormattedMessage id={'invalidAgentUrl'} />;
      case -2:
        return (
          <>
            <FormattedMessage id={'connectionCouldNotBeEstablished'} />
            {` (${health.message})`}
          </>
        );
      case -4:
        return (
          <>
            <FormattedMessage id={'sslError'} />
            {` (${health.message})`}
          </>
        );
      case -999:
      default:
        return (
          <>
            <FormattedMessage id={'anUnknownErrorHasOccurred'} />
            {` (${health.message})`}
          </>
        );
    }
  }, [health]);

  const troubleshooting = useMemo<ReactNode | undefined>(() => {
    const status = health.statusCode;
    switch (status) {
      case 400:
      case 401:
        return (
          <Link component={'button'} onClick={updateHandler}>
            <FormattedMessage id={'checkApiKey'} />
          </Link>
        );
      case 404:
      case -3:
      case -4:
        return (
          <Link component={'button'} onClick={updateHandler}>
            <FormattedMessage id={'checkAgentUrl'} />
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
          <IconViewer icon={healthStatusIcon} sx={{ color: healthStatusColor, fontSize: 48 }} />

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
                <DetailsLabelValueHorizontal label={<FormattedMessage id={'agentUrl'} />} value={item.url} />
                <DetailsLabelValueHorizontal
                  label={<FormattedMessage id={'error'} />}
                  value={message}
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
                  value={<FormattedDateAndRelativeTime value={health.time} />}
                />
              </Stack>
            </CardContent>
          </Card>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Button variant="outlined" color="primary" onClick={updateHandler} disabled={updateDisabled}>
              <FormattedMessage id={'updateAgent'} />
            </Button>
            <LoadingButton variant="outlined" color="primary" onClick={refreshHealth} loading={refreshLoading}>
              <FormattedMessage id={'refreshStatus'} />
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </Page>
  );
}
