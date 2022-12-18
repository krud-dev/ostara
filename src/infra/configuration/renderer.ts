import { ipcRenderer } from 'electron';
import {
  Application,
  Configuration,
  Folder,
  HierarchicalItem,
  Instance,
  BaseItem,
} from './model/configuration';

export const configurationStoreBridge = {
  get<T>(key: string): T {
    return ipcRenderer.sendSync('configurationStore:get', key);
  },
  set<T>(property: string, val: T) {
    ipcRenderer.send('configurationStore:set', property, val);
  },
  has(key: string): boolean {
    return ipcRenderer.sendSync('configurationStore:has', key);
  },
  delete(key: string): void {
    ipcRenderer.send('configurationStore:delete', key);
  },
  reset(key: string): void {
    ipcRenderer.send('configurationStore:reset', key);
  },
  clear(): void {
    ipcRenderer.send('configurationStore:clear');
  },
};

export const configurationServiceBridge = {
  getConfiguration(): Promise<Configuration> {
    return ipcRenderer.invoke('configurationService:getConfiguration');
  },
  /**
   * Generic operations
   */
  getItem(uuid: string): Promise<BaseItem | undefined> {
    return ipcRenderer.invoke('configurationService:getItem', uuid);
  },
  getItemOrThrow(uuid: string): Promise<BaseItem> {
    return ipcRenderer.invoke('configurationService:getItemOrThrow', uuid);
  },
  itemExistsOrThrow(uuid: string): Promise<void> {
    return ipcRenderer.invoke('configurationService:itemExistsOrThrow', uuid);
  },
  reorderItem(uuid: string, order: number): Promise<void> {
    return ipcRenderer.invoke('configurationService:reorderItem', uuid, order);
  },
  /**
   * Folder operations
   */
  createFolder(folder: Omit<Folder, 'uuid'>): Promise<Folder> {
    return ipcRenderer.invoke('configurationService:createFolder', folder);
  },
  updateFolder(uuid: string, folder: Omit<Folder, 'uuid'>): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:updateFolder',
      uuid,
      folder
    );
  },
  deleteFolder(uuid: string): Promise<void> {
    return ipcRenderer.invoke('configurationService:deleteFolder', uuid);
  },
  getFolderChildren(uuid: string): Promise<HierarchicalItem[]> {
    return ipcRenderer.invoke('configurationService:getFolderChildren', uuid);
  },
  moveFolder(uuid: string, parentUuid: string): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:moveFolder',
      uuid,
      parentUuid
    );
  },
  /**
   * Application operations
   */
  createApplication(
    application: Omit<Application, 'uuid'>
  ): Promise<Application> {
    return ipcRenderer.invoke(
      'configurationService:createApplication',
      application
    );
  },
  updateApplication(uuid: string, application: Omit<Application, 'uuid'>) {
    return ipcRenderer.invoke(
      'configurationService:updateApplication',
      uuid,
      application
    );
  },
  deleteApplication(uuid: string): Promise<void> {
    return ipcRenderer.invoke('configurationService:deleteApplication', uuid);
  },
  moveApplication(uuid: string, parentUuid: string): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:moveApplication',
      uuid,
      parentUuid
    );
  },
  getApplicationInstances(uuid: string): Promise<Instance[]> {
    return ipcRenderer.invoke(
      'configurationService:getApplicationInstances',
      uuid
    );
  },
  /**
   * Instance operations
   */
  createInstance(instance: Omit<Instance, 'uuid'>): Promise<Instance> {
    return ipcRenderer.invoke('configurationService:createInstance', instance);
  },
  updateInstance(
    uuid: string,
    instance: Omit<Instance, 'uuid'>
  ): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:updateInstance',
      uuid,
      instance
    );
  },
  deleteInstance(uuid: string): Promise<void> {
    return ipcRenderer.invoke('configurationService:deleteInstance', uuid);
  },
  moveInstance(uuid: string, parentUuid: string): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:moveInstance',
      uuid,
      parentUuid
    );
  },
};
