export type ApplicationType = 'SpringBoot';

export interface Item {
  uuid: string;
  type: 'folder' | 'application' | 'instance';
}

export interface HierarchicalItem extends Item {
  parentUuid?: string;
}

export interface OrderedItem extends Item {
  order?: number;
}

export interface Instance extends OrderedItem {
  type: 'instance';
  uuid: string;
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

export function isApplication(item: Item): item is Application {
  return item.type === 'application';
}

export function isFolder(item: Item): item is Folder {
  return item.type === 'folder';
}

export function isInstance(item: Item): item is Instance {
  return item.type === 'instance';
}
