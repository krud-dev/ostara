import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import { instanceLoggerEntity } from 'renderer/entity/entities/instanceLogger.entity';
import {
  EnrichedInstanceLoggerRO,
  useGetInstanceLoggersQuery,
} from 'renderer/apis/requests/instance/loggers/getInstanceLoggers';
import { useSetInstanceLoggerLevel } from 'renderer/apis/requests/instance/loggers/setInstanceLoggerLevel';
import { RESET_ID } from 'renderer/entity/actions';
import { LoggerCustomFilters } from 'renderer/components/item/logger/LoggerCustomFiltersComponent';
import { InstanceRO } from '../../../../../common/generated_definitions';

const InstanceLoggers: FunctionComponent = () => {
  const { selectedItem } = useNavigatorLayoutContext();

  const item = useMemo<InstanceRO>(() => selectedItem as InstanceRO, [selectedItem]);

  const entity = useMemo<Entity<EnrichedInstanceLoggerRO, LoggerCustomFilters>>(() => instanceLoggerEntity, []);
  const queryState = useGetInstanceLoggersQuery({ instanceId: item.id });

  const setLevelState = useSetInstanceLoggerLevel();

  const actionsHandler = useCallback(async (actionId: string, row: EnrichedInstanceLoggerRO): Promise<void> => {
    switch (actionId) {
      case RESET_ID:
        await setLevelState.mutateAsync({ instanceId: row.instanceId, loggerName: row.name, level: undefined });
        break;
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedInstanceLoggerRO[]): Promise<void> => {},
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

export default InstanceLoggers;
