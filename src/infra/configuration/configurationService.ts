import { v4 as uuidv4 } from 'uuid';
import {
  Application,
  BaseItem,
  Configuration,
  Folder,
  HierarchicalItem,
  Instance,
  InstanceHealthStatus,
  EnrichedInstance,
  isApplication,
  isFolder,
  isInstance,
  EnrichedApplication,
  EnrichedFolder,
} from './model/configuration';
import { configurationStore } from './configurationStore';

class ConfigurationService {
  /**
   * Generic operations
   */
  getConfiguration(): Configuration {
    return configurationStore.store;
  }

  getItem<T extends BaseItem>(id: string): BaseItem | undefined {
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

  getFolderChildren(id: string): HierarchicalItem[] {
    const folder = this.getItemOrThrow(id);
    if (!isFolder(folder)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    return Object.values(configurationStore.get('items'))
      .filter((item) => (isFolder(item) || isApplication(item)) && item.parentFolderId === id)
      .map((item) => {
        if (isFolder(item)) {
          return this.enrichFolder(item);
        }
        if (isApplication(item)) {
          return this.enrichApplication(item);
        }
        return item;
      });
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

  getInstancesForDataCollection(): Instance[] {
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

  private enrichInstance(instance: Instance): EnrichedInstance {
    const effectiveColor = this.getInstanceEffectiveColor(instance);
    const healthStatus: InstanceHealthStatus = 'UP';
    return {
      ...instance,
      effectiveColor,
      healthStatus,
    };
  }

  private enrichApplication(application: Application): EnrichedApplication {
    const effectiveColor = this.getHierarchicalItemEffectiveColor(application);
    return {
      ...application,
      effectiveColor,
    };
  }

  private enrichFolder(folder: Folder): EnrichedFolder {
    const effectiveColor = this.getHierarchicalItemEffectiveColor(folder);
    return {
      ...folder,
      effectiveColor,
    };
  }

  private getInstanceEffectiveColor(instance: Instance): string | undefined {
    return (
      instance.color ??
      this.getHierarchicalItemEffectiveColor(<Application>this.getItemOrThrow(instance.parentApplicationId))
    );
  }

  private getHierarchicalItemEffectiveColor(item: HierarchicalItem): string | undefined {
    if (!item.parentFolderId) {
      return item.color;
    }
    return item.color ?? this.getHierarchicalItemEffectiveColor(<Folder>this.getItemOrThrow(item.parentFolderId));
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
