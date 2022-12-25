import { v4 as uuidv4 } from 'uuid';
import {
  Application,
  BaseItem,
  Configuration,
  Folder,
  HierarchicalItem,
  Instance,
  isApplication,
  isFolder,
  isInstance,
} from './model/configuration';
import { configurationStore } from './configurationStore';

class ConfigurationService {
  /**
   * Generic operations
   */
  getConfiguration(): Configuration {
    return configurationStore.store;
  }

  getItem(id: string): BaseItem | undefined {
    return configurationStore.get('items')[id];
  }

  getItemOrThrow(id: string): BaseItem {
    const item = this.getItem(id);
    if (item == null) {
      throw new Error(`Item with id ${id} not found`);
    }
    return item;
  }

  itemExistsOrThrow(id: string): void {
    if (!configurationStore.has(`items.${id}`)) {
      throw new Error(`Item with id ${id} not found`);
    }
  }

  reorderItem(id: string, order?: number): void {
    this.itemExistsOrThrow(id);
    configurationStore.set(`items.${id}.order`, order);
  }

  setColor(id: string, color?: string) {
    this.itemExistsOrThrow(id);
    configurationStore.set(`items.${id}.color`, color);
  }

  /**
   * Folder operations
   */

  createFolder(folder: Omit<Folder, 'id' | 'type'>): Folder {
    const id = this.generateId();
    const newFolder: Folder = {
      ...folder,
      type: 'folder',
      id,
    };
    configurationStore.set(`items.${id}`, newFolder);
    return newFolder;
  }

  updateFolder(id: string, folder: Omit<Folder, 'id' | 'type'>): Folder {
    const target = this.getItemOrThrow(id);
    if (!isFolder(target)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    configurationStore.set(`items.${id}`, folder);
    return { ...folder, type: 'folder', id };
  }

  deleteFolder(id: string): void {
    const target = this.getItemOrThrow(id);
    if (!isFolder(target)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    const children = this.getFolderChildren(id);
    children.forEach((child) => {
      if (isFolder(child)) {
        this.deleteFolder(child.id);
      } else {
        this.deleteApplication(child.id);
      }
    });
    configurationStore.delete(`items.${id}` as any);
  }

  getFolderChildren(id: string): HierarchicalItem[] {
    const folder = this.getItemOrThrow(id);
    if (!isFolder(folder)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    return Object.values(configurationStore.get('items')).filter(
      (item) => (isFolder(item) || isApplication(item)) && item.parentFolderId === id
    );
  }

  moveFolder(id: string, newParentFolderId: string): Folder {
    const target = this.getItemOrThrow(id);
    if (!isFolder(target)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    const newParentFolder = this.getItemOrThrow(newParentFolderId);
    if (!isFolder(newParentFolder)) {
      throw new Error(`Item with id ${newParentFolderId} is not a folder`);
    }
    configurationStore.set(`items.${id}.parentFolderId`, newParentFolderId);
    return { ...target, parentFolderId: newParentFolderId };
  }

  /**
   * Application operations
   */

  createApplication(application: Omit<Application, 'id' | 'type'>): Application {
    const id = this.generateId();
    const newApplication: Application = {
      ...application,
      type: 'application',
      id,
    };
    configurationStore.set(`items.${id}`, newApplication);
    return newApplication;
  }

  updateApplication(id: string, application: Omit<Application, 'id' | 'type'>): Application {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    configurationStore.set(`items.${id}`, application);
    return { ...application, type: 'application', id };
  }

  deleteApplication(id: string): void {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    const instances = this.getApplicationInstances(id);
    instances.forEach((instance) => this.deleteInstance(instance.id));
    configurationStore.delete(`items.${id}` as any);
  }

  moveApplication(id: string, parentFolderId: string): Application {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    const newParentFolder = this.getItemOrThrow(parentFolderId);
    if (!isFolder(newParentFolder)) {
      throw new Error(`Item with id ${parentFolderId} is not a folder`);
    }
    configurationStore.set(`items.${id}.parentFolderId`, parentFolderId);
    return { ...target, parentFolderId };
  }

  getApplicationInstances(id: string): Instance[] {
    const application = this.getItemOrThrow(id);
    if (!isApplication(application)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    return Object.values(configurationStore.get('items')).filter(
      (item) => isInstance(item) && item.parentApplicationId === id
    ) as Instance[];
  }

  /**
   * Instance operations
   */

  getInstances(): Instance[] {
    return Object.values(configurationStore.get('items')).filter(isInstance);
  }

  createInstance(instance: Omit<Instance, 'id' | 'type'>): Instance {
    const id = this.generateId();
    const newInstance: Instance = {
      ...instance,
      type: 'instance',
      id,
    };
    configurationStore.set(`items.${id}`, newInstance);
    return newInstance;
  }

  updateInstance(id: string, instance: Omit<Instance, 'id' | 'type'>): Instance {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    configurationStore.set(`items.${id}`, instance);
    return { ...instance, type: 'instance', id };
  }

  deleteInstance(id: string): void {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    configurationStore.delete(`items.${id}` as any);
  }

  moveInstance(id: string, newParentApplicationId: string): Instance {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    const application = this.getItemOrThrow(newParentApplicationId);
    if (!isApplication(application)) {
      throw new Error(`Item with id ${newParentApplicationId} is not an application`);
    }
    configurationStore.set(`items.${id}.parentApplicationId`, newParentApplicationId);
    return { ...target, parentApplicationId: newParentApplicationId };
  }

  /**
   * Misc
   */

  private generateId(): string {
    let id = uuidv4();
    while (configurationStore.has(`items.${id}`)) {
      id = uuidv4();
    }
    return id;
  }
}

export const configurationService = new ConfigurationService();
