import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import { RESET_ID } from 'renderer/entity/actions';
import { LoggerCustomFilters } from 'renderer/components/item/logger/LoggerCustomFiltersComponent';
import { applicationLoggerEntity } from 'renderer/entity/entities/applicationLogger.entity';
import {
  EnrichedApplicationLoggerRO,
  useGetApplicationLoggersQuery,
} from 'renderer/apis/requests/application/loggers/getApplicationLoggers';
import { useSetApplicationLoggerLevel } from 'renderer/apis/requests/application/loggers/setApplicationLoggerLevel';
import { ApplicationRO } from 'common/generated_definitions';
import { useNavigatorLayout } from 'renderer/contexts/NavigatorLayoutContext';

const ApplicationLoggers: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayout();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);

  const entity = useMemo<Entity<EnrichedApplicationLoggerRO, LoggerCustomFilters>>(() => applicationLoggerEntity, []);
  const queryState = useGetApplicationLoggersQuery({ applicationId: item.id });

  const setLevelState = useSetApplicationLoggerLevel();

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedApplicationLoggerRO): Promise<void> => {
    switch (actionId) {
      case RESET_ID:
        await setLevelState.mutateAsync({ applicationId: row.applicationId, loggerName: row.name, level: undefined });
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedApplicationLoggerRO[]): Promise<void> => {},
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

export default ApplicationLoggers;
