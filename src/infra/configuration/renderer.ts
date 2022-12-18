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
  getItem(id: string): Promise<BaseItem | undefined> {
    return ipcRenderer.invoke('configurationService:getItem', id);
  },
  getItemOrThrow(id: string): Promise<BaseItem> {
    return ipcRenderer.invoke('configurationService:getItemOrThrow', id);
  },
  itemExistsOrThrow(id: string): Promise<void> {
    return ipcRenderer.invoke('configurationService:itemExistsOrThrow', id);
  },
  reorderItem(id: string, order: number): Promise<void> {
    return ipcRenderer.invoke('configurationService:reorderItem', id, order);
  },
  /**
   * Folder operations
   */
  createFolder(folder: Omit<Folder, 'id'>): Promise<Folder> {
    return ipcRenderer.invoke('configurationService:createFolder', folder);
  },
  updateFolder(id: string, folder: Omit<Folder, 'id'>): Promise<void> {
    return ipcRenderer.invoke('configurationService:updateFolder', id, folder);
  },
  deleteFolder(id: string): Promise<void> {
    return ipcRenderer.invoke('configurationService:deleteFolder', id);
  },
  getFolderChildren(id: string): Promise<HierarchicalItem[]> {
    return ipcRenderer.invoke('configurationService:getFolderChildren', id);
  },
  moveFolder(id: string, newParentFolderId: string): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:moveFolder',
      id,
      newParentFolderId
    );
  },
  /**
   * Application operations
   */
  createApplication(
    application: Omit<Application, 'id'>
  ): Promise<Application> {
    return ipcRenderer.invoke(
      'configurationService:createApplication',
      application
    );
  },
  updateApplication(id: string, application: Omit<Application, 'id'>) {
    return ipcRenderer.invoke(
      'configurationService:updateApplication',
      id,
      application
    );
  },
  deleteApplication(id: string): Promise<void> {
    return ipcRenderer.invoke('configurationService:deleteApplication', id);
  },
  moveApplication(id: string, newParentFolderId: string): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:moveApplication',
      id,
      newParentFolderId
    );
  },
  getApplicationInstances(id: string): Promise<Instance[]> {
    return ipcRenderer.invoke(
      'configurationService:getApplicationInstances',
      id
    );
  },
  /**
   * Instance operations
   */
  createInstance(instance: Omit<Instance, 'id'>): Promise<Instance> {
    return ipcRenderer.invoke('configurationService:createInstance', instance);
  },
  updateInstance(id: string, instance: Omit<Instance, 'id'>): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:updateInstance',
      id,
      instance
    );
  },
  deleteInstance(id: string): Promise<void> {
    return ipcRenderer.invoke('configurationService:deleteInstance', id);
  },
  moveInstance(id: string, newParentApplicationId: string): Promise<void> {
    return ipcRenderer.invoke(
      'configurationService:moveInstance',
      id,
      newParentApplicationId
    );
  },
};
