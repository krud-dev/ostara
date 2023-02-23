import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import {
  EnrichedQuartzTrigger,
  useGetInstanceQuartzTriggersQuery,
} from '../../../../../apis/requests/instance/quartz/getInstanceQuartzTriggers';
import { instanceQuartzTriggerEntity } from '../../../../../entity/entities/instanceQuartzTrigger.entity';

type QuartzTriggersTableProps = {
  instanceId: string;
};

const QuartzTriggersTable: FunctionComponent<QuartzTriggersTableProps> = ({ instanceId }) => {
  const entity = useMemo<Entity<EnrichedQuartzTrigger>>(() => instanceQuartzTriggerEntity, []);
  const queryState = useGetInstanceQuartzTriggersQuery({ instanceId });

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedQuartzTrigger): Promise<void> => {}, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedQuartzTrigger[]): Promise<void> => {},
    []
  );

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <TableComponent
      entity={entity}
      queryState={queryState}
      actionsHandler={actionsHandler}
      massActionsHandler={massActionsHandler}
      globalActionsHandler={globalActionsHandler}
    />
  );
};

export default QuartzTriggersTable;
