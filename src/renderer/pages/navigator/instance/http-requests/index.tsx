import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { InstanceHttpRequestStatistics } from 'infra/instance/models/httpRequestStatistics';
import { useGetInstanceHttpRequestStatisticsQuery } from 'renderer/apis/instance/getInstanceHttpRequestStatistics';
import { instanceHttpRequestEntity } from 'renderer/entity/entities/instanceHttpRequest.entity';
import { Card } from '@mui/material';
import { InstanceRO } from '../../../../../common/generated_definitions';

const InstanceHttpRequests: FunctionComponent = () => {
  const { selectedItem } = useNavigatorTree();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<InstanceHttpRequestStatistics>>(() => instanceHttpRequestEntity, []);
  const queryState = useGetInstanceHttpRequestStatisticsQuery({ instanceId: item.id });

  const actionsHandler = useCallback(async (actionId: string, row: InstanceHttpRequestStatistics): Promise<void> => {},
  []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: InstanceHttpRequestStatistics[]): Promise<void> => {},
    []
  );

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          queryState={queryState}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default InstanceHttpRequests;
