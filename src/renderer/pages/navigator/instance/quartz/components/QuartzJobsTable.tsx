import React, { FunctionComponent, useCallback, useMemo } from 'react';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import {
  EnrichedQuartzJob,
  useGetInstanceQuartzJobsQuery,
} from '../../../../../apis/requests/instance/quartz/getInstanceQuartzJobs';
import { instanceQuartzJobEntity } from '../../../../../entity/entities/instanceQuartzJob.entity';

type QuartzJobsTableProps = {
  instanceId: string;
};

const QuartzJobsTable: FunctionComponent<QuartzJobsTableProps> = ({ instanceId }) => {
  const entity = useMemo<Entity<EnrichedQuartzJob>>(() => instanceQuartzJobEntity, []);
  const queryState = useGetInstanceQuartzJobsQuery({ instanceId });

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedQuartzJob): Promise<void> => {}, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedQuartzJob[]): Promise<void> => {},
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

export default QuartzJobsTable;
