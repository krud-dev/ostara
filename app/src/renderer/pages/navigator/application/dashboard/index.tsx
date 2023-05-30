import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { Box, Button, Card, CardContent, CardHeader, Stack } from '@mui/material';
import {
  ApplicationRO,
  InstanceHealthChangedEventMessage$Payload,
  InstanceHealthStatus,
  InstanceHostnameUpdatedEventMessage$Payload,
  InstanceRO,
} from '../../../../../common/generated_definitions';
import { useStomp } from '../../../../apis/websockets/StompContext';
import { EnrichedInstanceRO } from '../../../../entity/entities/applicationInstance.entity';
import { useGetApplicationInstancesQuery } from '../../../../apis/requests/application/getApplicationInstances';
import LogoLoader from '../../../../components/common/LogoLoader';
import EmptyContent from '../../../../components/help/EmptyContent';
import { FormattedMessage } from 'react-intl';
import { COMPONENTS_SPACING } from '../../../../constants/ui';
import Grid2 from '@mui/material/Unstable_Grid2';
import ApplicationInstancesHealthStatusWidget from './components/ApplicationInstancesHealthStatusWidget';
import ApplicationInstanceWidget from './components/ApplicationInstanceWidget';
import { isEmpty } from 'lodash';
import { LoadingButton } from '@mui/lab';
import { IconViewer } from '../../../../components/common/IconViewer';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog from '../../../../components/item/dialogs/create/CreateInstanceDialog';
import { getNewItemSort } from '../../../../utils/treeUtils';

const ApplicationDashboard: FunctionComponent = () => {
  const { selectedItem, selectedItemAbilities } = useNavigatorTree();
  const { subscribe } = useStomp();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);

  const queryState = useGetApplicationInstancesQuery({ applicationId: item.id });

  const [data, setData] = useState<EnrichedInstanceRO[] | undefined>(undefined);
  const healthStatuses = useMemo<InstanceHealthStatus[]>(
    () => ['UP', 'DOWN', 'UNREACHABLE', 'OUT_OF_SERVICE', 'INVALID', 'PENDING'],
    []
  );

  useEffect(() => {
    setData(queryState.data?.map<EnrichedInstanceRO>((i) => ({ ...i, applicationAbilities: selectedItemAbilities })));
  }, [queryState.data, selectedItemAbilities]);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceHealth',
      {},
      (healthChanged: InstanceHealthChangedEventMessage$Payload): void => {
        setData((prev) =>
          prev?.map((i) => (i.id === healthChanged.instanceId ? { ...i, health: healthChanged.newHealth } : i))
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceHostname',
      {},
      (hostnameUpdated: InstanceHostnameUpdatedEventMessage$Payload): void => {
        setData((prev) =>
          prev?.map((i) => (i.id === hostnameUpdated.instanceId ? { ...i, hostname: hostnameUpdated.hostname } : i))
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {
      parentApplicationId: item.id,
      sort: 1, // Application is empty, so we can set sort
    });
  }, [item]);

  return (
    <Page sx={{ height: '100%' }}>
      {!data ? (
        <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LogoLoader />
        </Box>
      ) : (
        <Stack direction={'column'} spacing={COMPONENTS_SPACING}>
          <Card>
            <CardHeader title={<FormattedMessage id={'summary'} />} />
            <CardContent>
              <Grid2 container spacing={COMPONENTS_SPACING}>
                {healthStatuses.map((healthStatus) => (
                  <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={healthStatus}>
                    <ApplicationInstancesHealthStatusWidget instances={data!} healthStatus={healthStatus} />
                  </Grid2>
                ))}
              </Grid2>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title={<FormattedMessage id={'instances'} />} />
            <CardContent>
              {isEmpty(data) ? (
                <EmptyContent
                  text={<FormattedMessage id={'applicationNoInstances'} />}
                  description={
                    <>
                      <Box>
                        <FormattedMessage id={'applicationNoInstancesDescription'} />
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Button variant={'outlined'} color={'primary'} onClick={createInstanceHandler}>
                          <FormattedMessage id={'createInstance'} />
                        </Button>
                      </Box>
                    </>
                  }
                />
              ) : (
                <Grid2 container spacing={COMPONENTS_SPACING}>
                  {data.map((instance) => (
                    <Grid2 xs={12} md={6} lg={4} xl={3} xxl={2} key={instance.id}>
                      <ApplicationInstanceWidget instance={instance} />
                    </Grid2>
                  ))}
                </Grid2>
              )}
            </CardContent>
          </Card>
        </Stack>
      )}
    </Page>
  );
};

export default ApplicationDashboard;
