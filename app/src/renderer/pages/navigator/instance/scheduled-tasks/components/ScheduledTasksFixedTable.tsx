import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { ScheduledTasksActuatorResponse$FixedDelayOrRate } from '../../../../../../common/generated_definitions';
import {
  ScheduleTasksFixedType,
  useGetInstanceScheduledTasksFixedQuery,
} from '../../../../../apis/requests/instance/scheduled-tasks/getInstanceScheduledTasksFixed';
import { instanceScheduledTasksFixedEntity } from '../../../../../entity/entities/instanceScheduledTasksFixed.entity';

type ScheduledTasksFixedTableProps = {
  instanceId: string;
  type: ScheduleTasksFixedType;
};

const ScheduledTasksFixedTable: FunctionComponent<ScheduledTasksFixedTableProps> = ({ instanceId, type }) => {
  const entity = useMemo<Entity<ScheduledTasksActuatorResponse$FixedDelayOrRate>>(
    () => instanceScheduledTasksFixedEntity,
    []
  );
  const queryState = useGetInstanceScheduledTasksFixedQuery({ instanceId, type });

  const actionsHandler = useCallback(
    async (actionId: string, row: ScheduledTasksActuatorResponse$FixedDelayOrRate): Promise<void> => {},
    []
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: ScheduledTasksActuatorResponse$FixedDelayOrRate[]): Promise<void> => {},
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

export default ScheduledTasksFixedTable;
