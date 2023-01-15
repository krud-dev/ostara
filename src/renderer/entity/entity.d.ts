import { MUIconType } from 'renderer/components/icon/IconViewer';
import { ComponentType } from 'react';

export type Entity<EntityItem> = {
  columns: EntityColumn<EntityItem>[];
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

export type EntityBaseColumn<EntityItem> = {
  id: string;
  align?: 'left' | 'right' | 'center';
  labelId: string;
  width?: number;
  minWidth?: number;
  getTooltip?: (item: EntityItem) => string | undefined;
};

export type EntityTextColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Text';
};

export type EntityCronColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Cron';
};

export type EntityDateColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Date';
};

export type EntityCustomColumn<EntityItem> = EntityBaseColumn<EntityItem> & {
  readonly type: 'Custom';
  Component: ComponentType<{ column: EntityBaseColumn<EntityItem>; row: EntityItem }>;
};

export type EntityColumn<EntityItem> =
  | EntityTextColumn<EntityItem>
  | EntityCronColumn<EntityItem>
  | EntityDateColumn<EntityItem>
  | EntityCustomColumn<EntityItem>;

export type EntityAction = {
  id: string;
  labelId: string;
  icon: MUIconType;
};
