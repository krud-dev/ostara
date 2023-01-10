export type ApplicationType = 'SpringBoot';

export type Item = Instance | Application | Folder;

export type EnrichedItem = EnrichedInstance | EnrichedApplication | EnrichedFolder;

export type ItemType = 'instance' | 'application' | 'folder';

export type InstanceHealthStatus = 'UP' | 'DOWN' | 'UNKNOWN' | 'OUT_OF_SERVICE' | 'UNREACHABLE' | 'PENDING' | 'INVALID';

export type ApplicationHealthStatus = 'ALL_UP' | 'ALL_DOWN' | 'SOME_DOWN' | 'UNKNOWN' | 'PENDING';

export type DataCollectionMode = 'on' | 'off';

export type InstanceDataCollectionMode = DataCollectionMode | 'inherited';

export type InstanceMetadata = {};

export type InstanceHealth = {
  readonly status: InstanceHealthStatus;
  readonly statusText?: string;
  readonly lastUpdateTime: number;
  readonly lastStatusChangeTime: number;
};

export type ApplicationHealth = {
  status: ApplicationHealthStatus;
  lastUpdateTime: number;
  lastStatusChangeTime: number;
};

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
  dataCollectionIntervalSeconds: number;
};

export type EnrichedInstance = Instance & {
  readonly effectiveColor?: string;
  readonly health: InstanceHealth;
  readonly endpoints: string[];
};

export type Application = BaseItem & {
  readonly type: 'application';
  parentFolderId?: string;
  applicationType: ApplicationType;
  alias: string;
  description?: string;
};

export type EnrichedApplication = Application & {
  readonly effectiveColor?: string;
  readonly health: ApplicationHealth;
};

export type Folder = BaseItem & {
  readonly type: 'folder';
  parentFolderId?: string;
  alias: string;
  description?: string;
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
