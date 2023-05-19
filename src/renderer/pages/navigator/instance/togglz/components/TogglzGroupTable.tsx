import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import { InstanceRO, TogglzFeatureActuatorResponse } from '../../../../../../common/generated_definitions';
import { useGetInstanceTogglzQuery } from '../../../../../apis/requests/instance/togglz/getInstanceTogglz';
import { instanceTogglzEntity } from '../../../../../entity/entities/instanceTogglz.entity';

type TogglzGroupTableProps = {
  instanceId: string;
  group?: string;
};

const TogglzGroupTable: FunctionComponent<TogglzGroupTableProps> = ({ instanceId, group }) => {
  const entity = useMemo<Entity<TogglzFeatureActuatorResponse>>(() => instanceTogglzEntity, []);
  const queryState = useGetInstanceTogglzQuery({ instanceId: instanceId });

  const actionsHandler = useCallback(async (actionId: string, row: TogglzFeatureActuatorResponse): Promise<void> => {
    switch (actionId) {
      default:
        break;
    }
  }, []);

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: TogglzFeatureActuatorResponse[]): Promise<void> => {},
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

export default TogglzGroupTable;
