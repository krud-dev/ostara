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
import { CrudSearchData, useCrudSearchQuery } from '../apis/requests/crud/crudSearch';
import {
  AgentDiscoveryFailedEventMessage$Payload,
  AgentDiscoveryStartedEventMessage$Payload,
  AgentDiscoverySucceededEventMessage$Payload,
  AgentHealthUpdatedEventMessage$Payload,
  AgentRO,
  ApplicationCreatedEventMessage$Payload,
  ApplicationDeletedEventMessage$Payload,
  ApplicationHealthUpdatedEventMessage$Payload,
  ApplicationRO,
  ApplicationUpdatedEventMessage$Payload,
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
import { useStompContext } from 'renderer/apis/websockets/StompContext';
import { isAgent, isApplication, isFolder, isInstance } from 'renderer/utils/itemUtils';
import { QueryObserverResult } from '@tanstack/react-query';
import { agentCrudEntity } from 'renderer/apis/requests/crud/entity/entities/agent.crudEntity';
import useItemsRefresh from 'renderer/hooks/items/useItemsRefresh';
import { EnrichedAgentRO } from 'common/manual_definitions';

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
  const { subscribe } = useStompContext();

  const [folders, setFolders] = useState<FolderRO[] | undefined>(undefined);
  const [applications, setApplications] = useState<ApplicationRO[] | undefined>(undefined);
  const [instances, setInstances] = useState<InstanceRO[] | undefined>(undefined);
  const [agents, setAgents] = useState<EnrichedAgentRO[] | undefined>(undefined);
  const [syncingAgentIds, setSyncingAgentIds] = useState<string[]>([]);

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
    setAgents(
      searchAgentsState.data?.results.map((agent) => ({ ...agent, syncing: syncingAgentIds.includes(agent.id) }))
    );
  }, [searchAgentsState.data, syncingAgentIds]);

  const items = useMemo<ItemRO[] | undefined>(
    () =>
      folders && applications && instances && agents
        ? [...folders, ...applications, ...instances, ...agents]
        : undefined,
    [folders, applications, instances, agents]
  );

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
    if (isAgent(itemToAdd)) {
      setAgents((prev) => [
        ...(prev?.filter((a) => a.id !== itemToAdd.id) ?? []),
        { ...itemToAdd, syncing: syncingAgentIds.includes(itemToAdd.id) },
      ]);
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

  useEffect(() => {
    const unsubscribe = subscribe('/topic/agentHealth', {}, (healthChanged: AgentHealthUpdatedEventMessage$Payload) => {
      setAgents((prev) =>
        prev?.map((a) => (a.id === healthChanged.agentId ? { ...a, health: healthChanged.newHealth } : a))
      );
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/agentDiscoveryStart',
      {},
      (discoveryChanged: AgentDiscoveryStartedEventMessage$Payload) => {
        setSyncingAgentIds((prev) => [...prev, discoveryChanged.agentId]);
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/agentDiscoverySuccess',
      {},
      (discoveryChanged: AgentDiscoverySucceededEventMessage$Payload) => {
        setSyncingAgentIds((prev) => prev.filter((id) => id !== discoveryChanged.agentId));
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/agentDiscoveryFailure',
      {},
      (discoveryChanged: AgentDiscoveryFailedEventMessage$Payload) => {
        setSyncingAgentIds((prev) => prev.filter((id) => id !== discoveryChanged.agentId));
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  const addApplicationToRefresh = useItemsRefresh('application', addItems);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/applicationCreation',
      {},
      (applicationEvent: ApplicationCreatedEventMessage$Payload): void => {
        if (applicationEvent.discovered) {
          addApplicationToRefresh(applicationEvent.applicationId);
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/applicationUpdate',
      {},
      (applicationEvent: ApplicationUpdatedEventMessage$Payload): void => {
        if (applicationEvent.discovered) {
          addApplicationToRefresh(applicationEvent.applicationId);
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = subscribe(
      '/topic/applicationDeletion',
      {},
      (applicationEvent: ApplicationDeletedEventMessage$Payload): void => {
        if (applicationEvent.discovered) {
          setApplications((prev) => prev?.filter((i) => i.id !== applicationEvent.applicationId));
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

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

  const addInstanceToRefresh = useItemsRefresh('instance', addItems);

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
