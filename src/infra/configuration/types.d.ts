import { Application, Configuration, Folder, HierarchicalItem, Instance, BaseItem } from './model/configuration';

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
    moveFolder: (id: string, newParentFolderId: string) => Promise<Folder>;
    /**
     * Application operations
     */
    createApplication: (application: Omit<Application, 'id' | 'type'>) => Promise<Application>;
    updateApplication: (id: string, application: Omit<Application, 'id' | 'type'>) => Promise<Application>;
    deleteApplication: (id: string) => Promise<void>;
    moveApplication: (id: string, newParentFolderId: string) => Promise<Application>;
    getApplicationInstances: (id: string) => Promise<Instance[]>;
    /**
     * Instance operations
     */
    createInstance: (instance: Omit<Instance, 'id' | 'type'>) => Promise<Instance>;
    updateInstance: (id: string, instance: Omit<Instance, 'id' | 'type'>) => Promise<Instance>;
    deleteInstance: (id: string) => Promise<void>;
    moveInstance: (id: string, newParentFolderId: string) => Promise<void>;
  };

  interface Window {
    configuration: ConfigurationServiceBridge;
  }
}

export {};
