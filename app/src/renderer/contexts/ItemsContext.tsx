import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ItemRO } from '../definitions/daemon';
import { crudSearch, CrudSearchData, useCrudSearchQuery } from '../apis/requests/crud/crudSearch';
import {
  AgentRO,
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationRO,
  FolderRO,
  InstanceCreatedEventMessage$Payload,
  InstanceDeletedEventMessage$Payload,
  InstanceHealthChangedEventMessage$Payload,
  InstanceHostnameUpdatedEventMessage$Payload,
  InstanceMetadataRefreshedMessage$Payload,
  InstanceRO,
  InstanceUpdatedEventMessage$Payload,
} from 'common/generated_definitions';
import { instanceCrudEntity } from 'renderer/apis/requests/crud/entity/entities/instance.crudEntity';
import { folderCrudEntity } from 'renderer/apis/requests/crud/entity/entities/folder.crudEntity';
import { applicationCrudEntity } from 'renderer/apis/requests/crud/entity/entities/application.crudEntity';
import { useStomp } from 'renderer/apis/websockets/StompContext';
import { isApplication, isFolder, isInstance } from 'renderer/utils/itemUtils';
import { QueryObserverResult } from '@tanstack/react-query';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';
import { difference, differenceBy, isEmpty } from 'lodash';

export type ItemsContextProps = {
  folders: FolderRO[] | undefined;
  applications: ApplicationRO[] | undefined;
  instances: InstanceRO[] | undefined;
  agents: AgentRO[] | undefined;
  refetchFolders: () => Promise<QueryObserverResult<CrudSearchData<FolderRO>>>;
  refetchApplications: () => Promise<QueryObserverResult<CrudSearchData<ApplicationRO>>>;
  refetchInstances: () => Promise<QueryObserverResult<CrudSearchData<InstanceRO>>>;
  refetchAgents: () => Promise<QueryObserverResult<CrudSearchData<AgentRO>>>;
  items: ItemRO[] | undefined;
  addItem: (item: ItemRO) => void;
  addItems: (items: ItemRO[]) => void;
  getItem: (id: string) => ItemRO | undefined;
};

const ItemsContext = React.createContext<ItemsContextProps>(undefined!);

interface ItemsProviderProps extends PropsWithChildren<any> {}

const ItemsProvider: FunctionComponent<ItemsProviderProps> = ({ children }) => {
  const { subscribe } = useStomp();

  const [folders, setFolders] = useState<FolderRO[] | undefined>(undefined);
  const [applications, setApplications] = useState<ApplicationRO[] | undefined>(undefined);
  const [instances, setInstances] = useState<InstanceRO[] | undefined>(undefined);
  const [agents, setAgents] = useState<AgentRO[] | undefined>(undefined);

  const searchFolderState = useCrudSearchQuery<FolderRO>({ entity: folderCrudEntity });
  const searchApplicationState = useCrudSearchQuery<ApplicationRO>({ entity: applicationCrudEntity });
  const searchInstanceState = useCrudSearchQuery<InstanceRO>({ entity: instanceCrudEntity });
  const searchAgentsState = useCrudSearchQuery<AgentRO>({ entity: agentCrudEntity });

  useEffect(() => {
    setFolders(searchFolderState.data?.results);
  }, [searchFolderState.data]);

  useEffect(() => {
    setApplications(searchApplicationState.data?.results);
  }, [searchApplicationState.data]);

  useEffect(() => {
    setInstances(searchInstanceState.data?.results);
  }, [searchInstanceState.data]);

  useEffect(() => {
    setAgents(searchAgentsState.data?.results);
  }, [searchAgentsState.data]);

  const items = useMemo<ItemRO[] | undefined>(
    () => (folders && applications && instances ? [...folders, ...applications, ...instances] : undefined),
    [folders, applications, instances]
  );

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

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceMetadata',
      {},
      (metadataRefreshed: InstanceMetadataRefreshedMessage$Payload): void => {
        setInstances((prev) =>
          prev?.map((i) => (i.id === metadataRefreshed.instanceId ? { ...i, metadata: metadataRefreshed.metadata } : i))
        );
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const [instanceIdsToRefresh, setInstanceIdsToRefresh] = useState<string[]>([]);

  const addInstanceToRefresh = useCallback(
    (instanceId: string) => {
      setInstanceIdsToRefresh((prev) => [...prev.filter((id) => id !== instanceId), instanceId]);
    },
    [setInstanceIdsToRefresh]
  );

  useEffect(() => {
    if (isEmpty(instanceIdsToRefresh)) {
      return;
    }

    const instanceIds = [...instanceIdsToRefresh];
    setInstanceIdsToRefresh((prev) => difference(prev, instanceIds));

    (async () => {
      try {
        const result = await crudSearch<InstanceRO>({
          entity: instanceCrudEntity,
          filterFields: [{ fieldName: 'id', operation: 'In', values: instanceIds }],
        });
        setInstances((prev) => [...differenceBy(prev, result.results, 'id'), ...result.results]);
      } catch (e) {}
    })();
  }, [instanceIdsToRefresh]);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceCreation',
      {},
      (instanceEvent: InstanceCreatedEventMessage$Payload): void => {
        if (instanceEvent.discovered) {
          addInstanceToRefresh(instanceEvent.instanceId);
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceUpdate',
      {},
      (instanceEvent: InstanceUpdatedEventMessage$Payload): void => {
        if (instanceEvent.discovered) {
          addInstanceToRefresh(instanceEvent.instanceId);
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/instanceDeletion',
      {},
      (instanceEvent: InstanceDeletedEventMessage$Payload): void => {
        if (instanceEvent.discovered) {
          setInstances((prev) => prev?.filter((i) => i.id !== instanceEvent.instanceId));
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const addItem = useCallback((itemToAdd: ItemRO): void => {
    if (isInstance(itemToAdd)) {
      setInstances((prev) => [...(prev?.filter((i) => i.id !== itemToAdd.id) ?? []), itemToAdd]);
    }
    if (isApplication(itemToAdd)) {
      setApplications((prev) => [...(prev?.filter((a) => a.id !== itemToAdd.id) ?? []), itemToAdd]);
    }
    if (isFolder(itemToAdd)) {
      setFolders((prev) => [...(prev?.filter((f) => f.id !== itemToAdd.id) ?? []), itemToAdd]);
    }
  }, []);

  const addItems = useCallback(
    (itemsToAdd: ItemRO[]): void => {
      for (const item of itemsToAdd) {
        addItem(item);
      }
    },
    [addItem]
  );

  const getItem = useCallback((id: string): ItemRO | undefined => items?.find((i) => i.id === id), [items]);

  const memoizedValue = useMemo<ItemsContextProps>(
    () => ({
      folders,
      applications,
      instances,
      agents,
      refetchFolders: searchFolderState.refetch,
      refetchApplications: searchApplicationState.refetch,
      refetchInstances: searchInstanceState.refetch,
      refetchAgents: searchAgentsState.refetch,
      items,
      addItem,
      addItems,
      getItem,
    }),
    [
      folders,
      applications,
      instances,
      agents,
      searchFolderState.refetch,
      searchApplicationState.refetch,
      searchInstanceState.refetch,
      searchAgentsState.refetch,
      items,
      addItem,
      addItems,
      getItem,
    ]
  );

  return <ItemsContext.Provider value={memoizedValue}>{children}</ItemsContext.Provider>;
};

const useItemsContext = (): ItemsContextProps => {
  const context = useContext(ItemsContext);

  if (!context) throw new Error('ItemsContext must be used inside ItemsProvider');

  return context;
};

export { ItemsContext, ItemsProvider, useItemsContext };
