import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { useGetApplicationInstancesQuery } from 'renderer/apis/requests/application/getApplicationInstances';
import { applicationInstanceEntity } from 'renderer/entity/entities/applicationInstance.entity';
import { Card } from '@mui/material';
import {
  ApplicationRO,
  InstanceHealthChangedEventMessage$Payload,
  InstanceHostnameUpdatedEventMessage$Payload,
  InstanceRO,
} from '../../../../../common/generated_definitions';
import { useStomp } from '../../../../apis/websockets/StompContext';

const ApplicationInstances: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();
  const { subscribe } = useStomp();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);

  const entity = useMemo<Entity<InstanceRO>>(() => applicationInstanceEntity, []);
  const queryState = useGetApplicationInstancesQuery({ applicationId: item.id });

  const [data, setData] = useState<InstanceRO[] | undefined>(undefined);
  const loading = useMemo<boolean>(() => !data, [data]);

  useEffect(() => {
    setData(queryState.data);
  }, [queryState.data]);

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

  const actionsHandler = useCallback(async (actionId: string, row: InstanceRO): Promise<void> => {}, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: InstanceRO[]): Promise<void> => {}, []);

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={data}
          loading={loading}
          refetchHandler={queryState.refetch}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default ApplicationInstances;
