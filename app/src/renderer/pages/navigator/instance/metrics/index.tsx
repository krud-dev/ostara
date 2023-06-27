import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import { Entity } from 'renderer/entity/entity';
import TableComponent from 'renderer/components/table/TableComponent';
import { Card } from '@mui/material';
import { InstanceRO } from 'common/generated_definitions';
import { instanceMetricEntity } from 'renderer/entity/entities/instanceMetric.entity';
import {
  EnrichedInstanceMetric,
  useGetInstanceMetricsQuery,
} from 'renderer/apis/requests/instance/metrics/getInstanceMetrics';

const InstanceMetrics: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<EnrichedInstanceMetric>>(() => instanceMetricEntity, []);
  const queryState = useGetInstanceMetricsQuery({ instanceId: item.id });

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedInstanceMetric): Promise<void> => {}, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedInstanceMetric[]): Promise<void> => {},
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

export default InstanceMetrics;
