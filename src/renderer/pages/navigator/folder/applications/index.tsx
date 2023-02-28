import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import { ApplicationRO, FolderRO } from '../../../../../common/generated_definitions';
import { folderApplicationEntity } from '../../../../entity/entities/folderApplication.entity';
import { useGetFolderApplicationsQuery } from '../../../../apis/requests/folder/getFolderApplications';
import { getSubTreeItemsForItem } from '../../../../utils/treeUtils';
import { isFolder } from '../../../../utils/itemUtils';

const FolderApplications: FunctionComponent = () => {
  const { selectedItem, data } = useNavigatorTree();

  const item = useMemo<FolderRO>(() => selectedItem as FolderRO, [selectedItem]);

  const folderIds = useMemo<string[]>(
    () =>
      getSubTreeItemsForItem(data || [], item.id)
        .filter((i) => isFolder(i))
        .map((i) => i.id),
    [item.id, data]
  );

  const entity = useMemo<Entity<ApplicationRO>>(() => folderApplicationEntity, []);
  const queryState = useGetFolderApplicationsQuery({ folderIds });

  const actionsHandler = useCallback(async (actionId: string, row: ApplicationRO): Promise<void> => {}, []);

  const massActionsHandler = useCallback(async (actionId: string, selectedRows: ApplicationRO[]): Promise<void> => {},
  []);

  const globalActionsHandler = useCallback(async (actionId: string): Promise<void> => {}, []);

  return (
    <Page>
      <Card>
        <TableComponent
          entity={entity}
          queryState={queryState}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default FolderApplications;
