import { v4 as uuidv4 } from 'uuid';
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
  isApplication,
  isFolder,
  isInstance,
} from './model/configuration';
import { configurationStore } from './configurationStore';
import { instanceHealthService } from '../instance/InstanceHealthService';

class ConfigurationService {
  /**
   * Generic operations
   */
  getConfiguration(): Configuration {
    return configurationStore.store;
  }

  getItems(): EnrichedItem[] {
    return Object.values(configurationStore.get('items')).map((item) => this.enrichItem(item));
  }

  getItem(id: string): EnrichedItem | undefined {
    const item = configurationStore.get('items')[id];
    if (!item) {
      return undefined;
    }
    return this.enrichItem(item);
  }

  getItemOrThrow(id: string): EnrichedItem {
    const item = this.getItem(id);
    if (!item) {
      throw new Error(`Item with ID ${id} not found`);
    }
    return item;
  }

  itemExistsOrThrow(id: string): void {
    if (!configurationStore.has(`items.${id}`)) {
      throw new Error(`Item with id ${id} not found`);
    }
  }

  setColor(id: string, color?: string) {
    this.itemExistsOrThrow(id);
    if (!color) {
      configurationStore.delete(`items.${id}.color` as any);
    } else {
      configurationStore.set(`items.${id}.color`, color);
    }
  }

  /**
   * Folder operations
   */

  createFolder(folder: Omit<Folder, 'id' | 'type'>): EnrichedFolder {
    const id = this.generateId();
    const newFolder: Folder = {
      ...folder,
      type: 'folder',
      id,
    };
    configurationStore.set(`items.${id}`, newFolder);
    return this.enrichFolder(<Folder>this.getItem(id));
  }

  updateFolder(id: string, folder: Omit<Folder, 'id' | 'type'>): EnrichedFolder {
    const target = this.getItemOrThrow(id);
    if (!isFolder(target)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    configurationStore.set(`items.${id}`, folder);
    return this.enrichFolder(<Folder>this.getItem(id));
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

  getFolderChildren(id: string): Exclude<EnrichedItem, EnrichedInstance>[] {
    const folder = this.getItemOrThrow(id);
    if (!isFolder(folder)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    return Object.values(configurationStore.get('items'))
      .filter((item) => (isFolder(item) || isApplication(item)) && item.parentFolderId === id)
      .map((item) => this.enrichItem(item)) as Exclude<EnrichedItem, EnrichedInstance>[];
  }

  moveFolder(id: string, newParentFolderId: string, newOrder: number): EnrichedFolder {
    const target = this.getItemOrThrow(id);
    if (!isFolder(target)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    const newParentFolder = this.getItemOrThrow(newParentFolderId);
    if (!isFolder(newParentFolder)) {
      throw new Error(`Item with id ${newParentFolderId} is not a folder`);
    }
    configurationStore.set(`items.${id}.parentFolderId`, newParentFolderId);
    configurationStore.set(`items.${id}.order`, newOrder);
    return this.enrichFolder(<Folder>this.getItem(id));
  }

  /**
   * Application operations
   */

  createApplication(application: Omit<Application, 'id' | 'type'>): EnrichedApplication {
    const id = this.generateId();
    const newApplication: Application = {
      ...application,
      type: 'application',
      id,
    };
    configurationStore.set(`items.${id}`, newApplication);
    return this.enrichApplication(<Application>this.getItem(id));
  }

  updateApplication(id: string, application: Omit<Application, 'id' | 'type'>): EnrichedApplication {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    configurationStore.set(`items.${id}`, application);
    return this.enrichApplication(<Application>this.getItem(id));
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

  moveApplication(id: string, parentFolderId: string, newOrder: number): EnrichedApplication {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    const newParentFolder = this.getItemOrThrow(parentFolderId);
    if (!isFolder(newParentFolder)) {
      throw new Error(`Item with id ${parentFolderId} is not a folder`);
    }
    configurationStore.set(`items.${id}.parentFolderId`, parentFolderId);
    configurationStore.set(`items.${id}.order`, newOrder);
    return this.enrichApplication(<Application>this.getItem(id));
  }

  getApplicationInstances(id: string): EnrichedInstance[] {
    const application = this.getItemOrThrow(id);
    if (!isApplication(application)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    return Object.values(configurationStore.get('items'))
      .filter((item) => isInstance(item) && item.parentApplicationId === id)
      .map((item) => this.enrichInstance(<Instance>item));
  }

  /**
   * Instance operations
   */

  getInstances(): EnrichedInstance[] {
    return Object.values(configurationStore.get('items'))
      .filter(isInstance)
      .map((instance) => this.enrichInstance(instance));
  }

  getInstancesForDataCollection(): EnrichedInstance[] {
    return this.getInstances().filter((instance) => {
      const { dataCollectionMode } = instance;
      switch (dataCollectionMode) {
        case 'inherited': {
          const application = this.getItem(instance.parentApplicationId);
          if (application == null || !isApplication(application)) {
            return false;
          }
          return application.dataCollectionMode === 'on';
        }
        case 'on': {
          return true;
        }
        default:
          return false;
      }
    });
  }

  createInstance(instance: Omit<Instance, 'id' | 'type'>): EnrichedInstance {
    const id = this.generateId();
    const newInstance: Instance = {
      ...instance,
      type: 'instance',
      id,
    };
    configurationStore.set(`items.${id}`, newInstance);
    return this.enrichInstance(this.getItem(id) as Instance);
  }

  updateInstance(id: string, instance: Omit<Instance, 'id' | 'type'>): EnrichedInstance {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    configurationStore.set(`items.${id}`, instance);
    instanceHealthService.invalidateInstance(id);
    return this.enrichInstance(this.getItem(id) as Instance);
  }

  deleteInstance(id: string): void {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    configurationStore.delete(`items.${id}` as any);
  }

  moveInstance(id: string, newParentApplicationId: string, newOrder: number): EnrichedInstance {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    const application = this.getItemOrThrow(newParentApplicationId);
    if (!isApplication(application)) {
      throw new Error(`Item with id ${newParentApplicationId} is not an application`);
    }
    configurationStore.set(`items.${id}.parentApplicationId`, newParentApplicationId);
    configurationStore.set(`items.${id}.order`, newOrder);
    return this.enrichInstance(this.getItem(id) as Instance);
  }

  /**
   * Misc
   */

  private enrichItem(item: BaseItem): EnrichedItem {
    if (isFolder(item)) {
      return this.enrichFolder(item);
    }
    if (isApplication(item)) {
      return this.enrichApplication(item);
    }
    if (isInstance(item)) {
      return this.enrichInstance(item);
    }
    throw new Error(`Unknown item type ${item.type}`);
  }

  private enrichInstance(instance: Instance): EnrichedInstance {
    const effectiveColor = this.getInstanceEffectiveColor(instance);
    const health = instanceHealthService.getCachedInstanceHealth(instance);
    return {
      ...instance,
      effectiveColor,
      health,
    };
  }

  private enrichApplication(application: Application): EnrichedApplication {
    const effectiveColor = this.getApplicationEffectiveColor(application);
    return {
      ...application,
      effectiveColor,
    };
  }

  private enrichFolder(folder: Folder): EnrichedFolder {
    const effectiveColor = this.getFolderEffectiveColor(folder);
    return {
      ...folder,
      effectiveColor,
    };
  }

  private getInstanceEffectiveColor(instance: Instance): string | undefined {
    return (
      instance.color ??
      this.getApplicationEffectiveColor(<Application>this.getItemOrThrow(instance.parentApplicationId))
    );
  }

  private getApplicationEffectiveColor(application: Application): string | undefined {
    if (!application.parentFolderId) {
      return application.color;
    }
    return (
      application.color ?? this.getFolderEffectiveColor(<EnrichedFolder>this.getItemOrThrow(application.parentFolderId))
    );
  }

  private getFolderEffectiveColor(folder: Folder): string | undefined {
    if (!folder.parentFolderId) {
      return folder.color;
    }
    return folder.color ?? this.getFolderEffectiveColor(<EnrichedFolder>this.getItemOrThrow(folder.parentFolderId));
  }

  private generateId(): string {
    let id = uuidv4();
    while (configurationStore.has(`items.${id}`)) {
      id = uuidv4();
    }
    return id;
  }
}

export const configurationService = new ConfigurationService();
