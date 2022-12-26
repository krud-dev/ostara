export type ApplicationType = 'SpringBoot';

export type Item = Instance | Application | Folder;

export type ItemType = 'instance' | 'application' | 'folder';

export type InstanceHealthStatus = 'UP' | 'DOWN' | 'UNKNOWN' | 'OUT_OF_SERVICE';

export type BaseItem = {
  id: string;
  type: ItemType;
  color?: string;
};

export type HierarchicalItem = BaseItem & {
  parentFolderId?: string;
};

export type OrderedItem = BaseItem & {
  order?: number;
};

export type Instance = OrderedItem & {
  type: 'instance';
  parentApplicationId: string;
  alias: string;
  actuatorUrl: string;
  dataCollectionMode: 'inherited' | 'on' | 'off';
};

export type EnrichedInstance = Instance & {
  effectiveColor?: string;
  healthStatus: InstanceHealthStatus;
};

export type Application = HierarchicalItem &
  OrderedItem & {
    type: 'application';
    applicationType: ApplicationType;
    alias: string;
    description?: string;
    icon?: string;
    dataCollectionMode: 'on' | 'off';
  };

export type EnrichedApplication = Application & {
  effectiveColor?: string;
};

export type Folder = HierarchicalItem &
  OrderedItem & {
    type: 'folder';
    alias: string;
    description?: string;
    icon?: string;
  };

export type EnrichedFolder = Folder & {
  effectiveColor?: string;
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
