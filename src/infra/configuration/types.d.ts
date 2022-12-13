import {
  Application,
  Configuration,
  Folder,
  HierarchicalItem, Instance, Item
} from './model/configuration';

declare global {
  type ConfigurationServiceBridge = {
    /**
     * Generic operations
     */
    getConfiguration: () => Promise<Configuration>;
    getItem: (uuid: string) => Promise<Item | undefined>;
    getItemOrThrow: (uuid: string) => Promise<Item>;
    itemExistsOrThrow: (uuid: string) => Promise<void>;
    reorderItem: (uuid: string, order: number) => Promise<void>;
    /**
     * Folder operations
     */
    createFolder: (folder: Omit<Folder, 'uuid'>) => Promise<Folder>;
    updateFolder: (
      uuid: string,
      folder: Omit<Folder, 'uuid'>
    ) => Promise<Folder>;
    deleteFolder: (uuid: string) => Promise<void>;
    getFolderChildren: (uuid: string) => Promise<HierarchicalItem[]>;
    moveFolder: (uuid: string, parentUuid: string) => Promise<Folder>;
    /**
     * Application operations
     */
    createApplication: (
      application: Omit<Application, 'uuid'>
    ) => Promise<Application>;
    updateApplication: (
      uuid: string,
      application: Omit<Application, 'uuid'>
    ) => Promise<Application>;
    deleteApplication: (uuid: string) => Promise<void>;
    moveApplication: (uuid: string, parentUuid: string) => Promise<Application>;
    getApplicationInstances: (uuid: string) => Promise<Instance[]>;
    /**
     * Instance operations
     */
    createInstance: (instance: Omit<Instance, 'uuid'>) => Promise<Instance>;
    updateInstance: (
      uuid: string,
      instance: Omit<Instance, 'uuid'>
    ) => Promise<Instance>;
    deleteInstance: (uuid: string) => Promise<void>;
    moveInstance: (uuid: string, parentUuid: string) => Promise<void>;
  };

  interface Window {
    configuration: ConfigurationServiceBridge;
  }
}

export {};
