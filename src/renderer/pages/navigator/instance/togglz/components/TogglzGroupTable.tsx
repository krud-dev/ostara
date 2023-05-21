import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { TogglzFeatureActuatorResponse } from '../../../../../../common/generated_definitions';
import {
  EnrichedTogglzFeature,
  useGetInstanceTogglzQuery,
} from '../../../../../apis/requests/instance/togglz/getInstanceTogglz';
import { instanceTogglzEntity } from '../../../../../entity/entities/instanceTogglz.entity';

type TogglzGroupTableProps = {
  instanceId: string;
  group?: string;
};

const TogglzGroupTable: FunctionComponent<TogglzGroupTableProps> = ({ instanceId, group }) => {
  const entity = useMemo<Entity<EnrichedTogglzFeature>>(() => instanceTogglzEntity, []);
  const queryState = useGetInstanceTogglzQuery({ instanceId: instanceId, group: group });

  const actionsHandler = useCallback(async (actionId: string, row: TogglzFeatureActuatorResponse): Promise<void> => {
    switch (actionId) {
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedTogglzFeature[]): Promise<void> => {},
    []
  );

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <TableComponent
      entity={entity}
      data={queryState.data}
      loading={queryState.isLoading}
      refetchHandler={queryState.refetch}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
      globalActionsHandler={globalActionsHandler}
    />
  );
};

export default TogglzGroupTable;
