import {
  Application,
  BaseItem,
  Configuration,
  EnrichedApplication,
  EnrichedFolder,
  EnrichedInstance,
  EnrichedItem,
  Folder,
  Instance,
} from './model/configuration';

declare global {
  type ConfigurationServiceBridge = {
    /**
     * Generic operations
     */
    getConfiguration: () => Promise<Configuration>;
    getItems: () => Promise<EnrichedItem[]>;
    getItem: (id: string) => Promise<EnrichedItem | undefined>;
    getItemOrThrow: (id: string) => Promise<EnrichedItem>;
    itemExistsOrThrow: (id: string) => Promise<void>;
    setColor: (id: string, color?: string) => Promise<void>;
    /**
     * Folder operations
     */
    createFolder: (folder: Omit<Folder, 'id' | 'type'>) => Promise<EnrichedFolder>;
    updateFolder: (id: string, folder: Omit<Folder, 'id' | 'type'>) => Promise<EnrichedFolder>;
    deleteFolder: (id: string) => Promise<void>;
    getFolderChildren: (id: string) => Promise<Exclude<EnrichedItem, EnrichedInstance>[]>;
    moveFolder: (id: string, newParentFolderId: string, newOrder: number) => Promise<EnrichedFolder>;
    /**
     * Application operations
     */
    createApplication: (application: Omit<Application, 'id' | 'type'>) => Promise<EnrichedApplication>;
    updateApplication: (id: string, application: Omit<Application, 'id' | 'type'>) => Promise<EnrichedApplication>;
    deleteApplication: (id: string) => Promise<void>;
    moveApplication: (id: string, newParentFolderId: string, newOrder: number) => Promise<EnrichedApplication>;
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
