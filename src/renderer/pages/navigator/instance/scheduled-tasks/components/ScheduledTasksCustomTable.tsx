import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { useGetInstanceScheduledTasksCronQuery } from '../../../../../apis/requests/instance/scheduled-tasks/getInstanceScheduledTasksCron';
import { instanceScheduledTasksCronEntity } from '../../../../../entity/entities/instanceScheduledTasksCron.entity';
import {
  ScheduledTasksActuatorResponse$Cron,
  ScheduledTasksActuatorResponse$Custom,
} from '../../../../../../common/generated_definitions';
import { useGetInstanceScheduledTasksCustomQuery } from '../../../../../apis/requests/instance/scheduled-tasks/getInstanceScheduledTasksCustom';
import { instanceScheduledTasksCustomEntity } from '../../../../../entity/entities/instanceScheduledTasksCustom.entity';

type ScheduledTasksCustomTableProps = {
  instanceId: string;
};

const ScheduledTasksCustomTable: FunctionComponent<ScheduledTasksCustomTableProps> = ({ instanceId }) => {
  const entity = useMemo<Entity<ScheduledTasksActuatorResponse$Custom>>(() => instanceScheduledTasksCustomEntity, []);
  const queryState = useGetInstanceScheduledTasksCustomQuery({ instanceId });

  const actionsHandler = useCallback(
    async (actionId: string, row: ScheduledTasksActuatorResponse$Custom): Promise<void> => {},
    []
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: ScheduledTasksActuatorResponse$Custom[]): Promise<void> => {},
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

export default ScheduledTasksCustomTable;
