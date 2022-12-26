export type ApplicationType = 'SpringBoot';

export type Item = Instance | Application | Folder;

export type EnrichedItem = EnrichedInstance | EnrichedApplication | EnrichedFolder;

export type ItemType = 'instance' | 'application' | 'folder';

export type InstanceHealthStatus = 'UP' | 'DOWN' | 'UNKNOWN' | 'OUT_OF_SERVICE';

export type BaseItem = {
  readonly id: string;
  readonly type: ItemType;
  color?: string;
  order?: number;
};

export type Instance = BaseItem & {
  readonly type: 'instance';
  parentApplicationId: string;
  alias: string;
  actuatorUrl: string;
  dataCollectionMode: 'inherited' | 'on' | 'off';
};

export type EnrichedInstance = Instance & {
  readonly effectiveColor?: string;
  readonly healthStatus: InstanceHealthStatus;
};

export type Application = BaseItem & {
  readonly type: 'application';
  parentFolderId?: string;
  applicationType: ApplicationType;
  alias: string;
  description?: string;
  icon?: string;
  dataCollectionMode: 'on' | 'off';
};

export type EnrichedApplication = Application & {
  readonly effectiveColor?: string;
};

export type Folder = BaseItem & {
  readonly type: 'folder';
  parentFolderId?: string;
  alias: string;
  description?: string;
  icon?: string;
};

export type EnrichedFolder = Folder & {
  readonly effectiveColor?: string;
};

export type Configuration = {
  items: { [key: string]: Item };
};

export function isApplication(item: Omit<BaseItem, 'id'>): item is Application {
  return item.type === 'application';
}

export function isFolder(item: Omit<BaseItem, 'id'>): item is Folder {
  return item.type === 'folder';
}

export function isInstance(item: Omit<BaseItem, 'id'>): item is Instance {
  return item.type === 'instance';
}
