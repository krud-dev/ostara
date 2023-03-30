import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import Page from 'renderer/components/layout/Page';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import TableComponent from 'renderer/components/table/TableComponent';
import { Entity } from 'renderer/entity/entity';
import { Card } from '@mui/material';
import {
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationRO,
  FolderRO,
} from '../../../../../common/generated_definitions';
import { folderApplicationEntity } from '../../../../entity/entities/folderApplication.entity';
import { useGetFolderApplicationsQuery } from '../../../../apis/requests/folder/getFolderApplications';
import { getSubTreeItemsForItem } from '../../../../utils/treeUtils';
import { isFolder } from '../../../../utils/itemUtils';
import { useStomp } from '../../../../apis/websockets/StompContext';

const FolderApplications: FunctionComponent = () => {
  const { selectedItem, data: navigatorData } = useNavigatorTree();
  const { subscribe } = useStomp();

  const item = useMemo<FolderRO>(() => selectedItem as FolderRO, [selectedItem]);

  const folderIds = useMemo<string[]>(
    () =>
      getSubTreeItemsForItem(navigatorData || [], item.id)
        .filter((i) => isFolder(i))
        .map((i) => i.id),
    [item.id, navigatorData]
  );

  const entity = useMemo<Entity<ApplicationRO>>(() => folderApplicationEntity, []);
  const queryState = useGetFolderApplicationsQuery({ folderIds });

  const [data, setData] = useState<ApplicationRO[] | undefined>(undefined);
  const loading = useMemo<boolean>(() => !data, [data]);

  useEffect(() => {
    setData(queryState.data);
  }, [queryState.data]);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/applicationHealth',
      {},
      (healthChanged: ApplicationHealthUpdatedEventMessage$Payload) => {
        setData((prev) =>
          prev?.map((a) => (a.id === healthChanged.applicationId ? { ...a, health: healthChanged.newHealth } : a))
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

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
          refetchHandler={queryState.refetch}
          actionsHandler={actionsHandler}
          massActionsHandler={massActionsHandler}
          globalActionsHandler={globalActionsHandler}
        />
      </Card>
    </Page>
  );
};

export default FolderApplications;
