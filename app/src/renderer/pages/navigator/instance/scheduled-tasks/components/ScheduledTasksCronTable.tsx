import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { useGetInstanceScheduledTasksCronQuery } from '../../../../../apis/requests/instance/scheduled-tasks/getInstanceScheduledTasksCron';
import { instanceScheduledTasksCronEntity } from '../../../../../entity/entities/instanceScheduledTasksCron.entity';
import { ScheduledTasksActuatorResponse$Cron } from '../../../../../../common/generated_definitions';

type ScheduledTasksCronTableProps = {
  instanceId: string;
};

const ScheduledTasksCronTable: FunctionComponent<ScheduledTasksCronTableProps> = ({ instanceId }) => {
  const entity = useMemo<Entity<ScheduledTasksActuatorResponse$Cron>>(() => instanceScheduledTasksCronEntity, []);
  const queryState = useGetInstanceScheduledTasksCronQuery({ instanceId });

  const actionsHandler = useCallback(
    async (actionId: string, row: ScheduledTasksActuatorResponse$Cron): Promise<void> => {},
    []
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: ScheduledTasksActuatorResponse$Cron[]): Promise<void> => {},
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

export default ScheduledTasksCronTable;
