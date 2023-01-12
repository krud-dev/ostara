import { MUIconType } from 'renderer/components/icon/IconViewer';

export type Entity<EntityItem> = {
  columns: EntityColumn[];
  actions: EntityAction[];
  massActions: EntityAction[];
  globalActions: EntityAction[];
  defaultOrder: {
    id: string;
    direction: 'asc' | 'desc';
  };
  paging: boolean;
  getId: (item: EntityItem) => string;
  getGrouping?: (item: EntityItem) => string;
  filterData: (data: EntityItem[], filter: string) => EntityItem[];
};

export type EntityBaseColumn = {
  id: string;
  align?: 'left' | 'right' | 'center';
  labelId: string;
  width?: number;
  minWidth?: number;
  tooltipId?: string;
};

export type EntityTextColumn = EntityBaseColumn & {
  readonly type: 'Text';
};

export type EntityCronColumn = EntityBaseColumn & {
  readonly type: 'Cron';
};

export type EntityDateColumn = EntityBaseColumn & {
  readonly type: 'Date';
};

export type EntityColumn = EntityTextColumn | EntityCronColumn | EntityDateColumn;

export type EntityAction = {
  id: string;
  labelId: string;
  icon: MUIconType;
};
