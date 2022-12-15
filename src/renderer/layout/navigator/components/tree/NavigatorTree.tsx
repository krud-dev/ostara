import {
  CreateHandler,
  DeleteHandler,
  MoveHandler,
  RenameHandler,
  Tree,
  TreeApi,
} from 'react-arborist';
import { isInstance } from 'infra/configuration/model/configuration';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import NavigatorTreeNode from 'renderer/layout/navigator/components/tree/NavigatorTreeNode';
import { TreeItem } from 'renderer/layout/navigator/components/tree/tree';
import {
  NAVIGATOR_ITEM_HEIGHT,
  SIDEBAR_DRAWER_WIDTH,
} from 'renderer/constants/ui';
import { experimentalStyled as styled } from '@mui/material/styles';

const TreeStyle = styled(Tree<TreeItem>)(({ theme }) => ({
  '& [role="treeitem"]': {
    outline: 'none',
  },
}));

type NavigatorTreeProps = {
  search?: string;
};

export default function NavigatorTree({ search }: NavigatorTreeProps) {
  const treeRef = useRef<TreeApi<TreeItem> | null>(null);

  const [data, setData] = useState<TreeItem[] | undefined>(undefined);

  useEffect(() => {
    setData([
      {
        uuid: uuidv4(),
        type: 'folder',
        alias: 'Project 1',
        children: [
          {
            uuid: uuidv4(),
            type: 'folder',
            alias: 'Frontend',
            children: [
              {
                uuid: uuidv4(),
                type: 'application',
                applicationType: 'SpringBoot',
                alias: 'Frontend Application',
                children: [
                  {
                    uuid: uuidv4(),
                    type: 'instance',
                    alias: 'Frontend Instance 1',
                    actuatorUrl: 'http://localhost:8080/actuator',
                    applicationUuid: 'uuid',
                  },
                  {
                    uuid: uuidv4(),
                    type: 'instance',
                    alias: 'Frontend Instance 2',
                    actuatorUrl: 'http://localhost:8080/actuator',
                    applicationUuid: 'uuid',
                  },
                ],
              },
            ],
          },
          {
            uuid: uuidv4(),
            type: 'folder',
            alias: 'Backend',
            children: [
              {
                uuid: uuidv4(),
                type: 'application',
                applicationType: 'SpringBoot',
                alias: 'Backend Application',
                children: [
                  {
                    uuid: uuidv4(),
                    type: 'instance',
                    alias: 'Backend Instance',
                    actuatorUrl: 'http://localhost:8080/actuator',
                    applicationUuid: 'uuid',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        uuid: uuidv4(),
        type: 'folder',
        alias: 'Project 2',
        children: [
          {
            uuid: uuidv4(),
            type: 'folder',
            alias: 'Project 2 1',
            children: [
              {
                uuid: uuidv4(),
                type: 'folder',
                alias: 'Project 2 1 1',
                children: [
                  {
                    uuid: uuidv4(),
                    type: 'folder',
                    alias: 'Project 2 1 1 1',
                    children: [
                      {
                        uuid: uuidv4(),
                        type: 'folder',
                        alias: 'Project 2 1 1 1 1',
                        children: [
                          {
                            uuid: uuidv4(),
                            type: 'folder',
                            alias: 'Project 2 1 1 1 1 1',
                            children: [
                              {
                                uuid: uuidv4(),
                                type: 'folder',
                                alias: 'Project 2 1 1 1 1 1 1',
                                children: [
                                  {
                                    uuid: uuidv4(),
                                    type: 'folder',
                                    alias: 'Project 2 1 1 1 1 1 1 1',
                                    children: [],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      { uuid: uuidv4(), type: 'folder', alias: 'Project 3', children: [] },
    ]);
  }, []);

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
      (treeApi.isOpen(treeItem.uuid)
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
  }, [data]);

  const height = useMemo<number>(
    () => getOpenItemsCount() * NAVIGATOR_ITEM_HEIGHT + 12,
    [toggleFlag]
  );

  // const configurationState = useGetConfigurationQuery({});
  //
  // const buildTreeFolder = useCallback(
  //   (configuration: Configuration): TreeData => {},
  //   []
  // );
  //
  // const buildTree = useCallback((configuration: Configuration): TreeData => {},
  // []);
  //
  // useEffect(() => {
  //   const result = configurationState.data;
  //   if (result) {
  //     setData(buildTree(result));
  //   }
  // }, [configurationState.data]);

  const onCreate: CreateHandler<TreeItem> = useCallback(
    ({ parentId, index, parentNode, type }) => {
      return null;
    },
    []
  );

  const onRename: RenameHandler<TreeItem> = useCallback(({ id, name }) => {},
  []);

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
      {!data ? (
        <CircularProgress />
      ) : (
        <TreeStyle
          ref={treeRef}
          idAccessor={'uuid'}
          data={data}
          openByDefault={false}
          width={SIDEBAR_DRAWER_WIDTH - 1}
          height={height}
          indent={12}
          rowHeight={NAVIGATOR_ITEM_HEIGHT}
          searchTerm={search}
          searchMatch={(node, term) => node.data.alias.includes(term)}
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
