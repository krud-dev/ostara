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
import { useSubscribeToEvent } from 'renderer/apis/subscriptions/subscribeToEvent';
import { useQueryClient } from '@tanstack/react-query';
import { apiKeys } from '../apis/apiKeys';
import { ItemRO } from '../definitions/daemon';
import { useCrudSearchQuery } from '../apis/crud/crudSearch';
import { ApplicationRO, FolderRO, InstanceRO } from '../../common/generated_definitions';
import { instanceCrudEntity } from '../apis/crud/entity/entities/instance.crud-entity';
import { folderCrudEntity } from '../apis/crud/entity/entities/folder.crud-entity';
import { applicationCrudEntity } from '../apis/crud/entity/entities/application.crud-entity';
import { buildTree } from '../utils/treeUtils';

type NavigatorTreeAction = 'expandAll' | 'collapseAll';

export type NavigatorTreeContextProps = {
  data: TreeItem[] | undefined;
  selectedItem: ItemRO | undefined;
  isLoading: boolean;
  isEmpty: boolean;
  hasData: boolean;
  action: NavigatorTreeAction | undefined;
  performAction: (action: NavigatorTreeAction) => void;
  getItem: (id: string) => ItemRO | undefined;
};

const NavigatorTreeContext = React.createContext<NavigatorTreeContextProps>(undefined!);

interface NavigatorTreeProviderProps extends PropsWithChildren<any> {}

const NavigatorTreeProvider: FunctionComponent<NavigatorTreeProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams<{ id?: string }>();

  const [action, setAction] = useState<NavigatorTreeAction | undefined>(undefined);

  const searchFolderState = useCrudSearchQuery<FolderRO>({ entity: folderCrudEntity });
  const searchApplicationState = useCrudSearchQuery<ApplicationRO>({ entity: applicationCrudEntity });
  const searchInstanceState = useCrudSearchQuery<InstanceRO>({ entity: instanceCrudEntity });

  const items = useMemo<ItemRO[] | undefined>(
    () =>
      searchFolderState.data && searchApplicationState.data && searchInstanceState.data
        ? [
            ...searchFolderState.data.results,
            ...searchApplicationState.data.results,
            ...searchInstanceState.data.results,
          ]
        : undefined,
    [searchFolderState.data, searchApplicationState.data, searchInstanceState.data]
  );
  const data = useMemo<TreeItem[] | undefined>(() => items && buildTree(items), [items]);
  const isLoading = useMemo<boolean>(() => !data, [data]);
  const isEmpty = useMemo<boolean>(() => !!data && data.length === 0, [data]);
  const hasData = useMemo<boolean>(() => !!data && data.length > 0, [data]);

  useEffect(() => {
    if (items && params.id) {
      const item = items.find((i) => i.id === params.id);
      if (!item) {
        navigate(urls.home.url);
      }
    }
  }, [items]);

  // TODO: reimplement
  // const subscribeToHealthEventsState = useSubscribeToEvent();
  //
  // useEffect(() => {
  //   let unsubscribe: (() => void) | undefined;
  //   (async () => {
  //     unsubscribe = await subscribeToHealthEventsState.mutateAsync({
  //       event: 'app:instanceHealthUpdated',
  //       listener: () => {
  //         queryClient.invalidateQueries(apiKeys.items());
  //       },
  //     });
  //   })();
  //   return () => {
  //     unsubscribe?.();
  //   };
  // }, []);

  // TODO: reimplement
  // const subscribeToEndpointsEventsState = useSubscribeToEvent();
  //
  // useEffect(() => {
  //   let unsubscribe: (() => void) | undefined;
  //   (async () => {
  //     unsubscribe = await subscribeToEndpointsEventsState.mutateAsync({
  //       event: 'app:instanceAbilitiesUpdated',
  //       listener: () => {
  //         queryClient.invalidateQueries(apiKeys.items());
  //       },
  //     });
  //   })();
  //   return () => {
  //     unsubscribe?.();
  //   };
  // }, []);

  const performAction = useCallback((actionToPerform: NavigatorTreeAction) => {
    setAction(actionToPerform);
  }, []);

  useEffect(() => {
    if (action) {
      setAction(undefined);
    }
  }, [action]);

  const getItem = useCallback(
    (id: string): ItemRO | undefined => {
      return items?.find((i) => i.id === id);
    },
    [items]
  );

  const selectedItem = useMemo<ItemRO | undefined>(() => {
    if (!params.id) {
      return undefined;
    }
    const item = getItem(params.id);
    if (!item) {
      return undefined;
    }
    return item;
  }, [getItem, params.id]);

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
