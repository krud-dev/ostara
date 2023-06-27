import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { TreeItem } from 'renderer/layout/navigator/components/sidebar/tree/tree';
import { useNavigate, useParams } from 'react-router-dom';
import { urls } from 'renderer/routes/urls';
import { ItemRO } from 'renderer/definitions/daemon';
import { InstanceAbility } from 'common/generated_definitions';
import { buildTree } from 'renderer/utils/treeUtils';
import { chain } from 'lodash';
import { useGetItemAbilitiesQuery } from 'renderer/apis/requests/item/getItemAbilities';
import { useItemsContext } from 'renderer/contexts/ItemsContext';

type NavigatorLayoutAction = 'expandAll' | 'collapseAll';

export type NavigatorLayoutContextProps = {
  data: TreeItem[] | undefined;
  selectedItem: ItemRO | undefined;
  selectedItemAbilities: InstanceAbility[] | undefined;
  action: NavigatorLayoutAction | undefined;
  performAction: (action: NavigatorLayoutAction) => void;
  getNewItemOrder: () => number;
};

const NavigatorLayoutContext = React.createContext<NavigatorLayoutContextProps>(undefined!);

interface NavigatorLayoutProviderProps extends PropsWithChildren<any> {}

const NavigatorLayoutProvider: FunctionComponent<NavigatorLayoutProviderProps> = ({ children }) => {
  const { folders, applications, instances, items, getItem } = useItemsContext();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();

  const [action, setAction] = useState<NavigatorLayoutAction | undefined>(undefined);

  const data = useMemo<TreeItem[] | undefined>(
    () => (folders && applications && instances ? buildTree([...folders, ...applications, ...instances]) : undefined),
    [folders, applications, instances]
  );

  useEffect(() => {
    if (items && params.id) {
      const item = items.find((i) => i.id === params.id);
      if (!item) {
        navigate(urls.home.url);
      }
    }
  }, [items]);

  const performAction = useCallback((actionToPerform: NavigatorLayoutAction) => {
    setAction(actionToPerform);
  }, []);

  useEffect(() => {
    if (action) {
      setAction(undefined);
    }
  }, [action]);

  const selectedItem = useMemo<ItemRO | undefined>(() => {
    if (!params.id) {
      return undefined;
    }
    const item = getItem(params.id);
    if (!item) {
      return undefined;
    }
    return item;
  }, [items, params.id]);

  const getItemAbilitiesState = useGetItemAbilitiesQuery(
    { item: selectedItem },
    { enabled: !!selectedItem, refetchInterval: 1000 * 10 }
  );

  const selectedItemAbilities = useMemo<InstanceAbility[] | undefined>(
    () => getItemAbilitiesState.data,
    [getItemAbilitiesState.data]
  );

  const getNewItemOrder = useCallback(
    (): number =>
      data?.length
        ? chain(data)
            .map<number>((item) => item.sort ?? 0)
            .max()
            .value() + 1
        : 1,
    [data]
  );

  const memoizedValue = useMemo<NavigatorLayoutContextProps>(
    () => ({ data, selectedItem, selectedItemAbilities, action, performAction, getNewItemOrder }),
    [data, selectedItem, selectedItemAbilities, action, performAction, getNewItemOrder]
  );

  return <NavigatorLayoutContext.Provider value={memoizedValue}>{children}</NavigatorLayoutContext.Provider>;
};

const useNavigatorLayoutContext = (): NavigatorLayoutContextProps => {
  const context = useContext(NavigatorLayoutContext);

  if (!context) throw new Error('NavigatorLayoutContext must be used inside NavigatorLayoutProvider');

  return context;
};

export { NavigatorLayoutContext, NavigatorLayoutProvider, useNavigatorLayoutContext };
