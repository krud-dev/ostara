import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { useGetApplicationInstancesQuery } from 'renderer/apis/requests/application/getApplicationInstances';
import { applicationInstanceEntity, EnrichedInstanceRO } from 'renderer/entity/entities/applicationInstance.entity';
import { Card } from '@mui/material';
import {
  ApplicationRO,
  InstanceHealthChangedEventMessage$Payload,
  InstanceHostnameUpdatedEventMessage$Payload,
} from '../../../../../common/generated_definitions';
import { useStomp } from '../../../../apis/websockets/StompContext';
import useItemShutdown from '../../../../hooks/useItemShutdown';
import { SHUTDOWN_ID } from '../../../../entity/actions';

const ApplicationInstances: FunctionComponent = () => {
  const { selectedItem, selectedItemAbilities } = useNavigatorTree();
  const { subscribe } = useStomp();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);

  const entity = useMemo<Entity<EnrichedInstanceRO>>(() => applicationInstanceEntity, []);
  const queryState = useGetApplicationInstancesQuery({ applicationId: item.id });

  const [data, setData] = useState<EnrichedInstanceRO[] | undefined>(undefined);
  const loading = useMemo<boolean>(() => !data, [data]);

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

  const { itemShutdown } = useItemShutdown();

  const actionsHandler = useCallback(
    async (actionId: string, row: EnrichedInstanceRO): Promise<void> => {
      switch (actionId) {
        case SHUTDOWN_ID:
          await itemShutdown(row);
          break;
        default:
          break;
      }
    },
    [itemShutdown]
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedInstanceRO[]): Promise<void> => {},
    []
  );

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
