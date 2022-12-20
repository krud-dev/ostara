import { CreateHandler, DeleteHandler, MoveHandler, RenameHandler, Tree, TreeApi } from 'react-arborist';
import { isApplication, isFolder, isInstance, Item } from 'infra/configuration/model/configuration';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import NavigatorTreeNode from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTreeNode';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { NAVIGATOR_ITEM_HEIGHT, SIDEBAR_DRAWER_WIDTH } from 'renderer/constants/ui';
import { experimentalStyled as styled } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { useUpdateFolder } from 'renderer/apis/configuration/updateFolder';
import { useDeleteFolder } from 'renderer/apis/configuration/deleteFolder';
import NiceModal from '@ebay/nice-modal-react';
import ConfirmationDialog from 'renderer/components/dialog/ConfirmationDialog';

const TreeStyle = styled(Tree<TreeItem>)(({ theme }) => ({
  '& [role="treeitem"]': {
    outline: 'none',
  },
}));

type NavigatorTreeProps = {
  search?: string;
};

export default function NavigatorTree({ search }: NavigatorTreeProps) {
  const { data, isLoading, isEmpty, hasData, action, getItem } = useNavigatorTree();

  console.log('data', data);

  const treeRef = useRef<TreeApi<TreeItem> | null>(null);

  useEffect(() => {
    const listEl = treeRef.current?.listEl?.current;
    if (listEl) {
      // Solves the bug where the scrollbar is showing on search
      listEl.style.overflow = 'hidden';
    }
  }, [hasData]);

  const getOpenItemsCount = useCallback((): number => {
    if (!data) {
      return 0;
    }

    const treeApi = treeRef.current;
    if (!treeApi) {
      return data.length;
    }

    const sizeHelper = (treeItem: TreeItem): number =>
      1 +
      (treeApi.isOpen(treeItem.id) ? treeItem.children?.map((t) => sizeHelper(t)).reduce((a, b) => a + b, 0) ?? 0 : 0);

    return data.map((treeItem) => sizeHelper(treeItem)).reduce((a, b) => a + b, 0);
  }, [data]);

  const [toggleFlag, setToggleFlag] = useState<number>(0);

  useEffect(() => {
    setToggleFlag((prevToggleFlag) => prevToggleFlag + 1);
  }, [data, search]);

  useEffect(() => {
    if (!action) {
      return;
    }

    switch (action) {
      case 'collapseAll':
        treeRef.current?.closeAll();
        break;
      case 'expandAll':
        treeRef.current?.openAll();
        break;
      default:
        break;
    }

    setToggleFlag((prevToggleFlag) => prevToggleFlag + 1);
  }, [action]);

  const height = useMemo<number>(() => getOpenItemsCount() * NAVIGATOR_ITEM_HEIGHT + 12, [toggleFlag]);

  const createInstanceHandler = useCallback((): void => {}, []);

  const onCreate: CreateHandler<TreeItem> = useCallback(({ parentId, index, parentNode, type }) => {
    return null;
  }, []);

  const updateFolderState = useUpdateFolder();

  const updateItem = useCallback(
    async (item: Item): Promise<Item | undefined> => {
      try {
        if (isFolder(item)) {
          return await updateFolderState.mutateAsync({
            id: item.id,
            folder: item,
          });
        }
        if (isApplication(item)) {
          // updateApplication({ ...item, alias: name });
        }
        if (isInstance(item)) {
          // updateInstance({ ...item, alias: name });
        }
      } catch (e) {}
      return undefined;
    },
    [updateFolderState]
  );

  const deleteFolderState = useDeleteFolder();

  const deleteItem = useCallback(
    async (item: Item): Promise<void> => {
      try {
        if (isFolder(item)) {
          await deleteFolderState.mutateAsync({ id: item.id });
        } else if (isApplication(item)) {
          // await deleteApplicationState.mutateAsync({ id: item.id });
        } else if (isInstance(item)) {
          // await deleteInstanceState.mutateAsync({ id: item.id });
        }
      } catch (e) {}
    },
    [deleteFolderState]
  );

  const onRename: RenameHandler<TreeItem> = useCallback(
    ({ id, name }) => {
      const item = getItem(id);
      if (!item) {
        return;
      }
      if (item.alias === name) {
        return;
      }
      updateItem({ ...item, alias: name });
    },
    [getItem]
  );

  const onMove: MoveHandler<TreeItem> = useCallback(
    ({ parentId, index, parentNode, dragNodes, dragIds }) => {
      if (parentNode && isInstance(parentNode.data)) {
        console.log('Cannot move to instance');
        return;
      }

      if (dragNodes.some((node) => isInstance(node.data)) && dragNodes.some((node) => !isInstance(node.data))) {
        console.log('Cannot mix instances and non-instances');
        return;
      }

      if (dragNodes.some((node) => isInstance(node.data)) && (!parentNode || !isApplication(parentNode.data))) {
        console.log("Cannot move instance to folder that isn't application");
        return;
      }

      const children = parentNode?.children?.map((c) => c.data) ?? data;
      const beforeOrder = children?.[index - 1]?.order;
      const afterOrder = children?.[index]?.order;

      dragNodes.forEach((node, nodeIndex, array) => {
        const item = node.data;

        let newOrder: number;
        if (beforeOrder && afterOrder) {
          newOrder = beforeOrder + ((afterOrder - beforeOrder) / (array.length + 1)) * (nodeIndex + 1);
        } else if (beforeOrder) {
          newOrder = beforeOrder + nodeIndex + 1;
        } else if (afterOrder) {
          newOrder = (afterOrder / (array.length + 1)) * (nodeIndex + 1);
        } else {
          newOrder = nodeIndex + 1;
        }

        if (isInstance(item)) {
          updateItem({
            ...item,
            order: newOrder,
            parentApplicationId: parentId!,
          });
        } else {
          updateItem({
            ...item,
            order: newOrder,
            parentFolderId: parentId || undefined,
          });
        }
      });
    },
    [data]
  );

  const onDelete: DeleteHandler<TreeItem> = useCallback(async ({ ids, nodes }): Promise<void> => {
    const confirm = await NiceModal.show<boolean>(ConfirmationDialog, {
      title: <FormattedMessage id={'delete'} />,
      text: <FormattedMessage id={'areYouSure'} />,
      continueText: <FormattedMessage id={'delete'} />,
    });
    if (!confirm) {
      return;
    }
    nodes.forEach((node) => deleteItem(node.data));
  }, []);

  const onToggle = useCallback((): void => {
    setToggleFlag((prevToggleFlag) => prevToggleFlag + 1);
  }, []);

  const disableDrop = useCallback((dropItem: TreeItem): boolean => isInstance(dropItem), []);

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {isEmpty && (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
              <FormattedMessage id="addYourFirstInstance" />
            </Typography>
            <Button variant="outlined" color="primary" size={'small'} onClick={createInstanceHandler}>
              <FormattedMessage id={'createInstance'} />
            </Button>
          </Box>
        </Box>
      )}

      {hasData && (
        <TreeStyle
          ref={treeRef}
          idAccessor={'id'}
          data={data}
          openByDefault={false}
          width={SIDEBAR_DRAWER_WIDTH - 1}
          height={height}
          indent={12}
          rowHeight={NAVIGATOR_ITEM_HEIGHT}
          searchTerm={search}
          searchMatch={(node, term) => node.data.alias.toLowerCase().includes(term.toLowerCase())}
          onCreate={onCreate}
          onRename={onRename}
          onMove={onMove}
          onDelete={onDelete}
          onToggle={onToggle}
          disableDrop={disableDrop}
        >
          {NavigatorTreeNode}
        </TreeStyle>
      )}
    </>
  );
}
