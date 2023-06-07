import { CreateHandler, DeleteHandler, MoveHandler, RenameHandler, Tree, TreeApi } from 'react-arborist';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import NavigatorTreeNode from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTreeNode';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { NAVIGATOR_ITEM_HEIGHT } from 'renderer/constants/ui';
import { experimentalStyled as styled } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { useUpdateItem } from 'renderer/apis/requests/item/updateItem';
import { useDeleteItem } from 'renderer/apis/requests/item/deleteItem';
import { showDeleteConfirmationDialog } from 'renderer/utils/dialogUtils';
import { useMoveItem } from 'renderer/apis/requests/item/moveItem';
import NiceModal from '@ebay/nice-modal-react';
import CreateInstanceDialog from 'renderer/components/item/dialogs/create/CreateInstanceDialog';
import { matchPath, useLocation } from 'react-router-dom';
import {
  getItemDisplayName,
  getItemParentId,
  getItemType,
  getItemUrl,
  isApplication,
  isFolder,
  isInstance,
  isItemDeletable,
  isItemUpdatable,
} from 'renderer/utils/itemUtils';
import { OpenMap } from 'react-arborist/src/state/open-slice';
import { InstanceRO } from 'common/generated_definitions';
import { ItemRO, ItemType } from 'renderer/definitions/daemon';
import { NodeApi } from 'react-arborist/dist/interfaces/node-api';
import { useUpdateEffect } from 'react-use';
import { isWindows } from 'renderer/utils/platformUtils';
import LogoLoader from '../../../../../components/common/LogoLoader';
import { LoadingButton } from '@mui/lab';
import useStartDemo from '../../../../../hooks/demo/useStartDemo';
import useDelayedEffect from '../../../../../hooks/useDelayedEffect';
import { useItems } from 'renderer/contexts/ItemsContext';

const TreeStyle = styled(Tree<TreeItem>)(({ theme }) => ({
  '& [role="treeitem"]': {
    outline: 'none',
  },
}));

const NAVIGATOR_TREE_PADDING_BOTTOM = 12;

type NavigatorTreeProps = {
  width: number;
  height: number;
  search?: string;
};

export default function NavigatorTree({ width, height, search }: NavigatorTreeProps) {
  const { getItem } = useItems();
  const { data, selectedItem, isLoading, isEmpty, hasData, action } = useNavigatorTree();
  const { pathname } = useLocation();
  const { startDemo, loading: loadingDemo } = useStartDemo();

  const treeRef = useRef<TreeApi<TreeItem> | null>(null);

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
  }, [action]);

  useDelayedEffect(() => {
    if (selectedItem) {
      treeRef.current?.openParents(selectedItem);
    }
  }, [selectedItem?.id]);

  const initialOpenState = useMemo<OpenMap>(() => {
    const openMap: OpenMap = {};
    const checkItemOpen = (item: TreeItem): boolean => {
      if (matchPath({ path: getItemUrl(item), end: false }, pathname)) {
        return true;
      }
      if (item.children?.some(checkItemOpen)) {
        openMap[item.id] = true;
        return true;
      }
      return false;
    };

    for (const item of data ?? []) {
      if (checkItemOpen(item)) {
        break;
      }
    }

    return openMap;
  }, [data]);

  const createInstanceHandler = useCallback(async (): Promise<void> => {
    await NiceModal.show<InstanceRO[] | undefined>(CreateInstanceDialog, {});
  }, []);

  const onCreate: CreateHandler<TreeItem> = useCallback(({ parentId, index, parentNode, type }) => {
    return null;
  }, []);

  const updateItemState = useUpdateItem();

  const updateItem = useCallback(
    async (item: ItemRO): Promise<ItemRO | undefined> => {
      try {
        return await updateItemState.mutateAsync({ item });
      } catch (e) {}
      return undefined;
    },
    [updateItemState]
  );

  const [disableDrag, setDisableDrag] = useState<boolean>(false);

  useUpdateEffect(() => {
    setDisableDrag(false);
  }, [data]);

  const moveItemState = useMoveItem();

  const moveItem = useCallback(
    async (id: string, type: ItemType, parentId: string | undefined, sort: number): Promise<ItemRO | undefined> => {
      const item = getItem(id);
      if (!item) {
        return undefined;
      }
      if (getItemParentId(item) === parentId && item.sort === sort) {
        return undefined;
      }

      setDisableDrag(true);
      try {
        return await moveItemState.mutateAsync({ id, type, parentId, sort });
      } catch (e) {
        setDisableDrag(false);
      }
      return undefined;
    },
    [moveItemState]
  );

  const deleteItemState = useDeleteItem();

  const deleteItem = useCallback(
    async (item: ItemRO): Promise<void> => {
      try {
        await deleteItemState.mutateAsync({ item });
      } catch (e) {}
    },
    [deleteItemState]
  );

  const onRename: RenameHandler<TreeItem> = useCallback(
    ({ id, name, node }) => {
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
      const children = parentNode?.children?.map((c) => c.data) ?? data;
      const beforeSort = children?.[index - 1]?.sort;
      const afterSort = children?.[index]?.sort;

      dragNodes.forEach((node, nodeIndex, array) => {
        const item = node.data;

        let newSort: number;
        if (beforeSort && afterSort) {
          newSort = beforeSort + ((afterSort - beforeSort) / (array.length + 1)) * (nodeIndex + 1);
        } else if (beforeSort) {
          newSort = beforeSort + nodeIndex + 1;
        } else if (afterSort) {
          newSort = (afterSort / (array.length + 1)) * (nodeIndex + 1);
        } else {
          newSort = nodeIndex + 1;
        }

        moveItem(item.id, getItemType(item), parentId || undefined, newSort);
      });
    },
    [data]
  );

  const onDelete: DeleteHandler<TreeItem> = useCallback(async ({ ids, nodes }): Promise<void> => {
    const items = nodes.map((node) => node.data).filter((item) => isItemDeletable(item));
    if (!items.length) {
      return;
    }

    const confirm = await showDeleteConfirmationDialog(items);
    if (!confirm) {
      return;
    }
    items.forEach((item) => deleteItem(item));
  }, []);

  const disableEditItem = useCallback((treeItem: TreeItem): boolean => {
    return !isItemUpdatable(treeItem);
  }, []);

  const disableDragItem = useCallback(
    (treeItem: TreeItem): boolean => {
      if (disableDrag) {
        return true;
      }
      if (!isItemUpdatable(treeItem)) {
        return true;
      }
      return false;
    },
    [disableDrag]
  );

  const disableDropItems = useCallback(
    (args: { parentNode: NodeApi<TreeItem>; dragNodes: NodeApi<TreeItem>[]; index: number }): boolean => {
      const { parentNode, dragNodes } = args;
      if (isInstance(parentNode.data)) {
        return true;
      }
      if (!isItemUpdatable(parentNode.data)) {
        return true;
      }
      if (dragNodes.some((node) => isInstance(node.data)) && dragNodes.some((node) => !isInstance(node.data))) {
        return true;
      }
      if (
        dragNodes.some((node) => isInstance(node.data)) &&
        dragNodes.some((node) => getItemParentId(node.data) !== parentNode.data.id)
      ) {
        return true;
      }
      if (dragNodes.some((node) => isApplication(node.data)) && !parentNode.isRoot && !isFolder(parentNode.data)) {
        return true;
      }
      if (dragNodes.some((node) => isFolder(node.data)) && !parentNode.isRoot && !isFolder(parentNode.data)) {
        return true;
      }
      return false;
    },
    []
  );

  const keyDownHandler = useCallback((event: React.KeyboardEvent): void => {
    if ((isWindows && event.key === 'F2') || (!isWindows && event.key === 'Enter')) {
      const node = treeRef.current?.focusedNode || treeRef.current?.selectedNodes[0];
      node?.edit();
    }
  }, []);

  return (
    <>
      {isLoading && (
        <Box
          sx={{
            height: height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LogoLoader />
        </Box>
      )}

      {isEmpty && (
        <Box
          sx={{
            height: height,
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
            <Typography variant="body1" sx={{ color: 'text.secondary', mt: 0.5, mb: 0.75 }}>
              <FormattedMessage id="or" />
            </Typography>
            <LoadingButton variant="outlined" color="info" size={'small'} onClick={startDemo} loading={loadingDemo}>
              <FormattedMessage id={'startDemoInstance'} />
            </LoadingButton>
          </Box>
        </Box>
      )}

      {hasData && (
        <Box onKeyDown={keyDownHandler} tabIndex={0}>
          <TreeStyle
            ref={treeRef}
            idAccessor={'id'}
            data={data}
            openByDefault={false}
            initialOpenState={initialOpenState}
            width={width}
            height={height}
            indent={12}
            paddingBottom={NAVIGATOR_TREE_PADDING_BOTTOM}
            rowHeight={NAVIGATOR_ITEM_HEIGHT}
            searchTerm={search}
            searchMatch={(node, term) => getItemDisplayName(node.data).toLowerCase().includes(term.toLowerCase())}
            onCreate={onCreate}
            onRename={onRename}
            onMove={onMove}
            onDelete={onDelete}
            disableDrag={disableDragItem}
            disableDrop={disableDropItems}
            disableEdit={disableEditItem}
          >
            {NavigatorTreeNode}
          </TreeStyle>
        </Box>
      )}
    </>
  );
}
