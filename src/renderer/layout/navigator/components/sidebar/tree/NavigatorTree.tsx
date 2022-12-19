import {
  CreateHandler,
  DeleteHandler,
  MoveHandler,
  RenameHandler,
  Tree,
  TreeApi,
} from 'react-arborist';
import {
  Folder,
  isApplication,
  isFolder,
  isInstance,
} from 'infra/configuration/model/configuration';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import NavigatorTreeNode from 'renderer/layout/navigator/components/sidebar/tree/NavigatorTreeNode';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import {
  NAVIGATOR_ITEM_HEIGHT,
  SIDEBAR_DRAWER_WIDTH,
} from 'renderer/constants/ui';
import { experimentalStyled as styled } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import { useNavigatorTree } from 'renderer/contexts/NavigatorTreeContext';
import { useUpdateFolder } from 'renderer/apis/configuration/updateFolder';

const TreeStyle = styled(Tree<TreeItem>)(({ theme }) => ({
  '& [role="treeitem"]': {
    outline: 'none',
  },
}));

type NavigatorTreeProps = {
  search?: string;
};

export default function NavigatorTree({ search }: NavigatorTreeProps) {
  const { data, isLoading, isEmpty, hasData, getItem } = useNavigatorTree();

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
      (treeApi.isOpen(treeItem.id)
        ? treeItem.children
            ?.map((t) => sizeHelper(t))
            .reduce((a, b) => a + b, 0) ?? 0
        : 0);

    return data
      .map((treeItem) => sizeHelper(treeItem))
      .reduce((a, b) => a + b, 0);
  }, [data]);

  const [toggleFlag, setToggleFlag] = useState<number>(0);

  useEffect(() => {
    setToggleFlag((prevToggleFlag) => prevToggleFlag + 1);
  }, [data, search]);

  const height = useMemo<number>(
    () => getOpenItemsCount() * NAVIGATOR_ITEM_HEIGHT + 12,
    [toggleFlag]
  );

  const createInstanceHandler = useCallback((): void => {}, []);

  const onCreate: CreateHandler<TreeItem> = useCallback(
    ({ parentId, index, parentNode, type }) => {
      return null;
    },
    []
  );

  const updateFolderState = useUpdateFolder();

  const updateFolder = useCallback(
    async (item: Folder): Promise<Folder> => {
      return await updateFolderState.mutateAsync({
        id: item.id,
        folder: item,
      });
    },
    [updateFolderState]
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
      if (isFolder(item)) {
        updateFolder({ ...item, alias: name });
      }
      if (isApplication(item)) {
        // updateApplication({ ...item, alias: name });
      }
      if (isInstance(item)) {
        // updateInstance({ ...item, alias: name });
      }
    },
    [getItem]
  );

  const onMove: MoveHandler<TreeItem> = useCallback(
    ({ parentId, index, parentNode, dragNodes, dragIds }) => {},
    []
  );

  const onDelete: DeleteHandler<TreeItem> = useCallback(({ ids, nodes }) => {},
  []);

  const onToggle = useCallback((): void => {
    setToggleFlag((prevToggleFlag) => prevToggleFlag + 1);
  }, []);

  const disableDrop = useCallback(
    (dropItem: TreeItem): boolean => isInstance(dropItem),
    []
  );

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
            <Typography
              variant="body1"
              gutterBottom
              sx={{ color: 'text.secondary' }}
            >
              <FormattedMessage id="addYourFirstInstance" />
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size={'small'}
              onClick={createInstanceHandler}
            >
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
          searchMatch={(node, term) =>
            node.data.alias.toLowerCase().includes(term.toLowerCase())
          }
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
