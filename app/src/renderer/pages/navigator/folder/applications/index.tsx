import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Box, Button, Card } from '@mui/material';
import { ApplicationRO, FolderRO, InstanceRO } from 'common/generated_definitions';
import { folderApplicationEntity } from 'renderer/entity/entities/folderApplication.entity';
import { getNewItemSort, getSubTreeItemsForItem, getSubTreeRoot } from 'renderer/utils/treeUtils';
import { getItemParentId, isAgent, isFolder } from 'renderer/utils/itemUtils';
import { useItemsContext } from 'renderer/contexts/ItemsContext';
import { FormattedMessage } from 'react-intl';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog, {
  CreateInstanceDialogProps,
} from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { useNavigatorLayoutContext } from 'renderer/contexts/NavigatorLayoutContext';

const FolderApplications: FunctionComponent = () => {
  const { applications, refetchApplications } = useItemsContext();
  const { selectedItem, data: navigatorData } = useNavigatorLayoutContext();

  const item = useMemo<FolderRO>(() => selectedItem as FolderRO, [selectedItem]);

  const parentIds = useMemo<string[]>(
    () =>
      getSubTreeItemsForItem(navigatorData || [], item.id)
        .filter((i) => isFolder(i) || isAgent(item))
        .map((i) => i.id),
    [item.id, navigatorData]
  );

  const entity = useMemo<Entity<ApplicationRO>>(() => folderApplicationEntity, []);
  const data = useMemo<ApplicationRO[] | undefined>(
    () =>
      applications?.filter((a) => {
        const parentId = getItemParentId(a);
        return !!parentId && parentIds.includes(parentId);
      }),
    [applications, parentIds]
  );
  const loading = useMemo<boolean>(() => !data, [data]);

  const actionsHandler = useCallback(async (actionId: string, row: ApplicationRO): Promise<void> => {}, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: ApplicationRO[]): Promise<void> => {},
  []);

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    const treeItem = getSubTreeRoot(navigatorData || [], item.id);
    if (!treeItem) {
      return;
    }

    const sort = getNewItemSort(treeItem);

    await NiceModal.show<InstanceRO[] | undefined, CreateInstanceDialogProps>(CreateInstanceDialog, {
      parentFolderId: item.id,
      sort: sort,
    });
  }, [item, navigatorData]);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
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
          refetchHandler={refetchApplications}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default FolderApplications;
