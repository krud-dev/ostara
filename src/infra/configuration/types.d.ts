import {
  Application,
  BaseItem,
  Configuration,
  EnrichedInstance,
  Folder,
  HierarchicalItem,
  Instance
} from './model/configuration';

declare global {
  type ConfigurationServiceBridge = {
    /**
     * Generic operations
     */
    getConfiguration: () => Promise<Configuration>;
    getItem: (id: string) => Promise<BaseItem | undefined>;
    getItemOrThrow: (id: string) => Promise<BaseItem>;
    itemExistsOrThrow: (id: string) => Promise<void>;
    setColor: (id: string, color?: string) => Promise<void>;
    /**
     * Folder operations
     */
    createFolder: (folder: Omit<Folder, 'id' | 'type'>) => Promise<Folder>;
    updateFolder: (id: string, folder: Omit<Folder, 'id' | 'type'>) => Promise<Folder>;
    deleteFolder: (id: string) => Promise<void>;
    getFolderChildren: (id: string) => Promise<HierarchicalItem[]>;
    moveFolder: (id: string, newParentFolderId: string, newOrder: number) => Promise<Folder>;
    /**
     * Application operations
     */
    createApplication: (application: Omit<Application, 'id' | 'type'>) => Promise<Application>;
    updateApplication: (id: string, application: Omit<Application, 'id' | 'type'>) => Promise<Application>;
    deleteApplication: (id: string) => Promise<void>;
    moveApplication: (id: string, newParentFolderId: string, newOrder: number) => Promise<Application>;
    getApplicationInstances: (id: string) => Promise<EnrichedInstance[]>;
    /**
     * Instance operations
     */
    createInstance: (instance: Omit<Instance, 'id' | 'type'>) => Promise<EnrichedInstance>;
    updateInstance: (id: string, instance: Omit<Instance, 'id' | 'type'>) => Promise<EnrichedInstance>;
    deleteInstance: (id: string) => Promise<void>;
    moveInstance: (id: string, newParentApplicationId: string, newOrder: number) => Promise<EnrichedInstance>;
  };

  interface Window {
    configuration: ConfigurationServiceBridge;
  }
}

export {};
