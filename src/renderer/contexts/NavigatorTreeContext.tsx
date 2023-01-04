import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { EnrichedItem, isInstance, Item } from 'infra/configuration/model/configuration';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { forEach, some } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { useGetItemsQuery } from 'renderer/apis/configuration/item/getItems';
import { isItemLoading } from 'renderer/utils/itemUtils';

type NavigatorTreeAction = 'expandAll' | 'collapseAll';

export type NavigatorTreeContextProps = {
  data: TreeItem[] | undefined;
  selectedItem: EnrichedItem | undefined;
  isLoading: boolean;
  isEmpty: boolean;
  hasData: boolean;
  action: NavigatorTreeAction | undefined;
  performAction: (action: NavigatorTreeAction) => void;
  getItem: (id: string) => Item | undefined;
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

  const getItemsState = useGetItemsQuery({});

  const buildTree = useCallback((items: EnrichedItem[]): TreeItem[] => {
    const sortByOrder = (itemsToSort: EnrichedItem[]) => itemsToSort.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const hashMap = new Map<string, TreeItem>();
    forEach(items, (item) => {
      hashMap.set(item.id, { ...item, children: [] });
    });

    const dataTree: TreeItem[] = [];
    forEach(items, (item) => {
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
    const result = getItemsState.data;
    if (result) {
      setData(buildTree(result));

      if (params.id) {
        const item = result.find((i) => i.id === params.id);
        if (!item) {
          navigate(urls.home.url);
        }
      }
    }
  }, [getItemsState.data]);

  const [refreshTreeFlag, setRefreshTreeFlag] = useState<boolean>(false);

  useEffect(() => {
    if (!getItemsState.isLoading) {
      getItemsState.refetch();
    }
    const interval = !getItemsState.data || some(getItemsState.data, (item) => isItemLoading(item)) ? 2000 : 30000;
    const timer = setTimeout(() => {
      setRefreshTreeFlag((prev) => !prev);
    }, interval);
    return () => clearTimeout(timer);
  }, [refreshTreeFlag]);

  const performAction = useCallback((actionToPerform: NavigatorTreeAction) => {
    setAction(actionToPerform);
  }, []);

  useEffect(() => {
    if (action) {
      setAction(undefined);
    }
  }, [action]);

  const getItem = useCallback(
    (id: string): EnrichedItem | undefined => {
      return getItemsState.data?.find((i) => i.id === id);
    },
    [getItemsState.data]
  );

  const selectedItem = useMemo<EnrichedItem | undefined>(() => {
    if (!params.id) {
      return undefined;
    }
    const item = getItem(params.id);
    if (!item) {
      return undefined;
    }
    return item;
  }, [getItemsState.data, params.id]);

  return (
    <NavigatorTreeContext.Provider
      value={{
        data,
        selectedItem,
        isLoading,
        isEmpty,
        hasData,
        action,
        performAction,
        getItem,
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
