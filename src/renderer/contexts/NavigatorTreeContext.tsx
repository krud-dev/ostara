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
import { Configuration, isInstance, Item } from 'infra/configuration/model/configuration';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { forEach } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';

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

const NavigatorTreeContext = React.createContext<NavigatorTreeContextProps>(undefined!);

interface NavigatorTreeProviderProps extends PropsWithChildren<any> {}

const NavigatorTreeProvider: FunctionComponent<NavigatorTreeProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  const [data, setData] = useState<TreeItem[] | undefined>(undefined);
  const [action, setAction] = useState<NavigatorTreeAction | undefined>(undefined);

  const isLoading = useMemo<boolean>(() => !data, [data]);
  const isEmpty = useMemo<boolean>(() => data?.length === 0, [data]);
  const hasData = useMemo<boolean>(() => !!data && data.length > 0, [data]);

  const configurationState = useGetConfigurationQuery({});

  const buildTree = useCallback((configuration: Configuration): TreeItem[] => {
    const sortByOrder = (items: Item[]) => items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const hashMap = new Map<string, TreeItem>();
    forEach(configuration.items, (item) => {
      hashMap.set(item.id, { ...item, children: [] });
    });

    const dataTree: TreeItem[] = [];
    forEach(configuration.items, (item) => {
      if (isInstance(item)) {
        const treeItem = hashMap.get(item.id);
        if (treeItem) {
          const parentChildren = hashMap.get(item.parentApplicationId)?.children;
          if (parentChildren) {
            parentChildren.push(treeItem);
            sortByOrder(parentChildren);
          }
        }
      } else {
        const treeItem = hashMap.get(item.id);
        if (treeItem) {
          if (item.parentFolderId) {
            const parentChildren = hashMap.get(item.parentFolderId)?.children;
            if (parentChildren) {
              parentChildren.push(treeItem);
              sortByOrder(parentChildren);
            }
          } else {
            dataTree.push(treeItem);
          }
        }
      }
    });

    sortByOrder(dataTree);
    return dataTree;
  }, []);

  useEffect(() => {
    const result = configurationState.data;
    if (result) {
      setData(buildTree(result));

      if (params.id) {
        const item = result.items?.[params.id];
        if (!item) {
          navigate(urls.home.url);
        }
      }
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

  if (!context) throw new Error('NavigatorTreeContext must be used inside NavigatorTreeProvider');

  return context;
};

export { NavigatorTreeContext, NavigatorTreeProvider, useNavigatorTree };
