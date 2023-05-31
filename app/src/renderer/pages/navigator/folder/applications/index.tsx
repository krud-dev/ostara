import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import { ApplicationRO, FolderRO } from '../../../../../common/generated_definitions';
import { folderApplicationEntity } from '../../../../entity/entities/folderApplication.entity';
import { getSubTreeItemsForItem } from '../../../../utils/treeUtils';
import { isFolder } from '../../../../utils/itemUtils';
import { useItems } from '../../../../contexts/ItemsContext';

const FolderApplications: FunctionComponent = () => {
  const { applications, refetchApplications } = useItems();
  const { selectedItem, data: navigatorData } = useNavigatorTree();

  const item = useMemo<FolderRO>(() => selectedItem as FolderRO, [selectedItem]);

  const folderIds = useMemo<string[]>(
    () =>
      getSubTreeItemsForItem(navigatorData || [], item.id)
        .filter((i) => isFolder(i))
        .map((i) => i.id),
    [item.id, navigatorData]
  );

  const entity = useMemo<Entity<ApplicationRO>>(() => folderApplicationEntity, []);
  const data = useMemo<ApplicationRO[] | undefined>(
    () => applications?.filter((a) => !!a.parentFolderId && folderIds.includes(a.parentFolderId)),
    [applications, folderIds]
  );
  const loading = useMemo<boolean>(() => !data, [data]);

  const actionsHandler = useCallback(async (actionId: string, row: ApplicationRO): Promise<void> => {}, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: ApplicationRO[]): Promise<void> => {},
  []);

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          data={data}
          loading={loading}
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
