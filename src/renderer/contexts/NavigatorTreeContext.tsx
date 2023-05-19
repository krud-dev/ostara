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
import { ItemRO } from '../definitions/daemon';
import { useCrudSearchQuery } from '../apis/requests/crud/crudSearch';
import {
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationRO,
  FolderRO,
  InstanceAbility,
  InstanceHealthChangedEventMessage$Payload,
  InstanceHostnameUpdatedEventMessage$Payload,
  InstanceRO,
} from '../../common/generated_definitions';
import { instanceCrudEntity } from '../apis/requests/crud/entity/entities/instance.crudEntity';
import { folderCrudEntity } from '../apis/requests/crud/entity/entities/folder.crudEntity';
import { applicationCrudEntity } from '../apis/requests/crud/entity/entities/application.crudEntity';
import { buildTree } from '../utils/treeUtils';
import { useStomp } from '../apis/websockets/StompContext';
import { chain } from 'lodash';
import { useGetItemAbilitiesQuery } from '../apis/requests/item/getItemAbilities';
import { isApplication, isFolder, isInstance } from '../utils/itemUtils';

type NavigatorTreeAction = 'expandAll' | 'collapseAll';

export type NavigatorTreeContextProps = {
  data: TreeItem[] | undefined;
  selectedItem: ItemRO | undefined;
  selectedItemAbilities: InstanceAbility[] | undefined;
  isLoading: boolean;
  isEmpty: boolean;
  hasData: boolean;
  action: NavigatorTreeAction | undefined;
  performAction: (action: NavigatorTreeAction) => void;
  addItem: (item: ItemRO) => void;
  getItem: (id: string) => ItemRO | undefined;
  getNewItemOrder: () => number;
};

const NavigatorTreeContext = React.createContext<NavigatorTreeContextProps>(undefined!);

interface NavigatorTreeProviderProps extends PropsWithChildren<any> {}

const NavigatorTreeProvider: FunctionComponent<NavigatorTreeProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { subscribe } = useStomp();
  const params = useParams<{ id?: string }>();

  const [folders, setFolders] = useState<FolderRO[] | undefined>(undefined);
  const [applications, setApplications] = useState<ApplicationRO[] | undefined>(undefined);
  const [instances, setInstances] = useState<InstanceRO[] | undefined>(undefined);
  const [action, setAction] = useState<NavigatorTreeAction | undefined>(undefined);

  const searchFolderState = useCrudSearchQuery<FolderRO>({ entity: folderCrudEntity });
  const searchApplicationState = useCrudSearchQuery<ApplicationRO>({ entity: applicationCrudEntity });
  const searchInstanceState = useCrudSearchQuery<InstanceRO>({ entity: instanceCrudEntity });

  useEffect(() => {
    setFolders(searchFolderState.data?.results);
  }, [searchFolderState.data]);

  useEffect(() => {
    setApplications(searchApplicationState.data?.results);
  }, [searchApplicationState.data]);

  useEffect(() => {
    setInstances(searchInstanceState.data?.results);
  }, [searchInstanceState.data]);

  const items = useMemo<ItemRO[] | undefined>(
    () => (folders && applications && instances ? [...folders, ...applications, ...instances] : undefined),
    [folders, applications, instances]
  );
  const data = useMemo<TreeItem[] | undefined>(
    () => (folders && applications && instances ? buildTree([...folders, ...applications, ...instances]) : undefined),
    [folders, applications, instances]
  );
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

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/applicationHealth',
      {},
      (healthChanged: ApplicationHealthUpdatedEventMessage$Payload) => {
        setApplications((prev) =>
          prev?.map((a) => (a.id === healthChanged.applicationId ? { ...a, health: healthChanged.newHealth } : a))
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceHealth',
      {},
      (healthChanged: InstanceHealthChangedEventMessage$Payload): void => {
        setInstances((prev) =>
          prev?.map((i) => (i.id === healthChanged.instanceId ? { ...i, health: healthChanged.newHealth } : i))
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceHostname',
      {},
      (hostnameUpdated: InstanceHostnameUpdatedEventMessage$Payload): void => {
        setInstances((prev) =>
          prev?.map((i) => (i.id === hostnameUpdated.instanceId ? { ...i, hostname: hostnameUpdated.hostname } : i))
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const performAction = useCallback((actionToPerform: NavigatorTreeAction) => {
    setAction(actionToPerform);
  }, []);

  useEffect(() => {
    if (action) {
      setAction(undefined);
    }
  }, [action]);

  const addItem = useCallback((item: ItemRO): void => {
    if (isInstance(item)) {
      setInstances((prev) => [...(prev?.filter((i) => i.id !== item.id) ?? []), item]);
    }
    if (isApplication(item)) {
      setApplications((prev) => [...(prev?.filter((a) => a.id !== item.id) ?? []), item]);
    }
    if (isFolder(item)) {
      setFolders((prev) => [...(prev?.filter((f) => f.id !== item.id) ?? []), item]);
    }
  }, []);

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
  }, [items, params.id]);

  const getItemAbilitiesState = useGetItemAbilitiesQuery(
    { item: selectedItem },
    { enabled: !!selectedItem, refetchInterval: 1000 * 10 }
  );

  const selectedItemAbilities = useMemo<InstanceAbility[] | undefined>(
    () => getItemAbilitiesState.data,
    [getItemAbilitiesState.data]
  );

  const getNewItemOrder = useCallback((): number => {
    return data?.length
      ? chain(data)
          .map<number>((item) => item.sort ?? 0)
          .max()
          .value() + 1
      : 1;
  }, [data]);

  return (
    <NavigatorTreeContext.Provider
      value={{
        data,
        selectedItem,
        selectedItemAbilities,
        isLoading,
        isEmpty,
        hasData,
        action,
        performAction,
        addItem,
        getItem,
        getNewItemOrder,
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
