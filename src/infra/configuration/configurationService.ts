import { v4 as uuidv4 } from 'uuid';
import {
  Application,
  Configuration,
  Folder,
  HierarchicalItem,
  Instance,
  isApplication,
  isFolder,
  isInstance,
  Item,
} from './model/configuration';
import { configurationStore } from './configurationStore';
import configuration from '../../../.erb/configs/webpack.config.base';

export class ConfigurationService {
  /**
   * Generic operations
   */
  static getConfiguration(): Configuration {
    return configurationStore.store;
  }

  static getItem(uuid: string): Item | undefined {
    return configurationStore.get('items')[uuid];
  }

  static getItemOrThrow(uuid: string): Item {
    const item = this.getItem(uuid);
    if (item == null) {
      throw new Error(`Item with uuid ${uuid} not found`);
    }
    return item;
  }

  static itemExistsOrThrow(uuid: string): void {
    if (!configurationStore.has(`items.${uuid}`)) {
      throw new Error(`Item with uuid ${uuid} not found`);
    }
  }

  static reorderItem(uuid: string, order?: number): void {
    this.itemExistsOrThrow(uuid);
    configurationStore.set(`items.${uuid}.order`, order);
  }

  /**
   * Folder operations
   */

  static createFolder(folder: Omit<Folder, 'uuid' | 'type'>): Folder {
    const uuid = this.generateUuid();
    const newFolder: Folder = {
      ...folder,
      type: 'folder',
      uuid,
    };
    configurationStore.set(`items.${uuid}`, newFolder);
    return newFolder;
  }

  static updateFolder(
    uuid: string,
    folder: Omit<Folder, 'uuid' | 'type'>
  ): Folder {
    const target = this.getItemOrThrow(uuid);
    if (!isFolder(target)) {
      throw new Error(`Item with UUID ${uuid} is not a folder`);
    }
    configurationStore.set(`items.${uuid}`, folder);
    return { ...folder, type: 'folder', uuid };
  }

  static deleteFolder(uuid: string): void {
    const target = this.getItemOrThrow(uuid);
    if (!isFolder(target)) {
      throw new Error(`Item with UUID ${uuid} is not a folder`);
    }
    const children = this.getFolderChildren(uuid);
    children.forEach((child) => {
      if (isFolder(child)) {
        this.deleteFolder(child.uuid);
      } else {
        this.deleteApplication(child.uuid);
      }
    });
    configurationStore.delete(`items.${uuid}` as any);
  }

  static getFolderChildren(uuid: string): HierarchicalItem[] {
    const folder = this.getItemOrThrow(uuid);
    if (!isFolder(folder)) {
      throw new Error(`Item with UUID ${uuid} is not a folder`);
    }
    return Object.values(configurationStore.get('items')).filter(
      (item) =>
        (isFolder(item) || isApplication(item)) && item.parentUuid === uuid
    );
  }

  static moveFolder(uuid: string, parentUuid?: string): Folder {
    const target = this.getItemOrThrow(uuid);
    if (!isFolder(target)) {
      throw new Error(`Item with UUID ${uuid} is not a folder`);
    }
    if (parentUuid) {
      const folder = this.getItemOrThrow(parentUuid);
      if (!isFolder(folder)) {
        throw new Error(`Item with UUID ${parentUuid} is not a folder`);
      }
    }
    configurationStore.set(`items.${uuid}.parentUuid`, parentUuid);
    return { ...target, parentUuid };
  }

  /**
   * Application operations
   */

  static createApplication(
    application: Omit<Application, 'uuid' | 'type'>
  ): Application {
    const uuid = this.generateUuid();
    const newApplication: Application = {
      ...application,
      type: 'application',
      uuid,
    };
    configurationStore.set(`items.${uuid}`, newApplication);
    return newApplication;
  }

  static updateApplication(
    uuid: string,
    application: Omit<Application, 'uuid' | 'type'>
  ): Application {
    const target = this.getItemOrThrow(uuid);
    if (!isApplication(target)) {
      throw new Error(`Item with UUID ${uuid} is not an application`);
    }
    configurationStore.set(`items.${uuid}`, application);
    return { ...application, type: 'application', uuid };
  }

  static deleteApplication(uuid: string): void {
    const target = this.getItemOrThrow(uuid);
    if (!isApplication(target)) {
      throw new Error(`Item with UUID ${uuid} is not an application`);
    }
    const instances = this.getApplicationInstances(uuid);
    instances.forEach((instance) => this.deleteInstance(instance.uuid));
    configurationStore.delete(`items.${uuid}` as any);
  }

  static moveApplication(uuid: string, parentUuid?: string): Application {
    const target = this.getItemOrThrow(uuid);
    if (!isApplication(target)) {
      throw new Error(`Item with UUID ${uuid} is not an application`);
    }
    if (parentUuid) {
      const folder = this.getItemOrThrow(parentUuid);
      if (!isFolder(folder)) {
        throw new Error(`Item with UUID ${parentUuid} is not a folder`);
      }
    }
    configurationStore.set(`items.${uuid}.parentUuid`, parentUuid);
    return { ...target, parentUuid };
  }

  static getApplicationInstances(uuid: string): Instance[] {
    const application = this.getItemOrThrow(uuid);
    if (!isApplication(application)) {
      throw new Error(`Item with UUID ${uuid} is not an application`);
    }
    return Object.values(configurationStore.get('items')).filter(
      (item) => isInstance(item) && item.applicationUuid === uuid
    ) as Instance[];
  }

  /**
   * Instance operations
   */

  static createInstance(instance: Omit<Instance, 'uuid' | 'type'>): Instance {
    const uuid = this.generateUuid();
    const newInstance: Instance = {
      ...instance,
      type: 'instance',
      uuid,
    };
    configurationStore.set(`items.${uuid}`, newInstance);
    return newInstance;
  }

  static updateInstance(
    uuid: string,
    instance: Omit<Instance, 'uuid' | 'type'>
  ): Instance {
    const target = this.getItemOrThrow(uuid);
    if (!isInstance(target)) {
      throw new Error(`Item with UUID ${uuid} is not an instance`);
    }
    configurationStore.set(`items.${uuid}`, instance);
    return { ...instance, type: 'instance', uuid };
  }

  static deleteInstance(uuid: string): void {
    const target = this.getItemOrThrow(uuid);
    if (!isInstance(target)) {
      throw new Error(`Item with UUID ${uuid} is not an instance`);
    }
    configurationStore.delete(`items.${uuid}` as any);
  }

  static moveInstance(uuid: string, newApplicationUuid: string): Instance {
    const target = this.getItemOrThrow(uuid);
    if (!isInstance(target)) {
      throw new Error(`Item with UUID ${uuid} is not an instance`);
    }
    const application = this.getItemOrThrow(newApplicationUuid);
    if (!isApplication(application)) {
      throw new Error(
        `Item with UUID ${newApplicationUuid} is not an application`
      );
    }
    configurationStore.set(`items.${uuid}.applicationUuid`, newApplicationUuid);
    return { ...target, applicationUuid: newApplicationUuid };
  }

  /**
   * Misc
   */

  private static generateUuid(): string {
    let uuid = uuidv4();
    while (configurationStore.has(`items.${uuid}`)) {
      uuid = uuidv4();
    }
    return uuid;
  }
}
