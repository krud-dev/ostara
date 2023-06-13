import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { applicationInstanceEntity, EnrichedInstanceRO } from 'renderer/entity/entities/applicationInstance.entity';
import { Box, Button, Card } from '@mui/material';
import { ApplicationRO, InstanceRO } from 'common/generated_definitions';
import useItemShutdown from 'renderer/hooks/useItemShutdown';
import { SHUTDOWN_ID } from 'renderer/entity/actions';
import { useItems } from 'renderer/contexts/ItemsContext';
import { FormattedMessage } from 'react-intl';
import { getNewItemSort, getSubTreeRoot } from 'renderer/utils/treeUtils';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';

const ApplicationInstances: FunctionComponent = () => {
  const { instances, refetchInstances } = useItems();
  const { selectedItem, selectedItemAbilities, data: navigatorData } = useNavigatorTree();

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
  const hiddenColumnIds = useMemo<string[]>(
    () => [
      ...(!data?.find((i) => i.metadata?.version) ? ['metadata.version'] : []),
      ...(!data?.find((i) => i.metadata?.buildTime) ? ['metadata.buildTime'] : []),
      ...(!data?.find((i) => i.metadata?.gitBranch) ? ['metadata.gitBranch'] : []),
      ...(!data?.find((i) => i.metadata?.gitCommitId) ? ['metadata.gitCommitId'] : []),
    ],
    [data]
  );

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

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    const treeItem = getSubTreeRoot(navigatorData || [], item.id);
    if (!treeItem) {
      return;
    }

    const sort = getNewItemSort(treeItem);

    await NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {
      parentApplicationId: item.id,
      sort: sort,
    });
  }, [item, navigatorData]);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          hiddenColumnIds={hiddenColumnIds}
          data={data}
          loading={loading}
          emptyContent={
            <>
              <Box>
                <FormattedMessage id={'addNewInstanceByClicking'} />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button variant={'outlined'} color={'primary'} onClick={createInstanceHandler}>
                  <FormattedMessage id={'createInstance'} />
                </Button>
              </Box>
            </>
          }
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
