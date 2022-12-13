import { v4 as uuidv4 } from 'uuid';
import { Configuration, Folder } from './model/configuration';
import { configurationStore } from './configurationStore';

class ConfigurationService {
  static getConfiguration(): Configuration {
    return configurationStore.store;
  }

  static getFolder(path: string): Folder {
    const folder = configurationStore.get(`folders.${path}`);
    if (!folder) {
      throw new Error(`Folder ${path} does not exist`);
    }
    return <Folder>folder;
  }

  static exists(path: string): boolean {
    return configurationStore.has(`folders.${path}`);
  }

  static createFolder(path: string, folder: Omit<Folder, 'uuid'>): Folder {
    const uuid = this.generateUuid();
    const newFolder = { ...folder, uuid };
    configurationStore.set(`folders.${path}.${uuid}`, newFolder);
    return newFolder;
  }

  static moveFolder(path: string, newPath: string, newOrder: number): void {
    const folder = this.getFolder(path);
    if (folder) {
      configurationStore.delete(`folders.${path}` as any);
      folder.order = newOrder;
      configurationStore.set(`folders.${newPath}`, folder);
    }
  }

  static deleteFolder(path: string): void {
    configurationStore.delete(`folders.${path}` as any);
  }

  private static generateUuid(): string {
    return uuidv4();
  }
}

export const configurationService = new ConfigurationService();
