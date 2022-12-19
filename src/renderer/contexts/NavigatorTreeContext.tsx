import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useGetConfigurationQuery } from 'renderer/apis/configuration/getConfiguration';
import {
  Configuration,
  isInstance,
  Item,
} from 'infra/configuration/model/configuration';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { forEach } from 'lodash';

type NavigatorTreeAction = 'expandAll' | 'collapseAll';

export type NavigatorTreeContextProps = {
  data: TreeItem[] | undefined;
  isLoading: boolean;
  isEmpty: boolean;
  hasData: boolean;
  action: NavigatorTreeAction | undefined;
  performAction: (action: NavigatorTreeAction) => void;
  getItem: (id: string) => Item | undefined;
  reloadTree: () => Promise<void>;
};

const NavigatorTreeContext = React.createContext<NavigatorTreeContextProps>(
  undefined!
);

interface NavigatorTreeProviderProps extends PropsWithChildren<any> {}

const NavigatorTreeProvider: FunctionComponent<NavigatorTreeProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<TreeItem[] | undefined>(undefined);
  const [action, setAction] = useState<NavigatorTreeAction | undefined>(
    undefined
  );

  const isLoading = useMemo<boolean>(() => !data, [data]);
  const isEmpty = useMemo<boolean>(() => data?.length === 0, [data]);
  const hasData = useMemo<boolean>(() => !!data && data.length > 0, [data]);

  const configurationState = useGetConfigurationQuery({});

  const buildTree = useCallback((configuration: Configuration): TreeItem[] => {
    const hashMap = new Map<string, TreeItem>();
    forEach(configuration.items, (item) => {
      hashMap.set(item.id, { ...item, children: [] });
    });

    const dataTree: TreeItem[] = [];
    forEach(configuration.items, (item) => {
      if (isInstance(item)) {
        const treeItem = hashMap.get(item.id);
        if (treeItem) {
          hashMap.get(item.parentApplicationId)?.children?.push(treeItem);
        }
      } else {
        const treeItem = hashMap.get(item.id);
        if (treeItem) {
          if (item.parentFolderId) {
            hashMap.get(item.parentFolderId)?.children?.push(treeItem);
          } else {
            dataTree.push(treeItem);
          }
        }
      }
    });
    return dataTree;
  }, []);

  useEffect(() => {
    const result = configurationState.data;
    if (result) {
      setData(buildTree(result));
    }
  }, [configurationState.data]);

  const performAction = useCallback((actionToPerform: NavigatorTreeAction) => {
    setAction(actionToPerform);
  }, []);

  useEffect(() => {
    if (action) {
      setAction(undefined);
    }
  }, [action]);

  const getItem = useCallback(
    (id: string): Item | undefined => {
      return configurationState.data?.items?.[id];
    },
    [configurationState.data]
  );

  const reloadTree = useCallback(async (): Promise<void> => {
    await configurationState.refetch();
  }, []);

  return (
    <NavigatorTreeContext.Provider
      value={{
        data,
        isLoading,
        isEmpty,
        hasData,
        action,
        performAction,
        getItem,
        reloadTree,
      }}
    >
      {children}
    </NavigatorTreeContext.Provider>
  );
};

const useNavigatorTree = (): NavigatorTreeContextProps => {
  const context = useContext(NavigatorTreeContext);

  if (!context)
    throw new Error(
      'NavigatorTreeContext must be used inside NavigatorTreeProvider'
    );

  return context;
};

export { NavigatorTreeContext, NavigatorTreeProvider, useNavigatorTree };
