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
  InstanceMetadata,
  isApplication,
  isFolder,
  isInstance,
} from './model/configuration';
import { configurationStore } from './configurationStore';
import { instanceService } from '../instance/instanceService';
import { instanceMetadataStore } from './instanceMetadataStore';
import { systemEvents } from '../events';

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
    return <Folder>this.getItem(id);
  }

  updateFolder(id: string, folder: Omit<Folder, 'id' | 'type'>): EnrichedFolder {
    const target = this.getItemOrThrow(id);
    if (!isFolder(target)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    configurationStore.set(`items.${id}`, folder);
    return <Folder>this.getItem(id);
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
    return this.getItems().filter(
      (item) => (isFolder(item) || isApplication(item)) && item.parentFolderId === id
    ) as Exclude<EnrichedItem, EnrichedInstance>[];
  }

  moveFolder(id: string, newParentFolderId: string | undefined, newOrder: number): EnrichedFolder {
    const target = this.getItemOrThrow(id);
    if (!isFolder(target)) {
      throw new Error(`Item with id ${id} is not a folder`);
    }
    if (newParentFolderId) {
      const parent = this.getItemOrThrow(newParentFolderId);
      if (!isFolder(parent)) {
        throw new Error(`Item with id ${newParentFolderId} is not a folder`);
      }
      configurationStore.set(`items.${id}.parentFolderId`, newParentFolderId);
    } else {
      configurationStore.delete(`items.${id}.parentFolderId` as any);
    }
    configurationStore.set(`items.${id}.order`, newOrder);
    return <Folder>this.getItem(id);
  }

  /**
   * Application operations
   */

  getApplicationOrThrow(id: string): EnrichedApplication {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    return target;
  }

  createApplication(application: Omit<Application, 'id' | 'type'>): EnrichedApplication {
    const id = this.generateId();
    const newApplication: Application = {
      ...application,
      type: 'application',
      id,
    };
    configurationStore.set(`items.${id}`, newApplication);
    return <EnrichedApplication>this.getItem(id);
  }

  updateApplication(id: string, application: Omit<Application, 'id' | 'type'>): EnrichedApplication {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    configurationStore.set(`items.${id}`, application);
    systemEvents.emit('application-updated', <EnrichedApplication>this.getItem(id));
    return <EnrichedApplication>this.getItem(id);
  }

  deleteApplication(id: string): void {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    const instances = this.getApplicationInstances(id);
    instances.forEach((instance) => this.deleteInstance(instance.id));
    configurationStore.delete(`items.${id}` as any);
    systemEvents.emit('application-deleted', target);
  }

  moveApplication(id: string, newParentFolderId: string | undefined, newOrder: number): EnrichedApplication {
    const target = this.getItemOrThrow(id);
    if (!isApplication(target)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    if (newParentFolderId) {
      const newParentFolder = this.getItemOrThrow(newParentFolderId);
      if (!isFolder(newParentFolder)) {
        throw new Error(`Item with id ${newParentFolderId} is not a folder`);
      }
      configurationStore.set(`items.${id}.parentFolderId`, newParentFolderId);
    } else {
      configurationStore.delete(`items.${id}.parentFolderId` as any);
    }
    configurationStore.set(`items.${id}.order`, newOrder);
    systemEvents.emit(
      'application-moved',
      <EnrichedApplication>this.getItem(id),
      target.parentFolderId,
      newParentFolderId
    );
    return <EnrichedApplication>this.getItem(id);
  }

  getApplicationInstances(id: string): EnrichedInstance[] {
    const application = this.getItemOrThrow(id);
    if (!isApplication(application)) {
      throw new Error(`Item with id ${id} is not an application`);
    }
    return <EnrichedInstance[]>this.getItems().filter((item) => isInstance(item) && item.parentApplicationId === id);
  }

  /**
   * Instance operations
   */

  getInstances(): EnrichedInstance[] {
    return <EnrichedInstance[]>this.getItems().filter(isInstance);
  }

  getInstanceOrThrow(id: string): EnrichedInstance {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    return target;
  }

  createInstance(instance: Omit<Instance, 'id' | 'type'>): EnrichedInstance {
    const id = this.generateId();
    const newInstance: Instance = {
      ...instance,
      type: 'instance',
      id,
    };
    configurationStore.set(`items.${id}`, newInstance);
    systemEvents.emit('instance-created', newInstance);
    return <EnrichedInstance>this.getItem(id);
  }

  updateInstance(id: string, instance: Omit<Instance, 'id' | 'type'>): EnrichedInstance {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    configurationStore.set(`items.${id}`, instance);
    systemEvents.emit('instance-updated', this.getInstanceOrThrow(id));
    return this.getInstanceOrThrow(id);
  }

  deleteInstance(id: string): void {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }
    systemEvents.emit('instance-deleted', target);
    configurationStore.delete(`items.${id}` as any);
  }

  moveInstance(id: string, newParentApplicationId: string, newOrder: number): EnrichedInstance {
    const target = this.getItemOrThrow(id);
    if (!isInstance(target)) {
      throw new Error(`Item with id ${id} is not an instance`);
    }

    const newParentApplication = this.getItemOrThrow(newParentApplicationId);
    if (!isApplication(newParentApplication)) {
      throw new Error(`Item with id ${newParentApplicationId} is not an application`);
    }
    configurationStore.set(`items.${id}.parentApplicationId`, newParentApplicationId);
    configurationStore.set(`items.${id}.order`, newOrder);
    systemEvents.emit(
      'instance-moved',
      this.getInstanceOrThrow(id),
      target.parentApplicationId,
      newParentApplicationId
    );
    return <EnrichedInstance>this.getItem(id);
  }

  /**
   * Misc
   */

  getInstanceMetadata(instance: Instance): InstanceMetadata {
    let metadata = instanceMetadataStore.get(instance.id);
    if (!metadata) {
      metadata = {};
      instanceMetadataStore.set(instance.id, metadata);
    }
    return metadata;
  }

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
    const health = instanceService.getCachedInstanceHealth(instance);
    const endpoints = instanceService.getCachedInstanceEndpoints(instance);
    return {
      ...instance,
      effectiveColor,
      health,
      endpoints,
    };
  }

  private enrichApplication(application: Application): EnrichedApplication {
    const effectiveColor = this.getApplicationEffectiveColor(application);
    return {
      ...application,
      health: instanceService.getCachedApplicationHealth(application),
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
