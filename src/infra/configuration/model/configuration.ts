import { InstanceHealth } from '../../instance/InstanceHealthService';

export type ApplicationType = 'SpringBoot';

export type Item = Instance | Application | Folder;

export type EnrichedItem = EnrichedInstance | EnrichedApplication | EnrichedFolder;

export type ItemType = 'instance' | 'application' | 'folder';

export type InstanceHealthStatus = 'UP' | 'DOWN' | 'UNKNOWN' | 'OUT_OF_SERVICE' | 'UNREACHABLE' | 'PENDING';

export type DataCollectionMode = 'on' | 'off';

export type InstanceDataCollectionMode = DataCollectionMode | 'inherited';

export type BaseItem = {
  readonly id: string;
  readonly type: ItemType;
  color?: string;
  icon?: string;
  order?: number;
};

export type Instance = BaseItem & {
  readonly type: 'instance';
  parentApplicationId: string;
  alias: string;
  actuatorUrl: string;
  dataCollectionMode: InstanceDataCollectionMode;
};

export type EnrichedInstance = Instance & {
  readonly effectiveColor?: string;
  readonly effectiveDataCollectionMode: DataCollectionMode;
  readonly health: InstanceHealth;
};

export type Application = BaseItem & {
  readonly type: 'application';
  parentFolderId?: string;
  applicationType: ApplicationType;
  alias: string;
  description?: string;
  icon?: string;
  dataCollectionMode: DataCollectionMode;
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
