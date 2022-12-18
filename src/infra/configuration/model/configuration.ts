export type ApplicationType = 'SpringBoot';

type Item = Instance | Application | Folder;
export interface BaseItem {
  uuid: string;
  type: 'folder' | 'application' | 'instance';
}

export interface HierarchicalItem extends BaseItem {
  parentUuid?: string;
}

export interface OrderedItem extends BaseItem {
  order?: number;
}

export interface Instance extends OrderedItem {
  type: 'instance';
  applicationUuid: string;
  alias: string;
  actuatorUrl: string;
}

export interface Application extends HierarchicalItem, OrderedItem {
  type: 'application';
  applicationType: ApplicationType;
  alias: string;
  description?: string;
  icon?: string;
}

export interface Folder extends HierarchicalItem, OrderedItem {
  type: 'folder';
  alias: string;
  description?: string;
  icon?: string;
}

export interface Configuration {
  items: { [key: string]: Item };
}

export function isApplication(item: BaseItem): item is Application {
  return item.type === 'application';
}

export function isFolder(item: BaseItem): item is Folder {
  return item.type === 'folder';
}

export function isInstance(item: BaseItem): item is Instance {
  return item.type === 'instance';
}
