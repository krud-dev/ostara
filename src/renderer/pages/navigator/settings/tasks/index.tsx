import React, { FunctionComponent, useCallback, useMemo } from 'react';
import { Container } from '@mui/material';
import Page from 'renderer/components/layout/Page';
import TableComponent from 'renderer/components/table/TableComponent';
import { useGetTasksQuery } from 'renderer/apis/tasks/getTasks';
import { TaskDefinitionDisplay } from 'infra/tasks/types';
import { RUN_TASK_ID, taskEntity } from 'renderer/entity/entities/task.entity';
import { Entity } from 'renderer/entity/entity';
import { useRunTask } from 'renderer/apis/tasks/runTask';
import { useSnackbar } from 'notistack';
import { FormattedMessage } from 'react-intl';

const TasksPage: FunctionComponent = () => {
  const { enqueueSnackbar } = useSnackbar();

  const entity = useMemo<Entity<TaskDefinitionDisplay>>(() => taskEntity, []);
  const queryState = useGetTasksQuery({});

  const runTaskState = useRunTask();

  const actionsHandler = useCallback(async (actionId: string, row: TaskDefinitionDisplay): Promise<void> => {
    switch (actionId) {
      case RUN_TASK_ID:
        try {
          await runTaskState.mutateAsync({ name: row.name });
          enqueueSnackbar(<FormattedMessage id={'taskStartedSuccessfully'} values={{ name: row.alias }} />, {
            variant: 'success',
          });
        } catch (e) {}
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: TaskDefinitionDisplay[]): Promise<void> => {},
    []
  );

  return (
    <Page>
      <Container disableGutters>
        <TableComponent
          entity={entity}
          queryState={queryState}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
        />
      </Container>
    </Page>
  );
};

export default TasksPage;
