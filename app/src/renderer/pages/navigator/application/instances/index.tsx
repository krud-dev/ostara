import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { applicationInstanceEntity, EnrichedInstanceRO } from 'renderer/entity/entities/applicationInstance.entity';
import { Card } from '@mui/material';
import { ApplicationRO } from '../../../../../common/generated_definitions';
import useItemShutdown from '../../../../hooks/useItemShutdown';
import { SHUTDOWN_ID } from '../../../../entity/actions';
import { useItems } from '../../../../contexts/ItemsContext';

const ApplicationInstances: FunctionComponent = () => {
  const { instances, refetchInstances } = useItems();
  const { selectedItem, selectedItemAbilities } = useNavigatorTree();

  const item = useMemo<ApplicationRO>(() => selectedItem as ApplicationRO, [selectedItem]);

  const entity = useMemo<Entity<EnrichedInstanceRO>>(() => applicationInstanceEntity, []);
  const data = useMemo<EnrichedInstanceRO[] | undefined>(
    () =>
      instances
        ?.filter((i) => i.parentApplicationId === item.id)
        ?.map<EnrichedInstanceRO>((i) => ({ ...i, applicationAbilities: selectedItemAbilities })),
    [instances, selectedItemAbilities]
  );
  const loading = useMemo<boolean>(() => !data, [data]);

  const { itemShutdown } = useItemShutdown();

  const actionsHandler = useCallback(
    async (actionId: string, row: EnrichedInstanceRO): Promise<void> => {
      switch (actionId) {
        case SHUTDOWN_ID:
          await itemShutdown(row);
          break;
        default:
          break;
      }
    },
    [itemShutdown]
  );

  const massActionsHandler = useCallback(
    async (actionId: string, selectedRows: EnrichedInstanceRO[]): Promise<void> => {},
    []
  );

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={data}
          loading={loading}
          refetchHandler={refetchInstances}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default ApplicationInstances;
