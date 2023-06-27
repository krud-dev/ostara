import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { useGetInstanceHttpRequestStatisticsQuery } from 'renderer/apis/requests/instance/http-requests/getInstanceHttpRequestStatistics';
import { instanceHttpRequestEntity } from 'renderer/entity/entities/instanceHttpRequest.entity';
import { Card } from '@mui/material';
import { InstanceHttpRequestStatisticsRO, InstanceRO } from '../../../../../common/generated_definitions';

const InstanceHttpRequests: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<InstanceHttpRequestStatisticsRO>>(() => instanceHttpRequestEntity, []);
  const queryState = useGetInstanceHttpRequestStatisticsQuery({ instanceId: item.id });

  const actionsHandler = useCallback(
    async (actionId: string, row: InstanceHttpRequestStatisticsRO): Promise<void> => {},
    []
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: InstanceHttpRequestStatisticsRO[]): Promise<void> => {},
    []
  );

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={queryState.data}
          loading={queryState.isLoading}
          refetchHandler={queryState.refetch}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default InstanceHttpRequests;
